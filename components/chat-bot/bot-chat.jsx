import NhAvatorIcon from "../icons/nh-avator-icon";
import ReactMarkdown from "react-markdown";

function BotChat({ text, msg, handleSuggestionClick }) {
  console.log(msg);
  return (
    <div className="flex w-full flex-col items-start gap-3 md:flex-row md:items-end md:gap-5">
      <div className="w-[36px]">
        <NhAvatorIcon size={36} />
      </div>
      <div className="flex grow flex-col items-start justify-start rounded-[10px] rounded-tl-none bg-[#F0F6FF] px-3 py-2 text-left text-base leading-[1.6em] font-normal text-black md:rounded-tl-[10px] md:rounded-bl-none md:px-4">
        <div className="bot-chat">
          <ReactMarkdown
            components={{
              ul: ({ children }) => (
                <ul className="list-disc ml-6 my-2 space-y-1">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-black">{children}</strong>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
        {msg?.type === "specific_service" && (
          <div className="mt-5 flex flex-col gap-4">
            <p className="text-left text-base leading-[1.6em] font-normal text-black">
              We would love to collaborate with you. Lets Schedule a meeting and
              discuss your goals.
            </p>
            <button
              onClick={() => handleSuggestionClick("📅 Schedule a meeting")}
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-[#1158E5] bg-[#1158E5] p-3 text-sm leading-[1.57em] font-medium text-white transition duration-300 ease-in-out hover:bg-[#0e3ecb] focus:ring-2 focus:ring-[#1158E5] focus:outline-none md:h-[46px]"
            >
              📆 Schedule Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BotChat;
