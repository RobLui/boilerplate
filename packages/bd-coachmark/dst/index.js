import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Directive, ElementRef, Injectable, Input, NgModule, ViewChild } from '@angular/core';
import { BdPopupDirection, BdPopupModule, BdPopupPositionCalculator } from '@delen/bd-popup';
import { BdDOMRect, BdEventService } from '@delen/bd-utilities';
import { Subject as Subject$1 } from 'rxjs/Subject';

var BdCoachmarkManager = /** @class */ (function () {
    function BdCoachmarkManager() {
        this.coachmarks = {};
    }
    BdCoachmarkManager.prototype.register = function (coachmarkId, coachmarkComponent) {
        if (!coachmarkId) {
            throw new Error("Can't register bd-coachmark component: id attribute is missing!");
        }
        this.coachmarks[coachmarkId] = coachmarkComponent;
    };
    BdCoachmarkManager.prototype.unregister = function (coachmarkId) {
        this.coachmarks[coachmarkId] = undefined;
    };
    BdCoachmarkManager.prototype.open = function (coachmarkId) {
        var coachmark = this.coachmarks[coachmarkId];
        if (coachmark) {
            coachmark.show();
        }
    };
    BdCoachmarkManager.prototype.close = function (coachmarkId) {
        var coachmark = this.coachmarks[coachmarkId];
        if (coachmark) {
            coachmark.close();
        }
    };
    BdCoachmarkManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdCoachmarkManager.ctorParameters = function () { return []; };
    return BdCoachmarkManager;
}());

var BdCoachmarkComponent = /** @class */ (function () {
    function BdCoachmarkComponent(coachmarkManager, positionCalculator, cd, bdEventService) {
        this.coachmarkManager = coachmarkManager;
        this.positionCalculator = positionCalculator;
        this.cd = cd;
        this.bdEventService = bdEventService;
        this.destroyed$ = new Subject$1();
        this.direction = BdPopupDirection.auto;
        this.visible = false;
        this.styles = null;
        this.arrowStyles = null;
        this.arrowClasses = null;
    }
    BdCoachmarkComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bdEventService
            .onWindowResizeOutsideZone
            .takeUntil(this.destroyed$)
            .subscribe(function () {
            if (_this.visible) {
                window.requestAnimationFrame(function () { return _this.draw(); });
            }
        });
        this.coachmarkManager.register(this.id, this);
    };
    BdCoachmarkComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.coachmarkManager.unregister(this.id);
    };
    BdCoachmarkComponent.prototype.show = function () {
        this.draw();
    };
    BdCoachmarkComponent.prototype.close = function () {
        this.visible = false;
    };
    BdCoachmarkComponent.prototype.draw = function () {
        var _this = this;
        if (!this.target) {
            throw new Error('bd-coachmark target is not set!');
        }
        var coachmarkRectangle = this.getCoachmarkRectangle();
        var targetRectangle = this.getTargetRectangle();
        var screenSize = this.positionCalculator.getScreenSize();
        this.setPosition(this.direction, coachmarkRectangle, targetRectangle, screenSize);
        // Ensure that the target rectangle hasn't moved in the next frame.
        // Otherwise, redraw.
        // This fixes a bug in iOS where getBoundingClientRect returns old values after orientation changes
        this.cd.detectChanges();
        window.requestAnimationFrame(function () {
            if (!targetRectangle.equals(_this.getTargetRectangle())) {
                _this.draw();
            }
        });
    };
    BdCoachmarkComponent.prototype.setPosition = function (direction, popupRectangle, targetRectangle, screenSize) {
        if (direction === BdPopupDirection.auto) {
            direction = this.positionCalculator.getDirection(targetRectangle, screenSize);
        }
        var popupStyles = this.positionCalculator.getPosition(direction, targetRectangle, popupRectangle, screenSize);
        this.styles = popupStyles.popupCss;
        this.arrowStyles = popupStyles.arrowCss;
        this.arrowClasses = {
            'ng2-c-popup__arrow--up': direction === BdPopupDirection.bottom,
            'ng2-c-popup__arrow--down': direction === BdPopupDirection.top
        };
        this.visible = true;
    };
    BdCoachmarkComponent.prototype.getCoachmarkRectangle = function () {
        var nativeElem = this.container.nativeElement;
        return BdDOMRect.fromClientRect(nativeElem.getBoundingClientRect());
    };
    BdCoachmarkComponent.prototype.getTargetRectangle = function () {
        return BdDOMRect.fromClientRect(this.target.getBoundingClientRect());
    };
    BdCoachmarkComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-coachmark2',
                    template: "<div #container class=\"ng2-c-popup ng2-c-popup--coachmark\" [ngClass]=\"{ 'ng2-c-popup--visible': visible }\" [ngStyle]=\"styles\">    <div class=\"ng2-c-popup__body\">        <ng-content></ng-content>    </div>    <span class=\"ng2-c-popup__arrow\" [ngClass]=\"arrowClasses\" [ngStyle]=\"arrowStyles\"></span></div>"
                },] },
    ];
    /** @nocollapse */
    BdCoachmarkComponent.ctorParameters = function () { return [
        { type: BdCoachmarkManager, },
        { type: BdPopupPositionCalculator, },
        { type: ChangeDetectorRef, },
        { type: BdEventService, },
    ]; };
    BdCoachmarkComponent.propDecorators = {
        "container": [{ type: ViewChild, args: ['container',] },],
        "id": [{ type: Input },],
        "direction": [{ type: Input },],
    };
    return BdCoachmarkComponent;
}());

var ATTRIBUTE_NAME = 'bdOpenCoachmark';
var BdCoachmarkDirective = /** @class */ (function () {
    function BdCoachmarkDirective(el) {
        this.el = el;
    }
    BdCoachmarkDirective.prototype.ngOnInit = function () {
        if (!this.coachmarkComponent) {
            throw new Error('bdOpenCoachmark: bd-coachmark reference is undefined!');
        }
        this.coachmarkComponent.target = this.el.nativeElement;
    };
    BdCoachmarkDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    BdCoachmarkDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdCoachmarkDirective.propDecorators = {
        "coachmarkComponent": [{ type: Input, args: [ATTRIBUTE_NAME,] },],
    };
    return BdCoachmarkDirective;
}());

var BdCoachmarkModule = /** @class */ (function () {
    function BdCoachmarkModule() {
    }
    BdCoachmarkModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdPopupModule
                    ],
                    declarations: [
                        BdCoachmarkComponent,
                        BdCoachmarkDirective
                    ],
                    exports: [
                        BdCoachmarkComponent,
                        BdCoachmarkDirective
                    ],
                    providers: [BdCoachmarkManager],
                    entryComponents: [BdCoachmarkComponent]
                },] },
    ];
    /** @nocollapse */
    BdCoachmarkModule.ctorParameters = function () { return []; };
    return BdCoachmarkModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdCoachmarkModule, BdCoachmarkComponent, BdCoachmarkDirective, BdCoachmarkManager };
//# sourceMappingURL=index.js.map
