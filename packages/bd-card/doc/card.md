# BD-CARD

## Styling

`ng2-c-card`

Displays a card with some info in it.

`ng2-c-card--no-shadow`

Remove shadow from a card.

`ng2-c-card__header`

A container for the header of a card.

`ng2-c-card__heading`

A class to style the text of heading elements (h1, h2, h3, ...) inside a card header.

`ng2-c-card__content`

A container for the content of a card.

`ng2-c-card__split`

A container to display two card definitions next to each other.

`ng2-c-card__definition`

A block divided by borders inside a card.

`ng2-c-card__definition--value`

A modifier to style the content of the definition as 'value'.

`ng2-c-card__definition--return`

A modifier to style the content of the definition as 'return'.

`ng2-c-card__key`

The label for the value inside a definition.

`ng2-c-card__value`

The value inside a definition.

`ng2-c-card__icon`

A class to style the icon inside a card header.

## Usage

```html
 <section class="ng2-c-card ng2-c-card--shadow">
    <header class="ng2-c-card__header">
        <h5 class="ng2-c-card__heading">2015</h5>
        <button class="ng2-c-card__btn ng2-o-button ng2-o-button--quaternary ng2-o-button--small ng2-o-button--icon-right ng2-o-button--keep-text">
            <i class="ng2-o-button__icon icon-arrow-down"></i>
            <span class="ng2-o-button__text">Meer</span>
        </button>
    </header>
    <main class="ng2-c-card__content">
        <div class="ng2-c-card__definition ng2-c-card__definition--value">
            <div class="ng2-c-card__key">Waardering op 31 DEC 2015</div>
            <div class="ng2-c-card__value">
                <span>366.958 EUR</span>
            </div>
        </div>
        <div class="ng2-c-card__definition ng2-c-card__definition--return">
            <div class="ng2-c-card__key">Rendement van 1 jan 2015 tot 31 dec 2015</div>
            <div class="ng2-c-card__value">
                <span bdNumberSign="9.32">+1,42 %</span>
            </div>
        </div>
        <div class="ng2-c-card__split">
            <div class="ng2-c-card__definition">
                <div class="ng2-c-card__key">stortingen</div>
                <div class="ng2-c-card__value">950 EUR</div>
            </div>
            <div class="ng2-c-card__definition">
                <div class="ng2-c-card__key">afnames</div>
                <div class="ng2-c-card__value">300 EUR</div>
            </div>
        </div>
    </main>
</section>
```

## Screenshots

![bd-card](bd-card.png)
