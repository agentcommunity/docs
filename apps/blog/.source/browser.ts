// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
} & {
  DocData: {
    blog: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"2025-07-21-missing_record.mdx": () => import("../../../content/blog/2025-07-21-missing_record.mdx?collection=blog"), "2025-07-22-what_when_domain.mdx": () => import("../../../content/blog/2025-07-22-what_when_domain.mdx?collection=blog"), "2025-07-23-finding_door_a2a.mdx": () => import("../../../content/blog/2025-07-23-finding_door_a2a.mdx?collection=blog"), "2025-07-24-missing_grep_mcp.mdx": () => import("../../../content/blog/2025-07-24-missing_grep_mcp.mdx?collection=blog"), "2025-07-25-door_or_address_book.md": () => import("../../../content/blog/2025-07-25-door_or_address_book.md?collection=blog"), "2025-08-23-web_auth_box_not_for_agents.mdx": () => import("../../../content/blog/2025-08-23-web_auth_box_not_for_agents.mdx?collection=blog"), "2025-08-31-identity-joins-discovery.mdx": () => import("../../../content/blog/2025-08-31-identity-joins-discovery.mdx?collection=blog"), "2025-09-01-agent-identity-and-discovery.mdx": () => import("../../../content/blog/2025-09-01-agent-identity-and-discovery.mdx?collection=blog"), "2026-01-16-agent-brief-agentic-news.md": () => import("../../../content/blog/2026-01-16-agent-brief-agentic-news.md?collection=blog"), }),
};
export default browserCollections;