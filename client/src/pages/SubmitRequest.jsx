import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    copies: 1, pages: 1, paper_size: "A4",
    color_mode: "Black and White",
    print_type: "Single-sided",
    orientation: "Portrait"
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = e => setForm({
    ...form, [e.target.name]: e.target.value
  });
  const cost = Number(form.pages) * Number(form.copies) *
    (form.color_mode === "Colored" ? 5 : 1);

  async function submit(e) {
    e.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("document", file);
      Object.entries(form).forEach(([k,v]) => body.append(k,v));
      const { data } = await api.post("/printing", body);
      setMessage(`Submitted! Queue #${data.queue_number} - PHP ${data.estimated_cost}`);
      setFile(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setMessage(err.response?.data?.error || "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  const field = { display: "grid", gap: 7 };
  const input = { padding: 12, borderRadius: 8, border: "1px solid #bbb",
    width: "100%", boxSizing: "border-box" };

  return <main style={{ minHeight:"100vh", background:"#f1f5f9",
    color:"#14243a", padding:"24px 16px", fontFamily:"Arial, sans-serif" }}>
    <div style={{ maxWidth:680, margin:"auto", background:"white",
      padding:24, borderRadius:16, boxShadow:"0 3px 14px #0001" }}>
      <Link to="/dashboard">Back to Dashboard</Link>
      <h1>Submit Print Request</h1>
      <p>ADNU-PRINTS — Upload your document and choose printing options.</p>
      <form onSubmit={submit} style={{ display:"grid", gap:16 }}>
        <label style={field}>Document (max 10 MB)
          <input type="file" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={e => setFile(e.target.files[0] || null)} />
        </label>
        {["pages","copies"].map(name =>
          <label key={name} style={field}>{name === "pages" ? "Number of Pages" : "Copies"}
            <input style={input} type="number" name={name} required min="1"
              max={name === "pages" ? 1000 : 100}
              value={form[name]} onChange={change}/>
          </label>
        )}
        {[
          ["paper_size",["A4","Letter","Legal"]],
          ["color_mode",["Black and White","Colored"]],
          ["print_type",["Single-sided","Double-sided"]],
          ["orientation",["Portrait","Landscape"]]
        ].map(([name, options]) =>
          <label key={name} style={field}>
            {name.replaceAll("_"," ").toUpperCase()}
            <select style={input} name={name} value={form[name]} onChange={change}>
              {options.map(option => <option key={option}>{option}</option>)}
            </select>
          </label>
        )}
        <h2>Estimated Cost: ₱{cost.toLocaleString()}</h2>
        <button type="submit" disabled={busy || !file}
          style={{ padding:14, border:0, borderRadius:8,
            background:"#124a91", color:"white", cursor:"pointer" }}>
          {busy ? "Submitting..." : "Submit Print Request"}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
    </div>
  </main>;
}
