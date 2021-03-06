/*!
 * (C) Ionic http://ionicframework.com - MIT License
 * Built with http://stenciljs.com
 */
const { h, Context } = window.Ionic;

import { assert, now, updateDetail } from './chunk1.js';

class GestureController {
    constructor() {
        this.gestureId = 0;
        this.requestedStart = new Map();
        this.disabledGestures = new Map();
        this.disabledScroll = new Set();
        this.capturedId = null;
    }
    create(config) {
        return Promise.resolve(new GestureDelegate(this, this.newID(), config.name, config.priority, config.disableScroll));
    }
    createBlocker(opts = {}) {
        return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
    }
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            this.requestedStart.delete(id);
            return false;
        }
        this.requestedStart.set(id, priority);
        return true;
    }
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        const requestedStart = this.requestedStart;
        let maxPriority = -10000;
        for (const value of requestedStart.values()) {
            maxPriority = Math.max(maxPriority, value);
        }
        if (maxPriority === priority) {
            this.capturedId = id;
            this.requestedStart.clear();
            this.ionGestureCaptured.emit(gestureName);
            return true;
        }
        requestedStart.delete(id);
        return false;
    }
    release(id) {
        this.requestedStart.delete(id);
        if (this.capturedId && id === this.capturedId) {
            this.capturedId = null;
        }
    }
    disableGesture(gestureName, id) {
        let set = this.disabledGestures.get(gestureName);
        if (!set) {
            set = new Set();
            this.disabledGestures.set(gestureName, set);
        }
        set.add(id);
    }
    enableGesture(gestureName, id) {
        const set = this.disabledGestures.get(gestureName);
        if (set) {
            set.delete(id);
        }
    }
    disableScroll(id) {
        this.disabledScroll.add(id);
    }
    enableScroll(id) {
        this.disabledScroll.delete(id);
    }
    canStart(gestureName) {
        if (this.capturedId) {
            // a gesture already captured
            return false;
        }
        if (this.isDisabled(gestureName)) {
            return false;
        }
        return true;
    }
    isCaptured() {
        return !!this.capturedId;
    }
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    isDisabled(gestureName) {
        const disabled = this.disabledGestures.get(gestureName);
        if (disabled && disabled.size > 0) {
            return true;
        }
        return false;
    }
    newID() {
        return this.gestureId++;
    }
    static get is() { return "ion-gesture-controller"; }
    static get properties() { return { "create": { "method": true }, "createBlocker": { "method": true } }; }
    static get events() { return [{ "name": "ionGestureCaptured", "method": "ionGestureCaptured", "bubbles": true, "cancelable": true, "composed": true }]; }
}
class GestureDelegate {
    constructor(ctrl, gestureDelegateId, name, priority, disableScroll) {
        this.gestureDelegateId = gestureDelegateId;
        this.name = name;
        this.priority = priority;
        this.disableScroll = disableScroll;
        this.ctrl = ctrl;
    }
    canStart() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.canStart(this.name);
    }
    start() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.start(this.name, this.gestureDelegateId, this.priority);
    }
    capture() {
        if (!this.ctrl) {
            return false;
        }
        const captured = this.ctrl.capture(this.name, this.gestureDelegateId, this.priority);
        if (captured && this.disableScroll) {
            this.ctrl.disableScroll(this.gestureDelegateId);
        }
        return captured;
    }
    release() {
        if (this.ctrl) {
            this.ctrl.release(this.gestureDelegateId);
            if (this.disableScroll) {
                this.ctrl.enableScroll(this.gestureDelegateId);
            }
        }
    }
    destroy() {
        this.release();
        this.ctrl = null;
    }
    static get is() { return "ion-gesture-controller"; }
    static get properties() { return { "create": { "method": true }, "createBlocker": { "method": true } }; }
    static get events() { return [{ "name": "ionGestureCaptured", "method": "ionGestureCaptured", "bubbles": true, "cancelable": true, "composed": true }]; }
}
class BlockerDelegate {
    constructor(blockerDelegateId, ctrl, disable, disableScroll) {
        this.blockerDelegateId = blockerDelegateId;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.ctrl = ctrl;
    }
    block() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.disableGesture(gesture, this.blockerDelegateId);
            }
        }
        if (this.disableScroll) {
            this.ctrl.disableScroll(this.blockerDelegateId);
        }
    }
    unblock() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.enableGesture(gesture, this.blockerDelegateId);
            }
        }
        if (this.disableScroll) {
            this.ctrl.enableScroll(this.blockerDelegateId);
        }
    }
    destroy() {
        this.unblock();
        this.ctrl = null;
    }
    static get is() { return "ion-gesture-controller"; }
    static get properties() { return { "create": { "method": true }, "createBlocker": { "method": true } }; }
    static get events() { return [{ "name": "ionGestureCaptured", "method": "ionGestureCaptured", "bubbles": true, "cancelable": true, "composed": true }]; }
}
const BLOCK_ALL = {
    disable: ['menu-swipe', 'goback-swipe'],
    disableScroll: true
};

