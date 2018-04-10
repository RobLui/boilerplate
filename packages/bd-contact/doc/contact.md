# BD-CONTACT

This is a css only component.

## Styling

`ng2-c-contact`

A container for a list of contact items.

`ng2-c-contact--even`

A modifier for a even list of contact items (2 on 1 line).

`ng2-c-contact--odd`

A modifier for a odd list of contact items (3 on 1 line).

`ng2-c-contact--large`

A modifier for a list of large contact items. This will make the contact actions and the contact info will cover the width of the container.

`ng2-c-contact__item`

A wrapper for a single contact.

`ng2-c-contact__item--empty`

A modifier for an empty contact.

`ng2-c-contact__item--loading`

A modifier to show a single contact in loading state.

`ng2-c-contact__info`

A wrapper for the info about the contact.

`ng2-c-contact__actions`

A wrapper for the actions.

`ng2-c-contact__figure`

A wrapper for the image displayed with the contact.

`ng2-c-contact__label`

A wrapper for the text displayed with the contact.

`ng2-c-contact__label--name`

A modifier for the name text.

`ng2-c-contact__label--description`

A modifier for the description text.

## Usage

```html
<div class="ng2-c-contact ng2-c-contact--large">
    <div class="ng2-c-contact__item">
        <div class="ng2-c-contact__info">
            <figure class="ng2-c-contact__figure u-visible">
                <bd-avatar2 image="helpdesk"></bd-avatar2>
            </figure>
            <span class="ng2-c-contact__label ng2-c-contact__label--name">
                <span>François-Michel</span>
                <span>van Pottelsberghe de la Potterie</span>
            </span>
            <span class="ng2-c-contact__label ng2-c-contact__label--description">
                Vermogensbeheerder, Kantoor Antwerpen
            </span>
        </div>
        <div class="ng2-c-contact__actions">
            <div class="ng2-o-button-list">
                <a class="ng2-o-button ng2-o-button--secondary ng2-o-button--full"  href="tel: +32 (0)3 244 55 66">
                    <i class="ng2-o-button__icon icon-phone"></i>
                    <span class="ng2-o-button__text">+32 (0)3 244 55 66</span>
                </a>

                <a class="ng2-o-button ng2-o-button--secondary ng2-o-button--full">
                    <i class="ng2-o-button__icon icon-read-message"></i>
                    <span class="ng2-o-button__text">Stuur een bericht</span>
                </a>
            </div>
        </div>
    </div>
    <div class="ng2-c-contact__item">
        <div class="ng2-c-contact__info">
            <figure class="ng2-c-contact__figure u-visible">
                <bd-avatar2 image="http://lorempixel.com/128/128/people/"></bd-avatar2>
            </figure>
            <span class="ng2-c-contact__label ng2-c-contact__label--name">
                <span>Jean-François</span>
                <span>de Séjournet de Rameignies</span>
            </span>
            <span class="ng2-c-contact__label ng2-c-contact__label--description">
                Vermogensbeheerder, Kantoor Antwerpen
            </span>
        </div>
        <div class="ng2-c-contact__actions">
            <div class="ng2-o-button-list">
                <a class="ng2-o-button ng2-o-button--secondary ng2-o-button--full"  href="tel: +32 (0)3 244 55 66">
                    <i class="ng2-o-button__icon icon-phone"></i>
                    <span class="ng2-o-button__text">+32 (0)3 244 55 66</span>
                </a>

                <a class="ng2-o-button ng2-o-button--secondary ng2-o-button--full">
                    <i class="ng2-o-button__icon icon-read-message"></i>
                    <span class="ng2-o-button__text">Envoyer une message</span>
                </a>
            </div>
        </div>
    </div>
</div>
```

## Screenshots

![bd-contact](bd-contact.png)
