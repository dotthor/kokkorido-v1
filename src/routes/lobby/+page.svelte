<script>
    import { appStatus, players } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";
    import ActionDock from "$lib/components/actionDock.svelte";
    import { startMultiplayer, stopMultiplayer } from "../../lib/commons";

    let playersInLobby = [];
    let lobby;

    onMount(async () => {
        //console.log($appStatus);

        lobby = await startMultiplayer($appStatus.lobbyId);

        lobby
            .on("presence", { event: "sync" }, () => {
                const newState = players.set(
                    Object.values(lobby.presenceState()).flat(),
                );

                console.log($players);
            })
            .on("broadcast", { event: "message" }, (payload) =>
                console.log(payload.payload.message),
            );

        /* .on("presence", { event: "sync" }, () => {
                const newState = lobby.presenceState();
                playersInLobby = Object.values(newState).flat();
                players.set(playersInLobby);
                console.log("sync", newState);
                console.log($players);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                console.log("join", key, newPresences);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                console.log("leave", key, leftPresences);
            }) */

        /*   lobby
            .on("presence", { event: "sync" }, () => {
                const newState = lobby.presenceState();
                playersInLobby = Object.values(newState).flat();
                players.set(playersInLobby);
                console.log("sync", newState);
                console.log($players);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                console.log("join", key, newPresences);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                console.log("leave", key, leftPresences);
            })
            .on("broadcast", { event: "message" }, (payload) =>
                console.log(payload.payload.message),
            ); */

        /* const userStatus = {
            user: $appStatus.nickname,
            online_at: new Date().toISOString(),
            is_host: $appStatus.iAmHost,
        }; */

        /* const presenceTrackStatus = await lobby.track(userStatus); */
        //console.log(presenceTrackStatus);
    });

    onDestroy(async () => {
        /* const presenceUntrackStatus = await lobby.untrack(); */
        await stopMultiplayer(lobby);
        //console.log(presenceUntrackStatus);
    });

    function _doAction(event) {
        const action = event.detail.action;

        if (action === "confirm") {
            console.log(scanResult);
        }
    }
</script>

<div class="flex flex-col size-full items-center">
    {#if $appStatus.iAmHost}
        <span class="text-center p-5 text-5xl font-bold text-white"
            >{$appStatus.nickname.split("#")[0]}</span
        >
        <img src={$appStatus.qrcode} class="w-1/2" alt="qr" />
        <hr class="w-5/6 h-px my-8 bg-white border-0" />
    {:else}
        <span class="text-center p-5 text-5xl font-bold text-white"
            >{$appStatus.hostNickname.split("#")[0]}'s game</span
        >
        <hr class="w-5/6 h-px mb-8 bg-white border-0" />
    {/if}
    <span class="text-center text-3xl mb-4 font-bold text-white"
        >{$players.length} giocatori</span
    >
    <div
        class="border-4 rounded-3xl h-1/2 w-5/6 flex flex-col bg-slate-300 overflow-scroll"
    >
        {#each $players as player}
            <div class="flex border mx-6 gap-5 items-center">
                <span
                    class="material-symbols-outlined font-bold text-green-500 text-5xl"
                    >person</span
                >
                <span class="text-2xl font-bold"
                    >{player.user.split("#")[0]}
                    {player.user == $appStatus.nickname ? "(you)" : ""}</span
                >
            </div>
        {/each}
        <!-- <button
            on:click={() => {
                lobby.send({
                    type: "broadcast",
                    event: "message",
                    payload: {
                        message: "hello, world from " + $appStatus.nickname,
                    },
                });
            }}>SEND</button
        > -->
    </div>

    <div class="m-4">
        <ActionDock
            actionsSelected={["back", "confirm"]}
            on:actionPressed={_doAction}
        ></ActionDock>
    </div>
</div>
