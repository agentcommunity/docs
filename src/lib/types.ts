export interface DocPage {
  title: string;
  description: string;
  content: string;
  rawContent: string;
  headings: Heading[];
  slug: string[];
}

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export interface NavItem {
  title: string;
  slug: string;
  href: string;
  children?: NavItem[];
}

export interface BlogPost {
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
  rawContent: string;
  slug: string;
  headings: Heading[];
}
