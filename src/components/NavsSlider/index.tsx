import { Component, Prop, Model, Ref, Watch } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";
import "./styles.scss";
import ScrollView from "@/common/components/scrollview";
import Tabs from "@/common/components/tabs";
import Sliders from "@/common/components/swiper";
import { setTimeout } from "timers";
export interface NavsSliderProps {
  length: number;
}

export interface NavsSliderSlots {
  default?: number;
  nav?: { i: number; isActive: boolean };
}

@Component
export default class NavsSlider extends tsx<
  NavsSliderProps,
  any,
  NavsSliderSlots
> {
  @Model("change", { type: Number })
  private value!: number;

  @Prop({ default: 0 })
  private length: NavsSliderProps["length"];

  private get active() {
    return this.value;
  }

  private set active(val: number) {
    this.$emit("change", val);
  }
  private navLineScaleX = 1;
  private navLineTransform = 0;
  private navLineWidth = 0;
  private navTransitionDuration = 0;
  private scrollData: {
    tabTransform: number;
    navLineTransform: number;
    navLineWidth: number;
  }[] = [];

  @Ref("nav-scroll")
  private readonly navScroll!: ScrollView;

  private get currentScrollData() {
    return this.scrollData[this.active];
  }

  @Watch("active")
  protected doScroll() {
    setTimeout(() => {
      this.navScroll.scrollTo(this.currentScrollData.tabTransform, 300);
    }, 150);
  }

  @Watch("$state.resizeCount") //横竖屏变化,pc resize就会触发
  protected calcPosition() {
    const $container = this.$el.querySelector(".navs-container");
    const $lis = $container.querySelectorAll(".navs-container .tabs-item");
    const container = $container.getBoundingClientRect();
    const start = $lis[0].getBoundingClientRect();
    for (let index = 0; index < $lis.length; index++) {
      const current = $lis[index].getBoundingClientRect();
      const navLineWidth = current.width * 0.6;
      const center2Start = current.x - start.x + current.width / 2; //起点情况下，当前元素中点距离起点的距离。
      const navLineTransform = center2Start - navLineWidth / 2; //假设外层滑块不动，line的位置；
      let tabTransform = -center2Start + container.width / 2;
      const swiper = this.navScroll.swiperScroll;
      tabTransform = Math.min(swiper.minTranslate(), tabTransform);
      tabTransform = Math.max(swiper.maxTranslate(), tabTransform);

      this.$set(this.scrollData, index, {
        tabTransform,
        navLineTransform,
        navLineWidth,
      });
    }
    this.doScroll();
  }

  private onSetTranslate(swiper) {
    const progress = swiper.progress;
    if (progress <= 0 || progress >= 1) {
      //线性
      const min = this.scrollData[0];
      const max = this.scrollData[this.scrollData.length - 1];
      this.navLineWidth = this.navLineWidth =
        progress <= 0 ? min.navLineWidth : max.navLineWidth;
      return (this.navLineTransform =
        min.navLineTransform +
        (max.navLineTransform - min.navLineTransform) * progress);
    } else {
      const region = Math.floor(
        swiper.progress / (1 / (this.scrollData.length - 1))
      );
      const start = this.scrollData[region];
      const end = this.scrollData[region + 1];
      const base = 1 / (this.scrollData.length - 1);
      const oneProgress = (progress % base) / base;
      const maxWidth = end.navLineTransform - start.navLineTransform;
      this.navLineTransform = start.navLineTransform + maxWidth * oneProgress;
      this.navLineWidth =
        oneProgress < 0.5
          ? start.navLineWidth +
            (maxWidth - start.navLineWidth) * oneProgress * 2
          : maxWidth + (end.navLineWidth - maxWidth) * (oneProgress - 0.5) * 2;
    }
  }

  protected mounted() {
    this.calcPosition();
    this.doScroll();
  }

  protected render(): VNode {
    return (
      <div class="navs-slider-component">
        <div class="navs-container">
          <ScrollView
            ref="nav-scroll"
            options={{
              direction: "horizontal",
              slidesPerView: "auto",
              freeMode: true,
              mousewheel: false,
              freeModeMomentumBounce: false,
            }}
          >
            <Tabs
              v-model={this.active}
              length={this.length}
              scopedSlots={{
                line: () => (
                  <div
                    class="nav-line"
                    style={{
                      transitionDuration: this.navTransitionDuration + "s",
                      transform: `translate3d(${this.navLineTransform}px, 0px, 0px)`,
                      width: this.navLineWidth + "px",
                    }}
                  ></div>
                ),
                default: ({ i, isActive }) => [
                  this.$scopedSlots.nav({ i, isActive }),
                ],
              }}
            />
          </ScrollView>
        </div>
        <div class="contents-container">
          <Sliders
            onSetTranslate={this.onSetTranslate}
            v-model={this.active}
            length={this.length}
            options={{
              initialSlide: this.active,
              on: {
                touchStart: () => {
                  this.navTransitionDuration = 0;
                },
                touchEnd: () => {
                  this.navTransitionDuration = 0.3;
                },
              },
            }}
            scopedSlots={{
              default: (i) => this.$scopedSlots.default(i),
            }}
          />
        </div>
      </div>
    );
  }
}
