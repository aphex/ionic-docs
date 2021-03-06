/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
const { h, Context } = window.Ionic;

import { createThemedClasses, getElementClassMap } from './chunk2.js';

class Segment {
    constructor() {
        /*
         * If true, the user cannot interact with the segment. Defaults to `false`.
         */
        this.disabled = false;
    }
    valueChanged(val) {
        this.selectButton(val);
        this.ionChange.emit();
    }
    componentDidLoad() {
        this.selectButton(this.value);
    }
    segmentClick(ev) {
        const selectedButton = ev.target;
        this.value = selectedButton.value;
    }
    selectButton(val) {
        const buttons = this.el.querySelectorAll('ion-segment-button');
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.activated = (button.value === val);
            // If there is no value set on the segment and a button
            // is checked we should activate it
            if (!val && button.checked) {
                button.activated = button.checked;
            }
        }
    }
    hostData() {
        return {
            class: {
                'segment-disabled': this.disabled
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-segment"; }
    static get host() { return { "theme": "segment" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "mode": { "type": "Any", "attr": "mode" }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-segment {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n}\n\n.segment-ios {\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n}\n\n.segment-ios.segment-disabled {\n  opacity: 0.4;\n  pointer-events: none;\n}\n\n.toolbar-ios .segment-ios {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n}"; }
    static get styleMode() { return "ios"; }
}

let ids = 0;
class SegmentButton {
    constructor() {
        this.activated = false;
        /**
         * If true, the segment button is selected. Defaults to `false`.
         */
        this.checked = false;
        /*
         * If true, the user cannot interact with the segment button. Default false.
         */
        this.disabled = false;
    }
    componentWillLoad() {
        if (!this.value) {
            this.value = `ion-sb-${ids++}`;
        }
    }
    /**
     * Emit the click event to the parent segment
     */
    segmentButtonClick() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionClick.emit();
        });
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'segment-button');
        const hostClasses = getElementClassMap(this.el.classList);
        const buttonClasses = Object.assign({ 'segment-button-disabled': this.disabled, 'segment-activated': this.activated }, themedClasses, hostClasses);
        const TagType = this.href ? 'a' : 'button';
        const attrs = (TagType === 'button')
            ? { type: 'button' }
            : {};
        return [
            h(TagType, Object.assign({}, attrs, { "aria-pressed": this.activated, class: buttonClasses, disabled: this.disabled, href: this.href, onClick: this.segmentButtonClick.bind(this) }),
                h("slot", null),
                this.mode === 'md' && h("ion-ripple-effect", null))
        ];
    }
    static get is() { return "ion-segment-button"; }
    static get properties() { return { "activated": { "type": Boolean, "attr": "activated", "mutable": true }, "checked": { "type": Boolean, "attr": "checked" }, "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" }, "value": { "type": String, "attr": "value", "mutable": true } }; }
    static get events() { return [{ "name": "ionClick", "method": "ionClick", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-segment-button {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n}\n\n.segment-button {\n  border-radius: 0;\n  margin-left: 0;\n  margin-right: 0;\n  text-align: center;\n  position: relative;\n  display: block;\n  overflow: hidden;\n  border: 0;\n  text-decoration: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: pointer;\n  -webkit-font-kerning: none;\n  font-kerning: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  contain: content;\n}\n\n.segment-button:active, .segment-button:focus {\n  outline: none;\n}\n\nion-segment-button:first-of-type .segment-button-ios {\n  border-top-left-radius: 4px;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 4px;\n  margin-right: 0;\n}\n\nion-segment-button:not(:first-of-type) .segment-button-ios {\n  border-left-width: 0;\n}\n\nion-segment-button:last-of-type .segment-button-ios {\n  border-top-left-radius: 0;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 0;\n  margin-left: 0;\n  border-left-width: 0;\n}\n\n.segment-button-ios {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  height: 32px;\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  font-size: 13px;\n  line-height: 28px;\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.segment-button-ios ion-icon {\n  font-size: 26px;\n  line-height: 28px;\n}\n\n.segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  -webkit-transition: 100ms all linear;\n  transition: 100ms all linear;\n}\n\n.segment-button-ios:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-primary-rgb, 72, 138, 255), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n  -webkit-transition: 100ms all linear;\n  transition: 100ms all linear;\n}\n\n.segment-button-ios:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-primary-rgb, 72, 138, 255), var(--ion-alpha-ios-low, var(--ion-alpha-low, 0.1)));\n  -webkit-transition: 100ms all linear;\n  transition: 100ms all linear;\n}\n\n[dir=\"rtl\"] ion-segment-button:first-of-type .segment-button-ios {\n  border-left-width: 0;\n}\n\n[dir=\"rtl\"] ion-segment-button:last-of-type .segment-button-ios {\n  border-left-width: 1px;\n}\n\n.segment-ios .segment-button-disabled {\n  color: rgba(var(--ion-color-primary-rgb, 72, 138, 255), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n  pointer-events: none;\n}\n\n.toolbar-ios ion-segment-button {\n  max-width: 100px;\n}\n\n.toolbar-ios .segment-button-ios {\n  height: 26px;\n  font-size: 12px;\n  line-height: 22px;\n}\n\n.toolbar-ios .segment-button-ios ion-icon {\n  font-size: 22px;\n  line-height: 24px;\n}\n\n.segment-ios-primary .segment-button {\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.segment-ios-primary .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-primary-rgb, var(--ion-color-primary-rgb, 72, 138, 255)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-primary .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-primary-rgb, var(--ion-color-primary-rgb, 72, 138, 255)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-primary .segment-button.segment-activated {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.segment-ios-primary .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-primary-rgb, var(--ion-color-primary-rgb, 72, 138, 255)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-primary .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.segment-ios-secondary .segment-button {\n  border-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.segment-ios-secondary .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-secondary-rgb, var(--ion-color-secondary-rgb, 50, 219, 100)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-secondary .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-secondary-rgb, var(--ion-color-secondary-rgb, 50, 219, 100)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-secondary .segment-button.segment-activated {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.segment-ios-secondary .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-secondary-rgb, var(--ion-color-secondary-rgb, 50, 219, 100)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-secondary .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.segment-ios-tertiary .segment-button {\n  border-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.segment-ios-tertiary .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-tertiary-rgb, var(--ion-color-tertiary-rgb, 244, 169, 66)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-tertiary .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-tertiary-rgb, var(--ion-color-tertiary-rgb, 244, 169, 66)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-tertiary .segment-button.segment-activated {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.segment-ios-tertiary .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-tertiary-rgb, var(--ion-color-tertiary-rgb, 244, 169, 66)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-tertiary .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.segment-ios-success .segment-button {\n  border-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.segment-ios-success .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-success-rgb, var(--ion-color-success-rgb, 16, 220, 96)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-success .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-success-rgb, var(--ion-color-success-rgb, 16, 220, 96)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-success .segment-button.segment-activated {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.segment-ios-success .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-success-rgb, var(--ion-color-success-rgb, 16, 220, 96)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-success .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.segment-ios-warning .segment-button {\n  border-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.segment-ios-warning .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-warning-rgb, var(--ion-color-warning-rgb, 255, 206, 0)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-warning .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-warning-rgb, var(--ion-color-warning-rgb, 255, 206, 0)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-warning .segment-button.segment-activated {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.segment-ios-warning .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-warning-rgb, var(--ion-color-warning-rgb, 255, 206, 0)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-warning .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.segment-ios-danger .segment-button {\n  border-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.segment-ios-danger .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-danger-rgb, var(--ion-color-danger-rgb, 245, 61, 61)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-danger .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-danger-rgb, var(--ion-color-danger-rgb, 245, 61, 61)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-danger .segment-button.segment-activated {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.segment-ios-danger .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-danger-rgb, var(--ion-color-danger-rgb, 245, 61, 61)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-danger .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.segment-ios-light .segment-button {\n  border-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.segment-ios-light .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-light-rgb, var(--ion-color-light-rgb, 244, 244, 244)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-light .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-light-rgb, var(--ion-color-light-rgb, 244, 244, 244)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-light .segment-button.segment-activated {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.segment-ios-light .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-light-rgb, var(--ion-color-light-rgb, 244, 244, 244)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-light .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.segment-ios-medium .segment-button {\n  border-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.segment-ios-medium .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-medium-rgb, var(--ion-color-medium-rgb, 152, 154, 162)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-medium .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-medium-rgb, var(--ion-color-medium-rgb, 152, 154, 162)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-medium .segment-button.segment-activated {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.segment-ios-medium .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-medium-rgb, var(--ion-color-medium-rgb, 152, 154, 162)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-medium .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.segment-ios-dark .segment-button {\n  border-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.segment-ios-dark .segment-button:hover:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-dark-rgb, var(--ion-color-dark-rgb, 34, 34, 34)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-dark .segment-button:active:not(.segment-activated) {\n  background-color: rgba(var(--ion-color-ios-dark-rgb, var(--ion-color-dark-rgb, 34, 34, 34)), var(--ion-alpha-ios-lowest, var(--ion-alpha-lowest, 0.06)));\n}\n\n.segment-ios-dark .segment-button.segment-activated {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.segment-ios-dark .segment-button-disabled {\n  color: rgba(var(--ion-color-ios-dark-rgb, var(--ion-color-dark-rgb, 34, 34, 34)), var(--ion-alpha-ios-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toolbar-ios-dark .segment-button-ios.segment-activated {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}

export { Segment as IonSegment, SegmentButton as IonSegmentButton };
