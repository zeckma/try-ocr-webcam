document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const progress = document.querySelector('.progress');
    const output = document.getElementById('output');
    const imageContainer = document.getElementById('imageContainer');
    let videoStream;

    // Access webcam
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoStream = stream;
            const videoElement = document.createElement('video');
            videoElement.id = 'video';
            videoElement.autoplay = true;
            videoElement.srcObject = stream;
            // Hapus elemen video sebelumnya jika ada
            const existingVideo = document.getElementById('video');
            if (existingVideo) {
                existingVideo.remove();
            }
            imageContainer.appendChild(videoElement);
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Error accessing webcam. Please make sure you have granted permission.');
        }
    }

    // Initialize webcam when DOM content is loaded
    initCamera();

    // for start button
    startButton.addEventListener('click', () => {
        startOCR();
    });

    // Function to start OCR process
    function startOCR() {
        progress.innerText = 'Performing OCR...';

        // Capture frame from video
        const video = document.getElementById('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to URL
        const imgUrl = canvas.toDataURL();

        // Process captured frame
        processImage(imgUrl);
    }

    // Process the image with OCR
    function processImage(imgUrl) {
        Tesseract.recognize(
            imgUrl,
            'eng',
            { logger: progressUpdate }
        ).then(({ data: { text } }) => {
            output.value = text;
            progress.innerText = 'OCR Complete';
        }).catch((error) => {
            console.error('Error processing image:', error);
            progress.innerText = 'Error processing image';
        });
    }

    // Progress update function
    function progressUpdate(message) {
        if (message.status === 'recognizing text') {
            progress.innerText = `${message.status}: ${Math.round(message.progress * 100)}%`;
        } else {
            progress.innerText = message.status;
        }
    }
});
