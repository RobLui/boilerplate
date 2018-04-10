import { Component, Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdDeviceService } from '@delen/bd-utilities';
import { arc, easeCubic, event, interpolate, line, min, pie, scaleLinear, select, sum } from 'd3';
import * as d3 from 'd3';
import { Subject } from 'rxjs';

/* tslint:disable */
var Throttle = /** @class */ (function () {
    function Throttle(callback, delay, that) {
        this.callback = callback;
        this.delay = delay;
        this.that = that;
        this.previous = 0;
    }
    Throttle.prototype.run = function () {
        var _this = this;
        var elapsed = +new Date() - this.previous;
        var exec = function () {
            _this.previous = +new Date();
            _this.callback.call(_this.that);
        };
        this.destroy();
        if (elapsed > this.delay) {
            exec();
        }
        else {
            this.timeout = window.setTimeout(exec, this.delay - elapsed);
        }
    };
    Throttle.prototype.destroy = function () {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    };
    return Throttle;
}());

var PIECHART_SETTINGS = {
    STATES: {
        LOADING: 'loading',
        EMPTY: 'empty',
        ERROR: 'error',
        DATA: 'data',
        RENDERD: 'renderd'
    },
    colorFillClass: 'ng2-c-chart-color--fill-',
    colorTextClass: 'ng2-c-chart-color--text-',
    colorBlankClass: 'ng2-c-chart-color--blank-',
    labelBorderClass: 'ng2-c-chart-label--border'
};

