import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const details = localStorage.getItem("user");
  return details ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
