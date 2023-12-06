<script>
    function splittaStringaConUnderscore(input) {
        // Utilizziamo una regex per trovare due o più underscore consecutivi
        const regex = /_+/;

        // Splittiamo la stringa usando la regex come delimitatore
        const risultato = input.split(regex);

        // Rimuoviamo eventuali elementi vuoti nell'array risultante
        const risultatoFinale = risultato.filter((str) => str.trim() !== "");
        console.log(risultatoFinale);
        return risultatoFinale;
    }
    const splittedPhrase = splittaStringaConUnderscore(
        "Ho raccolto le mie forze per ____, un'ultima volta",
    );
</script>

<div
    class="flex flex-col rounded-3xl w-[85%] bg-teal-900 justify-between items-center card-ratio"
>
    <!-- card -->
    <div class="flex flex-col w-full">
        <span class=" font-broadway text-white w-full p-6 text-center"
            >Coco Rido</span
        >
        <p class="text-white text-2xl tracking-[0.07rem] px-5 font-nunito">
            {#each splittedPhrase as phrasePiece, index}
                {phrasePiece}
                <!-- {index} -->
                {#if index + 1 < splittedPhrase.length}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        on:keypress={(e) => {
                            if (e.code === "Enter") e.preventDefault();
                            console.log(e);
                        }}
                        contenteditable
                        class="text-yellow-500 border-b border-yellow-500 h-7 min-w-[3rem] animate-pulse inline-block"
                    ></div>
                {/if}
            {/each}
        </p>
    </div>
</div>

<style>
    .card-ratio {
        aspect-ratio: 55/86;
    }
</style>
