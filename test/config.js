'use strict';
const Store = require('electron-store');

// You can set these values pretty easily in the index.js, you just need to add the corresponding data types to the setActivity function.
// You can also find a complete list of all of the types and what they do here; https://github.com/8cy/pydii/blob/master/README.MD#config-explained

module.exports = new Store({
	defaults: {
		debugEnable: false,
		menuEnable: true,
		discordRPC: {
			clientId: "722389325483999243",
			timeEnable: true,
			RPC: {
				details: "Typing on Monkey Type",
				state: "Desktop Application Beta",
				startTimestamp: 0,
				endTimestamp: 0,
				smallImageText: "",
				smallImageKey: "",
				largeImageText: "Monkey Type",
				largeImageKey: "icon",
				refreshTime: 15,
				instance: true,
				match: "",
				party: "",
				partyMax: "",
				join: "",
				spectate: ""
			}
		},
		dontTouch: {
			updateCounter: 0
		}
	}
});
