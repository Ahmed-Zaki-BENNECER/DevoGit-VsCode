import { useState } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
  ]);

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      {files.map((file) => (
        <ul key={file}>
          <li>
            <a
              href="#"
              onClick={() =>
                handleClick("/home/jpeg/Documents/DevoGit/all_files.txt")
              }
            >
              {file}
            </a>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default App;
