import { Component, Prop, Watch } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";
export interface CheckBoxProps {
  value?: boolean;
}

export interface CheckBoxEvents {
  onInput: (check: boolean) => void;
}

export interface CheckBoxSlots {
  default?: void;
}

@Component
export default class CheckBox extends tsx<CheckBoxProps, any, CheckBoxSlots> {
  @Prop() value: CheckBoxProps["value"];

  protected render(): VNode {
    return (
      <div
        class="check-box"
        onClick={() => {
          this.$emit("input", !this.value);
        }}
      >
        <span class={["icon-box", this.value ? "active" : ""]}></span>
        {this.$scopedSlots.default()}
      </div>
    );
  }
}
