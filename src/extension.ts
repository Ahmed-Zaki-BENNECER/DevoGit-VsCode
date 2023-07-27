import * as vscode from "vscode";
import { SidebarProvider } from "./SideBarProvider";

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("devogit-sidebar", sidebarProvider));
    context.subscriptions.push(
        vscode.commands.registerCommand("devogit.openSettings", () => {
            vscode.commands.executeCommand("workbench.action.openSettings", "@ext:devoteam.devogit");
        })
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
