import { Component, ElementRef, EventEmitter, Input, NgModule, NgZone, Optional, Output, ViewChild } from '@angular/core';
import { BdScrollContainerDirective } from '@delen/bd-scroll';
import { BdRepaintService } from '@delen/bd-utilities';

var BdPullToRefreshComponent = /** @class */ (function () {
    function BdPullToRefreshComponent(element, bdRepaintService, ngZone, bdScrollContainerDirective) {
        var _this = this;
        this.element = element;
        this.bdRepaintService = bdRepaintService;
        this.ngZone = ngZone;
        this.bdScrollContainerDirective = bdScrollContainerDirective;
        this.ANIMATE_CLASS = 'ng2-c-pull-to-refresh--animate';
        // this is used to smooth the pulling
        // eg. scrolling 10px will result in a 5px movement of the content
        this.easing = 0.5;
        this.states = {
            DEFAULT: {
                state: 'default',
                class: 'ng2-c-pull-to-refresh--default'
            },
            RELEASE: {
                state: 'release',
                class: 'ng2-c-pull-to-refresh--release'
            },
            LOADING: {
                state: 'loading',
                class: 'ng2-c-pull-to-refresh--loading'
            },
            PULL: {
                state: 'pull',
                class: 'ng2-c-pull-to-refresh--pull'
            }
        };
        this.iconHeight = 60;
        this.minimumScrollDistance = 120;
        this.initialTouchY = 0;
        this.isTracking = false;
        this.scrolledDistance = 0;
        this.scrollDistanceY = 0;
        this.isMultiTouch = false;
        this.shouldRepaint = false;
        this.state = this.states.DEFAULT;
        this.onPulled = new EventEmitter();
        /*
                Check if user uses multitouch,
                If so we want to disable pulling (see touchmove and touchend).
        
                Set initial touch position.
        
                Remove animate class, because otherwise when pulling up/down it will look like there is a delay.
            */
        this.onSlideStart = function (evt) {
            _this.checkIfMultiTouch(evt);
            _this.initialTouchY = evt.touches[0].pageY;
            _this.element.nativeElement.classList.remove(_this.ANIMATE_CLASS);
        };
        /*
                Keep track of scrolled distance since initital position.
        
                When user has already scrolled (e.g. long list of items) or is scrolling up,
                Disable pulling
        
                When user is using multitouch or state is LOADING,
                Disable pulling and prevent safari bounce
        
                Change state to RELEASE when user scrolled past minimum scroll distance,
                otherwise change state to PULL.
        
                Update pull to refresh content position to scrolled distance.
            */
        this.onSlideMove = function (evt) {
            _this.scrolledDistance = evt.touches[0].pageY - _this.initialTouchY;
            if (_this.isContentScrolled() || (_this.scrolledDistance <= 0 && _this.state === _this.states.DEFAULT)) {
                return;
            }
            /*
                        prevent safari bounce, needs the after the previous if statement
                        otherwise we can't scroll inside our list
                    */
            evt.preventDefault();
            if (_this.isMultiTouch || _this.isLoading()) {
                return;
            }
            if (_this.scrolledDistance >= _this.minimumScrollDistance) {
                _this.setState(_this.states.RELEASE);
            }
            else {
                _this.setState(_this.states.PULL);
            }
            _this.slideTo(_this.scrolledDistance * _this.easing);
        };
        /*
                When user has already scrolled (e.g. long list of items), is scrolling up or is in LOADING state
                Disable pulling
        
                Add animation class, so it animates to correct position.
        
                When user is using multitouch,
                Disable pulling and reset everything
        
                When state is RELEASE, we update it to LOADING,
                and slide back, keep in mind of icon height for our loading icon to be visible
                Otherwise we reset everything.
            */
        this.onSlideEnd = function () {
            if (_this.isContentScrolled() || (_this.scrolledDistance <= 0 && _this.state === _this.states.DEFAULT) || _this.isLoading()) {
                return;
            }
            _this.element.nativeElement.classList.add(_this.ANIMATE_CLASS);
            // ensure to reset when user starts with one finger and adds another finger during pull
            if (_this.state !== _this.states.RELEASE || _this.isMultiTouch) {
                _this.reset();
                return;
            }
            _this.ngZone.run(function () {
                _this.onPulled.emit();
            });
            _this.setState(_this.states.LOADING);
            _this.slideTo(_this.iconHeight);
        };
        /*
                When something went wrong, reset everything
            */
        this.onSlideCancel = function () {
            _this.reset();
        };
        /*
                We need to repaint our document
                otherwise we have a weird issue where our element adds a whitespace at the bottom..
                But we have to do this after our transition ends because otherwise we don't have a smooth transition back to top..
            */
        this.transitionendListener = function () {
            if (_this.shouldRepaint)
                _this.bdRepaintService.repaint(document.body);
            _this.shouldRepaint = false;
        };
    }
    BdPullToRefreshComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.pullToRefreshContent.nativeElement.addEventListener('transitionend', _this.transitionendListener);
            _this.element.nativeElement.addEventListener('touchstart', _this.onSlideStart);
            _this.element.nativeElement.addEventListener('touchmove', _this.onSlideMove);
            _this.element.nativeElement.addEventListener('touchend', _this.onSlideEnd);
            _this.element.nativeElement.addEventListener('touchcancel', _this.onSlideCancel);
        });
    };
    BdPullToRefreshComponent.prototype.ngOnChanges = function (changes) {
        /*
                    When the loading binding is changed from true to false,
                    we want to reset everything
                */
        if (changes.loading && !changes.loading.firstChange && changes.loading.currentValue === false) {
            this.reset();
        }
    };
    BdPullToRefreshComponent.prototype.ngOnDestroy = function () {
        this.element.nativeElement.removeEventListener('touchstart', this.onSlideStart);
        this.element.nativeElement.removeEventListener('touchmove', this.onSlideMove);
        this.element.nativeElement.removeEventListener('touchend', this.onSlideEnd);
        this.element.nativeElement.removeEventListener('touchcancel', this.onSlideCancel);
        this.pullToRefreshContent.nativeElement.removeEventListener('transitionend', this.transitionendListener);
    };
    BdPullToRefreshComponent.prototype.slideTo = function (pos) {
        this.pullToRefreshContent.nativeElement.style['transform'] = "translate3d(0, " + pos + "px, 0)";
    };
    /*
        Keep track of our state,
        only update it when state has changed.
    */
    /*
            Keep track of our state,
            only update it when state has changed.
        */
    BdPullToRefreshComponent.prototype.setState = /*
            Keep track of our state,
            only update it when state has changed.
        */
    function (newState) {
        if (newState !== this.state) {
            this.element.nativeElement.classList
                .remove(this.state.class);
            this.element.nativeElement.classList
                .add(newState.class);
            this.state = newState;
        }
    };
    BdPullToRefreshComponent.prototype.checkIfMultiTouch = function (evt) {
        this.isMultiTouch = evt.touches.length > 1;
    };
    BdPullToRefreshComponent.prototype.isContentScrolled = function () {
        return !!this.bdScrollContainerDirective && this.bdScrollContainerDirective.element.scrollTop > 0;
    };
    BdPullToRefreshComponent.prototype.isLoading = function () {
        return this.state === this.states.LOADING;
    };
    BdPullToRefreshComponent.prototype.reset = function () {
        this.shouldRepaint = true;
        this.element.nativeElement.classList.add(this.ANIMATE_CLASS);
        this.setState(this.states.DEFAULT);
        this.slideTo(0);
    };
    BdPullToRefreshComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-pull-to-refresh2',
                    template: "<div #ptrContent class=\"ng2-c-pull-to-refresh__content\">    <ng-content></ng-content></div>",
                    host: {
                        class: 'ng2-c-pull-to-refresh'
                    }
                },] },
    ];
    /** @nocollapse */
    BdPullToRefreshComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdRepaintService, },
        { type: NgZone, },
        { type: BdScrollContainerDirective, decorators: [{ type: Optional },] },
    ]; };
    BdPullToRefreshComponent.propDecorators = {
        "loading": [{ type: Input },],
        "onPulled": [{ type: Output },],
        "pullToRefreshContent": [{ type: ViewChild, args: ['ptrContent',] },],
    };
    return BdPullToRefreshComponent;
}());

var components = [
    BdPullToRefreshComponent
];
var BdPullToRefreshModule = /** @class */ (function () {
    function BdPullToRefreshModule() {
    }
    BdPullToRefreshModule.decorators = [
        { type: NgModule, args: [{
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdPullToRefreshModule.ctorParameters = function () { return []; };
    return BdPullToRefreshModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPullToRefreshComponent, BdPullToRefreshModule };
//# sourceMappingURL=index.js.map
