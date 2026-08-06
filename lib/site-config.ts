export const siteConfig = {
  name: 'Pelumi Sekoni',
  title: 'Digital Operations & Project Coordinator',
  description:
    'Helping startups build better operations, content systems and digital experiences. Digital Operations & Project Coordinator with experience supporting startups, student communities and digital products.',
  url: 'https://pelumisekoni.com',
  ogImage: '/og.png',
  author: {
    name: 'Pelumi Sekoni',
    role: 'Digital Operations & Project Coordinator',
    location: 'Available for Remote Opportunities',
    email: 'hello@pelumisekoni.com',
  },
  nav: [
    { title: 'About', href: '/about' },
    { title: 'Case Studies', href: '/case-studies' },
    { title: 'Knowledge Hub', href: '/insights' },
    { title: 'Resume', href: '/resume' },
    { title: 'Contact', href: '/contact' },
  ],
  social: [
    { title: 'LinkedIn', href: '#' },
    { title: 'GitHub', href: '#' },
    { title: 'X', href: '#' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
