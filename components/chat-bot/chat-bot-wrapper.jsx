"use client";

import { useRef, useState } from "react";
import ChatIcon from "@/components/icons/chat-icon";
import ChatBotHeader from "./chat-bot-header";
import ChatBotFooter from "./chat-bot-footer";
import ChatBotTextarea from "./chat-bot-textarea";
import ChatBotMainChatArea from "./chat-bot-main-chat-area";
import { useForm } from "react-hook-form";
import { welcomeSuggestions } from "@/constants/welcome-suggestions";
import { useAskApi } from "@/hooks/use-ask";
import EndChatModal from "./end-chat-modal";

function ChatBotWrapper() {
  const [isOpen, setIsOpen] = useState(true);
  const [showEndChatConfirm, setShowEndChatConfirm] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(welcomeSuggestions);
  const [chatMessages, setChatMessages] = useState([]);

  // unique user per session
  const userIdRef = useRef(crypto.randomUUID());

  const { register, handleSubmit, reset } = useForm();
  const { mutate: sendMessage, isPending } = useAskApi();

  const handleSendMessage = (query) => {
    if (!query.trim()) return;

    // Hide suggestions as soon as user sends a message
    setActiveSuggestions(false);

    // Add user message
    setChatMessages((prev) => [...prev, { type: "user", text: query }]);

    // Call API
    sendMessage(
      { query, user_id: userIdRef.current },
      {
        onSuccess: (data) => {
          setChatMessages((prev) => [
            ...prev,
            { type: "bot", text: data.answer || "No reply from API" },
          ]);
          console.log("Full API response:", data);
        },
      },
    );
  };

  const onSubmit = (data) => {
    handleSendMessage(data.query);
    reset();
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleEndChat = () => {
    // Clear chat messages
    setChatMessages([]);
    // Reset suggestions
    setActiveSuggestions(true);
    setSuggestions(welcomeSuggestions);
    // Close chat
    setIsOpen(false);
    // Hide confirm modal
    setShowEndChatConfirm(false);
  };

  return (
    <aside className="fixed inset-5 z-50 flex items-end md:inset-auto md:right-10 md:bottom-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-5 bottom-5 transform cursor-pointer rounded-full transition duration-200 hover:scale-110 md:right-10 md:bottom-10 ${isOpen ? "hidden md:block" : ""}`}
      >
        <ChatIcon />
      </button>

      {isOpen && (
        <div className="absolute z-[99999] flex h-[94dvh] w-full flex-col justify-end overflow-hidden rounded-[10px] shadow md:absolute md:right-0 md:bottom-20 md:h-auto md:w-[600px] md:rounded-[20px]">
          <ChatBotHeader
            setIsOpen={setIsOpen}
            setShowEndChatConfirm={setShowEndChatConfirm}
          />
          <ChatBotMainChatArea
            chatMessages={chatMessages}
            suggestions={suggestions}
            activeSuggestions={activeSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            isPending={isPending}
          />
          <ChatBotTextarea
            onSubmit={handleSubmit(onSubmit)}
            register={register}
          />
          <ChatBotFooter />
          <EndChatModal
            showEndChatConfirm={showEndChatConfirm}
            setShowEndChatConfirm={setShowEndChatConfirm}
            handleEndChat={handleEndChat}
          />
        </div>
      )}
    </aside>
  );
}

export default ChatBotWrapper;
