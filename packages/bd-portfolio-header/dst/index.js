import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdNumberModule } from '@delen/bd-number';
import { BdScrollService } from '@delen/bd-scroll';
import { BdEventService } from '@delen/bd-utilities';
import { BdViewService } from '@delen/bd-view';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';

var BdPortfolioHeaderComponent = /** @class */ (function () {
    function BdPortfolioHeaderComponent(bdScrollService, element, bdEventService, bdViewService) {
        var _this = this;
        this.bdScrollService = bdScrollService;
        this.element = element;
        this.bdEventService = bdEventService;
        this.bdViewService = bdViewService;
        this.destroyed$ = new Subject$1();
        this.fixed = false;
        this.FIXED_HEADER_CLASS = 'ng2-c-portfolio-header--fixed';
        this.HEADER_CONTENT_CLASS = '.ng2-c-portfolio-header__content';
        this.headerHeight = 0;
        this.onBackLabelClicked = new EventEmitter();
        this.onErrorButtonClicked = new EventEmitter();
        this.eventHandler = function () {
            _this.onScrollResize();
        };
    }
    BdPortfolioHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scrollContainerEl = this.bdViewService.scrollContainer;
        this.scrollContainerEl.addEventListener('scroll', this.eventHandler);
        this.bdEventService.onWindowResizeOutsideZone.takeUntil(this.destroyed$)
            .debounceTime(100)
            .subscribe(function () {
            /*
                                recalculate header content height when resized
                            */
            /*
                recalculate header content height when resized
            */
            _this.setHeaderContentHeight();
            _this.onScrollResize();
        });
        this.setHeaderContentHeight();
    };
    BdPortfolioHeaderComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.scrollContainerEl.removeEventListener('scroll', this.eventHandler);
    };
    BdPortfolioHeaderComponent.prototype.retry = function () {
        this.onErrorButtonClicked.emit();
    };
    BdPortfolioHeaderComponent.prototype.goBack = function () {
        this.onBackLabelClicked.emit();
    };
    BdPortfolioHeaderComponent.prototype.setHeaderContentHeight = function () {
        /*
                     We depend on the viewport height of our device inside our scss for bug #6489 (100vh)
                     See comments in scss file.
        
                     So we need to keep this value in mind during our calculation of the breakpoint (see onScrollResize).
                 */
        var headerContentEl = this.element.nativeElement.querySelector(this.HEADER_CONTENT_CLASS);
        var elementComputedStyle = window.getComputedStyle(headerContentEl);
        /*
                    Explanation why we use the `!` at the end of paddingTop:
                    https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#non-null-assertion-operator
                */
        var paddingTop = (elementComputedStyle.paddingTop);
        this.headerHeight = parseInt(paddingTop);
    };
    BdPortfolioHeaderComponent.prototype.onScrollResize = function () {
        var el = this.element.nativeElement;
        var breakpoint = this.scrollContainerEl.scrollTop > ((el.children[0].clientHeight - 10) - this.headerHeight); // 10px outside the view
        if (breakpoint && !this.fixed) {
            el.classList.add(this.FIXED_HEADER_CLASS);
            this.fixed = true;
        }
        else if (!breakpoint && this.fixed) {
            el.classList.remove(this.FIXED_HEADER_CLASS);
            this.fixed = false;
        }
    };
    BdPortfolioHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-portfolio-header2',
                    template: "<header>    <portfolio-header-small        [state]=\"state\"        [data]=\"data\"        [errorText]=\"errorText\"        [backLabel]=\"backLabel\"        (onBackLabelClicked)=\"goBack()\">    </portfolio-header-small>    <portfolio-header-full        [state]=\"state\"        [data]=\"data\"        [errorText]=\"errorText\"        [errorButtonText]=\"errorButtonText\"        (onErrorButtonClicked)=\"retry()\"        [backLabel]=\"backLabel\"        (onBackLabelClicked)=\"goBack()\">    </portfolio-header-full></header>",
                    host: {
                        class: 'ng2-c-portfolio-header'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdPortfolioHeaderComponent.ctorParameters = function () { return [
        { type: BdScrollService, },
        { type: ElementRef, },
        { type: BdEventService, },
        { type: BdViewService, },
    ]; };
    BdPortfolioHeaderComponent.propDecorators = {
        "state": [{ type: Input },],
        "backLabel": [{ type: Input },],
        "data": [{ type: Input },],
        "errorText": [{ type: Input },],
        "errorButtonText": [{ type: Input },],
        "onBackLabelClicked": [{ type: Output },],
        "onErrorButtonClicked": [{ type: Output },],
    };
    return BdPortfolioHeaderComponent;
}());

