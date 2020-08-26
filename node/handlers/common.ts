import { IncomingMessage } from "http";

export const DataStreamed = Array(20).fill("12345\n");

export const setupResponseStream = (stream: IncomingMessage) => {
  stream.on("end", () => console.log("STREAM ENDED"));
  stream.on("error", (err) => console.log("STREAM ERROR", err.message));
  stream.on("close", () => console.log("STREAM CLOSED"));
};

export const setupReqStream = (req: IncomingMessage) => {
  req.on("close", () => console.log("INCOMING REQUEST CLOSED"));
  req.on("aborted", () => console.log("INCOMING REQUEST ABORTED"));
};
