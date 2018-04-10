# BD-VERTICAL-BAR-CHART
> Please note that the docs will be improved in the refactor
```html
<bd-vertical-bar-chart2
    [data]="dataSet?.verticalBarChartData"
    [xAxisConfig]="dataSet?.xAxisConfig"
    [yAxisConfig]="dataSet?.yAxisConfig"
    [selectionType]="selectionType"
    [height]="300"
    (onRenderFinished)="renderingFinished()"
    [(selectedDataPoint)]="selectedDataPoint">
    <ng-container *ngIf="dataSet">
        <!--  place the content of the template here -->
        <p class="u-text--label u-mb--none">Valuation on {{ selectedDataPoint.x | date: 'dd MMM yyyy' }}</p>
        <p class="u-text--currency">{{ selectedDataPoint.y }} EUR</p>
        <p class="u-text--label u-mb--none">Deposits in {{ selectedDataPoint.x | date: 'MMM yyyy' }}</p>
        <p class="u-text--currency">{{ selectedDataPoint.y }} EUR</p>
        <p class="u-text--label u-mb--none">Withdrawals in {{ selectedDataPoint.x | date: 'MMM yyyy' }}</p>
        <p class="u-text--value u-mb--none">{{ selectedDataPoint.y }} EUR</p>
    </ng-container>
</bd-vertical-bar-chart2>
```
## HTML API
- `data` array of BdDataPoint
- `xAxisConfig` an object of type NumericAxisConfig or TimeAxisConfig, will determine how the axis looks
- `yAxisConfig` an object of type NumericAxisConfig or TimeAxisConfig, will determine how the axis looks
- `selectionType` value of BdChartSelectionType: None, Bullet, Dragger, will determine how a point is selected
- `height` the height of the chart
- `onRenderFinished` this method fires when all rendering and animating is finished
- `selectedDataPoint` you can use this to set or get the currently selected point in the chart, the point should be in data (bullet or dragger will update)
- `container` if you want the chart to fill a parent element use this to reference the parent container

Notice that you can transclude anything you want to show in the template for the selected point. Usually you will use information
of the selected point (see example above).
```html
<bd-vertical-bar-chart2 ... [(selectedDataPoint)]="selectedDataPoint">
    <ng-container *ngIf="dataSet">
        {{ selectedDataPoint.x | date: 'dd/MM/yyyy'}}
        {{ selectedDataPoint.y  }}
    </ng-container>
</bd-vertical-bar-chart2>
```

![template](template.png)

## TypeScript API
### BdDataPoint
- `x` x coordinate of the point, type: number or Date
- `y` y coordinate of the point, type: number or Date
- `data` type is any, you can use this property to attach extra information to a point

### BdChartSelectionType (enum)
Will determine the method for selecting a point
- `BdChartSelectionType.None` the user can not select
- `BdChartSelectionType.barSelection` a template will be drawn next to the bar

Notice that only DataPoints can be selected and not values in between points. When the user clicks or drags anywhere on the chart an algorithm will search for
the closest point on the chart and select that one.

### NumericAxisConfig
If the datatype of the x-coordinate is number use this class to configure the xAxisConfig.
If the datatype of the y-coordinate is number use this class to configure the yAxisConfig.
- `direction` use AxisDirection.X or AxisDirection.Y depending on which axis you are configuring with this object (Y in image below)
- `labelFormatter` a method of type `(domainValue: any, interval: number) => string`, domainValue is the coordinate value, interval is optional, but is most often used as radix for the toString method, use this method to format labels on axis
`numericAxeProperties` partial class for NumericAxeProperties
- `cappedUnder` optional, if no value is under cappedUnder value this will be the lowest value on the axis
- `cappedAbove` optional, if no value is above cappedAbove value this will be the highest value on the axis
- `ticks` optional, default 7, optimal number of divisions of the grid (determines the labels), the result can be different but is a close as possible to this number
- `marginAbove`, optional, default 0, extra ticks above the maximum to make the chart more beautifull
- `marginUnder`, optional, default 0, extra ticks underneath the minumum to make the chart more beautifull
- `majorTicks` optional, default false, if true major ticks are drawn
- `minorTicks` optional, default false, if true minor ticks are drawn

![numeric](numeric.png)

```js
new NumericAxisConfig(
    AxisDirection.Y,
    (value: number, radix: number) => value,
    {
        marginAbove: 2,
        marginUnder: 2,
        cappedUnder: 0,
        ticks: 5,
        majorTicks: true,
        minorTicks: true
    }
);
```


### TimeAxisConfig
If the datatype of the x-coordinate is date use this class to configure the xAxisConfig.
If the datatype of the y-coordinate is date use this class to configure the yAxisConfig.
- `direction` use AxisDirection.X or AxisDirection.Y depending on which axis you are configuring with this object (X in image below)
- `labelFormatter` a method of type `(dateValue: any) => string`, dateValue is the coordinate value, use this method to format labels on axis
`timeAxisProperties` partial class for timeAxisProperties
- `minDate` optional, minimum date displayed on the axis, if not provided it is minimum date of the dataset
- `maxDate` optional, maximum date displayed on the axis, if not provided it is maximum date of the dataset
- `timeTicks` optional, default: TimeTicks.Month, division of the grid (determines the labels), example: TimeTicks.Month will divide the grid on monthly basis
- `majorTicks`, optional, if set majorTicks will be drawn for the given time interval, example: TimeTicks.Month will draw a major tick for each month in the domain
- `minorTicks`, optional, if set minorTicks will be drawn for the given time interval, example: TimeTicks.Day will draw a minor tick for each day in the domain

```js
new TimeAxisConfig(
    AxisDirection.X,
    (value: Date) => value.toLocaleString('en-us', { month: 'short'}).toUpperCase(),
    {
        minDate: new Date(Date.parse('2016-12-31T23:00:00.000Z')),
        maxDate: new Date(Date.parse('2017-12-31T22:59:59.999Z')),
        timeTicks: TimeTicks.Month,
        majorTicks: TimeTicks.Month,
        minorTicks: TimeTicks.Day
    }
);
```

![numeric](time.png)

## How to configure a dataset in the demo Q&A
Q: Where to get a dataset?
A: You can log the data in the code of the app. The dataset is formatted in a specific way.
Q: What should the dataset look like?
A: It contains 3 objects: dataPoints, yAxis, xAxis and should look like the sample below:
"{
    "dataPoints":[
        {
            "x": "2017-12-30T23:00:00.000Z",
            "y": 0,
            "offsetX": 0,
            "drawDot": true
        },
        {
            "x": "2018-01-30T23:00:00.000Z",
            "y": 110502240.1,
            "offsetX": 0,
            "drawDot": true
        },
        {
            "x": "2018-02-25T23:00:00.000Z",
            "y": 121371171.02,
            "offsetX": 0,
            "drawDot": true
        }
    ],
    "yAxis":{
        "marginAbove":0,
        "marginUnder":0,
        "ticks":7,
        "cappedUnder":0
    },
    "xAxis":{
        "min":"2016-12-31T23:00:00.000Z",
        "max":"2017-12-31T22:59:59.999Z",
        "labels":"month",
        "minorTicks":"month"
    }
}"
Q: How to create a new set of data?
A: Follow the convention that is used in other data files. Original file can be found at `demo/src/app/demo/line-chart/data.ts`.
    Create a function called createFirstSet()

We use the built in Date.toLocaleString() to format our date-times, more info + what options can you use? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
