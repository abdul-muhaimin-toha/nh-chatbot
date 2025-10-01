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
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
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

  // Function to close popup with animation
  const handleClosePopup = () => {
    setPopupFading(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupFading(false);
    }, 300);
  };

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
      {/* Popup that appears for 3 seconds */}
      {showPopup && !isOpen && (
        <div className={`absolute bottom-16 right-0 z-[99998] md:bottom-20 md:right-0 ${popupFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className="relative w-[280px] md:w-[350px] min-h-[180px] md:min-h-[208px] rounded-3xl bg-white p-4 md:p-6 shadow-2xl border border-gray-100">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 bg-white border-r border-b border-gray-100"></div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg">
                  <div className="scale-75">
                    <ChatIcon />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 mb-1">
                  {getTimeBasedGreeting()}, I'm NH Buddy.
                </p>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed;">
                  If you have any question, please let me know.
                </p>
                <button
                  onClick={handleOpenChatFromPopup}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black-600 bg-white-50 border border-grey-200 rounded-full hover:bg-white-100 hover:border-grey-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Yes, I have a question
                </button>
              </div>
            </div>
            
            {/* Close button */}
            {/* <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button> */}
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
        <div className="absolute z-[99999] flex h-[94dvh] w-full flex-col overflow-hidden rounded-[10px] shadow transition-all duration-300 ease-in-out md:absolute md:right-0 md:bottom-20 md:h-auto md:min-h-[450px] md:max-h-[680px] md:w-[400px] md:rounded-[20px]">
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
