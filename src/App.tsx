import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API}/files`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async () => {
    if (!file) return alert("Pumili ka muna ng file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      alert("Upload success!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("May error sa upload!");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (name: string) => {
    try {
      await fetch(`${API}/delete/${name}`, {
        method: "DELETE",
      });

      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    if (["txt", "md", "csv", "json", "xml", "log"].includes(ext)) return "📝";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "🎬";
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) return "🎵";
    return "📁";
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: "230px",
          background: "#f1f3f4",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📁 Drive</h2>

        <div
          style={{
            padding: "10px",
            borderRadius: "8px",
            background: "#e8f0fe",
            marginBottom: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          My Files
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f8f9fa",
        }}
      >
        
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "1px solid #ddd",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h2>My Files</h2>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
              onClick={uploadFile}
              disabled={loading}
              style={{
                padding: "6px 15px",
                background: "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* FILE GRID */}
        <div
          style={{
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "15px",
            overflowY: "auto",
          }}
        >
          {filteredFiles.map((name, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "0.2s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "40px" }}>
                {getFileIcon(name)}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  wordBreak: "break-word",
                }}
              >
                {name}
              </div>

              <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                <a
                  href={`${API}/uploads/${name}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#1a73e8",
                    color: "#fff",
                    padding: "5px 8px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  View
                </a>

                <button
                  onClick={() => deleteFile(name)}
                  style={{
                    background: "#ea4335",
                    color: "#fff",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
