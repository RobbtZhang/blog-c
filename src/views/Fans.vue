<template>
  <div class="fans">
    <List v-if="fansCount > 0" :list="fansList" :count="fansCount" />
    <div class="no-data" v-else>
      <Icon type="empty" :style="{'font-size': '200px', color: '#1890ff'}" />
      <p class="no-data-info">{{userId == meId ? '' : 'Ta'}}还没有粉丝</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import List from '@/components/list/List.vue'
import Icon from '@/components/icon/Icon.vue'
import { getFans } from '@/services/profile'
export default defineComponent({
  name: 'fans',
  components: {
    List,
    Icon
  },
  setup () {
    const router = useRoute()
    const store = useStore()
    const fansList = ref([])
    const fansCount = ref(0)
    const userId: any = computed(() => router.params.id)
    const meId: any = computed(() => store.state.userState.userInfo.id)
    onMounted(async () => {
      // if (!(fansList.value.length > 0)) {
      const { data } = await getFans(userId.value)
      if (data.errno === 0) {
        fansList.value = data.data.userList
        fansCount.value = data.data.count
        // store.commit('userState/setFansList', data.data.userList)
        // store.commit('userState/setFansListCount', data.data.count)
      }
      // }
    })
    return {
      userId,
      meId,
      fansList,
      fansCount
    }
  }
})
</script>

<style lang="less" scoped>
.fans {
  width: 80%;
  padding-top: 30px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .no-data {
    .no-data-info {
      text-align: center;
    }
  }
}
</style>
