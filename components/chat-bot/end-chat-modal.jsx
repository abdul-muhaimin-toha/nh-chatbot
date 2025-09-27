import ChatCloseIcon from "../icons/chat-close-icon";

function EndChatModal({
  showEndChatConfirm,
  setShowEndChatConfirm,
  handleEndChat,
}) {
  if (!showEndChatConfirm) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#00000099]">
      <div className="flex max-w-[80vw] flex-col items-center justify-center rounded-2xl bg-white p-5 opacity-100 md:max-w-[411px]">
        <ChatCloseIcon />
        <h4 className="mt-5 text-center text-xl leading-[1.41] font-medium -tracking-[2%] text-black md:mt-8 md:text-2xl">
          Are you sure you want to end this chat?
        </h4>
        <button
          onClick={handleEndChat}
          className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-[#1158E5] bg-[#1158E5] p-3 text-sm leading-[1.57em] font-medium text-white transition duration-300 ease-in-out hover:bg-[#0e3ecb] focus:ring-2 focus:ring-[#1158E5] focus:outline-none md:mt-[30px] md:h-[46px]"
        >
          End Chat
        </button>
        <button
          onClick={() => setShowEndChatConfirm(false)}
          className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-black bg-white p-3 text-sm leading-[1.57em] font-medium text-[#4D4D4D] transition duration-300 ease-in-out hover:bg-gray-100 focus:ring-2 focus:ring-black focus:outline-none md:mt-4 md:h-[46px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EndChatModal;
