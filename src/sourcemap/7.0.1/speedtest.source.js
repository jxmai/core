// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ┌────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.5.4 - JavaScript Events Library                      │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
// └────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.5.4",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
        firstDefined = function () {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        lastDefined = function () {
            var i = this.length;
            while (--i) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        objtos = Object.prototype.toString,
        Str = String,
        isArray = Array.isArray || function (ar) {
            return ar instanceof Array || objtos.call(ar) == "[object Array]";
        },
    /*\
     * eve
     [ method ]

     * Fires event with given `name`, given scope and other parameters.

     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers

     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
        eve = function (name, scope) {
            var oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event;
            out.firstDefined = firstDefined;
            out.lastDefined = lastDefined;
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out;
        };
    // Undocumented. Debug only.
    eve._events = events;
    /*\
     * eve.listeners
     [ method ]

     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

     - name (string) name of the event, dot (`.`) or slash (`/`) separated

     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = isArray(name) ? name : name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.separator
     [ method ]

     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.

     - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
    eve.separator = function (sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else {
            separator = /[\.\/]/;
        }
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        if (typeof f != "function") {
            return function () {};
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = isArray(name) ? name : Str(name).split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                    exist = true;
                    break;
                }
                !exist && e.f.push(f);
            }(names[i]));
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        }
        return cur;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = {n: {}};
            return;
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events],
            inodes = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                        inodes.unshift({
                            n: e,
                            name: names[i]
                        });
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                        inodes.unshift({
                            n: e,
                            name: key
                        });
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
            e = inodes[i];
            for (key in e.n[e.name].f) {
                // not empty (has listeners)
                continue prune;
            }
            for (key in e.n[e.name].n) {
                // not empty (has children)
                continue prune;
            }
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function () {
            eve.off(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    glob.eve = eve;
    typeof module != "undefined" && module.exports ? module.exports = eve : typeof define === "function" && define.amd ? define("eve", [], function () { return eve; }) : glob.eve = eve;
})(typeof window != "undefined" ? window : this);;/**
 * JustGage - animated gauges using RaphaelJS
 * Check http://www.justgage.com for official releases
 * Licensed under MIT.
 * @author Bojan Djuricic (@Toorshia)
 **/

JustGage = function(config) {

  var obj = this;

  // Helps in case developer wants to debug it. unobtrusive
  if (config === null || config === undefined) {
    console.log('* justgage: Make sure to pass options to the constructor!');
    return false;
  }

  var node;

  if (config.id !== null && config.id !== undefined) {
    node = document.getElementById(config.id);
    if (!node) {
      console.log('* justgage: No element with id : %s found', config.id);
      return false;
    }
  } else if (config.parentNode !== null && config.parentNode !== undefined) {
    node = config.parentNode;
  } else {
    console.log('* justgage: Make sure to pass the existing element id or parentNode to the constructor.');
    return false;
  }

  var dataset = node.dataset ? node.dataset : {};

  // check for defaults
  var defaults = (config.defaults !== null && config.defaults !== undefined) ? config.defaults : false;
  if (defaults !== false) {
    config = extend({}, config, defaults);
    delete config.defaults;
  }

  // configurable parameters
  obj.config = {
    // id : string
    // this is container element id
    id: config.id,

    // value : float
    // value gauge is showing
    value: kvLookup('value', config, dataset, 0, 'float'),

    // defaults : bool
    // defaults parameter to use
    defaults: kvLookup('defaults', config, dataset, 0, false),

    // parentNode : node object
    // this is container element
    parentNode: kvLookup('parentNode', config, dataset, null),

    // width : int
    // gauge width
    width: kvLookup('width', config, dataset, null),

    // height : int
    // gauge height
    height: kvLookup('height', config, dataset, null),

    // title : string
    // gauge title
    title: kvLookup('title', config, dataset, ""),

    // titleFontColor : string
    // color of gauge title
    titleFontColor: kvLookup('titleFontColor', config, dataset, "#999999"),

    // titleFontFamily : string
    // color of gauge title
    titleFontFamily: kvLookup('titleFontFamily', config, dataset, "sans-serif"),

    // titlePosition : string
    // 'above' or 'below'
    titlePosition: kvLookup('titlePosition', config, dataset, "above"),

    // valueFontColor : string
    // color of label showing current value
    valueFontColor: kvLookup('valueFontColor', config, dataset, "#010101"),

    // valueFontFamily : string
    // color of label showing current value
    valueFontFamily: kvLookup('valueFontFamily', config, dataset, "Arial"),

    // symbol : string
    // special symbol to show next to value
    symbol: kvLookup('symbol', config, dataset, ''),

    // min : float
    // min value
    min: kvLookup('min', config, dataset, 0, 'float'),

    // max : float
    // max value
    max: kvLookup('max', config, dataset, 100, 'float'),

    // reverse : bool
    // reverse min and max
    reverse: kvLookup('reverse', config, dataset, false),

    // humanFriendlyDecimal : int
    // number of decimal places for our human friendly number to contain
    humanFriendlyDecimal: kvLookup('humanFriendlyDecimal', config, dataset, 0),


    // textRenderer: func
    // function applied before rendering text
    textRenderer: kvLookup('textRenderer', config, dataset, null),

    // gaugeWidthScale : float
    // width of the gauge element
    gaugeWidthScale: kvLookup('gaugeWidthScale', config, dataset, 1.0),

    // gaugeColor : string
    // background color of gauge element
    gaugeColor: kvLookup('gaugeColor', config, dataset, "#edebeb"),

    // label : string
    // text to show below value
    label: kvLookup('label', config, dataset, ''),

    // labelFontColor : string
    // color of label showing label under value
    labelFontColor: kvLookup('labelFontColor', config, dataset, "#b3b3b3"),

    // shadowOpacity : int
    // 0 ~ 1
    shadowOpacity: kvLookup('shadowOpacity', config, dataset, 0.2),

    // shadowSize: int
    // inner shadow size
    shadowSize: kvLookup('shadowSize', config, dataset, 5),

    // shadowVerticalOffset : int
    // how much shadow is offset from top
    shadowVerticalOffset: kvLookup('shadowVerticalOffset', config, dataset, 3),

    // levelColors : string[]
    // colors of indicator, from lower to upper, in RGB format
    levelColors: kvLookup('levelColors', config, dataset, ["#a9d70b", "#f9c802", "#ff0000"], 'array', ','),

    // startAnimationTime : int
    // length of initial animation
    startAnimationTime: kvLookup('startAnimationTime', config, dataset, 700),

    // startAnimationType : string
    // type of initial animation (linear, >, <,  <>, bounce)
    startAnimationType: kvLookup('startAnimationType', config, dataset, '>'),

    // refreshAnimationTime : int
    // length of refresh animation
    refreshAnimationTime: kvLookup('refreshAnimationTime', config, dataset, 700),

    // refreshAnimationType : string
    // type of refresh animation (linear, >, <,  <>, bounce)
    refreshAnimationType: kvLookup('refreshAnimationType', config, dataset, '>'),

    // donutStartAngle : int
    // angle to start from when in donut mode
    donutStartAngle: kvLookup('donutStartAngle', config, dataset, 90),

    // valueMinFontSize : int
    // absolute minimum font size for the value
    valueMinFontSize: kvLookup('valueMinFontSize', config, dataset, 16),

    // titleMinFontSize
    // absolute minimum font size for the title
    titleMinFontSize: kvLookup('titleMinFontSize', config, dataset, 10),

    // labelMinFontSize
    // absolute minimum font size for the label
    labelMinFontSize: kvLookup('labelMinFontSize', config, dataset, 10),

    // minLabelMinFontSize
    // absolute minimum font size for the minimum label
    minLabelMinFontSize: kvLookup('minLabelMinFontSize', config, dataset, 10),

    // maxLabelMinFontSize
    // absolute minimum font size for the maximum label
    maxLabelMinFontSize: kvLookup('maxLabelMinFontSize', config, dataset, 10),

    // hideValue : bool
    // hide value text
    hideValue: kvLookup('hideValue', config, dataset, false),

    // hideMinMax : bool
    // hide min and max values
    hideMinMax: kvLookup('hideMinMax', config, dataset, false),

    // hideInnerShadow : bool
    // hide inner shadow
    hideInnerShadow: kvLookup('hideInnerShadow', config, dataset, false),

    // humanFriendly : bool
    // convert large numbers for min, max, value to human friendly (e.g. 1234567 -> 1.23M)
    humanFriendly: kvLookup('humanFriendly', config, dataset, false),

    // noGradient : bool
    // whether to use gradual color change for value, or sector-based
    noGradient: kvLookup('noGradient', config, dataset, false),

    // donut : bool
    // show full donut gauge
    donut: kvLookup('donut', config, dataset, false),

    // relativeGaugeSize : bool
    // whether gauge size should follow changes in container element size
    relativeGaugeSize: kvLookup('relativeGaugeSize', config, dataset, false),

    // counter : bool
    // animate level number change
    counter: kvLookup('counter', config, dataset, false),

    // decimals : int
    // number of digits after floating point
    decimals: kvLookup('decimals', config, dataset, 0),

    // customSectors : [] of objects
    // number of digits after floating point
    customSectors: kvLookup('customSectors', config, dataset, []),

    // formatNumber: boolean
    // formats numbers with commas where appropriate
    formatNumber: kvLookup('formatNumber', config, dataset, false),

    // pointer : bool
    // show value pointer
    pointer: kvLookup('pointer', config, dataset, false),

    // pointerOptions : object
    // define pointer look
    pointerOptions: kvLookup('pointerOptions', config, dataset, [])
  };

  // variables
  var
    canvasW,
    canvasH,
    widgetW,
    widgetH,
    aspect,
    dx,
    dy,
    titleFontSize,
    titleX,
    titleY,
    valueFontSize,
    valueX,
    valueY,
    labelFontSize,
    labelX,
    labelY,
    minFontSize,
    minX,
    minY,
    maxFontSize,
    maxX,
    maxY;

  // overflow values
  if (obj.config.value > obj.config.max) obj.config.value = obj.config.max;
  if (obj.config.value < obj.config.min) obj.config.value = obj.config.min;
  obj.originalValue = kvLookup('value', config, dataset, -1, 'float');

  // create canvas
  if (obj.config.id !== null && (document.getElementById(obj.config.id)) !== null) {
    obj.canvas = Raphael(obj.config.id, "100%", "100%");
  } else if (obj.config.parentNode !== null) {
    obj.canvas = Raphael(obj.config.parentNode, "100%", "100%");
  }

  if (obj.config.relativeGaugeSize === true) {
    obj.canvas.setViewBox(0, 0, 200, 150, true);
  }

  // canvas dimensions
  if (obj.config.relativeGaugeSize === true) {
    canvasW = 200;
    canvasH = 150;
  } else if (obj.config.width !== null && obj.config.height !== null) {
    canvasW = obj.config.width;
    canvasH = obj.config.height;
  } else if (obj.config.parentNode !== null) {
    obj.canvas.setViewBox(0, 0, 200, 150, true);
    canvasW = 200;
    canvasH = 150;
  } else {
    canvasW = getStyle(document.getElementById(obj.config.id), "width").slice(0, -2) * 1;
    canvasH = getStyle(document.getElementById(obj.config.id), "height").slice(0, -2) * 1;
  }

  // widget dimensions
  if (obj.config.donut === true) {

    // DONUT *******************************

    // width more than height
    if (canvasW > canvasH) {
      widgetH = canvasH;
      widgetW = widgetH;
      // width less than height
    } else if (canvasW < canvasH) {
      widgetW = canvasW;
      widgetH = widgetW;
      // if height don't fit, rescale both
      if (widgetH > canvasH) {
        aspect = widgetH / canvasH;
        widgetH = widgetH / aspect;
        widgetW = widgetH / aspect;
      }
      // equal
    } else {
      widgetW = canvasW;
      widgetH = widgetW;
    }

    // delta
    dx = (canvasW - widgetW) / 2;
    dy = (canvasH - widgetH) / 2;

    // title
    titleFontSize = ((widgetH / 8) > 10) ? (widgetH / 10) : 10;
    titleX = dx + widgetW / 2;
    titleY = dy + widgetH / 11;

    // value
    valueFontSize = ((widgetH / 6.4) > 16) ? (widgetH / 5.4) : 18;
    valueX = dx + widgetW / 2;
    if (obj.config.label !== '') {
      valueY = dy + widgetH / 1.85;
    } else {
      valueY = dy + widgetH / 1.7;
    }

    // label
    labelFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    labelX = dx + widgetW / 2;
    labelY = valueY + labelFontSize;

    // min
    minFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    minX = dx + (widgetW / 10) + (widgetW / 6.666666666666667 * obj.config.gaugeWidthScale) / 2;
    minY = labelY;

    // max
    maxFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    maxX = dx + widgetW - (widgetW / 10) - (widgetW / 6.666666666666667 * obj.config.gaugeWidthScale) / 2;
    maxY = labelY;

  } else {
    // HALF *******************************

    // width more than height
    if (canvasW > canvasH) {
      widgetH = canvasH;
      widgetW = widgetH * 1.25;
      //if width doesn't fit, rescale both
      if (widgetW > canvasW) {
        aspect = widgetW / canvasW;
        widgetW = widgetW / aspect;
        widgetH = widgetH / aspect;
      }
      // width less than height
    } else if (canvasW < canvasH) {
      widgetW = canvasW;
      widgetH = widgetW / 1.25;
      // if height don't fit, rescale both
      if (widgetH > canvasH) {
        aspect = widgetH / canvasH;
        widgetH = widgetH / aspect;
        widgetW = widgetH / aspect;
      }
      // equal
    } else {
      widgetW = canvasW;
      widgetH = widgetW * 0.75;
    }

    // delta
    dx = (canvasW - widgetW) / 2;
    dy = (canvasH - widgetH) / 2;
    if (obj.config.titlePosition === 'below') {
      // shift whole thing down
      dy -= (widgetH / 6.4);
    }

    // title
    titleFontSize = ((widgetH / 8) > obj.config.titleMinFontSize) ? (widgetH / 10) : obj.config.titleMinFontSize;
    titleX = dx + widgetW / 2;
    titleY = dy + (obj.config.titlePosition === 'below' ? (widgetH * 1.07) : (widgetH / 6.4));

    // value
    valueFontSize = ((widgetH / 6.5) > obj.config.valueMinFontSize) ? (widgetH / 6.5) : obj.config.valueMinFontSize;
    valueX = dx + widgetW / 2;
    valueY = dy + widgetH / 1.275;

    // label
    labelFontSize = ((widgetH / 16) > obj.config.labelMinFontSize) ? (widgetH / 16) : obj.config.labelMinFontSize;
    labelX = dx + widgetW / 2;
    labelY = valueY + valueFontSize / 2 + 5;

    // min
    minFontSize = ((widgetH / 16) > obj.config.minLabelMinFontSize) ? (widgetH / 16) : obj.config.minLabelMinFontSize;
    minX = dx + (widgetW / 10) + (widgetW / 6.666666666666667 * obj.config.gaugeWidthScale) / 2;
    minY = labelY;

    // max
    maxFontSize = ((widgetH / 16) > obj.config.maxLabelMinFontSize) ? (widgetH / 16) : obj.config.maxLabelMinFontSize;
    maxX = dx + widgetW - (widgetW / 10) - (widgetW / 6.666666666666667 * obj.config.gaugeWidthScale) / 2;
    maxY = labelY;
  }

  // parameters
  obj.params = {
    canvasW: canvasW,
    canvasH: canvasH,
    widgetW: widgetW,
    widgetH: widgetH,
    dx: dx,
    dy: dy,
    titleFontSize: titleFontSize,
    titleX: titleX,
    titleY: titleY,
    valueFontSize: valueFontSize,
    valueX: valueX,
    valueY: valueY,
    labelFontSize: labelFontSize,
    labelX: labelX,
    labelY: labelY,
    minFontSize: minFontSize,
    minX: minX,
    minY: minY,
    maxFontSize: maxFontSize,
    maxX: maxX,
    maxY: maxY
  };

  // var clear
  canvasW, canvasH, widgetW, widgetH, aspect, dx, dy, titleFontSize, titleX, titleY, valueFontSize, valueX, valueY, labelFontSize, labelX, labelY, minFontSize, minX, minY, maxFontSize, maxX, maxY = null;

  // pki - custom attribute for generating gauge paths
  obj.canvas.customAttributes.pki = function(value, min, max, w, h, dx, dy, gws, donut, reverse) {

    var alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, path;

    if (donut) {
      alpha = (1 - 2 * (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 7;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.95 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) - Ri * Math.sin(alpha);

      path = "M" + (Cx - Ri) + "," + Cy + " ";
      path += "L" + (Cx - Ro) + "," + Cy + " ";
      if (value > ((max - min) / 2)) {
        path += "A" + Ro + "," + Ro + " 0 0 1 " + (Cx + Ro) + "," + Cy + " ";
      }
      path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
      path += "L" + Xi + "," + Yi + " ";
      if (value > ((max - min) / 2)) {
        path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx + Ri) + "," + Cy + " ";
      }
      path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
      path += "Z ";

      return {
        path: path
      };

    } else {
      alpha = (1 - (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 10;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.25 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) - Ri * Math.sin(alpha);

      path = "M" + (Cx - Ri) + "," + Cy + " ";
      path += "L" + (Cx - Ro) + "," + Cy + " ";
      path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
      path += "L" + Xi + "," + Yi + " ";
      path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
      path += "Z ";

      return {
        path: path
      };
    }

    // var clear
    alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, path = null;
  };

  // ndl - custom attribute for generating needle path
  obj.canvas.customAttributes.ndl = function(value, min, max, w, h, dx, dy, gws, donut) {

    var dlt = w * 3.5 / 100;
    var dlb = w / 15;
    var dw = w / 100;

    if (obj.config.pointerOptions.toplength != null && obj.config.pointerOptions.toplength != undefined) dlt = obj.config.pointerOptions.toplength;
    if (obj.config.pointerOptions.bottomlength != null && obj.config.pointerOptions.bottomlength != undefined) dlb = obj.config.pointerOptions.bottomlength;
    if (obj.config.pointerOptions.bottomwidth != null && obj.config.pointerOptions.bottomwidth != undefined) dw = obj.config.pointerOptions.bottomwidth;

    var alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, Xc, Yc, Xz, Yz, Xa, Ya, Xb, Yb, path;

    if (donut) {

      alpha = (1 - 2 * (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 7;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.95 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) - Ri * Math.sin(alpha);

      Xc = Xo + dlt * Math.cos(alpha);
      Yc = Yo - dlt * Math.sin(alpha);
      Xz = Xi - dlb * Math.cos(alpha);
      Yz = Yi + dlb * Math.sin(alpha);

      Xa = Xz + dw * Math.sin(alpha);
      Ya = Yz + dw * Math.cos(alpha);
      Xb = Xz - dw * Math.sin(alpha);
      Yb = Yz - dw * Math.cos(alpha);

      path = 'M' + Xa + ',' + Ya + ' ';
      path += 'L' + Xb + ',' + Yb + ' ';
      path += 'L' + Xc + ',' + Yc + ' ';
      path += 'Z ';

      return {
        path: path
      };

    } else {
      alpha = (1 - (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 10;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.25 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) - Ri * Math.sin(alpha);

      Xc = Xo + dlt * Math.cos(alpha);
      Yc = Yo - dlt * Math.sin(alpha);
      Xz = Xi - dlb * Math.cos(alpha);
      Yz = Yi + dlb * Math.sin(alpha);

      Xa = Xz + dw * Math.sin(alpha);
      Ya = Yz + dw * Math.cos(alpha);
      Xb = Xz - dw * Math.sin(alpha);
      Yb = Yz - dw * Math.cos(alpha);

      path = 'M' + Xa + ',' + Ya + ' ';
      path += 'L' + Xb + ',' + Yb + ' ';
      path += 'L' + Xc + ',' + Yc + ' ';
      path += 'Z ';

      return {
        path: path
      };
    }

    // var clear
    alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, Xc, Yc, Xz, Yz, Xa, Ya, Xb, Yb, path = null;
  };

  // gauge
  obj.gauge = obj.canvas.path().attr({
    "stroke": "none",
    "fill": obj.config.gaugeColor,
    pki: [
      obj.config.max,
      obj.config.min,
      obj.config.max,
      obj.params.widgetW,
      obj.params.widgetH,
      obj.params.dx,
      obj.params.dy,
      obj.config.gaugeWidthScale,
      obj.config.donut,
      obj.config.reverse
    ]
  });

  // level
  obj.level = obj.canvas.path().attr({
    "stroke": "none",
    "fill": getColor(obj.config.value, (obj.config.value - obj.config.min) / (obj.config.max - obj.config.min), obj.config.levelColors, obj.config.noGradient, obj.config.customSectors),
    pki: [
      obj.config.min,
      obj.config.min,
      obj.config.max,
      obj.params.widgetW,
      obj.params.widgetH,
      obj.params.dx,
      obj.params.dy,
      obj.config.gaugeWidthScale,
      obj.config.donut,
      obj.config.reverse
    ]
  });
  if (obj.config.donut) {
    obj.level.transform("r" + obj.config.donutStartAngle + ", " + (obj.params.widgetW / 2 + obj.params.dx) + ", " + (obj.params.widgetH / 1.95 + obj.params.dy));
  }

  if (obj.config.pointer) {
    // needle
    obj.needle = obj.canvas.path().attr({
      "stroke": (obj.config.pointerOptions.stroke !== null && obj.config.pointerOptions.stroke !== undefined) ? obj.config.pointerOptions.stroke : "none",
      "stroke-width": (obj.config.pointerOptions.stroke_width !== null && obj.config.pointerOptions.stroke_width !== undefined) ? obj.config.pointerOptions.stroke_width : 0,
      "stroke-linecap": (obj.config.pointerOptions.stroke_linecap !== null && obj.config.pointerOptions.stroke_linecap !== undefined) ? obj.config.pointerOptions.stroke_linecap : "square",
      "fill": (obj.config.pointerOptions.color !== null && obj.config.pointerOptions.color !== undefined) ? obj.config.pointerOptions.color : "#000000",
      ndl: [
        obj.config.min,
        obj.config.min,
        obj.config.max,
        obj.params.widgetW,
        obj.params.widgetH,
        obj.params.dx,
        obj.params.dy,
        obj.config.gaugeWidthScale,
        obj.config.donut
      ]
    });

    if (obj.config.donut) {
      obj.needle.transform("r" + obj.config.donutStartAngle + ", " + (obj.params.widgetW / 2 + obj.params.dx) + ", " + (obj.params.widgetH / 1.95 + obj.params.dy));
    }

  }

  // title
  obj.txtTitle = obj.canvas.text(obj.params.titleX, obj.params.titleY, obj.config.title);
  obj.txtTitle.attr({
    "font-size": obj.params.titleFontSize,
    "font-weight": "bold",
    "font-family": obj.config.titleFontFamily,
    "fill": obj.config.titleFontColor,
    "fill-opacity": "1"
  });
  setDy(obj.txtTitle, obj.params.titleFontSize, obj.params.titleY);

  // value
  obj.txtValue = obj.canvas.text(obj.params.valueX, obj.params.valueY, 0);
  obj.txtValue.attr({
    "font-size": obj.params.valueFontSize,
    "font-weight": "bold",
    "font-family": obj.config.valueFontFamily,
    "fill": obj.config.valueFontColor,
    "fill-opacity": "0"
  });
  setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);

  // label
  obj.txtLabel = obj.canvas.text(obj.params.labelX, obj.params.labelY, obj.config.label);
  obj.txtLabel.attr({
    "font-size": obj.params.labelFontSize,
    "font-weight": "normal",
    "font-family": "Arial",
    "fill": obj.config.labelFontColor,
    "fill-opacity": "0"
  });
  setDy(obj.txtLabel, obj.params.labelFontSize, obj.params.labelY);

  // min
  var min = obj.config.min;
  if (obj.config.reverse) {
    min = obj.config.max;
  }

  obj.txtMinimum = min;
  if (obj.config.humanFriendly) {
    obj.txtMinimum = humanFriendlyNumber(min, obj.config.humanFriendlyDecimal);
  } else if (obj.config.formatNumber) {
    obj.txtMinimum = formatNumber(min);
  }
  obj.txtMin = obj.canvas.text(obj.params.minX, obj.params.minY, obj.txtMinimum);
  obj.txtMin.attr({
    "font-size": obj.params.minFontSize,
    "font-weight": "normal",
    "font-family": "Arial",
    "fill": obj.config.labelFontColor,
    "fill-opacity": (obj.config.hideMinMax || obj.config.donut) ? "0" : "1"
  });
  setDy(obj.txtMin, obj.params.minFontSize, obj.params.minY);

  // max
  var max = obj.config.max;
  if (obj.config.reverse) {
    max = obj.config.min;
  }
  obj.txtMaximum = max;
  if (obj.config.humanFriendly) {
    obj.txtMaximum = humanFriendlyNumber(max, obj.config.humanFriendlyDecimal);
  } else if (obj.config.formatNumber) {
    obj.txtMaximum = formatNumber(max);
  }
  obj.txtMax = obj.canvas.text(obj.params.maxX, obj.params.maxY, obj.txtMaximum);
  obj.txtMax.attr({
    "font-size": obj.params.maxFontSize,
    "font-weight": "normal",
    "font-family": "Arial",
    "fill": obj.config.labelFontColor,
    "fill-opacity": (obj.config.hideMinMax || obj.config.donut) ? "0" : "1"
  });
  setDy(obj.txtMax, obj.params.maxFontSize, obj.params.maxY);

  var defs = obj.canvas.canvas.childNodes[1];
  var svg = "http://www.w3.org/2000/svg";

  if (ie !== 'undefined' && ie < 9) {
    // VML mode - no SVG & SVG filter support
  } else if (ie !== 'undefined') {
    onCreateElementNsReady(function() {
      obj.generateShadow(svg, defs);
    });
  } else {
    obj.generateShadow(svg, defs);
  }

  // var clear
  defs, svg = null;

  // set value to display
  if (obj.config.textRenderer) {
    obj.originalValue = obj.config.textRenderer(obj.originalValue);
  } else if (obj.config.humanFriendly) {
    obj.originalValue = humanFriendlyNumber(obj.originalValue, obj.config.humanFriendlyDecimal) + obj.config.symbol;
  } else if (obj.config.formatNumber) {
    obj.originalValue = formatNumber(obj.originalValue) + obj.config.symbol;
  } else {
    obj.originalValue = (obj.originalValue * 1).toFixed(obj.config.decimals) + obj.config.symbol;
  }

  if (obj.config.counter === true) {
    //on each animation frame
    eve.on("raphael.anim.frame." + (obj.level.id), function() {
      var currentValue = obj.level.attr("pki")[0];
      if (obj.config.reverse) {
        currentValue = (obj.config.max * 1) + (obj.config.min * 1) - (obj.level.attr("pki")[0] * 1);
      }
      if (obj.config.textRenderer) {
        obj.txtValue.attr("text", obj.config.textRenderer(Math.floor(currentValue)));
      } else if (obj.config.humanFriendly) {
        obj.txtValue.attr("text", humanFriendlyNumber(Math.floor(currentValue), obj.config.humanFriendlyDecimal) + obj.config.symbol);
      } else if (obj.config.formatNumber) {
        obj.txtValue.attr("text", formatNumber(Math.floor(currentValue)) + obj.config.symbol);
      } else {
        obj.txtValue.attr("text", (currentValue * 1).toFixed(obj.config.decimals) + obj.config.symbol);
      }
      setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);
      currentValue = null;
    });
    //on animation end
    eve.on("raphael.anim.finish." + (obj.level.id), function() {
      obj.txtValue.attr({
        "text": obj.originalValue
      });
      setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);
    });
  } else {
    //on animation start
    eve.on("raphael.anim.start." + (obj.level.id), function() {
      obj.txtValue.attr({
        "text": obj.originalValue
      });
      setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);
    });
  }

  // animate gauge level, value & label
  var rvl = obj.config.value;
  if (obj.config.reverse) {
    rvl = (obj.config.max * 1) + (obj.config.min * 1) - (obj.config.value * 1);
  }
  obj.level.animate({
    pki: [
      rvl,
      obj.config.min,
      obj.config.max,
      obj.params.widgetW,
      obj.params.widgetH,
      obj.params.dx,
      obj.params.dy,
      obj.config.gaugeWidthScale,
      obj.config.donut,
      obj.config.reverse
    ]
  }, obj.config.startAnimationTime, obj.config.startAnimationType);

  if (obj.config.pointer) {
    obj.needle.animate({
      ndl: [
        rvl,
        obj.config.min,
        obj.config.max,
        obj.params.widgetW,
        obj.params.widgetH,
        obj.params.dx,
        obj.params.dy,
        obj.config.gaugeWidthScale,
        obj.config.donut
      ]
    }, obj.config.startAnimationTime, obj.config.startAnimationType);
  }

  obj.txtValue.animate({
    "fill-opacity": (obj.config.hideValue) ? "0" : "1"
  }, obj.config.startAnimationTime, obj.config.startAnimationType);
  obj.txtLabel.animate({
    "fill-opacity": "1"
  }, obj.config.startAnimationTime, obj.config.startAnimationType);
};

/** Refresh gauge level */
JustGage.prototype.refresh = function(val, max) {

  var obj = this;
  var displayVal, color, max = max || null;

  // set new max
  if (max !== null) {
    obj.config.max = max;
    // TODO: update customSectors

    obj.txtMaximum = obj.config.max;
    if (obj.config.humanFriendly) {
      obj.txtMaximum = humanFriendlyNumber(obj.config.max, obj.config.humanFriendlyDecimal);
    } else if (obj.config.formatNumber) {
      obj.txtMaximum = formatNumber(obj.config.max);
    }
    if (!obj.config.reverse) {
      obj.txtMax.attr({
        "text": obj.txtMaximum
      });
      setDy(obj.txtMax, obj.params.maxFontSize, obj.params.maxY);
    } else {
      obj.txtMin.attr({
        "text": obj.txtMaximum
      });
      setDy(obj.txtMin, obj.params.minFontSize, obj.params.minY);
    }
  }

  // overflow values
  displayVal = val;
  if ((val * 1) > (obj.config.max * 1)) {
    val = (obj.config.max * 1);
  }
  if ((val * 1) < (obj.config.min * 1)) {
    val = (obj.config.min * 1);
  }

  color = getColor(val, (val - obj.config.min) / (obj.config.max - obj.config.min), obj.config.levelColors, obj.config.noGradient, obj.config.customSectors);

  if (obj.config.textRenderer) {
    displayVal = obj.config.textRenderer(displayVal);
  } else if (obj.config.humanFriendly) {
    displayVal = humanFriendlyNumber(displayVal, obj.config.humanFriendlyDecimal) + obj.config.symbol;
  } else if (obj.config.formatNumber) {
    displayVal = formatNumber((displayVal * 1).toFixed(obj.config.decimals)) + obj.config.symbol;
  } else {
    displayVal = (displayVal * 1).toFixed(obj.config.decimals) + obj.config.symbol;
  }
  obj.originalValue = displayVal;
  obj.config.value = val * 1;

  if (!obj.config.counter) {
    obj.txtValue.attr({
      "text": displayVal
    });
    setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);
  }

  var rvl = obj.config.value;
  if (obj.config.reverse) {
    rvl = (obj.config.max * 1) + (obj.config.min * 1) - (obj.config.value * 1);
  }
  obj.level.animate({
    pki: [
      rvl,
      obj.config.min,
      obj.config.max,
      obj.params.widgetW,
      obj.params.widgetH,
      obj.params.dx,
      obj.params.dy,
      obj.config.gaugeWidthScale,
      obj.config.donut,
      obj.config.reverse
    ],
    "fill": color
  }, obj.config.refreshAnimationTime, obj.config.refreshAnimationType);

  if (obj.config.pointer) {
    obj.needle.animate({
      ndl: [
        rvl,
        obj.config.min,
        obj.config.max,
        obj.params.widgetW,
        obj.params.widgetH,
        obj.params.dx,
        obj.params.dy,
        obj.config.gaugeWidthScale,
        obj.config.donut
      ]
    }, obj.config.refreshAnimationTime, obj.config.refreshAnimationType);
  }

  // var clear
  obj, displayVal, color, max = null;
};

