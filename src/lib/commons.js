import { createWorker } from "tesseract.js";
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { appStatus, players } from '$lib/stores.js'
import { get } from 'svelte/store';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function startMultiplayer(multiplayerId) {
    const user = {
        user: get(appStatus).nickname,
        online_at: new Date().toISOString(),
        is_host: get(appStatus).iAmHost,
    };
    const multiplayer = supabase.channel(multiplayerId, {
        config: {
            broadcast: { self: true },
        },
    });

    multiplayer.subscribe();

    const presenceTrackStatus = await multiplayer.track(user);
    //console.log(presenceTrackStatus);

    return multiplayer;
}

export async function stopMultiplayer(multiplayer) {
    const presenceUntrackStatus = await multiplayer.untrack();
    //console.log(presenceUntrackStatus);
}



export async function doOcr(img) {

    /* if(cocorido) */const fixedImage = fixColorForOcr(img);

    const worker = await createWorker("ita");
    const ret = await worker.recognize(
        fixedImage,
    );

    console.log(ret.data.text);
    const message = ret.data.text.replace(/\n/g, " ");
    console.log(message);
    await worker.terminate();

    return message;
}

function fixColorForOcr(img) {

    let src = cv.imread(img);
    let dst = new cv.Mat();
    cv.threshold(src, dst, 177, 200, cv.THRESH_BINARY);
    cv.imshow(img, dst);

    //const fixedImage = canvas.toDataURL("image/png");
    //cv.imshow('canvasOutput', dst);

    //doOcr(data /* "/imgs/test-color-correction-3.jpg" */);
    src.delete();
    dst.delete();

    return img;
}