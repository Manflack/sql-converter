const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const exec = require('child_process').exec;

var processes = [];

function execute(command, callback) {
  var newProcess = exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
  processes.push(newProcess);
  newProcess.on("exit", function () {
    processes.splice(processes.indexOf(newProcess), 1);
  });
};

execute('npm run build', (output) => {
  console.log(output);
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })

  // and load the index.html of the app.
  // 'public' is the path where webpack bundles my app
  mainWindow.loadURL(`file:///${__dirname}\\src\\public\\index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

    processes.forEach(function (proc) {
      proc.kill();
      console.log(proc);
    });

    app.quit()
  }
})