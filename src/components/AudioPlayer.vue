<template>
  <div class="audio-player">
    <div class="player-header">
      <h4>会议录音</h4>
      <span class="audio-duration" v-if="duration">{{ formatTime(duration) }}</span>
    </div>
    
    <div class="player-controls">
      <el-button 
        type="primary" 
        circle
        @click="togglePlay"
        :icon="playing ? 'VideoPause' : 'VideoPlay'"
      />
      
      <div class="progress-container">
        <el-slider 
          v-model="currentTime" 
          :min="0" 
          :max="duration" 
          @change="seek"
          class="progress-bar"
          :format-tooltip="formatTime"
        />
      </div>
      
      <span class="current-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  recordingUrl: {
    type: String,
    default: ''
  }
})

const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioElement = ref(null)

const togglePlay = () => {
  if (audioElement.value) {
    if (playing.value) {
      audioElement.value.pause()
    } else {
      audioElement.value.play()
    }
    playing.value = !playing.value
  }
}

const seek = (value) => {
  if (audioElement.value) {
    audioElement.value.currentTime = value
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 创建音频元素
onMounted(() => {
  audioElement.value = new Audio()
  if (props.recordingUrl) {
    audioElement.value.src = props.recordingUrl
  }
  
  // 监听音频元数据加载完成事件，获取真实时长
  audioElement.value.addEventListener('loadedmetadata', () => {
    duration.value = audioElement.value.duration || 0
  })
  
  // 监听时间更新事件
  audioElement.value.addEventListener('timeupdate', () => {
    currentTime.value = audioElement.value.currentTime
  })
  
  // 监听播放结束事件
  audioElement.value.addEventListener('ended', () => {
    playing.value = false
    currentTime.value = 0
  })
  
  // 监听播放开始事件
  audioElement.value.addEventListener('play', () => {
    playing.value = true
  })
  
  // 监听暂停事件
  audioElement.value.addEventListener('pause', () => {
    playing.value = false
  })
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})

// 监听音频URL变化
watch(() => props.recordingUrl, (newUrl) => {
  if (audioElement.value && newUrl) {
    audioElement.value.src = newUrl
    playing.value = false
    currentTime.value = 0
    // 重置时长，等待新的元数据加载
    duration.value = 0
  }
})
</script>

<style scoped>
.audio-player {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.player-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.audio-duration {
  font-size: 12px;
  color: #909399;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-container {
  flex: 1;
}

.progress-bar {
  width: 100%;
}

.current-time {
  font-size: 12px;
  color: #666;
  min-width: 50px;
  text-align: right;
}
</style>
