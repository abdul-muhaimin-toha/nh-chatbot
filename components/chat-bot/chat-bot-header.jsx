import CLoseIcon from "../icons/close-icon";
import MinimizeIcon from "../icons/minimize-icon";

function ChatBotHeader({ setIsOpen, setShowEndChatConfirm }) {
  return (
    <header className="flex w-full items-center justify-between gap-5 bg-black p-5 text-white">
      <h3 className="text-lg leading-[1.4em] font-bold md:text-2xl">
        Chating Bot
      </h3>
      <div className="flex flex-row items-center justify-end gap-5">
        <button onClick={() => setIsOpen(false)} className="cursor-pointer">
          <MinimizeIcon />
        </button>
        <button
          onClick={() => setShowEndChatConfirm(true)}
          className="cursor-pointer"
        >
          <CLoseIcon />
        </button>
      </div>
    </header>
  );
}

export default ChatBotHeader;
