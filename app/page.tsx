import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // In production, redirect based on subdomain
  if (host.includes('docs.agentcommunity.org')) {
    redirect('/docs');
  } else if (host.includes('blogs.agentcommunity.org')) {
    redirect('/blog');
  }
  
  // In development, redirect to docs by default
  redirect('/docs');
} 