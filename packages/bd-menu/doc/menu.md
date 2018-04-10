# BD-MENU

## bd-menu2

The `bd-menu2` directive is the element that wraps the `bd-menu-item2` components.

- `itemClicked` Function that gets called to update the active item (or do something else).

- `activeItem` The active item.

## bd-menu-item2

- `id` The id of the menu item

- `icon` The icon of the menu item

## Usage

```html
<bd-menu2 (itemClicked)="setActiveItem($event)" [activeItem]="activeItem">
    <bd-menu-item2 id="details" icon="vcard">Mijn gegevens</bd-menu-item2>
    <bd-menu-item2 id="communication" icon="chat">Mijn communicatie</bd-menu-item2>
    <bd-menu-item2 id="interests" icon="hobby--sailing">Mijn interesses</bd-menu-item2>
</bd-menu2>
```
