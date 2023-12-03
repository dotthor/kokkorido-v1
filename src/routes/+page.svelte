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
                    height: "500",
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

    async function takepicture() {
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            //context.filter = "contrast(0.8)";
            context.drawImage(video, 0, 0, width, height);

            //const data = canvas.toDataURL("image/png");
            //photo.setAttribute("src", data);

            let src = cv.imread(canvas);
            let dst = new cv.Mat();
            //cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
            // You can try more different parameters
            /* cv.adaptiveThreshold(
                src,
                dst,
                200,
                cv.ADAPTIVE_THRESH_MEAN_C,
                cv.THRESH_BINARY,
                3,
                2,
            ); */
            cv.threshold(src, dst, 177, 200, cv.THRESH_BINARY);
            //context.drawImage(dst, 0, 0);
            cv.imshow(canvas, dst);

            const data = canvas.toDataURL("image/png");
            //cv.imshow('canvasOutput', dst);

            doOcr(data /* "/imgs/test-color-correction-3.jpg" */);
            src.delete();
            dst.delete();

            //await doOcr();
            //colorFix("/imgs/test-color-correction-2.jpg");
        } else {
            //clearphoto();
        }
    }

    async function doOcr(img) {
        const worker = await createWorker("ita");
        const ret = await worker.recognize(
            img,
            { rotateAuto: true },
            { imageColor: true, imageGrey: true, imageBinary: true },
        );
        /* document.getElementById("imgBinary").src = ret.data.imageBinary;
        document.getElementById("imgOriginal").src = ret.data.imageColor;
        document.getElementById("imgGrey").src = ret.data.imageGrey; */
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
        //doOcr("/imgs/test-color-correction.jpg");
    });
</script>

<!-- safe area -->
<div
    class="flex h-[100dvh] w-[100dvw] items-center justify-center flex-col gap-7 bg-teal-200"
>
    <!-- card -->
    <div
        class="flex flex-col rounded-3xl h-[70%] bg-teal-900 justify-between items-center card-ratio"
    >
        <div class="flex flex-col">
            <span class=" font-broadway text-white w-full p-6 text-center"
                >Coco Rido</span
            >

            {#if scanning}<video
                    class={scanning ? " w-full" : "hidden"}
                    id="video"
                    autoPlay={true}
                    playsInline={true}
                    muted={true}>Video stream not available.</video
                >{:else}
                <p
                    class="text-white text-2xl tracking-wider px-6 font-nunito"
                    contenteditable="true"
                >
                    {message}<!-- ____ accade ogni giorno sulla linea
                    regionale Roma - Viterbo -->
                </p>
                <!-- <input
                    type="text"
                    class="bg-teal-900 text-white text-3xl px-6"
                    bind:value={message}
                /> -->
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
<!-- <div class="column">
    <p>Rotated, Original Color</p>
    <img id="imgOriginal" style="max-width:500px;" />
</div>
<div class="column">
    <p>Rotated, Grey</p>
    <img id="imgGrey" style="max-width:500px;" />
</div>
<div class="column">
    <p>Rotated, Binary</p>
    <img id="imgBinary" style="max-width:500px;" />
</div> -->

<canvas id="canvas" class="hidden"> </canvas>

<!-- <canvas id="canvasOutput"></canvas> -->
<!-- <div class="output"> -->
<!-- <img
    id="photo"
    class=""
    src="/imgs/test-color-correction-2.jpg"
    alt="The screen capture will appear in this box."
/> -->
<!-- </div> -->
<style>
    .card-ratio {
        aspect-ratio: 55/86;
    }
</style>
