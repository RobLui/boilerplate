# BD-BACKDROP

## BdOverlayPlaceholderManager

The overlayplaceholder is intended to be used as a layer on top of the application. It is used to place floating objects inside it like: backdrop, dialog, popup, toasts.
There should be only 1 instance of the overlayplacehoder inside an application.

Within the placeholder there are 2 layers.
- the overlay layer: this layer will contain dialogs, popups
- the always on top layer: this layer will contain toasts and is on top of the overlay layer

The overlay placeholder will dynamicly create components passed to it.

### API
```ts
addComponent(componentType: Type<any>, data?: object | null, alwaysOnTop: boolean = false): ComponentRef<any>
```

Will create and add a component of a specific type to the overlay placeholder.
 
- `componentType` the type of object you want dynamicaly created ex: BdDialogComponent, BdBackdropComponent, BdPopupComponent

- `data` sometimes a component needs some extra data passed into the constructor that is not a service ex.: new ExtraData('somedata')

- `alwaysOnTop` if true, places the component in the always-on-top layer. (default: false)

- returns a reference to the component instance that was created

```ts
removeComponent(componentRef: ComponentRef<any>): void
```

Removes and destroys a component that was created by the `addComponent` method.

- `componentRef` a reference to a component instance obtained from the `addComponent` method

- returns void

```ts
addTemplate(templateRef: TemplateRef<any>, alwaysOnTop: boolean = false): EmbeddedViewRef<any>
```

- `templateRef` a reference to the template to embed in the placeholder
- `alwaysOnTop` if true, places the embedded view in the always-on-top layer. (default: false)
- returns a reference to the embedded view that was created

```ts
removeTemplate(viewRef: EmbeddedViewRef<any>): void
```

- `viewRef` a reference to an embedded view obtained from the `addTemplate` method
- returns void

## bd-overlay-placeholder

The `<bd-overlay-placeholder2>` should be added only once into the application, preferably as the first element in the app
