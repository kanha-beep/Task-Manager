import api from "../init/api.js"
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState(location.state?.msg || "");
  const [alert] = useState(location.state?.alert || "danger");
  const [data, setData] = useState({ username: "", password: "", email: "" });
  // const [dataSubmit, setDataSubmit] = useState(null)
  //   const token = localStorage.getItem("tokens");
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      console.log("sending", data);
      const res = await api.post(
        "/tasks/auth/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("data recd from axios", res.data);
      console.log("token recd after login", res.data.token);
      localStorage.setItem("tokens", res.data.token);
      navigate("/", {
        state: {
          msg: "user logged in",
          alert: "success",
        },
      });
      console.log(alertMsg);
      setData({ username: "", password: "", email: "" });
    } catch (error) {
      // const errors = error.config;
      // console.log("url", errors.url);
      // console.log("method", errors.method);
      // console.log("headers", errors.headers);
      // console.log("data", errors.data.message);
      // console.log("error for login in front", error.response);
      // setMsg(error.response.data.message);
      if (error.response?.status === 401) {
        setAlertMsg(error.response.data.message);
        return;
      }
      console.log("not registered", error.response.data.message);
      return navigate("/tasks/auth/signup", {
        state: {
          msg: "User not logged in, 1st register",
          alert: "danger",
        },
      });
    }
  };
  return (
    <>
      <div>
        {alertMsg && (
          <div className={`alert alert-${alert}`} role="alert">
            {alertMsg}
          </div>
        )}
        {/* {msg && (
          <div className={`alert alert-success`} role="alert">
            {msg}
          </div>
        )} */}
        <div className="main-contact" style={{ marginTop: "4rem" }}>
          <h1> Log In</h1>
        </div>
        <div className="form">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={data.username}
              placeholder="username"
              onChange={handleChange}
              name="username"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />

            <input
              type="email"
              value={data.email}
              placeholder="email"
              onChange={handleChange}
              name="email"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />
            <input
              type="password"
              value={data.password}
              placeholder="password"
              onChange={handleChange}
              name="password"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />

            <button style={{ padding: "0.5rem", borderRadius: "5px" }}>
              {" "}
              Login{" "}
            </button>
            {/* <button className="btn" onClick={()=>navigate("http://localhost:3000/api/tasks/auth/google")}> Sign in with Google </button> */}
            <a href="http://localhost:3000/tasks/auth/google">
              Sign in with Google
            </a>
          </form>
        </div>
        {/* {data.name} */}
        {/* {dataSubmit && <h3> hello mr {data.name}. Your query is {data.desc}</h3> } */}
      </div>
    </>
  );
}
