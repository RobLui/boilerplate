import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var BdAvatarComponent = /** @class */ (function () {
    function BdAvatarComponent() {
        this.loaded = false;
    }
    BdAvatarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-avatar2',
                    template: "<span class=\"ng2-c-avatar__container\">    <img class=\"ng2-c-avatar__image\" (load)=\"loaded=true\" [class.ng2-c-avatar__image--loaded]=\"loaded\" [src]=\"image\" *ngIf=\"image\" /></span>",
                    host: { 'class': 'ng2-c-avatar' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdAvatarComponent.ctorParameters = function () { return []; };
    BdAvatarComponent.propDecorators = {
        "image": [{ type: Input },],
    };
    return BdAvatarComponent;
}());

var components = [
    BdAvatarComponent
];
var BdAvatarModule = /** @class */ (function () {
    function BdAvatarModule() {
    }
    BdAvatarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdAvatarModule.ctorParameters = function () { return []; };
    return BdAvatarModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdAvatarComponent, BdAvatarModule };
//# sourceMappingURL=index.js.map
