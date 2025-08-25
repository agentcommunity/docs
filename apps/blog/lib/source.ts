import { blog } from '../.source';
import { loader } from 'fumadocs-core/source';

export const blogSource = loader({ baseUrl: '/', source: blog.toFumadocsSource() });