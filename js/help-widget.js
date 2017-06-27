/* Help Widget JavaScript */

// TODO: Put in a gcode reference table for M-commands, G-commands and their modifiers.

define([ 'jquery' ], $ => ({

	id: 'help-widget',
	name: 'Help',
	shortName: null,
	btnTheme: 'info',
	icon: 'glyphicon glyphicon-info-sign',
	desc: '',
	publish: {},
	subscribe: {},
	foreignPublish: {
		'/main/widget-loaded': ''
	},
	foreignSubscribe: {
		'/main/all-widgets-loaded': '',
		'/main/window-resize': '',
		'/main/widget-visible': ''
	},

	widgetDom: [],
	widgetVisible: false,

	initBody() {

		console.group(`${this.name}.initBody()`);

		subscribe('/main/window-resize', this, this.resizeWidgetDom.bind(this));
		subscribe('/main/widget-visible', this, this.visibleWidget.bind(this));

		publish('/main/widget-loaded', this.id);

		return true;

	},
	resizeWidgetDom() {

		if (!this.widgetVisible) return false;

		const that = this;
		const containerHeight = $(`#${this.id}`).height();

		let marginSpacing = 0;
		let panelSpacing = 0;

		$.each(this.widgetDom, (panelIndex, panel) => {

			marginSpacing += Number($(`#${that.id} .${panel}`).css('margin-top').replace(/px/g, ''));

			if (panelIndex === that.widgetDom.length - 1) {

				marginSpacing += Number($(`#${that.id} .${panel}`).css('margin-bottom').replace(/px/g, ''));

				const panelHeight = containerHeight - (marginSpacing + panelSpacing);

				$(`#${that.id} .${panel}`).css({ height: `${panelHeight}px` });

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
