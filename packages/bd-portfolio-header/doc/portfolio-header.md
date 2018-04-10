# BD-PORTFOLIO-HEADER

## bd-portfolio-header2

The `bd-portfolio-header2` defines the header of the portfolio page with an optional navigation arrow on the top left to select other or multiple contracts. Based on the amount of contracts, the component decides whether the single contract view or the consolidated view is required via contracts returned. It needs to be positioned inside a `ng2-c-view__content` element.

### API

`data`

Object with all the required of data to be displayed.

`backLabel`

Label to be shown on the top left of the header

`onBackLabelClicked`

Function to be called when back button clicked

`state`

Set the state, state can be one of the following values:
- loading
- error
- none

`errorText`

The text to be shown when in error state

`errorButtonText`

The text to be shown inside the button when in error state (only visible in full view)

`onErrorButtonClicked`

Function to be called when error button is clicked.


### Data Structure (@type Portfolio)

- `title`: The title to be displayed (when multiple contracts selected).
- `total`: The total amount (of all selected contracts) to be displayed.
- `totalReturn`: The total return (of all selected contracts):
    - `value`: A numeric value.
    - `format`: A human readable version of the number, including percentage or currency value.
- `activeReturnPeriod`: The period that applies to the total return.
- `contracts`: An array of contracts. (see *contracts structure*)

### Contracts Structure (@type Contracts)

- `name`: The name to be displayed.
- `iban`: The iban to be displayed.
- `valuation`: The amount to be displayed.
- `return`: The total return:
    - `value`: A numeric value.
    - `format`: A human readable version of the number, including percentage or currency value.

## Usage

```html
<bd-view2>
    <div class="ng2-c-view__content">
        <bd-portfolio-header2
                [state]="state"
                [data]="data"
                [errorText]="errorText"
                [errorButtonText]="buttonText"
                (onErrorButtonClicked)="retry()"
                [backLabel]="backLabel"
                (onBackLabelClicked)="goBack()">
        </bd-portfolio-header2>
    </div>
<bd-view2>
```
