import * as Lucide from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import type React from 'react';

// Map Material icon names to Lucide equivalents to avoid MUI/Emotion deps.
const materialToLucide: Record<string, keyof typeof Lucide> = {
  'account-voice': 'Mic',
  'api': 'Plug',
  'book': 'Book',
  'book-open': 'BookOpen',
  'check-decagram': 'BadgeCheck',
  'cogs': 'Cog',
  'connection': 'Link',
  'dns': 'Server',
  'file-code': 'FileCode',
  'file-document-outline': 'FileText',
  'format-list-bulleted': 'List',
  'git': 'GitBranch',
  'globe': 'Globe',
  'head-question-outline': 'HelpCircle',
  'language-csharp': 'Hash',
  'language-dotnet': 'Hash',
  'language-go': 'Code',
  'language-java': 'Coffee',
  'language-python': 'Code',
  'language-rust': 'Hammer',
  'language-typescript': 'Braces',
  'magnify-scan': 'Search',
  'new-box': 'Sparkles',
  'rocket': 'Rocket',
  'rocket-launch': 'Rocket',
  'security': 'Shield',
  'settings': 'Settings',
  'shield-lock': 'Shield',
  'shield-lock-outline': 'Shield',
  'stethoscope': 'Stethoscope',
  'tools': 'Wrench',
  'web': 'Globe',
};

// Capitalize first letter and handle special cases
function capitalizeIconName(name: string): string {
  // Handle special cases
  if (name.includes('-')) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function createIconHandler() {
  const lucideComponents = Lucide as unknown as Record<string, LucideIcon>;

  return function IconRenderer(iconName?: string) {
    if (!iconName) {
      return null;
    }
    // Handle Material Design icons (format: "material/icon-name") via Lucide mapping.
    if (iconName.startsWith('material/')) {
      const materialIconName = iconName.replace('material/', '');
      const lucideName = materialToLucide[materialIconName];
      const LucideIcon = lucideName ? lucideComponents[lucideName] : undefined;

      if (LucideIcon) {
        return <LucideIcon className="size-4" />;
      }

      console.warn(`Material icon "${iconName}" not mapped to a Lucide icon`);
    }

    // Handle Lucide icons (direct name format)
    const LucideIcon = lucideComponents[capitalizeIconName(iconName)];

    if (LucideIcon) {
      return <LucideIcon className="size-4" />;
    }

    // Final fallback: return null or a default icon
    console.warn(`Icon "${iconName}" not found in Material or Lucide libraries`);
    return <Lucide.Circle className="size-4" />;
  };
}
