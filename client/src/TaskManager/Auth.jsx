import api from "../init/api.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isPage, setIsPage] = useState(true);
  const url = isPage ? "login" : "signup";
  const [data, setData] = useState({ username: "", password: "", email: "" });
  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  // const [dataSubmit, setDataSubmit] = useState(null)
  // const token = localStorage.getItem("tokens")
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    //login
    if (isPage) {
      try {
        // console.log("data ready for login", data);
        const res = await api.post(`/tasks/auth/${url}`, data);
        //got token
        // console.log("login ", res.data);
        localStorage.setItem("token", res.data.token);
        return navigate("/tasks");
      } catch (e) {
        if (e.response.status === 401) return console.log(e.response.data);
        if (e.response.status === 402) {
          return console.log(e.response.data);
        }
        if (e.response.status === 403) {
          setIsPage(false);
          return console.log(e.response.data);
        }
        if (e.response.status === 404) return console.log(e.response.data);
        if (e.response.status === 405) {
          setIsPage(true);
          return console.log(e.response.data);
        }
      }
      //sign up
    } else
      try {
        console.log("data ready for sign up", data);
        const res = await api.post(`/tasks/auth/${url}`, data);
        console.log("data executed for sign up", res.data);
        setData({ username: "", password: "" });
        // setMsg("User registered Successfully")
        setAlert("success");
        return setIsPage(true);
      } catch (e) {
        if (e.response.status === 401) return console.log(e.response.data);
        if (e.response.status === 402) {
          setIsPage(true);
          return console.log(e.response.data);
        }
        if (e.response.status === 403) return console.log(e.response.data);
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
        <div className="main-contact" style={{ marginTop: "4rem" }}>
          <h1> {isPage ? "Login" : "Sign Up"}</h1>
        </div>
        {isPage ? "true" : "false"}
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsPage(false);
            }}
          >
            Sign Up
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setIsPage(true);
            }}
          >
            Log In
          </button>
        </div>
        <div className="form">
          <form onSubmit={handleSubmitRegistration}>
            <input
              type="text"
              value={data.username}
              placeholder="username"
              onChange={handleChange}
              name="username"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />
            <br />
            <input
              type="email"
              value={data.email}
              placeholder="email"
              onChange={handleChange}
              name="email"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />
            <br />
            <input
              type="password"
              value={data.password}
              placeholder="password"
              onChange={handleChange}
              name="password"
              style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
            />
            <br />
            <button style={{ padding: "0.5rem", borderRadius: "5px" }}>
              {isPage ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
        {/* {data.name} */}
        {/* {dataSubmit && <h3> hello mr {data.name}. Your query is {data.desc}</h3> } */}
      </div>
    </>
  );
}
