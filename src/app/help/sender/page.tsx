'use client';

import React, { Component, ChangeEvent } from 'react';
import { FaqSection, FaqItem, useFaqData } from '../faq';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

interface HelpPageState {
    expanded: { [key: string]: number | null };
    search: string;
}

interface HelpPageProps {
    faqSections: FaqSection[];
    baseSection: FaqSection;
    t: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
}

export class HelpPage extends Component<HelpPageProps, HelpPageState> {
    constructor(props: HelpPageProps) {
        super(props);
        this.state = {
            expanded: {} as { [key: string]: number | null },
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
        if (!search.trim()) return [this.props.baseSection];
        const lowerSearch = search.toLowerCase();
        return this.props.faqSections
            .map((section: FaqSection) => {
                const filteredItems = section.items.filter(
                    (item: FaqItem) =>
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

        return (
            <div className='py-10 px-8 md:px-10 lg:px-[190px] flex flex-col pt-40 '>
                <div className='flex-1 flex flex-col w-full gap-6 items-center'>
                    <h1 className='text-[40px] md:text-5xl lg:text-7xl'>
                        {this.props.t.helpPage.title} — {this.props.t.helpPage.faq.sender.title}
                    </h1>
                    <div className='w-full flex justify-center mt-6 px-8 md:px-20 lg:px-40'>
                        <input
                            type="text"
                            placeholder={this.props.t.helpPage.searchPlaceholder}
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                            className='w-full focus:ring-2 focus:ring-[#9655DF] rounded-lg p-4'
                            style={ { border: 'solid 1px #9655DF', outline: 'none' } }
                        />
                    </div>
                    <div className='flex flex-col w-full mt-6 '>
                        {filteredSections.length === 0 ? (
                            <div>{this.props.t.helpPage.nothingFound}</div>
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

                <div className='flex flex-col md:flex-row bg-darker mt-20 rounded-lg text-center text-gray-300 px-10 py-10 gap-10'>
                    <div className='flex-1 flex flex-col justify-center items-center py-10'>
                        <h2 className="text-3xl font-bold mb-4 text-white">{this.props.t.helpPage.joinMovement.title}</h2>
                        <p className="mb-4">{this.props.t.helpPage.joinMovement.p1}</p>
                        <ul className="list-disc list-inside mb-4 text-left">
                            {this.props.t.helpPage.joinMovement.list.map((li, idx) => (
                                <li key={idx}>{li}</li>
                            ))}
                        </ul>
                        <p className="mb-4">{this.props.t.helpPage.joinMovement.p2}</p>
                        <p>{this.props.t.helpPage.joinMovement.p3}</p>

                        <Link href='/vehicle' className='mt-10 px-8 py-4 h-9 rounded-xl flex items-center justify-center  button-type-1'>
                            {this.props.t.helpPage.joinMovement.joinButton}
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
            </div>
        );
    }
}

// default export provided by wrapper below

export function HelpPageWrapper() {
    const { faqSections } = useFaqData();
    const { messages: t } = useI18n();
    const senderTitle = t.helpPage.faq.sender.title;
    const baseSection = faqSections.find(s => s.title === senderTitle) || faqSections[0];
    return <HelpPage faqSections={faqSections} baseSection={baseSection} t={t} />;
}

export { HelpPageWrapper as default };