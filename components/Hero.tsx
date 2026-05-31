import Link from 'next/link'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-20">
      <div className="mx-auto grid max-w-content items-center gap-10 px-6 lg:grid-cols-2 lg:gap-6">
        {/* Copy */}
        <div className="relative z-10 py-16 lg:py-28">
          <h1 className="font-heading text-5xl font-bold leading-[1.08] text-navy sm:text-6xl lg:text-[64px]">
            Next.js SaaS Boilerplate Template with Landing Page
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-slatebody">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla magna mauris. Nulla fermentum viverra sem eu rhoncus consequat varius nisi quis, posuere magna.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-7">
            <Link
              href="#"
              className="rounded-full bg-primary px-9 py-4 font-heading text-base font-bold text-white shadow-float transition hover:bg-primary-700"
            >
              Get Started Now
            </Link>
            <div>
              <p className="font-heading text-lg font-bold text-navy">Call us (0123) 456 – 789</p>
              <p className="text-sm text-slatebody">For any question or concern</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto h-[420px] w-full max-w-[560px] lg:h-[640px]">
          {/* big blue disc */}
          <div className="absolute right-[-10%] top-1/2 aspect-square w-[120%] -translate-y-1/2 rounded-full bg-primary" />
          {/* portrait placeholder */}
          <div
            className="ph absolute bottom-0 right-[6%] h-[78%] w-[70%] overflow-hidden rounded-full"
            data-label="Hero portrait"
          />
          {/* yellow quarter circle */}
          <div className="absolute left-[8%] top-[40%] h-28 w-28 rounded-br-[999px] bg-accentYellow" />
          {/* coral waves */}
          <svg
            className="absolute bottom-[16%] left-[6%] w-24 text-accentCoral"
            viewBox="0 0 80 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M2 10c8-8 14 8 22 0M2 22c8-8 14 8 22 0M2 34c8-8 14 8 22 0" />
            <path d="M30 10c8-8 14 8 22 0M30 22c8-8 14 8 22 0M30 34c8-8 14 8 22 0" />
          </svg>
          {/* bright blue quarter */}
          <div className="absolute bottom-[6%] right-[2%] h-20 w-20 rounded-tl-[999px] bg-accentBlue" />
        </div>
      </div>
    </section>
  )
}