/** Generate shadow */
JustGage.prototype.generateShadow = function(svg, defs) {

  var obj = this;
  var sid = "inner-shadow-" + obj.config.id;
  var gaussFilter, feOffset, feGaussianBlur, feComposite1, feFlood, feComposite2, feComposite3;

  // FILTER
  gaussFilter = document.createElementNS(svg, "filter");
  gaussFilter.setAttribute("id", sid);
  defs.appendChild(gaussFilter);

  // offset
  feOffset = document.createElementNS(svg, "feOffset");
  feOffset.setAttribute("dx", 0);
  feOffset.setAttribute("dy", obj.config.shadowVerticalOffset);
  gaussFilter.appendChild(feOffset);

  // blur
  feGaussianBlur = document.createElementNS(svg, "feGaussianBlur");
  feGaussianBlur.setAttribute("result", "offset-blur");
  feGaussianBlur.setAttribute("stdDeviation", obj.config.shadowSize);
  gaussFilter.appendChild(feGaussianBlur);

  // composite 1
  feComposite1 = document.createElementNS(svg, "feComposite");
  feComposite1.setAttribute("operator", "out");
  feComposite1.setAttribute("in", "SourceGraphic");
  feComposite1.setAttribute("in2", "offset-blur");
  feComposite1.setAttribute("result", "inverse");
  gaussFilter.appendChild(feComposite1);

  // flood
  feFlood = document.createElementNS(svg, "feFlood");
  feFlood.setAttribute("flood-color", "black");
  feFlood.setAttribute("flood-opacity", obj.config.shadowOpacity);
  feFlood.setAttribute("result", "color");
  gaussFilter.appendChild(feFlood);

  // composite 2
  feComposite2 = document.createElementNS(svg, "feComposite");
  feComposite2.setAttribute("operator", "in");
  feComposite2.setAttribute("in", "color");
  feComposite2.setAttribute("in2", "inverse");
  feComposite2.setAttribute("result", "shadow");
  gaussFilter.appendChild(feComposite2);

  // composite 3
  feComposite3 = document.createElementNS(svg, "feComposite");
  feComposite3.setAttribute("operator", "over");
  feComposite3.setAttribute("in", "shadow");
  feComposite3.setAttribute("in2", "SourceGraphic");
  gaussFilter.appendChild(feComposite3);

  // set shadow
  if (!obj.config.hideInnerShadow) {
    obj.canvas.canvas.childNodes[2].setAttribute("filter", "url(#" + sid + ")");
    obj.canvas.canvas.childNodes[3].setAttribute("filter", "url(#" + sid + ")");
  }

  // var clear
  gaussFilter, feOffset, feGaussianBlur, feComposite1, feFlood, feComposite2, feComposite3 = null;
};

