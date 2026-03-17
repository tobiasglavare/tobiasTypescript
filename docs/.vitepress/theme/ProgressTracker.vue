<script setup>
const chapters = [
  { num: 1, name: 'JS Fundamentals', done: 5, total: 5 },
  { num: 2, name: 'TypeScript Basics', done: 10, total: 10 },
  { num: 3, name: 'Arrays & Functional', done: 6, total: 6 },
  { num: 4, name: 'Async Programming', done: 4, total: 4 },
  { num: 5, name: 'Generics', done: 2, total: 2 },
  { num: 6, name: 'Advanced Types', done: 2, total: 4 },
  { num: 7, name: 'OOP & Classes', done: 0, total: 0 },
  { num: 8, name: 'Errors & Modules', done: 0, total: 0 },
  { num: 9, name: 'CLI Tool', done: 0, total: 1 },
  { num: 10, name: 'API Server', done: 0, total: 1 },
  { num: 11, name: 'Testing', done: 0, total: 1 },
  { num: 12, name: 'Advanced Patterns', done: 0, total: 1 },
]

const totalDone = chapters.reduce((s, c) => s + c.done, 0)
const totalAll = chapters.reduce((s, c) => s + c.total, 0)
const overallPercent = Math.round((totalDone / totalAll) * 100)

const percent = (ch) => ch.total === 0 ? 0 : Math.round((ch.done / ch.total) * 100)
</script>

<template>
  <div class="progress-tracker">
    <h2 class="tracker-title">Learning Progress</h2>

    <div class="overall-bar-container">
      <div class="overall-bar" :style="{ width: overallPercent + '%' }"></div>
      <span class="overall-label">{{ totalDone }}/{{ totalAll }} exercises ({{ overallPercent }}%)</span>
    </div>

    <div class="chapter-list">
      <div v-for="ch in chapters" :key="ch.num" class="chapter-row">
        <div class="chapter-info">
          <span class="chapter-num">{{ ch.num }}.</span>
          <span class="chapter-name">{{ ch.name }}</span>
          <span class="chapter-count">{{ ch.done }}/{{ ch.total }}</span>
        </div>
        <div class="bar-bg">
          <div
            class="bar-fill"
            :class="{ complete: percent(ch) === 100, active: percent(ch) > 0 && percent(ch) < 100 }"
            :style="{ width: percent(ch) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-tracker {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.tracker-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.overall-bar-container {
  position: relative;
  width: 100%;
  height: 30px;
  background: var(--vp-c-bg-soft);
  border-radius: 15px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.overall-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  border-radius: 15px;
  transition: width 0.6s ease;
}

.overall-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chapter-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.chapter-num {
  font-weight: 700;
  color: var(--vp-c-text-2);
  min-width: 1.8rem;
}

.chapter-name {
  flex: 1;
  color: var(--vp-c-text-1);
}

.chapter-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 600;
}

.bar-bg {
  width: 100%;
  height: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
  background: var(--vp-c-divider);
}

.bar-fill.complete {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.bar-fill.active {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>
