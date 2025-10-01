import React from "react";
import SendIcon from "../icons/send-icon";

function ChatBotTextarea({ onSubmit, register }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center justify-between gap-4 bg-white p-3 md:gap-5 md:p-5 border-t border-black/10"
    >
      <input
        type="text"
        placeholder="Type here (e.g.: What are the services you provide?)"
        {...register("query")}
        className="h-10 flex-1 rounded-full bg-[#F2F2F2] px-3 py-2 text-sm leading-[1.6em] font-normal text-black outline-[#1158E5] focus:outline-1 md:h-12 md:px-4 md:py-2.5 md:text-base"
      />
      <button type="submit" className="cursor-pointer rounded-full">
        <SendIcon />
      </button>
    </form>
  );
}

export default ChatBotTextarea;
