import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Injectable, Input, NgModule, NgZone, Optional, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdPopupModule } from '@delen/bd-popup';
import { BdSelectionListModule } from '@delen/bd-selection-list';
import { Observable, Subject } from 'rxjs';
import { BdViewService } from '@delen/bd-view';
import { BdScrollContainerDirective } from '@delen/bd-scroll';
import { BdDeviceService } from '@delen/bd-utilities';

var BdTableService = /** @class */ (function () {
    function BdTableService() {
        this.rowHeightValue = 0;
        this.headerHeightValue = 0;
        this.footerHeightValue = 0;
        this.numberOfRowsValue = 0;
        this.stickyValue = false;
        this.offsetValue = 0;
        this.popupCache = [];
        this.activeGroupSubject = new Subject();
        this.headerPositionSubject = new Subject();
        this.headerResetSubject = new Subject();
    }
    Object.defineProperty(BdTableService.prototype, "rowHeight", {
        get: function () {
            return this.rowHeightValue;
        },
        set: function (h) {
            this.rowHeightValue = h;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "headerHeight", {
        get: function () {
            return this.headerHeightValue;
        },
        set: function (h) {
            this.headerHeightValue = h;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "footerHeight", {
        get: function () {
            return this.footerHeightValue;
        },
        set: function (h) {
            this.footerHeightValue = h;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "numberOfRows", {
        get: function () {
            return this.numberOfRowsValue;
        },
        set: function (n) {
            this.numberOfRowsValue = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "sticky", {
        get: function () {
            return this.stickyValue;
        },
        set: function (n) {
            this.stickyValue = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "table", {
        set: function (e) {
            if (this.tableValue) {
                throw new Error('Table can only be set once on BdTableService');
            }
            this.tableValue = e;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "tableDimensions", {
        get: function () {
            return this.tableValue.getBoundingClientRect();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "activeGroup", {
        get: function () {
            return this.activeGroupValue;
        },
        set: function (s) {
            this.activeGroupValue = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "scrollContainer", {
        get: function () {
            return this.scrollContainerValue;
        },
        set: function (s) {
            this.scrollContainerValue = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTableService.prototype, "offset", {
        get: function () {
            return this.offsetValue;
        },
        set: function (offset) {
            this.offsetValue = offset;
        },
        enumerable: true,
        configurable: true
    });
    BdTableService.prototype.registerPopup = function (index, popup) {
        this.popupCache[index] = popup;
    };
    BdTableService.prototype.openPopup = function (index, element) {
        if (this.popupCache.indexOf[index] < 0) {
            throw new Error("No popup found for column " + index);
        }
        if (!element) {
            throw new Error("No popup target found for column " + index);
        }
        this.popupCache[index].target = element;
        this.popupCache[index].open();
    };
    BdTableService.prototype.closePopups = function () {
        this.popupCache.forEach(function (popup) {
            popup.close();
        });
    };
    BdTableService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdTableService.ctorParameters = function () { return []; };
    return BdTableService;
}());

var BdTableColumnComponent = /** @class */ (function () {
    function BdTableColumnComponent($element, cdRef, tableService) {
        this.$element = $element;
        this.cdRef = cdRef;
        this.tableService = tableService;
        this.hasMainClass = false;
        this.hasActiveClass = false;
    }
    /**
     * Set the header from inside bdTable. This is needed for the stacked view
     * @param header: header column component
     */
    /**
         * Set the header from inside bdTable. This is needed for the stacked view
         * @param header: header column component
         */
    BdTableColumnComponent.prototype.setHeader = /**
         * Set the header from inside bdTable. This is needed for the stacked view
         * @param header: header column component
         */
    function (header) {
        this.header = header;
        this.cdRef.markForCheck();
    };
    /**
     * Set the appropriate class to set the correct order
     */
    /**
         * Set the appropriate class to set the correct order
         */
    BdTableColumnComponent.prototype.addMainClass = /**
         * Set the appropriate class to set the correct order
         */
    function () {
        this.hasMainClass = true;
    };
    /**
     * Set the appropriate class to set the correct order
     */
    /**
         * Set the appropriate class to set the correct order
         */
    BdTableColumnComponent.prototype.addActionClass = /**
         * Set the appropriate class to set the correct order
         */
    function () {
        this.hasActiveClass = true;
    };
    /**
     * Sets the columns width
     * @param grow: CSS flex-grow value
     * @param width: CSS width value
     * @param display: CSS display value
     * @returns {boolean}
     */
    /**
         * Sets the columns width
         * @param grow: CSS flex-grow value
         * @param width: CSS width value
         * @param display: CSS display value
         * @returns {boolean}
         */
    BdTableColumnComponent.prototype.setWidth = /**
         * Sets the columns width
         * @param grow: CSS flex-grow value
         * @param width: CSS width value
         * @param display: CSS display value
         * @returns {boolean}
         */
    function (grow, width, display) {
        var element = this.$element.nativeElement;
        element.style['flex-grow'] = grow;
        element.style.width = width;
        element.style.display = display;
        element.style.opacity = '1'; // prevents flickering when rendering the table
    };
    BdTableColumnComponent.prototype.openPopup = function (event) {
        event.stopPropagation();
        this.tableService.openPopup(this.header.index, event.target);
    };
    BdTableColumnComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-column',
                    template: "<div class=\"ng2-c-table__column-header\">    <span [innerHTML]=\"header?.title\"></span>    <i class=\"ng2-c-table__help icon-help\" *ngIf=\"header?.help\" (click)=\"openPopup($event)\"></i></div><ng-content></ng-content>",
                    host: { 'class': 'ng2-c-table__column' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTableColumnComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: BdTableService, },
    ]; };
    BdTableColumnComponent.propDecorators = {
        "hasMainClass": [{ type: HostBinding, args: ["class.ng2-c-table__column--main",] },],
        "hasActiveClass": [{ type: HostBinding, args: ["class.ng2-c-table__column--action",] },],
    };
    return BdTableColumnComponent;
}());

var BdTableRowComponent = /** @class */ (function () {
    function BdTableRowComponent($element) {
        this.$element = $element;
    }
    /**
     * Get the element height
     * @returns {number}
     */
    /**
         * Get the element height
         * @returns {number}
         */
    BdTableRowComponent.prototype.getHeight = /**
         * Get the element height
         * @returns {number}
         */
    function () {
        return this.$element.nativeElement.getBoundingClientRect().height;
    };
    /**
     * Get the BoudingClientRect
     * @returns {ClientRect}
     */
    /**
         * Get the BoudingClientRect
         * @returns {ClientRect}
         */
    BdTableRowComponent.prototype.getBoundingClientRect = /**
         * Get the BoudingClientRect
         * @returns {ClientRect}
         */
    function () {
        return this.$element.nativeElement.getBoundingClientRect();
    };
    BdTableRowComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-row',
                    template: "<ng-content></ng-content>",
                    host: { 'class': 'ng2-c-table__row' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTableRowComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdTableRowComponent.propDecorators = {
        "columns": [{ type: ContentChildren, args: [BdTableColumnComponent,] },],
    };
    return BdTableRowComponent;
}());

var BdTableHeaderColumnComponent = /** @class */ (function () {
    function BdTableHeaderColumnComponent($element, cdRef, tableService, ngZone) {
        this.$element = $element;
        this.cdRef = cdRef;
        this.tableService = tableService;
        this.ngZone = ngZone;
        this.priority = 99;
        this.fixed = false;
        this.initial = true;
    }
    BdTableHeaderColumnComponent.prototype.ngOnChanges = function (changes) {
        if ((changes.main && changes.main.currentValue) || (changes.action && changes.action.currentValue)) {
            this.fixed = true;
        }
    };
    /**
     * Set the correct styling
     */
    /**
         * Set the correct styling
         */
    BdTableHeaderColumnComponent.prototype.setWidth = /**
         * Set the correct styling
         */
    function () {
        var element = this.$element.nativeElement;
        element.style['flex-grow'] = this.calculatedGrow;
        element.style.width = this.calculatedWidth;
        element.style.display = this.calculatedVisibility;
        element.style.opacity = '1'; // prevents flickering when rendering the table
    };
    BdTableHeaderColumnComponent.prototype.setTitle = function (title) {
        var _this = this;
        this.ngZone.run(function () {
            _this.title = title;
            /**
                         * this code is called from outside Angular because of perfomance reasons.
                         * (from table-group-component.ts)
                         * Therefore we need to mark it in the ChangeDetectorRef.
                         * If not, the value will not be updated.
                         *
                         * NOTE: check for cdref['destroyed'] is needed because this code
                         *       runs async. When navigating really quick it can happen
                         *       that the component is already destroyed before it get's
                         *       here. Therefore check it first #gohacks!
                         */
            if (!_this.cdRef['destroyed']) {
                _this.cdRef.markForCheck();
                _this.cdRef.detectChanges();
            }
        });
    };
    BdTableHeaderColumnComponent.prototype.setIndex = function (index) {
        this.index = index;
        this.tableService.registerPopup(index, this.popup);
    };
    BdTableHeaderColumnComponent.prototype.openPopup = function (event) {
        event.stopPropagation();
        this.tableService.openPopup(this.index, event.target);
    };
    BdTableHeaderColumnComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-header-column',
                    template: "<span [innerHTML]=\"title\"></span><i class=\"icon-help ng2-c-table__help\" *ngIf=\"help\" (click)=\"openPopup($event)\"></i><bd-popup2 #bdTableHeaderColumnHelpPopup [hasPadding]=\"true\">    <span [innerHTML]=\"help\"></span></bd-popup2>",
                    host: { 'class': 'ng2-c-table__header-column' },
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTableHeaderColumnComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: BdTableService, },
        { type: NgZone, },
    ]; };
    BdTableHeaderColumnComponent.propDecorators = {
        "title": [{ type: Input },],
        "weight": [{ type: Input },],
        "stackedWeight": [{ type: Input },],
        "priority": [{ type: Input },],
        "fixed": [{ type: Input },],
        "grow": [{ type: Input },],
        "main": [{ type: Input },],
        "action": [{ type: Input },],
        "help": [{ type: Input },],
        "initial": [{ type: Input },],
        "popup": [{ type: ViewChild, args: ['bdTableHeaderColumnHelpPopup',] },],
    };
    return BdTableHeaderColumnComponent;
}());

var BdTableHeaderComponent = /** @class */ (function () {
    function BdTableHeaderComponent(bdTableService, bdViewService) {
        this.bdTableService = bdTableService;
        this.bdViewService = bdViewService;
        /**
             * topBoundaryMargin is a variable that is used to create an extra offset
             * when determining the start of table header smooth scroll.
             */
        this.topBoundaryMargin = 150;
        this.isFixed = false;
    }
    BdTableHeaderComponent.prototype.ngOnDestroy = function () {
        this.resetHeaderPosition();
    };
    BdTableHeaderComponent.prototype.scrollHandler = function () {
        this.checkHeaderPosition();
    };
    BdTableHeaderComponent.prototype.resizeHandler = function () {
        this.checkHeaderPosition(true);
    };
    BdTableHeaderComponent.prototype.getTopPosition = function (offset) {
        if (offset === void 0) { offset = 0; }
        var containerPaddingTop = window.getComputedStyle(this.bdTableService.scrollContainer).paddingTop;
        var containerPaddingTopInt = containerPaddingTop ? parseInt(containerPaddingTop) : 0;
        /*
                    When we have an offset and a custom header (e.g. portfolio header) keep track of statusbarheight
                */
        var customHeaderOffset = this.bdViewService.customHeaderHeight;
        if (offset > 0 && customHeaderOffset && this.bdViewService.statusBarHeight > 0) {
            offset += this.bdViewService.statusBarHeight;
        }
        return -containerPaddingTopInt + offset + "px";
    };
    /**
     * Calculate the smooth-scroll-zone
     * @returns {object} Top and bottom values for calculations
     */
    /**
         * Calculate the smooth-scroll-zone
         * @returns {object} Top and bottom values for calculations
         */
    BdTableHeaderComponent.prototype.getBoundaries = /**
         * Calculate the smooth-scroll-zone
         * @returns {object} Top and bottom values for calculations
         */
    function () {
        var tableBcr = this.bdTableService.tableDimensions;
        var footerHeight = this.bdTableService.footerHeight;
        var bottom = tableBcr.bottom - footerHeight;
        var top = bottom - this.bdTableService.rowHeight - this.bdTableService.headerHeight - this.bdViewService.statusBarHeight - this.bdTableService.offset;
        if (this.bdTableService.scrollContainer.parentElement) {
            var parentBcr = this.bdTableService.scrollContainer.parentElement.getBoundingClientRect();
            top = top - parentBcr.top;
        }
        return {
            top: top,
            bottom: bottom
        };
    };
    /**
     * Check if element is in smooth-scroll-zone
     * @returns {boolean}
     */
    /**
         * Check if element is in smooth-scroll-zone
         * @returns {boolean}
         */
    BdTableHeaderComponent.prototype.betweenBoundaries = /**
         * Check if element is in smooth-scroll-zone
         * @returns {boolean}
         */
    function () {
        var boundaries = this.getBoundaries();
        return (boundaries.top < this.topBoundaryMargin && boundaries.bottom > 0);
    };
    /**
     * Get the bottom offset
     * @returns {number}
     */
    /**
         * Get the bottom offset
         * @returns {number}
         */
    BdTableHeaderComponent.prototype.getBottomOffset = /**
         * Get the bottom offset
         * @returns {number}
         */
    function () {
        var boundaries = this.getBoundaries();
        return (boundaries.top < 0 && boundaries.bottom > 0) ? boundaries.top : 0;
    };
    /**
     * Position the header element
     */
    /**
         * Position the header element
         */
    BdTableHeaderComponent.prototype.positionHeader = /**
         * Position the header element
         */
    function () {
        /**
                 * If the table is not fixed, don't do anything.
                 */
        if (!this.isFixed) {
            this.resetHeaderPosition();
            return;
        }
        var containerBcr = this.bdTableService.scrollContainer.getBoundingClientRect();
        var bottomOffset = this.getBottomOffset();
        var parentBcr = null;
        var top = containerBcr.top + bottomOffset + this.bdTableService.offset;
        if (this.bdTableService.scrollContainer.parentElement) {
            parentBcr = this.bdTableService.scrollContainer.parentElement.getBoundingClientRect();
            if (containerBcr.top !== parentBcr.top) {
                top = top - parentBcr.top;
            }
        }
        var headerPosition = {
            top: top + "px",
            fixed: this.isFixed
        };
        this.bdTableService.headerPositionSubject.next(headerPosition);
    };
    /**
     * Reset the header position
     */
    /**
         * Reset the header position
         */
    BdTableHeaderComponent.prototype.resetHeaderPosition = /**
         * Reset the header position
         */
    function () {
        this.bdTableService.headerResetSubject.next();
    };
    /**
     * Check header positioning
     * @param forcePositioning: force the positioning of the header. Only used when resing
     */
    /**
         * Check header positioning
         * @param forcePositioning: force the positioning of the header. Only used when resing
         */
    BdTableHeaderComponent.prototype.checkHeaderPosition = /**
         * Check header positioning
         * @param forcePositioning: force the positioning of the header. Only used when resing
         */
    function (forcePositioning) {
        if (forcePositioning === void 0) { forcePositioning = false; }
        var scrollTop = this.bdTableService.scrollContainer.scrollTop;
        var tableBcr = this.bdTableService.tableDimensions;
        var containerBcr = this.bdTableService.scrollContainer.getBoundingClientRect();
        var tableTop = (tableBcr.top + scrollTop) - (containerBcr.top + this.bdTableService.offset);
        var tableBottom = tableTop + tableBcr.height - this.bdTableService.headerHeight;
        if (scrollTop > tableTop && scrollTop < tableBottom) {
            if (!this.isFixed || forcePositioning) {
                this.isFixed = true;
                this.positionHeader();
            }
        }
        else {
            if (this.isFixed && !this.betweenBoundaries()) {
                this.isFixed = false;
                this.positionHeader();
            }
        }
        if (this.betweenBoundaries()) {
            this.positionHeader();
        }
    };
    BdTableHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-header',
                    template: "<ng-content></ng-content>",
                    host: { 'class': 'ng2-c-table__header' }
                },] },
    ];
    /** @nocollapse */
    BdTableHeaderComponent.ctorParameters = function () { return [
        { type: BdTableService, },
        { type: BdViewService, },
    ]; };
    BdTableHeaderComponent.propDecorators = {
        "columns": [{ type: ContentChildren, args: [BdTableHeaderColumnComponent,] },],
    };
    return BdTableHeaderComponent;
}());

var BdTableGroupComponent = /** @class */ (function () {
    function BdTableGroupComponent($element, bdTableService, bdViewService) {
        this.$element = $element;
        this.bdTableService = bdTableService;
        this.bdViewService = bdViewService;
    }
    BdTableGroupComponent.prototype.scrollHandler = function () {
        this.checkGroupPosition();
    };
    BdTableGroupComponent.prototype.checkActive = function () {
        this.checkGroupPosition(true);
    };
    /**
     * Check if the group title should appear in the table header
     * @param forceUpdate: force update of active group. Only used inside resize
     */
    /**
         * Check if the group title should appear in the table header
         * @param forceUpdate: force update of active group. Only used inside resize
         */
    BdTableGroupComponent.prototype.checkGroupPosition = /**
         * Check if the group title should appear in the table header
         * @param forceUpdate: force update of active group. Only used inside resize
         */
    function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        var elementBcr = this.bdTableGroupContent.nativeElement.getBoundingClientRect();
        var scrollTop = this.bdTableService.scrollContainer.scrollTop;
        var containerBcr = this.bdTableService.scrollContainer.getBoundingClientRect();
        var groupHeaderTop = (elementBcr.top + scrollTop) - (containerBcr.top + this.bdTableService.offset + this.bdTableService.headerHeight);
        var groupHeaderBottom = groupHeaderTop + elementBcr.height;
        if (groupHeaderTop <= scrollTop && scrollTop < groupHeaderBottom) {
            if (this.bdTableService.activeGroup !== this.title || forceUpdate) {
                this.bdTableService.activeGroupSubject.next(this.title);
            }
        }
    };
    BdTableGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-group',
                    template: "<div class=\"ng2-c-table__group-title\">    <span [innerHTML]=\"title\"></span></div><div class=\"ng2-c-table__group-content\" #bdTableGroupContent>    <ng-content></ng-content></div>",
                    host: { 'class': 'ng2-c-table__group' }
                },] },
    ];
    /** @nocollapse */
    BdTableGroupComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdTableService, },
        { type: BdViewService, },
    ]; };
    BdTableGroupComponent.propDecorators = {
        "title": [{ type: Input },],
        "bdTableGroupContent": [{ type: ViewChild, args: ['bdTableGroupContent',] },],
    };
    return BdTableGroupComponent;
}());

var ATTRIBUTE_NAME = 'bdTableDetermineBackground';
var BdTableDirective = /** @class */ (function () {
    function BdTableDirective(elementRef) {
        this.elementRef = elementRef;
    }
    /**
     * Determine the background color of the table header by getting the background color of the target element
     */
    /**
         * Determine the background color of the table header by getting the background color of the target element
         */
    BdTableDirective.prototype.determineBackgroundColor = /**
         * Determine the background color of the table header by getting the background color of the target element
         */
    function () {
        var styles = window.getComputedStyle(this.elementRef.nativeElement);
        var elementBackgroundColor = styles.backgroundColor ? styles.backgroundColor : '';
        return elementBackgroundColor;
    };
    BdTableDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[" + ATTRIBUTE_NAME + "]"
                },] },
    ];
    /** @nocollapse */
    BdTableDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    return BdTableDirective;
}());

