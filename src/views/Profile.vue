<template>
  <div class="profile">
    <div v-if="listData.length > 0" class="profile-left">
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
                {{ item.user.userName }}
              </template>
              <template #description>
                {{ time(item.createdAt) }}
              </template>
              <template #avatar>
                <a-avatar shape="square" :src="item.user.avatar" />
              </template>
            </a-list-item-meta>
            <div class="blog-content">
              <router-link v-for="i in item.atUser" :key="i[0]" :to="`/profile/${i[1]}`">{{i[0]}}</router-link>
              {{item.contentFormat}}
              <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }" :data-source="item.imgs" v-if="item.imgs.length > 0">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <div class="blog-img"
                      :style="{backgroundImage: `url(${item})`, backgroundSize: 'cover'}"
                      @click="handlePreview(item)">
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
      <p class="no-data-info">还没有文章...</p>
      <div class="no-data-button">
        <a-button type="primary">
          <router-link to="/createBlog">
            去创建
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="profile-right">
      <card-info :userName="userName" :sign="sign" :avatar="avatar" :userId="userId" :fansCount="fansCount" @handleFollowUser="toFollowerUser" :isFollow="isFollow" :followerCount="followerCount" :myId="myId" :isFan="isFan" />
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="bigImg" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store/index'
import { profile, followUser, getFans, unFollowUser, getFollower } from '../services/profile'
import { time } from '../utils/utils'
import { StarOutlined, LikeOutlined, MessageOutlined, SettingOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons-vue'
import AList from 'ant-design-vue/lib/list'
import AListItem from 'ant-design-vue/lib/list/Item'
import AAvatar from 'ant-design-vue/lib/avatar'
import 'ant-design-vue/lib/avatar/style/css'
import 'ant-design-vue/lib/spin/style/css'
import 'ant-design-vue/lib/list/style/css'
import AModal from 'ant-design-vue/lib/modal'
import ASpin from 'ant-design-vue/lib/spin'
import 'ant-design-vue/lib/modal/style/css'
import AButton from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
import AEmpty from 'ant-design-vue/lib/empty'
import 'ant-design-vue/lib/empty/style/css'
import CardInfo from '@/components/card/CardInfo.vue'
import Icon from '@/components/icon/Icon.vue'
interface UserData {
  userName: any;
  sign: any;
  avatar: any;
}
export default defineComponent({
  name: 'profile',
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
    AEmpty,
    AModal,
    CardInfo,
    Icon
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const listData = ref([])
    const myId = computed(() => store.state.userInfo.id)
    const isDisable = ref(false)
    const isFollow = ref(false)
    // const fansList = ref<any>([])
    const userData = reactive<UserData>({
      userName: '',
      sign: '',
      avatar: ''
    })
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
    const userId: any = computed(() => route.params.id)
    const previewVisible = ref(false)
    const bigImg = ref('')
    const fansCount = ref(0)
    const isFan = ref(false)
    const followerCount = ref(0)
    // const getMyFansCount = async () => {
    //   const { data } = await getFans(myId.value)
    //   if (data.errno === 0) {
    //     // fansCount.value = data.data.count
    //     store.commit('userState/setFansListCount', data.data.count)
    //   }
    // }
    const getMyFollowersCount = async () => {
      const { data } = await getFollower(myId.value)
      if (data.errno === 0) {
        store.commit('setFollowerList', data.data.userList)
        store.commit('setFollowerListCount', data.data.count)
      }
    }
    const getFansList = async () => {
      if (myId.value) {
        const { data } = await getFans(userId.value)
        if (data.errno === 0) {
          isFan.value = data.data.userList.some((fans: any) => fans.id === myId.value)
          fansCount.value = data.data.count
        }
      }
    }
    const getFollowersList = async () => {
      if (myId.value) {
        const { data } = await getFollower(userId.value)
        if (data.errno === 0) {
          followerCount.value = data.data.count
          isFollow.value = data.data.userList.some((user: any) => {
            return user.id === myId.value
          })
        }
      }
    }
    const toFollowerUser = async (e: Event) => {
      e.preventDefault()
      if (!isDisable.value) {
        isDisable.value = true
        if (isFan.value) {
          const { data } = await unFollowUser({
            id: myId.value,
            userId: userId.value
          })
          if (data.errno === 0) {
            getFansList()
            getFollowersList()
            // getMyFansCount()
            getMyFollowersCount()
          }
          isDisable.value = false
        } else {
          const { data } = await followUser({
            id: myId.value,
            userId: userId.value
          })
          if (data.errno === 0) {
            getFansList()
            getFollowersList()
            // getMyFansCount()
            getMyFollowersCount()
          }
          isDisable.value = false
        }
      }
    }
    const getData = async () => {
      const { data } = await profile({
        userId: userId.value,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value
      })
      if (data.errno === 0) {
        listData.value = data.data.blogList
        count.value = data.data.count
        fansCount.value = data.data.fansCount
        followerCount.value = data.data.followerCount
        if (listData.value.length > 0) {
          userData.userName = data.data.blogList[0].user.userName
          userData.sign = data.data.blogList[0].user.sign
          userData.avatar = data.data.blogList[0].user.avatar
        }
      }
    }
    onMounted(async () => {
      if (userId.value === myId.value?.toString()) {
        router.replace('/me')
        return
      }
      getData()
      getFansList()
      getFollowersList()
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
      const { data } = await profile({
        userId: userId.value,
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
      userId,
      getData,
      fansCount,
      ...toRefs(userData),
      toFollowerUser,
      isFollow,
      myId,
      isDisable,
      followerCount,
      isFan
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
.profile{
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
    .no-data-button {
      margin-top: 30px;
      text-align: center;
    }
  }
  .profile-left {
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
