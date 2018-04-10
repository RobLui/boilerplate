# BD-COACHMARK


## Component

`id`

The id of the coachmark that can be used to open and close the coachmark.

`direction`

The direction where the components  needs to open.

## Directive

`bdOpenCoachmark` 

Use this directive to register the target of the coachmark.

## BdCoachmarkManager

`open(coachmarkId)`

Open the coachmark with the input id (set in the attribute).


`close(coachmarkId)`

Close the coachmark with the input id (set in the attribute).

## Styling
### Note: styling of bd-popup is used because the styleguide is the same.

`ng2-c-popup__title`

Class to use for the coachmark title.

`ng2-c-popup__text`

Class to use for the coachmark content text.

`ng2-c-popup__close-button`

Class to use for the coachmark close button.

## Usage

```html
<bd-tabbar-tab [bdOpenCoachmark]="documentsCoachmark">open</bd-tabbar-tab>

<bd-coachmark2 #documentsCoachmark [id]="documentsCoachmarkId" direction="top">
    <h5 class="ng2-c-coachmark__title" translate>New!</h5>
    <div class="ng2-c-coachmark__text" translate>Consult your official portfolio statements here.</div>
    <span class="ng2-c-coachmark__close-button" (click)="close()" translate>Close</span>
</bd-coachmark2>
```

```js
onInit(): void {
    bdCoachmarkManager.open('documentsCoachmarkId');
}

close(): void {
    bdCoachmarkManager.close('documentsCoachmarkId');
}
```
