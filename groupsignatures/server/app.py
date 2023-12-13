from flask import Flask, request
from pygroupsig import signature, grpkey, constants, groupsig, memkey
import traceback
app = Flask(__name__)

## maps a key to a user id.
users = []
code = constants.BBS04_CODE
ps16 = groupsig.setup(code)
group_public_key = ps16['grpkey']
master_group_key = ps16['mgrkey']
gml = ps16['gml']

@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker!!!</h2>'
        
## open for all
@app.route('/verify', methods=["POST"])
def verify_signature():
    body = request.get_json()
    signature_str = body.get("signature")
    signature_object = signature.signature_import(code, signature_str)
    hash = body.get("message")
    is_ok = groupsig.verify(signature_object, hash, group_public_key)
    if not is_ok:
        return "Not a valid signature", 400
    return "Valid", 200

## open for all
@app.route('/sign', methods=["POST"])
def sign():
    body = request.get_json()
    hash = body.get("message")
    key_str = body.get("key")
    key = grpkey.grpkey_import(code, key_str)
    ## should probably throw an exception if this doesn't work.
    signature_object = groupsig.sign(hash, key, group_public_key)
    signature_as_string = signature.signature_export(signature_object)
    return signature_as_string, 200


@app.route("/open", methods=["POST"])
def open():
    try:
        body = request.get_json()
        signature_str = body.get("signature")
        signature_object = signature.signature_import(code, signature_str)
        gs_open = groupsig.open(signature_object, master_group_key, group_public_key, gml = gml)
        ## the index is the key index when it was added.
        return users[gs_open["index"]]['name'], 200
    except Exception as e:
        traceback(str(e))
        return "Something went terribly terribly wrong"

## Should only be callable by the dso, or maybe we do something where we validate a token,
## and then the DSO generate a token and the user calls this endpoint, probably best.
@app.route("/add-member/<name>", methods=["POST"])
def add_member(name):
    try:
        msg1 = groupsig.join_mgr(0, master_group_key, group_public_key, gml=gml)
        msg2 = groupsig.join_mem(1, group_public_key, msgin=msg1)
        user_key = msg2['memkey']
        index =  str(len(users))
        ## we don't need to remember the key, it's saved in the groupsig state.
        user = {"name": name, "index": index}
        users.append(user)
        key = memkey.memkey_export(user_key)
        return_dict = {"userId": index, "key": key}
        return return_dict, 200
        
    except Exception as e:
        traceback(str(e))
        return "Something went terribly terribly wrong"

@app.route("/group-key")
def get_group_key():
    group_public_key_str = grpkey.grpkey_export(group_public_key)
    return group_public_key_str, 200
# if __name__ == "__main__":
app.run(debug=True)
    