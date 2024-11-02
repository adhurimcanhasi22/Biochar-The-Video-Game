/*
Misc defs and consts.
Software: Pixelator.
Author: Ronen Ness.
Since: 2018.
*/

(function() {

window.defs = {

    // current version
    version: '1.0.8',

    // license info
    license: {"type": "unlicensed", "since": 0, "key": "", "owner": "-", "email": "-"},

    // main site url
    siteUrl: 'http://pixelatorapp.com/',

    // my personal site url
    personalUrl: 'http://ronenness.com/',

    // name of the current project
    currentProjectName: undefined,

    // built-in colors
    basic_colors: {
        'transparent':  '#00000000',
        'black':        '#000000',
        'gray':         '#777777',
        'white':        '#ffffff',
        'red':          '#ff0000',
        'green':        '#00ff00',
        'blue':         '#0000ff',
        'magenta':      '#ff00ff',
        'yellow':       '#ffff00',
        'teal':         '#00ffff',
    },

    // convert color to hex
    colValToHex: function(val)
    {
        var ret = window.defs.basic_colors[val] || val;
        if (ret.length <= 7) ret += 'ff';
        return ret;
    },

    // path to the pixelator command line exe
    pixelator_command: window._pixelatorPath,

    // path to generate preview image to
    preview_img_path: window._previewPath,

    // license path
    license_path: window._licensePath,
}

})();
/*
Init UI components and some HTML.
Software: Pixelator.
Author: Ronen Ness.
Since: 2018.
*/

