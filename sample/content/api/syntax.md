---
title: Syntax
description: Basic API Syntax.
weight: 10
menu:
  docs:
    parent: "api"
---

Those are the default options.

```javascript
import Search from 'lite-search'

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
  formSelector: "#search",
  minInputLength: 0,
  matchStrategy: "fuzzy",
  maxResults: 10,
  maxContextLength: 250,
  includeMatches: false,  // NOTE: use 'exact' for matchStrategy
  showSectionOnTitle: true,
  modalFullscreen: false
})
```
