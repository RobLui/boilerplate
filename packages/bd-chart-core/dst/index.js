import { axisBottom, axisLeft } from 'd3-axis';
import { axisLeft as axisLeft$1 } from 'd3';
import * as d3 from 'd3';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, NgModule, ViewChild } from '@angular/core';
import { BdDOMRect } from '@delen/bd-utilities';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'd3-transition';

var BdAxisDirection;
(function (BdAxisDirection) {
    BdAxisDirection["X"] = "x-axis";
    BdAxisDirection["Y"] = "y-axis";
})(BdAxisDirection || (BdAxisDirection = {}));

var BdRenderer = /** @class */ (function () {
    function BdRenderer(renderQueue) {
        this.renderQueue = renderQueue;
    }
    BdRenderer.prototype.finishRender = function () {
        this.renderQueue.renderNext();
    };
    return BdRenderer;
}());

/**
 * helper class for coordinates
 */
var BdCoordinates = /** @class */ (function () {
    function BdCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
    return BdCoordinates;
}());

/**
 * various methods to set/get the transform attribute of an element
 * this operation hes to be done alot
 */
var BdTransformHelper = /** @class */ (function () {
    function BdTransformHelper() {
    }
    BdTransformHelper.getElementTransformation = function (element) {
        var elementTransformAttr = element.getAttribute('transform');
        if (!elementTransformAttr) {
            return new BdCoordinates(0, 0);
        }
        var elementTransformArr = elementTransformAttr.substring(elementTransformAttr.indexOf('(') + 1, elementTransformAttr.indexOf(')')).split(',');
        return new BdCoordinates(parseFloat(elementTransformArr[0]), parseFloat(elementTransformArr[1]));
    };
    /**
     * apply a transformation to a d3 selection
     */
    /**
         * apply a transformation to a d3 selection
         */
    BdTransformHelper.applyTransformationToSelection = /**
         * apply a transformation to a d3 selection
         */
    function (selection, x, y) {
        selection.attr('transform', "translate(" + x + ", " + y + ")");
    };
    /**
     * apply transformation to an SVGElement
     */
    /**
         * apply transformation to an SVGElement
         */
    BdTransformHelper.applyTransformationToNode = /**
         * apply transformation to an SVGElement
         */
    function (node, x, y) {
        node.setAttribute('transform', "translate(" + x + ", " + y + ")");
    };
    return BdTransformHelper;
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
/**
 * sometimes d3 does not show a label for the first tick
 * this fixes it
 */
var BdAddFirstTimeTickIfMissingRenderer = /** @class */ (function (_super) {
    __extends(BdAddFirstTimeTickIfMissingRenderer, _super);
    function BdAddFirstTimeTickIfMissingRenderer(renderQueue, timeAxisRenderConfig, axisSvgQueries) {
        var _this = _super.call(this, renderQueue) || this;
        _this.timeAxisRenderConfig = timeAxisRenderConfig;
        _this.axisSvgQueries = axisSvgQueries;
        return _this;
    }
    BdAddFirstTimeTickIfMissingRenderer.prototype.render = function () {
        // get the labels for the ticks
        var textNodes = this.axisSvgQueries.getLabels(this.timeAxisRenderConfig.axisDirection).nodes();
        // this is the text that is supposed to be in the first tick
        var firstLabelText = this.timeAxisRenderConfig.labelFormatter(new Date(this.timeAxisRenderConfig.min), 0);
        // if the first label does not have this text we have to add the label
        if (textNodes[0].textContent !== firstLabelText) {
            // this the whole node for a tick, containing the line, and the text node
            var firstTickNode = textNodes[0].parentNode;
            // we add add the new first label by cloning the current first tick and adapting the transformation and text content
            var firstTickCloneNode = firstTickNode.cloneNode(true);
            // insert the node in the dom
            var axisSelection = this.axisSvgQueries.getAxis(this.timeAxisRenderConfig.axisDirection);
            axisSelection.node().insertBefore(firstTickCloneNode, firstTickNode);
            // set the text content to what the first label should display
            firstTickCloneNode.childNodes[1].textContent = firstLabelText;
            // copy the transformation and keep the coordinate that has the distance to the axis the label belongs to
            // set the other coordinate to 0.5 so it is set as the first tick
            var transformation = BdTransformHelper.getElementTransformation(firstTickCloneNode);
            var transformX = this.timeAxisRenderConfig.axisDirection === BdAxisDirection.X ? 0.5 : transformation.x;
            var transformY = this.timeAxisRenderConfig.axisDirection === BdAxisDirection.Y ? 0.5 : transformation.y;
            BdTransformHelper.applyTransformationToNode(firstTickCloneNode, transformX, transformY);
            // the selection for labels was cached and does not include the new label so we reset it
            this.axisSvgQueries.resetAxisSelections(this.timeAxisRenderConfig.axisDirection);
        }
        this.finishRender();
    };
    return BdAddFirstTimeTickIfMissingRenderer;
}(BdRenderer));

var BdAxisClasses = /** @class */ (function () {
    function BdAxisClasses() {
    }
    BdAxisClasses.getAxisClass = function (axisDirection) {
        return axisDirection === BdAxisDirection.X ? 'x axis' : 'y axis';
    };
    BdAxisClasses.getTickClass = function (major) {
        return major ? 'major-tick' : 'minor-tick';
    };
    BdAxisClasses.getTicksClass = function (axisDirection, major) {
        var majorMinorClass = major ? 'major' : 'minor';
        return axisDirection === BdAxisDirection.X ? majorMinorClass + "-ticks-x" : majorMinorClass + "-ticks-y";
    };
    BdAxisClasses.getClipPathClass = function (graphId) {
        return "ng2-c-chart__clip--" + graphId;
    };
    return BdAxisClasses;
}());

/**
 * basic configuration of an axis
 * we need to know DataType, Direction and labelformatter
 */
var BdAxisConfig = /** @class */ (function () {
    function BdAxisConfig(
    // tslint:disable-next-line:variable-name
    _dataType, 
    // tslint:disable-next-line:variable-name
    _direction, 
    // function to format the label: converts a domain value to a string
    labelFormatter) {
        this._dataType = _dataType;
        this._direction = _direction;
        this.labelFormatter = labelFormatter;
    }
    Object.defineProperty(BdAxisConfig.prototype, "dataType", {
        // data type of the axis
        get: 
        // data type of the axis
        function () {
            return this._dataType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdAxisConfig.prototype, "direction", {
        // x or y
        get: 
        // x or y
        function () {
            return this._direction;
        },
        enumerable: true,
        configurable: true
    });
    return BdAxisConfig;
}());

var BdAxisDataType;
(function (BdAxisDataType) {
    BdAxisDataType["Date"] = "date";
    BdAxisDataType["Number"] = "number";
})(BdAxisDataType || (BdAxisDataType = {}));

var BdAxisDefaultValues = /** @class */ (function () {
    function BdAxisDefaultValues() {
        this.labelFontSize = 10;
        this.labelOffsetToTick = 10;
        this.labelOffsetToAxis = 10;
        this.minorTickSize = 20;
        this.majorTickSize = 40;
    }
    return BdAxisDefaultValues;
}());
var bdAxisDefaultValues = new BdAxisDefaultValues();

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
var BdAxisRenderer = /** @class */ (function (_super) {
    __extends$1(BdAxisRenderer, _super);
    function BdAxisRenderer(renderQueue, svgSelection, graphSize, axisRenderConfig) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.graphSize = graphSize;
        _this.axisRenderConfig = axisRenderConfig;
        return _this;
    }
    BdAxisRenderer.prototype.render = function () {
        // depending on the direction we need a different d3 Axis
        this.d3Axis = this.determineAxis();
        // configure the tick interval, labels and grid
        this.configureTicks();
        // append a graphic container for the axis
        var axisElement = this.svgSelection.append('g')
            .attr('class', BdAxisClasses.getAxisClass(this.axisRenderConfig.axisDirection));
        // the x-axis still needs do be put at the bottom of the grid
        if (this.axisRenderConfig.axisDirection === BdAxisDirection.X) {
            var translate = "translate(0, " + this.graphSize.height + ")";
            axisElement.attr('transform', translate);
        }
        // call the d3 axis creator function on the container element
        axisElement.call(this.d3Axis);
        if (this.axisRenderConfig.axisDirection === BdAxisDirection.Y) {
            axisElement.call(function (selection) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                selection.selectAll('line').attr('shape-rendering', 'crispEdges');
            });
        }
        // execute the next renderer
        this.finishRender();
    };
    // create an axis with the right scale and direction
    // create an axis with the right scale and direction
    BdAxisRenderer.prototype.determineAxis = 
    // create an axis with the right scale and direction
    function () {
        if (this.axisRenderConfig.axisDirection === BdAxisDirection.X) {
            return axisBottom(this.axisRenderConfig.scale);
        }
        else {
            return axisLeft$1(this.axisRenderConfig.scale);
        }
    };
    // create ticks on the axis with the right interval (timeInterval or tick values),
    // label formatter and size (the size will be de width or height of the grid)
    // create ticks on the axis with the right interval (timeInterval or tick values),
    // label formatter and size (the size will be de width or height of the grid)
    BdAxisRenderer.prototype.configureTicks = 
    // create ticks on the axis with the right interval (timeInterval or tick values),
    // label formatter and size (the size will be de width or height of the grid)
    function () {
        if (this.axisRenderConfig.dataType === BdAxisDataType.Date) {
            var timeAxisConfig = this.axisRenderConfig;
            this.d3Axis.ticks(timeAxisConfig.timeInterval);
            if (timeAxisConfig.labelFormatter) {
                this.d3Axis.tickFormat(timeAxisConfig.labelFormatter);
            }
        }
        else {
            var numericAxisConfig_1 = this.axisRenderConfig;
            this.d3Axis.tickValues(numericAxisConfig_1.tickValues);
            if (numericAxisConfig_1.labelFormatter) {
                this.d3Axis.tickFormat(function (value) { return numericAxisConfig_1.labelFormatter(value, numericAxisConfig_1.tickInterval); });
            }
        }
        this.d3Axis.tickSize(this.axisRenderConfig.tickSize);
    };
    return BdAxisRenderer;
}(BdRenderer));

/**
 * selecting nodes in the dom can be a time consuming operations
 * so we keep selections in memory so we only have to traverse
 * the dom once for every type of selection
 */
var BdAxisSvgQueries = /** @class */ (function () {
    function BdAxisSvgQueries(svgSelection) {
        this.svgSelection = svgSelection;
    }
    // sometimes the selections need to be invalidated for example if an extra svg tag is added
    // sometimes the selections need to be invalidated for example if an extra svg tag is added
    BdAxisSvgQueries.prototype.resetAxisSelections = 
    // sometimes the selections need to be invalidated for example if an extra svg tag is added
    function (axisDirection) {
        if (axisDirection === BdAxisDirection.X) {
            this.xTextNodeSelection = null;
            this.xGridSelection = null;
            this.xAxisSelection = null;
        }
        else {
            this.yTextNodeSelection = null;
            this.yGridSelection = null;
            this.yAxisSelection = null;
        }
    };
    BdAxisSvgQueries.prototype.getLabels = function (axisDirection) {
        if (axisDirection === BdAxisDirection.X) {
            if (!this.xTextNodeSelection) {
                this.xTextNodeSelection = this.svgSelection.selectAll("g > .x > g > text");
            }
            return this.xTextNodeSelection;
        }
        else {
            if (!this.yTextNodeSelection) {
                this.yTextNodeSelection = this.svgSelection.selectAll("g > .y > g > text");
            }
            return this.yTextNodeSelection;
        }
    };
    BdAxisSvgQueries.prototype.getGridSelection = function (axisDirection) {
        if (axisDirection === BdAxisDirection.X) {
            if (!this.xGridSelection) {
                this.xGridSelection = this.svgSelection.selectAll("g > .x > g");
            }
            return this.xGridSelection;
        }
        else {
            if (!this.yGridSelection) {
                this.yGridSelection = this.svgSelection.selectAll("g > .y > g");
            }
            return this.yGridSelection;
        }
    };
    BdAxisSvgQueries.prototype.getAxis = function (axisDirection) {
        if (axisDirection === BdAxisDirection.X) {
            if (!this.xAxisSelection) {
                this.xAxisSelection = this.svgSelection.selectAll("g > .x");
            }
            return this.xAxisSelection;
        }
        else {
            if (!this.yAxisSelection) {
                this.yAxisSelection = this.svgSelection.selectAll("g > .y");
            }
            return this.yAxisSelection;
        }
    };
    BdAxisSvgQueries.prototype.getTicksSelection = function (axisDirection, isMajor) {
        var selection = this.svgSelection.selectAll("g > ." + BdAxisClasses.getTicksClass(axisDirection, isMajor) + " > ." + BdAxisClasses.getTickClass(isMajor));
        if (axisDirection === BdAxisDirection.X) {
            if (isMajor) {
                if (!this.xTickSelectionMajor) {
                    this.xTickSelectionMajor = selection;
                }
                return this.xTickSelectionMajor;
            }
            else {
                if (!this.xTickSelectionMinor) {
                    this.xTickSelectionMinor = selection;
                }
                return this.xTickSelectionMinor;
            }
        }
        else {
            if (isMajor) {
                if (!this.yTickSelectionMajor) {
                    this.yTickSelectionMajor = selection;
                }
                return this.yTickSelectionMajor;
            }
            else {
                if (!this.yTickSelectionMinor) {
                    this.yTickSelectionMinor = selection;
                }
                return this.yTickSelectionMinor;
            }
        }
    };
    BdAxisSvgQueries.prototype.getClipPath = function () {
        return this.svgSelection.select("g > clipPath > rect");
    };
    return BdAxisSvgQueries;
}());

/**
 * denotes a time interval
 */
/**
 * denotes a time interval
 */
var BdTimeTicks;
/**
 * denotes a time interval
 */
(function (BdTimeTicks) {
    BdTimeTicks["Millisecond"] = "timeMillisecond";
    BdTimeTicks["Second"] = "timeSecond";
    BdTimeTicks["Minute"] = "timeMinute";
    BdTimeTicks["Hour"] = "timeHour";
    BdTimeTicks["Day"] = "timeDay";
    BdTimeTicks["Week"] = "timeWeek ";
    BdTimeTicks["Sunday"] = "timeSunday";
    BdTimeTicks["Monday"] = "timeMonday";
    BdTimeTicks["Tuesday"] = "timeTuesday";
    BdTimeTicks["Wednesday"] = "timeWednesday";
    BdTimeTicks["Thursday"] = "timeThursday";
    BdTimeTicks["Friday"] = "timeFriday";
    BdTimeTicks["Saturday"] = "timeSaturday";
    BdTimeTicks["Month"] = "timeMonth";
    BdTimeTicks["Year"] = "timeYear";
})(BdTimeTicks || (BdTimeTicks = {}));

var BdBandAxisProperties = /** @class */ (function () {
    function BdBandAxisProperties() {
        // divisions of the axis expressed in a time value ex: month, day
        this.timeTicks = BdTimeTicks.Month;
    }
    return BdBandAxisProperties;
}());

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
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var BdBandAxisConfig = /** @class */ (function (_super) {
    __extends$2(BdBandAxisConfig, _super);
    function BdBandAxisConfig(direction, labelFormatter, bandAxisProperties) {
        var _this = _super.call(this, BdAxisDataType.Date, direction, labelFormatter) || this;
        _this.properties = new BdBandAxisProperties();
        _this.properties = __assign({}, _this.properties, bandAxisProperties);
        return _this;
    }
    Object.defineProperty(BdBandAxisConfig.prototype, "timeTicks", {
        /**
         * divisions of the axis expressed in a time value ex: month, day
         */
        get: /**
             * divisions of the axis expressed in a time value ex: month, day
             */
        function () {
            return this.properties.timeTicks;
        },
        set: function (value) {
            this.properties.timeTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdBandAxisConfig.prototype, "maxDate", {
        /**
         * maximum date displayed on the axis
         */
        get: /**
             * maximum date displayed on the axis
             */
        function () {
            return this.properties.maxDate;
        },
        set: function (value) {
            this.properties.maxDate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdBandAxisConfig.prototype, "minDate", {
        /**
         * minimum date displayed on the axis
         */
        get: /**
             * minimum date displayed on the axis
             */
        function () {
            return this.properties.minDate;
        },
        set: function (value) {
            this.properties.minDate = value;
        },
        enumerable: true,
        configurable: true
    });
    return BdBandAxisConfig;
}(BdAxisConfig));

/***
 * this class translates the configuration of the axes
 * to values we can use with d3 to draw them
 */
var BdBaseAxisRenderConfig = /** @class */ (function () {
    function BdBaseAxisRenderConfig(axisDirection, dataType, // datatype of the axis: number or date
    // datatype of the axis: number or date
    axisConfig, size, dataMin, dataMax, dataPoints) {
        this.axisDirection = axisDirection;
        this.dataType = dataType;
        this.axisConfig = axisConfig;
        this.size = size;
        this.dataMin = dataMin;
        this.dataMax = dataMax;
        this.dataPoints = dataPoints;
        this.labelsAreCentered = false;
        this.determineMinMaxAndTicks();
        this.labelFormatter = this.axisConfig.labelFormatter;
        this.determineDomain();
        this.determineScale(); // this should be called after determineMinMaxAndTicks because we need the values for domain, min and max
        this.tickSize = this.axisDirection === BdAxisDirection.X ? -size.height : -size.width;
    }
    return BdBaseAxisRenderConfig;
}());

var BdTimeIntervalHelper = /** @class */ (function () {
    function BdTimeIntervalHelper() {
    }
    // will return d3 interval functions: CountableTimeInterval (= d3.timeMonth) or timeMinutes, timeSeconds, ....
    // will return d3 interval functions: CountableTimeInterval (= d3.timeMonth) or timeMinutes, timeSeconds, ....
    BdTimeIntervalHelper.getTimeIntervalFunction = 
    // will return d3 interval functions: CountableTimeInterval (= d3.timeMonth) or timeMinutes, timeSeconds, ....
    function (timeTick) {
        if (typeof d3[timeTick] !== 'function') {
            throw new Error('TimeTick value does not map to d3 TimeInterval function');
        }
        return d3[timeTick];
    };
    return BdTimeIntervalHelper;
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
var BdBandAxisRenderConfig = /** @class */ (function (_super) {
    __extends$3(BdBandAxisRenderConfig, _super);
    function BdBandAxisRenderConfig(axisDirection, axisConfig, size, dataMin, dataMax, dataPoints) {
        return _super.call(this, axisDirection, BdAxisDataType.Date, axisConfig, size, dataMin, dataMax, dataPoints) || this;
    }
    BdBandAxisRenderConfig.prototype.hasMajorTicks = function () {
        return false;
    };
    BdBandAxisRenderConfig.prototype.hasMinorTicks = function () {
        return false;
    };
    BdBandAxisRenderConfig.prototype.determineMinMaxAndTicks = function () {
        // get the extremity value from the data
        var bandAxisConfig = this.axisConfig;
        this.timeInterval = BdTimeIntervalHelper.getTimeIntervalFunction(bandAxisConfig.timeTicks); // get the time interval
        this.min = bandAxisConfig.minDate ? bandAxisConfig.minDate.getTime() : this.dataMin; // if a minimum date was configured use it else use min from data
        this.max = bandAxisConfig.maxDate ? bandAxisConfig.maxDate.getTime() : this.dataMax; // if a maximum date was configured use it else use min from data
        this.timeTicks = bandAxisConfig.timeTicks;
    };
    BdBandAxisRenderConfig.prototype.determineDomain = function () {
        // bandscale needs all the values for the domain instead of only min and max
        this.domain = this.dataPoints.map(function (d) { return d.x; });
    };
    BdBandAxisRenderConfig.prototype.determineScale = function () {
        var scaleRange;
        if (this.axisDirection === BdAxisDirection.X) {
            scaleRange = [0, this.size.width];
        }
        else {
            scaleRange = [this.size.height, 0];
        }
        this.scale = scaleBand()
            .domain(this.domain)
            .rangeRound(scaleRange)
            .paddingInner(0.5)
            .paddingOuter(0.25);
    };
    return BdBandAxisRenderConfig;
}(BdBaseAxisRenderConfig));

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
var BdCenterLabelsBetweenTicksRenderer = /** @class */ (function (_super) {
    __extends$4(BdCenterLabelsBetweenTicksRenderer, _super);
    function BdCenterLabelsBetweenTicksRenderer(renderQueue, axisRenderConfig, axisSvgQueries, graphSize) {
        var _this = _super.call(this, renderQueue) || this;
        _this.axisRenderConfig = axisRenderConfig;
        _this.axisSvgQueries = axisSvgQueries;
        _this.graphSize = graphSize;
        return _this;
    }
    BdCenterLabelsBetweenTicksRenderer.prototype.render = function () {
        var _this = this;
        if (this.axisRenderConfig.labelsAreCentered) {
            // get all grid lines nodes for the axis direction
            var labelAttribute = this.axisRenderConfig.axisDirection === BdAxisDirection.X ? 'x' : 'y';
            this.lineNodes = this.axisSvgQueries.getGridSelection(this.axisRenderConfig.axisDirection).nodes();
            this.textNodeSelection = this.axisSvgQueries
                .getLabels(this.axisRenderConfig.axisDirection);
            this.textNodeSelection.attr(labelAttribute, function (d, index) { return _this.getTransformation(index); });
        }
        this.finishRender();
    };
    BdCenterLabelsBetweenTicksRenderer.prototype.getTransformation = function (index) {
        // get the first and the second line transformation
        var line0Transform = BdTransformHelper.getElementTransformation(this.lineNodes[index]);
        // get the first and the second line
        var coordinate0 = this.axisRenderConfig.axisDirection === BdAxisDirection.X ? line0Transform.x : line0Transform.y;
        var line1Transform;
        var coordinate1;
        if (index < this.lineNodes.length - 1) {
            line1Transform = BdTransformHelper.getElementTransformation(this.lineNodes[index + 1]);
            // get the relevant coordinate (x or y depending on axis direction) to calculate the center point between them
            coordinate1 = this.axisRenderConfig.axisDirection === BdAxisDirection.X ? line1Transform.x : line1Transform.y;
        }
        else {
            coordinate1 = this.axisRenderConfig.axisDirection === BdAxisDirection.X ? this.graphSize.width : this.graphSize.height;
        }
        // calculate the center
        var labelTranslation = Math.abs(coordinate0 - coordinate1) / 2;
        return this.axisRenderConfig.axisDirection === BdAxisDirection.X ? labelTranslation : -labelTranslation;
    };
    return BdCenterLabelsBetweenTicksRenderer;
}(BdRenderer));

var BdPositionStrategy = /** @class */ (function () {
    function BdPositionStrategy() {
    }
    return BdPositionStrategy;
}());

var BasePositioningData = /** @class */ (function () {
    function BasePositioningData(position, dataPoint) {
        this.position = position;
        this.dataPoint = dataPoint;
    }
    return BasePositioningData;
}());

var BdChartTemplateComponent = /** @class */ (function () {
    function BdChartTemplateComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        // a style applied to the template, calculated for the currently selected point
        this.templateStyle = { top: '', left: '' };
        this.arrowStyles = { top: '' };
        // hide or show the template
        this.hidden = true;
    }
    BdChartTemplateComponent.prototype.ngOnChanges = function () {
        // all the needed data to display the template should be present
        this.hidden = !(this.positioningData && this.positionStrategy !== null);
    };
    BdChartTemplateComponent.prototype.ngAfterViewChecked = function () {
        if (!this.hidden) {
            // calculate the position of the template
            var result = this.positionStrategy.calculatePosition(this.callOutWrapperElement.nativeElement, this.positioningData);
            this.templateStyle = result.templateStyle;
            this.arrowStyles = result.arrowStyle;
            this.arrowClasses = result.arrowClasses;
            this.classes = result.classes;
            // after calculating style and classes we need to refresh the view
            this.changeDetectorRef.detectChanges();
        }
    };
    BdChartTemplateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bd-chart-template2',
                    template: "<div class=\"ng2-c-chart__callout\" *ngIf=\"!hidden\"     [ngClass]=\"classes\"     [ngStyle]=\"templateStyle\">    <div class=\"ng2-c-chart__callout-wrapper\" #callOutWrapperElement>        <ng-content></ng-content>    </div>    <span class=\"ng2-c-chart__arrow\" [ngClass]=\"arrowClasses\" [ngStyle]=\"arrowStyles\"></span></div>"
                },] },
    ];
    /** @nocollapse */
    BdChartTemplateComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    BdChartTemplateComponent.propDecorators = {
        "positionStrategy": [{ type: Input },],
        "positioningData": [{ type: Input },],
        "callOutWrapperElement": [{ type: ViewChild, args: ['callOutWrapperElement',] },],
    };
    return BdChartTemplateComponent;
}());

var components = [BdChartTemplateComponent];
var BdChartCoreModule = /** @class */ (function () {
    function BdChartCoreModule() {
    }
    BdChartCoreModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: components.slice(),
                    exports: components
                },] },
    ];
    /** @nocollapse */
    BdChartCoreModule.ctorParameters = function () { return []; };
    return BdChartCoreModule;
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
var BdClipPathRenderer = /** @class */ (function (_super) {
    __extends$5(BdClipPathRenderer, _super);
    function BdClipPathRenderer(renderQueue, svgSelection, chartSize, id) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.chartSize = chartSize;
        _this.id = id;
        return _this;
    }
    BdClipPathRenderer.prototype.render = function () {
        // add an invisible rectangle that will be used as a clip path, if points are added that are not with the domain we want to display
        // they will be clipped
        this.svgSelection.append('clipPath')
            .attr('id', BdAxisClasses.getClipPathClass(this.id))
            .append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', this.chartSize.width)
            .attr('height', this.chartSize.height);
        // render the next renderer
        this.finishRender();
    };
    return BdClipPathRenderer;
}(BdRenderer));

