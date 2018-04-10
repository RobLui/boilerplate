import { Component, ContentChildren, ElementRef, EventEmitter, HostBinding, Injectable, Input, NgModule, NgZone, Output, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdScrollModule } from '@delen/bd-scroll';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { BdDeviceService, BdEventService } from '@delen/bd-utilities';
import { BdViewService } from '@delen/bd-view';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';

var BdSectionsService = /** @class */ (function () {
    function BdSectionsService() {
        this.height = 0;
        this.tablet = false;
        this.sectionInView = new Subject$1();
    }
    Object.defineProperty(BdSectionsService.prototype, "navigationHeight", {
        get: function () {
            return this.height;
        },
        set: function (height) {
            this.height = height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdSectionsService.prototype, "isTablet", {
        get: function () {
            return this.tablet;
        },
        set: function (value) {
            this.tablet = value;
        },
        enumerable: true,
        configurable: true
    });
    BdSectionsService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdSectionsService.ctorParameters = function () { return []; };
    return BdSectionsService;
}());

var BdSectionComponent = /** @class */ (function () {
    function BdSectionComponent(bdSectionsService, elementRef) {
        this.bdSectionsService = bdSectionsService;
        this.elementRef = elementRef;
        this.isActive = false;
        this.hidden = false;
        this.isTablet = false;
    }
    BdSectionComponent.prototype.ngOnInit = function () {
        if (this.hidden) {
            this.elementRef.nativeElement.remove();
            return;
        }
    };
    BdSectionComponent.prototype.show = function (bool) {
        this.isActive = bool;
    };
    BdSectionComponent.prototype.onInView = function (inView) {
        if (inView && this.bdSectionsService.isTablet && !this.hidden)
            this.bdSectionsService.sectionInView.next(this.identifier);
    };
    BdSectionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-section2',
                    template: "<div class=\"ng2-c-section__container o-container\" [class.o-container--reset]=\"fullWidth\" (bdOnInView)=\"onInView($event)\">    <ng-content></ng-content></div>",
                    host: { 'class': 'ng2-c-section' }
                },] },
    ];
    /** @nocollapse */
    BdSectionComponent.ctorParameters = function () { return [
        { type: BdSectionsService, },
        { type: ElementRef, },
    ]; };
    BdSectionComponent.propDecorators = {
        "isActive": [{ type: HostBinding, args: ["class.ng2-c-section--is-active",] },],
        "identifier": [{ type: Input, args: ['id',] },],
        "navigationTitle": [{ type: Input },],
        "fullWidth": [{ type: Input },],
        "hidden": [{ type: Input },],
    };
    return BdSectionComponent;
}());

var BdSectionsEvent;
(function (BdSectionsEvent) {
    BdSectionsEvent["OnScroll"] = "onScroll";
    BdSectionsEvent["OnTabClick"] = "onTabClick";
    BdSectionsEvent["OnLoad"] = "onLoad";
    BdSectionsEvent["OnSwipe"] = "onSwipe";
})(BdSectionsEvent || (BdSectionsEvent = {}));

