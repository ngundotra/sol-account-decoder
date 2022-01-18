import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "./components";

import { AccountInfoHexViewer } from "./pages";
import { DecodeAnchor } from "./pages/DecodeAnchor";
import { DecoderSelector } from "./pages";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="_bp3-dark">
      <Router>
        <NavBar toggle={toggle} />
        <Routes>
          <Route path={"/"} element={<DecoderSelector />} />
          <Route
            path="/raw/:accountPubkey"
            element={<AccountInfoHexViewer />}
          />
          <Route path="/anchor/:accountPubkey" element={<DecodeAnchor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
