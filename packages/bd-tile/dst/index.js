import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BdCheckboxModule } from '@delen/bd-checkbox';

var BdTileComponent = /** @class */ (function () {
    function BdTileComponent() {
        this.toggle = new EventEmitter();
    }
    BdTileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-tile2',
                    template: "<label class=\"ng2-c-tile__container\" [class.ng2-c-tile__container--is-active]=\"active\">    <bd-checkbox2 class=\"ng2-c-tile__checkbox\" [ngModel]=\"active\" [autocheck]=\"false\" (beforeChange)=\"toggle.emit($event)\"></bd-checkbox2>    <i class=\"ng2-c-tile__icon\" [ngClass]=\"'icon-hobby--' + icon\"></i>    <span class=\"ng2-c-tile__text\">{{label}}</span>    <div class=\"ng2-c-data-state\" *ngIf=\"loading\">        <div class=\"ng2-c-data-state__icon\">            <div class=\"ng2-c-loader ng2-c-loader--green\"></div>        </div>    </div></label>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'ng2-c-tile' }
                },] },
    ];
    /** @nocollapse */
    BdTileComponent.ctorParameters = function () { return []; };
    BdTileComponent.propDecorators = {
        "icon": [{ type: Input },],
        "label": [{ type: Input },],
        "loading": [{ type: Input },],
        "active": [{ type: Input },],
        "toggle": [{ type: Output },],
    };
    return BdTileComponent;
}());

var BdTilesComponent = /** @class */ (function () {
    function BdTilesComponent() {
    }
    BdTilesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-tiles2',
                    template: "<div class=\"ng2-c-tiles\"><ng-content></ng-content></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTilesComponent.ctorParameters = function () { return []; };
    return BdTilesComponent;
}());

var components = [
    BdTileComponent,
    BdTilesComponent
];
var BdTileModule = /** @class */ (function () {
    function BdTileModule() {
    }
    BdTileModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, BdCheckboxModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdTileModule.ctorParameters = function () { return []; };
    return BdTileModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdTileModule, BdTileComponent, BdTilesComponent };
//# sourceMappingURL=index.js.map