var SwipeDirections;
(function (SwipeDirections) {
    SwipeDirections[SwipeDirections["LEFT"] = 0] = "LEFT";
    SwipeDirections[SwipeDirections["RIGHT"] = 1] = "RIGHT";
})(SwipeDirections || (SwipeDirections = {}));
var BdSectionsComponent = /** @class */ (function () {
    function BdSectionsComponent(bdDeviceService, bdSectionsService, bdEventService, bdViewService, element, ngZone) {
        var _this = this;
        this.bdDeviceService = bdDeviceService;
        this.bdSectionsService = bdSectionsService;
        this.bdEventService = bdEventService;
        this.bdViewService = bdViewService;
        this.element = element;
        this.ngZone = ngZone;
        this.ngUnsubscribe = new Subject$1();
        // touch related stuff
        this.touchBound = false;
        this.sectionArray = [];
        this.initialTouchX = 0;
        this.initialTouchY = 0;
        this.isMultiTouch = false;
        this.moveDistanceX = 0;
        this.moveDistanceY = 0;
        this.activeSectionIndex = 0;
        this.minimumDistance = 80;
        this.tabbarHeight = 50;
        this.activeSectionChange = new EventEmitter();
        this.inViewChange = new EventEmitter();
        this.minimumHeight = '';
        /**
             * Eventlistener on touchstart which checks if user uses multitouch and sets initial touch position
             *
             * @param event: TouchStart event
             */
        this.onTouchStart = function (event) {
            _this.checkIfMultiTouch(event);
            // keep initialTouch X and Y separated because of weird iOS9 bug ¯\_(ツ)_/¯
            // keep initialTouch X and Y separated because of weird iOS9 bug ¯\_(ツ)_/¯
            _this.initialTouchX = event.touches[0].pageX;
            _this.initialTouchY = event.touches[0].pageY;
            _this.activeSectionIndex = _this.sectionArray.indexOf(_this.activeSection);
        };
        /**
             * Eventlistener on touchmove to calculate the distances while moving
             *
             * @param event: TouchMove Event
             */
        this.onTouchMove = function (event) {
            if (_this.isMultiTouch)
                return;
            _this.moveDistanceX = event.touches[0].pageX - _this.initialTouchX;
            _this.moveDistanceY = event.touches[0].pageY - _this.initialTouchY;
            // Trying to predict the end touch.
            // While moving, we calculate the angle of the vector from point A to point B. If this absolute value of the angle is below 1 radian (± 57 degrees),
            // we conclude this is merely a horizontal movement, so we prevent the vertical scrolling from happening.
            //
            // This logic was needed because the scrollTop doesn't do anything when the app is in "scrollmode" #gohacks
            var angleRadians = Math.atan2(Math.abs(_this.moveDistanceY), Math.abs(_this.moveDistanceX));
            if (Math.abs(angleRadians) < 1) {
                event.preventDefault();
            }
        };
        /**
             * To swipe or not to swipe? That's the question
             */
        this.onTouchEnd = function () {
            // We only navigate when:
            //     * is not multitouch
            //     * minimum horizontal distance is exceeded
            //     * horizontal movement is larger than the vertical movement
            //         (if vertical is larger than horizontal, the user probably wanted to scroll instead of swiping)
            if (Math.abs(_this.moveDistanceX) < _this.minimumDistance ||
                Math.abs(_this.moveDistanceY) > Math.abs(_this.moveDistanceX) ||
                _this.isMultiTouch)
                return;
            // determine to which section we need to navigate to
            var direction = _this.moveDistanceX < 0 ? SwipeDirections.LEFT : SwipeDirections.RIGHT;
            var nextIndex = _this.getNextIndex(direction);
            // only navigate to other section when different from current
            if (_this.activeSectionIndex !== nextIndex) {
                _this.ngZone.run(function () {
                    _this.activateSection(_this.sectionArray[nextIndex], BdSectionsEvent.OnSwipe);
                });
            }
            _this.resetTouchValues();
        };
    }
    BdSectionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scrollContainerEl = this.bdViewService.scrollContainer;
        this.bdSectionsService.sectionInView
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (section) {
            _this.inViewTrigger(section, BdSectionsEvent.OnScroll);
        });
        this.bdEventService.onWindowResizeOutsideZone
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            _this.bdSectionsService.isTablet = _this.bdDeviceService.isTablet();
            // if device becomes tablet and has touch events, remove it
            if (_this.bdSectionsService.isTablet && _this.touchBound) {
                _this.touchUnsubscribe();
            }
            // !(previousComment)
            if (!_this.bdSectionsService.isTablet && !_this.touchBound) {
                _this.touchSubscribe();
            }
            _this.setMinHeight();
        });
        this.setMinHeight();
    };
    BdSectionsComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!this.activeSection) {
            this.activeSection = this.sectionList.first.identifier;
        }
        this.showSection(this.activeSection);
        this.sectionList.changes.subscribe(function () {
            _this.buildSectionArray();
        });
        this.buildSectionArray();
        this.bdSectionsService.isTablet = this.bdDeviceService.isTablet();
        if (!this.bdSectionsService.isTablet) {
            this.touchSubscribe();
            this.inViewTrigger(this.activeSection, BdSectionsEvent.OnLoad);
        }
    };
    BdSectionsComponent.prototype.ngOnChanges = function (changes) {
        if (changes.activeSection) {
            this.showSection(changes.activeSection.currentValue);
        }
    };
    BdSectionsComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.touchUnsubscribe();
    };
    /**
     * When clicked in navigation, the correct section will be triggered
     *
     * @param {string} sectionId
     */
    /**
         * When clicked in navigation, the correct section will be triggered
         *
         * @param {string} sectionId
         */
    BdSectionsComponent.prototype.onNavigationTabChanged = /**
         * When clicked in navigation, the correct section will be triggered
         *
         * @param {string} sectionId
         */
    function (sectionId) {
        this.activateSection(sectionId, BdSectionsEvent.OnTabClick);
    };
    BdSectionsComponent.prototype.showSection = function (sectionId) {
        if (this.sectionList) {
            this.sectionList.forEach(function (section) {
                section.show(section.identifier === sectionId);
            });
        }
    };
    /**
     * Activates the correct section
     *
     * @param {string} sectionId
     * @param {BdSectionsEvent} eventType
     */
    /**
         * Activates the correct section
         *
         * @param {string} sectionId
         * @param {BdSectionsEvent} eventType
         */
    BdSectionsComponent.prototype.activateSection = /**
         * Activates the correct section
         *
         * @param {string} sectionId
         * @param {BdSectionsEvent} eventType
         */
    function (sectionId, eventType) {
        this.activeSectionChange.emit(sectionId);
        this.inViewTrigger(sectionId, eventType);
        this.scrollContainerEl.scrollTop = 0;
    };
    /**
     * Throws change section event to who cares
     *
     * @param {string} sectionId
     * @param {BdSectionsEvent} eventType
     */
    /**
         * Throws change section event to who cares
         *
         * @param {string} sectionId
         * @param {BdSectionsEvent} eventType
         */
    BdSectionsComponent.prototype.inViewTrigger = /**
         * Throws change section event to who cares
         *
         * @param {string} sectionId
         * @param {BdSectionsEvent} eventType
         */
    function (sectionId, eventType) {
        this.inViewChange.emit({ section: sectionId, eventType: eventType });
    };
    /**
     * Sets height to sectionContent to fix deadspot when swiping
     */
    /**
         * Sets height to sectionContent to fix deadspot when swiping
         */
    BdSectionsComponent.prototype.setMinHeight = /**
         * Sets height to sectionContent to fix deadspot when swiping
         */
    function () {
        // height of screen minus tabbar and header
        var minHeight = window.innerHeight - this.tabbarHeight - this.element.nativeElement.offsetTop;
        this.minimumHeight = minHeight + "px";
    };
    BdSectionsComponent.prototype.touchSubscribe = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.sectionContent.nativeElement.addEventListener('touchstart', _this.onTouchStart);
            _this.sectionContent.nativeElement.addEventListener('touchmove', _this.onTouchMove);
            _this.sectionContent.nativeElement.addEventListener('touchend', _this.onTouchEnd);
            _this.touchBound = true;
        });
    };
    BdSectionsComponent.prototype.touchUnsubscribe = function () {
        this.sectionContent.nativeElement.removeEventListener('touchstart', this.onTouchStart);
        this.sectionContent.nativeElement.removeEventListener('touchmove', this.onTouchMove);
        this.sectionContent.nativeElement.removeEventListener('touchend', this.onTouchEnd);
        this.touchBound = false;
    };
    BdSectionsComponent.prototype.resetTouchValues = function () {
        // reset that 💩
        this.moveDistanceX = 0;
        this.moveDistanceY = 0;
        this.initialTouchX = 0;
        this.initialTouchY = 0;
    };
    BdSectionsComponent.prototype.checkIfMultiTouch = function (event) {
        this.isMultiTouch = event.touches.length > 1;
    };
    /**
     * Transforms QueryList of sectionComponents to simple array
     */
    /**
         * Transforms QueryList of sectionComponents to simple array
         */
    BdSectionsComponent.prototype.buildSectionArray = /**
         * Transforms QueryList of sectionComponents to simple array
         */
    function () {
        // needed for searching next or previous section in a simple way
        this.sectionArray = this.sectionList.map(function (section) { return section.identifier; });
    };
    /**
     * Determines what's the index of the section we want to navigate to and checks if it's still in bounds
     *
     * @param {SwipeDirections} direction: direction to navigate to
     *
     * @returns {number} index of the to go section
     */
    /**
         * Determines what's the index of the section we want to navigate to and checks if it's still in bounds
         *
         * @param {SwipeDirections} direction: direction to navigate to
         *
         * @returns {number} index of the to go section
         */
    BdSectionsComponent.prototype.getNextIndex = /**
         * Determines what's the index of the section we want to navigate to and checks if it's still in bounds
         *
         * @param {SwipeDirections} direction: direction to navigate to
         *
         * @returns {number} index of the to go section
         */
    function (direction) {
        switch (direction) {
            case SwipeDirections.LEFT:
                return Math.min(this.activeSectionIndex + 1, this.sectionArray.length - 1);
            case SwipeDirections.RIGHT:
                return Math.max(this.activeSectionIndex - 1, 0);
            default:
                return this.activeSectionIndex;
        }
    };
    BdSectionsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-sections2',
                    template: "<bd-sections-nav2 [activeSection]=\"activeSection\" [sectionList]=\"sectionList\"                  (activeSectionChange)=\"onNavigationTabChanged($event)\"></bd-sections-nav2><div class=\"ng2-c-sections__content\" [style.minHeight]=\"minimumHeight\" #sectionContent>    <ng-content></ng-content></div>",
                    host: { 'class': 'ng2-c-sections' }
                },] },
    ];
    /** @nocollapse */
    BdSectionsComponent.ctorParameters = function () { return [
        { type: BdDeviceService, },
        { type: BdSectionsService, },
        { type: BdEventService, },
        { type: BdViewService, },
        { type: ElementRef, },
        { type: NgZone, },
    ]; };
    BdSectionsComponent.propDecorators = {
        "activeSection": [{ type: Input },],
        "activeSectionChange": [{ type: Output },],
        "inViewChange": [{ type: Output },],
        "sectionList": [{ type: ContentChildren, args: [BdSectionComponent,] },],
        "sectionContent": [{ type: ViewChild, args: ['sectionContent',] },],
    };
    return BdSectionsComponent;
}());

