# BD-SCROLL

## OnInView

```html
<div style="overflow:scroll; height:400px;" bdScrollContainer>
    <div *ngFor="let item of scrollItems" (bdOnInView)="setInView(item)" [ngStyle]="{'color': item.inView ? 'green' : 'red'}">
        {{ item. label }}
    </div>
</div>
<div style="position: absolute; top: 3000px" (bdOnInView)="setWindowInview($event)">
    window on-in-view {{windowInview}}
</div>
```
`bdScrollContainer` 

add a bdScrollContainer directive to a parent element that can be scrolled

`(bdOnInView)`

A method to be triggered when the element comes into or leaves view. This directive returns a boolean which is true if element 
comes into view or false if element leaves the view. If no parent element with bdScrollContainer is found the window will be used for triggering scroll and in view calculation

`[onInViewEnabled]`

A flag to enable/disable the `(bdOnInView)` trigger in certain situations. Default is true.


## bdScrollService

The `bdScrollService` is a service that controls the freezing and unfreezing of the body. Freezing the body is used by different components with backdrops.

### API

`freeze()`

A function that freezes the body.

`unfreeze()`

A function that unfreezes the body.

`isFrozen()`

A function that returns a boolean that indicates whether the body is frozen or not.

`getScrollTop()`

A function that returns the correct scroll top position when frozen and unfrozen.

## Usage

```html
<bd-scrollbox>
    <div class="some-custom-header">This is my custom header.</div>
    <bd-scrollbox-content>
        This area is scrollable and will get the remaining height of the scrollbox.
    </bd-scrollbox-content>
    <div class="some-custom-footer">This is my custom footer.</div>
</bd-scrollbox>
```
