import Image from "next/image";
import { Award, HandCoins, Truck, PackageCheck } from "lucide-react";

const features = [
  {
    icon: Award,
    label: "Quality",
  },
  {
    icon: HandCoins,
    label: "Affordable",
  },
  {
    icon: Truck,
    label: "Fast Delivery",
  },
  {
    icon: PackageCheck,
    label: "Easy Returns",
  },
];

export default function AboutUs() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Row 1: Image + Who We Are */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl shadow-sm sm:h-96 md:h-[420px]">
            <Image
              src="/assets/about/about.webp"
              alt="Curated clothing collection on display"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>

          <div>
            <h2 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
              Who We Are?
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
              <p>
                At FAIMIKU, we believe Bangladesh is so much more than just the
                world’s garment factory—it’s the beating heart of global
                fashion. For decades, the incredible craftsmanship of our people
                has defined wardrobes across the globe. Every “Made in
                Bangladesh” label is a testament to our unmatched skill in the
                fashion industry.
              </p>
              <p>
                But we noticed a missing piece in the puzzle: while we create
                for the world, it often feels like those premium styles aren't
                meant for us to enjoy here at home. We craft the pieces that set
                international trends, yet we often have to look abroad to find
                that same level of quality for ourselves.
              </p>
              <p>FAIMIKU is here to change the narrative.</p>
              <p>
                We are dedicated to bringing the premium fabrics, timeless
                silhouettes, and global trends you love directly to you. No more
                looking overseas for that perfect, comfortable fit. We are
                bringing the same luxurious feel and elevated standards right to
                your doorstep.
              </p>
              <p>It’s time to set the trends, not just chase them.</p>
              {/* <p className="font-medium text-gray-900">
                It&apos;s time to set the trends, not chase them.
              </p> */}
            </div>
          </div>
        </div>

        {/* Row 2: Our Commitment + Image */}
        <div className="mt-20 grid grid-cols-1 items-center gap-10 md:mt-28 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
              Our Commitment
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600">
              <p>
                We are passionate about making you feel just as good as you
                look. Our commitment to you goes beyond just clothing; it’s
                about providing a seamless, premium shopping experience from
                start to finish.
              </p>
              <p>
                From our carefully curated, versatile collections—designed for
                all-day comfort and effortless style—to our friendly and
                responsive customer support, we strive for excellence in every
                detail. We believe in building genuine, lasting relationships
                with our community through transparency and trust. Your
                confidence and satisfaction are what drive us, and we are
                constantly looking for new ways to elevate your style and exceed
                your expectations.
              </p>
            </div>
          </div>

          <div className="relative order-1 h-72 w-full overflow-hidden rounded-2xl shadow-sm sm:h-96 md:order-2 md:h-[420px]">
            <Image
              src="/assets/about/about.webp"
              alt="Fashion store interior with organized apparel"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-lime-300 text-lime-600">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
