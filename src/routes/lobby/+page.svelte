<script>
    import { appStatus, supabase } from "$lib/stores";
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
                console.log("sync", newState);
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
        };

        const presenceTrackStatus = await lobby.track(userStatus);
        //console.log(presenceTrackStatus);
    });

    onDestroy(async () => {
        const presenceUntrackStatus = await lobby.untrack();
        //console.log(presenceUntrackStatus)
    });
</script>

<!-- <h1>{$appStatus.nickname}</h1>
<h1>{$appStatus.timer}</h1> -->

{#if $appStatus.iAmHost}
    <img src={$appStatus.qrcode} class="w-1/2" alt="qr" />
    <hr />
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
            payload: { message: "hello, world from " + $appStatus.nickname },
        });
    }}>SEND</button
>

<!-- 
<button on:click={test123}>-------------------------</button> -->
<form method="post" action="?/qrGen"></form>
