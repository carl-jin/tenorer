type EventObj<T> = {
  [K in keyof T]: (...args: any) => void;
};

class BaseEvent<T extends EventObj<T>> {
  private eventList: Partial<Record<keyof T, Array<T[keyof T]>>> = {};

  public $on<K extends keyof T>(eventName: K, handler: T[K]) {
    if (this.eventList[eventName]) {
      this.eventList[eventName].push(handler);
    } else {
      this.eventList[eventName] = [handler];
    }
  }

  public $off<K extends keyof T>(eventName: K, handler: T[K]) {
    if (this.eventList[eventName]) {
      let index = this.eventList[eventName].indexOf(handler);
      if (~index) {
        this.eventList[eventName].splice(index, 1);
      }
    }
  }

  public $emit<K extends keyof T>(eventName: K, ...payload: Parameters<T[K]>) {
    if (this.eventList[eventName]) {
      let list = this.eventList[eventName].slice();
      for (let i = 0; i < list.length; i++) {
        this.eventList[eventName][i].apply(null, payload);
      }
    }
  }
}

export { BaseEvent };
