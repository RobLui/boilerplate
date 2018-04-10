import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, HostListener, NgModule } from '@angular/core';
import { BdDeviceService } from '@delen/bd-utilities';
import { CommonModule } from '@angular/common';

var BdPanelSliderItemComponent = /** @class */ (function () {
    function BdPanelSliderItemComponent() {
    }
    BdPanelSliderItemComponent.decorators = [
        { type: Component, args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'ng2-c-panel-slider__item' },
                    selector: 'bd-panel-slider-item2',
                    template: "<ng-content></ng-content>"
                },] },
    ];
    /** @nocollapse */
    BdPanelSliderItemComponent.ctorParameters = function () { return []; };
    return BdPanelSliderItemComponent;
}());

var BdPanelSliderComponent = /** @class */ (function () {
    function BdPanelSliderComponent(element, bdDeviceService) {
        this.element = element;
        this.bdDeviceService = bdDeviceService;
        this.previousLastElement = null;
    }
    BdPanelSliderComponent.prototype.onResize = function () {
        if (this.bdDeviceService.isTablet()) {
            this.checkOverflow();
        }
        else {
            this.prepareForMobile();
        }
    };
    BdPanelSliderComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.bdDeviceService.isTablet()) {
            this.subscription = this.contentChildren.changes.subscribe(function (children) {
                if (children.length) {
                    _this.checkOverflow();
                }
            });
            if (this.contentChildren.length)
                this.checkOverflow();
        }
    };
    BdPanelSliderComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
    };
    BdPanelSliderComponent.prototype.scrollToEnd = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            var nativeElement = _this.element.nativeElement;
            nativeElement.style.overflowX = 'hidden'; // stop any browser swipe animation
            nativeElement.scrollLeft = nativeElement.scrollWidth; // reset left scroll
            nativeElement.style.overflowX = '';
        });
    };
    BdPanelSliderComponent.prototype.checkOverflow = function () {
        var IS_OVERFLOWING_CLASS = 'ng2-c-panel-slider--is-overflowing';
        // ELEMENTS
        var nativeElement = this.element.nativeElement;
        var panelSliderItem = nativeElement.firstElementChild;
        var usedComponent = panelSliderItem.firstElementChild;
        var lastElement = nativeElement.lastElementChild;
        // VALUES
        var usedComponentPadding = panelSliderItem.getBoundingClientRect().width - usedComponent.getBoundingClientRect().width;
        var usedComponentHalfSize = (usedComponent.getBoundingClientRect().width / 2);
        var usedComponentHalfSizeWithPadding = (usedComponent.getBoundingClientRect().width / 2) + usedComponentPadding;
        var cssValue = usedComponentHalfSize.toString();
        // WIDTHS
        var clientWidth = nativeElement.clientWidth; // available width
        var scrollWidth = nativeElement.scrollWidth;
        var usedWidth = scrollWidth;
        if (nativeElement.classList.contains(IS_OVERFLOWING_CLASS)) {
            usedWidth = scrollWidth - (clientWidth / 2) + usedComponentHalfSizeWithPadding;
        }
        if (this.previousLastElement !== null) {
            this.previousLastElement.removeAttribute('style'); // remove the style that was set on the previousLastElement to prevent incorrect spacing between items
        }
        this.previousLastElement = lastElement; // update the previousLastElement with the currentLastElement
        if (clientWidth < usedWidth) {
            nativeElement.classList.add(IS_OVERFLOWING_CLASS);
            lastElement.style.paddingRight = "calc(50% - " + cssValue + "px)"; // set last element in the middle by giving it a padding-right value
            this.scrollToEnd();
        }
        else {
            nativeElement.classList.remove(IS_OVERFLOWING_CLASS);
        }
    };
    BdPanelSliderComponent.prototype.prepareForMobile = function () {
        var lastElement = this.element.nativeElement.lastElementChild;
        lastElement.removeAttribute('style');
    };
    BdPanelSliderComponent.decorators = [
        { type: Component, args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'ng2-c-panel-slider' },
                    selector: 'bd-panel-slider2',
                    template: "\n        <ng-content select=\"bd-panel-slider-item2\"></ng-content>"
                },] },
    ];
    /** @nocollapse */
    BdPanelSliderComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdDeviceService, },
    ]; };
    BdPanelSliderComponent.propDecorators = {
        "contentChildren": [{ type: ContentChildren, args: [BdPanelSliderItemComponent,] },],
        "onResize": [{ type: HostListener, args: ['window:resize',] },],
    };
    return BdPanelSliderComponent;
}());

var components = [
    BdPanelSliderComponent,
    BdPanelSliderItemComponent
];
var BdPanelSliderModule = /** @class */ (function () {
    function BdPanelSliderModule() {
    }
    BdPanelSliderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components,
                    providers: [BdDeviceService]
                },] },
    ];
    /** @nocollapse */
    BdPanelSliderModule.ctorParameters = function () { return []; };
    return BdPanelSliderModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPanelSliderItemComponent as ɵa, BdPanelSliderComponent, BdPanelSliderModule };
//# sourceMappingURL=index.js.map
