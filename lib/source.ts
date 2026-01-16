import { docs, blog, aid } from '../apps/docs/.source/server';
import { loader } from 'fumadocs-core/source';
import { createIconHandler } from '../apps/docs/lib/icon-handler';

const icon = createIconHandler();

// Community docs
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon,
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
  icon,
  
});
