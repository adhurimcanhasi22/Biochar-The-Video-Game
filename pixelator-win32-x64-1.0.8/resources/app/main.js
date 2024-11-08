const {app, BrowserWindow, Menu, clipboard, nativeImage} = require('electron');
const path = require('path');
const url = require('url');
const opn = require('./backendjs/opn');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// create the main window
function createWindow () {

    console.log("Start init.");

    // get max width and height
    const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize;
    console.log("Screen resolution:", width, height);

    // Create the browser window.
    win = new BrowserWindow(
    {
        'webPreferences': {'nodeIntegration': true, 'contextIsolation': false, 'enableRemoteModule': true},
        'width': Math.min(1100, width),
        'height': Math.min(960, height),
        'minHeight': 400,
        'minWidth': 800,
        'icon': __dirname + (process.platform == 'darwin' ? '/icon.icns' : '/icon.ico')
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // Open the DevTools (for debugging).
    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    });


    // make sure working dir is the app root
    process.chdir(app._IPC.getWorkingDir());

    // app ready message
    console.log("App ready.");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
});

// remove default ugly menu
app.on('browser-window-created',function(e, window) {
    window.setMenu(null);
});

// get platform
var _platform = "win";
if (process.platform === "win32") {
    _platform = "win";
}
else if (process.platform == 'darwin') {
    _platform = "mac";
}
else if (process.platform == 'linux' || process.platform == 'freebsd' || process.platform == 'sunos') {
    _platform = "linux";
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// add some API functions the web page need
app._IPC = {

    // get the platform we're on
    getPlatform: function() 
    {
        console.log("Get platform: " + _platform);
        return _platform;
    },

    // print to log
    log: function(msg) 
    {
        console.log(msg);
    },

    // run a shell command
    executeShell: function(cmd, stdout_cb, stderr_cb, done_cb) 
    {

        var exec = require('child_process').exec;
        exec(cmd, function (error, stdout, stderr) {

            console.log("Executed command: ", cmd);
            console.log(error, stdout, stderr);
            if (error && !stderr) { 
                console.log("CALL STDERR CB");
                console.log("ERR LEN: ", (error || "").length);
                stderr_cb(String(error));
            }
            else if (stderr) { 
                console.log("CALL STDERR CB");
                console.log("STDERR LEN: ", (stderr || "").length);
                stderr_cb(stderr);
            }
            else if (stdout) {
                console.log("CALL STDOUT CB");
                console.log("STDOUT LEN: ", (stdout || "").length);
                stdout_cb(stdout);
            }
            done_cb();
        });
    },

    // get if a given file is executable or not
    canExecuteFile: function(path, callback) 
    {
        var fs = require('fs');
        try {
            fs.accessSync(path, fs.constants.X_OK);
            if (callback) {callback(true);}
            return true;
        } 
        catch (err) {
            if (callback) {callback(false);}
            return false;
        }
    },

    // get currently working dir
    getWorkingDir: function() 
    {
        var ret = process.cwd();
        console.log("cwd: ", ret);
        return ret;
    },

    // get pixelator exe path
    getPixelatorPath: function() 
    {
        if (process.platform == 'darwin') {
            return app._IPC.getApplicationSupportMac() + '_pixelator';
        }
        var ret = process.cwd() + '/_pixelator_cmd.exe';
        return ret;
    },

    // get pixelator folder
    getRootFolderPath: function() 
    {
        if (process.platform == 'darwin') {
            return app._IPC.getApplicationSupportMac();
        }
        var ret = process.cwd();
        return ret;
    },

    // get preview image path
    getPreviewImagePath: function() 
    {
        if (process.platform == 'darwin') {
            return '/tmp/__preview_pic.png';
        }
        return process.cwd() + '/__preview_pic.png';
    },

    // get default settings path
    getDefaultSettingsPath: function() 
    {
        if (process.platform == 'darwin') {
            return '/tmp/__default_settings.pixelator';
        }
        return process.cwd() + '/__default_settings.pixelator';
    },

    // get application support path for mac
    getApplicationSupportMac: function() 
    {
        return app.getPath('home') + '/Library/Application Support/PixelatorMain/';
    },

    // get license path
    getLicensePath: function() 
    {
        if (process.platform == 'darwin') {
            return app._IPC.getApplicationSupportMac() + 'LICENSE';
        }
        return process.cwd() + '/LICENSE';
    },

    // open save-as dialog for pictures and return filename
    openSaveAsDialog: function(callback) 
    {

        console.log("Opened save-as image dialog.");
        const {dialog} = require('electron')
        dialog.showSaveDialog({
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'Images', extensions: ['png', 'jpg', 'gif', 'jpeg', 'bmp']}],

        }).then((res) => {
            if (res.canceled) { return; }
            var path = res.filePath;
            console.log("User picked path: ", path);
            callback(path);
        });
    },

    // pick a folder dialog
    openFolderDialog: function(callback) 
    {
        const {dialog} = require('electron');
        dialog.showOpenDialog({
            properties: ["openDirectory"],
        }).then((res) => {
            console.log(res);
            if (res.canceled) {
                console.log("User cancelled.");
                return;
            }
            var path = res.filePaths[0];
            console.log("User picked folder path: ", path);
            callback(path);
        });
    },

    // get a list with all image files in folder
    getAllImageFiles: function(path, callback) 
    {
        var fs = require('fs');
        console.log("Get all images in: " + path)
        fs.readdir(path, {}, function(err, files) {
            var ret = [];
            if (err) { return callback(null); }
            console.log(files);
            for(var i = 0, l = files.length; i < l; i++) {
                var filePath = files[i];
                var parts = filePath.split('.');
                var extension = (parts[parts.length-1] || "").toLowerCase();
                if (['png', 'bmp', 'jpg', 'gif', 'jpeg'].indexOf(extension) !== -1) {
                    console.log("  - " + filePath);
                    ret.push(filePath);
                }
            }
            callback(ret);
        });
    },

    // open save-as dialog for projects and return filename
    openSaveProjectAsDialog: function(callback) 
    {

        console.log("Opened save-as project dialog.");
        const {dialog} = require('electron');
        dialog.showSaveDialog({
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'Pixelator Project', extensions: ['pixelator']}],
        }).then((res) => {
            if (res.canceled) {
                console.log("User cancelled.");
                return;
            }
            var path = res.filePath;
            console.log("User picked path: ", path);
            callback(path);
        });
    },

    // open save-as dialog for projects and return filename
    openLoadProjectDialog: function(callback) 
    {

        console.log("Opened open-as project dialog.");
        const {dialog} = require('electron');
        dialog.showOpenDialog({
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'Pixelator Project', extensions: ['pixelator']}],
        }).then((res) => {
            console.log(res);
            if (res.canceled) {
                console.log("User cancelled.");
                return;
            }
            var path = res.filePaths[0];
            console.log("User picked path: ", path);
            callback(path);
        });
    },

    // open license file dialog
    openLicenseFileDialog: function(callback) 
    {

        console.log("Opened license file dialog.");
        const {dialog} = require('electron');
        dialog.showOpenDialog( 
        {
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'License file', extensions: ['*']}],
        }).then((paths) => {
            console.log("User picked license path: ", paths);
            callback(paths);
        });
    },

    // save project file as
    saveProjectAs: function(path, data)
    {
        var fs = require('fs');
        fs.writeFileSync(path, data);
    },

    // set new license (licenseData must be stringified json)
    applyLicense: function(licenseData) 
    {
        var path = app._IPC.getLicensePath();
        require('fs').writeFileSync(path, licenseData);
    },

    // read a file
    readFile: function(path, callback) 
    {
        var fs = require('fs');
        fs.readFile(path, function(err, data) {
            callback(err, data);
        });
    },

    // read a file sync
    readFileSync: function(path) 
    {
        var fs = require('fs');
        var data = fs.readFileSync(path, {encoding:'utf8', flag:'r'});
        return data;
    },

    // read a project file and return its data
    readProjectFile: function(path) 
    {
        console.log("Read project file: ", path);
        var fs = require('fs');
        return fs.readFileSync(path, {encoding:'utf8', flag:'r'});
    },

    // save given settings as the default startup settings
    saveDefaultSettings: function(data) 
    {
        var path = this.getDefaultSettingsPath();
        this.saveProjectAs(path, data);
    },

    // remove saved default settings
    removeDefaultSettings: function() 
    {
        var path = this.getDefaultSettingsPath();
        var fs = require('fs');
        fs.unlinkSync(path);
    },

    // get saved defaults or null if no defaults file is found
    getSavedDefaults: function() 
    {
        try {
            var path = this.getDefaultSettingsPath();
            return this.readProjectFile(path);
        }
        catch(e) {
            return null;
        }
    },

    // open a folder in explorer
    openFolder: function(path) 
    {

        require('child_process').exec('start "" "' + require('path').dirname(path) + '"');
    },

    // open a file
    openFile: function(path) 
    {

        require('child_process').exec('start "" "' + path + '"');
    },

    // copy image to clipboard
    copyPreviewImgToClipboard: function() 
    {
        console.log("Write image to clipboard...");
        var img = nativeImage.createFromPath(this.getPreviewImagePath());
        clipboard.writeImage(img, 'png');
        console.log("Done!");
    },

    // open url in browser
    openInBrowser: function(url) 
    {
        opn(url);
    }
};
