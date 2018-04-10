import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, HostListener, Injectable, Input, NgModule, Output, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Subject as Subject$1 } from 'rxjs/Subject';

var BdActionSliderContentComponent = /** @class */ (function () {
    function BdActionSliderContentComponent() {
    }
    BdActionSliderContentComponent.prototype.getWidth = function () {
        return this.element.nativeElement.clientWidth;
    };
    BdActionSliderContentComponent.prototype.setPosition = function (xPos) {
        this.element.nativeElement.style.transform = "translate3d(" + xPos + "px, 0px, 0px)";
    };
    BdActionSliderContentComponent.prototype.setTransition = function (transition) {
        this.element.nativeElement.style.transition = transition;
    };
    BdActionSliderContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-action-slider-content2',
                    template: "<div #actionSliderContent class=\"ng2-c-action-slider-content\"><ng-content></ng-content></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdActionSliderContentComponent.ctorParameters = function () { return []; };
    BdActionSliderContentComponent.propDecorators = {
        "element": [{ type: ViewChild, args: ['actionSliderContent',] },],
    };
    return BdActionSliderContentComponent;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseActionSliderAction = /** @class */ (function () {
    function BaseActionSliderAction() {
        this.action = new EventEmitter();
    }
    BaseActionSliderAction.prototype.ngOnInit = function () {
        this.nativeElement = this.actionElement.nativeElement;
    };
    BaseActionSliderAction.prototype.setWidth = function (width) {
        this.width = width;
        this.nativeElement.style.width = width + "px";
    };
    BaseActionSliderAction.prototype.getWidth = function () {
        return this.width;
    };
    BaseActionSliderAction.prototype.setTransition = function (transition) {
        this.nativeElement.style.transition = transition;
    };
    BaseActionSliderAction.prototype.toggleSlideThrough = function (on) {
        this.isSlideThroughActive = on;
    };
    BaseActionSliderAction.prototype.executeAction = function () {
        this.action.emit();
    };
    BaseActionSliderAction.propDecorators = {
        "actionElement": [{ type: ViewChild, args: ['action',] },],
        "slideThrough": [{ type: Input },],
        "colorClass": [{ type: Input },],
        "action": [{ type: Output },],
    };
    return BaseActionSliderAction;
}());
var BdLeftActionSliderActionComponent = /** @class */ (function (_super) {
    __extends(BdLeftActionSliderActionComponent, _super);
    function BdLeftActionSliderActionComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BdLeftActionSliderActionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-action-slider-left2',
                    template: " <div #action class=\"ng2-c-action-slider-left\" [class.ng2-c-action-slider--slide-through-action]=\"slideThrough\" (click)=\"executeAction()\">\n                    <div [ngClass]=\"colorClass\" class=\"ng2-c-action-slider__action\" [class.ng2-c-action-slider__action--slide-through]=\"isSlideThroughActive\">\n                        <ng-content></ng-content>\n                    </div>\n                </div>"
                },] },
    ];
    /** @nocollapse */
    BdLeftActionSliderActionComponent.ctorParameters = function () { return []; };
    return BdLeftActionSliderActionComponent;
}(BaseActionSliderAction));
var BdRightActionSliderActionComponent = /** @class */ (function (_super) {
    __extends(BdRightActionSliderActionComponent, _super);
    function BdRightActionSliderActionComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BdRightActionSliderActionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-action-slider-right2',
                    template: " <div #action class=\"ng2-c-action-slider-right\" [class.ng2-c-action-slider--slide-through-action]=\"slideThrough\" (click)=\"executeAction()\">\n                    <div [ngClass]=\"colorClass\" class=\"ng2-c-action-slider__action\" [class.ng2-c-action-slider__action--slide-through]=\"isSlideThroughActive\">\n                        <ng-content></ng-content>\n                    </div>\n                </div>"
                },] },
    ];
    /** @nocollapse */
    BdRightActionSliderActionComponent.ctorParameters = function () { return []; };
    return BdRightActionSliderActionComponent;
}(BaseActionSliderAction));

var ActionSliderState;
(function (ActionSliderState) {
    ActionSliderState[ActionSliderState["LEFT"] = 0] = "LEFT";
    ActionSliderState[ActionSliderState["CONTENT"] = 1] = "CONTENT";
    ActionSliderState[ActionSliderState["RIGHT"] = 2] = "RIGHT";
})(ActionSliderState || (ActionSliderState = {}));

var ActionSliderService = /** @class */ (function () {
    function ActionSliderService() {
        this.CloseAllButSubject = new Subject$1();
    }
    ActionSliderService.prototype.closeAllBut = function (component) {
        this.CloseAllButSubject.next(component);
    };
    ActionSliderService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ActionSliderService.ctorParameters = function () { return []; };
    return ActionSliderService;
}());

