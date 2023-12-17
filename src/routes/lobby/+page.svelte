<script>
    import { appStatus, supabase } from "$lib/stores";
    import { onMount } from "svelte";

    onMount(async () => {
        const roomOne = supabase.channel($appStatus.lobbyId);

        roomOne
            .on("presence", { event: "sync" }, () => {
                const newState = roomOne.presenceState();
                console.log("sync", newState);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                console.log("join", key, newPresences);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                console.log("leave", key, leftPresences);
            })
            .subscribe();

        const userStatus = {
            user: "user-" + Math.floor(Math.random() * 100000).toString(),
            online_at: new Date().toISOString(),
        };

        const presenceTrackStatus = await roomOne.track(userStatus);
        console.log(presenceTrackStatus);
    });
</script>

<h1>{$appStatus.nickname}</h1>
<h1>{$appStatus.timer}</h1>
<!-- 
<button on:click={test123}>-------------------------</button> -->
<form method="post" action="?/qrGen"></form>
