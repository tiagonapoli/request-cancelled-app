import { PassThrough } from "stream";
import { sleep } from "../utils";
import { DataStreamed } from "./common";

const writeStream = async (stream: PassThrough) => {
  stream.on("error", (err) => {
    console.error("[WriteStream] Error", err);
  });

  stream.on("close", () =>
    console.log(
      `[WriteStream] Stream provider was closed - destroyed? ${stream.destroyed}`
    )
  );
  for (let i = 0; i < DataStreamed.length && !stream.destroyed; i++) {
    stream.write(DataStreamed[i]);
    await sleep(100);
  }

  if (stream.destroyed) {
    return;
  }

  stream.end();
};

export async function streamProvider(ctx: HandlerContext) {
  const stream = new PassThrough();
  ctx.status = 200;
  ctx.body = stream;
  writeStream(stream);
}
