import { Component, Prop, Emit } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";

export interface FontIconsProps {
  value: string;
}

export interface FontIconsEvents {
  onTap?: () => void;
}
@Component
export default class FontIcons extends tsx<FontIconsProps> {
  @Prop() value: FontIconsProps["value"];

  @Emit("tap")
  private handleTap() {
    console.log("handleTap");
  }

  protected render(): VNode {
    return (
      <v-touch
        tag="svg"
        class="icons"
        aria-hidden="true"
        onTap={() => {
          this.handleTap();
        }}
      >
        <use xlinkHref={"#icon-" + this.value}></use>
      </v-touch>
    );
  }
}
