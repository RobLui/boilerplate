import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgModule, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

// glue for ControlValueAccessor
function noop() {
    return;
}
// glue for ControlValueAccessor
var BD_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return BdCheckboxComponent; }),
    multi: true
};
var BdCheckboxComponent = /** @class */ (function () {
    function BdCheckboxComponent(cdr) {
        this.cdr = cdr;
        // glue for ControlValueAccessor
        this.notifyControlChanged = noop;
        // glue for ControlValueAccessor
        this.notifyControlTouched = noop;
        this.autocheck = true;
        // EventEmitter(isAsync=true) must be used to support otherwise synchronous state management with [autocheck]="false"
        // repro: https://jsfiddle.net/hjf039nk/
        this.beforeChange = new EventEmitter(true);
        this.change = new EventEmitter();
        this.checked = false;
        this.disabled = false;
    }
    // glue for ControlValueAccessor
    // glue for ControlValueAccessor
    BdCheckboxComponent.prototype.writeValue = 
    // glue for ControlValueAccessor
    function (value) {
        this.input.nativeElement.checked = value;
        this.checked = value;
        this.cdr.detectChanges();
        this.cdr.markForCheck();
    };
    // glue for ControlValueAccessor
    // glue for ControlValueAccessor
    BdCheckboxComponent.prototype.registerOnChange = 
    // glue for ControlValueAccessor
    function (fn) {
        this.notifyControlChanged = fn;
    };
    // glue for ControlValueAccessor
    // glue for ControlValueAccessor
    BdCheckboxComponent.prototype.registerOnTouched = 
    // glue for ControlValueAccessor
    function (fn) {
        this.notifyControlTouched = fn;
    };
    // glue for ControlValueAccessor
    // glue for ControlValueAccessor
    BdCheckboxComponent.prototype.setDisabledState = 
    // glue for ControlValueAccessor
    function (isDisabled) {
        this.input.nativeElement.disabled = isDisabled;
        this.disabled = isDisabled;
        this.cdr.detectChanges();
        this.cdr.markForCheck();
    };
    BdCheckboxComponent.prototype.onClick = function (checked, e) {
        if (!this.autocheck) {
            e.preventDefault();
        }
        this.notifyControlTouched();
        this.beforeChange.emit(checked);
    };
    BdCheckboxComponent.prototype.onChange = function (checked) {
        if (this.autocheck) {
            this.notifyControlChanged(checked);
            this.change.emit(this.checked = checked);
        }
    };
    BdCheckboxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-checkbox2',
                    template: "<span class=\"ng2-c-checkbox__gui\" [class.ng2-c-checkbox__gui--checked]=\"checked\" [class.ng2-c-checkbox__gui--disabled]=\"disabled\">    <input #input type=\"checkbox\" [attr.id]=\"inputId\" [attr.name]=\"name\" class=\"ng2-c-checkbox__input\" (click)=\"onClick($event.target.checked, $event)\" (change)=\"onChange($event.target.checked)\">    <i *ngIf=\"checked\" class=\"ng2-c-checkbox__icon icon-checkmark\"></i></span>",
                    host: { class: 'ng2-c-checkbox' },
                    providers: [
                        BD_CONTROL_VALUE_ACCESSOR
                    ]
                },] },
    ];
    /** @nocollapse */
    BdCheckboxComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    BdCheckboxComponent.propDecorators = {
        "input": [{ type: ViewChild, args: ['input', { read: ElementRef },] },],
        "inputId": [{ type: Input },],
        "name": [{ type: Input },],
        "autocheck": [{ type: Input },],
        "beforeChange": [{ type: Output },],
        "change": [{ type: Output },],
    };
    return BdCheckboxComponent;
}());

var components = [
    BdCheckboxComponent
];
var BdCheckboxModule = /** @class */ (function () {
    function BdCheckboxModule() {
    }
    BdCheckboxModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdCheckboxModule.ctorParameters = function () { return []; };
    return BdCheckboxModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdCheckboxComponent, BdCheckboxModule };
//# sourceMappingURL=index.js.map
