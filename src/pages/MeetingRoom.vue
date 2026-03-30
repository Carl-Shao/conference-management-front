<template>
  <div class="meeting-room-page">
    <Header />
    
    <div class="page-content">
      <div class="meeting-header">
        <h2>{{ meeting.title }}</h2>
        <div class="meeting-info">
          <el-tag type="info">{{ meeting.roomName }}</el-tag>
          <span>{{ meeting.date }} {{ meeting.startTime }} - {{ meeting.endTime }}</span>
          <el-tag :type="meeting.status === 'active' ? 'success' : 'info'">
            {{ meeting.status === 'active' ? '进行中' : '已结束' }}
          </el-tag>
        </div>
      </div>
      
      <div class="meeting-content">
        <div class="transcript-panel">
          <TranscriptPanel :transcript="transcript" />
        </div>
        
        <div class="meeting-controls">
          <!-- 秘书显示会议控制 -->
          <template v-if="isSecretary">
            <h3>会议控制</h3>
            <div class="control-buttons">
              <el-button 
                type="primary" 
                @click="startMeeting"
                :disabled="meeting.status === 'active'"
              >
                <el-icon><VideoCamera /></el-icon>
                开始会议
              </el-button>
              <el-button 
                type="success" 
                @click="endMeeting"
                :disabled="meeting.status !== 'active'"
              >
                <el-icon><Check /></el-icon>
                结束会议
              </el-button>
            </div>
          </template>
          
          <!-- 参与者显示笔记栏 -->
          <template v-else>
            <h3>会议笔记</h3>
            <div class="notes-section">
              <el-input
                v-model="notes"
                type="textarea"
                :rows="8"
                placeholder="在这里记录会议中重要的内容..."
                resize="none"
              />
              <el-button type="primary" style="margin-top: 10px; width: 100%;">
                <el-icon><Save /></el-icon>
                保存笔记
              </el-button>
            </div>
          </template>
          
          <div class="participants">
            <h4>参会人员</h4>
            <div class="participants-grid">
              <div v-for="(participant, index) in participants" :key="index" class="participant-card">
                <el-avatar :size="40">{{ participant.name.charAt(0) }}</el-avatar>
                <div class="participant-info">
                  <div class="participant-name">{{ participant.name }}</div>
                  <div class="participant-department">{{ participant.department }}</div>
                </div>
                <el-tag size="small" type="success">在线</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import TranscriptPanel from '../components/TranscriptPanel.vue'
import { getMeetingById, startMeeting as startMeetingApi, endMeeting as endMeetingApi } from '../services/meeting'
import { getRealtimeTranscript } from '../services/transcript'
import { getUser } from '../utils/storage'

const router = useRouter()
const route = useRoute()
const meetingId = route.params.id

const meeting = ref({
  id: meetingId,
  title: '加载中...',
  roomId: 1,
  roomName: '加载中...',
  date: '',
  startTime: '',
  endTime: '',
  participants: [],
  status: 'scheduled',
  description: ''
})

const transcript = ref([])
const notes = ref('')
const ws = ref(null)
const transcriptTimer = ref(null)

// 获取当前用户信息
const currentUser = computed(() => getUser())

// 判断是否为秘书
const isSecretary = computed(() => {
  return currentUser.value && currentUser.value.role === 'secretary'
})

// 用户数据映射，与后端users.py中的数据对应
const userMap = {
  'E001': { id: 'E001', name: '张三', department: '技术部' },
  'E002': { id: 'E002', name: '李四', department: '技术部' },
  'E003': { id: 'E003', name: '王五', department: '产品部' },
  'E004': { id: 'E004', name: '赵六', department: '设计部' },
  'E005': { id: 'E005', name: '钱七', department: '市场部' },
  'E006': { id: 'E006', name: '孙八', department: '人事部' },
  'E007': { id: 'E007', name: '周九', department: '财务部' },
  'E008': { id: 'E008', name: '吴十', department: '技术部' },
  'E009': { id: 'E009', name: '郑十一', department: '产品部' },
  'E010': { id: 'E010', name: '王十二', department: '行政部' },
  'E011': { id: 'E011', name: '陈小明', department: '技术部' },
  'E012': { id: 'E012', name: '林小红', department: '设计部' },
  'E013': { id: 'E013', name: '黄大伟', department: '市场部' },
  'E014': { id: 'E014', name: '刘芳芳', department: '人事部' },
  'E015': { id: 'E015', name: '杨志强', department: '财务部' },
  'admin': { id: 'admin', name: '管理员', department: '行政部' }
}

// 计算参会人员详细信息
const participants = computed(() => {
  return meeting.value.participants.map(participantId => {
    return userMap[participantId] || { id: participantId, name: '未知用户', department: '未知部门' }
  })
})