var BdTableComponent = /** @class */ (function () {
    function BdTableComponent($element, ngZone, bdTableService, bdViewService, bdDeviceService, bdScrollContainerDirective, bdTableDirective) {
        this.$element = $element;
        this.ngZone = ngZone;
        this.bdTableService = bdTableService;
        this.bdViewService = bdViewService;
        this.bdDeviceService = bdDeviceService;
        this.bdScrollContainerDirective = bdScrollContainerDirective;
        this.bdTableDirective = bdTableDirective;
        this.resizeDebounceTime = 100;
        this.columnWidth = 25;
        this.rowPadding = 10;
        this.gridColumns = 0;
        this.usedColumns = 0;
        this.ngUnsubscribe = new Subject();
        this.autoFillColumns = false;
        this.initSubscriptions = false;
        this.headerWrapperFixed = 'ng2-c-table__header-wrapper--fixed';
        this.tableSticky = 'ng2-c-table--sticky';
        this.showHeader = true;
        this.showSelectableColumns = true;
        this.minWeight = 0;
        this.stickyHeader = false;
        this.offset = 0;
        this.selectableColumns = [];
        this.stacked = false;
        this.grouped = false;
        this.selectedColumnsChange = new EventEmitter();
    }
    // ===================
    // LIFECYCLE FUNCTIONS
    // ===================
    // ===================
    // LIFECYCLE FUNCTIONS
    // ===================
    BdTableComponent.prototype.ngOnInit = 
    // ===================
    // LIFECYCLE FUNCTIONS
    // ===================
    function () {
        // when selectedColumns is false, set the autoFill flag
        if (!this.selectedColumns) {
            this.autoFillColumns = true;
            this.selectedColumns = [];
        }
    };
    BdTableComponent.prototype.ngOnChanges = function (changes) {
        if (changes.offset) {
            this.bdTableService.offset = this.offset;
        }
    };
    BdTableComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.rowSubscription.unsubscribe();
        this.groupCollectionSubscription.unsubscribe();
    };
    BdTableComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.bdTableService.table = this.$element.nativeElement;
        this.init();
        this.rowSubscription = this.rows.changes
            .subscribe(function (rows) {
            _this.init();
        });
        this.groupCollectionSubscription = this.groups.changes
            .subscribe(function (groups) {
            _this.initGroups();
        });
        this.bdTableService.headerResetSubject
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            _this.resetHeader();
        });
        this.bdTableService.headerPositionSubject
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (data) {
            _this.positionHeader(data);
        });
    };
    /**
     * Update visible columns from dropdown
     */
    /**
         * Update visible columns from dropdown
         */
    BdTableComponent.prototype.onUpdateColumns = /**
         * Update visible columns from dropdown
         */
    function () {
        var _this = this;
        if (this.selectableColumns.length === 0) {
            this.selectableColumns.forEach(function (column) {
                if (column.visible) {
                    _this.addHeader(column.index);
                }
            });
        }
        else {
            this.usedColumns = 0;
            this.header.columns.forEach(function (column) {
                column.visible = _this.selectedColumns.indexOf(column.index) >= 0;
                if (column.visible) {
                    _this.usedColumns += column.weight;
                }
            });
            this.setStacked();
            this.setWidths();
        }
        this.selectedColumnsChange.emit(this.selectedColumns);
    };
    BdTableComponent.prototype.redraw = function () {
        this.init();
    };
    // =================
    // PRIVATE FUNCTIONS
    // =================
    /**
     * Initial functions
     */
    // =================
    // PRIVATE FUNCTIONS
    // =================
    /**
         * Initial functions
         */
    BdTableComponent.prototype.init = 
    // =================
    // PRIVATE FUNCTIONS
    // =================
    /**
         * Initial functions
         */
    function () {
        var _this = this;
        // If no data is present, don't do anything
        if (!this.rows.length)
            return;
        this.usedColumns = 0;
        this.bdTableService.sticky = this.stickyHeader;
        if (this.stickyHeader) {
            this.$element.nativeElement.classList.add(this.tableSticky);
        }
        /**
                 * wrap in requestAnimationFrame to prevent view rendering issues
                 * such as bdTable.clientWidth
                 */
        window.requestAnimationFrame(function () {
            _this.sortHeaders();
            _this.setGridColumns();
            _this.setHeadersVisibility();
            _this.setStacked();
            _this.setHeaders();
            _this.setWidths();
            // disable autofill since we only want it on initial load
            // disable autofill since we only want it on initial load
            _this.autoFillColumns = false;
            _this.directiveCheck();
            _this.bdTableService.scrollContainer = _this.bdScrollContainerDirective ? _this.bdScrollContainerDirective.element : _this.bdViewService.scrollContainer;
            _this.bdTableService.headerHeight = _this.bdTableHeaderWrapper.nativeElement.getBoundingClientRect().height;
            if (_this.isJsSticky()) {
                /*
                                    When using an offset we need to keep in mind the following properties:
                                    - The offset we get from the user (default 0)
                                    - When we have a statusbar we need to add this to our offset
                
                                    The statusbarheight can be 0, when it doesn't exist on the page.
                                */
                /*
                    When using an offset we need to keep in mind the following properties:
                    - The offset we get from the user (default 0)
                    - When we have a statusbar we need to add this to our offset

                    The statusbarheight can be 0, when it doesn't exist on the page.
                */
                _this.bdTableService.offset = _this.offset + _this.bdViewService.statusBarHeight;
                _this.bdTableService.rowHeight = _this.rows.first.getHeight();
                _this.bdTableService.footerHeight = _this.bdTableFooter.nativeElement.getBoundingClientRect().height;
                _this.bdTableService.numberOfRows = _this.rows.length;
            }
            _this.initGroups();
            _this.setEventHandlers();
            _this.$element.nativeElement.style.visibility = 'visible';
        });
    };
    /**
     * Set the event subscriptions
     */
    /**
         * Set the event subscriptions
         */
    BdTableComponent.prototype.setEventHandlers = /**
         * Set the event subscriptions
         */
    function () {
        var _this = this;
        if (!this.isJsSticky()) {
            this.bdTableHeaderWrapper.nativeElement.style.top = this.header.getTopPosition(this.offset);
        }
        /**
                 * Don't do anything if subscriptions are already set.
                 */
        if (this.initSubscriptions)
            return;
        this.initSubscriptions = true;
        /**
                 * Run the positioning calculations outside of Angular.
                 * This is because zone triggers change detection on each scroll event.
                 * By running it outside of Angular we can skip all the misery.
                 */
        var scrollObservable = Observable.fromEvent(this.bdTableService.scrollContainer, 'scroll')
            .takeUntil(this.ngUnsubscribe);
        var resizeObservable = Observable.fromEvent(window, 'resize')
            .takeUntil(this.ngUnsubscribe)
            .debounceTime(this.resizeDebounceTime);
        this.ngZone.runOutsideAngular(function () {
            resizeObservable.subscribe(function () {
                _this.redraw();
                _this.header.resizeHandler();
                _this.groups.forEach(function (group) {
                    group.checkActive();
                });
                _this.directiveCheck();
            });
            scrollObservable.subscribe(function () {
                _this.groups.forEach(function (group) {
                    group.scrollHandler();
                });
            });
            /**
                         * NOTE: Only set header scroll listener when table is javascript sticky.
                         */
            if (_this.isJsSticky()) {
                scrollObservable.subscribe(function () {
                    _this.header.scrollHandler();
                });
            }
        });
    };
    /**
     * Table header has two ways of being sticky.
     * - iOS: uses CSS `position: sticky`
     * - Other browsers: use JS implementation. This should change to all browsers
     *                   supporting `position: sticky` but Chrome for Mac still has a bug:
     *                   https://bugs.chromium.org/p/chromium/issues/detail?id=814141
     */
    /**
         * Table header has two ways of being sticky.
         * - iOS: uses CSS `position: sticky`
         * - Other browsers: use JS implementation. This should change to all browsers
         *                   supporting `position: sticky` but Chrome for Mac still has a bug:
         *                   https://bugs.chromium.org/p/chromium/issues/detail?id=814141
         */
    BdTableComponent.prototype.isJsSticky = /**
         * Table header has two ways of being sticky.
         * - iOS: uses CSS `position: sticky`
         * - Other browsers: use JS implementation. This should change to all browsers
         *                   supporting `position: sticky` but Chrome for Mac still has a bug:
         *                   https://bugs.chromium.org/p/chromium/issues/detail?id=814141
         */
    function () {
        return !this.bdDeviceService.isIOS() && this.bdTableService.sticky;
    };
    BdTableComponent.prototype.trackByFn = function (index, column) {
        return column.index;
    };
    /**
     * Init the bdTable groups
     */
    /**
         * Init the bdTable groups
         */
    BdTableComponent.prototype.initGroups = /**
         * Init the bdTable groups
         */
    function () {
        var _this = this;
        if (this.groups.length > 0) {
            this.grouped = true;
            if (!this.activeGroup)
                this.activateGroup(this.groups.first.title);
            // When groups change, check again which one is active.
            // Otherwise this only changes after the first scroll.
            this.groups.forEach(function (group) { return group.checkActive(); });
            this.bdTableService.activeGroupSubject
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (title) {
                _this.activateGroup(title);
            });
        }
    };
    /**
     * Position the sticky header while scrolling
     * @param headerPosition: the position values used for placing the header wrapper element
     */
    /**
         * Position the sticky header while scrolling
         * @param headerPosition: the position values used for placing the header wrapper element
         */
    BdTableComponent.prototype.positionHeader = /**
         * Position the sticky header while scrolling
         * @param headerPosition: the position values used for placing the header wrapper element
         */
    function (headerPosition) {
        var _this = this;
        this.bdTableHeaderWrapper.nativeElement.style.top = headerPosition.top;
        this.bdTableHeaderWrapper.nativeElement.style.width = this.bdTableService.tableDimensions.width + "px";
        if (headerPosition.fixed) {
            window.requestAnimationFrame(function () {
                _this.bdTableHeaderWrapper.nativeElement.classList.add(_this.headerWrapperFixed);
            });
        }
    };
    /**
     * Reset the header to it's original position
     */
    /**
         * Reset the header to it's original position
         */
    BdTableComponent.prototype.resetHeader = /**
         * Reset the header to it's original position
         */
    function () {
        var _this = this;
        this.bdTableHeaderWrapper.nativeElement.style.top = 'auto';
        this.bdTableHeaderWrapper.nativeElement.style.width = 'auto';
        window.requestAnimationFrame(function () {
            _this.bdTableHeaderWrapper.nativeElement.classList.remove(_this.headerWrapperFixed);
        });
    };
    /*
     * Set headers for respective columns
     */
    /*
         * Set headers for respective columns
         */
    BdTableComponent.prototype.setHeaders = /*
         * Set headers for respective columns
         */
    function () {
        var _this = this;
        this.rows.forEach(function (row) {
            row.columns.forEach(function (column, index) {
                var headerColumn = _this.header.columns.filter(function (h) {
                    return h.index === index.toString();
                })[0];
                column.setHeader(headerColumn);
            });
        });
    };
    /**
     * Sort the headers based on fixed and priority parameters
     */
    /**
         * Sort the headers based on fixed and priority parameters
         */
    BdTableComponent.prototype.sortHeaders = /**
         * Sort the headers based on fixed and priority parameters
         */
    function () {
        this.header.columns.forEach(function (column, index) {
            column.setIndex(index.toString());
        });
        this.sortedHeaders = this.header.columns.toArray().sort(function (a, b) {
            return (a.fixed ? 0 : a.priority) - (b.fixed ? 0 : b.priority);
        });
        this.selectableColumns = this.header.columns.toArray().filter(function (header) {
            return !header.fixed;
        });
    };
    /**
     * Set number of visible grid columns
     */
    /**
         * Set number of visible grid columns
         */
    BdTableComponent.prototype.setGridColumns = /**
         * Set number of visible grid columns
         */
    function () {
        this.gridColumns = Math.floor((Math.min(this.bdTableWrapper.nativeElement.clientWidth, window.innerWidth) - this.rowPadding) / this.columnWidth);
    };
    /**
     * Set visibility of headers
     */
    /**
         * Set visibility of headers
         */
    BdTableComponent.prototype.setHeadersVisibility = /**
         * Set visibility of headers
         */
    function () {
        var _this = this;
        this.sortedHeaders.forEach(function (header) {
            _this.setHeaderVisibility(header);
        });
    };
    /**
     * Check if there is enough space to show the column
     * @param header: header column component
     */
    /**
         * Check if there is enough space to show the column
         * @param header: header column component
         */
    BdTableComponent.prototype.setHeaderVisibility = /**
         * Check if there is enough space to show the column
         * @param header: header column component
         */
    function (header) {
        // If the user passes a list of default selectedColumns, use it.
        if (this.selectedColumns && !this.autoFillColumns) {
            if (this.selectedColumns.indexOf(header.index) > -1 || header.fixed) {
                this.usedColumns += header.weight;
                header.visible = true;
                this.addHeader(header.index);
            }
            else {
                header.visible = false;
            }
        }
        else {
            if (this.usedColumns + header.weight <= Math.max(this.gridColumns, this.minWeight) && header.initial) {
                this.usedColumns += header.weight;
                header.visible = true;
                this.addHeader(header.index);
            }
            else {
                header.visible = false;
            }
        }
    };
    /**
     * Add the header. This makes sure that all ID's are unique
     * @param index: the index of the header
     */
    /**
         * Add the header. This makes sure that all ID's are unique
         * @param index: the index of the header
         */
    BdTableComponent.prototype.addHeader = /**
         * Add the header. This makes sure that all ID's are unique
         * @param index: the index of the header
         */
    function (index) {
        if (this.selectedColumns.indexOf(index) < 0) {
            this.selectedColumns = this.selectedColumns.concat([index]);
        }
    };
    /**
     * Set top offset on the table
     */
    /**
         * Set top offset on the table
         */
    BdTableComponent.prototype.setTableOffset = /**
         * Set top offset on the table
         */
    function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            _this.bdTableContentWrapper.nativeElement.style.paddingTop = _this.bdTableHeaderWrapper.nativeElement.getBoundingClientRect().height + 'px';
        });
    };
    /**
     * Set the table as stacked
     */
    /**
         * Set the table as stacked
         */
    BdTableComponent.prototype.setStacked = /**
         * Set the table as stacked
         */
    function () {
        if (this.isJsSticky())
            this.setTableOffset();
        var oldStacked = this.stacked;
        this.stacked = this.usedColumns > this.gridColumns;
        if (oldStacked !== this.stacked) {
            // Close help popups when stacked is changed,
            // otherwise we lose the target of the active popup
            this.bdTableService.closePopups();
        }
        if (this.bdTableService.activeGroup) {
            this.activateGroup(this.bdTableService.activeGroup);
        }
    };
    /**
     * activate the correct group
     * @param groupTitle: the title of the active group
     */
    /**
         * activate the correct group
         * @param groupTitle: the title of the active group
         */
    BdTableComponent.prototype.activateGroup = /**
         * activate the correct group
         * @param groupTitle: the title of the active group
         */
    function (groupTitle) {
        this.activeGroup = groupTitle;
        this.bdTableService.activeGroup = groupTitle;
        this.header.columns.first.setTitle(this.bdTableService.activeGroup);
    };
    /**
     * Get the calculated width of the header column
     * @param header: header column component
     * @returns {string}
     */
    /**
         * Get the calculated width of the header column
         * @param header: header column component
         * @returns {string}
         */
    BdTableComponent.prototype.getWidth = /**
         * Get the calculated width of the header column
         * @param header: header column component
         * @returns {string}
         */
    function (header) {
        if (this.stacked) {
            if (header.main) {
                var actionHeader = this.header.columns.filter(function (h) {
                    return h.action;
                })[0];
                return 'calc(100% - ' + (actionHeader ? actionHeader.weight : 0) * this.columnWidth + 'px)';
            }
            return (this.getStackedWeight(header) * this.columnWidth) + 'px';
        }
        return (this.getWeight(header) * this.columnWidth) + 'px';
    };
    /**
     * Get the size of a header
     * @param header: header column component
     * @param useStackedWeight: use the stacked weight or the normal weight. Default: false
     * @returns {number}
     */
    /**
         * Get the size of a header
         * @param header: header column component
         * @param useStackedWeight: use the stacked weight or the normal weight. Default: false
         * @returns {number}
         */
    BdTableComponent.prototype.getWeight = /**
         * Get the size of a header
         * @param header: header column component
         * @param useStackedWeight: use the stacked weight or the normal weight. Default: false
         * @returns {number}
         */
    function (header, useStackedWeight) {
        if (useStackedWeight === void 0) { useStackedWeight = false; }
        var weight = (header.stackedWeight && useStackedWeight) ? header.stackedWeight : header.weight;
        if (header.grow) {
            return Math.max(weight, weight + (this.gridColumns - this.usedColumns));
        }
        return weight;
    };
    /**
     * Get the stacked column size
     * @param header: header column component
     * @param grow: set to true when the header column should grow
     * @returns {number}
     */
    /**
         * Get the stacked column size
         * @param header: header column component
         * @param grow: set to true when the header column should grow
         * @returns {number}
         */
    BdTableComponent.prototype.getStackedWeight = /**
         * Get the stacked column size
         * @param header: header column component
         * @param grow: set to true when the header column should grow
         * @returns {number}
         */
    function (header) {
        return this.getWeight(header, true);
    };
    /**
     * Set widths of both headers and columns, based on the header weights
     */
    /**
         * Set widths of both headers and columns, based on the header weights
         */
    BdTableComponent.prototype.setWidths = /**
         * Set widths of both headers and columns, based on the header weights
         */
    function () {
        var _this = this;
        var growHeaders = this.header.columns.filter(function (header) {
            return header.grow;
        });
        if (growHeaders.length > 1) {
            throw new Error('Only one BdTableHeaderColumnComponent can have a grow property.');
        }
        this.header.columns.forEach(function (header) {
            header.calculatedWidth = _this.getWidth(header);
            header.calculatedVisibility = header.visible ? '' : 'none';
            header.calculatedGrow = (!header.grow && !_this.stacked) ? 0 : 1;
            header.setWidth();
        });
        this.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                var header = column.header;
                column.setWidth(header.calculatedGrow, header.calculatedWidth, header.calculatedVisibility);
                if (header.main) {
                    column.addMainClass();
                }
                if (header.action) {
                    column.addActionClass();
                }
            });
        });
    };
    /**
     * sets the background color of bdTableHeaderWrapper
     * @param backgroundColor
     */
    /**
         * sets the background color of bdTableHeaderWrapper
         * @param backgroundColor
         */
    BdTableComponent.prototype.setBackgroundColor = /**
         * sets the background color of bdTableHeaderWrapper
         * @param backgroundColor
         */
    function (backgroundColor) {
        this.bdTableHeaderWrapper.nativeElement.style['background-color'] = backgroundColor;
    };
    /**
     * determine the backgroundcolor if a directive is found
     */
    /**
         * determine the backgroundcolor if a directive is found
         */
    BdTableComponent.prototype.directiveCheck = /**
         * determine the backgroundcolor if a directive is found
         */
    function () {
        if (this.bdTableDirective) {
            var backgroundColor = this.bdTableDirective.determineBackgroundColor();
            this.setBackgroundColor(backgroundColor);
        }
    };
    BdTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table',
                    providers: [BdTableService],
                    template: "<div class=\"ng2-c-table__container\" [ngClass]=\"{'ng2-c-table__container--stacked': stacked, 'ng2-c-table__container--grouped': grouped, 'ng2-c-table__container--no-header': !showHeader}\" #bdTableWrapper>    <div class=\"ng2-c-table__header-wrapper\" #bdTableHeaderWrapper>        <div class=\"ng2-c-table__options\">            <ng-content select=\"bd-table-options\"></ng-content>        </div>        <div class=\"ng2-c-table__selectable-columns\" *ngIf=\"showSelectableColumns\">            <span class=\"ng2-c-table__dropdown\" [bdOpenPopup]=\"bdTableSelectableColumnsPopup\">                {{ dropdownLabel }}            </span>            <bd-popup2 #bdTableSelectableColumnsPopup>                <bd-multi-selection-list2 [(selected)]=\"selectedColumns\" (selectedChange)=\"onUpdateColumns()\">                    <bd-selection-list-item2 *ngFor=\"let column of selectableColumns;trackBy:trackByFn\" [key]=\"column.index\">                        {{ column.title }}                    </bd-selection-list-item2>                </bd-multi-selection-list2>            </bd-popup2>        </div>        <div *ngIf=\"!stacked\">            <ng-content select=\"bd-table-header\"></ng-content>        </div>        <div *ngIf=\"stacked && grouped\">            <div class=\"ng2-c-table__header\">                <div class=\"ng2-c-table__header-column\">                    {{activeGroup}}                </div>            </div>        </div>    </div>    <div class=\"ng2-c-table__wrapper\" #bdTableContentWrapper>        <ng-content select=\"bd-table-content\"></ng-content>    </div>    <div class=\"ng2-c-table__footer\" #bdTableFooter>        <ng-content select=\"bd-table-footer\"></ng-content>    </div></div>",
                    host: { 'class': 'ng2-c-table' }
                },] },
    ];
    /** @nocollapse */
    BdTableComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: NgZone, },
        { type: BdTableService, },
        { type: BdViewService, },
        { type: BdDeviceService, },
        { type: BdScrollContainerDirective, decorators: [{ type: Optional },] },
        { type: BdTableDirective, decorators: [{ type: Optional },] },
    ]; };
    BdTableComponent.propDecorators = {
        "header": [{ type: ContentChild, args: [BdTableHeaderComponent,] },],
        "groups": [{ type: ContentChildren, args: [BdTableGroupComponent, { descendants: true },] },],
        "rows": [{ type: ContentChildren, args: [BdTableRowComponent, { descendants: true },] },],
        "dropdownLabel": [{ type: Input },],
        "showHeader": [{ type: Input },],
        "showSelectableColumns": [{ type: Input },],
        "minWeight": [{ type: Input },],
        "stickyHeader": [{ type: Input },],
        "selectedColumns": [{ type: Input },],
        "offset": [{ type: Input },],
        "selectedColumnsChange": [{ type: Output },],
        "bdTableWrapper": [{ type: ViewChild, args: ['bdTableWrapper',] },],
        "bdTableContentWrapper": [{ type: ViewChild, args: ['bdTableContentWrapper',] },],
        "bdTableHeaderWrapper": [{ type: ViewChild, args: ['bdTableHeaderWrapper',] },],
        "bdTableFooter": [{ type: ViewChild, args: ['bdTableFooter',] },],
    };
    return BdTableComponent;
}());

