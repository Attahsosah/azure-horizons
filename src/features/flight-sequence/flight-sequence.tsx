"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { ImageWithFallback } from "@/components/layout/image-with-fallback";
import { Reveal } from "@/components/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Banking-descent frames (generated from the hero, style-matched). Referenced by
// URL from the connector CDN; can be moved into /public for production.
const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FtpS2BXtpWM9PBWamolQGsBF7O";
const FRAME_1 = `${CDN}/hf_20260727_185849_c17f0e0e-dd2c-4d27-b9ab-4af874205010.png`;
const FRAME_2 = `${CDN}/hf_20260727_185851_61cf6864-95d8-4fb3-899f-2e002ca682b6.png`;
const FRAME_3 = `${CDN}/hf_20260727_185853_3a191649-e8d1-4348-a4ab-7222a0897cb1.png`;
const FRAME_4 = `${CDN}/hf_20260727_185855_b45be026-30e4-4aa9-ae7b-b5ddc2f4c7f7.png`;

interface FlightSequenceProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

/**
 * Scroll-scrubbed cinematic descent. A tall track pins a full-viewport stage and
 * crossfades through the banking-approach frames as the user scrolls; the
 * descent completes by ~60% and the final frame + headline hold for the rest.
 * Under reduced motion it collapses to a single static band.
 */
export function FlightSequence({ eyebrow, title, subtitle }: FlightSequenceProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const o0 = useTransform(scrollYProgress, [0.0, 0.18], [1, 0]);
  const o1 = useTransform(scrollYProgress, [0.08, 0.2, 0.34], [0, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.28, 0.4, 0.54], [0, 1, 0]);
  const o3 = useTransform(scrollYProgress, [0.48, 0.6], [0, 1]);

  const scale = useTransform(scrollYProgress, [0, 0.6], [1.14, 1.02]);
  const textOpacity = useTransform(scrollYProgress, [0.52, 0.64], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.52, 0.64], [28, 0]);

  const layers: { src: string; opacity: MotionValue<number> }[] = [
    { src: FRAME_1, opacity: o0 },
    { src: FRAME_2, opacity: o1 },
    { src: FRAME_3, opacity: o2 },
    { src: FRAME_4, opacity: o3 },
  ];

  if (reduce) {
    return (
      <section className="relative h-[80vh] min-h-[460px] w-full overflow-hidden bg-navy">
        <ImageWithFallback src={FRAME_4} alt="" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/35 to-navy/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-6 pb-[14vh] text-center">
          <span className="mb-4 text-fluid-sm font-medium uppercase tracking-[0.24em] text-turquoise">
            {eyebrow}
          </span>
          <h2 className="font-display text-fluid-h1 text-white text-balance">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-fluid-lg text-white/85 text-balance">
            {subtitle}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-navy">
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ opacity: layer.opacity, scale }}
          >
            <ImageWithFallback
              src={layer.src}
              alt=""
              sizes="100vw"
              priority={i === 0}
            />
          </motion.div>
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/15 to-navy/40"
        />

        <motion.div
          className="absolute inset-0 mx-auto flex max-w-4xl flex-col items-center justify-end px-6 pb-[14vh] text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <Reveal direction="up">
            <span className="mb-4 inline-block text-fluid-sm font-medium uppercase tracking-[0.24em] text-turquoise">
              {eyebrow}
            </span>
          </Reveal>
          <h2 className="font-display text-fluid-h1 text-white text-balance [text-shadow:0_2px_34px_rgba(10,28,51,0.6)]">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-fluid-lg text-white/85 text-balance">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
