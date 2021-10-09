import Search from 'lite-search'

Search({
  matchStrategy: "exact",
  includeMatches: true,
  debug: window.searchDebug ? true : false
})
