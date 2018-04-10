import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, NgModule, NgZone, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

var KeypadValue;
(function (KeypadValue) {
    KeypadValue["Clear"] = "clear";
    KeypadValue["Extra"] = "extra";
})(KeypadValue || (KeypadValue = {}));

var BdKeypadComponent = /** @class */ (function () {
    function BdKeypadComponent() {
        this.blocked = false;
        this.showExtraButton = false;
        this.onKeyPressed = new EventEmitter();
        this.KeypadValue = KeypadValue;
    }
    BdKeypadComponent.prototype.keypadClicked = function (value) {
        if (!this.blocked) {
            this.onKeyPressed.emit(value);
        }
    };
    BdKeypadComponent.prototype.keyPressed = function (event) {
        var keycode = window.event ? event.which : event.keyCode;
        // number
        if (keycode >= 48 && keycode <= 57) {
            this.keypadClicked(String(keycode - 48));
            // number on numpad
        }
        else if (keycode >= 96 && keycode <= 105) {
            this.keypadClicked(String(keycode - 96));
            // backspace or delete
        }
        else if (keycode === 8 || keycode === 46) {
            this.keypadClicked(KeypadValue.Clear);
        }
    };
    BdKeypadComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-keypad2',
                    template: "<span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('1')\">1</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('2')\">2</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('3')\">3</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('4')\">4</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('5')\">5</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('6')\">6</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('7')\">7</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('8')\">8</span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('9')\">9</span><span class=\"ng2-c-keypad__key ng2-c-keypad__key--is-extra\" (click)=\"keypadClicked(KeypadValue.Extra)\" *ngIf=\"showExtraButton\">    <i class=\"ng2-c-keypad__key-extra\" [ngClass]=\"extraOptionIcon\"></i></span><span class=\"ng2-c-keypad__key\" (bdKeypadClick)=\"keypadClicked('0')\">0</span><span class=\"ng2-c-keypad__key ng2-c-keypad__key--text\" (bdKeypadClick)=\"keypadClicked(KeypadValue.Clear)\">{{ clearLabel }}</span>",
                    host: { 'class': 'ng2-c-keypad' }
                },] },
    ];
    /** @nocollapse */
    BdKeypadComponent.ctorParameters = function () { return []; };
    BdKeypadComponent.propDecorators = {
        "blocked": [{ type: Input },],
        "clearLabel": [{ type: Input },],
        "extraOptionIcon": [{ type: Input },],
        "showExtraButton": [{ type: Input },],
        "onKeyPressed": [{ type: Output },],
        "keyPressed": [{ type: HostListener, args: ['window:keydown', ['$event'],] },],
    };
    return BdKeypadComponent;
}());

var ATTRIBUTE_NAME = 'bdKeypadClick';
var KeypadClickDirective = /** @class */ (function () {
    function KeypadClickDirective(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.eventType = 'click';
        this.emitter = new EventEmitter();
    }
    KeypadClickDirective.prototype.ngAfterViewInit = function () {
        this.checkEventType();
    };
    KeypadClickDirective.prototype.ngOnDestroy = function () {
        this.elementRef.nativeElement.removeEventListener(this.eventType, this.eventListener);
    };
    KeypadClickDirective.prototype.handleEvent = function (event, value) {
        var _this = this;
        if (this.eventType === event.type) {
            event.stopPropagation();
            // if we don't use zone.run() there is a delay on the input and
            // keypad doesn't feel smooth
            this.ngZone.run(function () { return _this.emitter.emit(value); });
        }
    };
    KeypadClickDirective.prototype.checkEventType = function () {
        var _this = this;
        if (window.navigator.pointerEnabled) {
            this.eventType = 'pointerdown';
        }
        else if (window.navigator.msPointerEnabled) {
            this.eventType = 'MSPointerDown';
        }
        else if ('ontouchstart' in document.documentElement) {
            this.eventType = 'touchstart';
        }
        else {
            this.eventType = 'click';
        }
        this.eventListener = function (event, value) { return _this.handleEvent(event, value); };
        this.elementRef.nativeElement.addEventListener(this.eventType, this.eventListener);
    };
    KeypadClickDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    KeypadClickDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: NgZone, },
    ]; };
    KeypadClickDirective.propDecorators = {
        "emitter": [{ type: Output, args: [ATTRIBUTE_NAME,] },],
    };
    return KeypadClickDirective;
}());

var components = [
    BdKeypadComponent
];
var directives = [
    KeypadClickDirective
];
var BdKeypadModule = /** @class */ (function () {
    function BdKeypadModule() {
    }
    BdKeypadModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components.concat(directives),
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdKeypadModule.ctorParameters = function () { return []; };
    return BdKeypadModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdKeypadComponent, BdKeypadModule, KeypadClickDirective, KeypadValue };
//# sourceMappingURL=index.js.map
