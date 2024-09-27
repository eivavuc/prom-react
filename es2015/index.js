import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigationListener, useLifecycleEventListener } from '@shopify/react-performance';
export * from '@shopify/react-performance';
import EventEmitter from 'events';
import prom from 'promjs/index';
import { useBeforeunload } from 'react-beforeunload';

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var GoldenMetrics = /*#__PURE__*/function (GoldenMetrics) {
  GoldenMetrics["AppLoaded"] = "prom_react_app_loaded";
  GoldenMetrics["AppUnloaded"] = "prom_react_app_unloaded";
  GoldenMetrics["PageNavigation"] = "prom_react_navigation_duration_seconds";
  GoldenMetrics["PageTimeToComplete"] = "prom_react_ttc_seconds";
  GoldenMetrics["PageTimeToUsable"] = "prom_react_ttu_seconds";
  GoldenMetrics["PerformanceTime"] = "prom_react_performance_seconds";
  return GoldenMetrics;
}({});
var goldenMetrics = [{
  type: 'counter',
  name: GoldenMetrics.AppLoaded,
  description: 'Application loaded counter'
}, {
  type: 'counter',
  name: GoldenMetrics.AppUnloaded,
  description: 'Application unloaded counter'
}, {
  type: 'histogram',
  name: GoldenMetrics.PageNavigation,
  description: 'Total navigation duration between pages in seconds'
}, {
  type: 'histogram',
  name: GoldenMetrics.PageTimeToComplete,
  description: 'Section time to interactive in seconds'
}, {
  type: 'histogram',
  name: GoldenMetrics.PageTimeToUsable,
  description: 'Section time to usable in seconds'
}, {
  type: 'histogram',
  name: GoldenMetrics.PerformanceTime,
  description: 'Application performance load time in seconds'
}];
var createMetrics = function createMetrics(registry, defaultBuckets) {
  var customMetrics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (registry.get('counter', GoldenMetrics.AppLoaded)) {
    // Avoid creating golden metrics if they already exist
    return;
  }
  [].concat(goldenMetrics, _toConsumableArray(customMetrics)).forEach(function (metric) {
    switch (metric.type) {
      case 'counter':
        registry.create('counter', metric.name, metric.description);
        break;
      case 'histogram':
        registry.create('histogram', metric.name, metric.description, metric.buckets || defaultBuckets);
        break;
    }
  });
};

var MetricsContext = /*#__PURE__*/createContext({});
var useMetrics = function useMetrics() {
  return useContext(MetricsContext);
};

var defaultLogger = function defaultLogger(_ref) {
  var metricName = _ref.metricName,
    value = _ref.value,
    tags = _ref.tags;
  // eslint-disable-next-line no-console
  console.log('[prom_react]', metricName, value, tags);
};
var MetricsLogger = function MetricsLogger(_ref2) {
  var _ref2$logger = _ref2.logger,
    logger = _ref2$logger === void 0 ? defaultLogger : _ref2$logger;
  var _useMetrics = useMetrics(),
    addObserveListener = _useMetrics.addObserveListener,
    removeObserveListener = _useMetrics.removeObserveListener;
  useEffect(function () {
    addObserveListener(logger);
    return function () {
      removeObserveListener(logger);
    };
  }, [addObserveListener, logger, removeObserveListener]);
  return null;
};

