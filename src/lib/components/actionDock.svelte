<script>
    export let confirmAction = "";
    export let cancelAction = "";
    export let actionsSelected = [];

    const actionsAvailable = [
        { name: "back", icon: "arrow_back", cb: "history.back()" },
        { name: "forward", icon: "arrow_forward", cb: "history.forward()" },
        { name: "confirm", icon: "check", cb: confirmAction },
        { name: "cancel", icon: "close", cb: cancelAction },
    ];

    const actions = actionsAvailable.filter((obj) =>
        actionsSelected.includes(obj.name),
    );
</script>

<div class="bg-white rounded-[2.5rem] flex justify-evenly p-5 gap-6 w-full">
    {#each actions as action}
        <button
            type="button"
            class="flex justify-center items-center rounded-xl w-16 h-16 p-4 bg-yellow-400"
            on:click={() => eval(action.cb)}
        >
            <span
                class="material-symbols-outlined font-bold text-red-500 text-3xl"
            >
                {action.icon}
            </span>
        </button>
    {/each}
</div>
