import { Component, EventEmitter, Injectable, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { Subject as Subject$2 } from 'rxjs/Subject';

var BdMenuService = /** @class */ (function () {
    function BdMenuService() {
        this.itemClickedSubject = new Subject();
        // ReplaySubject with bufferCount=1 so that all menu-items receive the intial active item
        this.activeItemSubject = new ReplaySubject(1);
    }
    Object.defineProperty(BdMenuService.prototype, "onItemClicked", {
        get: function () {
            return this.itemClickedSubject;
        },
        enumerable: true,
        configurable: true
    });
    BdMenuService.prototype.emitItemClicked = function (item) {
        this.itemClickedSubject.next(item);
    };
    Object.defineProperty(BdMenuService.prototype, "onActiveItemChanged", {
        get: function () {
            return this.activeItemSubject;
        },
        enumerable: true,
        configurable: true
    });
    BdMenuService.prototype.emitActiveItemChanged = function (item) {
        this.activeItemSubject.next(item);
    };
    BdMenuService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdMenuService.ctorParameters = function () { return []; };
    return BdMenuService;
}());

var BdMenuComponent = /** @class */ (function () {
    function BdMenuComponent(bdMenuService) {
        this.bdMenuService = bdMenuService;
        this.destroyed$ = new Subject$2();
        this.itemClicked = new EventEmitter();
    }
    BdMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        // emit initial item
        if (this.activeItem)
            this.bdMenuService.emitActiveItemChanged(this.activeItem);
        this.bdMenuService
            .onItemClicked
            .takeUntil(this.destroyed$)
            .subscribe(function (item) {
            // always notify parent even when item hasn't changed
            // trying to activate an already active item might trigger another action (e.g. opening/closing sidebar)
            // always notify parent even when item hasn't changed
            // trying to activate an already active item might trigger another action (e.g. opening/closing sidebar)
            _this.itemClicked.emit(item);
        });
    };
    BdMenuComponent.prototype.ngOnChanges = function (changes) {
        if (changes.activeItem) {
            // notify children
            this.bdMenuService.emitActiveItemChanged(changes.activeItem.currentValue);
        }
    };
    BdMenuComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next();
        this.destroyed$.complete();
    };
    BdMenuComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-menu2',
                    template: "<nav class=\"ng2-c-menu\">    <ul class=\"ng2-c-menu__list\">        <ng-content select=\"bd-menu-item2\"></ng-content>    </ul></nav>",
                    providers: [BdMenuService]
                },] },
    ];
    /** @nocollapse */
    BdMenuComponent.ctorParameters = function () { return [
        { type: BdMenuService, },
    ]; };
    BdMenuComponent.propDecorators = {
        "activeItem": [{ type: Input },],
        "itemClicked": [{ type: Output },],
    };
    return BdMenuComponent;
}());

var BdMenuItemComponent = /** @class */ (function () {
    function BdMenuItemComponent(bdMenuService) {
        this.bdMenuService = bdMenuService;
        this.destroyed$ = new Subject$2();
        this.active = false;
    }
    BdMenuItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bdMenuService
            .onActiveItemChanged
            .takeUntil(this.destroyed$)
            .subscribe(function (itemId) {
            _this.active = _this.id === itemId;
        });
    };
    BdMenuItemComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next();
        this.destroyed$.complete();
    };
    BdMenuItemComponent.prototype.itemClicked = function () {
        this.bdMenuService.emitItemClicked(this.id);
    };
    BdMenuItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-menu-item2',
                    template: "<li class=\"ng2-c-menu__item\" [ngClass]=\"{'ng2-c-menu__item--is-active': active}\">    <div class=\"ng2-c-menu__link\" [ngClass]=\"{'ng2-c-menu__link--with-icon': icon}\" (click)=\"itemClicked()\">        <i class=\"icon-{{icon}}\" *ngIf=\"icon\"></i>        <span>            <ng-content></ng-content>        </span>    </div></li>"
                },] },
    ];
    /** @nocollapse */
    BdMenuItemComponent.ctorParameters = function () { return [
        { type: BdMenuService, },
    ]; };
    BdMenuItemComponent.propDecorators = {
        "icon": [{ type: Input },],
        "id": [{ type: Input },],
    };
    return BdMenuItemComponent;
}());

var components = [
    BdMenuComponent,
    BdMenuItemComponent
];
var BdMenuModule = /** @class */ (function () {
    function BdMenuModule() {
    }
    BdMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdMenuModule.ctorParameters = function () { return []; };
    return BdMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdMenuService as ɵa, BdMenuModule, BdMenuComponent, BdMenuItemComponent };
//# sourceMappingURL=index.js.map
