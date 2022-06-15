<script>
  import RoyaltyRecipient from "$components/RoyaltyRecipient.svelte";
  import Fa from "svelte-fa";
  import {
    faChevronUp,
    faChevronDown,
  } from "@fortawesome/free-solid-svg-icons";
  export let edition;
  let show;
</script>

{#if edition.royalty_recipients.length}
  <div class="mb-6">
    <div class="text-xs cursor-pointer mb-2" on:click={() => (show = !show)}>
      <div class="flex">
        <img src="/royalties.svg" class="w-8" alt="Royalties" />
        <div class="my-auto">Royalties</div>
        <div class="my-auto ml-1">
          <Fa icon={show ? faChevronUp : faChevronDown} />
        </div>
      </div>
    </div>
    {#if show}
      <ul>
        {#each edition.royalty_recipients as recipient}
          <RoyaltyRecipient
            editable={false}
            askingAsset={edition.asking_asset}
            {recipient}
          />
        {/each}
      </ul>
    {/if}
  </div>
{/if}
