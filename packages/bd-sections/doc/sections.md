# BD-SECTIONS

## bd-sections

### API

`activeSection`

Sets a particular section as active (used on mobile). If no identifier from section is given, we set the first declared bd-section in the API as active. 

### Events

`inViewChange`

Returns a `BdSectionViewChange` object when certain section comes in view because of scrolling or clicking on tab.
Please note, this event will fire once per section when scrolling (on tablet or higher). When clicked on tab, this will fire everytime.

If you encounter some problems (no returning events when scrolling), there is possibly a problem with the scrollcontainer. This can be fixed by adding the `bdScrollContainer` directive to the `.c-main__content` element.

## bd-section

### API

`id`

Identifier of the section.

`navigationTitle`

This title will be shown in the navigation bar on mobile view. When clicked, the corresponding section will be shown.
Will not be visible on tablet or bigger screens.

`fullWidth`

By default, the section will wrap the content in a container with a max-width. If this is not wanted, you should set the `fullWidth` to true.

`hidden`

If you choose not to display a section for whatever reason, you should use this `hidden` attribute. If set to true, this section will not be displayed. 
note: this removes the section completely from the DOM, so only value on load is applied. Toggle won't be possible.

### Styling

`.ng2-c-section__header`

Class of section which contains logic when to show or not and some basic styling

`.ng2-section__info`

Class of section which sets negative margin and some spacing for the info part.

### Usage
```html
<bd-sections2 [(activeSection)]="rendement" (inViewChange)="blaatFunc()">
    <bd-section2 id="rendement" navigationTitle="rendement">
        <h1 class="ng2-c-section__header">
            Rendement
        </h1>
        <ng-include src="other-content.html"></ng-include>
    </bd-section2>
    
    <bd-section2 id="empty" navigationTitle="noshow" [hidden]="true">
        <h1 class="ng2-c-section__header">
            Will not be shown
        </h1>
    </bd-section2>
</bd-sections2>
```

## BdSectionViewChange

An object which is returned by the `inViewChange` event in `bd-sections`.
* section: the section which came in view
* eventType: type of event which triggered the view change (onScroll, onLoad or onTabClick)

## BdSectionsService

`navigationHeight`: get height of section navigation
