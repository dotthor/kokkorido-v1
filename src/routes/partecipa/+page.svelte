<script>
    import ActionDock from "../../lib/components/actionDock.svelte";
    import CstmInputField from "../../lib/components/cstmInputField.svelte";
    import { appStatus } from "$lib/stores";
    import { goto } from "$app/navigation";

    function setNick(f) {
        const formData = new FormData(f.target);
        const nickname = formData.get("nickname");
        const lobbyTempId = formData.get("lobbyTempId");
        console.log(nickname);

        appStatus.updateState({
            nickname: `${nickname}#${Math.floor(
                Math.random() * 100000,
            ).toString()}`,
            lobbyId: lobbyTempId,
        });
        goto("/scan");
        //goto("/lobby");
    }

    function _doAction(event) {
        //console.log(event);
        const action = event.detail.action;
        switch (action) {
            case "confirm":
                console.log(action);
                document.getElementById("nick-form").requestSubmit();
                break;
            case "cancel":
                console.log(action);
                break;
            default:
                break;
        }
    }
</script>

<div class="flex flex-col w-full h-full justify-between">
    <form
        id="nick-form"
        on:submit|preventDefault={setNick}
        class="flex flex-col w-full items-center mt-6"
    >
        <CstmInputField name={"nickname"}></CstmInputField>
        <CstmInputField name={"lobbyTempId"}></CstmInputField>
    </form>

    <div class="m-4">
        <ActionDock
            actionsSelected={["back", "confirm"]}
            on:actionPressed={_doAction}
        ></ActionDock>
    </div>
</div>
