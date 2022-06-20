<script>
  import { browser } from "$app/env";
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
  import { Psbt } from "liquidjs-lib";
  import { onMount, tick } from "svelte";
  import {
    updateArtwork,
    updateArtworkWithRoyaltyRecipients,
  } from "$queries/artworks";
  import { api, query } from "$lib/api";
  import { fee, password, sighash, prompt, psbt } from "$lib/store";
  import { requirePassword } from "$lib/auth";
  import {
    format,
    addDays,
    compareAsc,
    isWithinInterval,
    parse,
    parseISO,
    addMinutes,
  } from "date-fns";
  import {
    btc,
    goto,
    err,
    info,
    units,
    sats,
    val,
    ticker,
    tickers,
    royaltyRecipientSystemType,
  } from "$lib/utils";
  import { ProgressLinear, RoyaltyRecipientList } from "$comp";
  import Select from "svelte-select";
  import branding from "$lib/branding";

  export let edition, default_royalty_recipients, user;

  let input;
  let initialized;
  let focus = (i) => browser && i && tick().then(() => input && input.focus());
  $: focus(initialized);

  let loading;
  let list_price,
    royalty_value,
    start_date,
    end_date,
    start_time,
    end_time,
    auction_enabled,
    auction_underway,
    multi_royalty_recipients_enabled,
    royalty_recipients;

  let reserve_price;

  if (!edition.asking_asset) edition.asking_asset = btc;
  auction_enabled =
    auction_enabled ||
    compareAsc(parseISO(edition.auction_end), new Date()) === 1;

  let start, end;
  if (edition.auction_start) {
    start = parseISO(edition.auction_start);
    start_date = format(start, "yyyy-MM-dd");
    start_time = format(start, "HH:mm");
  }

  if (edition.auction_end) {
    end = parseISO(edition.auction_end);
    end_date = format(end, "yyyy-MM-dd");
    end_time = format(end, "HH:mm");
  }

  auction_underway =
    auction_enabled &&
    isWithinInterval(new Date(), {
      start,
      end,
    });

  if (default_royalty_recipients && default_royalty_recipients.length) {
    for (let index = 0; index < default_royalty_recipients.length; index++) {
      const { address, amount, name } = default_royalty_recipients[index];
      if (!edition.royalty_recipients.find((e) => e.address === address)) {
        edition.royalty_recipients.push({
          address,
          amount,
          name,
          type: royaltyRecipientSystemType,
        });
      }
    }
  }

  royalty_recipients = edition.royalty_recipients;

  if (!list_price && edition.list_price)
    list_price = val(edition.asking_asset, edition.list_price);
  if (!royalty_value)
    royalty_value = royalty_recipients.reduce(
      (a, b) => a + (b["amount"] || 0),
      0
    );
  multi_royalty_recipients_enabled = !!royalty_value;
  if (!reserve_price && edition.reserve_price)
    reserve_price = val(edition.asking_asset, edition.reserve_price);


  let submit = async (e) => {
    loading = true;

    try {
      e.preventDefault();

      await setupAuction();
      await spendPreviousSwap();
      await setupRoyalty();
      await setupSwaps();

      let {
        asking_asset,
        asset,
        auction_end,
        auction_release_tx,
        auction_start,
        auction_tx,
        bid_increment,
        extension_interval,
        held,
        list_price_tx,
        max_extensions,
      } = edition;

      if (!auction_start) auction_start = null;
      if (!auction_end) auction_end = null;

      await query(updateArtworkWithRoyaltyRecipients, {
        edition: {
          asking_asset,
          auction_end,
          auction_release_tx,
          auction_start,
          auction_tx,
          bid_increment,
          extension_interval,
          held,
          list_price: sats(edition.asking_asset, list_price),
          list_price_tx,
          max_extensions,
          reserve_price: sats(edition.asking_asset, reserve_price),
        },
        id: edition.id,
        royaltyRecipients: royalty_value
          ? royalty_recipients.map((item) => {
              delete item.id;
              item.edition_id = edition.id;
              item.asking_asset = edition.asking_asset;
              return item;
            })
          : [],
      });

      // api.url("/asset/register").post({ asset }).json().catch(console.log);

      goto(`/a/${edition.artwork.slug}/${edition.edition}`);
    } catch (e) {
      err(e);
      console.log(e);
    }
    loading = false;
  };

  let clearPrice = () => (list_price = undefined);

  $: listingCurrencies = edition.transferred_at
    ? Object.keys(tickers)
    : [...Object.keys(tickers), undefined];
</script>

<div class="container mx-auto md:p-20">
  <div class="w-full max-w-4xl mx-auto bg-white md:p-10 rounded-xl">
    <a class="block mb-6 text-midblue" href={`/a/${edition.artwork.slug}/${edition.edition}`}>
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back</div>
      </div>
    </a>

    <h2>List artwork</h2>

    {#if loading}
      <ProgressLinear />
    {:else}
      {#if auction_underway}
        <h4 class="mt-12">
          Listing cannot be updated while auction is underway
        </h4>
      {/if}

      <form class="w-full mb-6 mt-12" on:submit={submit} autocomplete="off">
        {#if edition.asking_asset}
          <Currency />
          <Price />
          <Auction />
          <Redeem />
        {/if}
        <div class="flex mt-10">
          <button type="submit" class="primary-btn">Submit</button>
        </div>
      </form>
    {/if}
  </div>
</div>

<style>
  .container {
    background-color: #ecf6f7;
    width: 100% !important;
    min-height: 100vh;
    margin: 0;
    max-width: 100%;
  }

  input {
    @apply rounded-lg mb-4 mt-2;
    &:disabled {
      @apply bg-gray-100;
    }
  }

  .tooltip {
    cursor: pointer;
  }
  .tooltip .tooltip-text {
    visibility: hidden;
    padding: 15px;
    position: absolute;
    z-index: 100;
    width: 300px;
    font-style: normal;
  }
  .tooltip:hover .tooltip-text {
    visibility: visible;
  }

  input[type="checkbox"]:checked {
    appearance: none;
    border: 5px solid #fff;
    outline: 2px solid #6ed8e0;
    background-color: #6ed8e0;
    padding: 2px;
    border-radius: 0;
  }

  input[type="radio"]:checked {
    appearance: none;
    border: 7px solid #6ed8e0;
    background-color: #fff;
    padding: 2px;
    border-radius: 100%;
  }

  @media only screen and (max-width: 768px) {
    .container {
      background: none;
    }
    .tooltip .tooltip-text {
      width: 100%;
      left: 0px;
      top: 30px;
    }
  }
</style>
