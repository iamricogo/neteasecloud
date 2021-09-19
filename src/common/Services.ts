import EventEmitter from "@/common/EventEmitter";
import axios, { AxiosResponse } from "axios";
axios.defaults.withCredentials = true;

export class IRequest {
  // timestamp: number
}

export class IResponse {
  code: number;
}

export class IError {
  command: string;
  err: any;
}

export default class Service extends EventEmitter {
  public url: string;
  protected timeout = 60000;

  constructor(url?: string, timeout?: number) {
    super();
    this.url = url;
    this.timeout = timeout || this.timeout;
    axios.defaults.timeout = this.timeout;
  }

  protected send<Request extends IRequest, Response extends IResponse>(
    command: string,
    request?: Request,
    callback?: (err: IError, res: Response) => void
  ): Promise<Response> {
    console.log(`ajax Request: ${command} ` + JSON.stringify(request));
    return new Promise(async (resolve, reject) => {
      let error: IError = null,
        response: Response = null;
      const queryPromise: Promise<AxiosResponse<Response>> = axios.post(
        this.url +
          command +
          "?" +
          require("qs").stringify({ timestamp: +new Date() }),
        request
      );
      queryPromise.catch((err: any) => {
        console.error(err.message);
        error = { command, err };
        this.emit("http-error", error);
        callback && callback(error, response);
        reject(error);
      });

      response = (await queryPromise).data;
      console.log(`ajax Response: ${command} ` + JSON.stringify(response));
      if (response.code == 200) {
        callback && callback(error, response);
        resolve(response);
      } else {
        error = { command, err: response };
        this.emit("res-error", error);
        callback && callback(error, null);
        reject(error);
      }
    });
  }
}
