import DefaultTheme from 'vitepress/theme'
import './custom.css'
// @ts-ignore
import ProgressTracker from './ProgressTracker.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('ProgressTracker', ProgressTracker)
  }
} satisfies Theme
