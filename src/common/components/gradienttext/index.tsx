import { Component, Prop } from "vue-property-decorator";
import { Component as tsx } from "vue-tsx-support";
import { VNode } from "vue";
export interface GradientTextProps {
  linearGradient?: string;
  text: string;
}

interface GradientData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  list: { stopColor: string; offset: string }[];
}

@Component
export default class GradientText extends tsx<GradientTextProps> {
  @Prop({
    default:
      "linear-gradient(180deg, #f7e062 0%,#f7e062 3%,#f5db5f 4%,#f5db5f 7%,#f2d75d 8%,#f2d75d 11%,#f0d45b 12%,#f0d45b 15%,#eecf58 16%,#eecf58 19%,#ebcb56 20%,#ebcb56 23%,#e9c854 24%,#e9c854 28%,#e6c451 29%,#e6c451 32%,#e4bf4f 33%,#e4bf4f 36%,#e1bb4d 37%,#dfb84a 44%,#dcb348 45%,#daaf46 52%,#d7ac43 53%,#d7ac43 56%,#d5a841 57%,#d5a841 60%,#d2a33f 61%,#d0a03c 68%,#cd9c3a 69%,#cd9c3a 72%,#cb9738 73%,#cb9738 77%,#c89335 78%,#c69033 85%,#c38c31 86%,#c38c31 89%,#c1872e 90%,#c1872e 93%,#bf842c 94%,#bf842c 97%,#bc802a 98%,#bc802a 100%)",
  })
  private linearGradient: GradientTextProps["linearGradient"];
  @Prop()
  private text: GradientTextProps["text"];

  private get gradientData(): GradientData {
    const list = this.linearGradient
      .replace("linear-gradient(", "")
      .replace(")", "")
      .split(",")
      .map((it) => it.trim());

    return list.reduce(
      (prev, cur, i) => {
        if (i != 0) {
          prev.list.push({
            stopColor: cur.split(" ")[0],
            offset: cur.split(" ")[1],
          });
        } else {
          const k = parseInt(cur.replace("deg", "")) / 180 + 1;
          prev.x2 = -Math.round(Math.sin(Math.PI * k)) * 100;
          prev.y2 = Math.round(Math.cos(Math.PI * k)) * 100;

          if (prev.x2 < 0 || prev.y2 < 0) {
            const diff = Math.min(prev.x2, prev.y2);
            prev.x1 += -diff;
            prev.y1 += -diff;
            prev.x2 += -diff;
            prev.y2 += -diff;
          }
        }
        return prev;
      },
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        list: [],
      }
    );
  }

  protected render(): VNode {
    return (
      <svg>
        <linearGradient
          class="text-gradient"
          id={`gr-simple-${this._uid}`}
          x1={this.gradientData.x1 + "%"}
          y1={this.gradientData.x1 + "%"}
          x2={this.gradientData.x2 + "%"}
          y2={this.gradientData.y2 + "%"}
        >
          {this.gradientData.list.map(({ stopColor, offset }) => (
            <stop stop-color={stopColor} offset={offset} />
          ))}
        </linearGradient>
        <text
          text-anchor="middle"
          x="50%"
          y="50%"
          fill={`url(#gr-simple-${this._uid})`}
          class="text"
        >
          {this.text}
        </text>
      </svg>
    );
  }
}
