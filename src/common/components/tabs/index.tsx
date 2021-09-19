import { Component, Prop, Emit, Model } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";
import "./styles.scss";
export interface TabsProps {
  length: number;
}

export interface TabsSlots {
  default?: { i: number; isActive: boolean };
  line?: void;
}

@Component
export default class Tabs extends tsx<TabsProps, any, TabsSlots> {
  @Model("change", { type: Number })
  private active!: number;

  @Prop({ default: 0 })
  private length: TabsProps["length"];

  @Emit("change")
  private toggleIndex(index: number) {
    if (this.active == index) return;
  }

  protected render(): VNode {
    return (
      <ul class="tabs-wrapper">
        {this.$scopedSlots.line && this.$scopedSlots.line()}
        {Array.from({ length: this.length }).map((item, i) => (
          <v-touch
            key={i}
            tag="li"
            class={["tabs-item", this.active == i ? "active" : ""]}
            onTap={() => {
              this.toggleIndex(i);
            }}
          >
            {this.$scopedSlots.default({ i, isActive: this.active == i })}
          </v-touch>
        ))}
      </ul>
    );
  }
}
