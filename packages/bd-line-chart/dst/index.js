import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, NgZone, Output, ViewChild } from '@angular/core';
import { BasePositioningData, BdAddFirstTimeTickIfMissingRenderer, BdAxisClasses, BdAxisDataType, BdAxisDirection, BdAxisRenderer, BdAxisSvgQueries, BdCenterLabelsBetweenTicksRenderer, BdChartCoreModule, BdChartTemplateComponent, BdClipPathRenderer, BdCoordinates, BdGraphSizeHelper, BdMargins, BdNumericAxisRenderConfig, BdPositionStrategy, BdRemoveClippedLabelsRenderer, BdRenderQueue, BdRenderer, BdSize, BdTemplateSharedClasses, BdTemplateStyles, BdTickRenderer, BdTimeAxisRenderConfig, BdTransformChartRenderer, BdTransformHelper } from '@delen/bd-chart-core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { BdDOMRect, BdDeviceService, BdEventService } from '@delen/bd-utilities';
import { mouse, select } from 'd3-selection';
import { area, line } from 'd3-shape';
import { easeLinear } from 'd3-ease';
import { bisector, max, min } from 'd3-array';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';

/**
 * the way points can be selected on the chart
 */
/**
 * the way points can be selected on the chart
 */
var BdChartSelectionType;
/**
 * the way points can be selected on the chart
 */
(function (BdChartSelectionType) {
    BdChartSelectionType["None"] = "none";
    BdChartSelectionType["Bullet"] = "bullet";
    BdChartSelectionType["Dragger"] = "dragger";
})(BdChartSelectionType || (BdChartSelectionType = {}));

var BdBulletPositionStrategy = /** @class */ (function () {
    function BdBulletPositionStrategy() {
    }
    BdBulletPositionStrategy.prototype.calculatePosition = function (templateWrapperElement, positioningData) {
        var wrapperHeight = templateWrapperElement.getBoundingClientRect().height;
        var wrapperWidth = templateWrapperElement.getBoundingClientRect().width;
        var arrowHeight = 18;
        var bdTemplateStyle = new BdTemplateStyles();
        var hasHalfWidthSpace = ((positioningData.position.x + (wrapperWidth * 0.5) + arrowHeight) < positioningData.boundingRect.width) && ((positioningData.position.x - (wrapperWidth * 0.5) - arrowHeight) > 0);
        /* Add the classes that need to be set default */
        bdTemplateStyle.classes += BdTemplateSharedClasses.calloutClass + " " + BdTemplateSharedClasses.calloutFadeInClass;
        /* Does the callout fit inside the grid?
                if so it will be displayed as top or bottom with the tip in the center
                if not it will be left or right with the tip at the side */
        if (positioningData.position.y - (wrapperHeight + arrowHeight) > 0 && hasHalfWidthSpace) {
            // the callout does not come out of the top of the chart so we can display above the point
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowTopClass + " ";
            bdTemplateStyle.templateStyle.top = positioningData.position.y - (wrapperHeight + arrowHeight) + "px";
            bdTemplateStyle.templateStyle.left = positioningData.position.x - (wrapperWidth * 0.5) + "px";
        }
        else if (positioningData.position.y < positioningData.boundingRect.height * 0.5 && hasHalfWidthSpace) {
            // the callout sticks out on top and needs top displayed at  below the point
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowBottomClass + " ";
            bdTemplateStyle.templateStyle.top = positioningData.position.y + arrowHeight + "px";
            bdTemplateStyle.templateStyle.left = positioningData.position.x - (wrapperWidth * 0.5) + "px";
        }
        else if (positioningData.position.x > positioningData.boundingRect.width * 0.5) {
            // the callout would stick out (see hasHalfWidthSpace) to the right of the chart (see if condition)
            // we position the tip of the callout to the left
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowLeftClass + " ";
            bdTemplateStyle.templateStyle.top = positioningData.position.y - (wrapperHeight * 0.5) + "px";
            bdTemplateStyle.templateStyle.left = positioningData.position.x - wrapperWidth - arrowHeight + "px";
        }
        else {
            // the callout would stick out (see hasHalfWidthSpace) to the left of the chart
            // we position the tip of the callout to the right
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowRightClass + " ";
            bdTemplateStyle.templateStyle.top = positioningData.position.y - (wrapperHeight * 0.5) + "px";
            bdTemplateStyle.templateStyle.left = positioningData.position.x + arrowHeight + "px";
        }
        return bdTemplateStyle;
    };
    return BdBulletPositionStrategy;
}());