/**
 * a point in the chart
 */
var BdDataPoint = /** @class */ (function () {
    function BdDataPoint(
    // extra data we want to associate with the point
    data, x, y) {
        this.data = data;
        this.x = x;
        this.y = y;
    }
    return BdDataPoint;
}());

var BdIntervalAndDivision = /** @class */ (function () {
    function BdIntervalAndDivision(interval, division) {
        this.interval = interval;
        this.division = division;
    }
    return BdIntervalAndDivision;
}());

var BdNumericIntervalHelper = /** @class */ (function () {
    function BdNumericIntervalHelper() {
    }
    // determine the optimal interval between two ticks as close as possible to the requested numericAxeConfig.ticks
    // https://stackoverflow.com/questions/361681/algorithm-for-nice-grid-line-intervals-on-a-graph
    // determine the optimal interval between two ticks as close as possible to the requested numericAxeConfig.ticks
    // https://stackoverflow.com/questions/361681/algorithm-for-nice-grid-line-intervals-on-a-graph
    BdNumericIntervalHelper.getIntervalAndDivision = 
    // determine the optimal interval between two ticks as close as possible to the requested numericAxeConfig.ticks
    // https://stackoverflow.com/questions/361681/algorithm-for-nice-grid-line-intervals-on-a-graph
    function (start, stop, count) {
        var range = stop - start;
        // calculate an initial guess at step size
        var tempStep = range / count;
        // get the magnitude of the step size
        var mag = Math.floor(Math.log(tempStep) / Math.log(10));
        var magPow = Math.pow(10, mag);
        // calculate most significant digit of the new step size
        var magMsd = Math.round(tempStep / magPow + 0.5);
        var division = 0;
        // promote the MSD to either 1, 2, or 5
        if (magMsd > 5) {
            magMsd = 10;
            division = 10;
        }
        else if (magMsd > 2) {
            magMsd = 5;
            division = 5;
        }
        else if (magMsd > 1) {
            magMsd = 2;
            division = 2;
        }
        return new BdIntervalAndDivision(magMsd * magPow, division);
    };
    return BdNumericIntervalHelper;
}());

