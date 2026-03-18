import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/typescript-journey/',
  title: 'TypeScript Learning Journey',
  description: 'A structured plan to master TypeScript',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes' }
    ],
    sidebar: [
      {
        text: 'Part 1: Foundations',
        collapsed: false,
        items: [
          { text: '1. JS Fundamentals', link: '/01-js-fundamentals' },
          { text: '2. TypeScript Basics', link: '/02-typescript-basics' },
          { text: '3. Arrays & Functional', link: '/03-arrays-functional' },
          { text: '4. Async Programming', link: '/04-async' },
        ]
      },
      {
        text: 'Part 2: Intermediate',
        collapsed: false,
        items: [
          { text: '5. Generics', link: '/05-generics' },
          { text: '6. Advanced Types', link: '/06-advanced-types' },
          { text: '7. OOP & Classes', link: '/07-oop-classes' },
          { text: '8. Errors & Modules', link: '/08-errors-modules' },
        ]
      },
      {
        text: 'Part 3: Projects',
        collapsed: false,
        items: [
          { text: '9. CLI Tool', link: '/09-cli-project' },
          { text: '10. API Server', link: '/10-api-project' },
        ]
      },
      {
        text: 'Part 4: Quality & Advanced',
        collapsed: false,
        items: [
          { text: '11. Testing', link: '/11-testing' },
          { text: '12. Advanced Patterns', link: '/12-advanced-patterns' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})
