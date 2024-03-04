import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Outlet } from "react-router-dom";
import 'regenerator-runtime/runtime'

function App() {

  return (
    <>
    <Navbar/>
    <Outlet></Outlet>
    <Footer/>
    </>
  )
}

export default App
