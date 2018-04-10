import { Directive, HostBinding, Input, NgModule } from '@angular/core';

var ATTRIBUTE_NAME = 'bdNumberSign';
var BdNumberSignDirective = /** @class */ (function () {
    function BdNumberSignDirective() {
        this.hasPositiveClass = false;
        this.hasNegativeClass = false;
    }
    Object.defineProperty(BdNumberSignDirective.prototype, "numberOnChange", {
        set: function (value) {
            this.modifyElementClass(value);
        },
        enumerable: true,
        configurable: true
    });
    BdNumberSignDirective.prototype.modifyElementClass = function (value) {
        if (Number.isNaN(value) || typeof value !== 'number') {
            this.hasPositiveClass = false;
            this.hasNegativeClass = false;
        }
        else if (value >= 0) {
            this.hasPositiveClass = true;
            this.hasNegativeClass = false;
        }
        else if (value < 0) {
            this.hasPositiveClass = false;
            this.hasNegativeClass = true;
        }
    };
    BdNumberSignDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    BdNumberSignDirective.ctorParameters = function () { return []; };
    BdNumberSignDirective.propDecorators = {
        "hasPositiveClass": [{ type: HostBinding, args: ["class.u-color--positive",] },],
        "hasNegativeClass": [{ type: HostBinding, args: ["class.u-color--negative",] },],
        "numberOnChange": [{ type: Input, args: [ATTRIBUTE_NAME,] },],
    };
    return BdNumberSignDirective;
}());

var directives = [
    BdNumberSignDirective
];
var BdNumberModule = /** @class */ (function () {
    function BdNumberModule() {
    }
    BdNumberModule.decorators = [
        { type: NgModule, args: [{
                    declarations: directives,
                    exports: directives
                },] },
    ];
    /** @nocollapse */
    BdNumberModule.ctorParameters = function () { return []; };
    return BdNumberModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdNumberModule, BdNumberSignDirective };
//# sourceMappingURL=index.js.map
