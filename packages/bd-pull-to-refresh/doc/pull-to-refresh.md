# BD-PULL-TO-REFRESH

## bd-pull-to-refresh2

Use `bdScrollContainer` when the pull to refresh needs to consider a scroll container. e.g. : when used with a long list that is scrollable.

### API

`onPulled`

Function that should be called when pulled.

`loading`

A boolean that toggles the loading state after pull.


## Usage

```html
<bd-pull-to-refresh2 (onPulled)="refreshData()" [loading]="loading">
   <!-- insert content -->
</bd-pull-to-refresh2>
```

Using `bdScrollContainer`

```html
<div class="u-scroll-overflow--y" bdScrollContainer>
    <bd-pull-to-refresh2 (onPulled)="refreshData()" [loading]="loading">
    <!-- insert content -->
    </bd-pull-to-refresh2>
</div>
```

## Screenshots

![bd-pull-to-refresh](bd-pull-to-refresh-pull.png)
![bd-pull-to-refresh](bd-pull-to-refresh-release.png)
![bd-pull-to-refresh](bd-pull-to-refresh-loading.png)
