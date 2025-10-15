'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { apiGet, apiPost } from '@/app/api-client';
import { useSession } from 'next-auth/react';
import { useI18n } from '@/i18n/I18nProvider';

const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL + '/messagingHub' || '';

const ChatPage: React.FC = () => {
    const params = useSearchParams();
    const session = useSession();
    const offerId = params.get('offerId') || '';
    const [offer, setOffer] = useState<DeliveryOffer | null>(null);
    const [me, setMe] = useState<shortUserInfo | null>(null);
    const [role , setRole] = useState<'driver' | 'sender' | null>(null);
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [input, setInput] = useState('');
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages: m, language } = useI18n();
    const t = m.chat;
    const localeTag = language === 'uk' ? 'uk-UA' : 'en-US';
    const dayMonth = (d: Date) => d.toLocaleDateString(localeTag, { day: 'numeric', month: 'long' });
    const hhmm = (d: Date) => d.toLocaleTimeString(localeTag, { hour: '2-digit', minute: '2-digit', hour12: false });

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchOffer = async (offerId: string): Promise<DeliveryOffer> => {
        const res = await apiGet<any>(`/request/offer/${offerId}`, {}, session?.data?.accessToken);
        
        // console.log('Fetched offer:', res.data);
        
        return res.data;
    };

    const fetchUser = async (id: string): Promise<shortUserInfo> => {
        const res = await apiGet<any>(`/account/short/${id}`, {}, session?.data?.accessToken);
        
        // console.log('Fetched user:', res.data);
        
        return res.data;
    };

    // Fetch offer and user
    useEffect(() => {
        const userId = session?.data?.user.id;

        if (!offerId || !userId) return;
        setLoading(true);
        Promise.all([fetchOffer(offerId), fetchUser(userId)]).then(([offer, user]) => {
            setOffer(offer);

            if (userId === offer.driverId){
                setRole('driver');
            } 
            else{
                setRole('sender');
            }
            
            setMe(user);
            setLoading(false);
        });
    }, [offerId, session?.data?.user.id]);

    // SignalR connection
    useEffect(() => {
        if (!offerId || !me) return;

        const accessToken = session?.data?.accessToken;
        const conn = new HubConnectionBuilder()
            .withUrl(SIGNALR_URL, { accessTokenFactory: () => accessToken || '', withCredentials: true })
            .configureLogging(LogLevel.Warning)
            .withAutomaticReconnect()
            .build();

        conn.start().then(() => {
            conn.invoke('JoinOfferRoom', offerId);
        });

        conn.on('ReceiveMessageHistory', (msgs: MessageDto[]) => {
            setMessages(msgs.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
        });

        conn.on('ReceiveMessage', (msg: MessageDto) => {
            setMessages(prev => [...prev, msg]);
        });

        setConnection(conn);

        return () => {
            conn.invoke('LeaveOfferRoom', offerId).finally(() => conn.stop());
        };
    }, [offerId, me]);

    const sendMessage = async () => {
        if (!input.trim() || !connection || !me || !offer) return;
        const receiverId =
            me.id === offer.driverId
                ? offer.deliveryRequest.senderId
                : offer.driverId;
        const message: CreateMessageDto = {
            senderId: me.id,
            receiverId,
            deliveryOfferId: offer.id,
            text: input.trim(),
        };

        console.log('Sending message:', message);

        await connection.invoke('SendMessageToOffer', message);
        setInput('');
    };

    if (loading || !offer || !me) {
        return <div className="text-white text-center py-20">{t.loading}</div>;
    }

    // Chat participants
    const otherUser = role === 'driver' ? offer.deliveryRequest.sender : offer.driver;

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#18102a]">
            {/* Chat Section */}
            <div className="flex flex-col flex-1 p-6">
                {/* Chat Header */}
                <div className="flex items-center gap-4 bg-[#2d1857] rounded-t-2xl px-6 py-4 border-b border-[#7c3aed]">
                    <Image
                        src={
                            otherUser.imagePath
                                ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + otherUser.imagePath
                                : '/dummy.png'
                        }
                        alt={otherUser.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                    />
                    <div>
                        <div className="font-bold text-white text-lg">{otherUser.name}</div>
                        <div className="text-[#b6a7e6] text-sm">{role === 'driver' ? t.role.sender : t.role.driver}</div>
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                            {'★'.repeat(Math.round(otherUser.rating || 0))}
                            <span className="text-white ml-2">{otherUser.rating?.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="ml-auto flex gap-4">
                        {otherUser.phoneNumber && (
                            <a href={`tel:${otherUser.phoneNumber}`} className="text-[#7c3aed] text-xl" title={t.callTitle}>
                                <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" /></svg>
                            </a>
                        )}
                    </div>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto bg-[#1a093a] px-6 py-4">
                    {messages.length === 0 && (
                        <div className="text-center text-[#b6a7e6] mt-10">{t.noMessages}</div>
                    )}
                    {messages.map((msg, idx) => {
                        console.log('Rendering message:', msg);
                        const isMe = msg.senderId === me.id;


                        const showDate =
                            idx === 0 ||
                            dayMonth(new Date(msg.sentAt)) !== dayMonth(new Date(messages[idx - 1].sentAt));
                        return (
                            <React.Fragment key={msg.id}>
                                {showDate && (
                                    <div className="flex justify-center my-2">
                                        <span className="bg-[#7c3aed] text-white px-4 py-1 rounded-full text-xs">
                                            {dayMonth(new Date(msg.sentAt))}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isMe ? ' justify-end' : 'justify-start'} mb-2`}>
                                    {!isMe && (
                                        <Image
                                            src={
                                                otherUser.imagePath
                                                    ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + otherUser.imagePath
                                                    : '/dummy.png'
                                            }
                                            alt={otherUser.name ?? 'dummy.png'}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover mr-2"
                                        />
                                    )}
                                    <div
                                        className={`max-w-[60%] px-4 py-2 rounded-2xl ${
                                            isMe
                                                ? 'bg-[#7c3aed] text-white rounded-br-none'
                                                : 'bg-[#b6a7e6] text-[#18102a] rounded-bl-none'
                                        }`}
                                    >
                                        <div className="text-sm">{msg.text}</div>
                                        <div className="text-xs text-right mt-1 opacity-70">
                                            {hhmm(new Date(msg.sentAt))}
                                        </div>
                                    </div>
                                    {isMe && (
                                        <Image
                                            src={
                                                me.imagePath
                                                    ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + me.imagePath
                                                    : '/dummy.png'
                                            }
                                            alt={me.name ?? 'dummy.png'}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover ml-2"
                                        />
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                {/* Chat Actions */}
                <div className="relative bg-[#2d1857] rounded-b-2xl px-6 py-4 flex flex-col gap-2">
                    {role === 'driver' && (
                    <div className="flex gap-2 mb-2">
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.driver.clarifyDeliveryPlace.value); }}
                        >
                            {t.quickReplies.driver.clarifyDeliveryPlace.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.driver.imHere.value); }}
                        >
                            {t.quickReplies.driver.imHere.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.driver.delay5min.value); }}
                        >
                            {t.quickReplies.driver.delay5min.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.driver.whereCanIFindYou.value); }}
                        >
                            {t.quickReplies.driver.whereCanIFindYou.label}
                        </button>
                    </div>)}
                    {role === 'sender' && (
                    <div className="flex gap-2 mb-2">
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.sender.imHere.value); }}
                        >
                            {t.quickReplies.sender.imHere.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.sender.delay5min.value); }}
                        >
                            {t.quickReplies.sender.delay5min.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.sender.whereAreYou.value); }}
                        >
                            {t.quickReplies.sender.whereAreYou.label}
                        </button>
                        <button className="flex-1 bg-[#b6a7e6] text-[#2d1857] rounded-lg px-3 py-2 text-sm font-semibold"
                            onClick={() => { setInput(t.quickReplies.sender.stillOnTheWay.value); }}
                        >
                            {t.quickReplies.sender.stillOnTheWay.label}
                        </button>
                    </div>)}
                    <div className="flex gap-2">
                        <input
                            className="flex-1 rounded-lg px-4 py-2 bg-[#1a093a] text-white outline-none"
                            placeholder={t.inputPlaceholder}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                        <button
                            className="bg-[#7c3aed] text-white rounded-lg px-6 py-2 font-bold"
                            onClick={sendMessage}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M22 2L11 13" strokeWidth="2"/><path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Offer/Request Info Section */}
            <div className="hidden md:flex flex-col w-[350px] bg-white rounded-2xl m-6 shadow-lg p-6">
                <div className="flex flex-col items-center">
                    <Image
                        src={
                            otherUser.imagePath
                                ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + otherUser.imagePath
                                : '/dummy.png'
                        }
                        alt={otherUser.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                    />
                    <div className="font-bold text-[#18102a] text-xl mt-4">{otherUser.name}</div>
                        <div className="text-[#18102a] text-lg mt-2">{otherUser.email}</div>
                    <div className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
                        {'★'.repeat(Math.round(otherUser.rating || 0))}
                        <span className="text-[#18102a] ml-2">{otherUser.rating?.toFixed(1)}</span>
                    </div>
                    <div className="text-[#18102a] text-lg">{offer.deliveryRequest.senderPhoneNumber}</div>
                </div>
                <hr className="my-4 border-[#b6a7e6]" />
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="font-bold text-[#7c3aed]">{offer.deliveryRequest.startLocation.city} {hhmm(new Date(offer.deliveryRequest.startLocation.dateTime))}</div>
                        <div className="text-[#18102a] text-sm">
                            {t.sidebar.pickupPlace}: {offer.deliveryRequest.startLocation.address}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-[#7c3aed]">{offer.deliveryRequest.endLocation.city} {hhmm(new Date(offer.deliveryRequest.endLocation.dateTime))}</div>
                        <div className="text-[#18102a] text-sm">
                            {t.sidebar.deliveryPlace}: {offer.deliveryRequest.endLocation.address}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;