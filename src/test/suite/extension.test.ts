import * as vscode from "vscode";
import * as sinon from "sinon";

suite("Extension Test Suite", () => {
  let sandbox: sinon.SinonSandbox;
  let showInformationMessageStub: sinon.SinonStub;

  setup(() => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(
      vscode.window,
      "showInformationMessage"
    );
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Hello World command", async () => {
    // Execute the command
    await vscode.commands.executeCommand("helloworld.helloWorld");

    // Check the messages
    sinon.assert.calledWith(showInformationMessageStub, "Hello World from X!1");
    sinon.assert.calledWith(showInformationMessageStub, "Weshxxxxx2");
  });

  test("Show Time command", async () => {
    // Execute the command
    await vscode.commands.executeCommand("helloworld.showTime");

    // Check the message
    sinon.assert.calledWith(
      showInformationMessageStub,
      new Date().toLocaleTimeString()
    );
  });
});
