# BD-VIEW

## bd-world2

`bd-world2` is the former `bd-map` component. It renders a map of the world via d3.

## bd-world-marker2

`bd-world-marker2` is a single marker on the map. Multiple markers are allowed.

### API

`location` - object with latitude and longitude

## Usage

```html
<bd-world2>
    <bd-world-marker2 [location]="location1"></bd-world-marker2>
    <bd-world-marker2 [location]="location2"></bd-world-marker2>
    <bd-world-marker2 [location]="location3"></bd-world-marker2>
</bd-world2>
```

```ts
location1 = { lat: 51.507222, lng: -0.1275 };
location2 = { lat: 35.683333, lng: 139.683333 };
location3 = { lat: 40.7143528, lng: -74.0059731 };
```
