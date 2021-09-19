import EventEmitter from "./EventEmitter";

enum Ease {
  quadratic = "quadratic",
  circular = "circular",
  back = "back",
  bounce = "bounce",
  elastic = "elastic",
}

export interface EaseItem {
  style: string;
  fn: EaseFn;
}

export interface EaseFn {
  (t: number): number;
}

interface EaseMap {
  [Ease.quadratic]: EaseItem;
  [Ease.circular]: EaseItem;
  [Ease.back]: EaseItem;
  [Ease.bounce]: EaseItem;
  [Ease.elastic]: EaseItem;
}

export const easeMap: EaseMap = {
  [Ease.quadratic]: {
    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fn: (t: number) => t * (2 - t),
  },
  [Ease.circular]: {
    style: "cubic-bezier(0.1, 0.57, 0.1, 1)", // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
    fn: (t: number) => Math.sqrt(1 - --t * t),
  },
  [Ease.back]: {
    style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    fn: (t: number) => {
      const b = 4;
      return (t = t - 1) * t * ((b + 1) * t + b) + 1;
    },
  },
  [Ease.bounce]: {
    style: "",
    fn: (t: number) => {
      if ((t /= 1) < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
  },
  [Ease.elastic]: {
    style: "",
    fn: (t: number) => {
      const f = 0.22,
        e = 0.4;
      if (t === 0) {
        return 0;
      }
      if (t == 1) {
        return 1;
      }

      return (
        e * Math.pow(2, -10 * t) * Math.sin(((t - f / 4) * (2 * Math.PI)) / f) +
        1
      );
    },
  },
};

export default class Animation<
  T extends { [key: string]: number }
> extends EventEmitter {
  constructor(target: T) {
    super();
    this.target = target;
  }
  private target: T = null;
  private isAnimating = false;
  private getNow() {
    return window.performance &&
      window.performance.now &&
      window.performance.timing
      ? window.performance.now() + window.performance.timing.navigationStart
      : +new Date();
  }

  private setTarget(callback: (key: string) => number) {
    for (const key in this.target) {
      if (Object.prototype.hasOwnProperty.call(this.target, key)) {
        this.target[key] = callback(key) as any;
      }
    }
  }

  public to(end: T, duration: number, ease: Ease = Ease.circular) {
    const startTime = this.getNow(),
      destTime = startTime + duration,
      start = JSON.parse(JSON.stringify(this.target));
    const raf =
      window.requestAnimationFrame ||
      window.requestAnimationFrame.bind(window) ||
      ((fn) => {
        setTimeout(fn, 1000 / 60);
      });

    const step = () => {
      const now = this.getNow();
      if (now >= destTime) {
        this.setTarget((key) => end[key]);
        this.isAnimating = false;
        this.emit("update", this.target);
        this.emit("complete", this.target);
        return;
      }
      const t = (now - startTime) / duration;
      const easing = easeMap[ease].fn(t); //progress;
      this.setTarget((key) => (end[key] - start[key]) * easing + start[key]);
      this.emit("update", this.target);
      if (this.isAnimating) {
        raf(step);
      }
    };
    this.isAnimating = true;
    step();
    return this;
  }

  public kill() {
    this.isAnimating = false;
    return this;
  }
}

// const $body = document.querySelector("body");

// $body.addEventListener("click", () => {
//   new Animation({
//     x: 0,
//   })
//     .to({ x: 360 }, 1000)
//     .on("update", ({ x }) => {
//       console.log(x);
//       $body.style.transform = `rotate(${x}deg)`;
//     });
// });
