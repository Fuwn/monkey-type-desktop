/* jshint esversion: 9 */

'use strict';
const path = require('path');
const { app, BrowserWindow, Menu, session, globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');
const { is } = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');

const menuEnable = config.get('menuEnable');
const menu = require('./menu');

const DiscordRPC = require('discord-rpc');
const { start } = require('repl');

unhandled();
contextMenu();

const debugEnable = config.get('debugEnable');
if (debugEnable) debug();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.sin.monkey-type-desktop');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
if (!is.development) {
	const FOUR_HOURS = 1000 * 60 * 60 * 4;
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, FOUR_HOURS);

	autoUpdater.checkForUpdates();
}

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 960,
		height: 540,
		icon: path.join(__dirname, '/static/icon.png')
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadURL('https://monkeytype.com/');

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

const clientId = config.get('discordRPC').clientId;
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

function setActivity() {
	if (!rpc || !mainWindow) {
		return;
	}

	// You can add your own presence application or presence data in the config.
	// If you wanted to, you could try to get data from monkey type time left value and set this as the endTimestamp value.
	rpc.setActivity({
		details: config.get('discordRPC').RPC.details,
		state: config.get('discordRPC').RPC.state,
		largeImageKey: config.get('discordRPC').RPC.largeImageKey,
		largeImageText: config.get('discordRPC').RPC.largeImageText,
		// smallImageKey: config.get('discordRPC').RPC.smallImageKey,
		// smallImageText: config.get('discordRPC').RPC.smallImageText,
		startTimestamp: startTimestamp
	});
}

rpc.on('ready', () => {
	setActivity();
    console.log('DiscordRPC: Initial set completed.');

	setInterval(() => {
		setActivity();
        console.log('DiscordRPC: Refresh set completed.');
	}, 15e3);
});

if (config.get('discordRPCEnable'))
    rpc.login({ clientId }).catch(console.error);

(async () => {
	await app.whenReady();
	menuEnable ? Menu.setApplicationMenu(menu) : Menu.setApplicationMenu(null);
	mainWindow = await createMainWindow();

	// session.defaultSession.cookies.get({}).then(cookies => console.log(cookies));

	// A more complete and custom config system will be implemented but at the moment you can just transfer your config cookie.
	if (config.get('configCookieOverwrite').length > 50) {
		const configCookie = { name: 'config', value: config.get('configCookieOverwrite') };
		session.defaultSession.cookies.set(configCookie).then(() => {}, error => console.error(error));
	}
})();
