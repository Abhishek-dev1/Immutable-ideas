import React from 'react';
import {HashRouter , Route ,Routes} from 'react-router-dom';
import Primary from './primary'
import Secondary from './secondary'

const App = ()=>{
  return(
    <HashRouter>
    <Routes>
           <Route path="/" exact element={<Primary />} ></Route>
           <Route path="/secondary" exact element={<Secondary />}  ></Route>
    </Routes>
    </HashRouter>
  )
}
export default App;