import { ComponentFactoryResolver, Injectable, Injector, NgModule, NgZone, ReflectiveInjector } from '@angular/core';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Rx';
import { Subject as Subject$1 } from 'rxjs/Subject';

var ComponentService = /** @class */ (function () {
    function ComponentService(injector, componentFactoryResolver) {
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ComponentService.prototype.create = function (viewContainer, type, data, index) {
        var factory = this.componentFactoryResolver.resolveComponentFactory(type);
        var providers = [];
        if (data) {
            data.forEach(function (dataObject) {
                providers.push({ provide: dataObject.constructor, useValue: dataObject });
            });
        }
        var injector = ReflectiveInjector.resolveAndCreate(providers, this.injector);
        return viewContainer.createComponent(factory, index, injector);
    };
    ComponentService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ComponentService.ctorParameters = function () { return [
        { type: Injector, },
        { type: ComponentFactoryResolver, },
    ]; };
    return ComponentService;
}());

var BdDeviceService = /** @class */ (function () {
    function BdDeviceService() {
        // tslint:disable-next-line:typedef
        this.breakpoints = {
            'tablet': 768
        };
        // tslint:disable-next-line:typedef
        this.bodyClasses = {
            'IOS': 'body--is-ios',
            'ANDROID': 'body--is-android'
        };
    }
    BdDeviceService.prototype.isIOS = function () {
        if (!this.isIOSDevice)
            this.isIOSDevice = document.body.classList.contains(this.bodyClasses.IOS);
        return this.isIOSDevice;
    };
    BdDeviceService.prototype.isAndroid = function () {
        if (!this.isAndroidDevice)
            this.isAndroidDevice = document.body.classList.contains(this.bodyClasses.ANDROID);
        return this.isAndroidDevice;
    };
    BdDeviceService.prototype.isTablet = function () {
        /**
                 * isTablet() will not use the CSS media queries because iPhone X would
                 * be seen as a tablet and not a phone.
                 * The fix? Check the smallest of width/height and use that value to
                 * determine isTablet.
                 */
        var width = Math.min(window.screen.width, window.screen.height);
        if (this.isIOS())
            width = Math.min(window.innerWidth, window.innerHeight);
        return width >= this.breakpoints.tablet;
    };
    BdDeviceService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdDeviceService.ctorParameters = function () { return []; };
    return BdDeviceService;
}());

var BdRepaintService = /** @class */ (function () {
    function BdRepaintService(bdDeviceService) {
        this.bdDeviceService = bdDeviceService;
    }
    BdRepaintService.prototype.repaint = function (element) {
        if (this.bdDeviceService.isIOS()) {
            var oldDisplay = element.style.display;
            // Reading the offsetheight from an element triggers a
            // reflow of the browser. This results in a complete
            // re-rendering of the document.
            element.style.display = 'none';
            // tslint:disable-next-line
            element.offsetHeight;
            element.style.display = oldDisplay;
        }
    };
    BdRepaintService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdRepaintService.ctorParameters = function () { return [
        { type: BdDeviceService, },
    ]; };
    return BdRepaintService;
}());

var BdEventService = /** @class */ (function () {
    function BdEventService(ngZone) {
        var _this = this;
        this.ngZone = ngZone;
        this.maxRetries = 5;
        this.resizeObservable = Observable$1.fromEvent(window, 'resize');
        this.onWindowScroll$ = null;
        this.onWindowResize$ = null;
        this.scrollHandleFn = function () {
            if (_this.onWindowScroll$) {
                if (_this.onWindowScroll$.observers.length === 0) {
                    window.removeEventListener('scroll', _this.scrollHandleFn);
                    _this.onWindowScroll$.complete();
                    _this.onWindowScroll$ = null;
                }
                else {
                    _this.onWindowScroll$.next();
                }
            }
        };
        this.resizeHandleFn = function () {
            if (_this.onWindowResize$) {
                if (_this.onWindowResize$.observers.length === 0) {
                    window.removeEventListener('resize', _this.resizeHandleFn);
                    _this.onWindowResize$.complete();
                    _this.onWindowResize$ = null;
                }
                else {
                    _this.onWindowResize$.next();
                }
            }
        };
    }
    Object.defineProperty(BdEventService.prototype, "onWindowScrollOutsideZone", {
        get: function () {
            var _this = this;
            if (!this.onWindowScroll$) {
                this.onWindowScroll$ = new Subject$1();
                // adding the event outside angular will not constanly trigger change detection
                this.ngZone.runOutsideAngular(function () {
                    window.addEventListener('scroll', _this.scrollHandleFn);
                });
            }
            // https://css-tricks.com/debouncing-throttling-explained-examples/
            return this.onWindowScroll$.observeOn(Scheduler.animationFrame);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdEventService.prototype, "onWindowResizeOutsideZone", {
        get: function () {
            var _this = this;
            if (!this.onWindowResize$) {
                this.onWindowResize$ = new Subject$1();
                // adding the event outside angular will not constanly trigger change detection
                this.ngZone.runOutsideAngular(function () {
                    window.addEventListener('resize', _this.resizeHandleFn);
                });
            }
            // https://css-tricks.com/debouncing-throttling-explained-examples/
            return this.onWindowResize$.observeOn(Scheduler.animationFrame);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdEventService.prototype, "onRotationComplete", {
        /**
         * The onRotationComplete entry point.
         * NOTE: This does not use onWindowResizeOutsideZone because it is not always necessary to run this outside of the
         *       zone. The consumer of this Observable can easily do that himself. On the otherhand we don't always want it
         *       to run in the next animationframe. Another reason not to use onWindowResizeOutsideZone.
         * @returns {Observable<void>}
         */
        get: /**
             * The onRotationComplete entry point.
             * NOTE: This does not use onWindowResizeOutsideZone because it is not always necessary to run this outside of the
             *       zone. The consumer of this Observable can easily do that himself. On the otherhand we don't always want it
             *       to run in the next animationframe. Another reason not to use onWindowResizeOutsideZone.
             * @returns {Observable<void>}
             */
        function () {
            var _this = this;
            return this.resizeObservable.switchMap(function () { return _this.checkWidth(0, _this.maxRetries); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if window width is stable. This is mainly an issue on iOS devices where it can take more then one frame
     * to actually update the view sizes.
     * @param previousWidth: the previous value of window.screen.width
     * @param remainingRetries: how many remaining frames should it wait. Maximum is 5
     * @returns {Promise<void>}
     */
    /**
         * Check if window width is stable. This is mainly an issue on iOS devices where it can take more then one frame
         * to actually update the view sizes.
         * @param previousWidth: the previous value of window.screen.width
         * @param remainingRetries: how many remaining frames should it wait. Maximum is 5
         * @returns {Promise<void>}
         */
    BdEventService.prototype.checkWidth = /**
         * Check if window width is stable. This is mainly an issue on iOS devices where it can take more then one frame
         * to actually update the view sizes.
         * @param previousWidth: the previous value of window.screen.width
         * @param remainingRetries: how many remaining frames should it wait. Maximum is 5
         * @returns {Promise<void>}
         */
    function (previousWidth, remainingRetries) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (remainingRetries === 0) {
                reject();
                return;
            }
            if (window.screen.width !== previousWidth) {
                window.requestAnimationFrame(function () {
                    resolve(_this.checkWidth(window.screen.width, --remainingRetries));
                });
            }
            else {
                resolve();
            }
        });
    };
    BdEventService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdEventService.ctorParameters = function () { return [
        { type: NgZone, },
    ]; };
    return BdEventService;
}());

var BdUtilitiesModule = /** @class */ (function () {
    function BdUtilitiesModule() {
    }
    BdUtilitiesModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        ComponentService,
                        BdRepaintService,
                        BdDeviceService,
                        BdEventService
                    ]
                },] },
    ];
    /** @nocollapse */
    BdUtilitiesModule.ctorParameters = function () { return []; };
    return BdUtilitiesModule;
}());

var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return Deferred;
}());

