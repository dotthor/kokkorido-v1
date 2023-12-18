<script>
  import "../app.pcss";
  import { onMount } from "svelte";
  import { appStatus } from "$lib/stores";

  let isLoading = true;

  onMount(() => {
    const savedAppStatus = localStorage.getItem("appStatus");
    //console.log(savedAppStatus);
    if (savedAppStatus) {
      appStatus.initialize(JSON.parse(savedAppStatus));
    }
    console.log($appStatus);
    isLoading = false;
  });
</script>

<!-- safe area -->
<div class="h-[100dvh] w-[100dvw] flex items-center justify-center">
  {#if isLoading}
    <!-- <span class="text-9xl animate-spin text-center text-white">
      LOADING BABY
    </span> -->
    <img
      src="imgs/NOMESITOFIGO.png"
      alt="NOMESITOFIGO"
      class="h-14 animate-spin"
    />
  {:else}
    <slot />
  {/if}
</div>
