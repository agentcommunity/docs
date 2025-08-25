import { docs, blog, aid } from '../apps/docs/.source';
import { loader } from 'fumadocs-core/source';

// Community docs
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

// Blog source 
export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
});

// AID docs (local-only)
export const aidSource = loader({
  baseUrl: '/docs/aid',
  source: aid.toFumadocsSource(),
  
});
