# BD-AVATAR2

## API

`image`

This is the url of the image to show in the avatar. It is not a required attribute.
If it is not set the default  avatar or the avatar defined by the style class will be shown.

`classes`

`ng2-c-avatar--default` the default avatar

`ng2-c-avatar--user-male` will show a male avatar

`ng2-c-avatar--user-female` will show a female avatar

`ng2-c-avatar--user-company` will show a building avatar

`ng2-c-avatar--helpdesk` will show a helpdesk avatar

`ng2-c-avatar--large` a large version of the avatar

`.ng2-c-avatar--square` make the avatar a square instead of a circle

```html
<div class="c-contact__item" *ngFor="let contact of vm.contacts">
    <bd-avatar2 [image]="contact.imgUrl"></bd-avatar2>
</div>
```
