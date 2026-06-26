import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/Auth.tsx";
import Home from "./pages/home/Home.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart.tsx";
import Navbar from "./components/Navbar.tsx";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/rendom" element={<div>hello</div>} />
          {/* <Route path="/*" element={<Home />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