(function() {

    // select the built-in palette file
    window.selectBuiltInPaletteFile = function(file)
    {
        window.setPalettePath(window._pixelatorFolder + "/palettes/" + file);
    }

    // default palette file
    window._defaultPaletteFile = window._pixelatorFolder + "/palettes/RESURRECT-64.png";

    // show a dialog to select built-in palette
    window.selectBuiltInPalette = function()
    {
        html = "<h2>Select built-in palette:</h2><hr />"
        html += `
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('APPLE_2.png')">APPLE_2</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('COMMODORE_VIC20.png')">COMMODORE_VIC20</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('GAMEBOY.png')">GAMEBOY</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('GAMEBOY_COLOR.png')">GAMEBOY_COLOR</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('DISCORD-2021.png')">DISCORD-2021</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('LOSPEC-500.png')">LOSPEC-500</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('GAMEBOY_GREY.png')">GAMEBOY_GREY</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('MASTER_SYSTEM.png')">MASTER_SYSTEM</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('NES.png')">NES</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('NTSC.png')">NTSC</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('PAL.png')">PAL</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('JOURNEY.png')">JOURNEY</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('RESURRECT-64.png')">RESURRECT-64</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('ENDSEGA-32.png')">ENDSEGA-32</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('AMMO-8.png')">AMMO-8</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('APOLLO.png')">APOLLO</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('PICO8.png')">PICO-8</a><br />
        <a style="cursor:pointer" onclick="selectBuiltInPaletteFile('SECAM.png')">SECAM</a><br />
        `;
        bootbox.alert(html);
    }

    // check for update and tells the user if there's a newer version or not
    window.checkForUpdates = function(notifyIfUpToDate)
    {
        $.get(window.defs.siteUrl + 'latest_version_' + window.ipc.getPlatform(), function(data) {

            // same version
            if (window.defs.version === data)
            {
                if (notifyIfUpToDate)
                {
                    bootbox.alert("<h2>No new updates available!</h2><hr /><p>Your Pixelator [v" + window.defs.version + "] is up to date.</p>");
                }
            }
            // different version
            else
            {
                // check if our version is newer
                ourVerParts = window.defs.version.split('.');
                newestVerParts = data.split('.');

                // convert to absolute version numbers
                ourVerVal = parseInt(ourVerParts[0]) * 1000 + parseInt(ourVerParts[1]) * 100 + parseInt(ourVerParts[2]);
                newVerVal = parseInt(newestVerParts[0]) * 1000 + parseInt(newestVerParts[1]) * 100 + parseInt(newestVerParts[2]);

                if (newVerVal > ourVerVal)
                {
                    var url = window.defs.siteUrl + "download.html?" + new Date().getTime();
                    bootbox.alert("<h2>Update Available!</h2><hr /><p>Your Pixelator [v" + window.defs.version + "] is not up to date, a newer version is available: " + data + ".</p>" +
                                    "<p>To update, please visit the <a onclick='window.ipc.openInBrowser(\"" + url + "\");' href=''>download page</a>.</p>");
                }
                else if (notifyIfUpToDate)
                {
                    bootbox.alert("<h2>No new updates available!</h2><hr /><p>Your Pixelator [v" + window.defs.version + "] is up to date.</p>");
                }
            }
        });
    }

    // generate and return the html of a number input + slider elements.
    function generateSliderInput(label, id, min, max, val)
    {
        var sliderId = id + 'Slider';
        var inputId = id;
        var html = '' +
        '<label for="' + sliderId + '">_label_:</label><br />' +
        '<div class="proj-slider">' +
          '<input id="_id_Slider" value="_val_" min="_min_" max="_max_" oninput="_id_.value=_id_Slider.value" type="range" class="form-control slider" >' +
        '</div>' +
        '<input id="_id_" value="_val_" min="_min_" max="_max_" oninput="if (_id_.value < _min_) _id_.value = _min_; if (_id_.value > _max_) _id_.value = _max_; _id_Slider.value=_id_.value; $(\'#_id_\').change();" class="form-control proj-slider-val" type="number">';
        return html
            .replace(new RegExp('_label_', 'g'), label)
            .replace(new RegExp('_id_', 'g'), id)
            .replace(new RegExp('_min_', 'g'), min)
            .replace(new RegExp('_max_', 'g'), max)
            .replace(new RegExp('_val_', 'g'), val);
    }

    // replace all slider placeholders with the actual slider
    $('.slider-placeholder').each(function(index, elem) {

        elem = $(elem);
        var label = elem.data('label');
        var min = elem.data('min');
        var max = elem.data('max');
        var val = elem.data('val');
        var id = elem.attr('id');
        var newElem = $(generateSliderInput(label, id, min, max, val));
        elem.parent().append(newElem);
        elem.remove();
    })

    // init color pickers
    $(function() {
        $('.colorpicker-component').colorpicker({
            format: 'hex',
            colorSelectors: window.defs.basic_colors
        });
    });

    // init split previews
    Split(['#source-h', '#preview-h'], {
        sizes: [50, 50],
        minSize: 200
    });
    Split(['#source-v', '#preview-v'], {
        direction: 'vertical',
        sizes: [50, 50],
        minSize: 200
    });
    $("#images-h").hide();

    // check for update when start
    setTimeout(function() {
		try {
			checkForUpdates(false);
		}
		catch (e) {}
    }, 100);


    // read license file
    window.ipc.readFile(window.defs.license_path, function(err, data) {

        // handle errors (unless its file not found which we ignore)
        if (err) {
            if (String(err).indexOf("no such file") === -1) {
                bootbox.alert("<h2>Error Reading License!</h2><hr /><p>Problem with license file: " + err + "</p>");
            }
        }
        // license file exists, parse it
        else {
            try {
                window.defs.license = JSON.parse(data);
            }
            catch (e) {
                bootbox.alert("<h2>Corrupted License!</h2><hr /><p>Could not parse license file.</p>");
            }
        }

        // show warning based on license (or lack of it)
        if (window.defs.license.type === "personal") {
            $("#personalLicenseWarning").show();
        }
        else if (window.defs.license.type === "unlicensed") {
            $("#noLicenseWarning").show();
        }

    });


    // copy image to clipboard
    window.copyPreviewToClipboard = function()
    {
        window.ipc.copyPreviewImgToClipboard();
    }

})();/*
Init callbacks for top navbar menu.
Software: Pixelator.
Author: Ronen Ness.
Since: 2018.
*/

