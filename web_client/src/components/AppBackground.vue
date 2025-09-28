<template>
  <div class="background">
    <img src="/public/Background.png" />
  </div>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.background img {
  object-fit: cover;
  height: 100%;
  object-position: bottom;
  display: block;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
