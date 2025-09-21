import api from "../init/api.js";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import "./AllTasks.css";
export default function AllTasks() {
  const token = localStorage.getItem("tokens");
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [alertMsg, setAlertMsg] = useState(location?.state?.msg || "");
  const [alert, setAlert] = useState(location?.state?.alert || "danger");
  const [searchTasks, setSearchTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [pager, setPager] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [countPage, setCountPage] = useState(1);
  // const [dueDate, setDueDate] = useState("")
  // filter button
  // const filteredTasks = tasks
  //   // .filter((task) => {
  //   //   if (filter === "done") return task.completed;
  //   //   if (filter === "pending") return !task.completed;
  //   //   if (filter === "practice") return !task.check;
  //   //   return true;
  //   // })
  //   .filter((t) => {
  //     return t.name
  //       .toString()
  //       .toLowerCase()
  //       .includes(appliedSearch.toString().toLowerCase());
  //   });
  //sorted tasks
  // const sortedTasks = filteredTasks.sort((a, b) => {
  //   if (sort === "title") return a.name.localeCompare(b.name);
  //   if (sort === "date") return b.id - a.id;
  //   return 0;
  // });
  //handle search
  const handleSearch = () => {
    setPager(pager); // start from first page
    setAppliedSearch(search);
    getTasks(); // fetch tasks from backend with search query
    tasks.filter((t) => {
      return t.name
        .toString()
        .toLowerCase()
        .includes(appliedSearch.toString().toLowerCase());
    });
  };
  //alert message
  useEffect(() => {
    if (location.state?.msg) {
      setAlertMsg(location.state.msg);
      setAlert(location.state.alert || "danger");
      // Clear the state from history so reload won't show alert again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  // all tasks
  const getTasks = async () => {
    try {
      const res = await api.get(
        `/tasks?pager=${pager}&sort=${sort}&search=${appliedSearch}&filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountPage(res.data.pager);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPagesPerPage);
      console.log("all tasks to render", res.data.tasks);
    } catch (error) {
      // const errors = error.config;
      // console.log("url", errors.url);
      // console.log("method", errors.method);
      // console.log("headers", errors.headers);
      setAlertMsg(error.response?.data?.message);
      console.log("error:", error.response.data);
    }
  };
  //all tasks
  useEffect(() => {
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pager, filter, totalPages, countPage, appliedSearch, sort]);
  //delete
  const handleDelete = async (i) => {
    try {
      const res = await api.delete(`/tasks/${i}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("task to delete", res.data);
      setSearchTasks(searchTasks.filter((t) => t._id !== i));
      setTasks(tasks.filter((task) => task._id !== i));
    } catch (e) {
      console.log("delete error", e.response.data.message);
      setAlertMsg(e.response.data.message);
    }
  };
  //done
  const handleDone = async (i) => {
    const task = tasks.find((t) => t._id === i);
    const res = await api.patch(`/tasks/${i}`, {
      completed: !task.completed,
    });
    console.log("sending req.body");
    //below is object of single task
    console.log("task to mark as complete", res.data);
    setTasks((p) =>
      p.map((task) =>
        task._id === i ? { ...task, completed: res.data.completed } : task
      )
    );
    setSearchTasks((p) =>
      p.map((task) =>
        task._id === i ? { ...task, completed: res.data.completed } : task
      )
    );
  };
  //practice check
  const handlePractice = async (i) => {
    try {
      const task = tasks.find((t) => t._id === i);
      const res = await api.patch(`/tasks/${i}`, {
        check: !task.check,
      });
      setTasks((p) =>
        p.map((t) => (t._id === i ? { ...t, check: res.data.check } : t))
      );
    } catch (e) {
      console.log("error frontend", e.res);
    }
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p
            style={{
              fontSize: "3rem",
              backgroundColor: "lightcoral",
              padding: "0.5rem",
              // margin: "0.5rem",
            }}
          >
            Task Manager
          </p>{" "}
        </div>
        <hr />
        {alertMsg && alertMsg !== "" && (
          <>
            <div
              className={`alert alert-${alert} alert-dismissible fade show d-flex justify-content-center`}
              role="alert"
            >
              <p>{alertMsg}</p>
            </div>
          </>
        )}
        {/* //search input */}
        <div className="search" style={{ display: "flex" }}>
          {/* <p>{filterSearch}</p> */}
          <input
            type="text"
            className="form-control w-50"
            placeholder="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            style={{ backgroundColor: "aqua" }}
            className="p-2 rounded-3 ms-3"
          >
            search
          </button>
        </div>
        {/* //create */}
        <div
          style={{
            backgroundColor: "yellow",
            width: "14%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="p-2 rounded-4 mt-2"
        >
          <Link to="/tasks/new" style={{ textDecoration: "none" }}>
            <p>Create Tasks </p>
          </Link>
        </div>
        <button
          disabled={filter === "all"}
          onClick={() => {
            setFilter("all");
          }}
          className="btn btn-primary mx-1 my-1"
        >
          {" "}
          All tasks{" "}
        </button>
        <button
          disabled={filter === "done"}
          onClick={() => {
            setFilter("done");
          }}
          className="btn btn-primary mx-1"
        >
          {" "}
          Done{" "}
        </button>
        <button
          disabled={filter === "pending"}
          onClick={() => {
            setFilter("pending");
          }}
          className="btn btn-primary mx-1"
        >
          {" "}
          Pending
        </button>
        <button
          disabled={filter === "practice"}
          onClick={() => {
            setFilter("practice");
          }}
          className="btn btn-primary mx-1"
        >
          {" "}
          Practice
        </button>
        <button
          disabled={filter === "dueDate"}
          onClick={() => {
            setFilter("dueDate");
          }}
          className="btn btn-primary mx-1"
        >
          {" "}
          DueDate
        </button>

        <div className="pagination">
          <button
            disabled={pager <= 1}
            onClick={() => {
              setPager(pager - 1);
              console.log("prev");
            }}
            className="btn btn-primary mx-1"
          >
            {" "}
            Previous
          </button>
          <button
            disabled={pager >= totalPages}
            onClick={() => {
              setPager(pager + 1);
              console.log("next");
            }}
            className="btn btn-primary mx-1"
          >
            {" "}
            Next
          </button>
          <div className="paginator">
            {countPage} / {totalPages}
          </div>
        </div>

        <div className="options">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title"> Title </option>
            <option value="date"> Date </option>
          </select>
        </div>

        {/* Sorted Tasks */}
        {tasks.length === 0 && <div>No task found</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            marginInline: "5rem",
            padding: "0.5rem",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          {tasks.map((task) => (
            <div key={task._id} className="m-1">
              <div
                className="p-1 mb-2 h-100 border border-dark border-2 mx-2"
                style={{
                  width: "25rem",
                }}
              >
                {/* <h3> This is your task </h3> */}
                <p>
                  {" "}
                  Task Name: <b> {task.name}</b>
                </p>
                <p>
                  Todo: <b>{task.desc}</b>{" "}
                </p>
                <p>
                  Complete By: <b>{task.dueDate} </b>
                </p>
                <p>
                  Practice: <b> {task.owner} </b>
                </p>
                <p>
                  Completed: <b>{task.completed ? "done" : "pending"}</b>{" "}
                </p>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn btn-success mx-2 rounded-4 mt-3"
                >
                  <p> Delete Tasks</p>
                </button>
                <button
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="btn btn-primary mt-3 d-inline-flex justify-content-center align-items-center border border-dark border-2 rounded-4"
                >
                  <p> Details</p>
                </button>

                <button
                  onClick={() => handleDone(task._id)}
                  className="btn btn-success mx-2 mt-3 rounded-4"
                  style={{
                    backgroundColor: task.completed ? "green" : "red",
                    width: "5rem",
                  }}
                >
                  <p> {task.completed ? "Pending" : "Done"} </p>
                </button>
                <input
                  type="checkbox"
                  checked={task.check}
                  onChange={() => handlePractice(task._id)}
                />
              </div>
            </div>
          ))}
        </div>
        {/* ) : } */}
        {/* </div> */}
      </div>
    </>
  );
}

// export function NewTasks() {
//   return <><div>
//     New tasks
//     </div></>;
// }
//handle search with pagination
// const handleSearch = () => {
//   setAppliedSearch(search);
//   const filterSearch = tasks.filter((t) => {
//     return t.name
//       .toString()
//       .toLowerCase()
//       .includes(search.toString().toLowerCase());
//   });
//   if (filterSearch.length === 0) {
//     setAlertMsg("no such tasks");
//   } else {
//     return setSearch("");
//   }
//   console.log(
//     "button clicked search",
//     filterSearch.map((t) => t.name)
//   );
// };
//filtered task
// useEffect(() => {
//   setTasks(sortedTasks);
// }, [pager, filter, totalPages, countPage, appliedSearch]);
