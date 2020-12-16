<template>
<div class="footer">
  <!-- <p class="footer-info">©</p> -->
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
  }
})
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  .footer-info {
    text-align: center;
  }
}
</style>
