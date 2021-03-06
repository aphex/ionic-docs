/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
const { h, Context } = window.Ionic;

import { createThemedClasses } from './chunk2.js';

class Radio {
    constructor() {
        /*
         * If true, the user cannot interact with the radio. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the radio is selected. Defaults to `false`.
         */
        this.checked = false;
    }
    componentWillLoad() {
        this.inputId = 'ion-rb-' + (radioButtonIds++);
        if (this.value === undefined) {
            this.value = this.inputId;
        }
        this.emitStyle();
    }
    componentDidLoad() {
        this.ionRadioDidLoad.emit({ radio: this });
        this.nativeInput.checked = this.checked;
        this.didLoad = true;
        const parentItem = this.nativeInput.closest('ion-item');
        if (parentItem) {
            const itemLabel = parentItem.querySelector('ion-label');
            if (itemLabel) {
                itemLabel.id = this.inputId + '-lbl';
                this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
            }
        }
    }
    componentDidUnload() {
        this.ionRadioDidUnload.emit({ radio: this });
    }
    colorChanged() {
        this.emitStyle();
    }
    checkedChanged(isChecked) {
        if (this.nativeInput.checked !== isChecked) {
            // keep the checked value and native input `nync
            this.nativeInput.checked = isChecked;
        }
        clearTimeout(this.checkedTmr);
        this.checkedTmr = setTimeout(() => {
            // only emit ionSelect when checked is true
            if (this.didLoad && isChecked) {
                this.ionSelect.emit({
                    checked: isChecked,
                    value: this.value
                });
            }
        });
        this.emitStyle();
    }
    disabledChanged(isDisabled) {
        this.nativeInput.disabled = isDisabled;
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(Object.assign({}, createThemedClasses(this.mode, this.color, 'radio'), { 'radio-checked': this.checked, 'radio-disabled': this.disabled }));
        });
    }
    onClick() {
        this.checkedChanged(true);
    }
    onChange() {
        this.checked = true;
        this.nativeInput.focus();
    }
    onKeyUp() {
        this.keyFocus = true;
    }
    onFocus() {
        this.ionFocus.emit();
    }
    onBlur() {
        this.keyFocus = false;
        this.ionBlur.emit();
    }
    hostData() {
        const hostAttrs = {
            'class': {
                'radio-checked': this.checked,
                'radio-disabled': this.disabled,
                'radio-key': this.keyFocus
            }
        };
        return hostAttrs;
    }
    render() {
        const radioClasses = {
            'radio-icon': true,
            'radio-checked': this.checked
        };
        return [
            h("div", { class: radioClasses },
                h("div", { class: 'radio-inner' })),
            h("input", { type: 'radio', onClick: this.onClick.bind(this), onChange: this.onChange.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onKeyUp: this.onKeyUp.bind(this), id: this.inputId, name: this.name, value: this.value, disabled: this.disabled, ref: r => this.nativeInput = r })
        ];
    }
    static get is() { return "ion-radio"; }
    static get host() { return { "theme": "radio" }; }
    static get properties() { return { "checked": { "type": Boolean, "attr": "checked", "mutable": true, "watchCallbacks": ["checkedChanged"] }, "color": { "type": String, "attr": "color", "watchCallbacks": ["colorChanged"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "keyFocus": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name" }, "value": { "type": String, "attr": "value", "mutable": true } }; }
    static get events() { return [{ "name": "ionRadioDidLoad", "method": "ionRadioDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionRadioDidUnload", "method": "ionRadioDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionSelect", "method": "ionSelect", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-radio {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  position: relative;\n  display: inline-block;\n}\n\nion-radio input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nion-radio input:active, ion-radio input:focus {\n  outline: none;\n}\n\nion-radio .radio-icon {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.radio-md .radio-icon {\n  left: 0;\n  top: 0;\n  margin: 0;\n  border-radius: 50%;\n  position: relative;\n  display: block;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n  contain: layout size style;\n}\n\n.radio-md .radio-inner {\n  left: 2px;\n  top: 2px;\n  border-radius: 50%;\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  -webkit-transform: scale3d(0, 0, 0);\n  transform: scale3d(0, 0, 0);\n  -webkit-transition: -webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: -webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.radio-md .radio-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md .radio-checked .radio-inner {\n  -webkit-transform: scale3d(1, 1, 1);\n  transform: scale3d(1, 1, 1);\n}\n\n.radio-md.radio-disabled,\n.item-md.item-radio-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.radio-key .radio-icon::after {\n  border-radius: 50%;\n  left: -12px;\n  top: -12px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-md-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n  content: \"\";\n  opacity: .2;\n}\n\n.item-md .radio-md {\n  margin: 9px 10px 9px 0;\n  position: static;\n  display: block;\n}\n\n.item-md .radio-md[slot=\"start\"] {\n  margin: 11px 36px 10px 4px;\n}\n\n.item-radio.item-md ion-label {\n  margin-left: 0;\n}\n\n.item-radio-checked.item-md ion-label {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-md-primary.item-radio-checked ion-label {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md-primary .radio-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md-primary .radio-inner {\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-md-secondary.item-radio-checked ion-label {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-md-secondary .radio-checked {\n  border-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-md-secondary .radio-inner {\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-radio-md-tertiary.item-radio-checked ion-label {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-md-tertiary .radio-checked {\n  border-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-md-tertiary .radio-inner {\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-radio-md-success.item-radio-checked ion-label {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-md-success .radio-checked {\n  border-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-md-success .radio-inner {\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.item-radio-md-warning.item-radio-checked ion-label {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-md-warning .radio-checked {\n  border-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-md-warning .radio-inner {\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-radio-md-danger.item-radio-checked ion-label {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-md-danger .radio-checked {\n  border-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-md-danger .radio-inner {\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-radio-md-light.item-radio-checked ion-label {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-md-light .radio-checked {\n  border-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-md-light .radio-inner {\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-radio-md-medium.item-radio-checked ion-label {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-md-medium .radio-checked {\n  border-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-md-medium .radio-inner {\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-radio-md-dark.item-radio-checked ion-label {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.radio-md-dark .radio-checked {\n  border-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.radio-md-dark .radio-inner {\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
}
let radioButtonIds = 0;

class RadioGroup {
    constructor() {
        this.radios = [];
        /*
         * If true, the radios can be deselected. Default false.
         */
        this.allowEmptySelection = false;
        /*
         * If true, the user cannot interact with the radio group. Default false.
         */
        this.disabled = false;
    }
    disabledChanged() {
        this.setDisabled();
    }
    valueChanged() {
        // this radio group's value just changed
        // double check the button with this value is checked
        if (this.value === undefined) {
            // set to undefined
            // ensure all that are checked become unchecked
            this.radios.filter(r => r.checked).forEach(radio => {
                radio.checked = false;
            });
        }
        else {
            let hasChecked = false;
            this.radios.forEach(radio => {
                if (radio.value === this.value) {
                    if (!radio.checked && !hasChecked) {
                        // correct value for this radio
                        // but this radio isn't checked yet
                        // and we haven't found a checked yet
                        // so CHECK IT!
                        radio.checked = true;
                    }
                    else if (hasChecked && radio.checked) {
                        // somehow we've got multiple radios
                        // with the same value, but only one can be checked
                        radio.checked = false;
                    }
                    // remember we've got a checked radio button now
                    hasChecked = true;
                }
                else if (radio.checked) {
                    // this radio doesn't have the correct value
                    // and it's also checked, so let's uncheck it
                    radio.checked = false;
                }
            });
        }
        if (this.didLoad) {
            // emit the new value
            this.ionChange.emit({ value: this.value });
        }
    }
    onRadioDidLoad(ev) {
        const radio = ev.target;
        this.radios.push(radio);
        radio.name = this.name;
        if (this.value !== undefined && radio.value === this.value) {
            // this radio-group has a value and this
            // radio equals the correct radio-group value
            // so let's check this radio
            radio.checked = true;
        }
        else if (this.value === undefined && radio.checked) {
            // this radio-group does not have a value
            // but this radio is checked, so let's set the
            // radio-group's value from the checked radio
            this.value = radio.value;
        }
        else if (radio.checked) {
            // if it doesn't match one of the above cases, but the
            // radio is still checked, then we need to uncheck it
            radio.checked = false;
        }
    }
    onRadioDidUnload(ev) {
        const index = this.radios.indexOf(ev.target);
        if (index > -1) {
            this.radios.splice(index, 1);
        }
    }
    onRadioSelect(ev) {
        // ionSelect only come from the checked radio button
        this.radios.forEach(radio => {
            if (radio === ev.target) {
                if (radio.value !== this.value) {
                    this.value = radio.value;
                }
            }
            else {
                radio.checked = false;
            }
        });
    }
    componentWillLoad() {
        this.name = this.name || 'ion-rg-' + (radioGroupIds++);
    }
    componentDidLoad() {
        // Get the list header if it exists and set the id
        // this is used to set aria-labelledby
        let header = this.el.querySelector('ion-list-header');
        if (!header) {
            header = this.el.querySelector('ion-item-divider');
        }
        if (header) {
            const label = header.querySelector('ion-label');
            if (label) {
                this.labelId = label.id = this.name + '-lbl';
            }
        }
        this.setDisabled();
        this.didLoad = true;
    }
    setDisabled() {
        this.radios.forEach(radio => {
            radio.disabled = this.disabled;
        });
    }
    hostData() {
        const hostAttrs = {
            'role': 'radiogroup'
        };
        if (this.labelId) {
            hostAttrs['aria-labelledby'] = this.labelId;
        }
        return hostAttrs;
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-radio-group"; }
    static get properties() { return { "allowEmptySelection": { "type": Boolean, "attr": "allow-empty-selection" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "labelId": { "state": true }, "name": { "type": String, "attr": "name", "mutable": true }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }]; }
}
let radioGroupIds = 0;

export { Radio as IonRadio, RadioGroup as IonRadioGroup };
