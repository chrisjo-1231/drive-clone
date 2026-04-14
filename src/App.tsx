import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const fetchFiles = async () => {
    const res = await fetch(`${API}/files`);
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
      console.log("Response:", data);

      if (!res.ok) throw new Error("Upload failed");

      alert("Upload success!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("May error sa upload!");
    }
  };

  const deleteFile = async (name: string) => {
    await fetch(`${API}/delete/${name}`, {
      method: "DELETE",
    });

    fetchFiles();
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
      <div style={{
        width: "230px",
        background: "#f1f3f4",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}>
        <h2>📁 Drive</h2>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px",
          background: "#fff",
          borderBottom: "1px solid #ddd"
        }}>
          <h2>My Files</h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button onClick={uploadFile}>Upload</button>
          </div>
        </div>

        {/* FILES */}
        <div style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "15px"
        }}>
          {filteredFiles.map((name, i) => (
            <div key={i} style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "30px" }}>
                {getFileIcon(name)}
              </div>

              <div>{name}</div>

              <div style={{ marginTop: "10px" }}>
                <a
                  href={`${API}/uploads/${name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>

                <br />

                <button onClick={() => deleteFile(name)}>
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
