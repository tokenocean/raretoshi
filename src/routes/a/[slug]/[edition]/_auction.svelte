<div class="auction-toggle">
  <label for="auction" class="inline-flex items-center">
    <input
      id="auction"
      class="form-checkbox h-6 w-6 mt-3"
      type="checkbox"
      bind:checked={auction_enabled}
      disabled={auction_underway}
    />
    <span class="ml-3 text-xl">Create an auction</span>
  </label>
</div>
{#if auction_enabled}
  <div class="aution-container">
    <div class="flex auction justify-between flex-wrap">
      <div class="flex flex-col">
        <h4 class="mb-4">Auction start</h4>
        <div class="flex justify-between">
          <div class="flex flex-col mb-4 mr-6">
            <label for="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              bind:value={start_date}
              disabled={auction_underway}
            />
          </div>
          <div class="flex flex-col mb-4">
            <label for="time">Time</label>
            <input
              id="time"
              type="time"
              name="time"
              bind:value={start_time}
              disabled={auction_underway}
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <h4 class="mb-4">Auction end</h4>
        <div class="flex justify-between">
          <div class="flex flex-col mb-4 mr-6">
            <label for="date">Date</label>
            <input
              type="date"
              name="date"
              bind:value={end_date}
              disabled={auction_underway}
            />
          </div>
          <div class="flex flex-col mb-4">
            <label for="time">Time</label>
            <input
              type="time"
              name="time"
              bind:value={end_time}
              disabled={auction_underway}
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-4">
      <div>
        <div class="mt-1 relative w-1/2 xl:w-1/3 rounded-md shadow-sm">
          <label>
            Reserve price
            <span class="tooltip">
              <i class="ml-3 text-midblue text-xl tooltip">
                <Fa icon={faQuestionCircle} pull="right" class="mt-1" />
              </i>
              <span class="tooltip-text bg-gray-100 shadow ml-4 rounded">
                Reserve price is the minimum price that you'll accept for the
                artwork. Setting one is optional.
              </span>
            </span>
            <input
              class="form-input block w-full pl-7 pr-12"
              placeholder="0"
              bind:value={reserve_price}
              disabled={auction_underway}
            />
            <div class="absolute inset-y-0 right-0 flex items-center mr-2 mt-8">
              {ticker(edition.asking_asset)}
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
{/if}
