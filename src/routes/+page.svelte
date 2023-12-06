<script>
    import { onMount } from "svelte";
    import CocoCard from "../lib/components/cocoCard.svelte";
    import DebugCocoCard from "../lib/components/debug_cocoCard.svelte";
</script>

<!-- safe area -->
<div
    class="flex h-[100dvh] w-[100dvw] items-center justify-center flex-col gap-7"
>
    <CocoCard></CocoCard>
    <!-- <DebugCocoCard></DebugCocoCard> -->
</div>
