import { docs, aid } from '../../../.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource() });
export const aidSource = loader({ baseUrl: '/aid', source: aid.toFumadocsSource() });