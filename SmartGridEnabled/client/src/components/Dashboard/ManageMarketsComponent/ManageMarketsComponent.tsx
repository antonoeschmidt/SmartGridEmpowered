import { useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const ManageMarketsComponent = () => {
    const { currentAccount, setCurrentMarket, deployMarket } =
        useContext(EthereumContext);

    const [newMarketCreated, setNewMarketCreated] = useState(false);



    const newMarket = async () => {
        if (!currentAccount) {
            alert("No account or cable company selected");
            return;
        }
        let marketAddress = await deployMarket();
        console.log(marketAddress);

        setNewMarketCreated(true);
        setCurrentMarket(marketAddress);
    };


    return (
        <>
            <Button
                disabled={!currentAccount}
                onClick={() => newMarket()}
                text={"New Market"}
            />
            {newMarketCreated && (
                <p className="light-text">New market created!</p>
            )}
        </>
    );
};

export default ManageMarketsComponent;
