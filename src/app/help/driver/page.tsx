'use client';

import React, { Component, ChangeEvent } from 'react';
import { faqDriverSection ,faqSections, FaqSection, FaqItem } from '../faq';
import Image from 'next/image';
import Link from 'next/link';

interface HelpPageState {
    expanded: { [key: string]: number | null };
    search: string;
}

export class HelpPage extends Component<{}, HelpPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            expanded: {},
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
        if (!search.trim()) return [faqDriverSection];
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
    }

    render() {

        const filteredSections = this.filterSections();

        return (
            <div className='py-10 px-8 md:px-10 lg:px-[190px] flex flex-col pt-40 '>
                <div className='flex-1 flex flex-col w-full gap-6 items-center'>
                    <h1 className='text-7xl'>Допомога та Чапи для Водіїв</h1>
                    <div className='w-full flex justify-center mt-6 px-8 md:px-20 lg:px-40'>
                        <input
                            type="text"
                            placeholder="Пошук..."
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                            className='w-full focus:ring-2 focus:ring-[#9655DF] rounded-lg p-4'
                            style={ { border: 'solid 1px #9655DF', outline: 'none' } }
                        />
                    </div>
                    <div className='flex flex-col w-full mt-6 '>
                        {filteredSections.length === 0 ? (
                            <div>Нічого не знайдено.</div>
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
                <div className='flex flex-row bg-darker mt-20 rounded-lg text-center text-gray-300 px-10 py-10 gap-10'>
                    <div className='flex-1 flex flex-col justify-center items-center py-10'>
                        <h2 className="text-3xl font-bold mb-4 text-white">Приєднуйтесь до руху</h2>
                        <p className="mb-4">
                            Cargix — це більше, ніж просто платформа для доставки. Це спільнота помічників, мандрівників та справжніх героїв щодня.
                        </p>
                        
                        <ul className="list-disc list-inside mb-4 text-left">
                            <li>Вам потрібно швидко та доступно доставити посилку</li>
                            <li>Ви мандрівник, який хоче заробити, допомагаючи іншим</li>
                            <li>Ви вірите у розумніші, екологічні рішення</li>
                        </ul>
                        
                        <p className="mb-4">
                            ...Cargix тут для вас.
                        </p>
                        
                        <p>
                            Зареєструйтесь сьогодні та станьте частиною глобальних змін у тому, як ми надсилаємо та отримуємо посилки. Разом ми створюємо світ, де кожна подорож має значення.
                        </p>

                        <Link href='/add-vehicle' className='mt-10 px-8 py-4 h-9 rounded-xl flex items-center justify-center  button-type-1'>
                            Приєднатись
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

export default HelpPage;