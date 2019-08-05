/*
  Author: OpSimple
  "A useless electron client for hack.chat"

*/


/*
  Import needed stuffs
*/
const electron = require('electron');
const prompt = require('electron-prompt');
const conextmenu = require('electron-context-menu');
const fs = require('fs');
const { dialog, Menu, shell, app, BrowserWindow } = electron;

/*
  required constants
*/
const PAGE = 'https://hack.chat/';
const iconpath = __dirname + '/icon.png';
const appdir = require('os').homedir()+'/.hackchat-electron';
const modsdir = appdir + '/mods';

// Set NO for menubars
Menu.setApplicationMenu(null);
// create app dir if doesn't exist
if(!fs.existsSync(appdir)) {
  fs.mkdirSync(modsdir, { recursive: true }, (err) => {
    if(err) {
      throw err;
    }
  });
}

// Begin app stuffs
let window;
app.on('ready', () => {
  // We're creating window
    window = new BrowserWindow({
        width: 1200,
        height: 900,
        icon: iconpath,
        webPreferences: {
          nodeIntegration: false
        }
    });
    // lets load home page
    loadHome();

    // Normal right-click based context menu
    conextmenu({
      prepend: (defaultActions, params, browserWindow) => [
        // navigate to home option
        {
          label: 'Home',
          click: () => {
            loadHome();
          }
        }
      ],
      // Basic menu options
      menu: actions => [
        actions.separator(),
        actions.cut(),
        actions.copy(),
        actions.paste(),
        actions.copyLink(),
        actions.separator()
      ],
      // Dev and playful options
      append: (defaultActions, params, browserWindow) => [
        // Allow to inject a js file directly
        {
          label: 'Inject JavaScript',
          click: () => {
            // create an open dialog for user to select js files
            const files = dialog.showOpenDialog(window, {
              title: 'Choose js files',
              filters: [
                { name: 'JavaScript files', extensions: ['js']},
                { name: 'All files',        extensions: ['*'] }
              ],
              properties: ['openFile', 'multiSelections', 'showHiddenFiles']
            });
            // inject the selected files one by one
            for(file of files) {
              if(file.endsWith('.js')) {
                const js = fs.readFileSync(file, 'utf8', (err,data) => {
                  if(err) console.log(err);
                });
                window.webContents.executeJavaScript(js);
              }
            }
          }
        },
        // Open dev tools to play with
        {
          label: 'Dev Tools',
          click: () => {
            window.webContents.openDevTools();
          }
        }
      ]
    });

    // Handle the hack.chat links and others differently
    window.webContents.on('new-window', (ev, url , frname, disp, opts, addftrs, ref) => {
        ev.preventDefault();
        if(url.split('/')[2] === PAGE.split('/')[2]) {
            prompt({
              title: 'Nickname',
              label: 'Enter a nickname:',
              type: 'input',
              inputAttrs: {
                type: 'text',
                required: true
              }
            }, window).then((r) => {
              if(r != null){
                window.loadURL(url+'#'+r);
              }
            }).catch(console.error);
        } else {
            shell.openExternal(url);
        }
    });
    // load modules to inject into hackchat client.js script
    window.webContents.on('dom-ready', (ev) => {
      // read file recursively and inject them one by one
      fs.readdirSync(modsdir, 'utf8', (err, files) => {
        if(!err) {
          for(file of files){
            if(file.endsWith('.js')) {
              const js = fs.readFileSync( modsdir + '/' + file, 'utf8', (err,data) => {
                if(err) console.log(err);
              });
              window.webContents.executeJavaScript(js);
            }
          }
        }
      });
    });
    window.on('closed', () => {
        window = null;
    });
});

/*
  Loading home is long and required more than once
*/
function loadHome() {
  window.loadURL(PAGE);
  prompt({
    title: 'Channel',
    label: 'Enter the channel:',
    type: 'input',
    inputAttrs: {
      type: 'text'
    }
  }, window).then((r) => {
    if(r != null){
      window.loadURL(PAGE+'?'+r);
    }
  }).catch(console.error);
}
