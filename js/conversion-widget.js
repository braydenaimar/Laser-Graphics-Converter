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

define([ 'jquery' ], $ => ({

	// id - must match the widget name (the name given to this file).
	id: 'conversion-widget',
	// name - The moniker that appears in the top left-hand corner ow the app.
	name: 'Converter',
	// shortName - The moniker that appears on the widget's button on the right-hand side of the app.
	shortName: null,
	// btnTheme - The theme used for the widget's button on the right-hand side of the app.
	btnTheme: 'default',
	// icon - The icon that appears on the widget's button on the right-hand side of the app.
	icon: 'fa fa-cogs',
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

	initBody() {

		console.group(`${this.name}.initBody()`);

		subscribe('/main/window-resize', this, this.resizeWidgetDom.bind(this));
		subscribe('/main/widget-visible', this, this.visibleWidget.bind(this));

		publish('/main/widget-loaded', this.id);

		const openOptions = {
			title: 'Open a File',
			filters: [
				{ name: 'Images', extensions: [ 'jpg', 'png', 'gif' ] }
			],
			properties: [ 'openFile' ]
		};

		ipc.send('open-dialog', openOptions);

		ipc.on('opened-file', (event, path) => {

			if (!path) path = 'No open path';

			console.log(`Open path selected: ${path}`);

		});

		const saveOptions = {
			title: 'Save an Image',
			filters: [
				{ name: 'Images', extensions: [ 'jpg', 'png', 'gif' ] }
			]
		};

		ipc.send('save-dialog', saveOptions);

		ipc.on('saved-file', (event, path) => {

			if (!path) path = 'No save path';

			console.log(`Save path selected: ${path}`);

		});

		return true;

	},
	resizeWidgetDom() {

		if (!this.widgetVisible) return false;

		const that = this;
		let containerHeight = $(`#${this.id}`).height();

		let marginSpacing = 0;
		let panelSpacing = 0;

		$.each(this.widgetDom, (panelIndex, panel) => {

			// console.log("  panelIndex:", panelIndex, "\n  panel:", panel);
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

	}

})  /* arrow-function */
);	/* define */
