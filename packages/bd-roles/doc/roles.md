# BD-ROLES

## Styling

`ng2-c-roles`

A container for a list of roles.

`ng2-c-roles__item`

A single role.

`ng2-c-roles__item--loading`

A modifier for a role in loading state.

`ng2-c-roles__figure`

A container for the role icon.

`ng2-c-roles__icon`

The role icon.

`ng2-c-roles__icon--female`

A modifier to display a female role icon.

`ng2-c-roles__icon--male`

A modifier to display a male role icon.

`ng2-c-roles__icon--company`

A modifier to display a company role icon.

`ng2-c-roles__label`

A container for the text in a role.

`ng2-c-roles__label--title`

A modifier for the title text.

## Usage

*Female role*

```html
<div class="ng2-c-roles">
    <div class="ng2-c-roles__item">
        <figure class="ng2-c-roles__figure">
            <i class="ng2-c-roles__icon ng2-c-roles__icon--female"></i>
        </figure>
        <span class="ng2-c-roles__label ng2-c-roles__label--title">
            Dhr. Marc Desmedt
        </span>
        <span class="ng2-c-roles__label ng2-c-roles__label--description">
            Volmacht inzage
        </span>
    </div>
</div>
```

*Male role*

```html
<div class="ng2-c-roles">
    <div class="ng2-c-roles__item">
        <figure class="ng2-c-roles__figure">
            <i class="ng2-c-roles__icon ng2-c-roles__icon--male"></i>
        </figure>
        <span class="ng2-c-roles__label ng2-c-roles__label--title">
            Dhr. Marc Desmedt
        </span>
        <span class="ng2-c-roles__label ng2-c-roles__label--description">
            Volmacht inzage
        </span>
    </div>
</div>
```

*Company*

```html
<div class="ng2-c-roles">
    <div class="ng2-c-roles__item">
        <figure class="ng2-c-roles__figure">
            <i class="ng2-c-roles__icon ng2-c-roles__icon--company"></i>
        </figure>
        <span class="ng2-c-roles__label ng2-c-roles__label--title">
            Dhr. Marc Desmedt
        </span>
        <span class="ng2-c-roles__label ng2-c-roles__label--description">
            Volmacht inzage
        </span>
    </div>
</div>
```

*Loading*

```html
<div class="ng2-c-roles">
    <div class="ng2-c-roles__item ng2-c-roles__item--loading">
        <figure class="ng2-c-roles__figure">
            <div class="ng2-c-loader"></div>
        </figure>
    </div>
</div>
```

## Screenshots

![bd-roles](bd-roles.png)
