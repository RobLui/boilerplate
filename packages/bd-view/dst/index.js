import { ChangeDetectionStrategy, Component, ElementRef, Injectable, Input, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

var BdViewService = /** @class */ (function () {
    function BdViewService() {
        this.customHeaderHeightValue = 0;
    }
    Object.defineProperty(BdViewService.prototype, "statusbar", {
        set: function (e) {
            this.statusbarElement = e;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdViewService.prototype, "statusBarHeight", {
        get: function () {
            if (!this.statusbarElement) {
                // This happens when this function is called from, for example,
                // the bd-table inside an Angular 1 view.
                this.height = 0;
            }
            if (typeof this.height === 'undefined') {
                this.height = this.statusbarElement.getBoundingClientRect().height;
            }
            return this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdViewService.prototype, "scrollContainer", {
        get: function () {
            return this.scrollContainerElement;
        },
        set: function (e) {
            this.scrollContainerElement = e;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdViewService.prototype, "customHeaderHeight", {
        get: function () {
            return this.customHeaderHeightValue;
        },
        set: function (height) {
            this.customHeaderHeightValue = height;
        },
        enumerable: true,
        configurable: true
    });
    BdViewService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdViewService.ctorParameters = function () { return []; };
    return BdViewService;
}());

var BdViewComponent = /** @class */ (function () {
    function BdViewComponent(element, bdViewService) {
        this.element = element;
        this.bdViewService = bdViewService;
        this.hasSidebar = false;
        this.CLASSES = {
            header: '.ng2-c-header',
            sidebar: '.ng2-c-view__sidebar',
            wrapper: '.ng2-c-view__wrapper',
            sidebarClosed: 'ng2-c-view--sidebar-closed',
            hasSidebar: 'ng2-c-view--has-sidebar',
            hasHeader: 'ng2-c-view--has-header',
            viewContent: '.ng2-c-view__content'
        };
        this.showSidebar = true;
    }
    BdViewComponent.prototype.ngOnInit = function () {
        this.bdViewService.statusbar = this.bdViewStatusbar.nativeElement;
        var scrollContainer = this.element.nativeElement.querySelector(this.CLASSES.viewContent);
        this.bdViewService.scrollContainer = scrollContainer;
    };
    BdViewComponent.prototype.ngOnDestroy = function () {
        this.bdViewService.customHeaderHeight = 0;
    };
    BdViewComponent.prototype.ngAfterViewInit = function () {
        var $sidebar = this.element.nativeElement.querySelector(this.CLASSES.sidebar);
        var $customHeader = this.element.nativeElement.querySelector(this.CLASSES.viewContent + " " + this.CLASSES.header);
        if ($customHeader) {
            /*
                          When our header is a child of the view content,
                          we define it as a custom header (e.g. portfolio header)
                          */
            this.bdViewService.customHeaderHeight = $customHeader.getBoundingClientRect().height;
        }
        else {
            var $header = this.element.nativeElement.querySelector(this.CLASSES.wrapper + " " + this.CLASSES.header);
            if ($header) {
                this.element.nativeElement.classList.add(this.CLASSES.hasHeader);
            }
        }
        if ($sidebar) {
            this.hasSidebar = true;
            this.element.nativeElement.classList.add(this.CLASSES.hasSidebar);
            if (!this.showSidebar) {
                this.element.nativeElement.classList.add(this.CLASSES.sidebarClosed);
            }
        }
    };
    BdViewComponent.prototype.ngOnChanges = function (changes) {
        if (changes.showSidebar && this.hasSidebar) {
            if (changes.showSidebar.currentValue) {
                this.element.nativeElement.classList.remove(this.CLASSES.sidebarClosed);
            }
            else {
                this.element.nativeElement.classList.add(this.CLASSES.sidebarClosed);
            }
        }
    };
    BdViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-view2',
                    template: "<div class=\"ng2-c-view__statusbar\" #bdViewStatusbar></div><div class=\"ng2-c-view__wrapper\">    <ng-content></ng-content></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'ng2-c-view' }
                },] },
    ];
    /** @nocollapse */
    BdViewComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdViewService, },
    ]; };
    BdViewComponent.propDecorators = {
        "bdViewStatusbar": [{ type: ViewChild, args: ['bdViewStatusbar',] },],
        "showSidebar": [{ type: Input },],
    };
    return BdViewComponent;
}());

var components = [
    BdViewComponent
];
var BdViewModule = /** @class */ (function () {
    function BdViewModule() {
    }
    BdViewModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        BdViewService
                    ],
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdViewModule.ctorParameters = function () { return []; };
    return BdViewModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdViewComponent as ɵa, BdViewModule, BdViewService };
//# sourceMappingURL=index.js.map
