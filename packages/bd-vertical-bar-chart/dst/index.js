import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, NgZone, Output, ViewChild } from '@angular/core';
import { BasePositioningData, BdAddFirstTimeTickIfMissingRenderer, BdAxisDataType, BdAxisDirection, BdAxisRenderer, BdAxisSvgQueries, BdBandAxisRenderConfig, BdCenterLabelsBetweenTicksRenderer, BdChartCoreModule, BdChartTemplateComponent, BdClipPathRenderer, BdCoordinates, BdGraphSizeHelper, BdMargins, BdNumericAxisRenderConfig, BdPositionStrategy, BdRemoveClippedLabelsRenderer, BdRenderQueue, BdRenderer, BdSize, BdTemplateSharedClasses, BdTemplateStyles, BdTickRenderer, BdTimeAxisRenderConfig, BdTransformChartRenderer } from '@delen/bd-chart-core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { BdDOMRect, BdDeviceService, BdEventService } from '@delen/bd-utilities';
import { mouse, select } from 'd3-selection';
import { easeCubicOut } from 'd3';
import { max, min } from 'd3-array';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';

/**
 * the way points can be selected on the chart
 */
/**
 * the way points can be selected on the chart
 */
var BdVerticalBarChartSelectionType;
/**
 * the way points can be selected on the chart
 */
(function (BdVerticalBarChartSelectionType) {
    BdVerticalBarChartSelectionType["None"] = "none";
    BdVerticalBarChartSelectionType["BarSelection"] = "barSelection";
})(BdVerticalBarChartSelectionType || (BdVerticalBarChartSelectionType = {}));

/**
 * these is just a helper class to define and build
 * css classes in one place
 */
