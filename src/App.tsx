import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/Auth.tsx";
import Home from "./pages/home/Home.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Product from "./pages/product/Product";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/product" element={<Product />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/rendom" element={<div>hello</div>} />
          <Route path="/*" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
