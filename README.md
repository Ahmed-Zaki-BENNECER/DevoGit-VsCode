# Purpose

This extension is used to search through the Devoteam GitLab project.

# Install and use

## Prerequisites

We assume that you have already installed the following tools:
- [Git](https://git-scm.com/downloads)
- [VSCode](https://code.visualstudio.com/download)

## Clone the Devoteam GitLab repository

Run in a terminal the following command:
```shell
git clone https://git.devoteam.com/n-platform/fr-n-platform <name_of_folder>
```

> Replace \<name_of_folder> by the name or the path of the folder where you want to store all the files.

## Install the extension

> For the moment, the extension is not on the VSCode Extension Marketplace. So you have to install it manually.

Download the VSIX file of the extension [here](https://github.com/Ahmed-Zaki-BENNECER/DevoGit-VsCode/releases/latest).

Open VSCode and go to the extensions tab on the left panel. Then click on the three dots on the top right corner and select "Install from VSIX...". Select the file "devoteam-gitlab-\<version>.vsix" in your Downloads folder.

## Use the extension with the repository

Open VSCode and open the folder where you cloned all the files of the Devoteam GitLab repository.

You will see on the left panel a new tab called "DevoGit" with the Devoteam logo. Click on it and you will see the search bar.

Search in the repository with some keywords of what your script should do. Click on the files to see their content :\)

# Developers

## Prerequisites

We assume that you have already installed the following tools:
- [Git](https://git-scm.com/downloads)
- [VSCode](https://code.visualstudio.com/download)
- [Node.js and npm](https://nodejs.org/en/download/)

## Clone the extension repository

Clone [this](https://github.com/Ahmed-Zaki-BENNECER/DevoGit-VsCode) repository.

Go in the cloned folder, which we will call "workspace's root" from now on.

## Install the dependencies

Run in workspace's root the command:
```shell
npm install && cd webviews && npm install && npm run build
```

> If you are on a masterized computer or you are not admin of your computer, you may need to run ONCE the command:
> ```shell
> setx PATH "%path%;<path-to-node-folder>"
> ```
> \(replacing \<path-to-node-folder> with your path to node and npm\) if the upper command says "'npm' is not recognized as an inernal or external command". You will then need to restart completely VSCode and the terminal inside VSCode.

Now, whereever you are in the project, press F5 to launch the extension in debug mode. It will start a new VSCode window with the extension loaded and all the others disabled.

## Good to know

When you are in debug mode, you can edit the code and press Ctrl+R in the debug window to reload the extension.

If you edit the code in the webviews folder only, you don't need to reload the extension, just go in the debug window and close and open the DevoGit tab to see the changes.