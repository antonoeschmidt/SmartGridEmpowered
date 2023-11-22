import "./App.css";
import EthereumContext, {
    useEthereumContext,
} from "./contexts/ethereumContext";
import ToastContext, { useToastContext } from "./contexts/toastContext";
import RoutesApp from "./Routes";

const App = () => {
    const ethereumContextValue = useEthereumContext();
    const toastContextValue = useToastContext();

    return (
        <EthereumContext.Provider value={ethereumContextValue}>
            <ToastContext.Provider value={toastContextValue}>
                <RoutesApp />
            </ToastContext.Provider>
        </EthereumContext.Provider>
    );
};

export default App;
