<script setup>
const chapters = [
  { num: 1, name: 'JS Fundamentals', status: 'done' },
  { num: 2, name: 'TypeScript Basics', status: 'done' },
  { num: 3, name: 'Arrays & Functional', status: 'done' },
  { num: 4, name: 'Async Programming', status: 'done' },
  { num: 5, name: 'Generics', status: 'done' },
  { num: 6, name: 'Advanced Types', status: 'in-progress' },
  { num: 7, name: 'OOP & Classes', status: 'todo' },
  { num: 8, name: 'Errors & Modules', status: 'todo' },
  { num: 9, name: 'CLI Tool', status: 'todo' },
  { num: 10, name: 'API Server', status: 'todo' },
  { num: 11, name: 'Testing', status: 'todo' },
  { num: 12, name: 'Advanced Patterns', status: 'todo' },
]

const doneCount = chapters.filter(c => c.status === 'done').length
const percent = Math.round((doneCount / chapters.length) * 100)

const statusIcon = (status) => {
  if (status === 'done') return '✅'
  if (status === 'in-progress') return '🔄'
  return '⬜'
}

const statusClass = (status) => {
  if (status === 'done') return 'done'
  if (status === 'in-progress') return 'in-progress'
  return 'todo'
}
</script>

<template>
  <div class="progress-tracker">
    <h2 class="tracker-title">Learning Progress</h2>
    
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: percent + '%' }"></div>
      <span class="progress-label">{{ doneCount }}/{{ chapters.length }} chapters ({{ percent }}%)</span>
    </div>

    <div class="chapter-grid">
      <div
        v-for="ch in chapters"
        :key="ch.num"
        class="chapter-card"
        :class="statusClass(ch.status)"
      >
        <div class="chapter-num">{{ ch.num }}</div>
        <div class="chapter-name">{{ ch.name }}</div>
        <div class="chapter-icon">{{ statusIcon(ch.status) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-tracker {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.tracker-title {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.progress-bar-container {
  position: relative;
  width: 100%;
  height: 32px;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 16px;
  transition: width 0.6s ease;
}

.progress-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.chapter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.75rem;
  border-radius: 12px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: transform 0.2s, border-color 0.2s;
}

.chapter-card:hover {
  transform: translateY(-2px);
}

.chapter-card.done {
  border-color: #10b981;
}

.chapter-card.in-progress {
  border-color: #f59e0b;
  animation: pulse-border 2s infinite;
}

.chapter-card.todo {
  opacity: 0.6;
}

.chapter-num {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.chapter-name {
  font-size: 0.8rem;
  text-align: center;
  color: var(--vp-c-text-2);
  margin: 0.25rem 0;
}

.chapter-icon {
  font-size: 1.2rem;
  margin-top: 0.25rem;
}

@keyframes pulse-border {
  0%, 100% { border-color: #f59e0b; }
  50% { border-color: #fbbf24; }
}
</style>
