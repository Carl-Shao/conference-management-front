<template>
  <div class="history-detail-page">
    <Header />
    
    <div class="page-content">
      <div class="meeting-header">
        <h2>{{ meeting.title }}</h2>
        <div class="meeting-info">
          <el-tag type="info">{{ meeting.roomName }}</el-tag>
          <span>{{ meeting.date }} {{ meeting.startTime }} - {{ meeting.endTime }}</span>
          <el-tag type="success">已结束</el-tag>
        </div>
        <p class="description">{{ meeting.description }}</p>
      </div>
      
      <div class="meeting-content">
        <div class="recording-section">
          <h3>会议录音</h3>
          <AudioPlayer :recordingUrl="meeting.recordingUrl" />
        </div>
        
        <div class="transcript-section">
          <h3>会议纪要</h3>
          <div class="transcript-content">
            <div v-if="meeting.minutes" class="meeting-minutes" v-html="renderedMinutes"></div>
            <div v-else class="empty-minutes">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p>会议纪要生成中或不存在</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="downloadTranscript">
          <el-icon><Download /></el-icon>
          下载会议纪要
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import { getHistoryMeetingById } from '../services/meeting'

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
  status: 'completed',
  description: '',
  recordingUrl: '',
  transcriptUrl: '',
  minutes: ''
})

// 计算属性：渲染会议纪要
const renderedMinutes = computed(() => {
  if (!meeting.value.minutes) return ''
  
  // 简单的Markdown渲染
  let html = meeting.value.minutes
  
  // 标题处理
  html = html.replace(/^# (.*$)/gm, '<h1 class="minutes-h1">$1</h1>')
  html = html.replace(/^## (.*$)/gm, '<h2 class="minutes-h2">$1</h2>')
  
  // 列表处理
  html = html.replace(/^- (.*$)/gm, '<li class="minutes-list-item">$1</li>')
  html = html.replace(/(<li class="minutes-list-item">.*<\/li>)/gs, '<ul class="minutes-list">$1</ul>')
  
  // 段落处理
  html = html.replace(/^(?!<h|\s*$)(.*$)/gm, '<p class="minutes-paragraph">$1</p>')
  
  return html
})

const fetchMeeting = async () => {
  try {
    const res = await getHistoryMeetingById(meetingId)
    if (res.code === 200) {
      // 获取会议数据
      const meetingData = res.data
      // 添加roomName字段
      const roomNames = {
        1: '会议室A',
        2: '会议室B',
        3: '会议室C',
        4: '会议室D',
        5: '会议室E'
      }
      meetingData.roomName = roomNames[meetingData.roomId] || '未知会议室'
      // 更新会议数据
      meeting.value = meetingData
    } else {
      // 使用空数据
      meeting.value = {
        id: meetingId,
        title: '加载失败',
        roomId: 0,
        roomName: '未知会议室',
        date: '',
        startTime: '',
        endTime: '',
        participants: [],
        status: 'completed',
        description: '',
        recordingUrl: '',
        transcriptUrl: '',
        minutes: ''
      }
    }
  } catch (error) {
    console.log('获取会议失败:', error)
    // 使用空数据
    meeting.value = {
      id: meetingId,
      title: '加载失败',
      roomId: 0,
      roomName: '未知会议室',
      date: '',
      startTime: '',
      endTime: '',
      participants: [],
      status: 'completed',
      description: '',
      recordingUrl: '',
      transcriptUrl: '',
      minutes: ''
    }
  }
}

const goBack = () => {
  router.push('/history-list')
}

const downloadTranscript = () => {
  // 模拟下载
  ElMessage.success('会议纪要已开始下载')
}

onMounted(() => {
  fetchMeeting()
})
</script>

<style scoped>
.history-detail-page {
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
  margin-bottom: 10px;
}

.description {
  margin: 10px 0 0 0;
  color: #666;
  line-height: 1.5;
}

.meeting-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 20px;
}

.recording-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recording-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.transcript-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
}

.transcript-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.transcript-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transcript-item:last-child {
  border-bottom: none;
}

.transcript-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.speaker {
  margin-left: 10px;
  font-weight: bold;
  color: #333;
}

.time {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}

.transcript-text {
  color: #666;
  line-height: 1.5;
  margin-left: 42px;
}

/* 会议纪要样式 */
.meeting-minutes {
  line-height: 1.6;
  color: #333;
}

.meeting-minutes .minutes-h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: #333;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 10px;
}

.meeting-minutes .minutes-h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #333;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 5px;
}

.meeting-minutes .minutes-list {
  margin: 10px 0 10px 20px;
  padding-left: 0;
}

.meeting-minutes .minutes-list-item {
  margin: 5px 0;
  padding-left: 10px;
  list-style-type: disc;
  list-style-position: outside;
}

.meeting-minutes .minutes-paragraph {
  margin: 10px 0;
  text-align: justify;
}

.empty-minutes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  text-align: center;
}

.empty-minutes .empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .meeting-content {
    grid-template-columns: 1fr;
  }
}
</style>