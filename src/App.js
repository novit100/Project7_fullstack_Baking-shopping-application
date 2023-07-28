import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import MyCart from "./pages/MyCart";
import Recipies from "./pages/Recipies";
import "./App.css";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users/:userId/MyCart" element={<MyCart />} />
          <Route path="/Recipies" element={<Recipies />} />
        </Routes>
      </div>
    </>
    /**
    <BrowserRouter>
    <Routes className='navbar'>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/home" element={<Home/>} />
    <Route path="/products" element={<Products/>} />
    <Route path="/users/:userId/myCart" element={<MyCart/>} />
    </Routes>
  </BrowserRouter> */
  );
}

export default App;