class PanRecognizer {
    constructor(direction, threshold, maxAngle) {
        this.dirty = false;
        this.isPan = 0;
        const radians = maxAngle * (Math.PI / 180);
        this.isDirX = direction === 'x';
        this.maxCosine = Math.cos(radians);
        this.threshold = threshold * threshold;
    }
    start(x, y) {
        this.startX = x;
        this.startY = y;
        this.isPan = 0;
        this.dirty = true;
    }
    detect(x, y) {
        if (!this.dirty) {
            return false;
        }
        const deltaX = (x - this.startX);
        const deltaY = (y - this.startY);
        const distance = deltaX * deltaX + deltaY * deltaY;
        if (distance < this.threshold) {
            return false;
        }
        const hypotenuse = Math.sqrt(distance);
        const cosine = ((this.isDirX) ? deltaX : deltaY) / hypotenuse;
        if (cosine > this.maxCosine) {
            this.isPan = 1;
        }
        else if (cosine < -this.maxCosine) {
            this.isPan = -1;
        }
        else {
            this.isPan = 0;
        }
        this.dirty = false;
        return true;
    }
    isGesture() {
        return this.isPan !== 0;
    }
    getDirection() {
        return this.isPan;
    }
}

class Gesture {
    constructor() {
        this.detail = {};
        this.positions = [];
        this.lastTouch = 0;
        this.hasCapturedPan = false;
        this.hasPress = false;
        this.hasStartedPan = false;
        this.hasFiredStart = true;
        this.isMoveQueued = false;
        this.disabled = false;
        this.attachTo = 'child';
        this.autoBlockAll = false;
        this.block = null;
        this.disableScroll = false;
        this.direction = 'x';
        this.gestureName = '';
        this.gesturePriority = 0;
        this.passive = true;
        this.maxAngle = 40;
        this.threshold = 10;
        this.type = 'pan';
    }
    componentWillLoad() {
        return this.gestureCtrl.create({
            name: this.gestureName,
            priority: this.gesturePriority,
            disableScroll: this.disableScroll
        }).then((gesture) => this.gesture = gesture);
    }
    componentDidLoad() {
        // in this case, we already know the GestureController and Gesture are already
        // apart of the same bundle, so it's safe to load it this way
        // only create one instance of GestureController, and reuse the same one later
        const types = this.type.replace(/\s/g, '').toLowerCase().split(',');
        if (types.indexOf('pan') > -1) {
            this.pan = new PanRecognizer(this.direction, this.threshold, this.maxAngle);
        }
        this.hasPress = (types.indexOf('press') > -1);
        this.disabledChanged(this.disabled);
        if (this.autoBlockAll) {
            this.setBlocker(BLOCK_ALL).then(b => b.block());
        }
    }
    disabledChanged(isDisabled) {
        if (this.pan || this.hasPress) {
            this.enableListener(this, 'touchstart', !isDisabled, this.attachTo, this.passive);
            this.enableListener(this, 'mousedown', !isDisabled, this.attachTo, this.passive);
            if (isDisabled) {
                this.abortGesture();
            }
        }
    }
    blockChanged(block) {
        this.setBlocker({ disable: block.split(',') });
    }
    setBlocker(config) {
        if (this.blocker) {
            this.blocker.destroy();
        }
        if (config) {
            return this.gestureCtrl.componentOnReady()
                .then(ctrl => ctrl.createBlocker(config))
                .then(blocker => this.blocker = blocker);
        }
        return Promise.resolve(null);
    }
    // DOWN *************************
    onTouchStart(ev) {
        this.lastTouch = now(ev);
        if (this.pointerDown(ev, this.lastTouch)) {
            this.enableMouse(false);
            this.enableTouch(true);
        }
        else {
            this.abortGesture();
        }
    }
    onMouseDown(ev) {
        const timeStamp = now(ev);
        if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
            if (this.pointerDown(ev, timeStamp)) {
                this.enableMouse(true);
                this.enableTouch(false);
            }
            else {
                this.abortGesture();
            }
        }
    }
    pointerDown(ev, timeStamp) {
        if (!this.gesture || this.hasStartedPan || !this.hasFiredStart) {
            return false;
        }
        const detail = this.detail;
        updateDetail(ev, detail);
        detail.startX = detail.currentX;
        detail.startY = detail.currentY;
        detail.startTimeStamp = detail.timeStamp = timeStamp;
        detail.velocityX = detail.velocityY = detail.deltaX = detail.deltaY = 0;
        detail.event = ev;
        this.positions.length = 0;
        assert(this.hasFiredStart, 'fired start must be false');
        assert(!this.hasStartedPan, 'pan can be started at this point');
        assert(!this.hasCapturedPan, 'pan can be started at this point');
        assert(!this.isMoveQueued, 'some move is still queued');
        assert(this.positions.length === 0, 'positions must be emprty');
        // Check if gesture can start
        if (this.canStart && this.canStart(detail) === false) {
            return false;
        }
        // Release fallback
        this.gesture.release();
        // Start gesture
        if (!this.gesture.start()) {
            return false;
        }
        this.positions.push(detail.currentX, detail.currentY, timeStamp);
        if (this.pan) {
            this.hasStartedPan = true;
            if (this.threshold === 0) {
                return this.tryToCapturePan();
            }
            this.pan.start(detail.startX, detail.startY);
        }
        return true;
    }
    // MOVE *************************
    onTouchMove(ev) {
        this.lastTouch = this.detail.timeStamp = now(ev);
        this.pointerMove(ev);
    }
    onMoveMove(ev) {
        const timeStamp = now(ev);
        if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
            this.detail.timeStamp = timeStamp;
            this.pointerMove(ev);
        }
    }
    pointerMove(ev) {
        assert(!!this.pan, 'pan must be non null');
        // fast path, if gesture is currently captured
        // do minimun job to get user-land even dispatched
        if (this.hasCapturedPan) {
            if (!this.isMoveQueued && this.hasFiredStart) {
                this.isMoveQueued = true;
                this.calcGestureData(ev);
                this.dom.write(this.fireOnMove.bind(this));
            }
            return;
        }
        // gesture is currently being detected
        const detail = this.detail;
        this.calcGestureData(ev);
        if (this.pan.detect(detail.currentX, detail.currentY)) {
            if (this.pan.isGesture()) {
                if (!this.tryToCapturePan()) {
                    this.abortGesture();
                }
            }
        }
    }
    fireOnMove() {
        // Since fireOnMove is called inside a RAF, onEnd() might be called,
        // we must double check hasCapturedPan
        if (!this.hasCapturedPan) {
            return;
        }
        const detail = this.detail;
        this.isMoveQueued = false;
        if (this.onMove) {
            this.onMove(detail);
        }
        else {
            this.ionGestureMove.emit(detail);
        }
    }
    calcGestureData(ev) {
        const detail = this.detail;
        updateDetail(ev, detail);
        const currentX = detail.currentX;
        const currentY = detail.currentY;
        const timestamp = detail.timeStamp;
        detail.deltaX = currentX - detail.startX;
        detail.deltaY = currentY - detail.startY;
        detail.event = ev;
        const timeRange = timestamp - 100;
        const positions = this.positions;
        let startPos = positions.length - 1;
        // move pointer to position measured 100ms ago
        while (startPos > 0 && positions[startPos] > timeRange) {
            startPos -= 3;
        }
        if (startPos > 1) {
            // compute relative movement between these two points
            const frequency = 1 / (positions[startPos] - timestamp);
            const movedY = positions[startPos - 1] - currentY;
            const movedX = positions[startPos - 2] - currentX;
            // based on XXms compute the movement to apply for each render step
            // velocity = space/time = s*(1/t) = s*frequency
            detail.velocityX = movedX * frequency;
            detail.velocityY = movedY * frequency;
        }
        else {
            detail.velocityX = 0;
            detail.velocityY = 0;
        }
        positions.push(currentX, currentY, timestamp);
    }
    tryToCapturePan() {
        if (this.gesture && !this.gesture.capture()) {
            return false;
        }
        this.hasCapturedPan = true;
        this.hasFiredStart = false;
        // reset start position since the real user-land event starts here
        // If the pan detector threshold is big, not reseting the start position
        // will cause a jump in the animation equal to the detector threshold.
        // the array of positions used to calculate the gesture velocity does not
        // need to be cleaned, more points in the positions array always results in a
        // more acurate value of the velocity.
        const detail = this.detail;
        detail.startX = detail.currentX;
        detail.startY = detail.currentY;
        detail.startTimeStamp = detail.timeStamp;
        if (this.onWillStart) {
            this.onWillStart(this.detail).then(this.fireOnStart.bind(this));
        }
        else {
            this.fireOnStart();
        }
        return true;
    }
    fireOnStart() {
        assert(!this.hasFiredStart, 'has fired must be false');
        if (this.onStart) {
            this.onStart(this.detail);
        }
        else {
            this.ionGestureStart.emit(this.detail);
        }
        this.hasFiredStart = true;
    }
    abortGesture() {
        this.reset();
        this.enable(false);
        this.notCaptured && this.notCaptured(this.detail);
    }
    reset() {
        this.hasCapturedPan = false;
        this.hasStartedPan = false;
        this.isMoveQueued = false;
        this.hasFiredStart = true;
        this.gesture && this.gesture.release();
    }
    // END *************************
    onTouchCancel(ev) {
        this.lastTouch = this.detail.timeStamp = now(ev);
        this.pointerUp(ev);
        this.enableTouch(false);
    }
    onMouseUp(ev) {
        const timeStamp = now(ev);
        if (this.lastTouch === 0 || (this.lastTouch + MOUSE_WAIT < timeStamp)) {
            this.detail.timeStamp = timeStamp;
            this.pointerUp(ev);
            this.enableMouse(false);
        }
    }
    pointerUp(ev) {
        const hasCaptured = this.hasCapturedPan;
        const hasFiredStart = this.hasFiredStart;
        this.reset();
        if (!hasFiredStart) {
            return;
        }
        const detail = this.detail;
        this.calcGestureData(ev);
        // Try to capture press
        if (hasCaptured) {
            detail.type = 'pan';
            if (this.onEnd) {
                this.onEnd(detail);
            }
            else {
                this.ionGestureEnd.emit(detail);
            }
            return;
        }
        // Try to capture press
        if (this.hasPress && this.detectPress()) {
            return;
        }
        // Not captured any event
        if (this.notCaptured) {
            this.notCaptured(detail);
        }
        else {
            this.ionGestureNotCaptured.emit(detail);
        }
    }
    detectPress() {
        const detail = this.detail;
        const vecX = detail.deltaX;
        const vecY = detail.deltaY;
        const dis = vecX * vecX + vecY * vecY;
        if (dis < 100) {
            detail.type = 'press';
            if (this.onPress) {
                this.onPress(detail);
            }
            else {
                this.ionPress.emit(detail);
            }
            return true;
        }
        return false;
    }
    // ENABLE LISTENERS *************************
    enableMouse(shouldEnable) {
        if (this.pan) {
            this.enableListener(this, 'document:mousemove', shouldEnable, undefined, this.passive);
        }
        this.enableListener(this, 'document:mouseup', shouldEnable, undefined, this.passive);
    }
    enableTouch(shouldEnable) {
        if (this.pan) {
            this.enableListener(this, 'touchmove', shouldEnable, this.attachTo, this.passive);
        }
        this.enableListener(this, 'touchcancel', shouldEnable, this.attachTo, this.passive);
        this.enableListener(this, 'touchend', shouldEnable, this.attachTo, this.passive);
    }
    enable(shouldEnable) {
        this.enableMouse(shouldEnable);
        this.enableTouch(shouldEnable);
    }
    componentDidUnload() {
        if (this.blocker) {
            this.blocker.destroy();
            this.blocker = null;
        }
        this.gesture && this.gesture.destroy();
        this.gesture = this.pan = this.detail = this.detail.event = null;
    }
    static get is() { return "ion-gesture"; }
    static get properties() { return { "attachTo": { "type": "Any", "attr": "attach-to" }, "autoBlockAll": { "type": Boolean, "attr": "auto-block-all" }, "block": { "type": String, "attr": "block", "watchCallbacks": ["blockChanged"] }, "canStart": { "type": "Any", "attr": "can-start" }, "direction": { "type": String, "attr": "direction" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "disableScroll": { "type": Boolean, "attr": "disable-scroll" }, "dom": { "context": "dom" }, "enableListener": { "context": "enableListener" }, "gestureCtrl": { "connect": "ion-gesture-controller" }, "gestureName": { "type": String, "attr": "gesture-name" }, "gesturePriority": { "type": Number, "attr": "gesture-priority" }, "maxAngle": { "type": Number, "attr": "max-angle" }, "notCaptured": { "type": "Any", "attr": "not-captured" }, "onEnd": { "type": "Any", "attr": "on-end" }, "onMove": { "type": "Any", "attr": "on-move" }, "onPress": { "type": "Any", "attr": "on-press" }, "onStart": { "type": "Any", "attr": "on-start" }, "onWillStart": { "type": "Any", "attr": "on-will-start" }, "passive": { "type": Boolean, "attr": "passive" }, "threshold": { "type": Number, "attr": "threshold" }, "type": { "type": String, "attr": "type" } }; }
    static get events() { return [{ "name": "ionGestureMove", "method": "ionGestureMove", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionGestureStart", "method": "ionGestureStart", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionGestureEnd", "method": "ionGestureEnd", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionGestureNotCaptured", "method": "ionGestureNotCaptured", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPress", "method": "ionPress", "bubbles": true, "cancelable": true, "composed": true }]; }
}
const MOUSE_WAIT = 2500;

export { Gesture as IonGesture, GestureController as IonGestureController };
