import { docs, aid } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { createIconHandler } from './icon-handler';

const icon = createIconHandler();

export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource(), icon });
export const aidSource = loader({ baseUrl: '/aid', source: aid.toFumadocsSource(), icon });