var BdVerticalBarChartClasses = /** @class */ (function () {
    function BdVerticalBarChartClasses() {
    }
    BdVerticalBarChartClasses.barClass = 'ng2-c-bar-chart__bar';
    BdVerticalBarChartClasses.colorClass = 'ng2-c-chart-color--fill-';
    BdVerticalBarChartClasses.draggerSelectionOverlayClass = 'ng2-c-chart__selection--overlay';
    BdVerticalBarChartClasses.selectedClass = 'ng2-c-bar-chart__fake-bar-border';
    BdVerticalBarChartClasses.draggerArrowClass = 'ng2-c-chart__dragger--arrow';
    BdVerticalBarChartClasses.draggerLineClass = 'ng2-c-chart__dragger--line';
    BdVerticalBarChartClasses.areaClass = 'area';
    BdVerticalBarChartClasses.lineClass = 'line';
    return BdVerticalBarChartClasses;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BarPositioningData = /** @class */ (function (_super) {
    __extends(BarPositioningData, _super);
    function BarPositioningData(position, dataPoint, isOnLeftSideOfBar, container) {
        var _this = _super.call(this, position, dataPoint) || this;
        _this.position = position;
        _this.dataPoint = dataPoint;
        _this.isOnLeftSideOfBar = isOnLeftSideOfBar;
        _this.container = container;
        return _this;
    }
    return BarPositioningData;
}(BasePositioningData));

var BdVerticalBarChartSelectionManager = /** @class */ (function () {
    function BdVerticalBarChartSelectionManager(svgSelection, svgElement, renderConfig, verticalBarData, axisSvgQueries, container) {
        var _this = this;
        this.svgSelection = svgSelection;
        this.svgElement = svgElement;
        this.renderConfig = renderConfig;
        this.verticalBarData = verticalBarData;
        this.axisSvgQueries = axisSvgQueries;
        this.container = container;
        this.closestPointHandler = function () { return _this.getClosestDataPoint(); };
        this.verticalBarChartTemplateSubject = new Subject$1();
    }
    Object.defineProperty(BdVerticalBarChartSelectionManager.prototype, "onUpdateVerticalBarChartTemplate", {
        get: function () {
            return this.verticalBarChartTemplateSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdVerticalBarChartSelectionManager.prototype, "selectionAreaBoundingRect", {
        get: function () {
            return BdDOMRect.fromClientRect(this.svgElement.getBoundingClientRect());
        },
        enumerable: true,
        configurable: true
    });
    BdVerticalBarChartSelectionManager.prototype.init = function () {
        // draw an overlay over the graph with event handlers attached to make selections
        this.selectionOverlay = this.svgSelection
            .append('rect')
            .attr('class', BdVerticalBarChartClasses.draggerSelectionOverlayClass)
            .attr('width', this.renderConfig.size.width)
            .attr('height', this.renderConfig.size.height + this.renderConfig.margins.bottom)
            .on('touchmove', this.closestPointHandler)
            .on('mousemove', this.closestPointHandler);
    };
    BdVerticalBarChartSelectionManager.prototype.selectDataPoint = function (dataPoint) {
        // make a render react to the selection of a datapoint
        var bar = this.getBarForDataPoint(dataPoint);
        if (bar) {
            this.verticalBarChartTemplateSubject.next(this.getScreenCoords(dataPoint, bar));
        }
    };
    BdVerticalBarChartSelectionManager.prototype.destroy = function () {
        // d3 way of removing eventhandlers
        if (this.selectionOverlay) {
            this.selectionOverlay.on('touchmove', null);
            this.selectionOverlay.on('mousemove', null);
            this.selectionOverlay.on(this.bulletEventName, null);
        }
        // unsubscribe everything
        this.verticalBarChartTemplateSubject.unsubscribe();
    };
    /**
     * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
     * convert datapoint to svg coordinates and then
     * convert from svg coordinate system to screen position
     * we need these coordinates to position the verticalBar-chart template
     */
    /**
         * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
         * convert datapoint to svg coordinates and then
         * convert from svg coordinate system to screen position
         * we need these coordinates to position the verticalBar-chart template
         */
    BdVerticalBarChartSelectionManager.prototype.getScreenCoords = /**
         * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
         * convert datapoint to svg coordinates and then
         * convert from svg coordinate system to screen position
         * we need these coordinates to position the verticalBar-chart template
         */
    function (dataPoint, bar) {
        var svgPoint = this.svgElement.createSVGPoint();
        // convert the datapoint value to svg coordinates
        svgPoint.x = this.renderConfig.xRenderConfig.scale(dataPoint.x);
        svgPoint.y = this.renderConfig.yRenderConfig.scale(dataPoint.y);
        var barHeight = bar.getAttribute('height');
        svgPoint.y += barHeight * 0.5;
        var dataMiddle = this.renderConfig.xRenderConfig.min + ((this.renderConfig.xRenderConfig.max - this.renderConfig.xRenderConfig.min) * 0.5);
        var isOnLeftSideOfBar = dataPoint.x >= dataMiddle;
        if (!isOnLeftSideOfBar) {
            svgPoint.x += parseInt(bar.getAttribute('width'));
        }
        // transform the svg coordinates using the transformationmatrix of the bullet to get screen coordinates
        var screenPoint = svgPoint.matrixTransform(bar.getCTM());
        return new BarPositioningData(new BdCoordinates(screenPoint.x, screenPoint.y), dataPoint, isOnLeftSideOfBar, this.container);
    };
    /**
     * find (and select) the closest data point to the mouse position
     */
    /**
         * find (and select) the closest data point to the mouse position
         */
    BdVerticalBarChartSelectionManager.prototype.getClosestDataPoint = /**
         * find (and select) the closest data point to the mouse position
         */
    function () {
        var xAxisElement = this.axisSvgQueries.getAxis(BdAxisDirection.X).node();
        // get the mouse coordinates
        var mouseCoordinates = mouse(xAxisElement); // d3.mouse(container)
        var xCoordinateMouse = mouseCoordinates[0];
        // get all the bars
        var bars = this.svgSelection.selectAll('g > rect.ng2-c-bar-chart__bar').nodes();
        var fakeBarBorders = this.svgSelection.selectAll('g > rect.ng2-c-bar-chart__fake-bar-border').nodes();
        var smallestDistanceBetweenBarAndMouse = Number.MAX_VALUE;
        var smallestDistanceBar = bars[0];
        var smallestDistanceBarIndex = 0;
        var smallestDistanceBarDataPoint = { data: null, x: 0, y: 0 };
        for (var i = 0; i < (bars.length); i++) {
            // set all the selected bars attr to hidden
            fakeBarBorders[i].setAttribute('visibility', 'hidden');
            var bar = bars[i];
            // get the data attribute from the bar
            var dataPointFromAttr = bar.getAttribute('data-point');
            var dataPoint = { data: null, x: 0, y: 0 };
            if (dataPointFromAttr !== null) {
                var dataPointsFromAttr = dataPointFromAttr.split('_');
                if (dataPointsFromAttr[1] === '0') {
                    dataPoint.x = 0;
                    dataPoint.y = 0;
                    continue;
                }
                dataPoint.x = Number(dataPointsFromAttr[0]);
                dataPoint.y = parseFloat(dataPointsFromAttr[1]);
            }
            // get the width of a bar
            var barWidth = bar.getAttribute('width');
            // get the x coordinates of the center of the bars
            var barTopLeftCornerXCoordinate = bar.getAttribute('x');
            var barCenterXCoordinate = Number(barTopLeftCornerXCoordinate) + (barWidth / 2);
            // calculate the distance between bar and the xCoordinateMouse
            var distanceBetweenBarAndMouse = 0;
            // what is the biggest value barCenterXCoordinate or xCoordinateMouse?
            if (barCenterXCoordinate <= xCoordinateMouse) {
                distanceBetweenBarAndMouse = xCoordinateMouse - barCenterXCoordinate;
            }
            else {
                distanceBetweenBarAndMouse = barCenterXCoordinate - xCoordinateMouse;
            }
            // get the bar closest to the mouse coordinates
            if (distanceBetweenBarAndMouse < smallestDistanceBetweenBarAndMouse) {
                smallestDistanceBetweenBarAndMouse = distanceBetweenBarAndMouse;
                smallestDistanceBarIndex = i;
                smallestDistanceBarDataPoint = dataPoint;
                smallestDistanceBar = bar;
            }
        }
        // the bar with the least distance should be selected
        fakeBarBorders[smallestDistanceBarIndex].setAttribute('visibility', 'visible');
        var dataPointFromArray = this.verticalBarData.find(function (pointToFind) { return pointToFind.x === smallestDistanceBarDataPoint.x && pointToFind.y === smallestDistanceBarDataPoint.y; });
        if (dataPointFromArray) {
            this.verticalBarChartTemplateSubject.next(this.getScreenCoords(dataPointFromArray, smallestDistanceBar));
        }
    };
    BdVerticalBarChartSelectionManager.prototype.getBarForDataPoint = function (dataPoint) {
        var bars = this.svgSelection.selectAll('g > .ng2-c-bar-chart__bar').nodes();
        var fakeBarBorders = this.svgSelection.selectAll('g > rect.ng2-c-bar-chart__fake-bar-border').nodes();
        for (var i = 0; i < fakeBarBorders.length; i++) {
            fakeBarBorders[i].setAttribute('visibility', 'hidden');
        }
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            var attrDataPoint = bar.getAttribute('data-point');
            if (attrDataPoint && attrDataPoint === dataPoint.x + "_" + dataPoint.y) {
                fakeBarBorders[i].setAttribute('visibility', 'visible');
                return bar;
            }
        }
        return null;
    };
    return BdVerticalBarChartSelectionManager;
}());

var BdVerticalBarChartDefaultValues = /** @class */ (function () {
    function BdVerticalBarChartDefaultValues() {
        this.margins = {
            defaultMargins: new BdMargins(25, 0, 35, 0),
            draggerSelectionMargins: new BdMargins(65, 20, 35, 20)
        };
        this.defaultSize = new BdSize(240, 700);
        this.fakeBarBorderExtraSize = 4;
        this.dragger = {
            draggerElmWidth: 38,
            draggerElmHeight: 19
        };
        this.bullet = {
            bulletSize: 3.5,
            fadeDuration: 150,
            animationDuration: 750
        };
        this.animation = {
            transitionDuration: 750,
            transitionDurationFast: 250
        };
    }
    return BdVerticalBarChartDefaultValues;
}());
var bdVerticalBarChartDefaultValues = new BdVerticalBarChartDefaultValues();

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdBarRenderer = /** @class */ (function (_super) {
    __extends$1(BdBarRenderer, _super);
    function BdBarRenderer(renderQueue, svgSelection, renderConfig, barDataPoints, axisSvgQueries, renderFakeBarBorder, animate, selectionManager) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.barDataPoints = barDataPoints;
        _this.axisSvgQueries = axisSvgQueries;
        _this.renderFakeBarBorder = renderFakeBarBorder;
        _this.animate = animate;
        _this.selectionManager = selectionManager;
        return _this;
    }
    BdBarRenderer.prototype.render = function () {
        var _this = this;
        var xScale = this.renderConfig.xRenderConfig.scale;
        var yScale = this.renderConfig.yRenderConfig.scale;
        var animationDuration = 250;
        var animationDelay = 50;
        var fakeBarBorderExtraSize = bdVerticalBarChartDefaultValues.fakeBarBorderExtraSize;
        var barRoundedCornersSize = this.renderFakeBarBorder ? 4 : 0;
        var barClass = this.renderFakeBarBorder ? BdVerticalBarChartClasses.selectedClass : BdVerticalBarChartClasses.barClass;
        var barWidth = this.renderFakeBarBorder ? xScale.bandwidth() + (fakeBarBorderExtraSize * 2) : xScale.bandwidth();
        var barVisibility = this.renderFakeBarBorder ? 'hidden' : 'visible';
        var bars = this.svgSelection.selectAll("." + BdVerticalBarChartClasses.barClass)
            .data(this.barDataPoints)
            .enter()
            .append('rect')
            .attr('class', barClass)
            .attr('shape-rendering', 'crispEdges')
            .attr('x', function (d) {
            var x = xScale(d.x);
            return _this.renderFakeBarBorder ? x - fakeBarBorderExtraSize : x;
        })
            .attr('y', function (d) {
            if (_this.renderFakeBarBorder) {
                return yScale(d.y) - fakeBarBorderExtraSize;
            }
            else {
                if (_this.animate) {
                    return yScale(0);
                }
                else {
                    return yScale(d.y);
                }
            }
        })
            .attr('rx', barRoundedCornersSize)
            .attr('ry', barRoundedCornersSize)
            .attr('width', barWidth)
            .attr('height', function (d) {
            if (_this.renderFakeBarBorder) {
                var height = yScale(0) - yScale(d.y);
                return height + (fakeBarBorderExtraSize * 2);
            }
            else {
                if (_this.animate) {
                    return 0;
                }
                else {
                    return yScale(0) - yScale(d.y);
                }
            }
        })
            .attr('data-point', function (d) { return d.x + "_" + d.y; })
            .attr('visibility', barVisibility);
        if (this.renderFakeBarBorder) {
            this.finishRender();
        }
        else if (!this.animate) {
            if (this.selectionManager) {
                this.selectionManager.init();
            }
            this.finishRender();
        }
        else {
            var nrOfBarAnimationsFinished_1 = 0;
            bars.transition()
                .duration(animationDuration)
                .delay(function (d, idx) {
                // no animation delay if bar is invisible (height is 0)
                if (d.y === 0) {
                    return 0;
                }
                return (idx + 1) * animationDelay;
            })
                .ease(easeCubicOut)
                .attr('y', function (d) {
                return yScale(d.y);
            })
                .attr('height', function (d) {
                return yScale(0) - yScale(d.y);
            })
                .on('end', function () {
                nrOfBarAnimationsFinished_1++;
                if (nrOfBarAnimationsFinished_1 === bars.nodes().length) {
                    if (_this.selectionManager) {
                        _this.selectionManager.init();
                    }
                    _this.finishRender();
                }
            });
        }
    };
    return BdBarRenderer;
}(BdRenderer));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdEditBarLabelRenderer = /** @class */ (function (_super) {
    __extends$2(BdEditBarLabelRenderer, _super);
    function BdEditBarLabelRenderer(renderQueue, svgSelection, renderConfig, barDataPoints, axisSvgQueries) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.barDataPoints = barDataPoints;
        _this.axisSvgQueries = axisSvgQueries;
        return _this;
    }
    BdEditBarLabelRenderer.prototype.render = function () {
        this.axisSvgQueries = new BdAxisSvgQueries(this.svgSelection);
        var labels = this.axisSvgQueries.getLabels(BdAxisDirection.X).nodes();
        for (var i in this.barDataPoints) {
            var label = labels[i];
            label.textContent = this.renderConfig.xRenderConfig.labelFormatter(new Date(this.barDataPoints[i].x), 0);
        }
        this.finishRender();
    };
    return BdEditBarLabelRenderer;
}(BdRenderer));

var BdVerticalBarChartRenderComposition = /** @class */ (function () {
    function BdVerticalBarChartRenderComposition(element, renderConfig, verticalBarChartData, selectionType, animate, container) {
        this.element = element;
        this.renderConfig = renderConfig;
        this.verticalBarChartData = verticalBarChartData;
        this.selectionType = selectionType;
        this.animate = animate;
        this.container = container;
        // append a graphic element to the svg that will contain the whole chart
        this.svgSelection = select(element).append('g');
        // d3 is like jquery we use the svg selection manager so we only have to traverse the SVG dom once when making selections
        this.axisSvgQueries = new BdAxisSvgQueries(this.svgSelection);
        // this is used to capture events for selections
        this._selectionManager = new BdVerticalBarChartSelectionManager(this.svgSelection, this.element, this.renderConfig, this.verticalBarChartData, this.axisSvgQueries, this.container);
        // build all the subrenderers
        this.buildRenderQueue();
    }
    Object.defineProperty(BdVerticalBarChartRenderComposition.prototype, "verticalBarChartTemplateSubject", {
        get: function () {
            return this._selectionManager.onUpdateVerticalBarChartTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdVerticalBarChartRenderComposition.prototype, "selectionBoundingRect", {
        get: function () {
            return this._selectionManager.selectionAreaBoundingRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdVerticalBarChartRenderComposition.prototype, "onRenderFinished", {
        get: function () {
            return this.renderQueue.onRenderQueueFinished;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * render the whole queue
     */
    /**
                * render the whole queue
                */
    BdVerticalBarChartRenderComposition.prototype.render = /**
                * render the whole queue
                */
    function () {
        this.renderQueue.startRendering();
    };
    BdVerticalBarChartRenderComposition.prototype.destroy = function () {
        // unsubscribe observables and destroy event handlers
        this._selectionManager.destroy();
        // remove all nodes from the svg element
        this.svgSelection.node().parentNode.textContent = '';
    };
    /**
     * select a data point on the chart
     * @param {BdDataPoint} dataPoint
     */
    /**
                * select a data point on the chart
                * @param {BdDataPoint} dataPoint
                */
    BdVerticalBarChartRenderComposition.prototype.selectDataPoint = /**
                * select a data point on the chart
                * @param {BdDataPoint} dataPoint
                */
    function (dataPoint) {
        this._selectionManager.selectDataPoint(dataPoint);
    };
    /***
     * order of adding to the renderQueue is important because:
     * - some renderers modify elements created by previously executed renderers
     * - some stuff needs to be added after animations
     */
    /***
                * order of adding to the renderQueue is important because:
                * - some renderers modify elements created by previously executed renderers
                * - some stuff needs to be added after animations
                */
    BdVerticalBarChartRenderComposition.prototype.buildRenderQueue = /***
                * order of adding to the renderQueue is important because:
                * - some renderers modify elements created by previously executed renderers
                * - some stuff needs to be added after animations
                */
    function () {
        this.renderQueue = new BdRenderQueue();
        // render the axis and ticks
        this.renderQueue
            .add(new BdAxisRenderer(this.renderQueue, this.svgSelection, this.renderConfig.size, this.renderConfig.xRenderConfig))
            .add(new BdTickRenderer(this.renderQueue, this.svgSelection, this.renderConfig.size, this.renderConfig.xRenderConfig))
            .add(new BdAxisRenderer(this.renderQueue, this.svgSelection, this.renderConfig.size, this.renderConfig.yRenderConfig))
            .add(new BdTickRenderer(this.renderQueue, this.svgSelection, this.renderConfig.size, this.renderConfig.yRenderConfig))
            .add(new BdClipPathRenderer(this.renderQueue, this.svgSelection, this.renderConfig.size, this.renderConfig.id));
        if (this.renderConfig.yRenderConfig.dataType === BdAxisDataType.Date) {
            this.renderQueue
                .add(new BdAddFirstTimeTickIfMissingRenderer(this.renderQueue, this.renderConfig.yRenderConfig, this.axisSvgQueries))
                .add(new BdCenterLabelsBetweenTicksRenderer(this.renderQueue, this.renderConfig.yRenderConfig, this.axisSvgQueries, this.renderConfig.size));
        }
        this.renderQueue.add(new BdRemoveClippedLabelsRenderer(this.renderQueue, this.axisSvgQueries));
        this.renderQueue.add(new BdEditBarLabelRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.verticalBarChartData, this.axisSvgQueries));
        // add some transformations to the chart to make everything fit
        this.renderQueue.add(new BdTransformChartRenderer(this.renderQueue, this.svgSelection, this.renderConfig.xRenderConfig, this.renderConfig.yRenderConfig, this.axisSvgQueries, this.renderConfig.margins));
        if (this.selectionType === BdVerticalBarChartSelectionType.BarSelection) {
            this.renderQueue.add(new BdBarRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.verticalBarChartData, this.axisSvgQueries, true, this.animate));
            this.renderQueue.add(new BdBarRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.verticalBarChartData, this.axisSvgQueries, false, this.animate, this._selectionManager));
        }
        else {
            this.renderQueue.add(new BdBarRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.verticalBarChartData, this.axisSvgQueries, false, this.animate));
        }
    };
    return BdVerticalBarChartRenderComposition;
}());

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * the settings passed to the graph need to be translated to something d3 can use to render
 * this class holds values derived from the configuration bound to the chart component
 * these derived values can be used in d3
 * to get a better insight look at BdAxisRenderConfig which is derived from NumericAxisConfig and TimeAxisConfig
 */
var BdVerticalBarChartRenderConfig = /** @class */ (function () {
    function BdVerticalBarChartRenderConfig(svgElement, xAxisConfig, yAxisConfig, id, verticalBarChartData, container, chartHeight) {
        this.id = id;
        this.verticalBarChartData = verticalBarChartData;
        this.container = container;
        this.chartHeight = chartHeight;
        this.svgSelection = select(svgElement);
        // we need a copy of the margins because they will be adapted by the code and we don't want them to be changed when we rerender
        this.margins = __assign({}, bdVerticalBarChartDefaultValues.margins.defaultMargins);
        var yMin = this.getMinFromData(BdAxisDirection.Y);
        var yMax = this.getMaxFromData(BdAxisDirection.Y);
        this.size = new BdGraphSizeHelper(svgElement, this.margins, xAxisConfig, yAxisConfig, verticalBarChartData, yMin, yMax, bdVerticalBarChartDefaultValues.defaultSize, this.container, this.chartHeight).getSize();
        this.xRenderConfig = new BdBandAxisRenderConfig(BdAxisDirection.X, xAxisConfig, this.size, this.getMinFromData(BdAxisDirection.X), this.getMaxFromData(BdAxisDirection.X), this.verticalBarChartData);
        switch (yAxisConfig.dataType) {
            case BdAxisDataType.Date:
                this.yRenderConfig = new BdTimeAxisRenderConfig(BdAxisDirection.Y, yAxisConfig, this.size, this.getMinFromData(BdAxisDirection.Y), this.getMaxFromData(BdAxisDirection.Y), this.verticalBarChartData);
                break;
            case BdAxisDataType.Number:
                this.yRenderConfig = new BdNumericAxisRenderConfig(BdAxisDirection.Y, yAxisConfig, this.size, this.getMinFromData(BdAxisDirection.Y), this.getMaxFromData(BdAxisDirection.Y), this.verticalBarChartData);
                break;
            default:
                break;
        }
    }
    // get the minimum x or y (depending on axis direction) from the data
    // get the minimum x or y (depending on axis direction) from the data
    BdVerticalBarChartRenderConfig.prototype.getMinFromData = 
    // get the minimum x or y (depending on axis direction) from the data
    function (axisDirection) {
        var min$$1 = Number.MAX_VALUE;
        var lineDataMin = min(this.verticalBarChartData, function (dataPoint) { return axisDirection === BdAxisDirection.X ? dataPoint.x : dataPoint.y; });
        min$$1 = Math.min(lineDataMin, min$$1);
        return min$$1;
    };
    // get the maximum x or y (depending on axis direction) from the data
    // get the maximum x or y (depending on axis direction) from the data
    BdVerticalBarChartRenderConfig.prototype.getMaxFromData = 
    // get the maximum x or y (depending on axis direction) from the data
    function (axisDirection) {
        var max$$1 = Number.MIN_VALUE;
        var lineDataMax = max(this.verticalBarChartData, function (dataPoint) { return axisDirection === BdAxisDirection.X ? dataPoint.x : dataPoint.y; });
        max$$1 = Math.max(lineDataMax, max$$1);
        return max$$1;
    };
    return BdVerticalBarChartRenderConfig;
}());

var BdD3VerticalBarChart = /** @class */ (function () {
    function BdD3VerticalBarChart(svgElement, xAxisConfig, yAxisConfig, verticalBarChartData, selectionType, id, container, animate, chartHeight) {
        this.svgElement = svgElement;
        this.verticalBarChartData = verticalBarChartData;
        this.renderConfig = new BdVerticalBarChartRenderConfig(this.svgElement, xAxisConfig, yAxisConfig, id, verticalBarChartData, container, chartHeight);
        this.verticalBarChartRenderComposition = new BdVerticalBarChartRenderComposition(this.svgElement, this.renderConfig, verticalBarChartData, selectionType, animate, container);
    }
    Object.defineProperty(BdD3VerticalBarChart.prototype, "verticalBarChartTemplateSubject", {
        get: function () {
            return this.verticalBarChartRenderComposition.verticalBarChartTemplateSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdD3VerticalBarChart.prototype, "selectionBoundingRect", {
        get: function () {
            return this.verticalBarChartRenderComposition.selectionBoundingRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdD3VerticalBarChart.prototype, "onRenderFinished", {
        get: function () {
            return this.verticalBarChartRenderComposition.onRenderFinished;
        },
        enumerable: true,
        configurable: true
    });
    BdD3VerticalBarChart.prototype.render = function () {
        this.verticalBarChartRenderComposition.render();
    };
    BdD3VerticalBarChart.prototype.destroy = function () {
        this.verticalBarChartRenderComposition.destroy();
    };
    BdD3VerticalBarChart.prototype.selectDataPoint = function (dataPoint) {
        this.verticalBarChartRenderComposition.selectDataPoint(dataPoint);
    };
    return BdD3VerticalBarChart;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdBarTemplatePositionStrategy = /** @class */ (function (_super) {
    __extends$3(BdBarTemplatePositionStrategy, _super);
    function BdBarTemplatePositionStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BdBarTemplatePositionStrategy.prototype.calculatePosition = function (templateWrapperElement, barPositioningData) {
        var containerElement = barPositioningData.container;
        var templateDomRect = BdDOMRect.fromClientRect(templateWrapperElement.getBoundingClientRect());
        var containerDomRect = BdDOMRect.fromClientRect(barPositioningData.container.getBoundingClientRect());
        var wrapperHeight = templateDomRect.height;
        var wrapperWidth = templateDomRect.width;
        var spacing = 5;
        var containerStyle = window.getComputedStyle(containerElement);
        var paddingTop = containerStyle.paddingTop !== null ? parseFloat(containerStyle.paddingTop) : 0;
        var paddingBottom = containerStyle.paddingBottom !== null ? parseFloat(containerStyle.paddingBottom) : 0;
        var containerPaddingTotal = paddingTop + paddingBottom;
        var maxYPosition = containerDomRect.height - wrapperHeight - spacing - containerPaddingTotal;
        var fakeBarBorderExtraSize = bdVerticalBarChartDefaultValues.fakeBarBorderExtraSize;
        var arrowPosition = barPositioningData.position.y - maxYPosition;
        var bdTemplateStyle = new BdTemplateStyles();
        /* Add the classes that need to be set default */
        bdTemplateStyle.classes += BdTemplateSharedClasses.calloutClass + " " + BdTemplateSharedClasses.calloutFadeInClass;
        /* Calculate the horizontal/x position */
        if (barPositioningData.isOnLeftSideOfBar) {
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowLeftClass + " "; // position the template on the left and the arrow on the right side
            bdTemplateStyle.templateStyle.left = barPositioningData.position.x - (wrapperWidth + fakeBarBorderExtraSize) + "px"; // set a left style to position horizontal (x)
        }
        else {
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowRightClass + " "; // position the template on the right and the arrow on the left side
            bdTemplateStyle.templateStyle.left = barPositioningData.position.x + fakeBarBorderExtraSize + "px";
        }
        /* Calculate the vertical/y position */
        if ((barPositioningData.position.y - wrapperHeight / 2) > maxYPosition) {
            bdTemplateStyle.templateStyle.top = maxYPosition + "px"; // align the template as low as possible
            bdTemplateStyle.arrowStyle.top = arrowPosition + "px";
        }
        else {
            bdTemplateStyle.templateStyle.top = barPositioningData.position.y - wrapperHeight / 2 + "px"; // align the template to the center of the bar
            bdTemplateStyle.arrowStyle.top = "50%";
        }
        return bdTemplateStyle;
    };
    return BdBarTemplatePositionStrategy;
}(BdPositionStrategy));

var BdVerticalBarChartComponent = /** @class */ (function () {
    function BdVerticalBarChartComponent(ngZone, bdEventService, bdDeviceService) {
        this.ngZone = ngZone;
        this.bdEventService = bdEventService;
        this.bdDeviceService = bdDeviceService;
        this.rendering = false;
        this.needsRerender = false;
        this.renderComplete$ = new Subject$1();
        this.chartDestroyed$ = new Subject$1();
        this.componentDestroyed$ = new Subject$1();
        this.selectedDataPointPropertyName = 'selectedDataPoint';
        this.selectionType = BdVerticalBarChartSelectionType.None;
        // event so we can react when the selected point is changed
        this.selectedDataPointChange = new EventEmitter();
        this.onRenderFinished = new EventEmitter();
        // generate a random id for the chart
        this.id = Math.floor(Math.random() * 1000000000).toString();
    }
    BdVerticalBarChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        var timeToDebounce = this.bdDeviceService.isIOS() ? 500 : 0;
        this.bdEventService
            .onWindowResizeOutsideZone
            .debounceTime(timeToDebounce)
            .takeUntil(this.componentDestroyed$)
            .subscribe(function () {
            if (_this.d3VerticalBarChart) {
                if (_this.rendering) {
                    _this.needsRerender = true;
                }
                else {
                    _this.rerender(false);
                }
            }
        });
    };
    BdVerticalBarChartComponent.prototype.ngOnChanges = function (changes) {
        // don't rerender when rendering is not finished
        this.positionStrategy = this.selectionType === BdVerticalBarChartSelectionType.BarSelection ? new BdBarTemplatePositionStrategy() : null;
        if (!this.rendering) {
            if (this.d3VerticalBarChart) {
                if (this.onlySelectedDataPointChanged(changes)) {
                    // the chart already exists and only the selected point has changed so we select it in the chart
                    this.d3VerticalBarChart.selectDataPoint(changes[this.selectedDataPointPropertyName].currentValue);
                }
                else {
                    // we need to rerender the chart because date, axis config or height has changed
                    this.rerender(true);
                }
            }
            else {
                // first time rendering the chart
                this.renderChart(true);
            }
        }
    };
    BdVerticalBarChartComponent.prototype.ngOnDestroy = function () {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
        this.renderComplete$.next(true);
        this.renderComplete$.complete();
        this.chartDestroyed$.next(true);
        this.chartDestroyed$.complete();
    };
    // method to determine if we need to rerender or select a point
    // method to determine if we need to rerender or select a point
    BdVerticalBarChartComponent.prototype.onlySelectedDataPointChanged = 
    // method to determine if we need to rerender or select a point
    function (changes) {
        var count = 0;
        var nameFound = false;
        for (var propName in changes) {
            count++;
            nameFound = propName === this.selectedDataPointPropertyName;
        }
        return nameFound && count === 1;
    };
    BdVerticalBarChartComponent.prototype.renderChart = function (animate) {
        var _this = this;
        if (this.data &&
            this.data.length > 0 &&
            this.xAxisConfig &&
            this.yAxisConfig) {
            this.rendering = true;
            // make a new D3VerticalBarChart
            this.d3VerticalBarChart = new BdD3VerticalBarChart(this.chart.nativeElement, this.xAxisConfig, this.yAxisConfig, this.data, this.selectionType, this.id, this.container, animate, this.height);
            // subscribe to do some actions when rendering is finished
            this.d3VerticalBarChart.onRenderFinished
                .takeUntil(this.renderComplete$)
                .subscribe(function () { return _this.afterRender(); });
            // render the chart
            this.d3VerticalBarChart.render();
        }
    };
    BdVerticalBarChartComponent.prototype.afterRender = function () {
        var _this = this;
        this.renderComplete$.next(true);
        if (this.selectionType !== BdVerticalBarChartSelectionType.None) {
            // selections can be made on the chart, subscribe to get the data point, screen coordinates
            this.d3VerticalBarChart
                .verticalBarChartTemplateSubject
                .takeUntil(this.chartDestroyed$)
                .subscribe(function (barPositioningData) {
                // the events for the chart run outside the zone, we only need to run these changes inside the zone to update the template position
                // the events for the chart run outside the zone, we only need to run these changes inside the zone to update the template position
                _this.ngZone.run(function () {
                    // bind the point and its screen coordinates to the template
                    // bind the point and its screen coordinates to the template
                    _this.selectedDataPoint = barPositioningData.dataPoint;
                    _this.positioningData = barPositioningData;
                    // emit to the outside world that we selected a new point
                    // emit to the outside world that we selected a new point
                    _this.selectedDataPointChange.emit(_this.selectedDataPoint);
                });
            });
            // after rendering the chart we can select the datapoint
            if (this.selectedDataPoint) {
                this.d3VerticalBarChart.selectDataPoint(this.selectedDataPoint);
            }
        }
        if (!this.needsRerender) {
            this.rendering = false;
            // emit an event to the outside world to notify we have finished rendering
            // after this event we can render again
            this.onRenderFinished.emit();
        }
        else {
            this.needsRerender = false;
            this.rerender(false);
        }
    };
    BdVerticalBarChartComponent.prototype.rerender = function (animate) {
        this.renderComplete$.next(true);
        this.chartDestroyed$.next(true);
        this.positioningData = null;
        this.d3VerticalBarChart.destroy();
        this.rendering = true;
        this.renderChart(animate);
    };
    BdVerticalBarChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-vertical-bar-chart2',
                    template: "<div class=\"ng2-c-chart ng2-c-chart--vertical-bar\">    <ng-content></ng-content>    <bd-chart-template2 [positionStrategy]=\"positionStrategy\" [positioningData]=\"positioningData\">        <ng-content></ng-content>    </bd-chart-template2>    <svg #chart class=\"ng2-c-chart__svg\"></svg></div>"
                },] },
    ];
    /** @nocollapse */
    BdVerticalBarChartComponent.ctorParameters = function () { return [
        { type: NgZone, },
        { type: BdEventService, },
        { type: BdDeviceService, },
    ]; };
    BdVerticalBarChartComponent.propDecorators = {
        "chart": [{ type: ViewChild, args: ['chart',] },],
        "bdChartTemplate": [{ type: ViewChild, args: [BdChartTemplateComponent,] },],
        "height": [{ type: Input },],
        "data": [{ type: Input },],
        "xAxisConfig": [{ type: Input },],
        "yAxisConfig": [{ type: Input },],
        "selectedDataPoint": [{ type: Input },],
        "container": [{ type: Input },],
        "selectionType": [{ type: Input },],
        "selectedDataPointChange": [{ type: Output },],
        "onRenderFinished": [{ type: Output },],
    };
    return BdVerticalBarChartComponent;
}());

var components = [BdVerticalBarChartComponent];
var BdVerticalBarChartModule = /** @class */ (function () {
    function BdVerticalBarChartModule() {
    }
    BdVerticalBarChartModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, BdChartCoreModule],
                    declarations: components.slice(),
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdVerticalBarChartModule.ctorParameters = function () { return []; };
    return BdVerticalBarChartModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdVerticalBarChartComponent as ɵa, BdVerticalBarChartModule, BdVerticalBarChartSelectionType };
//# sourceMappingURL=index.js.map
