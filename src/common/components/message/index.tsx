import { Component } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";
import { Debounce } from "@/common/Decorator";
import "./styles.scss";

export interface MessageOptions {
  autoClose?: number | false;
  content?: () => VNode;
  onConfirm?: (...args: any[]) => void;
}

@Component
export default class Message extends tsx<any> {
  private options: MessageOptions = {
    content: this.defaultContent,
    onConfirm: () => {
      console.log("confirm");
    },
  };
  private visible = false;
  private timer: any;
  protected render() {
    return (
      <transition name="panel">
        {this.visible && (
          <div class="message-box-container" onClick={() => this.onConfirm()}>
            <div class="message-box">{this.options.content()}</div>
          </div>
        )}
      </transition>
    );
  }

  public defaultContent(): VNode {
    return <div>this is Message</div>;
  }

  @Debounce(300)
  public onConfirm() {
    this.hide();
    this.options.onConfirm && this.options.onConfirm();
  }

  public hide() {
    this.visible = false;
  }

  public show(options: MessageOptions) {
    clearTimeout(this.timer);
    this.visible = true;
    this.options = options;
    if (this.options.autoClose) {
      this.timer = setTimeout(() => {
        this.onConfirm();
      }, this.options.autoClose);
    }
  }
}
