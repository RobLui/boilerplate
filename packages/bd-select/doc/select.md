# BD-SELECT

This package contains 2 components:
- bd-select2
- bd-select-option2

## bd-selection
The `bd-select2` element is used to create a drop-down list.
The `bd-select-option2` tags inside the `bd-select` element define the available options in the list.

### API

#### bd-select

`selection` (input, output)
The id (`string`) of the currently selected item. (needs an initial value !)

#### bd-select-option
`id` (input)
The id of the option.

`label` (input)
The text that is shown when this option is selected.

### Styling
`ng2-c-select--white` - Makes it white. Needs to be set when used inside ng2-c-header.

`ng2-c-select--lowercase` - Reset the text-decoration. Designed for usage inside headers.

### Usage example
```ts
// my.component.ts
currentSelection: string = 'Item1';
```

```html
<!-- my.component.html -->
<bd-select2 [(selection)]="currentSelection">
    <bd-select-option2 [id]="'Item1'" [label]="'Item1Label'"></bd-select-option2>
    <bd-select-option2 [id]="'Item2'" [label]="'Item2Label'"></bd-select-option2>
    <bd-select-option2 [id]="'Item3'" [label]="'Item3Label'"></bd-select-option2>
</bd-select2>
```

### Screenshots

![bd-select](bd-select.png)

![bd-select](bd-select-active.png)
