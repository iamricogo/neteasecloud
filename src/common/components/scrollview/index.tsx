import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import ResizeObserver from "resize-observer-polyfill";
import SwiperClass, { SwiperOptions } from "swiper";
import { VNode } from "vue";

import "./style.scss";
import { Debounce } from "@/common/Decorator";
export interface ScrollViewProps {
  option?: any;
  loading?: boolean | undefined;
  scrollerClass?: string | { [key: string]: boolean };
}

export interface ScrollViewEvents {
  onSetTranslate?: (swiper: SwiperClass, translate?: number) => void;
  onPullDown?: () => void;
  onPullUp?: () => void;
}

export interface ScrollViewSlots {
  default: void;
}

@Component
export default class ScrollView extends tsx<
  ScrollViewProps,
  ScrollViewEvents,
  ScrollViewSlots
> {
  @Prop({
    default: () => {
      return {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        noSwiping: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
          snapOnRelease: false,
          hide: true,
        },
        mousewheel: true,
      };
    },
  })
  private options: ScrollViewProps["option"];
  @Prop({ default: "" })
  private scrollerClass: ScrollViewProps["scrollerClass"];

  @Prop({ default: undefined })
  private loading: ScrollViewProps["loading"];

  public get swiperScroll(): any {
    return (this.$refs.mySwiper as any).$swiper;
  }

  private pullStatus:
    | "normal"
    | "pull-down-to-refresh"
    | "release-to-refresh"
    | "pullDown"
    | "pullUp" = "normal";

  @Watch("$state.resizeCount")
  protected onResize() {
    setTimeout(() => {
      this.updateScroll();
    }, 400);
  }

  @Debounce(300)
  @Emit("pullDown")
  private onPullDown() {
    console.log("pullDown");
  }

  @Debounce(300)
  @Emit("pullUp")
  private onPullUp() {
    console.log("pullUp");
  }

  @Emit("setTranslate")
  private onSetTranslate(translate: number) {
    const diff = 50;
    const min = this.swiperScroll.minTranslate() + diff;
    const max = this.swiperScroll.maxTranslate() - 10;

    if (translate >= max && translate <= 0) {
      this.pullStatus = "normal";
    } else if (translate > 0 && translate < min) {
      this.pullStatus = "pull-down-to-refresh";
    } else if (translate >= min) {
      this.pullStatus = "release-to-refresh";
    } else {
      if (
        !this.loading &&
        this.loading != undefined &&
        this.pullStatus != "pullUp"
      ) {
        this.pullStatus = "pullUp";
        this.onPullUp();
        this.$nextTick(() => {
          this.scrollTo(this.swiperScroll.maxTranslate(), 100);
        });
      }
    }
  }

  private onTouchEnd(translate: number) {
    const diff = 50;
    const min = this.swiperScroll.minTranslate() + diff;
    if (translate >= min) {
      if (!this.loading && this.pullStatus != "pullDown") {
        this.pullStatus = "pullDown";
        this.onPullDown();
      }
    }
  }

  protected mounted() {
    this.initClickHandel();
    setTimeout(() => {
      this.updateScroll();
      this.observeResize();
    });
  }

  private observeResize() {
    const elements: HTMLElement[] = [
      this.$el as HTMLElement,
      this.$el.querySelector(".swiper-slide"),
    ];
    const robserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (elements.includes(entry.target as HTMLElement)) {
          this.updateScroll();
        }
      }
    });
    elements.forEach((element) => robserver.observe(element));
  }

  private initClickHandel() {
    //文本节点可选中
    (this.swiperScroll.el as HTMLElement).addEventListener("click", () => {
      // this.addNoSwipingToTextNode(this.swiperScroll.el);
      this.stopScroll();
    });
  }

  private addNoSwipingToTextNode(el: HTMLElement | Text) {
    const childNodes = el.childNodes;
    childNodes.forEach((el: HTMLElement | Text) => {
      if (el.nodeType == 1) {
        this.addNoSwipingToTextNode(el);
      } else if (
        el.nodeType == 3 &&
        el.nodeValue.replace(/(^\s*)|(\s*$)/g, "")
      ) {
        const p = el.parentNode as HTMLElement;
        p.classList.remove("swiper-no-swiping");
        p.classList.add("swiper-no-swiping");
      }
    });
  }

  public updateScroll() {
    this.swiperScroll.update();
    this.swiperScroll.scrollbar && this.swiperScroll.scrollbar.updateSize();
  }

  public stopScroll() {
    const swiper = this.swiperScroll;
    !swiper.destroyed && this.scrollTo(swiper.getTranslate(), 0);
  }

  public scrollTo(translate: number, duration: number) {
    const swiper = this.swiperScroll;
    //开启freeModeMomentumBounce后，源码分析知touchEnd时会给wrapper容器注册transitionEnd事件，纠正为maxTranslate或者minTranslate的值。
    //若纠正的时机在此处传的translate值被设置之后，就会出现到达指定的translate位置后，又滚动到底部（maxTranslate值处）或顶部（minTranslate值处）
    //此处需要禁止transitionEnd事件里的方法执行， 源码知swiper.touchEventsData.allowMomentumBounce变量可以控制 transitionEnd事件是否执行
    swiper.touchEventsData.allowMomentumBounce = false;
    swiper.transitionEnd();
    swiper.setTransition(duration);
    swiper.setTranslate(translate);
  }

  protected render(): VNode {
    return (
      <Swiper
        cleanup-styles-on-destroy={false}
        ref="mySwiper"
        class="scroll-container"
        onSetTranslate={() => {
          this.onSetTranslate(this.swiperScroll.getTranslate());
        }}
        onTouchEnd={() => {
          this.onTouchEnd(this.swiperScroll.getTranslate());
        }}
        options={{
          ...this.options,
          scrollbar: this.options.scrollbar
            ? {
                ...this.options.scrollbar,
                el: this.options.scrollbar.el + "-" + this._uid,
              }
            : {},
        }}
      >
        <SwiperSlide ref="scroller" class={this.scrollerClass}>
          {this.$scopedSlots.default()}
        </SwiperSlide>

        {this.options.scrollbar && (
          <div
            class={[
              "swiper-scrollbar",
              (this.options.scrollbar.el + "-" + this._uid)
                .replace(".", "")
                .replace("#", ""),
            ]}
            slot="scrollbar"
          ></div>
        )}
      </Swiper>
    );
  }
}
