/**
 * 此组件只用了swiper做结构，无缝滚动效果用css animation动画实现（因为可以控制暂停）
 */
import { Component, Prop } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { VNode } from "vue";
import "./styles.scss";

export interface ScrollSeamlessProps {
  option?: any;
  speed?: number;
  delay?: number;
}

export interface ScrollSeamlessSlots {
  default: void;
}

@Component
export default class ScrollSeamless extends tsx<
  ScrollSeamlessProps,
  any,
  ScrollSeamlessSlots
> {
  @Prop({
    default: () => {
      return {
        noSwiping: true,
        loop: true,
        slidesPerView: "auto",
      };
    },
  })
  private options: ScrollSeamlessProps["option"];

  @Prop({ default: 50 })
  private speed: ScrollSeamlessProps["speed"];

  @Prop({ default: 1000 })
  private delay: ScrollSeamlessProps["delay"];

  private paused = true;

  private get swiper(): any {
    return (this.$refs.swiper as any).$swiper;
  }

  private hackAutoPlay() {
    this.swiper.el.onmouseover = () => {
      this.paused = true;
    };

    this.swiper.el.onmouseout = () => {
      this.paused = false;
    };
  }

  public updateSwiper() {
    if (this.options.loop) {
      //更新loop模式克隆的节点；
      this.swiper.loopDestroy();
      this.swiper.loopCreate();
      this.swiper.updateSlides();
    }
    this.swiper.update();
    setTimeout(() => {
      this.updateAnimation();
    }, 100);
  }

  public updateAnimation() {
    Array.from(this.swiper.slides).forEach(($slide: HTMLElement) => {
      $slide.style.minWidth = this.swiper.width + "px";
    });
    this.swiper.update();
    const distance = this.swiper.slidesSizesGrid[0] * 2;
    const duration = distance / this.speed;
    const $wrapperEl = this.swiper.wrapperEl as HTMLElement;

    $wrapperEl.setAttribute("data-distance", distance + "");
    $wrapperEl.style.width = distance + "px";
    $wrapperEl.style.animationDuration = duration + "s";
  }

  protected mounted() {
    this.hackAutoPlay();
    this.updateSwiper();
    this.updateAnimation();
    setTimeout(() => {
      //1s 后开始无缝滚动，IE11 上animation-delay: 1s 不兼容，动画不播放了，为负值时可以(可能只有translate动画时才会正值失效)，
      this.paused = false;
    }, this.delay);
  }

  protected update() {
    this.updateSwiper();
  }

  protected render(): VNode {
    return (
      <Swiper
        ref="swiper"
        cleanupStylesOnDestroy={false}
        class={[
          "scroll-seamless",
          "swiper-no-swiping",
          this.paused ? "animation-paused" : "",
          "mode-translate",
        ]}
        options={{
          ...this.options,
        }}
      >
        <SwiperSlide ref="scroller">{this.$scopedSlots.default()}</SwiperSlide>
      </Swiper>
    );
  }
}
