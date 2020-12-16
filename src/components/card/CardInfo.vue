<template>
<div class="card">
  <a-card hoverable style="width: 300px">
    <template class="ant-card-actions" #actions>
      <router-link to="/createBlog">
        <edit-outlined key="edit" /> 分享
      </router-link>
      <router-link to="/setting">
        <setting-outlined key="setting" /> 设置
      </router-link>
    </template>
    <a-card-meta :title="userName" :description="sign">
      <template #avatar>
        <a-avatar shape="square" :src="avatar" :size="50" />
      </template>
    </a-card-meta>
    <div class="fansandfollower">
      <div class="fans">
        <router-link :to="`/fans/${userId}`">
          <Icon type="fans" :style="{'font-size': '15px', color: 'red'}" /> 粉丝 ({{fansCount}})
        </router-link>
      </div>
      <div class="follower">
        <router-link :to="`/follower/${userId}`">
          <Icon type="fllow" :style="{'font-size': '15px', color: '#1890ff'}" /> 关注 ({{followerCount}})
        </router-link>
      </div>
      <div v-if="userId !== myId" class="follow" @click="handleClick" type="link">
        <Icon :type="isFollow && isFan ? 'relation' : isFan ? 'follow1' : 'follow2'" :style="{'font-size': '15px', color: '#1890ff'}" />
        <span :style="{color: isFan? '#1890ff' : ''}">
          {{isFollow && isFan ? '互相关注' : isFan ? '已关注' : '关注Ta'}}
        </span>
      </div>
      <div v-else class="follow">
        <router-link :to="`/follower/${userId}`">
          <Icon type="mesg" :style="{'font-size': '15px', color: '#1890ff'}" /> 消息 ({{followerCount}})
        </router-link>
      </div>
    </div>
  </a-card>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SettingOutlined, EditOutlined } from '@ant-design/icons-vue'
import ACard from 'ant-design-vue/lib/card'
import 'ant-design-vue/lib/card/style/css'
import AAvatar from 'ant-design-vue/lib/avatar'
import 'ant-design-vue/lib/avatar/style/css'
import Icon from '../icon/Icon.vue'
export default defineComponent({
  components: {
    ACard,
    ACardMeta: ACard.Meta,
    Icon,
    SettingOutlined,
    EditOutlined,
    AAvatar
  },
  props: {
    userName: {
      type: String
    },
    sign: {
      type: String
    },
    avatar: {
      type: String
    },
    userId: null,
    fansCount: {
      type: Number,
      default: 0
    },
    followerCount: {
      type: Number,
      default: 0
    },
    isFollow: {
      type: Boolean,
      default: false
    },
    myId: null,
    isFan: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const handleClick = async (e: Event) => {
      context.emit('handleFollowUser', e)
    }
    return {
      handleClick
    }
  }
})
</script>

<style lang="less" scoped>
.card {
  .fansandfollower {
    width: 100%;
    padding-top: 20px;
    display: flex;
    a {
      color: #1890ff;
    }
    justify-content: center;
    .fans {
      width: 33%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .follower {
      width: 33%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .follow {
      span {
        margin-left: 5px;
      }
      padding: 0px;
      color: rgba(0, 0, 0, 0.5);
      width: 33%;
      -moz-user-select:none; /*火狐*/
      -webkit-user-select:none; /*webkit浏览器*/
      -ms-user-select:none; /*IE10*/
      -khtml-user-select:none; /*早期浏览器*/
      user-select:none;
    }
  }
}
</style>