/**
 * helper class for sizes
 */
var BdSize = /** @class */ (function () {
    function BdSize(width, height) {
        this.width = width;
        this.height = height;
    }
    return BdSize;
}());

/**
 * will return the dimensions of the chart
 */
var BdGraphSizeHelper = /** @class */ (function () {
    function BdGraphSizeHelper(svg, margins, xAxisConfig, yAxisConfig, dataPoints, yMin, yMax, defaultSize, container, chartHeight) {
        this.svg = svg;
        this.margins = margins;
        this.xAxisConfig = xAxisConfig;
        this.yAxisConfig = yAxisConfig;
        this.dataPoints = dataPoints;
        this.yMin = yMin;
        this.yMax = yMax;
        this.defaultSize = defaultSize;
        this.container = container;
        this.chartHeight = chartHeight;
        this.charSize = 7;
    }
    BdGraphSizeHelper.prototype.getSize = function () {
        var size = this.getParentSize(this.svg);
        this.svg.setAttribute('width', size.width.toString());
        this.svg.setAttribute('height', size.height.toString());
        // adapt the margins to include space for labels
        this.adaptLeftMarginForLabels();
        // adapt the margins to include space for ticks
        this.adaptLeftMarginForTicks();
        return new BdSize(size.width - (this.margins.left + this.margins.right), size.height - (this.margins.top + this.margins.bottom));
    };
    BdGraphSizeHelper.prototype.getParentSize = function (elm) {
        var clientRect;
        var width = this.defaultSize.width;
        var height = this.defaultSize.height;
        clientRect = BdDOMRect.fromClientRect(this.container.getBoundingClientRect());
        var style = window.getComputedStyle(this.container);
        if (clientRect.width !== 0) {
            var paddingLeft = style.paddingLeft ? parseFloat(style.paddingLeft) : 0;
            var paddingRight = style.paddingRight ? parseFloat(style.paddingRight) : 0;
            var paddingHorizontal = paddingLeft + paddingRight;
            width = clientRect.width - paddingHorizontal;
        }
        if (this.chartHeight) {
            height = this.chartHeight;
        }
        else if (clientRect.height) {
            var paddingTop = style.paddingTop ? parseFloat(style.paddingTop) : 0;
            var paddingBottom = style.paddingBottom ? parseFloat(style.paddingBottom) : 0;
            var paddingVertical = paddingTop + paddingBottom;
            height = clientRect.height - paddingVertical;
        }
        return new BdSize(width, height);
    };
    BdGraphSizeHelper.prototype.adaptLeftMarginForLabels = function () {
        var maxLabelLength = 0;
        for (var _i = 0, _a = this.dataPoints; _i < _a.length; _i++) {
            var dataPoint = _a[_i];
            var labelText = void 0;
            if (this.yAxisConfig.dataType === BdAxisDataType.Date) {
                var dateAxisConfig = this.yAxisConfig;
                labelText = dateAxisConfig.labelFormatter(dataPoint.y);
            }
            else {
                var numericAxisConfig = this.yAxisConfig;
                var interval = BdNumericIntervalHelper.getIntervalAndDivision(this.yMin, this.yMax, numericAxisConfig.ticks);
                labelText = this.yAxisConfig.labelFormatter(dataPoint.y, interval.interval);
            }
            maxLabelLength = maxLabelLength < labelText.length ? labelText.length : maxLabelLength;
        }
        maxLabelLength *= this.charSize;
        this.margins.left += maxLabelLength + bdAxisDefaultValues.labelOffsetToAxis;
    };
    BdGraphSizeHelper.prototype.adaptLeftMarginForTicks = function () {
        if (this.yAxisConfig.dataType === BdAxisDataType.Number) {
            var numberConfig = this.yAxisConfig;
            if (numberConfig.majorTicks) {
                this.margins.left += bdAxisDefaultValues.majorTickSize + bdAxisDefaultValues.labelOffsetToTick;
            }
            else if (numberConfig.minorTicks) {
                this.margins.left += bdAxisDefaultValues.minorTickSize + bdAxisDefaultValues.labelOffsetToTick;
            }
        }
        else if (this.yAxisConfig.dataType === BdAxisDataType.Date) {
            var dateConfig = this.yAxisConfig;
            if (dateConfig.majorTicks) {
                this.margins.left += bdAxisDefaultValues.majorTickSize + bdAxisDefaultValues.labelOffsetToTick;
            }
            else if (dateConfig.minorTicks) {
                this.margins.left += bdAxisDefaultValues.minorTickSize + bdAxisDefaultValues.labelOffsetToTick;
            }
        }
        else {
            this.margins.left += bdAxisDefaultValues.labelOffsetToAxis;
        }
    };
    return BdGraphSizeHelper;
}());

