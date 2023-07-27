import { join } from "path";
import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import search from "./search";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // See the menu item "when" condition in package.json
        vscode.commands.executeCommand("setContext", "devogit.webviewVisible", webviewView.visible);
        webviewView.onDidChangeVisibility(() => {
            vscode.commands.executeCommand("setContext", "devogit.webviewVisible", webviewView.visible);
        });

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "openFile": {
                    const fileName = data.value;

                    if (!vscode.workspace.workspaceFolders) {
                        vscode.window.showErrorMessage("You have no open folder in your workspace.");
                        return;
                    }

                    const fileUri = vscode.Uri.file(join(vscode.workspace.workspaceFolders[0].uri.path, fileName));
                    vscode.workspace.openTextDocument(fileUri).then(vscode.window.showTextDocument);
                    break;
                }
                case "search": {
                    if (!vscode.workspace.workspaceFolders) {
                        vscode.window.showErrorMessage("You have no open folder in your workspace.");
                        return;
                    }
                    const query = data.value;
                    if (!query) {
                        webviewView.webview.postMessage({ type: "search", searchResult: [] });
                        return;
                    }
                    const searchResult = search(
                        vscode.Uri.file(vscode.workspace.workspaceFolders[0].uri.path).fsPath,
                        query
                    );
                    webviewView.webview.postMessage({ type: "search", searchResult });
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "webviews", "dist/x.js"));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    :root {
                        --container-padding: 20px;
                        --input-padding-vertical: 8px;
                        --input-padding-horizontal: 6px;
                        --input-margin-vertical: 4px;
                        --input-margin-horizontal: 0;
                        --max-width: 300px;
                    }
        
                    button {
                        border: none;
                        padding: var(--input-padding-vertical) var(--input-padding-horizontal);
                        margin: 8px 0px;
                        width: min(100%, var(--max-width));
                        text-align: center;
                        outline: 1px solid transparent;
                        outline-offset: 2px !important;
                        color: var(--vscode-button-foreground);
                        background: var(--vscode-button-background);
                    }
        
                    button:hover {
                        cursor: pointer;
                        background: var(--vscode-button-hoverBackground);
                    }
        
                    button:focus {
                        outline-color: var(--vscode-focusBorder);
                    }
        
                    button.secondary {
                        color: var(--vscode-button-secondaryForeground);
                        background: var(--vscode-button-secondaryBackground);
                    }
        
                    button.secondary:hover {
                        background: var(--vscode-button-secondaryHoverBackground);
                    }
        
                    input:not([type="checkbox"]),
                    textarea {
                        display: block;
                        width: calc(min(100%, var(--max-width)) - var(--input-padding-horizontal) * 2);
                        border: none;
                        font-family: var(--vscode-font-family);
                        padding: var(--input-padding-vertical) var(--input-padding-horizontal);
                        color: var(--vscode-input-foreground);
                        outline-color: var(--vscode-input-border);
                        background-color: var(--vscode-input-background);
                    }
                </style>
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                </script>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>`;
    }
}
