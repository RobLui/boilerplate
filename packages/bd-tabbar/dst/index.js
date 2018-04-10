import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var BdTabbarComponent = /** @class */ (function () {
    function BdTabbarComponent() {
    }
    BdTabbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-tabbar2',
                    template: "\n        <nav class=\"ng2-c-tabbar\">\n            <ul class=\"ng2-c-tabbar__list\">\n                <ng-content></ng-content>\n            </ul>\n        </nav>\n    "
                },] },
    ];
    /** @nocollapse */
    BdTabbarComponent.ctorParameters = function () { return []; };
    return BdTabbarComponent;
}());

var BdTabbarTabComponent = /** @class */ (function () {
    function BdTabbarTabComponent() {
    }
    BdTabbarTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-tabbar-tab2',
                    template: "\n        <li class=\"ng2-c-tabbar__item\" [ngClass]=\"{'ng2-c-tabbar__item--is-active' : active}\">\n            <div>\n                <i class=\"ng2-c-tabbar__icon\" [ngClass]=\"active ? icon + '-filled' : icon\"></i>\n                <span class=\"ng2-c-tabbar__label\">{{label}}</span>\n                <span class=\"ng2-c-tabbar__badge\" *ngIf=\"badgeCount\">{{badgeCount}}</span>\n            </div>\n        </li>\n    "
                },] },
    ];
    /** @nocollapse */
    BdTabbarTabComponent.ctorParameters = function () { return []; };
    BdTabbarTabComponent.propDecorators = {
        "icon": [{ type: Input },],
        "label": [{ type: Input },],
        "active": [{ type: Input },],
        "badgeCount": [{ type: Input },],
    };
    return BdTabbarTabComponent;
}());

var components = [
    BdTabbarComponent,
    BdTabbarTabComponent
];
var BdTabbarModule = /** @class */ (function () {
    function BdTabbarModule() {
    }
    BdTabbarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdTabbarModule.ctorParameters = function () { return []; };
    return BdTabbarModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdTabbarModule, BdTabbarComponent, BdTabbarTabComponent };
//# sourceMappingURL=index.js.map
