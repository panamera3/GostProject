import { Navigate, useLocation, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  return localStorage.getItem("isConfirmed") == "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default PrivateRoute;
