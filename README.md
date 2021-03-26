# sticky-nav

A web component for navigating to sections of your page that sticks as your scroll.

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
<sticky-nav />
```

That's it.

## Changing Default Configuration

You can optionally provide attributes to the element to customize your experience. Here are the _default_ attribute values.

```html
<sticky-nav 
    sticky="true",
    container="sticky-nav"
    heading="h2"
/>
```

### Attributes

### _sticky_

- required: `false`
- type: `boolean`
- default: `"true"`

The `sticky` attribute determines whether the `fixed` class gets added to the outermost div. This class defaults to having a `fixed` position style property. By default, it will assume the consuming application wants a sticky navbar.

```html
<sticky-nav sticky="false"/>
```

### _container_

- required: `false`
- type: `string`
- default: `"sticky-nav"`


The `container` attribute is the tag (HTML element, class, or ID) that the navigation will be injected into. By default, it will be injected into its own tags (`<sticky-nav />`) implemented by the consuming application.

```html
<sticky-nav container=".header"/>
```

### _heading_

- required: `false`
- type: `string`
- default: `"h2"`

The `heading` attribute is the tag (HTML element, class, or ID) that will be used to create the navbar elements. By default, it will scour the `<body>` for H2 tags.

```html
<sticky-nav heading="h3"/>
```

## Custom Styles

You can override or modify the default styles by using the provided IDs and classes. The component is structured like the following:

```html
    <div id="sticky-nav-outer">
        <div id="sticky-nav-inner">
            <div class="sticky-nav-element"></div>
            <div class="sticky-nav-element"></div>
            ...
        </div>
    </div>
```

### Navbar Wrapper

To customize the styles of the navbar container, use the following ID in your styles:

```css
    #sticky-nav-outer {}
```

If you have not disabled the `sticky` attribute; a `fixed` class will be added to the `#sticky-nav-outer` element as the user scrolls passed the menu. By default, the `fixed` class adds a `position: fixed;` to the styles of the `#sticky-nav-outer` element.

If you want to customize this behavior, access the `fixed` class on the `sticky-nav-outer` element:

```css
    #sticky-nav-outer.fixed {}
```

### Navbar Inner Container

To customize the styles of the navbar inner container, use the following ID in your styles:

```css
    #sticky-nav-inner {}
```

### Navbar Elements

To customize the styles of the navbar's innermost elements, use the following class in your styles:

```css
    #sticky-nav-inner>.sticky-nav-elements {}
```

If you want to customize the `active` state of a `sticky-nav-element`, use the following class in your styles:

```css
    #sticky-nav-inner>.sticky-nav-elements>.active {}
```

The `active` class is added whenever the section represented by the nav element is in or below the top 1/3 of the page and above of the next section in the page. The `active` class will only be applied to one element at a time.

## Notes

### Using TypeScript + TSX

You may get the following linting error on the element: `Property 'sticky-nav' does not exist on type 'JSX.IntrinsicElements'`. To fix this, add the following snippet to your `declarations.d.ts` file.  

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