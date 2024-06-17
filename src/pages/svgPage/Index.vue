<template>
  <svg width="1000" height="600" xmlns="http://www.w3.org/2000/svg">
    <path d="M100,50 L900,50" stroke="#f00" stroke-width="1" fill="transparent"></path>
    <path d="M100,50 L500,50 Q750,50 900,150" stroke="#f00" fill="transparent"></path>
    <path d="M100,50 L400,50 Q650,50 900,250" stroke="#f00" fill="transparent"></path>
    <path d="M100,50 L300,50 Q550,50 900,350" stroke="#f00" fill="transparent"></path>
  </svg>
  <canvas width="1000" height="600" id="canvas"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.strokeStyle = '#ff0000';
  ctx.moveTo(100, 50);
  ctx.lineTo(900, 50);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#00ff00';
  ctx.moveTo(100, 50);
  ctx.lineTo(500, 50);
  ctx.quadraticCurveTo(750, 50, 900, 150);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#0000ff';
  ctx.moveTo(100, 50);
  ctx.lineTo(450, 50);
  ctx.quadraticCurveTo(680, 50, 900, 250);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#ff0000';
  ctx.moveTo(100, 50);
  ctx.lineTo(400, 50);
  ctx.quadraticCurveTo(600, 50, 900, 350);
  ctx.stroke();
})
</script>
<style scoped></style>