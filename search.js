/**
 * @name     liteSearch
 * @desc     Light and agnostic search UI powered by Fuse.js
 * @author   Daniel Souza <me@posix.dev.br>
 * @version  2.1
 * @license  MIT
 */

// Fix for preserving doc header as Fuse.js does not follow JSDOC
// Issue: https://github.com/krisk/Fuse/issues/570

/*!
 * Fuse.js v6.4.6 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2021 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import Fuse from 'fuse/fuse.esm.js'

// otherwise
// <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.4.6" defer></script>
//
(() => {
  const UIOpts = {
    dataPath: "/index.json",
    // dataPath: "/" + basePath + lang + "/index.json",  // for multilingual 
    formSelector: "#search",
    minInputLength: 0,
    matchStrategy: "fuzzy",
    maxResults: 10,
    maxContextLength: 250,
  }

  // check https://fusejs.io/api/options.html
  let fuseOpts = {
    keys: [
      { name: "name", weight: 7 },
      { name: "url", weight: 5 },
      { name: "categories", weight: 3 },
      { name: "tags", weight: 3 },
      { name: "description", weight: 1 }
    ],
    location: 0,
    distance: 0,
    ignoreLocation: true,
    ignoreFieldnorm: true,
    includeMatches: true,
    minMatchCharLength: 0,
  }

  const matchStrategy = UIOpts.matchStrategy ? UIOpts.matchStrategy : "fuzzy"

  switch(matchStrategy) {
    case ("exact"):
      fuseOpts = Object.assign(fuseOpts, {
        threshold: 0,
        useExtendedSearch: true,
        findAllMatches: true
      })
      break

    case ("fuzzy"):
      fuseOpts = Object.assign(fuseOpts, {
        threshold: 0.3,
        useExtendedSearch: false,
        findAllMatches: false
      })
      break
  }

  let fuse = null
  fetchData()
    .then(data => {
      fuse = new Fuse(data, fuseOpts)
      window.addEventListener("load", initUI(), { passive: true })
    })
    .catch(console.error)

  /** Fetch data from a JSON endpoint
   *  @return {Object} - data for Fuse()
   */
  async function fetchData() {
    // eslint-disable-next-line
    const url = UIOpts.dataPath ? UIOpts.dataPath : "/index.json"
    const request = new Request(url, {method: 'GET', cache: 'default'})

    return fetch(request)
      .then(response => {
         if (!response.ok) {
           throw new Error("HTTP error " + response.status)
         }
         return response.json()
      })
  }

  /** Initialize the user interface */
  function initUI() {
    const formSelector = UIOpts.formSelector ? UIOpts.formSelector : "#search"
    const formEl = document.querySelector(formSelector)
    const inputEl = formEl.querySelector("input")
    const modalEl = formEl.querySelector("ul")

    class Modal {
      constructor(element) {
        this.element = element
      }

      show() {
        if (this.element.hidden == true)
          this.element.hidden = false
          this.element.style.visibility = "visible"
      }

      hide() {
        if (this.element.hidden == false)
          this.element.hidden = true
          this.element.style.visibility = "hidden"
      }

      isHidden() {
        return this.element.hidden
      }
    }

    const modal = new Modal(modalEl)
    initUIListeners()

    /** Call Fuse and return results
     *  @param {string} input - value from input box
     *  @return {object} - results generated by Fuse()
     */
    function parseResults(input) {
      /*
       * Fuse returns an array of objects where each item is a document matched.
       * Each item has an array of matches which are also objects.
       * Those contain the 'indices' (start, end), the key matched and it's value.
       */

      const queryTemplate = (() => { 
        switch(matchStrategy) {
          case "fuzzy":
            return input

          case "exact":
            return `\'"${input}"`
        }
      })()  // assign return of anonymous function to var

      const minInputLength = UIOpts.minInputLength ? UIOpts.minInputLength : 0
      return (input.length > minInputLength) ? fuse.search(queryTemplate) : null
    }

    /** Build and inject a HTML bucket with the parsed results
     *  @param {string} input - value from input box
     *  @param {array|null} results or null signal
     */
    function parseHTML(input, results) {
      // TODO: Some procedures should be on parseResults instead like getMatch() and captureContext()
      
      const maxResults = UIOpts.maxResults ? UIOpts.maxResults : 10

      let bucket = ""

      if (results === null) {
        bucket = `<li class="warning">Type more to search.</li>`

      } else if (results.length === 0) {
        bucket = `<li class="warning">No results found.</li>`

      } else if (results.length > 0) {
        results.slice(0, maxResults).forEach((result, index) => {
         
          // TODO: Rewrite matches to use options.
          
          // 1. Get results key-values.

          /**
           * 'title' and 'content' are initially the page title and content
           * but they can be transformed and at end are the title and content
           * of the search result.
           */

          let title = result.item.name
          let content = result.item.description

          // TODO: Rewrite keys to use options.
          // TODO: Make documentation the default

          // 2.1. Get matches (optional)
          // const titleMatch = getMatch(result.matches, "title")
          // const contentMatch = getMatch(result.matches, "content")
          
          /** Get the 1st match of a key
           *  @param {array} items - result matches generated by Fuse()
           *  @param {string} key - match type (e.g. "title")
           *  @return {object|null} - match or a no match signal 
           */
          function getMatch(items, key) {
            let match = null
            items.some((item) => {
              if (item.key === key ) {
                match = item
                return true
              }
            })
            return match
          }

          // 2. Use matches
          // TODO: Move all the optional code that use matches to a new function
          // 2.2. Capture context of matches (optional)
          // TODO: Rewrite capturing context to use options.

          // capture the context of the 1st content match
          // if (contentMatch != null) {
          //   content = captureContext(contentMatch, 0)

          // } else {
          //   content = result.item.description
          // }

          /** Capture context of a match
           *  @param {object} match - match containing term match indices
           *  @param {int} index - index of the match on the matches array
           *  @return {string} - context extracted from match value
           */
          function captureContext(match, index) {
            let [first, last] = match.indices[index]  // capture the indexes of the first match

            const maxContextLength = UIOpts.maxContextLength ? UIOpts.maxContextLength : 250

            const valueLength = match.value.length
            const captureLength = maxContextLength - last + first

            first = first - captureLength / 2
            if (first < 0)
              first = 0

            last = last + captureLength / 2
            if (last > valueLength - 1)
              last = valueLength - 1

            return `...${match.value.slice(first, last)}...`
          }

          // 2.3. Highlight matches
          /** Highlight matches w/ RegExp
           *  @param {string} text
           *  @param {object} re - regular expression literal 
           *  @return {string}
           */
          function hlMatch(text, re) {
            return text
              .replace(re, '<mark>$&</mark>')

            /*
             * Could use the matches indexes to highlight but RegExp is doing the
             * job without problems and the change requires updating indexes when
             * capturing match context.
             */
          }

          const re = new RegExp(input, 'ig')  // i parameter to 'ignore' case sensitive
          title = hlMatch(title, re)
          content = hlMatch(content, re)
          
          // add separator between section and title
          // title = title
          //   .replace(/(.*)\|(.*)/, '<span class="section">$1</span><span class="separator">|</span><span class="title">$2</span>')

          // 3. Build bucket
          bucket += `
            <li role="option" aria-selected="false">
              <a
                value="${result.item.id}"
                href="${result.item.url}"
                tabindex="${index}"
              >
                <img src="${result.item.image}">
                <div class="meta">
                  <p>${title}</p>
                  <p>${content}</p>
                </div>
              </a>
            </li>
          `
        })
      }
      
      modalEl.innerHTML = bucket
    }

    /** Init persistent user interaction listeners */
    function initUIListeners() { 
      inputEl.addEventListener("input",  instantSearch)
      inputEl.addEventListener("search", clearSearch)  // click 'x' to clear
      inputEl.addEventListener("click",  showModal)
      inputEl.addEventListener("keydown", inputKeyBinds)

      document.addEventListener("click", (event) => {
        if (event.path[0] != inputEl) {  // toggle UI if click outside input
          toggleUI()
        }
      }, {passive: true})

      document.addEventListener("keydown", (event) => {
        if (event.key == "/") {  // global shortcut
          // do not trigger on inputs except search input
          if (event.srcElement.nodeName != "INPUT" || event.path[0] == inputEl) {
            event.preventDefault()
            toggleUI()
          }
        }
      })
    }

    /** Update search results as user types
     *  @param {object} event - keydown event 
     */
    function instantSearch(event) {
      const input = inputEl.value
      parseHTML(input, parseResults(input))
      if (modal.isHidden())
        showModal()
    }

    // TODO: Extend 'Modal' class to reduce spaghetti code.

    function showModal() {
      if (inputEl.value != "") {  // don't open modal before typing 
        modal.show()
        initModalListeners()
        document.body.style.overflow = "hidden"  // prevent page scroll when modal is open
      }
    }

    function closeModal() {
      modal.hide()
      removeModalListeners()
      document.body.style.overflow = "unset"
    }

    function clearInput() {
      modalEl.innerHTML = "" 
      inputEl.value = ""
    }

    function clearSearch() {
      clearInput()
      closeModal()
    }

    /** Hide/show input and modal visibility only. */
    function toggleUI() {
      if (inputEl.ariaExpanded) {
        closeModal()
        inputEl.ariaExpanded = false

      } else {
        inputEl.focus()

        if (inputEl.value != "") {
          showModal()
          inputEl.ariaExpanded = true
        }
      }
    }

    /** Init ephemeral user interaction listeners */
    function initModalListeners() {
      modalEl.addEventListener("keydown", modalKeyBinds)
    }

    function removeModalListeners() {
      modalEl.removeEventListener("keydown", modalKeyBinds)
    }

    /**
     * @param {object} event - keydown event
     */
    function inputKeyBinds(event) {
      switch (event.key) {
        case "Escape":
          event.preventDefault()
          clearSearch()
          toggleUI()
          break

        case "ArrowDown":
        case "Enter":
          event.preventDefault()
          scrollElement("first")
          formEl.blur()
          break
      }
    }

    /**
     *  @param {object} event - keydown event 
     */
    function modalKeyBinds(event) {
      event.preventDefault()
      const item = event.path[1]

      switch (event.key) {
        case "Escape":
          clearSearch()
          inputEl.focus()
          break

        case "Backspace":
        case "Delete":
          scrollElement("input", item)
          break

        case "ArrowUp":
          scrollElement("up", item)
          break

        case "ArrowDown":
          scrollElement("down", item)
          break

        // TODO: Use local storage to preserve search state when opening item.
        case "Enter":
          const url = item.querySelector("a").href 
          if (url) 
            location.href = url 
      }
    }

    /**
     *  @param {string} direction 
     *  @param {object} [item] - DOM element 
     */
    function scrollElement(direction, item) {
      let target = null

      switch (direction) {
        case "first":
          target = modalEl.firstElementChild
          break

        case "up":
          if (item.previousElementSibling) {
            target = item.previousElementSibling
          } else {
            scrollElement("input", item)
          }
          break

        case "down":
          if (item.nextElementSibling)
            target = item.nextElementSibling
          break

        case "input":
          inputEl.focus()
          item.ariaSelected = false
      }
     
      if (target != null) {
        target.querySelector("a").focus()
        target.ariaSelected = true
        
        if (item)
          item.ariaSelected = false
      }
    }
  }
})()
