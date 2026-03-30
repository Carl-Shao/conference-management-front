import api from './api'

export function getTranscript(meetingId) {
  return api.get(`/transcripts/${meetingId}`)
}

export function getRealtimeTranscript(roomId) {
  return api.get(`/transcripts/realtime/${roomId}`)
}
