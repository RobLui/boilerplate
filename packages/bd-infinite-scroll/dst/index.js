import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

var BdViewportService = /** @class */ (function () {
    function BdViewportService() {
    }
    /**
     * Gets the distance from the element's bottom (including its padding but not its margin or border) to its bottommost visible content.
     * In simple English: the height of the content that overflows at the bottom edge, in pixels.
     *
     * @param viewport the scroll container.
     */
    /**
         * Gets the distance from the element's bottom (including its padding but not its margin or border) to its bottommost visible content.
         * In simple English: the height of the content that overflows at the bottom edge, in pixels.
         *
         * @param viewport the scroll container.
         */
    BdViewportService.prototype.getScrollBottom = /**
         * Gets the distance from the element's bottom (including its padding but not its margin or border) to its bottommost visible content.
         * In simple English: the height of the content that overflows at the bottom edge, in pixels.
         *
         * @param viewport the scroll container.
         */
    function (viewport) {
        // PERF: this method is a hot spot (called many times) so don't do expensive stuff here.
        return viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);
    };
    BdViewportService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdViewportService.ctorParameters = function () { return []; };
    return BdViewportService;
}());

var DIRECTIVE = 'bdInfiniteScroll';
var BdInfiniteScrollDirective = /** @class */ (function () {
    function BdInfiniteScrollDirective(er, cdr, viewportService) {
        this.er = er;
        this.cdr = cdr;
        this.viewportService = viewportService;
        this.threshold = 1;
        this.watching = false;
        this.watchingChange = new EventEmitter();
        this.lazyLoad = new EventEmitter(true);
    }
    BdInfiniteScrollDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.watching && changes.watching.currentValue === true) {
            // Check if there is enough overflow whenever the directive transitions from being disabled to being enabled (in between lazy loads).
            // Otherwise no loading occurs until after a scroll event, potentially resulting in bad UX when there is little or no overflow.
            // Wrap in setTimeout to delay this check until Angular has finished processing change detection for all components.
            // Otherwise there is a good chance that Angular has not yet updated the DOM since the last load event.
            // This is always the case when bdInfiniteScroll is placed on a scroll container with <ng-content>.
            setTimeout(function () { return _this.doCheck(); });
        }
    };
    BdInfiniteScrollDirective.prototype.onScroll = function () {
        if (this.watching) {
            this.doCheck();
        }
    };
    BdInfiniteScrollDirective.prototype.doCheck = function () {
        if (this.viewportService.getScrollBottom(this.er.nativeElement) <= this.threshold) {
            this.watchingChange.emit(this.watching = false);
            this.lazyLoad.emit();
        }
    };
    BdInfiniteScrollDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + DIRECTIVE + "]",
                    exportAs: DIRECTIVE
                },] },
    ];
    /** @nocollapse */
    BdInfiniteScrollDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: BdViewportService, },
    ]; };
    BdInfiniteScrollDirective.propDecorators = {
        "threshold": [{ type: Input },],
        "watching": [{ type: Input, args: [DIRECTIVE,] },],
        "watchingChange": [{ type: Output, args: [DIRECTIVE + "Change",] },],
        "lazyLoad": [{ type: Output },],
        "onScroll": [{ type: HostListener, args: ['scroll',] },],
    };
    return BdInfiniteScrollDirective;
}());

var BdInfiniteScrollModule = /** @class */ (function () {
    function BdInfiniteScrollModule() {
    }
    BdInfiniteScrollModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [
                        BdInfiniteScrollDirective
                    ],
                    providers: [
                        BdViewportService
                    ],
                    exports: [
                        BdInfiniteScrollDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    BdInfiniteScrollModule.ctorParameters = function () { return []; };
    return BdInfiniteScrollModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdInfiniteScrollDirective as ɵa, BdViewportService as ɵb, BdInfiniteScrollModule };
//# sourceMappingURL=index.js.map
