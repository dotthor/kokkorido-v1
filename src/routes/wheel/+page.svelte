<script>
    import { flip } from "svelte/animate";
    import { fade, fly, slide } from "svelte/transition";
    let visible = true;
    let winner = null;

    const giocatori = [
        "Benny",
        "Leti",
        "Fede",
        "Erica",
        "Riky",
        "Sofia",
        "Samuel",
        "Edo",
        "Patrick",
    ];
    function indiceDa0aN(n) {
        // Genera un numero casuale compreso tra 0 (incluso) e 1 (escluso)
        var numeroCasuale = Math.random();

        // Moltiplica per il numero totale di partecipanti e arrotonda all'intero più vicino
        var indicePartecipante = Math.floor(numeroCasuale * n);

        // Restituisci l'indice del partecipante selezionato casualmente
        return indicePartecipante;
    }
    function estraiGiocatore(giocatori) {
        // Genera un numero casuale compreso tra 0 (incluso) e 1 (escluso)
        var numeroCasuale = Math.random();

        // Moltiplica per il numero totale di partecipanti e arrotonda all'intero più vicino
        var indicePartecipante = Math.floor(numeroCasuale * giocatori.length);

        // Restituisci l'indice del partecipante selezionato casualmente
        return giocatori[indicePartecipante];
    }
</script>

<div class="flex flex-col w-1/2 h-1/2">
    <button class="btn" on:click={() => (winner = estraiGiocatore(giocatori))}
        >ESTRAI</button
    >
    {#if winner}
        <span class="text-3xl">{winner}</span>
    {/if}

    <label>
        <input type="checkbox" bind:checked={visible} />
        visible
    </label>

    {#if visible}
        <p transition:slide>Fades in and out</p>
    {/if}
</div>
