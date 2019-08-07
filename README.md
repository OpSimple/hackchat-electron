hackchat-electron
=================

A simple desktop client for hack.chat using electron.
hack.chat is a minimal, distraction-free, accountless, logless, disappearing chat service which is easily deployable as your own service.
It also has an official web hosting at [hack.chat](https://hack.chat) where anyone can have a secure, distraction-free, accountless and logless chat with their group for any discussion, online meetings, or just for gossip with their internet-pals.
This projects provides a simple electron based desktop client for the official hack.chat but it can be used for any hack.chat server through minor tweaks in the `main.js` script.

## Dowload
- Windows  &nbsp;  &nbsp; [exe](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat.Setup.0.1.5.exe)

- Linux &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [deb](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat-electron_0.1.5_amd64.deb)  &nbsp;  &nbsp; [snap](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat-electron_0.1.5_amd64.snap)  &nbsp; &nbsp; [appimage](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat-0.1.5.AppImage)  &nbsp; &nbsp; [tar.xz](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat-electron-0.1.5.tar.xz)

- Mac  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [dmg](https://github.com/OpSimple/hackchat-electron/releases/download/0.1.5/hackchat-0.1.5.dmg)

Getting Started
===============

## Requirements
- [node.js](https://nodejs.org)
- [electron](https://electronjs.org/)
- [npm](https://github.com/npm/cli)

## Running

1. Make sure you've `npm` and `electron` binaries in `PATH`.
1. Open the terminal and navigate to the folder/dir you wish to install this client.
1. Clone the repository
    ```bash
    git clone https://github.com/OpSimple/hackchat-electron.git
    ```
    **OR** Extract the zip file to the corresponding folder/dir if you've downloaded the zip of   the project.
1. Navigate into the project folder/dir.
   ```bash
   cd hackchat-electron
   ```
1. Install the dependencies.
   ```bash
   npm install
   ```
1. Run the project.
   ```bash
   npm start
   ```
   **OR**
   ```bash
   electron .
   ```  
   **OR**
   ```bash
   electron main.js
   ```
1. Further, a desktop file or a link can be created for executing `main.js` with the provided icon.png.

## Packaging

1. Follow till step 5 of the "Running" section.
1. Create packages for your platform (Windows, Linux, Mac) using the following command and the packages for your platform will be produced in `dist` folder/dir.
   ```bash
   npm run dist
   ```

Features
========

- You need to enter the channel name, nickname and password in the channel input box prompted at the homepage as `channel#nickname#password`.
- You can right click anywhere in the app to get an option to open developer tools and navigate back to homepage.
- **NEW**  Now, you can inject js files into the client.js of hack.chat to alter any function of the script. You can also provide js modules to auto inject when the application starts into, `yourhome/.hackchat-electron/mods` folder/dir. You can also right-click and choose to inject a js  file on demand.
- **NEW**  Now, you can create packages for the app to install and run on your platform (Windows, Linux, Mac).
- **NEW**  Now, the app can be tweaked using its config file at `yourhome/.hackchat-electron/config.json`.

TODO
====

- Checking for corrupt config files and unacceptable values from user.

License
=======

This project is under [MIT license](LICENSE).
