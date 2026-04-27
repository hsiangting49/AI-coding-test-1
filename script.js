const colors = [
  { name: "Red", value: "#DC3C3C", rgb: [220, 60, 60] },
  { name: "Orange", value: "#F09632", rgb: [240, 150, 50] },
  { name: "Yellow", value: "#F0DC50", rgb: [240, 220, 80] },
  { name: "Green", value: "#50A05A", rgb: [80, 160, 90] },
  { name: "Blue", value: "#4682DC", rgb: [70, 130, 220] },
  { name: "Purple", value: "#965AC8", rgb: [150, 90, 200] },
  { name: "Pink", value: "#EBC9C9", rgb: [235, 201, 201] }
];

let todayColor = null;
let isColorLocked = false;
let uploadedPhotos = [];
let photoResults = [];
const maxPhotos = 3;

const generateBtn = document.getElementById("generateBtn");

const pickedColorCard = document.getElementById("pickedColorCard");
const colorCodeText = document.getElementById("colorCodeText");

const photoInput = document.getElementById("photoInput");
const photoInputUpload = document.getElementById("photoInputUpload");

const photoPreview = document.getElementById("photoPreview");
const mainUploadPhoto = document.getElementById("mainUploadPhoto");

const creditText = document.getElementById("creditText");
const uploadCreditText = document.getElementById("uploadCreditText");
const uploadStatusText = document.getElementById("uploadStatusText");
const uploadLabelBtn = document.getElementById("uploadLabelBtn");
const uploadLabelText = document.getElementById("uploadLabelText");
const revealBtn = document.getElementById("revealBtn");
const uploadScreen = document.getElementById("uploadScreen");

const smallColorCard = document.getElementById("smallColorCard");
const uploadColorCodeText = document.getElementById("uploadColorCodeText");

const resultColorCard = document.getElementById("resultColorCard");
const resultColorCodeText = document.getElementById("resultColorCodeText");
const resultPhotoStrip = document.getElementById("resultPhotoStrip");
const resultTitle = document.getElementById("resultTitle");
const bestMatchText = document.getElementById("bestMatchText");
const resultSummary = document.getElementById("resultSummary");
const restartBtn = document.getElementById("restartBtn");

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  const nextScreen = document.getElementById(screenId);

  screens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("screen-enter", "screen-visible");
  });

  nextScreen.classList.remove("hidden");
  nextScreen.classList.add("screen-enter");

  requestAnimationFrame(() => {
    nextScreen.classList.add("screen-visible");
  });

  setTimeout(() => {
    nextScreen.classList.remove("screen-enter", "screen-visible");
  }, 280);
}

function renderUploadSlots() {
  photoPreview.innerHTML = "";
  photoPreview.classList.remove("hidden");
  mainUploadPhoto.classList.remove("complete-stack");

  if (photoResults.length === maxPhotos) {
    const centerPhoto = photoResults[photoResults.length - 1];
    const sidePhotos = photoResults.slice(0, photoResults.length - 1);

    photoPreview.classList.add("hidden");
    mainUploadPhoto.classList.add("complete-stack");
    mainUploadPhoto.innerHTML = "";

    sidePhotos.forEach((photo, index) => {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = "Uploaded photo";
      img.classList.add(
        "stack-photo",
        index === 0 ? "stack-photo-left" : "stack-photo-right"
      );
      mainUploadPhoto.appendChild(img);
    });

    const centerImg = document.createElement("img");
    centerImg.src = centerPhoto.src;
    centerImg.alt = "Latest uploaded photo";
    centerImg.classList.add("stack-photo", "stack-photo-center");
    mainUploadPhoto.appendChild(centerImg);
    return;
  }

  for (let i = 0; i < maxPhotos; i++) {
    const photoCard = document.createElement("div");
    photoCard.classList.add("photo-card");

    if (photoResults[i]) {
      const img = document.createElement("img");
      img.src = photoResults[i].src;
      photoCard.appendChild(img);
    } else {
      photoCard.classList.add("empty-slot");
    }

    photoPreview.appendChild(photoCard);
  }

  if (photoResults.length > 0) {
    mainUploadPhoto.innerHTML = `<img src="${photoResults[photoResults.length - 1].src}" alt="Latest uploaded photo" />`;
  } else {
    mainUploadPhoto.innerHTML = "";
  }
}

