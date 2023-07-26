import { useState } from "react";
import "./App.css";
import SearchResult from "./SearchResult";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
  ]);

  const handleExtensionMessages = (event: { data: SearchResult; }) => {
    const result = event.data;
    console.log(result);
  }

  window.addEventListener("message", handleExtensionMessages);

  const handleSearch = () => {
    // If no search term provided, reset files to initial state
    if (!searchTerm) {
      setFiles([
        "file1.txt",
        "file2.txt",
        "file3.txt",
        "file4.txt",
        "file5.txt",
      ]);
      return;
    }

    // Filter files based on search term
    const filteredFiles = files.filter((file) => file.includes(searchTerm));
    setFiles(filteredFiles);
  };
  const handleClick = (fileName: string) => {
    tsvscode.postMessage({
      type: "openFile",
      value: fileName,
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search in files"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <a
              href="#"
              onClick={() =>
                handleClick(file)
              }
            >
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
