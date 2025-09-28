"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import BackArrowIcon from "../icons/back-arrow-icon";
import { topics } from "@/constants/topics";

export default function ChatBotMeetingWrapper({ handleScheduleSubmit }) {
  const [step, setStep] = useState(1);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: null,
      time: "",
      guestEmails: [],
      topic: null,
      guestEmailInput: "",
    },
  });

  const watchFields = watch();

  const handleNext = () => {
    if (step === 1 && !watchFields.date) return;
    if (step === 2 && !watchFields.time) return;
    if (step === 3 && !watchFields.topic) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const onSubmit = (data) => {
    const formatted = {
      date: data.date
        ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, "0")}-${String(data.date.getDate()).padStart(2, "0")}`
        : null,
      time: data.time,
      topic: data.topic,
      guestEmails: data.guestEmails,
    };
    handleScheduleSubmit(formatted);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center rounded-[20px] bg-[#F2F2F2] p-5 sm:mx-14"
    >
      {step > 1 && (
        <div className="flex w-full justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white"
          >
            <BackArrowIcon />
          </button>
        </div>
      )}

      {step === 1 && <StepDate control={control} errors={errors} />}
      {step === 2 && (
        <StepTime
          control={control}
          errors={errors}
          watchDate={watchFields.date}
        />
      )}
      {step === 3 && (
        <StepGuestsAndTopic
          control={control}
          errors={errors}
          watchFields={watchFields}
          setValue={setValue}
        />
      )}

      <div className="mt-4 flex w-full justify-end gap-2 py-5">
        {step < 3 && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-[#1158E5] bg-[#1158E5] p-3 text-sm leading-[1.57em] font-medium text-white transition duration-300 ease-in-out hover:bg-[#0e3ecb] focus:ring-2 focus:ring-[#1158E5] focus:outline-none md:h-[46px]"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            type="submit"
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-[#1158E5] bg-[#1158E5] p-3 text-sm leading-[1.57em] font-medium text-white transition duration-300 ease-in-out hover:bg-[#0e3ecb] focus:ring-2 focus:ring-[#1158E5] focus:outline-none md:h-[46px]"
          >
            Confirm
          </button>
        )}
      </div>
    </form>
  );
}

function StepDate({ control, errors }) {
  return (
    <Controller
      control={control}
      name="date"
      rules={{ required: "Please select a date" }}
      render={({ field }) => (
        <div className="w-full flex-col items-center justify-center">
          <h4 className="mb-4 text-center text-2xl font-medium text-black">
            Select a Date & Time
          </h4>
          <DayPicker
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            navLayout="around"
            disabled={{ before: new Date() }}
            className="mx-auto w-full overflow-auto"
            classNames={{
              selected: `bg-[#1158E51A] flex items-center justify-center rounded-full border-none text-[#1158E5]`,
            }}
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
      )}
    />
  );
}

