# BD-FORM

## Form Fields Styling

`ng2-o-form__field`

A container to create a form field.

```html
<input class="ng2-o-form__field" />
```

![](inputfield.png)
 
`ng2-o-form__field--active`

This modifier colors the border of  the input field blue.
Same styling applies to :focus pseudo-selector.

![](inputfield-active.png)

`ng2-o-form__field--error`

This modifier colors the border of the input field red.
Same styling applies to :focus pseudo-selector.

![](inputfield-error.png)


## bd-form-textarea2

`bd-form-textarea2` is our implementation of a normal `textarea`.

### API

- `[(value)]=string` - The value of the textarea
- `label="string"` - The text to be shown in the label
- `placeholder="string"` - The text to be shown in the placeholder
- `[autoGrow]="boolean"` - Enable or disable the autogrow feature (default: false)
- `[rows]="number"` - The number of rows to be shown by default (default: 1)
- `[maxRows]="number"` - The maximum number of rows to be shown when autogrow is enabled
- `[showCounter]="number"` - Number that represents the amount of characters that needs to be typed before the counter is shown (default: 0)
- `[maxLength]="number"` - Maximum number of characters.

### Usage

```html
<bd-form-textarea2 placeholder="placeholder" [(value)]="value" [autoGrow]="true" [rows]="1" [maxRows]="10" [maxLength]="500" [showCounter]="400"></bd-form-textarea2>
```


## bd-form-input2

`bd-form-input2` is our implementation of a normal `input`.

### API

- `[(value)]=string` - The value of the input
- `label="string"` - The text to be shown in the label
- `placeholder="string"` - The text to be shown in the placeholder
- `[showCounter]="number"` - Number that represents the amount of characters that needs to be typed before the counter is shown (default: 0)
- `[maxLength]="number"` - Maximum number of characters.

### Usage

```html
<bd-form-input2 placeholder="placeholder" [(value)]="value" [maxLength]="500" [showCounter]="400"></bd-form-input2>
```