var BdSectionsNavigationComponent = /** @class */ (function () {
    function BdSectionsNavigationComponent($element, bdDeviceService, bdEventService, bdViewService, bdSectionsService, ngZone) {
        var _this = this;
        this.$element = $element;
        this.bdDeviceService = bdDeviceService;
        this.bdEventService = bdEventService;
        this.bdViewService = bdViewService;
        this.bdSectionsService = bdSectionsService;
        this.ngZone = ngZone;
        this.ngUnsubscribe = new Subject$1();
        this.isFixed = false;
        this.navigationOnTop = false;
        this.activeSectionChange = new EventEmitter();
        this.eventHandler = function () {
            _this.checkNavigationPosition();
        };
        this.element = this.$element.nativeElement;
    }
    BdSectionsNavigationComponent.prototype.ngOnInit = function () {
        var _this = this;
        // no need to build navigation item for section that is hidden #gohacks
        this.filteredSectionList = this.sectionList.filter(function (section) { return !section.hidden; });
        this.bdEventService.onWindowResizeOutsideZone
            .takeUntil(this.ngUnsubscribe)
            .do(function () { return _this.onResize(); })
            .subscribe();
        // OnInit we need to check the top position of the navigation element.
        // Runs inside animationframe because we need the correct top value.
        window.requestAnimationFrame(function () {
            _this.checkNavigationPosition(true);
        });
        this.scrollContainerEl = this.bdViewService.scrollContainer;
        this.scrollContainerEl.addEventListener('scroll', this.eventHandler);
    };
    BdSectionsNavigationComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.scrollContainerEl.removeEventListener('scroll', this.eventHandler);
    };
    BdSectionsNavigationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.bdSectionsService.navigationHeight = this.$element.nativeElement.getBoundingClientRect().height;
        this.ngZone.runOutsideAngular(function () {
            _this.checkTabSpacing(15);
            _this.repositionNavigation();
        });
    };
    BdSectionsNavigationComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.sectionTabs) {
            this.ngZone.runOutsideAngular(function () {
                _this.checkTabSpacing(15);
                _this.repositionNavigation();
            });
        }
    };
    BdSectionsNavigationComponent.prototype.onNavigationItemClick = function (sectionId) {
        this.activeSectionChange.emit(sectionId);
    };
    BdSectionsNavigationComponent.prototype.trackByFn = function (index, section) {
        return section.identifier;
    };
    BdSectionsNavigationComponent.prototype.onResize = function () {
        this.checkNavigationPosition();
        this.checkTabSpacing(15);
        this.repositionNavigation();
    };
    /**
     * Sets the same space/padding around each of given tab
     *
     * @param {HTMLElement[]} navigationTabList: list of tabs
     * @param {string} spacing: padding between each tab
     */
    /**
         * Sets the same space/padding around each of given tab
         *
         * @param {HTMLElement[]} navigationTabList: list of tabs
         * @param {string} spacing: padding between each tab
         */
    BdSectionsNavigationComponent.prototype.setTabSpacing = /**
         * Sets the same space/padding around each of given tab
         *
         * @param {HTMLElement[]} navigationTabList: list of tabs
         * @param {string} spacing: padding between each tab
         */
    function (navigationTabList, spacing) {
        navigationTabList.forEach(function (navigationTab) {
            navigationTab.style.paddingLeft = spacing;
            navigationTab.style.paddingRight = spacing;
        });
    };
    /**
     *  Checks the position on the page of navigation bar of the section and sets it to fixed if it is on top.
     */
    /**
         *  Checks the position on the page of navigation bar of the section and sets it to fixed if it is on top.
         */
    BdSectionsNavigationComponent.prototype.checkNavigationPosition = /**
         *  Checks the position on the page of navigation bar of the section and sets it to fixed if it is on top.
         */
    function (initial) {
        if (initial === void 0) { initial = false; }
        if (!this.bdDeviceService.isTablet() && !this.navigationOnTop) {
            var sectionBcr = this.element.parentElement ? this.element.parentElement.getBoundingClientRect() : this.element.getBoundingClientRect();
            var headerSize = this.bdViewService.statusBarHeight + this.bdSectionsService.navigationHeight;
            var bottomBreakline = headerSize + this.element.offsetHeight;
            /**
                         * Implemented this check because of buggy scrolling behaviour (bug #6524)
                         * If the top of the navigavtion equals the height of the header (aka the navigation sits directly below
                         * the header) don't switch between fixed and absolute positioning.
                         * If we skip this check the navigation is sometimes fixed, sometimes absolute. Not really pretty to look at.
                         */
            if (initial && headerSize === sectionBcr.top)
                this.navigationOnTop = true;
            if (sectionBcr.top <= headerSize && sectionBcr.bottom > bottomBreakline) {
                if (!this.isFixed) {
                    this.isFixed = true;
                    this.element.style.position = 'fixed';
                    this.element.style.top = headerSize + 'px';
                }
            }
            else {
                if (this.isFixed) {
                    this.isFixed = false;
                    this.element.style.position = 'absolute';
                    this.element.style.top = '0';
                }
            }
        }
    };
    /**
     * When a new section / tab goes active, the position of the active tab-item should be in the center (if possible with scroll).
     */
    /**
         * When a new section / tab goes active, the position of the active tab-item should be in the center (if possible with scroll).
         */
    BdSectionsNavigationComponent.prototype.repositionNavigation = /**
         * When a new section / tab goes active, the position of the active tab-item should be in the center (if possible with scroll).
         */
    function () {
        var _this = this;
        if (!this.bdDeviceService.isTablet()) {
            var navigationTab = this.sectionTabs.map(function (navTab) {
                return navTab.nativeElement;
            }).find(function (navTab) {
                // can't use the active tab because of timing issues, data-attr is cleaner solution than id or class because of mapping
                return navTab.getAttribute('data-bd-tab-id') === _this.activeSection;
            });
            if (navigationTab) {
                var navigationBcr = this.element.getBoundingClientRect();
                var navigationTabBcr = navigationTab.getBoundingClientRect();
                var absLeft = navigationTabBcr.left + this.element.scrollLeft;
                this.element.scrollLeft = absLeft - (navigationBcr.width * 0.5) + (navigationTabBcr.width * 0.5);
            }
        }
    };
    /**
     * checks if there is some room left to tease next navigation tab, if not the spacing should become smaller
     *
     * @param {number} currentSpacing: current spacing
     * @param {number} safety: prevents enormous or very small spacing
     */
    /**
         * checks if there is some room left to tease next navigation tab, if not the spacing should become smaller
         *
         * @param {number} currentSpacing: current spacing
         * @param {number} safety: prevents enormous or very small spacing
         */
    BdSectionsNavigationComponent.prototype.checkTabSpacing = /**
         * checks if there is some room left to tease next navigation tab, if not the spacing should become smaller
         *
         * @param {number} currentSpacing: current spacing
         * @param {number} safety: prevents enormous or very small spacing
         */
    function (currentSpacing, safety) {
        if (safety === void 0) { safety = 0; }
        // check if not tablet, because we do not need to calculate something when its not displayed
        if (!this.bdDeviceService.isTablet()) {
            var usedWidth = 0;
            var maxSpacing = 21;
            var minSpacing = 7;
            var offset = 10;
            currentSpacing = !currentSpacing || currentSpacing < minSpacing ? maxSpacing : currentSpacing;
            if (safety > maxSpacing - minSpacing) {
                return;
            }
            var availableWidth = this.element.clientWidth;
            var navigationTabList = this.sectionTabs.map(function (navTab) {
                return navTab.nativeElement;
            });
            for (var i = 0; i < navigationTabList.length; i++) {
                var navigationTab = navigationTabList[i];
                usedWidth += navigationTab.clientWidth;
                var startBoundary = usedWidth - currentSpacing - offset;
                var endBoundary = usedWidth + currentSpacing + offset;
                if (availableWidth > startBoundary && availableWidth < endBoundary) {
                    this.setTabSpacing(navigationTabList, currentSpacing + 'px');
                    this.checkTabSpacing(currentSpacing - 1, safety + 1);
                    break;
                }
            }
        }
    };
    BdSectionsNavigationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-sections-nav2',
                    template: "<ul class=\"ng2-c-sections__list\">    <li class=\"ng2-c-sections__tab\" #sectionTab *ngFor=\"let section of filteredSectionList;trackBy: trackByFn\"        (click)=\"onNavigationItemClick(section.identifier)\"        [class.ng2-c-sections__tab--is-active]=\"activeSection === section.identifier\"        [attr.data-bd-tab-id]=\"section.identifier\">        <span class=\"ng2-c-sections__tab-text\">{{ section.navigationTitle }}</span>    </li></ul>",
                    host: { 'class': 'ng2-c-sections__navigation' }
                },] },
    ];
    /** @nocollapse */
    BdSectionsNavigationComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdDeviceService, },
        { type: BdEventService, },
        { type: BdViewService, },
        { type: BdSectionsService, },
        { type: NgZone, },
    ]; };
    BdSectionsNavigationComponent.propDecorators = {
        "sectionList": [{ type: Input },],
        "activeSection": [{ type: Input },],
        "activeSectionChange": [{ type: Output },],
        "sectionTabs": [{ type: ViewChildren, args: ['sectionTab',] },],
    };
    return BdSectionsNavigationComponent;
}());

var components = [
    BdSectionsComponent,
    BdSectionComponent,
    BdSectionsNavigationComponent
];
var BdSectionsModule = /** @class */ (function () {
    function BdSectionsModule() {
    }
    BdSectionsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdScrollModule
                    ],
                    declarations: components,
                    exports: components,
                    providers: [BdSectionsService]
                },] },
    ];
    /** @nocollapse */
    BdSectionsModule.ctorParameters = function () { return []; };
    return BdSectionsModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdSectionComponent as ɵb, BdSectionsNavigationComponent as ɵc, BdSectionsComponent as ɵa, BdSectionsModule, BdSectionsEvent, BdSectionsService };
//# sourceMappingURL=index.js.map
