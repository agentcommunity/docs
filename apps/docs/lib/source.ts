import { docs } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { createIconHandler } from './icon-handler';

const icon = createIconHandler();

export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource(), icon });
