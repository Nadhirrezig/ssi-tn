export default function WhyChooseUs() {
  return (
    <section id="why" className="py-24">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 lg:grid-cols-2">
        {/* Image collage */}
        <div className="relative">
          <div className="grid grid-cols-[1fr_1.25fr] gap-5">
            <div className="flex flex-col gap-5 pt-10">
              <div className="ph aspect-[4/5] rounded-2xl" data-label="Photo" />
              <div className="ph aspect-[4/5] rounded-2xl" data-label="Photo" />
            </div>
            <div className="ph aspect-[3/5] self-center rounded-2xl" data-label="Photo" />
          </div>
          <div className="absolute -bottom-6 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-primary/90" />
          <div className="absolute -top-4 right-6 h-16 w-16 rounded-bl-[999px] bg-accentYellow" />
        </div>

        {/* Copy */}
        <div className="lg:pl-6">
          <p className="font-heading text-base font-bold text-primary">Why Choose Us</p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-navy sm:text-[44px]">
            Next.js Template with Powerful Integrations
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slatebody">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
          </p>
          <button className="group mt-10 flex items-center gap-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-float transition group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-navy">See how we work</span>
          </button>
        </div>
      </div>
    </section>
  )
}
