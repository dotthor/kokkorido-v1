<script>
    import { createEventDispatcher } from "svelte";

    export let icon = "";
    export let action = "";

    const dispatch = createEventDispatcher();

    function _actionPressed() {
        dispatch("actionPressed", { action: action });
    }
</script>

<button
    type="button"
    class="flex justify-center items-center rounded-xl w-16 h-16 p-4 bg-yellow-400"
    on:click={_actionPressed}
>
    <span class="material-symbols-outlined font-bold text-red-500 text-3xl">
        {icon}
    </span>
</button>