var wrapperStyle = {
  position: 'fixed',
  right: 10,
  bottom: 10,
  padding: '15px 10px',
  zIndex: 99999,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  minWidth: '250px',
  minHeight: '140px',
  borderRadius: 4,
  color: 'white',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '1rem'
};
var titleStyle = {
  fontWeight: 'bold',
  fontSize: '1.2rem'
};
var sectionTitleStyle = {
  fontWeight: 'bold',
  color: '#a0c4ff',
  margin: '4px 0',
  fontSize: '1rem'
};
var valueStyle = {
  color: '#9bf6ff'
};
var MetricsDebugOverlay = function MetricsDebugOverlay(_ref) {
  var withLogger = _ref.withLogger,
    onClose = _ref.onClose;
  var _useMetrics = useMetrics(),
    navigationData = _useMetrics.navigationData;
  return /*#__PURE__*/jsxs("section", {
    className: "prom-react-navigation-overlay",
    style: wrapperStyle,
    children: [onClose && /*#__PURE__*/jsx("span", {
      onClick: function onClick() {
        onClose();
      },
      style: {
        position: 'absolute',
        right: 5,
        top: 5,
        cursor: 'pointer'
      },
      children: "x"
    }), /*#__PURE__*/jsx("h2", {
      style: titleStyle,
      children: "prom-react"
    }), /*#__PURE__*/jsx("h3", {
      style: sectionTitleStyle,
      children: "Last navigation"
    }), navigationData ? /*#__PURE__*/jsxs("ul", {
      style: {
        marginLeft: 5
      },
      children: [/*#__PURE__*/jsxs("li", {
        children: ["Pathname: ", /*#__PURE__*/jsx("span", {
          style: valueStyle,
          children: navigationData.path
        })]
      }), /*#__PURE__*/jsxs("li", {
        children: ["Navigation type:", ' ', /*#__PURE__*/jsx("span", {
          style: valueStyle,
          children: navigationData.isFullPageNavigation ? 'Full page' : 'In app'
        })]
      }), /*#__PURE__*/jsxs("li", {
        children: ["Duration:", ' ', /*#__PURE__*/jsxs("span", {
          style: navigationData.duration > 10000 ? {
            color: '#ffadad'
          } : valueStyle,
          children: [navigationData.duration.toFixed(2), "ms"]
        })]
      }), /*#__PURE__*/jsxs("li", {
        children: ["TTU:", ' ', /*#__PURE__*/jsxs("span", {
          style: valueStyle,
          children: [navigationData.timeToUsable.toFixed(2), "ms"]
        })]
      }), /*#__PURE__*/jsxs("li", {
        children: ["TTC:", ' ', /*#__PURE__*/jsxs("span", {
          style: valueStyle,
          children: [navigationData.timeToComplete.toFixed(2), "ms"]
        })]
      })]
    }) : '-', withLogger && /*#__PURE__*/jsx(MetricsLogger, {})]
  });
};

function _typeof$1(obj) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof$1(obj);
}

