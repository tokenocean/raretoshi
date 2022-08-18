import { create } from "ipfs-http-client";
import proxy from "fastify-http-proxy";
import httpProxy from "http-proxy";
import fs from "fs";
import { app } from "./app.js";
import { Readable, pipeline } from "stream";
import { extract } from "it-tar";
import { pipe } from "it-pipe";
import toBuffer from "it-to-buffer";
import all from "it-all";
import drain from "it-drain";
import last from "it-last";
import map from "it-map";

import {fileTypeFromBuffer} from 'file-type';

const { LIQUID_ELECTRS_URL, HBP_URL, IPFS_WEB_URL, HASURA_URL, IPFS_URL } =
  process.env;

let p = httpProxy
  .createProxyServer({
    target: LIQUID_ELECTRS_URL,
    changeOrigin: true,
  })
  .listen(8092);

p.on("proxyReq", (pr, req, res) => {
  pr.setHeader("Content-Type", "application/json");
});

app.register(proxy, {
  upstream: "http://localhost:8092",
  prefix: "/el",
  rewritePrefix: "",
});

app.register(proxy, {
  upstream: HASURA_URL,
  prefix: "/v1",
  rewritePrefix: "/v1",
});

async function* tarballed(source) {
  yield* pipe(source, extract(), async function* (source) {
    for await (const entry of source) {
      yield {
        ...entry,
        body: await toBuffer(map(entry.body, (buf) => buf.slice())),
      };
    }
  });
}

app.get("/ipfs/:cid", async (req, res) => {
  console.log("HI");
  let { cid } = req.params;
  let ipfs = create(IPFS_URL);
  const output = await pipe(ipfs.get(cid), tarballed, (source) => all(source));
  console.log(output);
  res.type(fileTypeFromBuffer(output[0].body));
  res.send(output[0].body);
});

// app.register(proxy, {
//   upstream: IPFS_WEB_URL,
//   prefix: "/ipfs",
//   rewritePrefix: "/ipfs",
// });

app.register(proxy, {
  upstream: HBP_URL,
  prefix: "/storage",
  rewritePrefix: "/storage",
});

app.register(proxy, {
  upstream: HBP_URL,
  prefix: "/auth",
  rewritePrefix: "/auth",
});
