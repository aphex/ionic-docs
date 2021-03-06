/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
const { h, Context } = window.Ionic;

import { clamp, debounceEvent } from './chunk1.js';

class Range {
    constructor() {
        this.activated = false;
        this.hasFocus = false;
        this.valA = 0;
        this.valB = 0;
        this.ratioA = 0;
        this.ratioB = 0;
        this.ticks = [];
        /**
         * How long, in milliseconds, to wait to trigger the
         * `ionChange` event after each change in the range value. Default `0`.
         */
        this.debounce = 0;
        /*
         * If true, the user cannot interact with the range. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * Show two knobs. Defaults to `false`.
         */
        this.dualKnobs = false;
        /**
         * Maximum integer value of the range. Defaults to `100`.
         */
        this.max = 100;
        /**
         * Minimum integer value of the range. Defaults to `0`.
         */
        this.min = 0;
        /**
         * If true, a pin with integer value is shown when the knob
         * is pressed. Defaults to `false`.
         */
        this.pin = false;
        /**
         * If true, the knob snaps to tick marks evenly spaced based
         * on the step property value. Defaults to `false`.
         */
        this.snaps = false;
        /**
         * Specifies the value granularity. Defaults to `1`.
         */
        this.step = 1;
    }
    debounceChanged() {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    }
    disabledChanged() {
        this.emitStyle();
    }
    valueChanged(val) {
        this.ionChange.emit({ value: val });
        this.inputUpdated();
        this.emitStyle();
    }
    componentWillLoad() {
        this.inputUpdated();
        this.createTicks();
        this.debounceChanged();
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit({
                'range-disabled': this.disabled
            });
        });
    }
    fireBlur() {
        if (this.hasFocus) {
            this.hasFocus = false;
            this.ionBlur.emit();
            this.emitStyle();
        }
    }
    fireFocus() {
        if (!this.hasFocus) {
            this.hasFocus = true;
            this.ionFocus.emit();
            this.emitStyle();
        }
    }
    inputUpdated() {
        const val = this.value;
        if (this.dualKnobs) {
            this.valA = val.lower;
            this.valB = val.upper;
            this.ratioA = this.valueToRatio(val.lower);
            this.ratioB = this.valueToRatio(val.upper);
        }
        else {
            this.valA = val;
            this.ratioA = this.valueToRatio(val);
        }
        this.updateBar();
    }
    updateBar() {
        const ratioA = this.ratioA;
        const ratioB = this.ratioB;
        if (this.dualKnobs) {
            this.barL = `${Math.min(ratioA, ratioB) * 100}%`;
            this.barR = `${100 - Math.max(ratioA, ratioB) * 100}%`;
        }
        else {
            this.barL = '';
            this.barR = `${100 - ratioA * 100}%`;
        }
        this.updateTicks();
    }
    createTicks() {
        if (this.snaps) {
            for (let value = this.min; value <= this.max; value += this.step) {
                const ratio = this.valueToRatio(value);
                this.ticks.push({
                    ratio,
                    left: `${ratio * 100}%`
                });
            }
            this.updateTicks();
        }
    }
    updateTicks() {
        const ticks = this.ticks;
        const ratio = this.ratio;
        if (this.snaps && ticks) {
            if (this.dualKnobs) {
                const upperRatio = this.ratioUpper();
                ticks.forEach(t => {
                    t.active = t.ratio >= ratio && t.ratio <= upperRatio;
                });
            }
            else {
                ticks.forEach(t => {
                    t.active = t.ratio <= ratio;
                });
            }
        }
    }
    valueToRatio(value) {
        value = Math.round((value - this.min) / this.step) * this.step;
        value = value / (this.max - this.min);
        return clamp(0, value, 1);
    }
    ratioToValue(ratio) {
        ratio = Math.round((this.max - this.min) * ratio);
        ratio = Math.round(ratio / this.step) * this.step + this.min;
        return clamp(this.min, ratio, this.max);
    }
    inputNormalize(val) {
        if (this.dualKnobs) {
            return val;
        }
        else {
            val = parseFloat(val);
            return isNaN(val) ? undefined : val;
        }
    }
    update(current, rect, isPressed) {
        // figure out where the pointer is currently at
        // update the knob being interacted with
        let ratio = clamp(0, (current.x - rect.left) / rect.width, 1);
        const val = this.ratioToValue(ratio);
        if (this.snaps) {
            // snaps the ratio to the current value
            ratio = this.valueToRatio(val);
        }
        // update which knob is pressed
        this.pressed = isPressed;
        let valChanged = false;
        if (this.activeB) {
            // when the pointer down started it was determined
            // that knob B was the one they were interacting with
            this.pressedB = isPressed;
            this.pressedA = false;
            this.ratioB = ratio;
            valChanged = val === this.valB;
            this.valB = val;
        }
        else {
            // interacting with knob A
            this.pressedA = isPressed;
            this.pressedB = false;
            this.ratioA = ratio;
            valChanged = val === this.valA;
            this.valA = val;
        }
        this.updateBar();
        if (valChanged) {
            return false;
        }
        // value has been updated
        let value;
        if (this.dualKnobs) {
            // dual knobs have an lower and upper value
            value = {
                lower: Math.min(this.valA, this.valB),
                upper: Math.max(this.valA, this.valB)
            };
        }
        else {
            // single knob only has one value
            value = this.valA;
        }
        // Update input value
        this.value = value;
        return true;
    }
    /**
     * Returns the ratio of the knob's is current location, which is a number
     * between `0` and `1`. If two knobs are used, this property represents
     * the lower value.
     */
    ratio() {
        if (this.dualKnobs) {
            return Math.min(this.ratioA, this.ratioB);
        }
        return this.ratioA;
    }
    /**
     * Returns the ratio of the upper value's is current location, which is
     * a number between `0` and `1`. If there is only one knob, then this
     * will return `null`.
     */
    ratioUpper() {
        if (this.dualKnobs) {
            return Math.max(this.ratioA, this.ratioB);
        }
        return null;
    }
    keyChng(ev) {
        const step = this.step;
        if (ev.detail.knob === 'knobB') {
            if (ev.detail.isIncrease) {
                this.valB += step;
            }
            else {
                this.valB -= step;
            }
            this.valB = clamp(this.min, this.valB, this.max);
            this.ratioB = this.valueToRatio(this.valB);
        }
        else {
            if (ev.detail.isIncrease) {
                this.valA += step;
            }
            else {
                this.valA -= step;
            }
            this.valA = clamp(this.min, this.valA, this.max);
            this.ratioA = this.valueToRatio(this.valA);
        }
        this.updateBar();
    }
    onDragStart(detail) {
        if (this.disabled)
            return false;
        this.fireFocus();
        const current = { x: detail.currentX, y: detail.currentY };
        const el = this.el.querySelector('.range-slider');
        this.rect = el.getBoundingClientRect();
        const rect = this.rect;
        // figure out which knob they started closer to
        const ratio = clamp(0, (current.x - rect.left) / rect.width, 1);
        this.activeB =
            this.dualKnobs &&
                Math.abs(ratio - this.ratioA) > Math.abs(ratio - this.ratioB);
        // update the active knob's position
        this.update(current, rect, true);
        // return true so the pointer events
        // know everything's still valid
        return true;
    }
    onDragEnd(detail) {
        if (this.disabled) {
            return;
        }
        // update the active knob's position
        this.update({ x: detail.currentX, y: detail.currentY }, this.rect, false);
        // trigger ionBlur event
        this.fireBlur();
    }
    onDragMove(detail) {
        if (this.disabled) {
            return;
        }
        const current = { x: detail.currentX, y: detail.currentY };
        // update the active knob's position
        this.update(current, this.rect, true);
    }
    hostData() {
        return {
            class: {
                'range-disabled': this.disabled,
                'range-pressed': this.pressed,
                'range-has-pin': this.pin
            }
        };
    }
    render() {
        return [
            h("slot", { name: 'start' }),
            h("ion-gesture", Object.assign({}, {
                disableScroll: true,
                onStart: this.onDragStart.bind(this),
                onMove: this.onDragMove.bind(this),
                onEnd: this.onDragEnd.bind(this),
                disabled: this.disabled,
                gestureName: 'range',
                gesturePriority: 30,
                type: 'pan',
                direction: 'x',
                threshold: 0
            }),
                h("div", { class: 'range-slider' },
                    this.ticks.map(t => h("div", { style: { left: t.left }, role: 'presentation', class: { 'range-tick': true, 'range-tick-active': t.active } })),
                    h("div", { class: 'range-bar', role: 'presentation' }),
                    h("div", { class: 'range-bar range-bar-active', style: {
                            left: this.barL,
                            right: this.barR
                        }, role: 'presentation' }),
                    h("ion-range-knob", { class: 'range-knob-handle', knob: 'knobA', pressed: this.pressedA, ratio: this.ratioA, val: this.valA, pin: this.pin, min: this.min, max: this.max }),
                    this.dualKnobs
                        ? h("ion-range-knob", { class: 'range-knob-handle', knob: 'knobB', pressed: this.pressedB, ratio: this.ratioB, val: this.valB, pin: this.pin, min: this.min, max: this.max })
                        : null)),
            h("slot", { name: 'end' })
        ];
    }
    static get is() { return "ion-range"; }
    static get host() { return { "theme": "range" }; }
    static get properties() { return { "activeB": { "state": true }, "barL": { "state": true }, "barR": { "state": true }, "color": { "type": String, "attr": "color" }, "debounce": { "type": Number, "attr": "debounce", "watchCallbacks": ["debounceChanged"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "dualKnobs": { "type": Boolean, "attr": "dual-knobs" }, "el": { "elementRef": true }, "max": { "type": Number, "attr": "max" }, "min": { "type": Number, "attr": "min" }, "mode": { "type": "Any", "attr": "mode" }, "pin": { "type": Boolean, "attr": "pin" }, "pressed": { "state": true }, "pressedA": { "state": true }, "pressedB": { "state": true }, "ratio": { "method": true }, "ratioA": { "state": true }, "ratioB": { "state": true }, "ratioUpper": { "method": true }, "rect": { "state": true }, "snaps": { "type": Boolean, "attr": "snaps" }, "step": { "type": Number, "attr": "step" }, "ticks": { "state": true }, "valA": { "state": true }, "valB": { "state": true }, "value": { "type": "Any", "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ".item ion-range .item-inner {\n  overflow: visible;\n  width: 100%;\n}\n\n.item ion-range .input-wrapper {\n  overflow: visible;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  width: 100%;\n}\n\n.item ion-range {\n  width: 100%;\n}\n\n.item ion-range ion-label {\n  -webkit-align-self: center;\n  -ms-flex-item-align: center;\n  align-self: center;\n}\n\nion-range {\n  position: relative;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\nion-range ion-label {\n  -webkit-box-flex: initial;\n  -webkit-flex: initial;\n  -ms-flex: initial;\n  flex: initial;\n}\n\nion-range ion-icon {\n  font-size: 24px;\n}\n\nion-range ion-gesture,\nion-range .range-slider {\n  position: relative;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  cursor: pointer;\n}\n\n.range-pin {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.range-knob-handle:active, .range-knob-handle:focus {\n  outline: none;\n}\n\n.range-md {\n  padding: 8px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.range-md [slot=\"range-start\"] {\n  margin: 0 12px 0 0;\n}\n\n.range-md [slot=\"range-end\"] {\n  margin: 0 0 0 12px;\n}\n\n.range-md.range-has-pin {\n  padding-top: 28px;\n}\n\n.range-md .range-slider {\n  height: 42px;\n}\n\n.range-md .range-bar {\n  left: 0;\n  top: 21px;\n  position: absolute;\n  width: 100%;\n  height: 2px;\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  pointer-events: none;\n}\n\n.range-md.range-pressed .range-bar-active {\n  will-change: left, right;\n}\n\n.range-md.range-pressed .range-knob-handle {\n  will-change: left;\n}\n\n.range-md .range-bar-active {\n  bottom: 0;\n  width: auto;\n  background: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.range-md .range-knob-handle {\n  left: 0;\n  top: 21px;\n  margin-left: -21px;\n  margin-top: -21px;\n  text-align: center;\n  position: absolute;\n  width: 42px;\n  height: 42px;\n}\n\n.range-md .range-knob {\n  left: 12px;\n  top: 13px;\n  border-radius: 50%;\n  position: absolute;\n  z-index: 2;\n  width: 18px;\n  height: 18px;\n  background: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  -webkit-transform: scale(0.67);\n  transform: scale(0.67);\n  -webkit-transition-duration: 120ms;\n  transition-duration: 120ms;\n  -webkit-transition-property: background-color, border, -webkit-transform;\n  transition-property: background-color, border, -webkit-transform;\n  transition-property: transform, background-color, border;\n  transition-property: transform, background-color, border, -webkit-transform;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease;\n  pointer-events: none;\n}\n\n.range-md .range-tick {\n  margin-left: -1px;\n  border-radius: 50%;\n  position: absolute;\n  top: 21px;\n  z-index: 1;\n  width: 2px;\n  height: 2px;\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n  pointer-events: none;\n}\n\n.range-md .range-tick-active {\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md .range-pin {\n  padding: 8px 0;\n  text-align: center;\n  border-radius: 50%;\n  -webkit-transform: translate3d(0,  28px,  0) scale(0.01);\n  transform: translate3d(0,  28px,  0) scale(0.01);\n  position: relative;\n  top: -20px;\n  display: inline-block;\n  min-width: 28px;\n  height: 28px;\n  font-size: 12px;\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  -webkit-transition: background-color 120ms ease, -webkit-transform 120ms ease;\n  transition: background-color 120ms ease, -webkit-transform 120ms ease;\n  transition: transform 120ms ease, background-color 120ms ease;\n  transition: transform 120ms ease, background-color 120ms ease, -webkit-transform 120ms ease;\n}\n\n.range-md .range-pin::before {\n  left: 50%;\n  top: 3px;\n  border-top-left-radius: 50%;\n  border-top-right-radius: 50%;\n  border-bottom-right-radius: 50%;\n  border-bottom-left-radius: 0;\n  margin-left: -13px;\n  position: absolute;\n  z-index: -1;\n  width: 26px;\n  height: 26px;\n  background: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  content: \"\";\n  -webkit-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n  -webkit-transition: background-color 120ms ease;\n  transition: background-color 120ms ease;\n}\n\n.range-md .range-knob-pressed .range-pin {\n  -webkit-transform: translate3d(0,  0,  0) scale(1);\n  transform: translate3d(0,  0,  0) scale(1);\n}\n\n.range-md:not(.range-has-pin) .range-knob-pressed .range-knob {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n}\n\n.range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md .range-knob-min.range-knob-min .range-pin,\n.range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md.range-disabled .range-bar-active {\n  background-color: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md.range-disabled .range-knob {\n  outline: 5px solid #fff;\n  background-color: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  -webkit-transform: scale(0.55);\n  transform: scale(0.55);\n}\n\n.range-md-primary .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-primary .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-primary .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-primary .range-bar-active,\n.range-md-primary .range-knob,\n.range-md-primary .range-pin,\n.range-md-primary .range-pin::before {\n  background: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.range-md-secondary .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-secondary .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-secondary .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-secondary .range-bar-active,\n.range-md-secondary .range-knob,\n.range-md-secondary .range-pin,\n.range-md-secondary .range-pin::before {\n  background: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.range-md-tertiary .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-tertiary .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-tertiary .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-tertiary .range-bar-active,\n.range-md-tertiary .range-knob,\n.range-md-tertiary .range-pin,\n.range-md-tertiary .range-pin::before {\n  background: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.range-md-success .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-success .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-success .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-success .range-bar-active,\n.range-md-success .range-knob,\n.range-md-success .range-pin,\n.range-md-success .range-pin::before {\n  background: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.range-md-warning .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-warning .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-warning .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-warning .range-bar-active,\n.range-md-warning .range-knob,\n.range-md-warning .range-pin,\n.range-md-warning .range-pin::before {\n  background: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.range-md-danger .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-danger .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-danger .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-danger .range-bar-active,\n.range-md-danger .range-knob,\n.range-md-danger .range-pin,\n.range-md-danger .range-pin::before {\n  background: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.range-md-light .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-light .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-light .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-light .range-bar-active,\n.range-md-light .range-knob,\n.range-md-light .range-pin,\n.range-md-light .range-pin::before {\n  background: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.range-md-medium .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-medium .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-medium .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-medium .range-bar-active,\n.range-md-medium .range-knob,\n.range-md-medium .range-pin,\n.range-md-medium .range-pin::before {\n  background: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.range-md-dark .range-md .range-knob-min.range-knob-min .range-knob {\n  border: 2px solid var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.range-md-dark .range-md .range-knob-min.range-knob-min .range-pin,\n.range-md-dark .range-md .range-knob-min.range-knob-min .range-pin::before {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-background-md-color-step-250, var(--ion-background-color-step-250, #bfbfbf));\n}\n\n.range-md-dark .range-bar-active,\n.range-md-dark .range-knob,\n.range-md-dark .range-pin,\n.range-md-dark .range-pin::before {\n  background: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
}

class RangeKnob {
    handleKeyBoard(ev) {
        const keyCode = ev.keyCode;
        if (keyCode === KEY_LEFT || keyCode === KEY_DOWN) {
            this.ionDecrease.emit({ isIncrease: false, knob: this.knob });
            ev.preventDefault();
            ev.stopPropagation();
        }
        else if (keyCode === KEY_RIGHT || keyCode === KEY_UP) {
            this.ionIncrease.emit({ isIncrease: true, knob: this.knob });
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
    leftPos(val) {
        return `${val * 100}%`;
    }
    hostData() {
        return {
            class: {
                'range-knob-pressed': this.pressed,
                'range-knob-min': this.val === this.min || this.val === undefined,
                'range-knob-max': this.val === this.max
            },
            style: {
                'left': this.leftPos(this.ratio)
            },
            'role': 'slider',
            'tabindex': this.disabled ? -1 : 0,
            'aria-valuemin': this.min,
            'aria-valuemax': this.max,
            'aria-disabled': this.disabled,
            'aria-labelledby': this.labelId,
            'aria-valuenow': this.val
        };
    }
    render() {
        if (this.pin) {
            return [
                h("div", { class: 'range-pin', role: 'presentation' }, this.val),
                h("div", { class: 'range-knob', role: 'presentation' })
            ];
        }
        return h("div", { class: 'range-knob', role: 'presentation' });
    }
    static get is() { return "ion-range-knob"; }
    static get properties() { return { "disabled": { "type": Boolean, "attr": "disabled" }, "knob": { "type": String, "attr": "knob" }, "labelId": { "type": String, "attr": "label-id" }, "max": { "type": Number, "attr": "max" }, "min": { "type": Number, "attr": "min" }, "pin": { "type": Boolean, "attr": "pin" }, "pressed": { "type": Boolean, "attr": "pressed" }, "ratio": { "type": Number, "attr": "ratio" }, "val": { "type": Number, "attr": "val" } }; }
    static get events() { return [{ "name": "ionIncrease", "method": "ionIncrease", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionDecrease", "method": "ionDecrease", "bubbles": true, "cancelable": true, "composed": true }]; }
}
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

export { Range as IonRange, RangeKnob as IonRangeKnob };
