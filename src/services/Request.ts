import { IRequest } from "@/common/Services";
export class ResquestSearch extends IRequest {
  keywords: string;
  type?: number; //默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  limit?: number; // 返回数量 , 默认为 30:
  offset?: number; //偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
}

export class ResquestSearchSuggest extends IRequest {
  keywords: string;
  type?: "mobile"; //如果传 'mobile' 则返回移动端数据
}

export class ResquestCheckMusic extends IRequest {
  id: string;
  br?: number = 999000;
}
