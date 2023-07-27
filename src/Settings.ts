import { workspace } from "vscode";

class Setting<T> {
    value: T;

    constructor(variablePath: string) {
        this.value = workspace.getConfiguration("devoteam.devogit").get(variablePath) as T;

        workspace.onDidChangeConfiguration((event) => {
            let affected = event.affectsConfiguration("devoteam.devogit." + variablePath);
            if (affected) {
                this.value = workspace.getConfiguration("devoteam.devogit").get(variablePath) as T;
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
}

const settings = SettingsClass.instance;

export default settings;
