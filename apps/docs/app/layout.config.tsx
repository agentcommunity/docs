// apps/docs/app/layout.config.tsx
import { Github } from 'lucide-react';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const baseOptions: BaseLayoutProps = {
  links: [
    {
      text: 'Community',
      url: '/',
      active: 'nested-url',
      secondary: false,
    },
    {
      text: 'Agent Interface Discovery (AID)',
      url: '/aid',
      active: 'nested-url',
      secondary: false,
    },
    {
      type: 'icon',
      text: 'GitHub',
      label: 'GitHub',
      icon: <Github size={16} />,
      url: 'https://github.com/agentcommunity',
    },
  ],
  nav: {
    title: (
      <span className="flex items-center gap-2" aria-label="Agent Community">
        <Image
          src="/assets/logo_docs_lm.svg"
          alt="Agent Community Logo"
          width={18}
          height={18}
          className="rounded-sm dark:hidden"
        />
        <Image
          src="/assets/logo_docs_dm.svg"
          alt="Agent Community Logo"
          width={18}
          height={18}
          className="rounded-sm hidden dark:block"
        />
        <span className="font-semibold tracking-tight">Agent Community</span>
      </span>
    ), // used by mobile and sidebar header
  },
};