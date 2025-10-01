import Link from "next/link";

function ScheduleCard({ scheduleData }) {
  const { title, date, time, event_link, meet_link } = scheduleData;

  const formatScheduleDate = (dateString, timeString) => {
    if (!dateString || !timeString) return "";
    const [hour, minutePart] = timeString
      .split(/[:\s]/)
      .map((v) => (isNaN(v) ? v : parseInt(v)));
    const isPM = timeString.includes("PM");
    const startHour = (hour % 12) + (isPM ? 12 : 0);
    const startDate = new Date(dateString);
    startDate.setHours(startHour, minutePart, 0, 0);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedStart = startDate.toLocaleTimeString("en-US", options);
    const formattedEnd = endDate.toLocaleTimeString("en-US", options);
    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${formattedStart} - ${formattedEnd}, ${formattedDate}`;
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] bg-white p-4 md:p-5 shadow-xl mx-2 md:mx-4">
      <div className="flex flex-col">
        <p className="mb-3 text-base md:text-lg font-medium text-black">
          30 Minute Complimentary Discovery Call
        </p>
        <p className="mb-6 md:mb-6 text-sm md:text-base font-medium text-black">{title}</p>
        <div className="flex w-full flex-col gap-1 text-sm font-normal text-[#4D4D4D]">
          {/* Duration */}
          <div className="flex flex-row items-center justify-start gap-3">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM10.625 5C10.625 4.83424 10.5592 4.67527 10.4419 4.55806C10.3247 4.44085 10.1658 4.375 10 4.375C9.83424 4.375 9.67527 4.44085 9.55806 4.55806C9.44085 4.67527 9.375 4.83424 9.375 5V10C9.375 10.345 9.655 10.625 10 10.625H13.75C13.9158 10.625 14.0747 10.5592 14.1919 10.4419C14.3092 10.3247 14.375 10.1658 14.375 10C14.375 9.83424 14.3092 9.67527 14.1919 9.55806C14.0747 9.44085 13.9158 9.375 13.75 9.375H10.625V5Z"
                  fill="#4D4D4D"
                />
              </g>
            </svg>
            <p>30 min</p>
          </div>

          {/* Date & Time */}
          <div className="flex flex-row items-center justify-start gap-3">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.625 1.875C5.79076 1.875 5.94973 1.94085 6.06694 2.05806C6.18415 2.17527 6.25 2.33424 6.25 2.5V3.75H13.75V2.5C13.75 2.33424 13.8158 2.17527 13.9331 2.05806C14.0503 1.94085 14.2092 1.875 14.375 1.875C14.5408 1.875 14.6997 1.94085 14.8169 2.05806C14.9342 2.17527 15 2.33424 15 2.5V3.75H15.625C16.288 3.75 16.9239 4.01339 17.3928 4.48223C17.8616 4.95107 18.125 5.58696 18.125 6.25V15.625C18.125 16.288 17.8616 16.9239 17.3928 17.3928C16.9239 17.8616 16.288 18.125 15.625 18.125H4.375C3.71196 18.125 3.07607 17.8616 2.60723 17.3928C2.13839 16.9239 1.875 16.288 1.875 15.625V6.25C1.875 5.58696 2.13839 4.95107 2.60723 4.48223C3.07607 4.01339 3.71196 3.75 4.375 3.75H5V2.5C5 2.33424 5.06585 2.17527 5.18306 2.05806C5.30027 1.94085 5.45924 1.875 5.625 1.875ZM16.875 9.375C16.875 9.04348 16.7433 8.72554 16.5089 8.49112C16.2745 8.2567 15.9565 8.125 15.625 8.125H4.375C4.04348 8.125 3.72554 8.2567 3.49112 8.49112C3.2567 8.72554 3.125 9.04348 3.125 9.375V15.625C3.125 15.9565 3.2567 16.2745 3.49112 16.5089C3.72554 16.7433 4.04348 16.875 4.375 16.875H15.625C15.9565 16.875 16.2745 16.7433 16.5089 16.5089C16.7433 16.2745 16.875 15.9565 16.875 15.625V9.375Z"
                  fill="#4D4D4D"
                />
              </g>
            </svg>
            <p>{formatScheduleDate(date, time)}</p>
          </div>

          {/* Links */}
          <div className="mt-3 flex flex-col gap-2">
            {event_link && (
              <Link
                href={event_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#1158E5] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#0e3ecb]"
              >
                View Event in Google Calendar
              </Link>
            )}
            {meet_link && (
              <a
                href={meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1158E5] px-4 py-2 text-center text-sm font-medium text-[#1158E5] hover:bg-[#1158E51A]"
              >
                Join Google Meet
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCard;
