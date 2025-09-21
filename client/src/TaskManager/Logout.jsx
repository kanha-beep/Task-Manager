import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("tokens");
    return navigate("/tasks");
  }, [navigate]);
  return <div>Logout</div>;
}