function updateCreditText() {
  const remaining = maxPhotos - photoResults.length;

  if (remaining === 0) {
    creditText.textContent = `You have uploaded ${maxPhotos} photos`;
    uploadCreditText.textContent = `You have uploaded ${maxPhotos} photos`;
    uploadStatusText.textContent = "";
    uploadScreen.classList.add("upload-complete");
    uploadLabelBtn.classList.add("hidden");
    uploadLabelText.classList.add("hidden");
    revealBtn.classList.remove("hidden");
    return;
  }

  const text = `${remaining} left`;

  uploadScreen.classList.remove("upload-complete");
  creditText.textContent = text;
  uploadCreditText.textContent = text;
}

generateBtn.addEventListener("click", () => {
  if (isColorLocked) return;

  generateBtn.disabled = true;
  generateBtn.textContent = "Picking...";

  todayColor = colors[Math.floor(Math.random() * colors.length)];

  let count = 0;
  const blankCard = document.querySelector(".blank");

  const animation = setInterval(() => {
    const previewColor = colors[Math.floor(Math.random() * colors.length)];

    blankCard.style.backgroundColor = previewColor.value;
    blankCard.querySelector("span").textContent = previewColor.value;
    blankCard.style.transform = "scale(1.04)";

    setTimeout(() => {
      blankCard.style.transform = "scale(1)";
    }, 80);

    count++;

    if (count >= 10) {
      clearInterval(animation);

      blankCard.style.backgroundColor = todayColor.value;
      blankCard.querySelector("span").textContent = todayColor.value;

      isColorLocked = true;

      pickedColorCard.style.backgroundColor = todayColor.value;
      colorCodeText.textContent = todayColor.value;

      smallColorCard.style.backgroundColor = todayColor.value;
      uploadColorCodeText.textContent = todayColor.value;

      resultColorCard.style.backgroundColor = todayColor.value;
      resultColorCodeText.textContent = todayColor.value;

      setTimeout(() => {
        showScreen("pickedScreen");
      }, 400);
    }
  }, 80);
});

photoInput.addEventListener("change", () => {
  handlePhotoUpload(photoInput);
});

photoInputUpload.addEventListener("change", () => {
  handlePhotoUpload(photoInputUpload);
});

revealBtn.addEventListener("click", () => {
  showResult();
});

resultPhotoStrip.addEventListener("scroll", () => {
  updateSelectedPhoto();
});

restartBtn.addEventListener("click", () => {
  restartExperience();
});

function handlePhotoUpload(inputElement) {
  if (!isColorLocked || !todayColor) {
    alert("Please pick today's color first.");
    inputElement.value = "";
    return;
  }

  const files = Array.from(inputElement.files);
  const remainingSlots = maxPhotos - uploadedPhotos.length;

  if (files.length > remainingSlots) {
    alert(`You only have ${remainingSlots} photo credit(s) left today.`);
    inputElement.value = "";
    return;
  }

  files.forEach((file) => {
    uploadedPhotos.push(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;

      img.onload = () => {
        const matchPercent = calculateColorMatch(img, todayColor.rgb);

        photoResults.push({
          src: event.target.result,
          match: matchPercent
        });

        renderUploadSlots();
        updateCreditText();
        showScreen("uploadScreen");

        if (uploadedPhotos.length >= maxPhotos) {
          photoInput.disabled = true;
          photoInputUpload.disabled = true;
        }
      };
    };

    reader.readAsDataURL(file);
  });

  inputElement.value = "";
}

function showResult() {
  showScreen("resultScreen");

  const bestPhoto = photoResults.reduce((best, current) => {
    return current.match > best.match ? current : best;
  });

  resultPhotoStrip.innerHTML = "";

  photoResults.forEach((photo) => {
    const item = document.createElement("div");
    item.classList.add("result-photo-item");

    item.dataset.match = photo.match;
    item.dataset.isBest = photo.src === bestPhoto.src ? "true" : "false";

    const img = document.createElement("img");
    img.src = photo.src;
    img.classList.add("result-thumb");

    item.appendChild(img);
    resultPhotoStrip.appendChild(item);
  });

  setTimeout(() => {
    centerBestPhoto(bestPhoto);
    updateSelectedPhoto();
  }, 100);

  resultSummary.textContent = "Come back tomorrow!";
}

