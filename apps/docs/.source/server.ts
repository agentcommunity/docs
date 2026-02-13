// @ts-nocheck
import * as __fd_glob_15 from "../../../content/docs/work-items/index.mdx?collection=docs"
import * as __fd_glob_14 from "../../../content/docs/test.mdx?collection=docs"
import * as __fd_glob_13 from "../../../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_12 } from "../../../content/docs/meta.json?collection=docs"
import * as __fd_glob_11 from "../../../content/blog/2026-02-05-why-aid-now-supports-ucp.mdx?collection=blog"
import * as __fd_glob_10 from "../../../content/blog/2026-01-30-aid-to-8004.mdx?collection=blog"
import * as __fd_glob_9 from "../../../content/blog/2026-01-16-agent-brief-agentic-news.mdx?collection=blog"
import * as __fd_glob_8 from "../../../content/blog/2025-09-01-agent-identity-and-discovery.mdx?collection=blog"
import * as __fd_glob_7 from "../../../content/blog/2025-08-31-identity-joins-discovery.mdx?collection=blog"
import * as __fd_glob_6 from "../../../content/blog/2025-08-23-web_auth_box_not_for_agents.mdx?collection=blog"
import * as __fd_glob_5 from "../../../content/blog/2025-07-25-door_or_address_book.mdx?collection=blog"
import * as __fd_glob_4 from "../../../content/blog/2025-07-24-missing_grep_mcp.mdx?collection=blog"
import * as __fd_glob_3 from "../../../content/blog/2025-07-23-finding_door_a2a.mdx?collection=blog"
import * as __fd_glob_2 from "../../../content/blog/2025-07-22-what_when_domain.mdx?collection=blog"
import * as __fd_glob_1 from "../../../content/blog/2025-07-21-missing_record.mdx?collection=blog"
import { default as __fd_glob_0 } from "../../../content/blog/meta.json?collection=blog"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
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
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const blog = await create.docs("blog", "../../content/blog", {"meta.json": __fd_glob_0, }, {"2025-07-21-missing_record.mdx": __fd_glob_1, "2025-07-22-what_when_domain.mdx": __fd_glob_2, "2025-07-23-finding_door_a2a.mdx": __fd_glob_3, "2025-07-24-missing_grep_mcp.mdx": __fd_glob_4, "2025-07-25-door_or_address_book.mdx": __fd_glob_5, "2025-08-23-web_auth_box_not_for_agents.mdx": __fd_glob_6, "2025-08-31-identity-joins-discovery.mdx": __fd_glob_7, "2025-09-01-agent-identity-and-discovery.mdx": __fd_glob_8, "2026-01-16-agent-brief-agentic-news.mdx": __fd_glob_9, "2026-01-30-aid-to-8004.mdx": __fd_glob_10, "2026-02-05-why-aid-now-supports-ucp.mdx": __fd_glob_11, });

export const docs = await create.docs("docs", "../../content/docs", {"meta.json": __fd_glob_12, }, {"index.mdx": __fd_glob_13, "test.mdx": __fd_glob_14, "work-items/index.mdx": __fd_glob_15, });