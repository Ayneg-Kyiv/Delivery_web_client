'use client';

import React, { Component, ChangeEvent } from 'react';
import type { FaqSection, FaqItem } from './faq';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

interface HelpPageState {
    expanded: { [key: string]: number | null };
    search: string;
}

interface HelpPageProps { t: any }

export class HelpPage extends Component<HelpPageProps, HelpPageState> {
    constructor(props: HelpPageProps) {
        super(props);
        this.state = {
            expanded: {} as { [key: number]: number | null },
            search: '',
        };
    }

    handleToggle(sectionIdx: number, itemIdx: number) {
        this.setState((prevState) => {
            const current = prevState.expanded[sectionIdx];
            return {
                expanded: {
                    ...prevState.expanded,
                    [sectionIdx]: current === itemIdx ? null : itemIdx,
                },
            };
        });
    }

    handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ search: e.target.value });
    };

    filterSections(): FaqSection[] {
        const { search } = this.state;
        const { t } = this.props;

        // Build sections from i18n messages
        const allSections: FaqSection[] = Object.values(t.faq).map((section: any) => ({
            title: section.title as string,
            items: section.items as FaqItem[],
        }));

        if (!search.trim()) {
            // Default view: only About section
            const about = t.faq.about as { title: string; items: FaqItem[] };
            return [{ title: about.title, items: about.items }];
        }

        const lowerSearch = search.toLowerCase();
        return allSections
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
    }

    render() {

        const filteredSections = this.filterSections();

        const { t } = this.props;
        return (
            <div className='py-10 px-8 md:px-10 lg:px-[190px] flex flex-col pt-20 md:pt-40 '>
                <div className='flex-1 flex flex-col w-full gap-6 items-center'>
                    <h1 className='text-[40px] md:text-5xl lg:text-7xl'>{t.title}</h1>
                    <div className='w-full flex justify-center mt-6 px-8 md:px-20 lg:px-40'>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                            className='w-full focus:ring-2 focus:ring-[#9655DF] rounded-lg p-4'
                            style={ { border: 'solid 1px #9655DF', outline: 'none' } }
                        />
                    </div>
                    <div className='flex flex-col w-full mt-6 '>
                        {filteredSections.length === 0 ? (
                            <div>{t.nothingFound}</div>
                        ) : (
                            filteredSections.map((section: FaqSection, sectionIdx: number) => (
                                <div key={section.title} className='flex flex-col mb-8 justify-center align-center'>
                                    <h2 className='text-4xl pb-10 self-center'>{section.title}</h2>
                                    <div className='list-none p-0 m-0 w-full flex flex-col justify-center align-center'>
                                        {section.items.map((item: FaqItem, itemIdx: number) => {
                                            const expanded = this.state.expanded[sectionIdx] === itemIdx;
                                            return (
                                                <div key={item.question} className='mb-6'>
                                                    <div className='flex justify-between items-center'>
                                                        <button
                                                        onClick={() => this.handleToggle(sectionIdx, itemIdx)}
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
                                                        aria-expanded={expanded}
                                                    >
                                                        {item.question}
                                                    </button>
                                                    <div>{expanded ? '▲' : '▼'}</div>
                                                </div>
                                                <div
                                                    className={`text-gray-400 transition-all duration-300 overflow-hidden`}
                                                    style={{
                                                        maxHeight: expanded ? 500 : 0,
                                                        opacity: expanded ? 1 : 0,
                                                    }}
                                                >
                                                    {expanded && (
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

                <div className='flex flex-col md:flex-row   py-10 gap-10'>
                    <div className="rounded-lg bg-[url('/Rectangle484.png')] min-h-[240px] w-full min-w-[200px] bg-cover bg-center items-start flex justify-start">
                        <Link href='/help/sender' className='flex flex-col justify-between p-4 w-full h-full'>
                            <p className="text-3xl">{t.forCustomers}</p>
                        </Link>
                    </div>
                    <div className="rounded-lg bg-[url('/Rectangle485.png')] min-h-[240px] w-full min-w-[200px] bg-cover bg-center items-start flex justify-start">
                        <Link href='/help/driver' className='flex flex-col justify-between p-4 w-full h-full'>
                            <p className="text-3xl">{t.forDrivers}</p>
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row bg-darker md:mt-20 rounded-lg text-center text-gray-300 px-10 py-10 gap-10'>
                    <div className='flex-1 flex flex-col justify-center items-center py-10'>
                        <h2 className="text-3xl font-bold mb-4 text-white">{t.joinMovement.title}</h2>
                        <p className="mb-4">{t.joinMovement.p1}</p>
                        
                        <ul className="list-disc list-inside mb-4 text-left">
                            {t.joinMovement.list.map((li: string) => (
                              <li key={li}>{li}</li>
                            ))}
                        </ul>
                        
                        <p className="mb-4">{t.joinMovement.p2}</p>
                        
                        <p>{t.joinMovement.p3}</p>

                        <Link href='/vehicle' className='mt-10 px-8 py-4 h-9 rounded-xl flex items-center justify-center  button-type-1'>
                            {t.joinMovement.joinButton}
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
    }
}

function HelpPageWrapper() {
  const { messages } = useI18n();
  const t = messages.helpPage;
  return <HelpPage t={t} />;
}

export default HelpPageWrapper;