(function() {

    // rotate preview images
    $("#menuRotatePreviewPanels").on('click', function()
    {
        var previews = $(".preview-panel");
        previews.each(function(index, elem) {
            $(elem).toggle();
        });
    });

    // process whole folder
    $("#menuProcessWholeFolder").on('click', function() 
    {
        bootbox.alert("This option will iterate a folder and process all image files in it. Watch out! It will replace the original files.", function(){ 
            window.ipc.openFolderDialog((destFolder) => {

                // log
                console.log("Process folder: " + destFolder);

                // get all image files in folder
                window.ipc.getAllImageFiles(destFolder, (files) => {

                    // got error?
                    if (files == null) {
                        bootbox.alert("Failed to get files in destination folder!");
                        return;
                    }

                    // no files to process?
                    if (files.length === 0) {
                        bootbox.alert("No image files to process were found in selected folder!");
                        return;
                    }

                    // get data dictionary
                    var data = getProjectSettingsFromForm();
                    var currIndex = 0;

                    bootbox.alert("<h2 id='batch-process-all-msg'>Processed files: <span id='batch-process-progress'>0/" + files.length + "</span></p>");

                    // process next file
                    var processNext = () => 
                    {
                        // set current file and convert to command
                        var destFile = files[currIndex];
                        data.destFile = destFolder + '/' + destFile;
                        data.srcFile = data.destFile;
                        var cmd = getCommandLine(data) + ' --override';
                        var hadError = false;

                        // execute command
                        window.ipc.executeShell(cmd,

                            // success output
                            function(data) {
                                currIndex++;
                                document.getElementById('batch-process-progress').innerHTML = currIndex.toString() + '/' + files.length.toString();
                                if (currIndex < files.length) {
                                    processNext();
                                }
                                else {
                                    document.getElementById('batch-process-all-msg').innerHTML = "Done! Successfully processed " + files.length + " files!";
                                }
                            },
                            // error
                            function(data) {
                                hadError = true;
                                if (String(data).indexOf("UnicodeEncodeError") != -1)
                                {
                                    bootbox.alert("<h2>Invalid filename!</h2><hr /><p>Please use English only for filenames.</p>");
                                }
                                else
                                {
                                    bootbox.alert("<h2>Unexpected Error!</h2><hr /><p>Error while exporting image: " + data + ".</p>");
                                }
                            },
                            // done
                            function(data) {
                            }
                        );
                    }

                    // invoke first call
                    processNext();
                });
            });
        });
    });

    // export as
    $("#menuExportImage").on('click', function()
    {
        window.ipc.openSaveAsDialog((destFile) => {
            if (destFile && destFile !== 'undefined')
            {
                // get command to run
                var data = getProjectSettingsFromForm();
                data.destFile = destFile;
                var cmd = getCommandLine(data);
                var hadError = false;

                // no source file? skip
                if (!data.srcFile)
                {
                    bootbox.alert("<h2>No Source File!</h2><hr /><p>Must select a source file first.</p>");
                    return;
                }

                // execute command
                window.ipc.executeShell(cmd,

                    // output
                    function(data) {
                    },
                    // error
                    function(data) {
                        hadError = true;
                        if (String(data).indexOf("UnicodeEncodeError") != -1)
                        {
                            bootbox.alert("<h2>Invalid filename!</h2><hr /><p>Please use English only for filenames.</p>");
                        }
                        else
                        {
                            bootbox.alert("<h2>Unexpected Error!</h2><hr /><p>Error while exporting image: " + data + ".</p>");
                        }
                    },
                    // done
                    function(data) {
                        if (!hadError)
                            bootbox.alert("<h2>Success!</h2><hr /><p>Successfully exported picture as: " + destFile + ".</p>");
                    }
                );
            }
        });
    });

    // show missing license error
    function showMissingLicenseError()
    {
        bootbox.alert("<h2>Missing License!</h2><hr />" +
                      "<p>This software is not licensed. To acquire a license, please visit the " +
                      "<a href='#' onclick='window.ipc.openInBrowser(window.defs.siteUrl);'>Pixelator website</a>.</p>");
    }

    // show license data in browser
    window.showLicenseDataInBrowser = function()
    {
        var licenseType = window.defs.license.type;
        var url = window.defs.siteUrl + 'buy_license_' + licenseType + '.html?info&' + new Date().getTime();
        window.ipc.openInBrowser(url);
    }

    // online help
    $("#menuShowOnlineHelp").on('click', function()
    {
        var url = window.defs.siteUrl + 'faq.html?info&' + new Date().getTime();
        window.ipc.openInBrowser(url);
    });

    // about
    $("#menuAbout").on('click', function()
    {
        bootbox.alert("<h2>Pixelator V" + window.defs.version + "</h2><hr /><p>Made by <a href='#' onclick='window.ipc.openInBrowser(window.defs.personalUrl);'>Ronen Ness</a>.</p><p>For more info: <a onclick='window.ipc.openInBrowser(window.defs.siteUrl);' href='#'>" + window.defs.siteUrl + "</a></p>");
    });

    // buy license
    $("#menuBuyLicense").on('click', function()
    {
        var url = window.defs.siteUrl + 'buy.html';
        window.ipc.openInBrowser(url);
    });

    // check for updates
    $("#menuCheckForUpdates").on('click', function()
    {
        checkForUpdates(true);
    });

    // exit button
    $("#menuExit").on('click', function()
    {
        const remote = require('electron').remote;
        let w = remote.getCurrentWindow();
        w.close();
    });

    // save current as default
    $("#menuEditSaveCurrentAsDefault").on('click', function()
    {
        var data = getProjectSettingsFromForm();
        data.destFile = null;
        data.srcFile = null;
        window.ipc.saveDefaultSettings(JSON.stringify(data));
        bootbox.alert("<h2>Defaults Saved!</h2><hr /><p>New default settings were set, new projects will now use these settings.</p>");
    });

    // reset saved defaults
    $("#menuEditResetDefaults").on('click', function()
    {
        window.ipc.removeDefaultSettings();
        bootbox.alert("<h2>Defaults Removed!</h2><hr /><p>Saved defaults file was removed, new projects will now have factory default settings.</p>");
    });

    // show saved defaults
    $("#menuEditShowDefaults").on('click', function()
    {
        var savedDefaults = window.ipc.getSavedDefaults();
        if (savedDefaults)
        {
            savedDefaults = String(savedDefaults).split(',').join(', ');
            bootbox.alert("<h2>Saved Defaults</h2><hr /><p>When starting a new project it will use the following saved settings: <br />" + savedDefaults + "</p>");
        }
        else
        {
            bootbox.alert("<h2>No Saved Defaults.</h2><hr /><p>There's no saved defaults file, when starting a new project it will use factory defaults.</p>");
        }
    });
 
    // copy preview to clipboard
    $("#copyPreviewToClipboard").on('click', function()
    {
        copyPreviewToClipboard();
        bootbox.alert("<h2>Image Copied.</h2><hr /><p>Copied preview image to clipboard.</p>");
    });   

    // show shell command to create preview
    $("#menuShowShellCmd").on('click', function()
    {
        var data = getProjectSettingsFromForm();
        var cmd = getCommandLine(data);
        bootbox.alert("<h2>Shell Command</h2><hr /><p>The following shell command was used to generate the preview image (click to copy):</p><br /><input onclick='this.select(); document.execCommand(\"Copy\");' readonly style='width:100%;' value='" + cmd + "' >");
    });

    // toggle dark theme
    $("#menuToggleDarkTheme").on('click', function()
    {
        toggleDarkTheme();     
    });
    
    // enable / disable dark theme
    var _darkTheme = false;
    function toggleDarkTheme()
    {
        // remove dark theme
        if (_darkTheme) {
            $("#dark-theme-css").remove();
        }
        // add dark theme
        else {
            $('<link rel="stylesheet" id="dark-theme-css" href="css/dark-theme.css" type="text/css" />').insertBefore($("#custom-css-link"));
            
        }
        _darkTheme = !_darkTheme;
        localStorage.setItem("_darkTheme", _darkTheme ? "1" : "0");
    }
    
    // load dark theme on start
    if (localStorage.getItem("_darkTheme") == "1") {
        toggleDarkTheme();
    }

    // show source file location
    $("#menuShowSourceFile").on('click', function()
    {
        window.ipc.openFile(getProjectSettingsFromForm().srcFile);
    });

    // show source file location
    $("#menuShowSourceFileLocation").on('click', function()
    {
        window.ipc.openFolder(getProjectSettingsFromForm().srcFile);
    });

    // save project
    $("#menuSaveProject").on('click', function()
    {
        // if there's no project name, open the save-as dialog
        if (!window.defs.currentProjectName) {
            return $("#menuSaveProjectAs").trigger('click');
        }

        // save project
        saveProject(window.defs.currentProjectName);
    });

    // save project as
    $("#menuSaveProjectAs").on('click', function()
    {
        window.ipc.openSaveProjectAsDialog((destFile) => {
            if (destFile && destFile !== 'undefined')
            {
                saveProject(destFile);
            }
        });
    });

    // load project
    $("#menuOpenProject").on('click', function()
    {
        var srcFile = window.ipc.openLoadProjectDialog((srcFile) => {
            if (srcFile && srcFile !== 'undefined')
            {
                openProject(String(srcFile));
                window._history = [];
            }
        });
    });

    // undo last action
    $("#menuEditUndo").on('click', function()
    {
        // nothing to undo?
        if (!window._history || window._history.length <= 1)
        {
            bootbox.alert("<h2>Error</h2><hr /><p>No actions to undo!</p>");
            return;
        }

        // get last action (undo twice to remove current and get last)
        window._history.pop();
        var prev = window._history.pop();
        setProjectSettingsFromDict(prev);
    });

    // apply license
    $("#menuApplyLicense").on('click', function()
    {
        window.ipc.openLicenseFileDialog(function(ret) 
        {
            if (ret.canceled) { return; }
            var licensePath = String(ret.filePaths[0]);
            console.log("Path:", licensePath)
            var data = window.ipc.readFileSync(licensePath);
            try {
                var license = JSON.parse(data);
                var b = license['owner'].length;
                var b = license['key'].length;
            }
            catch (e) {
                bootbox.alert("<h2>Invalid License!</h2><hr /><p>The license file you provided is not a valid Pixelator license file.</p>");
                return;
            }
            try
            {
                window.ipc.applyLicense(data);
            }
            catch (e) {
                if (String(e).indexOf("operation not permitted") !== -1)
                {
                    bootbox.alert("<h2>Unexpected error!</h2><hr /><p>Could not write license file. Perhaps you run Pixelator with wrong user / privileges? Please try to execute Pixelator as administrator and try again.</p>");
                }
                else
                {
                    bootbox.alert("<h2>Unexpected error!</h2><hr /><p>There was a problem applying the new license: " + e + ".</p>");
                }
                return;
            }
            window.defs.license = license;
            bootbox.alert("<h2>Success!</h2><hr /><p>New license was applied successfully: '" + license['owner'] + " / " + license['type'] + "'.</p>");
            $(".license-alert").hide();

        });    
    });

    // save current project under a given name
    function saveProject(destFile)
    {
        window.defs.currentProjectName = destFile;
        window.ipc.saveProjectAs(destFile, JSON.stringify(getProjectSettingsFromForm()));
        document.title = 'Pixelator - ' + destFile;
        bootbox.alert("<h2>Success!</h2><hr /><p>Project saved successfully to: '" + destFile + "'.</p>");
    }

    // load project file
    function openProject(srcFile)
    {
        // read project file
        try {
            var data = window.ipc.readProjectFile(srcFile);
        }
        catch (e) {
            return bootbox.alert("<h2>Error!</h2><hr /><p>Error reading project file: '" + err + "'.</p>");
        }

        // parse json
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            return bootbox.alert("<h2>Error!</h2><hr /><p>Bad project file format (not JSON).</p>");
        }

        // load data
        try {
            window.defs.currentProjectName = srcFile;
            document.title = 'Pixelator - ' + srcFile;
            setProjectSettingsFromDict(data);
        }
        catch (e) {
            return bootbox.alert("<h2>Error!</h2><hr /><p>Missing or bad values in file, project wasn't fully loaded.</p>");
        }
    }

    // reset to defaults
    $("#menuNewProject").on('click', function() 
    {
        resetProjectSettings();
    });

    // license details
    $("#menuShowLicense").on('click', function()
    {
        var licenseType = window.defs.license.type;
        if (licenseType == 'unlicensed')
        {
            showMissingLicenseError();
            return;
        }
        var license = window.defs.license;
        bootbox.alert("<h2>License Details</h2><hr />" +
                        "<p><strong>Type:</strong> " + license.type + "</p>" +
                        "<p><strong>Owner:</strong> " + license.owner + "</p>" +
                        "<p><strong>Email:</strong> " + license.email + "</p>" +
                        "<p><strong>Valid Since:</strong> " + (new Date(license.since)) + "</p>" +
                        "<p><strong>Secret Key:</strong> " + license.key + "</p>" +
                        "<p>For more details, <a href='#' onclick='showLicenseDataInBrowser();'>click here</a>.</p>"
                        );
    });

    // read eula
    $("#menuShowEulaDetails").attr('href', window.defs.siteUrl + 'eula.html?info&' + new Date().getTime()).attr('target', '_blank');

})();/*
All the callbacks for the project settings themselves.
Software: Pixelator.
Author: Ronen Ness.
Since: 2018.
*/


