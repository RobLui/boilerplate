# bd-action-slider docs

## bd-action-slider-list

Wrap your `bd-action-slider` items in this component to automatically close other opened `bd-action-slider` items when opening a new one.

**Inputs and Outputs:**
* `enabled<boolean>`: whether the child action slider items are slideable. Use this for loading etc.

## bd-action-slider
This component is swipeable to the left and/or the right (depends on the implementation). Use `bd-action-slider-content` to add content to this component. Use `bd-action-slider-left` and  `bd-action-slider-right` to configurate the behaviour of the `bd-action-slider`.

## bd-action-slider-content
The HTML in here gets shown on the main part of the component.

## bd-action-slider-left and bd-action-slider-right
These components are used for configuring the actions of the `bd-action-slider`. Both of them are optional.

**Inputs and Outputs:** 
* `action<function>`: the action that needs to be executed when clicking or swiped more than 50% (if enabled)
* `slideThrough<boolean>`: whether the component should execute the action when swiped more than 50%.
* `colorClass`: a valid css background class for the action

## Usage example:

```HTML
<bd-action-slider-list 
[enabled]="areActionSlidersEnabled">
    <bd-action-slider *ngFor="slider in sliders">
        <bd-action-slider-left 
        swipeThrough="true"
        (action)="doSomething()">
            <i class="icon-trash">
            Delete
        </bd-action-slider-left>
        <bd-action-slider-content>
            <!--here be content-->
        </bd-action-slider-content>
        <bd-action-slider-right>
            <!-- Like left but add some sprinkles of your own imagination -->
        </bd-action-slider-right>
    </bd-action-slider>
</bd-action-slider-list>
```
