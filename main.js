/*
  Author: OpSimple
  "A useless electron client for hack.chat"

*/


/*
  Import needed stuffs
*/
const fs = require('fs');
const log4js = require('log4js');
const electron = require('electron');
const prompt = require('electron-prompt');
const conextmenu = require('electron-context-menu');
const { dialog, Menu, shell, app, BrowserWindow } = electron;

/*
  Initial config
*/
const ver = '0.1.5';
const iconpath = __dirname + '/icon.png';
let CONFIG = {
  version : ver,
  page: 'https://hack.chat/',
  loglevel: 'INFO',
  width: 1200,
  height: 900,
  extmoddirs: []
};
const appdir  = require('os').homedir()+'/.hackchat-electron';
const modsdir = appdir + '/mods';
const logdir  = appdir + '/logs';
const config  = appdir + '/config.json';


// create app dir if doesn't exist
if (!fs.existsSync(appdir)) {
  fs.mkdirSync(modsdir, { recursive: true }, (err) => {
    if(err) {
      throw err;
    }
  });
  fs.mkdirSync(logdir, { recursive: true }, (err) => {
    if(err) {
      throw err;
    }
  });
  createConfig();
}
if (!fs.existsSync(config)) {
  createConfig();
}
// setup the logger
log4js.configure({
  appenders:  { app: { type: 'file', filename: logdir+'/'+Date.now()+'.log' } },
  categories: { default: { appenders: ['app'], level: 'error' } }
});
const logger = log4js.getLogger('app');
logger.level = CONFIG.loglevel;
logger.info('App Started ('+ver+')!');
logger.info('appdir = ' + appdir);
// read config
logger.info('Reading config..');
readConfig();
logger.info('config = ' + JSON.stringify(CONFIG));


// Set NO for menubars
Menu.setApplicationMenu(null);
// Begin app stuffs
let window;
app.on('ready', () => {
  logger.info('app ready');
  // We're creating window
    window = new BrowserWindow({
        width: CONFIG.width,
        height: CONFIG.height,
        icon: iconpath,
        webPreferences: {
          nodeIntegration: false
        }
    });
    // lets load home page
    logger.info('loading homepage: '+ CONFIG.page);
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
            if(files!=null) {
              for(file of files) {
                injectMod(file);
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
        if(url.split('/')[2] === CONFIG.page.split('/')[2]) {
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
            }).catch((err) => {
              logger.error('Error while calling prompt: '+ err.name + ' - ' +err.message);
              console.log(err);
            });
        } else {
            shell.openExternal(url);
        }
    });
    // load modules to inject into hackchat client.js script
    window.webContents.on('dom-ready', (ev) => {
      // read file recursively and inject them one by one
      logger.info("Loading early modules..");

      const files = fs.readdirSync(modsdir, 'utf8', (err, data) => {
        if(err) {
          console.log(err);
          logger.error('Error while trying to read the contents of modules dir :' + err.name + ' - ' +err.message);
        }
      });
      if(files!=null) {
        for(file of files){
          injectMod(modsdir + '/' + file);
        }
      }

      // load mods from user given dirs
      if(CONFIG.extmoddirs != null) {
        for(dir in CONFIG.extmoddirs) {
          const files = fs.readdirSync(dir, 'utf8', (err, files) => {
            if(err) {
              console.log(err);
              logger.error('Error while trying to read the contents of modules dir :' + err.name + ' - ' +err.message);
            }
          });
          if(files!=null) {
            for(file of files){
              injectMod(modsdir + '/' + file);
            }
          }
        }
      }
    });
    window.on('closed', () => {
        window = null;
    });
});

app.on('quit', () => {
  logger.info('app quits');
});

/*
  Loading home is long and required more than once
*/
function loadHome() {
  if(window == null) return;
  window.loadURL(CONFIG.page);
  prompt({
    title: 'Channel',
    label: 'Enter the channel:',
    type: 'input',
    inputAttrs: {
      type: 'text'
    }
  }, window).then((r) => {
    if(r != null){
      window.loadURL(CONFIG.page+'?'+r);
    }
  }).catch( (err) => {
    logger.error('Error while calling prompt: '+err.name + ' - ' +err.message);
    console.log(err);
  });
}

/*
  Inject a js file
*/
function injectMod(file) {
  if(window == null) return;
  if(file.endsWith('.js')) {
    const js = fs.readFileSync(file, 'utf8', (err,data) => {
      if(err) {
        logger.error('Error while trying to read file :' + file + ' ' + err.name + ' - ' +err.message);
        console.log(err);
        return;
      }
    });
    if(js!=null) {
      logger.info('Mod Loaded: ' + file);
      window.webContents.executeJavaScript(js);
    }
  }
}

/*
  Read config
*/
function readConfig(){
  const data = fs.readFileSync( config, 'utf8', (err,data) => {
    if(err) {
      logger.fatal('Error while trying to read config file!\n'+err.name + ' - ' +err.message);
      console.log(err);
      return;
    }
  });

  try {
    CONFIG = JSON.parse(data);
    CONFIG.version = ver;
  } catch (err) {
    logger.fatal('Error while trying to read config file!\n'+err.name + ' - ' +err.message);
    console.log(err);
    return;
  }

  // TODO checking values
}

/*
  Create config
*/
function createConfig() {
  fs.writeFileSync(config, JSON.stringify(CONFIG));
}
