# BD-TABLE

## bd-table of contents
- [bd-table](#bd-table)
- [bd-table-header](#bd-table-header)
- [bd-table-header-column](#bd-table-header-column)
- [bd-table-content](#bd-table-content)
- [bd-table-group](#bd-table-group)
- [bd-table-row](#bd-table-row)
- [bd-table-column](#bd-table-column)
- [bd-table-footer](#bd-table-footer)
- [bd-table-directive](#bd-table-directive)
- [usage](#usage)

---

## General principle

Bd-table is a component with 2 seperate modes. The table can be shown in the default mode, eg. just like a regular table with a table header, table rows and table columns.

Besides that we also have a stacked mode. This is enabled when there is not enough space to display the selected columns. The default table header is removed and is shown inside each column. This is because inside a single row you can have multiple lines of columns. In that case the default header would not be useable.

![default vs stacked](bd-table.png)

## bd-table

Bd-table is the Angular 2 version of bd-fluid-table and the starting point to all the magic.


### API
- `[showHeader]="boolean"` - boolean to show/hide the header (default `true`)
- `[stickyHeader]="boolean"` - Boolean to set the table header to stick to the top while scrolling (default `false`)
- `dropdownLabel="string"` - Text to show on dropdown label
- `[showSelectableColumns]="boolean"` - Show or hide the selectable columns dropdown (default `true`)
- `[(selectedColumns)]="string[]"` - Array that sets the currently selected columns
- `(selectedColumnsChange)="function($event)"` - Event that is emitted when selectedColumns is updated. Updated data is passed via `$event`.
- `[minWeight]="number"` - Sets the minimum number of weights to be distributed. E.g. if set to 16, a minimum of 16 weight points are used. If not set a number will determined based on the table width.
- `[offset]="number"` - Add an offset value to the table to keep in mind before it becomes sticky. Default 0.


### Styles

- `ng2-c-table--gradient` - Fades out the bottom 3 rows for a smoother experience
- `ng2-c-table--p-xs` - Smaller padding for the columns


### Example

```html
<bd-table
    dropdownLabel="Select"
    [stickyHeader]="true"
    [(selectedColumns)]="currentSelectedColumns"
>
    ...
</bd-table>
```

---

## bd-table-header

This is the table header (just as it says in the name). This seems to be an exception on the _use classes if possible_ rule, but this component contains the logic to position itself when `stickyHeader` is enabled on `bd-table`

### Example

```html
<bd-table-header>
    ...
</bd-table-header>
```

---

## bd-table-header-column

Represents one column inside a `bd-table-header`.

### API

- `title="string"` - The text to be shown in the column
- `[weight]="number"` - The width of each column is determined by the weight * 25px, so if the weight of a column is 4, the width of the column is 100px. On the smallest supported device, a total of 12 weight points can be distributed.
- `[stackedWeight]="number"` - Same as weight, but this value is used in stacked mode
- `[priority]="number"` - Based on the weight, some columns might not fit on the page and the table will hide these automatically. By setting the priority, you can determine which columns should be hidden first (default `99`)
- `[fixed]="boolean"` - When set to true, the table will not hide this column (default `false`)
- `[grow]="boolean"` - When set to true, the column will grow to fit the leftover space. When no columns are set to grow, all columns will distribute the leftover space. Only one column can have this grow property. (default `false`)
- `[main]="boolean"` - When set to true, this column will be styled differently in stacked mode. Implicitly sets `fixed` tot `true`  (default `false`)
- `[action]="boolean"` - When set to true, this column will behave as an action column. This means that it will be displayed next to the first column in the stacked mode. Implicitly sets `fixed` tot `true`. (default `false`)
- `help="string"` - Help text that displayed next to the header. Also shows the nice questionmark icon.
- `[initial]="boolean"` - When set to false, this column will not be shown when initally rendering the table (default `true`)

### Styles

- `ng2-c-table__header-column--right` - Align the header column to the right

### Example

```html
<bd-table-header-column
    title="Naam"
    [weight]="4"
    [fixed]="true"
    help="Meer informatie"
></bd-table-header-column>
```


## bd-table-content

A container for the table content.

### Example

```html
<bd-table-content>
    ...
</bd-table-content>
```


## bd-table-group

Table rows can be grouped by using the bd-table-group.

### API

- `title="string"`

### Example

```html
<bd-table-group title="Group 1">
    ...
</bd-table-group>
```


## bd-table-row

A single row inside the table.

### Styles

- `ng2-c-table__row--p-xs` - Smaller padding for the columns

### Example

```html
<bd-table-row>
    ...
</bd-table-row>
```


## bd-table-column

A single column inside the table.

### Styles

- `ng2-c-table__column--right` - Align the column to the right

### Example

```html
<bd-table-column>
    ...
</bd-table-column>
```


## bd-table-footer

A container for the table footer.

### Example

```html
<bd-table-footer>
    ...
</bd-table-footer>
```

## bd-table-directive

 Add the bdTableDetermineBackground directive to a parent element to be able to determine the background of that element.
 When this directive is found the table component will set the header background to the same color as the targeted element.
### Example

```html
<bd-sections2>
    <bd-section2 bdTableDetermineBackground>
        ...
        <bd-table></bd-table>
    </bd-section2>
    <bd-section2 bdTableDetermineBackground>
        ...
        <bd-table></bd-table>
    </bd-section2>
</bd-sections2>
```

## Usage

```html
<bd-table dropdownLabel="Label" [stickyHeader]="true" [minWeight]="16" [(selectedColumns)]="selectedColumns">
    <bd-table-header>
        <bd-table-header-column [weight]="4" help="HELP 1" [grow]="true" [main]="true" [fixed]="true" title="Naam"></bd-table-header-column>
        <bd-table-header-column [weight]="4" help="HELP 2" title="Gewicht" class="ng2-c-table__header-column--right"></bd-table-header-column>
        <bd-table-header-column [weight]="6" help="HELP 3" title="Koers" class="ng2-c-table__header-column--right"></bd-table-header-column>
        <bd-table-header-column [weight]="6" help="HELP 4" title="Sinds 1 jan" class="ng2-c-table__header-column--right"></bd-table-header-column>
        <bd-table-header-column [weight]="6" [priority]="1" help="HELP 5" title="Waarde" class="ng2-c-table__header-column--right"></bd-table-header-column>
    </bd-table-header>

    <bd-table-content>
        <bd-table-group [title]="group.title" *ngFor="let group of groups">
            <bd-table-row *ngFor="let row of table">
                <bd-table-column class="u-color--blue">{{ row.name }}</bd-table-column>
                <bd-table-column class="ng2-c-table__column--right">{{ row.weight }}</bd-table-column>
                <bd-table-column class="ng2-c-table__column--right">{{ row.amount }} €</bd-table-column>
                <bd-table-column class="ng2-c-table__column--right">{{ row.percentage }}%</bd-table-column>
                <bd-table-column class="ng2-c-table__column--right">{{ row.value }} €</bd-table-column>
            </bd-table-row>
        </bd-table-group>
    </bd-table-content>

    <bd-table-footer>
        table footer
    </bd-table-footer>
</bd-table>
```
