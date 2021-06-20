type Event = string;

interface Queue {
  [key: string]: (() => void)[];
}

interface Fired {
  [key: string]: boolean;
}

interface EventObject {
  fire(event: Event): void;
  on(event: Event, callback: () => void): void;
}

const queue: Queue = {};
const fired: Fired = {};

const Event: EventObject = {
  fire: (event) => {
    if (typeof queue[event] === "undefined") {
      return;
    }

    while (queue[event].length) {
      const callback = queue[event].shift();
      if (callback) {
        callback();
      }
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
  },
};

Object.freeze(Event);

export default Event;
