import "./App.css";
import EthereumContext, {
    useEthereumContext,
} from "./contexts/ethereumContext";
import RoleContext, { useRoleContext } from "./contexts/roleContext";
import ToastContext, { useToastContext } from "./contexts/toastContext";
import RoutesApp from "./Routes";

const App = () => {
    const ethereumContextValue = useEthereumContext();
    const toastContextValue = useToastContext();
    const roleContext = useRoleContext();

    return (
        <EthereumContext.Provider value={ethereumContextValue}>
            <ToastContext.Provider value={toastContextValue}>
            <RoleContext.Provider value={roleContext}>            
                <RoutesApp />
                </RoleContext.Provider>
            </ToastContext.Provider>
        </EthereumContext.Provider>
    );
};

export default App;
