import { createTransaction } from "$queries/transactions";
import {
  createSwap,
  cancelSwap,
  sign,
  signAndBroadcast,
  signOver,
  sendToMultisig,
  requestSignature,
  createRelease,
} from "$lib/wallet";

const setupSwaps = async () => {
  if (
    !list_price ||
    (!stale &&
      parseInt(edition.list_price || 0) ===
        sats(edition.asking_asset, list_price))
  )
    return true;

  let tx;
  if (stale) tx = $psbt.extractTransaction();
  await requirePassword();

  $psbt = await createSwap(edition, sats(edition.asking_asset, list_price), tx);

  $psbt = await sign(0x83);
  edition.list_price_tx = $psbt.toBase64();

  await query(createTransaction, {
    transaction: {
      amount: sats(edition.asking_asset, list_price),
      edition_id: edition.id,
      asset: edition.asking_asset,
      hash: $psbt.__CACHE.__TX.getId(),
      psbt: $psbt.toBase64(),
      type: "listing",
    },
  });

  info("List price updated!");
};

let setupAuction = async () => {
  if (!auction_enabled) return true;

  let start = parse(
    `${start_date} ${start_time}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  let end = parse(`${end_date} ${end_time}`, "yyyy-MM-dd HH:mm", new Date());

  if (compareAsc(start, new Date()) < 1)
    throw new Error("Start date can't be in the past");

  if (compareAsc(start, end) > 0)
    throw new Error("Start date must precede end date");

  if (
    !edition.auction_end ||
    compareAsc(parseISO(edition.auction_end), new Date()) < 1
  ) {
    await requirePassword();

    let base64, tx;

    if (edition.held === "multisig") {
      tx = await signOver(edition);
      await tick();
      edition.auction_tx = $psbt.toBase64();
    } else {
      $psbt = await sendToMultisig(edition);
      $psbt = await signAndBroadcast();
      base64 = $psbt.toBase64();
      tx = $psbt.extractTransaction();

      tx = await signOver(edition, tx);
      await tick();
      edition.auction_tx = $psbt.toBase64();

      edition.auction_release_tx = (
        await createRelease(edition, tx)
      ).toBase64();
    }

    await query(createTransaction, {
      transaction: {
        amount: 1,
        edition_id: edition.id,
        asset: edition.asking_asset,
        hash: tx.getId(),
        psbt: $psbt.toBase64(),
        type: "auction",
      },
    });

    if (base64) $psbt = Psbt.fromBase64(base64);
  }

  edition.held = "multisig";
  edition.auction_start = start;
  edition.auction_end = end;
};

let stale;
let setupRoyalty = async () => {
  if (edition.has_royalty || !royalty_value) return true;

  if (!edition.auction_end) {
    await requirePassword();
    $psbt = await sendToMultisig(edition);
    await signAndBroadcast();
  }

  edition.has_royalty = true;

  await query(createTransaction, {
    transaction: {
      amount: 1,
      edition_id: edition.id,
      asset: edition.asking_asset,
      hash: $psbt.extractTransaction().getId(),
      psbt: $psbt.toBase64(),
      type: "royalty",
    },
  });

  stale = true;

  edition.held = "multisig";

  info("Royalties activated!");
};

const spendPreviousSwap = async () => {
  if (
    !list_price ||
    royalty_value ||
    edition.auction_end ||
    parseInt(edition.list_price || 0) === sats(edition.asking_asset, list_price)
  )
    return true;

  await requirePassword();

  if (edition.list_price_tx) {
    $psbt = await cancelSwap(edition, 500);

    if (edition.has_royalty || edition.auction_end) {
      $psbt = await requestSignature($psbt);
    }
    try {
      await signAndBroadcast();
      await query(createTransaction, {
        transaction: {
          amount: edition.list_price,
          edition_id: edition.id,
          asset: edition.asking_asset,
          hash: $psbt.extractTransaction().getId(),
          psbt: $psbt.toBase64(),
          type: "cancel",
        },
      });

      stale = true;
    } catch (e) {
      if (e.message.includes("already"))
        throw new Error(
          "Please wait a block before changing the listing price"
        );
      else throw e;
    }
  }
};
