import { Component as tsx } from "vue-tsx-support";
import { Component } from "vue-property-decorator";
import { PortalTarget } from "portal-vue";
import ScrollView from "@/common/components/scrollview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/app.scss";
export enum PortalName {
  FIXED = "fixed",
}
export enum PortalOrder {
  SEARCH,
}

@Component
export default class App extends tsx<any> {
  protected render() {
    return (
      <div id="app">
        <div ref="pages-box" id="pages-box">
          <ScrollView
            ref="pageScroll"
            class="pages-scroll-view"
            scopedSlots={{
              default: () => (
                <transition name={this.$state.transitions.pages}>
                  <div
                    ref="page-box-container"
                    class="page-box-container"
                    key={this.$route.name}
                  >
                    <router-view />
                  </div>
                </transition>
              ),
            }}
          />
        </div>
        <div id="fixed-box">
          <Header />
          <Footer />
          <PortalTarget name={PortalName.FIXED} multiple />
        </div>
      </div>
    );
  }
}
