import EventEmitter from "@/common/EventEmitter";
import Animation from "@/common/Animation";
import device, { DeviceOrientation } from "current-device";
export type VisibilityType = "visible" | "hidden";

export default class BrowsersHack extends EventEmitter {
  private isPlatForm: boolean = /^(Win|Mac)\w+/.test(navigator.platform);
  private innerHeightStore: number = innerHeight;
  private innerHeightWatchRaf: number;
  public browser: {
    chrome: boolean;
    safari: boolean;
    firefox: boolean;
    ie: boolean;
    edge: boolean;
    opera: boolean;
    qq: boolean;
    360: boolean;
  } = (() => {
    const ua = navigator.userAgent;
    const brower = {
      chrome: ua.indexOf("Chrome") > -1 && ua.indexOf("Safari") > -1,
      safari: ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") == -1,
      firefox: ua.indexOf("Firefox") > -1,
      ie: !!window.ActiveXObject || "ActiveXObject" in window,
      edge: ua.indexOf("Edge") > -1,
      opera: ua.indexOf("Opera") > -1,
      qq: ua.indexOf("qqbrowse") > -1,
      360: ((option: string, value: string) => {
        const mimeTypes = navigator.mimeTypes as any;
        for (const mt in mimeTypes) {
          if (mimeTypes[mt][option] == value) {
            return true;
          }
        }
        return false;
      })("type", "application/vnd.chromium.remoting-viewer"),
    };

    if (device.mobile() && device.ios()) {
      brower.chrome = /C\w+OS\//.test(ua);
      brower.firefox = /F\w+OS\//.test(ua);
      brower.safari = !brower.chrome && !brower.firefox;
    }

    return brower;
  })();

  constructor() {
    super();

    this.on("resize", () => {
      this.doResize();
    });

    this.onResize();

    this.initEvents();
  }

  private get visibility() {
    let hidden: string, visibilityChange: string;
    if (typeof (<any>document).hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof (<any>document).mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof (<any>document).msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof (<any>document).webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    return {
      visibilityChange,
      hidden,
    };
  }

  private onTouchFullScreen() {
    const de = <any>document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  }

  private stopMultiFinger(e: Event | TouchEvent) {
    if ((e as TouchEvent).touches.length > 1) {
      e.preventDefault();
    }
  }

  private initEvents(remove?: boolean) {
    const eventType = remove
      ? (el: any, type: string, fn: any, options?: any) => {
          el.removeEventListener(type, fn, options);
        }
      : (el: any, type: string, fn: any, options?: any) => {
          el.addEventListener(type, fn, options);
        };

    eventType(window, "touchstart", this, { passive: false });
    eventType(window, "touchend", this);
    eventType(window, "resize", this);
    eventType(window, "orientationchange", this);
    eventType(document, "click", this, true);
    eventType(document, this.visibility.visibilityChange, this); //用document兼容IE
  }

  private checkRootElementScroll(newOrientation: DeviceOrientation) {
    if (newOrientation == "portrait") {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
      }, 300);
    }
  }

  private checkPushNavBar(newOrientation: DeviceOrientation, height: number) {
    const clientHeight = document.body.clientHeight;
    const screenHeight = screen.width; //ios  横屏的width就是height;
    const diff = this.browser.chrome ? -20 : 0;
    const hasNavBar =
      newOrientation == "landscape"
        ? height < screenHeight + diff
        : height == clientHeight;
    const $body = document.body;
    let lock = false;
    if (hasNavBar && newOrientation == "landscape") {
      if (lock) return;
      lock = true;
      $body.style.pointerEvents = "none";
      $body.style.height = "200vw";

      const obj = {
        y: document.documentElement.scrollTop || document.body.scrollTop,
      };

      new Animation(obj)
        .on("update", () => {
          window.scrollTo(0, obj.y);
        })
        .to({ y: 0 }, 200);
    } else {
      lock = false;
      $body.style.pointerEvents = "";
      $body.style.height = "";
    }
  }

  private doResize() {
    const newOrientation: DeviceOrientation = device.landscape()
      ? "landscape"
      : "portrait";
    const height = (this.innerHeightStore = innerHeight);
    console.log(`New orientation is ${newOrientation},New height is ${height}`);

    if (
      device.mobile() &&
      device.ios() &&
      device.iphone() &&
      !this.isPlatForm
    ) {
      this.checkRootElementScroll(newOrientation);
      this.checkPushNavBar(newOrientation, height);
    }
  }

  private onResize() {
    this.emit("resize");
    if (device.desktop()) {
      return;
    }
    // 移动端需要监听高度是否发生了变化,500毫秒内高度不发生变化才算稳定
    const start = +new Date();
    const watchInnerHeight = () => {
      cancelAnimationFrame(this.innerHeightWatchRaf);
      const stop = +new Date() - start > 500;
      if (stop) return;
      if (innerHeight != this.innerHeightStore) {
        return this.emit("resize");
      }
      this.innerHeightWatchRaf = requestAnimationFrame(watchInnerHeight);
    };
    watchInnerHeight();
  }

  private preventDoubleClick(e: any) {
    const target: any = e.target;
    const now = +new Date();
    const lastTime = target.lastTime || now;
    if (now - lastTime <= 300) {
      console.log("dblclick");
      e.preventDefault();
    }
    target.lastTime = now;
  }

  protected handleEvent(e: Event | TouchEvent) {
    switch (e.type) {
      case "touchstart":
        this.stopMultiFinger(e);
        break;
      case "touchend":
        if (this.isPlatForm) return;
        if (device.mobile() && device.android()) {
          this.onTouchFullScreen();
        }
        break;
      case "resize":
      case "orientationchange":
        this.onResize();
        break;
      case "click":
        if (device.mobile() && device.ios()) {
          this.preventDoubleClick(e);
        }
        break;
      case this.visibility.visibilityChange:
        this.emit<[VisibilityType]>(
          "visibilitychange",
          (document as any)[this.visibility.hidden] ? "hidden" : "visible"
        );
        break;
    }
  }
}
