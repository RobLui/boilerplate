# BD-ATTACHMENT

## bd-attachment

Styles the content like a bank statement. The content should be formatted.

### Styling

`.ng2-c-attachment` The attachment

`.ng2-c-attachment__content` Style the attachment as a bank statement. **Important:** This should be a `pre` tag! It also needs a `code` tag as child element, which contains the formatted content.

> When adding the `code` tag on a newline it will add gaps, if you place the `code` tag on the same line as the `pre` tag it should be good! (see usage). For more information visit: https://stackoverflow.com/questions/9385125/pre-tag-adds-gap-above-itself#answer-9385200

### Usage

```html
<div class="ng2-c-attachment">
    <pre class="ng2-c-attachment__content"><code>
Opdrachtgever : BE25 5555 5555 5555                        Bedrag: 500,00
JAN VANDENBUSSCHE
297 LOMMELSESTEENWEG
3970 LEOPOLDSBURG

Bij :           ARGENTA
ARSPBE22

Begunstigde :   BE22 6666 6666 6666                        Datum : 05/01/2016
Vandenbussche Jan                                          Valuta: 05/01/2016
        </code></pre>
</div>
```

### Screenshots

![attachment](attachment.png)
