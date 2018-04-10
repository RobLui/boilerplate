import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, HostListener, Input, NgModule, Output, ViewChild } from '@angular/core';
import { BdPopupModule } from '@delen/bd-popup';
import { BdSelectionListModule } from '@delen/bd-selection-list';

var BdSelectOptionComponent = /** @class */ (function () {
    function BdSelectOptionComponent() {
    }
    BdSelectOptionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-select-option2',
                    template: '',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdSelectOptionComponent.ctorParameters = function () { return []; };
    BdSelectOptionComponent.propDecorators = {
        "id": [{ type: Input },],
        "label": [{ type: Input },],
    };
    return BdSelectOptionComponent;
}());

var BdSelectComponent = /** @class */ (function () {
    function BdSelectComponent(element) {
        this.element = element;
        this.selectionChange = new EventEmitter();
        this.selection = '';
    }
    BdSelectComponent.prototype.ngAfterViewInit = function () {
        this.popup.target = this.element.nativeElement;
    };
    BdSelectComponent.prototype.onClick = function () {
        this.popup.open();
    };
    BdSelectComponent.prototype.onOptionSelected = function (newSelectionId) {
        this.selectionChange.emit(newSelectionId);
        this.popup.close();
    };
    Object.defineProperty(BdSelectComponent.prototype, "options", {
        get: function () {
            if (!this.bdSelectOptions)
                return [];
            return this.bdSelectOptions.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdSelectComponent.prototype, "selectedOptionLabel", {
        get: function () {
            var _this = this;
            var option = this.options.find(function (o) { return o.id === _this.selection; });
            return option ? option.label : '';
        },
        enumerable: true,
        configurable: true
    });
    BdSelectComponent.prototype.trackByFn = function (index, item) {
        return item.id;
    };
    BdSelectComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-select2',
                    template: "<span>{{ selectedOptionLabel }}</span><i class=\"icon-arrow-down ng2-c-select__icon\"></i><ng-content></ng-content><bd-popup2 #popup direction=\"bottom\">    <bd-selection-list2 [selected]=\"selection\" (selectedChange)=\"onOptionSelected($event)\">        <bd-selection-list-item2 *ngFor=\"let option of options; trackBy: trackByFn\" [key]=\"option.id\" [label]=\"option.label\"></bd-selection-list-item2>    </bd-selection-list2></bd-popup2>",
                    host: { 'class': 'ng2-c-select' }
                },] },
    ];
    /** @nocollapse */
    BdSelectComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdSelectComponent.propDecorators = {
        "selectionChange": [{ type: Output },],
        "selection": [{ type: Input },],
        "bdSelectOptions": [{ type: ContentChildren, args: [BdSelectOptionComponent,] },],
        "popup": [{ type: ViewChild, args: ['popup',] },],
        "onClick": [{ type: HostListener, args: ['click',] },],
    };
    return BdSelectComponent;
}());

var BdSelectModule = /** @class */ (function () {
    function BdSelectModule() {
    }
    BdSelectModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdPopupModule,
                        BdSelectionListModule
                    ],
                    declarations: [
                        BdSelectComponent,
                        BdSelectOptionComponent
                    ],
                    exports: [
                        BdSelectComponent,
                        BdSelectOptionComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    BdSelectModule.ctorParameters = function () { return []; };
    return BdSelectModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdSelectOptionComponent as ɵb, BdSelectComponent as ɵa, BdSelectModule };
//# sourceMappingURL=index.js.map
