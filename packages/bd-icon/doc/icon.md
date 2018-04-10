# BD-ICON

## Styling
By default, the icon has the same height as the text, but this can be overridden by several classes which give the icons a different height. These are expressed as medium, large, xlarge and xxlarge.

- `.icon--medium`
- `.icon--large`
- `.icon--xlarge`
- `.icon--xxlarge`


### Usage

```html
<i class="icon-close" (click)="doSomething()"></i>
```

By default, the icon is not "clickable" (a pointer when hovering or large click area). To make it easier to click, u should use the icon- class with `u-clickarea`.
 
Please note there are some classes where u don't need to set `u-clickarea` explicitly (f.e. `ng2-c-header__icon`). 