//
// tiny helper function to lookup value of a key from two hash tables
// if none found, return defaultvalue
//
// key: string
// tablea: object
// tableb: DOMStringMap|object
// defval: string|integer|float|null
// datatype: return datatype
// delimiter: delimiter to be used in conjunction with datatype formatting
//
function kvLookup(key, tablea, tableb, defval, datatype, delimiter) {
  var val = defval;
  var canConvert = false;
  if (!(key === null || key === undefined)) {
    if (tableb !== null && tableb !== undefined && typeof tableb === "object" && key in tableb) {
      val = tableb[key];
      canConvert = true;
    } else if (tablea !== null && tablea !== undefined && typeof tablea === "object" && key in tablea) {
      val = tablea[key];
      canConvert = true;
    } else {
      val = defval;
    }
    if (canConvert === true) {
      if (datatype !== null && datatype !== undefined) {
        switch (datatype) {
          case 'int':
            val = parseInt(val, 10);
            break;
          case 'float':
            val = parseFloat(val);
            break;
          default:
            break;
        }
      }
    }
  }
  return val;
};

/** Get color for value */
function getColor(val, pct, col, noGradient, custSec) {

  var no, inc, colors, percentage, rval, gval, bval, lower, upper, range, rangePct, pctLower, pctUpper, color;
  var noGradient = noGradient || custSec.length > 0;

  if (custSec.length > 0) {
    for (var i = 0; i < custSec.length; i++) {
      if (val > custSec[i].lo && val <= custSec[i].hi) {
        return custSec[i].color;
      }
    }
  }

  no = col.length;
  if (no === 1) return col[0];
  inc = (noGradient) ? (1 / no) : (1 / (no - 1));
  colors = [];
  for (i = 0; i < col.length; i++) {
    percentage = (noGradient) ? (inc * (i + 1)) : (inc * i);
    rval = parseInt((cutHex(col[i])).substring(0, 2), 16);
    gval = parseInt((cutHex(col[i])).substring(2, 4), 16);
    bval = parseInt((cutHex(col[i])).substring(4, 6), 16);
    colors[i] = {
      pct: percentage,
      color: {
        r: rval,
        g: gval,
        b: bval
      }
    };
  }

  if (pct === 0) {
    return 'rgb(' + [colors[0].color.r, colors[0].color.g, colors[0].color.b].join(',') + ')';
  }

  for (var j = 0; j < colors.length; j++) {
    if (pct <= colors[j].pct) {
      if (noGradient) {
        return 'rgb(' + [colors[j].color.r, colors[j].color.g, colors[j].color.b].join(',') + ')';
      } else {
        lower = colors[j - 1];
        upper = colors[j];
        range = upper.pct - lower.pct;
        rangePct = (pct - lower.pct) / range;
        pctLower = 1 - rangePct;
        pctUpper = rangePct;
        color = {
          r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
          g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
          b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
      }
    }
  }

}

/** Fix Raphael display:none tspan dy attribute bug */
function setDy(elem, fontSize, txtYpos) {
  if ((!ie || ie > 9) && elem.node.firstChild.attributes.dy) {
    elem.node.firstChild.attributes.dy.value = 0;
  }
}

/** Random integer  */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**  Cut hex  */
function cutHex(str) {
  return (str.charAt(0) == "#") ? str.substring(1, 7) : str;
}

/**  Human friendly number suffix - From: http://stackoverflow.com/questions/2692323/code-golf-friendly-number-abbreviator */
function humanFriendlyNumber(n, d) {
  var p, d2, i, s;

  p = Math.pow;
  d2 = p(10, d);
  i = 7;
  while (i) {
    s = p(10, i-- * 3);
    if (s <= n) {
      n = Math.round(n * d2 / s) / d2 + "KMGTPE" [i];
    }
  }
  return n;
}

/** Format numbers with commas - From: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
function formatNumber(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**  Get style  */
function getStyle(oElm, strCssRule) {
  var strValue = "";
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
  } else if (oElm.currentStyle) {
    strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
      return p1.toUpperCase();
    });
    strValue = oElm.currentStyle[strCssRule];
  }
  return strValue;
}

