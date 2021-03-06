---
demo_url: '/docs/docs-content/api/0.0.2-28/popover.html'
---

# ion-popover

A Popover is a dialog that appears on top of the current page. It can be used for anything, but generally it is used for overflow actions that don't fit in the navigation bar.

### Creating

Popovers can be created using a [Popover Controller](../../popover-controller/PopoverController). They can be customized by passing popover options in the popover controller's create method.

### Presenting

To present a popover, call the `present` method on a popover instance. In order to position the popover relative to the element clicked, a click event needs to be passed into the options of the the `present` method. If the event is not passed, the popover will be positioned in the center of the viewport.

```javascript
async function presentPopover(event) {
  const popoverController = document.querySelector('ion-popover-controller');
  await popoverController.componentOnReady();

  const popoverElement = await popoverController.create({
    component: 'profile-page',
    ev: event
  });
  return await popoverElement.present();
}
```

<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### component

string

The component to display inside of the popover.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### data

any

The data to pass to the popover component.


#### delegate




#### enableBackdropDismiss

boolean

If true, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enterAnimation



Animation to use when the popover is presented.


#### ev

any

The event to pass to the popover animation.


#### leaveAnimation



Animation to use when the popover is dismissed.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### overlayId

number


#### showBackdrop

boolean

If true, a backdrop will be displayed behind the popover. Defaults to `true`.


#### translucent

boolean

If true, the popover will be translucent. Defaults to `false`.


#### willAnimate

boolean

If true, the popover will animate. Defaults to `true`.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### component

string

The component to display inside of the popover.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### data

any

The data to pass to the popover component.


#### delegate




#### enable-backdrop-dismiss

boolean

If true, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enter-animation



Animation to use when the popover is presented.


#### ev

any

The event to pass to the popover animation.


#### leave-animation



Animation to use when the popover is dismissed.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### overlay-id

number


#### show-backdrop

boolean

If true, a backdrop will be displayed behind the popover. Defaults to `true`.


#### translucent

boolean

If true, the popover will be translucent. Defaults to `false`.


#### will-animate

boolean

If true, the popover will animate. Defaults to `true`.


## Events

#### ionPopoverDidDismiss

Emitted after the popover has dismissed.


#### ionPopoverDidLoad

Emitted after the popover has loaded.


#### ionPopoverDidPresent

Emitted after the popover has presented.


#### ionPopoverDidUnload

Emitted after the popover has unloaded.


#### ionPopoverWillDismiss

Emitted before the popover has dismissed.


#### ionPopoverWillPresent

Emitted before the popover has presented.


## Methods

#### dismiss()

Dismiss the popover overlay after it has been presented.


#### present()

Present the popover overlay after it has been created.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
