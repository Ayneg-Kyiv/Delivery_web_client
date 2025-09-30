import { useI18n } from "@/i18n/I18nProvider";

export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqSection {
    title: string;
    items: FaqItem[];
}

export const useFaqData = () => {
    const { messages: t } = useI18n();

    const faqSections: FaqSection[] = [
        {
            title: t.helpPage.faq.about.title,
            items: t.helpPage.faq.about.items,
        },
        {
            title: t.helpPage.faq.driver.title,
            items: t.helpPage.faq.driver.items,
        },
        {
            title: t.helpPage.faq.sender.title,
            items: t.helpPage.faq.sender.items,
        },
        {
            title: t.helpPage.faq.security.title,
            items: t.helpPage.faq.security.items,
        },
        {
            title: t.helpPage.faq.pricing.title,
            items: t.helpPage.faq.pricing.items,
        },
        {
            title: t.helpPage.faq.eco.title,
            items: t.helpPage.faq.eco.items,
        },
        {
            title: t.helpPage.faq.technical.title,
            items: t.helpPage.faq.technical.items,
        },
    ];

    return { faqSections };
};