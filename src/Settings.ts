import { workspace, window, commands } from "vscode";

type Options = {
    needReload?: boolean;
};

class Setting<T> {
    value: T;

    constructor(variablePath: string, options: Options = {}) {
        this.value = workspace.getConfiguration("devoteam.devogit").get(variablePath) as T;

        workspace.onDidChangeConfiguration((event) => {
            let affected = event.affectsConfiguration("devoteam.devogit." + variablePath);
            if (affected) {
                this.value = workspace.getConfiguration("devoteam.devogit").get(variablePath) as T;
            }
            if (affected && options.needReload) {
                window
                    .showInformationMessage("You need to reload the window to apply the changes.", "Reload")
                    .then((choice) => {
                        if (choice === "Reload") {
                            commands.executeCommand("workbench.action.reloadWindow");
                        }
                    });
            }
        });
    }
}

class SettingsClass {
    private static _instance: SettingsClass;
    static get instance() {
        if (!SettingsClass._instance) {
            SettingsClass._instance = new SettingsClass();
        }
        return SettingsClass._instance;
    }
    private constructor() {}

    /* -------------------------------------------------------------------------- */
    /*            Repeat this pattern for each setting you will create            */
    /* -------------------------------------------------------------------------- */
    private _maxSearchResults = new Setting<number>("maxSearchResults");
    get maxSearchResults() {
        return SettingsClass.instance._maxSearchResults.value;
    }

    private _keepContentWhenHidden = new Setting<boolean>("keepContentWhenHidden", { needReload: true });
    get keepContentWhenHidden() {
        return SettingsClass.instance._keepContentWhenHidden.value;
    }
}

const settings = SettingsClass.instance;

export default settings;
