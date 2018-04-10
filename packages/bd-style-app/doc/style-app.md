# BD-STYLE-APP

## Icon

`.icon-delen-sri--large` large version of the delen sri logo

## Intro

`.ng2-c-intro` A container for the intro section

`.ng2-c-intro__title` The title in the intro section

`.ng2-c-intro__content` The content in the intro section

`.ng2-c-intro__keypass` A container for the keypass icon in the intro section.

`.ng2-c-intro__btn` A class to style the intro button.

### Usage

```html
<div class="ng2-c-intro">
    <h2 class="ng2-c-intro__title">Register your device</h2>

    <p class="ng2-c-intro__content">Create a pincode to quickly login without digipass.</p>

    <i class="ng2-c-intro__help icon-help"></i>

    <div class="ng2-c-intro__keypass">
        <i class="icon-keypass"></i>
    </div>

    <button class="ng2-o-button ng2-c-intro__btn">
        Start
    </button>
</div>

```

### Screenshots

![bd-intro](bd-intro.png)


## Logout

`.ng2-c-logout` The logout container

`.ng2-c-logout__title` The title inside the logout container

`.ng2-c-logout__countdown` The actual counter


### Usage

```html
<main class="ng2-c-dialog__content ng2-c-logout">
    <h5 class="ng2-c-logout__title">Your session will be closed due to inactivity</h5>

    <span class="ng2-c-logout__countdown">60</span>

    <button class="ng2-o-button ng2-o-button--negative u-mb" (click)="closeDialog()">
        Logout
    </button>
    <button class="ng2-o-button" (click)="closeDialog()">
        Extend session
    </button>
</main>
```


## Placeholders

`.e-placeholder--cash`: adds a placeholder for portfolio cash

`.e-placeholder--avatar-large`: adds a placeholder for a large avatar

`.e-placeholder--h-250`: adds a placeholder with a minimum height of 250px

`.e-placeholder--market-section`: adds a placeholder for the market section

`.e-placeholder--contract-selection`: adds a placeholder for the contract selection list

## Portfolio Transfers

`.e-portfolio-transfers` A container for the portfolio transfers section

`.e-portfolio-transfers__amount` The amount of the portfolio transfer
