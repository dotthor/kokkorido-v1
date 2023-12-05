{#if scanning}
    <!-- shutter -->
    <div
        class="flex items-center justify-center w-20 h-20 rounded-full px-1 bg-white"
    >
        <button
            on:click|preventDefault={takepicture}
            class=" w-16 h-16 rounded-full bg-white border border-black"
        ></button>
    </div>
{:else}
    <button
        on:click={() => {
            scanning = true;
            processing = false;
            console.log(scanning);
            console.log(processing);
        }}
    >
        <span class="material-symbols-outlined text-white font-bold text-5xl">
            replay
        </span>
    </button>
{/if}
