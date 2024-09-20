const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const loader = document.getElementById("loader");
const resultDiv = document.getElementById("result");
const uploadButton = document.getElementById("uploadButton");
const uploadForm = document.getElementById("uploadForm");

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

fileInput.addEventListener("change", function (e) {
  if (e.target.files.length == 1) {
    resultDiv.innerText = `${e.target.files.length} file selected\n`;
  } else resultDiv.innerText = `${e.target.files.length} files selected\n`;
});

uploadButton.addEventListener("click", async () => {
  const filesToUpload = fileInput.files;

  if (filesToUpload.length === 0) {
    alert("Please select files before uploading.");
    return;
  }

  loader.style.display = "block";
  uploadButton.disabled = true;

  const formData = new FormData();
  for (let i = 0; i < filesToUpload.length; i++) {
    formData.append("files", filesToUpload[i]);
  }

  resultDiv.innerText += `Uploading ${filesToUpload.length} files\n`;
  try {
    const response = await fetch("https://www.openskyresort.in/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      resultDiv.innerText += `Error uploading: ${result.error}\n`;
    }
  } catch (error) {
    resultDiv.innerText += `Error uploading ${error}\n`;
  }

  loader.style.display = "none";
  resultDiv.innerText += `Total files uploaded: ${filesToUpload.length}`;
  setTimeout(() => {
    location.reload();
  }, 2000);
  uploadButton.disabled = false;
});

uploadArea.addEventListener("click", () => {
  fileInput.click();
});
