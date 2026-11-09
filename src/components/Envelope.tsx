import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MailOpen } from 'lucide-react';
import { WhiteLilyBlossomSvg, WhiteLilySprigSvg } from './DecorativeLilies';

export interface EnvelopeProps {
  recipientLabel: string;
  envelopeSubtitle: string;
  instructionText: string;
  senderName: string;
  isOpen: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  recipientLabel,
  envelopeSubtitle,
  instructionText,
  senderName,
  isOpen,
  reducedMotion,
  onOpen,
}) => {
  const handleTrigger = () => {
    if (!isOpen) {
      onOpen();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4">
      {/* Small editorial instruction above the envelope */}
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-7 sm:mb-9"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blush/70 border border-champagne/30 text-burgundy text-xs tracking-[0.2em] uppercase font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-champagne-deep" aria-hidden="true" />
          Personal Delivery
        </span>
        <p className="font-serif italic text-lg sm:text-xl text-ink-muted">
          {instructionText}
        </p>
      </motion.div>

      {/* Interactive Floating Envelope Container */}
      <motion.div
        animate={
          reducedMotion || isOpen
            ? { y: 0 }
            : {
                y: [-5, 5, -5],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 5.2,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
        className="w-full relative"
      >
        <button
          type="button"
          onClick={handleTrigger}
          aria-expanded={isOpen}
          aria-label={`${recipientLabel}. ${instructionText} Click to open the letter from ${senderName}.`}
          className="group relative w-full aspect-[16/11] sm:aspect-[16/10.5] rounded-xl cursor-pointer select-none text-left focus-visible:ring-4 focus-visible:ring-burgundy/40 transition-transform duration-300 hover:scale-[1.01]"
          style={{ perspective: '1200px' }}
        >
          {/* Ambient Paper Shadow */}
          <div
            className="absolute -inset-2 rounded-2xl bg-burgundy/5 blur-xl transition-opacity duration-500 group-hover:opacity-90"
            aria-hidden="true"
          />

          {/* Envelope Back Interior (Soft Blush Lining) */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#EAD7D3] via-[#F2E2DF] to-[#EFE7DA] border border-champagne/45 shadow-paper-lg overflow-hidden">
            {/* Subtle botanical watermark inside the envelope lining */}
            <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
              <WhiteLilySprigSvg className="w-56 h-56" />
            </div>
          </div>

          {/* Inner Letter Card (Slides upward when the envelope opens) */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? {
                    y: reducedMotion ? -28 : -78,
                    scale: reducedMotion ? 1 : 1.02,
                  }
                : { y: 0, scale: 0.96 }
            }
            transition={{
              duration: reducedMotion ? 0.1 : 0.75,
              delay: isOpen && !reducedMotion ? 0.25 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-4 sm:inset-x-7 top-4 bottom-4 rounded-lg bg-[#FCF9F4] border border-champagne/40 shadow-md px-5 py-4 sm:px-8 sm:py-6 flex flex-col justify-between z-10"
          >
            <div className="flex items-start justify-between border-b border-rose-dusty/25 pb-2.5">
              <div>
                <p className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-ink-soft font-sans">
                  {envelopeSubtitle}
                </p>
                <p className="font-handwritten text-2xl sm:text-3xl text-burgundy mt-0.5">
                  Dear Selaelo...
                </p>
              </div>
              <WhiteLilyBlossomSvg className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" />
            </div>

            <div className="my-auto py-2 space-y-2 opacity-80">
              <div className="h-1.5 w-4/5 rounded bg-rose-dusty/25" />
              <div className="h-1.5 w-2/3 rounded bg-rose-dusty/20" />
              <div className="h-1.5 w-3/4 rounded bg-rose-dusty/20" />
            </div>

            <div className="text-right">
              <span className="font-handwritten text-lg sm:text-xl text-ink-muted">
                — {senderName}
              </span>
            </div>
          </motion.div>

          {/* Envelope Side & Bottom Pocket Flaps (Warm Ivory Cotton Paper) */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-20 overflow-hidden"
            aria-hidden="true"
          >
            {/* Left Fold */}
            <svg
              viewBox="0 0 400 260"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <polygon
                points="0,0 205,135 0,260"
                fill="#F7F1E6"
                stroke="#D4AF37"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              {/* Right Fold */}
              <polygon
                points="400,0 195,135 400,260"
                fill="#F5EEE2"
                stroke="#D4AF37"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              {/* Bottom Pocket Fold */}
              <polygon
                points="0,260 200,118 400,260"
                fill="#FAF6F0"
                stroke="#C5A059"
                strokeOpacity="0.45"
                strokeWidth="1.2"
              />
            </svg>

            {/* Tucked Pressed White Lily Illustration on Envelope Front */}
            <div className="absolute left-3 bottom-2 sm:left-6 sm:bottom-3 opacity-90 transform -rotate-12">
              <WhiteLilySprigSvg className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-sm" />
            </div>

            {/* Handwritten Recipient Label Card on the Lower Pocket */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center justify-center px-4 text-center">
              <div className="bg-[#FDFBF7]/95 backdrop-blur-sm px-6 py-2.5 sm:px-9 sm:py-3.5 rounded-md border border-champagne/45 shadow-sm">
                <span className="block text-[10px] tracking-[0.22em] uppercase text-ink-soft font-sans mb-0.5">
                  A Girl from Ermelo
                </span>
                <span className="font-handwritten text-3xl sm:text-4xl md:text-[42px] leading-tight text-burgundy font-semibold">
                  {recipientLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Top Envelope Flap (Rotates open in 3D when clicked) */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? {
                    rotateX: reducedMotion ? 0 : 175,
                    opacity: reducedMotion ? 0.15 : 1,
                  }
                : {
                    rotateX: 0,
                    opacity: 1,
                  }
            }
            transition={{
              duration: reducedMotion ? 0.1 : 0.7,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              zIndex: isOpen ? 5 : 30,
            }}
            className="absolute inset-x-0 top-0 h-[58%] pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 400 155"
              preserveAspectRatio="none"
              className="w-full h-full drop-shadow-md"
            >
              <polygon
                points="0,0 400,0 200,148"
                fill="#F3ECE0"
                stroke="#C5A059"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              <polyline
                points="14,6 200,138 386,6"
                fill="none"
                stroke="#C89B98"
                strokeOpacity="0.45"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>
          </motion.div>

          {/* Decorative Deep Burgundy & Champagne Gold Wax Seal */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? {
                    scale: reducedMotion ? 0.85 : 0.65,
                    opacity: 0,
                    y: reducedMotion ? 0 : -24,
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={{ duration: reducedMotion ? 0.1 : 0.45 }}
            className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-none"
          >
            <div className="wax-seal w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-champagne/50 transition-transform duration-300 group-hover:scale-105">
              <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full border border-champagne/65 flex flex-col items-center justify-center p-1">
                <span className="font-serif italic text-champagne-light text-lg sm:text-xl font-semibold leading-none tracking-wider">
                  S
                </span>
                <span className="text-[8px] text-champagne/80 tracking-[0.2em] uppercase mt-0.5">
                  ♡
                </span>
              </div>
            </div>
          </motion.div>
        </button>
      </motion.div>

      {/* Accessible Interactive Prompt Below Envelope */}
      <div className="mt-7 flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy text-ivory text-sm font-medium tracking-wide shadow-sm hover:bg-burgundy-light transition-colors focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          <MailOpen className="w-4 h-4 text-champagne-light" aria-hidden="true" />
          <span>{isOpen ? 'Opening your letter...' : 'Break the seal & open letter'}</span>
        </button>
        <p className="text-xs text-ink-soft">
          Tap the wax seal or press the button above
        </p>
      </div>
    </div>
  );
};
