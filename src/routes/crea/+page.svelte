<script>
    import ActionDock from "../../lib/components/actionDock.svelte";
    import CstmInputField from "../../lib/components/cstmInputField.svelte";
    import { appStatus } from "$lib/stores";
    import { goto } from "$app/navigation";
    import QRCode from "qrcode";

    function createGame(f) {
        const formData = new FormData(f.target);
        const nickname = formData.get("nickname");
        const timer = formData.get("timer");
        /* const lobbyTempId = formData.get("lobbyTempId"); */
        const lobbyId = /* "lobby-" +  */ Math.floor(
            Math.random() * 10000000,
        ).toString();

        const qrData = JSON.stringify({
            lobbyId: lobbyId,
            hostNickname: nickname,
        });

        QRCode.toDataURL(qrData, {
            type: "image/png",
            margin: 1,
        })
            .then((result) => {
                console.log(result);
                appStatus.updateState({
                    nickname: `${nickname}#${Math.floor(
                        Math.random() * 100000,
                    ).toString()}`,
                    timer: timer,
                    lobbyId: lobbyId,
                    iAmHost: true,

                    qrcode: result,
                });
                goto("/lobby");
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function _doAction(event) {
        //console.log(event);
        const action = event.detail.action;
        switch (action) {
            case "confirm":
                console.log(action);
                document.getElementById("game-form").requestSubmit();
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
        id="game-form"
        on:submit|preventDefault={createGame}
        class="flex flex-col w-full items-center mt-6"
    >
        <CstmInputField name={"nickname"}></CstmInputField>
        <CstmInputField name={"timer"}></CstmInputField>
        <!-- <CstmInputField name={"lobbyTempId"}></CstmInputField> -->
    </form>

    <div class="m-4">
        <ActionDock
            actionsSelected={["back", "confirm"]}
            on:actionPressed={_doAction}
        ></ActionDock>
    </div>
</div>
