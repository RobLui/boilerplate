# BD-CHECKBOX

## Required imports
Import these in your app module:
- FormsModule (from @angular/forms)
- BdCheckboxModule

## bd-checkbox2

The `bd-checkbox2` component is used to display a stylish checkbox.

### API
`inputId` (string)  
A unique identifier (`string`) for the current checkbox. Useful in combination with a `<label for="inputId">`.

`name` (input)  
A name (`string`) for the current checkbox. Useful in combination with `ngForm` and `ngSubmit`.

`autocheck` (input)  
A value that indicates whether the checkbox can change itself when clicked.  
When `true`, two-way bindings are supported via `ngModel`.  
When `false`, only one-way bindings are supported via `ngModel`. See `beforeChange` for more information.

`ngModel` (input, output)  
The current checked state (`boolean`).

`ngModelChange` (output)  
Emits the current checked state (`boolean`) when the checkbox is clicked and `autocheck` is enabled.

`change` (output)  
Alias for `ngModelChange`.

`beforeChange` (output)  
Emits the next checked state (`boolean`) when the checkbox is clicked.  
When `autocheck` is true, the `change` and `ngModelChange` events are raised immediately after `beforeChange`.  
When `autocheck` is false, the checkbox is not actually checked and no other events are raised.  
Use this event to update the `ngModel` binding when `autocheck` is `false`.

### Styling

`ng2-c-checkbox__label`  
Apply to native `<label>` elements if they are the parent element of a bd-checkbox2.

`ng2-c-checkbox__label--rtl`  
Apply to labels to reverse the order of the checkbox and label text.

`ng2-c-checkbox__label-text`  
Apply to children of labels that contain text.

## API examples
Simple checkbox without any logic
```html
<bd-checkbox2></bd-checkbox2>
```

Checkbox as a child element of a label.
```html
<label>
    text before
    <bd-checkbox2></bd-checkbox2>
    or after
</label>
```

Checkbox linked to a label by `inputId`.
```html
<label for="mycheckbox">text before</label>
<bd-checkbox2 inputId="mycheckbox"></bd-checkbox2>
<label for="mycheckbox">or after</label>
```

Checkbox with two-way binding.
```html
<bd-checkbox2 [(ngModel)]="ischecked"></bd-checkbox2>
```

Checkbox with two-way binding and change notifications.
```html
<bd-checkbox2 [(ngModel)]="ischecked" (change)="alert('new checked state: ' + $event)"></bd-checkbox2>
```

Checkbox with one-way binding and manual state management. Useful when changing state asynchronously.
```html
<bd-checkbox2 [autocheck]="false" [ngModel]="ischecked" (beforeChange)="maybeChange($event)"></bd-checkbox2>
```
```ts
maybeChange(enable: boolean): void {
    if (enable) {
        this.enableSomethingAsync()
            .then(() => this.ischecked = true)
            .catch(err => alert('could not enable it because ' + err.reason));
    } else {
        this.disableSomethingAsync()
            .then(() => this.ischecked = false)
            .catch(err => alert('could not disable it because ' + err.reason));
    }
}
```

## Styling examples
Simple checkbox with correct styling for simple views where you just need a checkbox and some text.
```html
<label class="ng2-c-checkbox__label">
  <bd-checkbox2></bd-checkbox2>
  <span class="ng2-c-checkbox__label-text">Use classes "ng2-c-checkbox__label" and "ng2-c-checkbox__label-text" like in this example.</span>
</label>
```

Simple checkbox with checkbox on the other side of the label.
```html
<label class="ng2-c-checkbox__label ng2-c-checkbox__label--rtl">
  <bd-checkbox2></bd-checkbox2>
  <span class="ng2-c-checkbox__label-text">Use class "ng2-c-checkbox__label--rtl" OR reorder DOM elements to right-align the checkbox</span>
</label>
```
