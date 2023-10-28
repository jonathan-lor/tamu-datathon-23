import NavBar from "./Component/NavBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./Pages/Home";
import TreeGraph from "./Pages/TreeGraph";

function App() {

  return (
    <div>
        <Router>
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/tree' element={<TreeGraph />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
