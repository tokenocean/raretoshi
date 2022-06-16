import { v4 } from "uuid";
import { query, newapi as api } from "$lib/api";
import { tick, onDestroy } from "svelte";
import { get } from "svelte/store";
import { btc, goto, err, info, sleep } from "$lib/utils";
import { requirePassword } from "$lib/auth";
import {
  DUST,
  createIssuance,
  sign,
  parseAsset,
  parseVal,
  getInputs,
  network,
} from "$lib/wallet";
import branding from "$lib/branding";
import { address as Address } from "liquidjs-lib";

export let mint = async (artwork, address) => {
  await requirePassword();
  let transactions = [];

  try {
    let [inputs, total] = await getInputs();

    let domain = branding.urls.base;
    let contract = await createIssuance(artwork, domain, inputs.pop());

    let psbt = await sign(1, false);

    let tx = psbt.extractTransaction();
    let required = parseVal(tx.outs.find((o) => o.script.length === 0).value);

    if (
      tx.outs.find(
        (o) =>
          parseAsset(o.asset) === btc &&
          o.script.toString("hex") ===
            Address.toOutputScript(address, network).toString("hex") &&
          parseVal(o.value) > DUST
      )
    ) {
      inputs.unshift(tx);
    }
    transactions.push({ contract, psbt: psbt.toBase64() });
    await sleep(10);
    await info(`Signed issuance transaction 1 of ${artwork.editions.length}`);

    if (total < required)
      throw { message: "Insufficient funds", required, btc, total };

    let { issuance } = await api()
      .url("/mint")
      .post({
        artwork,
        transactions,
      })
      .json();

    goto(`/a/${artwork.slug}/1`);
  } catch (e) {
    console.log(e);
    err(e);
  }
};
