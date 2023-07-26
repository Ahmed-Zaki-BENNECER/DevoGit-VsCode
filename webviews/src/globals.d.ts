/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _vscode from "vscode";
import { WebviewApi } from "vscode-webview";

declare global {
    declare const tsvscode: WebviewApi<unknown>;
}
