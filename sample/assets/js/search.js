import Search from 'lite-search'

Search({
  keys: [
    { name: "title", weight: 3 },
    { name: "description", weight: 2 },
    { name: "content", weight: 1 }
  ],
  matchStrategy: "exact",
  includeMatches: true,
  debug: window.searchDebug ? true : false
})
