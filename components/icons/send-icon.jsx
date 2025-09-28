function SendIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      className="h-10 w-10 md:h-12 md:w-12"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={24} cy={24} r={24} fill="black" />
      <path
        d="M16.5 22.3332L17.6667 23.4998L23.1667 18.0007V33.1665H24.8333V18.0007L30.3333 23.4998L31.5 22.3332L24 14.8332L16.5 22.3332Z"
        fill="white"
      />
    </svg>
  );
}

export default SendIcon;
