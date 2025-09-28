"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ChatIcon from "@/components/icons/chat-icon";
import ChatBotHeader from "./chat-bot-header";
import ChatBotFooter from "./chat-bot-footer";
import ChatBotTextarea from "./chat-bot-textarea";
import ChatBotMainChatArea from "./chat-bot-main-chat-area";
import EndChatModal from "./end-chat-modal";
import {
  topicsSuggestion,
  welcomeSuggestions,
} from "@/constants/welcome-suggestions";
import { useAskApi } from "@/hooks/use-ask";
import { useScheduleApi } from "@/hooks/use-schedule";

function ChatBotWrapper() {
  const [isOpen, setIsOpen] = useState(true);
  const [showEndChatConfirm, setShowEndChatConfirm] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(welcomeSuggestions);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStep, setChatStep] = useState("idle"); // idle, askName, askEmail, schedule
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showSchedule, setShowSchedule] = useState(false);

  const userIdRef = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset } = useForm();
  const { mutate: sendMessage, isPending } = useAskApi();
  const { mutate: setSchedule, isPending: isSchedulePending } =
    useScheduleApi();

  const handleSendMessage = (query) => {
    if (!query.trim()) return;

    setChatMessages((prev) => [...prev, { type: "user", text: query }]);

    // Step: Name
    if (chatStep === "askName") {
      setUserData((prev) => ({ ...prev, name: query.trim() }));
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: `Thanks ${query.trim()}! Now please enter your email.`,
        },
      ]);
      setChatStep("askEmail");
      return;
    }

    // Step: Email
    if (chatStep === "askEmail") {
      setUserData((prev) => ({ ...prev, email: query.trim() }));
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: `When would you like to schedule your booking? Please choose a date and time.`,
        },
      ]);
      setChatStep("schedule");
      setShowSchedule(true);
      return;
    }

    // Normal chat API
    setActiveSuggestions(false);
    sendMessage(
      { query, user_id: userIdRef.current },
      {
        onSuccess: (data) => {
          // Default bot reply
          if (data.action !== "schedule_meeting") {
            setChatMessages((prev) => [
              ...prev,
              { type: "bot", text: data.answer || "No reply from API" },
            ]);
          }

          // Schedule meeting flow
          if (data.action === "schedule_meeting") {
            setChatMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: "Let's schedule a meeting. What's your name?",
              },
            ]);
            setChatStep("askName");
          }

          // Services inquiry flow
          if (data.action === "services_inquiry") {
            setSuggestions(topicsSuggestion); // reset suggestions
            setActiveSuggestions(true); // show suggestions
          }
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
    setChatMessages([]);
    setActiveSuggestions(true);
    setSuggestions(welcomeSuggestions);
    setIsOpen(false);
    setShowEndChatConfirm(false);
    setChatStep("idle");
    setUserData({ name: "", email: "" });
    setShowSchedule(false);
    setScheduleSummary(null);
  };

  const handleScheduleSubmit = (scheduleData) => {
    const payload = {
      date: scheduleData.date,
      time: scheduleData.time,
      user_email: userData.email,
      summary: scheduleData.topic?.summary || "",
      description: scheduleData.topic?.description || "",
      guest_emails: scheduleData.guestEmails || [],
    };

    setSchedule(payload, {
      onSuccess: (data) => {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.message
              ? "Your meeting has been successfully booked. A confirmation email has been sent to your inbox."
              : "Somwething went wrong try again!",
          },
        ]);

        {
          data.event_link &&
            data.meet_link &&
            setChatMessages((prev) => [
              ...prev,
              {
                type: "schedule",
                data: {
                  title: scheduleData.topic?.summary || "Scheduled Meeting",
                  date: scheduleData.date,
                  time: scheduleData.time,
                  event_link: data.event_link, // from API
                  meet_link: data.meet_link, // from API
                },
              },
            ]);
        }

        setChatStep("idle");
        setUserData({ name: "", email: "" });
        setShowSchedule(false);
      },
      onError: () => {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Failed to schedule meeting. Please try again.",
          },
        ]);
      },
    });
  };

  return (
    <aside className="fixed inset-5 z-50 flex items-end md:inset-auto md:right-10 md:bottom-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-5 bottom-5 transform cursor-pointer rounded-full transition duration-200 hover:scale-110 md:right-10 md:bottom-10 ${
          isOpen ? "hidden md:block" : ""
        }`}
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
            isPending={isPending || isSchedulePending}
            chatStep={chatStep}
            showSchedule={showSchedule}
            handleScheduleSubmit={handleScheduleSubmit}
          />
          {!showSchedule && (
            <ChatBotTextarea
              onSubmit={handleSubmit(onSubmit)}
              register={register}
            />
          )}
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
