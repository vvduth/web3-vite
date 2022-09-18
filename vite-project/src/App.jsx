import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "../dist/output.css";
import { NavBar  } from "./components";
import {Welcome} from "./components"
import {Footer} from "./components";
import {Services} from "./components";
import {Transaction} from "./components";
const App = ( ) =>  {
  const [count, setCount] = useState(0);

  return (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <NavBar/>
      <Welcome /> 
    </div>
    <Services />
    <Transaction /> 
    <Footer /> 
  </div>
  )
}

export default App;