var BdLineChartDefaultValues = /** @class */ (function () {
    function BdLineChartDefaultValues() {
        this.margins = {
            defaultMargins: new BdMargins(25, 0, 35, 2),
            draggerSelectionMargins: new BdMargins(65, 20, 35, 20)
        };
        this.defaultSize = new BdSize(240, 700);
        this.dragger = {
            draggerElmWidth: 38,
            draggerElmHeight: 19
        };
        this.transitionDurationFast = 250;
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
    return BdLineChartDefaultValues;
}());
var bdLineChartDefaultValues = new BdLineChartDefaultValues();

/**
 * these is just a helper class to define and build
 * css classes in one place
 */
var BdLineChartClasses = /** @class */ (function () {
    function BdLineChartClasses() {
    }
    BdLineChartClasses.getGradientClass = function (graphId) {
        return "ng2-c-chart__gradient-" + graphId;
    };
    BdLineChartClasses.bulletClass = 'ng2-c-chart__bullet';
    BdLineChartClasses.draggerSelectionOverlayClass = 'ng2-c-chart__selection--overlay';
    BdLineChartClasses.draggerClass = 'ng2-c-chart__dragger';
    BdLineChartClasses.draggerArrowClass = 'ng2-c-chart__dragger--arrow';
    BdLineChartClasses.draggerLineClass = 'ng2-c-chart__dragger--line';
    BdLineChartClasses.gradientStartClass = 'ng2-c-chart__gradient--start';
    BdLineChartClasses.gradientStopClass = 'ng2-c-chart__gradient--stop';
    BdLineChartClasses.areaClass = 'area';
    BdLineChartClasses.lineClass = 'line';
    return BdLineChartClasses;
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
var BdAnimatedLineRenderer = /** @class */ (function (_super) {
    __extends(BdAnimatedLineRenderer, _super);
    function BdAnimatedLineRenderer(renderQueue, svgSelection, renderConfig, lineData) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.lineData = lineData;
        return _this;
    }
    BdAnimatedLineRenderer.prototype.render = function () {
        var _this = this;
        // get the scale function for each axis
        var xScale = this.renderConfig.xRenderConfig.scale;
        var yScale = this.renderConfig.yRenderConfig.scale;
        // make a line function that will return the svg coordinates for each datapoint using the scales to transform between datapoint and svg coordinate space
        var resultLine = line() // tslint:disable-line
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); });
        // make another line function, only this one has y coordinate set to to lowest possible value of y-axis in the svg coordinate space
        // this will create function for creating a flat line on the y axis with points with x values that are the same as resultLine)
        var flatLine = line()
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(_this.renderConfig.yRenderConfig.min); });
        // append a path, points will be plotted using the animated line creating a flat path on the xAxis
        this.svgSelection.append('path')
            .attr('class', BdLineChartClasses.lineClass)
            .attr('clip-path', "url(#" + BdAxisClasses.getClipPathClass(this.renderConfig.id) + ")")
            .attr('d', flatLine(this.lineData));
        // animate the the values of the flat line
        this.svgSelection
            .selectAll('path.line')
            .transition()
            .duration(bdLineChartDefaultValues.animation.transitionDuration) // make a transition from the flat line to resultLine
            .attr('d', resultLine(this.lineData)) // the final values should be the ones of the result line
            .on('end', function () { return _this.finishRender(); });
    };
    return BdAnimatedLineRenderer;
}(BdRenderer));

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
var BdBulletRenderer = /** @class */ (function (_super) {
    __extends$1(BdBulletRenderer, _super);
    function BdBulletRenderer(renderQueue, svgSelection, renderConfig, lineData, selectionManager, animate) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.lineData = lineData;
        _this.selectionManager = selectionManager;
        _this.animate = animate;
        return _this;
    }
    BdBulletRenderer.prototype.render = function () {
        var _this = this;
        // for each data point in a lineData append a circle
        var bullets = this.svgSelection.selectAll('.' + BdLineChartClasses.bulletClass)
            .data(this.lineData)
            .enter()
            .append('circle')
            .attr('class', BdLineChartClasses.bulletClass)
            .attr('r', bdLineChartDefaultValues.bullet.bulletSize)
            .attr('cx', function (d) { return _this.renderConfig.xRenderConfig.scale(d.x); })
            .attr('cy', function (d) { return _this.renderConfig.yRenderConfig.scale(d.y); })
            .style('display', function (d, index) { return index === 0 ? 'none' : ''; }) // do not render the first bullet
            .style('opacity', this.animate ? 0 : 1); // we don't want them to be visible
        if (!this.animate) {
            this.finishRender();
        }
        else {
            bullets.transition() // add an animation
                .ease(easeLinear) // the animation should be linear in changing the value of opacity 0 to 1
                .duration(bdLineChartDefaultValues.bullet.fadeDuration) // the duration of the animation in total should 150ms
                .delay(function (d, idx) { return bdLineChartDefaultValues.bullet.animationDuration / _this.lineData.length * idx; }) // we an animation start delay depending on the index of the bullet
                .style('opacity', 1) // end value of opacity for the animation
                .on('end', function (d, idx) {
                // when the last bullet is animated we can continue the render-queue
                if (idx === _this.lineData.length - 1)
                    _this.finishRender();
            });
        }
    };
    BdBulletRenderer.prototype.finishRender = function () {
        var _this = this;
        // after all animations are finished initialize the selection manager
        this.selectionManager.init();
        this.selectionManager.onDataPointSelected.subscribe(function (dataPoint) { return _this.selectBullet(dataPoint); });
        // execute the next renderer
        _super.prototype.finishRender.call(this);
    };
    BdBulletRenderer.prototype.selectBullet = function (dataPoint) {
        var bullet;
        // select the bullet corresponding to the datapoint
        this.svgSelection.selectAll('circle').each(function (circleDataPoint, index, circles) {
            if (circleDataPoint.x === dataPoint.x && circleDataPoint.y === dataPoint.y) {
                bullet = circles[index];
            }
        });
        if (bullet) {
            // warn the line-chart template to update its position for the datapoint at the position of the bullet
            this.selectionManager.positionLineChartTemplate(dataPoint, bullet);
        }
    };
    return BdBulletRenderer;
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
var BdDraggerRenderer = /** @class */ (function (_super) {
    __extends$2(BdDraggerRenderer, _super);
    function BdDraggerRenderer(renderQueue, svgSelection, renderConfig, selectionManager) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.selectionManager = selectionManager;
        return _this;
    }
    BdDraggerRenderer.prototype.render = function () {
        var _this = this;
        // append a container for the dragger with the dragger class
        var draggerContainer = this.svgSelection.append('g').attr('class', BdLineChartClasses.draggerClass);
        // append a subcontainer for the different elements of the dragger
        this.draggerElement = draggerContainer.append('g');
        var draggerLineHeight = this.renderConfig.size.height - bdLineChartDefaultValues.dragger.draggerElmHeight - 10;
        // append the different elements of the dragger
        this.draggerElement.append('rect')
            .attr('y', 0)
            .attr('width', bdLineChartDefaultValues.dragger.draggerElmWidth)
            .attr('height', bdLineChartDefaultValues.dragger.draggerElmHeight)
            .attr('rx', 9);
        this.draggerElement.append('path')
            .attr('class', BdLineChartClasses.draggerArrowClass)
            .attr('transform', 'translate(0,-211)')
            .attr('d', 'M27.305 216.062l4.684 4.881v-.865l-4.684 4.881.901.865 4.684-4.881.415-.432-.415-.432-4.684-4.881zM10.5 215.865l-4.684 4.881v-.865l4.684 4.881-.901.865-4.684-4.881-.415-.432.415-.432 4.684-4.881z');
        this.draggerElement.append('path')
            .attr('class', BdLineChartClasses.draggerLineClass)
            .attr('transform', 'translate(0,-211)')
            .attr('d', 'M18.5 204.994c-1.224 3.488-4.559 5.993-8.486 6.006l-.014.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5l-.018-.558c-3.483-.395-6.364-2.761-7.482-5.948v-' + draggerLineHeight + 'h-1v' + draggerLineHeight + 'z');
        // append the bullet that covers the selected point
        this.bullet = draggerContainer.append('circle')
            .attr('r', 4);
        // init the selection manager, if a point is selected position the dragger
        this.selectionManager.init();
        this.selectionManager.onDataPointSelected.subscribe(function (dataPoint) { return _this.positionDragger(dataPoint); });
        this.finishRender();
    };
    BdDraggerRenderer.prototype.positionDragger = function (dataPoint) {
        var draggerOffsetBottom = this.renderConfig.size.height - (bdLineChartDefaultValues.dragger.draggerElmHeight * 0.5);
        // calculate the position of the dragger by using the scales to convert from datapoint coordinates to svg coordinates
        var x = this.renderConfig.xRenderConfig.scale(dataPoint.x);
        var y = this.renderConfig.yRenderConfig.scale(dataPoint.y);
        // coordinates of the maximum and minimum of the x-domain
        var xMax = this.renderConfig.xRenderConfig.scale(this.renderConfig.xRenderConfig.max);
        var xMin = this.renderConfig.xRenderConfig.scale(this.renderConfig.xRenderConfig.min);
        // don't position dragger outside of the domain that is drawn
        if (x <= xMin || x >= xMax)
            return;
        // position the bullet by setting center x and y
        this.bullet.attr('cx', x).attr('cy', y);
        // translate the dragger so it is positioned at the point
        var draggerOffsetLeft = x - bdLineChartDefaultValues.dragger.draggerElmWidth * 0.5;
        BdTransformHelper.applyTransformationToSelection(this.draggerElement, draggerOffsetLeft, draggerOffsetBottom);
        // warn the linechart template to update its position for the datapoint at the position of the bullet
        this.selectionManager.positionLineChartTemplate(dataPoint, this.bullet.node());
    };
    return BdDraggerRenderer;
}(BdRenderer));

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
var BdGradientRenderer = /** @class */ (function (_super) {
    __extends$3(BdGradientRenderer, _super);
    function BdGradientRenderer(renderQueue, svgSelection, renderConfig, lineData, animate) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.lineData = lineData;
        _this.animate = animate;
        return _this;
    }
    BdGradientRenderer.prototype.render = function () {
        var _this = this;
        // get the scale functions for each axis
        var xScale = this.renderConfig.xRenderConfig.scale;
        var yScale = this.renderConfig.yRenderConfig.scale;
        // make an area function that will return coordinates for the gradient
        var theArea = area()
            .x(function (d) { return xScale(d.x); }) // svg x coordinate of the gradient is datapoint.x converted to svg coordinate space by xScale
            .y0(function (d) { return yScale(_this.renderConfig.yRenderConfig.min); }) // svg y0 coordinate (gradient start) of the gradient is y min value of the axis converted to svg coordinate space by xScale
            .y1(function (d) { return yScale(d.y); }); // svg y1 coordinate (gradient stop) of the gradient is datapoint.x converted to svg coordinate space by xScale
        // make a gradient defenition
        var gradientDefenition = this.svgSelection.append('defs')
            .append('linearGradient')
            .attr('id', BdLineChartClasses.getGradientClass(this.renderConfig.id))
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', yScale(max(this.lineData, function (dataPoint) { return dataPoint.y; })))
            .attr('x2', 0)
            .attr('y2', yScale(this.renderConfig.yRenderConfig.min));
        gradientDefenition
            .append('stop')
            .attr('class', BdLineChartClasses.gradientStartClass)
            .attr('stop-opacity', 0)
            .attr('offset', '0%');
        gradientDefenition
            .append('stop')
            .attr('class', BdLineChartClasses.gradientStopClass)
            .attr('offset', '100%');
        // append a path using the area function to plot all path coordinates
        this.svgSelection.append('path')
            .attr('class', BdLineChartClasses.areaClass)
            .attr('id', 'ng2-c-chart__area')
            .style('fill', "url(#" + BdLineChartClasses.getGradientClass(this.renderConfig.id) + ")") // use de gradient defenition as the fill
            .attr('clip-path', "url(#" + BdAxisClasses.getClipPathClass(this.renderConfig.id) + ")") // use the clippath
            .attr('d', theArea(this.lineData));
        // let the gradient fade in
        var animationDuration = this.animate ? bdLineChartDefaultValues.transitionDurationFast : 0;
        this.svgSelection.select("stop." + BdLineChartClasses.gradientStartClass)
            .transition()
            .duration(animationDuration)
            .ease(easeLinear)
            .attr('stop-opacity', 0.35)
            .on('end', function () { return _this.finishRender(); }); // call the next renderer when the animation finishes
    };
    return BdGradientRenderer;
}(BdRenderer));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LineChartPositioningData = /** @class */ (function (_super) {
    __extends$4(LineChartPositioningData, _super);
    function LineChartPositioningData(position, dataPoint, boundingRect) {
        var _this = _super.call(this, position, dataPoint) || this;
        _this.position = position;
        _this.dataPoint = dataPoint;
        _this.boundingRect = boundingRect;
        return _this;
    }
    return LineChartPositioningData;
}(BasePositioningData));

