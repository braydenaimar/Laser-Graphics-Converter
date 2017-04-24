/**
 *   ____       _   _   _                  __        ___     _            _         _                  ____            _       _
 *  / ___|  ___| |_| |_(_)_ __   __ _ ___  \ \      / (_) __| | __ _  ___| |_      | | __ ___   ____ _/ ___|  ___ _ __(_)_ __ | |_
 *  \___ \ / _ \ __| __| | '_ \ / _` / __|  \ \ /\ / /| |/ _` |/ _` |/ _ \ __|  _  | |/ _` \ \ / / _` \___ \ / __| '__| | '_ \| __|
 *   ___) |  __/ |_| |_| | | | | (_| \__ \   \ V  V / | | (_| | (_| |  __/ |_  | |_| | (_| |\ V / (_| |___) | (__| |  | | |_) | |_
 *  |____/ \___|\__|\__|_|_| |_|\__, |___/    \_/\_/  |_|\__,_|\__, |\___|\__|  \___/ \__,_| \_/ \__,_|____/ \___|_|  |_| .__/ \__|
 *                              |___/                          |___/                                                    |_|
 *
 *  @author Brayden Aimar
 */

 
define([ 'jquery' ], $ => ({

	id: 'settings-widget',
	name: 'Settings',
	shortName: null,
	btnTheme: 'default',
	// glyphicon glyphicon-cog
	icon: 'fa fa-cogs',
	desc: '',
	publish: {},
	subscribe: {},
	foreignPublish: {
		'/main/widget-loaded': ''
	},
	foreignSubscribe: {
		'/main/all-widgets-loaded': ''
	},

	widgetDom: [ 'settings-panel' ],
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

			// console.log("  panelIndex:", panelIndex, "\n  panel:", panel);
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
