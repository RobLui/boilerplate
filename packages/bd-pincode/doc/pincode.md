# BD-PINCODE

## bd-pincode2

The `bd-pincode2` component is used to visualize the input of a pincode. It works in combination with `bd-keypad`.

### API

The `ng2-c-pincode--digits` class shows the digits and hides them ass a password input after

The `ng2-c-pincode--bullets` class shows the pincode as circles

The `ng2-c-pincode--alt` class is to be used in combination with `ng2-c-pincode--bullets` changes the colors 

`value`

The value that is displayed as pincode.

`loading`

A boolean that indicates whether the loading state should be activated or not.

`hideTime`

Use with css class `ng2-c-pincode--digits`. A number that indicates the time the input characters should be visible before hiding them

`length`

A number that indicates the total of pincode items (default 4).

`readyTime`

Default is 100ms. This is the time that will elapse before hiding the last character (if digits are hidden) and triggering the onPincodeReady event

`onPincodeReady`

EventEmitter that emits when all digits are filled in.
Submit your pincode with this event.

`error()`

call from code to put the pincode in an error state (shake or red)


## Usage

`Bullet example:`
```html
<bd-pincode2 class="ng2-c-pincode--bullets"
    #pincodeComponent
    [value]="pincode"
    [loading]="loadingState===LoadingState.Loading"
    (onPincodeReady)="onPincodeReady()">
</bd-pincode2>
```

`Digits shown example:`
```html
<bd-pincode2 class="ng2-c-pincode--digits"
    #pincodeComponent
    [value]="pincode"
    [loading]="loadingState===LoadingState.Loading"
    (onPincodeReady)="onPincodeReady()">
</bd-pincode2>
```

`Digits hide after some time example:`
```html
<bd-pincode2 class="ng2-c-pincode--digits"
    #pincodeComponent
    [value]="pincode"
    [hideTime]="100"
    [loading]="loadingState===LoadingState.Loading"
    (onPincodeReady)="onPincodeReady()">
</bd-pincode2>
```


```ts
@ViewChild('pincodeComponent') pincodeComponent: BdPincodeComponent;

submitPincode(event: string): void {
    this.pincode = event;
    this.pincodeSerice
        .submit(this.pincode)
        .then((success: boolean) => if(!success) this.pincodeComponent.error())
}
```

