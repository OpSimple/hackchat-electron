/*
  Author: OpSimple
  "A useless electron client for hack.chat"

*/


/* Import needed stuffs */
const electron = require('electron');
const prompt = require('electron-prompt');
const conextmenu = require('electron-context-menu');
const {Menu, shell, app, BrowserWindow} = electron;
/* required constants */
const PAGE = 'https://hack.chat/';  // change the value of this for your own hack.chat web server
const iconpath = __dirname + '/icon.png';

// Set NO for menubars
Menu.setApplicationMenu(null);
// Begin app stuffs
let window;
app.on('ready', () => {
  // We're creating window
    window = new BrowserWindow({
        width: 1200,
        height: 900,
        icon: iconpath,
        webPreferences: {
          nodeIntegration: false,
          nativeWindowOpen: true
        }
    });

    // Normal right click based context menu
    conextmenu({
      prepend: (defaultActions, params, browserWindow) => [
        {
          label: 'Home',
          click: () => {
            loadHome();
          }
        },
        {
          label: 'Inspect Element',
          click: () => {
            window.webContents.openDevTools();
          }
        }
      ]
    });
    // lets load home page
    loadHome();

    // Handle the hack.chat links and others differently
    window.webContents.on('new-window', (ev, url , frname,
       disp, opts, addftrs, ref) => {
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

    window.on('closed', () => {
        window = null;
    });
});

/* Loading home is long and required more than once */
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
