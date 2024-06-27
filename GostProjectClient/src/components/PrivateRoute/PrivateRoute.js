import { Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const PrivateRoute = () => {
  const location = useLocation();
  return localStorage.getItem("isConfirmed") == "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default PrivateRoute;
