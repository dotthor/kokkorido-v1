import { createWorker } from "tesseract.js";

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