# BD-KEYPAD

## bd-keypad

The `bd-keypad` is used as phone keypad emulator

### API

`blocked`

If set to true `onKeyPressed` will not be triggered (default false)

`clearLabel`

text to show on the clear button

`extraOptionIcon`

icon to show on the extra option button ex: icon-fingerprint-small

`showExtraButton`

show the extra button (default false)

`onKeyPressed`

Event that will emit values 0 to 9 for the numeric keys, 
For the non numeric keys the values KeypadValue.Clear, KeypadValue.Extra ('clear', 'extra') are emitted.

The class `ng2-c-keypad--white` is used to show the keypad with inverted color scheme

```html
<bd-keypad2
 (onKeyPressed)="onKeyPressed($event)"
 [blocked]="keypadBlocked"
 [clearLabel]="'Delete' | translate">
</bd-keypad2>
```
```ts
onKeyPressed(event: string): void {
     if (event === KeypadValue.Clear) {
         this.pincode = '';
     } else {
         this.pincode += event;
     }
}
```
