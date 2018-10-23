import external from './externalModules.js';
import store from './store/index.js';
import addEnabledElement from './store/internals/addEnabledElement.js';
import removeEnabledElement from './store/internals/removeEnabledElement.js';
import windowResizeHandler from './eventListeners/windowResizeHandler.js';

/**
 * Merges the provided configuration with default values and returns a
 * configured CornerstoneTools instance.
 * @export @public @method
 * @name init
 *
 * @param {object} configuration
 * @returns {object} A configured CornerstoneTools instance with top level API members.
 */
export default function (configuration) {
  _addCornerstoneEventListeners();
  _initModules();
  windowResizeHandler.enable();

  // Apply global configuration
  store.modules.globalConfiguration.state = Object.assign(
    {},
    store.modules.globalConfiguration.state,
    configuration
  );
}

/**
 * Wires up event listeners for the Cornerstone#ElementDisabled and
 * Cornerstone#ElementEnabled events.
 * @private @method
 */
function _addCornerstoneEventListeners () {
  const cornerstone = external.cornerstone;
  const elementEnabledEvent = cornerstone.EVENTS.ELEMENT_ENABLED;
  const elementDisabledEvent = cornerstone.EVENTS.ELEMENT_DISABLED;

  cornerstone.events.addEventListener(elementEnabledEvent, addEnabledElement);
  cornerstone.events.addEventListener(
    elementDisabledEvent,
    removeEnabledElement
  );
}

/*
 * TODO: This could cause issues if the module was already initialized for
 * the store. As there's nothing stopping implementers from calling `init`
 * multiple times. Modules should self-check if they have already been
 * registered to prevent issues.
 */

/**
 * Iterate over our store's modules. If the module has an `onRegisterCallback`
 * call it. This hook can be used to setup any global store requirements per
 * module.
 * @private @method
 */
function _initModules () {
  const modules = store.modules;

  Object.keys(modules).forEach(function (key) {
    if (typeof modules[key].onRegisterCallback === 'function') {
      modules[key].onRegisterCallback();
    }
  });
}
