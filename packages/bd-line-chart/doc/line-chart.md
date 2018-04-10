# BD-LINE-CHART
```html
<main class="ng2-c-dialog___content" #dialogContent>
    <bd-line-chart2
                 [data]="dataSet?.lineChartData"
                 [xAxisConfig]="dataSet?.xAxisConfig"
                 [yAxisConfig]="dataSet?.yAxisConfig"
                 [selectionType]="selectionType"
                 [height]="300"
                 (onRenderFinished)="renderingFinished()"
                [(selectedDataPoint)]="selectedDataPoint"
                [container]="dialogContent">

            {{ selectedDataPoint.x | date: 'dd/MM/yyyy'}}<br>
            {{ selectedDataPoint.y  }}
            {{ selectedDataPoint.data  }}

    </bd-line-chart2>
</main>
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

Notice that you can transclude anything you want to show in the LineChartTemplate for the selected point. Usually you will use information
of the selected point (see example above).
```html
<bd-line-chart2 ... [(selectedDataPoint)]="selectedDataPoint">
    {{ selectedDataPoint.x | date: 'dd/MM/yyyy'}}
    {{ selectedDataPoint.y  }}
</bd-line-chart2>
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
- `BdChartSelectionType.Bullet` bullets will be drawn on the line for each BdDataPoint (except the first one), the user can click these bullets to select a BdDataPoint
- `BdChartSelectionType.Dragger` a dragger handle will be drawn, the user can drag it to select a BdDataPoint.

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
