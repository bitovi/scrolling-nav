# scrolling-nav

A web component for navigating to sections of your page that can stick as you scroll.

## Setup

If you are using a module loader, you can install the web component with NPM like:

```shell
npm install @bitovi/scrolling-nav
```

Import the web component:

```js
import "../../node_modules/@bitovi/scrolling-nav";
```

## Use


To use, just insert the HTML element tag created by the package.

```html
<scrolling-nav></scrolling-nav>
```

That's it.

## Changing Default Configuration

You can optionally provide attributes to the component to customize your experience. Here are the _default_ attribute values.

```html
<scrolling-nav 
    scrollable-container-selector="window"
    heading-selector="h2"
></scrolling-nav>
```

### Attributes

### _scrollable-container-selector_

- required: `false`
- type: `string`
- default: `"window"`


The `scrollable-container-selector` attribute is the tag (HTML element, class, or ID) contains the section headings that you want to scroll to. By default, it will be the window.

```html
<scrolling-nav scrollable-container-selector=".header"></scrolling-nav>
```

### _heading-selector_

- required: `false`
- type: `string`
- default: `"h2"`

The `heading-selector` attribute is the tag (HTML element, class, or ID) that will be used to create the navbar items. By default, it will scour the `<body>` for H2 tags.

```html
<scrolling-nav heading-selector="h3"><scrolling-nav>
```

## Custom Styles

You can override or modify the default styles by using the provided IDs and classes. The component is structured like the following:

```html
    <scrolling-nav>
        <ul class="scrolling-nav-inner">
            ...
            <ul class="scrolling-nav-item">
                <a>Heading Example 1</a>
            </ul>
            ...
            <ul class="scrolling-nav-item">
                <a>Heading Example 2</a>
            </ul>
            ...
        </div>
    </scrolling-nav>
```

### Navbar Wrapper

To customize the styles of the navbar container, use the following tag in your styles:

```css
    scrolling-nav {}
```

### Navbar Inner Container

To customize the styles of the navbar inner container (which is scrolled by the outer container), use the following ID in your styles:

```css
    scrolling-nav > ul {}
```

### Navbar Items

To customize the styles of the navbar's items, use the following class in your styles:

```css
    scrolling-nav > ul > li {}
```

If you want to customize the `active` state of a nav item, use the following class in your styles:

```css
    scrolling-nav > ul > li.scrolling-nav-active {}
```

The `scrolling-nav-active` class is added whenever the section represented by the nav item is in or below the top 1/3 of the page and above of the next section in the page. The `scrolling-nav-active` class will only be applied to one item at a time.

## Notes

### Using TypeScript + TSX

You may get the following linting error on the web component: `Property 'scrolling-nav' does not exist on type 'JSX.IntrinsicElements'`. To fix this, add the following snippet to your `declarations.d.ts` file.  

```ts
// In ~/declarations.d.ts

declare namespace JSX {
    // ...
  interface IntrinsicElements {
      // ...
    "scrolling-nav": any;
  }
}
```