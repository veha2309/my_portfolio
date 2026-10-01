export const inquiryServices = ['Website', 'Web app', 'Mobile app', 'Redesign'] as const;
export type InquiryService = typeof inquiryServices[number];

export const inquiryProfiles: Record<InquiryService, { slug: string; title: string; emphasis: string; intro: string; detail: string; placeholder: string }> = {
  Website: { slug: 'website', title: 'Your brand online.', emphasis: 'Let’s make it yours.', intro: 'A distinctive home for your business.', detail: 'Tell us about your business, the pages you need, and what you want visitors to do. We’ll discuss the design, content, and launch scope before preparing your quote.', placeholder: 'What does your business do? Which pages do you need, and what should visitors do next?' },
  'Web app': { slug: 'web-app', title: 'A useful idea.', emphasis: 'A working product.', intro: 'Turn your workflow or product idea into a web application.', detail: 'Tell us who will use it, the problem it solves, and the features that matter most. We’ll discuss the first version, connected services, and delivery scope.', placeholder: 'Who will use your app? What problem does it solve? Describe the key features, accounts, or integrations you need.' },
  'Mobile app': { slug: 'mobile-app', title: 'Closer to your customers.', emphasis: 'One tap away.', intro: 'An app built around everyday needs.', detail: 'Tell us about your audience, the main app experience, and whether you’re planning for Android, iOS, or both. We’ll discuss the first release and the services behind it.', placeholder: 'What should your app help people do? Android, iOS, or both? Which features are essential for the first release?' },
  Redesign: { slug: 'redesign', title: 'A fresh perspective.', emphasis: 'A better experience.', intro: 'Give your existing website a thoughtful next chapter.', detail: 'Share your current website, what feels outdated, and what you want to improve. We’ll discuss the pages, content, and functionality worth keeping or rethinking.', placeholder: 'Share your current website URL. What isn’t working, what should stay, and what would you like to improve?' },
};

export function serviceFromSlug(slug: string | null): InquiryService | undefined {
  return inquiryServices.find(service => inquiryProfiles[service].slug === slug);
}

export const inquiryReferences: Record<string, string> = { malamen: 'Malamen', 'signature-cafe': 'Signature Cafe' };
