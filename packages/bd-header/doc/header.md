# BD-HEADER

The header is not an angular component, it can be built by using css classes. It is recommended to use the html `<header>` tag.

## Usage
The `ng2-c-header` class sets the default header style.
```html
<header class="ng2-c-header">
    <!-- content -->
</header>
```

The `ng2-c-header--sticky` will make the default header stick to the top of the screen
```html
<header class="ng2-c-header ng2-c-header--sticky">
    <!-- content -->
</header>
```

Inside the `<header>` tag we can use the following container classes for different parts of the header

The `ng2-c-header__main` class is used to create a split-screen, it separates the main content.

The `ng2-c-header__sidebar` class is used for sidebar content of the header.

You can make the sidebar wider using the `ng2-c-header__sidebar--wide` class. Mostly used with the `ng2-c-view__sidebar--wide` on the view.

```html
<header class="ng2-c-header ng2-c-header--sticky">
    <div class="ng2-c-header__sidebar">
        <!-- content -->
    </div>
    <div class="ng2-c-header__main">
        <!-- content -->
    </div>
</header>
```

Inside these containers you can align stuff using these classes
```
`ng2-c-header__left`
`ng2-c-header__right`
`ng2-c-header__center`
```

You can determine the margins to these alignment containers using the following styles
```
`ng2-c-header__center--no-margin`  // no margin
`ng2-c-header__center--md-margin`  // medium margin
`ng2-c-header__center--lg-margin`  // large margin
```

Inside the alignment containers you can use these styles for special purposes

The `ng2-c-header__title` can be used to display a title text

The `ng2-c-header__subtitle` can be used to display a subtitle text

The `ng2-c-header__icon` can be used to display an icon in the header which is also clickable (event is expected)

The `ng2-c-header__icon-text` can be used to display text next to the icon in the header. Best practise is to use container next to icon itself (see example) 

```html
<!-- no text next to icon -->
<div class="ng2-c-header ng2-c-header--sticky">
    <div class="ng2-c-header__main">
            <div class="ng2-c-header__left">
                <i class="ng2-c-header__icon icon-back"></i>
            </div>
        <div class="ng2-c-header__center">
            <div class="ng2-c-header__title">
                <span>Title</span>
            </div>
            <div class="ng2-c-header__subtitle">
                <span>Subtitle</span>
            </div>
        </div>
    </div>
</header>
```

```html
<!-- text next to icon -->
<div class="ng2-c-header ng2-c-header--sticky">
    <div class="ng2-c-header__main">
            <div class="ng2-c-header__left">
                <span class="ng2-c-header__icon">
                    <i class="icon-back"></i>
                    <span class="ng2-c-header__icon-text">Go back</span>
                </span>
            </div>
        <div class="ng2-c-header__center">
            <div class="ng2-c-header__title">
                <span>Title</span>
            </div>
            <div class="ng2-c-header__subtitle">
                <span>Subtitle</span>
            </div>
        </div>
    </div>
</header>
```
