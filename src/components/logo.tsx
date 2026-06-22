import stickyLogo from "@/img/hug/sticky-logo.png";
import mainLogo from "@/img/hug/main-logo.png";

export function Logo({ className, ...props }: { className?: string } & React.ComponentProps<"span">) {
  return (
    <span className={`inline-flex ${className ?? ""}`} {...props}>
      <span className="inline-flex md:hidden">
        <img
          src={stickyLogo.src}
          alt="ApiHug"
          className="h-7 w-auto dark:hidden"
        />
        <img
          src={mainLogo.src}
          alt="ApiHug"
          className="hidden h-7 w-auto dark:block"
        />
      </span>
      <span className="hidden items-end gap-3 md:flex">
        <span className="inline-flex">
          <img
            src={stickyLogo.src}
            alt="ApiHug"
            className="h-7 w-auto dark:hidden"
          />
          <img
            src={mainLogo.src}
            alt="ApiHug"
            className="hidden h-7 w-auto dark:block"
          />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-mono text-[11px]/4 tracking-[0.24em] text-gray-500 dark:text-gray-400">
            AI-native Enterprise Architecture Factory
          </span>
        </span>
      </span>
    </span>
  );
}

export function LogoMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 34 24" fill="none" {...props}>
      <path fill="transparent" d="M0 0H34V24H0z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.668 2c-4.445 0-7.223 2.222-8.334 6.667 1.667-2.222 3.611-3.055 5.833-2.5 1.268.317 2.175 1.236 3.178 2.255C18.979 10.081 20.87 12 25 12c4.445 0 7.223-2.222 8.334-6.666-1.666 2.222-3.61 3.055-5.833 2.5-1.269-.318-2.175-1.237-3.178-2.255C22.69 3.919 20.8 2 16.668 2zM8.334 12C3.889 12 1.11 14.222 0 18.667c1.667-2.222 3.612-3.056 5.833-2.5 1.269.316 2.175 1.236 3.178 2.255C10.645 20.081 12.536 22 16.668 22c4.444 0 7.222-2.222 8.333-6.666-1.667 2.222-3.611 3.055-5.833 2.5-1.268-.317-2.175-1.238-3.177-2.255C14.356 13.92 12.463 12 8.334 12z"
        fill="color(display-p3 .2196 .7412 .9725)"
      />
    </svg>
  );
}
