import { Component as tsx } from "vue-tsx-support";
import { Component } from "vue-property-decorator";
import Search from "./Search";
import "./style.scss";
import { Pages } from "@/router";
@Component
export default class Header extends tsx<any> {
  private get showSearch() {
    return this.$route.name == Pages.Discovery;
  }

  protected render() {
    return (
      <div class="header-component">
        <Search
          style={
            !this.showSearch
              ? { opacity: 0, pointerEvents: "none", visibility: "hidden" }
              : {}
          }
        />
      </div>
    );
  }
}
