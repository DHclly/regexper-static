// Utility functions used elsewhere in the codebase. Most JavaScript files on
// the site use some functions defined in this file.

import _ from 'lodash';

// Generate an `Event` object for triggering a custom event.
//
// - __name__ - Name of the custom event. This should be a String.
// - __detail__ - Event details. The event details are provided to the event
//    handler.
function customEvent(name, detail) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  evt.detail = detail;
  return evt;
}

// Add extra fields to a bounding box returned by `getBBox`. Specifically adds
// details about the box's axis points (used when positioning elements for
// display).
//
// - __box__ - Bounding box object to update. Attributes `ax`, `ax2`, and `ay`
//    will be added if they are not already defined.
function normalizeBBox(box) {
  return _.extend({
    ax: box.x,
    ax2: box.x2,
    ay: box.cy
  }, box);
}

// Positions a collection of items with their axis points aligned along a
// horizontal line. This leads to the items being spaced horizontally and
// effectively centered vertically.
//
// - __items__ - Array of items to be positioned
// - __options.padding__ - Number of pixels to leave between items
function spaceHorizontally(items, options) {
  var verticalCenter = 0;

  options = _.defaults(options || {}, {
    padding: 0
  });

  // Set horizontal position of items with padding between them, and calculate
  // where the axis points should be positioned vertically.
  _.reduce(items, (offset, item) => {
    var box;

    item.transform(Snap.matrix()
      .translate(offset, 0));

    box = normalizeBBox(item.getBBox());
    verticalCenter = Math.max(verticalCenter, box.ay);

    return offset + options.padding + box.width;
  }, 0);

  // Set vertical position of items to align their axis points.
  for (var item of items) {
    let box = normalizeBBox(item.getBBox());

    item.transform(Snap.matrix()
      .add(item.transform().localMatrix)
      .translate(0, verticalCenter - box.ay));
  }
}

// Positions a collection of items centered horizontally in a vertical stack.
//
// - __items__ - Array of items to be positioned
// - __options.padding__ - Number of pixels to leave between items
function spaceVertically(items, options) {
  var horizontalCenter = 0;

  options = _.defaults(options || {}, {
    padding: 0
  });

  // Set vertical position of items with padding between them, and calculate
  // where the center of each item should be positioned horizontally.
  _.reduce(items, (offset, item) => {
    var box;

    item.transform(Snap.matrix()
      .translate(0, offset));

    box = item.getBBox();

    horizontalCenter = Math.max(horizontalCenter, box.cx);

    return offset + options.padding + box.height;
  }, 0);

  // Set horizontal position of items to align their centers.
  for (var item of items) {
    item.transform(Snap.matrix()
      .add(item.transform().localMatrix)
      .translate(horizontalCenter - item.getBBox().cx, 0));
  }
}

// Creates a Promise that will be resolved after a specified delay.
//
// - __delay__ - Time in milliseconds to wait before resolving promise.
function wait(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}

// Creates a Promise that will be resolved after 0 milliseconds. This is used
// to create a short delay that allows the browser to address any pending tasks
// while the JavaScript VM is not active.
function tick() {
  return wait(0);
}

// Re-throws an exception asynchronously. This is used to expose an exception
// that was created during a Promise operation to be handled by global error
// handlers (and to be displayed in the browser's debug console).
//
// - __error__ - Error/exception object to be re-thrown to the browser.
function exposeError(error) {
  tick().then(() => {
    throw error;
  });
}

export default {
  customEvent,
  normalizeBBox,
  spaceHorizontally,
  spaceVertically,
  wait,
  tick,
  exposeError
};
