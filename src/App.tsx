import { useEffect, useState } from "react";

const API = "https://backend-nmky.onrender.com";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // GET FILES
  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API}/files`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // UPLOAD FILE
  const uploadFile = async () => {
    if (!file) {
      alert("Pumili ka muna ng file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error("Upload failed");

      alert("Upload success!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("May error sa upload!");
    }
  };

  // DELETE FILE
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

  // SEARCH FILTER
  const filteredFiles = files.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  // ICONS
  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    if (["txt", "json", "csv", "md"].includes(ext)) return "📝";
    if (["mp4", "mov", "avi"].includes(ext)) return "🎬";
    if (["mp3", "wav"].includes(ext)) return "🎵";
    return "📁";
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* SIDEBAR */}
      <div style={{ width: 230, background: "#f1f3f4", padding: 20 }}>
        <h2>📁 Drive</h2>
        <div style={{ padding: 10, background: "#e8f0fe", borderRadius: 8 }}>
          My Files
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <div style={{ padding: 15, borderBottom: "1px solid #ddd" }}>
          <h2>My Files</h2>

          <input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginRight: 10 }}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button onClick={uploadFile}>Upload</button>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 10,
            padding: 20,
            overflowY: "auto",
          }}
        >
          {filteredFiles.map((name, i) => (
            <div
              key={i}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40 }}>{getFileIcon(name)}</div>

              <div style={{ fontWeight: "bold" }}>{name}</div>

              {/* VIEW */}
              <a
                href={`${API}/uploads/${name}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>

              {/* DELETE */}
              <button onClick={() => deleteFile(name)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
