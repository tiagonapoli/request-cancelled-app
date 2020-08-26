import { method, Service, ServiceContext } from '@vtex/api'
import { Clients, clients } from './clients'
import {
  consumerAssetServerCacheWithGetStream,
  consumerAssetServerDiskCache,
  consumerGetStream,
  consumerStreamFinished,
  streamProvider,
} from './handlers'

declare global {
  type HandlerContext = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    streamProvider: method({
      GET: streamProvider,
    }),
    consumerGetStream: method({
      GET: consumerGetStream,
    }),
    consumerStreamFinished: method({
      GET: consumerStreamFinished,
    }),
    consumerAssetServerCacheWithGetStream: method({
      GET: consumerAssetServerCacheWithGetStream,
    }),
    consumerAssetServerDiskCache: method({
      GET: consumerAssetServerDiskCache,
    }),
  },
})
