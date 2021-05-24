const queue = {};
const fired = [];

const Event = {
  fire: (event) => {
    if (typeof queue[event] === "undefined") {
      return;
    }

    while (queue[event].length) {
      queue[event].shift()();
    }

    fired[event] = true;
  },

  on: (event, callback) => {
    if (fired[event] === true) {
      return callback();
    }

    if (typeof queue[event] === "undefined") {
      queue[event] = [];
    }

    queue[event].push(callback);
  }
}

Object.freeze(Event);

export default Event;
