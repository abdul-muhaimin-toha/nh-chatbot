"use client";

import { useEffect, useRef } from "react";
import BotChat from "./bot-chat";
import ClientChat from "./client-chat";
import ChatSuggestion from "./chat-suggestion";
import ChatBotLoading from "./chat-bot-loading";
import ChatBotMeetingWrapper from "./chat-bot-meeting-wrapper";
import ScheduleCard from "./schedule-card";

function ChatBotMainChatArea({
  chatMessages,
  suggestions,
  activeSuggestions,
  handleSuggestionClick,
  isPending,
  showSchedule,
  handleScheduleSubmit,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isPending]);

  console.log(chatMessages);

  return (
    <div className="chat-scroll flex h-full w-full flex-col gap-4 overflow-y-auto bg-white px-3 py-6 md:h-[390px] md:gap-5 md:px-5 md:py-10">
      <BotChat text="👋 Hello! Welcome to Notionhive. How can we help you today?" />
      <ChatSuggestion
        suggestions={suggestions}
        activeSuggestions={activeSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      {chatMessages.map((msg, idx) => {
        if (msg.type === "user")
          return <ClientChat key={idx} text={msg.text} />;
        if (msg.type === "bot") return <BotChat key={idx} text={msg.text} />;
        if (msg.type === "schedule")
          return <ScheduleCard key={idx} scheduleData={msg.data} />;
      })}
      {showSchedule && (
        <ChatBotMeetingWrapper handleScheduleSubmit={handleScheduleSubmit} />
      )}
      {isPending && <ChatBotLoading />}
      <div className="-mt-4 md:-mt-5" ref={chatEndRef} />
    </div>
  );
}

export default ChatBotMainChatArea;
