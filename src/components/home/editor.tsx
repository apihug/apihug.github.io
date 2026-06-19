import clsx from "clsx";
import { ReactNode } from "react";

export function Editor({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("flex flex-1 flex-col rounded-xl bg-gray-950", className)}>
      <div className="flex flex-1 flex-col rounded-xl p-1 text-sm scheme-dark dark:inset-ring dark:inset-ring-white/10">
        <div className="flex gap-2 p-2">
          <span className="size-3 rounded-full bg-white/20"></span>
          <span className="size-3 rounded-full bg-white/20"></span>
          <span className="size-3 rounded-full bg-white/20"></span>
        </div>
        <div className="flex flex-1 flex-col text-[13px]/6 *:*:p-3!">{children}</div>
      </div>
    </div>
  );
}
