import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { BdOverlayPlaceholderManager } from '@delen/bd-overlay-placeholder';
import { BdBackdropService } from '@delen/bd-backdrop';
import { BdDOMRect, BdEventService } from '@delen/bd-utilities';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { CommonModule } from '@angular/common';

/**
 * The direction in which a popup should open.
 */
/**
 * The direction in which a popup should open.
 */
var BdPopupDirection;
/**
 * The direction in which a popup should open.
 */
(function (BdPopupDirection) {
    BdPopupDirection["auto"] = "auto";
    BdPopupDirection["top"] = "top";
    BdPopupDirection["bottom"] = "bottom";
})(BdPopupDirection || (BdPopupDirection = {}));

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var BdPopupPositionCalculator = /** @class */ (function () {
    function BdPopupPositionCalculator() {
        this.ARROW_WIDTH = 26;
        this.ARROW_HEIGHT = 10;
        /**
             * The minimum distance between the edge of the popup and the edge of the arrow.
             */
        this.ARROW_MARGIN = 15;
        /**
             * The minimum distance between the edge of the viewport and the edge of the popup.
             */
        this.SCREEN_MARGIN = 10;
        /**
             * The default distance between the popup and its target element.
             */
        this.NORMAL_OFFSET = 0;
    }
    /**
     * Gets the current viewport width and height.
     */
    /**
         * Gets the current viewport width and height.
         */
    BdPopupPositionCalculator.prototype.getScreenSize = /**
         * Gets the current viewport width and height.
         */
    function () {
        return {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    };
    /**
     * Gets a popup direction based on their target element's distance from the viewport sides.
     *
     * @param target the target element's bounding rectangle
     * @param screenSize the viewport dimensions
     *
     * @returns PopupDirection.Bottom or PopupDirection.Top when there is more space at the top of the target element.
     */
    /**
         * Gets a popup direction based on their target element's distance from the viewport sides.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         *
         * @returns PopupDirection.Bottom or PopupDirection.Top when there is more space at the top of the target element.
         */
    BdPopupPositionCalculator.prototype.getDirection = /**
         * Gets a popup direction based on their target element's distance from the viewport sides.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         *
         * @returns PopupDirection.Bottom or PopupDirection.Top when there is more space at the top of the target element.
         */
    function (target, screenSize) {
        var topSpace = target.top;
        var bottomSpace = screenSize.height - target.bottom;
        if (topSpace > bottomSpace) {
            return BdPopupDirection.top;
        }
        else {
            return BdPopupDirection.bottom;
        }
    };
    /**
     * Calculates a fixed style.left for popups that open from the top or bottom of their target.
     *
     * @param target the target element's bounding rectangle
     * @param popup the popup element's bounding rectangle
     * @param screenSize the viewport dimensions
     * @param margin the popup element's margin (px)
     */
    /**
         * Calculates a fixed style.left for popups that open from the top or bottom of their target.
         *
         * @param target the target element's bounding rectangle
         * @param popup the popup element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    BdPopupPositionCalculator.prototype.getLeftOffsetForVerticalPopup = /**
         * Calculates a fixed style.left for popups that open from the top or bottom of their target.
         *
         * @param target the target element's bounding rectangle
         * @param popup the popup element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    function (target, popup, screenSize, margin, offset) {
        var targetCenter = target.left + (target.width / 2);
        var leftMost = target.left + offset;
        var centered = targetCenter - (popup.width / 2) + offset;
        var rightMost = target.right - popup.width + offset;
        // min and max values are useful for snapping the popup to viewport sides if
        // it would otherwise go outside the viewport
        return {
            length: centered,
            min: target.left >= 0
                ? margin
                : leftMost,
            max: target.right <= screenSize.width
                ? screenSize.width - popup.width - margin
                : rightMost
        };
    };
    /**
     * Calculates a fixed style.bottom for popups that open from the top of their target.
     *
     * @param target the target element's bounding rectangle
     * @param screenSize the viewport dimensions
     * @param margin the popup element's margin (px)
     */
    /**
         * Calculates a fixed style.bottom for popups that open from the top of their target.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    BdPopupPositionCalculator.prototype.getBottomOffsetForTopPopup = /**
         * Calculates a fixed style.bottom for popups that open from the top of their target.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    function (target, screenSize, margin, offset) {
        var distanceFromViewportBottomToTargetTop = screenSize.height - target.top;
        var wanted = distanceFromViewportBottomToTargetTop + this.ARROW_HEIGHT + this.NORMAL_OFFSET + offset;
        return {
            length: wanted,
            min: wanted >= 0
                ? margin
                : wanted,
            max: wanted <= screenSize.height
                ? screenSize.height - margin
                : wanted
        };
    };
    /**
     * Calculates a fixed style.top for popups that open from the bottom of their target.
     *
     * @param target the target element's bounding rectangle
     * @param screenSize the viewport dimensions
     * @param margin the popup element's margin (px)
     */
    /**
         * Calculates a fixed style.top for popups that open from the bottom of their target.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    BdPopupPositionCalculator.prototype.getTopOffsetForBottomPopup = /**
         * Calculates a fixed style.top for popups that open from the bottom of their target.
         *
         * @param target the target element's bounding rectangle
         * @param screenSize the viewport dimensions
         * @param margin the popup element's margin (px)
         */
    function (target, screenSize, margin, offset) {
        var distanceFromViewportTopToTargetBottom = target.bottom;
        var wanted = distanceFromViewportTopToTargetBottom + this.ARROW_HEIGHT + this.NORMAL_OFFSET + offset;
        return {
            length: wanted,
            min: wanted >= 0
                ? margin
                : wanted,
            max: wanted <= screenSize.height
                ? screenSize.height - margin
                : wanted
        };
    };
    /**
     * Gets a fixed CSS position for a popup element based on its offset from the viewport.
     *
     * @param popupOffset the popup's distance from the viewport sides.
     */
    /**
         * Gets a fixed CSS position for a popup element based on its offset from the viewport.
         *
         * @param popupOffset the popup's distance from the viewport sides.
         */
    BdPopupPositionCalculator.prototype.getTopPopupPosition = /**
         * Gets a fixed CSS position for a popup element based on its offset from the viewport.
         *
         * @param popupOffset the popup's distance from the viewport sides.
         */
    function (left, bottom) {
        return {
            left: Math.max(Math.min(left.length, left.max), left.min) + 'px',
            bottom: Math.max(Math.min(bottom.length, bottom.max), bottom.min) + 'px'
        };
    };
    /**
     * Gets a fixed CSS position for a popup element based on its offset from the viewport.
     *
     * @param popupOffset the popup's distance from the viewport sides.
     */
    /**
         * Gets a fixed CSS position for a popup element based on its offset from the viewport.
         *
         * @param popupOffset the popup's distance from the viewport sides.
         */
    BdPopupPositionCalculator.prototype.getBottomPopupPosition = /**
         * Gets a fixed CSS position for a popup element based on its offset from the viewport.
         *
         * @param popupOffset the popup's distance from the viewport sides.
         */
    function (left, top) {
        return {
            left: Math.max(Math.min(left.length, left.max), left.min) + 'px',
            top: Math.max(Math.min(top.length, top.max), top.min) + 'px'
        };
    };
    /**
     * Gets an absolute CSS position for a popup's arrow element based on its offset from the viewport.
     *
     * @param popup the popup element's bounding rectangle.
     * @param popupOffset the popup's distance from the viewport sides.
     */
    /**
         * Gets an absolute CSS position for a popup's arrow element based on its offset from the viewport.
         *
         * @param popup the popup element's bounding rectangle.
         * @param popupOffset the popup's distance from the viewport sides.
         */
    BdPopupPositionCalculator.prototype.getHorizontalArrowPosition = /**
         * Gets an absolute CSS position for a popup's arrow element based on its offset from the viewport.
         *
         * @param popup the popup element's bounding rectangle.
         * @param popupOffset the popup's distance from the viewport sides.
         */
    function (popup, popupLeft) {
        var expected = popupLeft.length;
        var actual = Math.max(Math.min(popupLeft.length, popupLeft.max), popupLeft.min);
        if (actual > expected) {
            // then move arrow left
            var diff = actual - expected;
            var left = popup.width / 2 - diff;
            var leftMin = this.ARROW_MARGIN + this.ARROW_WIDTH / 2;
            return { left: Math.max(left, leftMin) + 'px' };
        }
        else if (actual < expected) {
            // then move arrow right
            var diff = expected - actual;
            var left = popup.width / 2 + diff;
            var leftMax = popup.width - this.ARROW_WIDTH / 2 - this.ARROW_MARGIN;
            return { left: Math.min(left, leftMax) + 'px' };
        }
        else {
            return null;
        }
    };
    /**
     * Gets the CSS position for a popup (and its arrow) for a specified direction.
     *
     * @param direction the side of the target element from which the popup should open.
     * @param target the target element's bounding rectangle.
     * @param popup the popup element's bounding rectangle.
     * @param screenSize the viewport dimensions.
     * @param margin a margin around the popup (px).
     */
    /**
         * Gets the CSS position for a popup (and its arrow) for a specified direction.
         *
         * @param direction the side of the target element from which the popup should open.
         * @param target the target element's bounding rectangle.
         * @param popup the popup element's bounding rectangle.
         * @param screenSize the viewport dimensions.
         * @param margin a margin around the popup (px).
         */
    BdPopupPositionCalculator.prototype.getPosition = /**
         * Gets the CSS position for a popup (and its arrow) for a specified direction.
         *
         * @param direction the side of the target element from which the popup should open.
         * @param target the target element's bounding rectangle.
         * @param popup the popup element's bounding rectangle.
         * @param screenSize the viewport dimensions.
         * @param margin a margin around the popup (px).
         */
    function (direction, target, popup, screenSize, margin, offsetX, offsetY) {
        if (margin === void 0) { margin = this.SCREEN_MARGIN; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        switch (direction) {
            case BdPopupDirection.top:
                {
                    var left = this.getLeftOffsetForVerticalPopup(target, popup, screenSize, margin, offsetX);
                    var bottom = this.getBottomOffsetForTopPopup(target, screenSize, margin, offsetY);
                    return {
                        popupCss: __assign({}, this.getTopPopupPosition(left, bottom), (_a = {}, _a['max-height'] = target.top - (2 * margin) + 'px', _a)),
                        arrowCss: this.getHorizontalArrowPosition(popup, left)
                    };
                }
            case BdPopupDirection.bottom:
                {
                    var left = this.getLeftOffsetForVerticalPopup(target, popup, screenSize, margin, offsetX);
                    var top_1 = this.getTopOffsetForBottomPopup(target, screenSize, margin, offsetY);
                    return {
                        popupCss: __assign({}, this.getBottomPopupPosition(left, top_1), (_b = {}, _b['max-height'] = screenSize.height - target.bottom - (2 * margin) + 'px', _b)),
                        arrowCss: this.getHorizontalArrowPosition(popup, left)
                    };
                }
            default:
                throw new Error('Not implemented: use Top or Bottom');
        }
        var _a, _b;
    };
    BdPopupPositionCalculator.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdPopupPositionCalculator.ctorParameters = function () { return []; };
    return BdPopupPositionCalculator;
}());

var BdPopupRef = /** @class */ (function () {
    function BdPopupRef() {
    }
    return BdPopupRef;
}());

var BdPopupService = /** @class */ (function () {
    function BdPopupService(bdBackdropService, overlayPlaceholderManager) {
        this.bdBackdropService = bdBackdropService;
        this.overlayPlaceholderManager = overlayPlaceholderManager;
        this.refCount = 0;
        this.doClose = new Subject();
        this.doDraw = new Subject();
    }
    Object.defineProperty(BdPopupService.prototype, "openCount", {
        get: function () {
            return this.refCount;
        },
        enumerable: true,
        configurable: true
    });
    BdPopupService.prototype.open = function (template) {
        var ref = new BdPopupRef();
        ref.backdrop = this.bdBackdropService.add();
        ref.popup = this.overlayPlaceholderManager.addTemplate(template);
        this.refCount++;
        return ref;
    };
    BdPopupService.prototype.close = function (ref) {
        this.overlayPlaceholderManager.removeTemplate(ref.popup);
        this.bdBackdropService.remove(ref.backdrop);
        this.refCount--;
    };
    /**
     * Notify all ng2 popups that they should close.
     */
    /**
         * Notify all ng2 popups that they should close.
         */
    BdPopupService.prototype.closeAll = /**
         * Notify all ng2 popups that they should close.
         */
    function () {
        this.doClose.next();
    };
    /**
     * Notify all ng2 popups that a repaint is needed.
     */
    /**
         * Notify all ng2 popups that a repaint is needed.
         */
    BdPopupService.prototype.drawAll = /**
         * Notify all ng2 popups that a repaint is needed.
         */
    function () {
        this.doDraw.next();
    };
    BdPopupService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdPopupService.ctorParameters = function () { return [
        { type: BdBackdropService, },
        { type: BdOverlayPlaceholderManager, },
    ]; };
    return BdPopupService;
}());

var BdPopupComponent = /** @class */ (function () {
    function BdPopupComponent(positionCalculator, popupService, bdEventService) {
        this.positionCalculator = positionCalculator;
        this.popupService = popupService;
        this.bdEventService = bdEventService;
        /**
             * Infrastructure. A subject that emits and completes when the current popup is destroyed. Use to terminate subscriptions.
             */
        this.ngUnsubscribe = new Subject();
        /**
             * Infrastructure. Holds a reference to the popup's embedded view when open, or null when closed.
             */
        this.popupRef = null;
        /**
             * Two-way binding that controls whether the popup is shown.
             */
        this.visible = false;
        /**
             * Infrastructure. Enables two-way binding.
             */
        this.visibleChange = new EventEmitter();
        /**
             * Emits events when the popup transitions from the invisible to the visible state.
             */
        this.show = new EventEmitter();
        /**
             * Emits events when the popup transitions from the visible to the invisible state.
            */
        this.hide = new EventEmitter();
        /**
             * When enabled, adds class 'ng2-c-popup__body--has-padding' to the popup's body element.
             */
        this.hasPadding = false;
        /**
             * When enabled, adds class 'ng2-c-popup--center' to the popup element.
             */
        this.isCentered = false;
        /**
             * The direction in which the current popup should open.
             */
        this.direction = BdPopupDirection.auto;
        /**
             * The distance to move the popup to the left or right from its normal position.
             */
        this.offsetX = 0;
        /**
             * The distance to move the popup up or down from its normal position.
             */
        this.offsetY = 5;
        /**
             * A dictionary of css styles, used to update the popup's styles when the layout changes.
             */
        this.styles = null;
        /**
             * A dictionary of css styles, used to update the popup arrow's styles when the layout changes.
             */
        this.arrowStyles = null;
        /**
             * Css classes, used to update classes that control the popup arrow position.
             */
        this.arrowClasses = null;
        /**
             * Css classes, used to update classes that control the popup's visibility.
             */
        this.classes = null;
    }
    BdPopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        // add observables that should close the popup whenever they emit
        var closeTriggers = [
            this.popupService.doClose
        ];
        // add observables that should redraw the popup whenever they emit
        var redrawTriggers = [
            this.popupService.doDraw,
            this.bdEventService.onWindowResizeOutsideZone
        ];
        Observable$1.merge.apply(Observable$1, closeTriggers).takeUntil(this.ngUnsubscribe)
            .filter(function () { return _this.visible; })
            .subscribe(function () { return _this.close(); });
        Observable$1.merge.apply(Observable$1, redrawTriggers).takeUntil(this.ngUnsubscribe)
            .filter(function () { return _this.visible; })
            .subscribe(function () { return _this.draw(); });
    };
    BdPopupComponent.prototype.ngOnChanges = function (changes) {
        if (changes.visible) {
            this.onVisibleChange(changes.visible.currentValue);
        }
    };
    BdPopupComponent.prototype.ngOnDestroy = function () {
        // detach the embedded view if the popup is currently visible
        // a typical example is when navigation occurs while the popup is displayed
        if (this.popupRef !== null) {
            this.detach();
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    /**
     * Opens the current popup.
     */
    /**
         * Opens the current popup.
         */
    BdPopupComponent.prototype.open = /**
         * Opens the current popup.
         */
    function () {
        if (!this.visible) {
            this.visible = true;
            this.visibleChange.emit(true);
            this.onVisibleChange(true);
        }
    };
    /**
     * Closes the current popup.
     */
    /**
         * Closes the current popup.
         */
    BdPopupComponent.prototype.close = /**
         * Closes the current popup.
         */
    function () {
        if (this.visible) {
            this.visible = false;
            this.visibleChange.emit(false);
            this.onVisibleChange(false);
        }
    };
    /**
     * Forces the popup to reposition itself.
     */
    /**
         * Forces the popup to reposition itself.
         */
    BdPopupComponent.prototype.draw = /**
         * Forces the popup to reposition itself.
         */
    function (framesSinceLastChange, lastTarget) {
        var _this = this;
        if (framesSinceLastChange === void 0) { framesSinceLastChange = 0; }
        if (this.visible && this.popupRef !== null) {
            var targetRectangle_1 = this.getTargetRectangle();
            if (framesSinceLastChange === 0 || !targetRectangle_1.equals(lastTarget)) {
                var popupRectangle = this.getPopupRectangle(this.popupRef);
                var screenSize = this.positionCalculator.getScreenSize();
                var offsetX = this.offsetX || 0;
                var offsetY = this.offsetY || 0;
                this.setPosition(this.direction, popupRectangle, targetRectangle_1, screenSize, offsetX, offsetY);
                this.popupRef.popup.detectChanges();
                // Ensure that the target doesn't move in the next 10 frames.
                // this resets the count of framesSinceLastChange because positions were updated
                window.requestAnimationFrame(function () { return _this.draw(1, targetRectangle_1); });
            }
            else if (framesSinceLastChange < 10) {
                window.requestAnimationFrame(function () { return _this.draw(framesSinceLastChange + 1, targetRectangle_1); });
            }
        }
    };
    BdPopupComponent.prototype.onVisibleChange = function (visible) {
        if (visible && this.popupRef === null) {
            this.embed();
            this.draw();
            this.show.emit();
        }
        else if (!visible && this.popupRef !== null) {
            this.detach();
            this.hide.emit();
        }
    };
    BdPopupComponent.prototype.embed = function () {
        var _this = this;
        if (this.popupRef) {
            throw new Error('Invalid operation: this popup is already open!');
        }
        this.popupRef = this.popupService.open(this.templateRef);
        this.popupRef.backdrop.instance.whenClicked.subscribe(function () { return _this.close(); });
    };
    BdPopupComponent.prototype.detach = function () {
        if (!this.popupRef) {
            return;
        }
        this.popupService.close(this.popupRef);
        this.popupRef = null;
        // reset styles because we can't assume that they are
        // still okay to use when the popup is reopened
        this.styles = null;
        this.arrowStyles = null;
    };
    BdPopupComponent.prototype.getPopupRectangle = function (ref) {
        // angular places random textnodes around the popup rootNode
        // make sore to grab the actual popup (ng2-c-popup) instead of just the first rootNode
        var rootNodes = ref.popup.rootNodes;
        var rootElements = rootNodes.filter(function (node) { return node.nodeType === Node.ELEMENT_NODE; });
        var popup = (rootElements.find(function (node) { return node.classList.contains('ng2-c-popup'); }));
        return BdDOMRect.fromClientRect(popup.getBoundingClientRect());
    };
    BdPopupComponent.prototype.getTargetRectangle = function () {
        if (!this.target) {
            this.target = document.querySelector(this.for.startsWith('#') ? this.for : '#' + this.for);
        }
        return BdDOMRect.fromClientRect(this.target.getBoundingClientRect());
    };
    BdPopupComponent.prototype.setPosition = function (direction, popupRectangle, targetRectangle, screenSize, offsetX, offsetY) {
        if (direction === BdPopupDirection.auto) {
            // no popup direction provided, select top or bottom based on available space
            direction = this.positionCalculator.getDirection(targetRectangle, screenSize);
        }
        var pos = this.positionCalculator.getPosition(direction, targetRectangle, popupRectangle, screenSize, undefined, offsetX, offsetY);
        this.styles = pos.popupCss;
        this.arrowStyles = pos.arrowCss;
        this.arrowClasses = {
            'ng2-c-popup__arrow--up': direction === BdPopupDirection.bottom,
            'ng2-c-popup__arrow--down': direction === BdPopupDirection.top
        };
        this.classes = {
            'ng2-c-popup--center': this.isCentered,
            'ng2-c-popup--visible': this.visible
        };
    };
    BdPopupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-popup2',
                    template: "<ng-template>    <div class=\"ng2-c-popup\" [ngClass]=\"classes\" [ngStyle]=\"styles\">        <div class=\"ng2-c-popup__body\" [class.ng2-c-popup__body--has-padding]=\"hasPadding\">            <ng-content></ng-content>        </div>        <span class=\"ng2-c-popup__arrow\" [ngClass]=\"arrowClasses\" [ngStyle]=\"arrowStyles\"></span>    </div></ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdPopupComponent.ctorParameters = function () { return [
        { type: BdPopupPositionCalculator, },
        { type: BdPopupService, },
        { type: BdEventService, },
    ]; };
    BdPopupComponent.propDecorators = {
        "visible": [{ type: Input },],
        "visibleChange": [{ type: Output },],
        "show": [{ type: Output },],
        "hide": [{ type: Output },],
        "target": [{ type: Input },],
        "for": [{ type: Input },],
        "hasPadding": [{ type: Input },],
        "isCentered": [{ type: Input },],
        "direction": [{ type: Input },],
        "offsetX": [{ type: Input },],
        "offsetY": [{ type: Input },],
        "templateRef": [{ type: ViewChild, args: [TemplateRef,] },],
    };
    return BdPopupComponent;
}());

var ATTRIBUTE_NAME = 'bdOpenPopup';
var BdPopupDirective = /** @class */ (function () {
    function BdPopupDirective(el) {
        this.el = el;
    }
    BdPopupDirective.prototype.ngOnInit = function () {
        this.popupComponent.target = this.el.nativeElement;
    };
    BdPopupDirective.prototype.click = function (e) {
        this.popupComponent.open();
        e.preventDefault();
    };
    BdPopupDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    BdPopupDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdPopupDirective.propDecorators = {
        "popupComponent": [{ type: Input, args: [ATTRIBUTE_NAME,] },],
        "click": [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return BdPopupDirective;
}());

var components = [
    BdPopupComponent
];
var BdPopupModule = /** @class */ (function () {
    function BdPopupModule() {
    }
    BdPopupModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components.concat([BdPopupDirective]),
                    exports: components.concat([BdPopupDirective]),
                    providers: [BdPopupPositionCalculator, BdPopupService],
                    entryComponents: components
                },] },
    ];
    /** @nocollapse */
    BdPopupModule.ctorParameters = function () { return []; };
    return BdPopupModule;
}());

/**
 * Represents the location of a positioned (non-static) element.
 */
var BdPopupPosition = /** @class */ (function () {
    function BdPopupPosition() {
    }
    return BdPopupPosition;
}());

/**
 * Describes the position of a point on a line as well as the min and max allowed values (px).
 */
var BdDistance = /** @class */ (function () {
    function BdDistance() {
    }
    return BdDistance;
}());

var BdPopupStyles = /** @class */ (function () {
    function BdPopupStyles() {
    }
    return BdPopupStyles;
}());

/**
 * Describes a rectangle's size in pixels.
 */
var BdSize = /** @class */ (function () {
    function BdSize() {
    }
    return BdSize;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPopupDirective as ɵa, BdPopupComponent, BdPopupModule, BdPopupService, BdPopupPositionCalculator, BdPopupPosition, BdDistance, BdPopupDirection, BdPopupStyles, BdSize };
//# sourceMappingURL=index.js.map
