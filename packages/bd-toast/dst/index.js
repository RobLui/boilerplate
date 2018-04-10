import { Component, ElementRef, HostListener, Injectable, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdUtilitiesModule, ComponentService, Deferred } from '@delen/bd-utilities';
import { BdOverlayPlaceholderManager } from '@delen/bd-overlay-placeholder';

var BdToastType;
(function (BdToastType) {
    BdToastType["Success"] = "success";
    BdToastType["Error"] = "error";
    BdToastType["Warning"] = "warning";
})(BdToastType || (BdToastType = {}));

var BdToast = /** @class */ (function () {
    function BdToast(toast) {
        this.openDeferred = new Deferred();
        this.closeDeferred = new Deferred();
        this.type = BdToastType.Error;
        this.animationTime = 6000;
        Object.assign(this, toast);
    }
    Object.defineProperty(BdToast.prototype, "openPromise", {
        get: function () {
            return this.openDeferred.promise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdToast.prototype, "closePromise", {
        get: function () {
            return this.closeDeferred.promise;
        },
        enumerable: true,
        configurable: true
    });
    BdToast.prototype.resolveOpenPromise = function () {
        this.openDeferred.resolve();
    };
    BdToast.prototype.resolveClosePromise = function () {
        this.closeDeferred.resolve();
    };
    return BdToast;
}());

var BdToastComponent = /** @class */ (function () {
    function BdToastComponent(toast, componentService, el) {
        this.toast = toast;
        this.componentService = componentService;
        this.el = el;
        this.CLASS_TYPE_SUCCESS = 'ng2-c-toast--success';
        this.CLASS_TYPE_WARNING = 'ng2-c-toast--warning';
        this.CLASS_TYPE_ERROR = 'ng2-c-toast--error';
        this.CLASS_CUSTOM_TOAST = 'ng2-c-toast__custom';
    }
    BdToastComponent.prototype.onClick = function (event) {
        event.stopPropagation();
    };
    BdToastComponent.prototype.onTouchMove = function (event) {
        event.preventDefault();
    };
    BdToastComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.toast.hide = function () { return _this.hide(); };
        window.requestAnimationFrame(function () {
            _this.show().then(function () { return _this.toast.resolveOpenPromise(); });
        });
        if (this.toast.animationTime) {
            this.animationTimeout = window.setTimeout(function () { return _this.close(); }, this.toast.animationTime);
        }
    };
    BdToastComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            if (_this.toast.content && typeof _this.toast.content !== 'string') {
                var componentRef = _this.componentService.create(_this.contentView, _this.toast.content.type, [_this.toast.content.data]);
                componentRef.location.nativeElement.classList.add(_this.CLASS_CUSTOM_TOAST);
            }
        });
    };
    BdToastComponent.prototype.ngOnDestroy = function () {
        window.clearTimeout(this.animationTimeout);
    };
    BdToastComponent.prototype.getContentType = function () {
        return typeof this.toast.content;
    };
    BdToastComponent.prototype.close = function () {
        this.toast.close();
    };
    BdToastComponent.prototype.show = function () {
        this.setType();
        return this.slideDown();
    };
    BdToastComponent.prototype.hide = function () {
        return this.slideUp();
    };
    BdToastComponent.prototype.setType = function () {
        var typeClass;
        switch (this.toast.type) {
            case BdToastType.Success:
                typeClass = this.CLASS_TYPE_SUCCESS;
                break;
            case BdToastType.Warning:
                typeClass = this.CLASS_TYPE_WARNING;
                break;
            case BdToastType.Error:
                typeClass = this.CLASS_TYPE_ERROR;
                break;
            default:
                throw new Error("Unknown bd-toast type: " + this.toast.type);
        }
        this.el.nativeElement.classList.add(typeClass);
    };
    BdToastComponent.prototype.slideUp = function () {
        return this.slide();
    };
    BdToastComponent.prototype.slideDown = function () {
        return this.slide('0px');
    };
    BdToastComponent.prototype.slide = function (position) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transitionEndListener = function () {
                resolve();
                _this.el.nativeElement.removeEventListener('transitionend', transitionEndListener);
            };
            _this.el.nativeElement.addEventListener('transitionend', transitionEndListener);
            window.requestAnimationFrame(function () {
                _this.el.nativeElement.style.transform = position ? "translateY(" + position + ")" : '';
            });
        });
    };
    BdToastComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-toast2',
                    host: { 'class': 'ng2-c-toast' },
                    template: "<div class=\"ng2-c-toast__center\" [ngSwitch]=\"getContentType()\">    <div class=\"ng2-c-toast__title\" *ngSwitchCase=\"'string'\">{{toast.content}}</div>    <ng-template #contentView *ngSwitchCase=\"'object'\"></ng-template></div><div class=\"ng2-c-toast__right\">    <i class=\"ng2-c-header__icon icon-close\" (click)=\"close()\"></i></div>"
                },] },
    ];
    /** @nocollapse */
    BdToastComponent.ctorParameters = function () { return [
        { type: BdToast, },
        { type: ComponentService, },
        { type: ElementRef, },
    ]; };
    BdToastComponent.propDecorators = {
        "contentView": [{ type: ViewChild, args: ['contentView', { read: ViewContainerRef },] },],
        "onClick": [{ type: HostListener, args: ['click', ['$event'],] },],
        "onTouchMove": [{ type: HostListener, args: ['touchmove', ['$event'],] },],
    };
    return BdToastComponent;
}());

var BdToastManager = /** @class */ (function () {
    function BdToastManager(overlayPlaceholderManager) {
        this.overlayPlaceholderManager = overlayPlaceholderManager;
    }
    BdToastManager.prototype.open = function (toast) {
        var _this = this;
        if (this.toast) {
            this.close().then(function () { return _this.open(toast); });
        }
        else {
            this.create(toast);
        }
    };
    BdToastManager.prototype.close = function () {
        var _this = this;
        if (!this.toast) {
            return Promise.resolve();
        }
        var toastToClose = this.toast;
        this.toast = null;
        toastToClose.openPromise
            .then(function () { return toastToClose.hide(); })
            .then(function () { return _this.destroy(toastToClose); });
        return toastToClose.closePromise;
    };
    BdToastManager.prototype.destroy = function (toast) {
        this.overlayPlaceholderManager.removeComponent(toast.componentRef);
        toast.resolveClosePromise();
    };
    BdToastManager.prototype.create = function (toast) {
        var _this = this;
        toast.componentRef = this.overlayPlaceholderManager.addComponent(BdToastComponent, [toast], true);
        toast.close = function () { return _this.close(); };
        this.toast = toast;
    };
    BdToastManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdToastManager.ctorParameters = function () { return [
        { type: BdOverlayPlaceholderManager, },
    ]; };
    return BdToastManager;
}());

var BdToastModule = /** @class */ (function () {
    function BdToastModule() {
    }
    BdToastModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdUtilitiesModule
                    ],
                    declarations: [BdToastComponent],
                    providers: [BdToastManager],
                    exports: [BdToastComponent],
                    entryComponents: [BdToastComponent]
                },] },
    ];
    /** @nocollapse */
    BdToastModule.ctorParameters = function () { return []; };
    return BdToastModule;
}());

var BdToastContent = /** @class */ (function () {
    function BdToastContent(type, data) {
        this.type = type;
        this.data = data;
    }
    return BdToastContent;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdToastModule, BdToastComponent, BdToastManager, BdToast, BdToastType, BdToastContent };
//# sourceMappingURL=index.js.map
