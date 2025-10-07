export interface FaqItem { question: string; answer: string }
export interface FaqSection { title: string; items: FaqItem[] }

// The hardcoded Ukrainian FAQ data has been removed in favor of i18n-driven content.
// Use buildFaqSections(messages.helpPage.faq) to construct localized sections.
export function buildFaqSections(faqMessages: any, scope: 'all' | 'aboutOnly' = 'aboutOnly'): FaqSection[] {
  if (!faqMessages) return [];
  const mapSection = (key: string): FaqSection | null => {
    const sec = faqMessages[key];
    if (!sec) return null;
    return { title: sec.title as string, items: (sec.items as any[]).map(it => ({ question: it.question as string, answer: it.answer as string })) };
  };
  if (scope === 'aboutOnly') {
    const about = mapSection('about');
    return about ? [about] : [];
  }
  const order = ['about','driver','sender','security','pricing','eco','technical'];
  return order.map(mapSection).filter(Boolean) as FaqSection[];
}
