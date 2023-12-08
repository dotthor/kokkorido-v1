<script>
    export let name,
        type = "text";
</script>

<div class="mb-4 flex flex-col w-full px-4">
    <label class="text-3xl font-bold text-white" for={name}>{name}</label>
    <input id={name} {type} {name} class="h-10" />
</div>
