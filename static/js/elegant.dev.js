/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.bootstrap = factory());
})(this, (function() {
  "use strict";
  const elementMap = /* @__PURE__ */ new Map();
  const Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, /* @__PURE__ */ new Map());
      }
      const instanceMap = elementMap.get(element);
      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }
      instanceMap.set(key, instance);
    },
    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }
      return null;
    },
    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }
      const instanceMap = elementMap.get(element);
      instanceMap.delete(key);
      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }
  };
  const MAX_UID = 1e6;
  const MILLISECONDS_MULTIPLIER = 1e3;
  const TRANSITION_END = "transitionend";
  const parseSelector = (selector) => {
    if (selector && window.CSS && window.CSS.escape) {
      selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    }
    return selector;
  };
  const toType = (object) => {
    if (object === null || object === void 0) {
      return `${object}`;
    }
    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  const getUID = (prefix) => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
  };
  const getTransitionDurationFromElement = (element) => {
    if (!element) {
      return 0;
    }
    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }
    transitionDuration = transitionDuration.split(",")[0];
    transitionDelay = transitionDelay.split(",")[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };
  const triggerTransitionEnd = (element) => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };
  const isElement$1 = (object) => {
    if (!object || typeof object !== "object") {
      return false;
    }
    if (typeof object.jquery !== "undefined") {
      object = object[0];
    }
    return typeof object.nodeType !== "undefined";
  };
  const getElement = (object) => {
    if (isElement$1(object)) {
      return object.jquery ? object[0] : object;
    }
    if (typeof object === "string" && object.length > 0) {
      return document.querySelector(parseSelector(object));
    }
    return null;
  };
  const isVisible = (element) => {
    if (!isElement$1(element) || element.getClientRects().length === 0) {
      return false;
    }
    const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
    const closedDetails = element.closest("details:not([open])");
    if (!closedDetails) {
      return elementIsVisible;
    }
    if (closedDetails !== element) {
      const summary = element.closest("summary");
      if (summary && summary.parentNode !== closedDetails) {
        return false;
      }
      if (summary === null) {
        return false;
      }
    }
    return elementIsVisible;
  };
  const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    if (element.classList.contains("disabled")) {
      return true;
    }
    if (typeof element.disabled !== "undefined") {
      return element.disabled;
    }
    return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
  };
  const findShadowRoot = (element) => {
    if (!document.documentElement.attachShadow) {
      return null;
    }
    if (typeof element.getRootNode === "function") {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
      return element;
    }
    if (!element.parentNode) {
      return null;
    }
    return findShadowRoot(element.parentNode);
  };
  const noop = () => {
  };
  const reflow = (element) => {
    element.offsetHeight;
  };
  const getjQuery = () => {
    if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
      return window.jQuery;
    }
    return null;
  };
  const DOMContentLoadedCallbacks = [];
  const onDOMContentLoaded = (callback) => {
    if (document.readyState === "loading") {
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener("DOMContentLoaded", () => {
          for (const callback2 of DOMContentLoadedCallbacks) {
            callback2();
          }
        });
      }
      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };
  const isRTL = () => document.documentElement.dir === "rtl";
  const defineJQueryPlugin = (plugin) => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;
        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };
  const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
  };
  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }
      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };
  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    const listLength = list.length;
    let index = list.indexOf(activeElement);
    if (index === -1) {
      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
    }
    index += shouldGetNext ? 1 : -1;
    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }
    return list[Math.max(0, Math.min(index, listLength - 1))];
  };
  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {};
  let uidEvent = 1;
  const customEvents = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };
  const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
  function makeEventUid(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }
  function getElementEvents(element) {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }
  function bootstrapHandler(element, fn) {
    return function handler(event) {
      hydrateObj(event, {
        delegateTarget: element
      });
      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }
      return fn.apply(element, [event]);
    };
  }
  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (const domElement of domElements) {
          if (domElement !== target) {
            continue;
          }
          hydrateObj(event, {
            delegateTarget: target
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      }
    };
  }
  function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
  }
  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    const isDelegated = typeof handler === "string";
    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
    let typeEvent = getTypeEvent(originalTypeEvent);
    if (!nativeEvents.has(typeEvent)) {
      typeEvent = originalTypeEvent;
    }
    return [isDelegated, callable, typeEvent];
  }
  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }
    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    if (originalTypeEvent in customEvents) {
      const wrapFunction = (fn2) => {
        return function(event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn2.call(this, event);
          }
        };
      };
      callable = wrapFunction(callable);
    }
    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    if (previousFunction) {
      previousFunction.oneOff = previousFunction.oneOff && oneOff;
      return;
    }
    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, isDelegated);
  }
  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
      return;
    }
    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
      if (handlerKey.includes(namespace)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  }
  function getTypeEvent(event) {
    event = event.replace(stripNameRegex, "");
    return customEvents[event] || event;
  }
  const EventHandler = {
    on(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, false);
    },
    one(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, true);
    },
    off(element, originalTypeEvent, handler, delegationFunction) {
      if (typeof originalTypeEvent !== "string" || !element) {
        return;
      }
      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getElementEvents(element);
      const storeElementEvent = events[typeEvent] || {};
      const isNamespace = originalTypeEvent.startsWith(".");
      if (typeof callable !== "undefined") {
        if (!Object.keys(storeElementEvent).length) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
        return;
      }
      if (isNamespace) {
        for (const elementEvent of Object.keys(events)) {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
        const handlerKey = keyHandlers.replace(stripUidRegex, "");
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    },
    trigger(element, event, args) {
      if (typeof event !== "string" || !element) {
        return null;
      }
      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      let jQueryEvent = null;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }
      const evt = hydrateObj(new Event(event, {
        bubbles,
        cancelable: true
      }), args);
      if (defaultPrevented) {
        evt.preventDefault();
      }
      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }
      if (evt.defaultPrevented && jQueryEvent) {
        jQueryEvent.preventDefault();
      }
      return evt;
    }
  };
  function hydrateObj(obj, meta = {}) {
    for (const [key, value] of Object.entries(meta)) {
      try {
        obj[key] = value;
      } catch (_unused) {
        Object.defineProperty(obj, key, {
          configurable: true,
          get() {
            return value;
          }
        });
      }
    }
    return obj;
  }
  function normalizeData(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (value === Number(value).toString()) {
      return Number(value);
    }
    if (value === "" || value === "null") {
      return null;
    }
    if (typeof value !== "string") {
      return value;
    }
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (_unused) {
      return value;
    }
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
  }
  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },
    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },
    getDataAttributes(element) {
      if (!element) {
        return {};
      }
      const attributes = {};
      const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
      for (const key of bsKeys) {
        let pureKey = key.replace(/^bs/, "");
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      }
      return attributes;
    },
    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    }
  };
  class Config {
    // Getters
    static get Default() {
      return {};
    }
    static get DefaultType() {
      return {};
    }
    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      return config;
    }
    _mergeConfigObj(config, element) {
      const jsonConfig = isElement$1(element) ? Manipulator.getDataAttribute(element, "config") : {};
      return {
        ...this.constructor.Default,
        ...typeof jsonConfig === "object" ? jsonConfig : {},
        ...isElement$1(element) ? Manipulator.getDataAttributes(element) : {},
        ...typeof config === "object" ? config : {}
      };
    }
    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
      for (const [property, expectedTypes] of Object.entries(configTypes)) {
        const value = config[property];
        const valueType = isElement$1(value) ? "element" : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      }
    }
  }
  const VERSION = "5.3.8";
  class BaseComponent extends Config {
    constructor(element, config) {
      super();
      element = getElement(element);
      if (!element) {
        return;
      }
      this._element = element;
      this._config = this._getConfig(config);
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }
    // Public
    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }
    // Private
    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    // Static
    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
    }
    static get VERSION() {
      return VERSION;
    }
    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }
    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }
    static eventName(name) {
      return `${name}${this.EVENT_KEY}`;
    }
  }
  const getSelector = (element) => {
    let selector = element.getAttribute("data-bs-target");
    if (!selector || selector === "#") {
      let hrefAttribute = element.getAttribute("href");
      if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
        return null;
      }
      if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
        hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
      }
      selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
    }
    return selector ? selector.split(",").map((sel) => parseSelector(sel)).join(",") : null;
  };
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },
    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },
    children(element, selector) {
      return [].concat(...element.children).filter((child) => child.matches(selector));
    },
    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode.closest(selector);
      while (ancestor) {
        parents.push(ancestor);
        ancestor = ancestor.parentNode.closest(selector);
      }
      return parents;
    },
    prev(element, selector) {
      let previous = element.previousElementSibling;
      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }
        previous = previous.previousElementSibling;
      }
      return [];
    },
    // TODO: this is now unused; remove later along with prev()
    next(element, selector) {
      let next = element.nextElementSibling;
      while (next) {
        if (next.matches(selector)) {
          return [next];
        }
        next = next.nextElementSibling;
      }
      return [];
    },
    focusableChildren(element) {
      const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
      return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
    },
    getSelectorFromElement(element) {
      const selector = getSelector(element);
      if (selector) {
        return SelectorEngine.findOne(selector) ? selector : null;
      }
      return null;
    },
    getElementFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.findOne(selector) : null;
    },
    getMultipleElementsFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.find(selector) : [];
    }
  };
  const enableDismissTrigger = (component, method = "hide") => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target);
      instance[method]();
    });
  };
  const NAME$f = "alert";
  const DATA_KEY$a = "bs.alert";
  const EVENT_KEY$b = `.${DATA_KEY$a}`;
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const CLASS_NAME_FADE$5 = "fade";
  const CLASS_NAME_SHOW$8 = "show";
  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$f;
    }
    // Public
    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
      if (closeEvent.defaultPrevented) {
        return;
      }
      this._element.classList.remove(CLASS_NAME_SHOW$8);
      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    }
    // Private
    _destroyElement() {
      this._element.remove();
      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Alert.getOrCreateInstance(this);
        if (typeof config !== "string") {
          return;
        }
        if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }
  enableDismissTrigger(Alert, "close");
  defineJQueryPlugin(Alert);
  const NAME$e = "button";
  const DATA_KEY$9 = "bs.button";
  const EVENT_KEY$a = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = ".data-api";
  const CLASS_NAME_ACTIVE$3 = "active";
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$e;
    }
    // Public
    toggle() {
      this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Button.getOrCreateInstance(this);
        if (config === "toggle") {
          data[config]();
        }
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event) => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });
  defineJQueryPlugin(Button);
  const NAME$d = "swipe";
  const EVENT_KEY$9 = ".bs.swipe";
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const POINTER_TYPE_TOUCH = "touch";
  const POINTER_TYPE_PEN = "pen";
  const CLASS_NAME_POINTER_EVENT = "pointer-event";
  const SWIPE_THRESHOLD = 40;
  const Default$c = {
    endCallback: null,
    leftCallback: null,
    rightCallback: null
  };
  const DefaultType$c = {
    endCallback: "(function|null)",
    leftCallback: "(function|null)",
    rightCallback: "(function|null)"
  };
  class Swipe extends Config {
    constructor(element, config) {
      super();
      this._element = element;
      if (!element || !Swipe.isSupported()) {
        return;
      }
      this._config = this._getConfig(config);
      this._deltaX = 0;
      this._supportPointerEvents = Boolean(window.PointerEvent);
      this._initEvents();
    }
    // Getters
    static get Default() {
      return Default$c;
    }
    static get DefaultType() {
      return DefaultType$c;
    }
    static get NAME() {
      return NAME$d;
    }
    // Public
    dispose() {
      EventHandler.off(this._element, EVENT_KEY$9);
    }
    // Private
    _start(event) {
      if (!this._supportPointerEvents) {
        this._deltaX = event.touches[0].clientX;
        return;
      }
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX;
      }
    }
    _end(event) {
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX - this._deltaX;
      }
      this._handleSwipe();
      execute(this._config.endCallback);
    }
    _move(event) {
      this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
    }
    _handleSwipe() {
      const absDeltaX = Math.abs(this._deltaX);
      if (absDeltaX <= SWIPE_THRESHOLD) {
        return;
      }
      const direction = absDeltaX / this._deltaX;
      this._deltaX = 0;
      if (!direction) {
        return;
      }
      execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
    }
    _initEvents() {
      if (this._supportPointerEvents) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
      }
    }
    _eventIsPointerPenTouch(event) {
      return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    }
    // Static
    static isSupported() {
      return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
    }
  }
  const NAME$c = "carousel";
  const DATA_KEY$8 = "bs.carousel";
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = ".data-api";
  const ARROW_LEFT_KEY$1 = "ArrowLeft";
  const ARROW_RIGHT_KEY$1 = "ArrowRight";
  const TOUCHEVENT_COMPAT_WAIT = 500;
  const ORDER_NEXT = "next";
  const ORDER_PREV = "prev";
  const DIRECTION_LEFT = "left";
  const DIRECTION_RIGHT = "right";
  const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
  const EVENT_SLID = `slid${EVENT_KEY$8}`;
  const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
  const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
  const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
  const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_CAROUSEL = "carousel";
  const CLASS_NAME_ACTIVE$2 = "active";
  const CLASS_NAME_SLIDE = "slide";
  const CLASS_NAME_END = "carousel-item-end";
  const CLASS_NAME_START = "carousel-item-start";
  const CLASS_NAME_NEXT = "carousel-item-next";
  const CLASS_NAME_PREV = "carousel-item-prev";
  const SELECTOR_ACTIVE = ".active";
  const SELECTOR_ITEM = ".carousel-item";
  const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
  const SELECTOR_ITEM_IMG = ".carousel-item img";
  const SELECTOR_INDICATORS = ".carousel-indicators";
  const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
  };
  const Default$b = {
    interval: 5e3,
    keyboard: true,
    pause: "hover",
    ride: false,
    touch: true,
    wrap: true
  };
  const DefaultType$b = {
    interval: "(number|boolean)",
    // TODO:v6 remove boolean support
    keyboard: "boolean",
    pause: "(string|boolean)",
    ride: "(boolean|string)",
    touch: "boolean",
    wrap: "boolean"
  };
  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._interval = null;
      this._activeElement = null;
      this._isSliding = false;
      this.touchTimeout = null;
      this._swipeHelper = null;
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._addEventListeners();
      if (this._config.ride === CLASS_NAME_CAROUSEL) {
        this.cycle();
      }
    }
    // Getters
    static get Default() {
      return Default$b;
    }
    static get DefaultType() {
      return DefaultType$b;
    }
    static get NAME() {
      return NAME$c;
    }
    // Public
    next() {
      this._slide(ORDER_NEXT);
    }
    nextWhenVisible() {
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }
    prev() {
      this._slide(ORDER_PREV);
    }
    pause() {
      if (this._isSliding) {
        triggerTransitionEnd(this._element);
      }
      this._clearInterval();
    }
    cycle() {
      this._clearInterval();
      this._updateInterval();
      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
    }
    _maybeEnableCycle() {
      if (!this._config.ride) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
        return;
      }
      this.cycle();
    }
    to(index) {
      const items = this._getItems();
      if (index > items.length - 1 || index < 0) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }
      const activeIndex = this._getItemIndex(this._getActive());
      if (activeIndex === index) {
        return;
      }
      const order2 = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
      this._slide(order2, items[index]);
    }
    dispose() {
      if (this._swipeHelper) {
        this._swipeHelper.dispose();
      }
      super.dispose();
    }
    // Private
    _configAfterMerge(config) {
      config.defaultInterval = config.interval;
      return config;
    }
    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN$1, (event) => this._keydown(event));
      }
      if (this._config.pause === "hover") {
        EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
        EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
      }
      if (this._config.touch && Swipe.isSupported()) {
        this._addTouchEventListeners();
      }
    }
    _addTouchEventListeners() {
      for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
        EventHandler.on(img, EVENT_DRAG_START, (event) => event.preventDefault());
      }
      const endCallBack = () => {
        if (this._config.pause !== "hover") {
          return;
        }
        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      };
      const swipeConfig = {
        leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
        rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
        endCallback: endCallBack
      };
      this._swipeHelper = new Swipe(this._element, swipeConfig);
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        this._slide(this._directionToOrder(direction));
      }
    }
    _getItemIndex(element) {
      return this._getItems().indexOf(element);
    }
    _setActiveIndicatorElement(index) {
      if (!this._indicatorsElement) {
        return;
      }
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute("aria-current");
      const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
      if (newActiveIndicator) {
        newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
        newActiveIndicator.setAttribute("aria-current", "true");
      }
    }
    _updateInterval() {
      const element = this._activeElement || this._getActive();
      if (!element) {
        return;
      }
      const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
      this._config.interval = elementInterval || this._config.defaultInterval;
    }
    _slide(order2, element = null) {
      if (this._isSliding) {
        return;
      }
      const activeElement = this._getActive();
      const isNext = order2 === ORDER_NEXT;
      const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
      if (nextElement === activeElement) {
        return;
      }
      const nextElementIndex = this._getItemIndex(nextElement);
      const triggerEvent = (eventName) => {
        return EventHandler.trigger(this._element, eventName, {
          relatedTarget: nextElement,
          direction: this._orderToDirection(order2),
          from: this._getItemIndex(activeElement),
          to: nextElementIndex
        });
      };
      const slideEvent = triggerEvent(EVENT_SLIDE);
      if (slideEvent.defaultPrevented) {
        return;
      }
      if (!activeElement || !nextElement) {
        return;
      }
      const isCycling = Boolean(this._interval);
      this.pause();
      this._isSliding = true;
      this._setActiveIndicatorElement(nextElementIndex);
      this._activeElement = nextElement;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        triggerEvent(EVENT_SLID);
      };
      this._queueCallback(completeCallBack, activeElement, this._isAnimated());
      if (isCycling) {
        this.cycle();
      }
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_SLIDE);
    }
    _getActive() {
      return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    }
    _getItems() {
      return SelectorEngine.find(SELECTOR_ITEM, this._element);
    }
    _clearInterval() {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
    _directionToOrder(direction) {
      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }
      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }
    _orderToDirection(order2) {
      if (isRTL()) {
        return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }
      return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Carousel.getOrCreateInstance(this, config);
        if (typeof config === "number") {
          data.to(config);
          return;
        }
        if (typeof config === "string") {
          if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function(event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }
    event.preventDefault();
    const carousel = Carousel.getOrCreateInstance(target);
    const slideIndex = this.getAttribute("data-bs-slide-to");
    if (slideIndex) {
      carousel.to(slideIndex);
      carousel._maybeEnableCycle();
      return;
    }
    if (Manipulator.getDataAttribute(this, "slide") === "next") {
      carousel.next();
      carousel._maybeEnableCycle();
      return;
    }
    carousel.prev();
    carousel._maybeEnableCycle();
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (const carousel of carousels) {
      Carousel.getOrCreateInstance(carousel);
    }
  });
  defineJQueryPlugin(Carousel);
  const NAME$b = "collapse";
  const DATA_KEY$7 = "bs.collapse";
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = ".data-api";
  const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
  const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = "show";
  const CLASS_NAME_COLLAPSE = "collapse";
  const CLASS_NAME_COLLAPSING = "collapsing";
  const CLASS_NAME_COLLAPSED = "collapsed";
  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
  const CLASS_NAME_HORIZONTAL = "collapse-horizontal";
  const WIDTH = "width";
  const HEIGHT = "height";
  const SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  const Default$a = {
    parent: null,
    toggle: true
  };
  const DefaultType$a = {
    parent: "(null|element)",
    toggle: "boolean"
  };
  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
      for (const elem of toggleList) {
        const selector = SelectorEngine.getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
        if (selector !== null && filterElement.length) {
          this._triggerArray.push(elem);
        }
      }
      this._initializeChildren();
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }
    // Getters
    static get Default() {
      return Default$a;
    }
    static get DefaultType() {
      return DefaultType$a;
    }
    static get NAME() {
      return NAME$b;
    }
    // Public
    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }
      let activeChildren = [];
      if (this._config.parent) {
        activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => Collapse.getOrCreateInstance(element, {
          toggle: false
        }));
      }
      if (activeChildren.length && activeChildren[0]._isTransitioning) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      for (const activeInstance of activeChildren) {
        activeInstance.hide();
      }
      const dimension = this._getDimension();
      this._element.classList.remove(CLASS_NAME_COLLAPSE);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      this._addAriaAndCollapsedClass(this._triggerArray, true);
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
        this._element.style[dimension] = "";
        EventHandler.trigger(this._element, EVENT_SHOWN$6);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      this._queueCallback(complete, this._element, true);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      for (const trigger of this._triggerArray) {
        const element = SelectorEngine.getElementFromSelector(trigger);
        if (element && !this._isShown(element)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE);
        EventHandler.trigger(this._element, EVENT_HIDDEN$6);
      };
      this._element.style[dimension] = "";
      this._queueCallback(complete, this._element, true);
    }
    // Private
    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
    }
    _configAfterMerge(config) {
      config.toggle = Boolean(config.toggle);
      config.parent = getElement(config.parent);
      return config;
    }
    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }
    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }
      const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
      for (const element of children) {
        const selected = SelectorEngine.getElementFromSelector(element);
        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      }
    }
    _getFirstLevelChildren(selector) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
    }
    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }
      for (const element of triggerArray) {
        element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
        element.setAttribute("aria-expanded", isOpen);
      }
    }
    // Static
    static jQueryInterface(config) {
      const _config = {};
      if (typeof config === "string" && /show|hide/.test(config)) {
        _config.toggle = false;
      }
      return this.each(function() {
        const data = Collapse.getOrCreateInstance(this, _config);
        if (typeof config === "string") {
          if (typeof data[config] === "undefined") {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event) {
    if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") {
      event.preventDefault();
    }
    for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    }
  });
  defineJQueryPlugin(Collapse);
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }
  function getWindow(node) {
    if (node == null) {
      return window;
    }
    if (node.toString() !== "[object Window]") {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
  }
  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }
  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }
  function isShadowRoot(node) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name];
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(name2) {
        var value = attributes[name2];
        if (value === false) {
          element.removeAttribute(name2);
        } else {
          element.setAttribute(name2, value === true ? "" : value);
        }
      });
    });
  }
  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state.elements).forEach(function(name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
        var style = styleProperties.reduce(function(style2, property) {
          style2[property] = "";
          return style2;
        }, {});
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  const applyStyles$1 = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect: effect$2,
    requires: ["computeStyles"]
  };
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }
  var max = Math.max;
  var min = Math.min;
  var round = Math.round;
  function getUAString() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function(item2) {
        return item2.brand + "/" + item2.version;
      }).join(" ");
    }
    return navigator.userAgent;
  }
  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width,
      height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x,
      y
    };
  }
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element);
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }
    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width,
      height
    };
  }
  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode();
    if (parent.contains(child)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;
      do {
        if (next && parent.isSameNode(next)) {
          return true;
        }
        next = next.parentNode || next.host;
      } while (next);
    }
    return false;
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }
  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : (
      // $FlowFixMe[prop-missing]
      element.document
    )) || window.document).documentElement;
  }
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || // DOM Element detected
      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element)
    );
  }
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());
    if (isIE && isHTMLElement(element)) {
      var elementCss = getComputedStyle$1(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode);
      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }
  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min2, value, max2) {
    var v = within(min2, value, max2);
    return v > max2 ? max2 : v;
  }
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }
  function expandToHashMap(value, keys) {
    return keys.reduce(function(hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }
  var toPaddingObject = function toPaddingObject2(padding, state) {
    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  };
  function arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets2) {
      return;
    }
    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
    var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2;
    var min2 = paddingObject[minProp];
    var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset2 = within(min2, center, max2);
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
  }
  function effect$1(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) {
      return;
    }
    if (typeof arrowElement === "string") {
      arrowElement = state.elements.popper.querySelector(arrowElement);
      if (!arrowElement) {
        return;
      }
    }
    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }
    state.elements.arrow = arrowElement;
  }
  const arrow$1 = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect$1,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };
  function getVariation(placement) {
    return placement.split("-")[1];
  }
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x, y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x,
      y
    }) : {
      x,
      y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper2);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper2)) {
        offsetParent = getDocumentElement(popper2);
        if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
          // $FlowFixMe[prop-missing]
          offsetParent[heightProp]
        );
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
          // $FlowFixMe[prop-missing]
          offsetParent[widthProp]
        );
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x,
      y
    }, getWindow(popper2)) : {
      x,
      y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration,
      isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    });
  }
  const computeStyles$1 = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };
  var passive = {
    passive: true
  };
  function effect(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance.update, passive);
      }
    };
  }
  const eventListeners = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {
    },
    effect,
    data: {}
  };
  var hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
      return hash$1[matched];
    });
  }
  var hash = {
    start: "end",
    end: "start"
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function(matched) {
      return hash[matched];
    });
  }
  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }
  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();
      if (layoutViewport || !layoutViewport && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x: x + getWindowScrollBarX(element),
      y
    };
  }
  function getDocumentRect(element) {
    var _element$ownerDocumen;
    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;
    if (getComputedStyle$1(body || html).direction === "rtl") {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }
  function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
      return node.ownerDocument.body;
    }
    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }
    return getScrollParent(getParentNode(node));
  }
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : (
      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)))
    );
  }
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }
  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  }
  function getClippingParents(element) {
    var clippingParents2 = listScrollParents(getParentNode(element));
    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
    if (!isElement(clipperElement)) {
      return [];
    }
    return clippingParents2.filter(function(clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
    });
  }
  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents2[0];
    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }
  function computeOffsets(_ref) {
    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference2.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference2.y + reference2.height
        };
        break;
      case right:
        offsets = {
          x: reference2.x + reference2.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference2.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference2.x,
          y: reference2.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
          break;
      }
    }
    return offsets;
  }
  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets2 = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset2 = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function(key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset2[axis] * multiply;
      });
    }
    return overflowOffsets;
  }
  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
      return getVariation(placement2) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function(placement2) {
      return allowedAutoPlacements.indexOf(placement2) >= 0;
    });
    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    }
    var overflows = allowedPlacements.reduce(function(acc, placement2) {
      acc[placement2] = detectOverflow(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding
      })[getBasePlacement(placement2)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b) {
      return overflows[a] - overflows[b];
    });
  }
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }
  function flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) {
      return;
    }
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
      return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements
      }) : placement2);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = /* @__PURE__ */ new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements2[0];
    for (var i = 0; i < placements2.length; i++) {
      var placement = placements2[i];
      var _basePlacement = getBasePlacement(placement);
      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state, {
        placement,
        boundary,
        rootBoundary,
        altBoundary,
        padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }
      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];
      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }
      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }
      if (checks.every(function(check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }
      checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
      var numberOfChecks = flipVariations ? 3 : 1;
      var _loop = function _loop2(_i2) {
        var fittingPlacement = placements2.find(function(placement2) {
          var checks2 = checksMap.get(placement2);
          if (checks2) {
            return checks2.slice(0, _i2).every(function(check) {
              return check;
            });
          }
        });
        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };
      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);
        if (_ret === "break") break;
      }
    }
    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  }
  const flip$1 = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false
    }
  };
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }
    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function(side) {
      return overflow[side] >= 0;
    });
  }
  function hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: "reference"
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets,
      popperEscapeOffsets,
      isReferenceHidden,
      hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    });
  }
  const hide$1 = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };
  function distanceAndSkiddingToXY(placement, rects, offset2) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
      placement
    })) : offset2, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }
    state.modifiersData[name] = data;
  }
  const offset$1 = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };
  function popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      placement: state.placement
    });
  }
  const popperOffsets$1 = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };
  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary,
      rootBoundary,
      padding,
      altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };
    if (!popperOffsets2) {
      return;
    }
    if (checkMainAxis) {
      var _offsetModifierState$;
      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset2 = popperOffsets2[mainAxis];
      var min$1 = offset2 + overflow[mainSide];
      var max$1 = offset2 - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide];
      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset2 + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _offsetModifierState$2;
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _len = altAxis === "y" ? "height" : "width";
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
  }
  const preventOverflow$1 = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }
  function order(modifiers) {
    var map = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
      map.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result;
  }
  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }
  function debounce(fn) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve(fn());
          });
        });
      }
      return pending;
    };
  }
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function(merged2, current) {
      var existing = merged2[current.name];
      merged2[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference2, popper2, options) {
      if (options === void 0) {
        options = defaultOptions;
      }
      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference2,
          popper: popper2
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options2);
          state.scrollParents = {
            reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
            popper: listScrollParents(popper2)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
          state.orderedModifiers = orderedModifiers.filter(function(m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
          if (!areValidElements(reference3, popper3)) {
            return;
          }
          state.rects = {
            reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
            popper: getLayoutRect(popper3)
          };
          state.reset = false;
          state.placement = state.options.placement;
          state.orderedModifiers.forEach(function(modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }
            var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
            if (typeof fn === "function") {
              state = fn({
                state,
                options: _options,
                name,
                instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function() {
          return new Promise(function(resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference2, popper2)) {
        return instance;
      }
      instance.setOptions(options).then(function(state2) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state2);
        }
      });
      function runModifierEffects() {
        state.orderedModifiers.forEach(function(_ref) {
          var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
          if (typeof effect2 === "function") {
            var cleanupFn = effect2({
              state,
              name,
              instance,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn) {
          return fn();
        });
        effectCleanupFns = [];
      }
      return instance;
    };
  }
  var createPopper$2 = /* @__PURE__ */ popperGenerator();
  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /* @__PURE__ */ popperGenerator({
    defaultModifiers: defaultModifiers$1
  });
  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });
  const Popper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    afterMain,
    afterRead,
    afterWrite,
    applyStyles: applyStyles$1,
    arrow: arrow$1,
    auto,
    basePlacements,
    beforeMain,
    beforeRead,
    beforeWrite,
    bottom,
    clippingParents,
    computeStyles: computeStyles$1,
    createPopper,
    createPopperBase: createPopper$2,
    createPopperLite: createPopper$1,
    detectOverflow,
    end,
    eventListeners,
    flip: flip$1,
    hide: hide$1,
    left,
    main,
    modifierPhases,
    offset: offset$1,
    placements,
    popper,
    popperGenerator,
    popperOffsets: popperOffsets$1,
    preventOverflow: preventOverflow$1,
    read,
    reference,
    right,
    start,
    top,
    variationPlacements,
    viewport,
    write
  }, Symbol.toStringTag, { value: "Module" }));
  const NAME$a = "dropdown";
  const DATA_KEY$6 = "bs.dropdown";
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = ".data-api";
  const ESCAPE_KEY$2 = "Escape";
  const TAB_KEY$1 = "Tab";
  const ARROW_UP_KEY$1 = "ArrowUp";
  const ARROW_DOWN_KEY$1 = "ArrowDown";
  const RIGHT_MOUSE_BUTTON = 2;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_SHOW$6 = "show";
  const CLASS_NAME_DROPUP = "dropup";
  const CLASS_NAME_DROPEND = "dropend";
  const CLASS_NAME_DROPSTART = "dropstart";
  const CLASS_NAME_DROPUP_CENTER = "dropup-center";
  const CLASS_NAME_DROPDOWN_CENTER = "dropdown-center";
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
  const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
  const SELECTOR_MENU = ".dropdown-menu";
  const SELECTOR_NAVBAR = ".navbar";
  const SELECTOR_NAVBAR_NAV = ".navbar-nav";
  const SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
  const PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
  const PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
  const PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
  const PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
  const PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
  const PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
  const PLACEMENT_TOPCENTER = "top";
  const PLACEMENT_BOTTOMCENTER = "bottom";
  const Default$9 = {
    autoClose: true,
    boundary: "clippingParents",
    display: "dynamic",
    offset: [0, 2],
    popperConfig: null,
    reference: "toggle"
  };
  const DefaultType$9 = {
    autoClose: "(boolean|string)",
    boundary: "(string|element)",
    display: "string",
    offset: "(array|string|function)",
    popperConfig: "(null|object|function)",
    reference: "(string|element|object)"
  };
  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._popper = null;
      this._parent = this._element.parentNode;
      this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
      this._inNavbar = this._detectNavbar();
    }
    // Getters
    static get Default() {
      return Default$9;
    }
    static get DefaultType() {
      return DefaultType$9;
    }
    static get NAME() {
      return NAME$a;
    }
    // Public
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (isDisabled(this._element) || this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._createPopper();
      if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, "mouseover", noop);
        }
      }
      this._element.focus();
      this._element.setAttribute("aria-expanded", true);
      this._menu.classList.add(CLASS_NAME_SHOW$6);
      this._element.classList.add(CLASS_NAME_SHOW$6);
      EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
    }
    hide() {
      if (isDisabled(this._element) || !this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      this._completeHide(relatedTarget);
    }
    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }
      super.dispose();
    }
    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper) {
        this._popper.update();
      }
    }
    // Private
    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
      if (hideEvent.defaultPrevented) {
        return;
      }
      if ("ontouchstart" in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, "mouseover", noop);
        }
      }
      if (this._popper) {
        this._popper.destroy();
      }
      this._menu.classList.remove(CLASS_NAME_SHOW$6);
      this._element.classList.remove(CLASS_NAME_SHOW$6);
      this._element.setAttribute("aria-expanded", "false");
      Manipulator.removeDataAttribute(this._menu, "popper");
      EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
    }
    _getConfig(config) {
      config = super._getConfig(config);
      if (typeof config.reference === "object" && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== "function") {
        throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }
      return config;
    }
    _createPopper() {
      if (typeof Popper === "undefined") {
        throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");
      }
      let referenceElement = this._element;
      if (this._config.reference === "parent") {
        referenceElement = this._parent;
      } else if (isElement$1(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === "object") {
        referenceElement = this._config.reference;
      }
      const popperConfig = this._getPopperConfig();
      this._popper = createPopper(referenceElement, this._menu, popperConfig);
    }
    _isShown() {
      return this._menu.classList.contains(CLASS_NAME_SHOW$6);
    }
    _getPlacement() {
      const parentDropdown = this._parent;
      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
        return PLACEMENT_TOPCENTER;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
        return PLACEMENT_BOTTOMCENTER;
      }
      const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }
      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }
    _detectNavbar() {
      return this._element.closest(SELECTOR_NAVBAR) !== null;
    }
    _getOffset() {
      const {
        offset: offset2
      } = this._config;
      if (typeof offset2 === "string") {
        return offset2.split(",").map((value) => Number.parseInt(value, 10));
      }
      if (typeof offset2 === "function") {
        return (popperData) => offset2(popperData, this._element);
      }
      return offset2;
    }
    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }]
      };
      if (this._inNavbar || this._config.display === "static") {
        Manipulator.setDataAttribute(this._menu, "popper", "static");
        defaultBsPopperConfig.modifiers = [{
          name: "applyStyles",
          enabled: false
        }];
      }
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [void 0, defaultBsPopperConfig])
      };
    }
    _selectMenuItem({
      key,
      target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => isVisible(element));
      if (!items.length) {
        return;
      }
      getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Dropdown.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
    static clearMenus(event) {
      if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY$1) {
        return;
      }
      const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
      for (const toggle of openToggles) {
        const context = Dropdown.getInstance(toggle);
        if (!context || context._config.autoClose === false) {
          continue;
        }
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) {
          continue;
        }
        if (context._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }
        const relatedTarget = {
          relatedTarget: context._element
        };
        if (event.type === "click") {
          relatedTarget.clickEvent = event;
        }
        context._completeHide(relatedTarget);
      }
    }
    static dataApiKeydownHandler(event) {
      const isInput = /input|textarea/i.test(event.target.tagName);
      const isEscapeEvent = event.key === ESCAPE_KEY$2;
      const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
      if (!isUpOrDownEvent && !isEscapeEvent) {
        return;
      }
      if (isInput && !isEscapeEvent) {
        return;
      }
      event.preventDefault();
      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
      const instance = Dropdown.getOrCreateInstance(getToggleButton);
      if (isUpOrDownEvent) {
        event.stopPropagation();
        instance.show();
        instance._selectMenuItem(event);
        return;
      }
      if (instance._isShown()) {
        event.stopPropagation();
        instance.hide();
        getToggleButton.focus();
      }
    }
  }
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  });
  defineJQueryPlugin(Dropdown);
  const NAME$9 = "backdrop";
  const CLASS_NAME_FADE$4 = "fade";
  const CLASS_NAME_SHOW$5 = "show";
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
  const Default$8 = {
    className: "modal-backdrop",
    clickCallback: null,
    isAnimated: false,
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    rootElement: "body"
    // give the choice to place backdrop under different elements
  };
  const DefaultType$8 = {
    className: "string",
    clickCallback: "(function|null)",
    isAnimated: "boolean",
    isVisible: "boolean",
    rootElement: "(element|string)"
  };
  class Backdrop extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }
    // Getters
    static get Default() {
      return Default$8;
    }
    static get DefaultType() {
      return DefaultType$8;
    }
    static get NAME() {
      return NAME$9;
    }
    // Public
    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._append();
      const element = this._getElement();
      if (this._config.isAnimated) {
        reflow(element);
      }
      element.classList.add(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        execute(callback);
      });
    }
    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._getElement().classList.remove(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    }
    dispose() {
      if (!this._isAppended) {
        return;
      }
      EventHandler.off(this._element, EVENT_MOUSEDOWN);
      this._element.remove();
      this._isAppended = false;
    }
    // Private
    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement("div");
        backdrop.className = this._config.className;
        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
        }
        this._element = backdrop;
      }
      return this._element;
    }
    _configAfterMerge(config) {
      config.rootElement = getElement(config.rootElement);
      return config;
    }
    _append() {
      if (this._isAppended) {
        return;
      }
      const element = this._getElement();
      this._config.rootElement.append(element);
      EventHandler.on(element, EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }
    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }
  }
  const NAME$8 = "focustrap";
  const DATA_KEY$5 = "bs.focustrap";
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
  const TAB_KEY = "Tab";
  const TAB_NAV_FORWARD = "forward";
  const TAB_NAV_BACKWARD = "backward";
  const Default$7 = {
    autofocus: true,
    trapElement: null
    // The element to trap focus inside of
  };
  const DefaultType$7 = {
    autofocus: "boolean",
    trapElement: "element"
  };
  class FocusTrap extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }
    // Getters
    static get Default() {
      return Default$7;
    }
    static get DefaultType() {
      return DefaultType$7;
    }
    static get NAME() {
      return NAME$8;
    }
    // Public
    activate() {
      if (this._isActive) {
        return;
      }
      if (this._config.autofocus) {
        this._config.trapElement.focus();
      }
      EventHandler.off(document, EVENT_KEY$5);
      EventHandler.on(document, EVENT_FOCUSIN$2, (event) => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
      this._isActive = true;
    }
    deactivate() {
      if (!this._isActive) {
        return;
      }
      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$5);
    }
    // Private
    _handleFocusin(event) {
      const {
        trapElement
      } = this._config;
      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
        return;
      }
      const elements = SelectorEngine.focusableChildren(trapElement);
      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }
    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }
      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    }
  }
  const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
  const SELECTOR_STICKY_CONTENT = ".sticky-top";
  const PROPERTY_PADDING = "padding-right";
  const PROPERTY_MARGIN = "margin-right";
  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }
    // Public
    getWidth() {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
      const width = this.getWidth();
      this._disableOverFlow();
      this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
    }
    reset() {
      this._resetElementAttributes(this._element, "overflow");
      this._resetElementAttributes(this._element, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
    }
    isOverflowing() {
      return this.getWidth() > 0;
    }
    // Private
    _disableOverFlow() {
      this._saveInitialAttribute(this._element, "overflow");
      this._element.style.overflow = "hidden";
    }
    _setElementAttributes(selector, styleProperty, callback) {
      const scrollbarWidth = this.getWidth();
      const manipulationCallBack = (element) => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }
        this._saveInitialAttribute(element, styleProperty);
        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _saveInitialAttribute(element, styleProperty) {
      const actualValue = element.style.getPropertyValue(styleProperty);
      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProperty, actualValue);
      }
    }
    _resetElementAttributes(selector, styleProperty) {
      const manipulationCallBack = (element) => {
        const value = Manipulator.getDataAttribute(element, styleProperty);
        if (value === null) {
          element.style.removeProperty(styleProperty);
          return;
        }
        Manipulator.removeDataAttribute(element, styleProperty);
        element.style.setProperty(styleProperty, value);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
      if (isElement$1(selector)) {
        callBack(selector);
        return;
      }
      for (const sel of SelectorEngine.find(selector, this._element)) {
        callBack(sel);
      }
    }
  }
  const NAME$7 = "modal";
  const DATA_KEY$4 = "bs.modal";
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const DATA_API_KEY$2 = ".data-api";
  const ESCAPE_KEY$1 = "Escape";
  const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
  const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
  const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
  const CLASS_NAME_OPEN = "modal-open";
  const CLASS_NAME_FADE$3 = "fade";
  const CLASS_NAME_SHOW$4 = "show";
  const CLASS_NAME_STATIC = "modal-static";
  const OPEN_SELECTOR$1 = ".modal.show";
  const SELECTOR_DIALOG = ".modal-dialog";
  const SELECTOR_MODAL_BODY = ".modal-body";
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const Default$6 = {
    backdrop: true,
    focus: true,
    keyboard: true
  };
  const DefaultType$6 = {
    backdrop: "(boolean|string)",
    focus: "boolean",
    keyboard: "boolean"
  };
  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
      this._addEventListeners();
    }
    // Getters
    static get Default() {
      return Default$6;
    }
    static get DefaultType() {
      return DefaultType$6;
    }
    static get NAME() {
      return NAME$7;
    }
    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._isTransitioning = true;
      this._scrollBar.hide();
      document.body.classList.add(CLASS_NAME_OPEN);
      this._adjustDialog();
      this._backdrop.show(() => this._showElement(relatedTarget));
    }
    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._isShown = false;
      this._isTransitioning = true;
      this._focustrap.deactivate();
      this._element.classList.remove(CLASS_NAME_SHOW$4);
      this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
    }
    dispose() {
      EventHandler.off(window, EVENT_KEY$4);
      EventHandler.off(this._dialog, EVENT_KEY$4);
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }
    handleUpdate() {
      this._adjustDialog();
    }
    // Private
    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value,
        isAnimated: this._isAnimated()
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _showElement(relatedTarget) {
      if (!document.body.contains(this._element)) {
        document.body.append(this._element);
      }
      this._element.style.display = "block";
      this._element.removeAttribute("aria-hidden");
      this._element.setAttribute("aria-modal", true);
      this._element.setAttribute("role", "dialog");
      this._element.scrollTop = 0;
      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW$4);
      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
        }
        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$4, {
          relatedTarget
        });
      };
      this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event) => {
        if (event.key !== ESCAPE_KEY$1) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        this._triggerBackdropTransition();
      });
      EventHandler.on(window, EVENT_RESIZE$1, () => {
        if (this._isShown && !this._isTransitioning) {
          this._adjustDialog();
        }
      });
      EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
        EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
          if (this._element !== event.target || this._element !== event2.target) {
            return;
          }
          if (this._config.backdrop === "static") {
            this._triggerBackdropTransition();
            return;
          }
          if (this._config.backdrop) {
            this.hide();
          }
        });
      });
    }
    _hideModal() {
      this._element.style.display = "none";
      this._element.setAttribute("aria-hidden", true);
      this._element.removeAttribute("aria-modal");
      this._element.removeAttribute("role");
      this._isTransitioning = false;
      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._scrollBar.reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$4);
      });
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
    }
    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const initialOverflowY = this._element.style.overflowY;
      if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) {
        return;
      }
      if (!isModalOverflowing) {
        this._element.style.overflowY = "hidden";
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        this._queueCallback(() => {
          this._element.style.overflowY = initialOverflowY;
        }, this._dialog);
      }, this._dialog);
      this._element.focus();
    }
    /**
     * The following methods are used to handle overflowing modals
     */
    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = this._scrollBar.getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;
      if (isBodyOverflowing && !isModalOverflowing) {
        const property = isRTL() ? "paddingLeft" : "paddingRight";
        this._element.style[property] = `${scrollbarWidth}px`;
      }
      if (!isBodyOverflowing && isModalOverflowing) {
        const property = isRTL() ? "paddingRight" : "paddingLeft";
        this._element.style[property] = `${scrollbarWidth}px`;
      }
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = "";
      this._element.style.paddingRight = "";
    }
    // Static
    static jQueryInterface(config, relatedTarget) {
      return this.each(function() {
        const data = Modal.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](relatedTarget);
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }
    EventHandler.one(target, EVENT_SHOW$4, (showEvent) => {
      if (showEvent.defaultPrevented) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$4, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
    if (alreadyOpen) {
      Modal.getInstance(alreadyOpen).hide();
    }
    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  });
  enableDismissTrigger(Modal);
  defineJQueryPlugin(Modal);
  const NAME$6 = "offcanvas";
  const DATA_KEY$3 = "bs.offcanvas";
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const DATA_API_KEY$1 = ".data-api";
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const ESCAPE_KEY = "Escape";
  const CLASS_NAME_SHOW$3 = "show";
  const CLASS_NAME_SHOWING$1 = "showing";
  const CLASS_NAME_HIDING = "hiding";
  const CLASS_NAME_BACKDROP = "offcanvas-backdrop";
  const OPEN_SELECTOR = ".offcanvas.show";
  const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
  const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$5 = {
    backdrop: "(boolean|string)",
    keyboard: "boolean",
    scroll: "boolean"
  };
  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._addEventListeners();
    }
    // Getters
    static get Default() {
      return Default$5;
    }
    static get DefaultType() {
      return DefaultType$5;
    }
    static get NAME() {
      return NAME$6;
    }
    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._backdrop.show();
      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
      }
      this._element.setAttribute("aria-modal", true);
      this._element.setAttribute("role", "dialog");
      this._element.classList.add(CLASS_NAME_SHOWING$1);
      const completeCallBack = () => {
        if (!this._config.scroll || this._config.backdrop) {
          this._focustrap.activate();
        }
        this._element.classList.add(CLASS_NAME_SHOW$3);
        this._element.classList.remove(CLASS_NAME_SHOWING$1);
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };
      this._queueCallback(completeCallBack, this._element, true);
    }
    hide() {
      if (!this._isShown) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._focustrap.deactivate();
      this._element.blur();
      this._isShown = false;
      this._element.classList.add(CLASS_NAME_HIDING);
      this._backdrop.hide();
      const completeCallback = () => {
        this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
        this._element.removeAttribute("aria-modal");
        this._element.removeAttribute("role");
        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      };
      this._queueCallback(completeCallback, this._element, true);
    }
    dispose() {
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }
    // Private
    _initializeBackDrop() {
      const clickCallback = () => {
        if (this._config.backdrop === "static") {
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          return;
        }
        this.hide();
      };
      const isVisible2 = Boolean(this._config.backdrop);
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible: isVisible2,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: isVisible2 ? clickCallback : null
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
        if (event.key !== ESCAPE_KEY) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
      });
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Offcanvas.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    if (alreadyOpen && alreadyOpen !== target) {
      Offcanvas.getInstance(alreadyOpen).hide();
    }
    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
      Offcanvas.getOrCreateInstance(selector).show();
    }
  });
  EventHandler.on(window, EVENT_RESIZE, () => {
    for (const element of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]")) {
      if (getComputedStyle(element).position !== "fixed") {
        Offcanvas.getOrCreateInstance(element).hide();
      }
    }
  });
  enableDismissTrigger(Offcanvas);
  defineJQueryPlugin(Offcanvas);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
    a: ["target", "href", "title", "rel"],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    dd: [],
    div: [],
    dl: [],
    dt: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ["src", "srcset", "alt", "title", "width", "height"],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  const uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
  const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
      }
      return true;
    }
    return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }
    if (sanitizeFunction && typeof sanitizeFunction === "function") {
      return sanitizeFunction(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
    const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
    for (const element of elements) {
      const elementName = element.nodeName.toLowerCase();
      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }
      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
      for (const attribute of attributeList) {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      }
    }
    return createdDocument.body.innerHTML;
  }
  const NAME$5 = "TemplateFactory";
  const Default$4 = {
    allowList: DefaultAllowlist,
    content: {},
    // { selector : text ,  selector2 : text2 , }
    extraClass: "",
    html: false,
    sanitize: true,
    sanitizeFn: null,
    template: "<div></div>"
  };
  const DefaultType$4 = {
    allowList: "object",
    content: "object",
    extraClass: "(string|function)",
    html: "boolean",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    template: "string"
  };
  const DefaultContentType = {
    entry: "(string|element|function|null)",
    selector: "(string|element)"
  };
  class TemplateFactory extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
    }
    // Getters
    static get Default() {
      return Default$4;
    }
    static get DefaultType() {
      return DefaultType$4;
    }
    static get NAME() {
      return NAME$5;
    }
    // Public
    getContent() {
      return Object.values(this._config.content).map((config) => this._resolvePossibleFunction(config)).filter(Boolean);
    }
    hasContent() {
      return this.getContent().length > 0;
    }
    changeContent(content) {
      this._checkContent(content);
      this._config.content = {
        ...this._config.content,
        ...content
      };
      return this;
    }
    toHtml() {
      const templateWrapper = document.createElement("div");
      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
      for (const [selector, text] of Object.entries(this._config.content)) {
        this._setContent(templateWrapper, text, selector);
      }
      const template = templateWrapper.children[0];
      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
      if (extraClass) {
        template.classList.add(...extraClass.split(" "));
      }
      return template;
    }
    // Private
    _typeCheckConfig(config) {
      super._typeCheckConfig(config);
      this._checkContent(config.content);
    }
    _checkContent(arg) {
      for (const [selector, content] of Object.entries(arg)) {
        super._typeCheckConfig({
          selector,
          entry: content
        }, DefaultContentType);
      }
    }
    _setContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);
      if (!templateElement) {
        return;
      }
      content = this._resolvePossibleFunction(content);
      if (!content) {
        templateElement.remove();
        return;
      }
      if (isElement$1(content)) {
        this._putElementInTemplate(getElement(content), templateElement);
        return;
      }
      if (this._config.html) {
        templateElement.innerHTML = this._maybeSanitize(content);
        return;
      }
      templateElement.textContent = content;
    }
    _maybeSanitize(arg) {
      return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [void 0, this]);
    }
    _putElementInTemplate(element, templateElement) {
      if (this._config.html) {
        templateElement.innerHTML = "";
        templateElement.append(element);
        return;
      }
      templateElement.textContent = element.textContent;
    }
  }
  const NAME$4 = "tooltip";
  const DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]);
  const CLASS_NAME_FADE$2 = "fade";
  const CLASS_NAME_MODAL = "modal";
  const CLASS_NAME_SHOW$2 = "show";
  const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = "hide.bs.modal";
  const TRIGGER_HOVER = "hover";
  const TRIGGER_FOCUS = "focus";
  const TRIGGER_CLICK = "click";
  const TRIGGER_MANUAL = "manual";
  const EVENT_HIDE$2 = "hide";
  const EVENT_HIDDEN$2 = "hidden";
  const EVENT_SHOW$2 = "show";
  const EVENT_SHOWN$2 = "shown";
  const EVENT_INSERTED = "inserted";
  const EVENT_CLICK$1 = "click";
  const EVENT_FOCUSIN$1 = "focusin";
  const EVENT_FOCUSOUT$1 = "focusout";
  const EVENT_MOUSEENTER = "mouseenter";
  const EVENT_MOUSELEAVE = "mouseleave";
  const AttachmentMap = {
    AUTO: "auto",
    TOP: "top",
    RIGHT: isRTL() ? "left" : "right",
    BOTTOM: "bottom",
    LEFT: isRTL() ? "right" : "left"
  };
  const Default$3 = {
    allowList: DefaultAllowlist,
    animation: true,
    boundary: "clippingParents",
    container: false,
    customClass: "",
    delay: 0,
    fallbackPlacements: ["top", "right", "bottom", "left"],
    html: false,
    offset: [0, 6],
    placement: "top",
    popperConfig: null,
    sanitize: true,
    sanitizeFn: null,
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    title: "",
    trigger: "hover focus"
  };
  const DefaultType$3 = {
    allowList: "object",
    animation: "boolean",
    boundary: "(string|element)",
    container: "(string|element|boolean)",
    customClass: "(string|function)",
    delay: "(number|object)",
    fallbackPlacements: "array",
    html: "boolean",
    offset: "(array|string|function)",
    placement: "(string|function)",
    popperConfig: "(null|object|function)",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    selector: "(string|boolean)",
    template: "string",
    title: "(string|element|function)",
    trigger: "string"
  };
  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper === "undefined") {
        throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)");
      }
      super(element, config);
      this._isEnabled = true;
      this._timeout = 0;
      this._isHovered = null;
      this._activeTrigger = {};
      this._popper = null;
      this._templateFactory = null;
      this._newContent = null;
      this.tip = null;
      this._setListeners();
      if (!this._config.selector) {
        this._fixTitle();
      }
    }
    // Getters
    static get Default() {
      return Default$3;
    }
    static get DefaultType() {
      return DefaultType$3;
    }
    static get NAME() {
      return NAME$4;
    }
    // Public
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle() {
      if (!this._isEnabled) {
        return;
      }
      if (this._isShown()) {
        this._leave();
        return;
      }
      this._enter();
    }
    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      if (this._element.getAttribute("data-bs-original-title")) {
        this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title"));
      }
      this._disposePopper();
      super.dispose();
    }
    show() {
      if (this._element.style.display === "none") {
        throw new Error("Please use show on visible elements");
      }
      if (!(this._isWithContent() && this._isEnabled)) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }
      this._disposePopper();
      const tip = this._getTipElement();
      this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
      const {
        container
      } = this._config;
      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
      }
      this._popper = this._createPopper(tip);
      tip.classList.add(CLASS_NAME_SHOW$2);
      if ("ontouchstart" in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, "mouseover", noop);
        }
      }
      const complete = () => {
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
        if (this._isHovered === false) {
          this._leave();
        }
        this._isHovered = false;
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    hide() {
      if (!this._isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
      if (hideEvent.defaultPrevented) {
        return;
      }
      const tip = this._getTipElement();
      tip.classList.remove(CLASS_NAME_SHOW$2);
      if ("ontouchstart" in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, "mouseover", noop);
        }
      }
      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      this._isHovered = null;
      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }
        if (!this._isHovered) {
          this._disposePopper();
        }
        this._element.removeAttribute("aria-describedby");
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    update() {
      if (this._popper) {
        this._popper.update();
      }
    }
    // Protected
    _isWithContent() {
      return Boolean(this._getTitle());
    }
    _getTipElement() {
      if (!this.tip) {
        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
      }
      return this.tip;
    }
    _createTipElement(content) {
      const tip = this._getTemplateFactory(content).toHtml();
      if (!tip) {
        return null;
      }
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
      const tipId = getUID(this.constructor.NAME).toString();
      tip.setAttribute("id", tipId);
      if (this._isAnimated()) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }
      return tip;
    }
    setContent(content) {
      this._newContent = content;
      if (this._isShown()) {
        this._disposePopper();
        this.show();
      }
    }
    _getTemplateFactory(content) {
      if (this._templateFactory) {
        this._templateFactory.changeContent(content);
      } else {
        this._templateFactory = new TemplateFactory({
          ...this._config,
          // the `content` var has to be after `this._config`
          // to override config.content in case of popover
          content,
          extraClass: this._resolvePossibleFunction(this._config.customClass)
        });
      }
      return this._templateFactory;
    }
    _getContentForTemplate() {
      return {
        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
      };
    }
    _getTitle() {
      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
    }
    // Private
    _initializeOnDelegatedTarget(event) {
      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }
    _isAnimated() {
      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
    }
    _isShown() {
      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
    }
    _createPopper(tip) {
      const placement = execute(this._config.placement, [this, tip, this._element]);
      const attachment = AttachmentMap[placement.toUpperCase()];
      return createPopper(this._element, tip, this._getPopperConfig(attachment));
    }
    _getOffset() {
      const {
        offset: offset2
      } = this._config;
      if (typeof offset2 === "string") {
        return offset2.split(",").map((value) => Number.parseInt(value, 10));
      }
      if (typeof offset2 === "function") {
        return (popperData) => offset2(popperData, this._element);
      }
      return offset2;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this._element, this._element]);
    }
    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: "flip",
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }, {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: "arrow",
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: "preSetPlacement",
          enabled: true,
          phase: "beforeMain",
          fn: (data) => {
            this._getTipElement().setAttribute("data-popper-placement", data.state.placement);
          }
        }]
      };
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [void 0, defaultBsPopperConfig])
      };
    }
    _setListeners() {
      const triggers = this._config.trigger.split(" ");
      for (const trigger of triggers) {
        if (trigger === "click") {
          EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, (event) => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
            context.toggle();
          });
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
          EventHandler.on(this._element, eventIn, this._config.selector, (event) => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
            context._enter();
          });
          EventHandler.on(this._element, eventOut, this._config.selector, (event) => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
            context._leave();
          });
        }
      }
      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };
      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    }
    _fixTitle() {
      const title = this._element.getAttribute("title");
      if (!title) {
        return;
      }
      if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) {
        this._element.setAttribute("aria-label", title);
      }
      this._element.setAttribute("data-bs-original-title", title);
      this._element.removeAttribute("title");
    }
    _enter() {
      if (this._isShown() || this._isHovered) {
        this._isHovered = true;
        return;
      }
      this._isHovered = true;
      this._setTimeout(() => {
        if (this._isHovered) {
          this.show();
        }
      }, this._config.delay.show);
    }
    _leave() {
      if (this._isWithActiveTrigger()) {
        return;
      }
      this._isHovered = false;
      this._setTimeout(() => {
        if (!this._isHovered) {
          this.hide();
        }
      }, this._config.delay.hide);
    }
    _setTimeout(handler, timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(handler, timeout);
    }
    _isWithActiveTrigger() {
      return Object.values(this._activeTrigger).includes(true);
    }
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      for (const dataAttribute of Object.keys(dataAttributes)) {
        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
          delete dataAttributes[dataAttribute];
        }
      }
      config = {
        ...dataAttributes,
        ...typeof config === "object" && config ? config : {}
      };
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      config.container = config.container === false ? document.body : getElement(config.container);
      if (typeof config.delay === "number") {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }
      if (typeof config.title === "number") {
        config.title = config.title.toString();
      }
      if (typeof config.content === "number") {
        config.content = config.content.toString();
      }
      return config;
    }
    _getDelegateConfig() {
      const config = {};
      for (const [key, value] of Object.entries(this._config)) {
        if (this.constructor.Default[key] !== value) {
          config[key] = value;
        }
      }
      config.selector = false;
      config.trigger = "manual";
      return config;
    }
    _disposePopper() {
      if (this._popper) {
        this._popper.destroy();
        this._popper = null;
      }
      if (this.tip) {
        this.tip.remove();
        this.tip = null;
      }
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Tooltip.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }
  defineJQueryPlugin(Tooltip);
  const NAME$3 = "popover";
  const SELECTOR_TITLE = ".popover-header";
  const SELECTOR_CONTENT = ".popover-body";
  const Default$2 = {
    ...Tooltip.Default,
    content: "",
    offset: [0, 8],
    placement: "right",
    template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
    trigger: "click"
  };
  const DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: "(null|string|element|function)"
  };
  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }
    static get DefaultType() {
      return DefaultType$2;
    }
    static get NAME() {
      return NAME$3;
    }
    // Overrides
    _isWithContent() {
      return this._getTitle() || this._getContent();
    }
    // Private
    _getContentForTemplate() {
      return {
        [SELECTOR_TITLE]: this._getTitle(),
        [SELECTOR_CONTENT]: this._getContent()
      };
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Popover.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }
  defineJQueryPlugin(Popover);
  const NAME$2 = "scrollspy";
  const DATA_KEY$2 = "bs.scrollspy";
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY = ".data-api";
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_CLICK = `click${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = "dropdown-item";
  const CLASS_NAME_ACTIVE$1 = "active";
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_TARGET_LINKS = "[href]";
  const SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
  const SELECTOR_NAV_LINKS = ".nav-link";
  const SELECTOR_NAV_ITEMS = ".nav-item";
  const SELECTOR_LIST_ITEMS = ".list-group-item";
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
  const SELECTOR_DROPDOWN = ".dropdown";
  const SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle";
  const Default$1 = {
    offset: null,
    // TODO: v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: "0px 0px -25%",
    smoothScroll: false,
    target: null,
    threshold: [0.1, 0.5, 1]
  };
  const DefaultType$1 = {
    offset: "(number|null)",
    // TODO v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: "string",
    smoothScroll: "boolean",
    target: "element",
    threshold: "array"
  };
  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._targetLinks = /* @__PURE__ */ new Map();
      this._observableSections = /* @__PURE__ */ new Map();
      this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element;
      this._activeTarget = null;
      this._observer = null;
      this._previousScrollData = {
        visibleEntryTop: 0,
        parentScrollTop: 0
      };
      this.refresh();
    }
    // Getters
    static get Default() {
      return Default$1;
    }
    static get DefaultType() {
      return DefaultType$1;
    }
    static get NAME() {
      return NAME$2;
    }
    // Public
    refresh() {
      this._initializeTargetsAndObservables();
      this._maybeEnableSmoothScroll();
      if (this._observer) {
        this._observer.disconnect();
      } else {
        this._observer = this._getNewObserver();
      }
      for (const section of this._observableSections.values()) {
        this._observer.observe(section);
      }
    }
    dispose() {
      this._observer.disconnect();
      super.dispose();
    }
    // Private
    _configAfterMerge(config) {
      config.target = getElement(config.target) || document.body;
      config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
      if (typeof config.threshold === "string") {
        config.threshold = config.threshold.split(",").map((value) => Number.parseFloat(value));
      }
      return config;
    }
    _maybeEnableSmoothScroll() {
      if (!this._config.smoothScroll) {
        return;
      }
      EventHandler.off(this._config.target, EVENT_CLICK);
      EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event) => {
        const observableSection = this._observableSections.get(event.target.hash);
        if (observableSection) {
          event.preventDefault();
          const root = this._rootElement || window;
          const height = observableSection.offsetTop - this._element.offsetTop;
          if (root.scrollTo) {
            root.scrollTo({
              top: height,
              behavior: "smooth"
            });
            return;
          }
          root.scrollTop = height;
        }
      });
    }
    _getNewObserver() {
      const options = {
        root: this._rootElement,
        threshold: this._config.threshold,
        rootMargin: this._config.rootMargin
      };
      return new IntersectionObserver((entries) => this._observerCallback(entries), options);
    }
    // The logic of selection
    _observerCallback(entries) {
      const targetElement = (entry) => this._targetLinks.get(`#${entry.target.id}`);
      const activate = (entry) => {
        this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
        this._process(targetElement(entry));
      };
      const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
      const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
      this._previousScrollData.parentScrollTop = parentScrollTop;
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          this._activeTarget = null;
          this._clearActiveClass(targetElement(entry));
          continue;
        }
        const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
        if (userScrollsDown && entryIsLowerThanPrevious) {
          activate(entry);
          if (!parentScrollTop) {
            return;
          }
          continue;
        }
        if (!userScrollsDown && !entryIsLowerThanPrevious) {
          activate(entry);
        }
      }
    }
    _initializeTargetsAndObservables() {
      this._targetLinks = /* @__PURE__ */ new Map();
      this._observableSections = /* @__PURE__ */ new Map();
      const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
      for (const anchor of targetLinks) {
        if (!anchor.hash || isDisabled(anchor)) {
          continue;
        }
        const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);
        if (isVisible(observableSection)) {
          this._targetLinks.set(decodeURI(anchor.hash), anchor);
          this._observableSections.set(anchor.hash, observableSection);
        }
      }
    }
    _process(target) {
      if (this._activeTarget === target) {
        return;
      }
      this._clearActiveClass(this._config.target);
      this._activeTarget = target;
      target.classList.add(CLASS_NAME_ACTIVE$1);
      this._activateParents(target);
      EventHandler.trigger(this._element, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }
    _activateParents(target) {
      if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
        return;
      }
      for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
        for (const item2 of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
          item2.classList.add(CLASS_NAME_ACTIVE$1);
        }
      }
    }
    _clearActiveClass(parent) {
      parent.classList.remove(CLASS_NAME_ACTIVE$1);
      const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
      for (const node of activeNodes) {
        node.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = ScrollSpy.getOrCreateInstance(this, config);
        if (typeof config !== "string") {
          return;
        }
        if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
      ScrollSpy.getOrCreateInstance(spy);
    }
  });
  defineJQueryPlugin(ScrollSpy);
  const NAME$1 = "tab";
  const DATA_KEY$1 = "bs.tab";
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
  const ARROW_LEFT_KEY = "ArrowLeft";
  const ARROW_RIGHT_KEY = "ArrowRight";
  const ARROW_UP_KEY = "ArrowUp";
  const ARROW_DOWN_KEY = "ArrowDown";
  const HOME_KEY = "Home";
  const END_KEY = "End";
  const CLASS_NAME_ACTIVE = "active";
  const CLASS_NAME_FADE$1 = "fade";
  const CLASS_NAME_SHOW$1 = "show";
  const CLASS_DROPDOWN = "dropdown";
  const SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
  const SELECTOR_DROPDOWN_MENU = ".dropdown-menu";
  const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
  const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
  const SELECTOR_OUTER = ".nav-item, .list-group-item";
  const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
  class Tab extends BaseComponent {
    constructor(element) {
      super(element);
      this._parent = this._element.closest(SELECTOR_TAB_PANEL);
      if (!this._parent) {
        return;
      }
      this._setInitialAttributes(this._parent, this._getChildren());
      EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
    }
    // Getters
    static get NAME() {
      return NAME$1;
    }
    // Public
    show() {
      const innerElem = this._element;
      if (this._elemIsActive(innerElem)) {
        return;
      }
      const active = this._getActiveElem();
      const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
        relatedTarget: innerElem
      }) : null;
      const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
        relatedTarget: active
      });
      if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
        return;
      }
      this._deactivate(active, innerElem);
      this._activate(innerElem, active);
    }
    // Private
    _activate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.add(CLASS_NAME_ACTIVE);
      this._activate(SelectorEngine.getElementFromSelector(element));
      const complete = () => {
        if (element.getAttribute("role") !== "tab") {
          element.classList.add(CLASS_NAME_SHOW$1);
          return;
        }
        element.removeAttribute("tabindex");
        element.setAttribute("aria-selected", true);
        this._toggleDropDown(element, true);
        EventHandler.trigger(element, EVENT_SHOWN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _deactivate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.remove(CLASS_NAME_ACTIVE);
      element.blur();
      this._deactivate(SelectorEngine.getElementFromSelector(element));
      const complete = () => {
        if (element.getAttribute("role") !== "tab") {
          element.classList.remove(CLASS_NAME_SHOW$1);
          return;
        }
        element.setAttribute("aria-selected", false);
        element.setAttribute("tabindex", "-1");
        this._toggleDropDown(element, false);
        EventHandler.trigger(element, EVENT_HIDDEN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _keydown(event) {
      if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const children = this._getChildren().filter((element) => !isDisabled(element));
      let nextActiveElement;
      if ([HOME_KEY, END_KEY].includes(event.key)) {
        nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
      } else {
        const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
        nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
      }
      if (nextActiveElement) {
        nextActiveElement.focus({
          preventScroll: true
        });
        Tab.getOrCreateInstance(nextActiveElement).show();
      }
    }
    _getChildren() {
      return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
    }
    _getActiveElem() {
      return this._getChildren().find((child) => this._elemIsActive(child)) || null;
    }
    _setInitialAttributes(parent, children) {
      this._setAttributeIfNotExists(parent, "role", "tablist");
      for (const child of children) {
        this._setInitialAttributesOnChild(child);
      }
    }
    _setInitialAttributesOnChild(child) {
      child = this._getInnerElement(child);
      const isActive = this._elemIsActive(child);
      const outerElem = this._getOuterElement(child);
      child.setAttribute("aria-selected", isActive);
      if (outerElem !== child) {
        this._setAttributeIfNotExists(outerElem, "role", "presentation");
      }
      if (!isActive) {
        child.setAttribute("tabindex", "-1");
      }
      this._setAttributeIfNotExists(child, "role", "tab");
      this._setInitialAttributesOnTargetPanel(child);
    }
    _setInitialAttributesOnTargetPanel(child) {
      const target = SelectorEngine.getElementFromSelector(child);
      if (!target) {
        return;
      }
      this._setAttributeIfNotExists(target, "role", "tabpanel");
      if (child.id) {
        this._setAttributeIfNotExists(target, "aria-labelledby", `${child.id}`);
      }
    }
    _toggleDropDown(element, open) {
      const outerElem = this._getOuterElement(element);
      if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
        return;
      }
      const toggle = (selector, className) => {
        const element2 = SelectorEngine.findOne(selector, outerElem);
        if (element2) {
          element2.classList.toggle(className, open);
        }
      };
      toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
      toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
      outerElem.setAttribute("aria-expanded", open);
    }
    _setAttributeIfNotExists(element, attribute, value) {
      if (!element.hasAttribute(attribute)) {
        element.setAttribute(attribute, value);
      }
    }
    _elemIsActive(elem) {
      return elem.classList.contains(CLASS_NAME_ACTIVE);
    }
    // Try to get the inner element (usually the .nav-link)
    _getInnerElement(elem) {
      return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
    }
    // Try to get the outer element (usually the .nav-item)
    _getOuterElement(elem) {
      return elem.closest(SELECTOR_OUTER) || elem;
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Tab.getOrCreateInstance(this);
        if (typeof config !== "string") {
          return;
        }
        if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    Tab.getOrCreateInstance(this).show();
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
      Tab.getOrCreateInstance(element);
    }
  });
  defineJQueryPlugin(Tab);
  const NAME = "toast";
  const DATA_KEY = "bs.toast";
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = "fade";
  const CLASS_NAME_HIDE = "hide";
  const CLASS_NAME_SHOW = "show";
  const CLASS_NAME_SHOWING = "showing";
  const DefaultType = {
    animation: "boolean",
    autohide: "boolean",
    delay: "number"
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5e3
  };
  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;
      this._setListeners();
    }
    // Getters
    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }
    // Public
    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._clearTimeout();
      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        EventHandler.trigger(this._element, EVENT_SHOWN);
        this._maybeScheduleHide();
      };
      this._element.classList.remove(CLASS_NAME_HIDE);
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    hide() {
      if (!this.isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);
        this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };
      this._element.classList.add(CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
      this._clearTimeout();
      if (this.isShown()) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      super.dispose();
    }
    isShown() {
      return this._element.classList.contains(CLASS_NAME_SHOW);
    }
    // Private
    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }
      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }
      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case "mouseover":
        case "mouseout": {
          this._hasMouseInteraction = isInteracting;
          break;
        }
        case "focusin":
        case "focusout": {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
      }
      if (isInteracting) {
        this._clearTimeout();
        return;
      }
      const nextElement = event.relatedTarget;
      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }
      this._maybeScheduleHide();
    }
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false));
    }
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    // Static
    static jQueryInterface(config) {
      return this.each(function() {
        const data = Toast.getOrCreateInstance(this, config);
        if (typeof config === "string") {
          if (typeof data[config] === "undefined") {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        }
      });
    }
  }
  enableDismissTrigger(Toast);
  defineJQueryPlugin(Toast);
  const index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };
  return index_umd;
}));
!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t() : "function" == typeof define && define.amd ? define(t) : t();
})(0, function() {
  "use strict";
  var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
    return typeof e2;
  } : function(e2) {
    return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
  }, t = function(e2, t2) {
    if (!(e2 instanceof t2))
      throw new TypeError("Cannot call a class as a function");
  }, n = /* @__PURE__ */ (function() {
    function e2(e3, t2) {
      for (var n2 = 0; n2 < t2.length; n2++) {
        var r2 = t2[n2];
        r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e3, r2.key, r2);
      }
    }
    return function(t2, n2, r2) {
      return n2 && e2(t2.prototype, n2), r2 && e2(t2, r2), t2;
    };
  })(), r = function(e2, t2) {
    if ("function" != typeof t2 && null !== t2)
      throw new TypeError(
        "Super expression must either be null or a function, not " + typeof t2
      );
    e2.prototype = Object.create(t2 && t2.prototype, {
      constructor: {
        value: e2,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), t2 && (Object.setPrototypeOf ? Object.setPrototypeOf(e2, t2) : e2.__proto__ = t2);
  }, o = function(e2, t2) {
    if (!e2)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return !t2 || "object" != typeof t2 && "function" != typeof t2 ? e2 : t2;
  };
  !(function(t2, n2) {
    var r2 = t2.document, o2 = t2.Object, l2 = (function(e2) {
      var t3, n3, r3, l3, i3 = /^[A-Z]+[a-z]/, a3 = function(e3, t4) {
        (t4 = t4.toLowerCase()) in u2 || (u2[e3] = (u2[e3] || []).concat(t4), u2[t4] = u2[t4.toUpperCase()] = e3);
      }, u2 = (o2.create || o2)(null), c2 = {};
      for (n3 in e2)
        for (l3 in e2[n3])
          for (r3 = e2[n3][l3], u2[l3] = r3, t3 = 0; t3 < r3.length; t3++)
            u2[r3[t3].toLowerCase()] = u2[r3[t3].toUpperCase()] = l3;
      return c2.get = function(e3) {
        return "string" == typeof e3 ? u2[e3] || (i3.test(e3) ? [] : "") : (function(e4) {
          var t4, n4 = [];
          for (t4 in u2) e4.test(t4) && n4.push(t4);
          return n4;
        })(e3);
      }, c2.set = function(e3, t4) {
        return i3.test(e3) ? a3(e3, t4) : a3(t4, e3), c2;
      }, c2;
    })({
      collections: {
        HTMLAllCollection: ["all"],
        HTMLCollection: ["forms"],
        HTMLFormControlsCollection: ["elements"],
        HTMLOptionsCollection: ["options"]
      },
      elements: {
        Element: ["element"],
        HTMLAnchorElement: ["a"],
        HTMLAppletElement: ["applet"],
        HTMLAreaElement: ["area"],
        HTMLAttachmentElement: ["attachment"],
        HTMLAudioElement: ["audio"],
        HTMLBRElement: ["br"],
        HTMLBaseElement: ["base"],
        HTMLBodyElement: ["body"],
        HTMLButtonElement: ["button"],
        HTMLCanvasElement: ["canvas"],
        HTMLContentElement: ["content"],
        HTMLDListElement: ["dl"],
        HTMLDataElement: ["data"],
        HTMLDataListElement: ["datalist"],
        HTMLDetailsElement: ["details"],
        HTMLDialogElement: ["dialog"],
        HTMLDirectoryElement: ["dir"],
        HTMLDivElement: ["div"],
        HTMLDocument: ["document"],
        HTMLElement: [
          "element",
          "abbr",
          "address",
          "article",
          "aside",
          "b",
          "bdi",
          "bdo",
          "cite",
          "code",
          "command",
          "dd",
          "dfn",
          "dt",
          "em",
          "figcaption",
          "figure",
          "footer",
          "header",
          "i",
          "kbd",
          "mark",
          "nav",
          "noscript",
          "rp",
          "rt",
          "ruby",
          "s",
          "samp",
          "section",
          "small",
          "strong",
          "sub",
          "summary",
          "sup",
          "u",
          "var",
          "wbr"
        ],
        HTMLEmbedElement: ["embed"],
        HTMLFieldSetElement: ["fieldset"],
        HTMLFontElement: ["font"],
        HTMLFormElement: ["form"],
        HTMLFrameElement: ["frame"],
        HTMLFrameSetElement: ["frameset"],
        HTMLHRElement: ["hr"],
        HTMLHeadElement: ["head"],
        HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"],
        HTMLHtmlElement: ["html"],
        HTMLIFrameElement: ["iframe"],
        HTMLImageElement: ["img"],
        HTMLInputElement: ["input"],
        HTMLKeygenElement: ["keygen"],
        HTMLLIElement: ["li"],
        HTMLLabelElement: ["label"],
        HTMLLegendElement: ["legend"],
        HTMLLinkElement: ["link"],
        HTMLMapElement: ["map"],
        HTMLMarqueeElement: ["marquee"],
        HTMLMediaElement: ["media"],
        HTMLMenuElement: ["menu"],
        HTMLMenuItemElement: ["menuitem"],
        HTMLMetaElement: ["meta"],
        HTMLMeterElement: ["meter"],
        HTMLModElement: ["del", "ins"],
        HTMLOListElement: ["ol"],
        HTMLObjectElement: ["object"],
        HTMLOptGroupElement: ["optgroup"],
        HTMLOptionElement: ["option"],
        HTMLOutputElement: ["output"],
        HTMLParagraphElement: ["p"],
        HTMLParamElement: ["param"],
        HTMLPictureElement: ["picture"],
        HTMLPreElement: ["pre"],
        HTMLProgressElement: ["progress"],
        HTMLQuoteElement: ["blockquote", "q", "quote"],
        HTMLScriptElement: ["script"],
        HTMLSelectElement: ["select"],
        HTMLShadowElement: ["shadow"],
        HTMLSlotElement: ["slot"],
        HTMLSourceElement: ["source"],
        HTMLSpanElement: ["span"],
        HTMLStyleElement: ["style"],
        HTMLTableCaptionElement: ["caption"],
        HTMLTableCellElement: ["td", "th"],
        HTMLTableColElement: ["col", "colgroup"],
        HTMLTableElement: ["table"],
        HTMLTableRowElement: ["tr"],
        HTMLTableSectionElement: ["thead", "tbody", "tfoot"],
        HTMLTemplateElement: ["template"],
        HTMLTextAreaElement: ["textarea"],
        HTMLTimeElement: ["time"],
        HTMLTitleElement: ["title"],
        HTMLTrackElement: ["track"],
        HTMLUListElement: ["ul"],
        HTMLUnknownElement: ["unknown", "vhgroupv", "vkeygen"],
        HTMLVideoElement: ["video"]
      },
      nodes: {
        Attr: ["node"],
        Audio: ["audio"],
        CDATASection: ["node"],
        CharacterData: ["node"],
        Comment: ["#comment"],
        Document: ["#document"],
        DocumentFragment: ["#document-fragment"],
        DocumentType: ["node"],
        HTMLDocument: ["#document"],
        Image: ["img"],
        Option: ["option"],
        ProcessingInstruction: ["node"],
        ShadowRoot: ["#shadow-root"],
        Text: ["#text"],
        XMLDocument: ["xml"]
      }
    });
    "object" !== (void 0 === n2 ? "undefined" : e(n2)) && (n2 = {
      type: n2 || "auto"
    });
    var i2, a2, u, c, s, m, f, p, d, h = "registerElement", L = "__" + h + (1e5 * t2.Math.random() >> 0), C = "addEventListener", v = "attached", T = "Callback", M = "detached", E = "extends", b = "attributeChanged" + T, g = v + T, y = "connected" + T, H = "disconnected" + T, w = "created" + T, A = M + T, O = "ADDITION", _ = "REMOVAL", N = "DOMAttrModified", S = "DOMContentLoaded", D = "DOMSubtreeModified", k = "<", I = "=", P = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, F = [
      "ANNOTATION-XML",
      "COLOR-PROFILE",
      "FONT-FACE",
      "FONT-FACE-SRC",
      "FONT-FACE-URI",
      "FONT-FACE-FORMAT",
      "FONT-FACE-NAME",
      "MISSING-GLYPH"
    ], R = [], x = [], V = "", z = r2.documentElement, U = R.indexOf || function(e2) {
      for (var t3 = this.length; t3-- && this[t3] !== e2; ) ;
      return t3;
    }, j = o2.prototype, q = j.hasOwnProperty, B = j.isPrototypeOf, Z = o2.defineProperty, G = [], K = o2.getOwnPropertyDescriptor, X = o2.getOwnPropertyNames, J = o2.getPrototypeOf, Q = o2.setPrototypeOf, W = !!o2.__proto__, Y = "__dreCEv1", $ = t2.customElements, ee = !/^force/.test(n2.type) && !!($ && $.define && $.get && $.whenDefined), te = o2.create || o2, ne = t2.Map || function() {
      var e2, t3 = [], n3 = [];
      return {
        get: function(e3) {
          return n3[U.call(t3, e3)];
        },
        set: function(r3, o3) {
          (e2 = U.call(t3, r3)) < 0 ? n3[t3.push(r3) - 1] = o3 : n3[e2] = o3;
        }
      };
    }, re = t2.Promise || function(e2) {
      var t3 = [], n3 = false, r3 = {
        catch: function() {
          return r3;
        },
        then: function(e3) {
          return t3.push(e3), n3 && setTimeout(o3, 1), r3;
        }
      };
      function o3(e3) {
        for (n3 = true; t3.length; ) t3.shift()(e3);
      }
      return e2(o3), r3;
    }, oe = false, le = te(null), ie = te(null), ae = new ne(), ue = function(e2) {
      return e2.toLowerCase();
    }, ce = o2.create || function e2(t3) {
      return t3 ? (e2.prototype = t3, new e2()) : this;
    }, se = Q || (W ? function(e2, t3) {
      return e2.__proto__ = t3, e2;
    } : X && K ? /* @__PURE__ */ (function() {
      function e2(e3, t3) {
        for (var n3, r3 = X(t3), o3 = 0, l3 = r3.length; o3 < l3; o3++)
          n3 = r3[o3], q.call(e3, n3) || Z(e3, n3, K(t3, n3));
      }
      return function(t3, n3) {
        do {
          e2(t3, n3);
        } while ((n3 = J(n3)) && !B.call(n3, t3));
        return t3;
      };
    })() : function(e2, t3) {
      for (var n3 in t3) e2[n3] = t3[n3];
      return e2;
    }), me = t2.MutationObserver || t2.WebKitMutationObserver, fe = (t2.HTMLElement || t2.Element || t2.Node).prototype, pe = !B.call(fe, z), de = pe ? function(e2, t3, n3) {
      return e2[t3] = n3.value, e2;
    } : Z, he = pe ? function(e2) {
      return 1 === e2.nodeType;
    } : function(e2) {
      return B.call(fe, e2);
    }, Le = pe && [], Ce = fe.attachShadow, ve = fe.cloneNode, Te = fe.dispatchEvent, Me = fe.getAttribute, Ee = fe.hasAttribute, be = fe.removeAttribute, ge = fe.setAttribute, ye = r2.createElement, He = ye, we = me && {
      attributes: true,
      characterData: true,
      attributeOldValue: true
    }, Ae = me || function(e2) {
      De = false, z.removeEventListener(N, Ae);
    }, Oe = 0, _e = h in r2 && !/^force-all/.test(n2.type), Ne = true, Se = false, De = true, ke = true, Ie = true;
    function Pe() {
      var e2 = i2.splice(0, i2.length);
      for (Oe = 0; e2.length; ) e2.shift().call(null, e2.shift());
    }
    function Fe(e2, t3) {
      for (var n3 = 0, r3 = e2.length; n3 < r3; n3++) Ge(e2[n3], t3);
    }
    function Re(e2) {
      return function(t3) {
        he(t3) && (Ge(t3, e2), V.length && Fe(t3.querySelectorAll(V), e2));
      };
    }
    function xe(e2) {
      var t3 = Me.call(e2, "is"), n3 = e2.nodeName.toUpperCase(), r3 = U.call(R, t3 ? I + t3.toUpperCase() : k + n3);
      return t3 && -1 < r3 && !Ve(n3, t3) ? -1 : r3;
    }
    function Ve(e2, t3) {
      return -1 < V.indexOf(e2 + '[is="' + t3 + '"]');
    }
    function ze(e2) {
      var t3 = e2.currentTarget, n3 = e2.attrChange, r3 = e2.attrName, o3 = e2.target, l3 = e2[O] || 2, i3 = e2[_] || 3;
      !Ie || o3 && o3 !== t3 || !t3[b] || "style" === r3 || e2.prevValue === e2.newValue && ("" !== e2.newValue || n3 !== l3 && n3 !== i3) || t3[b](r3, n3 === l3 ? null : e2.prevValue, n3 === i3 ? null : e2.newValue);
    }
    function Ue(e2) {
      var t3 = Re(e2);
      return function(e3) {
        i2.push(t3, e3.target), Oe && clearTimeout(Oe), Oe = setTimeout(Pe, 1);
      };
    }
    function je(e2) {
      ke && (ke = false, e2.currentTarget.removeEventListener(S, je)), V.length && Fe((e2.target || r2).querySelectorAll(V), e2.detail === M ? M : v), pe && (function() {
        for (var e3, t3 = 0, n3 = Le.length; t3 < n3; t3++)
          e3 = Le[t3], z.contains(e3) || (n3--, Le.splice(t3--, 1), Ge(e3, M));
      })();
    }
    function qe(e2, t3) {
      ge.call(this, e2, t3), a2.call(this, {
        target: this
      });
    }
    function Be(e2, t3) {
      se(e2, t3), s ? s.observe(e2, we) : (De && (e2.setAttribute = qe, e2[L] = c(e2), e2[C](D, a2)), e2[C](N, ze)), e2[w] && Ie && (e2.created = true, e2[w](), e2.created = false);
    }
    function Ze(e2) {
      throw new Error("A " + e2 + " type is already registered");
    }
    function Ge(e2, t3) {
      var n3, r3, o3 = xe(e2);
      -1 < o3 && (f(e2, x[o3]), o3 = 0, t3 !== v || e2[v] ? t3 !== M || e2[M] || (e2[v] = false, e2[M] = true, r3 = "disconnected", o3 = 1) : (e2[M] = false, e2[v] = true, r3 = "connected", o3 = 1, pe && U.call(Le, e2) < 0 && Le.push(e2)), o3 && (n3 = e2[t3 + T] || e2[r3 + T]) && n3.call(e2));
    }
    function Ke() {
    }
    function Xe(e2, t3, n3) {
      var o3 = n3 && n3[E] || "", l3 = t3.prototype, i3 = ce(l3), a3 = t3.observedAttributes || G, u2 = {
        prototype: i3
      };
      de(i3, w, {
        value: function() {
          if (oe) oe = false;
          else if (!this[Y]) {
            this[Y] = true, new t3(this), l3[w] && l3[w].call(this);
            var e3 = le[ae.get(t3)];
            (!ee || e3.create.length > 1) && We(this);
          }
        }
      }), de(i3, b, {
        value: function(e3) {
          -1 < U.call(a3, e3) && l3[b].apply(this, arguments);
        }
      }), l3[y] && de(i3, g, {
        value: l3[y]
      }), l3[H] && de(i3, A, {
        value: l3[H]
      }), o3 && (u2[E] = o3), e2 = e2.toUpperCase(), le[e2] = {
        constructor: t3,
        create: o3 ? [o3, ue(e2)] : [e2]
      }, ae.set(t3, e2), r2[h](e2.toLowerCase(), u2), Ye(e2), ie[e2].r();
    }
    function Je(e2) {
      var t3 = le[e2.toUpperCase()];
      return t3 && t3.constructor;
    }
    function Qe(e2) {
      return "string" == typeof e2 ? e2 : e2 && e2.is || "";
    }
    function We(e2) {
      for (var t3, n3 = e2[b], r3 = n3 ? e2.attributes : G, o3 = r3.length; o3--; )
        t3 = r3[o3], n3.call(e2, t3.name || t3.nodeName, null, t3.value || t3.nodeValue);
    }
    function Ye(e2) {
      return (e2 = e2.toUpperCase()) in ie || (ie[e2] = {}, ie[e2].p = new re(function(t3) {
        ie[e2].r = t3;
      })), ie[e2].p;
    }
    function $e() {
      $ && delete t2.customElements, Z(t2, "customElements", {
        configurable: true,
        value: new Ke()
      }), Z(t2, "CustomElementRegistry", {
        configurable: true,
        value: Ke
      });
      for (var e2 = function(e3) {
        var n4 = t2[e3];
        if (n4) {
          t2[e3] = function(e4) {
            var t3, o4;
            return e4 || (e4 = this), e4[Y] || (oe = true, t3 = le[ae.get(e4.constructor)], (e4 = (o4 = ee && 1 === t3.create.length) ? Reflect.construct(n4, G, t3.constructor) : r2.createElement.apply(r2, t3.create))[Y] = true, oe = false, o4 || We(e4)), e4;
          }, t2[e3].prototype = n4.prototype;
          try {
            n4.prototype.constructor = t2[e3];
          } catch (r3) {
            Z(n4, Y, {
              value: t2[e3]
            });
          }
        }
      }, n3 = l2.get(/^HTML[A-Z]*[a-z]/), o3 = n3.length; o3--; e2(n3[o3])) ;
      r2.createElement = function(e3, t3) {
        var n4 = Qe(t3);
        return n4 ? He.call(this, e3, ue(n4)) : He.call(this, e3);
      }, _e || (Se = true, r2[h](""));
    }
    if (me && ((d = r2.createElement("div")).innerHTML = "<div><div></div></div>", new me(function(e2, t3) {
      if (e2[0] && "childList" == e2[0].type && !e2[0].removedNodes[0].childNodes.length) {
        var n3 = (d = K(fe, "innerHTML")) && d.set;
        n3 && Z(fe, "innerHTML", {
          set: function(e3) {
            for (; this.lastChild; ) this.removeChild(this.lastChild);
            n3.call(this, e3);
          }
        });
      }
      t3.disconnect(), d = null;
    }).observe(d, {
      childList: true,
      subtree: true
    }), d.innerHTML = ""), _e || (Q || W ? (f = function(e2, t3) {
      B.call(t3, e2) || Be(e2, t3);
    }, p = Be) : p = f = function(e2, t3) {
      e2[L] || (e2[L] = o2(true), Be(e2, t3));
    }, pe ? (De = false, (function() {
      var e2 = K(fe, C), t3 = e2.value, n3 = function(e3) {
        var t4 = new CustomEvent(N, {
          bubbles: true
        });
        t4.attrName = e3, t4.prevValue = Me.call(this, e3), t4.newValue = null, t4[_] = t4.attrChange = 2, be.call(this, e3), Te.call(this, t4);
      }, r3 = function(e3, t4) {
        var n4 = Ee.call(this, e3), r4 = n4 && Me.call(this, e3), o4 = new CustomEvent(N, {
          bubbles: true
        });
        ge.call(this, e3, t4), o4.attrName = e3, o4.prevValue = n4 ? r4 : null, o4.newValue = t4, n4 ? o4.MODIFICATION = o4.attrChange = 1 : o4[O] = o4.attrChange = 0, Te.call(this, o4);
      }, o3 = function(e3) {
        var t4, n4 = e3.currentTarget, r4 = n4[L], o4 = e3.propertyName;
        r4.hasOwnProperty(o4) && (r4 = r4[o4], (t4 = new CustomEvent(N, {
          bubbles: true
        })).attrName = r4.name, t4.prevValue = r4.value || null, t4.newValue = r4.value = n4[o4] || null, null == t4.prevValue ? t4[O] = t4.attrChange = 0 : t4.MODIFICATION = t4.attrChange = 1, Te.call(n4, t4));
      };
      e2.value = function(e3, l3, i3) {
        e3 === N && this[b] && this.setAttribute !== r3 && (this[L] = {
          className: {
            name: "class",
            value: this.className
          }
        }, this.setAttribute = r3, this.removeAttribute = n3, t3.call(this, "propertychange", o3)), t3.call(this, e3, l3, i3);
      }, Z(fe, C, e2);
    })()) : me || (z[C](N, Ae), z.setAttribute(L, 1), z.removeAttribute(L), De && (a2 = function(e2) {
      var t3, n3, r3;
      if (this === e2.target) {
        for (r3 in t3 = this[L], this[L] = n3 = c(this), n3) {
          if (!(r3 in t3)) return u(0, this, r3, t3[r3], n3[r3], O);
          if (n3[r3] !== t3[r3])
            return u(1, this, r3, t3[r3], n3[r3], "MODIFICATION");
        }
        for (r3 in t3)
          if (!(r3 in n3)) return u(2, this, r3, t3[r3], n3[r3], _);
      }
    }, u = function(e2, t3, n3, r3, o3, l3) {
      var i3 = {
        attrChange: e2,
        currentTarget: t3,
        attrName: n3,
        prevValue: r3,
        newValue: o3
      };
      i3[l3] = e2, ze(i3);
    }, c = function(e2) {
      for (var t3, n3, r3 = {}, o3 = e2.attributes, l3 = 0, i3 = o3.length; l3 < i3; l3++)
        "setAttribute" !== (n3 = (t3 = o3[l3]).name) && (r3[n3] = t3.value);
      return r3;
    })), r2[h] = function(e2, t3) {
      if (n3 = e2.toUpperCase(), Ne && (Ne = false, me ? (s = (function(e3, t4) {
        function n4(e4, t5) {
          for (var n5 = 0, r3 = e4.length; n5 < r3; t5(e4[n5++])) ;
        }
        return new me(function(r3) {
          for (var o4, l4, i3, a4 = 0, u3 = r3.length; a4 < u3; a4++)
            "childList" === (o4 = r3[a4]).type ? (n4(o4.addedNodes, e3), n4(o4.removedNodes, t4)) : (l4 = o4.target, Ie && l4[b] && "style" !== o4.attributeName && (i3 = Me.call(l4, o4.attributeName)) !== o4.oldValue && l4[b](o4.attributeName, o4.oldValue, i3));
        });
      })(Re(v), Re(M)), (m = function(e3) {
        return s.observe(e3, {
          childList: true,
          subtree: true
        }), e3;
      })(r2), Ce && (fe.attachShadow = function() {
        return m(Ce.apply(this, arguments));
      })) : (i2 = [], r2[C]("DOMNodeInserted", Ue(v)), r2[C]("DOMNodeRemoved", Ue(M))), r2[C](S, je), r2[C]("readystatechange", je), fe.cloneNode = function(e3) {
        var t4 = ve.call(this, !!e3), n4 = xe(t4);
        return -1 < n4 && p(t4, x[n4]), e3 && V.length && (function(e4) {
          for (var t5, n5 = 0, r3 = e4.length; n5 < r3; n5++)
            t5 = e4[n5], p(t5, x[xe(t5)]);
        })(t4.querySelectorAll(V)), t4;
      }), Se)
        return Se = false;
      if (-2 < U.call(R, I + n3) + U.call(R, k + n3) && Ze(e2), !P.test(n3) || -1 < U.call(F, n3))
        throw new Error("The type " + e2 + " is invalid");
      var n3, o3, l3 = function() {
        return u2 ? r2.createElement(c2, n3) : r2.createElement(c2);
      }, a3 = t3 || j, u2 = q.call(a3, E), c2 = u2 ? t3[E].toUpperCase() : n3;
      return u2 && -1 < U.call(R, k + c2) && Ze(c2), o3 = R.push((u2 ? I : k) + n3) - 1, V = V.concat(
        V.length ? "," : "",
        u2 ? c2 + '[is="' + e2.toLowerCase() + '"]' : c2
      ), l3.prototype = x[o3] = q.call(a3, "prototype") ? a3.prototype : ce(fe), V.length && Fe(r2.querySelectorAll(V), v), l3;
    }, r2.createElement = He = function(e2, t3) {
      var n3 = Qe(t3), o3 = n3 ? ye.call(r2, e2, ue(n3)) : ye.call(r2, e2), l3 = "" + e2, i3 = U.call(R, (n3 ? I : k) + (n3 || l3).toUpperCase()), a3 = -1 < i3;
      return n3 && (o3.setAttribute("is", n3 = n3.toLowerCase()), a3 && (a3 = Ve(l3.toUpperCase(), n3))), Ie = !r2.createElement.innerHTMLHelper, a3 && p(o3, x[i3]), o3;
    }), Ke.prototype = {
      constructor: Ke,
      define: ee ? function(e2, t3, n3) {
        if (n3) Xe(e2, t3, n3);
        else {
          var r3 = e2.toUpperCase();
          le[r3] = {
            constructor: t3,
            create: [r3]
          }, ae.set(t3, r3), $.define(e2, t3);
        }
      } : Xe,
      get: ee ? function(e2) {
        return $.get(e2) || Je(e2);
      } : Je,
      whenDefined: ee ? function(e2) {
        return re.race([$.whenDefined(e2), Ye(e2)]);
      } : Ye
    }, !$ || /^force/.test(n2.type))
      $e();
    else if (!n2.noBuiltIn)
      try {
        !(function(e2, n3, o3) {
          if (n3[E] = "a", (e2.prototype = ce(HTMLAnchorElement.prototype)).constructor = e2, t2.customElements.define(o3, e2, n3), Me.call(
            r2.createElement("a", {
              is: o3
            }),
            "is"
          ) !== o3 || ee && Me.call(new e2(), "is") !== o3)
            throw n3;
        })(
          function e2() {
            return Reflect.construct(HTMLAnchorElement, [], e2);
          },
          {},
          "document-register-element-a"
        );
      } catch (e2) {
        $e();
      }
    if (!n2.noBuiltIn)
      try {
        ye.call(r2, "a", "a");
      } catch (e2) {
        ue = function(e3) {
          return {
            is: e3.toLowerCase()
          };
        };
      }
  })(window);
  var l = function(e2) {
    return e2.toLocaleString("en");
  }, i = (function(e2) {
    function l2(e3) {
      var n2;
      return t(this, l2), (n2 = o(
        this,
        (l2.__proto__ || Object.getPrototypeOf(l2)).call(this, e3)
      ), e3 = n2).init(), o(n2, e3);
    }
    return r(l2, e2), n(l2, [
      {
        key: "init",
        value: function() {
        }
      }
    ]), l2;
  })(HTMLElement), a = (function(e2) {
    function a2() {
      return t(this, a2), o(
        this,
        (a2.__proto__ || Object.getPrototypeOf(a2)).apply(this, arguments)
      );
    }
    return r(a2, i), n(
      a2,
      [
        {
          key: "connectedCallback",
          value: function() {
            var e3 = this;
            if (!this._connected) {
              var t2;
              this.classList.add("loading"), this.style.display = "block", this.innerHTML = '\n      <div class="style-root">\n        <div class="shockwave"></div>\n        <div class="count-container">\n          <div class="count"></div>\n        </div>\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">\n          <g class="flat">\n            <path d="M57.0443547 6.86206897C57.6058817 6.46227795 57.7389459 5.67962382 57.3416215 5.11431557 56.9442971 4.54900731 56.1672933 4.41483804 55.6055588 4.81504702L52.4950525 7.030721C51.9335255 7.43051202 51.8004613 8.21316614 52.1977857 8.7784744 52.4404567 9.12371996 52.8251182 9.30825496 53.2153846 9.30825496 53.4640757 9.30825496 53.7152578 9.23343783 53.9338485 9.07753396L57.0443547 6.86206897zM48.8035059 6.1414838C48.94778 6.19623824 49.0959982 6.22215256 49.2415177 6.22215256 49.7455426 6.22215256 50.2198824 5.91201672 50.4075424 5.40898642L51.7485642 1.81818182C51.9906124 1.17011494 51.664906.447021944 51.0209664.203343783 50.3772345-.0405433647 49.6587706.287774295 49.4167224.93584117L48.0757006 4.52664577C47.83386 5.17471264 48.1595664 5.89780564 48.8035059 6.1414838zM58.5931726 11.6219436C58.5846615 11.6219436 58.5761504 11.6219436 58.5674317 11.6219436L54.7579749 11.6541275C54.0702341 11.6681296 53.5240687 12.1985371 53.5379772 12.8909091 53.551678 13.5745037 54.1065621 14.1297806 54.7828855 14.1297806 54.7913966 14.1297806 54.7999077 14.1297806 54.8086265 14.1297806L58.6180833 14.0643678C59.305824 14.0501567 59.8519894 13.4934169 59.838081 12.8010449 59.8243801 12.1174504 59.269496 11.6219436 58.5931726 11.6219436z"/>\n            <path d="M37.1910045 6.68944619C37.7313574 6.14566353 38.4431784 5.8737722 39.155207 5.8737722 39.967916 5.8737722 40.7808327 6.22800418 41.3380002 6.93667712 42.2214969 8.06039707 42.0666359 9.69111808 41.0600392 10.7042842L39.777765 11.9949843C39.5801407 12.1276907 39.3877061 12.2695925 39.2075193 12.430303 39.0619998 11.5985371 38.7167801 10.7954023 38.1668781 10.0961338 37.4907623 9.23636364 36.588375 8.62424242 35.5772114 8.31410658L37.1910045 6.68944619zM28.5289586 3.66394984C29.0691039 3.12016719 29.7811325 2.84827586 30.4931611 2.84827586 31.3060777 2.84848485 32.1187868 3.20271682 32.6759543 3.91138976 33.559451 5.03510972 33.40459 6.66562173 32.3979933 7.67878788L17.6760235 22.3467085 17.6276554 20.6499478C17.6149925 19.014629 16.8595779 17.554441 15.6854573 16.5945664L28.5289586 3.66394984zM.624996757 36.9889537C.491717597 36.554099.508245877 35.7327064.906400646 35.2666667L3.45579518 32.2829676C3.45662553 32.2819923 4.33763118 25.8376176 6.09881213 12.9498433 6.09881213 11.4271682 7.33624726 10.1814002 8.84873717 10.1814002 10.3612271 10.1814002 11.5988698 11.4271682 11.5988698 12.9498433L11.6704878 15.4649948C9.18191673 15.8089864 7.24428555 17.9170324 7.14921001 20.492581L4.62804751 38.9475444 3.8946373 39.8060606C3.04504924 39.4926018 2.3776139 39.1458968 1.89233128 38.7659456 1.16440735 38.1960189.758275917 37.4238085.624996757 36.9889537z"/>\n            <path d="M49.6070811,36.8942529 L42.4182909,44.1316614 C36.2784454,50.3128527 29.8604313,55.2743992 24.2225349,56.5113898 C24.0512744,56.5492163 23.8901857,56.6217346 23.7511014,56.7293626 L20.5013032,59.2417973 C20.2908084,59.4045977 20.1673015,59.6181154 19.5026647,59.6181154 C18.8380279,59.6181154 13.0160695,55.8303982 10.3595306,53.2846814 C7.96626306,50.9912532 3.77432047,43.9549368 4.44453927,43.0079415 L6.99372621,40.0244514 C6.99469496,40.0233368 7.87570061,33.578962 9.63674317,20.6913271 C9.63674317,19.168652 10.8743859,17.922675 12.3868758,17.922675 C13.8993657,17.922675 15.1368008,19.168652 15.1368008,20.6913271 L15.2667512,25.2522466 C15.2883404,26.0100313 15.907577,26.5034483 16.5519317,26.5034483 C16.8662207,26.5034483 17.1867374,26.3857889 17.4464306,26.1245559 L32.0670972,11.4054336 C32.6074501,10.861442 33.3190635,10.5897597 34.0312997,10.5897597 C34.8440088,10.5897597 35.6569254,10.9439916 36.214093,11.6526646 C37.0975897,12.7763845 36.942521,14.4071055 35.9359243,15.4202717 L25.8641449,25.5598746 C25.3412294,26.0865204 25.3412294,26.9398119 25.8641449,27.4660397 C26.1288202,27.7324974 26.4757006,27.8658307 26.822581,27.8658307 C27.1694614,27.8658307 27.5165494,27.7324974 27.7810172,27.4660397 L40.7291431,14.43093 C41.2692884,13.8869383 41.9811094,13.615256 42.6933456,13.615256 C43.5060547,13.615465 44.3189713,13.969697 44.8761389,14.6783699 C45.7596356,15.8018809 45.6045669,17.4326019 44.5979702,18.445768 L31.7106677,31.4198537 C31.1806943,31.953605 31.1806943,32.8183908 31.7106677,33.3521421 C31.9718141,33.615047 32.31392,33.7464995 32.656441,33.7464995 C32.9985469,33.7464995 33.3408603,33.615047 33.6020067,33.3521421 L43.7346096,23.1515152 C44.2749625,22.6075235 44.9867835,22.3358412 45.6988121,22.3358412 C46.5115212,22.3358412 47.3244378,22.6900731 47.8816054,23.3989551 C48.7651021,24.522466 48.6100334,26.153187 47.6034367,27.1663532 L37.5667397,37.2708464 C37.0245185,37.8165099 37.0245185,38.7017764 37.5667397,39.2474399 C37.8334909,39.5161964 38.161896,39.6422153 38.4900934,39.6422153 C38.8184984,39.6422153 39.1469035,39.5161964 39.3972552,39.2639498 L45.6195133,32.999791 C46.1802099,32.4353187 46.93085,32.1368861 47.678999,32.1368861 C48.2741552,32.1368861 48.8676508,32.3258098 49.361919,32.7197492 C50.682182,33.7717868 50.7639719,35.7297806 49.6070811,36.8942529 Z"/>\n          </g>\n          <g class="outline">\n            <path d="M57.1428763 6.63333333C57.6856856 6.24686869 57.8143144 5.49030303 57.4302341 4.94383838 57.0461538 4.39737374 56.2950502 4.26767677 55.7520401 4.65454545L52.7452174 6.79636364C52.202408 7.18282828 52.0737793 7.93939394 52.4578595 8.48585859 52.6924415 8.81959596 53.0642809 8.9979798 53.4415385 8.9979798 53.6819398 8.9979798 53.9247492 8.92565657 54.1360535 8.77494949L57.1428763 6.63333333zM49.1767224 5.93676768C49.3161873 5.98969697 49.4594649 6.01474747 49.6001338 6.01474747 50.0873579 6.01474747 50.5458863 5.71494949 50.727291 5.22868687L52.023612 1.75757576C52.257592 1.13111111 51.9427425.432121212 51.3202676.196565657 50.6979933-.0391919192 50.0034783.278181818 49.7694983.904646465L48.4731773 4.37575758C48.239398 5.00222222 48.5542475 5.70121212 49.1767224 5.93676768zM58.6400669 11.2345455C58.6318395 11.2345455 58.623612 11.2345455 58.6151839 11.2345455L54.932709 11.2656566C54.267893 11.2791919 53.7399331 11.7919192 53.7533779 12.4612121 53.7666221 13.1220202 54.30301 13.6587879 54.9567893 13.6587879 54.9650167 13.6587879 54.9732441 13.6587879 54.9816722 13.6587879L58.6641472 13.5955556C59.3289632 13.5818182 59.8569231 13.0436364 59.8434783 12.3743434 59.8302341 11.7135354 59.2938462 11.2345455 58.6400669 11.2345455zM51.2107023 29.7280808C50.5940468 29.2365657 49.8640134 28.9020202 49.0922408 28.7448485 49.1432107 28.6519192 49.1907692 28.5573737 49.2357191 28.4614141L49.7189298 27.9749495C51.5799331 26.1012121 51.7753846 23.1519192 50.1732441 21.1141414 49.4169231 20.1523232 48.3670234 19.5131313 47.2009365 19.2745455 47.284214 19.120202 47.3580602 18.9624242 47.4250836 18.8022222 48.6925084 16.9539394 48.6718395 14.469899 47.2681605 12.6844444 46.5116388 11.7220202 45.4613378 11.0808081 44.2946488 10.8426263 45.2578595 9.05959596 45.1348495 6.83737374 43.8481605 5.20121212 42.8753177 3.96383838 41.4182609 3.25393939 39.8502341 3.25393939 38.5946488 3.25393939 37.4101003 3.70565657 36.480602 4.53272727 36.3399331 3.72888889 36.0064214 2.95252525 35.4748495 2.27636364 34.501806 1.0389899 33.0447492.329292929 31.4767224.329090909 30.1141806.329090909 28.8351171.861414141 27.8753177 1.82767677L15.6666221 14.1185859 15.6200669 12.4781818C15.5985953 9.68424242 13.3340468 7.41777778 10.5537793 7.41777778 7.8238796 7.41777778 5.59143813 9.60262626 5.49110368 12.3264646L3.05377926 30.1660606 1.05050167 32.510303C-.150100334 33.9157576.751318148 36.4103164 1.05050167 37.002855 1.3496852 37.5953936 1.66593319 37.9666982 2.51271962 38.8651283 2.8050341 39.1752704 3.3712736 39.6680391 4.21143813 40.3434343 3.2935786 41.7335354 4.72327715 47.298456 9.51045561 52.4226263 15.4436869 58.7735254 20.1888963 59.9262626 21.1316388 59.9262626 21.9056187 59.9262626 22.6703679 59.6646465 23.2846154 59.189899L26.2031438 56.9337374C29.0107023 56.2660606 32.1060201 54.7492929 35.4086288 52.4226263 38.2924415 50.3907071 41.4210702 47.6832323 44.7070234 44.3749495L51.656388 37.3787879C52.681204 36.3470707 53.220602 34.9165657 53.1363211 33.4541414 53.0520401 31.9941414 52.350301 30.6361616 51.2107023 29.7280808zM37.9513043 6.46646465C38.4736455 5.94080808 39.1617391 5.6779798 39.8500334 5.6779798 40.6356522 5.6779798 41.4214716 6.02040404 41.9600669 6.70545455 42.8141137 7.79171717 42.6644147 9.36808081 41.6913712 10.3474747L40.4518395 11.5951515C40.2608027 11.7234343 40.0747826 11.8606061 39.900602 12.0159596 39.7599331 11.2119192 39.4262207 10.4355556 38.8946488 9.75959596 38.2410702 8.92848485 37.3687625 8.33676768 36.3913043 8.0369697L37.9513043 6.46646465zM29.5779933 3.54181818C30.1001338 3.01616162 30.7884281 2.75333333 31.4767224 2.75333333 32.2625418 2.75353535 33.0481605 3.0959596 33.5867559 3.7810101 34.4408027 4.86727273 34.2911037 6.44343434 33.3180602 7.42282828L19.0868227 21.6018182 19.0400669 19.9616162C19.0278261 18.3808081 18.297592 16.9692929 17.1626087 16.0414141L29.5779933 3.54181818zM2.60416353 35.7559886C2.47532701 35.335629 2.49130435 34.5416162 2.87618729 34.0911111L5.34060201 31.2068687C5.34140468 31.2059259 6.19304348 24.9763636 7.89551839 12.5181818 7.89551839 11.0462626 9.09170569 9.8420202 10.5537793 9.8420202 12.0158528 9.8420202 13.2122408 11.0462626 13.2122408 12.5181818L13.2814716 14.9494949C10.8758528 15.2820202 9.00280936 17.319798 8.91090301 19.8094949L6.47377926 37.6492929 5.76481605 38.4791919C4.9435476 38.1761817 4.2983601 37.8410335 3.82925357 37.4737474 3.12559377 36.9228183 2.73300005 36.1763482 2.60416353 35.7559886zM49.9535117 35.6644444L43.0043478 42.6606061C37.0691639 48.6357576 30.8650836 53.4319192 25.4151171 54.6276768 25.2495652 54.6642424 25.0938462 54.7343434 24.959398 54.8383838L21.8179264 57.2670707C21.6144482 57.4244444 21.4950582 57.6308449 20.8525759 57.6308449 20.2100936 57.6308449 14.5822005 53.9693849 12.0142129 51.5085254 9.70072096 49.2915447 5.64850979 42.4897722 6.29638796 41.5743434L8.76060201 38.690303C8.76153846 38.6892256 9.61317726 32.4596633 11.3155184 20.0016162 11.3155184 18.529697 12.5119064 17.3252525 13.9739799 17.3252525 15.4360535 17.3252525 16.6322408 18.529697 16.6322408 20.0016162L16.7578595 24.4105051C16.7787291 25.1430303 17.3773244 25.62 18.0002007 25.62 18.3040134 25.62 18.6138462 25.5062626 18.8648829 25.2537374L32.998194 11.0252525C33.5205351 10.4993939 34.2084281 10.2367677 34.8969231 10.2367677 35.6825418 10.2367677 36.4683612 10.5791919 37.0069565 11.2642424 37.8610033 12.3505051 37.7111037 13.9268687 36.7380602 14.9062626L27.0020067 24.7078788C26.4965217 25.2169697 26.4965217 26.0418182 27.0020067 26.5505051 27.2578595 26.8080808 27.5931773 26.9369697 27.928495 26.9369697 28.2638127 26.9369697 28.5993311 26.8080808 28.8549833 26.5505051L41.371505 13.949899C41.8936455 13.4240404 42.5817391 13.1614141 43.2702341 13.1614141 44.0558528 13.1616162 44.8416722 13.5040404 45.3802676 14.1890909 46.2343144 15.2751515 46.0844147 16.8515152 45.1113712 17.8309091L32.6536455 30.3725253C32.1413378 30.8884848 32.1413378 31.7244444 32.6536455 32.240404 32.906087 32.4945455 33.2367893 32.6216162 33.567893 32.6216162 33.8985953 32.6216162 34.2294983 32.4945455 34.4819398 32.240404L44.2767893 22.379798C44.7991304 21.8539394 45.4872241 21.5913131 46.1755184 21.5913131 46.9611371 21.5913131 47.7469565 21.9337374 48.2855518 22.6189899 49.1395987 23.7050505 48.989699 25.2814141 48.0166555 26.2608081L38.3145151 36.0284848C37.7903679 36.5559596 37.7903679 37.4117172 38.3145151 37.9391919 38.5723746 38.1989899 38.8898328 38.3208081 39.2070903 38.3208081 39.5245485 38.3208081 39.8420067 38.1989899 40.0840134 37.9551515L46.0988629 31.899798C46.6408696 31.3541414 47.3664883 31.0656566 48.089699 31.0656566 48.6650167 31.0656566 49.2387291 31.2482828 49.7165217 31.6290909 50.9927759 32.6460606 51.0718395 34.5387879 49.9535117 35.6644444z"/>\n          </g>\n        </svg>\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 20 20">\n          <g class="sparkle">\n          ' + (t2 = 5, new Array(t2).fill(void 0)).map(function(e4) {
                return '<g><circle cx="0" cy="0" r="1"/></g>';
              }).join("") + "\n          </g>\n        </svg>\n      </div>\n      ", this._styleRootElement = this.querySelector(
                ".style-root"
              ), this._countElement = this.querySelector(".count"), this._updateRootColor(), this._totalClaps = 0;
              var n2, r2, o2, i2, a3, u = void 0;
              this._initialClapCount = new Promise(function(e4) {
                return u = e4;
              }), this._bufferedClaps = 0, this._updateClaps = (n2 = function() {
                if (e3._totalClaps < 10) {
                  var t3 = Math.min(
                    e3._bufferedClaps,
                    10 - e3._totalClaps
                  );
                  n3 = e3.api, r3 = t3, o3 = e3.url, fetch(
                    n3 + "/update-claps" + (o3 ? "?url=" + o3 : ""),
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "text/plain"
                      },
                      body: JSON.stringify(r3 + ",3.3.0")
                    }
                  ).then(function(e4) {
                    return e4.text();
                  }), e3._totalClaps += t3, e3._bufferedClaps = 0;
                }
                var n3, r3, o3;
              }, r2 = 2e3, o2 = null, function() {
                var e4 = this, t3 = arguments;
                clearTimeout(o2), o2 = setTimeout(function() {
                  return n2.apply(e4, t3);
                }, r2);
              }), this.addEventListener("mousedown", function(t3) {
                if (0 === t3.button && (e3.classList.add("clapped"), !e3.classList.contains("clap-limit-exceeded"))) {
                  var n3, r3, o3 = Number(e3._countElement.innerHTML.replace(",", "")) + 1;
                  e3.dispatchEvent(
                    new CustomEvent("clapped", {
                      bubbles: true,
                      detail: {
                        clapCount: o3
                      }
                    })
                  ), r3 = "clap", (n3 = e3).classList.remove(r3), setTimeout(function() {
                    n3.classList.add(r3);
                  }, 100), setTimeout(function() {
                    n3.classList.remove(r3);
                  }, 1e3), e3._bufferedClaps++, e3._updateClaps(), setTimeout(function() {
                    e3._countElement.innerHTML = l(o3);
                  }, 250), e3.multiclap ? e3._bufferedClaps + e3._totalClaps >= 10 && e3.classList.add("clap-limit-exceeded") : e3.classList.add("clap-limit-exceeded");
                }
              }), (i2 = this.api, a3 = this.url, fetch(i2 + "/get-claps" + (a3 ? "?url=" + a3 : ""), {
                headers: {
                  "Content-Type": "text/plain"
                }
              }).then(function(e4) {
                return e4.text();
              })).then(function(t3) {
                e3.classList.remove("loading");
                var n3 = Number(t3);
                u(n3), n3 > 0 && (e3._countElement.innerHTML = l(n3));
              }), this._connected = true;
            }
          }
        },
        {
          key: "attributeChangedCallback",
          value: function(e3, t2, n2) {
            this._updateRootColor();
          }
        },
        {
          key: "_updateRootColor",
          value: function() {
            if (this._styleRootElement) {
              var e3 = this.getAttribute("color") || "green", t2 = this._styleRootElement.style;
              t2.fill = e3, t2.stroke = e3, t2.color = e3;
            }
          }
        },
        {
          key: "initialClapCount",
          get: function() {
            return this._initialClapCount;
          }
        },
        {
          key: "color",
          get: function() {
            return this.getAttribute("color");
          },
          set: function(e3) {
            e3 ? this.setAttribute("color", e3) : this.removeAttribute("color"), this._updateRootColor();
          }
        },
        {
          key: "api",
          set: function(e3) {
            e3 ? this.setAttribute("api", e3) : this.removeAttribute("api");
          },
          get: function() {
            return this.getAttribute("api") || "https://api.applause-button.com";
          }
        },
        {
          key: "url",
          set: function(e3) {
            e3 ? this.setAttribute("url", e3) : this.removeAttribute("url"), this._updateRootColor();
          },
          get: function() {
            return this.getAttribute("url");
          }
        },
        {
          key: "multiclap",
          get: function() {
            return "true" === this.getAttribute("multiclap");
          },
          set: function(e3) {
            e3 ? this.setAttribute("multiclap", e3 ? "true" : "false") : this.removeAttribute("multiclap");
          }
        }
      ],
      [
        {
          key: "observedAttributes",
          get: function() {
            return ["color"];
          }
        }
      ]
    ), a2;
  })();
  customElements.define("applause-button", a);
});
/*! PhotoSwipe - v4.1.3 - 2019-01-08
 * http://photoswipe.com
 * Copyright (c) 2019 Dmitry Semenov; */
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.PhotoSwipe = factory();
  }
})(this, function() {
  "use strict";
  var PhotoSwipe2 = function(template, UiClass, items, options) {
    var framework = {
      features: null,
      bind: function(target, type, listener, unbind) {
        var methodName = (unbind ? "remove" : "add") + "EventListener";
        type = type.split(" ");
        for (var i = 0; i < type.length; i++) {
          if (type[i]) {
            target[methodName](type[i], listener, false);
          }
        }
      },
      isArray: function(obj) {
        return obj instanceof Array;
      },
      createEl: function(classes, tag) {
        var el = document.createElement(tag || "div");
        if (classes) {
          el.className = classes;
        }
        return el;
      },
      getScrollY: function() {
        var yOffset = window.pageYOffset;
        return yOffset !== void 0 ? yOffset : document.documentElement.scrollTop;
      },
      unbind: function(target, type, listener) {
        framework.bind(target, type, listener, true);
      },
      removeClass: function(el, className) {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        el.className = el.className.replace(reg, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      },
      addClass: function(el, className) {
        if (!framework.hasClass(el, className)) {
          el.className += (el.className ? " " : "") + className;
        }
      },
      hasClass: function(el, className) {
        return el.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className);
      },
      getChildByClass: function(parentEl, childClassName) {
        var node = parentEl.firstChild;
        while (node) {
          if (framework.hasClass(node, childClassName)) {
            return node;
          }
          node = node.nextSibling;
        }
      },
      arraySearch: function(array, value, key) {
        var i = array.length;
        while (i--) {
          if (array[i][key] === value) {
            return i;
          }
        }
        return -1;
      },
      extend: function(o1, o2, preventOverwrite) {
        for (var prop in o2) {
          if (o2.hasOwnProperty(prop)) {
            if (preventOverwrite && o1.hasOwnProperty(prop)) {
              continue;
            }
            o1[prop] = o2[prop];
          }
        }
      },
      easing: {
        sine: {
          out: function(k) {
            return Math.sin(k * (Math.PI / 2));
          },
          inOut: function(k) {
            return -(Math.cos(Math.PI * k) - 1) / 2;
          }
        },
        cubic: {
          out: function(k) {
            return --k * k * k + 1;
          }
        }
        /*
        			elastic: {
        				out: function ( k ) {
        
        					var s, a = 0.1, p = 0.4;
        					if ( k === 0 ) return 0;
        					if ( k === 1 ) return 1;
        					if ( !a || a < 1 ) { a = 1; s = p / 4; }
        					else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
        					return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
        
        				},
        			},
        			back: {
        				out: function ( k ) {
        					var s = 1.70158;
        					return --k * k * ( ( s + 1 ) * k + s ) + 1;
        				}
        			}
        		*/
      },
      /**
       *
       * @return {object}
       *
       * {
       *  raf : request animation frame function
       *  caf : cancel animation frame function
       *  transfrom : transform property key (with vendor), or null if not supported
       *  oldIE : IE8 or below
       * }
       *
       */
      detectFeatures: function() {
        if (framework.features) {
          return framework.features;
        }
        var helperEl = framework.createEl(), helperStyle = helperEl.style, vendor = "", features = {};
        features.oldIE = document.all && !document.addEventListener;
        features.touch = "ontouchstart" in window;
        if (window.requestAnimationFrame) {
          features.raf = window.requestAnimationFrame;
          features.caf = window.cancelAnimationFrame;
        }
        features.pointerEvent = !!window.PointerEvent || navigator.msPointerEnabled;
        if (!features.pointerEvent) {
          var ua = navigator.userAgent;
          if (/iP(hone|od)/.test(navigator.platform)) {
            var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v && v.length > 0) {
              v = parseInt(v[1], 10);
              if (v >= 1 && v < 8) {
                features.isOldIOSPhone = true;
              }
            }
          }
          var match = ua.match(/Android\s([0-9\.]*)/);
          var androidversion = match ? match[1] : 0;
          androidversion = parseFloat(androidversion);
          if (androidversion >= 1) {
            if (androidversion < 4.4) {
              features.isOldAndroid = true;
            }
            features.androidVersion = androidversion;
          }
          features.isMobileOpera = /opera mini|opera mobi/i.test(ua);
        }
        var styleChecks = ["transform", "perspective", "animationName"], vendors = ["", "webkit", "Moz", "ms", "O"], styleCheckItem, styleName;
        for (var i = 0; i < 4; i++) {
          vendor = vendors[i];
          for (var a = 0; a < 3; a++) {
            styleCheckItem = styleChecks[a];
            styleName = vendor + (vendor ? styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : styleCheckItem);
            if (!features[styleCheckItem] && styleName in helperStyle) {
              features[styleCheckItem] = styleName;
            }
          }
          if (vendor && !features.raf) {
            vendor = vendor.toLowerCase();
            features.raf = window[vendor + "RequestAnimationFrame"];
            if (features.raf) {
              features.caf = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
            }
          }
        }
        if (!features.raf) {
          var lastTime = 0;
          features.raf = function(fn) {
            var currTime = (/* @__PURE__ */ new Date()).getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
              fn(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
          };
          features.caf = function(id) {
            clearTimeout(id);
          };
        }
        features.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
        framework.features = features;
        return features;
      }
    };
    framework.detectFeatures();
    if (framework.features.oldIE) {
      framework.bind = function(target, type, listener, unbind) {
        type = type.split(" ");
        var methodName = (unbind ? "detach" : "attach") + "Event", evName, _handleEv = function() {
          listener.handleEvent.call(listener);
        };
        for (var i = 0; i < type.length; i++) {
          evName = type[i];
          if (evName) {
            if (typeof listener === "object" && listener.handleEvent) {
              if (!unbind) {
                listener["oldIE" + evName] = _handleEv;
              } else {
                if (!listener["oldIE" + evName]) {
                  return false;
                }
              }
              target[methodName]("on" + evName, listener["oldIE" + evName]);
            } else {
              target[methodName]("on" + evName, listener);
            }
          }
        }
      };
    }
    var self2 = this;
    var DOUBLE_TAP_RADIUS = 25, NUM_HOLDERS = 3;
    var _options = {
      allowPanToNext: true,
      spacing: 0.12,
      bgOpacity: 1,
      mouseUsed: false,
      loop: true,
      pinchToClose: true,
      closeOnScroll: true,
      closeOnVerticalDrag: true,
      verticalDragRange: 0.75,
      hideAnimationDuration: 333,
      showAnimationDuration: 333,
      showHideOpacity: false,
      focus: true,
      escKey: true,
      arrowKeys: true,
      mainScrollEndFriction: 0.35,
      panEndFriction: 0.35,
      isClickableElement: function(el) {
        return el.tagName === "A";
      },
      getDoubleTapZoom: function(isMouseClick, item2) {
        if (isMouseClick) {
          return 1;
        } else {
          return item2.initialZoomLevel < 0.7 ? 1 : 1.33;
        }
      },
      maxSpreadZoom: 1.33,
      modal: true,
      // not fully implemented yet
      scaleMode: "fit"
      // TODO
    };
    framework.extend(_options, options);
    var _getEmptyPoint = function() {
      return { x: 0, y: 0 };
    };
    var _isOpen, _isDestroying, _closedByScroll, _currentItemIndex, _containerStyle, _containerShiftIndex, _currPanDist = _getEmptyPoint(), _startPanOffset = _getEmptyPoint(), _panOffset = _getEmptyPoint(), _upMoveEvents, _downEvents, _globalEventHandlers, _viewportSize = {}, _currZoomLevel, _startZoomLevel, _translatePrefix, _translateSufix, _updateSizeInterval, _itemsNeedUpdate, _currPositionIndex = 0, _offset = {}, _slideSize = _getEmptyPoint(), _itemHolders, _prevItemIndex, _indexDiff = 0, _dragStartEvent, _dragMoveEvent, _dragEndEvent, _dragCancelEvent, _transformKey, _pointerEventEnabled, _isFixedPosition = true, _likelyTouchDevice, _modules = [], _requestAF, _cancelAF, _initalClassName, _initalWindowScrollY, _oldIE, _currentWindowScrollY, _features, _windowVisibleSize = {}, _renderMaxResolution = false, _orientationChangeTimeout, _registerModule = function(name, module2) {
      framework.extend(self2, module2.publicMethods);
      _modules.push(name);
    }, _getLoopedId = function(index) {
      var numSlides = _getNumItems();
      if (index > numSlides - 1) {
        return index - numSlides;
      } else if (index < 0) {
        return numSlides + index;
      }
      return index;
    }, _listeners = {}, _listen = function(name, fn) {
      if (!_listeners[name]) {
        _listeners[name] = [];
      }
      return _listeners[name].push(fn);
    }, _shout = function(name) {
      var listeners = _listeners[name];
      if (listeners) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(self2, args);
        }
      }
    }, _getCurrentTime = function() {
      return (/* @__PURE__ */ new Date()).getTime();
    }, _applyBgOpacity = function(opacity) {
      _bgOpacity = opacity;
      self2.bg.style.opacity = opacity * _options.bgOpacity;
    }, _applyZoomTransform = function(styleObj, x, y, zoom, item2) {
      if (!_renderMaxResolution || item2 && item2 !== self2.currItem) {
        zoom = zoom / (item2 ? item2.fitRatio : self2.currItem.fitRatio);
      }
      styleObj[_transformKey] = _translatePrefix + x + "px, " + y + "px" + _translateSufix + " scale(" + zoom + ")";
    }, _applyCurrentZoomPan = function(allowRenderResolution) {
      if (_currZoomElementStyle) {
        if (allowRenderResolution) {
          if (_currZoomLevel > self2.currItem.fitRatio) {
            if (!_renderMaxResolution) {
              _setImageSize(self2.currItem, false, true);
              _renderMaxResolution = true;
            }
          } else {
            if (_renderMaxResolution) {
              _setImageSize(self2.currItem);
              _renderMaxResolution = false;
            }
          }
        }
        _applyZoomTransform(
          _currZoomElementStyle,
          _panOffset.x,
          _panOffset.y,
          _currZoomLevel
        );
      }
    }, _applyZoomPanToItem = function(item2) {
      if (item2.container) {
        _applyZoomTransform(
          item2.container.style,
          item2.initialPosition.x,
          item2.initialPosition.y,
          item2.initialZoomLevel,
          item2
        );
      }
    }, _setTranslateX = function(x, elStyle) {
      elStyle[_transformKey] = _translatePrefix + x + "px, 0px" + _translateSufix;
    }, _moveMainScroll = function(x, dragging) {
      if (!_options.loop && dragging) {
        var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x, delta2 = Math.round(x - _mainScrollPos.x);
        if (newSlideIndexOffset < 0 && delta2 > 0 || newSlideIndexOffset >= _getNumItems() - 1 && delta2 < 0) {
          x = _mainScrollPos.x + delta2 * _options.mainScrollEndFriction;
        }
      }
      _mainScrollPos.x = x;
      _setTranslateX(x, _containerStyle);
    }, _calculatePanOffset = function(axis, zoomLevel) {
      var m = _midZoomPoint[axis] - _offset[axis];
      return _startPanOffset[axis] + _currPanDist[axis] + m - m * (zoomLevel / _startZoomLevel);
    }, _equalizePoints = function(p1, p22) {
      p1.x = p22.x;
      p1.y = p22.y;
      if (p22.id) {
        p1.id = p22.id;
      }
    }, _roundPoint = function(p3) {
      p3.x = Math.round(p3.x);
      p3.y = Math.round(p3.y);
    }, _mouseMoveTimeout = null, _onFirstMouseMove = function() {
      if (_mouseMoveTimeout) {
        framework.unbind(document, "mousemove", _onFirstMouseMove);
        framework.addClass(template, "pswp--has_mouse");
        _options.mouseUsed = true;
        _shout("mouseUsed");
      }
      _mouseMoveTimeout = setTimeout(function() {
        _mouseMoveTimeout = null;
      }, 100);
    }, _bindEvents = function() {
      framework.bind(document, "keydown", self2);
      if (_features.transform) {
        framework.bind(self2.scrollWrap, "click", self2);
      }
      if (!_options.mouseUsed) {
        framework.bind(document, "mousemove", _onFirstMouseMove);
      }
      framework.bind(window, "resize scroll orientationchange", self2);
      _shout("bindEvents");
    }, _unbindEvents = function() {
      framework.unbind(window, "resize scroll orientationchange", self2);
      framework.unbind(window, "scroll", _globalEventHandlers.scroll);
      framework.unbind(document, "keydown", self2);
      framework.unbind(document, "mousemove", _onFirstMouseMove);
      if (_features.transform) {
        framework.unbind(self2.scrollWrap, "click", self2);
      }
      if (_isDragging) {
        framework.unbind(window, _upMoveEvents, self2);
      }
      clearTimeout(_orientationChangeTimeout);
      _shout("unbindEvents");
    }, _calculatePanBounds = function(zoomLevel, update) {
      var bounds = _calculateItemSize(
        self2.currItem,
        _viewportSize,
        zoomLevel
      );
      if (update) {
        _currPanBounds = bounds;
      }
      return bounds;
    }, _getMinZoomLevel = function(item2) {
      if (!item2) {
        item2 = self2.currItem;
      }
      return item2.initialZoomLevel;
    }, _getMaxZoomLevel = function(item2) {
      if (!item2) {
        item2 = self2.currItem;
      }
      return item2.w > 0 ? _options.maxSpreadZoom : 1;
    }, _modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
      if (destZoomLevel === self2.currItem.initialZoomLevel) {
        destPanOffset[axis] = self2.currItem.initialPosition[axis];
        return true;
      } else {
        destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel);
        if (destPanOffset[axis] > destPanBounds.min[axis]) {
          destPanOffset[axis] = destPanBounds.min[axis];
          return true;
        } else if (destPanOffset[axis] < destPanBounds.max[axis]) {
          destPanOffset[axis] = destPanBounds.max[axis];
          return true;
        }
      }
      return false;
    }, _setupTransforms = function() {
      if (_transformKey) {
        var allow3dTransform = _features.perspective && !_likelyTouchDevice;
        _translatePrefix = "translate" + (allow3dTransform ? "3d(" : "(");
        _translateSufix = _features.perspective ? ", 0px)" : ")";
        return;
      }
      _transformKey = "left";
      framework.addClass(template, "pswp--ie");
      _setTranslateX = function(x, elStyle) {
        elStyle.left = x + "px";
      };
      _applyZoomPanToItem = function(item2) {
        var zoomRatio = item2.fitRatio > 1 ? 1 : item2.fitRatio, s = item2.container.style, w = zoomRatio * item2.w, h = zoomRatio * item2.h;
        s.width = w + "px";
        s.height = h + "px";
        s.left = item2.initialPosition.x + "px";
        s.top = item2.initialPosition.y + "px";
      };
      _applyCurrentZoomPan = function() {
        if (_currZoomElementStyle) {
          var s = _currZoomElementStyle, item2 = self2.currItem, zoomRatio = item2.fitRatio > 1 ? 1 : item2.fitRatio, w = zoomRatio * item2.w, h = zoomRatio * item2.h;
          s.width = w + "px";
          s.height = h + "px";
          s.left = _panOffset.x + "px";
          s.top = _panOffset.y + "px";
        }
      };
    }, _onKeyDown = function(e) {
      var keydownAction = "";
      if (_options.escKey && e.keyCode === 27) {
        keydownAction = "close";
      } else if (_options.arrowKeys) {
        if (e.keyCode === 37) {
          keydownAction = "prev";
        } else if (e.keyCode === 39) {
          keydownAction = "next";
        }
      }
      if (keydownAction) {
        if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
          self2[keydownAction]();
        }
      }
    }, _onGlobalClick = function(e) {
      if (!e) {
        return;
      }
      if (_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, _updatePageScrollOffset = function() {
      self2.setScrollOffset(0, framework.getScrollY());
    };
    var _animations = {}, _numAnimations = 0, _stopAnimation = function(name) {
      if (_animations[name]) {
        if (_animations[name].raf) {
          _cancelAF(_animations[name].raf);
        }
        _numAnimations--;
        delete _animations[name];
      }
    }, _registerStartAnimation = function(name) {
      if (_animations[name]) {
        _stopAnimation(name);
      }
      if (!_animations[name]) {
        _numAnimations++;
        _animations[name] = {};
      }
    }, _stopAllAnimations = function() {
      for (var prop in _animations) {
        if (_animations.hasOwnProperty(prop)) {
          _stopAnimation(prop);
        }
      }
    }, _animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
      var startAnimTime = _getCurrentTime(), t;
      _registerStartAnimation(name);
      var animloop = function() {
        if (_animations[name]) {
          t = _getCurrentTime() - startAnimTime;
          if (t >= d) {
            _stopAnimation(name);
            onUpdate(endProp);
            if (onComplete) {
              onComplete();
            }
            return;
          }
          onUpdate((endProp - b) * easingFn(t / d) + b);
          _animations[name].raf = _requestAF(animloop);
        }
      };
      animloop();
    };
    var publicMethods = {
      // make a few local variables and functions public
      shout: _shout,
      listen: _listen,
      viewportSize: _viewportSize,
      options: _options,
      isMainScrollAnimating: function() {
        return _mainScrollAnimating;
      },
      getZoomLevel: function() {
        return _currZoomLevel;
      },
      getCurrentIndex: function() {
        return _currentItemIndex;
      },
      isDragging: function() {
        return _isDragging;
      },
      isZooming: function() {
        return _isZooming;
      },
      setScrollOffset: function(x, y) {
        _offset.x = x;
        _currentWindowScrollY = _offset.y = y;
        _shout("updateScrollOffset", _offset);
      },
      applyZoomPan: function(zoomLevel, panX, panY, allowRenderResolution) {
        _panOffset.x = panX;
        _panOffset.y = panY;
        _currZoomLevel = zoomLevel;
        _applyCurrentZoomPan(allowRenderResolution);
      },
      init: function() {
        if (_isOpen || _isDestroying) {
          return;
        }
        var i;
        self2.framework = framework;
        self2.template = template;
        self2.bg = framework.getChildByClass(template, "pswp__bg");
        _initalClassName = template.className;
        _isOpen = true;
        _features = framework.detectFeatures();
        _requestAF = _features.raf;
        _cancelAF = _features.caf;
        _transformKey = _features.transform;
        _oldIE = _features.oldIE;
        self2.scrollWrap = framework.getChildByClass(
          template,
          "pswp__scroll-wrap"
        );
        self2.container = framework.getChildByClass(
          self2.scrollWrap,
          "pswp__container"
        );
        _containerStyle = self2.container.style;
        self2.itemHolders = _itemHolders = [
          { el: self2.container.children[0], wrap: 0, index: -1 },
          { el: self2.container.children[1], wrap: 0, index: -1 },
          { el: self2.container.children[2], wrap: 0, index: -1 }
        ];
        _itemHolders[0].el.style.display = _itemHolders[2].el.style.display = "none";
        _setupTransforms();
        _globalEventHandlers = {
          resize: self2.updateSize,
          // Fixes: iOS 10.3 resize event
          // does not update scrollWrap.clientWidth instantly after resize
          // https://github.com/dimsemenov/PhotoSwipe/issues/1315
          orientationchange: function() {
            clearTimeout(_orientationChangeTimeout);
            _orientationChangeTimeout = setTimeout(function() {
              if (_viewportSize.x !== self2.scrollWrap.clientWidth) {
                self2.updateSize();
              }
            }, 500);
          },
          scroll: _updatePageScrollOffset,
          keydown: _onKeyDown,
          click: _onGlobalClick
        };
        var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
        if (!_features.animationName || !_features.transform || oldPhone) {
          _options.showAnimationDuration = _options.hideAnimationDuration = 0;
        }
        for (i = 0; i < _modules.length; i++) {
          self2["init" + _modules[i]]();
        }
        if (UiClass) {
          var ui = self2.ui = new UiClass(self2, framework);
          ui.init();
        }
        _shout("firstUpdate");
        _currentItemIndex = _currentItemIndex || _options.index || 0;
        if (isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems()) {
          _currentItemIndex = 0;
        }
        self2.currItem = _getItemAt(_currentItemIndex);
        if (_features.isOldIOSPhone || _features.isOldAndroid) {
          _isFixedPosition = false;
        }
        template.setAttribute("aria-hidden", "false");
        if (_options.modal) {
          if (!_isFixedPosition) {
            template.style.position = "absolute";
            template.style.top = framework.getScrollY() + "px";
          } else {
            template.style.position = "fixed";
          }
        }
        if (_currentWindowScrollY === void 0) {
          _shout("initialLayout");
          _currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
        }
        var rootClasses = "pswp--open ";
        if (_options.mainClass) {
          rootClasses += _options.mainClass + " ";
        }
        if (_options.showHideOpacity) {
          rootClasses += "pswp--animate_opacity ";
        }
        rootClasses += _likelyTouchDevice ? "pswp--touch" : "pswp--notouch";
        rootClasses += _features.animationName ? " pswp--css_animation" : "";
        rootClasses += _features.svg ? " pswp--svg" : "";
        framework.addClass(template, rootClasses);
        self2.updateSize();
        _containerShiftIndex = -1;
        _indexDiff = null;
        for (i = 0; i < NUM_HOLDERS; i++) {
          _setTranslateX(
            (i + _containerShiftIndex) * _slideSize.x,
            _itemHolders[i].el.style
          );
        }
        if (!_oldIE) {
          framework.bind(self2.scrollWrap, _downEvents, self2);
        }
        _listen("initialZoomInEnd", function() {
          self2.setContent(_itemHolders[0], _currentItemIndex - 1);
          self2.setContent(_itemHolders[2], _currentItemIndex + 1);
          _itemHolders[0].el.style.display = _itemHolders[2].el.style.display = "block";
          if (_options.focus) {
            template.focus();
          }
          _bindEvents();
        });
        self2.setContent(_itemHolders[1], _currentItemIndex);
        self2.updateCurrItem();
        _shout("afterInit");
        if (!_isFixedPosition) {
          _updateSizeInterval = setInterval(function() {
            if (!_numAnimations && !_isDragging && !_isZooming && _currZoomLevel === self2.currItem.initialZoomLevel) {
              self2.updateSize();
            }
          }, 1e3);
        }
        framework.addClass(template, "pswp--visible");
      },
      // Close the gallery, then destroy it
      close: function() {
        if (!_isOpen) {
          return;
        }
        _isOpen = false;
        _isDestroying = true;
        _shout("close");
        _unbindEvents();
        _showOrHide(self2.currItem, null, true, self2.destroy);
      },
      // destroys the gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
      destroy: function() {
        _shout("destroy");
        if (_showOrHideTimeout) {
          clearTimeout(_showOrHideTimeout);
        }
        template.setAttribute("aria-hidden", "true");
        template.className = _initalClassName;
        if (_updateSizeInterval) {
          clearInterval(_updateSizeInterval);
        }
        framework.unbind(self2.scrollWrap, _downEvents, self2);
        framework.unbind(window, "scroll", self2);
        _stopDragUpdateLoop();
        _stopAllAnimations();
        _listeners = null;
      },
      /**
       * Pan image to position
       * @param {Number} x
       * @param {Number} y
       * @param {Boolean} force Will ignore bounds if set to true.
       */
      panTo: function(x, y, force) {
        if (!force) {
          if (x > _currPanBounds.min.x) {
            x = _currPanBounds.min.x;
          } else if (x < _currPanBounds.max.x) {
            x = _currPanBounds.max.x;
          }
          if (y > _currPanBounds.min.y) {
            y = _currPanBounds.min.y;
          } else if (y < _currPanBounds.max.y) {
            y = _currPanBounds.max.y;
          }
        }
        _panOffset.x = x;
        _panOffset.y = y;
        _applyCurrentZoomPan();
      },
      handleEvent: function(e) {
        e = e || window.event;
        if (_globalEventHandlers[e.type]) {
          _globalEventHandlers[e.type](e);
        }
      },
      goTo: function(index) {
        index = _getLoopedId(index);
        var diff = index - _currentItemIndex;
        _indexDiff = diff;
        _currentItemIndex = index;
        self2.currItem = _getItemAt(_currentItemIndex);
        _currPositionIndex -= diff;
        _moveMainScroll(_slideSize.x * _currPositionIndex);
        _stopAllAnimations();
        _mainScrollAnimating = false;
        self2.updateCurrItem();
      },
      next: function() {
        self2.goTo(_currentItemIndex + 1);
      },
      prev: function() {
        self2.goTo(_currentItemIndex - 1);
      },
      // update current zoom/pan objects
      updateCurrZoomItem: function(emulateSetContent) {
        if (emulateSetContent) {
          _shout("beforeChange", 0);
        }
        if (_itemHolders[1].el.children.length) {
          var zoomElement = _itemHolders[1].el.children[0];
          if (framework.hasClass(zoomElement, "pswp__zoom-wrap")) {
            _currZoomElementStyle = zoomElement.style;
          } else {
            _currZoomElementStyle = null;
          }
        } else {
          _currZoomElementStyle = null;
        }
        _currPanBounds = self2.currItem.bounds;
        _startZoomLevel = _currZoomLevel = self2.currItem.initialZoomLevel;
        _panOffset.x = _currPanBounds.center.x;
        _panOffset.y = _currPanBounds.center.y;
        if (emulateSetContent) {
          _shout("afterChange");
        }
      },
      invalidateCurrItems: function() {
        _itemsNeedUpdate = true;
        for (var i = 0; i < NUM_HOLDERS; i++) {
          if (_itemHolders[i].item) {
            _itemHolders[i].item.needsUpdate = true;
          }
        }
      },
      updateCurrItem: function(beforeAnimation) {
        if (_indexDiff === 0) {
          return;
        }
        var diffAbs = Math.abs(_indexDiff), tempHolder;
        if (beforeAnimation && diffAbs < 2) {
          return;
        }
        self2.currItem = _getItemAt(_currentItemIndex);
        _renderMaxResolution = false;
        _shout("beforeChange", _indexDiff);
        if (diffAbs >= NUM_HOLDERS) {
          _containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
          diffAbs = NUM_HOLDERS;
        }
        for (var i = 0; i < diffAbs; i++) {
          if (_indexDiff > 0) {
            tempHolder = _itemHolders.shift();
            _itemHolders[NUM_HOLDERS - 1] = tempHolder;
            _containerShiftIndex++;
            _setTranslateX(
              (_containerShiftIndex + 2) * _slideSize.x,
              tempHolder.el.style
            );
            self2.setContent(
              tempHolder,
              _currentItemIndex - diffAbs + i + 1 + 1
            );
          } else {
            tempHolder = _itemHolders.pop();
            _itemHolders.unshift(tempHolder);
            _containerShiftIndex--;
            _setTranslateX(
              _containerShiftIndex * _slideSize.x,
              tempHolder.el.style
            );
            self2.setContent(
              tempHolder,
              _currentItemIndex + diffAbs - i - 1 - 1
            );
          }
        }
        if (_currZoomElementStyle && Math.abs(_indexDiff) === 1) {
          var prevItem = _getItemAt(_prevItemIndex);
          if (prevItem.initialZoomLevel !== _currZoomLevel) {
            _calculateItemSize(prevItem, _viewportSize);
            _setImageSize(prevItem);
            _applyZoomPanToItem(prevItem);
          }
        }
        _indexDiff = 0;
        self2.updateCurrZoomItem();
        _prevItemIndex = _currentItemIndex;
        _shout("afterChange");
      },
      updateSize: function(force) {
        if (!_isFixedPosition && _options.modal) {
          var windowScrollY = framework.getScrollY();
          if (_currentWindowScrollY !== windowScrollY) {
            template.style.top = windowScrollY + "px";
            _currentWindowScrollY = windowScrollY;
          }
          if (!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
            return;
          }
          _windowVisibleSize.x = window.innerWidth;
          _windowVisibleSize.y = window.innerHeight;
          template.style.height = _windowVisibleSize.y + "px";
        }
        _viewportSize.x = self2.scrollWrap.clientWidth;
        _viewportSize.y = self2.scrollWrap.clientHeight;
        _updatePageScrollOffset();
        _slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
        _slideSize.y = _viewportSize.y;
        _moveMainScroll(_slideSize.x * _currPositionIndex);
        _shout("beforeResize");
        if (_containerShiftIndex !== void 0) {
          var holder, item2, hIndex;
          for (var i = 0; i < NUM_HOLDERS; i++) {
            holder = _itemHolders[i];
            _setTranslateX(
              (i + _containerShiftIndex) * _slideSize.x,
              holder.el.style
            );
            hIndex = _currentItemIndex + i - 1;
            if (_options.loop && _getNumItems() > 2) {
              hIndex = _getLoopedId(hIndex);
            }
            item2 = _getItemAt(hIndex);
            if (item2 && (_itemsNeedUpdate || item2.needsUpdate || !item2.bounds)) {
              self2.cleanSlide(item2);
              self2.setContent(holder, hIndex);
              if (i === 1) {
                self2.currItem = item2;
                self2.updateCurrZoomItem(true);
              }
              item2.needsUpdate = false;
            } else if (holder.index === -1 && hIndex >= 0) {
              self2.setContent(holder, hIndex);
            }
            if (item2 && item2.container) {
              _calculateItemSize(item2, _viewportSize);
              _setImageSize(item2);
              _applyZoomPanToItem(item2);
            }
          }
          _itemsNeedUpdate = false;
        }
        _startZoomLevel = _currZoomLevel = self2.currItem.initialZoomLevel;
        _currPanBounds = self2.currItem.bounds;
        if (_currPanBounds) {
          _panOffset.x = _currPanBounds.center.x;
          _panOffset.y = _currPanBounds.center.y;
          _applyCurrentZoomPan(true);
        }
        _shout("resize");
      },
      // Zoom current item to
      zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
        if (centerPoint) {
          _startZoomLevel = _currZoomLevel;
          _midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x;
          _midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y;
          _equalizePoints(_startPanOffset, _panOffset);
        }
        var destPanBounds = _calculatePanBounds(destZoomLevel, false), destPanOffset = {};
        _modifyDestPanOffset("x", destPanBounds, destPanOffset, destZoomLevel);
        _modifyDestPanOffset("y", destPanBounds, destPanOffset, destZoomLevel);
        var initialZoomLevel = _currZoomLevel;
        var initialPanOffset = {
          x: _panOffset.x,
          y: _panOffset.y
        };
        _roundPoint(destPanOffset);
        var onUpdate = function(now) {
          if (now === 1) {
            _currZoomLevel = destZoomLevel;
            _panOffset.x = destPanOffset.x;
            _panOffset.y = destPanOffset.y;
          } else {
            _currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
            _panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
            _panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
          }
          if (updateFn) {
            updateFn(now);
          }
          _applyCurrentZoomPan(now === 1);
        };
        if (speed) {
          _animateProp(
            "customZoomTo",
            0,
            1,
            speed,
            easingFn || framework.easing.sine.inOut,
            onUpdate
          );
        } else {
          onUpdate(1);
        }
      }
    };
    var MIN_SWIPE_DISTANCE = 30, DIRECTION_CHECK_OFFSET = 10;
    var _gestureStartTime, _gestureCheckSpeedTime, p = {}, p2 = {}, delta = {}, _currPoint = {}, _startPoint = {}, _currPointers = [], _startMainScrollPos = {}, _releaseAnimData, _posPoints = [], _tempPoint = {}, _isZoomingIn, _verticalDragInitiated, _oldAndroidTouchEndTimeout, _currZoomedItemIndex = 0, _centerPoint = _getEmptyPoint(), _lastReleaseTime = 0, _isDragging, _isMultitouch, _zoomStarted, _moved, _dragAnimFrame, _mainScrollShifted, _currentPoints, _isZooming, _currPointsDistance, _startPointsDistance, _currPanBounds, _mainScrollPos = _getEmptyPoint(), _currZoomElementStyle, _mainScrollAnimating, _midZoomPoint = _getEmptyPoint(), _currCenterPoint = _getEmptyPoint(), _direction, _isFirstMove, _opacityChanged, _bgOpacity, _wasOverInitialZoom, _isEqualPoints = function(p1, p22) {
      return p1.x === p22.x && p1.y === p22.y;
    }, _isNearbyPoints = function(touch0, touch1) {
      return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
    }, _calculatePointsDistance = function(p1, p22) {
      _tempPoint.x = Math.abs(p1.x - p22.x);
      _tempPoint.y = Math.abs(p1.y - p22.y);
      return Math.sqrt(
        _tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y
      );
    }, _stopDragUpdateLoop = function() {
      if (_dragAnimFrame) {
        _cancelAF(_dragAnimFrame);
        _dragAnimFrame = null;
      }
    }, _dragUpdateLoop = function() {
      if (_isDragging) {
        _dragAnimFrame = _requestAF(_dragUpdateLoop);
        _renderMovement();
      }
    }, _canPan = function() {
      return !(_options.scaleMode === "fit" && _currZoomLevel === self2.currItem.initialZoomLevel);
    }, _closestElement = function(el, fn) {
      if (!el || el === document) {
        return false;
      }
      if (el.getAttribute("class") && el.getAttribute("class").indexOf("pswp__scroll-wrap") > -1) {
        return false;
      }
      if (fn(el)) {
        return el;
      }
      return _closestElement(el.parentNode, fn);
    }, _preventObj = {}, _preventDefaultEventBehaviour = function(e, isDown) {
      _preventObj.prevent = !_closestElement(
        e.target,
        _options.isClickableElement
      );
      _shout("preventDragEvent", e, isDown, _preventObj);
      return _preventObj.prevent;
    }, _convertTouchToPoint = function(touch, p3) {
      p3.x = touch.pageX;
      p3.y = touch.pageY;
      p3.id = touch.identifier;
      return p3;
    }, _findCenterOfPoints = function(p1, p22, pCenter) {
      pCenter.x = (p1.x + p22.x) * 0.5;
      pCenter.y = (p1.y + p22.y) * 0.5;
    }, _pushPosPoint = function(time, x, y) {
      if (time - _gestureCheckSpeedTime > 50) {
        var o = _posPoints.length > 2 ? _posPoints.shift() : {};
        o.x = x;
        o.y = y;
        _posPoints.push(o);
        _gestureCheckSpeedTime = time;
      }
    }, _calculateVerticalDragOpacityRatio = function() {
      var yOffset = _panOffset.y - self2.currItem.initialPosition.y;
      return 1 - Math.abs(yOffset / (_viewportSize.y / 2));
    }, _ePoint1 = {}, _ePoint2 = {}, _tempPointsArr = [], _tempCounter, _getTouchPoints = function(e) {
      while (_tempPointsArr.length > 0) {
        _tempPointsArr.pop();
      }
      if (!_pointerEventEnabled) {
        if (e.type.indexOf("touch") > -1) {
          if (e.touches && e.touches.length > 0) {
            _tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
            if (e.touches.length > 1) {
              _tempPointsArr[1] = _convertTouchToPoint(
                e.touches[1],
                _ePoint2
              );
            }
          }
        } else {
          _ePoint1.x = e.pageX;
          _ePoint1.y = e.pageY;
          _ePoint1.id = "";
          _tempPointsArr[0] = _ePoint1;
        }
      } else {
        _tempCounter = 0;
        _currPointers.forEach(function(p3) {
          if (_tempCounter === 0) {
            _tempPointsArr[0] = p3;
          } else if (_tempCounter === 1) {
            _tempPointsArr[1] = p3;
          }
          _tempCounter++;
        });
      }
      return _tempPointsArr;
    }, _panOrMoveMainScroll = function(axis, delta2) {
      var panFriction, overDiff = 0, newOffset = _panOffset[axis] + delta2[axis], startOverDiff, dir = delta2[axis] > 0, newMainScrollPosition = _mainScrollPos.x + delta2.x, mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x, newPanPos, newMainScrollPos;
      if (newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
        panFriction = _options.panEndFriction;
      } else {
        panFriction = 1;
      }
      newOffset = _panOffset[axis] + delta2[axis] * panFriction;
      if (_options.allowPanToNext || _currZoomLevel === self2.currItem.initialZoomLevel) {
        if (!_currZoomElementStyle) {
          newMainScrollPos = newMainScrollPosition;
        } else if (_direction === "h" && axis === "x" && !_zoomStarted) {
          if (dir) {
            if (newOffset > _currPanBounds.min[axis]) {
              panFriction = _options.panEndFriction;
              overDiff = _currPanBounds.min[axis] - newOffset;
              startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
            }
            if ((startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1) {
              newMainScrollPos = newMainScrollPosition;
              if (mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
                newMainScrollPos = _startMainScrollPos.x;
              }
            } else {
              if (_currPanBounds.min.x !== _currPanBounds.max.x) {
                newPanPos = newOffset;
              }
            }
          } else {
            if (newOffset < _currPanBounds.max[axis]) {
              panFriction = _options.panEndFriction;
              overDiff = newOffset - _currPanBounds.max[axis];
              startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
            }
            if ((startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1) {
              newMainScrollPos = newMainScrollPosition;
              if (mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
                newMainScrollPos = _startMainScrollPos.x;
              }
            } else {
              if (_currPanBounds.min.x !== _currPanBounds.max.x) {
                newPanPos = newOffset;
              }
            }
          }
        }
        if (axis === "x") {
          if (newMainScrollPos !== void 0) {
            _moveMainScroll(newMainScrollPos, true);
            if (newMainScrollPos === _startMainScrollPos.x) {
              _mainScrollShifted = false;
            } else {
              _mainScrollShifted = true;
            }
          }
          if (_currPanBounds.min.x !== _currPanBounds.max.x) {
            if (newPanPos !== void 0) {
              _panOffset.x = newPanPos;
            } else if (!_mainScrollShifted) {
              _panOffset.x += delta2.x * panFriction;
            }
          }
          return newMainScrollPos !== void 0;
        }
      }
      if (!_mainScrollAnimating) {
        if (!_mainScrollShifted) {
          if (_currZoomLevel > self2.currItem.fitRatio) {
            _panOffset[axis] += delta2[axis] * panFriction;
          }
        }
      }
    }, _onDragStart = function(e) {
      if (e.type === "mousedown" && e.button > 0) {
        return;
      }
      if (_initialZoomRunning) {
        e.preventDefault();
        return;
      }
      if (_oldAndroidTouchEndTimeout && e.type === "mousedown") {
        return;
      }
      if (_preventDefaultEventBehaviour(e, true)) {
        e.preventDefault();
      }
      _shout("pointerDown");
      if (_pointerEventEnabled) {
        var pointerIndex = framework.arraySearch(
          _currPointers,
          e.pointerId,
          "id"
        );
        if (pointerIndex < 0) {
          pointerIndex = _currPointers.length;
        }
        _currPointers[pointerIndex] = {
          x: e.pageX,
          y: e.pageY,
          id: e.pointerId
        };
      }
      var startPointsList = _getTouchPoints(e), numPoints = startPointsList.length;
      _currentPoints = null;
      _stopAllAnimations();
      if (!_isDragging || numPoints === 1) {
        _isDragging = _isFirstMove = true;
        framework.bind(window, _upMoveEvents, self2);
        _isZoomingIn = _wasOverInitialZoom = _opacityChanged = _verticalDragInitiated = _mainScrollShifted = _moved = _isMultitouch = _zoomStarted = false;
        _direction = null;
        _shout("firstTouchStart", startPointsList);
        _equalizePoints(_startPanOffset, _panOffset);
        _currPanDist.x = _currPanDist.y = 0;
        _equalizePoints(_currPoint, startPointsList[0]);
        _equalizePoints(_startPoint, _currPoint);
        _startMainScrollPos.x = _slideSize.x * _currPositionIndex;
        _posPoints = [
          {
            x: _currPoint.x,
            y: _currPoint.y
          }
        ];
        _gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();
        _calculatePanBounds(_currZoomLevel, true);
        _stopDragUpdateLoop();
        _dragUpdateLoop();
      }
      if (!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
        _startZoomLevel = _currZoomLevel;
        _zoomStarted = false;
        _isZooming = _isMultitouch = true;
        _currPanDist.y = _currPanDist.x = 0;
        _equalizePoints(_startPanOffset, _panOffset);
        _equalizePoints(p, startPointsList[0]);
        _equalizePoints(p2, startPointsList[1]);
        _findCenterOfPoints(p, p2, _currCenterPoint);
        _midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
        _midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
        _currPointsDistance = _startPointsDistance = _calculatePointsDistance(
          p,
          p2
        );
      }
    }, _onDragMove = function(e) {
      e.preventDefault();
      if (_pointerEventEnabled) {
        var pointerIndex = framework.arraySearch(
          _currPointers,
          e.pointerId,
          "id"
        );
        if (pointerIndex > -1) {
          var p3 = _currPointers[pointerIndex];
          p3.x = e.pageX;
          p3.y = e.pageY;
        }
      }
      if (_isDragging) {
        var touchesList = _getTouchPoints(e);
        if (!_direction && !_moved && !_isZooming) {
          if (_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
            _direction = "h";
          } else {
            var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
            if (Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
              _direction = diff > 0 ? "h" : "v";
              _currentPoints = touchesList;
            }
          }
        } else {
          _currentPoints = touchesList;
        }
      }
    }, _renderMovement = function() {
      if (!_currentPoints) {
        return;
      }
      var numPoints = _currentPoints.length;
      if (numPoints === 0) {
        return;
      }
      _equalizePoints(p, _currentPoints[0]);
      delta.x = p.x - _currPoint.x;
      delta.y = p.y - _currPoint.y;
      if (_isZooming && numPoints > 1) {
        _currPoint.x = p.x;
        _currPoint.y = p.y;
        if (!delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2)) {
          return;
        }
        _equalizePoints(p2, _currentPoints[1]);
        if (!_zoomStarted) {
          _zoomStarted = true;
          _shout("zoomGestureStarted");
        }
        var pointsDistance = _calculatePointsDistance(p, p2);
        var zoomLevel = _calculateZoomLevel(pointsDistance);
        if (zoomLevel > self2.currItem.initialZoomLevel + self2.currItem.initialZoomLevel / 15) {
          _wasOverInitialZoom = true;
        }
        var zoomFriction = 1, minZoomLevel = _getMinZoomLevel(), maxZoomLevel = _getMaxZoomLevel();
        if (zoomLevel < minZoomLevel) {
          if (_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self2.currItem.initialZoomLevel) {
            var minusDiff = minZoomLevel - zoomLevel;
            var percent = 1 - minusDiff / (minZoomLevel / 1.2);
            _applyBgOpacity(percent);
            _shout("onPinchClose", percent);
            _opacityChanged = true;
          } else {
            zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
            if (zoomFriction > 1) {
              zoomFriction = 1;
            }
            zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
          }
        } else if (zoomLevel > maxZoomLevel) {
          zoomFriction = (zoomLevel - maxZoomLevel) / (minZoomLevel * 6);
          if (zoomFriction > 1) {
            zoomFriction = 1;
          }
          zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
        }
        if (zoomFriction < 0) {
          zoomFriction = 0;
        }
        _currPointsDistance = pointsDistance;
        _findCenterOfPoints(p, p2, _centerPoint);
        _currPanDist.x += _centerPoint.x - _currCenterPoint.x;
        _currPanDist.y += _centerPoint.y - _currCenterPoint.y;
        _equalizePoints(_currCenterPoint, _centerPoint);
        _panOffset.x = _calculatePanOffset("x", zoomLevel);
        _panOffset.y = _calculatePanOffset("y", zoomLevel);
        _isZoomingIn = zoomLevel > _currZoomLevel;
        _currZoomLevel = zoomLevel;
        _applyCurrentZoomPan();
      } else {
        if (!_direction) {
          return;
        }
        if (_isFirstMove) {
          _isFirstMove = false;
          if (Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
            delta.x -= _currentPoints[0].x - _startPoint.x;
          }
          if (Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
            delta.y -= _currentPoints[0].y - _startPoint.y;
          }
        }
        _currPoint.x = p.x;
        _currPoint.y = p.y;
        if (delta.x === 0 && delta.y === 0) {
          return;
        }
        if (_direction === "v" && _options.closeOnVerticalDrag) {
          if (!_canPan()) {
            _currPanDist.y += delta.y;
            _panOffset.y += delta.y;
            var opacityRatio = _calculateVerticalDragOpacityRatio();
            _verticalDragInitiated = true;
            _shout("onVerticalDrag", opacityRatio);
            _applyBgOpacity(opacityRatio);
            _applyCurrentZoomPan();
            return;
          }
        }
        _pushPosPoint(_getCurrentTime(), p.x, p.y);
        _moved = true;
        _currPanBounds = self2.currItem.bounds;
        var mainScrollChanged = _panOrMoveMainScroll("x", delta);
        if (!mainScrollChanged) {
          _panOrMoveMainScroll("y", delta);
          _roundPoint(_panOffset);
          _applyCurrentZoomPan();
        }
      }
    }, _onDragRelease = function(e) {
      if (_features.isOldAndroid) {
        if (_oldAndroidTouchEndTimeout && e.type === "mouseup") {
          return;
        }
        if (e.type.indexOf("touch") > -1) {
          clearTimeout(_oldAndroidTouchEndTimeout);
          _oldAndroidTouchEndTimeout = setTimeout(function() {
            _oldAndroidTouchEndTimeout = 0;
          }, 600);
        }
      }
      _shout("pointerUp");
      if (_preventDefaultEventBehaviour(e, false)) {
        e.preventDefault();
      }
      var releasePoint;
      if (_pointerEventEnabled) {
        var pointerIndex = framework.arraySearch(
          _currPointers,
          e.pointerId,
          "id"
        );
        if (pointerIndex > -1) {
          releasePoint = _currPointers.splice(pointerIndex, 1)[0];
          if (navigator.msPointerEnabled) {
            var MSPOINTER_TYPES = {
              4: "mouse",
              // event.MSPOINTER_TYPE_MOUSE
              2: "touch",
              // event.MSPOINTER_TYPE_TOUCH
              3: "pen"
              // event.MSPOINTER_TYPE_PEN
            };
            releasePoint.type = MSPOINTER_TYPES[e.pointerType];
            if (!releasePoint.type) {
              releasePoint.type = e.pointerType || "mouse";
            }
          } else {
            releasePoint.type = e.pointerType || "mouse";
          }
        }
      }
      var touchList = _getTouchPoints(e), gestureType, numPoints = touchList.length;
      if (e.type === "mouseup") {
        numPoints = 0;
      }
      if (numPoints === 2) {
        _currentPoints = null;
        return true;
      }
      if (numPoints === 1) {
        _equalizePoints(_startPoint, touchList[0]);
      }
      if (numPoints === 0 && !_direction && !_mainScrollAnimating) {
        if (!releasePoint) {
          if (e.type === "mouseup") {
            releasePoint = { x: e.pageX, y: e.pageY, type: "mouse" };
          } else if (e.changedTouches && e.changedTouches[0]) {
            releasePoint = {
              x: e.changedTouches[0].pageX,
              y: e.changedTouches[0].pageY,
              type: "touch"
            };
          }
        }
        _shout("touchRelease", e, releasePoint);
      }
      var releaseTimeDiff = -1;
      if (numPoints === 0) {
        _isDragging = false;
        framework.unbind(window, _upMoveEvents, self2);
        _stopDragUpdateLoop();
        if (_isZooming) {
          releaseTimeDiff = 0;
        } else if (_lastReleaseTime !== -1) {
          releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
        }
      }
      _lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;
      if (releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
        gestureType = "zoom";
      } else {
        gestureType = "swipe";
      }
      if (_isZooming && numPoints < 2) {
        _isZooming = false;
        if (numPoints === 1) {
          gestureType = "zoomPointerUp";
        }
        _shout("zoomGestureEnded");
      }
      _currentPoints = null;
      if (!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
        return;
      }
      _stopAllAnimations();
      if (!_releaseAnimData) {
        _releaseAnimData = _initDragReleaseAnimationData();
      }
      _releaseAnimData.calculateSwipeSpeed("x");
      if (_verticalDragInitiated) {
        var opacityRatio = _calculateVerticalDragOpacityRatio();
        if (opacityRatio < _options.verticalDragRange) {
          self2.close();
        } else {
          var initalPanY = _panOffset.y, initialBgOpacity = _bgOpacity;
          _animateProp(
            "verticalDrag",
            0,
            1,
            300,
            framework.easing.cubic.out,
            function(now) {
              _panOffset.y = (self2.currItem.initialPosition.y - initalPanY) * now + initalPanY;
              _applyBgOpacity(
                (1 - initialBgOpacity) * now + initialBgOpacity
              );
              _applyCurrentZoomPan();
            }
          );
          _shout("onVerticalDrag", 1);
        }
        return;
      }
      if ((_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
        var itemChanged = _finishSwipeMainScrollGesture(
          gestureType,
          _releaseAnimData
        );
        if (itemChanged) {
          return;
        }
        gestureType = "zoomPointerUp";
      }
      if (_mainScrollAnimating) {
        return;
      }
      if (gestureType !== "swipe") {
        _completeZoomGesture();
        return;
      }
      if (!_mainScrollShifted && _currZoomLevel > self2.currItem.fitRatio) {
        _completePanGesture(_releaseAnimData);
      }
    }, _initDragReleaseAnimationData = function() {
      var lastFlickDuration, tempReleasePos;
      var s = {
        lastFlickOffset: {},
        lastFlickDist: {},
        lastFlickSpeed: {},
        slowDownRatio: {},
        slowDownRatioReverse: {},
        speedDecelerationRatio: {},
        speedDecelerationRatioAbs: {},
        distanceOffset: {},
        backAnimDestination: {},
        backAnimStarted: {},
        calculateSwipeSpeed: function(axis) {
          if (_posPoints.length > 1) {
            lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
            tempReleasePos = _posPoints[_posPoints.length - 2][axis];
          } else {
            lastFlickDuration = _getCurrentTime() - _gestureStartTime;
            tempReleasePos = _startPoint[axis];
          }
          s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
          s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
          if (s.lastFlickDist[axis] > 20) {
            s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
          } else {
            s.lastFlickSpeed[axis] = 0;
          }
          if (Math.abs(s.lastFlickSpeed[axis]) < 0.1) {
            s.lastFlickSpeed[axis] = 0;
          }
          s.slowDownRatio[axis] = 0.95;
          s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
          s.speedDecelerationRatio[axis] = 1;
        },
        calculateOverBoundsAnimOffset: function(axis, speed) {
          if (!s.backAnimStarted[axis]) {
            if (_panOffset[axis] > _currPanBounds.min[axis]) {
              s.backAnimDestination[axis] = _currPanBounds.min[axis];
            } else if (_panOffset[axis] < _currPanBounds.max[axis]) {
              s.backAnimDestination[axis] = _currPanBounds.max[axis];
            }
            if (s.backAnimDestination[axis] !== void 0) {
              s.slowDownRatio[axis] = 0.7;
              s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
              if (s.speedDecelerationRatioAbs[axis] < 0.05) {
                s.lastFlickSpeed[axis] = 0;
                s.backAnimStarted[axis] = true;
                _animateProp(
                  "bounceZoomPan" + axis,
                  _panOffset[axis],
                  s.backAnimDestination[axis],
                  speed || 300,
                  framework.easing.sine.out,
                  function(pos) {
                    _panOffset[axis] = pos;
                    _applyCurrentZoomPan();
                  }
                );
              }
            }
          }
        },
        // Reduces the speed by slowDownRatio (per 10ms)
        calculateAnimOffset: function(axis) {
          if (!s.backAnimStarted[axis]) {
            s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + s.slowDownRatioReverse[axis] - s.slowDownRatioReverse[axis] * s.timeDiff / 10);
            s.speedDecelerationRatioAbs[axis] = Math.abs(
              s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]
            );
            s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
            _panOffset[axis] += s.distanceOffset[axis];
          }
        },
        panAnimLoop: function() {
          if (_animations.zoomPan) {
            _animations.zoomPan.raf = _requestAF(s.panAnimLoop);
            s.now = _getCurrentTime();
            s.timeDiff = s.now - s.lastNow;
            s.lastNow = s.now;
            s.calculateAnimOffset("x");
            s.calculateAnimOffset("y");
            _applyCurrentZoomPan();
            s.calculateOverBoundsAnimOffset("x");
            s.calculateOverBoundsAnimOffset("y");
            if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {
              _panOffset.x = Math.round(_panOffset.x);
              _panOffset.y = Math.round(_panOffset.y);
              _applyCurrentZoomPan();
              _stopAnimation("zoomPan");
              return;
            }
          }
        }
      };
      return s;
    }, _completePanGesture = function(animData) {
      animData.calculateSwipeSpeed("y");
      _currPanBounds = self2.currItem.bounds;
      animData.backAnimDestination = {};
      animData.backAnimStarted = {};
      if (Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05) {
        animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;
        animData.calculateOverBoundsAnimOffset("x");
        animData.calculateOverBoundsAnimOffset("y");
        return true;
      }
      _registerStartAnimation("zoomPan");
      animData.lastNow = _getCurrentTime();
      animData.panAnimLoop();
    }, _finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData2) {
      var itemChanged;
      if (!_mainScrollAnimating) {
        _currZoomedItemIndex = _currentItemIndex;
      }
      var itemsDiff;
      if (gestureType === "swipe") {
        var totalShiftDist = _currPoint.x - _startPoint.x, isFastLastFlick = _releaseAnimData2.lastFlickDist.x < 10;
        if (totalShiftDist > MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData2.lastFlickOffset.x > 20)) {
          itemsDiff = -1;
        } else if (totalShiftDist < -MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData2.lastFlickOffset.x < -20)) {
          itemsDiff = 1;
        }
      }
      var nextCircle;
      if (itemsDiff) {
        _currentItemIndex += itemsDiff;
        if (_currentItemIndex < 0) {
          _currentItemIndex = _options.loop ? _getNumItems() - 1 : 0;
          nextCircle = true;
        } else if (_currentItemIndex >= _getNumItems()) {
          _currentItemIndex = _options.loop ? 0 : _getNumItems() - 1;
          nextCircle = true;
        }
        if (!nextCircle || _options.loop) {
          _indexDiff += itemsDiff;
          _currPositionIndex -= itemsDiff;
          itemChanged = true;
        }
      }
      var animateToX = _slideSize.x * _currPositionIndex;
      var animateToDist = Math.abs(animateToX - _mainScrollPos.x);
      var finishAnimDuration;
      if (!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData2.lastFlickSpeed.x > 0) {
        finishAnimDuration = 333;
      } else {
        finishAnimDuration = Math.abs(_releaseAnimData2.lastFlickSpeed.x) > 0 ? animateToDist / Math.abs(_releaseAnimData2.lastFlickSpeed.x) : 333;
        finishAnimDuration = Math.min(finishAnimDuration, 400);
        finishAnimDuration = Math.max(finishAnimDuration, 250);
      }
      if (_currZoomedItemIndex === _currentItemIndex) {
        itemChanged = false;
      }
      _mainScrollAnimating = true;
      _shout("mainScrollAnimStart");
      _animateProp(
        "mainScroll",
        _mainScrollPos.x,
        animateToX,
        finishAnimDuration,
        framework.easing.cubic.out,
        _moveMainScroll,
        function() {
          _stopAllAnimations();
          _mainScrollAnimating = false;
          _currZoomedItemIndex = -1;
          if (itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
            self2.updateCurrItem();
          }
          _shout("mainScrollAnimComplete");
        }
      );
      if (itemChanged) {
        self2.updateCurrItem(true);
      }
      return itemChanged;
    }, _calculateZoomLevel = function(touchesDistance) {
      return 1 / _startPointsDistance * touchesDistance * _startZoomLevel;
    }, _completeZoomGesture = function() {
      var destZoomLevel = _currZoomLevel, minZoomLevel = _getMinZoomLevel(), maxZoomLevel = _getMaxZoomLevel();
      if (_currZoomLevel < minZoomLevel) {
        destZoomLevel = minZoomLevel;
      } else if (_currZoomLevel > maxZoomLevel) {
        destZoomLevel = maxZoomLevel;
      }
      var destOpacity = 1, onUpdate, initialOpacity = _bgOpacity;
      if (_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
        self2.close();
        return true;
      }
      if (_opacityChanged) {
        onUpdate = function(now) {
          _applyBgOpacity(
            (destOpacity - initialOpacity) * now + initialOpacity
          );
        };
      }
      self2.zoomTo(
        destZoomLevel,
        0,
        200,
        framework.easing.cubic.out,
        onUpdate
      );
      return true;
    };
    _registerModule("Gestures", {
      publicMethods: {
        initGestures: function() {
          var addEventNames = function(pref, down, move, up, cancel) {
            _dragStartEvent = pref + down;
            _dragMoveEvent = pref + move;
            _dragEndEvent = pref + up;
            if (cancel) {
              _dragCancelEvent = pref + cancel;
            } else {
              _dragCancelEvent = "";
            }
          };
          _pointerEventEnabled = _features.pointerEvent;
          if (_pointerEventEnabled && _features.touch) {
            _features.touch = false;
          }
          if (_pointerEventEnabled) {
            if (navigator.msPointerEnabled) {
              addEventNames("MSPointer", "Down", "Move", "Up", "Cancel");
            } else {
              addEventNames("pointer", "down", "move", "up", "cancel");
            }
          } else if (_features.touch) {
            addEventNames("touch", "start", "move", "end", "cancel");
            _likelyTouchDevice = true;
          } else {
            addEventNames("mouse", "down", "move", "up");
          }
          _upMoveEvents = _dragMoveEvent + " " + _dragEndEvent + " " + _dragCancelEvent;
          _downEvents = _dragStartEvent;
          if (_pointerEventEnabled && !_likelyTouchDevice) {
            _likelyTouchDevice = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1;
          }
          self2.likelyTouchDevice = _likelyTouchDevice;
          _globalEventHandlers[_dragStartEvent] = _onDragStart;
          _globalEventHandlers[_dragMoveEvent] = _onDragMove;
          _globalEventHandlers[_dragEndEvent] = _onDragRelease;
          if (_dragCancelEvent) {
            _globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
          }
          if (_features.touch) {
            _downEvents += " mousedown";
            _upMoveEvents += " mousemove mouseup";
            _globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
            _globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
            _globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
          }
          if (!_likelyTouchDevice) {
            _options.allowPanToNext = false;
          }
        }
      }
    });
    var _showOrHideTimeout, _showOrHide = function(item2, img, out, completeFn) {
      if (_showOrHideTimeout) {
        clearTimeout(_showOrHideTimeout);
      }
      _initialZoomRunning = true;
      _initialContentSet = true;
      var thumbBounds;
      if (item2.initialLayout) {
        thumbBounds = item2.initialLayout;
        item2.initialLayout = null;
      } else {
        thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
      }
      var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;
      var onComplete = function() {
        _stopAnimation("initialZoom");
        if (!out) {
          _applyBgOpacity(1);
          if (img) {
            img.style.display = "block";
          }
          framework.addClass(template, "pswp--animated-in");
          _shout("initialZoom" + (out ? "OutEnd" : "InEnd"));
        } else {
          self2.template.removeAttribute("style");
          self2.bg.removeAttribute("style");
        }
        if (completeFn) {
          completeFn();
        }
        _initialZoomRunning = false;
      };
      if (!duration || !thumbBounds || thumbBounds.x === void 0) {
        _shout("initialZoom" + (out ? "Out" : "In"));
        _currZoomLevel = item2.initialZoomLevel;
        _equalizePoints(_panOffset, item2.initialPosition);
        _applyCurrentZoomPan();
        template.style.opacity = out ? 0 : 1;
        _applyBgOpacity(1);
        if (duration) {
          setTimeout(function() {
            onComplete();
          }, duration);
        } else {
          onComplete();
        }
        return;
      }
      var startAnimation = function() {
        var closeWithRaf = _closedByScroll, fadeEverything = !self2.currItem.src || self2.currItem.loadError || _options.showHideOpacity;
        if (item2.miniImg) {
          item2.miniImg.style.webkitBackfaceVisibility = "hidden";
        }
        if (!out) {
          _currZoomLevel = thumbBounds.w / item2.w;
          _panOffset.x = thumbBounds.x;
          _panOffset.y = thumbBounds.y - _initalWindowScrollY;
          self2[fadeEverything ? "template" : "bg"].style.opacity = 1e-3;
          _applyCurrentZoomPan();
        }
        _registerStartAnimation("initialZoom");
        if (out && !closeWithRaf) {
          framework.removeClass(template, "pswp--animated-in");
        }
        if (fadeEverything) {
          if (out) {
            framework[(closeWithRaf ? "remove" : "add") + "Class"](
              template,
              "pswp--animate_opacity"
            );
          } else {
            setTimeout(function() {
              framework.addClass(template, "pswp--animate_opacity");
            }, 30);
          }
        }
        _showOrHideTimeout = setTimeout(
          function() {
            _shout("initialZoom" + (out ? "Out" : "In"));
            if (!out) {
              _currZoomLevel = item2.initialZoomLevel;
              _equalizePoints(_panOffset, item2.initialPosition);
              _applyCurrentZoomPan();
              _applyBgOpacity(1);
              if (fadeEverything) {
                template.style.opacity = 1;
              } else {
                _applyBgOpacity(1);
              }
              _showOrHideTimeout = setTimeout(onComplete, duration + 20);
            } else {
              var destZoomLevel = thumbBounds.w / item2.w, initialPanOffset = {
                x: _panOffset.x,
                y: _panOffset.y
              }, initialZoomLevel = _currZoomLevel, initalBgOpacity = _bgOpacity, onUpdate = function(now) {
                if (now === 1) {
                  _currZoomLevel = destZoomLevel;
                  _panOffset.x = thumbBounds.x;
                  _panOffset.y = thumbBounds.y - _currentWindowScrollY;
                } else {
                  _currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
                  _panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
                  _panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
                }
                _applyCurrentZoomPan();
                if (fadeEverything) {
                  template.style.opacity = 1 - now;
                } else {
                  _applyBgOpacity(initalBgOpacity - now * initalBgOpacity);
                }
              };
              if (closeWithRaf) {
                _animateProp(
                  "initialZoom",
                  0,
                  1,
                  duration,
                  framework.easing.cubic.out,
                  onUpdate,
                  onComplete
                );
              } else {
                onUpdate(1);
                _showOrHideTimeout = setTimeout(onComplete, duration + 20);
              }
            }
          },
          out ? 25 : 90
        );
      };
      startAnimation();
    };
    var _items, _tempPanAreaSize = {}, _imagesToAppendPool = [], _initialContentSet, _initialZoomRunning, _controllerDefaultOptions = {
      index: 0,
      errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
      forceProgressiveLoading: false,
      // TODO
      preload: [1, 1],
      getNumItemsFn: function() {
        return _items.length;
      }
    };
    var _getItemAt, _getNumItems, _initialIsLoop, _getZeroBounds = function() {
      return {
        center: { x: 0, y: 0 },
        max: { x: 0, y: 0 },
        min: { x: 0, y: 0 }
      };
    }, _calculateSingleItemPanBounds = function(item2, realPanElementW, realPanElementH) {
      var bounds = item2.bounds;
      bounds.center.x = Math.round(
        (_tempPanAreaSize.x - realPanElementW) / 2
      );
      bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item2.vGap.top;
      bounds.max.x = realPanElementW > _tempPanAreaSize.x ? Math.round(_tempPanAreaSize.x - realPanElementW) : bounds.center.x;
      bounds.max.y = realPanElementH > _tempPanAreaSize.y ? Math.round(_tempPanAreaSize.y - realPanElementH) + item2.vGap.top : bounds.center.y;
      bounds.min.x = realPanElementW > _tempPanAreaSize.x ? 0 : bounds.center.x;
      bounds.min.y = realPanElementH > _tempPanAreaSize.y ? item2.vGap.top : bounds.center.y;
    }, _calculateItemSize = function(item2, viewportSize, zoomLevel) {
      if (item2.src && !item2.loadError) {
        var isInitial = !zoomLevel;
        if (isInitial) {
          if (!item2.vGap) {
            item2.vGap = { top: 0, bottom: 0 };
          }
          _shout("parseVerticalMargin", item2);
        }
        _tempPanAreaSize.x = viewportSize.x;
        _tempPanAreaSize.y = viewportSize.y - item2.vGap.top - item2.vGap.bottom;
        if (isInitial) {
          var hRatio = _tempPanAreaSize.x / item2.w;
          var vRatio = _tempPanAreaSize.y / item2.h;
          item2.fitRatio = hRatio < vRatio ? hRatio : vRatio;
          var scaleMode = _options.scaleMode;
          if (scaleMode === "orig") {
            zoomLevel = 1;
          } else if (scaleMode === "fit") {
            zoomLevel = item2.fitRatio;
          }
          if (zoomLevel > 1) {
            zoomLevel = 1;
          }
          item2.initialZoomLevel = zoomLevel;
          if (!item2.bounds) {
            item2.bounds = _getZeroBounds();
          }
        }
        if (!zoomLevel) {
          return;
        }
        _calculateSingleItemPanBounds(
          item2,
          item2.w * zoomLevel,
          item2.h * zoomLevel
        );
        if (isInitial && zoomLevel === item2.initialZoomLevel) {
          item2.initialPosition = item2.bounds.center;
        }
        return item2.bounds;
      } else {
        item2.w = item2.h = 0;
        item2.initialZoomLevel = item2.fitRatio = 1;
        item2.bounds = _getZeroBounds();
        item2.initialPosition = item2.bounds.center;
        return item2.bounds;
      }
    }, _appendImage = function(index, item2, baseDiv, img, preventAnimation, keepPlaceholder) {
      if (item2.loadError) {
        return;
      }
      if (img) {
        item2.imageAppended = true;
        _setImageSize(
          item2,
          img,
          item2 === self2.currItem && _renderMaxResolution
        );
        baseDiv.appendChild(img);
        if (keepPlaceholder) {
          setTimeout(function() {
            if (item2 && item2.loaded && item2.placeholder) {
              item2.placeholder.style.display = "none";
              item2.placeholder = null;
            }
          }, 500);
        }
      }
    }, _preloadImage = function(item2) {
      item2.loading = true;
      item2.loaded = false;
      var img = item2.img = framework.createEl("pswp__img", "img");
      var onComplete = function() {
        item2.loading = false;
        item2.loaded = true;
        if (item2.loadComplete) {
          item2.loadComplete(item2);
        } else {
          item2.img = null;
        }
        img.onload = img.onerror = null;
        img = null;
      };
      img.onload = onComplete;
      img.onerror = function() {
        item2.loadError = true;
        onComplete();
      };
      img.src = item2.src;
      return img;
    }, _checkForError = function(item2, cleanUp) {
      if (item2.src && item2.loadError && item2.container) {
        if (cleanUp) {
          item2.container.innerHTML = "";
        }
        item2.container.innerHTML = _options.errorMsg.replace(
          "%url%",
          item2.src
        );
        return true;
      }
    }, _setImageSize = function(item2, img, maxRes) {
      if (!item2.src) {
        return;
      }
      if (!img) {
        img = item2.container.lastChild;
      }
      var w = maxRes ? item2.w : Math.round(item2.w * item2.fitRatio), h = maxRes ? item2.h : Math.round(item2.h * item2.fitRatio);
      if (item2.placeholder && !item2.loaded) {
        item2.placeholder.style.width = w + "px";
        item2.placeholder.style.height = h + "px";
      }
      img.style.width = w + "px";
      img.style.height = h + "px";
    }, _appendImagesPool = function() {
      if (_imagesToAppendPool.length) {
        var poolItem;
        for (var i = 0; i < _imagesToAppendPool.length; i++) {
          poolItem = _imagesToAppendPool[i];
          if (poolItem.holder.index === poolItem.index) {
            _appendImage(
              poolItem.index,
              poolItem.item,
              poolItem.baseDiv,
              poolItem.img,
              false,
              poolItem.clearPlaceholder
            );
          }
        }
        _imagesToAppendPool = [];
      }
    };
    _registerModule("Controller", {
      publicMethods: {
        lazyLoadItem: function(index) {
          index = _getLoopedId(index);
          var item2 = _getItemAt(index);
          if (!item2 || (item2.loaded || item2.loading) && !_itemsNeedUpdate) {
            return;
          }
          _shout("gettingData", index, item2);
          if (!item2.src) {
            return;
          }
          _preloadImage(item2);
        },
        initController: function() {
          framework.extend(_options, _controllerDefaultOptions, true);
          self2.items = _items = items;
          _getItemAt = self2.getItemAt;
          _getNumItems = _options.getNumItemsFn;
          _initialIsLoop = _options.loop;
          if (_getNumItems() < 3) {
            _options.loop = false;
          }
          _listen("beforeChange", function(diff) {
            var p3 = _options.preload, isNext = diff === null ? true : diff >= 0, preloadBefore = Math.min(p3[0], _getNumItems()), preloadAfter = Math.min(p3[1], _getNumItems()), i;
            for (i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
              self2.lazyLoadItem(_currentItemIndex + i);
            }
            for (i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
              self2.lazyLoadItem(_currentItemIndex - i);
            }
          });
          _listen("initialLayout", function() {
            self2.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
          });
          _listen("mainScrollAnimComplete", _appendImagesPool);
          _listen("initialZoomInEnd", _appendImagesPool);
          _listen("destroy", function() {
            var item2;
            for (var i = 0; i < _items.length; i++) {
              item2 = _items[i];
              if (item2.container) {
                item2.container = null;
              }
              if (item2.placeholder) {
                item2.placeholder = null;
              }
              if (item2.img) {
                item2.img = null;
              }
              if (item2.preloader) {
                item2.preloader = null;
              }
              if (item2.loadError) {
                item2.loaded = item2.loadError = false;
              }
            }
            _imagesToAppendPool = null;
          });
        },
        getItemAt: function(index) {
          if (index >= 0) {
            return _items[index] !== void 0 ? _items[index] : false;
          }
          return false;
        },
        allowProgressiveImg: function() {
          return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200;
        },
        setContent: function(holder, index) {
          if (_options.loop) {
            index = _getLoopedId(index);
          }
          var prevItem = self2.getItemAt(holder.index);
          if (prevItem) {
            prevItem.container = null;
          }
          var item2 = self2.getItemAt(index), img;
          if (!item2) {
            holder.el.innerHTML = "";
            return;
          }
          _shout("gettingData", index, item2);
          holder.index = index;
          holder.item = item2;
          var baseDiv = item2.container = framework.createEl(
            "pswp__zoom-wrap"
          );
          if (!item2.src && item2.html) {
            if (item2.html.tagName) {
              baseDiv.appendChild(item2.html);
            } else {
              baseDiv.innerHTML = item2.html;
            }
          }
          _checkForError(item2);
          _calculateItemSize(item2, _viewportSize);
          if (item2.src && !item2.loadError && !item2.loaded) {
            item2.loadComplete = function(item3) {
              if (!_isOpen) {
                return;
              }
              if (holder && holder.index === index) {
                if (_checkForError(item3, true)) {
                  item3.loadComplete = item3.img = null;
                  _calculateItemSize(item3, _viewportSize);
                  _applyZoomPanToItem(item3);
                  if (holder.index === _currentItemIndex) {
                    self2.updateCurrZoomItem();
                  }
                  return;
                }
                if (!item3.imageAppended) {
                  if (_features.transform && (_mainScrollAnimating || _initialZoomRunning)) {
                    _imagesToAppendPool.push({
                      item: item3,
                      baseDiv,
                      img: item3.img,
                      index,
                      holder,
                      clearPlaceholder: true
                    });
                  } else {
                    _appendImage(
                      index,
                      item3,
                      baseDiv,
                      item3.img,
                      _mainScrollAnimating || _initialZoomRunning,
                      true
                    );
                  }
                } else {
                  if (!_initialZoomRunning && item3.placeholder) {
                    item3.placeholder.style.display = "none";
                    item3.placeholder = null;
                  }
                }
              }
              item3.loadComplete = null;
              item3.img = null;
              _shout("imageLoadComplete", index, item3);
            };
            if (framework.features.transform) {
              var placeholderClassName = "pswp__img pswp__img--placeholder";
              placeholderClassName += item2.msrc ? "" : " pswp__img--placeholder--blank";
              var placeholder = framework.createEl(
                placeholderClassName,
                item2.msrc ? "img" : ""
              );
              if (item2.msrc) {
                placeholder.src = item2.msrc;
              }
              _setImageSize(item2, placeholder);
              baseDiv.appendChild(placeholder);
              item2.placeholder = placeholder;
            }
            if (!item2.loading) {
              _preloadImage(item2);
            }
            if (self2.allowProgressiveImg()) {
              if (!_initialContentSet && _features.transform) {
                _imagesToAppendPool.push({
                  item: item2,
                  baseDiv,
                  img: item2.img,
                  index,
                  holder
                });
              } else {
                _appendImage(index, item2, baseDiv, item2.img, true, true);
              }
            }
          } else if (item2.src && !item2.loadError) {
            img = framework.createEl("pswp__img", "img");
            img.style.opacity = 1;
            img.src = item2.src;
            _setImageSize(item2, img);
            _appendImage(index, item2, baseDiv, img, true);
          }
          if (!_initialContentSet && index === _currentItemIndex) {
            _currZoomElementStyle = baseDiv.style;
            _showOrHide(item2, img || item2.img);
          } else {
            _applyZoomPanToItem(item2);
          }
          holder.el.innerHTML = "";
          holder.el.appendChild(baseDiv);
        },
        cleanSlide: function(item2) {
          if (item2.img) {
            item2.img.onload = item2.img.onerror = null;
          }
          item2.loaded = item2.loading = item2.img = item2.imageAppended = false;
        }
      }
    });
    var tapTimer, tapReleasePoint = {}, _dispatchTapEvent = function(origEvent, releasePoint, pointerType) {
      var e = document.createEvent("CustomEvent"), eDetail = {
        origEvent,
        target: origEvent.target,
        releasePoint,
        pointerType: pointerType || "touch"
      };
      e.initCustomEvent("pswpTap", true, true, eDetail);
      origEvent.target.dispatchEvent(e);
    };
    _registerModule("Tap", {
      publicMethods: {
        initTap: function() {
          _listen("firstTouchStart", self2.onTapStart);
          _listen("touchRelease", self2.onTapRelease);
          _listen("destroy", function() {
            tapReleasePoint = {};
            tapTimer = null;
          });
        },
        onTapStart: function(touchList) {
          if (touchList.length > 1) {
            clearTimeout(tapTimer);
            tapTimer = null;
          }
        },
        onTapRelease: function(e, releasePoint) {
          if (!releasePoint) {
            return;
          }
          if (!_moved && !_isMultitouch && !_numAnimations) {
            var p0 = releasePoint;
            if (tapTimer) {
              clearTimeout(tapTimer);
              tapTimer = null;
              if (_isNearbyPoints(p0, tapReleasePoint)) {
                _shout("doubleTap", p0);
                return;
              }
            }
            if (releasePoint.type === "mouse") {
              _dispatchTapEvent(e, releasePoint, "mouse");
              return;
            }
            var clickedTagName = e.target.tagName.toUpperCase();
            if (clickedTagName === "BUTTON" || framework.hasClass(e.target, "pswp__single-tap")) {
              _dispatchTapEvent(e, releasePoint);
              return;
            }
            _equalizePoints(tapReleasePoint, p0);
            tapTimer = setTimeout(function() {
              _dispatchTapEvent(e, releasePoint);
              tapTimer = null;
            }, 300);
          }
        }
      }
    });
    var _wheelDelta;
    _registerModule("DesktopZoom", {
      publicMethods: {
        initDesktopZoom: function() {
          if (_oldIE) {
            return;
          }
          if (_likelyTouchDevice) {
            _listen("mouseUsed", function() {
              self2.setupDesktopZoom();
            });
          } else {
            self2.setupDesktopZoom(true);
          }
        },
        setupDesktopZoom: function(onInit) {
          _wheelDelta = {};
          var events = "wheel mousewheel DOMMouseScroll";
          _listen("bindEvents", function() {
            framework.bind(template, events, self2.handleMouseWheel);
          });
          _listen("unbindEvents", function() {
            if (_wheelDelta) {
              framework.unbind(template, events, self2.handleMouseWheel);
            }
          });
          self2.mouseZoomedIn = false;
          var hasDraggingClass, updateZoomable = function() {
            if (self2.mouseZoomedIn) {
              framework.removeClass(template, "pswp--zoomed-in");
              self2.mouseZoomedIn = false;
            }
            if (_currZoomLevel < 1) {
              framework.addClass(template, "pswp--zoom-allowed");
            } else {
              framework.removeClass(template, "pswp--zoom-allowed");
            }
            removeDraggingClass();
          }, removeDraggingClass = function() {
            if (hasDraggingClass) {
              framework.removeClass(template, "pswp--dragging");
              hasDraggingClass = false;
            }
          };
          _listen("resize", updateZoomable);
          _listen("afterChange", updateZoomable);
          _listen("pointerDown", function() {
            if (self2.mouseZoomedIn) {
              hasDraggingClass = true;
              framework.addClass(template, "pswp--dragging");
            }
          });
          _listen("pointerUp", removeDraggingClass);
          if (!onInit) {
            updateZoomable();
          }
        },
        handleMouseWheel: function(e) {
          if (_currZoomLevel <= self2.currItem.fitRatio) {
            if (_options.modal) {
              if (!_options.closeOnScroll || _numAnimations || _isDragging) {
                e.preventDefault();
              } else if (_transformKey && Math.abs(e.deltaY) > 2) {
                _closedByScroll = true;
                self2.close();
              }
            }
            return true;
          }
          e.stopPropagation();
          _wheelDelta.x = 0;
          if ("deltaX" in e) {
            if (e.deltaMode === 1) {
              _wheelDelta.x = e.deltaX * 18;
              _wheelDelta.y = e.deltaY * 18;
            } else {
              _wheelDelta.x = e.deltaX;
              _wheelDelta.y = e.deltaY;
            }
          } else if ("wheelDelta" in e) {
            if (e.wheelDeltaX) {
              _wheelDelta.x = -0.16 * e.wheelDeltaX;
            }
            if (e.wheelDeltaY) {
              _wheelDelta.y = -0.16 * e.wheelDeltaY;
            } else {
              _wheelDelta.y = -0.16 * e.wheelDelta;
            }
          } else if ("detail" in e) {
            _wheelDelta.y = e.detail;
          } else {
            return;
          }
          _calculatePanBounds(_currZoomLevel, true);
          var newPanX = _panOffset.x - _wheelDelta.x, newPanY = _panOffset.y - _wheelDelta.y;
          if (_options.modal || newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x && newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y) {
            e.preventDefault();
          }
          self2.panTo(newPanX, newPanY);
        },
        toggleDesktopZoom: function(centerPoint) {
          centerPoint = centerPoint || {
            x: _viewportSize.x / 2 + _offset.x,
            y: _viewportSize.y / 2 + _offset.y
          };
          var doubleTapZoomLevel = _options.getDoubleTapZoom(
            true,
            self2.currItem
          );
          var zoomOut = _currZoomLevel === doubleTapZoomLevel;
          self2.mouseZoomedIn = !zoomOut;
          self2.zoomTo(
            zoomOut ? self2.currItem.initialZoomLevel : doubleTapZoomLevel,
            centerPoint,
            333
          );
          framework[(!zoomOut ? "add" : "remove") + "Class"](
            template,
            "pswp--zoomed-in"
          );
        }
      }
    });
    var _historyDefaultOptions = {
      history: true,
      galleryUID: 1
    };
    var _historyUpdateTimeout, _hashChangeTimeout, _hashAnimCheckTimeout, _hashChangedByScript, _hashChangedByHistory, _hashReseted, _initialHash, _historyChanged, _closedFromURL, _urlChangedOnce, _windowLoc, _supportsPushState, _getHash = function() {
      return _windowLoc.hash.substring(1);
    }, _cleanHistoryTimeouts = function() {
      if (_historyUpdateTimeout) {
        clearTimeout(_historyUpdateTimeout);
      }
      if (_hashAnimCheckTimeout) {
        clearTimeout(_hashAnimCheckTimeout);
      }
    }, _parseItemIndexFromURL = function() {
      var hash = _getHash(), params = {};
      if (hash.length < 5) {
        return params;
      }
      var i, vars = hash.split("&");
      for (i = 0; i < vars.length; i++) {
        if (!vars[i]) {
          continue;
        }
        var pair = vars[i].split("=");
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }
      if (_options.galleryPIDs) {
        var searchfor = params.pid;
        params.pid = 0;
        for (i = 0; i < _items.length; i++) {
          if (_items[i].pid === searchfor) {
            params.pid = i;
            break;
          }
        }
      } else {
        params.pid = parseInt(params.pid, 10) - 1;
      }
      if (params.pid < 0) {
        params.pid = 0;
      }
      return params;
    }, _updateHash = function() {
      if (_hashAnimCheckTimeout) {
        clearTimeout(_hashAnimCheckTimeout);
      }
      if (_numAnimations || _isDragging) {
        _hashAnimCheckTimeout = setTimeout(_updateHash, 500);
        return;
      }
      if (_hashChangedByScript) {
        clearTimeout(_hashChangeTimeout);
      } else {
        _hashChangedByScript = true;
      }
      var pid = _currentItemIndex + 1;
      var item2 = _getItemAt(_currentItemIndex);
      if (item2.hasOwnProperty("pid")) {
        pid = item2.pid;
      }
      var newHash = _initialHash + "&gid=" + _options.galleryUID + "&pid=" + pid;
      if (!_historyChanged) {
        if (_windowLoc.hash.indexOf(newHash) === -1) {
          _urlChangedOnce = true;
        }
      }
      var newURL = _windowLoc.href.split("#")[0] + "#" + newHash;
      if (_supportsPushState) {
        if ("#" + newHash !== window.location.hash) {
          history[_historyChanged ? "replaceState" : "pushState"](
            "",
            document.title,
            newURL
          );
        }
      } else {
        if (_historyChanged) {
          _windowLoc.replace(newURL);
        } else {
          _windowLoc.hash = newHash;
        }
      }
      _historyChanged = true;
      _hashChangeTimeout = setTimeout(function() {
        _hashChangedByScript = false;
      }, 60);
    };
    _registerModule("History", {
      publicMethods: {
        initHistory: function() {
          framework.extend(_options, _historyDefaultOptions, true);
          if (!_options.history) {
            return;
          }
          _windowLoc = window.location;
          _urlChangedOnce = false;
          _closedFromURL = false;
          _historyChanged = false;
          _initialHash = _getHash();
          _supportsPushState = "pushState" in history;
          if (_initialHash.indexOf("gid=") > -1) {
            _initialHash = _initialHash.split("&gid=")[0];
            _initialHash = _initialHash.split("?gid=")[0];
          }
          _listen("afterChange", self2.updateURL);
          _listen("unbindEvents", function() {
            framework.unbind(window, "hashchange", self2.onHashChange);
          });
          var returnToOriginal = function() {
            _hashReseted = true;
            if (!_closedFromURL) {
              if (_urlChangedOnce) {
                history.back();
              } else {
                if (_initialHash) {
                  _windowLoc.hash = _initialHash;
                } else {
                  if (_supportsPushState) {
                    history.pushState(
                      "",
                      document.title,
                      _windowLoc.pathname + _windowLoc.search
                    );
                  } else {
                    _windowLoc.hash = "";
                  }
                }
              }
            }
            _cleanHistoryTimeouts();
          };
          _listen("unbindEvents", function() {
            if (_closedByScroll) {
              returnToOriginal();
            }
          });
          _listen("destroy", function() {
            if (!_hashReseted) {
              returnToOriginal();
            }
          });
          _listen("firstUpdate", function() {
            _currentItemIndex = _parseItemIndexFromURL().pid;
          });
          var index = _initialHash.indexOf("pid=");
          if (index > -1) {
            _initialHash = _initialHash.substring(0, index);
            if (_initialHash.slice(-1) === "&") {
              _initialHash = _initialHash.slice(0, -1);
            }
          }
          setTimeout(function() {
            if (_isOpen) {
              framework.bind(window, "hashchange", self2.onHashChange);
            }
          }, 40);
        },
        onHashChange: function() {
          if (_getHash() === _initialHash) {
            _closedFromURL = true;
            self2.close();
            return;
          }
          if (!_hashChangedByScript) {
            _hashChangedByHistory = true;
            self2.goTo(_parseItemIndexFromURL().pid);
            _hashChangedByHistory = false;
          }
        },
        updateURL: function() {
          _cleanHistoryTimeouts();
          if (_hashChangedByHistory) {
            return;
          }
          if (!_historyChanged) {
            _updateHash();
          } else {
            _historyUpdateTimeout = setTimeout(_updateHash, 800);
          }
        }
      }
    });
    framework.extend(self2, publicMethods);
  };
  return PhotoSwipe2;
});
/*! PhotoSwipe Default UI - 4.1.3 - 2019-01-08
 * http://photoswipe.com
 * Copyright (c) 2019 Dmitry Semenov; */
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.PhotoSwipeUI_Default = factory();
  }
})(this, function() {
  "use strict";
  var PhotoSwipeUI_Default2 = function(pswp, framework) {
    var ui = this;
    var _overlayUIUpdated = false, _controlsVisible = true, _fullscrenAPI, _controls, _captionContainer, _fakeCaptionContainer, _indexIndicator, _shareButton, _shareModal, _shareModalHidden = true, _initalCloseOnScrollValue, _isIdle, _listen, _loadingIndicator, _loadingIndicatorHidden, _loadingIndicatorTimeout, _galleryHasOneSlide, _options, _defaultUIOptions = {
      barsSize: { top: 44, bottom: "auto" },
      closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
      timeToIdle: 4e3,
      timeToIdleOutside: 1e3,
      loadingIndicatorDelay: 1e3,
      // 2s
      addCaptionHTMLFn: function(item2, captionEl) {
        if (!item2.title) {
          captionEl.children[0].innerHTML = "";
          return false;
        }
        captionEl.children[0].innerHTML = item2.title;
        return true;
      },
      closeEl: true,
      captionEl: true,
      fullscreenEl: true,
      zoomEl: true,
      shareEl: true,
      counterEl: true,
      arrowEl: true,
      preloaderEl: true,
      tapToClose: false,
      tapToToggleControls: true,
      clickToCloseNonZoomable: true,
      shareButtons: [
        {
          id: "facebook",
          label: "Share on Facebook",
          url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
        },
        {
          id: "twitter",
          label: "Tweet",
          url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
        },
        {
          id: "pinterest",
          label: "Pin it",
          url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
        },
        {
          id: "download",
          label: "Download image",
          url: "{{raw_image_url}}",
          download: true
        }
      ],
      getImageURLForShare: function() {
        return pswp.currItem.src || "";
      },
      getPageURLForShare: function() {
        return window.location.href;
      },
      getTextForShare: function() {
        return pswp.currItem.title || "";
      },
      indexIndicatorSep: " / ",
      fitControlsWidth: 1200
    }, _blockControlsTap, _blockControlsTapTimeout;
    var _onControlsTap = function(e) {
      if (_blockControlsTap) {
        return true;
      }
      e = e || window.event;
      if (_options.timeToIdle && _options.mouseUsed && !_isIdle) {
        _onIdleMouseMove();
      }
      var target = e.target || e.srcElement, uiElement, clickedClass = target.getAttribute("class") || "", found;
      for (var i = 0; i < _uiElements.length; i++) {
        uiElement = _uiElements[i];
        if (uiElement.onTap && clickedClass.indexOf("pswp__" + uiElement.name) > -1) {
          uiElement.onTap();
          found = true;
        }
      }
      if (found) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        _blockControlsTap = true;
        var tapDelay = framework.features.isOldAndroid ? 600 : 30;
        _blockControlsTapTimeout = setTimeout(function() {
          _blockControlsTap = false;
        }, tapDelay);
      }
    }, _fitControlsInViewport = function() {
      return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > _options.fitControlsWidth;
    }, _togglePswpClass = function(el, cName, add) {
      framework[(add ? "add" : "remove") + "Class"](el, "pswp__" + cName);
    }, _countNumItems = function() {
      var hasOneSlide = _options.getNumItemsFn() === 1;
      if (hasOneSlide !== _galleryHasOneSlide) {
        _togglePswpClass(_controls, "ui--one-slide", hasOneSlide);
        _galleryHasOneSlide = hasOneSlide;
      }
    }, _toggleShareModalClass = function() {
      _togglePswpClass(_shareModal, "share-modal--hidden", _shareModalHidden);
    }, _toggleShareModal = function() {
      _shareModalHidden = !_shareModalHidden;
      if (!_shareModalHidden) {
        _toggleShareModalClass();
        setTimeout(function() {
          if (!_shareModalHidden) {
            framework.addClass(_shareModal, "pswp__share-modal--fade-in");
          }
        }, 30);
      } else {
        framework.removeClass(_shareModal, "pswp__share-modal--fade-in");
        setTimeout(function() {
          if (_shareModalHidden) {
            _toggleShareModalClass();
          }
        }, 300);
      }
      if (!_shareModalHidden) {
        _updateShareURLs();
      }
      return false;
    }, _openWindowPopup = function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      pswp.shout("shareLinkClick", e, target);
      if (!target.href) {
        return false;
      }
      if (target.hasAttribute("download")) {
        return true;
      }
      window.open(
        target.href,
        "pswp_share",
        "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)
      );
      if (!_shareModalHidden) {
        _toggleShareModal();
      }
      return false;
    }, _updateShareURLs = function() {
      var shareButtonOut = "", shareButtonData, shareURL, image_url, page_url, share_text;
      for (var i = 0; i < _options.shareButtons.length; i++) {
        shareButtonData = _options.shareButtons[i];
        image_url = _options.getImageURLForShare(shareButtonData);
        page_url = _options.getPageURLForShare(shareButtonData);
        share_text = _options.getTextForShare(shareButtonData);
        shareURL = shareButtonData.url.replace("{{url}}", encodeURIComponent(page_url)).replace("{{image_url}}", encodeURIComponent(image_url)).replace("{{raw_image_url}}", image_url).replace("{{text}}", encodeURIComponent(share_text));
        shareButtonOut += '<a href="' + shareURL + '" target="_blank" class="pswp__share--' + shareButtonData.id + '"' + (shareButtonData.download ? "download" : "") + ">" + shareButtonData.label + "</a>";
        if (_options.parseShareButtonOut) {
          shareButtonOut = _options.parseShareButtonOut(
            shareButtonData,
            shareButtonOut
          );
        }
      }
      _shareModal.children[0].innerHTML = shareButtonOut;
      _shareModal.children[0].onclick = _openWindowPopup;
    }, _hasCloseClass = function(target) {
      for (var i = 0; i < _options.closeElClasses.length; i++) {
        if (framework.hasClass(target, "pswp__" + _options.closeElClasses[i])) {
          return true;
        }
      }
    }, _idleInterval, _idleTimer, _idleIncrement = 0, _onIdleMouseMove = function() {
      clearTimeout(_idleTimer);
      _idleIncrement = 0;
      if (_isIdle) {
        ui.setIdle(false);
      }
    }, _onMouseLeaveWindow = function(e) {
      e = e ? e : window.event;
      var from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName === "HTML") {
        clearTimeout(_idleTimer);
        _idleTimer = setTimeout(function() {
          ui.setIdle(true);
        }, _options.timeToIdleOutside);
      }
    }, _setupFullscreenAPI = function() {
      if (_options.fullscreenEl && !framework.features.isOldAndroid) {
        if (!_fullscrenAPI) {
          _fullscrenAPI = ui.getFullscreenAPI();
        }
        if (_fullscrenAPI) {
          framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
          ui.updateFullscreen();
          framework.addClass(pswp.template, "pswp--supports-fs");
        } else {
          framework.removeClass(pswp.template, "pswp--supports-fs");
        }
      }
    }, _setupLoadingIndicator = function() {
      if (_options.preloaderEl) {
        _toggleLoadingIndicator(true);
        _listen("beforeChange", function() {
          clearTimeout(_loadingIndicatorTimeout);
          _loadingIndicatorTimeout = setTimeout(function() {
            if (pswp.currItem && pswp.currItem.loading) {
              if (!pswp.allowProgressiveImg() || pswp.currItem.img && !pswp.currItem.img.naturalWidth) {
                _toggleLoadingIndicator(false);
              }
            } else {
              _toggleLoadingIndicator(true);
            }
          }, _options.loadingIndicatorDelay);
        });
        _listen("imageLoadComplete", function(index, item2) {
          if (pswp.currItem === item2) {
            _toggleLoadingIndicator(true);
          }
        });
      }
    }, _toggleLoadingIndicator = function(hide) {
      if (_loadingIndicatorHidden !== hide) {
        _togglePswpClass(_loadingIndicator, "preloader--active", !hide);
        _loadingIndicatorHidden = hide;
      }
    }, _applyNavBarGaps = function(item2) {
      var gap = item2.vGap;
      if (_fitControlsInViewport()) {
        var bars = _options.barsSize;
        if (_options.captionEl && bars.bottom === "auto") {
          if (!_fakeCaptionContainer) {
            _fakeCaptionContainer = framework.createEl(
              "pswp__caption pswp__caption--fake"
            );
            _fakeCaptionContainer.appendChild(
              framework.createEl("pswp__caption__center")
            );
            _controls.insertBefore(_fakeCaptionContainer, _captionContainer);
            framework.addClass(_controls, "pswp__ui--fit");
          }
          if (_options.addCaptionHTMLFn(item2, _fakeCaptionContainer, true)) {
            var captionSize = _fakeCaptionContainer.clientHeight;
            gap.bottom = parseInt(captionSize, 10) || 44;
          } else {
            gap.bottom = bars.top;
          }
        } else {
          gap.bottom = bars.bottom === "auto" ? 0 : bars.bottom;
        }
        gap.top = bars.top;
      } else {
        gap.top = gap.bottom = 0;
      }
    }, _setupIdle = function() {
      if (_options.timeToIdle) {
        _listen("mouseUsed", function() {
          framework.bind(document, "mousemove", _onIdleMouseMove);
          framework.bind(document, "mouseout", _onMouseLeaveWindow);
          _idleInterval = setInterval(function() {
            _idleIncrement++;
            if (_idleIncrement === 2) {
              ui.setIdle(true);
            }
          }, _options.timeToIdle / 2);
        });
      }
    }, _setupHidingControlsDuringGestures = function() {
      _listen("onVerticalDrag", function(now) {
        if (_controlsVisible && now < 0.95) {
          ui.hideControls();
        } else if (!_controlsVisible && now >= 0.95) {
          ui.showControls();
        }
      });
      var pinchControlsHidden;
      _listen("onPinchClose", function(now) {
        if (_controlsVisible && now < 0.9) {
          ui.hideControls();
          pinchControlsHidden = true;
        } else if (pinchControlsHidden && !_controlsVisible && now > 0.9) {
          ui.showControls();
        }
      });
      _listen("zoomGestureEnded", function() {
        pinchControlsHidden = false;
        if (pinchControlsHidden && !_controlsVisible) {
          ui.showControls();
        }
      });
    };
    var _uiElements = [
      {
        name: "caption",
        option: "captionEl",
        onInit: function(el) {
          _captionContainer = el;
        }
      },
      {
        name: "share-modal",
        option: "shareEl",
        onInit: function(el) {
          _shareModal = el;
        },
        onTap: function() {
          _toggleShareModal();
        }
      },
      {
        name: "button--share",
        option: "shareEl",
        onInit: function(el) {
          _shareButton = el;
        },
        onTap: function() {
          _toggleShareModal();
        }
      },
      {
        name: "button--zoom",
        option: "zoomEl",
        onTap: pswp.toggleDesktopZoom
      },
      {
        name: "counter",
        option: "counterEl",
        onInit: function(el) {
          _indexIndicator = el;
        }
      },
      {
        name: "button--close",
        option: "closeEl",
        onTap: pswp.close
      },
      {
        name: "button--arrow--left",
        option: "arrowEl",
        onTap: pswp.prev
      },
      {
        name: "button--arrow--right",
        option: "arrowEl",
        onTap: pswp.next
      },
      {
        name: "button--fs",
        option: "fullscreenEl",
        onTap: function() {
          if (_fullscrenAPI.isFullscreen()) {
            _fullscrenAPI.exit();
          } else {
            _fullscrenAPI.enter();
          }
        }
      },
      {
        name: "preloader",
        option: "preloaderEl",
        onInit: function(el) {
          _loadingIndicator = el;
        }
      }
    ];
    var _setupUIElements = function() {
      var item2, classAttr, uiElement;
      var loopThroughChildElements = function(sChildren) {
        if (!sChildren) {
          return;
        }
        var l = sChildren.length;
        for (var i = 0; i < l; i++) {
          item2 = sChildren[i];
          classAttr = item2.className;
          for (var a = 0; a < _uiElements.length; a++) {
            uiElement = _uiElements[a];
            if (classAttr.indexOf("pswp__" + uiElement.name) > -1) {
              if (_options[uiElement.option]) {
                framework.removeClass(item2, "pswp__element--disabled");
                if (uiElement.onInit) {
                  uiElement.onInit(item2);
                }
              } else {
                framework.addClass(item2, "pswp__element--disabled");
              }
            }
          }
        }
      };
      loopThroughChildElements(_controls.children);
      var topBar = framework.getChildByClass(_controls, "pswp__top-bar");
      if (topBar) {
        loopThroughChildElements(topBar.children);
      }
    };
    ui.init = function() {
      framework.extend(pswp.options, _defaultUIOptions, true);
      _options = pswp.options;
      _controls = framework.getChildByClass(pswp.scrollWrap, "pswp__ui");
      _listen = pswp.listen;
      _setupHidingControlsDuringGestures();
      _listen("beforeChange", ui.update);
      _listen("doubleTap", function(point) {
        var initialZoomLevel = pswp.currItem.initialZoomLevel;
        if (pswp.getZoomLevel() !== initialZoomLevel) {
          pswp.zoomTo(initialZoomLevel, point, 333);
        } else {
          pswp.zoomTo(
            _options.getDoubleTapZoom(false, pswp.currItem),
            point,
            333
          );
        }
      });
      _listen("preventDragEvent", function(e, isDown, preventObj) {
        var t = e.target || e.srcElement;
        if (t && t.getAttribute("class") && e.type.indexOf("mouse") > -1 && (t.getAttribute("class").indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(t.tagName))) {
          preventObj.prevent = false;
        }
      });
      _listen("bindEvents", function() {
        framework.bind(_controls, "pswpTap click", _onControlsTap);
        framework.bind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap);
        if (!pswp.likelyTouchDevice) {
          framework.bind(pswp.scrollWrap, "mouseover", ui.onMouseOver);
        }
      });
      _listen("unbindEvents", function() {
        if (!_shareModalHidden) {
          _toggleShareModal();
        }
        if (_idleInterval) {
          clearInterval(_idleInterval);
        }
        framework.unbind(document, "mouseout", _onMouseLeaveWindow);
        framework.unbind(document, "mousemove", _onIdleMouseMove);
        framework.unbind(_controls, "pswpTap click", _onControlsTap);
        framework.unbind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap);
        framework.unbind(pswp.scrollWrap, "mouseover", ui.onMouseOver);
        if (_fullscrenAPI) {
          framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
          if (_fullscrenAPI.isFullscreen()) {
            _options.hideAnimationDuration = 0;
            _fullscrenAPI.exit();
          }
          _fullscrenAPI = null;
        }
      });
      _listen("destroy", function() {
        if (_options.captionEl) {
          if (_fakeCaptionContainer) {
            _controls.removeChild(_fakeCaptionContainer);
          }
          framework.removeClass(_captionContainer, "pswp__caption--empty");
        }
        if (_shareModal) {
          _shareModal.children[0].onclick = null;
        }
        framework.removeClass(_controls, "pswp__ui--over-close");
        framework.addClass(_controls, "pswp__ui--hidden");
        ui.setIdle(false);
      });
      if (!_options.showAnimationDuration) {
        framework.removeClass(_controls, "pswp__ui--hidden");
      }
      _listen("initialZoomIn", function() {
        if (_options.showAnimationDuration) {
          framework.removeClass(_controls, "pswp__ui--hidden");
        }
      });
      _listen("initialZoomOut", function() {
        framework.addClass(_controls, "pswp__ui--hidden");
      });
      _listen("parseVerticalMargin", _applyNavBarGaps);
      _setupUIElements();
      if (_options.shareEl && _shareButton && _shareModal) {
        _shareModalHidden = true;
      }
      _countNumItems();
      _setupIdle();
      _setupFullscreenAPI();
      _setupLoadingIndicator();
    };
    ui.setIdle = function(isIdle) {
      _isIdle = isIdle;
      _togglePswpClass(_controls, "ui--idle", isIdle);
    };
    ui.update = function() {
      if (_controlsVisible && pswp.currItem) {
        ui.updateIndexIndicator();
        if (_options.captionEl) {
          _options.addCaptionHTMLFn(pswp.currItem, _captionContainer);
          _togglePswpClass(
            _captionContainer,
            "caption--empty",
            !pswp.currItem.title
          );
        }
        _overlayUIUpdated = true;
      } else {
        _overlayUIUpdated = false;
      }
      if (!_shareModalHidden) {
        _toggleShareModal();
      }
      _countNumItems();
    };
    ui.updateFullscreen = function(e) {
      if (e) {
        setTimeout(function() {
          pswp.setScrollOffset(0, framework.getScrollY());
        }, 50);
      }
      framework[(_fullscrenAPI.isFullscreen() ? "add" : "remove") + "Class"](
        pswp.template,
        "pswp--fs"
      );
    };
    ui.updateIndexIndicator = function() {
      if (_options.counterEl) {
        _indexIndicator.innerHTML = pswp.getCurrentIndex() + 1 + _options.indexIndicatorSep + _options.getNumItemsFn();
      }
    };
    ui.onGlobalTap = function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      if (_blockControlsTap) {
        return;
      }
      if (e.detail && e.detail.pointerType === "mouse") {
        if (_hasCloseClass(target)) {
          pswp.close();
          return;
        }
        if (framework.hasClass(target, "pswp__img")) {
          if (pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
            if (_options.clickToCloseNonZoomable) {
              pswp.close();
            }
          } else {
            pswp.toggleDesktopZoom(e.detail.releasePoint);
          }
        }
      } else {
        if (_options.tapToToggleControls) {
          if (_controlsVisible) {
            ui.hideControls();
          } else {
            ui.showControls();
          }
        }
        if (_options.tapToClose && (framework.hasClass(target, "pswp__img") || _hasCloseClass(target))) {
          pswp.close();
          return;
        }
      }
    };
    ui.onMouseOver = function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      _togglePswpClass(_controls, "ui--over-close", _hasCloseClass(target));
    };
    ui.hideControls = function() {
      framework.addClass(_controls, "pswp__ui--hidden");
      _controlsVisible = false;
    };
    ui.showControls = function() {
      _controlsVisible = true;
      if (!_overlayUIUpdated) {
        ui.update();
      }
      framework.removeClass(_controls, "pswp__ui--hidden");
    };
    ui.supportsFullscreen = function() {
      var d = document;
      return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
    };
    ui.getFullscreenAPI = function() {
      var dE = document.documentElement, api, tF = "fullscreenchange";
      if (dE.requestFullscreen) {
        api = {
          enterK: "requestFullscreen",
          exitK: "exitFullscreen",
          elementK: "fullscreenElement",
          eventK: tF
        };
      } else if (dE.mozRequestFullScreen) {
        api = {
          enterK: "mozRequestFullScreen",
          exitK: "mozCancelFullScreen",
          elementK: "mozFullScreenElement",
          eventK: "moz" + tF
        };
      } else if (dE.webkitRequestFullscreen) {
        api = {
          enterK: "webkitRequestFullscreen",
          exitK: "webkitExitFullscreen",
          elementK: "webkitFullscreenElement",
          eventK: "webkit" + tF
        };
      } else if (dE.msRequestFullscreen) {
        api = {
          enterK: "msRequestFullscreen",
          exitK: "msExitFullscreen",
          elementK: "msFullscreenElement",
          eventK: "MSFullscreenChange"
        };
      }
      if (api) {
        api.enter = function() {
          _initalCloseOnScrollValue = _options.closeOnScroll;
          _options.closeOnScroll = false;
          if (this.enterK === "webkitRequestFullscreen") {
            pswp.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT);
          } else {
            return pswp.template[this.enterK]();
          }
        };
        api.exit = function() {
          _options.closeOnScroll = _initalCloseOnScrollValue;
          return document[this.exitK]();
        };
        api.isFullscreen = function() {
          return document[this.elementK];
        };
      }
      return api;
    };
  };
  return PhotoSwipeUI_Default2;
});
var initPhotoSwipeFromDOM = function(gallerySelector) {
  var parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes, numNodes = thumbElements.length, items = [], figureEl, linkEl, size, item2;
    for (var i2 = 0; i2 < numNodes; i2++) {
      figureEl = thumbElements[i2];
      if (figureEl.nodeType !== 1) {
        continue;
      }
      linkEl = figureEl.children[0];
      size = linkEl.getAttribute("data-size").split("x");
      item2 = {
        src: linkEl.getAttribute("href"),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };
      if (figureEl.children.length > 1) {
        item2.title = figureEl.children[1].innerHTML;
      }
      if (linkEl.children.length > 0) {
        item2.msrc = linkEl.children[0].getAttribute("src");
      }
      item2.el = figureEl;
      items.push(item2);
    }
    return items;
  };
  var closest = function closest2(el, fn) {
    return el && (fn(el) ? el : closest2(el.parentNode, fn));
  };
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    var eTarget = e.target || e.srcElement;
    var clickedListItem = closest(eTarget, function(el) {
      return el.tagName && el.tagName.toUpperCase() === "FIGURE";
    });
    if (!clickedListItem) {
      return;
    }
    var clickedGallery = clickedListItem.parentNode, childNodes = clickedListItem.parentNode.childNodes, numChildNodes = childNodes.length, nodeIndex = 0, index;
    for (var i2 = 0; i2 < numChildNodes; i2++) {
      if (childNodes[i2].nodeType !== 1) {
        continue;
      }
      if (childNodes[i2] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }
    if (index >= 0) {
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1), params = {};
    if (hash.length < 5) {
      return params;
    }
    var vars = hash.split("&");
    for (var i2 = 0; i2 < vars.length; i2++) {
      if (!vars[i2]) {
        continue;
      }
      var pair = vars[i2].split("=");
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }
    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }
    return params;
  };
  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll(".pswp")[0], gallery, options, items;
    items = parseThumbnailElements(galleryElement);
    options = {
      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute("data-pswp-uid"),
      getThumbBoundsFn: function(index2) {
        var thumbnail = items[index2].el.getElementsByTagName("img")[0], pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = thumbnail.getBoundingClientRect();
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };
    if (fromURL) {
      if (options.galleryPIDs) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }
    if (isNaN(options.index)) {
      return;
    }
    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };
  var galleryElements = document.querySelectorAll(gallerySelector);
  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute("data-pswp-uid", i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};
