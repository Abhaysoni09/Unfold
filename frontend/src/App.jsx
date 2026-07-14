import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./component/Home";
import Register from "./component/Register";
import Login from "./component/Login";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Product";

import Adminlayout from "./component/Adminlayout";
import Createproduct from "./Pages/Createproduct";
import Createbrand from "./Pages/Creatbrands";
import Updateproducts from "./Pages/Updateproducts";
import Productview from "./component/Productview";
import Cart from "./component/Cart";
import Address from "./component/Address";
import Checkout from "./component/Checkout";
import Confirmorder from "./component/Confirmorder";
import Profile from "./component/Profile";
import Allorder from "./component/Allorder";
import Allproduct from "./component/Allproduct";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productview/:id" element={<Productview/>}/>
         <Route path="/cart" element={<Cart/>}/>
         <Route path="/address" element={<Address/>}/>
         <Route path="/checkout" element={<Checkout/>}/>
         <Route path="/confirmorder/:id" element={<Confirmorder/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/orders" element={<Allorder/>}/>
          <Route path="/products" element={<Allproduct/>}/>




        <Route path="/seller" element={<Adminlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="updateproduct/:id" element={<Updateproducts/>} />
          <Route path="createproduct" element={<Createproduct/>} />
          <Route path="customers" element={<Customers/>} />
          <Route path="orders" element={<Orders/>} />
          <Route path="brands" element={<Createbrand/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;