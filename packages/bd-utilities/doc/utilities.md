# BD-UTILITIES

## Contents

- [JavaScript](#javascript)
    - [ComponentService](#componentService)
    - [BdDeviceService](#BdDeviceService)
    - [BdRepaintService](#BdRepaintService)
    - [BdEventService](#BdEventsService)
- [Styling](#styling)
    - [General](#general)
        - [Media queries in classes](#media-queries-in-classes)
    - [Alignment](#alignment)
    - [Background](#background)
    - [Clearfix](#clearfix)
    - [Colors](#colors)
    - [Display](#display)
    - [Flexbox](#flexbox)
    - [Gradient](#gradient)
    - [Grid](#grid)
    - [Hidden](#hidden)
    - [Pull](#pull)
    - [Rotation](#rotation)
    - [Scrolling](#scrolling)
    - [Sizing](#sizing)
    - [Spacing](#spacing)
    - [Text](#text)

---

## JavaScript

### ComponentService

`create(viewContainer, type, data)`

Will create and add a component of a specific type to a specific view container.

- `viewContainer` the place where the component needs to be added
- `type` the type of object you want dynamically created (ex: BdBackdropComponent)
- `data` optional object that is passed into the constructor
- `return value` the instance of the component that was created (type: ComponentRef\<any>)

### BdDeviceService

`isIOS()`: boolean. Returns true if device is an iOS device

`isAndroid()`: boolean. Returns true if device is an Android device

`isTablet()`: boolean. Returns true if device matches the tablet mediaquery


### BdRepaintService

`repaint(element: HTMLElement)`: repaint the document, triggered by the given element

### BdEventsService
This service will provides observables for events. This way we only have to bind one event but can react to this event in multiple places by subscribing to the observable.

`onWindowScrollOutsideZone` observable for reacting to the window scroll event. Event is executed outside angular zone, so you might need a Zone.Run when reacting to changes  and changing bindings. The event is throttled with request animationFrame.

`onWindowResizeOutsideZone` observable for reacting to the window resize event. Event is executed outside angular zone, so you might need a Zone.Run when reacting to changes and changing bindings. The event is throttled with request animationFrame.

---

## Styling

### General

#### Media queries in classes

Some of the utility classes can be combined with a media query.
The available media queries are: `phablet`, `tablet`, `desktop` and `large-desktop`.

The structure is `.[className]@[mediaQuery]`. For example:

```html
<div class="u-align--center@tablet"></div>
```


### Alignment

`.u-align, .u-align--center`: horizontal align center

`.u-align--right`: horizontal align right

`.u-align--left`: horizontal align text left

`.u-align--vertical`: vertical align center

> ℹ️  These classes can be combined with [media queries](#media-queries-in-classes)


### Background

`.u-background-color--secondary`: set a grey background color

`.u-background-color--blue`: set a blue background color

`.u-background-color--red`: set a red background color

`.u-background-color--alternating`: alternate between white and grey background colors


### Box Alignment

`.u-box-align`: centers the content of element both horizontally as vertically

`.u-box-align--bottom`: vertically align content to bottom

`.u-box-align--left`: horizontally align content to left

`.u-box-align--right`: horizontally align content to right

`.u-box-align--top`: vertically align content to top

> ⚠️ The height of element should be set another way or with an another class

> ⚠️ Try to limit the direct children to 1 as more children could possible give an unexpected result.

> ℹ️ Modifier classes can be combined with [media queries](#media-queries-in-classes)

### Clearfix

`.u-clearfix`: add a clearfix to your element. [What is a clearfix?](https://css-tricks.com/snippets/css/clear-fix/)


### Colors

`.u-color--white`: sets a white text color

`.u-color--black`: sets a black text color

`.u-color--blue`: sets a blue text color

`.u-color--blue-80`: sets a lighter blue text color

`.u-color--blue-50`: sets a light blue text color

`.u-color--neutral-80`: sets a grey text color

`.u-color--neutral-50`: sets a lighter grey text color

`.u-color--negative`: sets a red text color

`.u-color--positive`: sets a green text color

### Display

`.u-block`: set display block

`.u-inline-block`: set display to inline-block

### Gradient

`.u-gradient`: adds a background gradient


### Flexbox

`.u-flex--fill`: creates a content wrapper that fixes the `height: 100%` issues on iOS9 an iOS10.

> ⚠️  Use with care
> ⚠️  The parent should have `position: relative`. Otherwise it won't work


### Grid

#### .grid

`.u-grid`: starts the grid

`.u-grid--padded`: adds padding of 5px to the grid cells

`.u-grid--h-start`: align the cells to the left (default behaviour)

`.u-grid--h-end`: align the cells to the right

`.u-grid--h-center`: align the cells to the center

`.u-grid--h-space-between`: evenly distribute space between cells

`.u-grid--h-space-around`: evenly distibute space around cells

`.u-grid--h-stretch`: use the full width of the grid despite possibly not having enough cells

`.u-grid--v-top`: align the cells to the top (default behaviour)

`.u-grid--v-bottom`: align the cells to the bottom

`.u-grid--v-center`: vertically align the cells in the middle

`.u-grid--v-stretch`: stretch the cells to fill the height of the grid

`.u-grid--no-wrap`: do not wrap the cells to a new line when more then 100% of the width is used

`.u-grid--separated`: set a 10px spacing between cells. Also provides a divider

`.u-grid--bordered`: sets a border around the grid and its cells


#### .grid__cell

`.u-grid__cell`: defines a single cell

`.u-grid__cell--stretched`: stretch the width of cell across the empty space

`.u-grid__cell--bordered`: sets a border around a cell

`.u-[size]-12`: The grid is build on 12 columns. Widths can be set with these classes. Can be combined with [media queries](#media-queries-in-classes)

#### Examples

```html
<div class="u-grid u-grid--padded">
    <div class="u-grid__cell u-6-12 u-12-12@tablet">...</div>
    <div class="u-grid__cell u-6-12 u-12-12@tablet">...</div>
</div>
```


### Hidden

`.u-hide`: hides the element. Can be combined with [media query](#media-queries-in-classes)

`u-show@[mediaQuery]`: shows the element on a specific [media query](#media-queries-in-classes)


### Pull

`.u-pull--left`: float the element to the left

`.u-pull--right`: float the element to the right


### Rotate

`.u-rotate--90`: rotate the element 90 degrees

`.u-rotate--180`: rotate the element 180 degrees

`.u-rotate--270`: rotate the element 270 degrees


### Scroll

`.u-scroll-overflow--x`: enables scrolling across the x axis

`.u-scroll-overflow--y`: enables scrolling across the y axis


### Sizing

`.u-height--flush`: sets the height to 100%

`.u-height--stretch`: sets the minimum height to 100%

`.u-width--flush`: sets the width to 100%


### Spacing

Spacings are divided into 2 groups. `.u-m` and `.u-p` classes.

`.u-m`: sets margin (spacing outside the element)

`.u-p`: sets padding (spacing inside the element)

The written are combined in the following structure:

```css
.u-m[direction?]--[size?]
.u-p[direction?]--[size?]
```

`[direction?]`: defines the direction of the spacing. Possibilities are `t` (top), `b` (bottom), `l` (left) and `r` (right). Direction is not required

`[size?]`: defines the size of the spacing. Possibilities are `none`, `xs`, `s`, `m`, `l`, `xl` and `xxl`. BdSize is not required

> ℹ️  These classes can be combined with [media queries](#media-queries-in-classes)

#### Example

```html
<div class="u-mt--l@desktop">large margin top on desktop</div>
<div class="u-mt--s">small margin top</div>
<div class="u-mt">default margin top</div>
<div class="u-m">default margin all around</div>

<div class="u-pt--l@desktop">large padding top on desktop</div>
<div class="u-pt--s">small padding top</div>
<div class="u-pt">default padding top</div>
<div class="u-p">default padding all around</div>
```

### Text

`.u-text--l`: sets large font size

`.u-text--m`: sets medium font size

`.u-text--s`: sets small font size

`.u-text--xs`: sets extra small font size

`.u-text--xxs`: sets extra extra small font size

`.u-text--italic`: sets text in italic

`.u-text--upper`: sets text in uppercase

`.u-text--lower`: sets text in lowercase

`.u-text--ellipses`: adds `...` at the end of an overflowing text

`.u-text--key`: set text in the `key` style

`.u-text--display`: sets text in the `display` style

`.u-text--label`: sets text in the `label` style

`.u-text--w300`: sets font-weight to 300

`.u-text--w600`: sets font-weight to 600

`.u-text--w700`: sets font-weight to 700

`.u-text--decoration-underline`: underlines text

`.u-text--decoration-none`: removes underlines from text

`.u-text--label`: sets text in the `label` style

`.u-text--value`: sets text in the `value` style

`.u-text--title`: sets text in the `title` style, which is same as h4 styling without spacing

`.u-text--subtitle`: sets text in the `subtitle` style
when you use this class in combination with a heading you should always give the heading the class `.u-heading--has-subtitle` so the correct margins are used

`.u-text--footer`: sets text in the `footer` style

`.u-text--info`: sets text in the `info` style

### Temporary styles
Heading styles according to the new styleguide rules
```
/** Heading styles according to the new styleguide rules
*** These are currently assigned to a temporary utility class
*** These will be applied to h1, h2, h3 in a later phase
*******************************************************************/
.u-text--new-default

.u-h1--new

.u-h2--new

.u-h3--new

.u-h4--new

```
