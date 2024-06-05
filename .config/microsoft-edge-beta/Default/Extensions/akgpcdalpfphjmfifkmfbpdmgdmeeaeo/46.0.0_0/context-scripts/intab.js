//@ts-check
//@ts-ignore - alreadyRun not exists on type window
if (!window.alreadyRun) {
  var $window = $(window)

  //@ts-ignore - alreadyRun not exists on type window
  window.alreadyRun = true

  var scrollLeft = 0
  var scrollTop = 0
  var currentX = 0
  var currentY = 0
  var elm = null
  var fixedTopElements = []
  var fixedBottomElements = []

  function scrollToCurrent() {
    if (currentX != 0 || currentY != 0) {
      preparePage("before")
    }
    $(window).scrollTop(currentY)
    $(window).scrollLeft(currentX)
  }

  function saveScrollPos() {
    scrollLeft = $(window).scrollLeft()
    scrollTop = $(window).scrollTop()
  }

  function restoreScrollPos() {
    currentX = scrollLeft
    currentY = scrollTop
    scrollToCurrent()
  }

  function preparePage(inZman) {
    if (document.location.hostname == "www.f" + "ace" + "book.com") {
      if (!elm) {
        elm = $("div#pagelet_sidebar")
          .add(".uiContextualDialogPositioner")
          .add(".fbFlyoutDialog")
          .add("div#pagelet_bluebar")
          .add("div#pagelet_dock")
          .add("div#pagelet_channel")
          .add("div#rightCol")
        if (inZman == "before") elm.data("prepareHide", true).hide()
      }
      if (inZman == "after") {
        elm.data("prepareHide", null).show()
        elm = null
      }
    }
  }

  function enableScrollbar(enableFlag) {
    if (enableFlag) {
      try {
        //don't hide&show scrollbars when user select region
        if (hideTheScrollBars) {
          restoreElementStyle(document.body, ["overflow-x", "overflow-y"])
        }
      } catch (e) {}
    } else {
      try {
        exchangeElementStyle(
          document.body,
          ["overflow-x", "overflow-y"],
          "hidden",
        )
        hideTheScrollBars = true
      } catch (e) {}
    }
  }
  function fixedElementCheck() {
    //Hide fixed element
    //Add there visibility to custom tag
    if (
      document.defaultView.getComputedStyle(document.body)[
        "background-attachment"
      ] == "fixed"
    ) {
      exchangeElementStyle(document.body, ["background-attachment"], "initial")
    }

    var nodeIterator = document.createNodeIterator(
      document.documentElement,
      NodeFilter.SHOW_ELEMENT,
      null,
      //@ts-ignore - expected 1-3 recieved 4
      false,
    )
    var currentNode
    var windowHeight = $window.height()
    while ((currentNode = nodeIterator.nextNode())) {
      //@ts-ignore - node is not assigned to element
      var nodeComputedStyle = document.defaultView.getComputedStyle(
        currentNode,
        "",
      )
      // Skip nodes which don't have computeStyle or are invisible.
      if (!nodeComputedStyle) {
        return
      }
      var nodePosition = nodeComputedStyle.getPropertyValue("position")
      if (nodePosition == "fixed" || nodePosition == "sticky") {
        if ($(currentNode).position().top < windowHeight / 2) {
          //show on Top
          if (fixedTopElements.indexOf(currentNode) < 0) {
            fixedTopElements.push(currentNode)
          }
          if (document.body.scrollHeight < windowHeight * 2) {
            exchangeElementStyle(currentNode, ["position"], "absolute")
          }
        } else {
          //show on bottom
          if (fixedBottomElements.indexOf(currentNode) < 0) {
            fixedBottomElements.push(currentNode)
          }
        }
      }
    }
  }
  function fixedElementRestore() {
    fixedTopElements.forEach(function(element) {
      restoreElementStyle(element, ["display", "position"])
    })
    fixedBottomElements.forEach(function(element) {
      restoreElementStyle(element, ["display", "position"])
    })
    restoreElementStyle(document.body, ["background-attachment"])
    fixedTopElements.length = 0
    fixedBottomElements.length = 0
  }
  function hideFixedElement(inPosition) {
    var elements
    if (inPosition == "top") {
      elements = fixedTopElements
    } else {
      elements = fixedBottomElements
    }
    elements.forEach(function(element) {
      exchangeElementStyle(element, ["display"], "none")
    })
  }
  function showFixedElement(inPosition /* =top/bottom */) {
    var elements
    if (inPosition == "top") {
      elements = fixedTopElements
    } else {
      elements = fixedBottomElements
    }
    elements.forEach(function(element) {
      restoreElementStyle(element, ["display"])
    })
  }

  function checkPageIsOnlyEmbedElement() {
    var bodyNode = document.body.children
    var isOnlyEmbed = false
    for (var i = 0; i < bodyNode.length; i++) {
      var tagName = bodyNode[i].tagName
      if (
        tagName == "OBJECT" ||
        tagName == "EMBED" ||
        tagName == "VIDEO" ||
        tagName == "SCRIPT"
      ) {
        isOnlyEmbed = true
        //@ts-ignore - style not exist on element
      } else if (bodyNode[i].style.display != "none") {
        isOnlyEmbed = false
        break
      }
    }
    return isOnlyEmbed
  }

  function hideSomeStrangeElements() {
    try {
      document.getElementById("presence").style.display = "none"
      window.setTimeout(() => {
        document.getElementById("presence").style.display = ""
      }, 10000)
    } catch (e) {}
    try {
      document.getElementById("navi-bar").style.display = "none"
      window.setTimeout(() => {
        document.getElementById("navi-bar").style.display = ""
      }, 10000)
    } catch (e) {}
  }

  function get_description() {
    for (var i = 0; i < document.getElementsByTagName("meta").length; i++) {
      var a = document.getElementsByTagName("meta")[i]
      if (
        a.getAttribute("name") &&
        a.getAttribute("name").toLowerCase() == "description"
      )
        return a.getAttribute("content")
    }
  }

  function restoreElementStyle(element, styles) {
    if (!Array.isArray(styles)) {
      styles = [styles]
    }
    styles.forEach(function(style) {
      if (element.hasOwnProperty("style_" + style)) {
        element.style.removeProperty(style) // does not work with shorthand properties (background -> background-attachment)
        //element.style.setProperty(style, '', 'important');
        element.style.setProperty(
          style,
          element["style_" + style],
          element["style_" + style + "_priority"],
        )
      }
    })
  }
}

function exchangeElementStyle(element, styles, value) {
  if (!Array.isArray(styles)) {
    styles = [styles]
  }
  styles.forEach(function(style) {
    if (!element.hasOwnProperty("style_" + style)) {
      element["style_" + style] = element.style.getPropertyValue(style) || null
      element["style_" + style + "_priority"] =
        element.style.getPropertyPriority(style) || null
    }
    element.style.setProperty(style, value, "important")
  })
}
