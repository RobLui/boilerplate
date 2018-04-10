# BD-BACKDROP

## BdBackdropService

The `bdBackdropService` shows and hides a backdrop over the UI. Appears behind popups, dialogs, loading, and other overlays. Often, multiple UI components require a backdrop. Backdrops are added to the component overlay-placeholder. Multiple backdrops can shown if for example a dialog opens a popup.

The add method adds a backdrop. It is to be called before opening the component that needs the backdrop (else it will be shown in front of the component)

The backdrop is used in the popup and dialog service.

### API
`add(options?, click?)`

Add's a backdrop to the overlay-placeholder.

options: if not passed default settings will be used, if you need somthing different than the default options you can pass in your custom options here
click: this is the method that will be called when de backdrop is clicked

`remove(backdrop)`

Removes a backdrop by a specified reference.


### Options Structure

- `blur` the backdrop will be a blue gradient

- `disableBackground` the backdrop will be there but transparent

## bd-backdrop2

The `<bd-backdrop2>` is added dynamically to the application through the add method. You never need to add it yourself.


```js
this.bdBackdropService.add(bdBackdropOptions, () => this.bdBackdropService.close());
```
