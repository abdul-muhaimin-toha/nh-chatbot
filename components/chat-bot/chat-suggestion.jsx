function ChatSuggestion({
  suggestions = [],
  activeSuggestions = false,
  handleSuggestionClick,
}) {
  if (!activeSuggestions || suggestions.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-3 text-base leading-[1.6em] font-normal text-[#1158E5] md:ml-14 md:w-fit md:text-[18px] md:font-medium">
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          className="w-fit cursor-pointer rounded-full border border-[#0000001A] px-3 py-1 text-left md:px-[18px]"
          onClick={() => handleSuggestionClick(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default ChatSuggestion;