/**
 * helper class for margins
 */
var BdMargins = /** @class */ (function () {
    function BdMargins(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    return BdMargins;
}());

var BdNumericAxisProperties = /** @class */ (function () {
    function BdNumericAxisProperties() {
        // optimal number of divisions of the axis,
        // the result can be different but is a close as possible to this number
        this.ticks = 7;
        // extra ticks above the minumum to make the chart more beautifull
        this.marginAbove = 0;
        // extra ticks underneath the minumum to make the chart more beautifull
        this.marginUnder = 0;
        // should major ticks be drawn
        this.majorTicks = false;
        // should minor ticks be drawn
        this.minorTicks = false;
    }
    return BdNumericAxisProperties;
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
var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var BdNumericAxisConfig = /** @class */ (function (_super) {
    __extends$6(BdNumericAxisConfig, _super);
    function BdNumericAxisConfig(direction, labelFormatter, numericAxisProperties) {
        var _this = _super.call(this, BdAxisDataType.Number, direction, labelFormatter) || this;
        _this.properties = new BdNumericAxisProperties();
        _this.properties = __assign$1({}, _this.properties, numericAxisProperties);
        return _this;
    }
    Object.defineProperty(BdNumericAxisConfig.prototype, "ticks", {
        /**
         * optimal number of divisions of the axis,
         * the result can be different but is as close as possible to this number
         */
        get: /**
             * optimal number of divisions of the axis,
             * the result can be different but is as close as possible to this number
             */
        function () {
            return this.properties.ticks;
        },
        set: function (value) {
            this.properties.ticks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "marginUnder", {
        /**
         * extra ticks underneath the minimum to make the chart more beautiful
         */
        get: /**
             * extra ticks underneath the minimum to make the chart more beautiful
             */
        function () {
            return this.properties.marginUnder;
        },
        set: function (value) {
            this.properties.marginUnder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "marginAbove", {
        /**
         * extra ticks above the minimum to make the chart more beautiful
         */
        get: /**
             * extra ticks above the minimum to make the chart more beautiful
             */
        function () {
            return this.properties.marginAbove;
        },
        set: function (value) {
            this.properties.marginAbove = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "cappedUnder", {
        /**
         * if no value is under cappedUnder value this will be the lowest value on the axis
         */
        get: /**
             * if no value is under cappedUnder value this will be the lowest value on the axis
             */
        function () {
            return this.properties.cappedUnder;
        },
        set: function (value) {
            this.properties.cappedUnder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "cappedAbove", {
        /**
         * if no value is above cappedUnder value this will be the lowest value on the axis
         */
        get: /**
             * if no value is above cappedUnder value this will be the lowest value on the axis
             */
        function () {
            return this.properties.cappedAbove;
        },
        set: function (value) {
            this.properties.cappedAbove = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "majorTicks", {
        /**
         * should major ticks be drawn
         */
        get: /**
             * should major ticks be drawn
             */
        function () {
            return this.properties.majorTicks;
        },
        set: function (value) {
            this.properties.majorTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdNumericAxisConfig.prototype, "minorTicks", {
        /*
         * should minor ticks be drawn
         */
        get: /*
             * should minor ticks be drawn
             */
        function () {
            return this.properties.minorTicks;
        },
        set: function (value) {
            this.properties.minorTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    return BdNumericAxisConfig;
}(BdAxisConfig));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdNumericAxisRenderConfig = /** @class */ (function (_super) {
    __extends$7(BdNumericAxisRenderConfig, _super);
    function BdNumericAxisRenderConfig(axisDirection, axisConfig, size, dataMin, dataMax, dataPoints) {
        return _super.call(this, axisDirection, BdAxisDataType.Number, axisConfig, size, dataMin, dataMax, dataPoints) || this;
    }
    BdNumericAxisRenderConfig.prototype.hasMajorTicks = function () {
        return !!this.majorTickValues;
    };
    BdNumericAxisRenderConfig.prototype.hasMinorTicks = function () {
        return !!this.minorTickValues;
    };
    BdNumericAxisRenderConfig.prototype.determineMinMaxAndTicks = function () {
        var numericAxisConfig = this.axisConfig;
        // to determine the optimal intveral and division we need the correct min and max value displayed on the chart
        var minForIntervalAndDivision;
        if (typeof numericAxisConfig.cappedUnder === 'number' && this.dataMin >= numericAxisConfig.cappedUnder) {
            minForIntervalAndDivision = numericAxisConfig.cappedUnder;
        }
        else {
            minForIntervalAndDivision = this.dataMin;
        }
        var maxForIntervalAndDivision;
        if (typeof numericAxisConfig.cappedAbove === 'number' && this.dataMax <= numericAxisConfig.cappedAbove) {
            maxForIntervalAndDivision = numericAxisConfig.cappedAbove;
        }
        else {
            maxForIntervalAndDivision = this.dataMax;
        }
        // determine the optimal interval between two ticks as close as possible to the requested numericAxisConfig.ticks
        var intervalAndDivision = BdNumericIntervalHelper.getIntervalAndDivision(minForIntervalAndDivision, maxForIntervalAndDivision, numericAxisConfig.ticks);
        this.tickInterval = intervalAndDivision.interval;
        // determine minimum value of the axis
        if (numericAxisConfig.cappedUnder === undefined) {
            var firstTickBelowMin = this.getIntervalValue(this.dataMin, this.tickInterval); // get tick closest to the minimum data value
            this.min = firstTickBelowMin - this.tickInterval * numericAxisConfig.marginUnder; // subtract some extra ticks for margin below
        }
        else {
            if (this.dataMin < numericAxisConfig.cappedUnder) {
                // if there is a value lower cappedUnder then use the first tick below the dataMinimum
                var firstTickBelowMin = this.getIntervalValue(this.dataMin, this.tickInterval);
                this.min = firstTickBelowMin;
            }
            else {
                // use the capped under value
                this.min = numericAxisConfig.cappedUnder;
            }
        }
        // determine maximum value of the axis
        if (numericAxisConfig.cappedAbove === undefined) {
            var firstTickAboveMax = this.getIntervalValue(this.dataMax, this.tickInterval) + this.tickInterval; // get the first tick above the maximum
            this.max = firstTickAboveMax + this.tickInterval * numericAxisConfig.marginAbove; // add extra ticks for the margin above
        }
        else {
            if (this.dataMax > numericAxisConfig.cappedAbove) {
                // if there is a value above cappedAbove then use the first tick above the dataMinimum
                var firstTickAboveMax = this.getIntervalValue(this.dataMax, this.tickInterval) + this.tickInterval;
                this.max = firstTickAboveMax;
            }
            else {
                this.max = numericAxisConfig.cappedAbove; // use the capped above value for the maximum
            }
        }
        this.tickValues = this.getIncrements(this.min, this.max, this.tickInterval);
        if (numericAxisConfig.majorTicks) {
            this.majorTickValues = this.getIncrements(this.min, this.max, this.tickInterval);
        }
        if (numericAxisConfig.minorTicks) {
            this.minorTickValues = this.getIncrements(this.min, this.max, this.tickInterval / intervalAndDivision.division);
        }
    };
    BdNumericAxisRenderConfig.prototype.determineDomain = function () {
        this.domain = [this.min, this.max];
    };
    BdNumericAxisRenderConfig.prototype.determineScale = function () {
        var scaleRange;
        if (this.axisDirection === BdAxisDirection.X) {
            scaleRange = [0, this.size.width];
        }
        else {
            scaleRange = [this.size.height, 0];
        }
        // make a numeric scale, a function that returns values in svg coordinate space within the domain, svg space is determined by the range
        this.scale = scaleLinear()
            .domain(this.domain)
            .range(scaleRange);
    };
    // pass a value and get the closest tick below the value
    // pass a value and get the closest tick below the value
    BdNumericAxisRenderConfig.prototype.getIntervalValue = 
    // pass a value and get the closest tick below the value
    function (value, interval) {
        return Math.floor(value / interval) * interval;
    };
    // get an array off numbers from min to max incremented by the tick interval
    // get an array off numbers from min to max incremented by the tick interval
    BdNumericAxisRenderConfig.prototype.getIncrements = 
    // get an array off numbers from min to max incremented by the tick interval
    function (start, end, increment) {
        var arr = [];
        var val = start;
        while (val < end) {
            arr.push(val);
            val += increment;
        }
        arr.push(end);
        return arr;
    };
    return BdNumericAxisRenderConfig;
}(BdBaseAxisRenderConfig));

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdRemoveClippedLabelsRenderer = /** @class */ (function (_super) {
    __extends$8(BdRemoveClippedLabelsRenderer, _super);
    function BdRemoveClippedLabelsRenderer(renderQueue, axisSvgQueries) {
        var _this = _super.call(this, renderQueue) || this;
        _this.axisSvgQueries = axisSvgQueries;
        return _this;
    }
    BdRemoveClippedLabelsRenderer.prototype.render = function () {
        var xDomRect = BdDOMRect.fromClientRect(this.axisSvgQueries.getAxis(BdAxisDirection.X));
        var labels = this.axisSvgQueries.getLabels(BdAxisDirection.X).nodes();
        for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
            var label = labels_1[_i];
            var labelRect = BdDOMRect.fromClientRect(label.getBoundingClientRect());
            var setInvisible = labelRect.left < xDomRect.left || labelRect.right > xDomRect.right;
            if (setInvisible) {
                label.style.visibility = 'hidden';
            }
        }
        this.finishRender();
    };
    return BdRemoveClippedLabelsRenderer;
}(BdRenderer));

/**
 * rendering should happen in a certain order
 * this class will hold all renderers and execute then in the correct order
 * it will also trigger renderQueSubject to indicate rendering is complete
 */
var BdRenderQueue = /** @class */ (function () {
    function BdRenderQueue() {
        this.currentRenderIndex = 0;
        this.renderers = [];
        this.renderQueueSubject = new Subject$1();
    }
    Object.defineProperty(BdRenderQueue.prototype, "onRenderQueueFinished", {
        get: function () {
            return this.renderQueueSubject;
        },
        enumerable: true,
        configurable: true
    });
    BdRenderQueue.prototype.add = function (renderer) {
        this.renderers.push(renderer);
        return this;
    };
    BdRenderQueue.prototype.startRendering = function () {
        // start by rendering the first renderer
        if (this.renderers.length > 0) {
            this.renderers[0].render();
        }
    };
    // will be called by the current renderer when it has finished rendering
    // will be called by the current renderer when it has finished rendering
    BdRenderQueue.prototype.renderNext = 
    // will be called by the current renderer when it has finished rendering
    function () {
        this.currentRenderIndex++;
        if (this.currentRenderIndex < this.renderers.length) {
            this.renderers[this.currentRenderIndex].render();
        }
        else {
            this.currentRenderIndex = 0;
            // signal all rendering and animations are complete
            this.renderQueueSubject.next();
        }
    };
    return BdRenderQueue;
}());

/**
 * these is just a helper class to define and build
 * css classes in one place
 */
var BdTemplateSharedClasses = /** @class */ (function () {
    function BdTemplateSharedClasses() {
    }
    BdTemplateSharedClasses.calloutClass = 'ng2-c-chart__callout';
    BdTemplateSharedClasses.calloutDraggerClass = 'ng2-c-chart__callout--dragger';
    BdTemplateSharedClasses.calloutTopRightClass = 'ng2-c-chart__callout--topright';
    BdTemplateSharedClasses.calloutTopLeftClass = 'ng2-c-chart__callout--topleft';
    BdTemplateSharedClasses.calloutFadeInClass = 'ng2-c-chart__callout--fadein';
    BdTemplateSharedClasses.arrowRightClass = 'ng2-c-chart__arrow--right';
    BdTemplateSharedClasses.arrowLeftClass = 'ng2-c-chart__arrow--left';
    BdTemplateSharedClasses.arrowTopClass = 'ng2-c-chart__arrow--top';
    BdTemplateSharedClasses.arrowBottomClass = 'ng2-c-chart__arrow--bottom';
    BdTemplateSharedClasses.arrowTopRightClass = 'ng2-c-chart__arrow--topright';
    BdTemplateSharedClasses.arrowTopLeftClass = 'ng2-c-chart__arrow--topleft';
    return BdTemplateSharedClasses;
}());

var BdTemplateStyles = /** @class */ (function () {
    function BdTemplateStyles() {
        this.classes = '';
        this.arrowClasses = '';
        this.templateStyle = { top: '', left: '' };
        this.arrowStyle = { top: '' };
    }
    return BdTemplateStyles;
}());

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdTickRenderer = /** @class */ (function (_super) {
    __extends$9(BdTickRenderer, _super);
    function BdTickRenderer(renderQueue, svgSelection, chartSize, axisRenderConfig) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.chartSize = chartSize;
        _this.axisRenderConfig = axisRenderConfig;
        return _this;
    }
    BdTickRenderer.prototype.render = function () {
        // determine which ticks need to be added
        if (this.axisRenderConfig.hasMinorTicks()) {
            this.makeTicks(false);
        }
        if (this.axisRenderConfig.hasMajorTicks()) {
            this.makeTicks(true);
        }
        // call the next render function
        this.finishRender();
    };
    BdTickRenderer.prototype.makeTicks = function (makeMajorTicks) {
        // we add ticks by adding extra axis
        // this will give us the correct axis function
        var d3Axis$$1 = this.determineAxis();
        // configure ticks depending on datatype
        this.configureTicks(makeMajorTicks, d3Axis$$1);
        // append a container for the ticks
        var axisElement = this.svgSelection.append('g')
            .attr('class', BdAxisClasses.getTicksClass(this.axisRenderConfig.axisDirection, makeMajorTicks));
        if (this.axisRenderConfig.axisDirection === BdAxisDirection.X) {
            // we need to translate the ticks of x axis because else they will be shown on top of the chart
            // we also need to translate a bit further depending on the tick size so they are shown beneath the axis
            BdTransformHelper.applyTransformationToSelection(axisElement, 0, this.chartSize.height - this.tickSize);
        }
        else {
            // for the y axis we only need to translate x with ticksize so they are displayed on the left of the y axis
            BdTransformHelper.applyTransformationToSelection(axisElement, this.tickSize, 0);
        }
        // append the axis
        axisElement.call(d3Axis$$1);
        axisElement.call(function (selection) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            // add a class to the ticks
            selection.selectAll('.tick').attr('class', BdAxisClasses.getTickClass(makeMajorTicks));
            // nicer rendering for ticks
            selection.selectAll('line')
                .attr('shape-rendering', 'crispEdges');
        });
    };
    // create an axis with the right scale and direction
    // create an axis with the right scale and direction
    BdTickRenderer.prototype.determineAxis = 
    // create an axis with the right scale and direction
    function () {
        if (this.axisRenderConfig.axisDirection === BdAxisDirection.X) {
            return axisBottom(this.axisRenderConfig.scale);
        }
        else {
            return axisLeft(this.axisRenderConfig.scale);
        }
    };
    // configure ticks depending on datatype and if they are major or minor
    // configure ticks depending on datatype and if they are major or minor
    BdTickRenderer.prototype.configureTicks = 
    // configure ticks depending on datatype and if they are major or minor
    function (makeMajorTicks, d3Axis$$1) {
        if (this.axisRenderConfig.dataType === BdAxisDataType.Date) {
            var timeAxisConfig = this.axisRenderConfig;
            var timeTicks = makeMajorTicks ? timeAxisConfig.majorTimeTicks : timeAxisConfig.minorTimeTicks;
            d3Axis$$1.ticks(BdTimeIntervalHelper.getTimeIntervalFunction(timeTicks));
        }
        else {
            var numericAxisConfig = this.axisRenderConfig;
            var tickValues = makeMajorTicks ? numericAxisConfig.majorTickValues : numericAxisConfig.minorTickValues;
            d3Axis$$1.tickValues(tickValues);
        }
        d3Axis$$1.tickFormat(function () { return ''; });
        this.tickSize = makeMajorTicks ? -bdAxisDefaultValues.majorTickSize : -bdAxisDefaultValues.minorTickSize;
        d3Axis$$1.tickSize(this.tickSize);
    };
    return BdTickRenderer;
}(BdRenderer));

var BdTimeAxisProperties = /** @class */ (function () {
    function BdTimeAxisProperties() {
        // divisions of the axis expressed in a time value ex: month, day
        this.timeTicks = BdTimeTicks.Month;
    }
    return BdTimeAxisProperties;
}());

var __extends$10 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign$2 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var BdTimeAxisConfig = /** @class */ (function (_super) {
    __extends$10(BdTimeAxisConfig, _super);
    function BdTimeAxisConfig(direction, labelFormatter, timeAxisProperties) {
        var _this = _super.call(this, BdAxisDataType.Date, direction, labelFormatter) || this;
        _this.properties = new BdTimeAxisProperties();
        _this.properties = __assign$2({}, _this.properties, timeAxisProperties);
        return _this;
    }
    Object.defineProperty(BdTimeAxisConfig.prototype, "timeTicks", {
        /**
         * divisions of the axis expressed in a time value ex: month, day
         */
        get: /**
             * divisions of the axis expressed in a time value ex: month, day
             */
        function () {
            return this.properties.timeTicks;
        },
        set: function (value) {
            this.properties.timeTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTimeAxisConfig.prototype, "maxDate", {
        /**
         * maximum date displayed on the axis
         */
        get: /**
             * maximum date displayed on the axis
             */
        function () {
            return this.properties.maxDate;
        },
        set: function (value) {
            this.properties.maxDate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTimeAxisConfig.prototype, "minDate", {
        /**
         * maximum date displayed on the axis
         */
        get: /**
             * maximum date displayed on the axis
             */
        function () {
            return this.properties.minDate;
        },
        set: function (value) {
            this.properties.minDate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTimeAxisConfig.prototype, "majorTicks", {
        /**
         * where to put major ticks expressed in a time value ex: month, day,....
         */
        get: /**
             * where to put major ticks expressed in a time value ex: month, day,....
             */
        function () {
            return this.properties.majorTicks;
        },
        set: function (value) {
            this.properties.majorTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BdTimeAxisConfig.prototype, "minorTicks", {
        /**
         * where to put major ticks expressed in a time value ex: month, day,....
         */
        get: /**
             * where to put major ticks expressed in a time value ex: month, day,....
             */
        function () {
            return this.properties.minorTicks;
        },
        set: function (value) {
            this.properties.minorTicks = value;
        },
        enumerable: true,
        configurable: true
    });
    return BdTimeAxisConfig;
}(BdAxisConfig));

var __extends$11 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdTimeAxisRenderConfig = /** @class */ (function (_super) {
    __extends$11(BdTimeAxisRenderConfig, _super);
    function BdTimeAxisRenderConfig(axisDirection, axisConfig, size, dataMin, dataMax, dataPoints) {
        var _this = _super.call(this, axisDirection, BdAxisDataType.Date, axisConfig, size, dataMin, dataMax, dataPoints) || this;
        _this.labelsAreCentered = _this.labelsNeedToCenterCenter();
        return _this;
    }
    BdTimeAxisRenderConfig.prototype.hasMajorTicks = function () {
        return !!this.majorTimeTicks;
    };
    BdTimeAxisRenderConfig.prototype.hasMinorTicks = function () {
        return !!this.minorTimeTicks;
    };
    BdTimeAxisRenderConfig.prototype.determineMinMaxAndTicks = function () {
        // get the extremity value from the data
        var timeAxisConfig = this.axisConfig;
        this.timeInterval = BdTimeIntervalHelper.getTimeIntervalFunction(timeAxisConfig.timeTicks); // get the time interval
        this.min = timeAxisConfig.minDate ? timeAxisConfig.minDate.getTime() : this.dataMin; // if a minimum date was configured use it else use min from data
        this.max = timeAxisConfig.maxDate ? timeAxisConfig.maxDate.getTime() : this.dataMax; // if a maximum date was configured use it else use min from data
        this.timeTicks = timeAxisConfig.timeTicks;
        this.majorTimeTicks = timeAxisConfig.majorTicks;
        this.minorTimeTicks = timeAxisConfig.minorTicks;
    };
    BdTimeAxisRenderConfig.prototype.determineDomain = function () {
        this.domain = [this.min, this.max];
    };
    BdTimeAxisRenderConfig.prototype.determineScale = function () {
        var scaleRange;
        if (this.axisDirection === BdAxisDirection.X) {
            scaleRange = [0, this.size.width];
        }
        else {
            scaleRange = [this.size.height, 0];
        }
        this.scale = scaleTime()
            .domain(this.domain)
            .range(scaleRange);
    };
    // the labels for some TimeTicks need to be centered
    // the labels for some TimeTicks need to be centered
    BdTimeAxisRenderConfig.prototype.labelsNeedToCenterCenter = 
    // the labels for some TimeTicks need to be centered
    function () {
        return this.timeTicks !== BdTimeTicks.Hour;
    };
    return BdTimeAxisRenderConfig;
}(BdBaseAxisRenderConfig));

var __extends$12 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BdTransformChartRenderer = /** @class */ (function (_super) {
    __extends$12(BdTransformChartRenderer, _super);
    function BdTransformChartRenderer(renderQueue, svgSelection, xAxisRenderConfig, yAxisRenderConfig, axisSvgQueries, chartMargins) {
        var _this = _super.call(this, renderQueue) || this;
        _this.svgSelection = svgSelection;
        _this.xAxisRenderConfig = xAxisRenderConfig;
        _this.yAxisRenderConfig = yAxisRenderConfig;
        _this.axisSvgQueries = axisSvgQueries;
        _this.chartMargins = chartMargins;
        return _this;
    }
    BdTransformChartRenderer.prototype.render = function () {
        // apply an offset to the labels so they dont stick to the chart and dont overlap ticks
        // first get the length of the major/minor ticks or 0 if they are not present
        var xLabelYOffset = this.getLabelOffset(BdAxisDirection.X);
        // add the distance to the tick or the distance to the axis if there are no ticks
        // get the labels
        var xTextNodeSelection = this.axisSvgQueries.getLabels(BdAxisDirection.X);
        // apply the calculated offset
        xTextNodeSelection.call(function (selection) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            selection.attr('y', xLabelYOffset);
        });
        // apply an offset to the labels so they dont stick to the chart and dont overlap ticks
        // first get the length of the major/minor ticks or 0 if they are not present
        var yLabelXOffset = this.getLabelOffset(BdAxisDirection.Y);
        // get the labels
        var yTextNodeSelection = this.axisSvgQueries.getLabels(BdAxisDirection.Y);
        // apply the calculated offset
        yTextNodeSelection.call(function (selection) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            selection.attr('x', -yLabelXOffset);
        });
        // get the max width of the text labels on the y axis
        var textNodes = yTextNodeSelection.nodes();
        var labelMax = 0;
        for (var _i = 0, textNodes_1 = textNodes; _i < textNodes_1.length; _i++) {
            var textNode = textNodes_1[_i];
            var nodeWith = textNode.getBoundingClientRect().width;
            labelMax = labelMax < nodeWith ? nodeWith : labelMax;
        }
        // we need to translate the graph with this distance over x so y-labels and ticks don't fall of the screen
        var labelXTranslationValue = yLabelXOffset + labelMax;
        // calculate the translation needed to center the graph
        var svgWidth = this.svgSelection.node().parentElement.getBoundingClientRect().width;
        var gWidth = this.svgSelection.node().getBoundingClientRect().width;
        var centerXTranslationValue = (svgWidth - gWidth) / 2;
        // total translation calculation
        var totalXTranslationValue = labelXTranslationValue + centerXTranslationValue;
        BdTransformHelper.applyTransformationToSelection(this.svgSelection, totalXTranslationValue, this.chartMargins.top);
        this.finishRender();
    };
    BdTransformChartRenderer.prototype.getLabelOffset = function (axisDirection) {
        var axisRenderConfig = axisDirection === BdAxisDirection.X ? this.xAxisRenderConfig : this.yAxisRenderConfig;
        if (axisRenderConfig.dataType === BdAxisDataType.Date) {
            var timeAxisConfig = axisRenderConfig;
            if (timeAxisConfig.majorTimeTicks && !timeAxisConfig.labelsAreCentered) {
                return bdAxisDefaultValues.majorTickSize;
            }
            else if (timeAxisConfig.majorTimeTicks && timeAxisConfig.labelsAreCentered) {
                return bdAxisDefaultValues.minorTickSize + (bdAxisDefaultValues.labelOffsetToAxis * 0.5);
            }
            if (timeAxisConfig.minorTimeTicks) {
                return bdAxisDefaultValues.minorTickSize + (bdAxisDefaultValues.labelOffsetToAxis * 0.5);
            }
        }
        else {
            var numericAxisRenderConfig = axisRenderConfig;
            if (numericAxisRenderConfig.majorTickValues) {
                return bdAxisDefaultValues.majorTickSize + bdAxisDefaultValues.labelOffsetToAxis;
            }
            if (numericAxisRenderConfig.minorTickValues) {
                return bdAxisDefaultValues.minorTickSize + bdAxisDefaultValues.labelOffsetToAxis;
            }
        }
        return bdAxisDefaultValues.labelOffsetToAxis;
    };
    return BdTransformChartRenderer;
}(BdRenderer));

/**
 * Generated bundle index. Do not edit.
 */

export { BdAddFirstTimeTickIfMissingRenderer, BdAxisClasses, BdAxisConfig, BdAxisDataType, BdAxisDefaultValues, BdAxisDirection, BdAxisRenderer, BdAxisSvgQueries, BdBandAxisConfig, BdBandAxisRenderConfig, BdBaseAxisRenderConfig, BdCenterLabelsBetweenTicksRenderer, BdChartCoreModule, BdChartTemplateComponent, BdClipPathRenderer, BdCoordinates, BdDataPoint, BdGraphSizeHelper, BdIntervalAndDivision, BdMargins, BdNumericAxisConfig, BdNumericAxisProperties, BdNumericAxisRenderConfig, BdNumericIntervalHelper, BdPositionStrategy, BdRemoveClippedLabelsRenderer, BdRenderer, BdRenderQueue, BdSize, BdTemplateSharedClasses, BdTemplateStyles, BdTickRenderer, BdTimeAxisConfig, BdTimeAxisProperties, BdTimeAxisRenderConfig, BdTimeIntervalHelper, BdTimeTicks, BdTransformChartRenderer, BdTransformHelper, BasePositioningData };
//# sourceMappingURL=index.js.map
