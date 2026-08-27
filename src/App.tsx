import { useState } from "react";
import Home from "./pages/Home";
import Guardix from "./pages/Guardix";

function App() {
    const [logado, setLogado] = useState(
        !!localStorage.getItem("guardix_token")
    );

    const handleLogout = () => {
        localStorage.removeItem("guardix_token");
        localStorage.removeItem("guardix_user");
        setLogado(false);
    };

    return logado ? (
        <Guardix onLogout={handleLogout} />
    ) : (
        <Home onLoginSuccess={() => setLogado(true)} />
    );
}

export default App;