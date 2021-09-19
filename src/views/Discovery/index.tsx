import { Component as tsx } from "vue-tsx-support";
import { Component } from "vue-property-decorator";
import "./style.scss";
@Component
export default class Discovery extends tsx<any> {
  protected render() {
    return <div class="page-discovery">Discovery</div>;
  }
}
