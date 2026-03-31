type FuelMapLogoProps = {
  className?: string;
  /** Accessible name; omit when the logo is decorative next to visible text. */
  title?: string;
};

/**
 * Location pin mark with a small "fuel" dot inside (uses currentColor).
 */
export default function FuelMapLogo({ className, title }: FuelMapLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* Pin outline */}
      <path
        d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fuel dot */}
      <circle cx="12" cy="11" r="2.1" fill="currentColor" />
    </svg>
  );
}
