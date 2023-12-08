<script>
    export let url = "#";
    export let bgColor = "bg-yellow-400";
    export let textColor = "text-red-500";
    export let text = "";
</script>

<a href="/{url}">
    <button type="button" class="{bgColor} {textColor} rounded-2xl p-4 w-full">
        <span class="font-nunito font-bold text-3xl">
            {text ? text : url.charAt(0).toUpperCase() + url.slice(1)}
        </span>
    </button>
</a>
