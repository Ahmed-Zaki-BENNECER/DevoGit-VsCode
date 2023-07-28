# About this webview

This webview is written in React TS. It contains the web UI interface contained
in the DevoGit panel.

This is a separate npm project from the main extension (called "extension host").

Therefore, the contexts of the view and the host are different. They comunicate
through a message channel using the `vscode` API given to the view on its creation.