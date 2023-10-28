import NavBar from "./Component/NavBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./Pages/Home";
import Tree from "./Pages/Tree";

function App() {

  return (
    <div>
        <Router>
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/tree' element={<Tree />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
