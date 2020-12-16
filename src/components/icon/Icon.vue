<template>
  <n :type="`icon-${type}`" :style="style" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { defineComponent, ComponentInternalInstance, PropType } from 'vue'
const n = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2253565_9u828ifgee6.js',
  extraCommonProps: {
    style: {
      'font-size': '200px',
      color: '#1890ff'
    }
  }
})
export default defineComponent({
  components: {
    n: n as PropType<ComponentInternalInstance>
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    style: {
      type: Object,
      default: () => { return {} }
    }
  }
})
</script>
