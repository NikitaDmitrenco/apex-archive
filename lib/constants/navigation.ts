export type NavItem = {
  label: string;
  href: string;
};

/**
 * The brief groups the five entity catalogues under an "Archive" heading. There is no
 * /archive route in the MVP route list, so the heading stays a label and the entities
 * carry the links.
 */
export const ARCHIVE_GROUP_LABEL = "Archive";

export const archiveNav: NavItem[] = [
  { label: "Cars", href: "/cars" },
  { label: "Drivers", href: "/drivers" },
  { label: "Teams", href: "/teams" },
  { label: "Circuits", href: "/circuits" },
  { label: "Seasons", href: "/seasons" },
];

export const utilityNav: NavItem[] = [
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
];

export const allNavItems: NavItem[] = [...archiveNav, ...utilityNav];
