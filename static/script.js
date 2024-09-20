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
    const response = await fetch("http://127.0.0.1:80/upload", {
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
  uploadButton.disabled = false;
});

uploadArea.addEventListener("click", () => {
  fileInput.click();
});
