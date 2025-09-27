import NhAvatorIcon from "../icons/nh-avator-icon";

function BotChat({ text }) {
  return (
    <div className="flex w-full flex-col items-start gap-3 md:flex-row md:items-end md:gap-5">
      <div className="w-[36px]">
        <NhAvatorIcon size={36} />
      </div>
      <div className="flex grow flex-col items-start justify-start rounded-[10px] rounded-tl-none bg-[#F0F6FF] px-3 py-2 text-left text-base leading-[1.6em] font-normal text-black md:rounded-tl-[10px] md:rounded-bl-none md:px-4 md:text-[18px]">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default BotChat;