var BdActionSliderComponent = /** @class */ (function () {
    function BdActionSliderComponent(actionSliderService) {
        this.actionSliderService = actionSliderService;
        this.ACTION_WIDTH = 85;
        this.isComponentDestroyed = false;
        this.state = ActionSliderState.CONTENT;
        this.previousState = ActionSliderState.CONTENT;
        this.actualDifference = 0;
        this.actions = [];
        this.enabled = true;
    }
    BdActionSliderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.actionSliderService.CloseAllButSubject.subscribe(function (component) { return _this.close(component); });
    };
    BdActionSliderComponent.prototype.ngOnDestroy = function () {
        this.isComponentDestroyed = true;
        this.subscription.unsubscribe();
    };
    BdActionSliderComponent.prototype.touchStart = function (event) {
        this.checkIfMultiTouch(event);
        if (this.isMultiTouch) {
            event.preventDefault(); // prevents multitouch
            return;
        }
        if (!this.snapBreakpoint || !this.actionBreakpoint) {
            this.setBreakpoints();
        }
        this.currentDifference = 0;
        this.resetHelpStates();
        this.toggleTransition(false); // disable automatic animations
        this.actionSliderService.closeAllBut(this);
    };
    BdActionSliderComponent.prototype.touchMove = function (event) {
        if (this.isMultiTouch) {
            event.preventDefault(); // prevents multitouch
            return;
        }
        if (!this.enabled) {
            return;
        }
        if (this.previousX && this.previousY) {
            var deltaX = event.touches[0].pageX - this.previousX;
            var deltaY = event.touches[0].pageY - this.previousY;
            if (this.isFirstTouchMove) {
                this.isXmovement = Math.abs(deltaX) > Math.abs(deltaY);
                this.isFirstTouchMove = false;
            }
            if (!this.isXmovement)
                return;
            event.preventDefault();
            event.stopPropagation();
            // calculate the state of the component.
            if (this.state === ActionSliderState.CONTENT) {
                this.state = deltaX > 0 ? ActionSliderState.LEFT : ActionSliderState.RIGHT;
                // reset if illegal move.
                if ((this.state === ActionSliderState.LEFT && !this.componentHasAction(this.leftAction)) ||
                    (this.state === ActionSliderState.RIGHT && !this.componentHasAction(this.rightAction))) {
                    deltaX = 0;
                    this.state = ActionSliderState.CONTENT;
                }
            }
            // update diffs.
            this.currentDifference += deltaX; // is used for snapping.
            this.actualDifference += deltaX; // is used for positioning.
            var currentStateHasAction = false;
            if (this.state === ActionSliderState.LEFT) {
                currentStateHasAction = this.componentHasAction(this.leftAction);
                this.leftAction.toggleSlideThrough(currentStateHasAction);
            }
            if (this.state === ActionSliderState.RIGHT) {
                currentStateHasAction = this.componentHasAction(this.rightAction);
                this.rightAction.toggleSlideThrough(currentStateHasAction);
            }
            this.executeAction = Math.abs(this.actualDifference) > this.actionBreakpoint && currentStateHasAction;
            this.updatePosition();
        }
        this.previousX = event.touches[0].pageX;
        this.previousY = event.touches[0].pageY;
    };
    BdActionSliderComponent.prototype.touchEnd = function () {
        if (!this.isXmovement || this.isMultiTouch) {
            return;
        }
        if (this.executeAction) {
            this.doAction();
        }
        else {
            switch (this.previousState) {
                case ActionSliderState.LEFT:
                    this.actualDifference = 0;
                    this.state = this.previousState = ActionSliderState.CONTENT;
                    break;
                case ActionSliderState.RIGHT:
                    this.actualDifference = 0;
                    this.state = this.previousState = ActionSliderState.CONTENT;
                    break;
                case ActionSliderState.CONTENT:
                default:
                    if (this.currentDifference > this.snapBreakpoint && this.componentHasAction(this.leftAction)) {
                        this.actualDifference = this.ACTION_WIDTH;
                        this.state = ActionSliderState.LEFT;
                    }
                    else if (this.currentDifference < (0 - this.snapBreakpoint) && this.componentHasAction(this.rightAction)) {
                        this.actualDifference = 0 - this.ACTION_WIDTH;
                        this.state = this.previousState = ActionSliderState.RIGHT;
                    }
                    else {
                        this.actualDifference = 0;
                        this.state = this.previousState = ActionSliderState.CONTENT;
                    }
            }
        }
        this.resetHelpStates();
        this.toggleTransition(true);
        this.updatePosition();
    };
    BdActionSliderComponent.prototype.close = function (component) {
        if (!component || component === this) {
            return;
        }
        this.toggleTransition(true);
        this.actualDifference = 0;
        this.updatePosition();
        this.resetHelpStates();
        this.state = this.previousState = ActionSliderState.CONTENT;
    };
    BdActionSliderComponent.prototype.doAction = function () {
        var slideThrough = false;
        if (this.state === ActionSliderState.LEFT) {
            this.leftAction.action.emit();
            slideThrough = this.leftAction.slideThrough;
            this.actualDifference = this.actionSliderContent.getWidth();
            this.state = this.previousState = ActionSliderState.LEFT;
        }
        else if (this.state === ActionSliderState.RIGHT) {
            this.rightAction.action.emit();
            slideThrough = this.rightAction.slideThrough;
            this.actualDifference = 0 - this.actionSliderContent.getWidth();
            this.state = this.previousState = ActionSliderState.RIGHT;
        }
        if (!slideThrough) {
            this.actualDifference = 0;
            this.state = this.previousState = ActionSliderState.CONTENT;
        }
    };
    BdActionSliderComponent.prototype.updatePosition = function () {
        var _this = this;
        if (this.state === ActionSliderState.LEFT) {
            this.actualDifference = Math.max(0, this.actualDifference); // don't go above 0.
        }
        if (this.state === ActionSliderState.RIGHT) {
            this.actualDifference = Math.min(0, this.actualDifference); // don't go below 0.
        }
        requestAnimationFrame(function () {
            if (_this.isComponentDestroyed) {
                return;
            }
            _this.actionSliderContent.setPosition(_this.actualDifference);
            if (_this.state !== ActionSliderState.RIGHT && _this.componentHasAction(_this.leftAction)) {
                _this.leftAction.setWidth(Math.abs(_this.actualDifference));
            }
            if (_this.state !== ActionSliderState.LEFT && _this.componentHasAction(_this.rightAction)) {
                _this.rightAction.setWidth(Math.abs(_this.actualDifference));
            }
        });
    };
    BdActionSliderComponent.prototype.toggleTransition = function (on) {
        var transitionTime = this.executeAction ? '.15s' : '.3s';
        var transition = on ? "all " + transitionTime + " ease-out" : '';
        this.actionSliderContent.setTransition(transition);
        if (this.componentHasAction(this.rightAction)) {
            this.rightAction.setTransition(transition);
        }
        if (this.componentHasAction(this.leftAction)) {
            this.leftAction.setTransition(transition);
        }
    };
    BdActionSliderComponent.prototype.setBreakpoints = function () {
        this.snapBreakpoint = this.actionSliderContent.getWidth() * 0.1;
        this.actionBreakpoint = this.actionSliderContent.getWidth() * 0.5;
    };
    BdActionSliderComponent.prototype.resetHelpStates = function () {
        this.isFirstTouchMove = true;
        this.isXmovement = false;
        this.previousX = 0;
        this.previousY = 0;
    };
    BdActionSliderComponent.prototype.componentHasAction = function (component) {
        return component && component.action.observers.length > 0;
    };
    BdActionSliderComponent.prototype.checkIfMultiTouch = function (event) {
        this.isMultiTouch = event.touches.length > 1;
    };
    BdActionSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-action-slider2',
                    template: "<div class=\"ng2-c-action-slider\">    <ng-content></ng-content></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdActionSliderComponent.ctorParameters = function () { return [
        { type: ActionSliderService, },
    ]; };
    BdActionSliderComponent.propDecorators = {
        "actionSliderContent": [{ type: ContentChild, args: [BdActionSliderContentComponent,] },],
        "leftAction": [{ type: ContentChild, args: [BdLeftActionSliderActionComponent,] },],
        "rightAction": [{ type: ContentChild, args: [BdRightActionSliderActionComponent,] },],
        "touchStart": [{ type: HostListener, args: ['touchstart', ['$event'],] },],
        "touchMove": [{ type: HostListener, args: ['touchmove', ['$event'],] },],
        "touchEnd": [{ type: HostListener, args: ['touchend',] },],
    };
    return BdActionSliderComponent;
}());

