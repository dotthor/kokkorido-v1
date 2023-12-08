<script>
    import CstmButton from "../lib/components/cstmButton.svelte";
</script>

<div class="flex flex-col h-full w-full items-center justify-evenly">
    <img src="imgs/NOMESITOFIGO.png" alt="NOMESITOFIGO" class="h-14" />
    <div class="flex flex-col gap-4">
        <CstmButton url={"crea"}></CstmButton>
        <CstmButton url={"partecipa"}></CstmButton>
    </div>
    <CstmButton url={"impostazioni"}></CstmButton>
</div>
