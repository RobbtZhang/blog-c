<template>
  <div class="setting">
    <a-form
    ref="refForm"
    :model="form"
    :rules="rules"
    >
      <a-form-item name="content">
        <a-textarea
          class="custom"
          allowClear
          v-model:value="form.content"
          placeholder="分享一下"
          :rows="4"
          :cols="100"
        />
      </a-form-item>
      <div>提醒好友</div>
      <a-select
        v-if="userList.length > 0"
        mode="tags"
        placeholder="选择好友"
        v-model:value="values"
        style="width: 200px"
        @select="atFen"
        @deselect="delAtFen"
      >
        <a-select-option v-for="i in userList" :key="`@${i.userName} - ${i.id}`">
          {{ i.userName }}
        </a-select-option>
      </a-select>
      <div v-else>还没有关注好友 <router-link to="/">去关注</router-link></div>
      <div class="update-image-wrapper">
        <div class="update-image">
          <a-upload
            action="http://127.0.0.1:3000/api/utils/upload"
            :withCredentials="true"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @change="handleChange"
          >
          <div v-if="fileList.length < 8">
            <plus-outlined />
            <div class="ant-upload-text">图片</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        </div>
      </div>
      <a-form-item>
        <a-button type="primary" @click="onSubmit">
          发表
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, computed } from 'vue'
import AButton from 'ant-design-vue/lib/button'
import ATextarea from 'ant-design-vue/lib/input/TextArea'
import AUpload from 'ant-design-vue/lib/upload'
import AModal from 'ant-design-vue/lib/modal'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style/css'
import 'ant-design-vue/lib/upload/style/css'
import 'ant-design-vue/lib/modal/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/form/style/css'
import ASelect from 'ant-design-vue/lib/select'
import 'ant-design-vue/lib/select/style/css'
import AForm from 'ant-design-vue/lib/form'
import AFormItem from 'ant-design-vue/lib/form/FormItem'
import 'ant-design-vue/lib/button/style/css'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { createBlog } from '../services/blog'
import { useStore } from '@/store'
import { getFollower } from '@/services/profile'
export default defineComponent({
  components: {
    AButton,
    AForm,
    AFormItem,
    ATextarea,
    PlusOutlined,
    AUpload,
    AModal,
    ASelect,
    ASelectOption: ASelect.Option
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const showImg = ref(false)
    const refForm = ref<any>(null)
    const form = reactive({
      content: ''
    })
    const rules = reactive({
      content: [{ required: true, message: '内容不能为空哦', trigger: 'blur' }]
    })
    const previewVisible = ref(false)
    const previewImage = ref('')
    const fileList = ref<any[]>([])
    const userId: any = computed(() => store.state.userInfo.id)
    const followList = ref([])
    const followCount = ref(0)
    const values = ref<any>([])
    const userList = ref<any>([])
    onMounted(async () => {
      const { data } = await getFollower(userId.value)
      if (data.errno === 0) {
        followList.value = data.data.userList
        followCount.value = data.data.count
        userList.value = data.data.userList
      }
    })
    const atFen = (value: any, options: any) => {
      // console.log(value, options, values.value)
    }
    const delAtFen = (value: any, options: any) => {
      // console.log(value, options, values.value)
    }
    const handleChange = (info: any) => {
      if (showImg.value) {
        fileList.value = info.fileList
        if (info.file.status === 'uploading') {
          return
        }
        if (info.file.status === 'done') {
          // console.log(info.file.response, fileList.value)
          if (info.file.response.errno === 10005) {
            message.error(info.file.response.message)
            router.push({
              path: '/login',
              query: {
                from: route.path
              }
            })
          } else if (info.file.response.errno === 0) {
            fileList.value[fileList.value.length - 1].url = 'http://127.0.0.1:3000' + info.file.response.data.url
          }
        }
        if (info.file.status === 'error') {
          console.log('error')
        }
      }
    }
    const getBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
    const handlePreview = async (file: any) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      previewImage.value = file.url || file.preview
      previewVisible.value = true
    }
    const handleCancel = () => {
      previewVisible.value = false
    }
    const beforeUpload = (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('只能上传jpg和png格式的图片!', 1)
      }
      const isLt2M = file.size / 1024 / 1024 < 0.1
      if (!isLt2M) {
        message.error('图片大小不可超过 100k!', 1)
      }
      showImg.value = (isJpgOrPng && isLt2M)
      return isJpgOrPng && isLt2M
    }
    const onSubmit = () => {
      refForm.value.validate().then(async () => {
        const atFenList = values.value.join(' ')
        const imgLists: string[] = []
        fileList.value.forEach(i => { imgLists.push(i.url) })
        const res = await createBlog({
          content: atFenList + ' ' + form.content,
          imgLists
        })
        if (res.data.errno === 0) {
          message.success('发布成功')
          router.push({
            name: 'profile',
            params: {
              id: store.state.userInfo.id as any
            }
          })
        }
        // console.log(imgLists, form.content)
      }).catch((error: any) => {
        console.log('error', error)
      })
    }
    return {
      refForm,
      form,
      rules,
      onSubmit,
      fileList,
      handlePreview,
      handleChange,
      handleCancel,
      previewVisible,
      previewImage,
      beforeUpload,
      followList,
      values,
      userList,
      atFen,
      delAtFen
    }
  }
})
</script>

<style lang="less" scoped>
.ant-input-affix-wrapper {
  padding: 10px;
  width: 739px;
}
.ant-input {
  width: 100%;
}
#content {
  width: 100%;
}
.ant-input {
  width: 739px;
}
.ant-form-item{
  display: flex;
  justify-content: flex-start;
  padding-left: 0px;
}
.ant-btn-primary {
  margin-left: 380px;
}
.setting {
  width: 80%;
  // background-color: red;
  margin: 0 auto;
  padding: 80px;
  .update-image-wrapper {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    .update-image {
      width: 739px;
    }
  }
}
</style>
