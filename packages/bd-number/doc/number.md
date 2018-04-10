# BD-NUMBER

## Directives

`bdNumberSign`

Adds a class on the element which indicates the given value is negative or positive. The value must be a valid javascript Number.

## Usage
```html
<div [bdNumberSign]="12">12</div> <!-- .u-color--positive -->
<div [bdNumberSign]="-12">-12</div> <!-- .u-color--negative -->
```
