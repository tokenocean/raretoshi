<script>
  import { Avatar } from "$comp";
  export let editions;
</script>

<div class="container mx-auto mt-10 md:mt-20">
  <h2 class="mb-10">Editions</h2>

  <table class="table-fixed w-full">
    <thead>
      <tr class="border-b">
        <th scope="col" class="py-3 px-6 text-left text-md">Number</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Owner</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Minted</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Price</th>
        <th scope="col" class="py-3 px-6 text-left text-md">Action</th>
      </tr>
    </thead>
    <tbody>
      {#each editions as edition}
        <tr>
          <td class="py-4 pr-6 text-sm ">
            {edition.edition}
          </td>
          <td class="py-4 px-6 text-sm ">
            <div class="flex">
              <div class="pr-1">
                <Avatar size="xs" user={edition.owner} />
              </div>
              <a
                href={`/${edition.owner.username}`}
                class="secondary-color py-3">@{edition.owner.username}</a
              >
            </div>
          </td>
          <td class="py-4 px-6 text-sm "> yes </td>
          <td class="py-4 px-6 text-sm "> yes </td>
          <td class="py-4 pl-6 text-sm ">
            <a href="/" class="rounded-full bg-primary px-4 py-2"> Delete </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
