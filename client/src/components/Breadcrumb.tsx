import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Navigation Component
 * Helps with SEO and user navigation
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-muted/50 py-3 px-4 rounded-lg mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home Link */}
        <li>
          <Link href="/" className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <Home size={16} />
            <span>Home</span>
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-muted-foreground" />
            {item.href ? (
              <Link href={item.href} className="text-accent hover:text-accent/80 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>

      {/* Schema.org Breadcrumb Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sheikhprop-p3nkkbke.manus.space',
            },
            ...items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 2,
              name: item.label,
              item: item.href ? `https://sheikhprop-p3nkkbke.manus.space${item.href}` : undefined,
            })),
          ],
        })}
      </script>
    </nav>
  );
}