var BdPieChartService = /** @class */ (function () {
    function BdPieChartService() {
        this.selectDataPoint = new Subject();
        this.clickDataPoint = new Subject();
    }
    BdPieChartService.prototype.isDrilldownEnabled = function (dataPoint) {
        return dataPoint.drillDown.button;
    };
    BdPieChartService.prototype._callFormatter = function (formatter, dataPoint, context, action) {
        if (typeof formatter === 'function' && dataPoint) {
            return formatter(dataPoint, context, action);
        }
        else {
            return '';
        }
    };
    BdPieChartService.prototype.callFormatter = function (valueName, dataPoint, context) {
        if (!this.dataValue) {
            return;
        }
        // formatter function names are 'valueName' + Formatter
        var formatter = this.dataValue[(valueName === 'name' ? 'label' : valueName) + 'Formatter'];
        if (formatter) {
            return this._callFormatter(formatter, dataPoint, context);
        }
        return dataPoint[valueName];
    };
    Object.defineProperty(BdPieChartService.prototype, "data", {
        set: function (d) {
            this.dataValue = d;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdPieChartService.prototype, "activeDataPoint", {
        get: function () {
            return this.activeDataPointValue;
        },
        set: function (a) {
            this.activeDataPointValue = a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdPieChartService.prototype, "colorAssignmentOrder", {
        get: function () {
            return this.colorAssignmentOrderValue;
        },
        set: function (c) {
            this.colorAssignmentOrderValue = c;
        },
        enumerable: true,
        configurable: true
    });
    BdPieChartService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BdPieChartService.ctorParameters = function () { return []; };
    return BdPieChartService;
}());

var BdPieChartComponent = /** @class */ (function () {
    function BdPieChartComponent(element, bdDeviceService, bdPieChartService) {
        var _this = this;
        this.element = element;
        this.bdDeviceService = bdDeviceService;
        this.bdPieChartService = bdPieChartService;
        this.ngUnsubscribe = new Subject();
        this.radius = 280 * 0.5;
        this.showLegend = true;
        this.onShowSelection = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.rotationCls = 'ng2-c-pie-chart__rotation';
        this.innerRadiusPercent = this.innerRadius || 50;
        this.labelRadiusPercent = 26;
        this.labelRadiusPercentSlide = 40;
        this.angleShift = Math.PI * 0.5;
        this.innerRadiusShadow = 65;
        this.transitionEase = easeCubic;
        this.transitionDuration = 75;
        this.transitionDurationSlow = 600;
        this.clickEvent = 'click';
        this.fixedWidth = 230;
        this.throttledOnResizeWindow = new Throttle(this.onWindowResize, 100, this);
        this.uniqueId = 0;
        this.states = PIECHART_SETTINGS.STATES;
        this.eventHandler = function () {
            _this.throttledOnResizeWindow.run();
        };
        this.elm = this.element.nativeElement;
        this.elm.addEventListener(this.clickEvent, this.onContainerClick);
        this.bdPieChartService.selectDataPoint
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (dataPoint) {
            _this.selectDataPoint(dataPoint);
        });
        this.bdPieChartService.clickDataPoint
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (data) {
            _this.onClick(data.dataPoint, data.action);
        });
    }
    BdPieChartComponent.prototype.onClick = function (dataPoint, action) {
        this.onSelect.emit({ dataPoint: dataPoint, action: action });
    };
    BdPieChartComponent.prototype.isDrilldownEnabled = function (dataPoint) {
        return dataPoint.drillDown;
    };
    BdPieChartComponent.prototype.ngOnChanges = function (changesObj) {
        var _this = this;
        if (!this.view) {
            this.updateView();
        }
        if (this.data) {
            this.bdPieChartService.data = this.data;
        }
        if (changesObj.radius) {
            if (!isNaN(parseFloat(this.radius))) {
                this.radius = parseFloat(this.radius);
            }
            this.fixedWidth = false;
        }
        if (changesObj.labelRadius && !isNaN(parseFloat(this.labelRadius))) {
            this.labelRadiusPercent = parseFloat(this.labelRadius);
            this.labelRadiusPercentSlide = this.labelRadiusPercent * 1.5;
        }
        window.removeEventListener('resize', this.eventHandler);
        if (this.error) {
            this.noDataHandler();
            window.addEventListener('resize', this.eventHandler);
            this.state = this.states.ERROR;
        }
        else if (this.loading) {
            this.state = this.states.LOADING;
            this.noDataHandler();
            window.addEventListener('resize', this.eventHandler);
        }
        else if (this.data && !this.hasValidDataPointArray(this.data.dataPoints)) {
            if (this.state !== this.states.EMPTY) {
                this.state = this.states.EMPTY;
                this.noDataHandler();
                window.addEventListener('resize', this.eventHandler);
            }
        }
        else if (this.data && this.data.dataPoints) {
            this.state = this.states.DATA;
            window.addEventListener('resize', this.eventHandler);
            this.bdPieChartService.colorAssignmentOrder = JSON.parse(JSON.stringify(this.data.colorAssignmentOrder)) || [];
            if (this.svgBlank) {
                this.svgBlank.classList.remove(this.rotationCls);
            }
            setTimeout(function () { return _this.renderChart(); });
        }
    };
    BdPieChartComponent.prototype.ngOnDestroy = function () {
        window.removeEventListener('resize', this.eventHandler);
        this.throttledOnResizeWindow.destroy();
        window.removeEventListener(this.clickEvent, this.onContainerClick);
        window.clearTimeout(this.renderTimer);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BdPieChartComponent.prototype.onWindowResize = function () {
        var _this = this;
        var viewChanged = this.updateView();
        if (this.state === this.states.DATA || this.state === this.states.RENDERD) {
            if (this.view !== 'stackedBar' && !viewChanged) {
                return;
            }
            setTimeout(function () { return _this.renderChart(); });
        }
        else if (this.state === this.states.ERROR && viewChanged) {
            this.svgBlank.textContent = '';
            this.noDataHandler();
        }
        else if (this.state === this.states.LOADING && viewChanged) {
            this.svgBlank.textContent = '';
            this.noDataHandler();
        }
        else if (this.state === this.states.EMPTY && viewChanged) {
            setTimeout(function () { return _this.showEmpty(); });
        }
        else if (this.state !== null && this.view === 'stackedBar') {
            setTimeout(function () { return _this.showEmpty(); });
        }
    };
    BdPieChartComponent.prototype.getSvgElements = function () {
        this.svg = this.elm.querySelector('.ng2-c-pie-chart__chart--data svg');
        this.svgBlank = this.elm.querySelector('.ng2-c-pie-chart__chart--blank svg');
    };
    BdPieChartComponent.prototype.updateView = function () {
        var newView = this.bdDeviceService.isTablet() ? 'donut' : 'stackedBar';
        if (newView !== this.view) {
            this.view = newView;
            return true;
        }
        else {
            return false;
        }
    };
    BdPieChartComponent.prototype.noDataHandler = function () {
        var _this = this;
        this.reset();
        setTimeout(function () { return _this.showEmpty(); });
    };
    BdPieChartComponent.prototype.showEmpty = function () {
        var _this = this;
        this.getSvgElements();
        if (this.svgBlank)
            this.svgBlank.textContent = '';
        if (this.view === 'donut') {
            this.resizeChart(this.svgBlank);
            setTimeout(function () {
                _this.renderBlankPieChart(_this.svgBlank);
            });
        }
    };
    BdPieChartComponent.prototype.reset = function () {
        this.getSvgElements();
        if (this.svg)
            this.svg.textContent = '';
        this.unselect();
    };
    BdPieChartComponent.prototype.clearChart = function () {
        this.svg.textContent = '';
        this.unselect();
    };
    BdPieChartComponent.prototype.unselect = function () {
        if (this.activeGroup) {
            this.activeGroup = null;
            this.bdPieChartService.activeDataPoint = null;
        }
    };
    BdPieChartComponent.prototype.getCanvasCenter = function (svg) {
        if (this.fixedWidth === false && svg) {
            var w = svg.getAttribute('width') * 0.5;
            var h = svg.getAttribute('height') * 0.5;
            return { x: w, y: h };
        }
        else {
            return { x: this.fixedWidth, y: this.fixedWidth };
        }
    };
    BdPieChartComponent.prototype.getDataPointGroup = function (dataPoint) {
        var elm = this.svg.querySelectorAll('.ng2-c-pie-chart__group');
        var data;
        for (var i = 0; i < elm.length; i++) {
            data = elm[i].__data__;
            // data on pie & donut
            if (this.equals(dataPoint, data)) {
                return elm[i];
            }
            // data on stackedBar
            if (Array.isArray(data) && data[0].data && this.equals(dataPoint, data[0])) {
                return elm[i];
            }
        }
        return null;
    };
    BdPieChartComponent.prototype.equals = function (d, d1) {
        return d && d1 && d.id === d1.id;
    };
    BdPieChartComponent.prototype.selectDataPoint = function (dataPoint) {
        var d = this.getDataPointGroup(dataPoint);
        // If no dataPoint is found don't select anything
        if (this.view !== 'donut' || !d) {
            return;
        }
        this.groupSelectHandler(d, dataPoint);
    };
    BdPieChartComponent.prototype.color = function (dataPoint) {
        var index = this.bdPieChartService.colorAssignmentOrder.indexOf(dataPoint.id);
        return index === '-1' ? '' : PIECHART_SETTINGS.colorFillClass + index;
    };
    BdPieChartComponent.prototype.center = function (svg) {
        if (this.fixedWidth === false) {
            var w = svg.getAttribute('width') * 0.5;
            var h = svg.getAttribute('height') * 0.5;
            return { top: w, left: h };
        }
        else {
            return { top: this.fixedWidth, left: this.fixedWidth };
        }
    };
    BdPieChartComponent.prototype.getChartSize = function () {
        var size = {};
        if (this.view === 'donut') {
            this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
            size.width = this.radius * 3;
            size.height = size.width;
            if (this.radius === 'auto') {
                this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
                var chartElm = this.elm.querySelector('.ng2-c-pie-chart');
                size.width = chartElm.clientWidth;
                size.height = chartElm.clientHeight;
                this.radius = (Math.min(size.width, size.height) > 400) ? 140 : 80;
            }
        }
        return size;
    };
    BdPieChartComponent.prototype.resizeChart = function (svg) {
        if (!svg) {
            return;
        }
        var size = this.getChartSize();
        var w = size.width + this.margin.left + this.margin.right;
        var h = size.height + this.margin.top + this.margin.bottom;
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        this.unselect();
    };
    BdPieChartComponent.prototype.assignColor = function (data) {
        if (data.color) {
            return data.color;
        }
        var index = this.bdPieChartService.colorAssignmentOrder.indexOf(data.id);
        return index === -1 ? this.bdPieChartService.colorAssignmentOrder.push(data.id) - 1 : index;
    };
    BdPieChartComponent.prototype.select = function (g, d, silent) {
        silent = silent ? false : silent;
        if (!silent) {
            this.activeGroup = g;
        }
        var dataPoint = d.hasOwnProperty('data') ? d.data : d;
        if (!silent) {
            this.bdPieChartService.activeDataPoint = dataPoint;
        }
    };
    BdPieChartComponent.prototype.polarToCartesian = function (R, theta) {
        return { x: R * Math.cos(theta), y: R * Math.sin(theta) };
    };
    BdPieChartComponent.prototype.renderChart = function () {
        var _this = this;
        this.renderTimer = setTimeout(function () {
            clearTimeout(_this.renderTimer);
            if (_this.view === 'donut') {
                _this.getSvgElements();
                if (!_this.svg) {
                    return;
                }
                _this.clearChart();
                _this.resizeChart(_this.svg);
                _this.renderPieChart(_this.data.dataPoints);
            }
            else if (_this.view === 'stackedBar') {
                _this.renderStackedBarChart(_this.data.dataPoints);
            }
        });
    };
    BdPieChartComponent.prototype.renderStackedBarChart = function (dataPoints) {
        var _this = this;
        dataPoints.forEach(function (d) {
            _this.assignColor(d);
        });
        this.onRenderComplete();
    };
    BdPieChartComponent.prototype.renderBlankPieChart = function (svg) {
        var _this = this;
        this.radius1p = this.radius * 0.01;
        this.innerRadius = this.radius1p * this.innerRadiusPercent;
        var pie$$1 = pie()
            .sort(null)
            .value(function (d) {
            return d;
        });
        var arc$$1 = arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.radius)
            .startAngle(function (d) {
            return d.startAngle + _this.angleShift;
        })
            .endAngle(function (d) {
            return d.endAngle + _this.angleShift;
        });
        var arcShadow;
        if (this.state === this.states.LOADING) {
            svg.classList.add(this.rotationCls);
        }
        else {
            svg.classList.remove(this.rotationCls);
        }
        arcShadow = arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.innerRadiusShadow * this.radius1p)
            .startAngle(function (d) {
            return d.startAngle + _this.angleShift;
        })
            .endAngle(function (d) {
            return d.endAngle + _this.angleShift;
        });
        var center = this.getCanvasCenter(svg);
        var g = select(svg).append('g')
            .attr('transform', 'translate(' + center.x + ',' + center.y + ')');
        g.selectAll('path')
            .data(pie$$1([0.20, 0.80]))
            .enter()
            .append('g')
            .attr('class', 'ng2-c-pie-chart__group')
            .append('path')
            .attr('class', function (d, k) {
            return 'ng2-c-pie-chart__arc ' + PIECHART_SETTINGS.colorBlankClass + k;
        })
            .attr('d', function (d) {
            d.radiusShift = 1;
            return arc$$1(d);
        });
        if (this.state === this.states.LOADING) {
            // only add inner arc for first 'outer' arc
            g.select('g.ng2-c-pie-chart__group')
                .append('path')
                .attr('class', function (d, k) {
                return 'ng2-c-pie-chart__arc--inner ' + PIECHART_SETTINGS.colorBlankClass + k;
            })
                .attr('d', arcShadow);
        }
        else {
            g.selectAll('g.ng2-c-pie-chart__group')
                .append('path')
                .attr('class', 'ng2-c-pie-chart__arc--inner')
                .attr('d', arcShadow);
        }
        this.onRenderComplete();
    };
    BdPieChartComponent.prototype.onRenderComplete = function () {
        if (this.state === this.states.DATA) {
            if (this.svgBlank)
                this.svgBlank.textContent = '';
            this.state = this.states.RENDERD;
        }
        if (this.state !== this.states.LOADING && this.svgBlank) {
            this.svgBlank.classList.remove(this.rotationCls);
        }
    };
    BdPieChartComponent.prototype.transformDataPointValue = function (d, min$$1, absoluteValues) {
        var e = JSON.parse(JSON.stringify(d));
        if (absoluteValues) {
            e.displayValue = Math.abs(e.value);
        }
        else {
            e.displayValue = e.value !== Math.abs(e.value) || e.value === 0 ? min$$1 : e.value;
        }
        return e;
    };
    BdPieChartComponent.prototype.transformData = function (dataPoints) {
        var _this = this;
        var total = sum(dataPoints, function (d) {
            return d.value;
        });
        var isTotalNegative = total <= 0;
        var data = [];
        var dataDomain = scaleLinear().range([min(dataPoints, function (d) { return Math.max(0, d.value); }), sum(dataPoints, function (d) { return Math.max(0, d.value); })]); // tslint:disable-line
        var onePercent = dataDomain(0.01);
        dataPoints.forEach(function (d) {
            var e = _this.transformDataPointValue(d, onePercent, isTotalNegative);
            data.push(e);
        });
        return {
            isTotalNegative: isTotalNegative,
            data: data
        };
    };
    BdPieChartComponent.prototype.renderPieChart = function (dataPoints) {
        var _this = this;
        this.radius1p = this.radius * 0.01;
        this.innerRadius = this.radius1p * this.innerRadiusPercent;
        var transformedData = this.transformData(dataPoints);
        var data = transformedData.data;
        var isTotalNegative = transformedData.isTotalNegative;
        var that = this;
        var pie$$1 = pie()
            .value(function (d) {
            return d.displayValue;
        })
            .sort(null);
        if (isTotalNegative) {
            pie$$1.sort(function (a, b) {
                if (a.value < b.value) {
                    return -1;
                }
                else if (a.value > b.value) {
                    return 1;
                }
                return 0;
            });
        }
        var arc$$1 = arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.radius)
            .startAngle(function (d) {
            return d.startAngle + _this.angleShift;
        })
            .endAngle(function (d) {
            return d.endAngle + _this.angleShift;
        });
        var arcShadow;
        if (this.view === 'donut') {
            arcShadow = arc()
                .innerRadius(this.innerRadius)
                .outerRadius(this.innerRadiusShadow * this.radius1p)
                .startAngle(function (d) {
                return d.startAngle + _this.angleShift;
            })
                .endAngle(function (d) {
                return d.endAngle + _this.angleShift;
            });
        }
        var center = this.getCanvasCenter(this.svg);
        // center of chart is origin
        var g = select(this.svg).append('g')
            .attr('transform', 'translate(' + center.x + ',' + center.y + ')');
        var self = this;
        // no arrow function please
        var onClick = function (d) {
            var g = this;
            event.preventDefault();
            event.stopPropagation();
            if (event.touches && event.touches.length > 1) {
                return;
            }
            self.groupSelectHandler(g, d);
        };
        var path = g.selectAll('path')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'ng2-c-pie-chart__group')
            .append('path')
            .attr('class', function (d) {
            return 'ng2-c-pie-chart__arc ' + PIECHART_SETTINGS.colorFillClass + _this.assignColor(d);
        })
            .each(function (data, idx) {
            self._current = { startAngle: 0, endAngle: 0 };
            var id = 'ng2-c-pie-chart__group-' + self.uniqueId + '-' + idx;
            this.parentNode.setAttribute('id', id);
        });
        var pathInner;
        if (this.view === 'donut') {
            pathInner = g.selectAll('g.ng2-c-pie-chart__group')
                .append('path')
                .attr('class', 'ng2-c-pie-chart__arc--inner')
                .each(function () {
                _this._current = { startAngle: 0, endAngle: 0 };
            });
        }
        var animate = function (d) {
            path.data(pie$$1.value(function (g) {
                return g.displayValue;
            })(d))
                .transition()
                .duration(_this.transitionDurationSlow)
                .attrTween('d', function (d) {
                var interpolate$$1 = interpolate(_this._current, d);
                _this._current = interpolate$$1(0);
                return function (t) {
                    return arc$$1(interpolate$$1(t));
                };
            })
                .on('end', function (d, idx) {
                that.addLabel(select(this.parentNode), d);
                if (idx === path.size() - 1) {
                    // add click event after animation is complete
                    g.selectAll('.ng2-c-pie-chart__group').on(that.clickEvent, onClick);
                    that.onRenderComplete();
                }
            });
            if (_this.view === 'donut') {
                pathInner.data(pie$$1.value(function (g) {
                    return g.displayValue;
                })(d))
                    .transition()
                    .duration(_this.transitionDurationSlow)
                    .attrTween('d', function (d) {
                    var interpolate$$1 = interpolate(_this._current, d);
                    _this._current = interpolate$$1(0);
                    return function (t) {
                        return arcShadow(interpolate$$1(t));
                    };
                });
            }
        };
        animate(data);
    };
    BdPieChartComponent.prototype.groupSelectHandler = function (g, dataPoint) {
        var _this = this;
        // $timeout because we are outside the angular digest loop
        setTimeout(function () {
            var showSelection = _this.view === 'donut' && _this.showSelection ? _this.onShowSelection.emit({ dataPoint: dataPoint }) : true;
            if (_this.activeGroup && _this.activeGroup.getAttribute('id') === g.getAttribute('id')) {
                if (dataPoint && _this.isDrilldownEnabled(dataPoint)) {
                    _this.onClick(_this.bdPieChartService.activeDataPoint, 'chart-click');
                }
                else {
                    // unselect the arc
                    if (showSelection) {
                        _this.slideIn(d3, g);
                    }
                    // this.unselect(g);
                    // this.unselect(g);
                    _this.unselect();
                }
            }
            else if (_this.activeGroup) {
                if (showSelection) {
                    _this.slideIn(d3, _this.activeGroup);
                    _this.slideOut(d3, g);
                }
                // this.unselect(this.activeGroup);
                // this.unselect(this.activeGroup);
                _this.unselect();
                _this.select(g, dataPoint);
            }
            else {
                if (showSelection) {
                    _this.slideOut(d3, g);
                }
                _this.select(g, dataPoint);
            }
        });
    };
    /**
     * Animation after clicking an active segment
     * @param d3
     * @param g
     */
    /**
         * Animation after clicking an active segment
         * @param d3
         * @param g
         */
    BdPieChartComponent.prototype.slideIn = /**
         * Animation after clicking an active segment
         * @param d3
         * @param g
         */
    function (d3$$1, g) {
        var _this = this;
        var arc$$1 = d3$$1.arc()
            .startAngle(function (d) {
            return d.startAngle + _this.angleShift;
        })
            .endAngle(function (d) {
            return d.endAngle + _this.angleShift;
        });
        var animate = function (elm, outerRadius) {
            d3$$1.select(elm)
                .transition()
                .duration(_this.transitionDuration)
                .ease(_this.transitionEase)
                .attrTween('d', function (d) {
                var k = d3$$1.interpolate(_this.radius * 0.15, 0); // the amount to shrink outerRadius by
                var l = d3$$1.interpolate(d.padAngle, 0); // the padding between arcs
                d.padAngle = 0;
                return function (t) {
                    d.outerRadius = outerRadius + k(t);
                    d.innerRadius = _this.innerRadius + k(t);
                    d.padAngle = l(t);
                    return arc$$1(d);
                };
            });
        };
        var animateLabel = function (elm, outerRadius) {
            var that = _this;
            var label = d3$$1.select(elm);
            label
                .transition()
                .duration(that.transitionDuration)
                .ease(that.transitionEase)
                .attrTween('transform', function () {
                var current = this._current;
                var pos = that.polarToCartesian(outerRadius, current.angle - Math.PI * 0.5);
                var x = d3$$1.interpolate(current.position.x, pos.x);
                var y = d3$$1.interpolate(current.position.y, pos.y);
                this._current.position = pos;
                return function (t) { return 'translate(' + x(t) + ',' + y(t) + ')'; };
            })
                .on('start', function (d) {
                label
                    .attr('class', 'ng2-c-pie-chart__label')
                    .text(function () {
                    var updateLabel = that.data ? that.bdPieChartService._callFormatter(that.data.percentageFormatter, d, 'chart') : '';
                    if (updateLabel !== label.text()) {
                        label.attr('class', 'ng2-c-pie-chart__label ng2-c-pie-chart__label--fadeout');
                    }
                    return updateLabel;
                });
            })
                .on('end', function () {
                label.attr('class', 'ng2-c-pie-chart__label');
            });
        };
        animate(g.querySelector('.ng2-c-pie-chart__arc'), this.radius);
        animate(g.querySelector('.ng2-c-pie-chart__arc--inner'), this.innerRadiusShadow * this.radius1p);
        animateLabel(g.querySelector('.ng2-c-pie-chart__label'), this.radius + this.radius1p * this.labelRadiusPercent);
    };
    /**
     * Add label to pie chart
     * @param g
     * @param d
     */
    /**
         * Add label to pie chart
         * @param g
         * @param d
         */
    BdPieChartComponent.prototype.addLabel = /**
         * Add label to pie chart
         * @param g
         * @param d
         */
    function (g, d) {
        var _this = this;
        var that = this;
        var text = this.data ? this.bdPieChartService._callFormatter(this.data.percentageFormatter, d.data, 'chart') : '';
        var isMultiline = Array.isArray(text);
        var lineHeight = 1.2;
        var distanceToChartEdge;
        var pos;
        var angle;
        var label = g.append('text')
            .attr('transform', function () {
            angle = d.startAngle + that.angleShift + (d.endAngle - d.startAngle) * 0.5;
            var r = that.radius + that.radius1p * that.labelRadiusPercent;
            pos = that.polarToCartesian(r, angle - Math.PI * 0.5);
            this._current = { angle: angle, radius: that.radius, position: pos };
            return 'translate(' + pos.x + ',' + pos.y + ')';
        })
            .attr('class', function () {
            var a = angle - _this.angleShift;
            var side = (a < Math.PI * 0.5 || a > Math.PI * 1.5) ? 'right' : 'left';
            distanceToChartEdge = _this.svg.getAttribute('width') * 0.5 - Math.abs(pos.x);
            return 'ng2-c-pie-chart__label ng2-c-pie-chart__label--' + side;
        });
        if (isMultiline) {
            var labelSpans = text.map(function (t) {
                return label.append('tspan')
                    .text(t + ' ')
                    .style('fill-opacity', 0)
                    .node();
            });
            var doSplitLabel = label.node().getBBox().width > distanceToChartEdge;
            if (doSplitLabel) {
                labelSpans.forEach(function (l) {
                    l.setAttribute('x', 1);
                    l.setAttribute('dy', lineHeight + 'em');
                    l.style.fillOpacity = '';
                });
                // move multiline label up to account for new height
                label.attr('y', (-0.5 * lineHeight * text.length) + 'em');
            }
            else {
                labelSpans.forEach(function (l) {
                    l.style.fillOpacity = '';
                });
            }
            // last tspan holds value
            if (d.data && d.data.color) {
                labelSpans[labelSpans.length - 1]
                    .setAttribute('class', 'ng2-c-chart-color--value ' + PIECHART_SETTINGS.colorFillClass + (d.data.labelColor || d.data.color));
            }
            this.labelBorder(label, g);
        }
        else {
            label.text(text);
        }
    };
    BdPieChartComponent.prototype.labelBorder = function (text, g) {
        var rect = text.node().getBBox();
        var offsetX = 6;
        var offsetY = 2;
        var pathinfo = [
            { x: rect.x - offsetX, y: rect.y - offsetY },
            { x: rect.x + offsetX + rect.width, y: rect.y - offsetY },
            { x: rect.x + offsetX + rect.width, y: rect.y + rect.height + offsetY },
            { x: rect.x - offsetX, y: rect.y + rect.height + offsetY },
            { x: rect.x - offsetX, y: rect.y - offsetY }
        ];
        var d3line = line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
        g.append('path')
            .attr('d', d3line(pathinfo))
            .attr('class', PIECHART_SETTINGS.labelBorderClass)
            .attr('shape-rendering', 'crispEdges')
            .attr('transform', text.attr('transform'));
    };
    /**
     * Animation after clicking a segment
     * @param d3
     * @param g
     */
    /**
         * Animation after clicking a segment
         * @param d3
         * @param g
         */
    BdPieChartComponent.prototype.slideOut = /**
         * Animation after clicking a segment
         * @param d3
         * @param g
         */
    function (d3$$1, g) {
        var _this = this;
        var arc$$1 = d3$$1.arc()
            .startAngle(function (d) {
            return d.startAngle + _this.angleShift;
        })
            .endAngle(function (d) {
            return d.endAngle + _this.angleShift;
        });
        var animate = function (elm, outerRadius, add) {
            d3$$1.select(elm)
                .transition()
                .duration(_this.transitionDuration)
                .ease(_this.transitionEase)
                .attrTween('d', function (d) {
                // the amount to grow outerRadius by
                var k = d3$$1.interpolate(0, _this.radius * 0.15);
                // the padding between arcs, use smaller padding for small arcs
                var l = d3$$1.interpolate(0, d.endAngle - d.startAngle > 0.1 ? 0.08 : 0.02);
                d.innerRadius = _this.innerRadius;
                d.padAngle = 0;
                return function (t) {
                    d.outerRadius = outerRadius + k(t);
                    d.innerRadius = _this.innerRadius + k(t);
                    d.padAngle = l(t) + add;
                    return arc$$1(d);
                };
            });
        };
        var animateLabel = function (elm, outerRadius) {
            var that = _this;
            var label = d3$$1.select(elm);
            label
                .transition()
                .duration(that.transitionDuration)
                .ease(that.transitionEase)
                .attrTween('transform', function () {
                var current = this._current;
                var pos = that.polarToCartesian(outerRadius, current.angle - Math.PI * 0.5);
                var x = d3$$1.interpolate(current.position.x, pos.x);
                var y = d3$$1.interpolate(current.position.y, pos.y);
                this._current.position = pos;
                return function (t) { return 'translate(' + x(t) + ',' + y(t) + ')'; };
            })
                .on('start', function (d) {
                label.text(function () {
                    var updateLabel = that.data ? that.bdPieChartService._callFormatter(that.data.percentageFormatter, d, 'chart', 'slide') : '';
                    if (updateLabel !== label.text()) {
                        label.attr('class', 'ng2-c-pie-chart__label ng2-c-pie-chart__label--fadein');
                    }
                    return updateLabel;
                });
            });
        };
        animate(g.querySelector('.ng2-c-pie-chart__arc'), this.radius, 0);
        animate(g.querySelector('.ng2-c-pie-chart__arc--inner'), this.innerRadiusShadow * this.radius1p, 0.02);
        animateLabel(g.querySelector('.ng2-c-pie-chart__label'), this.radius + this.radius1p * this.labelRadiusPercentSlide);
    };
    BdPieChartComponent.prototype.onContainerClick = function (evt) {
        if (!evt.target || !this.activeGroup) {
            return;
        }
        var target = evt.target;
        if (evt.target.nodeName === 'svg' || target.hasClass('ng2-c-pie-chart') || evt.target.nodeName === 'bd-pie-chart-legend') {
            this.groupSelectHandler(this.activeGroup);
        }
    };
    BdPieChartComponent.prototype.hasValidDataPointArray = function (dataPoints) {
        return !(!Array.isArray(dataPoints) ||
            dataPoints.length === 0 ||
            dataPoints.length === 1 && dataPoints[0].value === 0);
    };
    BdPieChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-pie-chart2',
                    template: "<div #svgBlank class=\"ng2-c-pie-chart__chart ng2-c-pie-chart__chart--blank\" [ngClass]=\"{'ng2-c-pie-chart__chart--loading': state === 'loading'}\" [hidden]=\"state === 'renderd' && !showCenter\">    <svg *ngIf=\"view === 'donut' && !showCenter\" #svg></svg>    <ng-container *ngIf=\"state === 'error' || state === 'empty'\">        <ng-content></ng-content>    </ng-container></div><div class=\"ng2-c-pie-chart__chart ng2-c-pie-chart__chart--data\" *ngIf=\"view === 'donut'\" [hidden]=\"state !== 'data' && state !== 'renderd'\">    <svg></svg></div><bd-pie-chart-legend2 *ngIf=\"showLegend\" [items]=\"data?.dataPoints\" [view]=\"view\" [state]=\"state\"></bd-pie-chart-legend2>",
                    providers: [BdPieChartService],
                    host: { 'class': 'ng2-c-pie-chart' }
                },] },
    ];
    /** @nocollapse */
    BdPieChartComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: BdDeviceService, },
        { type: BdPieChartService, },
    ]; };
    BdPieChartComponent.propDecorators = {
        "data": [{ type: Input },],
        "loading": [{ type: Input },],
        "error": [{ type: Input },],
        "radius": [{ type: Input },],
        "labelRadius": [{ type: Input },],
        "innerRadius": [{ type: Input },],
        "showLegend": [{ type: Input },],
        "showCenter": [{ type: Input },],
        "showSelection": [{ type: Input },],
        "onShowSelection": [{ type: Output },],
        "onSelect": [{ type: Output },],
        "svgElRef": [{ type: ViewChild, args: ['svg',] },],
        "svgBlankElRef": [{ type: ViewChild, args: ['svgBlank',] },],
    };
    return BdPieChartComponent;
}());

