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
    <div className="chat-scroll flex w-full flex-1 flex-col gap-4 overflow-y-auto bg-white px-3 py-6 transition-all duration-100 ease-in-out md:gap-4 md:px-4 md:py-6">
      <BotChat text=" Hello! 👋 I'm NH Buddy. How can I help you today?" />
      {chatMessages.map((msg, idx) => {
        if (msg.type === "user")
          return <ClientChat key={idx} text={msg.text} />;
        if (msg.type === "bot" || msg.type === "specific_service")
          return (
            <BotChat
              key={idx}
              text={msg.text}
              msg={msg}
              handleSuggestionClick={handleSuggestionClick}
            />
          );
        if (msg.type === "schedule")
          return <ScheduleCard key={idx} scheduleData={msg.data} />;
      })}
      {showSchedule && (
        <ChatBotMeetingWrapper handleScheduleSubmit={handleScheduleSubmit} />
      )}
      <ChatSuggestion
        suggestions={suggestions}
        activeSuggestions={activeSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      {isPending && <ChatBotLoading />}
      <div className="-mt-4 md:-mt-5" ref={chatEndRef} />
    </div>
  );
}

export default ChatBotMainChatArea;
