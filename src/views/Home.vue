<template>
  <div class="home">
    <div v-if="listData.length > 0" class="home-left">
      <a-list item-layout="horizontal"
        :data-source="listData"
        :loading="loading"
      >
        <template #loadMore>
          <div
            v-if="listData.length < count"
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
          >
            <a-spin v-if="loadingMore" />
            <a-button v-else @click="onLoadMore">
              加载更多
            </a-button>
          </div>
        </template>
        <template #renderItem="{ item, index }">
          <a-list-item :key="index">
            <template #actions>
              <span v-for="{ type, text } in actions" :key="type">
                <component v-bind:is="type" style="margin-right: 8px" />
                {{ text }}
              </span>
            </template>
            <a-list-item-meta>
              <template #title>
                <router-link :to="`/profile/${item.user.id}`">
                  {{ item.user.userName }}
                </router-link>
              </template>
              <template #description>
                {{ time(item.createdAt) }}
              </template>
              <template #avatar>
                <router-link :to="`/profile/${item.user.id}`">
                  <a-avatar shape="square" :src="item.user.avatar" />
                </router-link>
              </template>
            </a-list-item-meta>
            <div class="blog-content">
              <router-link v-for="i in item.atUser" :key="i[0]" :to="`/profile/${i[1]}`">{{i[0]}}</router-link>
              {{item.contentFormat}}
              <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }" :data-source="item.imgs" v-if="item.imgs.length > 0">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <div class="blog-img" :style="{backgroundImage: 'url( '+ item +')', backgroundSize:'cover'}" @click="handlePreview(item)" alt="">
                    </div>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="no-data" v-else>
      <Icon type="empty" :style="{'font-size': '200px', color: '#1890ff'}" />
      <p class="no-data-info">数据加载中</p>
    </div>
    <div class="profile-right">
      <card-info v-if="isLogin" :userName="userName" :sign="sign" :avatar="avatar" :userId="userId" :myId="userId" :fansCount="fansCount"
       :followerCount="followerCount" />
      <router-link v-else to='/login'>
        <a-card hoverable style="width: 300px">
          <a-card-meta title="欢迎" description="去登陆发现更多精彩">
          </a-card-meta>
        </a-card>
      </router-link>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="bigImg" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { homeBlog } from '../services/blog'
import { time } from '../utils/utils'
import { useStore } from '../store/index'
import { StarOutlined, LikeOutlined, MessageOutlined, SettingOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons-vue'
import AList from 'ant-design-vue/lib/list'
import AListItem from 'ant-design-vue/lib/list/Item'
import AAvatar from 'ant-design-vue/lib/avatar'
import 'ant-design-vue/lib/avatar/style/css'
import ACard from 'ant-design-vue/lib/card'
import 'ant-design-vue/lib/card/style/css'
import 'ant-design-vue/lib/spin/style/css'
import 'ant-design-vue/lib/list/style/css'
import AModal from 'ant-design-vue/lib/modal'
import ASpin from 'ant-design-vue/lib/spin'
import 'ant-design-vue/lib/modal/style/css'
import AButton from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import AEmpty from 'ant-design-vue/lib/empty'
import 'ant-design-vue/lib/empty/style/css'
import Icon from '../components/icon/Icon.vue'
import CardInfo from '@/components/card/CardInfo.vue'
export default defineComponent({
  name: 'home',
  components: {
    AButton,
    StarOutlined,
    EditOutlined,
    LikeOutlined,
    MessageOutlined,
    EllipsisOutlined,
    AList,
    SettingOutlined,
    AListItem,
    ASpin,
    AListItemMeta: AList.Item.Meta,
    AAvatar,
    ACard,
    ACardMeta: ACard.Meta,
    AEmpty,
    Icon,
    AModal,
    CardInfo
  },
  setup () {
    const store = useStore()
    const listData = ref([])
    const isLogin = computed(() => store.state.isLogin)
    const userName = computed(() => store.state.userInfo.userName)
    const sign = computed(() => store.state.userInfo.sign)
    const userId = computed(() => store.state.userInfo.id)
    const avatar = computed(() => store.state.userInfo.avatar)
    const actions = ref([
      { type: 'StarOutlined', text: '156' },
      { type: 'LikeOutlined', text: '156' },
      { type: 'MessageOutlined', text: '2' }
    ])
    const loadingMore = ref(false)
    const count = ref(0)
    const loading = ref(false)
    const pageIndex = ref(1)
    const pageSize = ref(5)
    const previewVisible = ref(false)
    const bigImg = ref('')
    const fansCount = computed(() => store.state.userInfo.fansCount)
    const followerCount = computed(() => store.state.userInfo.followerCount)
    onMounted(async () => {
      // fansCount.value =
      // followerCount.value =
      const { data } = await homeBlog({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value
      })
      if (data.errno === 0) {
        listData.value = data.data.blogList
        count.value = data.data.count
      }
    })
    const handlePreview = (item: string) => {
      bigImg.value = item
      previewVisible.value = true
    }
    const handleCancel = () => {
      previewVisible.value = false
    }
    const onLoadMore = async () => {
      loadingMore.value = true
      pageIndex.value++
      const { data } = await homeBlog({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value
      })
      if (data.errno === 0) {
        listData.value = listData.value.concat(data.data.blogList)
      }
      loadingMore.value = false
    }
    return {
      listData,
      actions,
      loadingMore,
      loading,
      onLoadMore,
      time,
      count,
      previewVisible,
      handleCancel,
      handlePreview,
      bigImg,
      isLogin,
      userName,
      avatar,
      sign,
      userId,
      fansCount,
      followerCount
    }
  }
})
</script>

<style lang="less" scoped>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.01);
}
.ant-list-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.home{
  width: 80%;
  // background-color: red;
  margin: 0 auto;
  padding: 80px;
  display: flex;
  justify-content: space-between;
  .no-data {
    width: 100%;
    display: flex;
    flex-direction: column;
    .no-data-info {
      text-align: center;
    }
  }
  .home-left {
    width: 80%;
    padding-left: 30px;
    .blog-content {
      margin-top: 5px;
      padding-left: 48px;
      width: 100%;
      a {
        color: #1890ff;
      }
      .blog-img {
        cursor: pointer;
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
