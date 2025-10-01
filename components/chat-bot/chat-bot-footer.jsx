import Link from "next/link";

function ChatBotFooter() {
  return (
    <footer className="flex w-full items-center justify-start bg-[#F0F6FF] p-3 text-[#7d7c7c] md:p-3">
      <p className="!text-xs leading-[1.6em] font-normal md:text-base">
        By using this chatbot, you agree to our{" "}
        <Link href="/" className="font-bold text-[#6b9bfa]">
          Privacy Policy.
        </Link>
      </p>
    </footer>
  );
}

export default ChatBotFooter;