var BdActionSliderListComponent = /** @class */ (function () {
    function BdActionSliderListComponent() {
        this.enabled = true;
    }
    BdActionSliderListComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.enabled && this.sliderComponents && this.sliderComponents.length > 0) {
            this.sliderComponents.map(function (item) { return item.enabled = _this.enabled; });
        }
    };
    BdActionSliderListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-action-slider-list2',
                    template: "<ng-content></ng-content>",
                    providers: [ActionSliderService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdActionSliderListComponent.ctorParameters = function () { return []; };
    BdActionSliderListComponent.propDecorators = {
        "sliderComponents": [{ type: ContentChildren, args: [BdActionSliderComponent, { descendants: true },] },],
        "enabled": [{ type: Input },],
    };
    return BdActionSliderListComponent;
}());

var components = [
    BdActionSliderComponent,
    BdActionSliderListComponent,
    BdActionSliderContentComponent,
    BdLeftActionSliderActionComponent,
    BdRightActionSliderActionComponent
];
var BdActionSliderModule = /** @class */ (function () {
    function BdActionSliderModule() {
    }
    BdActionSliderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BrowserModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdActionSliderModule.ctorParameters = function () { return []; };
    return BdActionSliderModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BaseActionSliderAction as ɵc, BdLeftActionSliderActionComponent as ɵd, BdRightActionSliderActionComponent as ɵe, BdActionSliderContentComponent as ɵb, BdActionSliderListComponent as ɵg, BdActionSliderComponent as ɵa, ActionSliderService as ɵf, BdActionSliderModule };
//# sourceMappingURL=index.js.map
