---
demo_url: '/docs/docs-content/api/0.0.2-25/thumbnail.html'
---

# ion-thumbnail

Thumbnails are square components that usually wrap an image or icon. They can be used to make it easier to display a group of larger images or provide a preview of the full-size image.

Thumbnails can be used by themselves or inside of any element. If placed inside of an `ion-item`, the thumbnail will resize to fit the parent component. To position a thumbnail on the left or right side of an item, set the slot to `start` or `end`, respectively.

```html
<ion-thumbnail>
  <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
</ion-thumbnail>

<ion-item>
  <ion-thumbnail slot="start">
    <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
  </ion-thumbnail>
  <ion-label>Item Thumbnail</ion-label>
</ion-item>
```

<!-- Auto Generated Below -->



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
