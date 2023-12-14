from flask import Flask, request
from pygroupsig import signature, grpkey, constants, groupsig, memkey
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback
app = Flask(__name__)
CORS(app)

load_dotenv()
app.config['API_KEY'] = os.getenv("API_KEY", "default")

## maps a key to a user id.
users = []
code = constants.BBS04_CODE
ps16 = groupsig.setup(code)
group_public_key = ps16['grpkey']
master_group_key = ps16['mgrkey']
gml = ps16['gml']
        
## open returns 0 if it can't find the user, or if you use an old signature
msg1 = groupsig.join_mgr(0, master_group_key, group_public_key, gml=gml)
msg2 = groupsig.join_mem(1, group_public_key, msgin=msg1)
## we keep the first index empty.
users.append({})
        
## open for all
@app.route('/verify', methods=["POST"])
def verify_signature():
    body = request.get_json()
    signature_str = body.get("signature")
    message = body.get("message")
    if not signature_str or not message:
        return "Missing a parameter", 400
    try:
        signature_object = signature.signature_import(code, signature_str)
    except Exception as e:
        return {"Valid": False}, 401
    is_ok = groupsig.verify(signature_object, message, group_public_key)
    return {"Valid": is_ok}, 200 if is_ok else 401

## open for all
@app.route('/sign', methods=["POST"])
def sign():
    body = request.get_json()
    message = body.get("message")
    key_str = body.get("key")
    if not message or not key_str:
        return "An argument is empty", 400
    user_key = memkey.memkey_import(code, key_str)
    ## should probably throw an exception if this doesn't work.
    # signature_object = groupsig.sign(b"hello world", user_key, group_public_key)
    signature_object = groupsig.sign(message, user_key, group_public_key)
    signature_as_string = signature.signature_export(signature_object)
    return {"signature": signature_as_string}, 200


@app.route("/open", methods=["POST"])
def open():
        api_key = request.headers.get('x-api-key')
        if not api_key or api_key != app.config['API_KEY']:
            return "Unauthroized", 401

        body = request.get_json()
        signature_str = body.get("signature")
        if not signature_str:
            return "No signature", 400
        try:
            ## the signature object fails if the signature is malformed
            signature_object = signature.signature_import(code, signature_str)
            ## Apparently you can create a signature that parses the signature import, but is malformed when you pass it to open.
            ## In that case it fails silently, with no error and nothing to catch.
            ## A solution could be to make sure the container comes back, and then we save info in a sql.
            ## OR we just ignore it, and never show this in the thesis.
            gs_open = groupsig.open(signature_object, master_group_key, group_public_key, gml = gml)
           
        except Exception as e:
            return {"error": str(e)}, 400
        ## the index is the key index when it was added.
        index = gs_open["index"]
        if index == 0:
            return "No active user matches this signature", 400

        return {"owner": users[index]['name']}, 200


## Should only be callable by the dso, or maybe we do something where we validate a token,
## and then the DSO generate a token and the user calls this endpoint, probably best.
@app.route("/add-member/<name>", methods=["POST"])
def add_member(name):
    api_key = request.headers.get('x-api-key')
    if not api_key or api_key != app.config['API_KEY']:
        return "Unauthroized", 401
    
    try:
        if not name:
            return "No name", 400
        msg1 = groupsig.join_mgr(0, master_group_key, group_public_key, gml=gml)
        msg2 = groupsig.join_mem(1, group_public_key, msgin=msg1)
        user_key = msg2['memkey']
        index =  str(len(users))
        ## we don't need to remember the key, it's saved in the groupsig state.
        user = {"name": name, "index": index}
        users.append(user)
        key = memkey.memkey_export(user_key)
        return {"userId": index, "key": key}, 200
        
    except Exception as e:
        traceback(str(e))
        return "Something went terribly terribly wrong"

@app.route("/group-key")
def get_group_key():
    group_public_key_str = grpkey.grpkey_export(group_public_key)
    return group_public_key_str, 200

# if __name__ == "__main__":
app.run(debug=True)
    