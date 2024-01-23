import { useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import ToastContext from "../../../contexts/toastContext";

const ManageMarketsComponent = () => {
    const { user, setUser, deployMarket, setMarkets } =
     useContext(EthereumContext);

    const [newMarketCreated, setNewMarketCreated] = useState(false);

    const { setToastProps, onOpen } = useContext(ToastContext);

    const newMarket = async () => {
        if (!user.accountAddress) {
            alert("No account or DSO selected");
            return;
        }
        const marketAddress = await deployMarket();
        console.log("New market created:", marketAddress);
        setToastProps("Created market!", "success");
        onOpen();
        setMarkets((prevState) => [...prevState, marketAddress]);
        setUser(prev => ({...prev, market: marketAddress}));

        setNewMarketCreated(true);
    };

    return (
        <>
            <Button
                disabled={!user.accountAddress}
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
