{
  let script = document.currentScript;
  let options = JSON.parse(script.dataset.options);
  
  if (navigator) {
    if (navigator.geolocation) {
      if (navigator.geolocation.__proto__) {
        const getCurrentPosition = navigator.geolocation.__proto__.getCurrentPosition;
        Object.defineProperty(navigator.geolocation.__proto__, "getCurrentPosition", {
          "value": function (success) {
            const OLD = success;
            success = function (position) {
              if ("coords" in position) {
                if (options.coords.latitude) Object.defineProperty(position.coords, 'latitude', {"value": Number(options.coords.latitude)});
                if (options.coords.longitude) Object.defineProperty(position.coords, 'longitude', {"value": Number(options.coords.longitude)});
              }
              OLD.apply(this, arguments);
            };
            //
            return getCurrentPosition.apply(this, arguments);
          }
        });
        document.documentElement.dataset.geolocscriptallow = true;
      }
    }
  }
}