var BdPieChartLegendComponent = /** @class */ (function () {
    function BdPieChartLegendComponent(bdPieChartService) {
        this.bdPieChartService = bdPieChartService;
    }
    BdPieChartLegendComponent.prototype.ngOnChanges = function (changes) {
        if (this.items && (changes.items || changes.view)) {
            this.prepareLegend();
        }
    };
    BdPieChartLegendComponent.prototype.select = function (dataPoint) {
        var action = 'legend-click';
        if (dataPoint === this.bdPieChartService.activeDataPoint && this.bdPieChartService.isDrilldownEnabled(dataPoint)) {
            // click on hightlighted chart legend item
            this.bdPieChartService.clickDataPoint.next({ dataPoint: dataPoint, action: action });
        }
        else if (this.view === 'stackedBar' && this.bdPieChartService.isDrilldownEnabled(dataPoint)) {
            // click on stackedbar chart legend item
            this.bdPieChartService.clickDataPoint.next({ dataPoint: dataPoint, action: action });
        }
        else {
            // click on none highlighted chart legend item
            this.bdPieChartService.selectDataPoint.next(dataPoint);
        }
    };
    BdPieChartLegendComponent.prototype.color = function (dataPoint) {
        if (!this.bdPieChartService.colorAssignmentOrder)
            return;
        var index = this.bdPieChartService.colorAssignmentOrder.indexOf(dataPoint.id);
        return index === -1 ? '' : PIECHART_SETTINGS.colorTextClass + index;
    };
    BdPieChartLegendComponent.prototype.showLegend = function () {
        return this.state === 'data' || this.state === 'renderd';
    };
    BdPieChartLegendComponent.prototype.isActiveItem = function (id) {
        return !!this.bdPieChartService.activeDataPoint && (id === this.bdPieChartService.activeDataPoint.id);
    };
    BdPieChartLegendComponent.prototype.prepareLegend = function () {
        var l;
        if (this.view === 'stackedBar') {
            this.left = [];
            this.right = this.items;
        }
        else if (this.view === 'donut') {
            l = Math.ceil(this.items.length * 0.5);
            if (l < 1) {
                this.left = this.items;
                this.right = [];
            }
            else {
                this.left = this.items.slice(0, l);
                this.right = this.items.slice(l);
            }
        }
    };
    BdPieChartLegendComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-pie-chart-legend2',
                    template: "<div class=\"ng2-c-legend ng2-c-legend--left\" *ngIf=\"showLegend()\">    <bd-pie-chart-legend-item2        class=\"ng2-c-legend__item\"        *ngFor=\"let item of left\"        (click)=\"select(item)\"        [ngClass]=\"{ 'ng2-c-legend__item--is-active': isActiveItem(item.id), 'ng2-c-legend__item--is-drilldown': item.drillDown.button === 'enabled' }\"        [item]=\"item\"        [color]=\"color(item)\" >    </bd-pie-chart-legend-item2></div><div class=\"ng2-c-legend ng2-c-legend--right\" *ngIf=\"showLegend()\">    <bd-pie-chart-legend-item2        class=\"ng2-c-legend__item\"        *ngFor=\"let item of right\"        (click)=\"select(item)\"        [ngClass]=\"{ 'ng2-c-legend__item--is-active': isActiveItem(item.id), 'ng2-c-legend__item--is-drilldown': item.drillDown.button === 'enabled' }\"        [item]=\"item\"        [color]=\"color(item)\" >    </bd-pie-chart-legend-item2></div><div class=\"ng2-c-legend ng2-c-legend--right\" *ngIf=\"view === 'stackedBar' && state === 'loading'\">    <div class=\"ng2-c-pie-chart-legend__item ng2-c-legend__item--empty\">        <div class=\"ng2-c-legend__bar\">            <span class=\"ng2-c-legend__bar--inner\">                <div class=\"ng2-c-loader ng2-c-loader--small\"></div>            </span>        </div>    </div></div>",
                    host: { 'class': 'ng2-c-pie-chart-legend' }
                },] },
    ];
    /** @nocollapse */
    BdPieChartLegendComponent.ctorParameters = function () { return [
        { type: BdPieChartService, },
    ]; };
    BdPieChartLegendComponent.propDecorators = {
        "items": [{ type: Input },],
        "view": [{ type: Input },],
        "state": [{ type: Input },],
        "colors": [{ type: Input },],
    };
    return BdPieChartLegendComponent;
}());