var BdLineChartSelectionManager = /** @class */ (function () {
    function BdLineChartSelectionManager(svgSelection, svgElement, renderConfig, lineData, axisSvgQueries, selectionType) {
        var _this = this;
        this.svgSelection = svgSelection;
        this.svgElement = svgElement;
        this.renderConfig = renderConfig;
        this.lineData = lineData;
        this.axisSvgQueries = axisSvgQueries;
        this.selectionType = selectionType;
        this.closestPointHandler = function () { return _this.getClosestDataPoint(); };
        this.selectDataPointSubject = new Subject$1();
        this.lineChartTemplateSubject = new Subject$1();
    }
    Object.defineProperty(BdLineChartSelectionManager.prototype, "onDataPointSelected", {
        get: function () {
            return this.selectDataPointSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdLineChartSelectionManager.prototype, "onUpdateLineChartTemplate", {
        get: function () {
            return this.lineChartTemplateSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdLineChartSelectionManager.prototype, "selectionAreaBoundingRect", {
        get: function () {
            return BdDOMRect.fromClientRect(this.svgElement.getBoundingClientRect());
        },
        enumerable: true,
        configurable: true
    });
    BdLineChartSelectionManager.prototype.init = function () {
        // draw an overlay over the graph with event handlers attached to make selections
        this.selectionOverlay = this.svgSelection.append('g') // select(this.element)
            .append('rect')
            .attr('class', BdLineChartClasses.draggerSelectionOverlayClass)
            .attr('width', this.renderConfig.size.width + this.renderConfig.margins.left + this.renderConfig.margins.right)
            .attr('height', this.renderConfig.size.height + this.renderConfig.margins.bottom);
        // add event handlers depending on the selection type
        if (this.selectionType === BdChartSelectionType.Dragger) {
            this.selectionOverlay
                .on('touchmove', this.closestPointHandler)
                .on('mousemove', this.closestPointHandler);
        }
        else if (this.selectionType === BdChartSelectionType.Bullet) {
            this.bulletEventName = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
            this.selectionOverlay.on(this.bulletEventName, this.closestPointHandler);
        }
    };
    BdLineChartSelectionManager.prototype.selectDataPoint = function (dataPoint) {
        // make a render react to the selection of a datapoint
        this.selectDataPointSubject.next(dataPoint);
    };
    BdLineChartSelectionManager.prototype.positionLineChartTemplate = function (dataPoint, bullet) {
        // the renderer will call this to let the linechart be placed on the screen coordinates give by the renderer
        this.lineChartTemplateSubject.next(new LineChartPositioningData(this.getScreenCoords(dataPoint, bullet), dataPoint, this.selectionAreaBoundingRect));
    };
    BdLineChartSelectionManager.prototype.destroy = function () {
        // d3 way of removing eventhandlers
        if (this.selectionOverlay) {
            this.selectionOverlay.on('touchmove', null);
            this.selectionOverlay.on('mousemove', null);
            this.selectionOverlay.on(this.bulletEventName, null);
        }
        // unsubscribe everything
        this.selectDataPointSubject.unsubscribe();
        this.lineChartTemplateSubject.unsubscribe();
    };
    /**
     * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
     * convert datapoint to svg coordinates and then
     * convert from svg coordinate system to screen position
     * we need these coordinates to position the line-chart template
     */
    /**
         * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
         * convert datapoint to svg coordinates and then
         * convert from svg coordinate system to screen position
         * we need these coordinates to position the line-chart template
         */
    BdLineChartSelectionManager.prototype.getScreenCoords = /**
         * https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
         * convert datapoint to svg coordinates and then
         * convert from svg coordinate system to screen position
         * we need these coordinates to position the line-chart template
         */
    function (dataPoint, bullet) {
        var svgPoint = this.svgElement.createSVGPoint();
        // convert the datapoint value to svg coordinates
        svgPoint.x = this.renderConfig.xRenderConfig.scale(dataPoint.x);
        svgPoint.y = this.renderConfig.yRenderConfig.scale(dataPoint.y);
        // transform the svg coordinates using the transformationmatrix of the bullet to get screen coordinates
        var screenPoint = svgPoint.matrixTransform(bullet.getCTM());
        return new BdCoordinates(screenPoint.x, screenPoint.y);
    };
    /**
     * find the closest data point to the mouse position
     */
    /**
         * find the closest data point to the mouse position
         */
    BdLineChartSelectionManager.prototype.getClosestDataPoint = /**
         * find the closest data point to the mouse position
         */
    function () {
        // this will create a function that will find the closest datapoint
        var bisectDataPoint = bisector(function (dp) { return dp.x; }).left;
        var xAxisElement = this.axisSvgQueries.getAxis(BdAxisDirection.X).node();
        var d3Mouse = mouse(xAxisElement);
        // convert the mouse x coordinate to a chart value
        var mouseValue = this.renderConfig.xRenderConfig.scale.invert(d3Mouse[0]);
        // find the closest datapoint to the chart value of mouse x
        var index = bisectDataPoint(this.lineData, mouseValue); // index to the closest data item
        var dataPoint;
        if (index === 0) {
            dataPoint = this.lineData[index];
        }
        else if (index > this.lineData.length - 1) {
            dataPoint = this.lineData[this.lineData.length - 1];
        }
        else {
            var dataPoint0 = this.lineData[index - 1];
            var dataPoint1 = this.lineData[index];
            // get data value is closest to the event
            dataPoint = mouseValue - dataPoint0.x > dataPoint1.x - mouseValue ? dataPoint1 : dataPoint0;
        }
        if (this.selectionType === BdChartSelectionType.Dragger && this.previousSelectedDataPoint !== dataPoint) {
            this.previousSelectedDataPoint = dataPoint;
            this.selectDataPoint(dataPoint); // let the DraggerRenderer select the datapoint
        }
        else {
            if (dataPoint !== this.lineData[0]) {
                this.previousSelectedDataPoint = dataPoint;
                this.selectDataPoint(dataPoint); // let the BulletRenderer select the datapoint
            }
        }
    };
    return BdLineChartSelectionManager;
}());

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdLineRenderer = /** @class */ (function (_super) {
    __extends$5(BdLineRenderer, _super);
    function BdLineRenderer(renderQueue, svgSelection, renderConfig, lineData) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.renderConfig = renderConfig;
        _this.lineData = lineData;
        return _this;
    }
    BdLineRenderer.prototype.render = function () {
        // get the scales functions of the axis
        var xScale = this.renderConfig.xRenderConfig.scale;
        var yScale = this.renderConfig.yRenderConfig.scale;
        // make a line function that will plot from datapoint coordinate space to svg coordinate space using the scales
        var valueline = line()
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); });
        // append a path, the path wil be plotted using the value line function
        this.svgSelection.append('path')
            .attr('class', BdLineChartClasses.lineClass)
            .attr('clip-path', "url(#ng2-c-chart__clip-" + this.renderConfig.id + ")")
            .attr('d', valueline(this.lineData));
        this.finishRender();
    };
    return BdLineRenderer;
}(BdRenderer));

