import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import { GitChangelog, GitChangelogMarkdownSection, } from '@nolebase/vitepress-plugin-git-changelog/vite'

// https://vitepress.dev/reference/site-config
export default withMermaid(

  defineConfig({

    vite: { 
      plugins: [ 
        GitChangelog({ 
          repoURL: () => 'https://github.com/nolebase/integrations', 
        }), 
        GitChangelogMarkdownSection(), 
      ],
    },

    
    // optionally, you can pass MermaidConfig
    mermaid: {
      // options: https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: 'mermaid my-class', // set additional css classes for parent container
    },


    title: "Arkivverket Docs",
    description: "Public docs by Arkivverket",
    base: '/vitepress',
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      //logo: '',


      editLink: {
        pattern: 'https://github.com/edythecow/vitepress/edit/main/docs/:path'
      },

      //appearance: dark,
      search: {
        provider: 'local'
      },

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Documentation', link: '/about' }
      ],

      sidebar: [
        {
          text: 'Introduction',
          items: [
            { text: 'About', link: '/about' },
          ]
        },
        {
          text: 'Terraform / Terragrunt',
          items: [
            { text: 'Infrastructure overview', link: '/infra-overview' },
            { text: 'Deployment examples', link: '/deployment-examples' }
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/EdyTheCow/vitepress' }
      ]

    }
  })
)