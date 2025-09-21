import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <h2>Navbar</h2>
      <ul style={{display:"flex", justifyContent:"flex-start", listStyle:"none"}}>
        <li>
          <Link to="/auth" style={{textDecoration:"none"}}>Login</Link>
        </li>
        <li className="ms-2">
          <Link to="/auth"  style={{textDecoration:"none"}}>Logout</Link>
        </li>
        <li className="ms-2">
          <Link to="/logout"  style={{textDecoration:"none"}}>Log Out</Link>
        </li>
      </ul>
    </div>
  );
}
