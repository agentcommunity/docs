import { docs, blog } from '../apps/docs/.source/server';
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