function _toPrimitive(input, hint) {
  if (_typeof$1(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof$1(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var regeneratorRuntimeExports = {};
var regeneratorRuntime$1 = {
  get exports(){ return regeneratorRuntimeExports; },
  set exports(v){ regeneratorRuntimeExports = v; },
};

var _typeofExports = {};
var _typeof = {
  get exports(){ return _typeofExports; },
  set exports(v){ _typeofExports = v; },
};

(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
	}
	module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (_typeof));

(function (module) {
	var _typeof = _typeofExports["default"];
	function _regeneratorRuntime() {
	  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
	    return exports;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
	  var exports = {},
	    Op = Object.prototype,
	    hasOwn = Op.hasOwnProperty,
	    defineProperty = Object.defineProperty || function (obj, key, desc) {
	      obj[key] = desc.value;
	    },
	    $Symbol = "function" == typeof Symbol ? Symbol : {},
	    iteratorSymbol = $Symbol.iterator || "@@iterator",
	    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
	    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  function define(obj, key, value) {
	    return Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: !0,
	      configurable: !0,
	      writable: !0
	    }), obj[key];
	  }
	  try {
	    define({}, "");
	  } catch (err) {
	    define = function define(obj, key, value) {
	      return obj[key] = value;
	    };
	  }
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
	      generator = Object.create(protoGenerator.prototype),
	      context = new Context(tryLocsList || []);
	    return defineProperty(generator, "_invoke", {
	      value: makeInvokeMethod(innerFn, self, context)
	    }), generator;
	  }
	  function tryCatch(fn, obj, arg) {
	    try {
	      return {
	        type: "normal",
	        arg: fn.call(obj, arg)
	      };
	    } catch (err) {
	      return {
	        type: "throw",
	        arg: err
	      };
	    }
	  }
	  exports.wrap = wrap;
	  var ContinueSentinel = {};
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });
	  var getProto = Object.getPrototypeOf,
	    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      define(prototype, method, function (arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }
	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if ("throw" !== record.type) {
	        var result = record.arg,
	          value = result.value;
	        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
	          invoke("next", value, resolve, reject);
	        }, function (err) {
	          invoke("throw", err, resolve, reject);
	        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
	          result.value = unwrapped, resolve(result);
	        }, function (error) {
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	      reject(record.arg);
	    }
	    var previousPromise;
	    defineProperty(this, "_invoke", {
	      value: function value(method, arg) {
	        function callInvokeWithMethodAndArg() {
	          return new PromiseImpl(function (resolve, reject) {
	            invoke(method, arg, resolve, reject);
	          });
	        }
	        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	      }
	    });
	  }
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = "suspendedStart";
	    return function (method, arg) {
	      if ("executing" === state) throw new Error("Generator is already running");
	      if ("completed" === state) {
	        if ("throw" === method) throw arg;
	        return doneResult();
	      }
	      for (context.method = method, context.arg = arg;;) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }
	        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
	          if ("suspendedStart" === state) throw state = "completed", context.arg;
	          context.dispatchException(context.arg);
	        } else "return" === context.method && context.abrupt("return", context.arg);
	        state = "executing";
	        var record = tryCatch(innerFn, self, context);
	        if ("normal" === record.type) {
	          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
	          return {
	            value: record.arg,
	            done: context.done
	          };
	        }
	        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
	      }
	    };
	  }
	  function maybeInvokeDelegate(delegate, context) {
	    var methodName = context.method,
	      method = delegate.iterator[methodName];
	    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
	    var record = tryCatch(method, delegate.iterator, context.arg);
	    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
	    var info = record.arg;
	    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
	  }
	  function pushTryEntry(locs) {
	    var entry = {
	      tryLoc: locs[0]
	    };
	    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
	  }
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal", delete record.arg, entry.completion = record;
	  }
	  function Context(tryLocsList) {
	    this.tryEntries = [{
	      tryLoc: "root"
	    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
	  }
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) return iteratorMethod.call(iterable);
	      if ("function" == typeof iterable.next) return iterable;
	      if (!isNaN(iterable.length)) {
	        var i = -1,
	          next = function next() {
	            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
	            return next.value = undefined, next.done = !0, next;
	          };
	        return next.next = next;
	      }
	    }
	    return {
	      next: doneResult
	    };
	  }
	  function doneResult() {
	    return {
	      value: undefined,
	      done: !0
	    };
	  }
	  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
	    value: GeneratorFunctionPrototype,
	    configurable: !0
	  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
	    value: GeneratorFunction,
	    configurable: !0
	  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
	    var ctor = "function" == typeof genFun && genFun.constructor;
	    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
	  }, exports.mark = function (genFun) {
	    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
	  }, exports.awrap = function (arg) {
	    return {
	      __await: arg
	    };
	  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    void 0 === PromiseImpl && (PromiseImpl = Promise);
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
	    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
	    return this;
	  }), define(Gp, "toString", function () {
	    return "[object Generator]";
	  }), exports.keys = function (val) {
	    var object = Object(val),
	      keys = [];
	    for (var key in object) keys.push(key);
	    return keys.reverse(), function next() {
	      for (; keys.length;) {
	        var key = keys.pop();
	        if (key in object) return next.value = key, next.done = !1, next;
	      }
	      return next.done = !0, next;
	    };
	  }, exports.values = values, Context.prototype = {
	    constructor: Context,
	    reset: function reset(skipTempReset) {
	      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
	    },
	    stop: function stop() {
	      this.done = !0;
	      var rootRecord = this.tryEntries[0].completion;
	      if ("throw" === rootRecord.type) throw rootRecord.arg;
	      return this.rval;
	    },
	    dispatchException: function dispatchException(exception) {
	      if (this.done) throw exception;
	      var context = this;
	      function handle(loc, caught) {
	        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
	      }
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i],
	          record = entry.completion;
	        if ("root" === entry.tryLoc) return handle("end");
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc"),
	            hasFinally = hasOwn.call(entry, "finallyLoc");
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	          } else {
	            if (!hasFinally) throw new Error("try statement without catch or finally");
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          }
	        }
	      }
	    },
	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
	      var record = finallyEntry ? finallyEntry.completion : {};
	      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
	    },
	    complete: function complete(record, afterLoc) {
	      if ("throw" === record.type) throw record.arg;
	      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
	    },
	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
	      }
	    },
	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if ("throw" === record.type) {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	      throw new Error("illegal catch attempt");
	    },
	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      return this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
	    }
	  }, exports;
	}
	module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (regeneratorRuntime$1));

