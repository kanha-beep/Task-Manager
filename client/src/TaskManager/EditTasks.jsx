import api from "../init/api.js"
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTasks() {
  const token = localStorage.getItem("tokens");
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({
    name: "",
    dueDate: "",
    desc: "",
    owner: "",
  });
  const handleChange = (e) => {
    setTasks((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  //get task
  const getAllTasks = async () => {
    const res = await api.get(`/tasks/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("details for edit", res.data);
    setTasks(res.data);
  };
  useEffect(() => {
    getAllTasks();
  }, []);
  //edit tasks
  const handleEditTasks = async (e) => {
    e.preventDefault();
    console.log("edit ready to send to axios", tasks);
    try {
      await api.patch(`/tasks/${id}/edit`, tasks, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/tasks/${id}`);
    } catch (error) {
      const errors = error.config;
      console.log("url", errors.url);
      console.log("method", errors.method);
      console.log("headers", errors.headers);
      console.log("data", errors.data);
    }
  };
  return (
    <div>
      <div style={{ position: "relative", top: "4rem" }}>
        Edit
        <form onSubmit={handleEditTasks}>
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
    </div>
  );
}
