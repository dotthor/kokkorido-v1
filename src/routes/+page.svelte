<script>
    import { onMount } from "svelte";
    import { createWorker, createScheduler } from "tesseract.js";

    let scanning = true;

    let _stream;

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    let message = "";
    const width = 320; // We will scale the photo width to this
    let height = 240; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false. 63.5 : 88 = 320 = x

    let streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;

    function startup() {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        startbutton = document.getElementById("startbutton");

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    height: "350",
                    width: "320",
                    facingMode: "environment",
                },
                audio: false,
            })
            .then((stream) => {
                video.srcObject = _stream = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener(
            "canplay",
            (ev) => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute("width", width);
                    video.setAttribute("height", height);
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            },
            false,
        );

        /* startbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
            },
            false,
        ); */

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        //photo.setAttribute("src", data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            doOcr(data);
            //photo.setAttribute("src", data);
        } else {
            //clearphoto();
        }
    }

    async function doOcr(img) {
        const worker = await createWorker("eng");
        const ret = await worker.recognize(img);
        console.log(ret.data.text);
        message = ret.data.text;
        await worker.terminate();
        scanning = false;
    }

    onMount(async () => {
        // Set up our event listener to run the startup process
        // once loading is complete.
        //window.addEventListener("load", startup, false);
        startup();
    });
</script>

<!-- safe area -->
<div
    class="flex h-[100dvh] w-[100dvw] items-center justify-center flex-col gap-7 bg-teal-200"
>
    <!-- card -->
    <div
        class="flex flex-col rounded-3xl h-[80%] w-[90%] bg-teal-900 justify-between items-center"
    >
        <div class="flex flex-col">
            <span class=" font-broadway text-white w-full p-6 text-center"
                >Coco Rido</span
            >
            <video
                class={scanning ? "" : "hidden"}
                id="video"
                autoPlay={true}
                playsInline={true}
                muted={true}>Video stream not available.</video
            >
            {#if scanning}{:else}
                <p class=" text-white text-3xl px-6">{message}</p>
            {/if}
        </div>
        <div class=" flex justify-between w-full p-8">
            <span class="material-symbols-outlined text-white"> nature </span>
            <span class="material-symbols-outlined text-white"> group </span>
        </div>
    </div>
    {#if scanning}
        <!-- shutter -->
        <div
            class="flex items-center justify-center w-20 h-20 rounded-full bg-white"
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
            }}
        >
            <span
                class="material-symbols-outlined text-white font-bold text-5xl"
            >
                replay
            </span>
        </button>
    {/if}
</div>

<canvas id="canvas" class="hidden"> </canvas>

<!-- <div class="output">
    <img id="photo" alt="The screen capture will appear in this box." />
</div> -->
