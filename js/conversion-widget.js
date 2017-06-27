/**
 *    ____                              _              __        ___     _            _         _                  ____            _       _
 *   / ___|___  _ ____   _____ _ __ ___(_) ___  _ __   \ \      / (_) __| | __ _  ___| |_      | | __ ___   ____ _/ ___|  ___ _ __(_)_ __ | |_
 *  | |   / _ \| '_ \ \ / / _ \ '__/ __| |/ _ \| '_ \   \ \ /\ / /| |/ _` |/ _` |/ _ \ __|  _  | |/ _` \ \ / / _` \___ \ / __| '__| | '_ \| __|
 *  | |__| (_) | | | \ V /  __/ |  \__ \ | (_) | | | |   \ V  V / | | (_| | (_| |  __/ |_  | |_| | (_| |\ V / (_| |___) | (__| |  | | |_) | |_
 *   \____\___/|_| |_|\_/ \___|_|  |___/_|\___/|_| |_|    \_/\_/  |_|\__,_|\__, |\___|\__|  \___/ \__,_| \_/ \__,_|____/ \___|_|  |_| .__/ \__|
 *                                                                         |___/                                                    |_|
 *
 *  @author Brayden Aimar
 */

/* eslint-disable padded-blocks */
/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

define([ 'jquery' ], $ => ({

	// id - must match the widget name (the name given to this file).
	id: 'conversion-widget',
	// name - The moniker that appears in the top left-hand corner ow the app.
	name: 'File Converter',
	// shortName - The moniker that appears on the widget's button on the right-hand side of the app.
	shortName: 'Converter',
	// btnTheme - The theme used for the widget's button on the right-hand side of the app.
	btnTheme: 'default',
	// icon - The icon that appears on the widget's button on the right-hand side of the app.
	icon: 'fa fa-connectdevelop',
	desc: 'The conversion widget converts GCode files into laser graphics files.',
	publish: {},
	subscribe: {},
	foreignPublish: {
		'/main/widget-loaded': ''
	},
	foreignSubscribe: {
		'/main/all-widgets-loaded': ''
	},

	widgetDom: [ 'conversion-panel' ],
	widgetVisible: false,

	lastOpenFileDialogTime: 0,
	lastParseFileTime: 0,

	initBody() {

		console.group(`${this.name}.initBody()`);

		subscribe('/main/window-resize', this, this.resizeWidgetDom.bind(this));
		subscribe('/main/widget-visible', this, this.visibleWidget.bind(this));

		publish('/main/widget-loaded', this.id);

		// Open File Button.
		$(`#${this.id} .conversion-panel .panel-body`).on('click', 'span.btn', (evt) => {

			const evtData = $(evt.currentTarget).attr('evt-data');

			if (evtData === 'open-file') this.fileOpenDialog();
			else if (evtData === 'save-file') this.fileSaveDialog();

		});

		subscribe('keyboard-shortcut', this, this.keyboardShortcuts);

		return true;

	},
	resizeWidgetDom() {

		if (!this.widgetVisible) return false;

		const that = this;
		let containerHeight = $(`#${this.id}`).height();

		let marginSpacing = 0;
		let panelSpacing = 0;

		$.each(this.widgetDom, (panelIndex, panel) => {

			marginSpacing += Number($(`#${that.id} .${panel}`).css('margin-top').replace(/px/g, ''));

			if (panelIndex === that.widgetDom.length - 1) {

				marginSpacing += Number($(`#${that.id} .${panel}`).css('margin-bottom').replace(/px/g, ''));

				let panelHeight = containerHeight - (marginSpacing + panelSpacing);

				$(`#${that.id} .${panel}`).css({ 'height': `${panelHeight}px` });

			} else {

				panelSpacing += Number($(`#${that.id} .${panel}`).css('height').replace(/px/g, ''));
			}

		});

		return true;

	},
	visibleWidget(wgtVisible, wgtHidden) {

		// If this widget is active, set the widgetVisible flag.
		if (wgtVisible === this.id) {

			this.widgetVisible = true;

			this.resizeWidgetDom();

		// If this widget is hidden, clear the widgetVisible flag.
		} else if (wgtHidden === this.id) {

			this.widgetVisible = false;

		}

		return true;

	},
	keyboardShortcuts(data) {

		// If this widget is not visible, do not apply any keyboard shortcuts and abort this method.
		if (!this.widgetVisible) return false;

		if (data === 'ctrl+o') this.fileOpenDialog();
		else if (data === 'ctrl+s') this.fileSaveDialog();

		return true;

	},

	/**
	 *  Launches the system's file explorer for the user to select a file to open.
	 *
	 *  @method openFileDialog
	 *
	 *  @return {string}       the global file path selected by user
	 */
	fileOpenDialog() {

		if (this.lastOpenFileDialogTime && Date.now() - this.lastOpenFileDialogTime < 1000) return;
		this.lastOpenFileDialogTime = Date.now();

		const openOptions = {
			title: 'Open a File',
			filters: [
				{ name: 'GCode', extensions: [ 'nc' ] }
			],
			properties: [ 'openFile' ]
		};

		console.log('open dialog');

		// Launch the file explorer dialog.
		ipc.send('open-dialog', openOptions);

		// Callback for file explorer dialog.
		ipc.on('opened-file', (event, path) => {

			console.log(`Open path selected: ${path}`);

			// If a file was selected, parse the selected file.
			path && this.openFile(path);

		});

	},

	openFile(filePath) {

		if (this.lastParseFileTime && Date.now() - this.lastParseFileTime < 1000) return;
		this.lastParseFileTime = Date.now();

		console.log(typeof filePath);
		console.log(filePath);

		// Check that a valid file path was passed.
		if (!filePath) throw new Error('Invalid file path.');

		$(`#${this.id} .file-data.file-name`).text(filePath[0]);

		// Asynchronous file read
		fs.readFile(filePath[0], (err, data) => {

			if (err) return console.error(err);

			const lineData = data.toString().split('\n');

			$(`#${this.id} .file-data.file-lines`).text(`${lineData.length} lines`);

			console.groupCollapsed('File Data');
			console.log(lineData);
			console.groupEnd();

			return this.parseFile(lineData);

		});

	},

	parseFile(data) {

		let gcodeData = {
			x: [],
			y: [],
			z: []
		};

		for (let i = 0; i < data.length - 10; i++) {

			let line = data[i];

			// console.log(`Line: '${line}'`);

			if (/[xyz][-0-9.]+/i.test(line)) {

				gcodeData.x.push(0);
				gcodeData.y.push(0);
				gcodeData.z.push(0);

				if (gcodeData.x.length >= 2) {

					for (let key in gcodeData) {

						if ({}.hasOwnProperty.call(gcodeData, key)) {

							let a = gcodeData[key].length - 1;
							let b = gcodeData[key].length - 2;

							gcodeData[key][a] = gcodeData[key][b];

						}

					}

				}

				let matchData = line.match(/[xyz][-0-9.]+/gi);
				// console.log(matchData);

				for (let j = 0; j < matchData.length; j++) {

					let axis = matchData[j].substr(0, 1).toLowerCase();
					let value = Number(matchData[j].substr(1));

					// console.log(`  ${axis.toUpperCase()} ${value}`);

					if (axis === 'z' && value > 0 && !gcodeData.z[0]) {
						for (let a = 0; a < gcodeData.z.length && !gcodeData.z[a]; a++) {

							gcodeData.z[a] = value;

						}

					}

					gcodeData[axis][gcodeData[axis].length - 1] = value;

				}
			}
		}

		// console.log(gcodeData);

		this.parseData(gcodeData);

	},

	parseData(gcodeData) {

		let outputStr = '';
		let laserData = {
			x: [],
			y: [],
			laser: []
		}
		let laserFlag = false;

		for (let i = 0; i < gcodeData.x.length; i++) {

			for (let key in gcodeData) {

				if ({}.hasOwnProperty.call(gcodeData, key)) {
					outputStr += `${gcodeData[key][i]}${key === 'z' ? '\n' : '\t'}`;

				}

			}

		}

		for (let i = 0; i < gcodeData.z.length; i++) {

			if (!gcodeData.z[i] || laserFlag) {

				laserData.x.push(gcodeData.x[i]);
				laserData.y.push(gcodeData.y[i]);
				laserData.laser.push(gcodeData.z[i] ? 0 : 1);

				laserFlag = true;

			}

		}

		laserData.x.push(laserData.x[0]);
		laserData.y.push(laserData.y[0]);
		laserData.laser.push(0);

		// console.log(outputStr);

		this.plotTestData(laserData);

	},

	fileSaveDialog() {

		if (this.lastOpenFileDialogTime && Date.now() - this.lastOpenFileDialogTime < 1000) return;
		this.lastOpenFileDialogTime = Date.now();

		const saveOptions = {
			title: 'Save an Image',
			filters: [
				{ name: 'Images', extensions: [ 'jpg', 'png', 'gif' ] }
			]
		};

		ipc.send('save-dialog', saveOptions);

		ipc.on('saved-file', (event, path) => {

			if (!path) path = 'No file selected.';
			console.log(`Save path selected: ${path}`);

		});

	},

	plotTestData(laserData) {

		console.log(laserData);

		let laserOnTrace = {
			x: [],
			y: [],
			z: [],
			mode: 'lines',
			marker: {
				color: '#9467bd',
				size: 12,
				symbol: 'circle',
				line: {
					color: 'rgb(0,0,0)',
					width: 0
				}
			},
			line: {
				color: 'rgb(44, 160, 44)',
				width: 2
			},
			type: 'scatter3d'
		};

		let laserOffTrace = {
			x: [ 0, 0, 650 ],
			y: [ 0, 650, 650 ],
			z: [ 10, 10, 10 ],
			mode: 'lines',
			marker: {
				color: '#1f77b4',
				size: 12,
				symbol: 'circle',
				line: {
					color: 'rgb(0,0,0)',
					width: 0
				}
			},
			line: {
				color: '#1f77b4',
				width: 0
			},
			type: 'scatter3d'
		};

		let prevLaser = 0;

		for (let i = 0; i < laserData.laser.length; i++) {

			laserOnTrace.x.push(laserData.x[i]);
			laserOnTrace.y.push(laserData.y[i]);
			// If the laser is on.
			if (laserData.laser[i]) {

				laserOnTrace.z.push(1);

			} else {

				laserOnTrace.z.push(0);

			}

		}

		let data = [ laserOffTrace, laserOnTrace ];

		let layout = {
			// title: 'Laser Projection',
			autosize: false,
			showlegend: false,
			width: 650,
			height: 650,
			margin: {
				l: 20,
				r: 20,
				b: 10,
				t: 5
			}
		};

		Plotly.newPlot('myDiv', data, layout);

	}


})  /* arrow-function */
);	/* define */