var PortfolioHeaderFullComponent = /** @class */ (function () {
    function PortfolioHeaderFullComponent() {
        this.onBackLabelClicked = new EventEmitter();
        this.onErrorButtonClicked = new EventEmitter();
    }
    PortfolioHeaderFullComponent.prototype.backFn = function () {
        this.onBackLabelClicked.emit();
    };
    PortfolioHeaderFullComponent.prototype.retryFn = function () {
        this.onErrorButtonClicked.emit();
    };
    PortfolioHeaderFullComponent.prototype.trackByFn = function (index) {
        return index;
    };
    PortfolioHeaderFullComponent.decorators = [
        { type: Component, args: [{
                    selector: 'portfolio-header-full',
                    template: "<section class=\"ng2-c-portfolio-header__content\" [ngSwitch]=\"state\">    <span class=\"ng2-c-header__icon ng2-c-portfolio-header__back ng2-c-portfolio-header__back--absolute\" [hidden]=\"!backLabel\" (click)=\"backFn()\">        <i class=\"icon-back\"></i>        <span class=\"ng2-c-header__icon-text\">{{ backLabel }}</span>    </span>    <header class=\"ng2-c-portfolio-header-summary\" [class.ng2-c-portfolio-header-summary--multi]=\"data?.contracts.length >= 2\">        <div *ngSwitchCase=\"'error'\" class=\"ng2-c-portfolio-header-summary__error\">            <p>{{ errorText }}</p>            <button class=\"ng2-o-button ng2-o-button--quaternary\" (click)=\"retryFn()\">                <span class=\"ng2-o-button__text\">{{errorButtonText}}</span>            </button>        </div>        <div class=\"ng2-c-loader ng2-c-loader--green\" *ngSwitchCase=\"'loading'\"></div>        <ng-container *ngSwitchDefault>            <div class=\"ng2-c-portfolio-header-summary__content\" *ngIf=\"data?.contracts.length >= -1\">                <ng-container [ngSwitch]=\"data?.contracts.length >= 2\">                    <ng-container *ngSwitchCase=\"true\">                        <div class=\"ng2-c-portfolio-header-summary__title\">{{ data.title }}</div>                    </ng-container>                    <ng-container *ngSwitchCase=\"false\">                        <div class=\"ng2-c-portfolio-header-summary__name\">{{ data.contracts[0].name }}</div>                        <div class=\"ng2-c-portfolio-header-summary__iban\">{{ data.contracts[0].iban }}</div>                    </ng-container>                </ng-container>                <div class=\"ng2-c-portfolio-header-summary__total\">                    <div class=\"ng2-c-portfolio-header__amount\">{{data.total}}</div>                    <div class=\"ng2-c-portfolio-header__stocks\">                        <div [bdNumberSign]=\"data.totalReturn.value\">{{data.totalReturn.format}}</div>                        <div class=\"ng2-c-portfolio-header__since\">{{ data.activeReturnPeriod }}</div>                    </div>                </div>                <div class=\"ng2-c-portfolio-header__contracts ng2-c-portfolio-header__contracts--{{data.contracts.length}}\" *ngIf=\"data.contracts.length >= 2 && data.contracts.length <= 3\">                    <div class=\"ng2-c-portfolio-header__contracts-item\" *ngFor=\"let contract of data.contracts; trackBy: trackByFn\">                        <span class=\"ng2-c-portfolio-header__label--stock\">                            <span>{{contract.valuation}}</span>                            <span [bdNumberSign]=\"contract.return.value\">{{contract.return.format}}</span>                        </span>                        <span class=\"ng2-c-portfolio-header__label--name\">{{contract.name}}</span>                        <span class=\"ng2-c-portfolio-header__label--iban\">{{contract.iban}}</span>                    </div>                </div>            </div>        </ng-container>    </header></section>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    PortfolioHeaderFullComponent.ctorParameters = function () { return []; };
    PortfolioHeaderFullComponent.propDecorators = {
        "state": [{ type: Input },],
        "backLabel": [{ type: Input },],
        "data": [{ type: Input },],
        "errorText": [{ type: Input },],
        "errorButtonText": [{ type: Input },],
        "onBackLabelClicked": [{ type: Output },],
        "onErrorButtonClicked": [{ type: Output },],
    };
    return PortfolioHeaderFullComponent;
}());

var PortfolioHeaderSmallComponent = /** @class */ (function () {
    function PortfolioHeaderSmallComponent() {
        this.onBackLabelClicked = new EventEmitter();
    }
    PortfolioHeaderSmallComponent.prototype.backFn = function () {
        this.onBackLabelClicked.emit();
    };
    PortfolioHeaderSmallComponent.decorators = [
        { type: Component, args: [{
                    selector: 'portfolio-header-small',
                    template: "<div class=\"ng2-c-header ng2-c-header--sticky\" [ngSwitch]=\"state\">    <div class=\"ng2-c-header__main\">        <div class=\"ng2-c-header__left\">            <span class=\"ng2-c-header__icon ng2-c-portfolio-header__back\" [hidden]=\"!backLabel\" (click)=\"backFn()\">                <i class=\"icon-back\"></i>                <span class=\"ng2-c-header__icon-text\">{{backLabel}}</span>            </span>        </div>        <div class=\"ng2-c-header__center\">            <div class=\"ng2-c-header__title\" *ngSwitchCase=\"'error'\">{{ errorText }}</div>            <div class=\"ng2-c-loader ng2-c-loader--green ng2-c-loader--small\" *ngSwitchCase=\"'loading'\"></div>            <ng-container *ngSwitchDefault>                <div class=\"ng2-c-header__title\" [ngSwitch]=\"data?.contracts.length >= 2\">                    <ng-container *ngSwitchCase=\"true\">                        {{ data.title }}                    </ng-container>                    <ng-container *ngSwitchCase=\"false\">                        {{ data.contracts[0].name }}                    </ng-container>                </div>                <div class=\"ng2-c-header__subtitle\">                    <span>{{data.total}}</span>                    <span [bdNumberSign]=\"data.totalReturn.value\">{{data.totalReturn.format}}</span>                </div>            </ng-container>        </div>    </div></div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    PortfolioHeaderSmallComponent.ctorParameters = function () { return []; };
    PortfolioHeaderSmallComponent.propDecorators = {
        "state": [{ type: Input },],
        "backLabel": [{ type: Input },],
        "data": [{ type: Input },],
        "errorText": [{ type: Input },],
        "onBackLabelClicked": [{ type: Output },],
    };
    return PortfolioHeaderSmallComponent;
}());

var components = [
    BdPortfolioHeaderComponent
];
var BdPortfolioHeaderModule = /** @class */ (function () {
    function BdPortfolioHeaderModule() {
    }
    BdPortfolioHeaderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdNumberModule
                    ],
                    declarations: components.concat([
                        PortfolioHeaderFullComponent,
                        PortfolioHeaderSmallComponent
                    ]),
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdPortfolioHeaderModule.ctorParameters = function () { return []; };
    return BdPortfolioHeaderModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { PortfolioHeaderFullComponent as ɵb, PortfolioHeaderSmallComponent as ɵc, BdPortfolioHeaderComponent as ɵa, BdPortfolioHeaderModule };
//# sourceMappingURL=index.js.map
