import { useState, useEffect, useCallback } from "react";
import SearchResult from "./SearchResult";
import ClearInput from "./components/ClearInput";
import { join } from "path";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setFiles] = useState<SearchResult>([]);
    const [searching, setSearching] = useState(false);

    const handleExtensionMessages = useCallback((event: { data: { type: string; searchResult: SearchResult } }) => {
        if (event.data.type === "search") {
            setFiles(event.data.searchResult);
            setSearching(false);
        } else {
            console.log("Unknown message type: " + event.data.type);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("message", handleExtensionMessages);
        return () => window.removeEventListener("message", handleExtensionMessages);
    }, [handleExtensionMessages]);

    const handleSearch = useCallback(() => {
        // If no search term provided, reset files to initial state
        if (!searchTerm) {
            setFiles([]);
            return;
        }

        if (searching) {
            return;
        }

        tsvscode.postMessage({
            type: "search",
            value: searchTerm,
        });
        setSearching(true);
    }, [searchTerm, searching]);

    const handleClick = useCallback((path: string) => {
        tsvscode.postMessage({
            type: "openFile",
            value: path,
        });
    }, []);

    return (
        <>
            <h1>DevoGit Search</h1>
            <div>
                <div style={{ position: "relative" }}>
                    <input
                        type='text'
                        placeholder='Search in files'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={({ key }) => {
                            if (key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <ClearInput onClick={() => setSearchTerm("")} displayed={searchTerm !== ""}/>
                </div>
                <button
                    onClick={handleSearch}
                    style={{
                        // disabled attribute doesn't work here.
                        cursor: searching ? "not-allowed" : "pointer",
                        opacity: searching ? 0.5 : 1,
                    }}>
                    Search
                </button>
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
