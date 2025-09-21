// import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllTasks from "./TaskManager/AllTasks.jsx";
import EditTasks from "./TaskManager/EditTasks.jsx";
import NewTasks from "./TaskManager/NewTasks.jsx";
import Tasks from "./TaskManager/Tasks.jsx";
import Auth from "./TaskManager/Auth.jsx";
import Navbar from "./TaskManager/Navbar.jsx"
function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<AllTasks />} />
        <Route path="/tasks" element={<AllTasks />} />
        <Route path="/tasks/:TasksId/edit" element={<EditTasks />} />
        <Route path="/tasks/new" element={<NewTasks />} />
        <Route path="/tasks/:TasksId" element={<Tasks />} />
        <Route path="/Auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
