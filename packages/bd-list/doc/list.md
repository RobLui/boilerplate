# BD-LIST

## bd-list

The `ng2-c-list` class is a list with multiple or one section(s) that include a scroll view.

## bd-list-header

The `ng2-c-list__header` class represents a header inside a section.

## bd-list-item

The `ng2-c-list__item` class represents one item in the list.

## Grouped list

The `.ng2-c-list__group` class represents a wrapper to make the list work with group headers.

The `.ng2-c-list__group-header` class represents a header for each group.

## Usage

List
```html
<h4 class="ng2-c-list__header ng2-c-list__header--secondary">App Information</h4>
<ul class="ng2-c-list">
    <li class="ng2-c-list__item">
        <span class="ng2-c-list__cell u-6-12">App version</span>
        <span class="ng2-c-list__cell u-6-12 u-align--right">{{app.version}}</span>
    </li>
    <li class="ng2-c-list__item">
        <span class="ng2-c-list__cell u-6-12">Cordova version</span>
        <span class="ng2-c-list__cell u-6-12 u-align--right">{{app.cordovaVersion}}</span>
    </li>
    <li class="ng2-c-list__item">
        <span class="ng2-c-list__cell u-6-12">Environment</span>
        <span class="ng2-c-list__cell u-6-12 u-align--right">{{app.environment}}</span>
    </li>
    <li class="ng2-c-list__item">
        <span class="ng2-c-list__cell u-6-12">Build Date</span>
        <span class="ng2-c-list__cell u-6-12 u-align--right">{{app.buildDate | date:'EEE dd-MM-yyyy HH:mm:ss'}}</span>
    </li>
</ul>

```

Grouped List
```html
<ul class="ng2-c-list">
    <li class="ng2-c-list__group">
        <span class="ng2-c-list__group-header">2017</span>
        <ul class="ng2-c-list">
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 3</span>
            </li>
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 2</span>
            </li>
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 1</span>
            </li>
        </ul>
    </li>
    <li class="ng2-c-list__group">
        <span class="ng2-c-list__group-header">2016</span>
        <ul class="ng2-c-list">
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 3</span>
            </li>
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 2</span>
            </li>
            <li class="ng2-c-list__item">
                <span class="ng2-c-list__cell">Kwartaal 1</span>
            </li>
        </ul>
    </li>
</ul>
```
