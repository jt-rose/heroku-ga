window.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector("#file-js input[type=file]");
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const allowedImgTypes = ["image/jpeg", "image/png"];
      if (!allowedImgTypes.includes(fileInput.files[0].type)) {
        console.log("invalid image file rejected");
        fileInput.value = null;
        return;
      }
      const fileName = document.querySelector("#file-js .file-name");
      const imgPreview = (document.querySelector("#preview").src =
        URL.createObjectURL(fileInput.files[0]));
      fileName.textContent = fileInput.files[0].name;
    }
  };
});
