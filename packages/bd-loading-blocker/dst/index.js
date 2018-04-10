import { Component, Injectable, NgModule } from '@angular/core';
import { BdOverlayPlaceholderManager, BdOverlayPlaceholderModule } from '@delen/bd-overlay-placeholder';

var BdLoadingBlockerComponent = /** @class */ (function () {
    function BdLoadingBlockerComponent() {
    }
    BdLoadingBlockerComponent.prototype.onClick = function (event) {
        event.stopImmediatePropagation();
    };
    BdLoadingBlockerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-loading-blocker',
                    template: "<div class=\"ng2-c-loading-blocker\" (click)=\"onClick($event)\"></div>"
                },] },
    ];
    /** @nocollapse */
    BdLoadingBlockerComponent.ctorParameters = function () { return []; };
    return BdLoadingBlockerComponent;
}());

var BdLoadingBlockerService = /** @class */ (function () {
    function BdLoadingBlockerService(overlayPlaceholderManager) {
        this.overlayPlaceholderManager = overlayPlaceholderManager;
        this.blockCount = 0;
    }
    BdLoadingBlockerService.prototype.activate = function () {
        if (!this.isActive) {
            this.isActive = true;
            this.loadingBlocker = this.overlayPlaceholderManager.addComponent(BdLoadingBlockerComponent, null, true);
        }
        this.blockCount++;
    };
    BdLoadingBlockerService.prototype.deactivate = function () {
        if (this.isActive && this.blockCount > 0) {
            this.blockCount--;
            if (this.blockCount === 0) {
                this.isActive = false;
                this.overlayPlaceholderManager.removeComponent(this.loadingBlocker);
            }
        }
    };
    BdLoadingBlockerService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdLoadingBlockerService.ctorParameters = function () { return [
        { type: BdOverlayPlaceholderManager, },
    ]; };
    return BdLoadingBlockerService;
}());

var components = [
    BdLoadingBlockerComponent
];
var BdLoadingBlockerModule = /** @class */ (function () {
    function BdLoadingBlockerModule() {
    }
    BdLoadingBlockerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BdOverlayPlaceholderModule],
                    providers: [BdLoadingBlockerService],
                    declarations: components,
                    entryComponents: components
                },] },
    ];
    /** @nocollapse */
    BdLoadingBlockerModule.ctorParameters = function () { return []; };
    return BdLoadingBlockerModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdLoadingBlockerComponent as ɵa, BdLoadingBlockerModule, BdLoadingBlockerService };
//# sourceMappingURL=index.js.map
