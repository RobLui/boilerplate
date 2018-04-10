# BD-BUTTON

## BUTTON (CSS)

This is a css only component. Use the following classes to create any button.

### Styling

`.ng2-o-button` This is the main class to style a button, it uses the primary colors as default.

`.ng2-o-button__icon` Add an icon to the button.

`.ng2-o-button__text` Add text inside the button. *Only necessary in combination with `.ng2-o-button__icon`*.

#### Styles

`.ng2-o-button--secondary` Add secondary button styles

`.ng2-o-button--tertiary` Add tertiary button styles

`.ng2-o-button--quaternary` Add quaternary button styles

`.ng2-o-button--negative` Add negative button styles

`[disabled]=true` Add the disabled attribute to to button to add disabled styles. *Needs [] binding otherwise the disabled state keeps active, even when disabled=false*.

#### Sizes

`.ng2-o-button--small` Create a smaller button state

`.ng2-o-button--medium` Create a medium button state

`.ng2-o-button--extra-large` Create a extra large button state

`.ng2-o-button--full` Display button as a block element

`.ng2-o-button--full-phone` Display button as a block element on mobile

### USAGE

*icon left*

```html
<button class="ng2-o-button" disabled>
    <i class="ng2-o-button__icon icon-arrow-down"></i>
    <span class="ng2-o-button__text">Hi I'm a button</span>
</button>
```

*icon right*

```html
<button class="ng2-o-button" disabled>
    <span class="ng2-o-button__text">Hi I'm a button</span>
    <i class="ng2-o-button__icon icon-arrow-down"></i>
</button>
```


#### LISTS

If you want to position multiple buttons in a list, use the following:

`.ng2-o-button-list` Group a series of buttons together, by default vertically.

`.ng2-o-button-list--small` Group a series of buttons together in a smaller space.

`.ng2-o-button-list--horizontal` Display the button list horizontally. By default, this list will be aligned to the left.

`.ng2-o-button-list--horizontal-center` When used in combination with button-list--horizontal, this list will be centered.

### Usage
```html
<div class="ng2-o-button-list">
    <button class="ng2-o-button">
        <span class="ng2-o-button__text">Hi I'm a button</span>
    </button>

    <button class="ng2-o-button">
        <span class="ng2-o-button__text">Hi I'm a button</span>
    </button>

    <button class="ng2-o-button">
        <span class="ng2-o-button__text">Hi I'm a button</span>
    </button>
</div>
```

## FLOATING BUTTON

The floating button is a button which is on the bottom of a given container at all times. Unlike a regular button, this needs to be in a certain html structure before it can work properly. This is why this is a separate section in the docs and somewhat other classes.

### API

You need three different classes:

`.ng2-o-floating-button` Sets the container where the button will relative position himself to. This will be mostly used on `.ng2-c-view__main` or `.ng2-c-view__sidebar`.

`.ng2-o-floating-button__container` Put this on the container where scrolling is needed. The button will appear above this container.

`.ng2-o-floating-button__control` Put this on the button itself.

### Styling

The class of `.ng2-o-floating-button` can be used with the other styles of the button as described above.

### Usage

```html
<div class="ng2-c-view__sidebar ng2-o-floating-button">
    <div class="ng2-o-floating-button__container">
        <p>Content of the sidebar</p>
        <div class="ng2-o-floating-button__control">
            <button class="ng2-o-button">
                <span class="ng2-o-button__text">Hi I'm a button</span>
            </button>
        </div>
    </div>
</div>
```