/**
 * Describes an element's size and its position relative to the top-left of the viewport.
 */
var BdDOMRect = /** @class */ (function () {
    function BdDOMRect(/**
             * The number of pixels between the left side of the viewport and the left side of the element's bounding rectangle.
             */
    left, /**
             * The number of pixels between the top side of the viewport and the top side of the element's bounding rectangle.
             */
    top, /**
             * The number of pixels between the left side of the viewport and the right side of the element's bounding rectangle.
             */
    right, /**
             * The number of pixels between the top side of the viewport and the bottom side of the element's bounding rectangle.
             */
    bottom, /**
             *The number of pixels between the left side of the viewport and the left side of the element's bounding rectangle.
             */
    x, /**
             * The number of pixels between the top side of the viewport and the top side of the element's bounding rectangle.
             */
    y, /**
             * The width (px) of the element's bounding rectangle.
             */
    width, /**
             * The height (px) of the element's bounding rectangle.
             */
    height) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Converts a ClientRect instance to a BdDOMRect instance.
     *
     * @param rect an instance obtained from Element.getBoundingClientRect()
     */
    /**
         * Converts a ClientRect instance to a BdDOMRect instance.
         *
         * @param rect an instance obtained from Element.getBoundingClientRect()
         */
    BdDOMRect.fromClientRect = /**
         * Converts a ClientRect instance to a BdDOMRect instance.
         *
         * @param rect an instance obtained from Element.getBoundingClientRect()
         */
    function (rect) {
        return new BdDOMRect(rect.left, rect.top, rect.right, rect.bottom, rect.x || rect.left, rect.y || rect.top, rect.width, rect.height);
    };
    BdDOMRect.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        return this.left === other.left
            && this.top === other.top
            && this.right === other.right
            && this.bottom === other.bottom
            && this.x === other.x
            && this.y === other.y;
    };
    return BdDOMRect;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdUtilitiesModule, Deferred, ComponentService, BdDeviceService, BdRepaintService, BdDOMRect, BdEventService };
//# sourceMappingURL=index.js.map
