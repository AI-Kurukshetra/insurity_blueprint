type LiveStatusBannerProps = {
  mode: "live" | "fallback";
  message: string;
};

export function LiveStatusBanner({ mode, message }: LiveStatusBannerProps) {
  return (
    <div
      className={`rounded-[1.2rem] border px-4 py-3 text-sm ${
        mode === "live"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      {message}
    </div>
  );
}
