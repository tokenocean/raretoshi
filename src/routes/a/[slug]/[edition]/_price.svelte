          {#if !edition.redeem_code}
            <div class="flex w-full sm:w-3/4 mb-4">
              <div class="relative mt-1 rounded-md w-2/3 mr-6">
                <label for="price"
                  >Price
                  <span class="tooltip">
                    <i class="text-midblue text-xl tooltip">
                      <Fa icon={faQuestionCircle} pull="right" class="mt-1" />
                    </i>
                    <span class="tooltip-text bg-gray-100 shadow ml-4 rounded">
                      Setting a price is optional. If you set one, your wallet
                      will generate a partially signed atomic swap transaction.
                      If you run an auction, this price will be the "buy it now"
                      or buyout price that lets people skip the bidding process
                      and immediately purchase the artwork.
                      <br /><br />
                      Changing the price involves sending an on-chain cancellation
                      transaction to invalidate your half of the atomic swap transaction
                      and will incur a transaction fee.
                    </span>
                  </span></label
                >
                <input
                  id="price"
                  class="form-input block w-full pl-7 pr-12"
                  placeholder={val(edition.asking_asset, 0)}
                  bind:value={list_price}
                  bind:this={input}
                  disabled={auction_underway}
                />
                <div
                  class="absolute inset-y-0 right-0 flex items-center mr-2 mt-4"
                >
                  {ticker(edition.asking_asset)}
                </div>
              </div>
            </div>
          {/if}
