
        <div class="flex flex-col mt-4">
          <p>Listing currency</p>
          <div class="flex flex-wrap">
            {#each listingCurrencies as c}
              <label for={c} class="ml-2 mr-6 flex items-center">
                <input
                  id={c}
                  class="form-radio h-6 w-6 mt-4 mr-2"
                  type="radio"
                  name={c}
                  value={c}
                  bind:group={edition.asking_asset}
                  on:change={clearPrice}
                  disabled={auction_underway}
                />
                <p class="mb-2 whitespace-nowrap">
                  {c ? ticker(c) : "Unlisted"}
                </p>
              </label>
            {/each}
          </div>
        </div>
