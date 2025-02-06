let varify = document.getElementById("verify");
const fileInput = document.getElementById("verify-img");
const errorContainer = document.getElementById("errorContainer");

fileInput.addEventListener("click", function () {
  if (fileInput.files.length == 1) {
    varify.checked = false;
    return;
  }
});
varify.addEventListener("click", function () {
  const maxSize = 500 * 1024; // 500KB in bytes
  console.log("click button");

  if (fileInput.files.length === 0) {
    errorContainer.innerText = "Please select an image to upload.";
    errorContainer.style.color = "red";
    if (errorContainer.innerText != "") {
      varify.checked = false;
    }
    return;
  }

  const file = fileInput.files[0];
  if (file.size > maxSize) {
    errorContainer.innerText = "File size exceeds the limit (500KB).";
    errorContainer.style.color = "red";
    if (errorContainer.innerText != "") {
      varify.checked = false;
    }
    return;
  }

  errorContainer.innerText = "";
});