var BdPieChartLegendItemComponent = /** @class */ (function () {
    function BdPieChartLegendItemComponent(bdPieChartService) {
        this.bdPieChartService = bdPieChartService;
    }
    BdPieChartLegendItemComponent.prototype.getDetail = function (key) {
        return this.bdPieChartService.callFormatter(key, this.item, 'legend');
    };
    BdPieChartLegendItemComponent.prototype.selectArrow = function (event$$1) {
        event$$1.stopPropagation();
        var action = 'arrow-click';
        var dataPoint = this.item;
        this.bdPieChartService.clickDataPoint.next({ dataPoint: dataPoint, action: action });
    };
    BdPieChartLegendItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-pie-chart-legend-item2',
                    template: "<div class=\"ng2-c-legend__table\">    <span class=\"ng2-c-legend__cell ng2-c-legend__cell--index\">        <i class=\"ng2-c-legend__color\" [ngClass]=\"color\"></i>    </span>    <span class=\"ng2-c-legend__cell ng2-c-legend__cel--name\">        <span class=\"u-text--ellipses\">{{ getDetail('name') }}</span>    </span>    <span class=\"ng2-c-legend__cell ng2-c-legend__cell--percentage\">{{ getDetail('percentage') }}</span>    <span class=\"ng2-c-legend__cell ng2-c-legend__cell--value\">{{ getDetail('value') }}</span>    <span class=\"ng2-c-legend__cell ng2-c-legend__cell--action\" *ngIf=\"item.drillDown.button\">        <i class=\"ng2-c-legend__next icon-next-btn\" (click)=\"selectArrow($event)\"></i>    </span></div><div class=\"ng2-c-legend__bar\">    <span class=\"ng2-c-legend__bar--inner\" [ngClass]=\"color\" bdPieChartStyle [bdPieChartSize]=\"item.percentage\" [bdPieChartPercent]=\"true\">        <i class=\"ng2-c-legend__indicator\" [ngClass]=\"color\" bdPieChartStyle [bdPieChartSize]=\"item.percentage\">{{ getDetail('percentage') }}</i>    </span></div>",
                    host: { 'class': 'ng2-c-pie-chart-legend__item' }
                },] },
    ];
    /** @nocollapse */
    BdPieChartLegendItemComponent.ctorParameters = function () { return [
        { type: BdPieChartService, },
    ]; };
    BdPieChartLegendItemComponent.propDecorators = {
        "item": [{ type: Input },],
        "color": [{ type: Input },],
    };
    return BdPieChartLegendItemComponent;
}());

