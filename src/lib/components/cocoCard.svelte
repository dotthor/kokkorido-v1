<script>
    import { onMount } from "svelte";
    import { doOcr } from "$lib/commons.js";
    let scanning = true;
    let processing = false;
    let streaming = false;

    let postProcessing = false;

    let phrase = "";

    const width = 320;
    let height = 0;

    let video = null;
    let canvas = null;

    let splittedPhrase = null;

    function splittaStringaConUnderscores(input) {
        // Utilizziamo una regex per trovare due o più underscore consecutivi
        const regex = /_+/;

        // Splittiamo la stringa usando la regex come delimitatore
        const risultato = input.split(regex);

        // Rimuoviamo eventuali elementi vuoti nell'array risultante
        const risultatoFinale = risultato.flatMap((str, index, array) => {
            // Aggiungi #BLANK# all'inizio se la stringa iniziale è vuota
            if (index === 0 && str.trim() === "") {
                return ["#BLANK#"];
            }

            // Aggiungi solo se la stringa non è vuota
            if (str.trim() !== "") {
                // Aggiungi anche #BLANK# se non è l'ultimo elemento dell'array
                if (index < array.length - 1) {
                    return [str, "#BLANK#"];
                } else {
                    return [str];
                }
            }
            return []; // Altrimenti, non aggiungere nulla
        });

        return risultatoFinale;
    }

    // Esempio di utilizzo
    const inputString = "___ abc __ def ___ ghi ____";
    const risultatoArray = splittaStringaConUnderscores(inputString);
    console.log(risultatoArray);

    function splitAndReplaceBlanks(input) {
        const result = [];
        const blankToken = "#BLANK#";
        let currentSegment = "";
        let insideBlank = false;

        for (let i = 0; i < input.length; i++) {
            if (input[i] === "_" && input[i + 1] === "_") {
                // Trovato un blank, aggiungi il segmento corrente all'array e aggiungi il token blank
                if (currentSegment.trim() !== "") {
                    result.push(currentSegment.trim());
                }
                if (!insideBlank) {
                    result.push(blankToken);
                    insideBlank = true;
                }
                currentSegment = "";
                i++; // Salta il secondo carattere del blank
            } else {
                // Continua a costruire il segmento corrente
                currentSegment += input[i];
                insideBlank = false;
            }
        }

        // Aggiungi l'ultimo segmento non vuoto all'array
        if (currentSegment.trim() !== "") {
            result.push(currentSegment.trim());
        }

        return result;
    }

    function processBlanks() {
        splittedPhrase = splittaStringaConUnderscores(phrase);
        /* splittedPhrase = splitAndReplaceBlanks(phrase); */
        console.log(splittedPhrase);
    }

    function splittaStringaConUnderscore(input) {
        // Utilizziamo una regex per trovare due o più underscore consecutivi
        const regex = /_+/;

        // Splittiamo la stringa usando la regex come delimitatore
        const risultato = input.split(regex);

        // Rimuoviamo eventuali elementi vuoti nell'array risultante
        const risultatoFinale = risultato.filter((str) => str.trim() !== "");

        return risultatoFinale;
    }

    function showCameraFeed() {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            streaming = true;
        }
    }

    function startup() {
        video = document.getElementById("video");
        canvas = document.createElement("canvas");

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    height: "500",
                    width: "320",
                    facingMode: "environment",
                    zoom: "1.5",
                    // TODO: metto di default 1 ma poi aggiungere nei settings un modo per regolare in caso si faccia fatica a mettere a fuoco
                },
                audio: false,
            })
            .then((stream) => {
                /* console.log(stream.getVideoTracks());
                console.log(stream.getVideoTracks()[0].getCapabilities()); */
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });
    }

    async function scanCard() {
        processing = true;
        scanning = false;
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        context.drawImage(video, 0, 0, width, height);
        phrase = await doOcr(canvas);
        console.dir(splittaStringaConUnderscore(phrase));

        processing = false;
    }

    onMount(async () => {
        startup();
    });
</script>

<div
    class="flex flex-col rounded-3xl w-[85%] bg-teal-900 justify-between items-center card-ratio"
>
    <!-- card -->
    <div class="flex flex-col w-full">
        <span class=" font-broadway text-white w-full p-6 text-center"
            >Coco Rido</span
        >

        <video
            on:canplay={showCameraFeed}
            class={scanning ? "w-full px-1" : "hidden"}
            id="video"
            autoPlay={true}
            playsInline={true}
            muted={true}>Video stream not available.</video
        >

        {#if processing}
            <div class="animate-pulse flex space-x-4 w-full px-7">
                <div class="flex-1 space-y-6 py-1">
                    <div class="space-y-3 flex flex-col gap-2">
                        <div class="grid grid-cols-12 gap-2">
                            <div
                                class="h-3 bg-white rounded-full col-span-1"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-1"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-3"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-5"
                            ></div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-4"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-1"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-3"
                            ></div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <div
                                class="h-3 bg-white rounded-full col-span-5"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-1"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-1"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-3"
                            ></div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-3"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-3"
                            ></div>
                            <div
                                class="h-3 bg-white rounded-full col-span-2"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        {:else if !scanning && !postProcessing}
            <p
                class="text-white text-2xl tracking-[0.07rem] px-6 font-nunito"
                contenteditable="true"
            >
                {phrase}<!-- ____ accade ogni giorno sulla linea
                    regionale Roma - Viterbo -->
            </p>
        {:else if !scanning}
            <p class="text-white text-2xl tracking-[0.07rem] px-5 font-nunito">
                {#each splittedPhrase as phrasePiece}
                    <!-- {index} -->
                    {#if phrasePiece === "#BLANK#"}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            on:keypress={(e) => {
                                if (e.code === "Enter") e.preventDefault();
                                console.log(e);
                            }}
                            contenteditable
                            class="text-yellow-500 border-b border-yellow-500 h-7 min-w-[3rem] animate-pulse inline-block"
                        ></div>
                    {:else}
                        {phrasePiece}
                    {/if}
                {/each}
            </p>
        {/if}
    </div>
    <!-- action button -->
    <div class="pb-4">
        {#if scanning}
            <div
                class="flex items-center justify-center w-20 h-20 rounded-full px-1 bg-white"
            >
                <button
                    on:click|preventDefault={scanCard}
                    class=" w-16 h-16 rounded-full bg-white border border-black"
                ></button>
            </div>
        {:else}
            <div class="flex gap-3">
                <button
                    class=""
                    on:click={() => {
                        scanning = true;
                        processing = false;
                    }}
                >
                    <span
                        class="material-symbols-outlined text-white font-bold text-5xl"
                    >
                        replay
                    </span>
                </button>
                <button
                    class=""
                    on:click={() => {
                        processing = false;
                        postProcessing = true;

                        processBlanks();
                    }}
                >
                    <span
                        class="material-symbols-outlined text-white font-bold text-5xl"
                    >
                        done
                    </span>
                </button>
            </div>
        {/if}
    </div>
</div>

<!-- <canvas id="canvas" class="hidden"> </canvas> -->

<style>
    .card-ratio {
        aspect-ratio: 55/86;
    }
</style>
