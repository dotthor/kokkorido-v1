<script>
    import { appStatus, players, supabase } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";

    let playersInLobby = [];
    let lobby;

    onMount(async () => {
        //console.log($appStatus);
        lobby = supabase.channel($appStatus.lobbyId, {
            config: {
                broadcast: { self: true },
            },
        });

        lobby
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
            )
            .subscribe();

        const userStatus = {
            user: $appStatus.nickname,
            online_at: new Date().toISOString(),
            is_host: $appStatus.iAmHost,
        };

        const presenceTrackStatus = await lobby.track(userStatus);
        console.log(presenceTrackStatus);
    });

    onDestroy(async () => {
        const presenceUntrackStatus = await lobby.untrack();
        console.log(presenceUntrackStatus);
    });
</script>

<div class="flex flex-col border h-full w-full items-center">
    {#if $appStatus.iAmHost}
        <span class="text-center p-5 text-5xl font-bold text-white"
            >{$appStatus.nickname.split("#")[0]}</span
        >
        <img src={$appStatus.qrcode} class="w-1/2" alt="qr" />
        <hr class="w-5/6 h-px my-8 bg-white border-0" />
    {:else}
        <span class="text-center p-5 text-5xl font-bold text-white"
            >{$appStatus.nickname.split("#")[0]}'s game</span
        >
        <hr class="w-5/6 h-px mb-8 bg-white border-0" />
    {/if}

    <ul>
        {#each playersInLobby as player}
            <li>{player.user}</li>
        {/each}
    </ul>
    <button
        on:click={() => {
            lobby.send({
                type: "broadcast",
                event: "message",
                payload: {
                    message: "hello, world from " + $appStatus.nickname,
                },
            });
        }}>SEND</button
    >
</div>
