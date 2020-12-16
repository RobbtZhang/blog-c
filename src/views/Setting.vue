<template>
  <div class="setting">
    <div class="setting-wrapper">
      <a-tabs default-active-key="1" tab-position="left">
        <a-tab-pane key="1" tab="基本信息">
          <a-form>
            <a-form-item label="签名" v-bind="validateInfos.sign" :wrapper-col="{ span: 10, offset: 0 }">
              <a-input v-model:value="form.sign" autocomplete="off" />
            </a-form-item>
            <a-form-item label="城市" v-bind="validateInfos.city" :wrapper-col="{ span: 5, offset: 0 }">
              <a-input v-model:value="form.city" autocomplete="off" />
            </a-form-item>
            <a-form-item v-bind="validateInfos.avatar" label="头像" :wrapper-col="{ span: 5, offset: 0 }">
              <a-upload
                v-model:fileList="fileList"
                list-type="picture-card"
                action="http://localhost:3000/api/utils/upload"
                class="avatar-uploader"
                :withCredentials="true"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img v-if="form.avatar" :src="form.avatar" alt="avatar" style="width: 102px; height: 102px;" />
                <div v-else>
                  <!-- todo -->
                  <loading-outlined v-if="loading" />
                  <plus-outlined v-else />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="性别" v-bind="validateInfos.gender" >
              <a-radio-group v-model:value="form.gender">
                <a-radio value="1">
                  男
                </a-radio>
                <a-radio value="2">
                  女
                </a-radio>
                <a-radio value="3">
                  保密
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="onSubmit">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="修改密码">
          <a-form
          :model="pasForm"
          :rules="pasRule"
          @finish="handleFinish"
          @finishFailed="handleFinishFailed"
          ref="ruleForm"
          >
            <a-form-item label="当前密码" name="password" :label-col="{ span: 3, offset: 0 }" :wrapper-col="{ span: 5, offset: 1 }">
              <a-input v-model:value="pasForm.password" autocomplete="off" type="password"/>
            </a-form-item>
            <a-form-item label="新密码" name="newPassword" :label-col="{ span: 3, offset: 0 }" :wrapper-col="{ span: 5, offset: 1 }">
              <a-input v-model:value="pasForm.newPassword" autocomplete="off" type="password"/>
            </a-form-item>
            <a-form-item label="确认密码" name="checkPassword" :label-col="{ span: 3, offset: 0 }" :wrapper-col="{ span: 5, offset: 1 }">
              <a-input v-model:value="pasForm.checkPassword" autocomplete="off" type="password"/>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 5, offset: 1 }">
              <a-button type="primary" html-type="submit">
                修改
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserInfo } from '../store/modules/user/interface'
import { changeUserInfo, getUserInfo, changePassword, logout } from '../services/user'
import AButton from 'ant-design-vue/lib/button'
import ATabs from 'ant-design-vue/lib/tabs'
import ATabPane from 'ant-design-vue/lib/vc-tabs/src/TabPane'
import AForm from 'ant-design-vue/lib/form'
import AFormItem from 'ant-design-vue/lib/form/FormItem'
import AInput from 'ant-design-vue/lib/input'
import ARadioGroup from 'ant-design-vue/lib/radio/Group'
import ARadio from 'ant-design-vue/lib/radio'
import AUpload from 'ant-design-vue/lib/upload'
import message from 'ant-design-vue/lib/message'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import 'ant-design-vue/lib/form/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/radio/style/css'
import 'ant-design-vue/lib/upload/style/css'
import 'ant-design-vue/lib/tabs/style/css'
import 'ant-design-vue/lib/button/style/css'
import 'ant-design-vue/lib/message/style/css'
import { useStore } from '../store'
import { useForm } from '@ant-design-vue/use'
export default defineComponent({
  components: {
    AButton,
    ATabs,
    ATabPane,
    AForm,
    AFormItem,
    AInput,
    ARadioGroup,
    ARadio,
    AUpload,
    PlusOutlined,
    LoadingOutlined
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    const ruleForm = ref<any>(null)
    const fileList = ref<any>([])
    // let updateAva = ''
    const form = reactive<UserInfo>({
      sign: store.state.userState.userInfo.sign,
      city: store.state.userState.userInfo.city,
      avatar: store.state.userState.userInfo.avatar,
      gender: store.state.userState.userInfo.gender
    })
    const pasForm = reactive({
      password: '',
      newPassword: '',
      checkPassword: ''
    })
    const validatePass = async (rule: any, value: any) => {
      if (value === '') {
        return Promise.reject('请输入新密码')
      } else if (value === pasForm.password) {
        return Promise.reject('新密码不能与当前密码一样')
      } else {
        if (pasForm.newPassword !== '') {
          ruleForm.value.validateField('checkPass')
        }
        return Promise.resolve()
      }
    }
    const validatePass2 = async (rule: any, value: any, callback: any) => {
      if (value === '') {
        return Promise.reject('请输入新密码')
      } else if (value !== pasForm.newPassword) {
        return Promise.reject('两次密码不一致')
      } else {
        return Promise.resolve()
      }
    }
    const pasRule = reactive({
      password: [{ required: true, trigger: 'change', message: '请输入当前密码' }],
      newPassword: [{ validator: validatePass, trigger: 'change' }],
      checkPassword: [{ validator: validatePass2, trigger: 'change' }]
    })
    const handleFinish = async (values: any) => {
      const res = await changePassword({
        password: values.password,
        newPassword: values.newPassword
      })
      if (res.data.errno === 0) {
        message.success('修改成功，请重新登录')
        const res = await logout()
        if (res.data.errno === 0) {
          store.commit('userState/setUserInfo', {})
          store.commit('userState/changeLogin', false)
          message.success('退出成功')
          router.push('/')
        }
      }
      console.log(values)
    }
    const handleFinishFailed = (errors: any) => {
      console.log(errors)
    }
    const rule = reactive({
      sign: [
        {
          min: 1,
          max: 16,
          message: '签名长度为1~16位字符'
        }
      ],
      city: [
        {
          min: 2,
          message: '城市最小长度为2'
        }
      ],
      avatar: [
        {
          type: 'string'
        }
      ]
    })
    const { validateInfos, validate } = useForm(form, rule)
    // const getBase64 = (img: File, callback: Function) => {
    //   const reader = new FileReader()
    //   reader.addEventListener('load', () => callback(reader.result))
    //   reader.readAsDataURL(img)
    // }
    const handleChange = (info: any) => {
      if (info.file.status === 'uploading') {
        loading.value = true
        return
      }
      if (info.file.status === 'done') {
        // console.log(info.file.response)
        if (info.file.response.errno === 10005) {
          message.error(info.file.response.message)
          router.push({
            path: '/login',
            query: {
              from: route.path
            }
          })
        } else if (info.file.response.errno === 0) {
          form.avatar = 'http://localhost:3000' + info.file.response.data.url
          // console.log(form.avatar)
          loading.value = false
        }
        // Get this url from response in real world.
        // getBase64(info.file.originFileObj, (imageUrl: string) => {
        //   form.avatar = imageUrl
        //   loading.value = false
        // })
      }
      if (info.file.status === 'error') {
        loading.value = false
      }
    }
    const beforeUpload = (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('只能上传jpg和png格式的头像!', 1)
      }
      const isLt2M = file.size / 1024 / 1024 < 0.1
      if (!isLt2M) {
        message.error('头像大小不可超过 100k!', 1)
      }
      return isJpgOrPng && isLt2M
    }
    const onSubmit = (e: Event) => {
      e.preventDefault()
      validate().then(async () => {
        // form.gender = (form.gender && Number(form.gender)) || 3
        // form.avatar = updateAva
        const updateDate = (toRaw(form))
        // console.log(updateDate)
        const res = await changeUserInfo({
          ...updateDate,
          gender: (form.gender && Number(form.gender)) || 3
        })
        if (res.data.errno === 0) {
          message.success('修改成功')
          const userInfo = await getUserInfo()
          store.commit('userState/setUserInfo', userInfo.data.data)
        }
      }).catch(err => {
        console.log('error', err)
      })
    }
    return {
      validateInfos,
      onSubmit,
      form,
      handleChange,
      beforeUpload,
      loading,
      fileList,
      // updateAva,
      pasForm,
      pasRule,
      handleFinish,
      handleFinishFailed,
      ruleForm
    }
  }
})
</script>

<style lang="less" scoped>
.ant-btn-primary {
  margin-left: 100px;
}
.ant-form-item {
  padding-left: 100px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.setting {
  width: 80%;
  // background-color: red;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 80px;
  .setting-wrapper {
    width: 100%;
  }
}
</style>
