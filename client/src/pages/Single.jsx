// client/src/pages/Single.jsx
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Single() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [snippet, setSnippet] = useState(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getSnippet = async () => {
      try {
        const res = await api.get("/snippets/find/" + path);
        setSnippet(res.data);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    getSnippet();
  }, [path]);

  const handleCopy = () => {
    const activeFile = snippet?.files?.[activeFileIndex];
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0d0d14", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h2 style={{ color: "#ff6b6b", marginBottom: "8px" }}>Project not found</h2>
        <p style={{ color: "#667788", marginBottom: "28px" }}>This snippet may have been deleted or the link is invalid.</p>
        <Link to="/" style={{ color: "#007acc", textDecoration: "none", fontWeight: "600" }}>← Back to dashboard</Link>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0d0d14", color: "#667788", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        Loading…
      </div>
    );
  }

  const files = snippet.files || [];
  const activeFile = files[activeFileIndex];

  const langLabel = (name = "") => {
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    return "plaintext";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0d0d14", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", height: "60px", backgroundColor: "#13131f", borderBottom: "1px solid #1e1e30", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: "18px", fontWeight: "700", color: "#007acc" }}>⚡ CodeStash</div>
        <Link to="/" style={{ color: "#8892a4", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>← Back to dashboard</Link>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

        {/* TITLE ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "700" }}>{snippet.title || "Untitled"}</h1>
            <p style={{ margin: 0, color: "#667788", fontSize: "13px" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} · Last updated {new Date(snippet.updatedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleCopy}
            style={{ padding: "9px 18px", backgroundColor: copied ? "#28a745" : "#1e1e30", color: copied ? "white" : "#ccc", border: `1px solid ${copied ? "#28a745" : "#2a2a40"}`, borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.2s", flexShrink: 0 }}
          >
            {copied ? "✓ Copied!" : "Copy file"}
          </button>
        </div>

        {/* FILE TABS */}
        {files.length > 1 && (
          <div style={{ display: "flex", gap: "4px", marginBottom: "0", borderBottom: "1px solid #1e1e30", flexWrap: "wrap" }}>
            {files.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setActiveFileIndex(i)}
                style={{ padding: "9px 18px", border: "none", borderBottom: i === activeFileIndex ? "2px solid #007acc" : "2px solid transparent", marginBottom: "-1px", backgroundColor: "transparent", color: i === activeFileIndex ? "#fff" : "#667788", cursor: "pointer", fontSize: "13px", fontWeight: i === activeFileIndex ? "600" : "400", fontFamily: "inherit", transition: "color 0.15s" }}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* CODE BLOCK */}
        {activeFile && (
          <div style={{ borderRadius: files.length > 1 ? "0 0 10px 10px" : "10px", overflow: "hidden", border: "1px solid #1e1e30", borderTop: files.length > 1 ? "none" : "1px solid #1e1e30" }}>
            <div style={{ padding: "8px 16px", backgroundColor: "#0d0d18", borderBottom: "1px solid #1e1e30", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#1e1e30", color: "#667788", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {langLabel(activeFile.name)}
              </span>
              <span style={{ fontSize: "12px", color: "#445566" }}>{activeFile.name}</span>
            </div>
            <SyntaxHighlighter
              language={langLabel(activeFile.name)}
              style={atomOneDark}
              showLineNumbers={true}
              wrapLongLines={true}
              customStyle={{ margin: 0, padding: "20px", fontSize: "14px", background: "#0d1117" }}
            >
              {activeFile.value || "// empty file"}
            </SyntaxHighlighter>
          </div>
        )}

        {files.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#13131f", borderRadius: "10px", border: "1px solid #1e1e30", color: "#445566" }}>
            This project has no files.
          </div>
        )}
      </div>
    </div>
  );
}