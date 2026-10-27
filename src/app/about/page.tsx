import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-700" /> Our Origin Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-950">
          Preserving India&apos;s Living Heritage & Craft Traditions
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          BharatBazaar was founded with a singular conviction: to bridge India&apos;s extraordinary master
          artisans directly with conscious global patrons, ensuring fair livelihoods, heritage preservation,
          and uncompromised authenticity.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg" style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
            alt="Traditional loom weaving"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-gray-950">
            From Regional Clusters Directly to You
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            India is home to thousands of generational craft forms—from Kashmiri Mogra saffron and
            Pampore shawls, to Moradabad hand-hammered brassware, Chanderi silks, and classical Ayurvedic
            oil preparation.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Too often, multi-layered intermediaries dilute provenance and take the majority of margins.
            BharatBazaar eliminates middlemen, ensuring master craftsmen receive fair, dignified
            compensation while patrons receive authentic, certified goods.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-900 transition"
            >
              Explore Our Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <ShieldCheck className="h-8 w-8 text-amber-700 mb-3" />
          <h3 className="text-sm font-bold text-gray-900">100% Provenance & GI Traceability</h3>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            Every product is authenticated for raw material purity, ethical sourcing, and Geographical
            Indication certification where applicable.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <Heart className="h-8 w-8 text-amber-700 mb-3" />
          <h3 className="text-sm font-bold text-gray-900">Zero Middlemen, Fair Wages</h3>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            We partner directly with cooperatives, artisan families, and organic farming collectives
            ensuring dignified, transparent compensation.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <Users className="h-8 w-8 text-amber-700 mb-3" />
          <h3 className="text-sm font-bold text-gray-900">Sustainable & Eco-Conscious</h3>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            From plastic-free packaging to cold-pressed organic formulations, we protect both heritage
            and the earth.
          </p>
        </div>
      </div>
    </div>
  );
}
