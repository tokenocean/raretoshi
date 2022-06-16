
            <div class="flex w-full sm:w-3/4 mb-4">
              <div class="relative mt-1 rounded-md w-2/3 mr-6">
                <div class="royalty-toggle">
                  <label class="inline-flex items-center">
                    <input
                      class="form-checkbox h-6 w-6 mt-3"
                      type="checkbox"
                      bind:checked={multi_royalty_recipients_enabled}
                      disabled={auction_underway}
                    />
                    <span class="ml-3 text-xl">Royalty Recipients</span>
                    <span class="tooltip">
                      <i class="ml-3 text-midblue text-xl tooltip">
                        <Fa icon={faQuestionCircle} pull="right" class="mt-1" />
                      </i>
                      <span
                        class="tooltip-text bg-gray-100 shadow ml-4 rounded"
                      >
                        Setting royalty recipients involves transferring the
                        artwork to a 2-of-2 multisig address with us. Our server
                        will co-sign on transfers if the buyer pays the
                        specified royalty to each recipient.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {#if multi_royalty_recipients_enabled}
              <div class="w-full ">
                <RoyaltyRecipientList
                  bind:items={royalty_recipients}
                  bind:royaltyValue={royalty_value}
                  maxTotalRate={100}
                  askingAsset={edition.asking_asset}
                  artist={edition.artist}
                />
              </div>
            {/if}
