export default class EventEmitter {
  private events = {};
  public on<T extends (...args: any[]) => void>(name: string, fn: T) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
    return this;
  }

  public emit<T extends Array<any>>(name: string, ...args: T) {
    if (!this.events[name]) {
      return this;
    }
    const fns = this.events[name];
    //不能直接遍历fns ,期间如果有off行为 会出问题
    fns.map((fn) => fn).forEach((fn) => fn(...args));
    return this;
  }

  public off<T extends (...args: any[]) => void>(name: string, fn?: T) {
    //fn  传空为解绑全部
    if (!this.events[name]) {
      return this;
    }
    if (!fn) {
      this.events[name] = null;
      return this;
    }
    const index = this.events[name].indexOf(fn);
    this.events[name].splice(index, 1);
    return this;
  }
  // 单次绑定事件,执行完后解绑
  public once<T extends (...args: any[]) => void>(name: string, fn: T) {
    const only = (...args: any[]) => {
      fn(...args);
      this.off(name, only);
    };
    this.on(name, only);
    return this;
  }
}
