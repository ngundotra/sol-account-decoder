import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

import { AccountInfoHexViewer } from "./pages";
import { DecodeAnchor } from "./pages/DecodeAnchor";
import { DecoderSelector } from "./pages";
import { ThemeContext } from "./themeContext";
import { connectionContext, Network } from "./contexts/connectionContext";
import { Connection } from "@solana/web3.js";

function App() {
  const [isDark, setTheme] = useState(true);
  const [connection, setConnection] = useState<Connection>(
    new Connection("https://api.mainnet-beta.solana.com")
  );
  const [network, setNetwork] = useState<Network>("mainnet");

  const toggleAppTheme = () => {
    setTheme(!isDark);

    // Toggle body class for light/dark theme background styles:
    const body = document.querySelector("body")!;
    if (!isDark) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  };

  return (
    <connectionContext.Provider
      value={{ connection, setConnection, network, setNetwork }}
    >
      <div className={isDark ? "bp3-dark" : ""}>
        <Router>
          <ThemeContext.Provider value={isDark}>
            <NavBar toggleAppTheme={toggleAppTheme} />
            <Routes>
              <Route path={"/"} element={<DecoderSelector />} />
              <Route
                path="/raw/:network/:accountPubkey/"
                element={<AccountInfoHexViewer />}
              />
              <Route
                path="/anchor/:network/:accountPubkey/"
                element={<DecodeAnchor />}
              />
            </Routes>
            <Footer />
          </ThemeContext.Provider>
        </Router>
      </div>
    </connectionContext.Provider>
  );
}

export default App;
