import NhAvatorIcon from "../icons/nh-avator-icon";

function ChatBotLoading() {
  return (
    <div className="flex w-full flex-col items-start gap-3 md:flex-row md:items-end md:gap-5">
      <div className="w-[36px]">
        <NhAvatorIcon size={36} />
      </div>

      <div className="flex w-fit flex-col items-start justify-start rounded-[10px] rounded-tl-none bg-[#F0F6FF] px-2.5 py-4 md:rounded-tl-[10px] md:rounded-bl-none md:px-4 md:py-5">
        <svg
          width={29}
          height={8}
          viewBox="0 0 29 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3">
            <circle cx="3.5" cy={4} r="3.5" fill="#4D4D4D">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1s"
                repeatCount="indefinite"
                begin="0s"
              />
            </circle>
            <circle cx="14.5" cy={4} r="3.5" fill="#4D4D4D">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1s"
                repeatCount="indefinite"
                begin="0.2s"
              />
            </circle>
            <circle cx="25.5" cy={4} r="3.5" fill="#4D4D4D">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1s"
                repeatCount="indefinite"
                begin="0.4s"
              />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default ChatBotLoading;
