import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, HostBinding, HostListener, Injectable, Input, NgModule, NgZone, Output } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { ReplaySubject as ReplaySubject$1 } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/takeUntil';
import { BdDeviceService, BdEventService } from '@delen/bd-utilities';
import { BdSelectModule } from '@delen/bd-select';

var BdButtonGroupService = /** @class */ (function () {
    function BdButtonGroupService() {
        this.viewToModelSubject = new Subject$1();
        this.activeSelectionSubject = new ReplaySubject$1(1);
    }
    BdButtonGroupService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdButtonGroupService.ctorParameters = function () { return []; };
    return BdButtonGroupService;
}());

var BdButtonGroupItemComponent = /** @class */ (function () {
    function BdButtonGroupItemComponent(bdButtonGroupService) {
        this.bdButtonGroupService = bdButtonGroupService;
        this.ngUnsubscribe = new Subject$1();
        this.isActive = false;
    }
    BdButtonGroupItemComponent.prototype.clickedOnComponent = function () {
        this.bdButtonGroupService.activeSelectionSubject.next(this.id);
        this.bdButtonGroupService.viewToModelSubject.next(this.id);
    };
    BdButtonGroupItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bdButtonGroupService.activeSelectionSubject.takeUntil(this.ngUnsubscribe).subscribe(function (activeSelection) {
            _this.isActive = activeSelection === _this.id;
        });
    };
    BdButtonGroupItemComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdButtonGroupItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-button-group-item2',
                    template: "<span class=\"ng2-c-button-group-item__content\">    {{label}}</span>",
                    host: { 'class': 'ng2-c-button-group-item' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdButtonGroupItemComponent.ctorParameters = function () { return [
        { type: BdButtonGroupService, },
    ]; };
    BdButtonGroupItemComponent.propDecorators = {
        "isActive": [{ type: HostBinding, args: ['class.ng2-c-button-group-item--active',] },],
        "id": [{ type: Input },],
        "label": [{ type: Input },],
        "clickedOnComponent": [{ type: HostListener, args: ['click',] },],
    };
    return BdButtonGroupItemComponent;
}());

var BdButtonGroupComponent = /** @class */ (function () {
    function BdButtonGroupComponent(bdButtonGroupService, bdDeviceService, bdEventService, ngZone, cdr) {
        this.bdButtonGroupService = bdButtonGroupService;
        this.bdDeviceService = bdDeviceService;
        this.bdEventService = bdEventService;
        this.ngZone = ngZone;
        this.cdr = cdr;
        this.ngUnsubscribe = new Subject$1();
        this.isTablet = false;
        this.selection = '';
        this.selectionChange = new EventEmitter();
    }
    Object.defineProperty(BdButtonGroupComponent.prototype, "selections", {
        get: function () {
            if (!this.bdButtonGroupItems)
                return [];
            return this.bdButtonGroupItems.toArray();
        },
        enumerable: true,
        configurable: true
    });
    BdButtonGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isTablet = this.bdDeviceService.isTablet();
        this.bdButtonGroupService.viewToModelSubject.subscribe(function (selection) {
            _this.selectionOnChange(selection);
        });
        this.bdEventService.onWindowResizeOutsideZone.takeUntil(this.ngUnsubscribe).subscribe(function () {
            var checkIfTabletResult = _this.bdDeviceService.isTablet();
            if (checkIfTabletResult !== _this.isTablet) {
                _this.ngZone.run(function () {
                    _this.isTablet = checkIfTabletResult;
                    _this.cdr.markForCheck();
                });
            }
        });
    };
    BdButtonGroupComponent.prototype.ngOnChanges = function (changes) {
        if (changes.selection) {
            this.bdButtonGroupService.activeSelectionSubject.next(changes.selection.currentValue);
        }
    };
    BdButtonGroupComponent.prototype.ngOnDestroy = function () {
        this.bdButtonGroupService.viewToModelSubject.complete();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdButtonGroupComponent.prototype.trackByFn = function (index, item) {
        return item.id;
    };
    BdButtonGroupComponent.prototype.selectionOnChange = function (selectionId) {
        this.selection = selectionId;
        this.selectionChange.emit(selectionId);
    };
    BdButtonGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-button-group2',
                    template: "<ng-container [ngSwitch]=\"isTablet\">    <ng-container *ngSwitchCase=\"true\">        <div class=\"ng2-c-button-group__list\">            <ng-content select=\"bd-button-group-item2\"></ng-content>        </div>    </ng-container>    <ng-container *ngSwitchCase=\"false\">        <bd-select2 [selection]=\"selection\" (selectionChange)=\"selectionOnChange($event)\">            <bd-select-option2 *ngFor=\"let item of selections; trackBy: trackByFn\" [id]=\"item.id\"                               [label]=\"item.label\"></bd-select-option2>        </bd-select2>    </ng-container></ng-container>",
                    host: { 'class': 'ng2-c-button-group' },
                    providers: [BdButtonGroupService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdButtonGroupComponent.ctorParameters = function () { return [
        { type: BdButtonGroupService, },
        { type: BdDeviceService, },
        { type: BdEventService, },
        { type: NgZone, },
        { type: ChangeDetectorRef, },
    ]; };
    BdButtonGroupComponent.propDecorators = {
        "selection": [{ type: Input },],
        "selectionChange": [{ type: Output },],
        "bdButtonGroupItems": [{ type: ContentChildren, args: [BdButtonGroupItemComponent,] },],
    };
    return BdButtonGroupComponent;
}());

var components = [
    BdButtonGroupComponent,
    BdButtonGroupItemComponent
];
var BdButtonGroupModule = /** @class */ (function () {
    function BdButtonGroupModule() {
    }
    BdButtonGroupModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, BdSelectModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdButtonGroupModule.ctorParameters = function () { return []; };
    return BdButtonGroupModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdButtonGroupItemComponent as ɵc, BdButtonGroupComponent as ɵa, BdButtonGroupService as ɵb, BdButtonGroupModule };
//# sourceMappingURL=index.js.map
