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

        <el-form-item prop="code">
          <div class="captcha-container">
            <el-input
              v-model="form.code"
              placeholder="请输入验证码"
              prefix-icon="Key"
              size="large"
              maxlength="4"
              style="flex: 1; margin-right: 10px;"
              @keyup.enter="handleLogin"
            />
            <img
              :src="captchaImg"
              alt="验证码"
              class="captcha-img"
              @click="getCaptcha"
            />
          </div>
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

// 验证码相关
const captchaImg = ref('')
const captchaUuid = ref('')

const form = reactive({
  username: '',
  password: '',
  code: '',  // 验证码字段
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
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 获取验证码
const getCaptcha = async () => {
  try {
    // 尝试Ruoyi框架标准的验证码接口，需要加上API前缀
    const response = await fetch('/api/captchaImage');

    if (response.ok) {
      const data = await response.json();
      if (data.code === 200) {
        // 和ruoyi框架保持一致的返回数据格式
        captchaImg.value = `data:image/jpeg;base64,${data.img}`;
        captchaUuid.value = data.uuid;
      } else {
        ElMessage.error(data.message || '获取验证码失败');
        // 使用占位图片
        captchaImg.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAiIHk9IjI1IiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIj5BQkNBPC90ZXh0Pjwvc3ZnPg==';
        captchaUuid.value = 'demo-uuid';
      }
    } else {
      // 如果响应不成功，使用占位图片
      ElMessage.warning('验证码服务暂不可用');
      captchaImg.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAiIHk9IjI1IiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIj5BQkNBPC90ZXh0Pjwvc3ZnPg==';
      captchaUuid.value = 'demo-uuid';
    }
  } catch (error) {
    console.error('获取验证码错误:', error);
    ElMessage.warning('验证码服务暂不可用，请稍后再试');
    // 使用占位图片
    captchaImg.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAiIHk9IjI1IiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIj5BQkNBPC90ZXh0Pjwvc3ZnPg==';
    captchaUuid.value = 'demo-uuid';
  }
}

// 初始化时获取验证码
getCaptcha()

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await login({
        username: form.username,
        password: form.password,
        code: form.code,
        uuid: captchaUuid.value,
        role: form.role
      })

      if (res.code === 200) {
        setToken(res.data.token)
        setUser(res.data.user)
        ElMessage.success('登录成功')
        // 登录成功后重新获取验证码，防止重复使用
        await getCaptcha()
        router.push('/')
      } else {
        ElMessage.error(res.message || '登录失败')
        // 刷新验证码
        await getCaptcha()
      }
    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败，请检查网络连接')
      // 刷新验证码
      await getCaptcha()
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
  background: linear-gradient(135deg, #2677b1 0%, #143391 100%);
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

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-img {
  width: 100px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.captcha-img:hover {
  opacity: 0.8;
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
