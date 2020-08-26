import getStream from "get-stream";
import { sleep } from "../utils";
import { DataStreamed, setupReqStream, setupResponseStream } from "./common";

export async function consumerGetStream(ctx: HandlerContext) {
  ctx.status = 200;
  await sleep(1000);
  console.log("Finished sleeping");
  setupReqStream(ctx.req);

  try {
    const stream = await ctx.clients.selfClient.getStream();
    setupResponseStream(stream);
    console.log("Finished request");
    const str = await getStream(stream);
    console.log("Finished streaming");

    if (DataStreamed.join("") !== str) {
      console.error("Streamed content is different");
    } else {
      console.log("OK");
    }
  } catch (err) {
    console.log("DEU ERRO AEEEE :sparkles:", err.message);
  }
}
