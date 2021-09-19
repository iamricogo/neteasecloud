import { Component, Prop, Watch } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { TweenMax } from "gsap";
import { VNode } from "vue";

export interface AnimatedIntegerProps {
  tag?: string;
  value: number;
  time?: number;
}

export interface AnimatedIntegerSlots {
  default?: number;
}

@Component
export default class AnimatedInteger extends tsx<
  AnimatedIntegerProps,
  any,
  AnimatedIntegerSlots
> {
  @Prop({ default: "span" }) tag: AnimatedIntegerProps["tag"];
  @Prop({ type: Number, required: true, default: 0 })
  value: AnimatedIntegerProps["value"];
  @Prop({ default: 0.5 }) time: AnimatedIntegerProps["time"];
  private tweeningValue = 0;
  private tween: TweenMax;
  @Watch("value")
  onValueChange(newValue: number, oldValue: number) {
    this.tweenValue(oldValue, newValue);
  }

  protected mounted() {
    this.tweenValue(0, this.value);
  }

  private tweenValue(startValue: number, endValue: number) {
    const obj = { tweeningValue: startValue };
    this.tween = TweenMax.to(obj, this.time, {
      tweeningValue: endValue,
      onUpdate: () => {
        this.tweeningValue = obj.tweeningValue;
      },
    });
  }

  protected render(): VNode {
    return (
      <this.tag>
        {this.$scopedSlots.default
          ? this.$scopedSlots.default(this.tweeningValue)
          : this.tweeningValue}
      </this.tag>
    );
  }
}