function StepTime({ control, errors, watchDate }) {
  const generateTimeSlots = (selectedDay) => {
    const now = new Date();
    const slots = [];
    for (let hour = 15; hour < 18; hour++) {
      ["00", "30"].forEach((min) => {
        const slotDate = new Date(selectedDay);
        slotDate.setHours(hour, parseInt(min, 10), 0, 0);
        if (slotDate >= now) {
          slots.push(
            slotDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          );
        }
      });
    }
    const lastSlot = new Date(selectedDay);
    lastSlot.setHours(18, 0, 0, 0);
    if (lastSlot >= now)
      slots.push(
        lastSlot.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    return slots;
  };

  const timeSlots = watchDate ? generateTimeSlots(watchDate) : [];

  return (
    <Controller
      control={control}
      name="time"
      rules={{ required: "Please select a time" }}
      render={({ field }) => (
        <div className="w-full">
          {watchDate && (
            <div className="flex flex-col gap-2 py-5">
              <p className="text-2xl font-medium text-black">
                {watchDate.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="text-sm font-normal text-[#4D4D4D]">
                {watchDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 py-5">
            <h5 className="text-2xl font-medium text-black">Select a Time</h5>
            <p className="text-sm font-normal text-black">Duration: 30 min</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {timeSlots.length ? (
              timeSlots.map((slot) => (
                <label
                  key={slot}
                  className={`cursor-pointer rounded-full border border-[#0000001A] p-2 text-center text-base font-medium ${
                    field.value === slot
                      ? "bg-[#4D4D4D] text-white"
                      : "bg-[#0000001A] text-[#1158E5] hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="time"
                    value={slot}
                    checked={field.value === slot}
                    onChange={() => field.onChange(slot)}
                    className="hidden"
                  />
                  {slot}
                </label>
              ))
            ) : (
              <label className="cursor-pointer rounded-full border border-[#0000001A] bg-[#0000001A] p-2 text-center text-base font-medium text-[#1158E5] hover:bg-gray-100">
                No available times for this day
              </label>
            )}
          </div>
          {errors.time && (
            <p className="mt-2 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
      )}
    />
  );
}

function StepGuestsAndTopic({ control, errors, watchFields, setValue }) {
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestEmailInput, setGuestEmailInput] = useState("");
  const [guestEmailError, setGuestEmailError] = useState("");

  const addGuest = () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Only Gmail addresses
    if (!guestEmailInput.trim()) return;

    if (!gmailRegex.test(guestEmailInput.trim())) {
      setGuestEmailError("Please enter a valid Gmail address");
      return;
    }

    setValue("guestEmails", [
      ...watchFields.guestEmails,
      guestEmailInput.trim(),
    ]);
    setGuestEmailInput("");
    setShowGuestInput(false);
    setGuestEmailError(""); // clear error after success
  };

  return (
    <>
      <div className="flex flex-col gap-2 py-5">
        <p className="text-2xl font-medium text-black">
          30 Minute Complimentary Discovery Call
        </p>
        <div className="flex w-full flex-col gap-2 text-sm font-normal text-[#4D4D4D]">
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

            {watchFields.time && watchFields.date && (
              <p>
                {(() => {
                  const [hour, minutePart] = watchFields.time
                    .split(/[:\s]/)
                    .map((v) => (isNaN(v) ? v : parseInt(v)));
                  const isPM = watchFields.time.includes("PM");
                  let startHour = (hour % 12) + (isPM ? 12 : 0);
                  const startDate = new Date(watchFields.date);
                  startDate.setHours(startHour, minutePart, 0, 0);
                  const endDate = new Date(startDate);
                  endDate.setMinutes(endDate.getMinutes() + 30);
                  const options = {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  };
                  const formattedStart = startDate.toLocaleTimeString(
                    "en-US",
                    options,
                  );
                  const formattedEnd = endDate.toLocaleTimeString(
                    "en-US",
                    options,
                  );
                  const formattedDate = startDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                  return `${formattedStart} - ${formattedEnd}, ${formattedDate}`;
                })()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Guest Emails */}
      <Controller
        control={control}
        name="guestEmails"
        render={({ field }) => (
          <div className="flex w-full flex-col gap-2 py-5 pt-0">
            <div className="flex flex-row flex-wrap gap-2">
              {field.value.map((email, idx) => (
                <div
                  key={idx}
                  className="rounded-full border border-[#0000001A] px-4 py-2 text-start text-sm font-normal text-[#1158E5]"
                >
                  {email}
                </div>
              ))}
            </div>
            {!showGuestInput ? (
              <button
                type="button"
                onClick={() => setShowGuestInput(true)}
                className="w-fit cursor-pointer rounded-full border border-[#0000001A] bg-transparent p-2 px-5 text-sm font-medium text-[#1158E5]"
              >
                Add Guest
              </button>
            ) : (
              <div className="mt-3 flex flex-col justify-between gap-2">
                <p className="text-base font-medium text-black">Guest Email</p>
                <input
                  type="email"
                  value={guestEmailInput}
                  onChange={(e) => setGuestEmailInput(e.target.value)}
                  placeholder="Enter guest email"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGuest();
                    }
                  }}
                  className="h-8 flex-1 rounded-full bg-transparent px-3 py-2 text-sm leading-[1.6em] font-normal text-black outline-1 outline-[#1158E5] focus:outline-1 md:h-10 md:px-4 md:py-2.5 md:text-base"
                />
                {guestEmailError && (
                  <p className="mt-1 text-sm text-red-600">{guestEmailError}</p>
                )}
              </div>
            )}
          </div>
        )}
      />

      {/* Topic */}
      <Controller
        control={control}
        name="topic"
        rules={{ required: "Please select a topic" }}
        render={({ field }) => (
          <div className="flex w-full flex-col gap-5 py-5 pb-0">
            <p className="text-base font-medium text-black">
              Which of our services are you most interested in?
            </p>
            <div className="flex flex-col gap-3">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => field.onChange(topic)}
                  className={`w-fit cursor-pointer rounded-full border px-4 py-2 text-start text-xs md:text-sm ${
                    field.value?.id === topic.id
                      ? "bg-[#1158E5] text-white"
                      : "border-[#1158E5] bg-transparent text-[#1158E5]"
                  }`}
                >
                  {topic.summary}
                </button>
              ))}
            </div>
            {errors.topic && (
              <p className="mt-2 text-sm text-red-600">
                {errors.topic.message}
              </p>
            )}
          </div>
        )}
      />
    </>
  );
}
