import Link from "next/link";

function ChatBotFooter() {
  return (
    <footer className="flex w-full items-center justify-start bg-[#F0F6FF] p-3 text-[#4D4D4D] md:p-5">
      <p className="text-sm leading-[1.6em] font-normal md:text-base">
        By using this chatbot, you agree to our{" "}
        <Link href="/" className="font-bold text-[#1158E5]">
          Privacy Policy.
        </Link>
      </p>
    </footer>
  );
}

export default ChatBotFooter;
