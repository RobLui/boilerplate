# BD-DATA-STATES

CSS only component to build up the message for several states

> Keep in mind that the spacing on the top will always be the same, regarding the box you've included this element to. If this box has margin or padding, the spacing will look different than normal.

## CSS

`.ng2-c-data-state--no-spacing`: no spacing on top (use this when you should center this in card for example)

## Default icons

For the _error state_ we use by default the `icon-attention` icon. However, this can be changed depending on the situation / context.

The _empty state_ has no icon by default and the _loading state_ uses the `.ng2-c-loader`.

## How to use

```html
<div class="ng2-c-data-state">
    <i class="ng2-c-data-state__icon icon-attention"></i>
    <span class="ng2-c-data-state__message">Uw gegevens konden niet worden opgehaald</span>
    <button class="ng2-c-data-state__button ng2-o-button ng2-o-button--secondary ng2-o-button--medium">
        Probeer opnieuw
    </button>
</div>
```

Example with loader
```html
<div class="ng2-c-data-state">
    <div class="ng2-c-data-state__icon">
        <div class="ng2-c-loader"></div>
    </div>
</div>
```
