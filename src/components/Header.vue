<template>
  <div class="header-container">
    <div class="left">
      <span class="title">会议纪要助手</span>
    </div>
    <div class="right">
      <div class="nav-items">
        <div class="nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
          <el-icon><Calendar /></el-icon>
          <span>会议列表</span>
        </div>
        <div class="nav-item" :class="{ active: route.path === '/history-list' }" @click="router.push('/history-list')">
          <el-icon><Clock /></el-icon>
          <span>历史会议</span>
        </div>
        <div class="user-info">
          <el-avatar :size="32" icon="UserFilled" />
          <span class="username">{{ user?.name || '用户' }}</span>
          <el-tag :type="user?.role === 'secretary' ? 'primary' : 'info'" size="small">
            {{ user?.role === 'secretary' ? '秘书' : '参与者' }}
          </el-tag>
          <el-button 
            type="text" 
            @click="handleLogout"
          >
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUser, clearAuth } from '../utils/storage'

const router = useRouter()
const route = useRoute()
const user = computed(() => getUser())

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    clearAuth()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.left .title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.right {
  display: flex;
  align-items: center;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 15px;
  height: 60px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  color: #409EFF;
  border-bottom-color: #409EFF;
  background-color: #ecf5ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  border-left: 1px solid #e4e7ed;
  margin-left: 10px;
}

.username {
  color: #333;
}
</style>
