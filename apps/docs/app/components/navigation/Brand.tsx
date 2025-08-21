// apps/docs/app/components/navigation/Brand.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Agent Community Home">
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
      <span className="font-semibold tracking-tight group-hover:opacity-90">
        Agent Community
      </span>
    </Link>
  );
}
