import { blog } from '../.source/server';
import { loader } from 'fumadocs-core/source';

export const blogSource = loader({ baseUrl: '/', source: blog.toFumadocsSource() });
