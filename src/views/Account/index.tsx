import { Component as tsx } from "vue-tsx-support";
import { Component } from "vue-property-decorator";
import "./style.scss";
import style from "./style.module.scss";
console.log(style["page-account"]);
@Component
export default class Account extends tsx<any> {
  protected render() {
    return <div class="page-account">Account</div>;
  }
}