function centerBestPhoto(bestPhoto) {
  const items = document.querySelectorAll(".result-photo-item");

  items.forEach((item) => {
    const img = item.querySelector("img");

    if (img.src === bestPhoto.src) {
      const containerCenter = resultPhotoStrip.offsetWidth / 2;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;

      resultPhotoStrip.scrollLeft = itemCenter - containerCenter;
    }
  });
}

function updateSelectedPhoto() {
  const items = document.querySelectorAll(".result-photo-item");

  if (items.length === 0) return;

  const containerCenter =
    resultPhotoStrip.scrollLeft + resultPhotoStrip.offsetWidth / 2;

  let closestItem = null;
  let closestDistance = Infinity;

  items.forEach((item) => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(containerCenter - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  items.forEach((item) => {
    item.classList.remove("selected");

    const oldLabel = item.querySelector(".best-label");
    if (oldLabel) oldLabel.remove();
  });

  if (closestItem) {
    closestItem.classList.add("selected");

    const match = closestItem.dataset.match;
    bestMatchText.textContent = `Match: ${match}%`;

    if (closestItem.dataset.isBest === "true") {
      const label = document.createElement("div");
      label.classList.add("best-label");
      label.textContent = "🏆 Best Match!";
      closestItem.appendChild(label);

      resultTitle.textContent = "This is the best match!";
    } else {
      resultTitle.textContent = " ";
    }
  }
}

function calculateColorMatch(imgElement, targetRgb) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 100;
  canvas.height = 100;

  ctx.drawImage(imgElement, 0, 0, 100, 100);

  const imageData = ctx.getImageData(0, 0, 100, 100);
  const pixels = imageData.data;

  let matchedPixels = 0;
  const totalPixels = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const distance = Math.sqrt(
      Math.pow(r - targetRgb[0], 2) +
      Math.pow(g - targetRgb[1], 2) +
      Math.pow(b - targetRgb[2], 2)
    );

    if (distance < 100) {
      matchedPixels++;
    }
  }

  return Math.round((matchedPixels / totalPixels) * 100);
}

function restartExperience() {
  todayColor = null;
  isColorLocked = false;
  uploadedPhotos = [];
  photoResults = [];

  const blankCard = document.querySelector(".blank");
  blankCard.style.backgroundColor = "#FFFFFF";
  blankCard.style.transform = "scale(1)";
  blankCard.querySelector("span").textContent = "#FFFFFF";

  pickedColorCard.style.backgroundColor = "";
  colorCodeText.textContent = "";
  smallColorCard.style.backgroundColor = "";
  uploadColorCodeText.textContent = "";
  resultColorCard.style.backgroundColor = "";
  resultColorCodeText.textContent = "";

  mainUploadPhoto.innerHTML = "";
  mainUploadPhoto.classList.remove("complete-stack");
  photoPreview.innerHTML = "";
  photoPreview.classList.remove("hidden");
  resultPhotoStrip.innerHTML = "";

  photoInput.value = "";
  photoInputUpload.value = "";
  photoInput.disabled = false;
  photoInputUpload.disabled = false;

  creditText.textContent = `up to ${maxPhotos} photos`;
  uploadCreditText.textContent = `up to ${maxPhotos} photos`;
  uploadStatusText.textContent = "Go find your color!";
  uploadScreen.classList.remove("upload-complete");
  uploadLabelBtn.classList.remove("hidden");
  uploadLabelText.classList.remove("hidden");
  revealBtn.classList.add("hidden");

  resultTitle.textContent = "Swipe to view your colors";
  bestMatchText.textContent = "Match: --%";
  resultSummary.textContent = "";

  generateBtn.disabled = false;
  generateBtn.textContent = "Generate Color";

  showScreen("landingScreen");
}
