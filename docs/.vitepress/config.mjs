import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import { 
  GitChangelog
, 
  GitChangelogMarkdownSection
, 
} from '@nolebase/vitepress-plugin-git-changelog/vite'

// https://vitepress.dev/reference/site-config
export default withMermaid(

    defineConfig({

    vite: { 
      plugins: [ 
        GitChangelog
    ({ 
          // Fill in your repository URL here
          repoURL: () => 'https://github.com/edythecow/vitepress', 
        }), 
        GitChangelogMarkdownSection(), 
      ],
    }, 


    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: "mermaid my-class", // set additional css classes for parent container 
    },


    title: "Arkivverket Docs",
    description: "Public documentation from Arkivverket",
    base: '/vitepress',
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      //logo: '',


      editLink: {
        pattern: 'https://github.com/edythecow/vitepress/edit/main/docs/:path'
      },

      lastUpdated: true,
      //appearance: dark,
      //http://localhost:5173/vitepress/
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