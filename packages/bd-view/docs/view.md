# BD-VIEW

## bd-view2

The `bd-view2` is a wrapper for the entire application. It allows you to vertically align elements, and lock the view.

### API

`showSidebar`

A boolean that indicates whether the sidebar should be rendered or not.

### Styling

`ng2-c-view__content`

A class to use as wrapper for the content.

`ng2-c-view__content--center`

A class to center (horizontal & vertical) the elements inside our `ng2-c-view__content` element

`ng2-c-view__main`

A class to use as a wrapper for the content (in comnination with a sidebar)

`ng2-c-view__main--padded`

A class to give the main element some padding

`ng2-c-view__sidebar`

A class to use as wrapper for the sidebar.

`ng2-c-view__sidebar--wide`

You can make the sidebar wider using the `ng2-c-view__sidebar--wide` class. Mostly used with the `ng2-c-header__sidebar--wide` on the header.

`ng2-c-view__footer`

A class to use as wrapper for the footer.

`ng2-c-view__footer--center`

A class to center the text inside our `ng2-c-view__footer` element

`ng2-c-view__footer-icon`

A class to use on an icon inside the footer.

`ng2-c-view__statusbar`

A class to use as wrapper for the statusbar.

### Usage

```html
<bd-view2 [showSidebar]="showSidebar">
    <div class="ng2-c-header ng2-c-header--sticky">
        <div class="ng2-c-header__main">
            <div class="ng2-c-header__center">
                <div class="ng2-c-header__title">
                    <span>Header</span>
                </div>
            </div>
        </div>
    </div>

    <main class="ng2-c-view__content ng2-c-view__content--center">
        <div class="ng2-c-view__sidebar">
            <p>Sidebar</p>
        </div>

        <div class="ng2-c-view__main ng2-c-view__main--padded">
           <p>Main content</p>
        </div>
    </main>

    <footer class="ng2-c-view__footer">
        <p>Footer</p>
    </footer>
</bd-view2>
```

## View Service

`customHeaderHeight`: get height of a custom header (e.g. portfolio header)
