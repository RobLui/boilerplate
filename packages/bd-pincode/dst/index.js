import { Component, ElementRef, EventEmitter, HostListener, Input, NgModule, Output, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

var BdPincodeComponent = /** @class */ (function () {
    function BdPincodeComponent($element) {
        this.$element = $element;
        this.errorClass = 'ng2-c-pincode--error';
        this.hideTime = 0;
        this.length = 4;
        this.readyTime = 100;
        this.$element = $element;
        this.onPincodeReady = new EventEmitter();
    }
    // need an array to use with *ngFor
    // need an array to use with *ngFor
    BdPincodeComponent.prototype.nrOfPincodeItems = 
    // need an array to use with *ngFor
    function () {
        return new Array(this.length).map(function (i) { return i; });
    };
    BdPincodeComponent.prototype.ngOnInit = function () {
        if (!this.value)
            this.value = []; // need this for when the value (ngModel value) is empty/undefined
    };
    BdPincodeComponent.prototype.ngOnChanges = function (changes) {
        if (changes.value && changes.value.currentValue) {
            var currentValue = changes.value.currentValue;
            var pinLength = currentValue ? currentValue.length : 0;
            var ready = currentValue.length === this.length;
            if (pinLength > 0 && this.pincodeForm) {
                this.removeError();
            }
            if (ready && (this.isShownAsBullets() || this.hideTime === 0)) {
                this.emitReady();
            }
            else if (this.inputElements) {
                var _loop_1 = function (i) {
                    var inputElement = this_1.inputElements.find(function (item, index) { return index === i; });
                    var isLastCharacter = i === (pinLength - 1);
                    if (i < pinLength) {
                        this_1.hidePincodeDigits(inputElement, isLastCharacter, ready);
                    }
                    else {
                        inputElement.nativeElement.setAttribute('type', 'text');
                        if (ready) {
                            this_1.emitReady();
                        }
                    }
                };
                var this_1 = this;
                for (var i = 0; i < this.inputElements.length; i++) {
                    _loop_1(i);
                }
            }
        }
    };
    BdPincodeComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.hideDigitsTimeout);
    };
    BdPincodeComponent.prototype.error = function () {
        this.pincodeForm.nativeElement.classList.add(this.errorClass);
    };
    BdPincodeComponent.prototype.removeError = function () {
        this.pincodeForm.nativeElement.classList.remove(this.errorClass);
    };
    BdPincodeComponent.prototype.hidePincodeDigits = function (inputElement, isLastCharacter, ready) {
        var _this = this;
        var typeAttr = this.hideTime ? 'password' : 'text';
        if (isLastCharacter && this.hideTime) {
            clearTimeout(this.hideDigitsTimeout);
            this.hideDigitsTimeout = window.setTimeout(function () {
                inputElement.nativeElement.setAttribute('type', typeAttr);
                if (ready) {
                    _this.emitReady(true);
                }
            }, ready ? this.readyTime : this.hideTime, false);
        }
        else {
            inputElement.nativeElement.setAttribute('type', typeAttr);
        }
    };
    BdPincodeComponent.prototype.emitReady = function (instantanious) {
        var _this = this;
        if (instantanious === void 0) { instantanious = false; }
        if (instantanious) {
            this.onPincodeReady.emit();
        }
        else {
            clearTimeout(this.onReadyTimeout);
            this.onReadyTimeout = window.setTimeout(function () { return _this.onPincodeReady.emit(); }, this.readyTime);
        }
    };
    BdPincodeComponent.prototype.isShownAsBullets = function () {
        return this.$element.nativeElement.classList.contains('ng2-c-pincode--bullets');
    };
    BdPincodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-pincode2',
                    template: "<form class=\"ng2-c-pincode__inner\" #pincodeForm>    <div class=\"ng2-c-pincode__loader-container\" [hidden]=\"!loading\">        <div class=\"ng2-c-loader\"></div>    </div>    <div [hidden]=\"loading\" class=\"ng2-c-pincode__items\" #pincodeItems>        <input type=\"text\" name=\"pincode-item-{{i}}\" class=\"ng2-c-pincode__item\" disabled #inputElement               [ngModel]=\"value[i]\" [ngClass]=\"{ 'ng2-c-pincode__item--active': value[i] }\"               *ngFor=\"let item of nrOfPincodeItems(); let i = index\">    </div></form>"
                },] },
    ];
    /** @nocollapse */
    BdPincodeComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdPincodeComponent.propDecorators = {
        "pincodeForm": [{ type: ViewChild, args: ['pincodeForm',] },],
        "pincodeItems": [{ type: ViewChild, args: ['pincodeItems',] },],
        "inputElements": [{ type: ViewChildren, args: ['inputElement',] },],
        "value": [{ type: Input },],
        "loading": [{ type: Input },],
        "hideTime": [{ type: Input },],
        "length": [{ type: Input },],
        "readyTime": [{ type: Input },],
        "onPincodeReady": [{ type: Output },],
        "removeError": [{ type: HostListener, args: ['animationend', ['$event'],] },],
    };
    return BdPincodeComponent;
}());

var components = [
    BdPincodeComponent
];
var BdPincodeModule = /** @class */ (function () {
    function BdPincodeModule() {
    }
    BdPincodeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdPincodeModule.ctorParameters = function () { return []; };
    return BdPincodeModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPincodeComponent, BdPincodeModule };
//# sourceMappingURL=index.js.map