// TODO(Babel 8): Remove this file.

var runtime = regeneratorRuntimeExports();
var regenerator = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var sendMetricsToGateway = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(registry, promGatewayUrl) {
    var fetchOptions,
      isAppUnloading,
      metrics,
      keepalive,
      _args = arguments;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          fetchOptions = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
          isAppUnloading = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
          metrics = registry.metrics();
          if (!(metrics.length > 0)) {
            _context.next = 14;
            break;
          }
          keepalive = isAppUnloading ? {
            keepalive: true
          } : {};
          _context.prev = 5;
          _context.next = 8;
          return fetch(promGatewayUrl, _objectSpread$1(_objectSpread$1(_objectSpread$1({
            body: metrics,
            method: 'POST'
          }, keepalive), fetchOptions), {}, {
            headers: _objectSpread$1({
              'Content-Type': 'text/plain;charset=UTF-8'
            }, fetchOptions.headers)
          }));
        case 8:
          registry.reset();
          _context.next = 14;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);
          // eslint-disable-next-line no-console
          console.error('Error while sending metrics', _context.t0);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 11]]);
  }));
  return function sendMetricsToGateway(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var addToMetrics = function addToMetrics(_ref2) {
  var registry = _ref2.registry,
    metricName = _ref2.metricName,
    value = _ref2.value,
    tags = _ref2.tags;
  var histogram = registry.get('histogram', metricName);
  var counter = registry.get('counter', metricName);
  if (!histogram && !counter) {
    // eslint-disable-next-line no-console
    console.warn("[prom_react] No metric found for ".concat(metricName));
    return;
  }
  if (histogram) {
    if (typeof value === 'number') {
      histogram.observe(value, tags);
    } else {
      // eslint-disable-next-line no-console
      console.warn("[prom_react] ".concat(metricName, " is an histogram, so value is mandatory"));
      return;
    }
  }
  counter === null || counter === void 0 ? void 0 : counter.add(value !== null && value !== void 0 ? value : 1, tags);
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var defaultBuckets = [0.01, 0.1, 1, 2, 3, 4, 5, 7, 10, 15];
var defaultCustomMetrics = [];
var MetricsProvider = function MetricsProvider(_ref) {
  var appName = _ref.appName,
    children = _ref.children,
    metricsAggregatorUrl = _ref.metricsAggregatorUrl,
    getNormalizedPath = _ref.getNormalizedPath,
    _ref$owner = _ref.owner,
    owner = _ref$owner === void 0 ? '' : _ref$owner,
    _ref$histogramBuckets = _ref.histogramBuckets,
    histogramBuckets = _ref$histogramBuckets === void 0 ? defaultBuckets : _ref$histogramBuckets,
    _ref$customMetrics = _ref.customMetrics,
    customMetrics = _ref$customMetrics === void 0 ? defaultCustomMetrics : _ref$customMetrics,
    fetchOptions = _ref.fetchOptions;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isReady = _useState2[0],
    setIsReady = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    navigationData = _useState4[0],
    setNavigationData = _useState4[1];
  var registry = useRef(prom());
  var eventEmitter = useRef(new EventEmitter());
  var defaultTags = useMemo(function () {
    return {
      app_name: appName,
      owner: owner
    };
  }, [appName, owner]);
  var sendMetrics = useCallback(function () {
    var isAppUnloading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!metricsAggregatorUrl) {
      return;
    }
    // eslint-disable-next-line no-void
    void sendMetricsToGateway(registry.current, metricsAggregatorUrl, fetchOptions, isAppUnloading);
  }, [metricsAggregatorUrl, fetchOptions]);
  var observe = useCallback(function (metricName, extraTags, value) {
    var skipSend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var tags = _objectSpread(_objectSpread({}, defaultTags), extraTags);
    addToMetrics({
      metricName: metricName,
      registry: registry.current,
      tags: tags,
      value: value
    });
    eventEmitter.current.emit('observation', {
      metricName: metricName,
      tags: tags,
      value: value
    });
    if (!skipSend) {
      sendMetrics();
    }
  }, [defaultTags, sendMetrics]);
  var addObserveListener = useCallback(function (callback) {
    eventEmitter.current.on('observation', callback);
  }, []);
  var removeObserveListener = useCallback(function (callback) {
    eventEmitter.current.off('observation', callback);
  }, []);

  // Cleanup load error metric if any
  useEffect(function () {
    // eslint-disable-next-line no-underscore-dangle
    window.__PROM_REACT_LOAD_FAILURE_TIMEOUT__ &&
    // eslint-disable-next-line no-underscore-dangle
    clearTimeout(window.__PROM_REACT_LOAD_FAILURE_TIMEOUT__);
  }, []);
  useEffect(function () {
    createMetrics(registry.current, histogramBuckets, customMetrics);
    setIsReady(true);
  }, [registry, histogramBuckets, customMetrics]);
  useEffect(function () {
    observe(GoldenMetrics.AppLoaded, {
      status: 'success'
    });
  }, [appName, observe, sendMetrics]);
  useEffect(function () {
    return function () {
      eventEmitter.current.removeAllListeners();
    };
  }, []);
  useBeforeunload(function () {
    observe(GoldenMetrics.AppUnloaded, {}, undefined, true);
    sendMetrics(true);
  });
  useNavigationListener(function (navigation) {
    var start = navigation.start,
      duration = navigation.duration,
      timeToComplete = navigation.timeToComplete,
      timeToUsable = navigation.timeToUsable,
      isFullPageNavigation = navigation.isFullPageNavigation,
      target = navigation.target;
    var path = (getNormalizedPath === null || getNormalizedPath === void 0 ? void 0 : getNormalizedPath(target)) || target;
    setNavigationData({
      start: start,
      duration: duration,
      timeToComplete: timeToComplete,
      timeToUsable: timeToUsable,
      isFullPageNavigation: isFullPageNavigation,
      path: path
    });
    var tags = {
      navigation_type: isFullPageNavigation ? 'full_page' : 'in_app',
      path: path
    };
    observe(GoldenMetrics.PageNavigation, tags, duration / 1000, true);
    observe(GoldenMetrics.PageTimeToComplete, tags, timeToComplete / 1000, true);
    observe(GoldenMetrics.PageTimeToUsable, tags, timeToUsable / 1000, true);
    sendMetrics();
  });
  useLifecycleEventListener(function (_ref2) {
    var type = _ref2.type,
      start = _ref2.start;
    observe(GoldenMetrics.PerformanceTime, {
      event_type: type
    }, start / 1000, true);
  });
  return /*#__PURE__*/jsx(MetricsContext.Provider, {
    value: {
      observe: observe,
      registry: registry.current,
      isReady: isReady,
      histogramBuckets: histogramBuckets,
      navigationData: navigationData,
      sendMetrics: sendMetrics,
      addObserveListener: addObserveListener,
      removeObserveListener: removeObserveListener
    },
    children: children
  });
};

export { GoldenMetrics, MetricsContext, MetricsDebugOverlay, MetricsLogger, MetricsProvider, useMetrics };
//# sourceMappingURL=index.js.map
