"use client";
import dynamic from "next/dynamic";

const SupportChatWidget = dynamic(() => import("@/components/support-chat-widget"), { ssr: false });

export default function SupportChatClient() {
  return <SupportChatWidget />;
}
