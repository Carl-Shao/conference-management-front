import api from './api'

export function getMeetingList(userId) {
  return api.get(`/meetings?userId=${userId}`)
}

export function getMeetingById(id) {
  return api.get(`/meetings/${id}`)
}

export function startMeeting(id) {
  return api.post(`/meetings/${id}/start`)
}

export function endMeeting(id) {
  return api.post(`/meetings/${id}/end`)
}

export function getHistoryMeetings(userId) {
  return api.get(`/meetings/history?userId=${userId}`)
}

export function getHistoryMeetingById(id) {
  return api.get(`/meetings/${id}`)
}

export function startTranscription(id) {
  return api.post(`/meetings/${id}/transcription/start`)
}

export function stopTranscription(id) {
  return api.post(`/meetings/${id}/transcription/stop`)
}
