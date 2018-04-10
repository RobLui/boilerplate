import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

var BdPageIndexComponent = /** @class */ (function () {
    function BdPageIndexComponent() {
    }
    // need an array for ngFor
    // need an array for ngFor
    BdPageIndexComponent.prototype.nrOfPagesArray = 
    // need an array for ngFor
    function () {
        return new Array(this.nrOfPages);
    };
    BdPageIndexComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-page-index',
                    template: "<span    class=\"ng2-c-page-index__item\"    [ngClass]=\"{'ng2-c-page-index__item--is-active': i === currentPage}\"    *ngFor=\"let item of nrOfPagesArray(); let i = index\"></span>",
                    host: { class: 'ng2-c-page-index' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdPageIndexComponent.ctorParameters = function () { return []; };
    BdPageIndexComponent.propDecorators = {
        "nrOfPages": [{ type: Input },],
        "currentPage": [{ type: Input },],
    };
    return BdPageIndexComponent;
}());

var components = [
    BdPageIndexComponent
];
var BdPageIndexModule = /** @class */ (function () {
    function BdPageIndexModule() {
    }
    BdPageIndexModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdPageIndexModule.ctorParameters = function () { return []; };
    return BdPageIndexModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPageIndexModule, BdPageIndexComponent };
//# sourceMappingURL=index.js.map
