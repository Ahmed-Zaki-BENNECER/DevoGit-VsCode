import { useState, useEffect, useCallback } from "react";
import SearchResult from "./SearchResult";

function join(arg1: string, arg2: string) {
    return (arg1 + "/" + arg2).replace(/\/+/g, "/");
}

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setFiles] = useState<SearchResult>([
        {
            folderName: "test/test",
            fileNames: ["file1.txt", "file2.txt"],
        },
        {
            folderName: "test/test2",
            fileNames: ["file3.txt", "file1.txt"],
        },
    ]);

    const handleExtensionMessages = useCallback((event: { data: { type: "search"; searchResult: SearchResult } }) => {
        if (event.data.type === "search") {
            setFiles(event.data.searchResult);
        } else {
            console.log("Unknown message type: " + event.data.type);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("message", handleExtensionMessages);
        return () => window.removeEventListener("message", handleExtensionMessages);
    }, [handleExtensionMessages]);

    const handleSearch = () => {
        // If no search term provided, reset files to initial state
        if (!searchTerm) {
            setFiles([]);
            return;
        }

        tsvscode.postMessage({
            type: "search",
            value: searchTerm,
        });
    };
    const handleClick = (fileName: string) => {
        tsvscode.postMessage({
            type: "openFile",
            value: fileName,
        });
    };

    return (
        <>
            <h1>DevoGit Search</h1>
            <div>
                <input
                    type='text'
                    placeholder='Search in files'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <div
                    className='results-container'
                    style={{
                        width: "100%",
                        display: "block",
                        overflowY: "auto",
                        marginBottom: "10px",
                    }}>
                    {files.map(({ fileNames, folderName }, i) => (
                        <div
                            className='result-container'
                            key={folderName}
                            style={{
                                display: "block",
                                width: "calc(min(100%, var(--max-width)) - 24px)",
                                padding: "10px",
                                border: "2px solid var(--vscode-panelSection-border)",
                                borderRadius: "8px",
                                marginTop: i === 0 ? "0px" : "10px",
                            }}>
                            <div
                                className='folder-name'
                                style={{
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                    color: "var(--vscode-editor-foreground)",
                                }}>
                                {folderName}
                            </div>
                            <div
                                className='file-names'
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                    marginLeft: "10px",
                                }}>
                                {fileNames.map((fileName) => (
                                    <div
                                        className='file-name'
                                        key={fileName}
                                        style={{
                                            cursor: "pointer",
                                            color: "var(--vscode-editor-foreground)",
                                        }}
                                        onClick={() => handleClick(join(folderName, fileName))}>
                                        {fileName}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
