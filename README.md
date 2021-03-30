# sticky-nav

A web component for navigating to sections of your page that can stick as you scroll.

## Setup

If you are using a module loader, you can install the web component with NPM like:

```shell
npm install @bitovi/sticky-nav
```

Import the web component:

```js
import "../../node_modules/@bitovi/sticky-nav";
```

## Use


To use, just insert the HTML element tag created by the package.

```html
<sticky-nav></sticky-nav>
```

That's it.

## Changing Default Configuration

You can optionally provide attributes to the component to customize your experience. Here are the _default_ attribute values.

```html
<sticky-nav 
    stick="true",
    scrollable-container-selector="window"
    heading-selector="h2"
></sticky-nav>
```

### Attributes

### _stick_

- required: `false`
- type: `boolean`
- default: `"true"`

The `stick` attribute determines whether the `sticky-nav-fixed` class gets added to the <sticky-nav> element when you scroll passed it. This class defaults to having a `fixed` position style property. By default, it will assume the consuming application wants a sticky navbar.

```html
<sticky-nav sticky="false"></sticky-nav>
```

### _scrollable-container-selector_

- required: `false`
- type: `string`
- default: `"sticky-nav"`


The `scrollable-container-selector` attribute is the tag (HTML element, class, or ID) contains the section headings that you want to scroll to. By default, it will be the window.

```html
<sticky-nav scrollable-container-selector=".header"></sticky-nav>
```

### _heading-selector_

- required: `false`
- type: `string`
- default: `"h2"`

The `heading-selector` attribute is the tag (HTML element, class, or ID) that will be used to create the navbar items. By default, it will scour the `<body>` for H2 tags.

```html
<sticky-nav heading-selector="h3"><sticky-nav>
```

## Custom Styles

You can override or modify the default styles by using the provided IDs and classes. The component is structured like the following:

```html
    <sticky-nav>
        <ul class="sticky-nav-inner">
            ...
            <ul class="sticky-nav-item">
                <a>Heading Example 1</a>
            </ul>
            ...
            <ul class="sticky-nav-item">
                <a>Heading Example 2</a>
            </ul>
            ...
        </div>
    </sticky-nav>
```

### Navbar Wrapper

To customize the styles of the navbar container, use the following tag in your styles:

```css
    sticky-nav {}
```

If you have not disabled the `sticky` attribute; a `sticky-nav-fixed` class will be added to the `<sticky-nav>` element as the user scrolls passed the menu. By default, the `sticky-nav-fixed` class adds a `position: fixed;` to the styles of the `<sticky-nav>` element.

If you want to customize this behavior, access the `sticky-nav-fixed` class on the `<sticky-nav>` element:

```css
    sticky-nav.sticky-nav-fixed {}
```

### Navbar Inner Container

To customize the styles of the navbar inner container (which is scrolled by the outer container), use the following ID in your styles:

```css
    sticky-nav>ul {}
```

### Navbar Items

To customize the styles of the navbar's items, use the following class in your styles:

```css
    sticky-nav>ul>li {}
```

If you want to customize the `active` state of a nav item, use the following class in your styles:

```css
    sticky-nav>ul>li.sticky-nav-active {}
```

The `sticky-nav-active` class is added whenever the section represented by the nav item is in or below the top 1/3 of the page and above of the next section in the page. The `sticky-nav-active` class will only be applied to one item at a time.

## Notes

### Using TypeScript + TSX

You may get the following linting error on the web component: `Property 'sticky-nav' does not exist on type 'JSX.IntrinsicElements'`. To fix this, add the following snippet to your `declarations.d.ts` file.  

```ts
// In ~/declarations.d.ts

declare namespace JSX {
    // ...
  interface IntrinsicElements {
      // ...
    "sticky-nav": any;
  }
}
```