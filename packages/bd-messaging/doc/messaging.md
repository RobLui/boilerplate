# bd-messaging

bd-messaging consists of three css components.
* bd-conversation
* bd-message
* bd-massaging-contact

## bd-conversation

Used to style a list of conversations.

### Styling

`ng2-c-conversation`: one conversation block

`ng2-c-conversation--active`: adds a darker background to the conversation block

`ng2-c-conversation--unread`: adds a green triangle in the upperleft corner of the conversation block

`.ng2-c-conversation__avatars`: positions the avatars in the upperleft corner

`.ng2-c-conversation__summary`: contains the conversation summary, also makes space for the avatar to position without collision

`.ng2-c-conversation__header`: the conversation header

`.ng2-c-conversation__authors`: the conversation authors, adds ellipsis when too much context

`.ng2-c-conversation__time`: the conversation time, positions to the right of the authors

`.ng2-c-conversation__subject`: a conversation subject

`.ng2-c-conversation__message`: a short version of the conversation message

### Usage

**A conversation list with one item**

```html
<ul class="ng2-c-list ng2-c-list__wrapper">
    <li class="ng2-c-list__item">
        <div class="ng2-c-conversation ng2-c-conversation--unread">
            <ol class="ng2-c-conversation__avatars ng2-c-avatar-group">
                <li class="ng2-c-avatar-group__item">
                    <span class="ng2-c-avatar ng2-c-avatar--circle">
                        <img src="https://s3.amazonaws.com/uifaces/faces/twitter/shvelo96/128.jpg" alt="avatar">
                    </span>
                </li>
            </ol>
            <div class="ng2-c-conversation__summary">
                <div class="ng2-c-conversation__header">
                    <span class="ng2-c-conversation__authors">Wart, Sven, Verena, Robbert</span>
                    <span class="ng2-c-conversation__time">01/01/2018</span>
                </div>
                <div class="ng2-c-conversation__subject">
                    Magnam corrupti modi doloremque
                </div>
                <div class="ng2-c-conversation__message">
                    Quia voluptas quidem. Laboriosam cupiditate in. Et sed rerum qui mollitia necessitatibus soluta atque si
                </div>
            </div>
        </div>
    </li>
</ul>
```

## bd-message

Used to style one single conversation aka multiple messages.

### Styling

`.ng2-c-messages `: fills the full width/height of its parent element. mostly used inside a view main

`.ng2-c-messages--active`: adds a lighter background to the conversation block

`.ng2-c-messages__wrapper`: a wrapper for the message list and footer

`.ng2-c-messages__list`: a wrapper for the message items, sorted on reverse so that we always show the latest first and at the bottom

`.ng2-c-messages__footer`: a wrapper below the message list, containing the textarea to send a new message

`.ng2-c-message__item`: one message block, default aligned to the end of the list (right)

`.ng2-c-message__item--incomming`: one incomming message block aligned at the beginning of the list (left)

`.ng2-c-message__item--grouped`: a message block with less padding, to group multiple messages together. This hides the avatar and footer of a message block.

`.ng2-c-message__avatar`: the avatar of a single message block

`.ng2-c-message__summary`: a wrapper for the message and footer of a message block

`.ng2-c-message__message`: the message itself

`.ng2-c-message__footer`: for content below a message

`.ng2-c-message__author`: the sender of the message

`.ng2-c-message__time`: the time of the message

### Usage

**A list of messages**

```html
 <div class="ng2-c-messages ng2-c-messages--active">
    <div class="ng2-c-messages__wrapper">
        <ul class="ng2-c-messages__list">
            <li class="ng2-c-message__item"
                [class.ng2-c-message__item--incoming]="isIncomming"
                [class.ng2-c-message__item--grouped]="isGrouped"
                *ngFor="let message of messages">
                    <div class="ng2-c-message__avatar">
                        <span class="ng2-c-avatar ng2-c-avatar--circle">
                            <img src="{{message.avatar}}" alt="avatar">
                        </span>
                    </div>
                    <div class="ng2-c-message__summary">
                        <pre class="ng2-c-message__message">{{ message.messages }}</pre>
                        <div class="ng2-c-message__footer">
                            <span class="ng2-c-message__author">{{ message.author }}</span>
                            <span class="ng2-c-message__time">{{ message.timestamp }}</span>
                        </div>
                    </div>
                </li>
        </ul>
        <div class="ng2-c-messages__footer"></div>
    </div>
</div>
```


## bd-messaging-contact

Used for the 'add contact' of the messaging.


### Styling

`.ng2-c-messaging-contact` - the wrapper

`.ng2-c-messaging-contact--small` - the small wrapper

`.ng2-c-messaging-contact__image` - the image

`.ng2-c-messaging-contact__text` - the text

`.ng2-c-messaging-contact__icon` - the icon


### Usage

**Regular**

```html
<div class="ng2-c-messaging-contact">
    <bd-avatar2 class="ng2-c-messaging-contact__image ng2-c-avatar--square" [image]="image"></bd-avatar2>
    <span class="ng2-c-messaging-contact__text">{{name}}</span>
</div>
```

**Small**

```html
<div class="ng2-c-messaging-contact ng2-c-messaging-contact--small">
    <bd-avatar2 class="ng2-c-messaging-contact__image ng2-c-avatar--square" [image]="image"></bd-avatar2>
    <span class="ng2-c-messaging-contact__text">{{name}}</span>
    <i class="ng2-c-messaging-contact__icon icon-cross"></i>
</div>
```