initPhotoSwipeFromDOM(".elegant-gallery");
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.8
 * Copyright (C) 2019 Oliver Nightingale
 * @license MIT
 */
(function() {
  var lunr2 = function(config) {
    var builder = new lunr2.Builder();
    builder.pipeline.add(lunr2.trimmer, lunr2.stopWordFilter, lunr2.stemmer);
    builder.searchPipeline.add(lunr2.stemmer);
    config.call(builder, builder);
    return builder.build();
  };
  lunr2.version = "2.3.8";
  /*!
   * lunr.utils
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.utils = {};
  lunr2.utils.warn = /* @__PURE__ */ (function(global) {
    return function(message) {
      if (global.console && console.warn) {
        console.warn(message);
      }
    };
  })(this);
  lunr2.utils.asString = function(obj) {
    if (obj === void 0 || obj === null) {
      return "";
    } else {
      return obj.toString();
    }
  };
  lunr2.utils.clone = function(obj) {
    if (obj === null || obj === void 0) {
      return obj;
    }
    var clone = /* @__PURE__ */ Object.create(null), keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i], val = obj[key];
      if (Array.isArray(val)) {
        clone[key] = val.slice();
        continue;
      }
      if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
        clone[key] = val;
        continue;
      }
      throw new TypeError(
        "clone is not deep and does not support nested objects"
      );
    }
    return clone;
  };
  lunr2.FieldRef = function(docRef, fieldName, stringValue) {
    this.docRef = docRef;
    this.fieldName = fieldName;
    this._stringValue = stringValue;
  };
  lunr2.FieldRef.joiner = "/";
  lunr2.FieldRef.fromString = function(s) {
    var n = s.indexOf(lunr2.FieldRef.joiner);
    if (n === -1) {
      throw "malformed field ref string";
    }
    var fieldRef = s.slice(0, n), docRef = s.slice(n + 1);
    return new lunr2.FieldRef(docRef, fieldRef, s);
  };
  lunr2.FieldRef.prototype.toString = function() {
    if (this._stringValue == void 0) {
      this._stringValue = this.fieldName + lunr2.FieldRef.joiner + this.docRef;
    }
    return this._stringValue;
  };
  /*!
   * lunr.Set
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.Set = function(elements) {
    this.elements = /* @__PURE__ */ Object.create(null);
    if (elements) {
      this.length = elements.length;
      for (var i = 0; i < this.length; i++) {
        this.elements[elements[i]] = true;
      }
    } else {
      this.length = 0;
    }
  };
  lunr2.Set.complete = {
    intersect: function(other) {
      return other;
    },
    union: function(other) {
      return other;
    },
    contains: function() {
      return true;
    }
  };
  lunr2.Set.empty = {
    intersect: function() {
      return this;
    },
    union: function(other) {
      return other;
    },
    contains: function() {
      return false;
    }
  };
  lunr2.Set.prototype.contains = function(object) {
    return !!this.elements[object];
  };
  lunr2.Set.prototype.intersect = function(other) {
    var a, b, elements, intersection = [];
    if (other === lunr2.Set.complete) {
      return this;
    }
    if (other === lunr2.Set.empty) {
      return other;
    }
    if (this.length < other.length) {
      a = this;
      b = other;
    } else {
      a = other;
      b = this;
    }
    elements = Object.keys(a.elements);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element in b.elements) {
        intersection.push(element);
      }
    }
    return new lunr2.Set(intersection);
  };
  lunr2.Set.prototype.union = function(other) {
    if (other === lunr2.Set.complete) {
      return lunr2.Set.complete;
    }
    if (other === lunr2.Set.empty) {
      return this;
    }
    return new lunr2.Set(
      Object.keys(this.elements).concat(Object.keys(other.elements))
    );
  };
  lunr2.idf = function(posting, documentCount) {
    var documentsWithTerm = 0;
    for (var fieldName in posting) {
      if (fieldName == "_index") continue;
      documentsWithTerm += Object.keys(posting[fieldName]).length;
    }
    var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5);
    return Math.log(1 + Math.abs(x));
  };
  lunr2.Token = function(str, metadata) {
    this.str = str || "";
    this.metadata = metadata || {};
  };
  lunr2.Token.prototype.toString = function() {
    return this.str;
  };
  lunr2.Token.prototype.update = function(fn) {
    this.str = fn(this.str, this.metadata);
    return this;
  };
  lunr2.Token.prototype.clone = function(fn) {
    fn = fn || function(s) {
      return s;
    };
    return new lunr2.Token(fn(this.str, this.metadata), this.metadata);
  };
  /*!
   * lunr.tokenizer
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.tokenizer = function(obj, metadata) {
    if (obj == null || obj == void 0) {
      return [];
    }
    if (Array.isArray(obj)) {
      return obj.map(function(t) {
        return new lunr2.Token(
          lunr2.utils.asString(t).toLowerCase(),
          lunr2.utils.clone(metadata)
        );
      });
    }
    var str = obj.toString().toLowerCase(), len = str.length, tokens = [];
    for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
      var char = str.charAt(sliceEnd), sliceLength = sliceEnd - sliceStart;
      if (char.match(lunr2.tokenizer.separator) || sliceEnd == len) {
        if (sliceLength > 0) {
          var tokenMetadata = lunr2.utils.clone(metadata) || {};
          tokenMetadata["position"] = [sliceStart, sliceLength];
          tokenMetadata["index"] = tokens.length;
          tokens.push(
            new lunr2.Token(str.slice(sliceStart, sliceEnd), tokenMetadata)
          );
        }
        sliceStart = sliceEnd + 1;
      }
    }
    return tokens;
  };
  lunr2.tokenizer.separator = /[\s\-]+/;
  /*!
   * lunr.Pipeline
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.Pipeline = function() {
    this._stack = [];
  };
  lunr2.Pipeline.registeredFunctions = /* @__PURE__ */ Object.create(null);
  lunr2.Pipeline.registerFunction = function(fn, label) {
    if (label in this.registeredFunctions) {
      lunr2.utils.warn("Overwriting existing registered function: " + label);
    }
    fn.label = label;
    lunr2.Pipeline.registeredFunctions[fn.label] = fn;
  };
  lunr2.Pipeline.warnIfFunctionNotRegistered = function(fn) {
    var isRegistered = fn.label && fn.label in this.registeredFunctions;
    if (!isRegistered) {
      lunr2.utils.warn(
        "Function is not registered with pipeline. This may cause problems when serialising the index.\n",
        fn
      );
    }
  };
  lunr2.Pipeline.load = function(serialised) {
    var pipeline = new lunr2.Pipeline();
    serialised.forEach(function(fnName) {
      var fn = lunr2.Pipeline.registeredFunctions[fnName];
      if (fn) {
        pipeline.add(fn);
      } else {
        throw new Error("Cannot load unregistered function: " + fnName);
      }
    });
    return pipeline;
  };
  lunr2.Pipeline.prototype.add = function() {
    var fns = Array.prototype.slice.call(arguments);
    fns.forEach(function(fn) {
      lunr2.Pipeline.warnIfFunctionNotRegistered(fn);
      this._stack.push(fn);
    }, this);
  };
  lunr2.Pipeline.prototype.after = function(existingFn, newFn) {
    lunr2.Pipeline.warnIfFunctionNotRegistered(newFn);
    var pos = this._stack.indexOf(existingFn);
    if (pos == -1) {
      throw new Error("Cannot find existingFn");
    }
    pos = pos + 1;
    this._stack.splice(pos, 0, newFn);
  };
  lunr2.Pipeline.prototype.before = function(existingFn, newFn) {
    lunr2.Pipeline.warnIfFunctionNotRegistered(newFn);
    var pos = this._stack.indexOf(existingFn);
    if (pos == -1) {
      throw new Error("Cannot find existingFn");
    }
    this._stack.splice(pos, 0, newFn);
  };
  lunr2.Pipeline.prototype.remove = function(fn) {
    var pos = this._stack.indexOf(fn);
    if (pos == -1) {
      return;
    }
    this._stack.splice(pos, 1);
  };
  lunr2.Pipeline.prototype.run = function(tokens) {
    var stackLength = this._stack.length;
    for (var i = 0; i < stackLength; i++) {
      var fn = this._stack[i];
      var memo = [];
      for (var j = 0; j < tokens.length; j++) {
        var result = fn(tokens[j], j, tokens);
        if (result === null || result === void 0 || result === "") continue;
        if (Array.isArray(result)) {
          for (var k = 0; k < result.length; k++) {
            memo.push(result[k]);
          }
        } else {
          memo.push(result);
        }
      }
      tokens = memo;
    }
    return tokens;
  };
  lunr2.Pipeline.prototype.runString = function(str, metadata) {
    var token = new lunr2.Token(str, metadata);
    return this.run([token]).map(function(t) {
      return t.toString();
    });
  };
  lunr2.Pipeline.prototype.reset = function() {
    this._stack = [];
  };
  lunr2.Pipeline.prototype.toJSON = function() {
    return this._stack.map(function(fn) {
      lunr2.Pipeline.warnIfFunctionNotRegistered(fn);
      return fn.label;
    });
  };
  /*!
   * lunr.Vector
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.Vector = function(elements) {
    this._magnitude = 0;
    this.elements = elements || [];
  };
  lunr2.Vector.prototype.positionForIndex = function(index) {
    if (this.elements.length == 0) {
      return 0;
    }
    var start = 0, end = this.elements.length / 2, sliceLength = end - start, pivotPoint = Math.floor(sliceLength / 2), pivotIndex = this.elements[pivotPoint * 2];
    while (sliceLength > 1) {
      if (pivotIndex < index) {
        start = pivotPoint;
      }
      if (pivotIndex > index) {
        end = pivotPoint;
      }
      if (pivotIndex == index) {
        break;
      }
      sliceLength = end - start;
      pivotPoint = start + Math.floor(sliceLength / 2);
      pivotIndex = this.elements[pivotPoint * 2];
    }
    if (pivotIndex == index) {
      return pivotPoint * 2;
    }
    if (pivotIndex > index) {
      return pivotPoint * 2;
    }
    if (pivotIndex < index) {
      return (pivotPoint + 1) * 2;
    }
  };
  lunr2.Vector.prototype.insert = function(insertIdx, val) {
    this.upsert(insertIdx, val, function() {
      throw "duplicate index";
    });
  };
  lunr2.Vector.prototype.upsert = function(insertIdx, val, fn) {
    this._magnitude = 0;
    var position = this.positionForIndex(insertIdx);
    if (this.elements[position] == insertIdx) {
      this.elements[position + 1] = fn(this.elements[position + 1], val);
    } else {
      this.elements.splice(position, 0, insertIdx, val);
    }
  };
  lunr2.Vector.prototype.magnitude = function() {
    if (this._magnitude) return this._magnitude;
    var sumOfSquares = 0, elementsLength = this.elements.length;
    for (var i = 1; i < elementsLength; i += 2) {
      var val = this.elements[i];
      sumOfSquares += val * val;
    }
    return this._magnitude = Math.sqrt(sumOfSquares);
  };
  lunr2.Vector.prototype.dot = function(otherVector) {
    var dotProduct = 0, a = this.elements, b = otherVector.elements, aLen = a.length, bLen = b.length, aVal = 0, bVal = 0, i = 0, j = 0;
    while (i < aLen && j < bLen) {
      aVal = a[i], bVal = b[j];
      if (aVal < bVal) {
        i += 2;
      } else if (aVal > bVal) {
        j += 2;
      } else if (aVal == bVal) {
        dotProduct += a[i + 1] * b[j + 1];
        i += 2;
        j += 2;
      }
    }
    return dotProduct;
  };
  lunr2.Vector.prototype.similarity = function(otherVector) {
    return this.dot(otherVector) / this.magnitude() || 0;
  };
  lunr2.Vector.prototype.toArray = function() {
    var output = new Array(this.elements.length / 2);
    for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
      output[j] = this.elements[i];
    }
    return output;
  };
  lunr2.Vector.prototype.toJSON = function() {
    return this.elements;
  };
  /*!
   * lunr.stemmer
   * Copyright (C) 2019 Oliver Nightingale
   * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
   */
  lunr2.stemmer = (function() {
    var step2list = {
      ational: "ate",
      tional: "tion",
      enci: "ence",
      anci: "ance",
      izer: "ize",
      bli: "ble",
      alli: "al",
      entli: "ent",
      eli: "e",
      ousli: "ous",
      ization: "ize",
      ation: "ate",
      ator: "ate",
      alism: "al",
      iveness: "ive",
      fulness: "ful",
      ousness: "ous",
      aliti: "al",
      iviti: "ive",
      biliti: "ble",
      logi: "log"
    }, step3list = {
      icate: "ic",
      ative: "",
      alize: "al",
      iciti: "ic",
      ical: "ic",
      ful: "",
      ness: ""
    }, c = "[^aeiou]", v = "[aeiouy]", C = c + "[^aeiouy]*", V = v + "[aeiou]*", mgr0 = "^(" + C + ")?" + V + C, meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$", mgr1 = "^(" + C + ")?" + V + C + V + C, s_v = "^(" + C + ")?" + v;
    var re_mgr0 = new RegExp(mgr0);
    var re_mgr1 = new RegExp(mgr1);
    var re_meq1 = new RegExp(meq1);
    var re_s_v = new RegExp(s_v);
    var re_1a = /^(.+?)(ss|i)es$/;
    var re2_1a = /^(.+?)([^s])s$/;
    var re_1b = /^(.+?)eed$/;
    var re2_1b = /^(.+?)(ed|ing)$/;
    var re_1b_2 = /.$/;
    var re2_1b_2 = /(at|bl|iz)$/;
    var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
    var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");
    var re_1c = /^(.+?[^aeiou])y$/;
    var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    var re2_4 = /^(.+?)(s|t)(ion)$/;
    var re_5 = /^(.+?)e$/;
    var re_5_1 = /ll$/;
    var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");
    var porterStemmer = function porterStemmer2(w) {
      var stem, suffix, firstch, re, re2, re3, re4;
      if (w.length < 3) {
        return w;
      }
      firstch = w.substr(0, 1);
      if (firstch == "y") {
        w = firstch.toUpperCase() + w.substr(1);
      }
      re = re_1a;
      re2 = re2_1a;
      if (re.test(w)) {
        w = w.replace(re, "$1$2");
      } else if (re2.test(w)) {
        w = w.replace(re2, "$1$2");
      }
      re = re_1b;
      re2 = re2_1b;
      if (re.test(w)) {
        var fp = re.exec(w);
        re = re_mgr0;
        if (re.test(fp[1])) {
          re = re_1b_2;
          w = w.replace(re, "");
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1];
        re2 = re_s_v;
        if (re2.test(stem)) {
          w = stem;
          re2 = re2_1b_2;
          re3 = re3_1b_2;
          re4 = re4_1b_2;
          if (re2.test(w)) {
            w = w + "e";
          } else if (re3.test(w)) {
            re = re_1b_2;
            w = w.replace(re, "");
          } else if (re4.test(w)) {
            w = w + "e";
          }
        }
      }
      re = re_1c;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        w = stem + "i";
      }
      re = re_2;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = re_mgr0;
        if (re.test(stem)) {
          w = stem + step2list[suffix];
        }
      }
      re = re_3;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = re_mgr0;
        if (re.test(stem)) {
          w = stem + step3list[suffix];
        }
      }
      re = re_4;
      re2 = re2_4;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = re_mgr1;
        if (re.test(stem)) {
          w = stem;
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1] + fp[2];
        re2 = re_mgr1;
        if (re2.test(stem)) {
          w = stem;
        }
      }
      re = re_5;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = re_mgr1;
        re2 = re_meq1;
        re3 = re3_5;
        if (re.test(stem) || re2.test(stem) && !re3.test(stem)) {
          w = stem;
        }
      }
      re = re_5_1;
      re2 = re_mgr1;
      if (re.test(w) && re2.test(w)) {
        re = re_1b_2;
        w = w.replace(re, "");
      }
      if (firstch == "y") {
        w = firstch.toLowerCase() + w.substr(1);
      }
      return w;
    };
    return function(token) {
      return token.update(porterStemmer);
    };
  })();
  lunr2.Pipeline.registerFunction(lunr2.stemmer, "stemmer");
  /*!
   * lunr.stopWordFilter
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.generateStopWordFilter = function(stopWords) {
    var words = stopWords.reduce(function(memo, stopWord) {
      memo[stopWord] = stopWord;
      return memo;
    }, {});
    return function(token) {
      if (token && words[token.toString()] !== token.toString()) return token;
    };
  };
  lunr2.stopWordFilter = lunr2.generateStopWordFilter([
    "a",
    "able",
    "about",
    "across",
    "after",
    "all",
    "almost",
    "also",
    "am",
    "among",
    "an",
    "and",
    "any",
    "are",
    "as",
    "at",
    "be",
    "because",
    "been",
    "but",
    "by",
    "can",
    "cannot",
    "could",
    "dear",
    "did",
    "do",
    "does",
    "either",
    "else",
    "ever",
    "every",
    "for",
    "from",
    "get",
    "got",
    "had",
    "has",
    "have",
    "he",
    "her",
    "hers",
    "him",
    "his",
    "how",
    "however",
    "i",
    "if",
    "in",
    "into",
    "is",
    "it",
    "its",
    "just",
    "least",
    "let",
    "like",
    "likely",
    "may",
    "me",
    "might",
    "most",
    "must",
    "my",
    "neither",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "often",
    "on",
    "only",
    "or",
    "other",
    "our",
    "own",
    "rather",
    "said",
    "say",
    "says",
    "she",
    "should",
    "since",
    "so",
    "some",
    "than",
    "that",
    "the",
    "their",
    "them",
    "then",
    "there",
    "these",
    "they",
    "this",
    "tis",
    "to",
    "too",
    "twas",
    "us",
    "wants",
    "was",
    "we",
    "were",
    "what",
    "when",
    "where",
    "which",
    "while",
    "who",
    "whom",
    "why",
    "will",
    "with",
    "would",
    "yet",
    "you",
    "your"
  ]);
  lunr2.Pipeline.registerFunction(lunr2.stopWordFilter, "stopWordFilter");
  /*!
   * lunr.trimmer
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.trimmer = function(token) {
    return token.update(function(s) {
      return s.replace(/^\W+/, "").replace(/\W+$/, "");
    });
  };
  lunr2.Pipeline.registerFunction(lunr2.trimmer, "trimmer");
  /*!
   * lunr.TokenSet
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.TokenSet = function() {
    this.final = false;
    this.edges = {};
    this.id = lunr2.TokenSet._nextId;
    lunr2.TokenSet._nextId += 1;
  };
  lunr2.TokenSet._nextId = 1;
  lunr2.TokenSet.fromArray = function(arr) {
    var builder = new lunr2.TokenSet.Builder();
    for (var i = 0, len = arr.length; i < len; i++) {
      builder.insert(arr[i]);
    }
    builder.finish();
    return builder.root;
  };
  lunr2.TokenSet.fromClause = function(clause) {
    if ("editDistance" in clause) {
      return lunr2.TokenSet.fromFuzzyString(clause.term, clause.editDistance);
    } else {
      return lunr2.TokenSet.fromString(clause.term);
    }
  };
  lunr2.TokenSet.fromFuzzyString = function(str, editDistance) {
    var root = new lunr2.TokenSet();
    var stack = [
      {
        node: root,
        editsRemaining: editDistance,
        str
      }
    ];
    while (stack.length) {
      var frame = stack.pop();
      if (frame.str.length > 0) {
        var char = frame.str.charAt(0), noEditNode;
        if (char in frame.node.edges) {
          noEditNode = frame.node.edges[char];
        } else {
          noEditNode = new lunr2.TokenSet();
          frame.node.edges[char] = noEditNode;
        }
        if (frame.str.length == 1) {
          noEditNode.final = true;
        }
        stack.push({
          node: noEditNode,
          editsRemaining: frame.editsRemaining,
          str: frame.str.slice(1)
        });
      }
      if (frame.editsRemaining == 0) {
        continue;
      }
      if ("*" in frame.node.edges) {
        var insertionNode = frame.node.edges["*"];
      } else {
        var insertionNode = new lunr2.TokenSet();
        frame.node.edges["*"] = insertionNode;
      }
      if (frame.str.length == 0) {
        insertionNode.final = true;
      }
      stack.push({
        node: insertionNode,
        editsRemaining: frame.editsRemaining - 1,
        str: frame.str
      });
      if (frame.str.length > 1) {
        stack.push({
          node: frame.node,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        });
      }
      if (frame.str.length == 1) {
        frame.node.final = true;
      }
      if (frame.str.length >= 1) {
        if ("*" in frame.node.edges) {
          var substitutionNode = frame.node.edges["*"];
        } else {
          var substitutionNode = new lunr2.TokenSet();
          frame.node.edges["*"] = substitutionNode;
        }
        if (frame.str.length == 1) {
          substitutionNode.final = true;
        }
        stack.push({
          node: substitutionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        });
      }
      if (frame.str.length > 1) {
        var charA = frame.str.charAt(0), charB = frame.str.charAt(1), transposeNode;
        if (charB in frame.node.edges) {
          transposeNode = frame.node.edges[charB];
        } else {
          transposeNode = new lunr2.TokenSet();
          frame.node.edges[charB] = transposeNode;
        }
        if (frame.str.length == 1) {
          transposeNode.final = true;
        }
        stack.push({
          node: transposeNode,
          editsRemaining: frame.editsRemaining - 1,
          str: charA + frame.str.slice(2)
        });
      }
    }
    return root;
  };
  lunr2.TokenSet.fromString = function(str) {
    var node = new lunr2.TokenSet(), root = node;
    for (var i = 0, len = str.length; i < len; i++) {
      var char = str[i], final = i == len - 1;
      if (char == "*") {
        node.edges[char] = node;
        node.final = final;
      } else {
        var next = new lunr2.TokenSet();
        next.final = final;
        node.edges[char] = next;
        node = next;
      }
    }
    return root;
  };
  lunr2.TokenSet.prototype.toArray = function() {
    var words = [];
    var stack = [
      {
        prefix: "",
        node: this
      }
    ];
    while (stack.length) {
      var frame = stack.pop(), edges = Object.keys(frame.node.edges), len = edges.length;
      if (frame.node.final) {
        frame.prefix.charAt(0);
        words.push(frame.prefix);
      }
      for (var i = 0; i < len; i++) {
        var edge = edges[i];
        stack.push({
          prefix: frame.prefix.concat(edge),
          node: frame.node.edges[edge]
        });
      }
    }
    return words;
  };
  lunr2.TokenSet.prototype.toString = function() {
    if (this._str) {
      return this._str;
    }
    var str = this.final ? "1" : "0", labels = Object.keys(this.edges).sort(), len = labels.length;
    for (var i = 0; i < len; i++) {
      var label = labels[i], node = this.edges[label];
      str = str + label + node.id;
    }
    return str;
  };
  lunr2.TokenSet.prototype.intersect = function(b) {
    var output = new lunr2.TokenSet(), frame = void 0;
    var stack = [
      {
        qNode: b,
        output,
        node: this
      }
    ];
    while (stack.length) {
      frame = stack.pop();
      var qEdges = Object.keys(frame.qNode.edges), qLen = qEdges.length, nEdges = Object.keys(frame.node.edges), nLen = nEdges.length;
      for (var q = 0; q < qLen; q++) {
        var qEdge = qEdges[q];
        for (var n = 0; n < nLen; n++) {
          var nEdge = nEdges[n];
          if (nEdge == qEdge || qEdge == "*") {
            var node = frame.node.edges[nEdge], qNode = frame.qNode.edges[qEdge], final = node.final && qNode.final, next = void 0;
            if (nEdge in frame.output.edges) {
              next = frame.output.edges[nEdge];
              next.final = next.final || final;
            } else {
              next = new lunr2.TokenSet();
              next.final = final;
              frame.output.edges[nEdge] = next;
            }
            stack.push({
              qNode,
              output: next,
              node
            });
          }
        }
      }
    }
    return output;
  };
  lunr2.TokenSet.Builder = function() {
    this.previousWord = "";
    this.root = new lunr2.TokenSet();
    this.uncheckedNodes = [];
    this.minimizedNodes = {};
  };
  lunr2.TokenSet.Builder.prototype.insert = function(word) {
    var node, commonPrefix = 0;
    if (word < this.previousWord) {
      throw new Error("Out of order word insertion");
    }
    for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
      if (word[i] != this.previousWord[i]) break;
      commonPrefix++;
    }
    this.minimize(commonPrefix);
    if (this.uncheckedNodes.length == 0) {
      node = this.root;
    } else {
      node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child;
    }
    for (var i = commonPrefix; i < word.length; i++) {
      var nextNode = new lunr2.TokenSet(), char = word[i];
      node.edges[char] = nextNode;
      this.uncheckedNodes.push({
        parent: node,
        char,
        child: nextNode
      });
      node = nextNode;
    }
    node.final = true;
    this.previousWord = word;
  };
  lunr2.TokenSet.Builder.prototype.finish = function() {
    this.minimize(0);
  };
  lunr2.TokenSet.Builder.prototype.minimize = function(downTo) {
    for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
      var node = this.uncheckedNodes[i], childKey = node.child.toString();
      if (childKey in this.minimizedNodes) {
        node.parent.edges[node.char] = this.minimizedNodes[childKey];
      } else {
        node.child._str = childKey;
        this.minimizedNodes[childKey] = node.child;
      }
      this.uncheckedNodes.pop();
    }
  };
  /*!
   * lunr.Index
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.Index = function(attrs) {
    this.invertedIndex = attrs.invertedIndex;
    this.fieldVectors = attrs.fieldVectors;
    this.tokenSet = attrs.tokenSet;
    this.fields = attrs.fields;
    this.pipeline = attrs.pipeline;
  };
  lunr2.Index.prototype.search = function(queryString) {
    return this.query(function(query) {
      var parser = new lunr2.QueryParser(queryString, query);
      parser.parse();
    });
  };
  lunr2.Index.prototype.query = function(fn) {
    var query = new lunr2.Query(this.fields), matchingFields = /* @__PURE__ */ Object.create(null), queryVectors = /* @__PURE__ */ Object.create(null), termFieldCache = /* @__PURE__ */ Object.create(null), requiredMatches = /* @__PURE__ */ Object.create(null), prohibitedMatches = /* @__PURE__ */ Object.create(null);
    for (var i = 0; i < this.fields.length; i++) {
      queryVectors[this.fields[i]] = new lunr2.Vector();
    }
    fn.call(query, query);
    for (var i = 0; i < query.clauses.length; i++) {
      var clause = query.clauses[i], terms = null, clauseMatches = lunr2.Set.complete;
      if (clause.usePipeline) {
        terms = this.pipeline.runString(clause.term, {
          fields: clause.fields
        });
      } else {
        terms = [clause.term];
      }
      for (var m = 0; m < terms.length; m++) {
        var term = terms[m];
        clause.term = term;
        var termTokenSet = lunr2.TokenSet.fromClause(clause), expandedTerms = this.tokenSet.intersect(termTokenSet).toArray();
        if (expandedTerms.length === 0 && clause.presence === lunr2.Query.presence.REQUIRED) {
          for (var k = 0; k < clause.fields.length; k++) {
            var field = clause.fields[k];
            requiredMatches[field] = lunr2.Set.empty;
          }
          break;
        }
        for (var j = 0; j < expandedTerms.length; j++) {
          var expandedTerm = expandedTerms[j], posting = this.invertedIndex[expandedTerm], termIndex = posting._index;
          for (var k = 0; k < clause.fields.length; k++) {
            var field = clause.fields[k], fieldPosting = posting[field], matchingDocumentRefs = Object.keys(fieldPosting), termField = expandedTerm + "/" + field, matchingDocumentsSet = new lunr2.Set(matchingDocumentRefs);
            if (clause.presence == lunr2.Query.presence.REQUIRED) {
              clauseMatches = clauseMatches.union(matchingDocumentsSet);
              if (requiredMatches[field] === void 0) {
                requiredMatches[field] = lunr2.Set.complete;
              }
            }
            if (clause.presence == lunr2.Query.presence.PROHIBITED) {
              if (prohibitedMatches[field] === void 0) {
                prohibitedMatches[field] = lunr2.Set.empty;
              }
              prohibitedMatches[field] = prohibitedMatches[field].union(
                matchingDocumentsSet
              );
              continue;
            }
            queryVectors[field].upsert(
              termIndex,
              clause.boost,
              function(a, b) {
                return a + b;
              }
            );
            if (termFieldCache[termField]) {
              continue;
            }
            for (var l = 0; l < matchingDocumentRefs.length; l++) {
              var matchingDocumentRef = matchingDocumentRefs[l], matchingFieldRef = new lunr2.FieldRef(
                matchingDocumentRef,
                field
              ), metadata = fieldPosting[matchingDocumentRef], fieldMatch;
              if ((fieldMatch = matchingFields[matchingFieldRef]) === void 0) {
                matchingFields[matchingFieldRef] = new lunr2.MatchData(
                  expandedTerm,
                  field,
                  metadata
                );
              } else {
                fieldMatch.add(expandedTerm, field, metadata);
              }
            }
            termFieldCache[termField] = true;
          }
        }
      }
      if (clause.presence === lunr2.Query.presence.REQUIRED) {
        for (var k = 0; k < clause.fields.length; k++) {
          var field = clause.fields[k];
          requiredMatches[field] = requiredMatches[field].intersect(
            clauseMatches
          );
        }
      }
    }
    var allRequiredMatches = lunr2.Set.complete, allProhibitedMatches = lunr2.Set.empty;
    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      if (requiredMatches[field]) {
        allRequiredMatches = allRequiredMatches.intersect(
          requiredMatches[field]
        );
      }
      if (prohibitedMatches[field]) {
        allProhibitedMatches = allProhibitedMatches.union(
          prohibitedMatches[field]
        );
      }
    }
    var matchingFieldRefs = Object.keys(matchingFields), results = [], matches = /* @__PURE__ */ Object.create(null);
    if (query.isNegated()) {
      matchingFieldRefs = Object.keys(this.fieldVectors);
      for (var i = 0; i < matchingFieldRefs.length; i++) {
        var matchingFieldRef = matchingFieldRefs[i];
        var fieldRef = lunr2.FieldRef.fromString(matchingFieldRef);
        matchingFields[matchingFieldRef] = new lunr2.MatchData();
      }
    }
    for (var i = 0; i < matchingFieldRefs.length; i++) {
      var fieldRef = lunr2.FieldRef.fromString(matchingFieldRefs[i]), docRef = fieldRef.docRef;
      if (!allRequiredMatches.contains(docRef)) {
        continue;
      }
      if (allProhibitedMatches.contains(docRef)) {
        continue;
      }
      var fieldVector = this.fieldVectors[fieldRef], score = queryVectors[fieldRef.fieldName].similarity(fieldVector), docMatch;
      if ((docMatch = matches[docRef]) !== void 0) {
        docMatch.score += score;
        docMatch.matchData.combine(matchingFields[fieldRef]);
      } else {
        var match = {
          ref: docRef,
          score,
          matchData: matchingFields[fieldRef]
        };
        matches[docRef] = match;
        results.push(match);
      }
    }
    return results.sort(function(a, b) {
      return b.score - a.score;
    });
  };
  lunr2.Index.prototype.toJSON = function() {
    var invertedIndex = Object.keys(this.invertedIndex).sort().map(function(term) {
      return [term, this.invertedIndex[term]];
    }, this);
    var fieldVectors = Object.keys(this.fieldVectors).map(function(ref) {
      return [ref, this.fieldVectors[ref].toJSON()];
    }, this);
    return {
      version: lunr2.version,
      fields: this.fields,
      fieldVectors,
      invertedIndex,
      pipeline: this.pipeline.toJSON()
    };
  };
  lunr2.Index.load = function(serializedIndex) {
    var attrs = {}, fieldVectors = {}, serializedVectors = serializedIndex.fieldVectors, invertedIndex = /* @__PURE__ */ Object.create(null), serializedInvertedIndex = serializedIndex.invertedIndex, tokenSetBuilder = new lunr2.TokenSet.Builder(), pipeline = lunr2.Pipeline.load(serializedIndex.pipeline);
    if (serializedIndex.version != lunr2.version) {
      lunr2.utils.warn(
        "Version mismatch when loading serialised index. Current version of lunr '" + lunr2.version + "' does not match serialized index '" + serializedIndex.version + "'"
      );
    }
    for (var i = 0; i < serializedVectors.length; i++) {
      var tuple = serializedVectors[i], ref = tuple[0], elements = tuple[1];
      fieldVectors[ref] = new lunr2.Vector(elements);
    }
    for (var i = 0; i < serializedInvertedIndex.length; i++) {
      var tuple = serializedInvertedIndex[i], term = tuple[0], posting = tuple[1];
      tokenSetBuilder.insert(term);
      invertedIndex[term] = posting;
    }
    tokenSetBuilder.finish();
    attrs.fields = serializedIndex.fields;
    attrs.fieldVectors = fieldVectors;
    attrs.invertedIndex = invertedIndex;
    attrs.tokenSet = tokenSetBuilder.root;
    attrs.pipeline = pipeline;
    return new lunr2.Index(attrs);
  };
  /*!
   * lunr.Builder
   * Copyright (C) 2019 Oliver Nightingale
   */
  lunr2.Builder = function() {
    this._ref = "id";
    this._fields = /* @__PURE__ */ Object.create(null);
    this._documents = /* @__PURE__ */ Object.create(null);
    this.invertedIndex = /* @__PURE__ */ Object.create(null);
    this.fieldTermFrequencies = {};
    this.fieldLengths = {};
    this.tokenizer = lunr2.tokenizer;
    this.pipeline = new lunr2.Pipeline();
    this.searchPipeline = new lunr2.Pipeline();
    this.documentCount = 0;
    this._b = 0.75;
    this._k1 = 1.2;
    this.termIndex = 0;
    this.metadataWhitelist = [];
  };
  lunr2.Builder.prototype.ref = function(ref) {
    this._ref = ref;
  };
  lunr2.Builder.prototype.field = function(fieldName, attributes) {
    if (/\//.test(fieldName)) {
      throw new RangeError(
        "Field '" + fieldName + "' contains illegal character '/'"
      );
    }
    this._fields[fieldName] = attributes || {};
  };
  lunr2.Builder.prototype.b = function(number) {
    if (number < 0) {
      this._b = 0;
    } else if (number > 1) {
      this._b = 1;
    } else {
      this._b = number;
    }
  };
  lunr2.Builder.prototype.k1 = function(number) {
    this._k1 = number;
  };
  lunr2.Builder.prototype.add = function(doc, attributes) {
    var docRef = doc[this._ref], fields = Object.keys(this._fields);
    this._documents[docRef] = attributes || {};
    this.documentCount += 1;
    for (var i = 0; i < fields.length; i++) {
      var fieldName = fields[i], extractor = this._fields[fieldName].extractor, field = extractor ? extractor(doc) : doc[fieldName], tokens = this.tokenizer(field, {
        fields: [fieldName]
      }), terms = this.pipeline.run(tokens), fieldRef = new lunr2.FieldRef(docRef, fieldName), fieldTerms = /* @__PURE__ */ Object.create(null);
      this.fieldTermFrequencies[fieldRef] = fieldTerms;
      this.fieldLengths[fieldRef] = 0;
      this.fieldLengths[fieldRef] += terms.length;
      for (var j = 0; j < terms.length; j++) {
        var term = terms[j];
        if (fieldTerms[term] == void 0) {
          fieldTerms[term] = 0;
        }
        fieldTerms[term] += 1;
        if (this.invertedIndex[term] == void 0) {
          var posting = /* @__PURE__ */ Object.create(null);
          posting["_index"] = this.termIndex;
          this.termIndex += 1;
          for (var k = 0; k < fields.length; k++) {
            posting[fields[k]] = /* @__PURE__ */ Object.create(null);
          }
          this.invertedIndex[term] = posting;
        }
        if (this.invertedIndex[term][fieldName][docRef] == void 0) {
          this.invertedIndex[term][fieldName][docRef] = /* @__PURE__ */ Object.create(null);
        }
        for (var l = 0; l < this.metadataWhitelist.length; l++) {
          var metadataKey = this.metadataWhitelist[l], metadata = term.metadata[metadataKey];
          if (this.invertedIndex[term][fieldName][docRef][metadataKey] == void 0) {
            this.invertedIndex[term][fieldName][docRef][metadataKey] = [];
          }
          this.invertedIndex[term][fieldName][docRef][metadataKey].push(
            metadata
          );
        }
      }
    }
  };
  lunr2.Builder.prototype.calculateAverageFieldLengths = function() {
    var fieldRefs = Object.keys(this.fieldLengths), numberOfFields = fieldRefs.length, accumulator = {}, documentsWithField = {};
    for (var i = 0; i < numberOfFields; i++) {
      var fieldRef = lunr2.FieldRef.fromString(fieldRefs[i]), field = fieldRef.fieldName;
      documentsWithField[field] || (documentsWithField[field] = 0);
      documentsWithField[field] += 1;
      accumulator[field] || (accumulator[field] = 0);
      accumulator[field] += this.fieldLengths[fieldRef];
    }
    var fields = Object.keys(this._fields);
    for (var i = 0; i < fields.length; i++) {
      var fieldName = fields[i];
      accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName];
    }
    this.averageFieldLength = accumulator;
  };
  lunr2.Builder.prototype.createFieldVectors = function() {
    var fieldVectors = {}, fieldRefs = Object.keys(this.fieldTermFrequencies), fieldRefsLength = fieldRefs.length, termIdfCache = /* @__PURE__ */ Object.create(null);
    for (var i = 0; i < fieldRefsLength; i++) {
      var fieldRef = lunr2.FieldRef.fromString(fieldRefs[i]), fieldName = fieldRef.fieldName, fieldLength = this.fieldLengths[fieldRef], fieldVector = new lunr2.Vector(), termFrequencies = this.fieldTermFrequencies[fieldRef], terms = Object.keys(termFrequencies), termsLength = terms.length;
      var fieldBoost = this._fields[fieldName].boost || 1, docBoost = this._documents[fieldRef.docRef].boost || 1;
      for (var j = 0; j < termsLength; j++) {
        var term = terms[j], tf = termFrequencies[term], termIndex = this.invertedIndex[term]._index, idf, score, scoreWithPrecision;
        if (termIdfCache[term] === void 0) {
          idf = lunr2.idf(this.invertedIndex[term], this.documentCount);
          termIdfCache[term] = idf;
        } else {
          idf = termIdfCache[term];
        }
        score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf);
        score *= fieldBoost;
        score *= docBoost;
        scoreWithPrecision = Math.round(score * 1e3) / 1e3;
        fieldVector.insert(termIndex, scoreWithPrecision);
      }
      fieldVectors[fieldRef] = fieldVector;
    }
    this.fieldVectors = fieldVectors;
  };
  lunr2.Builder.prototype.createTokenSet = function() {
    this.tokenSet = lunr2.TokenSet.fromArray(
      Object.keys(this.invertedIndex).sort()
    );
  };
  lunr2.Builder.prototype.build = function() {
    this.calculateAverageFieldLengths();
    this.createFieldVectors();
    this.createTokenSet();
    return new lunr2.Index({
      invertedIndex: this.invertedIndex,
      fieldVectors: this.fieldVectors,
      tokenSet: this.tokenSet,
      fields: Object.keys(this._fields),
      pipeline: this.searchPipeline
    });
  };
  lunr2.Builder.prototype.use = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(this);
    fn.apply(this, args);
  };
  lunr2.MatchData = function(term, field, metadata) {
    var clonedMetadata = /* @__PURE__ */ Object.create(null), metadataKeys = Object.keys(metadata || {});
    for (var i = 0; i < metadataKeys.length; i++) {
      var key = metadataKeys[i];
      clonedMetadata[key] = metadata[key].slice();
    }
    this.metadata = /* @__PURE__ */ Object.create(null);
    if (term !== void 0) {
      this.metadata[term] = /* @__PURE__ */ Object.create(null);
      this.metadata[term][field] = clonedMetadata;
    }
  };
  lunr2.MatchData.prototype.combine = function(otherMatchData) {
    var terms = Object.keys(otherMatchData.metadata);
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i], fields = Object.keys(otherMatchData.metadata[term]);
      if (this.metadata[term] == void 0) {
        this.metadata[term] = /* @__PURE__ */ Object.create(null);
      }
      for (var j = 0; j < fields.length; j++) {
        var field = fields[j], keys = Object.keys(otherMatchData.metadata[term][field]);
        if (this.metadata[term][field] == void 0) {
          this.metadata[term][field] = /* @__PURE__ */ Object.create(null);
        }
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          if (this.metadata[term][field][key] == void 0) {
            this.metadata[term][field][key] = otherMatchData.metadata[term][field][key];
          } else {
            this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key]);
          }
        }
      }
    }
  };
  lunr2.MatchData.prototype.add = function(term, field, metadata) {
    if (!(term in this.metadata)) {
      this.metadata[term] = /* @__PURE__ */ Object.create(null);
      this.metadata[term][field] = metadata;
      return;
    }
    if (!(field in this.metadata[term])) {
      this.metadata[term][field] = metadata;
      return;
    }
    var metadataKeys = Object.keys(metadata);
    for (var i = 0; i < metadataKeys.length; i++) {
      var key = metadataKeys[i];
      if (key in this.metadata[term][field]) {
        this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key]);
      } else {
        this.metadata[term][field][key] = metadata[key];
      }
    }
  };
  lunr2.Query = function(allFields) {
    this.clauses = [];
    this.allFields = allFields;
  };
  lunr2.Query.wildcard = new String("*");
  lunr2.Query.wildcard.NONE = 0;
  lunr2.Query.wildcard.LEADING = 1;
  lunr2.Query.wildcard.TRAILING = 2;
  lunr2.Query.presence = {
    /**
     * Term's presence in a document is optional, this is the default value.
     */
    OPTIONAL: 1,
    /**
     * Term's presence in a document is required, documents that do not contain
     * this term will not be returned.
     */
    REQUIRED: 2,
    /**
     * Term's presence in a document is prohibited, documents that do contain
     * this term will not be returned.
     */
    PROHIBITED: 3
  };
  lunr2.Query.prototype.clause = function(clause) {
    if (!("fields" in clause)) {
      clause.fields = this.allFields;
    }
    if (!("boost" in clause)) {
      clause.boost = 1;
    }
    if (!("usePipeline" in clause)) {
      clause.usePipeline = true;
    }
    if (!("wildcard" in clause)) {
      clause.wildcard = lunr2.Query.wildcard.NONE;
    }
    if (clause.wildcard & lunr2.Query.wildcard.LEADING && clause.term.charAt(0) != lunr2.Query.wildcard) {
      clause.term = "*" + clause.term;
    }
    if (clause.wildcard & lunr2.Query.wildcard.TRAILING && clause.term.slice(-1) != lunr2.Query.wildcard) {
      clause.term = "" + clause.term + "*";
    }
    if (!("presence" in clause)) {
      clause.presence = lunr2.Query.presence.OPTIONAL;
    }
    this.clauses.push(clause);
    return this;
  };
  lunr2.Query.prototype.isNegated = function() {
    for (var i = 0; i < this.clauses.length; i++) {
      if (this.clauses[i].presence != lunr2.Query.presence.PROHIBITED) {
        return false;
      }
    }
    return true;
  };
  lunr2.Query.prototype.term = function(term, options) {
    if (Array.isArray(term)) {
      term.forEach(function(t) {
        this.term(t, lunr2.utils.clone(options));
      }, this);
      return this;
    }
    var clause = options || {};
    clause.term = term.toString();
    this.clause(clause);
    return this;
  };
  lunr2.QueryParseError = function(message, start, end) {
    this.name = "QueryParseError";
    this.message = message;
    this.start = start;
    this.end = end;
  };
  lunr2.QueryParseError.prototype = new Error();
  lunr2.QueryLexer = function(str) {
    this.lexemes = [];
    this.str = str;
    this.length = str.length;
    this.pos = 0;
    this.start = 0;
    this.escapeCharPositions = [];
  };
  lunr2.QueryLexer.prototype.run = function() {
    var state = lunr2.QueryLexer.lexText;
    while (state) {
      state = state(this);
    }
  };
  lunr2.QueryLexer.prototype.sliceString = function() {
    var subSlices = [], sliceStart = this.start, sliceEnd = this.pos;
    for (var i = 0; i < this.escapeCharPositions.length; i++) {
      sliceEnd = this.escapeCharPositions[i];
      subSlices.push(this.str.slice(sliceStart, sliceEnd));
      sliceStart = sliceEnd + 1;
    }
    subSlices.push(this.str.slice(sliceStart, this.pos));
    this.escapeCharPositions.length = 0;
    return subSlices.join("");
  };
  lunr2.QueryLexer.prototype.emit = function(type) {
    this.lexemes.push({
      type,
      str: this.sliceString(),
      start: this.start,
      end: this.pos
    });
    this.start = this.pos;
  };
  lunr2.QueryLexer.prototype.escapeCharacter = function() {
    this.escapeCharPositions.push(this.pos - 1);
    this.pos += 1;
  };
  lunr2.QueryLexer.prototype.next = function() {
    if (this.pos >= this.length) {
      return lunr2.QueryLexer.EOS;
    }
    var char = this.str.charAt(this.pos);
    this.pos += 1;
    return char;
  };
  lunr2.QueryLexer.prototype.width = function() {
    return this.pos - this.start;
  };
  lunr2.QueryLexer.prototype.ignore = function() {
    if (this.start == this.pos) {
      this.pos += 1;
    }
    this.start = this.pos;
  };
  lunr2.QueryLexer.prototype.backup = function() {
    this.pos -= 1;
  };
  lunr2.QueryLexer.prototype.acceptDigitRun = function() {
    var char, charCode;
    do {
      char = this.next();
      charCode = char.charCodeAt(0);
    } while (charCode > 47 && charCode < 58);
    if (char != lunr2.QueryLexer.EOS) {
      this.backup();
    }
  };
  lunr2.QueryLexer.prototype.more = function() {
    return this.pos < this.length;
  };
  lunr2.QueryLexer.EOS = "EOS";
  lunr2.QueryLexer.FIELD = "FIELD";
  lunr2.QueryLexer.TERM = "TERM";
  lunr2.QueryLexer.EDIT_DISTANCE = "EDIT_DISTANCE";
  lunr2.QueryLexer.BOOST = "BOOST";
  lunr2.QueryLexer.PRESENCE = "PRESENCE";
  lunr2.QueryLexer.lexField = function(lexer) {
    lexer.backup();
    lexer.emit(lunr2.QueryLexer.FIELD);
    lexer.ignore();
    return lunr2.QueryLexer.lexText;
  };
  lunr2.QueryLexer.lexTerm = function(lexer) {
    if (lexer.width() > 1) {
      lexer.backup();
      lexer.emit(lunr2.QueryLexer.TERM);
    }
    lexer.ignore();
    if (lexer.more()) {
      return lunr2.QueryLexer.lexText;
    }
  };
  lunr2.QueryLexer.lexEditDistance = function(lexer) {
    lexer.ignore();
    lexer.acceptDigitRun();
    lexer.emit(lunr2.QueryLexer.EDIT_DISTANCE);
    return lunr2.QueryLexer.lexText;
  };
  lunr2.QueryLexer.lexBoost = function(lexer) {
    lexer.ignore();
    lexer.acceptDigitRun();
    lexer.emit(lunr2.QueryLexer.BOOST);
    return lunr2.QueryLexer.lexText;
  };
  lunr2.QueryLexer.lexEOS = function(lexer) {
    if (lexer.width() > 0) {
      lexer.emit(lunr2.QueryLexer.TERM);
    }
  };
  lunr2.QueryLexer.termSeparator = lunr2.tokenizer.separator;
  lunr2.QueryLexer.lexText = function(lexer) {
    while (true) {
      var char = lexer.next();
      if (char == lunr2.QueryLexer.EOS) {
        return lunr2.QueryLexer.lexEOS;
      }
      if (char.charCodeAt(0) == 92) {
        lexer.escapeCharacter();
        continue;
      }
      if (char == ":") {
        return lunr2.QueryLexer.lexField;
      }
      if (char == "~") {
        lexer.backup();
        if (lexer.width() > 0) {
          lexer.emit(lunr2.QueryLexer.TERM);
        }
        return lunr2.QueryLexer.lexEditDistance;
      }
      if (char == "^") {
        lexer.backup();
        if (lexer.width() > 0) {
          lexer.emit(lunr2.QueryLexer.TERM);
        }
        return lunr2.QueryLexer.lexBoost;
      }
      if (char == "+" && lexer.width() === 1) {
        lexer.emit(lunr2.QueryLexer.PRESENCE);
        return lunr2.QueryLexer.lexText;
      }
      if (char == "-" && lexer.width() === 1) {
        lexer.emit(lunr2.QueryLexer.PRESENCE);
        return lunr2.QueryLexer.lexText;
      }
      if (char.match(lunr2.QueryLexer.termSeparator)) {
        return lunr2.QueryLexer.lexTerm;
      }
    }
  };
  lunr2.QueryParser = function(str, query) {
    this.lexer = new lunr2.QueryLexer(str);
    this.query = query;
    this.currentClause = {};
    this.lexemeIdx = 0;
  };
  lunr2.QueryParser.prototype.parse = function() {
    this.lexer.run();
    this.lexemes = this.lexer.lexemes;
    var state = lunr2.QueryParser.parseClause;
    while (state) {
      state = state(this);
    }
    return this.query;
  };
  lunr2.QueryParser.prototype.peekLexeme = function() {
    return this.lexemes[this.lexemeIdx];
  };
  lunr2.QueryParser.prototype.consumeLexeme = function() {
    var lexeme = this.peekLexeme();
    this.lexemeIdx += 1;
    return lexeme;
  };
  lunr2.QueryParser.prototype.nextClause = function() {
    var completedClause = this.currentClause;
    this.query.clause(completedClause);
    this.currentClause = {};
  };
  lunr2.QueryParser.parseClause = function(parser) {
    var lexeme = parser.peekLexeme();
    if (lexeme == void 0) {
      return;
    }
    switch (lexeme.type) {
      case lunr2.QueryLexer.PRESENCE:
        return lunr2.QueryParser.parsePresence;
      case lunr2.QueryLexer.FIELD:
        return lunr2.QueryParser.parseField;
      case lunr2.QueryLexer.TERM:
        return lunr2.QueryParser.parseTerm;
      default:
        var errorMessage = "expected either a field or a term, found " + lexeme.type;
        if (lexeme.str.length >= 1) {
          errorMessage += " with value '" + lexeme.str + "'";
        }
        throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
  };
  lunr2.QueryParser.parsePresence = function(parser) {
    var lexeme = parser.consumeLexeme();
    if (lexeme == void 0) {
      return;
    }
    switch (lexeme.str) {
      case "-":
        parser.currentClause.presence = lunr2.Query.presence.PROHIBITED;
        break;
      case "+":
        parser.currentClause.presence = lunr2.Query.presence.REQUIRED;
        break;
      default:
        var errorMessage = "unrecognised presence operator'" + lexeme.str + "'";
        throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    var nextLexeme = parser.peekLexeme();
    if (nextLexeme == void 0) {
      var errorMessage = "expecting term or field, found nothing";
      throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    switch (nextLexeme.type) {
      case lunr2.QueryLexer.FIELD:
        return lunr2.QueryParser.parseField;
      case lunr2.QueryLexer.TERM:
        return lunr2.QueryParser.parseTerm;
      default:
        var errorMessage = "expecting term or field, found '" + nextLexeme.type + "'";
        throw new lunr2.QueryParseError(
          errorMessage,
          nextLexeme.start,
          nextLexeme.end
        );
    }
  };
  lunr2.QueryParser.parseField = function(parser) {
    var lexeme = parser.consumeLexeme();
    if (lexeme == void 0) {
      return;
    }
    if (parser.query.allFields.indexOf(lexeme.str) == -1) {
      var possibleFields = parser.query.allFields.map(function(f) {
        return "'" + f + "'";
      }).join(", "), errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields;
      throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    parser.currentClause.fields = [lexeme.str];
    var nextLexeme = parser.peekLexeme();
    if (nextLexeme == void 0) {
      var errorMessage = "expecting term, found nothing";
      throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    switch (nextLexeme.type) {
      case lunr2.QueryLexer.TERM:
        return lunr2.QueryParser.parseTerm;
      default:
        var errorMessage = "expecting term, found '" + nextLexeme.type + "'";
        throw new lunr2.QueryParseError(
          errorMessage,
          nextLexeme.start,
          nextLexeme.end
        );
    }
  };
  lunr2.QueryParser.parseTerm = function(parser) {
    var lexeme = parser.consumeLexeme();
    if (lexeme == void 0) {
      return;
    }
    parser.currentClause.term = lexeme.str.toLowerCase();
    if (lexeme.str.indexOf("*") != -1) {
      parser.currentClause.usePipeline = false;
    }
    var nextLexeme = parser.peekLexeme();
    if (nextLexeme == void 0) {
      parser.nextClause();
      return;
    }
    switch (nextLexeme.type) {
      case lunr2.QueryLexer.TERM:
        parser.nextClause();
        return lunr2.QueryParser.parseTerm;
      case lunr2.QueryLexer.FIELD:
        parser.nextClause();
        return lunr2.QueryParser.parseField;
      case lunr2.QueryLexer.EDIT_DISTANCE:
        return lunr2.QueryParser.parseEditDistance;
      case lunr2.QueryLexer.BOOST:
        return lunr2.QueryParser.parseBoost;
      case lunr2.QueryLexer.PRESENCE:
        parser.nextClause();
        return lunr2.QueryParser.parsePresence;
      default:
        var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
        throw new lunr2.QueryParseError(
          errorMessage,
          nextLexeme.start,
          nextLexeme.end
        );
    }
  };
  lunr2.QueryParser.parseEditDistance = function(parser) {
    var lexeme = parser.consumeLexeme();
    if (lexeme == void 0) {
      return;
    }
    var editDistance = parseInt(lexeme.str, 10);
    if (isNaN(editDistance)) {
      var errorMessage = "edit distance must be numeric";
      throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    parser.currentClause.editDistance = editDistance;
    var nextLexeme = parser.peekLexeme();
    if (nextLexeme == void 0) {
      parser.nextClause();
      return;
    }
    switch (nextLexeme.type) {
      case lunr2.QueryLexer.TERM:
        parser.nextClause();
        return lunr2.QueryParser.parseTerm;
      case lunr2.QueryLexer.FIELD:
        parser.nextClause();
        return lunr2.QueryParser.parseField;
      case lunr2.QueryLexer.EDIT_DISTANCE:
        return lunr2.QueryParser.parseEditDistance;
      case lunr2.QueryLexer.BOOST:
        return lunr2.QueryParser.parseBoost;
      case lunr2.QueryLexer.PRESENCE:
        parser.nextClause();
        return lunr2.QueryParser.parsePresence;
      default:
        var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
        throw new lunr2.QueryParseError(
          errorMessage,
          nextLexeme.start,
          nextLexeme.end
        );
    }
  };
  lunr2.QueryParser.parseBoost = function(parser) {
    var lexeme = parser.consumeLexeme();
    if (lexeme == void 0) {
      return;
    }
    var boost = parseInt(lexeme.str, 10);
    if (isNaN(boost)) {
      var errorMessage = "boost must be numeric";
      throw new lunr2.QueryParseError(errorMessage, lexeme.start, lexeme.end);
    }
    parser.currentClause.boost = boost;
    var nextLexeme = parser.peekLexeme();
    if (nextLexeme == void 0) {
      parser.nextClause();
      return;
    }
    switch (nextLexeme.type) {
      case lunr2.QueryLexer.TERM:
        parser.nextClause();
        return lunr2.QueryParser.parseTerm;
      case lunr2.QueryLexer.FIELD:
        parser.nextClause();
        return lunr2.QueryParser.parseField;
      case lunr2.QueryLexer.EDIT_DISTANCE:
        return lunr2.QueryParser.parseEditDistance;
      case lunr2.QueryLexer.BOOST:
        return lunr2.QueryParser.parseBoost;
      case lunr2.QueryLexer.PRESENCE:
        parser.nextClause();
        return lunr2.QueryParser.parsePresence;
      default:
        var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
        throw new lunr2.QueryParseError(
          errorMessage,
          nextLexeme.start,
          nextLexeme.end
        );
    }
  };
  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      define(factory);
    } else if (typeof exports === "object") {
      module.exports = factory();
    } else {
      root.lunr = factory();
    }
  })(this, function() {
    return lunr2;
  });
})();
/*!
 * clipboard.js v2.0.4
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["ClipboardJS"] = factory();
  else root["ClipboardJS"] = factory();
})(this, function() {
  return (
    /******/
    (function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        var module2 = installedModules[moduleId] = {
          /******/
          i: moduleId,
          /******/
          l: false,
          /******/
          exports: {}
          /******/
        };
        modules[moduleId].call(
          module2.exports,
          module2,
          module2.exports,
          __webpack_require__
        );
        module2.l = true;
        return module2.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.d = function(exports2, name, getter) {
        if (!__webpack_require__.o(exports2, name)) {
          Object.defineProperty(exports2, name, {
            enumerable: true,
            get: getter
          });
        }
      };
      __webpack_require__.r = function(exports2) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          Object.defineProperty(exports2, Symbol.toStringTag, {
            value: "Module"
          });
        }
        Object.defineProperty(exports2, "__esModule", { value: true });
      };
      __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule)
          return value;
        var ns = /* @__PURE__ */ Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", {
          enumerable: true,
          value
        });
        if (mode & 2 && typeof value != "string")
          for (var key in value)
            __webpack_require__.d(
              ns,
              key,
              function(key2) {
                return value[key2];
              }.bind(null, key)
            );
        return ns;
      };
      __webpack_require__.n = function(module2) {
        var getter = module2 && module2.__esModule ? (
          /******/
          function getDefault() {
            return module2["default"];
          }
        ) : (
          /******/
          function getModuleExports() {
            return module2;
          }
        );
        __webpack_require__.d(getter, "a", getter);
        return getter;
      };
      __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      __webpack_require__.p = "";
      return __webpack_require__(__webpack_require__.s = 0);
    })(
      /************************************************************************/
      /******/
      [
        /* 0 */
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _createClass = /* @__PURE__ */ (function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps) defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();
          var _clipboardAction = __webpack_require__(1);
          var _clipboardAction2 = _interopRequireDefault(_clipboardAction);
          var _tinyEmitter = __webpack_require__(3);
          var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);
          var _goodListener = __webpack_require__(4);
          var _goodListener2 = _interopRequireDefault(_goodListener);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError(
                "Super expression must either be null or a function, not " + typeof superClass
              );
            }
            subClass.prototype = Object.create(
              superClass && superClass.prototype,
              {
                constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              }
            );
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Clipboard = (function(_Emitter) {
            _inherits(Clipboard2, _Emitter);
            function Clipboard2(trigger, options) {
              _classCallCheck(this, Clipboard2);
              var _this = _possibleConstructorReturn(
                this,
                (Clipboard2.__proto__ || Object.getPrototypeOf(Clipboard2)).call(
                  this
                )
              );
              _this.resolveOptions(options);
              _this.listenClick(trigger);
              return _this;
            }
            _createClass(
              Clipboard2,
              [
                {
                  key: "resolveOptions",
                  value: function resolveOptions() {
                    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                    this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                    this.text = typeof options.text === "function" ? options.text : this.defaultText;
                    this.container = _typeof(options.container) === "object" ? options.container : document.body;
                  }
                  /**
                   * Adds a click event listener to the passed trigger.
                   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                   */
                },
                {
                  key: "listenClick",
                  value: function listenClick(trigger) {
                    var _this2 = this;
                    this.listener = (0, _goodListener2.default)(
                      trigger,
                      "click",
                      function(e) {
                        return _this2.onClick(e);
                      }
                    );
                  }
                  /**
                   * Defines a new `ClipboardAction` on each click event.
                   * @param {Event} e
                   */
                },
                {
                  key: "onClick",
                  value: function onClick(e) {
                    var trigger = e.delegateTarget || e.currentTarget;
                    if (this.clipboardAction) {
                      this.clipboardAction = null;
                    }
                    this.clipboardAction = new _clipboardAction2.default({
                      action: this.action(trigger),
                      target: this.target(trigger),
                      text: this.text(trigger),
                      container: this.container,
                      trigger,
                      emitter: this
                    });
                  }
                  /**
                   * Default `action` lookup function.
                   * @param {Element} trigger
                   */
                },
                {
                  key: "defaultAction",
                  value: function defaultAction(trigger) {
                    return getAttributeValue("action", trigger);
                  }
                  /**
                   * Default `target` lookup function.
                   * @param {Element} trigger
                   */
                },
                {
                  key: "defaultTarget",
                  value: function defaultTarget(trigger) {
                    var selector = getAttributeValue("target", trigger);
                    if (selector) {
                      return document.querySelector(selector);
                    }
                  }
                  /**
                   * Returns the support of the given action, or all actions if no action is
                   * given.
                   * @param {String} [action]
                   */
                },
                {
                  key: "defaultText",
                  /**
                   * Default `text` lookup function.
                   * @param {Element} trigger
                   */
                  value: function defaultText(trigger) {
                    return getAttributeValue("text", trigger);
                  }
                  /**
                   * Destroy lifecycle.
                   */
                },
                {
                  key: "destroy",
                  value: function destroy() {
                    this.listener.destroy();
                    if (this.clipboardAction) {
                      this.clipboardAction.destroy();
                      this.clipboardAction = null;
                    }
                  }
                }
              ],
              [
                {
                  key: "isSupported",
                  value: function isSupported() {
                    var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"];
                    var actions = typeof action === "string" ? [action] : action;
                    var support = !!document.queryCommandSupported;
                    actions.forEach(function(action2) {
                      support = support && !!document.queryCommandSupported(action2);
                    });
                    return support;
                  }
                }
              ]
            );
            return Clipboard2;
          })(_tinyEmitter2.default);
          function getAttributeValue(suffix, element) {
            var attribute = "data-clipboard-" + suffix;
            if (!element.hasAttribute(attribute)) {
              return;
            }
            return element.getAttribute(attribute);
          }
          module2.exports = Clipboard;
        },
        /* 1 */
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _createClass = /* @__PURE__ */ (function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps) defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();
          var _select = __webpack_require__(2);
          var _select2 = _interopRequireDefault(_select);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var ClipboardAction = (function() {
            function ClipboardAction2(options) {
              _classCallCheck(this, ClipboardAction2);
              this.resolveOptions(options);
              this.initSelection();
            }
            _createClass(ClipboardAction2, [
              {
                key: "resolveOptions",
                value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                  this.action = options.action;
                  this.container = options.container;
                  this.emitter = options.emitter;
                  this.target = options.target;
                  this.text = options.text;
                  this.trigger = options.trigger;
                  this.selectedText = "";
                }
                /**
                 * Decides which selection strategy is going to be applied based
                 * on the existence of `text` and `target` properties.
                 */
              },
              {
                key: "initSelection",
                value: function initSelection() {
                  if (this.text) {
                    this.selectFake();
                  } else if (this.target) {
                    this.selectTarget();
                  }
                }
                /**
                 * Creates a fake textarea element, sets its value from `text` property,
                 * and makes a selection on it.
                 */
              },
              {
                key: "selectFake",
                value: function selectFake() {
                  var _this = this;
                  var isRTL = document.documentElement.getAttribute("dir") == "rtl";
                  this.removeFake();
                  this.fakeHandlerCallback = function() {
                    return _this.removeFake();
                  };
                  this.fakeHandler = this.container.addEventListener(
                    "click",
                    this.fakeHandlerCallback
                  ) || true;
                  this.fakeElem = document.createElement("textarea");
                  this.fakeElem.style.fontSize = "12pt";
                  this.fakeElem.style.border = "0";
                  this.fakeElem.style.padding = "0";
                  this.fakeElem.style.margin = "0";
                  this.fakeElem.style.position = "absolute";
                  this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
                  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                  this.fakeElem.style.top = yPosition + "px";
                  this.fakeElem.setAttribute("readonly", "");
                  this.fakeElem.value = this.text;
                  this.container.appendChild(this.fakeElem);
                  this.selectedText = (0, _select2.default)(this.fakeElem);
                  this.copyText();
                }
                /**
                 * Only removes the fake element after another click event, that way
                 * a user can hit `Ctrl+C` to copy because selection still exists.
                 */
              },
              {
                key: "removeFake",
                value: function removeFake() {
                  if (this.fakeHandler) {
                    this.container.removeEventListener(
                      "click",
                      this.fakeHandlerCallback
                    );
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                  }
                  if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                  }
                }
                /**
                 * Selects the content from element passed on `target` property.
                 */
              },
              {
                key: "selectTarget",
                value: function selectTarget() {
                  this.selectedText = (0, _select2.default)(this.target);
                  this.copyText();
                }
                /**
                 * Executes the copy operation based on the current selection.
                 */
              },
              {
                key: "copyText",
                value: function copyText() {
                  var succeeded = void 0;
                  try {
                    succeeded = document.execCommand(this.action);
                  } catch (err) {
                    succeeded = false;
                  }
                  this.handleResult(succeeded);
                }
                /**
                 * Fires an event based on the copy operation result.
                 * @param {Boolean} succeeded
                 */
              },
              {
                key: "handleResult",
                value: function handleResult(succeeded) {
                  this.emitter.emit(succeeded ? "success" : "error", {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                  });
                }
                /**
                 * Moves focus away from `target` and back to the trigger, removes current selection.
                 */
              },
              {
                key: "clearSelection",
                value: function clearSelection() {
                  if (this.trigger) {
                    this.trigger.focus();
                  }
                  window.getSelection().removeAllRanges();
                }
                /**
                 * Sets the `action` to be performed which can be either 'copy' or 'cut'.
                 * @param {String} action
                 */
              },
              {
                key: "destroy",
                /**
                 * Destroy lifecycle.
                 */
                value: function destroy() {
                  this.removeFake();
                }
              },
              {
                key: "action",
                set: function set() {
                  var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "copy";
                  this._action = action;
                  if (this._action !== "copy" && this._action !== "cut") {
                    throw new Error(
                      'Invalid "action" value, use either "copy" or "cut"'
                    );
                  }
                },
                /**
                 * Gets the `action` property.
                 * @return {String}
                 */
                get: function get() {
                  return this._action;
                }
                /**
                 * Sets the `target` property using an element
                 * that will be have its content copied.
                 * @param {Element} target
                 */
              },
              {
                key: "target",
                set: function set(target) {
                  if (target !== void 0) {
                    if (target && (typeof target === "undefined" ? "undefined" : _typeof(target)) === "object" && target.nodeType === 1) {
                      if (this.action === "copy" && target.hasAttribute("disabled")) {
                        throw new Error(
                          'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                        );
                      }
                      if (this.action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                        throw new Error(
                          `Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`
                        );
                      }
                      this._target = target;
                    } else {
                      throw new Error(
                        'Invalid "target" value, use a valid Element'
                      );
                    }
                  }
                },
                /**
                 * Gets the `target` property.
                 * @return {String|HTMLElement}
                 */
                get: function get() {
                  return this._target;
                }
              }
            ]);
            return ClipboardAction2;
          })();
          module2.exports = ClipboardAction;
        },
        /* 2 */
        /***/
        function(module2, exports2) {
          function select(element) {
            var selectedText;
            if (element.nodeName === "SELECT") {
              element.focus();
              selectedText = element.value;
            } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
              var isReadOnly = element.hasAttribute("readonly");
              if (!isReadOnly) {
                element.setAttribute("readonly", "");
              }
              element.select();
              element.setSelectionRange(0, element.value.length);
              if (!isReadOnly) {
                element.removeAttribute("readonly");
              }
              selectedText = element.value;
            } else {
              if (element.hasAttribute("contenteditable")) {
                element.focus();
              }
              var selection = window.getSelection();
              var range = document.createRange();
              range.selectNodeContents(element);
              selection.removeAllRanges();
              selection.addRange(range);
              selectedText = selection.toString();
            }
            return selectedText;
          }
          module2.exports = select;
        },
        /* 3 */
        /***/
        function(module2, exports2) {
          function E() {
          }
          E.prototype = {
            on: function(name, callback, ctx) {
              var e = this.e || (this.e = {});
              (e[name] || (e[name] = [])).push({
                fn: callback,
                ctx
              });
              return this;
            },
            once: function(name, callback, ctx) {
              var self2 = this;
              function listener() {
                self2.off(name, listener);
                callback.apply(ctx, arguments);
              }
              listener._ = callback;
              return this.on(name, listener, ctx);
            },
            emit: function(name) {
              var data = [].slice.call(arguments, 1);
              var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
              var i = 0;
              var len = evtArr.length;
              for (i; i < len; i++) {
                evtArr[i].fn.apply(evtArr[i].ctx, data);
              }
              return this;
            },
            off: function(name, callback) {
              var e = this.e || (this.e = {});
              var evts = e[name];
              var liveEvents = [];
              if (evts && callback) {
                for (var i = 0, len = evts.length; i < len; i++) {
                  if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                    liveEvents.push(evts[i]);
                }
              }
              liveEvents.length ? e[name] = liveEvents : delete e[name];
              return this;
            }
          };
          module2.exports = E;
        },
        /* 4 */
        /***/
        function(module2, exports2, __webpack_require__) {
          var is = __webpack_require__(5);
          var delegate = __webpack_require__(6);
          function listen(target, type, callback) {
            if (!target && !type && !callback) {
              throw new Error("Missing required arguments");
            }
            if (!is.string(type)) {
              throw new TypeError("Second argument must be a String");
            }
            if (!is.fn(callback)) {
              throw new TypeError("Third argument must be a Function");
            }
            if (is.node(target)) {
              return listenNode(target, type, callback);
            } else if (is.nodeList(target)) {
              return listenNodeList(target, type, callback);
            } else if (is.string(target)) {
              return listenSelector(target, type, callback);
            } else {
              throw new TypeError(
                "First argument must be a String, HTMLElement, HTMLCollection, or NodeList"
              );
            }
          }
          function listenNode(node, type, callback) {
            node.addEventListener(type, callback);
            return {
              destroy: function() {
                node.removeEventListener(type, callback);
              }
            };
          }
          function listenNodeList(nodeList, type, callback) {
            Array.prototype.forEach.call(nodeList, function(node) {
              node.addEventListener(type, callback);
            });
            return {
              destroy: function() {
                Array.prototype.forEach.call(nodeList, function(node) {
                  node.removeEventListener(type, callback);
                });
              }
            };
          }
          function listenSelector(selector, type, callback) {
            return delegate(document.body, selector, type, callback);
          }
          module2.exports = listen;
        },
        /* 5 */
        /***/
        function(module2, exports2) {
          exports2.node = function(value) {
            return value !== void 0 && value instanceof HTMLElement && value.nodeType === 1;
          };
          exports2.nodeList = function(value) {
            var type = Object.prototype.toString.call(value);
            return value !== void 0 && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports2.node(value[0]));
          };
          exports2.string = function(value) {
            return typeof value === "string" || value instanceof String;
          };
          exports2.fn = function(value) {
            var type = Object.prototype.toString.call(value);
            return type === "[object Function]";
          };
        },
        /* 6 */
        /***/
        function(module2, exports2, __webpack_require__) {
          var closest = __webpack_require__(7);
          function _delegate(element, selector, type, callback, useCapture) {
            var listenerFn = listener.apply(this, arguments);
            element.addEventListener(type, listenerFn, useCapture);
            return {
              destroy: function() {
                element.removeEventListener(type, listenerFn, useCapture);
              }
            };
          }
          function delegate(elements, selector, type, callback, useCapture) {
            if (typeof elements.addEventListener === "function") {
              return _delegate.apply(null, arguments);
            }
            if (typeof type === "function") {
              return _delegate.bind(null, document).apply(null, arguments);
            }
            if (typeof elements === "string") {
              elements = document.querySelectorAll(elements);
            }
            return Array.prototype.map.call(elements, function(element) {
              return _delegate(element, selector, type, callback, useCapture);
            });
          }
          function listener(element, selector, type, callback) {
            return function(e) {
              e.delegateTarget = closest(e.target, selector);
              if (e.delegateTarget) {
                callback.call(element, e);
              }
            };
          }
          module2.exports = delegate;
        },
        /* 7 */
        /***/
        function(module2, exports2) {
          var DOCUMENT_NODE_TYPE = 9;
          if (typeof Element !== "undefined" && !Element.prototype.matches) {
            var proto = Element.prototype;
            proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
          }
          function closest(element, selector) {
            while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
              if (typeof element.matches === "function" && element.matches(selector)) {
                return element;
              }
              element = element.parentNode;
            }
          }
          module2.exports = closest;
        }
        /******/
      ]
    )
  );
});
const convertInstagramToPhotoSwipe = () => {
  const getFigureHTML = (image, height, width, thumbnail, username, name, instagramId) => `
     <figure
        itemprop="associatedMedia"
        itemscope
        itemtype="http://schema.org/ImageObject"
     >
        <a
            href="${image}"
            itemprop="contentUrl"
            data-size="${width}x${height}"
        >
        <img
            src="${thumbnail}"
            itemprop="thumbnail"
            alt="Image description"
        />
        </a>
        <figcaption itemprop="caption description">
          <a href="https://www.instagram.com/p/${instagramId}/"
              target="_blank" rel="nofollow noopener noreferrer"
          >
              Photo
          </a> by
          <a href="https://www.instagram.com/${username}/"
              target="_blank" rel="nofollow noopener noreferrer"
          >
              ${name}
          </a>
        </figcaption>
     </figure>
    `;
  document.querySelectorAll(".elegant-instagram").forEach((ele) => {
    const instagramId = ele.dataset.instagramId;
    fetch(`https://www.instagram.com/p/${instagramId}/?__a=1`).then((response) => {
      response.json().then((json) => {
        const level1 = json.graphql.shortcode_media;
        let divHTML = `<div
                          class="elegant-gallery"
                          itemscope
                          itemtype="http://schema.org/ImageGallery"
                        >`;
        const username = level1.owner.username;
        const name = level1.owner.full_name;
        if (level1.edge_sidecar_to_children && level1.edge_sidecar_to_children.edges.length > 0) {
          level1.edge_sidecar_to_children.edges.forEach((edge) => {
            const origImage = edge.node.display_url;
            const height = edge.node.dimensions.height;
            const width = edge.node.dimensions.width;
            const thumbnail = edge.node.display_resources[0].src;
            divHTML += getFigureHTML(
              origImage,
              height,
              width,
              thumbnail,
              username,
              name,
              instagramId
            );
          });
        } else {
          const origImage = level1.display_url;
          const height = level1.dimensions.height;
          const width = level1.dimensions.width;
          const thumbnail = level1.display_resources[0].src;
          divHTML += getFigureHTML(
            origImage,
            height,
            width,
            thumbnail,
            username,
            name,
            instagramId
          );
        }
        divHTML += `</div>`;
        ele.innerHTML = divHTML;
        ele.replaceWith(ele.children[0]);
        initPhotoSwipeFromDOM(".elegant-gallery");
      });
    }).catch((err) => console.error("Failed", err));
  });
};
convertInstagramToPhotoSwipe();
const copyToClipboardDefaultText = {
  innerText: "Copy",
  ariaLabel: "Copy to clipboard"
};
const copyToClipboardSuccessText = {
  innerText: "Copied!",
  ariaLabel: "Copied to clipboard"
};
document.querySelectorAll("div.highlight pre").forEach((snippet) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("codecopy");
  const parent = snippet.parentNode;
  parent.replaceChild(wrapper, snippet);
  wrapper.appendChild(snippet);
  const button = `
            <button
                class="codecopy-btn"
                title=${copyToClipboardDefaultText.ariaLabel}
                aria-label=${copyToClipboardDefaultText.ariaLabel}
            >${copyToClipboardDefaultText.innerText}
            </button>`;
  wrapper.insertAdjacentHTML("afterbegin", button);
});
const clipboard = new ClipboardJS(".codecopy-btn", {
  target: (trigger) => {
    return trigger.parentNode;
  }
});
clipboard.on("success", (e) => {
  e.trigger.innerText = copyToClipboardSuccessText.innerText;
  e.trigger.setAttribute("aria-label", copyToClipboardSuccessText.ariaLabel);
  e.clearSelection();
  setTimeout(() => {
    e.trigger.innerText = copyToClipboardDefaultText.innerText;
    e.trigger.setAttribute("aria-label", copyToClipboardDefaultText.ariaLabel);
  }, 400);
});
function lunr_search(term) {
  if (!tipuesearch) {
    console.error("Pelican Elegant: Tipue search plugin is required");
    return;
  }
  const items = tipuesearch["pages"];
  const documents = tipuesearch["pages"];
  let counter = 0;
  for (item in documents) {
    documents[item]["id"] = counter;
    counter = counter + 1;
  }
  idx = lunr(function() {
    this.ref("id");
    this.field("title");
    this.field("url");
    this.field("text", { boost: 10 });
    this.field("tags");
    items.forEach(function(doc) {
      this.add(doc);
    }, this);
  });
  if (term && idx && documents) {
    const resultHeadingRoot = document.getElementById(
      "lunr-search-result-heading"
    );
    const resultIntro = `
    <h1>Search Results for <code>${term}</code></h1>
    `;
    resultHeadingRoot.insertAdjacentHTML("beforeend", resultIntro);
    const resultRoot = document.getElementById("lunr-search-result");
    var results = idx.search(term);
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        var ref = results[i]["ref"];
        var url = documents[ref]["url"];
        var title = documents[ref]["title"];
        var body = documents[ref]["text"].substring(0, 280) + "...";
        const resultItem = `
          <div class="lunr-search-result-item">
              <h4>
                  <a href=${url}>
                  ${title}
                  </a>
               </h4>
              </a>
              <p class="lunr-search-result-item-body">${body}
              </p>
          </div>
          `;
        resultRoot.insertAdjacentHTML("beforeend", resultItem);
      }
    } else {
      const resultFailure = `<p class="lunr-result-fail">No results found for <span class="lunr-search-term">${term}</span></p>`;
      resultRoot.insertAdjacentHTML("beforeend", resultFailure);
    }
  }
  return false;
}
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
    }
  }
}
var searchTerm = getQueryVariable("q");
if (searchTerm) {
  lunr_search(searchTerm);
}
