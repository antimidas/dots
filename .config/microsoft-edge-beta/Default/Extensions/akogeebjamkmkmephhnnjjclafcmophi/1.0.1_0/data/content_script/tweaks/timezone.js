{
  let script = document.currentScript;
  let options = JSON.parse(script.dataset.options);
  
  const GMT = function (n) {
    const _format = function (v) {return (v < 10 ? '0' : '') + v};
    return (n <= 0 ? '+' : '-') + _format(Math.abs(n) / 60 | 0) + _format(Math.abs(n) % 60);
  };

  const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
  
  const {
    getDay, 
    getDate, 
    getYear, 
    getMonth, 
    getHours, 
    toString, 
    getMinutes, 
    getSeconds, 
    getFullYear, 
    toLocaleString, 
    getMilliseconds, 
    getTimezoneOffset, 
    toLocaleTimeString, 
    toLocaleDateString
  } = Date.prototype;

  Object.defineProperty(Date.prototype, '_offset', {"configurable": true, get() {return getTimezoneOffset.call(this)}});
  Object.defineProperty(Date.prototype, '_date', {"configurable": true, get() {return this._nd === undefined ? new Date(this.getTime() + (this._offset - options.value) * 60 * 1000) : this._nd}});

  Object.defineProperty(Date.prototype, 'getDay', {"value": function () {return getDay.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getDate', {"value": function () {return getDate.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getYear', {"value": function () {return getYear.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getMonth', {"value": function () {return getMonth.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getHours', {"value": function () {return getHours.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getMinutes', {"value": function () {return getMinutes.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getSeconds', {"value": function () {return getSeconds.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getTimezoneOffset', {"value": function () {return Number(options.value)}});
  Object.defineProperty(Date.prototype, 'getFullYear', {"value": function () {return getFullYear.call(this._date)}});
  Object.defineProperty(Date.prototype, 'toLocaleString', {"value": function () {return toLocaleString.call(this._date)}});
  Object.defineProperty(Date.prototype, 'getMilliseconds', {"value": function () {return getMilliseconds.call(this._date)}});
  Object.defineProperty(Date.prototype, 'toLocaleTimeString', {"value": function () {return toLocaleTimeString.call(this._date)}});
  Object.defineProperty(Date.prototype, 'toLocaleDateString', {"value": function () {return toLocaleDateString.call(this._date)}});
  Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {"value": function () {return Object.assign(resolvedOptions, {"timeZone": options.name})}});
  Object.defineProperty(Date.prototype, 'toString', {"value": function () {return toString.call(this._date).replace(GMT(this._offset), GMT(options.value)).replace(/\(.*\)/, '(' + options.name.replace(/\//g, ' ') + ' Standard Time)')}});
}