var BdTableContentComponent = /** @class */ (function () {
    function BdTableContentComponent() {
    }
    BdTableContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-content',
                    template: "<ng-content></ng-content>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTableContentComponent.ctorParameters = function () { return []; };
    return BdTableContentComponent;
}());

var BdTableFooterComponent = /** @class */ (function () {
    function BdTableFooterComponent() {
    }
    BdTableFooterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-table-footer',
                    template: "<ng-content></ng-content>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BdTableFooterComponent.ctorParameters = function () { return []; };
    return BdTableFooterComponent;
}());

var components = [
    BdTableComponent,
    BdTableContentComponent,
    BdTableDirective,
    BdTableGroupComponent,
    BdTableRowComponent,
    BdTableColumnComponent,
    BdTableHeaderComponent,
    BdTableHeaderColumnComponent,
    BdTableFooterComponent
];
var BdTableModule = /** @class */ (function () {
    function BdTableModule() {
    }
    BdTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BdPopupModule,
                        BdSelectionListModule
                    ],
                    declarations: components,
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdTableModule.ctorParameters = function () { return []; };
    return BdTableModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdTableColumnComponent as ɵf, BdTableContentComponent as ɵh, BdTableFooterComponent as ɵi, BdTableGroupComponent as ɵd, BdTableHeaderColumnComponent as ɵc, BdTableHeaderComponent as ɵb, BdTableRowComponent as ɵe, BdTableDirective as ɵg, BdTableService as ɵa, BdTableModule, BdTableComponent };
//# sourceMappingURL=index.js.map
