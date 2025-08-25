import { docs, aid } from '../.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({ baseUrl: '/docs', source: docs.toFumadocsSource() });
export const aidSource = loader({ baseUrl: '/docs/aid', source: aid.toFumadocsSource() });