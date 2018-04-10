import { BdEventService, BdRepaintService, Deferred } from '@delen/bd-utilities';
import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { BdBackdropOptions, BdBackdropService } from '@delen/bd-backdrop';
import { BdOverlayPlaceholderManager } from '@delen/bd-overlay-placeholder';

var BdDialogBasicOptions = /** @class */ (function () {
    function BdDialogBasicOptions() {
        this.blur = false;
        this.modal = false;
        this.small = false;
        this.noAnimation = false;
        this.disableBackground = false;
        this.fullscreen = false;
    }
    return BdDialogBasicOptions;
}());

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var DialogDataAndOptions = /** @class */ (function () {
    function DialogDataAndOptions(dataAndOptions) {
        this.options = new BdDialogBasicOptions();
        if (dataAndOptions) {
            this.data = dataAndOptions.data;
            if (dataAndOptions.options) {
                this.options = __assign({}, this.options, dataAndOptions.options);
            }
        }
    }
    return DialogDataAndOptions;
}());

var BdDialog = /** @class */ (function () {
    function BdDialog(type, dataAndOptionsPartial) {
        this.type = type;
        this.closeDeferred = new Deferred();
        this.dataAndOptions = new DialogDataAndOptions(dataAndOptionsPartial);
    }
    Object.defineProperty(BdDialog.prototype, "options", {
        get: function () {
            return this.dataAndOptions.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdDialog.prototype, "data", {
        get: function () {
            return this.dataAndOptions.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdDialog.prototype, "closePromise", {
        get: function () {
            return this.closeDeferred.promise;
        },
        enumerable: true,
        configurable: true
    });
    BdDialog.prototype.close = function (data) {
        this.closeDeferred.resolve(data);
    };
    return BdDialog;
}());

// dialog css classes
// dialog css classes
var DialogClasses;
// dialog css classes
(function (DialogClasses) {
    DialogClasses["DIALOG_CLASS"] = "ng2-c-dialog";
    DialogClasses["DEFAULT_CLASS"] = "ng2-c-dialog--default";
    DialogClasses["SMALL_CLASS"] = "ng2-c-dialog--small";
    DialogClasses["NO_ANIMATION_CLASS"] = "ng2-c-dialog--no-animation";
    DialogClasses["ANIMATION_INIT_CLASS"] = "ng2-c-dialog--animation-init";
    DialogClasses["FULLSCREEN_CLASS"] = "ng2-c-dialog--fullscreen";
})(DialogClasses || (DialogClasses = {}));

var DialogRepaintService = /** @class */ (function () {
    function DialogRepaintService(bdEventService, bdRepaintService) {
        this.bdEventService = bdEventService;
        this.bdRepaintService = bdRepaintService;
        this.maxRepaints = 5;
        this.dialogElements = [];
        this.numberOfRepaints = 0;
    }
    DialogRepaintService.prototype.addDialogElement = function (element) {
        var _this = this;
        this.dialogElements.push({ element: element, top: null });
        if (!this.resizeSubscription) {
            this.resizeSubscription = this.bdEventService.onWindowResizeOutsideZone.subscribe(function () { return _this.correctDialogs(); });
        }
    };
    DialogRepaintService.prototype.removeDialogElement = function (element) {
        var index = this.dialogElements.findIndex(function (item) { return item.element === element; });
        if (index !== -1) {
            this.dialogElements.splice(index, 1);
        }
        if (this.dialogElements.length === 0 && this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
            this.resizeSubscription = null;
        }
    };
    DialogRepaintService.prototype.correctDialogs = function () {
        var _this = this;
        if (this.numberOfRepaints === this.maxRepaints) {
            throw new Error('tried to repaint a dialog more than 5 times');
        }
        var allElementsCorrectlyDrawn = true;
        // NOTE: This code is written for iOS 11.
        // Explanation of the issue:
        // =========================
        // url: https://bugs.webkit.org/show_bug.cgi?id=176053
        // Element.getBoundingClientRect() returns wrong values.
        // To fix this we wait an undefined number of frames to check if the
        // top value stabilizes. Only then we start the actual positioning.
        for (var _i = 0, _a = this.dialogElements; _i < _a.length; _i++) {
            var item = _a[_i];
            item.element.classList.remove(DialogClasses.ANIMATION_INIT_CLASS);
            item.element.classList.add(DialogClasses.NO_ANIMATION_CLASS);
            var newTopValue = item.element.getBoundingClientRect().top;
            if (newTopValue !== item.top) {
                item.top = newTopValue;
                allElementsCorrectlyDrawn = false;
            }
        }
        // If the top value is changed since the last frame,
        // wait a frame and do it again.
        if (!allElementsCorrectlyDrawn) {
            window.requestAnimationFrame(function () {
                _this.numberOfRepaints++;
                _this.correctDialogs();
            });
        }
        else {
            this.numberOfRepaints = 0;
            this.dialogElements.forEach(function (item) {
                item.top = null;
            });
            this.bdRepaintService.repaint(document.body);
        }
    };
    DialogRepaintService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DialogRepaintService.ctorParameters = function () { return [
        { type: BdEventService, },
        { type: BdRepaintService, },
    ]; };
    return DialogRepaintService;
}());

var BdDialogService = /** @class */ (function () {
    function BdDialogService(bdBackdropService, overlayPlaceholderManager, dialogRepaintService) {
        this.bdBackdropService = bdBackdropService;
        this.overlayPlaceholderManager = overlayPlaceholderManager;
        this.dialogRepaintService = dialogRepaintService;
    }
    BdDialogService.prototype.open = function (bdDialog) {
        var _this = this;
        bdDialog.backDrop = this.setBackdrop(bdDialog);
        // create the dialog with componentFactoryResolver and ReflectiveInjector
        bdDialog.componentRef = this.overlayPlaceholderManager
            .addComponent(bdDialog.type, bdDialog.data ? [bdDialog, bdDialog.data] : [bdDialog]);
        bdDialog.closePromise.then(function (data) {
            _this.close(bdDialog);
        });
        var dialogElement = bdDialog.componentRef.location.nativeElement;
        this.dialogRepaintService.addDialogElement(dialogElement);
        // add classes depending on the options
        this.addClasses(dialogElement, bdDialog.options);
        if (!bdDialog.options.noAnimation) {
            window.requestAnimationFrame(function () {
                dialogElement.classList.add(DialogClasses.ANIMATION_INIT_CLASS);
            });
        }
    };
    BdDialogService.prototype.close = function (dialog) {
        this.dialogRepaintService.removeDialogElement(dialog.componentRef.location.nativeElement);
        this.overlayPlaceholderManager.removeComponent(dialog.componentRef);
        dialog.componentRef.destroy();
        this.bdBackdropService.remove(dialog.backDrop);
    };
    BdDialogService.prototype.setBackdrop = function (dialog) {
        var bdBackdropOptions = new BdBackdropOptions();
        bdBackdropOptions.blur = !!dialog.options.blur;
        bdBackdropOptions.disableBackground = !!dialog.options.disableBackground;
        var ref = this.bdBackdropService.add(bdBackdropOptions);
        // modal dialogs do not have a close function placed on the backdrop
        if (!dialog.options.modal) {
            ref.instance.whenClicked.subscribe(function () { return dialog.close(); });
        }
        return ref;
    };
    BdDialogService.prototype.addClasses = function (dialogElement, options) {
        if (options.small && options.fullscreen) {
            throw new Error('dialog can not be small and fullscreen at the same time');
        }
        dialogElement.classList.add(DialogClasses.DIALOG_CLASS);
        if (options.noAnimation) {
            dialogElement.classList.add(DialogClasses.NO_ANIMATION_CLASS);
        }
        if (options.small) {
            dialogElement.classList.add(DialogClasses.SMALL_CLASS);
        }
        else if (options.fullscreen) {
            dialogElement.classList.add(DialogClasses.FULLSCREEN_CLASS);
        }
        else {
            dialogElement.classList.add(DialogClasses.DEFAULT_CLASS);
        }
    };
    BdDialogService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdDialogService.ctorParameters = function () { return [
        { type: BdBackdropService, },
        { type: BdOverlayPlaceholderManager, },
        { type: DialogRepaintService, },
    ]; };
    return BdDialogService;
}());

var BdDialogModule = /** @class */ (function () {
    function BdDialogModule() {
    }
    BdDialogModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    providers: [BdDialogService, DialogRepaintService]
                },] },
    ];
    /** @nocollapse */
    BdDialogModule.ctorParameters = function () { return []; };
    return BdDialogModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { DialogRepaintService as ɵa, BdDialog, BdDialogModule, BdDialogService, BdDialogBasicOptions, DialogDataAndOptions };
//# sourceMappingURL=index.js.map
