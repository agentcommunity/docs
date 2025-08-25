import * as MaterialIcons from '@mui/icons-material';
import * as Lucide from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import type React from 'react';

// Map of common Material icon names to their actual component names
const materialIconMap: Record<string, string> = {
  'account-voice': 'RecordVoiceOver',
  'connection': 'Link',
  'api': 'Api',
  'web': 'Web',
  'code': 'Code',
  'language-go': 'Go',
  'language-python': 'Python',
  'language-java': 'Java',
  'language-dotnet': 'DotNet',
  'language-typescript': 'TypeScript',
  'settings': 'Settings',
  'security': 'Security',
  'book-open': 'BookOpen',
  'globe': 'Globe',
  'rocket': 'Rocket',
  'book': 'Book',
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

// Convert snake_case or kebab-case to PascalCase for Material icons
function normalizeMaterialIconName(name: string): string {
  // First check if it's already in our known map
  if (materialIconMap[name]) {
    return materialIconMap[name];
  }

  // Otherwise, try to convert it
  return capitalizeIconName(name);
}

export function createIconHandler() {
  const materialIconComponents = MaterialIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const lucideComponents = Lucide as unknown as Record<string, LucideIcon>;

  return function IconRenderer(iconName: string) {
    // Handle Material Design icons (format: "material/icon-name")
    if (iconName.startsWith('material/')) {
      const materialIconName = iconName.replace('material/', '');
      const normalizedName = normalizeMaterialIconName(materialIconName);

      // Get the icon component from Material Icons
      const MaterialIcon = materialIconComponents[normalizedName];

      if (MaterialIcon) {
        return <MaterialIcon className="size-4" />;
      }

      // Fallback: try with "Icon" suffix
      const withIconSuffix = normalizedName + 'Icon';
      const MaterialIconWithSuffix = materialIconComponents[withIconSuffix];

      if (MaterialIconWithSuffix) {
        return <MaterialIconWithSuffix className="size-4" />;
      }

      console.warn(`Material icon "${iconName}" not found. Tried: ${normalizedName}, ${withIconSuffix}`);
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
