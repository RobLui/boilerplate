import { Component, EventEmitter, HostBinding, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
import { BdScrollModule, BdScrollService } from '@delen/bd-scroll';
import { BdDeviceService } from '@delen/bd-utilities';
import { BdOverlayPlaceholderManager } from '@delen/bd-overlay-placeholder';

var BdBackdropOptions = /** @class */ (function () {
    function BdBackdropOptions(blur, disableBackground) {
        if (blur === void 0) { blur = false; }
        if (disableBackground === void 0) { disableBackground = false; }
        this.blur = blur;
        this.disableBackground = disableBackground;
    }
    return BdBackdropOptions;
}());

var BdBackdropComponent = /** @class */ (function () {
    function BdBackdropComponent() {
        this.whenClicked = new EventEmitter();
    }
    Object.defineProperty(BdBackdropComponent.prototype, "isTransparent", {
        get: function () {
            return this.options && this.options.disableBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdBackdropComponent.prototype, "isBlurred", {
        get: function () {
            return this.options && this.options.blur;
        },
        enumerable: true,
        configurable: true
    });
    BdBackdropComponent.prototype.clicked = function () {
        this.whenClicked.emit();
    };
    BdBackdropComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-backdrop2',
                    template: '',
                    host: {
                        class: 'ng2-c-backdrop'
                    }
                },] },
    ];
    /** @nocollapse */
    BdBackdropComponent.ctorParameters = function () { return []; };
    BdBackdropComponent.propDecorators = {
        "options": [{ type: Input },],
        "whenClicked": [{ type: Output },],
        "isTransparent": [{ type: HostBinding, args: ['class.ng2-c-backdrop--is-transparent',] },],
        "isBlurred": [{ type: HostBinding, args: ['class.ng2-c-backdrop--is-blurred',] },],
        "clicked": [{ type: HostListener, args: ['click',] },],
    };
    return BdBackdropComponent;
}());

var BdBackdropService = /** @class */ (function () {
    function BdBackdropService(bdScrollService, overlayPlaceholderManager, bdDeviceService) {
        this.bdScrollService = bdScrollService;
        this.overlayPlaceholderManager = overlayPlaceholderManager;
        this.bdDeviceService = bdDeviceService;
        this.backdrops = 0;
    }
    BdBackdropService.prototype.add = function (options) {
        if (options === void 0) { options = new BdBackdropOptions(); }
        this.addLevel();
        // construct backdrop component
        var componentRef = this.overlayPlaceholderManager.addComponent(BdBackdropComponent);
        // get the instance and set its properties
        var backdrop = (componentRef.instance);
        backdrop.options = options;
        // keep track of backdropcount
        this.hideKeyboard();
        this.bdScrollService.freeze();
        return componentRef;
    };
    BdBackdropService.prototype.remove = function (backdrop) {
        this.removeLevel();
        this.overlayPlaceholderManager.removeComponent(backdrop);
        this.bdScrollService.unfreeze();
    };
    BdBackdropService.prototype.hideKeyboard = function () {
        // Blur active element (hides the keyboard when opening a backdrop)
        if (document.activeElement && typeof document.activeElement['blur'] === 'function') {
            document.activeElement['blur']();
        }
    };
    /**
    * Update the number of visible backdrops.
    * Also sets a body class with the current number of backdrops.
    * NOTE: this only happens on iOS (see bug #6728) #gohacks!
    */
    /**
         * Update the number of visible backdrops.
         * Also sets a body class with the current number of backdrops.
         * NOTE: this only happens on iOS (see bug #6728) #gohacks!
         */
    BdBackdropService.prototype.addLevel = /**
         * Update the number of visible backdrops.
         * Also sets a body class with the current number of backdrops.
         * NOTE: this only happens on iOS (see bug #6728) #gohacks!
         */
    function () {
        if (!this.bdDeviceService.isIOS())
            return;
        this.backdrops++;
        if (this.backdrops > 0) {
            this.addLevelClass();
        }
    };
    /**
     * Update the number of visible backdrops.
     * Also sets a body class with the current number of backdrops and removes it when no backdrops are present.
     * NOTE: this only happens on iOS (see bug #6728) #gohacks!
     */
    /**
         * Update the number of visible backdrops.
         * Also sets a body class with the current number of backdrops and removes it when no backdrops are present.
         * NOTE: this only happens on iOS (see bug #6728) #gohacks!
         */
    BdBackdropService.prototype.removeLevel = /**
         * Update the number of visible backdrops.
         * Also sets a body class with the current number of backdrops and removes it when no backdrops are present.
         * NOTE: this only happens on iOS (see bug #6728) #gohacks!
         */
    function () {
        if (!this.bdDeviceService.isIOS())
            return;
        --this.backdrops;
        if (this.backdrops > 0) {
            this.addLevelClass();
        }
        else {
            this.removeLevelClass();
        }
    };
    /**
     * Set the level class on the body element.
     */
    /**
         * Set the level class on the body element.
         */
    BdBackdropService.prototype.addLevelClass = /**
         * Set the level class on the body element.
         */
    function () {
        if (this.bodyLevelClass)
            this.removeLevelClass();
        this.bodyLevelClass = "body--backdrop-level-" + this.backdrops;
        document.body.classList.add(this.bodyLevelClass);
    };
    /**
     * Removes the level class from the body element.
     */
    /**
         * Removes the level class from the body element.
         */
    BdBackdropService.prototype.removeLevelClass = /**
         * Removes the level class from the body element.
         */
    function () {
        document.body.classList.remove(this.bodyLevelClass);
    };
    BdBackdropService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdBackdropService.ctorParameters = function () { return [
        { type: BdScrollService, },
        { type: BdOverlayPlaceholderManager, },
        { type: BdDeviceService, },
    ]; };
    return BdBackdropService;
}());

var components = [
    BdBackdropComponent
];
var BdBackdropModule = /** @class */ (function () {
    function BdBackdropModule() {
    }
    BdBackdropModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        BdScrollModule
                    ],
                    declarations: components,
                    exports: components,
                    providers: [
                        BdBackdropService
                    ],
                    entryComponents: components
                },] },
    ];
    /** @nocollapse */
    BdBackdropModule.ctorParameters = function () { return []; };
    return BdBackdropModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdBackdropModule, BdBackdropService, BdBackdropComponent, BdBackdropOptions };
//# sourceMappingURL=index.js.map
