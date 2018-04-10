# BD-PANEL-SLIDER

## bd-panel-slider

The `bd-panel-slider` component defines a horizontal scrolling list. By default the first item is shown in the center of the screen.

### API

#### Methods

`scrollToEnd`

Makes the items(panels) scroll to the end.

## bd-panel-slider-item

The `bd-panel-slider-item` component defines a single item within the `bd-panel-slider`.

## Usage

```ts
@ViewChild('panelSliderComponent') panelSliderComponent: BdPanelSliderComponent;

activatePanelSlider(): void {
    this.panelSliderComponent.scrollToEnd();
}
```

```html
<bd-panel-slider2 #panelSliderComponent>
    <bd-panel-slider-item2 *ngFor="let item of itemArray">
        //use any type of component here
    </bd-panel-slider-item2>
</bd-panel-slider2>
```

## Screenshots

![bd-panel-slider](bd-panel-slider.png)
