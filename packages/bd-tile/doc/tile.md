# BD-TILE

## bd-tiles2
The `bd-tiles2` component is just a container for `bd-tile2` elements.

### Styles
This component only contains private classes.

### API
This component has no behavior, only styles.

## bd-tile2
The `bd-tile2` component is used to display a checkbox with a large icon.

### Styles
This component only contains private classes.

### API
`active` (input)
A `boolean` value indicating whether the checkbox is checked.

`toggle` (output)
Emits the next checked state (`boolean`) when the tile is clicked. Use this event to update the `active` binding.

`label` (input)
The label (`string`) of the tile. (required)

`icon` (input)
The icon class (`string`) of the icon to display inside the tile. (required)

`loading` (input)
A `boolean` value indicating whether a loading spinner should be shown.

## Usage
```html
<bd-tiles2 class="u-clearfix">
    <bd-tile2 *ngFor="let interest of interests"
             [label]="interest.label"
             [icon]="interest.icon"
             [loading]="interest.loading"
             [active]="interest.active"
             (toggle)="toggleInterest(interest, $event)">
    </bd-tile2>
</bd-tiles2>
```

```ts
// Important: bd-tile never mutates its inputs!
// Implications:
//     * the 'interest.active' property contains the current state of the tile
//     * the 'enable' parameter contains the next state, use it to update the viewmodel
// Example: if you click on a disabled tile then 'interest.active' will be false and 'enable' will be true.
toggleInterest(interest: VM, enable: boolean) {
  if (enable) {
      interest.loading = true;
      this.service.enableInterest(interest.id)
                  .then(() => interest.active = true)
                  .catch(err => alert('Could not enable interest because: ' + err.reason))
                  .finally(() => interest.loading = false);
  } else {
      interest.loading = true;
      this.service.disableInterest(interest.id)
                  .then(() => interest.active = false)
                  .catch(err => alert('Could not disable interest because: ' + err.reason))
                  .finally(() => interest.loading = false);
  }
}
```
