# BD-TABBAR2

## bd-tabbar2

The `bd-tabbar2` is a grouping of a number of `bd-tabbar-tab2`. The `bd-tabbar2` is full width and sticky to the bottom of the page.

## bd-tabbar-tab2

The `bd-tabbar-tab2` is a single tab within the tabbar.

### API

`icon`

Name of the icon to be displayed.

`label`

Name to display on the tab.

`badge`

Text to display inside a badge on the tab.

`active`

A boolean that indicates whether the tab is active or not.

## Usage

```html
<bd-tabbar2>
    <bd-tabbar-tab2  (click)="tabChanged('portfolio')"  
                    [label]="'Portefeuille'"
                    [icon]="'wallet'"
                    [active]="portfolioActive">
    </bd-tabbar-tab2>

    <bd-tabbar-tab2  (click)="tabChanged('contact')"
                    [label]="'Contact'"
                    [icon]="'message'"
                    [active]="contactActive"
                    [badgeCount]="badge">
    </bd-tabbar-tab2>

    <bd-tabbar-tab2  (click)="tabChanged('administration')" 
                    [label]="'Beheerders'"  
                    [active]="'administrationActive'"
                    [icon]="briefcase">
    </bd-tabbar-tab2>
</bd-tabbar2>
```

## Disappearing content behind the tab bar 

Sometimes content will disappear behind the tab bar. To solve this, you should add a footer element with the `ng2-c-tabbar__placeholder`. This will create a space below the missing content which has the same height as the tab bar.

```html
<footer class="ng2-c-tabbar__placeholder"></footer> 
```

## Screenshots

![bd-tabbar](bd-tabbar.png)
