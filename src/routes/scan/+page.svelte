<script>
    import QrScanner from "qr-scanner";
    import { onMount } from "svelte";
    import ActionDock from "../../lib/components/actionDock.svelte";
    import { appStatus } from "$lib/stores";

    let scanResult = "";

    onMount(() => {
        let videoElem = document.getElementById("video");
        const qrScanner = new QrScanner(
            videoElem,
            (result) => {
                scanResult = result.data;
                qrScanner.stop();
            },
            {
                returnDetailedScanResult: true,
            },
        );
        qrScanner.start();
    });

    function _doAction(event) {
        const action = event.detail.action;

        if (action === "confirm") {
            console.log(scanResult);
        }
    }
</script>

<div class="flex flex-col w-full h-full justify-between">
    <span class="text-white text-3xl font-bold">{$appStatus.nickname}</span>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        class="border-4 border-red-600 w-5/6 rounded-3xl aspect-square object-cover"
        id="video"
    ></video>

    <div class="m-4">
        <ActionDock
            actionsSelected={["back", "confirm"]}
            on:actionPressed={_doAction}
        ></ActionDock>
    </div>
</div>
