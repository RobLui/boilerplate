import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, NgModule, Output } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BdCheckboxModule } from '@delen/bd-checkbox';

var BdSelectionListService = /** @class */ (function () {
    function BdSelectionListService() {
        this.viewToModel = new Subject();
        this.select = new ReplaySubject(1);
        this.multiselect = new ReplaySubject(1);
        this.loading = new BehaviorSubject(false);
        this.lastToggle = new ReplaySubject(1);
    }
    BdSelectionListService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdSelectionListService.ctorParameters = function () { return []; };
    return BdSelectionListService;
}());

var BdMultiSelectionListComponent = /** @class */ (function () {
    function BdMultiSelectionListComponent(service) {
        this.service = service;
        this.ngUnsubscribe = new Subject();
        this.loading = false;
        this.selected = [];
        this.selectedChange = new EventEmitter();
    }
    BdMultiSelectionListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.viewToModel
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (args) { return _this.fromViewToModel(args.key, args.checked); });
    };
    BdMultiSelectionListComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdMultiSelectionListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.loading) {
            this.service.loading.next(changes.loading.currentValue);
        }
        if (changes.selected) {
            var keys = changes.selected.currentValue;
            this.service.multiselect.next(keys.map(function (key) { return ({ key: key, checked: true }); }));
        }
    };
    BdMultiSelectionListComponent.prototype.fromViewToModel = function (key, checked) {
        if (!this.loading) {
            var index_1 = this.selected.indexOf(key);
            if (checked) {
                if (index_1 === -1) {
                    this.selected = this.selected.concat([key]);
                    this.selectedChange.emit(this.selected);
                }
            }
            else {
                if (index_1 !== -1) {
                    this.selected = this.selected.filter(function (_, offset) { return offset !== index_1; });
                    this.selectedChange.emit(this.selected);
                }
            }
        }
    };
    BdMultiSelectionListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-multi-selection-list2',
                    template: "<ng-content select=\"bd-selection-list-item2\"></ng-content>",
                    host: {
                        class: 'ng2-c-selection-list'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        BdSelectionListService
                    ]
                },] },
    ];
    /** @nocollapse */
    BdMultiSelectionListComponent.ctorParameters = function () { return [
        { type: BdSelectionListService, },
    ]; };
    BdMultiSelectionListComponent.propDecorators = {
        "loading": [{ type: Input },],
        "selected": [{ type: Input },],
        "selectedChange": [{ type: Output },],
    };
    return BdMultiSelectionListComponent;
}());

var BdSelectionListComponent = /** @class */ (function () {
    function BdSelectionListComponent(service) {
        this.service = service;
        this.ngUnsubscribe = new Subject();
        this.loading = false;
        this.nullable = false;
        this.selected = null;
        this.selectedChange = new EventEmitter();
    }
    BdSelectionListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.viewToModel
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (args) { return _this.fromViewToModel(args.key, args.checked); });
    };
    BdSelectionListComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdSelectionListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.loading) {
            this.service.loading.next(changes.loading.currentValue);
        }
        if (changes.selected) {
            var key = changes.selected.currentValue;
            this.service.select.next({ key: key, checked: true });
        }
    };
    BdSelectionListComponent.prototype.fromViewToModel = function (key, checked) {
        if (!this.loading) {
            if (checked) {
                if (key !== this.selected) {
                    this.selected = key;
                    this.selectedChange.emit(key);
                }
            }
            else {
                if (this.nullable) {
                    if (this.selected !== null) {
                        this.selected = null;
                        this.selectedChange.emit(null);
                    }
                }
                else {
                    this.service.select.next({ key: key, checked: true });
                }
            }
        }
    };
    BdSelectionListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-selection-list2',
                    template: "<ng-content select=\"bd-selection-list-item2\"></ng-content>",
                    host: {
                        class: 'ng2-c-selection-list'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        BdSelectionListService
                    ]
                },] },
    ];
    /** @nocollapse */
    BdSelectionListComponent.ctorParameters = function () { return [
        { type: BdSelectionListService, },
    ]; };
    BdSelectionListComponent.propDecorators = {
        "loading": [{ type: Input },],
        "nullable": [{ type: Input },],
        "selected": [{ type: Input },],
        "selectedChange": [{ type: Output },],
    };
    return BdSelectionListComponent;
}());

