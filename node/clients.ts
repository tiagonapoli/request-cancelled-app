import {
  AppClient,
  CacheType,
  ClientsConfig,
  InstanceOptions,
  IOClients,
  IOContext,
  RequestConfig,
} from "@vtex/api";

export class SelfClient extends AppClient {
  constructor(ioContext: IOContext, options?: InstanceOptions) {
    super("vtex.request-cancel@0.x", ioContext, { ...options });
  }

  public getStream(requestConfig?: RequestConfig) {
    return this.http.getStream(`/_v/provide-stream`, requestConfig);
  }

  public getStreamWithDiskCache(requestConfig?: RequestConfig) {
    return this.http.getStream(`/_v/provide-stream`, {
      cacheable: CacheType.Disk,
      ...requestConfig,
    });
  }
}

export class Clients extends IOClients {
  public get selfClient(): SelfClient {
    return this.getOrSet("selfClient", SelfClient);
  }
}

const options = {
  selfClient: {
    timeout: 5000,
    retries: 1,
  },
};

export const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options,
};
