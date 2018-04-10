# BD-DIALOG2

## BdDialogService

The dialogservice creates a dialog component and add it to the overlay-placeholder.

### API
`let bdDialog: BdDialog = new BdDialog(type, {data: someDataObjectInstance, options: { small: true, blur: true }})
dialogService.open(bdDialog)`

You need to pass in a BdDialog to the open method. BdDialog has the following parameters:

- `type` this is the class of the specific dialog component you want to open ex: LegalInfoDialogComponent
- `data` if the component you open needs extra data you can pass it here
- `options` if you need something different than the default behaviour you can pass different options for ex: { blur : true }

`options`

- `blur` show the backdrop of the dialog as a blue gradient instead of transparant gray
- `modal` clicking on the backdrop will not close it
- `small` the dialog will be smaller and scrolling is not available
- `noAnimation` no animation will occur when the dialog is opened
- `disablebackground` the backdrop will be shown as transparent


`dialogservice.close(dialog: BdDialog)`
Closes the dialog and the corresponding backdrop.
You can also call bdDialog.close() this will in turn call dialogservice.close

## bd-dialog2

The `<bd-dialog2>` is added dynamically to the application through the open method. You never need to add it yourself.


### CSS
* `.ng2-c-dialog__header`: Header section of the dialog 'skeleton', this will appear on top and is mostly used for icon buttons and titles (see examples)
* `.ng2-c-dialog__content`: Main part of the dialog 'skeleton' (see examples)
* `.ng2-c-dialog__footer`: Footer section of the dialog 'skeleton', this will appear on the bottom of the main part (see examples)
* `.ng2-c-dialog__content--no-overflow`: sets an overflow hidden, which disables scrolling. This class should be used with `.ng2-c-dialog__content`
* `.ng2-c-dialog__content--no-padding`: removes the padding from the dialog, this class should be used with `.ng2-c-dialog__content` (see example)
* `.ng2-c-dialog__fill`: class to expand height 100% inside `ng2-c-dialog__content`.
* `.ng2-c-dialog__section`: vertically and horizontally align the content, this class **should** be used on the children of `.ng2-c-dialog__content--valign` (see example)
* `.ng2-c-dialog__section--expand`: make section expand to the height of the dialog content.
* `.ng2-c-dialog__sections`: this is the container class for the styling of the sections and sets the padding to zero
* `.ng2-c-dialog__section--white`: add this class if you want to force a section to have white background
* `.ng2-c-dialog__subsection--full-width`: add this class if you want a subsection to take up the full width (for example when it contains a table)
* `.ng2-c-dialog__subsection--padded`: add this class if you want a subsection to have extra padding on the sides (for example when it contains a grid)
* `.ng2-c-section`: add this class to each section that is a child of `.ng2-c-dialog__sections` to set the styling of a sections (see example)

### Example
How to open a dialog with data and options.
```js
    let bdDialog: BdDialog = new BdDialog(LegalInfoDialogComponent, {data: someDataObjectInstance, options: { small: true, blur: true }});
    bdDialog.closePromise.then((closeData) => console.log(closeData));
    this.bdDialogService.open(bdDialog);
    this.bdDialogService.close(bdDialog);  or bdDialog.close(dataForClosePromise);
```
How to access data within the dialog and how to close the dialog

```js
@Component({
    selector: 'example-dialog',
    template: require('./exampleDialog.component.html')
})
export class ExampleDialogComponent {
    constructor(
            private bdDialog: BdDialog,     // this is the instance of the dialog
            private someDataObjectInstance: ExampleClass // this is the data you passed in the open method
    ){}
    
    closeDialog(): void {
        const closeData: string = 'some data for the close promise';
        this.bdDialog.close(closeData);
    }
}
```

```html
<!--- set the overlayplacehoder once in your applications --->
<bd-overlay-placeholder2></bd-overlay-placeholder2>

<!--- make a component for the dialog, the template should look like this --->
<header class="ng2-c-dialog__header">
    <div class="ng2-c-header__left">
        <!--navigationbutton can be here-->
    </div>
    <div class="ng2-c-header__title">
        <!--title here-->
    </div>
    <div class="ng2-c-header__right">
        <!--close button can be here    -->
    </div>
</header>
<main class="ng2-c-dialog__content ng2-c-dialog__content--no-padding">
    <!-- insert content -->
</main>
<footer class="ng2-c-dialog__footer">
    <!-- insert footer content-->
</footer>
```

