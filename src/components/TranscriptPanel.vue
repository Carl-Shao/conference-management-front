<template>
  <div class="transcript-panel">
    <div class="panel-header">
      <h3>实时会议纪要</h3>
    </div>
    
    <div class="transcript-content" ref="transcriptContent">
      <div v-if="transcript.length === 0" class="empty-transcript">
        <el-icon class="empty-icon"><ChatLineRound /></el-icon>
        <p>会议开始后，这里会显示实时会议纪要</p>
      </div>
      <div 
        v-for="(item, index) in transcript" 
        :key="index"
        class="transcript-item"
      >
        <div class="transcript-time">{{ item.time }}</div>
        <div class="transcript-speaker">{{ item.speaker }}：</div>
        <div class="transcript-text">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  transcript: {
    type: Array,
    default: () => []
  }
})

const transcriptContent = ref(null)

// 监听transcript变化，自动滚动到底部
watch(() => props.transcript.length, () => {
  setTimeout(() => {
    if (transcriptContent.value) {
      transcriptContent.value.scrollTop = transcriptContent.value.scrollHeight
    }
  }, 100)
}, { immediate: true })

onMounted(() => {
  // 初始滚动到底部
  setTimeout(() => {
    if (transcriptContent.value) {
      transcriptContent.value.scrollTop = transcriptContent.value.scrollHeight
    }
  }, 100)
})
</script>

<style scoped>
.transcript-panel {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f9f9f9;
  border-radius: 8px 8px 0 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.transcript-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 300px;
}

.empty-transcript {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.transcript-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.transcript-time {
  width: 80px;
  color: #909399;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.transcript-speaker {
  font-weight: 500;
  margin-right: 10px;
  flex-shrink: 0;
  color: #333;
}

.transcript-text {
  flex: 1;
  line-height: 1.5;
  color: #666;
}

.transcript-content::-webkit-scrollbar {
  width: 6px;
}

.transcript-content::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.transcript-content::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
