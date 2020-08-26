import { LRUDiskCache } from '@vtex/api'
import { createReadStream, createWriteStream, PathLike, writeFile } from 'fs-extra'
import getStream from 'get-stream'
import { pipeline, Readable, Writable } from 'stream'
import { promisify } from 'util'
import { sleep } from '../utils'
import { DataStreamed, setupReqStream, setupResponseStream } from './common'
import isStream = require('is-stream')

type Streamable = Readable | void | Buffer | string

const waitOpen = (stream: Readable | Writable) => {
  return new Promise((resolve, reject) => {
    const clear = () => {
      stream.removeListener('open', onOpen)
      stream.removeListener('error', onError)
    }

    const onOpen = () => {
      clear()
      resolve(stream)
    }
    const onError = (err: Error) => {
      clear()
      reject(err)
    }

    stream.once('error', onError)
    stream.once('open', onOpen)
  })
}

const createFsReadStream = (path: PathLike): Promise<Readable> => {
  const stream = createReadStream(path)
  return waitOpen(stream) as Promise<Readable>
}

const createFsWriteStream = (path: PathLike): Promise<Writable> => {
  const stream = createWriteStream(path)
  return waitOpen(stream) as Promise<Writable>
}

export const readStreamFromDisk = (cacheKey: string): Promise<Readable> => createFsReadStream(cacheKey)

export const writeToDisk = async (cacheKey: string, data: Streamable) => {
  if (!isStream(data)) {
    return await writeFile(cacheKey, data as Buffer | string)
  }


  const outputFileStream = await createFsWriteStream(cacheKey)
  console.log('[cache] Stream write')
  try {
    return await promisify(pipeline)(data as Readable, outputFileStream)
  } catch (err) {
    console.log('[cache] Error on pipeline', err)
    throw err
  }
}

// This cache is similar to the used on asset-server
const cacheStorage = new LRUDiskCache<any>('/cache', { max: 1000 }, readStreamFromDisk, writeToDisk)

export async function consumerAssetServerCacheWithGetStream(ctx: HandlerContext) {
  ctx.status = 200
  await sleep(1000)
  console.log('Finished sleeping')
  setupReqStream(ctx.req)

  try {
    const stream = await ctx.clients.selfClient.getStream()
    console.log('Finished request')
    setupResponseStream(stream)
    const buffer = await getStream(stream)
    await cacheStorage.set('file0', buffer, 1000 * 1000)
    console.log('Finished streaming')

    const cachedData = await getStream(await cacheStorage.get('file0'))
    if (DataStreamed.join('') !== cachedData) {
      console.error('Streamed content is different')
    } else {
      console.log('OK')
    }
  } catch (err) {
    console.log('DEU ERRO AEEEE :sparkles:', err.message)
  }
}

export async function consumerAssetServerDiskCache(ctx: HandlerContext) {
  ctx.status = 200
  await sleep(1000)
  console.log('Finished sleeping')
  setupReqStream(ctx.req)

  try {
    const stream = await ctx.clients.selfClient.getStream()
    console.log('Finished request')
    setupResponseStream(stream)
    await cacheStorage.set('file1', stream, 1000 * 1000)
    console.log('Finished streaming')

    const cachedData = await getStream(await cacheStorage.get('file1'))
    if (DataStreamed.join('') !== cachedData) {
      console.error('Streamed content is different')
    } else {
      console.log('OK')
    }
  } catch (err) {
    console.log('DEU ERRO AEEEE :sparkles:', err.message)
  }
}
