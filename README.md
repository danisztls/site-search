# Search
A instant search UI component for the Web aimed to be light and agnostic.

## Features
### Light
It's light because it's written in modern JS and besides [Fuse.js](https://fusejs.io/) fuzzy search library it does not require any other dependency. It's a simple, not overly complicated solution, that runs locally on the browser without requiring any kind of connection to a 3rd-party. And thus it doesn't share the shortfalls of cloud-based solutions having the advantages of:

- working when offline
- working for content behind authentication
- not tracking user behavior

It does not provide the same level of features and maturity of Algolia's [DocSearch](https://docsearch.algolia.com/). But besides the structured search *(as in understanding headings)*, which I may add in the future, I don't think it's missing anything else that's critical. And in my experience with documentation sites, blogs and small ecommerce results are relevant and provided instantly.

### Agnostic
It's agnostic because it does not require the use of any kind of framework, transpiler or tooling. It's written in pure ECMAScript *(the standardized JavaScript reference)*. And while it's written to work with Fuse.js it probably can be adapted without much effort for other similar search libraries like [Lunr.js](https://lunrjs.com/).

### Accessibility
As far as I know it's ARIA compliant and should work with screen readers but that hasn't been tested and bug reports are welcomed.

## Usage
### JavaScript
For web usage, if you're not using a builder like [ESBuild](https://esbuild.github.io/) that understands imports, you will have to load both `search.js` and `Fuse.js`.

### Data
It expects structured data at `/index.json` containing items with key-value pairs.

```json
{
  "id": "3db3e4a737a176646e0c3b8d5f25d392",
  "url": "/lorem-ipsum/",
  "title": "Lorem Ipsum"
}
, 
{
  "id": "e62701a89b303de6e24cb577ee9d5614",
  "url": "/dolor-sit-amet/",
  "name": "Dolor Sit Amet"
}
```

### HTML
```html
<form id="search" class="require-js" role="search" aria-haspopup="listbox" aria-labelledby="search-label">
  <label id="search-label" class="fas fa-search"></label>

  <input
    id="search-input"
    type="search"
    list="search-results"
    placeholder="Search..." 
    aria-label="Search"
    autocomplete="off"
    spellcheck="false"
  >
  </input>

  <ul id="search-modal" role="listbox" hidden="true">
  </ul>
</form>
```
