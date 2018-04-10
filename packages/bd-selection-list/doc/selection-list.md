# BD-SELECTION-LIST

This package contains 3 components:
- bd-selection-list2: select 1 item from a list
- bd-multi-selection-list2: select 0 or more items from a list
- bd-selection-list-item2: represents 1 item in a bd-selection-list2 or bd-multi-selection-list2 list

## bd-selection-list2
The `bd-selection-list2` component is used to display items in a radiobutton list.

### API
`name` (input)  
The name (`string`) of the current list item.

`selected` (input, output)  
The key (`string`) of the currently selected item, or null.

`selectedChange` (output)  
Emits the key (`string`) of the selected item when the selection changes.

`loading` (input)  
A `boolean` value indicating whether a loading spinner should be displayed.

`nullable` (input)  
A `boolean` value indicating whether the selected item can be deselected.

### Styling
`ng2-c-selection-list--small`  
Apply to the host element to reduce the height of each list item.

`ng2-c-selection-list--center`  
Apply to the host element to center labels horizontally.

### Usage example
```ts
// my.component.ts
currentLanguage: string = 'en';
```

```html
<!-- my.component.html -->
<bd-selection-list2 [(selected)]="currentLanguage">
    <bd-selection-list-item2 key="nl">Nederlands</bd-selection-list-item2>
    <bd-selection-list-item2 key="fr">Français</bd-selection-list-item2>
    <bd-selection-list-item2 key="en">English</bd-selection-list-item2>
</bd-selection-list2>
```

## bd-multi-selection-list2
The `bd-multi-selection-list2` component is used to display items in a checkbox list.

### API
`selected` (input, output)  
The keys (`string[]`) of the currently selected items.

`selectedChange` (output)  
Emits the keys (`string[]`) of the selected items when the selection changes.

`loading` (input)  
A boolean value indicating whether a loading spinner should be displayed.

### Styling
Same as `bd-selection-list2` because styles are shared.

`ng2-c-selection-list--small`  
Apply to the host element to reduce the height of each list item.

`ng2-c-selection-list--center`  
Apply to the host element to center labels horizontally.

### Usage example
```ts
coreteam: string[] = [
    'arncha',
    'janbus',
    'jancor',
    'nicadr',
    'piebru',
    'stelie',
    'svetob'
];
```

```html
<!-- my.component.html -->
<bd-multi-selection-list2 [(selected)]="coreteam">
    <bd-selection-list-item2 key="arncha">Arno<bd-selection-list-item2>
    <bd-selection-list-item2 key="janbus">Jan<bd-selection-list-item2>
    <bd-selection-list-item2 key="jancor">Jan Willem<bd-selection-list-item2>
    <bd-selection-list-item2 key="nicadr">Nick<bd-selection-list-item2>
    <bd-selection-list-item2 key="piebru">Pieter<bd-selection-list-item2>
    <bd-selection-list-item2 key="stelie">Steven<bd-selection-list-item2>
    <bd-selection-list-item2 key="svetob">Sven<bd-selection-list-item2>
</bd-multi-selection-list2>
```

## bd-selection-list-item2
The `bd-selection-list-item2` component represents one list item in a `bd-selection-list2` list or a `bd-multi-selection-list2` list.

### API
`key` (input)  
The unique id (`string`) of the current list item. (required)

`label` (input)  
The display value (`string`) of the current list item. (optional)  
The label can also be set as content instead of an attribute binding. When this value is set, the tag's content is ignored.

### Usage example

Set key and label via binding to inputs:
```html
<bd-selection-list-item2 key="li-1" label="List Item 1"></bd-selection-list-item2>
```

Set label via content:
```html
<bd-selection-list-item2 key="li-2">List item 2</bd-selection-list-item2>
```

Customize label with extra markup:
```html
<bd-selection-list-item2 key="li-3">
    <span class="u-text--upper">I like to yell without reason</span>
</bd-selection-list-item2>
```
