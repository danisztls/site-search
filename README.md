# Search
A instant search UI component for the Web aimed to be light and agnostic.

## Features
### Light
It's written in modern JS and besides [Fuse.js](https://fusejs.io/) fuzzy search library it does not require any other dependency. It's a simple, not overly complicated solution, that runs locally on the browser without requiring any kind of connection to a 3rd-party. And thus it doesn't share the same shortfalls of cloud-based solutions and:

- works when offline
- works for content behind authentication
- do not track user behavior

It does not provide the same level of features and maturity of Algolia's [DocSearch](https://docsearch.algolia.com/). But besides the structured search *(as in understanding headings)*, which I may add in the future, I don't think it's missing anything else that's critical.

### Agnostic
It does not require the use of any kind of framework, transpiler or tooling. It's written in pure ECMAScript *(the standardized JavaScript reference)*. And while it's written to work with Fuse.js it probably can be adapted without much effort for other similar search libraries like [Lunr.js](https://lunrjs.com/).

### Accessibility
As far as I know it's ARIA compliant and should work with screen readers but that hasn't been tested and bug reports are welcomed.

## Usage
### JavaScript
If you're using a builder like [ESBuild](https://esbuild.github.io/) as is the case with Hugo [JS Building](https://gohugo.io/hugo-pipes/js/) you can set it to import and bundle Fuse.js. The script will fetch the data asynchronously so you don't need to defer it's loading

```html
<script src="/js/search.js" async></script>
```

Otherwise you will have to load both `search.js` and `Fuse.js` and defer loading as to avoid referencing Fuse.js before it's loaded.

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.4.6" defer></script>
<script src="/js/search.js" defer></script>
```

### Data
By default it expects JSON data at `/index.json` but any other URL can be set.

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
<form id="search" role="search" aria-haspopup="listbox" aria-labelledby="search-label" hidden="true">
  <label id="search-label" class="fas fa-search"></label>

  <input
    id="search-input"
    type="search"
    list="search-results"
    placeholder="Search..." 
    aria-label="Search"
    autocomplete="off"
    spellcheck="false"
    hidden="true"
  >
  </input>

  <ul id="search-modal" role="listbox" hidden="true">
  </ul>
</form>
```
