import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

var BdFormTextareaComponent = /** @class */ (function () {
    function BdFormTextareaComponent() {
        this.itemLineHeight = 20;
        this.initialized = false;
        this.nrOfLines = 1;
        this.autoGrow = false;
        this.rows = 1;
        this.showCounter = 0;
        this.valueChange = new EventEmitter();
    }
    Object.defineProperty(BdFormTextareaComponent.prototype, "value", {
        get: function () {
            return this.internalValue;
        },
        set: function (val) {
            this.internalValue = val;
            this.valueChange.emit(this.internalValue);
        },
        enumerable: true,
        configurable: true
    });
    BdFormTextareaComponent.prototype.ngOnInit = function () {
        this.initialized = true;
        this.setRows(this.rows);
        this.updateCounter();
    };
    BdFormTextareaComponent.prototype.ngAfterViewInit = function () {
        this.placeholderElement.nativeElement.style.maxHeight = this.maxRows * this.itemLineHeight;
        if (this.maxLength)
            this.textareaElement.nativeElement.setAttribute('maxlength', this.maxLength);
    };
    BdFormTextareaComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.updateCounter();
        window.requestAnimationFrame(function () {
            if (_this.initialized)
                _this.checkRows();
        });
    };
    BdFormTextareaComponent.prototype.showCounterFn = function () {
        return this.showCounter <= this.valueLength;
    };
    BdFormTextareaComponent.prototype.updateCounter = function () {
        if (this.maxLength) {
            // a newline should be 2 characters instead of 1
            var safeLength = this.value.replace(/\n/g, '\r\n').length || 0;
            this.counter = Math.max(this.maxLength - safeLength, 0);
            this.valueLength = this.maxLength - this.counter;
        }
    };
    BdFormTextareaComponent.prototype.checkRows = function (enter) {
        if (enter === void 0) { enter = false; }
        if (!this.autoGrow)
            return;
        var el = this.placeholderElement.nativeElement;
        var lines = Math.round(el.clientHeight / this.itemLineHeight);
        var lastNewlineOccurence = this.value.lastIndexOf('\n') + 1;
        if (this.value.length === lastNewlineOccurence && this.value.length) {
            lines++;
        }
        lines = Math.max(lines, this.rows);
        if (this.maxRows) {
            lines = Math.min(lines, this.maxRows);
        }
        // save current number of lines
        this.nrOfLines = lines;
        // set the attribute
        this.setRows(this.nrOfLines);
    };
    BdFormTextareaComponent.prototype.setRows = function (rows) {
        this.textareaElement.nativeElement.setAttribute('rows', rows);
    };
    BdFormTextareaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-form-textarea2',
                    template: "<label class=\"ng2-c-form-item\">    <span class=\"ng2-c-form-item__label\" *ngIf=\"label\">{{label}}</span>    <span class=\"ng2-c-form-item__counter\" *ngIf=\"showCounterFn()\">{{counter}}</span>    <textarea  #bdFormTextarea class=\"ng2-c-form-item__input\" placeholder=\"{{placeholder}}\" resize=\"false\" [(ngModel)]=\"value\"></textarea>    <pre class=\"ng2-c-form-item__textarea-placeholder\" #bdFormTextareaPlaceholder>{{internalValue}}</pre></label>",
                    host: { class: 'ng2-c-form__textarea' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdFormTextareaComponent.ctorParameters = function () { return []; };
    BdFormTextareaComponent.propDecorators = {
        "label": [{ type: Input },],
        "placeholder": [{ type: Input },],
        "autoGrow": [{ type: Input },],
        "rows": [{ type: Input },],
        "maxRows": [{ type: Input },],
        "showCounter": [{ type: Input },],
        "maxLength": [{ type: Input },],
        "placeholderElement": [{ type: ViewChild, args: ['bdFormTextareaPlaceholder',] },],
        "textareaElement": [{ type: ViewChild, args: ['bdFormTextarea',] },],
        "value": [{ type: Input },],
        "valueChange": [{ type: Output },],
    };
    return BdFormTextareaComponent;
}());

var BdFormInputComponent = /** @class */ (function () {
    function BdFormInputComponent() {
        this.showCounter = 0;
        this.valueChange = new EventEmitter();
    }
    Object.defineProperty(BdFormInputComponent.prototype, "value", {
        get: function () {
            return this.internalValue;
        },
        set: function (val) {
            this.internalValue = val;
            this.valueChange.emit(this.internalValue);
        },
        enumerable: true,
        configurable: true
    });
    BdFormInputComponent.prototype.ngOnInit = function () {
        this.updateCounter();
    };
    BdFormInputComponent.prototype.ngAfterViewInit = function () {
        if (this.maxLength)
            this.inputElement.nativeElement.setAttribute('maxlength', this.maxLength);
    };
    BdFormInputComponent.prototype.ngOnChanges = function () {
        this.updateCounter();
    };
    BdFormInputComponent.prototype.showCounterFn = function () {
        return this.showCounter <= this.value.length;
    };
    BdFormInputComponent.prototype.updateCounter = function () {
        if (this.maxLength) {
            this.counter = Math.max(this.maxLength - this.value.length, 0);
        }
    };
    BdFormInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-form-input2',
                    template: "<label class=\"ng2-c-form-item\">    <span class=\"ng2-c-form-item__label\" *ngIf=\"label\">{{label}}</span>    <span class=\"ng2-c-form-item__counter\" *ngIf=\"showCounterFn()\">{{counter}}</span>    <input type=\"text\" #bdFormInput class=\"ng2-c-form-item__input\" placeholder=\"{{placeholder}}\" [(ngModel)]=\"value\" /></label>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdFormInputComponent.ctorParameters = function () { return []; };
    BdFormInputComponent.propDecorators = {
        "label": [{ type: Input },],
        "placeholder": [{ type: Input },],
        "showCounter": [{ type: Input },],
        "maxLength": [{ type: Input },],
        "inputElement": [{ type: ViewChild, args: ['bdFormInput',] },],
        "value": [{ type: Input },],
        "valueChange": [{ type: Output },],
    };
    return BdFormInputComponent;
}());

var components = [
    BdFormTextareaComponent,
    BdFormInputComponent
];
var BdFormModule = /** @class */ (function () {
    function BdFormModule() {
    }
    BdFormModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdFormModule.ctorParameters = function () { return []; };
    return BdFormModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdFormModule, BdFormTextareaComponent, BdFormInputComponent };
//# sourceMappingURL=index.js.map
