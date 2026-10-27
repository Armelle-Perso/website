import type { MetadataRoute } from 'next'

// Search engines stay welcome; crawlers that collect content to train AI
// models are asked to stay away. Polite bots respect this, others ignore it.
const AI_TRAINING_BOTS = [
  'GPTBot',
  'CCBot',
  'Google-Extended',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'Bytespider',
  'Applebot-Extended',
  'meta-externalagent',
  'FacebookBot',
  'Amazonbot',
  'cohere-ai',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
  'Timpibot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_TRAINING_BOTS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/studio', '/api'] },
    ],
  }
}
