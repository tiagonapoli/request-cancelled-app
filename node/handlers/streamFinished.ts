import { finished } from 'stream'
import { promisify } from 'util'
import { sleep } from '../utils'
import { DataStreamed, setupReqStream, setupResponseStream } from './common'

export async function consumerStreamFinished(ctx: HandlerContext) {
  ctx.status = 200
  await sleep(1000)
  console.log('Finished sleeping')
  setupReqStream(ctx.req)

  try {
    const stream = await ctx.clients.selfClient.getStream()
    console.log('Finished request')
    setupResponseStream(stream)
    let str = ''
    stream.on('data', buf => (str += buf.toString()))
    await promisify(finished)(stream)
    console.log('Finished streaming')

    if (DataStreamed.join('') !== str) {
      console.error('Streamed content is different')
    } else {
      console.log('OK')
    }
  } catch (err) {
    console.log('DEU ERRO AEEEE :sparkles:', err.message)
  }
}
