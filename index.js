/* Main Process JavaScript */

// This script is the first to be ran and loads the HTML file that then loads the appropriate JS and CSS files.

const electron = require('electron');
const os = require('os');
// const ipcMain = require('electron').ipcMain;

const { app, BrowserWindow, dialog, ipcMain: ipc } = electron;

console.log('running index.js');
console.log(`Host Device: '${os.hostname()}'`);

app.on('browser-window-created', (e, window) => {

	window.setMenu(null);

});

let indexOpenDialogTime = 0;

ipc.on('open-dialog', (event, options) => {

	if (indexOpenDialogTime && Date.now() - indexOpenDialogTime < 1000) return;
	indexOpenDialogTime = Date.now();

	console.log('Showing File Open Dialog.');

	dialog.showOpenDialog(options, (filename) => {

		event.sender.send('opened-file', filename);

	});

});

ipc.on('save-dialog', (event, options) => {

	console.log('Showing File Save Dialog.');

	dialog.showSaveDialog(options, (filename) => {

		event.sender.send('saved-file', filename);

	});

});

app.on('ready', () => {

	let win = null;

	// If running on Brayden's laptop, open the program in development mode.
	if (os.hostname() === 'BRAYDENS-LENOVO') {

		console.log('Opening in development mode.');
		console.log('electron', electron);

		win = new BrowserWindow({
			// show: false,
			width: 990,
			height: 810,
			// fullscreen: true,
			// kiosk: true,
			// frame: false,
			// backgroundColor: '#eaedf4',
			backgroundThrottling: false,
			// webPreferences: {
			// 	nodeIntegration: false
			// }
			icon: `${__dirname}/icon.ico`
		});

	} else {  // If not running on Brayden's laptop, open the program in deployment mode.

		console.log('Opening in deployment mode.');

		win = new BrowserWindow({
			// show: false,
			width: 990,
			height: 810,
			// fullscreen: true,
			// kiosk: true,
			// frame: false,
			// backgroundColor: '#eaedf4',
			backgroundThrottling: false,
			// webPreferences: {
			// 	nodeIntegration: false
			// }
			icon: `${__dirname}/icon.ico`
		});

	}

	win.loadURL(`file://${__dirname}/main.html`);

	if (os.hostname() === 'BRAYDENS-LENOVO') win.webContents.openDevTools();

	win.webContents.on('did-finish-load', () => {

		console.log('Got \'did-finish-load\' event.');

	});

	// Called after all widgets initBody() functions and after initial visibility has been set and sidebar buttons have been created.
	ipc.on('all-widgets-loaded', () => {

		win.show();

		console.log('Got ipcMain event: \'all-widgets-loaded\'.\n  ...showing window.');

	});

	ipc.on('open-dev-tools', () => {

		win.webContents.openDevTools();

		console.log('Got ipcMain event: \'open-dev-tools\'.');

	});

	win.on('close', () => {

		win = null;

	});

});
