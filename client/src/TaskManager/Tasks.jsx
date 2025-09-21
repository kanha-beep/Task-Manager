import api from "../init/api.js"
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AllTasks.css";
export default function Tasks() {
  const token = localStorage.getItem("tokens");
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [image, setImage] = useState("");
  const { id } = useParams();
  //get single task
  const singleTask = async () => {
    const res = await api.get(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("id from params", id);
    setTask(res.data);
  };
  useEffect(() => {
    singleTask();
  }, []);
  //image
  const handleUpload = async () => {
    const formData = new FormData();
    if (image) formData.append("image", image);
    //name exist in file object
    // console.log("image ready to get uploaded", image);
    const res = await api.post(
      `/tasks/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("image recd from axios", res.data.image.filename);
    // console.log("image uploaded", task.image);
    setImage(res.data.image.filename);
  };
  if (!task)
    return (
      <>
        <h3>Not an owner of this task</h3>
        <button className="button" onClick={() => navigate("/tasks")}>
          Go Back Home
        </button>
      </>
    );
  return (
    <div style={{ position: "relative", top: "4rem" }}>
      <div
        style={{
          margin: "1rem",
          border: "2px solid black",
          width: "40rem",
          height: "30rem",
          padding: "0.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="content"
          style={{ backgroundColor: "aqua", flexGrow: "1", padding: "0.5rem" }}
        >
          <p>
            Owner: <b>{task.owner} </b>
          </p>
          <p>
            Task Name: <b>{task.name} </b>
          </p>
          <p>
            Task Description: <b>{task.desc} </b>
          </p>
          <p>
            Complete By: <b>{task.dueDate} </b>
          </p>
          <p>
            Practice Level: <b>{task.level?.name || ""} </b>
          </p>
          <p>
            Boss Id: <b>{task.boss?._id || ""} </b>
          </p>
          <hr style={{ margin: "0.5rem" }} />
          <p>
            {" "}
            Due Date: <b>{task.dueDate}</b>{" "}
          </p>
          <button
            className="button"
            style={{ backgroundColor: "orange" }}
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            {" "}
            Edit Tasks{" "}
          </button>
        </div>

        {/* <p>{task.image} </p> */}

        <div
          className="image"
          style={{ backgroundColor: "yellow", width: "20rem" }}
        >
          <img
            src={`http://localhost:3000/tasksUploads/${
              task.image?.filename || ""
            }`}
            style={{ width: "15rem", padding: "0.5rem" }}
          />
          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ padding: "0.5rem" }}
          />
          <button className="button" onClick={handleUpload}>
            {" "}
            Upload Image
          </button>
        </div>
      </div>
      <button onClick={() => navigate("/tasks")} className="button">
        Go Back Home
      </button>
    </div>
  );
}
