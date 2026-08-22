type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

export default function NavDropdown({ group }: { group: NavGroup }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-label-sm font-label-sm">
        {group.label}
        <span className="material-symbols-outlined text-sm">expand_more</span>
      </button>
      <div className="absolute top-full left-0 mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
        {group.items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-4 py-2 text-label-sm hover:bg-surface-container rounded-lg transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}