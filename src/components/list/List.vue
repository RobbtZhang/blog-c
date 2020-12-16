<template>
  <a-list item-layout="horizontal" :data-source="list">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta
          :description="item.sign"
        >
          <template #title>
            <router-link :to="`/profile/${item.id}`">
              {{ item.userName }}
            </router-link>
          </template>
          <template #avatar>
            <router-link :to="`/profile/${item.id}`">
              <a-avatar shape="square" :size="40" :src="item.avatar" />
            </router-link>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AList from 'ant-design-vue/lib/list'
import AAvatar from 'ant-design-vue/lib/avatar'
import 'ant-design-vue/lib/avatar/style/css'
import 'ant-design-vue/lib/list/style/css'
export default defineComponent({
  components: {
    AList,
    AListItem: AList.Item,
    AListItemMeta: AList.Item.Meta,
    AAvatar
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fansCount: {
      default: null
    }
  }
})
</script>
