var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    config.progress = false;
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "done": function (e) {
      core.action.stop(e, true);
    },
    "hotkey": function (e) {
      if (e === "capture") {
        core.action.button();
      }
    },
    "stop": function (e, flag) {
      config.progress = false;
      app.button.icon(e.tabId, '');
      /*  */
      if (flag) {
        if (config.timeout.done) clearTimeout(config.timeout.inject);
        config.timeout.done = setTimeout(config.resolve, 300);
      }
    },
    "button": function () {
      if (config.screenshot.permission) {
        /* 
          When - Option D. Screenshot for all tabs - is activated from the options page
        */
        app.permissions.request({"origins": ["<all_urls>"]}, function (granted) {
          if (granted) {
            core.action.inject(0);
          }
        });
      } else {
        core.action.inject(1);
      }
    },
    "options": {
      "get": function (pref) {
        app.options.send("set", {
          "pref": pref,
          "value": config.get(pref)
        });
      },
      "set": function (o) {
        config.set(o.pref, o.value);
        /*  */
        app.options.send("set", {
          "pref": o.pref, 
          "value": config.get(o.pref)
        });
      }
    },
    "inject": function () {
      const parameters = config.screenshot.permission ? {} : {"active": true};
      /*  */
      app.tab.query.all(parameters, async function (tabs) {
        if (tabs && tabs.length) {
          for (let i = 0; i < tabs.length; i++) {
            if (tabs[i]) {
              await new Promise(resolve => {
                app.tab.inject.js({
                  "target": {"tabId": tabs[i].id}, 
                  "files": ["data/content_script/inject.js"]
                }, function (e) {
                  if (e) {
                    if (config.timeout.inject) clearTimeout(config.timeout.inject);
                    /*  */
                    if (config.progress) {
                      config.progress = false;
                      app.page.send("action", {"action": "finalize"}, tabs[i].id, null);
                    } else {
                      config.progress = true;
                      config.timeout.inject = setTimeout(function () {
                        app.page.send("action", {"action": "start"}, tabs[i].id, null);
                        config.resolve = resolve;
                      }, 300); 
                    }
                  } else {
                    resolve('');
                  }
                });
              });
            }
          }
        }
      }); 
    },
    "capture": function (e) {
      if (e.tabId) {
        app.tab.get(e.tabId, function (tab) {
          if (tab) {
            app.tab.update(tab.id, {"active": true}, function () {
              app.window.update(tab.windowId, {"focused": true}, async function () {
                app.button.icon(tab.id, config.progress ? "ON" : '');
                await new Promise(resolve => setTimeout(resolve, 300));
                app.button.icon(tab.id, config.progress ? "OFF" : '');
                /*  */
                if (config.progress) {
                  app.tab.capture(tab.windowId, {
                    "format": config.screenshot.format, 
                    "quality": config.screenshot.quality
                  }, function (dataURL) {
                    if (dataURL) {
                      app.page.post("action", {
                        "y": e.y,
                        "x": e.x,
                        "action": "draw",
                        "dataURL": dataURL,
                        "format": config.screenshot.format,
                        "delay": config.screenshot.delay < 500 ? 500 : config.screenshot.delay
                      }, tab.id, null);
                    }
                  });
                }
              });
            });
          }
        });
      }
    }
  }
};

app.page.receive("stop", core.action.stop);
app.page.receive("done", core.action.done);
app.page.receive("capture", core.action.capture);
app.options.receive("get", core.action.options.get);
app.options.receive("changed", core.action.options.set);

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
app.button.on.clicked(core.action.button);
app.hotkey.on.pressed(core.action.hotkey);
