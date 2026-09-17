import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dims = {
    sm: { box: "h-8 w-8", text: "text-base" },
    md: { box: "h-10 w-10", text: "text-lg" },
    lg: { box: "h-12 w-12", text: "text-2xl" },
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className={`relative ${dims.box} flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-105`}
      >
        <Image
          src="/icons/icon.png"
          alt=""
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
        />
      </span>
      {showText ? (
        <span className={`font-extrabold tracking-tight text-slate-900 ${dims.text}`}>
          LISTAMARILLA
        </span>
      ) : null}
    </span>
  );
}