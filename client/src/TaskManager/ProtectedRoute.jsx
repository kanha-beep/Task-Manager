import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("tokens");
    console.log("ProtectedRoute token:", token);
    if(!token){
        return <Navigate to="/website"/>
    }
  return <Outlet/>
}
