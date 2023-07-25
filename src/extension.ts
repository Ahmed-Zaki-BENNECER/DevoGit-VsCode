import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SideBarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "devogit-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("helloworld.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("helloworld.showTime", () => {
      vscode.window.showInformationMessage(new Date().toLocaleTimeString());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("helloworld.refresh", () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
