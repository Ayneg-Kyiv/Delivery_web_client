'use client';

import React, { useState, ChangeEvent } from 'react';
import { useFaqData, FaqSection, FaqItem } from './faq';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

const HelpPage: React.FC = () => {
    const { messages: t } = useI18n();
    const { faqSections } = useFaqData();
    const [expanded, setExpanded] = useState<{ [key: number]: number | null }>({});
    const [search, setSearch] = useState('');

    const handleToggle = (sectionIdx: number, itemIdx: number) => {
        setExpanded(prev => {
            const current = prev[sectionIdx];
            return {
                ...prev,
                [sectionIdx]: current === itemIdx ? null : itemIdx,
            };
        });
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filterSections = (): FaqSection[] => {
        if (!search.trim()) return faqSections;
        const lowerSearch = search.toLowerCase();
        return faqSections
            .map((section) => {
                const filteredItems = section.items.filter(
                    (item) =>
                        item.question.toLowerCase().includes(lowerSearch) ||
                        item.answer.toLowerCase().includes(lowerSearch)
                );
                return filteredItems.length
                    ? { ...section, items: filteredItems }
                    : null;
            })
            .filter(Boolean) as FaqSection[];
    };

    const filteredSections = filterSections();

    return (
        <div className='py-10 px-8 md:px-10 lg:px-[190px] flex flex-col pt-40 '>
            <div className='flex-1 flex flex-col w-full gap-6 items-center'>
                <h1 className='text-[40px] md:text-5xl lg:text-7xl'>{t.helpPage.title}</h1>
                <div className='w-full flex justify-center mt-6 px-8 md:px-20 lg:px-40'>
                    <input
                        type="text"
                        placeholder={t.helpPage.searchPlaceholder}
                        value={search}
                        onChange={handleSearchChange}
                        className='w-full focus:ring-2 focus:ring-[#9655DF] rounded-lg p-4'
                        style={{ border: 'solid 1px #9655DF', outline: 'none' }}
                    />
                </div>
                <div className='flex flex-col w-full mt-6 '>
                    {filteredSections.length === 0 ? (
                        <div>{t.helpPage.nothingFound}</div>
                    ) : (
                        filteredSections.map((section: FaqSection, sectionIdx: number) => (
                            <div key={section.title} className='flex flex-col mb-8 justify-center align-center'>
                                <h2 className='text-4xl pb-10 self-center'>{section.title}</h2>
                                <div className='list-none p-0 m-0 w-full flex flex-col justify-center align-center'>
                                    {section.items.map((item: FaqItem, itemIdx: number) => {
                                        const isExpanded = expanded[sectionIdx] === itemIdx;
                                        return (
                                            <div key={item.question} className='mb-6'>
                                                <div className='flex justify-between items-center'>
                                                    <button
                                                        onClick={() => handleToggle(sectionIdx, itemIdx)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            fontSize: 20,
                                                            textAlign: 'left',
                                                            width: '100%',
                                                        }}
                                                        aria-expanded={isExpanded}
                                                    >
                                                        {item.question}
                                                    </button>
                                                    <div>{isExpanded ? '▲' : '▼'}</div>
                                                </div>
                                                <div
                                                    className={`text-gray-400 transition-all duration-300 overflow-hidden`}
                                                    style={{
                                                        maxHeight: isExpanded ? 500 : 0,
                                                        opacity: isExpanded ? 1 : 0,
                                                    }}
                                                >
                                                    {isExpanded && (
                                                        <div>
                                                            {item.answer}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='w-full h-[1px] bg-gray-200 mt-6'></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className='flex flex-col md:flex-row bg-darker mt-20 rounded-lg text-center text-gray-300 px-10 py-10 gap-10'>
                <div className='flex-1 flex flex-col justify-center items-center py-10'>
                    <h2 className="text-3xl font-bold mb-4 text-white">{t.helpPage.joinMovement.title}</h2>
                    <p className="mb-4">
                        {t.helpPage.joinMovement.p1}
                    </p>
                    
                    <ul className="list-disc list-inside mb-4 text-left">
                        {t.helpPage.joinMovement.list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    
                    <p className="mb-4">
                        {t.helpPage.joinMovement.p2}
                    </p>
                    
                    <p>
                        {t.helpPage.joinMovement.p3}
                    </p>

                    <Link href='/vehicle' className='mt-10 px-8 py-4 h-9 rounded-xl flex items-center justify-center  button-type-1'>
                        {t.helpPage.joinMovement.joinButton}
                    </Link>
                </div>

                <div className='flex-1 flex justify-center items-center'>
                    <Image
                        src="/connect.png"
                        alt="Logo"
                        width={150}
                        height={150}
                        className=" w-full rounded-lg "
                    />
                </div>
            </div>
        </div>
    );
};

export default HelpPage;