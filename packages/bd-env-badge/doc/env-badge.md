# BD-ENV-BADGE

Shows a fixed environment badge on the bottom right of the screen.

### API

- `[attr.data-env]="string"` - The environment to show a label for, only accepts 'DVLP' or 'ACPT'

### Examples

```html
<div class="ng2-c-env-badge" [attr.data-env]="environmentProperty"></div>
```

```html
<div class="ng2-c-env-badge" data-env="DVLP"></div>
```
