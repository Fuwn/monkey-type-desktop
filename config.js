'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		debugEnable: false,
		menuEnable: true
	}
});
