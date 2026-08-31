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
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
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
                Bangladesh is more than the world&apos;s garment factory; it
                is the heart of global fashion. For decades, our hands have
                stitched the very pieces worn across the West. Every
                &ldquo;Made in Bangladesh&rdquo; label abroad is a reminder of
                our unmatched strength in fashion.
              </p>
              <p>However, a paradox remains at home.</p>
              <p>
                We create for the world, yet the world of fashion rarely
                feels as though it was meant for us. Our factories craft the
                very clothes that set global trends, yet our locals have to
                look abroad to access them.
              </p>
              <p className="font-medium text-gray-900">
                Buri Mall is here to shorten that journey.
              </p>
              <p>
                We bring the brands that inspire your style, confidence, &amp;
                identity directly to Bangladesh. No more detours. The same
                fabrics, the same standards, the same global trends, finally
                here at home.
              </p>
              <p className="font-medium text-gray-900">
                It&apos;s time to set the trends, not chase them.
              </p>
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
                We are dedicated to providing our customers with the best
                possible shopping experience. From our carefully curated
                collections to our responsive customer support team, we
                strive for excellence in everything we do.
              </p>
              <p>
                We believe in transparency, integrity, and building lasting
                relationships with our customers. Your satisfaction is our
                top priority, and we&apos;re always looking for ways to
                improve and exceed your expectations.
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