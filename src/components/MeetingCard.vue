<template>
  <el-card class="meeting-card" :class="{ 'is-active': meeting.status === 'active' }">
    <template #header>
      <div class="card-header">
        <span class="meeting-title">{{ meeting.title }}</span>
        <el-tag :type="statusType" size="small">
          {{ statusText }}
        </el-tag>
      </div>
    </template>
    
    <div class="meeting-info">
      <div class="info-item">
        <el-icon><Calendar /></el-icon>
        <span>{{ meeting.date }}</span>
      </div>
      <div class="info-item">
        <el-icon><Clock /></el-icon>
        <span>{{ meeting.startTime }} - {{ meeting.endTime }}</span>
      </div>
      <div class="info-item">
        <el-icon><OfficeBuilding /></el-icon>
        <span>{{ meeting.roomName || '未分配会议室' }}</span>
      </div>
      <div class="info-item">
        <el-icon><User /></el-icon>
        <span>参会人数：{{ meeting.participants?.length || 0 }}人</span>
      </div>
    </div>
    
    <div class="meeting-actions">
      <el-button 
        type="primary" 
        size="small"
        @click="$emit('join', meeting)"
        :disabled="meeting.status !== 'scheduled' && meeting.status !== 'active'"
      >
        进入会议
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meeting: {
    type: Object,
    required: true
  }
})

defineEmits(['join'])

const statusType = computed(() => {
  switch (props.meeting.status) {
    case 'scheduled':
      return 'info'
    case 'active':
      return 'success'
    case 'completed':
      return 'default'
    default:
      return 'info'
  }
})

const statusText = computed(() => {
  switch (props.meeting.status) {
    case 'scheduled':
      return '未开始'
    case 'active':
      return '进行中'
    case 'completed':
      return '已结束'
    default:
      return '未知状态'
  }
})
</script>

<style scoped>
.meeting-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.meeting-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.meeting-card.is-active {
  border-left: 4px solid #409EFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meeting-title {
  font-size: 16px;
  font-weight: 500;
}

.meeting-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.info-item .el-icon {
  margin-right: 8px;
  color: #909399;
}

.meeting-actions {
  text-align: right;
}
</style>
