<script>
    import { appStatus, players } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";
    import ActionDock from "$lib/components/actionDock.svelte";
    import { startMultiplayer, stopMultiplayer } from "../../lib/commons";
    import { goto } from "$app/navigation";

    let playersInLobby = [];
    let lobby;
    let everyoneReady = false;
    let imReady = null;
    let domReady = false;

    $: if (imReady == true && domReady) {
        lobby.send({
            type: "broadcast",
            event: "ready",
            payload: {
                nickname: $appStatus.nickname,
                isReady: true,
            },
        });
    } else if (imReady == false && domReady) {
        lobby.send({
            type: "broadcast",
            event: "ready",
            payload: {
                nickname: $appStatus.nickname,
                isReady: false,
            },
        });
    }

    onMount(async () => {
        //console.log($appStatus);
        //console.log($players);
        lobby = await startMultiplayer($appStatus.lobbyId);

        lobby
            .on("presence", { event: "sync" }, () => {
                const newState = players.set(
                    Object.values(lobby.presenceState()).flat(),
                );
                lobby.send({
                    type: "broadcast",
                    event: "ready",
                    payload: {
                        nickname: $appStatus.nickname,
                        isReady: imReady,
                    },
                });
                //console.log($players);
            })
            .on("broadcast", { event: "message" }, (payload) =>
                console.log(payload.payload.message),
            )
            .on("broadcast", { event: "ready" }, (data) => {
                //console.log(Object.values(lobby.presenceState()).flat());
                //console.log(data.payload);
                updatePlayerReadyState($players, data.payload);
                checkEveryoneReady($players);
                //console.log($players);
            })
            .on("broadcast", { event: "countdown" }, (data) => {
                console.log(data);
                const countdownElement =
                    document.getElementById("gameStartCountDown");
                // Verifica se l'elemento del countdown esiste
                if (countdownElement) {
                    countdownElement.style.setProperty("--value", data.payload);
                }

                if (data.payload == 0) goto("/game");
            });

        //

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
        domReady = true;
    });

    onDestroy(async () => {
        /* const presenceUntrackStatus = await lobby.untrack(); */
        await stopMultiplayer(lobby);
        //console.log(presenceUntrackStatus);
    });

    function _doAction(event) {
        const action = event.detail.action;

        if (action === "confirm") {
            //console.log(scanResult);
            lobby.send({
                type: "broadcast",
                event: "ready",
                payload: {
                    nickname: $appStatus.nickname,
                    isReady: true,
                },
            });
        }
    }

    function _toggleReady(e) {
        console.dir(e);
        /* lobby.send({
                type: "broadcast",
                event: "ready",
                payload: {
                    nickname: $appStatus.nickname,
                    isReady: true,
                },
            }); */
    }

    // Funzione per verificare se tutti i giocatori sono pronti
    function checkEveryoneReady(plyrs) {
        // Verifica se tutti i giocatori sono pronti
        everyoneReady = plyrs.every((player) => player.isReady);
        if (everyoneReady && $appStatus.iAmHost) {
            _startCountDown_B(5);
        }
        //console.log(players);
        // Imposta la variabile "everyoneReady" al risultato della verifica
        //return everyoneReady;
    }

    function updatePlayerReadyState(plyrs, playerReady) {
        // Trova l'indice del giocatore corrispondente al nickname nel nuovo oggetto
        const playerIndex = plyrs.findIndex(
            (player) => player.user === playerReady.nickname,
        );

        // Se il giocatore è presente nell'array
        if (playerIndex !== -1) {
            // Aggiorna lo stato del giocatore a "pronto"
            plyrs[playerIndex].isReady = playerReady.isReady;
            players.set(plyrs);
        } else {
            // Il giocatore non è presente nell'array, gestire l'errore se necessario
            //console.log(players);
            console.error("Giocatore non trovato nell'array.");
        }
    }

    function _startCountDown(seconds) {
        const countdownElement = document.getElementById("gameStartCountDown");
        // Verifica se l'elemento del countdown esiste
        if (countdownElement) {
            countdownElement.style.setProperty("--value", seconds);

            let remainingSeconds = seconds;

            // Funzione per aggiornare il countdown ogni secondo
            const updateCountdown = () => {
                // Verifica se tutti sono pronti
                if (!everyoneReady) {
                    // Se la variabile diventa false, interrompi il setInterval
                    clearInterval(countdownInterval);
                    console.log("Countdown annullato: non tutti sono pronti.");
                } else {
                    // Aggiorna il countdown
                    countdownElement.style.setProperty(
                        "--value",
                        remainingSeconds,
                    );

                    // Riduci il numero di secondi rimanenti
                    remainingSeconds--;

                    // Se il countdown raggiunge 0, interrompi il setInterval
                    if (remainingSeconds < 0) {
                        clearInterval(countdownInterval);
                        console.log("Countdown terminato: vai al gioco.");
                    }
                }
            };

            // Avvia l'aggiornamento del countdown ogni secondo
            const countdownInterval = setInterval(updateCountdown, 1000);
        } else {
            console.error("Elemento del countdown non trovato.");
        }
    }
    function _startCountDown_B(seconds) {
        let remainingSeconds = seconds;

        // Funzione per aggiornare il countdown ogni secondo
        const updateCountdown = () => {
            // Verifica se tutti sono pronti
            if (!everyoneReady) {
                // Se la variabile diventa false, interrompi il setInterval
                clearInterval(countdownInterval);
                console.log("Countdown annullato: non tutti sono pronti.");
            } else {
                // Aggiorna il countdown
                lobby.send({
                    type: "broadcast",
                    event: "countdown",
                    payload: remainingSeconds,
                });

                // Riduci il numero di secondi rimanenti
                remainingSeconds--;

                // Se il countdown raggiunge 0, interrompi il setInterval
                if (remainingSeconds < 0) {
                    clearInterval(countdownInterval);
                    console.log("Countdown terminato: vai al gioco.");
                }
            }
        };

        // Avvia l'aggiornamento del countdown ogni secondo
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
</script>

<div class="flex flex-col size-full items-center">
    <!-- {#if everyoneReady} -->
    <span class="countdown font-mono text-6xl {everyoneReady ? '' : 'hidden'}">
        <span id="gameStartCountDown" style="--value:5;"></span>
    </span>
    <!-- {/if} -->
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
                    class="material-symbols-outlined font-bold {player.isReady
                        ? 'text-green-500'
                        : 'text-gray-500'} text-5xl">person</span
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
        <input
            bind:checked={imReady}
            type="checkbox"
            class="toggle toggle-success"
        />
    </div>
</div>
