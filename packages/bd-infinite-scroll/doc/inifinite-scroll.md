# BD-INFINITE-SCROLL

## bdInfiniteScroll

The `bdInfiniteScroll` directive can be applied to any scrollable element to start listening for its scroll events and get notifications when the scroll position approaches the bottom of the element.

### API
`bdInfiniteScroll` (directive, input, output)  
A `boolean` value indicating whether scroll events can currently be handled. Default: false.

`threshold` (input)  
The maximum number of pixels of overflowing content at the bottom edge of the scroll container before an event is emitted. Default: 1.

`lazyLoad` (output)  
Emits whenever the user scrolls past the threshold and then disables the watcher. Handle this event to load more content and re-enable the watcher as needed.

### Usage Example
```css
ul {
  height: 100px;
  overflow-y: scroll;
}
```

```html
<ul [(bdInfiniteScroll)]="canLoadMore" [threshold]="1000" (lazyLoad)="loadMore()">
  <li *ngFor="let item of lazyItems"></li>
</ul>
<div class="ng2-c-loader" *ngIf="loading"></div>
```

```ts
canLoadMore: boolean;

loading: boolean;

lazyItems: any[] = [];

ngOnInit(): void {
    this.loadMore();
}

loadMore(startIndex = this.lazyItems.length): void {
    this.loading = true;
    this.service.getItems({ startIndex, count: 45 })
                .then((items: any[], more: boolean) => {
                    this.lazyItems = [...this.lazyItems, ...items];
                    this.canLoadMore = more;
                })
                .finally(() => this.loading = false);
}
```
