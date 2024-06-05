var background = (function () {
  var tmp = {};
  /*  */
  chrome.runtime.onMessage.addListener(function (request) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-page") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "page-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  }
})();

var config = {
  "inject": function (e) {    
    if (e.active) {
      let script = document.createElement("script");
      /*  */
      script.setAttribute("type", "text/javascript");
      if (e.options) script.dataset.options = JSON.stringify(e.options);
      script.src = chrome.runtime.getURL("data/content_script/tweaks/" + e.target + ".js");
      /*  */
      document.documentElement.appendChild(script);
    }
  }
};

background.receive("font", config.inject);
background.receive("webgl", config.inject);
background.receive("canvas", config.inject);
background.receive("webrtc", config.inject);
background.receive("timezone", config.inject);
background.receive("geolocation", config.inject);
background.receive("audiocontext", config.inject);

background.send("load");