const fetchMeeting = async () => {
  try {
    const res = await getMeetingById(meetingId)
    if (res.code === 200) {
      meeting.value = res.data
    } else {
      // 使用模拟数据
      meeting.value = {
        id: meetingId,
        title: '产品需求评审会',
        roomId: 2,
        roomName: '会议室B',
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '16:00',
        participants: ['E001', 'E002', 'E003'],
        status: 'active',
        description: '讨论新产品功能需求'
      }
    }
  } catch (error) {
    console.log('使用模拟数据')
    meeting.value = {
      id: meetingId,
      title: '产品需求评审会',
      roomId: 2,
      roomName: '会议室B',
      date: '2024-01-20',
      startTime: '14:00',
      endTime: '16:00',
      participants: ['E001', 'E002', 'E003'],
      status: 'active',
      description: '讨论新产品功能需求'
    }
  }
}



const startMeeting = async () => {
  try {
    const res = await startMeetingApi(meetingId)
    if (res.code === 200) {
      ElMessage.success('会议已开始')
      // 更新会议状态
      meeting.value.status = 'active'
      // 开始转录
      transcript.value = []
      // 启动实时转录定时器
      startTranscriptTimer()
    } else {
      ElMessage.error('开始会议失败')
    }
  } catch (error) {
    console.log('使用模拟数据')
    ElMessage.success('会议已开始')
    // 更新会议状态
    meeting.value.status = 'active'
    // 开始转录
    transcript.value = []
    // 启动实时转录定时器
    startTranscriptTimer()
  }
}

const startTranscriptTimer = () => {
  // 清除已存在的定时器
  if (transcriptTimer.value) {
    clearInterval(transcriptTimer.value)
  }
  
  console.log('🔵 开始转录定时器，roomId:', meeting.value.roomId)
  
  // 每 2 秒获取一次实时转录结果
  transcriptTimer.value = setInterval(async () => {
    try {
      const roomId = String(meeting.value.roomId)
      if (roomId) {
        console.log('🔄 请求实时转录，roomId:', roomId)
        const res = await getRealtimeTranscript(roomId)
        console.log('📥 收到转录响应:', res)
        if (res.code === 200 && res.data.transcript.length > 0) {
          // 过滤掉已存在的转录内容
          const existingContents = new Set(transcript.value.map(t => t.content))
          const newTranscripts = res.data.transcript.filter(t => !existingContents.has(t.content))
          
          console.log('🆕 新增转录数量:', newTranscripts.length)
          if (newTranscripts.length > 0) {
            // 更新转录数据
            transcript.value = [...transcript.value, ...newTranscripts]
            console.log(`📝 当前共 ${transcript.value.length} 条转录`)
          }
        }
      }
    } catch (error) {
      console.log('❌ 获取实时转录失败:', error)
    }
  }, 2000)
}

const endMeeting = async () => {
  try {
    // 停止转录定时器
    if (transcriptTimer.value) {
      clearInterval(transcriptTimer.value)
      transcriptTimer.value = null
    }
    
    const res = await endMeetingApi(meetingId)
    if (res.code === 200) {
      ElMessage.success('会议已结束')
      router.push('/history-list')
    } else {
      ElMessage.error('结束会议失败')
    }
  } catch (error) {
    console.log('使用模拟数据')
    // 停止转录定时器
    if (transcriptTimer.value) {
      clearInterval(transcriptTimer.value)
      transcriptTimer.value = null
    }
    ElMessage.success('会议已结束')
    router.push('/history-list')
  }
}

onMounted(() => {
  fetchMeeting()
  // 页面加载后，检查会议状态
  // 如果会议已经是进行中的，自动启动转录定时器
  setTimeout(() => {
    if (meeting.value.status === 'active') {
      console.log('📋 会议已是进行中状态，自动启动转录定时器')
      startTranscriptTimer()
    }
  }, 500)
})

onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
  if (transcriptTimer.value) {
    clearInterval(transcriptTimer.value)
    transcriptTimer.value = null
  }
})
</script>

<style scoped>
.meeting-room-page {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.page-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.meeting-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.meeting-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.meeting-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.meeting-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.transcript-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 500px;
  overflow: hidden;
}

.transcript-panel h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.meeting-controls {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.meeting-controls h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.participants h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.participants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.participant-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 8px;
  flex: 1 1 180px;
  min-width: 180px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.participant-info {
  flex: 1;
  min-width: 0;
}

.participant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participant-department {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notes-section {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notes-section .el-textarea {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.notes-section .el-textarea__inner {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

@media (max-width: 768px) {
  .participant-card {
    flex: 1 1 100%;
  }
}

@media (max-width: 768px) {
  .meeting-content {
    grid-template-columns: 1fr;
  }
}
</style>