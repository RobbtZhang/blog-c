<template>
  <div class="register">
    <h1 class="register-title">注册</h1>
    <div class="register-form">
      <a-form layout="vertical" :model="ruleForm">
        <!-- <a-form-item has-feedback label="邮箱" v-bind="validateInfos.email">
          <a-input v-model="ruleForm.email" placeholder="请输入邮箱" autocomplete="off"
          @blur="validate('email', { trigger: 'blur' }).catch(() => {})"
          />
        </a-form-item> -->
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
        <a-form-item has-feedback label="确认密码" v-bind="validateInfos.checkPass">
          <a-input v-model:value="ruleForm.checkPass" type="password" placeholder="确认密码" autocomplete="off"
          @blur="validate('checkPass', { trigger: 'blur' }).catch(() => {})"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :disabled="loading" :loading="loading" @click="onSubmit">
           {{ loading ? '注册中' : '注册' }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <p class="to-login">
      <router-link to="/login">已经有账号？去登录 >></router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import AForm from 'ant-design-vue/lib/form'
import AFormItem from 'ant-design-vue/lib/form/FormItem'
import AInput from 'ant-design-vue/lib/input'
import AButton from 'ant-design-vue/lib/button'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/form/style/css'
import 'ant-design-vue/lib/button/style/css'
import { useForm } from '@ant-design-vue/use'
import { checkName, register } from '../services/user'
// import { debounce } from '../utils/utils'
type checkFunc = (rule: string, value: string) => void
// const debounceCheckName = debounce(checkName, 2000)
export default defineComponent({
  components: {
    AForm,
    AFormItem,
    AInput,
    AButton
  },
  setup () {
    message.config({
      maxCount: 1
    })
    // const refForm = ref<null | HTMLElement>(null)
    const router = useRouter()
    const loading = ref(false)
    const ruleForm = reactive({
      // email: '',
      username: '',
      password: '',
      checkPass: ''
    })
    const checkUserName: checkFunc = async (reule, value) => {
      try {
        if (value === '') {
          return Promise.reject(new Error('请输入用户名'))
        } else if (value.length > 5 || value.length < 2) {
          return Promise.reject(new Error('用户名为2~5长度'))
        } else {
          const { data } = await checkName(value)
          if (data.errno === 10003) {
            return Promise.resolve()
          } else {
            return Promise.reject(new Error('用户名已存在'))
          }
        }
      } catch (e) {
        return Promise.reject(new Error('验证出错' + e))
      }
    }
    // const checkNameres = debounce(checkUserName, 2000)
    const checkPass: checkFunc = (rule, value) => {
      const pwsReg = new RegExp('^[0-9a-zA-Z_]{3,6}$')
      if (value === '') {
        return Promise.reject(new Error('请输入密码'))
      } else if (!pwsReg.test(value)) {
        return Promise.reject(new Error('密码为3~6位数字字母下划线'))
      } else {
        return Promise.resolve()
      }
    }
    const checkPass2: checkFunc = (rule, value) => {
      const pwsReg = new RegExp('^[0-9a-zA-Z_]{3,6}$')
      if (value === '') {
        return Promise.reject(new Error('请输入确认密码'))
      } else if (value !== ruleForm.password) {
        return Promise.reject(new Error('两次密码不一致'))
      } else if (!pwsReg.test(value)) {
        return Promise.reject(new Error('密码为3~6位数字字母下划线'))
      } else {
        return Promise.resolve()
      }
    }
    const { validate, validateInfos } = useForm(ruleForm, reactive({
      // email: [
      //   {
      //     required: true,
      //     type: 'email',
      //     message: '请输入正确的邮箱',
      //     trigger: 'blur'
      //   }
      // ],
      username: [
        {
          validator: checkUserName,
          trigger: 'blur'
          // required: true,
          // min: 2,
          // max: 5,
          // message: '用户名为2-5位'
        }
      ],
      password: [
        {
          // required: true,
          validator: checkPass,
          trigger: 'blur'
          // trigger: ['change', 'blur']
        }
      ],
      checkPass: [
        {
          // required: true,
          validator: checkPass2,
          trigger: 'blur'
          // trigger: 'change'
        }
      ]
    }))
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      try {
        const res = await validate()
        if (!res.outOfDate) {
          const formData = (toRaw(ruleForm))
          loading.value = true
          const { data } = await register(formData.username, formData.password)
          if (data.errno === 0) {
            message.success('注册成功', 1, () => {
              router.push('/login')
            })
          } else if (data.errno === 10001) {
            message.error(data.message)
          } else if (data.errno === 10002) {
            message.error(data.message)
          }
          loading.value = false
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
      validate,
      checkUserName,
      loading
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
.register {
  width: 100%;
  margin: 0 auto;
  padding-top: 80px;
  .to-login {
    text-align: center;
    a {
      color: #1890ff;
    }
  }
  .register-title {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .register-form {
    width: 500px;
    margin: 0 auto;
  }
}
</style>
