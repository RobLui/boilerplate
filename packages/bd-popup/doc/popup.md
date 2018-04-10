# BD-POPUP2

## bd-popup2

The popup component draws a popup near a target element.

Every popup has some HTML content and a target element. The target element can be any HTML element such as a button.

To configure a popup element, use the `<bd-popup2>` component. Declare a template variable for the popup and bind it to a target element by using the `bdOpenPopup` directive.

```html
<!-- my.component.html -->
<button [bdOpenPopup]="poppy">open</button>
<bd-popup2 #poppy>
    <p>Some HTML content</p>
</bd-popup2>
```

## Usage
Use the class `.ng2-c-popup__item` when using multiple items in a popup. This includes padding and borders.
```html
<button [bdOpenPopup]="poppy">open</button>
<bd-popup2 #poppy>
    <div class="ng2-c-popup__item">Some HTML content</div>
    <div class="ng2-c-popup__item">Some HTML content</div>
    <div class="ng2-c-popup__item">Some HTML content</div>
</bd-popup2>

You can also control the visibility by binding to the `visible` property of the popup. This is useful when you can't (or don't want to) use the `click` event of the target element.

```ts
// my.component.ts
show: boolean = false;
```
```html
<!-- my.component.html -->
<button [bdOpenPopup]="poppy" (mouseenter)="show=true">do something</button>
<bd-popup2 #poppy [(visible)]="show" >
    <p>This should become visible on mouse over.</p>
</bd-popup2>
```

You can even open or close the popup in an imperative way.

```ts
// my.component.ts
@ViewChild('poppy') popup: BdPopupComponent;

ngAfterViewInit(): void {
    // flash the popup for 5 seconds
    this.popup.open();
    setTimeout(() => {
        this.popup.close()
    }, 5000);
}
```

### API

`bd-popup2 [hasPadding]="true"`: add class `.ng2-c-popup__body--has-padding` to the popup's body element.

`bd-popup2 [isCentered]="true"`: add class `.ng2-c-popup--center` to the popup element.

`bd-popup2 direction="top"`: popup opens from the top of the target element.

`bd-popup2 direction="bottom"`:  popup opens from the bottom of the target element.

`bd-popup2 direction="auto"`:  popup opens from the top or the bottom depending on available space.

`bd-popup2 [offsetX]="5"`: popup moves a specified number of pixels to the left or right.

`bd-popup2 [offsetY]="5"`: popup moves a specified number of pixels up or down.

`bd-popup2 [(visible)]="show"`: two-way binding that controls the visibility of the popup.

`bd-popup2 (show)="onShow()"`: emits events when the popup transitions from the invisible to the visible state.

`bd-popup2 (hide)="onHide()"`: emits events when the popup transitions from the visible to the invisible state.

`button (click)="poppy.open()"`: same as binding `visible` to `true`.

`button (click)="poppy.close()"`: same as binding `visible` to `false`.

## BdPopupService

The popup service contains a method for closing all open popups.

### API

```ts
closeAll(): void
```

Emits a close notification to all popup components.


```ts
open(template: TemplateRef<any>, onClose: () => void): EmbeddedViewRef<any>
```

Infrastructure, not meant to be called directly. Creates an embedded view on top of a backdrop inside the overlay placeholder.

- `template`: a template ref used as the template for creating an embedded view in the overlay placeholder.

- `onClose`: a callback that is executed when the backdrop is clicked. The callback should destroy the embedded view.

- returns a reference to the embedded view that was created

```ts
close(view: EmbeddedViewRef<any>): void
```

Infrastructure, not meant to be called directly. Destroys an embedded view and its backdrop.

- `view`: a reference to an embedded view obtained from `open()`.

- returns void.

## Styling

`ng2-c-popup__title`

Class to use for a popup title.

`ng2-c-popup__text`

Class to use for popup text.

`ng2-c-popup__close-button`

Class to use for the popup close button.

`ng2-c-popup__item--no-padding`

Removes the padding from a popup item.
