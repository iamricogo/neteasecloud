import { Component as tsx } from "vue-tsx-support";
import { Component } from "vue-property-decorator";
import "./style.scss";
@Component
export default class Loading extends tsx<any> {
  protected render() {
    return (
      <div class="loading-component">
        <i class="icon-loading-ani"></i>
        <span>加载中...</span>
      </div>
    );
  }
}
