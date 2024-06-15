import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './Signup'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Login from './Login'
import './Style.css'
import Admin from './Admin'
import Home from './Home'
import Transections from './Transections'
import Test from './Test'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/Admin' element={<Admin />}></Route>
          <Route path='/Home/:key' element={<Home />}></Route>
          <Route path='/Transections/:key/:customerkey' element={<Transections />}></Route>
          <Route path='/test' element={<Test/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App