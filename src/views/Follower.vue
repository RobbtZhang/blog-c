<template>
  <div class="follower">
    <List v-if="followCount > 0" :list="followList" :count="followCount" />
    <div class="no-data" v-else>
      <Icon type="empty" :style="{'font-size': '200px', color: '#1890ff'}" />
      <p class="no-data-info">{{userId == meId ? '我' : 'Ta'}}还没有关注</p>
      <div class="no-data-button">
        <a-button v-if="userId == meId" type="primary">
          <router-link to="/">
            去关注
          </router-link>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { getFollower } from '@/services/profile'
import List from '@/components/list/List.vue'
import Icon from '@/components/icon/Icon.vue'
import AButton from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
export default defineComponent({
  name: 'follower',
  components: {
    List,
    Icon,
    AButton
  },
  setup () {
    const followList = ref([])
    const followCount = ref(0)
    const router = useRoute()
    const store = useStore()
    const userId: any = computed(() => router.params.id)
    const meId: any = computed(() => store.state.userInfo.id)
    onMounted(async () => {
      const { data } = await getFollower(userId.value)
      if (data.errno === 0) {
        followList.value = data.data.userList
        followCount.value = data.data.count
      }
    })
    return {
      followList,
      followCount,
      userId,
      meId
    }
  }
})
</script>

<style lang="less" scoped>
.follower {
  width: 80%;
  padding-top: 30px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .no-data {
    width: 100%;
    display: flex;
    flex-direction: column;
    .no-data-info {
      text-align: center;
    }
    .no-data-button {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