/**  Create Element NS Ready  */
function onCreateElementNsReady(func) {
  if (document.createElementNS !== undefined) {
    func();
  } else {
    setTimeout(function() {
      onCreateElementNsReady(func);
    }, 100);
  }
}

/**  Get IE version  */
// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
// ie === undefined
// If you're in IE (>=5) then you can determine which version:
// ie === 7; // IE7
// Thus, to detect IE:
// if (ie) {}
// And to detect the version:
// ie === 6 // IE6
// ie > 7 // IE8, IE9 ...
// ie < 9 // Anything less than IE9
// ----------------------------------------------------------
// UPDATE: Now using Live NodeList idea from @jdalton
var ie = (function() {

  var undef,
    v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');

  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );
  return v > 4 ? v : undef;
}());

// extend target object with second object
function extend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};
;/**
 * PrimeFaces Extensions Speedtest Widget.
 *
 * @author ssibitz ssibitz@me.com
 * @since 6.2
 */
PrimeFaces.widget.ExtSpeedtest = PrimeFaces.widget.BaseWidget.extend({

    /**
     * Initializes the widget.
     *
     * @param {object}
     *        cfg The widget configuration.
     */
    init: function(cfg) {
        this._super(cfg);
        this.id = cfg.id;
        this.cfg = cfg;

        this.render();
    },

    start: function() {
        // Start the speedtest
        var $this = this;
        $this.testPing();
        $this.testDown();
        $this.testUp();

        // Call listener function to 'save' results when it's set:
        var options = {
                params: [
                    { name: $this.id + '_PingTimeMS', value: $this.pingTimeMS },
                    { name: $this.id + '_JitterTimeMS', value: $this.jitterTimeMS },
                    { name: $this.id + '_SpeedMbpsDownload', value: $this.downSpeed },
                    { name: $this.id + '_SpeedMbpsUpload', value: $this.upSpeed }
                ]
            };
        $this.callBehavior('speedtest', options);
    },

    render: function() {
        var $this = this;

        // Reset values
        $this.pingTimeMS = 0;
        $this.lastPingTimeMS = 0;
        $this.jitterTimeMS = 0;
        $this.downSpeed = 0;
        $this.upSpeed = 0;

        // Generate Gauge's
        $(document).ready(function () {
            $this.gaugeDown = $this.createGage($this.cfg.idDown, $this.cfg.captionDownload, 'Mbps', '#999999', $this.cfg.colorDownload);
            $this.gaugeUp = $this.createGage($this.cfg.idUp, $this.cfg.captionUpload, 'Mbps', '#999999', $this.cfg.colorUpload);
            $this.gaugePing = $this.createGage($this.cfg.idPing, $this.cfg.captionPing, 'ms', '#999999', $this.cfg.colorPing);
            $this.gaugeJitter = $this.createGage($this.cfg.idJitter, $this.cfg.captionJitter, 'ms', '#999999', $this.cfg.colorJitter);
        });
    },

    updateGauge: function(gauge, value, maxfactor) {
        var Max = (Math.round(value / maxfactor) + 1) * maxfactor;
        gauge.refresh(value, Max);
    },

    createGage: function(id, title, label, color1, color2) {
        return new JustGage({
            id: id,
            title: title,
            label: label,
            titleFontFamily: 'Comic Sans MS',
            valueFontFamily: 'Comic Sans MS',
            refreshAnimationTime: 300,
            value: 0,
            min: 0,
            max: 100,
            decimals: 2,
            formatNumber: true,
            humanFriendly: false,
            levelColors: [
                color1,
                color2
            ]
        });
    },

    genBytes: function(len) {
        var pC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var ret = "";
        for (var i = 0; i < len; i++) {
            ret += pC.charAt(Math.floor(Math.random() * pC.length));
        }
        return ret;
    },

    startMS: function() {
        return performance.now();
    },

    diffMS: function(startTime) {
        var $this = this;
        return ($this.startMS() - startTime);
    },

    C2MBps: function(bytes) {
        return Math.round(100 * bytes * 8 / 1024 / 1024) / 100;
    },

    getFileName: function() {
        var $this = this;
        var ret = "";
        ret = ret + String($this.cfg.file);
        return ret;
    },

    singlePing: function(cnt, upLoadDatas) {
        var $this = this;
        var pMSC = 0;
        var start = $this.startMS();
        $.ajax({
            async: false,
            type: 'POST',
            url: PrimeFaces.resources.getFacesResource('speedtest/dummy.html', PrimeFacesExt.RESOURCE_LIBRARY, PrimeFacesExt.VERSION) + '?id=' + start,
            data: upLoadDatas,
            success: function(msg) {
                pMSC = $this.diffMS(start);
                $this.pingTimeMS += pMSC;
            },
            complete: function(xhr, textStatus) {
                if (cnt > 1) {
                    $this.jitterTimeMS += Math.abs($this.lastPingTimeMS - pMSC);
                }
                $this.lastPingTimeMS = pMSC;
            }
        });
    },

    testPing: function() {
        var $this = this;
        // Do the ping test 10 times:
        for (var cnt = 1; cnt <= 10; cnt++) {
            $this.singlePing(cnt, $this.genBytes(32));
        }
        $this.pingTimeMS = Math.round(100 * $this.pingTimeMS / cnt) / 100;
        $this.jitterTimeMS = Math.round(100 * $this.jitterTimeMS / cnt) / 100;
        // Finished - Show result for ping, jitter:
        $this.updateGauge($this.gaugePing, $this.pingTimeMS, 10);
        $this.updateGauge($this.gaugeJitter, $this.jitterTimeMS, 10);
    },

    testDown: function() {
        var $this = this;
        var start = $this.startMS();
        $.ajax({
            async: false,
            cache: false,
            type: 'GET',
            url: $this.getFileName() + '?id=' + start,
            success: function(msg) {
                $this.downSpeed = $this.C2MBps(msg.length / ($this.diffMS(start) / 1000));
            },
            complete: function(xhr, textStatus) {
                $this.updateGauge($this.gaugeDown, $this.downSpeed, 50);
            }
        });
    },

    testUp: function() {
        var $this = this;
        var upLoadDatas = $this.genBytes(200000);
        var start = $this.startMS();
        $.ajax({
            async: false,
            type: 'POST',
            url: PrimeFaces.resources.getFacesResource('speedtest/dummy.html', PrimeFacesExt.RESOURCE_LIBRARY, PrimeFacesExt.VERSION) + '?id=' + start,
            data: upLoadDatas,
            success: function(msg) {
                $this.upSpeed = $this.C2MBps(upLoadDatas.length / ($this.diffMS(start) / 1000));
            },
            complete: function(xhr, textStatus) {
                $this.updateGauge($this.gaugeUp, $this.upSpeed, 50);
            }
        });
    }
});