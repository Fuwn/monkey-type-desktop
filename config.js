'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		debugEnable: false,
		menuEnable: true,
		configCookieOverwrite: '',
        discordRPCEnable: true,
		discordRPC: {
			clientId: '722389325483999243',
			RPC: {
				details: 'Typing on Monkey Type',
				state: 'Desktop Application Beta',
				smallImageText: '',
				smallImageKey: '',
				largeImageText: 'Monkey Type',
				largeImageKey: 'icon',
				refreshTime: 15
			}
		},
		dontTouch: {
			updateCounter: 0
		}
	}
});
