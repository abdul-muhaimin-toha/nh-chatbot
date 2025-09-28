import { useEffect, useRef } from "react";
import BotChat from "./bot-chat";
import ChatBotLoading from "./chat-bot-loading";
import ChatSuggestion from "./chat-suggestion";
import ClientChat from "./client-chat";
import ChatBotMeetingWrapper from "./chat-bot-meeting-wrapper";

function ChatBotMainChatArea({
  chatMessages,
  suggestions,
  activeSuggestions,
  handleSuggestionClick,
  isPending,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isPending]);

  return (
    <div className="chat-scroll flex h-full w-full flex-col gap-4 overflow-y-auto bg-white px-3 py-6 md:h-[390px] md:gap-5 md:px-5 md:py-10">
      <BotChat text="👋 Hello! Welcome to Notionhive. How can we help you today?" />
      <ChatSuggestion
        suggestions={suggestions}
        activeSuggestions={activeSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      {chatMessages.map((msg, idx) =>
        msg.type === "user" ? (
          <ClientChat key={idx} text={msg.text} />
        ) : (
          <BotChat key={idx} text={msg.text} />
        ),
      )}
      {/* <ChatBotMeetingWrapper /> */}
      {isPending && <ChatBotLoading />}
      <div className="-mt-4 md:-mt-5" ref={chatEndRef} />
    </div>
  );
}

export default ChatBotMainChatArea;