var BdLineChartRenderComposition = /** @class */ (function () {
    function BdLineChartRenderComposition(element, renderConfig, lineChartData, selectionType, animate) {
        this.element = element;
        this.renderConfig = renderConfig;
        this.lineChartData = lineChartData;
        this.selectionType = selectionType;
        this.animate = animate;
        // append and a graphic alement to the svg that will contain the whole chart
        this.svgSelection = select(element).append('g');
        // d3 is like jquery we use the svg selection manager so we only have to traverse the SVG dom once when making selections
        this.axisSvgQueries = new BdAxisSvgQueries(this.svgSelection);
        // this is used to capture events for selections
        this._selectionManager = new BdLineChartSelectionManager(this.svgSelection, this.element, this.renderConfig, this.lineChartData, this.axisSvgQueries, this.selectionType);
        // build all te subrenderers
        this.buildRenderQueue();
    }
    Object.defineProperty(BdLineChartRenderComposition.prototype, "lineChartTemplateSubject", {
        get: function () {
            return this._selectionManager.onUpdateLineChartTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdLineChartRenderComposition.prototype, "selectionBoundingRect", {
        get: function () {
            return this._selectionManager.selectionAreaBoundingRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdLineChartRenderComposition.prototype, "onRenderFinished", {
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
    BdLineChartRenderComposition.prototype.render = /**
         * render the whole queue
         */
    function () {
        this.renderQueue.startRendering();
    };
    BdLineChartRenderComposition.prototype.destroy = function () {
        // unsubsribe observables and destroy event handlers
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
    BdLineChartRenderComposition.prototype.selectDataPoint = /**
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
    BdLineChartRenderComposition.prototype.buildRenderQueue = /***
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
        // modify the rendered axis
        if (this.renderConfig.xRenderConfig.dataType === BdAxisDataType.Date) {
            this.renderQueue
                .add(new BdAddFirstTimeTickIfMissingRenderer(this.renderQueue, this.renderConfig.xRenderConfig, this.axisSvgQueries))
                .add(new BdCenterLabelsBetweenTicksRenderer(this.renderQueue, this.renderConfig.xRenderConfig, this.axisSvgQueries, this.renderConfig.size));
        }
        if (this.renderConfig.yRenderConfig.dataType === BdAxisDataType.Date) {
            this.renderQueue
                .add(new BdAddFirstTimeTickIfMissingRenderer(this.renderQueue, this.renderConfig.yRenderConfig, this.axisSvgQueries))
                .add(new BdCenterLabelsBetweenTicksRenderer(this.renderQueue, this.renderConfig.yRenderConfig, this.axisSvgQueries, this.renderConfig.size));
        }
        this.renderQueue.add(new BdRemoveClippedLabelsRenderer(this.renderQueue, this.axisSvgQueries));
        // add some transformations the chart to make everything fit
        this.renderQueue.add(new BdTransformChartRenderer(this.renderQueue, this.svgSelection, this.renderConfig.xRenderConfig, this.renderConfig.yRenderConfig, this.axisSvgQueries, this.renderConfig.margins));
        // take different renderer for the line when animating animations
        if (this.animate) {
            this.renderQueue.add(new BdAnimatedLineRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.lineChartData));
        }
        else {
            this.renderQueue.add(new BdLineRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.lineChartData));
        }
        // add the gradient and selection stuff after animation of line
        this.renderQueue.add(new BdGradientRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.lineChartData, this.animate));
        if (this.selectionType === BdChartSelectionType.Bullet) {
            this.renderQueue.add(new BdBulletRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this.lineChartData, this._selectionManager, this.animate));
        }
        if (this.selectionType === BdChartSelectionType.Dragger) {
            this.renderQueue.add(new BdDraggerRenderer(this.renderQueue, this.svgSelection, this.renderConfig, this._selectionManager));
        }
    };
    return BdLineChartRenderComposition;
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
 * to get a better insight look at BdAxisRenderConfig which is derived from NumericAxisConfig An TimeAxisConfig
 */
var BdLineChartRenderConfig = /** @class */ (function () {
    function BdLineChartRenderConfig(svgElement, xAxisConfig, yAxisConfig, selectionType, id, lineChartData, container, chartHeight) {
        this.id = id;
        this.lineChartData = lineChartData;
        this.container = container;
        this.chartHeight = chartHeight;
        this.svgSelection = select(svgElement);
        // we need a copy of the margins because they will be adapted by the code and we don't want them to be changed when we rerender
        this.margins = selectionType === BdChartSelectionType.Dragger ? __assign({}, bdLineChartDefaultValues.margins.draggerSelectionMargins) : __assign({}, bdLineChartDefaultValues.margins.defaultMargins);
        var xMin = this.getMinFromData(BdAxisDirection.X);
        var xMax = this.getMaxFromData(BdAxisDirection.X);
        var yMin = this.getMinFromData(BdAxisDirection.Y);
        var yMax = this.getMaxFromData(BdAxisDirection.Y);
        this.size = new BdGraphSizeHelper(svgElement, this.margins, xAxisConfig, yAxisConfig, lineChartData, yMin, yMax, bdLineChartDefaultValues.defaultSize, this.container, this.chartHeight).getSize();
        switch (xAxisConfig.dataType) {
            case BdAxisDataType.Date:
                this.xRenderConfig = new BdTimeAxisRenderConfig(BdAxisDirection.X, xAxisConfig, this.size, xMin, xMax, lineChartData);
                break;
            case BdAxisDataType.Number:
                this.xRenderConfig = new BdNumericAxisRenderConfig(BdAxisDirection.X, xAxisConfig, this.size, xMin, xMax, lineChartData);
                break;
            default:
                break;
        }
        switch (yAxisConfig.dataType) {
            case BdAxisDataType.Date:
                this.yRenderConfig = new BdTimeAxisRenderConfig(BdAxisDirection.Y, yAxisConfig, this.size, yMin, yMax, lineChartData);
                break;
            case BdAxisDataType.Number:
                this.yRenderConfig = new BdNumericAxisRenderConfig(BdAxisDirection.Y, yAxisConfig, this.size, yMin, yMax, lineChartData);
                break;
            default:
                break;
        }
    }
    // get the minimum x or y (depending on axis direction) from the data
    // get the minimum x or y (depending on axis direction) from the data
    BdLineChartRenderConfig.prototype.getMinFromData = 
    // get the minimum x or y (depending on axis direction) from the data
    function (axisDirection) {
        var min$$1 = Number.MAX_VALUE;
        var lineDataMin = min(this.lineChartData, function (dataPoint) { return axisDirection === BdAxisDirection.X ? dataPoint.x : dataPoint.y; });
        min$$1 = Math.min(lineDataMin, min$$1);
        return min$$1;
    };
    // get the maximum x or y (depending on axis direction) from the data
    // get the maximum x or y (depending on axis direction) from the data
    BdLineChartRenderConfig.prototype.getMaxFromData = 
    // get the maximum x or y (depending on axis direction) from the data
    function (axisDirection) {
        var max$$1 = Number.MIN_VALUE;
        var lineDataMax = max(this.lineChartData, function (dataPoint) { return axisDirection === BdAxisDirection.X ? dataPoint.x : dataPoint.y; });
        max$$1 = Math.max(lineDataMax, max$$1);
        return max$$1;
    };
    return BdLineChartRenderConfig;
}());

var BdD3LineChart = /** @class */ (function () {
    function BdD3LineChart(svgElement, xAxisConfig, yAxisConfig, lineChartData, selectionType, id, container, animate, chartHeight) {
        this.svgElement = svgElement;
        this.lineChartData = lineChartData;
        this.renderConfig = new BdLineChartRenderConfig(this.svgElement, xAxisConfig, yAxisConfig, selectionType, id, lineChartData, container, chartHeight);
        this.lineChartRenderComposition = new BdLineChartRenderComposition(this.svgElement, this.renderConfig, lineChartData, selectionType, animate);
    }
    Object.defineProperty(BdD3LineChart.prototype, "lineChartTemplateSubject", {
        get: function () {
            return this.lineChartRenderComposition.lineChartTemplateSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdD3LineChart.prototype, "selectionBoundingRect", {
        get: function () {
            return this.lineChartRenderComposition.selectionBoundingRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdD3LineChart.prototype, "onRenderFinished", {
        get: function () {
            return this.lineChartRenderComposition.onRenderFinished;
        },
        enumerable: true,
        configurable: true
    });
    BdD3LineChart.prototype.render = function () {
        this.lineChartRenderComposition.render();
    };
    BdD3LineChart.prototype.destroy = function () {
        this.lineChartRenderComposition.destroy();
    };
    BdD3LineChart.prototype.selectDataPoint = function (dataPoint) {
        this.lineChartRenderComposition.selectDataPoint(dataPoint);
    };
    return BdD3LineChart;
}());

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdDraggerPositionStrategy = /** @class */ (function (_super) {
    __extends$6(BdDraggerPositionStrategy, _super);
    function BdDraggerPositionStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BdDraggerPositionStrategy.prototype.calculatePosition = function (templateWrapper, positioningData) {
        var bdTemplateStyle = new BdTemplateStyles();
        /* Add the classes that need to be set default */
        bdTemplateStyle.classes += BdTemplateSharedClasses.calloutDraggerClass + " " + BdTemplateSharedClasses.calloutClass;
        /* should the tip of the callout be on the right or the left? */
        if (positioningData.position.x > positioningData.boundingRect.width * 0.5) {
            bdTemplateStyle.classes += " " + BdTemplateSharedClasses.calloutTopRightClass;
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowTopRightClass + " ";
        }
        else {
            bdTemplateStyle.classes += " " + BdTemplateSharedClasses.calloutTopLeftClass;
            bdTemplateStyle.arrowClasses += BdTemplateSharedClasses.arrowTopLeftClass + " ";
        }
        /* set the x position
                top distance is based upon the size of the callout */
        bdTemplateStyle.templateStyle = {
            left: positioningData.position.x + "px",
            top: -templateWrapper.getBoundingClientRect().height + bdLineChartDefaultValues.margins.draggerSelectionMargins.top + 'px'
        };
        return bdTemplateStyle;
    };
    return BdDraggerPositionStrategy;
}(BdPositionStrategy));

var BdLineChartComponent = /** @class */ (function () {
    function BdLineChartComponent(ngZone, bdEventService, bdDeviceService) {
        this.ngZone = ngZone;
        this.bdEventService = bdEventService;
        this.bdDeviceService = bdDeviceService;
        this.needsRerender = false;
        this.renderComplete$ = new Subject$1();
        this.chartDestroyed$ = new Subject$1();
        this.componentDestroyed$ = new Subject$1();
        this.selectedDataPointPropertyName = 'selectedDataPoint';
        // event so we can react when the selected point is changed
        this.selectedDataPointChange = new EventEmitter();
        // the current selection type
        // the method for selecting points: None, Dragger, Bullet
        this.selectionType = BdChartSelectionType.None;
        this.onRenderFinished = new EventEmitter();
        // generate a random id for the chart
        this.id = Math.floor(Math.random() * 1000000000).toString();
    }
    BdLineChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        var timeToDebounce = this.bdDeviceService.isIOS() ? 500 : 0;
        this.bdEventService
            .onWindowResizeOutsideZone
            .debounceTime(timeToDebounce)
            .takeUntil(this.componentDestroyed$)
            .subscribe(function () {
            if (_this.d3LineChart) {
                if (_this.rendering) {
                    _this.needsRerender = true;
                }
                else {
                    _this.rerender(false);
                }
            }
        });
    };
    BdLineChartComponent.prototype.ngOnChanges = function (changes) {
        // dont rerender when rendering is not finished
        switch (this.selectionType) {
            case BdChartSelectionType.Bullet:
                this.positionStrategy = new BdBulletPositionStrategy();
                break;
            case BdChartSelectionType.Dragger:
                this.positionStrategy = new BdDraggerPositionStrategy();
                break;
            default:
                this.positionStrategy = null;
        }
        if (!this.rendering) {
            if (this.d3LineChart) {
                if (this.onlySelectedDataPointChanged(changes)) {
                    // the chart already exists and only the selected point has changed so we select it in the chart
                    this.d3LineChart.selectDataPoint(changes[this.selectedDataPointPropertyName].currentValue);
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
    BdLineChartComponent.prototype.ngOnDestroy = function () {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
        this.renderComplete$.next(true);
        this.renderComplete$.complete();
        this.chartDestroyed$.next(true);
        this.chartDestroyed$.complete();
    };
    // when selection type is bullet the callout can be hidden by clicking it
    // when selection type is bullet the callout can be hidden by clicking it
    BdLineChartComponent.prototype.toggleBulletHide = 
    // when selection type is bullet the callout can be hidden by clicking it
    function () {
        if (this.selectionType === BdChartSelectionType.Bullet) {
            // get the hidden property from chart
            this.bdChartTemplate.hidden = !this.bdChartTemplate.hidden;
        }
    };
    // method to determine if we need to rerender or select a point
    // method to determine if we need to rerender or select a point
    BdLineChartComponent.prototype.onlySelectedDataPointChanged = 
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
    BdLineChartComponent.prototype.renderChart = function (animate) {
        var _this = this;
        if (this.data && this.data.length > 0 && this.xAxisConfig && this.yAxisConfig) {
            this.rendering = true;
            // make a new D3Line chart
            this.d3LineChart = new BdD3LineChart(this.chart.nativeElement, this.xAxisConfig, this.yAxisConfig, this.data, this.selectionType, this.id, this.container, animate, this.height);
            // subscribe to do some actions when rendering is finished
            this.d3LineChart.onRenderFinished.takeUntil(this.renderComplete$).subscribe(function () { return _this.afterRender(); });
            // render the chart
            this.d3LineChart.render();
        }
    };
    BdLineChartComponent.prototype.afterRender = function () {
        var _this = this;
        this.renderComplete$.next(true);
        if (this.selectionType !== BdChartSelectionType.None) {
            // selections can be made on the chart, subscribe to get the data point, screen coordinates
            this.d3LineChart.lineChartTemplateSubject.takeUntil(this.chartDestroyed$).subscribe(function (positioningData) {
                // the events for the chart run outside the zone, we only need to run these changes inside the zone to update the template position
                // the events for the chart run outside the zone, we only need to run these changes inside the zone to update the template position
                _this.ngZone.run(function () {
                    // bind the point and its screen coordinates to the template
                    // bind the point and its screen coordinates to the template
                    _this.selectedDataPoint = positioningData.dataPoint;
                    _this.positioningData = positioningData;
                    // emit to the outside world that we selected a new point
                    // emit to the outside world that we selected a new point
                    _this.selectedDataPointChange.emit(_this.selectedDataPoint);
                });
            });
            // after rendering the chart we can select the datapoint
            if (this.selectedDataPoint) {
                this.d3LineChart.selectDataPoint(this.selectedDataPoint);
            }
        }
        if (!this.needsRerender) {
            this.rendering = false;
            // emit an event to the outside word to notify we have finished rendering
            // after this event we can render again
            this.onRenderFinished.emit();
        }
        else {
            this.needsRerender = false;
            this.rerender(false);
        }
    };
    BdLineChartComponent.prototype.rerender = function (animate) {
        this.renderComplete$.next(true);
        this.chartDestroyed$.next(true);
        this.positioningData = null;
        this.d3LineChart.destroy();
        this.rendering = true;
        this.renderChart(animate);
    };
    BdLineChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-line-chart2',
                    template: "<div class=\"ng2-c-chart\">    <bd-chart-template2        [positionStrategy]=\"positionStrategy\"        [positioningData]=\"positioningData\"        (click)=\"toggleBulletHide()\">        <ng-content></ng-content>    </bd-chart-template2>    <svg #chart class=\"ng2-c-chart__svg\"></svg></div>"
                },] },
    ];
    /** @nocollapse */
    BdLineChartComponent.ctorParameters = function () { return [
        { type: NgZone, },
        { type: BdEventService, },
        { type: BdDeviceService, },
    ]; };
    BdLineChartComponent.propDecorators = {
        "chart": [{ type: ViewChild, args: ['chart',] },],
        "bdChartTemplate": [{ type: ViewChild, args: [BdChartTemplateComponent,] },],
        "height": [{ type: Input },],
        "data": [{ type: Input },],
        "xAxisConfig": [{ type: Input },],
        "yAxisConfig": [{ type: Input },],
        "selectedDataPointChange": [{ type: Output },],
        "selectedDataPoint": [{ type: Input },],
        "container": [{ type: Input },],
        "selectionType": [{ type: Input },],
        "onRenderFinished": [{ type: Output },],
    };
    return BdLineChartComponent;
}());

var components = [BdLineChartComponent];
var BdLineChartModule = /** @class */ (function () {
    function BdLineChartModule() {
    }
    BdLineChartModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, BdChartCoreModule],
                    declarations: components.slice(),
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdLineChartModule.ctorParameters = function () { return []; };
    return BdLineChartModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { BdLineChartComponent as ɵa, BdChartSelectionType, BdLineChartModule };
//# sourceMappingURL=index.js.map
