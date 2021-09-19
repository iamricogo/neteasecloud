import { IResponse } from "@/common/Services";
export enum IconType {
  NONE,
  HOT,
  NEW,
  X1,
  X2,
  UP,
}
export class ResponseSearchAdvice extends IResponse {
  data: {
    showKeyword: string;
    realkeyword: string;
    action?: number;
  };
}

export class ResponseSearchHotDetail extends IResponse {
  data: {
    searchWord: string;
    score?: number;
    content: string;
    source?: number;
    iconType: IconType;
  }[];
}

export interface SearchSuggest {
  keyword: string;
}

export class ResponseSearchSuggest extends IResponse {
  result: {
    allMatch: SearchSuggest[];
  };
}
