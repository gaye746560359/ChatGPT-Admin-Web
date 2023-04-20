import { TextDecoderStream } from "@edge-runtime/primitives";
import { TextLineStream } from "./lib/text-line-stream";

export async function* streamToLineIterator(
  stream: ReadableStream<Uint8Array>,
): AsyncIterable<string> {
  const lineStream = stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const reader = lineStream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}