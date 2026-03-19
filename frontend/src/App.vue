<template>
  <div>
    <input type="file" multiple @change="handleFile" />
    <button @click="upload">Upload</button>
  </div>
</template>

<script>
import axios from "axios";

async function upload() {
  try {
    await uploadFiles();
    const formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append("images", this.files[i]);
    }

    await axios.post("http://localhost:3000/upload", formData);
    alert("Upload successful!");
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. Please try again.");
  }
}
</script>

<style lang="scss" scoped></style>
