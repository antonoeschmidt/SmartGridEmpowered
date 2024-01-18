// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

interface IDSO {
    function registerKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) external;

    function isRegisteredKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) external view returns (bool);

    function removeRegisteredKey(address smartMeterPubKey) external;
}

interface ISmartMeter {
    function returnReservedBatteryCharge(
        uint amount,
        address smartMeterInstance
    ) external returns (bool);

    function subtractBatteryCharge(
        uint amount,
        bytes memory ots,
        bytes32 nextOtsHash,
        address smartMeterInstance
    ) external returns (bool);

    function getBatteryCharge() external view returns (uint);
}

contract Market {
    address owner;
    IDSO dso;
    uint maxOfferLivespan = 1000 * 60 * 60 * 24 * 7;
    ISmartMeter smartMeter;
    address dsoAddress;

    struct Offer {
        string id;
        uint price;
        uint amount;
        uint expiration;
        address owner;
        address smartMeterAddress;
        bool active;
        string sellerSignature;
        uint nonce;
    }

    struct PendingConfirmationOffer {
        string buyerSignature;
        string sellerSignature;
        address smartMeterAddress;
        uint amount; // Wh
        uint price; // Euro cents
        uint timestamp; // Unix
        uint nonce;
    }

    mapping(string => Offer) public offers;
    PendingConfirmationOffer[] public pendingConfirmationOffers;

    string[] public offerIds;
    address public lastestSupplyChainAddress;

    // mapping is nonce to the timestamp it was used at.
    mapping(uint => uint) private usedNonces;

    modifier nonceGuard(uint nonce) {
        uint timestamp = usedNonces[nonce];
        // nonce was used within the last two weeks.
        if (timestamp + maxOfferLivespan * 2 > block.timestamp * 1000) {
            revert("Nonce was used recently");
        }
        _;
    }

    constructor(
        address _dsoAddress,
        address _smartMeterContractAddress
    ) payable {
        owner = msg.sender;
        dso = IDSO(_dsoAddress);
        dsoAddress = _dsoAddress;
        smartMeter = ISmartMeter(_smartMeterContractAddress);
    }

    function addOffer(
        string memory id,
        uint amount,
        uint price,
        uint expiration,
        address smartMeterAddress,
        string memory sellerSignature,
        uint nonce,
        address sellerAddress,
        bytes memory ots,
        bytes32 nextOtsHash
    ) public nonceGuard(nonce) returns (bool) {
        // Require conditions
        require(
            dso.isRegisteredKey(msg.sender, smartMeterAddress),
            "Smart Meter not registered by DSO"
        );
        require(
            block.timestamp * 1000 + maxOfferLivespan > expiration,
            "Offers lifespan is too long"
        );
        require(sellerAddress == msg.sender, "Only owner can add offer");

        require(
            smartMeter.subtractBatteryCharge(
                amount,
                ots,
                nextOtsHash,
                smartMeterAddress
            ),
            "Not enough stored energy"
        );

        // Adding offer
        usedNonces[nonce] = block.timestamp * 1000;
        offers[id] = Offer({
            id: id,
            amount: amount,
            price: price,
            expiration: expiration,
            owner: msg.sender,
            smartMeterAddress: smartMeterAddress,
            active: true,
            sellerSignature: sellerSignature,
            nonce: nonce
        });
        offerIds.push(id);

        return true;
    }

    function removeOffer(
        string memory id
    ) public returns (bool) {
        // Initialization
        Offer memory offer = offers[id];

        // Require conditions
        require(msg.sender == offer.owner, "Only owner can remove offer");

        // Removing offer
        smartMeter.returnReservedBatteryCharge(offer.amount, offer.smartMeterAddress);
        delete offers[id];

        return true;
    }

    function buyOffer(string memory id, string memory buyerSignature) public {
        // Initialization
        Offer memory offer = offers[id];

        // Require conditions
        require(
            keccak256(bytes(offer.id)) == keccak256(bytes(id)),
            "No offer found"
        );
        require(offer.expiration > block.timestamp, "Cannot buy expired offer");
        require(msg.sender != offer.owner, "Owner cannot buy own offer");

        // Buying offer and creating SupplyContract

        delete offers[id];

        pendingConfirmationOffers.push(
            PendingConfirmationOffer({
                buyerSignature: buyerSignature,
                sellerSignature: offer.sellerSignature,
                amount: offer.amount,
                price: offer.price,
                timestamp: block.timestamp,
                nonce: offer.nonce,
                smartMeterAddress: offer.smartMeterAddress
            })
        );

        for (uint i = 0; i < offerIds.length; i++) {
            // String comparison to remove purchased offer
            if (keccak256(bytes(offerIds[i])) == keccak256(bytes(id))) {
                offerIds[i] = offerIds[offerIds.length - 1];
                offerIds.pop();
            }
        }
    }

    function getOffer(string memory id) public view returns (Offer memory) {
        return offers[id];
    }

    function getOffers() public view returns (Offer[] memory) {
        Offer[] memory offersReturn = new Offer[](offerIds.length);
        for (uint i = 0; i < offerIds.length; i++) {
            string storage offerId = offerIds[i];
            Offer storage offer = offers[offerId];

            offersReturn[i] = offer;
        }
        return offersReturn;
    }

    function getOfferIDs() public view returns (string[] memory) {
        return offerIds;
    }

    function getPendingOffers()
        public
        view
        returns (PendingConfirmationOffer[] memory)
    {
        return pendingConfirmationOffers;
    }

    event ApproveOffer(
        string buyerSignature,
        string sellerSignature,
        uint amount,
        uint timestamp,
        uint price
    );


    function validatePendingOffers(
        bool[] memory offerIndicies
    ) public {
        require(msg.sender == owner, "sender is not owner");
        for (uint i = 0; i < offerIndicies.length; i++) {
            PendingConfirmationOffer memory offer = pendingConfirmationOffers[
                i
            ];
            //if it's an accepted index we emit our event
            if (offerIndicies[i] == true) {
                emit ApproveOffer(
                    offer.buyerSignature,
                    offer.sellerSignature,
                    offer.amount,
                    offer.timestamp,
                    offer.price
                );
            } else {
                // if not the owner gets their battery back.
                smartMeter.returnReservedBatteryCharge(
                    offer.amount,
                    offer.smartMeterAddress
                );
            }
        }
        // we loop agian to clean up the list
        for (uint i = 0; i < offerIndicies.length; i++) {
            // We move the indicies not yet approved down.
            if (offerIndicies.length < pendingConfirmationOffers.length - i) {
                pendingConfirmationOffers[i] = pendingConfirmationOffers[
                    pendingConfirmationOffers.length - 1 - i
                ];
            }
            // And lastly we pop everytime.
            pendingConfirmationOffers.pop();
        } 
    }
}
