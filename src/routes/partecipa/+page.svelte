<script>
    import ActionDock from "../../lib/components/actionDock.svelte";
    import CstmInputField from "../../lib/components/cstmInputField.svelte";
    import { appStatus } from "$lib/stores";
    import { goto } from "$app/navigation";

    function setNick(f) {
        const formData = new FormData(f.target);
        const nickname = formData.get("nickname");
        console.log(nickname);
        appStatus.updateState({ nickname: nickname });

        goto("/scan");
    }
</script>

<div class="flex flex-col w-full h-full justify-between">
    <form
        on:submit|preventDefault={setNick}
        class="flex flex-col w-full items-center mt-6"
    >
        <CstmInputField name={"nickname"}></CstmInputField>
        <button>PROVA</button>
    </form>

    <div class="m-4">
        <ActionDock
            actionsSelected={["back", "confirm"]}
            confirmAction={"location.href='/scan'"}
        ></ActionDock>
    </div>
</div>
