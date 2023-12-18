<script>
    import CstmButton from "../lib/components/cstmButton.svelte";
    import { appStatus } from "$lib/stores.js";
    /* import { onMount } from "svelte";

    onMount(() => {
        const savedAppStatus = localStorage.getItem("appStatus");
        console.log(savedAppStatus);
        if (savedAppStatus) {
            appStatus.initialize(JSON.parse(savedAppStatus));
        }
    }); */
</script>

<div class="flex flex-col h-full w-full items-center justify-evenly">
    <img src="imgs/NOMESITOFIGO.png" alt="NOMESITOFIGO" class="h-14" />

    <div class="flex flex-col gap-4">
        <CstmButton url={"crea"}></CstmButton>
        <CstmButton url={"partecipa"}></CstmButton>
    </div>
    <CstmButton url={"impostazioni"}></CstmButton>
    <h1>{$appStatus.nickname}</h1>
    <h1>{$appStatus.timer}</h1>
</div>
