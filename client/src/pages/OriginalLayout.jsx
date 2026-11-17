import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function OriginalLayout({ children }) {
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("adnu-prints-theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("adnu-dark", dark);
    localStorage.setItem("adnu-prints-theme", dark ? "dark" : "light");
    return () => document.body.classList.remove("adnu-dark");
  }, [dark]);

  async function logout(e) {
    e.preventDefault();
    try { await api.post("/auth/logout"); }
    finally { navigate("/login"); }
  }

  return <div className="container-fluid">
    <div className="row">
      <div className="mobile-app-header">
        <div className="mobile-app-brand">
          <img src="/assets/images/ateneo-logo.png" alt="Ateneo Seal"/>
          <span>ADNU-PRINTS</span>
        </div>
        <button className="mobile-menu-toggle"
          aria-label="Open navigation menu"
          onClick={() => setMenu(true)}>☰</button>
      </div>

      {menu && <div className="mobile-menu-overlay"
        onClick={() => setMenu(false)}/>}

      <div className={`col-md-2 sidebar p-4 ${menu ? "mobile-sidebar-open" : ""}`}>
        <button className="mobile-sidebar-close"
          onClick={() => setMenu(false)}>×</button>
        <h2 className="fw-bold mb-5">ADNU-PRINTS</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/submit-request">Submit Request</Link>
        <Link to="/queue">Queue Monitor</Link>
        <Link to="/history">Transaction History</Link>
        <a href="/login" onClick={logout}>Logout</a>
      </div>

      <div className="col-md-10 main">
        <div className="theme-toolbar">
          <button className="theme-button"
            onClick={() => setDark(!dark)}>
            {dark ? "☀ Light Mode" : "☾ Dark Mode"}
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>;
}
