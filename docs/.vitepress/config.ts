import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

const enNav = [
  { text: 'Guide', link: '/en/what-is-agent-runtime' },
  { text: 'Specification', link: '/en/specification' },
  { text: 'Examples', link: '/en/examples/basic-runtime-adapter' },
  {
    text: 'Version',
    items: [
      { text: 'latest', link: '/en/specification' },
      { text: 'v0.1.0 overview', link: '/en/versions/v0.1.0/overview' },
      { text: 'v0.1.0', link: '/en/versions/v0.1.0/specification' }
    ]
  }
]

const zhNav = [
  { text: '指南', link: '/zh/what-is-agent-runtime' },
  { text: '规范', link: '/zh/specification' },
  { text: '示例', link: '/zh/examples/basic-runtime-adapter' },
  {
    text: '版本',
    items: [
      { text: 'latest', link: '/zh/specification' },
      { text: 'v0.1.0 概览', link: '/zh/versions/v0.1.0/overview' },
      { text: 'v0.1.0', link: '/zh/versions/v0.1.0/specification' }
    ]
  }
]

const enSidebar = [
  {
    text: 'Start here',
    items: [
      { text: 'Overview', link: '/en/' },
      { text: 'What is Agent Runtime?', link: '/en/what-is-agent-runtime' },
      { text: 'Specification', link: '/en/specification' }
    ]
  },
  {
    text: 'Concepts',
    items: [
      { text: 'Runtime model', link: '/en/concepts/runtime-model' }
    ]
  },
  {
    text: 'Contracts',
    items: [
      { text: 'Runtime event stream', link: '/en/contracts/runtime-event-stream' },
      { text: 'Control plane', link: '/en/contracts/control-plane' },
      { text: 'Tool and context', link: '/en/contracts/tool-context-capabilities' },
      { text: 'State snapshots', link: '/en/contracts/state-snapshots' },
      { text: 'Evidence and replay', link: '/en/contracts/evidence-replay' }
    ]
  },
  {
    text: 'For implementors',
    items: [
      { text: 'Implementation quickstart', link: '/en/authoring/quickstart' },
      { text: 'Acceptance scenarios', link: '/en/authoring/acceptance-scenarios' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Glossary', link: '/en/reference/glossary' },
      { text: 'Ecosystem boundaries', link: '/en/reference/ecosystem-boundaries' },
      { text: 'Research sources', link: '/en/reference/research-sources' }
    ]
  },
  {
    text: 'Examples',
    items: [
      { text: 'Basic runtime adapter', link: '/en/examples/basic-runtime-adapter' }
    ]
  },
  {
    text: 'Versions',
    items: [
      { text: 'v0.1.0 overview', link: '/en/versions/v0.1.0/overview' },
      { text: 'v0.1.0 specification', link: '/en/versions/v0.1.0/specification' },
      { text: 'v0.1.0 changelog', link: '/en/versions/v0.1.0/changelog' }
    ]
  }
]

const zhSidebar = [
  {
    text: '开始',
    items: [
      { text: '概览', link: '/zh/' },
      { text: '什么是 Agent Runtime', link: '/zh/what-is-agent-runtime' },
      { text: '规范', link: '/zh/specification' }
    ]
  },
  {
    text: '概念',
    items: [
      { text: '运行时模型', link: '/zh/concepts/runtime-model' }
    ]
  },
  {
    text: '契约',
    items: [
      { text: 'Runtime event stream', link: '/zh/contracts/runtime-event-stream' },
      { text: 'Control plane', link: '/zh/contracts/control-plane' },
      { text: 'Tool 与 context', link: '/zh/contracts/tool-context-capabilities' },
      { text: 'State snapshots', link: '/zh/contracts/state-snapshots' },
      { text: 'Evidence 与 replay', link: '/zh/contracts/evidence-replay' }
    ]
  },
  {
    text: '实现者',
    items: [
      { text: '快速开始', link: '/zh/authoring/quickstart' },
      { text: '验收场景', link: '/zh/authoring/acceptance-scenarios' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '术语表', link: '/zh/reference/glossary' },
      { text: '生态边界', link: '/zh/reference/ecosystem-boundaries' },
      { text: '调研来源', link: '/zh/reference/research-sources' }
    ]
  },
  {
    text: '示例',
    items: [
      { text: '基础 runtime adapter', link: '/zh/examples/basic-runtime-adapter' }
    ]
  },
  {
    text: '版本',
    items: [
      { text: 'v0.1.0 概览', link: '/zh/versions/v0.1.0/overview' },
      { text: 'v0.1.0 规范', link: '/zh/versions/v0.1.0/specification' },
      { text: 'v0.1.0 变更记录', link: '/zh/versions/v0.1.0/changelog' }
    ]
  }
]

export default defineConfig({
  base,
  title: 'Agent Runtime',
  description: 'A portable standard for agent execution runtimes.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'English', items: enNav },
      { text: '中文', items: zhNav }
    ],
    sidebar: {
      '/en/': enSidebar,
      '/zh/': zhSidebar
    },
    search: { provider: 'local' },
    footer: {
      message: 'Draft standard for portable agent execution runtimes.',
      copyright: 'Copyright © 2026'
    }
  },
  markdown: {
    lineNumbers: true,
    config(md) {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const language = token.info.trim().split(/\s+/)[0]

        if (language === 'mermaid') {
          const encoded = encodeURIComponent(token.content)
          return `<ClientOnly><MermaidDiagram code="${encoded}" /></ClientOnly>`
        }

        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    }
  }
})
