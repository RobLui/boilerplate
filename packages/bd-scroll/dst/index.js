import { Directive, ElementRef, EventEmitter, Injectable, NgModule, NgZone, Optional, Output } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Scheduler } from 'rxjs';
import { BdEventService } from '@delen/bd-utilities';

var BdScrollService = /** @class */ (function () {
    function BdScrollService() {
        this.frozen = 0;
        this.FROZEN_CLASS = 'ng2-body--is-frozen';
    }
    BdScrollService.prototype.freeze = function () {
        clearTimeout(this.timeout);
        this.frozen++;
        if (this.frozen > 1)
            return;
        var top = document.body.style.top || (0 - window.pageYOffset) + 'px';
        document.body.style.top = top;
        document.body.classList.add(this.FROZEN_CLASS);
    };
    BdScrollService.prototype.unfreeze = function () {
        var _this = this;
        --this.frozen;
        this.timeout = setTimeout(function () {
            if (_this.frozen !== 0)
                return;
            document.body.classList.remove(_this.FROZEN_CLASS);
            if (document.body.style.top) {
                var scrollTop = -parseInt(document.body.style.top);
                document.body.style.top = '';
                window.scrollTo(0, scrollTop + 1); // Make sure the scroll is triggered
                window.scrollTo(0, window.scrollY - 1); // Make sure the scroll is triggered again to counter the previous scroll
            }
        });
    };
    BdScrollService.prototype.isFrozen = function () {
        return this.frozen > 0;
    };
    BdScrollService.prototype.getScrollTop = function () {
        var top = document.body.style.top || '';
        var fixedOffset = -parseInt(top) || 0;
        var scrollOffset = window.pageYOffset;
        return this.frozen > 0 ? fixedOffset : scrollOffset;
    };
    BdScrollService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdScrollService.ctorParameters = function () { return []; };
    return BdScrollService;
}());

var ATTRIBUTE_NAME$1 = 'bdScrollContainer';
var BdScrollContainerDirective = /** @class */ (function () {
    function BdScrollContainerDirective(elementRef, ngZone) {
        var _this = this;
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.onScroll$ = new Subject$1();
        this.scrollHandleFn = function () { return _this.scrollHandler(); };
    }
    Object.defineProperty(BdScrollContainerDirective.prototype, "onScrollOutsideZone", {
        get: function () {
            // https://css-tricks.com/debouncing-throttling-explained-examples/
            return this.onScroll$.observeOn(Scheduler.animationFrame);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdScrollContainerDirective.prototype, "element", {
        get: function () {
            return this.elementRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    BdScrollContainerDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.elementRef.nativeElement.addEventListener('scroll', _this.scrollHandleFn);
        });
    };
    BdScrollContainerDirective.prototype.scrollHandler = function () {
        this.onScroll$.next();
    };
    BdScrollContainerDirective.prototype.ngOnDestroy = function () {
        this.elementRef.nativeElement.removeEventListener('scroll', this.scrollHandleFn);
        this.onScroll$.complete();
    };
    BdScrollContainerDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME$1 + "]"
                },] },
    ];
    /** @nocollapse */
    BdScrollContainerDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: NgZone, },
    ]; };
    return BdScrollContainerDirective;
}());

var ATTRIBUTE_NAME = 'bdOnInView';
var BdOnInViewDirective = /** @class */ (function () {
    function BdOnInViewDirective(ngZone, elementRef, bdEventService, scrollContainerDirective) {
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.bdEventService = bdEventService;
        this.scrollContainerDirective = scrollContainerDirective;
        this.destroyed$ = new Subject$1();
        this.inView = false;
        this.onInView = new EventEmitter();
    }
    BdOnInViewDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () { return _this.checkInView(); });
        this.makeSubscription();
    };
    BdOnInViewDirective.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    BdOnInViewDirective.prototype.makeSubscription = function () {
        var _this = this;
        if (!this.subscription) {
            var scrollObservable = this.scrollContainerDirective ? this.scrollContainerDirective.onScrollOutsideZone : this.bdEventService.onWindowScrollOutsideZone;
            this.subscription = scrollObservable
                .takeUntil(this.destroyed$)
                .subscribe(function () { return _this.checkInView(); });
        }
    };
    BdOnInViewDirective.prototype.checkInView = function () {
        var _this = this;
        var previous = this.inView;
        var elementBcr = this.elementRef.nativeElement.getBoundingClientRect();
        var elementTop = elementBcr.top;
        var elementBottom = elementBcr.bottom;
        var containerBottom = 0;
        var containerTop = 0;
        if (this.scrollContainerDirective) {
            var scrollContainerBcr = this.scrollContainerDirective.element.getBoundingClientRect();
            containerBottom = scrollContainerBcr.bottom;
            containerTop = scrollContainerBcr.top;
        }
        else {
            containerBottom = window.innerHeight;
        }
        this.inView = elementTop <= containerBottom && elementBottom >= containerTop;
        if (previous !== this.inView) {
            this.ngZone.run(function () { return _this.onInView.emit(_this.inView); });
        }
    };
    BdOnInViewDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    BdOnInViewDirective.ctorParameters = function () { return [
        { type: NgZone, },
        { type: ElementRef, },
        { type: BdEventService, },
        { type: BdScrollContainerDirective, decorators: [{ type: Optional },] },
    ]; };
    BdOnInViewDirective.propDecorators = {
        "onInView": [{ type: Output, args: ["" + ATTRIBUTE_NAME,] },],
    };
    return BdOnInViewDirective;
}());

var BdScrollModule = /** @class */ (function () {
    function BdScrollModule() {
    }
    BdScrollModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        BdOnInViewDirective,
                        BdScrollContainerDirective
                    ],
                    providers: [
                        BdScrollService
                    ],
                    exports: [
                        BdOnInViewDirective,
                        BdScrollContainerDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    BdScrollModule.ctorParameters = function () { return []; };
    return BdScrollModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdScrollModule, BdScrollService, BdOnInViewDirective, BdScrollContainerDirective };
//# sourceMappingURL=index.js.map