When using subtitle use the ng2-c-header__center to nest title and subtitle
```html
<header class="ng2-c-dialog__header">
    <div class="ng2-c-header__left">
        <i class="ng2-c-header__icon icon-close" (click)="closeDialog()"></i>
    </div>
    <div class="ng2-c-header__center">
        <div class="ng2-c-header__title">Title</div>
        <div class="ng2-c-header__subtitle">
              Subtitle  
        </div>
    </div>
</header>
<main class="ng2-c-dialog__content">
</main>
```

Align items inside the dialog content
```html
<header class="ng2-c-dialog__header">
    <div class="ng2-c-header__left">
        <i class="ng2-c-header__icon icon-close" (click)="closeDialog()"></i>
    </div>
    <div class="ng2-c-header__center">
        <div class="ng2-c-header__title">Title</div>
        <div class="ng2-c-header__subtitle">
              Subtitle
        </div>
    </div>
</header>
<main class="ng2-c-dialog__content ng2-c-dialog__content--valign">
    <section class="ng2-c-dialog__section">Section 1</section>
    <section class="ng2-c-dialog__section">Section 2</section>
    <section class="ng2-c-dialog__section">Section 3</section>
</main>
```

How to use the section styling
```html
<header class="ng2-c-dialog__header">
    <div class="ng2-c-header__left">
        <i class="ng2-c-header__icon icon-close" (click)="closeDialog()"></i>
    </div>
    <div class="ng2-c-header__center">
        <div class="ng2-c-header__title">
            Dialog sections
        </div>
    </div>
</header>
<main class="ng2-c-dialog__content ng2-c-dialog__sections">
    <section class="ng2-c-dialog__section">
        <h2 class="u-h2--new u-heading--has-subtitle">
            DJ Eurostoxx 50
        </h2>
        <h3 class="u-text--subtitle">SX5E | Indexes</h3>
        <div>
            <h4 class="u-h4--new">Price for the last 6 months </h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt est non dolor dignissim venenatis. In ullamcorper
            semper tempor. Etiam in enim pharetra, sodales enim ac, tincidunt libero. Aliquam erat volutpat. Cras vitae bibendum
            dui, ut auctor est. Morbi vitae gravida purus. Cras at diam rutrum, tempus mauris nec, pulvinar magna. Aliquam tincidunt
            dui sit amet fringilla dignissim. Duis a facilisis turpis. Duis mollis turpis in mauris hendrerit aliquet. Aliquam vitae
            tellus eu nulla aliquam venenatis id quis diam. Cras volutpat molestie justo ut ultrices.</p>
            <p class="u-text--footer">Section Footer</p>
        </div>
    </section>
    <section class="ng2-c-dialog__section">
        <h2 class="u-h2--new u-heading--has-subtitle">
            DJ Eurostoxx 50
        </h2>
        <h3 class="u-text--subtitle">SX5E | Indexes</h3>
        <div>
            <h4 class="u-h4--new">Price for the last 6 months </h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt est non dolor dignissim venenatis. In ullamcorper
            semper tempor. Etiam in enim pharetra, sodales enim ac, tincidunt libero. Aliquam erat volutpat. Cras vitae bibendum
            dui, ut auctor est. Morbi vitae gravida purus. Cras at diam rutrum, tempus mauris nec, pulvinar magna. Aliquam tincidunt
            dui sit amet fringilla dignissim. Duis a facilisis turpis. Duis mollis turpis in mauris hendrerit aliquet. Aliquam vitae
            tellus eu nulla aliquam venenatis id quis diam. Cras volutpat molestie justo ut ultrices.</p>
            <p class="u-text--footer">Section Footer</p>
        </div>
    </section>
    <section class="ng2-c-dialog__section">
        <h2 class="u-h2--new u-heading--has-subtitle">
            DJ Eurostoxx 50
        </h2>
        <h3 class="u-text--subtitle">SX5E | Indexes</h3>
        <div>
            <h4 class="u-h4--new">Price for the last 6 months </h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt est non dolor dignissim venenatis. In ullamcorper
            semper tempor. Etiam in enim pharetra, sodales enim ac, tincidunt libero. Aliquam erat volutpat. Cras vitae bibendum
            dui, ut auctor est. Morbi vitae gravida purus. Cras at diam rutrum, tempus mauris nec, pulvinar magna. Aliquam tincidunt
            dui sit amet fringilla dignissim. Duis a facilisis turpis. Duis mollis turpis in mauris hendrerit aliquet. Aliquam vitae
            tellus eu nulla aliquam venenatis id quis diam. Cras volutpat molestie justo ut ultrices.</p>
            <p class="u-text--footer">Section Footer</p>
        </div>
    </section>
</main>
```
