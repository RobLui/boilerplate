# BD-BUTTON-GROUP

This package contains 2 components:
- bd-button-group2
- bd-button-group-item2

The `bd-button-group2` is the container directive to create a grouping of state buttons.
On mobile the `bd-button-group2` is displayed as a select.

The `bd-button-group-item2` tags inside the `bd-button-group` element define the available items in the list.

### API

#### bd-button-group

`selection` (input, output)  
The id (`string`) of the currently selected item. (needs an initial value !)

#### bd-button-group-item
`id` (input)  
The id of the item.

`label` (input)  
The text that is shown in the menu / when option is selected

### Usage
```ts
// my.component.ts
currentSelection: string = 'baz';
```

```html
<!-- my.component.html -->
<bd-button-group2 [(selection)]="currentSelection">
    <bd-button-group-item2 [id]="first" [label]="First"></bd-button-group-item2>
    <bd-button-group-item2 [id]="second" [label]="second"></bd-button-group-item2>
</bd-button-group2>
```

### Screenshots

![bd-button-group](bd-button-group-mobile.png)
![bd-button-group](bd-button-group-ipad.png)