var BdSelectionListItemComponent = /** @class */ (function () {
    function BdSelectionListItemComponent(cdr, service) {
        this.cdr = cdr;
        this.service = service;
        this.ngUnsubscribe = new Subject();
        this.loading = false;
        this.checked = false;
        this.isLastToggle = false;
    }
    BdSelectionListItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.loading
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (loading) {
            _this.loading = loading;
            _this.cdr.markForCheck();
        });
        this.service.select
            .takeUntil(this.ngUnsubscribe)
            .map(function (state) { return _this.key === state.key ? state.checked : false; })
            .subscribe(function (checked) {
            _this.checked = checked;
            _this.cdr.markForCheck();
        });
        this.service.multiselect
            .takeUntil(this.ngUnsubscribe)
            .map(function (states) { return states.find(function (state) { return state.key === _this.key; }); })
            .map(function (state) { return state ? state.checked : false; })
            .subscribe(function (checked) {
            _this.checked = checked;
            _this.cdr.markForCheck();
        });
        this.service.lastToggle
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (toggle) {
            _this.isLastToggle = _this.key === toggle;
            _this.cdr.markForCheck();
        });
    };
    BdSelectionListItemComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdSelectionListItemComponent.prototype.toggle = function (checked) {
        if (!this.loading) {
            this.service.lastToggle.next(this.key);
            this.service.viewToModel.next({ key: this.key, checked: checked });
        }
    };
    BdSelectionListItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-selection-list-item2',
                    template: "<label class=\"ng2-c-selection-list__label ng2-c-checkbox__label\">    <span class=\"ng2-c-selection-list__label-text ng2-c-checkbox__label-text\">        <ng-container *ngIf=\"!!label\">{{label}}</ng-container>        <ng-content *ngIf=\"!label\"></ng-content>    </span>    <span class=\"ng2-c-selection-list__toggle\" [ngSwitch]=\"loading && isLastToggle\">        <div class=\"ng2-c-loader ng2-c-loader--small ng2-c-loader--green\" *ngSwitchCase=\"true\"></div>        <bd-checkbox2 *ngSwitchDefault [name]=\"name\" [autocheck]=\"false\" [ngModel]=\"checked\" (beforeChange)=\"toggle($event)\"></bd-checkbox2>    </span></label>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'ng2-c-selection-list__item'
                    }
                },] },
    ];
    /** @nocollapse */
    BdSelectionListItemComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: BdSelectionListService, },
    ]; };
    BdSelectionListItemComponent.propDecorators = {
        "key": [{ type: Input },],
        "label": [{ type: Input },],
        "name": [{ type: Input },],
    };
    return BdSelectionListItemComponent;
}());

var BdSelectionListModule = /** @class */ (function () {
    function BdSelectionListModule() {
    }
    BdSelectionListModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        BdCheckboxModule
                    ],
                    declarations: [
                        BdSelectionListComponent,
                        BdMultiSelectionListComponent,
                        BdSelectionListItemComponent
                    ],
                    exports: [
                        BdSelectionListComponent,
                        BdMultiSelectionListComponent,
                        BdSelectionListItemComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    BdSelectionListModule.ctorParameters = function () { return []; };
    return BdSelectionListModule;
}());

var BdSelectionState = /** @class */ (function () {
    function BdSelectionState() {
    }
    return BdSelectionState;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdSelectionListService as ɵa, BdMultiSelectionListComponent, BdSelectionListComponent, BdSelectionListItemComponent, BdSelectionListModule, BdSelectionState };
//# sourceMappingURL=index.js.map
