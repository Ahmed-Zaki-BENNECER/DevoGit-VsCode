import * as vscode from "vscode";
import { getNonce } from "./getNonce";

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

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "openFile": {
          const text = data.value;
          console.log(text);

          // Convert file path to a vscode.Uri
          const fileUri = vscode.Uri.file(text);
          // Open the file
          const document = await vscode.workspace.openTextDocument(fileUri);
          vscode.window.showTextDocument(document);

          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webviews", "dist/x.js")
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        :root {
          --container-padding: 20px;
          --input-padding-vertical: 8px;
          --input-padding-horizontal: 6px;
          --input-margin-vertical: 4px;
          --input-margin-horizontal: 0;
        }

        button {
          border: none;
          padding: var(--input-padding-vertical) var(--input-padding-horizontal);
          margin: 8px 0px;
          width: 103%;
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
          width: 100%;
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
        <h1>Hello Devoteamers</h1>
        <div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