(function() {
    
    // test if ascii regex
    var isAscii = /^[ -~]+$/;
    
    // whenever user pick source file from the file input, update source file path
    $("#SourceFile").change(function(){
        if (this.files && this.files[0]) { 
            if ( !isAscii.test( this.files[0].path ) ) {
              return bootbox.alert("<h2>Illegal Filename</h2><p>Source filename cannot contain non-English characters!</p>");
            }
            setSourcePath(this.files[0].path);
        }
    });

    // whenever user pick palette file from the file input, update palette file path
    $("#PaletteFile").change(function(){
        if (this.files && this.files[0]) {
            if ( !isAscii.test( this.files[0].path ) ) {
              return bootbox.alert("<h2>Illegal Filename</h2><p>Palette filename cannot contain non-English characters!</p>");
            }
            setPalettePath(this.files[0].path);
        }
    });

    // are we during a preview update?
    window._during_update = false;

    // current preview version
    var _preview_version_actual = 0;

    // current updates version (eg desired preview version).
    var _preview_version_desired = 0;

    // create preview image
    window.rebuildPreview = function (force) {

        // if forcing update
        if (force) {
            _preview_version_desired++;
        }

        // if up-to-date or currently updating, skip
        if ((_preview_version_actual == _preview_version_desired) || window._during_update) {
            return;
        }

        // set that we are being updated
        window._during_update = true;

        // update version
        _preview_version_actual = _preview_version_desired;

        // get command to run
        var data = getProjectSettingsFromForm();
        var cmd = getCommandLine(data);

        // add to history 
        window._history = window._history || [];
        window._history.push(data);
        if (window._history.length > 10) {
            window._history.shift(0);
        }

        // no src / dest file?
        if (!data.srcFile || !data.destFile) {
            window._during_update = false;
            return;
        }

        // show loading spinner
        $("#loading-spin").show();

        // execute command
        window.ipc.executeShell(cmd,

            // output
            function(data) {
                if (data.indexOf('Invalid license') !== -1) {
                    var url = window.defs.siteUrl + "support.html";
                    bootbox.alert("<h2>Problem with License!</h2><p>There was an error parsing your license file, please <a href='#' onclick='window.ipc.openInBrowser(\"" + url + "\");'>contact support</a> to fix it (the software is currently considered unlicensed).</p>");
                }
            },
            // error
            function(data) {

                // convert error to string
                data = String(data);

                // file not found error
                if (data.indexOf("File not found") !== -1) {
                    bootbox.alert("<h2>Unexpected Error!</h2><p>Cannot write / load preview image. Are you running Pixelator with wrong user / privileges? Please try to execute Pixelator as administrator and try again.</p>");
                }
                // problem with palette size
                else if (data.indexOf("ValueError: invalid palette size") !== -1) {
                    bootbox.alert("<h2>Invalid Palette File!</h2><p>Chosen palette size is too big, please use smaller palette file. To see example of valid palettes, please see 'palettes' folder under Pixelator installation dir.</p>");
                    return;
                }
                // different errors
                else {

                    // make sure _pixelator_cmd exists and have execute privilege
                    try {
                        if (!window.ipc.canExecuteFile(window.defs.pixelator_command)) {
                            bootbox.alert("<h2>Unexpected Error!</h2><p>File '" + window.defs.pixelator_command + "' is not found or lacking execution permissions.</p>");
                            return;
                        }
                    }
                    catch (e) {}

                    // generic error
                    bootbox.alert("<h2>Unexpected Error!</h2><p>Error while creating preview: " + data + ".</p>");
                }
            },
            // done
            function(data) {

                // no longer updating, show result
                window._during_update = false;
                $('.preview-pic.result').attr('src', window.defs.preview_img_path + "?" + new Date().getTime());

                // show spinner
                $("#loading-spin").hide();
            }
        );
    }


    // build command line from params
    window.getCommandLine = function(params, asArrays) {
        
        // set command with basic params
        var ret = '"' + window.defs.pixelator_command + '"' + " \"@__srcFile__@\" \"@__destFile__@\" --pixelate @__pixelate__@ --colors @__colors__@ --palette_mode @__palette__@ --enhance @__enhance__@ --smooth @__smooth__@ --smooth_iterations @__smoothIter__@ --refine_edges @__opacityThresh__@ --stroke @__stroke__@ --stroke_opacity @__strokeOpacity__@ --stroke_on_colors_diff @__strokeOnColors__@ --background @__background__@ --stroke_color @__strokecolor__@ @__resize__@ @__diagonalStroke__@ @__paletteStroke__@ --palette_file \"@__paletteFile__@\"";
        ret = ret.replace('@__srcFile__@', params.srcFile);
        ret = ret.replace('@__paletteFile__@', params.paletteFile || window._defaultPaletteFile);
        ret = ret.replace('@__destFile__@', params.destFile);
        ret = ret.replace('@__pixelate__@', params.pixelate);
        ret = ret.replace('@__colors__@', params.colors);
        ret = ret.replace('@__palette__@', params.palette);
        ret = ret.replace('@__enhance__@', params.enhance / 10.0);
        ret = ret.replace('@__smooth__@', params.smooth);
        ret = ret.replace('@__smoothIter__@', params.smoothIter);
        ret = ret.replace('@__opacityThresh__@', params.opacityThreshold);
        ret = ret.replace('@__stroke__@', params.stroke);
        ret = ret.replace('@__strokeOpacity__@', params.strokeOpacity / 255.0);
        ret = ret.replace('@__strokeOnColors__@', params.strokeOnColors / 255.0);
        ret = ret.replace('@__background__@', '"' + params.background + '"');
        ret = ret.replace('@__resize__@', params.resize ? "--resize" : "");
        ret = ret.replace('@__diagonalStroke__@', params.diagonalStroke ? "--stroke_diagonal" : "");
        ret = ret.replace('@__paletteStroke__@', params.paletteStroke ? "--stroke_col_from_palette" : "");
        ret = ret.replace('@__strokecolor__@', '"' + params.strokeColor + '"');

        // break to params array (if requested)
        if (asArrays)
        {
            var parts = ret.split(' ');
            while (parts.indexOf(' ') !== -1) {
                parts.remove(' ');
            }
            ret = parts;
        }
        return ret;
    }

    // get a dictionary with all the project current settings from form
    window.getProjectSettingsFromForm = function() {
        
        // get all form values
        var form = $('#project-settings');
        var ret = {
            srcFile: form.find('#SourceFile').data('path'),
            paletteFile: form.find('#PaletteFile').data('path') || "",
            destFile: window.defs.preview_img_path,
            pixelate: parseFloat(form.find('#PixelateFactor').val()),
            palette: form.find('#PaletteType').val(),
            colors: parseInt(form.find('#ColorsInPalette').val()),
            enhance: parseInt(form.find('#EnhanceFactor').val()),
            smooth: parseInt(form.find('#SmoothFactor').val()),
            smoothIter: parseInt(form.find('#SmoothIterations').val()),
            opacityThreshold: parseInt(form.find('#OpacityThreshold').val()),
            stroke: form.find('#StrokeType').val(),
            strokeOpacity: parseInt(form.find('#StrokeOpacity').val()),
            strokeOnColors: parseInt(form.find('#StrokeOnColorChange').val()),
            strokeColor: window.defs.colValToHex(form.find('#StrokeColor').colorpicker('getValue')),
            background: window.defs.colValToHex(form.find('#BackgroundColor').colorpicker('getValue')),
            resize: form.find('#ResizeResult').is(":checked"),
            diagonalStroke: form.find('#DiagonalStroke').is(":checked"),
            paletteStroke: form.find('#PaletteStroke').is(":checked"),
        };

        return ret;
    }

    // on palette-type change
    $('#PaletteType').change(function()
    {
        // get palette mode
        var mode = form.find('#PaletteType').val();

        // if file palette:
        if (mode == "file" || mode == "file_dither")
        {
            $("#palette-file-div").show();
            $("#colors-count-div").hide();
        }
        else
        {
            $("#palette-file-div").hide();
            $("#colors-count-div").show();
        }
    });

    // set form from a dictionary of params
    window.setProjectSettingsFromDict = function(data) {

        var form = $('#project-settings');
        setSourcePath(data.srcFile);
        setPalettePath(data.paletteFile || "");
        form.find('#PixelateFactor').val(data.pixelate).change().trigger("input");
        form.find('#PaletteType').val(data.palette).change().trigger("input");
        form.find('#ColorsInPalette').val(data.colors).change().trigger("input");
        form.find('#EnhanceFactor').val(data.enhance).change().trigger("input");
        form.find('#SmoothFactor').val(data.smooth).change().trigger("input");
        form.find('#SmoothIterations').val(data.smoothIter).change().trigger("input");
        form.find('#OpacityThreshold').val(data.opacityThreshold).change().trigger("input");
        form.find('#StrokeType').val(data.stroke).change().trigger("input");
        form.find('#StrokeOpacity').val(data.strokeOpacity).change().trigger("input");
        form.find('#StrokeOnColorChange').val(data.strokeOnColors).change().trigger("input");
        form.find('#StrokeColor').colorpicker('setValue', data.strokeColor);
        form.find('#BackgroundColor').colorpicker('setValue', data.background);
        form.find('#ResizeResult').prop('checked', data.resize).change().trigger("input");
        form.find('#DiagonalStroke').prop('checked', data.diagonalStroke).change().trigger("input");
        form.find('#PaletteStroke').prop('checked', data.paletteStroke).change().trigger("input");
    }

    // reset all properties
    window.resetProjectSettings = function() 
    {
        // try to get saved defaults file
        var savedDefaults = window.ipc.getSavedDefaults();
        if (savedDefaults) savedDefaults = JSON.parse(savedDefaults);

        // set settings
        setProjectSettingsFromDict(savedDefaults || window._projectDefaults);
        setSourcePath("");
        setPalettePath("");
        window._history = [];
    }

    // set new source path value
    window.setSourcePath = function(path)
    {
        var form = $('#project-settings');
        form.find('#SourceFile').data('path', path || "");
        $('.preview-pic.source').attr('src', path || "");
        $('#SourceFileShow').text(path || "No source file selected.");
        $('.preview-pic.result').attr('src', "");
        needNewPreview();
    }

    // set new palette path value
    window.setPalettePath = function(path)
    {
        var form = $('#project-settings');
        form.find('#PaletteFile').data('path', path || "");
        $('#PaletteFileShow').text(path || "No palette file selected.");
        needNewPreview();
    }

    // update image for every change in project params
    var form = $('#project-settings');
    form.find('input').change(function() {
        needNewPreview();
    });
    form.find('select').change(function() {
        needNewPreview();
    });

    // notify that we need to regenerate preview
    window.needNewPreview = function()
    {
        if ($("#AutoUpdate").is(':checked')) {
            _preview_version_desired++;
        }
    }

    // add files drag-drop functionality into app
    document.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var path = e.dataTransfer.files[0].path;
            if (['png', 'jpg', 'ico', 'bmp', 'gif', 'jpeg'].indexOf(path.split('.').reverse()[0].toLowerCase()) === -1)
            {
                 alert("File format unsupported!");
                 return;
            }
            window.setSourcePath(path);
            return;
        });
        document.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // init timer to auto-update preview
    setInterval(function() {
        if ($("#AutoUpdate").is(':checked'))
            rebuildPreview();
    }, 100);

    // auto-update source image if changed from disk
    setInterval(function() {
        var path = form.find('#SourceFile').data('path');
        if (path) {
            $('.preview-pic.source').attr('src', path + "?" + new Date().getTime());
        }
    }, 5000);

    // fix stroke default color
    setTimeout(function() {
        var form = $('#project-settings');
        form.find('#StrokeColor').colorpicker('setValue', "#000000");
    }, 100);

    // store project defaults
    window._projectDefaults = getProjectSettingsFromForm();
    resetProjectSettings();
})();