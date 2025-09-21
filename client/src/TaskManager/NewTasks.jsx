import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../init/api.js";

export default function NewTasks() {
  const [priorityLevel, setPriorityLevel] = useState("");
  const token = localStorage.getItem("tokens");
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({
    name: "",
    dueDate: "",
    desc: "",
    owner: "",
    priority: priorityLevel,
  });
  const handleChange = (e) => {
    setTasks((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  //new tasks
  const handleNewTasks = async (e) => {
    e.preventDefault();
    // console.log("data for tasks is ready to send to axios", tasks);
    try {
      const res = await api.post("/tasks/new", tasks, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data recd from axios backend", res.data);
      navigate("/tasks");
    } catch (e) {
      if (e.response.status === 400) return console.log(e.response.data);
      // const errors = error.config;
      // console.log("url", errors.url);
      // console.log("method", errors.method);
      // console.log("headers", errors.headers);
      // console.log("data", errors.data);
    }
  };
  return (
    <>
      <div style={{ position: "relative", top: "4rem" }}>
        {" "}
        New Tasks
        <form onSubmit={handleNewTasks}>
          <input
            type="text"
            value={tasks.name}
            placeholder="name"
            onChange={handleChange}
            name="name"
            style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
          />
          <input
            type="text"
            value={tasks.desc}
            placeholder="desc"
            onChange={handleChange}
            name="desc"
            style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
          />
          <input
            type="text"
            value={tasks.owner}
            placeholder="owner"
            onChange={handleChange}
            name="owner"
            style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
          />
          <input
            type="date"
            value={tasks.dueDate}
            placeholder="date"
            onChange={handleChange}
            name="dueDate"
            style={{ padding: "0.5rem", borderRadius: "5px", margin: "1rem" }}
          />
          <p> Priority {priorityLevel}</p>
          <p>
            Tasks {tasks.name},{tasks.priority},{tasks.dueDate}
          </p>
          <select
            value={priorityLevel}
            onChange={(e) => {
              const val = e.target.value;
              setPriorityLevel(val);
              setTasks((p) => ({ ...p, priority: val }));
            }}
          >
            <option> Select Priority </option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button style={{ padding: "0.5rem", borderRadius: "5px" }}>
            {" "}
            Submit{" "}
          </button>
          <button
            onClick={() => navigate("/tasks")}
            style={{
              cursor: "pointer",
              backgroundColor: "blue",
              padding: "0.5rem",
              color: "white",
              margin: "1rem",
              borderRadius: "10px",
            }}
          >
            <p> Go Back Home</p>
          </button>
        </form>
      </div>
    </>
  );
}
