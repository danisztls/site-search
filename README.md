# Search
An instant search UI Web component aimed to be light, agnostic and effective.

[![Netlify Status](https://api.netlify.com/api/v1/badges/b569fb24-1b63-41d4-bec1-df533ecb262a/deploy-status)](https://app.netlify.com/sites/lite-search-example-f99854/deploys)

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
- accessibility *(please fill a report if it doesn't work properly with screen readers)*

## Caveats
- It does not support context-wise search at headings level as [DocSearch](https://docsearch.algolia.com/) does.
- Fuse.js is kind of dead.

## Demo
Check the [demo](https://lite-search-example-f99854.netlify.app/). It uses Hugo.

## Install
### NPM
```shell
npm install lite-search
```

```javascript
import Search from 'lite-search'

Search({...})
```

### Standalone 
If you can't or don't want to use NPM you can use the bundled (**lite-search** + **fuse.js**) standalone distributables at `dist/`.

*Note: this repository uses Git LFS and you need to have it installed in your environment to successfully clone it.*

```html
<script src="./lite-search/dist/search.js" async></script>
```

When the call and the script are enclosed together *(bundled)* they can be loaded asynchronously, otherwise you will have to defer the call until the script is loaded.

```html
<script src="./lite-search/dist/search.js" async></script>
<script defer>
  Search({...})
</script>
```

## Usage
### Data
It expects JSON data at `/index.json` but this can be changed with `dataPath` option.

Expected keys are `title`, `description`, `url`, `image` *(optional)* and `id` *(optional)*.

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

### JS
```javascript
Search({
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
  formSelector: "#search-form",
  modalSelector: "#search-modal",
  minInputLength: 0,
  matchStrategy: "fuzzy",
  maxResults: 10,
  maxContextLength: 250,
  includeMatches: false,  // NOTE: use 'exact' for matchStrategy
  showSectionOnTitle: true,
  modalFullscreen: false
})
```

### HTML
```html
<form id="search-form" role="search" aria-haspopup="listbox" aria-labelledby="search-label" hidden="true">
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
