function ClientChat({ text }) {
  return (
    <div className="flex w-full flex-col items-end gap-3 md:flex-row md:items-end md:justify-end md:gap-5">
      <div className="flex flex-col items-center justify-end rounded-[10px] rounded-br-none bg-black px-3 py-2 text-left text-base leading-[1.6em] font-normal text-white md:px-4 md:text-[18px]">
        <p className="">{text}</p>
      </div>
    </div>
  );
}

export default ClientChat;
