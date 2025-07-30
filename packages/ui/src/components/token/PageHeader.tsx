'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description: string;
  backHref: string;
}

export function PageHeader({ title, description, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-center mb-8">
      <Link href={backHref}>
        <Button variant="ghost" className="mr-4">
          ← Back
        </Button>
      </Link>
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
} 