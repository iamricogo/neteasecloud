import "./preloading.scss";
import context, { Events } from "@/context";
import JSXUtils from "@/common/JSXUtils";

export default class Preloading {
  constructor(minVisibleTimes = 500) {
    this.minVisibleTimes = minVisibleTimes;
    this.init();
  }

  private minVisibleTimes: number;
  private $el: HTMLElement;

  public init() {
    context.events.once(Events.Loaded, () => this.destory());
    document
      .querySelector("body")
      .appendChild(
        (this.$el = JSXUtils.createElement(
          this.render(JSXUtils.h)
        ) as HTMLElement)
      );
  }

  protected render(h: any) {
    return (
      <div id="loading-box">
        <div class="main-content">
          <div class="text-base64"></div>
          <div class="logo-box">
            <i class="icon-logo"></i>
          </div>
        </div>
      </div>
    );
  }

  public visiblePromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, this.minVisibleTimes);
    });
  }

  public destory() {
    const end = () => {
      this.$el.removeEventListener("transitionend", end);
      this.$el.parentNode.removeChild(this.$el);
      this.$el = null;
    };
    this.$el.addEventListener("transitionend", end, { once: true });
    this.$el.style.opacity = "0";
  }
}
