<script setup>
import { ref } from 'vue'
</script>
<template>
  <div class='elk-container'>
    <svg class="svg-canvas" width="800" height="400" viewBox="0 0 800 400">
        <defs>
            <g  id="node" transform="translate(25, 25)"> <!-- 真正的中心点：0,0 -->
                       <!-- 外圈圆 -->
                       <circle cx="0" cy="0" r="20" fill="#f0f0f0" stroke="#333" stroke-width="2"></circle>
                       
                       <!-- 8个矩形（已去掉多余的translate） -->
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(0)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(45)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(90)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(135)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(180)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(225)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(270)"></rect>
                       <rect x="-4" y="-24" width="8" height="8" fill="#f0f0f0" stroke="#333" transform="rotate(315)"></rect>
                       
                       <!-- 内圈 -->
                       <circle cx="0" cy="0" r="8" fill="#fff" stroke="#333"></circle>
                       
                       <!-- 文字 -->
                       <text x="0" y="45" class="node-label">RJ1</text>
                   </g>
        </defs>
        <use href="#node" x="0" y="0" width="100" height="100"></use>

        
     </svg>
  </div>
</template>
<style scoped>
</style>