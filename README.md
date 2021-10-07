# Search
An instant search UI component for the Web aimed to be light, agnostic and effective.

[![lite-search](https://github.com/danisztls/lite-search/actions/workflows/release-package.yml/badge.svg)](https://github.com/danisztls/lite-search/actions/workflows/release-package.yml)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b569fb24-1b63-41d4-bec1-df533ecb262a/deploy-status)](https://app.netlify.com/sites/condescending-babbage-f99854/deploys)

## Features
- instant search
- highlight search term matches
- show match context
- easy to install
- runs locally on the browser
- not overly complicated
- does not require any kind of framework or tooling
- [Fuse.js](https://fusejs.io/) is the sole dependency
- works when offline *(DocSearch doesn't)*
- works behind authentication *(DocSearch doesn't)*
- do not track users *(DocSearch doesn't?)*
- acessibility *(please fill a report if it doesn't work properly with screen readers)*

## Caveats
- It does not support context-wise search at headings level as [DocSearch](https://docsearch.algolia.com/) does.
- Fuse.js is kind of dead.

## Demo
Check the [demo](https://condescending-babbage-f99854.netlify.app/).

## Usage
### Options
Do nothing to use the defaults or assign any custom options to `window.searchOpts`.

```html
<script>
  window.searchOpts = {
    // comment keys that aren't going to be used.
    keys: [
      { name: "title", weight: 7 },
      { name: "description", weight: 3 },
      { name: "content", weight: 1 }
    ],

    // optionally provide an alias when key names on JSON differ from what the script expects.
    aliases: [
      // { input: "title", output: "description" },
      // { input: "description", output: "title" }
    ],

    dataPath: "/index.json",
    // dataPath: "/" + basePath + lang + "/index.json",  // for multilingual 
    formSelector: "#search",
    minInputLength: 0,
    matchStrategy: "fuzzy",
    maxResults: 10,
    maxContextLength: 250,
    includeMatches: false,  // NOTE: use 'exact' for matchStrategy
    showSectionOnTitle: true,
    modalFullscreen: false
  }
</script>
```

### JavaScript
If you're using a builder like [ESBuild](https://esbuild.github.io/) as is the case with Hugo [JS Building](https://gohugo.io/hugo-pipes/js/) you can set it to import and bundle Fuse.js. The script will fetch the data asynchronously so you don't need to defer it's loading.

```html
<script src="/js/search.js" async></script>
```

Otherwise you will have to load both `Fuse.js` and `search.js` and  defer loading as to avoid referencing Fuse.js before it's loaded.

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
  "title": "Dolor Sit Amet"
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
