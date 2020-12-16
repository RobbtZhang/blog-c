<template>
  <div class="login">
    <h1 class="login-title">登录</h1>
    <div class="login-form">
      <a-form layout="vertical" :model="ruleForm">
        <a-form-item has-feedback label="用户名" v-bind="validateInfos.username">
          <a-input v-model:value="ruleForm.username" placeholder="请输入用户名" autocomplete="off"
          @blur="validate('username', { trigger: 'blur' }).catch(() => {})"
          />
        </a-form-item>
        <a-form-item has-feedback label="密码" v-bind="validateInfos.password">
          <a-input v-model:value="ruleForm.password" type="password" placeholder="请输入密码" autocomplete="off"
          @blur="validate('password', { trigger: 'blur' }).catch(() => {})"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSubmit">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <p class="to-register">
      <router-link to="/register">没有账号？去注册 >></router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw } from 'vue'
import AForm from 'ant-design-vue/lib/form'
import AFormItem from 'ant-design-vue/lib/form/FormItem'
import AInput from 'ant-design-vue/lib/input'
import AButton from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/form/style/css'
import 'ant-design-vue/lib/button/style/css'
import { useForm } from '@ant-design-vue/use'
import { useStore } from '../store'
import router from '@/router'
type checkFunc = (rule: string, value: string) => void
export default defineComponent({
  components: {
    AForm,
    AFormItem,
    AInput,
    AButton
  },
  setup () {
    // const refForm = ref<null | HTMLElement>(null)
    const store = useStore()
    const ruleForm = reactive({
      username: '',
      password: ''
    })
    const { validate, validateInfos } = useForm(ruleForm, reactive({
      username: [
        {
          required: true,
          min: 2,
          max: 5,
          message: '请输入2~5位正确用户名',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          min: 3,
          max: 6,
          message: '请输入3~6位正确密码',
          trigger: 'blur'
        }
      ]
    }))
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      try {
        const res = await validate()
        if (!res.outOfDate) {
          const { username: userName, password } = toRaw(ruleForm)
          store.dispatch('userState/login', { userName, password })
          router.beforeEach((to, from, next) => {
            if (to.name === 'profile' && to.params.id === 'undefined') {
              next({
                name: 'profile',
                params: {
                  id: store.state.userState.userInfo.id as any
                },
                replace: true
              })
            } else {
              next()
            }
          })
        }
      } catch (e) {
        // console.log(e)
      }
    }
    // const reset = () => {
    //   resetFields();
    // }
    return {
      ruleForm,
      validateInfos,
      onSubmit,
      validate
    }
  }
})
</script>

<style lang="less">
.ant-btn {
  margin-left: 90px;
}
.ant-form-item {
  padding-left:120px;
}
.ant-input {
  width: 260px;
}
.login {
  width: 100%;
  margin: 0 auto;
  padding-top: 120px;
  .to-register {
    text-align: center;
    a {
      color: #1890ff;
    }
  }
  .login-title {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .login-form {
    width: 500px;
    margin: 0 auto;
  }
}
</style>
