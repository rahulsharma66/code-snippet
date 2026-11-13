import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSnippets = async () => {
      if (user) {
        try {
          const res = await api.get("/snippets/" + user._id);
          setSnippets(res.data);
        } catch (err) {
          console.log("Error fetching projects:", err);
        }
      }
      setLoading(false);
    };
    fetchSnippets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete("/snippets/" + id);
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getPreviewHtml = (files) => {
    if (!files || files.length === 0)
      return "<div style='color:#555;text-align:center;padding-top:40px;font-family:sans-serif'>Empty Project</div>";
    let htmlFile = files.find((f) => f.name === "index.html") || files.find((f) => f.name.endsWith(".html"));
    if (!htmlFile)
      return "<div style='color:#555;text-align:center;padding-top:40px;font-family:sans-serif'>No HTML Found</div>";
    let html = htmlFile.value;
    const cssFiles = files.filter((f) => f.language === "css");
    cssFiles.forEach((css) => {
      const linkRegex = new RegExp(`<link[^>]+href=['"]${css.name}['"][^>]*>`, "g");
      if (html.match(linkRegex)) html = html.replace(linkRegex, `<style>${css.value}</style>`);
    });
    return html;
  };

  // ── LANDING PAGE ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0d0d14", color: "white", fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "60px", borderBottom: "1px solid #1e1e2e", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)", backgroundColor: "rgba(13,13,20,0.85)" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#007acc", letterSpacing: "-0.3px" }}>⚡ CodeStash</span>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/login">
              <button style={{ padding: "8px 20px", fontSize: "14px", backgroundColor: "transparent", color: "#ccc", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button style={{ padding: "8px 20px", fontSize: "14px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                Get started
              </button>
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <header style={{ minHeight: "520px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,122,204,0.18) 0%, transparent 70%), linear-gradient(180deg, #13131f 0%, #0d0d14 100%)", textAlign: "center", padding: "80px 20px 60px" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", backgroundColor: "rgba(0,122,204,0.12)", border: "1px solid rgba(0,122,204,0.3)", borderRadius: "20px", fontSize: "12px", color: "#007acc", marginBottom: "24px", letterSpacing: "0.5px", fontWeight: "600", textTransform: "uppercase" }}>
            Online Code Editor
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: "800", marginBottom: "18px", lineHeight: "1.1", letterSpacing: "-1px", background: "linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Write code.<br />See it live.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#8892a4", maxWidth: "520px", marginBottom: "40px", lineHeight: "1.7" }}>
            Build, preview, and save HTML, CSS & JS projects in a full VS Code-style editor — right in your browser.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/register">
              <button style={{ padding: "13px 32px", fontSize: "16px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", boxShadow: "0 0 30px rgba(0,122,204,0.35)", letterSpacing: "0.2px" }}>
                Start for free
              </button>
            </Link>
            <Link to="/login">
              <button style={{ padding: "13px 32px", fontSize: "16px", backgroundColor: "rgba(255,255,255,0.05)", color: "#ccc", border: "1px solid #2a2a3e", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                Log in
              </button>
            </Link>
          </div>
        </header>

        {/* FEATURES */}
        <section style={{ padding: "80px 20px", maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "12px", fontSize: "1.8rem", fontWeight: "700", color: "#fff" }}>Everything you need</h2>
          <p style={{ textAlign: "center", color: "#667", marginBottom: "56px", fontSize: "15px" }}>No setup. No installs. Just open and code.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🗂️", title: "Multi-file projects", desc: "Organize HTML, CSS, and JS files in a real file explorer just like VS Code." },
              { icon: "⚡", title: "Live preview", desc: "See your output update in real-time as you type. No manual refresh needed." },
              { icon: "🖥️", title: "Built-in console", desc: "Catch errors and debug with the embedded console panel." },
              { icon: "📦", title: "Download as ZIP", desc: "Export your project as a ZIP file to keep working locally." },
              { icon: "🎨", title: "Code formatting", desc: "One-click Prettier-style formatting keeps your code clean." },
              { icon: "☁️", title: "Cloud saves", desc: "Your projects are saved to your account and accessible anywhere." },
            ].map((f) => (
              <div key={f.title} style={{ backgroundColor: "#13131f", padding: "28px", borderRadius: "12px", border: "1px solid #1e1e30" }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ color: "#fff", margin: "0 0 8px", fontSize: "16px", fontWeight: "600" }}>{f.title}</h3>
                <p style={{ color: "#667788", margin: 0, lineHeight: "1.6", fontSize: "14px" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "60px 20px 80px", borderTop: "1px solid #1e1e2e" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "50px", color: "#fff" }}>How it works</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0" }}>
              {[
                { n: "1", title: "Create a project", desc: "Hit New Project and your editor is ready — HTML, CSS, and JS files included.", color: "#007acc" },
                { n: "2", title: "Write your code", desc: "Full Monaco editor with syntax highlighting, auto-complete, and formatting.", color: "#e6a23c" },
                { n: "3", title: "Preview instantly", desc: "Click Run to see your project live. The console shows any errors in real time.", color: "#28a745" },
              ].map((step, i) => (
                <div key={step.n} style={{ flex: "1", minWidth: "200px", padding: "0 24px", position: "relative" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.3)", border: `2px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "18px", fontWeight: "800", color: step.color }}>{step.n}</div>
                  <h3 style={{ color: "#fff", marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>{step.title}</h3>
                  <p style={{ color: "#667788", lineHeight: "1.6", fontSize: "14px" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: "60px 20px", borderTop: "1px solid #1e1e2e", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#fff", marginBottom: "14px" }}>Ready to build something?</h2>
          <p style={{ color: "#8892a4", marginBottom: "32px", fontSize: "15px" }}>Free to use. No credit card required.</p>
          <Link to="/register">
            <button style={{ padding: "14px 36px", fontSize: "16px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", boxShadow: "0 0 30px rgba(0,122,204,0.3)" }}>
              Create your account
            </button>
          </Link>
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: "center", padding: "30px 40px", color: "#3a3a4e", fontSize: "13px", borderTop: "1px solid #1e1e2e" }}>
          © 2025 CodeStash. All rights reserved.
        </footer>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  const filtered = snippets.filter((s) => (s.title || "Untitled").toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0d0d14", color: "#e0e0e0", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px", height: "60px", backgroundColor: "#13131f", borderBottom: "1px solid #1e1e30", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: "18px", fontWeight: "700", color: "#007acc" }}>⚡ CodeStash</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#667788", fontSize: "14px" }}>
            Welcome, <strong style={{ color: "#ccc" }}>{user.username}</strong>
          </span>
          <button onClick={handleLogout} style={{ padding: "7px 16px", backgroundColor: "transparent", color: "#ff6b6b", border: "1px solid #3a2020", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            Log out
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>

        {/* HEADER ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: "#fff" }}>My Projects</h1>
            <p style={{ margin: 0, color: "#667788", fontSize: "14px" }}>{snippets.length} project{snippets.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/create">
            <button style={{ padding: "10px 20px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span> New Project
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <div style={{ position: "relative", marginBottom: "36px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 40px", backgroundColor: "#13131f", border: "1px solid #1e1e30", borderRadius: "8px", fontSize: "14px", color: "white", outline: "none" }}
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#445" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            <p>Loading your projects…</p>
          </div>
        )}

        {/* GRID */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {filtered.map((s) => (
              <div
                key={s._id}
                style={{ backgroundColor: "#13131f", border: "1px solid #1e1e30", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a4060"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e30"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* PREVIEW THUMBNAIL */}
                <div style={{ height: "150px", backgroundColor: "#fff", position: "relative", overflow: "hidden", borderBottom: "1px solid #1e1e30" }}>
                  <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
                  <iframe
                    srcDoc={getPreviewHtml(s.files)}
                    title="preview"
                    style={{ width: "200%", height: "200%", border: "none", transform: "scale(0.5)", transformOrigin: "0 0" }}
                    scrolling="no"
                  />
                </div>

                {/* CARD BODY */}
                <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "600", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.title || "Untitled"}
                  </h3>
                  <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#445566" }}>
                    {s.files ? s.files.length : 0} files · {new Date(s.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                  <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                    <Link to={`/edit/${s._id}`} style={{ flex: 1, textDecoration: "none" }}>
                      <button style={{ width: "100%", padding: "8px", backgroundColor: "#0e639c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                        Open
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(s._id)}
                      title="Delete project"
                      style={{ padding: "8px 12px", backgroundColor: "transparent", color: "#ff6b6b", border: "1px solid #2a1a1a", borderRadius: "5px", cursor: "pointer", fontSize: "15px" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,107,107,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && snippets.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#445566" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>📂</div>
            <h3 style={{ color: "#667788", fontWeight: "600", marginBottom: "8px" }}>No projects yet</h3>
            <p style={{ marginBottom: "28px", fontSize: "14px" }}>Create your first project to get started.</p>
            <Link to="/create">
              <button style={{ padding: "10px 24px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>+ New Project</button>
            </Link>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && snippets.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#445566" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p>No projects match "<strong style={{ color: "#ccc" }}>{query}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
}