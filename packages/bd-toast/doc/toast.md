# BD-TOAST

The `bd-toast` defines an toast box on the top of the page. The toast is opened and closed using the `bdToastService`.


## BD-TOAST-SERVICE

### API

`open(bdToast)`

Open a toast. `bdToast` is an object with parameters for the toast:

* `BdToast`

    - `content` (string | BdToastContent): text displayed inside the toast or a component that is created inside the toast.
    - `type` (optional, string): A plain text displayed inside the toast. If a template is specified, this property is ignored.
    - `type`(optional, default `BdToastType.Error'`): the type specifies the background-color of the toast.
    - `animationTime` (optional, default `6000`) After the animation, the toast closes itself. Use 0 to disable the timer.

* `BdToastContent`

    - `type` class of the component that is created inside the toast.
    - `data` data that is passed into the constructor of the content component

`close()`

This closes the current toast.


## Usage example
```js
this.toastService.show(new BdToast({
    content: new BdToastContent(
        InMaintenanceToastComponent,
        new InMaintenanceToastVM('text', 'someothertext')
    ),
    type: BdToastType.Error,
    animationTime: 10
}));

this.toastService.show(new BdToast({
    content: 'text to show inside the toast',
    type: BdToastType.Warning,
}));
```

### Custom Toast

* `ng2-c-toast__clickable-container` Use this class to set a full width container on an a tag. All direct children will be placed vertically with proper spacing and styling
