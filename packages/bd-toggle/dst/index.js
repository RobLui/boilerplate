import { Component, ElementRef, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var BdToggleComponent = /** @class */ (function () {
    function BdToggleComponent(el) {
        this.el = el;
    }
    Object.defineProperty(BdToggleComponent.prototype, "checked", {
        set: function (value) {
            this.checkedValue = value;
            this.checkedChanged();
        },
        enumerable: true,
        configurable: true
    });
    BdToggleComponent.prototype.checkedChanged = function () {
        var className = 'ng2-c-toggle--checked';
        if (this.checkedValue) {
            this.el.nativeElement.classList.add(className);
        }
        else {
            this.el.nativeElement.classList.remove(className);
        }
    };
    BdToggleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-toggle2',
                    template: "<div *ngIf=\"loading\" class=\"ng2-c-toggle__loader\"><div class=\"ng2-c-loader ng2-c-loader--green ng2-c-loader--small\"></div></div>",
                    host: { 'class': 'ng2-c-toggle' }
                },] },
    ];
    /** @nocollapse */
    BdToggleComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdToggleComponent.propDecorators = {
        "checked": [{ type: Input },],
        "loading": [{ type: Input },],
    };
    return BdToggleComponent;
}());

var components = [
    BdToggleComponent
];
var BdToggleModule = /** @class */ (function () {
    function BdToggleModule() {
    }
    BdToggleModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdToggleModule.ctorParameters = function () { return []; };
    return BdToggleModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdToggleComponent, BdToggleModule };
//# sourceMappingURL=index.js.map
