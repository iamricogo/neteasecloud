import Services, { IRequest, IResponse, IError } from "@/common/Services";
import {
  ResquestSearch,
  ResquestSearchSuggest,
  ResquestCheckMusic,
} from "./Request";
import {
  ResponseSearchAdvice,
  ResponseSearchHotDetail,
  ResponseSearchSuggest,
} from "./Response";

export enum Commond {
  SearchAdvice = "search/default",
  Search = "search",
  SearchHot = "search/hot/detail",
  SearchSuggest = "search/suggest",
  CheckMusic = "check/music",
}

export default class NetEaseServices extends Services {
  public searchAdvice(
    callback?: (err: IError, res: ResponseSearchAdvice) => void
  ): Promise<ResponseSearchAdvice> {
    return this.send<IRequest, ResponseSearchAdvice>(
      Commond.SearchAdvice,
      new IRequest(),
      callback
    );
  }

  public search(
    req: ResquestSearch,
    callback?: (err: IError, res: IResponse) => void
  ): Promise<IResponse> {
    return this.send<ResquestSearch, IResponse>(Commond.Search, req, callback);
  }
  public searchSuggest(
    req: ResquestSearchSuggest,
    callback?: (err: IError, res: ResponseSearchSuggest) => void
  ): Promise<ResponseSearchSuggest> {
    return this.send<ResquestSearchSuggest, ResponseSearchSuggest>(
      Commond.SearchSuggest,
      req,
      callback
    );
  }

  public searchHotDetail(
    callback?: (err: IError, res: ResponseSearchHotDetail) => void
  ): Promise<ResponseSearchHotDetail> {
    return this.send<IRequest, ResponseSearchHotDetail>(
      Commond.SearchHot,
      new IRequest(),
      callback
    );
  }

  public checkMusic(
    req: ResquestCheckMusic,
    callback?: (err: IError, res: IResponse) => void
  ): Promise<IResponse> {
    return this.send<ResquestCheckMusic, IResponse>(
      Commond.CheckMusic,
      req,
      callback
    );
  }
}
