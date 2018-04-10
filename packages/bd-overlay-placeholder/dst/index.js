import { Component, Injectable, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { BdUtilitiesModule, ComponentService } from '@delen/bd-utilities';
import { CommonModule } from '@angular/common';

var BdOverlayPlaceholderManager = /** @class */ (function () {
    function BdOverlayPlaceholderManager(componentService) {
        this.componentService = componentService;
        this.toppers = 0;
    }
    Object.defineProperty(BdOverlayPlaceholderManager.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (value) {
            if (this._placeholder) {
                throw Error('placeholder can only be set once');
            }
            this._placeholder = value;
        },
        enumerable: true,
        configurable: true
    });
    BdOverlayPlaceholderManager.prototype.addComponent = function (componentType, data, alwaysOnTop) {
        if (alwaysOnTop === void 0) { alwaysOnTop = false; }
        this.ensurePlaceholderExist();
        if (alwaysOnTop) {
            return this.componentService.create(this.placeholder, componentType, data);
        }
        else {
            return this.componentService.create(this.placeholder, componentType, data, this.toppers++);
        }
    };
    BdOverlayPlaceholderManager.prototype.removeComponent = function (componentRef) {
        this.destroyView(componentRef.hostView);
        componentRef.destroy();
    };
    BdOverlayPlaceholderManager.prototype.addTemplate = function (templateRef, alwaysOnTop) {
        if (alwaysOnTop === void 0) { alwaysOnTop = false; }
        this.ensurePlaceholderExist();
        if (alwaysOnTop) {
            return this.placeholder.createEmbeddedView(templateRef);
        }
        else {
            return this.placeholder.createEmbeddedView(templateRef, undefined, this.toppers++);
        }
    };
    BdOverlayPlaceholderManager.prototype.removeTemplate = function (viewRef) {
        this.destroyView(viewRef);
    };
    BdOverlayPlaceholderManager.prototype.ensurePlaceholderExist = function () {
        if (!this.placeholder) {
            throw Error('Placeholder not set');
        }
    };
    BdOverlayPlaceholderManager.prototype.destroyView = function (viewRef) {
        this.ensurePlaceholderExist();
        var found = this.placeholder.indexOf(viewRef);
        if (found === -1) {
            throw Error('component or embedded view to remove was not found in the placeholder');
        }
        this.placeholder.remove(found);
        viewRef.destroy();
        if (found < this.toppers) {
            this.toppers--;
        }
    };
    BdOverlayPlaceholderManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdOverlayPlaceholderManager.ctorParameters = function () { return [
        { type: ComponentService, },
    ]; };
    return BdOverlayPlaceholderManager;
}());

var BdOverlayPlaceholderComponent = /** @class */ (function () {
    function BdOverlayPlaceholderComponent(overlayPlaceholderManager) {
        this.overlayPlaceholderManager = overlayPlaceholderManager;
    }
    BdOverlayPlaceholderComponent.prototype.ngOnInit = function () {
        this.overlayPlaceholderManager.placeholder = this.placeholder;
    };
    BdOverlayPlaceholderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-overlay-placeholder2',
                    template: "<ng-template #placeholder></ng-template>",
                    host: { 'class': 'ng2-c-overlay-placeholder' }
                },] },
    ];
    /** @nocollapse */
    BdOverlayPlaceholderComponent.ctorParameters = function () { return [
        { type: BdOverlayPlaceholderManager, },
    ]; };
    BdOverlayPlaceholderComponent.propDecorators = {
        "placeholder": [{ type: ViewChild, args: ['placeholder', { read: ViewContainerRef },] },],
    };
    return BdOverlayPlaceholderComponent;
}());

var BdOverlayPlaceholderModule = /** @class */ (function () {
    function BdOverlayPlaceholderModule() {
    }
    BdOverlayPlaceholderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdUtilitiesModule
                    ],
                    declarations: [BdOverlayPlaceholderComponent],
                    providers: [BdOverlayPlaceholderManager],
                    exports: [BdOverlayPlaceholderComponent],
                    entryComponents: [BdOverlayPlaceholderComponent]
                },] },
    ];
    /** @nocollapse */
    BdOverlayPlaceholderModule.ctorParameters = function () { return []; };
    return BdOverlayPlaceholderModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdOverlayPlaceholderComponent, BdOverlayPlaceholderModule, BdOverlayPlaceholderManager };
//# sourceMappingURL=index.js.map
