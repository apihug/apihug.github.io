import { createPageList } from '@/utils/createPageList'

const pages = createPageList(
  require.context(`../pages/docs/?meta=title,shortTitle,published`, false, /\.mdx$/),
  'docs'
)

export const documentationNav = {
  'Getting Started': [
    {
      title: 'Intro',
      href: '/docs/start/what-is-apihug',
    },
    {
      title: 'Quick start',
      href: '/docs/start',
    },
  ],
  "Editor": [
    {title: 'Intro', href: '/docs/idea',},
    {title: 'Install Plugin', href: '/docs/idea/001-install-plugin',},
    {title: 'Start Project', href: '/docs/idea/002-start-project',},
    {title: 'Tool Window', href: '/docs/idea/003-tool-window',},
    {title: 'Service', href: '/docs/idea/004-service-api-collection',},
    {title: 'Api', href: '/docs/idea/005-api-detail',},
    {title: 'Component', href: '/docs/idea/006-components',},
    {title: 'Constant', href: '/docs/idea/007-constants',},
    {title: 'Error', href: '/docs/idea/008-errors',},
    {title: 'Entity', href: '/docs/idea/009-entity',},
    {title: 'Stub', href: '/docs/idea/010-stub',},
    {title: 'Test', href: '/docs/idea/011-test',},
    {title: 'Settings Server', href: '/docs/idea/012-settings-server',},
    {title: 'Settings Export', href: '/docs/idea/013-settings-export',},
    {title: 'Settings Knowledge', href: '/docs/idea/014-settings-knowledge',},
    {title: 'Editor', href: '/docs/idea/015-editor',},
  ],
  "Protocol Buffers": [
    {title: 'Intro', href: '/docs/protobuf'},
    {title: 'Protobuf & OAS', href: '/docs/protobuf/proto-oas'},
    {title: 'Protobuf Option', href: '/docs/protobuf/proto-option'},
  ],
  "Framework": [
    {title: 'Intro', href: '/docs/framework'},
    {title: 'Spring Common', href: '/docs/framework/spring-common'},
    {title: 'Spring Core', href: '/docs/framework/spring-core'},
    {title: 'Spring Data', href: '/docs/framework/spring-data'},
    {title: 'Spring Security', href: '/docs/framework/spring-security'},
  ],
  "Tool Chain": [
    {title: 'Intro', href: '/docs/tool'},
    {title: 'Wire', href: '/docs/tool/gradle-wire'},
    {title: 'Stub', href: '/docs/tool/gradle-stub'},
  ],
  "How": [
    {title: 'Upload File', href: '/docs/how/001_support_upload_file'},
    {title: 'Update Header & Cookie', href: '/docs/how/002_update_header_cookie'},
  ],
  Milestone:[
    {title: 'Milestone-20240510', href: '/docs/milestone/milestone-20240510'},
    {title: 'Milestone-20240222', href: '/docs/milestone/milestone-20240222'},
  ],
  "ChangeLog":[
    {title: 'SDK', href: '/docs/changelog/sdk'},
    {title: 'Plugin', href: '/docs/changelog/plugin'},
  ],
  'Core Principles': [
    {title: 'Empathy is Important', href: '/docs/principles/empathy-is-important',},
    {title: 'Common Language', href: '/docs/principles/common-language',},
    {title: 'Single Source Of Truth', href: '/docs/principles/single-source-of-truth',},
    {title: 'Leverage & Integration', href: '/docs/principles/leverage-integration',}
  ]
}
