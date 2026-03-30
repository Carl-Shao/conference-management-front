<template>
  <div class="history-list-page">
    <Header />
    
    <div class="page-content">
      <div class="page-header">
        <h2>历史会议</h2>
        <el-button type="primary" @click="refreshHistory">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
      
      <el-row :gutter="20" v-loading="loading">
        <el-col :xs="24" :sm="12" :md="8" v-for="meeting in historyMeetings" :key="meeting.id">
          <HistoryCard 
            :meeting="meeting" 
            @view="handleViewHistory"
          />
        </el-col>
      </el-row>
      
      <el-empty v-if="!loading && historyMeetings.length === 0" description="暂无历史会议" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import HistoryCard from '../components/HistoryCard.vue'
import { getHistoryMeetings } from '../services/meeting'
import { getUser } from '../utils/storage'

const router = useRouter()
const loading = ref(false)
const historyMeetings = ref([])

const fetchHistoryMeetings = async () => {
  loading.value = true
  try {
    const user = getUser()
    if (!user) {
      ElMessage.error('用户未登录')
      router.push('/login')
      return
    }
    
    const res = await getHistoryMeetings(user.id)
    if (res.code === 200) {
      // 为会议添加会议室名称
      const meetingsWithRoomName = res.data.map(meeting => {
        const roomNameMap = {
          1: '会议室A',
          2: '会议室B',
          3: '会议室C',
          4: '大会议室',
          5: '会议室D',
          6: '会议室E'
        }
        return {
          ...meeting,
          roomName: roomNameMap[meeting.roomId] || '未知会议室'
        }
      })
      historyMeetings.value = meetingsWithRoomName
    } else {
      ElMessage.error(res.message || '获取历史会议列表失败')
      historyMeetings.value = []
    }
  } catch (error) {
    console.log('使用模拟数据')
    historyMeetings.value = []
  } finally {
    loading.value = false
  }
}

const refreshHistory = () => {
  fetchHistoryMeetings()
  ElMessage.success('历史会议列表已刷新')
}

const handleViewHistory = (meeting) => {
  router.push(`/history-detail/${meeting.id}`)
}

onMounted(() => {
  fetchHistoryMeetings()
})
</script>

<style scoped>
.history-list-page {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.page-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}
</style>