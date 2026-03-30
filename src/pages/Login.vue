<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>会议纪要助手</h1>
        <p>操作端登录</p>
      </div>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="role">
          <el-radio-group v-model="form.role" size="large">
            <el-radio-button label="secretary">秘书</el-radio-button>
            <el-radio-button label="participant">参与者</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tips">
        <p>测试账号：</p>
        <p>秘书：admin / 123456 或 sunba / 123456 或 wang12 / 123456</p>
        <p>参与者：zhangsan / 123456 或 lisi / 123456 或 wangwu / 123456 等</p>
        <p>所有账号密码均为 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../services/auth'
import { setToken, setUser } from '../utils/storage'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  role: 'participant'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度不能少于4位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      const res = await login({
        username: form.username,
        password: form.password,
        role: form.role
      })
      
      if (res.code === 200) {
        setToken(res.data.token)
        setUser(res.data.user)
        ElMessage.success('登录成功')
        router.push('/')
      } else {
        ElMessage.error(res.message || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败，请检查网络连接')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px 0;
}

.login-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
}

.login-tips {
  text-align: center;
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}

.login-tips p {
  margin: 4px 0;
}
</style>
