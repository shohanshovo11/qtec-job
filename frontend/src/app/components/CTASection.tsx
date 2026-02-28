import Image from "next/image";

export default function CTASection() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="relative bg-[var(--action-primary)] overflow-hidden flex flex-col lg:flex-row lg:items-center">
          {/* Top-left white diagonal triangle */}
          <div
            className="absolute -top-1 -left-1 w-20 h-20 bg-white"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />

          {/* Bottom-right white diagonal triangle */}
          <div
            className="absolute -bottom-1 -right-1 w-20 h-20 bg-white"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          />

          {/* Left content */}
          <div className="relative z-10 flex-1 px-12 py-14 max-w-lg">
            <h2
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-white mb-4"
              style={{
                fontFamily:
                  "var(--font-sora), var(--font-epilogue), sans-serif",
              }}
            >
              Start posting
              <br />
              jobs today
            </h2>
            <p
              className="text-white/80 text-base mb-8"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Start posting jobs for only $10.
            </p>
            <button
              className="inline-flex items-center justify-center bg-white text-[var(--action-primary)] font-semibold text-sm px-8 py-4 hover:bg-gray-100 transition-colors duration-200"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Sign Up For Free
            </button>
          </div>

          {/* Right — dashboard image */}
          <div className="relative flex-1 w-full h-[260px] sm:h-[320px] lg:h-[400px] lg:self-stretch">
            <Image
              src="/images/dashboard.png"
              alt="Dashboard preview"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
