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
  const maxPhotos = 5;
  
  // DOM
  const landingScreen = document.getElementById("landingScreen");
  const pickedScreen = document.getElementById("pickedScreen");
  const uploadScreen = document.getElementById("uploadScreen");
  const resultScreen = document.getElementById("resultScreen");
  
  const generateBtn = document.getElementById("generateBtn");
  
  const pickedColorCard = document.getElementById("pickedColorCard");
  const colorCodeText = document.getElementById("colorCodeText");
  
  const photoInput = document.getElementById("photoInput");
  const photoInputUpload = document.getElementById("photoInputUpload");
  
  const photoPreview = document.getElementById("photoPreview");
  
  const creditText = document.getElementById("creditText");
  const uploadCreditText = document.getElementById("uploadCreditText");
  
  const smallColorCard = document.getElementById("smallColorCard");
  const uploadColorCodeText = document.getElementById("uploadColorCodeText");
  
  const resultColorCard = document.getElementById("resultColorCard");
  const resultColorCodeText = document.getElementById("resultColorCodeText");
  const bestPhotoContainer = document.getElementById("bestPhotoContainer");
  const bestMatchText = document.getElementById("bestMatchText");
  const resultSummary = document.getElementById("resultSummary");
  const resultPhotoStrip = document.getElementById("resultPhotoStrip");
  
  // screen switch
  function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
  
    screens.forEach((screen) => {
      screen.classList.add("hidden");
    });
  
    document.getElementById(screenId).classList.remove("hidden");
  }
  
  // Generate color
  generateBtn.addEventListener("click", () => {
    if (isColorLocked) return;
  
    todayColor = colors[Math.floor(Math.random() * colors.length)];
    isColorLocked = true;
  
    pickedColorCard.style.backgroundColor = todayColor.value;
    colorCodeText.textContent = todayColor.value;
  
    smallColorCard.style.backgroundColor = todayColor.value;
    uploadColorCodeText.textContent = todayColor.value;
  
    resultColorCard.style.backgroundColor = todayColor.value;
    resultColorCodeText.textContent = todayColor.value;
  
    showScreen("pickedScreen");
  });
  
  // Upload from picked screen
  photoInput.addEventListener("change", () => {
    handlePhotoUpload(photoInput);
  });
  
  // Upload from upload screen
  photoInputUpload.addEventListener("change", () => {
    handlePhotoUpload(photoInputUpload);
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
  
          renderPhotoCard(event.target.result, matchPercent);
          updateCreditText();
  
          if (uploadedPhotos.length > 0 && uploadedPhotos.length < maxPhotos) {
            showScreen("uploadScreen");
          }
  
          if (uploadedPhotos.length >= maxPhotos) {
            showResult();
          }
        };
      };
  
      reader.readAsDataURL(file);
    });
  
    inputElement.value = "";
  }
  
  function renderPhotoCard(src, matchPercent) {
    const photoCard = document.createElement("div");
    photoCard.classList.add("photo-card");
  
    const img = document.createElement("img");
    img.src = src;
  
    const matchText = document.createElement("p");
    matchText.textContent = `Match: ${matchPercent}%`;
  
    photoCard.appendChild(img);
    photoCard.appendChild(matchText);
    photoPreview.appendChild(photoCard);
  }
  
  function updateCreditText() {
    const remaining = maxPhotos - uploadedPhotos.length;
  
    if (remaining === 0) {
      creditText.textContent = "You have uploaded 5 photos today";
      uploadCreditText.textContent = "You have uploaded 5 photos today";
      return;
    }
  
    const text = `${remaining} left`;
  
    creditText.textContent = text;
    uploadCreditText.textContent = text;
  }
  
  function showResult() {
    showScreen("resultScreen");
  
    const bestPhoto = photoResults.reduce((best, current) => {
      return current.match > best.match ? current : best;
    });
  
    resultPhotoStrip.innerHTML = "";
    bestPhotoContainer.innerHTML = "";
  
    photoResults.forEach((photo) => {
      const thumb = document.createElement("img");
      thumb.src = photo.src;
      thumb.classList.add("result-thumb");
  
      if (photo.src === bestPhoto.src) {
        thumb.classList.add("best");
      }
  
      resultPhotoStrip.appendChild(thumb);
    });
  
    bestPhotoContainer.innerHTML = `
      <img src="${bestPhoto.src}" alt="Best matched photo" />
    `;
  
    bestMatchText.textContent = `Match: ${bestPhoto.match}%`;
    resultSummary.textContent = `The highest match score today is ${bestPhoto.match}%. Come back and try tomorrow!`;
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