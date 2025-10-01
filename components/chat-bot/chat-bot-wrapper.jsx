"use client";

import { useRef, useState, useEffect } from "react";
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

const generateUUID = () => {
  // Check if crypto.randomUUID is available
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback UUID generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function ChatBotWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEndChatConfirm, setShowEndChatConfirm] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(welcomeSuggestions);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStep, setChatStep] = useState("idle"); // idle, askName, askEmail, schedule
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupFading, setPopupFading] = useState(false);

  // const userIdRef = useRef(crypto.randomUUID());
  const userIdRef = useRef(generateUUID());
  const { register, handleSubmit, reset } = useForm();
  const { mutate: sendMessage, isPending } = useAskApi();
  const { mutate: setSchedule, isPending: isSchedulePending } =
    useScheduleApi();

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Show popup for 3 seconds when component mounts
  useEffect(() => {
    setShowPopup(true);
    const timer = setTimeout(() => {
      setPopupFading(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupFading(false);
      }, 300); // Wait for fade-out animation to complete
    }, 300000);

    return () => clearTimeout(timer);
  }, []);

  // Function to open chat from popup
  const handleOpenChatFromPopup = () => {
    setPopupFading(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupFading(false);
      setIsOpen(true);
    }, 300);
  };

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = query.trim();

      if (!emailRegex.test(trimmedEmail)) {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Please enter a valid email address (e.g., example@domain.com).",
          },
        ]);
        return;
      }

      setUserData((prev) => ({ ...prev, email: trimmedEmail }));
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: `Thanks! Your email ${trimmedEmail} has been recorded. When would you like to schedule your booking? Please choose a date and time.`,
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
          // Default bot reply (if not special action)
          if (
            data.action !== "schedule_meeting" &&
            data.action !== "specific_service_inquiry"
          ) {
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

          // 🔹 Specific service inquiry flow
          if (data.action === "specific_service_inquiry") {
            setChatMessages((prev) => [
              ...prev,
              {
                type: "specific_service", // different type so you can render differently
                data: data.service || {}, // you can put extra details here
                text: data.answer || "Here are details about the service.",
              },
            ]);
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
      {/* Popup that appears for 3 seconds */}
      {showPopup && !isOpen && (
        <div
          className={`absolute right-0 bottom-16 z-[99998] md:right-0 md:bottom-20 ${popupFading ? "animate-fade-out" : "animate-fade-in"}`}
        >
          <div className="relative min-h-[180px] w-[280px] rounded-3xl border border-gray-100 bg-white p-4 shadow-2xl md:min-h-[208px] md:w-[350px] md:p-6">
            {/* Speech bubble arrow */}
            <div className="absolute right-8 -bottom-2 h-4 w-4 rotate-45 border-r border-b border-gray-100 bg-white"></div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                  <div className="scale-75">
                    <ChatIcon />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-base font-semibold text-gray-900">
                  {getTimeBasedGreeting()}, I'm NH Buddy.
                </p>
                <p className="leading-relaxed; mb-6 text-sm text-gray-600">
                  If you have any question, please let me know.
                </p>
                <button
                  onClick={handleOpenChatFromPopup}
                  className="text-black-600 bg-white-50 border-grey-200 hover:bg-white-100 hover:border-grey-300 inline-flex transform items-center justify-center rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  Yes, I have a question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-5 bottom-5 transform cursor-pointer rounded-full transition duration-200 hover:scale-110 md:right-10 md:bottom-10 ${
          isOpen ? "hidden md:block" : ""
        }`}
      >
        <ChatIcon />
      </button>

      {isOpen && (
        <div className="absolute z-[99999] flex h-[94dvh] w-full flex-col overflow-hidden rounded-[10px] shadow transition-all duration-300 ease-in-out md:absolute md:right-0 md:bottom-20 md:h-auto md:max-h-[680px] md:min-h-[450px] md:w-[420px] md:rounded-[20px]">
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