var BdPieChartStyleDirective = /** @class */ (function () {
    function BdPieChartStyleDirective(el) {
        this.el = el;
        this.bdPieChartPercent = false;
    }
    BdPieChartStyleDirective.prototype.ngOnInit = function () {
        var isOutside = 230 * 0.01 * this.bdPieChartSize < 80;
        this.el.nativeElement.classList.toggle('ng2-c-legend__indicator--outside', isOutside);
        this.el.nativeElement.classList.toggle('ng2-c-legend__indicator--inside', !isOutside);
        if (this.bdPieChartPercent) {
            var v = parseFloat(this.bdPieChartSize);
            // $ctrl.size should be between 0.25 and 100
            v = (isNaN(v) || !isFinite(v)) ? 0 : v < 0 ? 0.25 : Math.min(v, 100);
            this.el.nativeElement.style.width = v + "%";
        }
    };
    BdPieChartStyleDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[bdPieChartStyle]"
                },] },
    ];
    /** @nocollapse */
    BdPieChartStyleDirective.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    BdPieChartStyleDirective.propDecorators = {
        "bdPieChartSize": [{ type: Input },],
        "bdPieChartPercent": [{ type: Input },],
    };
    return BdPieChartStyleDirective;
}());

var components = [
    BdPieChartComponent,
    BdPieChartLegendComponent,
    BdPieChartLegendItemComponent,
    BdPieChartStyleDirective
];
var BdPieChartModule = /** @class */ (function () {
    function BdPieChartModule() {
    }
    BdPieChartModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components,
                    exports: components,
                    providers: [BdDeviceService]
                },] },
    ];
    /** @nocollapse */
    BdPieChartModule.ctorParameters = function () { return []; };
    return BdPieChartModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdPieChartLegendItemComponent as ɵd, BdPieChartLegendComponent as ɵc, BdPieChartStyleDirective as ɵe, BdPieChartComponent as ɵa, BdPieChartService as ɵb, BdPieChartModule };
//# sourceMappingURL=index.js.map
