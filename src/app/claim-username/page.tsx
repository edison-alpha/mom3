'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CircleHelp } from 'lucide-react';
import StepIndicator from './_components/step-indicator';
import ChooseHandle from './_components/choose-handle';
import ConfirmHandle from './_components/confirm-handle';
import CompleteView from './_components/complete-view';

export default function ClaimUsernamePage() {
  const [step, setStep] = useState(1);
  const [handle, setHandle] = useState('ubayy');

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleContinue = useCallback(() => {
    setStep(2);
  }, []);

  const handleConfirm = useCallback(() => {
    setStep(3);
  }, []);

  const handleViewProfile = useCallback(() => {
    window.location.href = '/dashboard';
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Check out my mom3 profile @${handle}`,
        text: `I just claimed @${handle} on mom3!`,
        url: window.location.origin + `/u/${handle}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/u/${handle}`);
    }
  }, [handle]);

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pt-4 pb-28 sm:max-w-md">
        <div className="sticky top-0 z-10 -mx-5 bg-black/90 px-5 backdrop-blur-lg">
          <div className="flex items-center justify-between py-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ccff00]/60"
              aria-label={step > 1 ? 'Go back' : 'Back'}
            >
              <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.button>
            <h1 className="text-xl font-bold text-white">Claim Username</h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center -mr-2 rounded-full transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ccff00]/60"
              aria-label="Help"
            >
              <CircleHelp className="w-6 h-6 text-[#9A9AA2]" aria-hidden="true" />
            </motion.button>
          </div>

        {step < 3 && (
          <div className="px-4 pb-2">
            <StepIndicator currentStep={step} />
          </div>
        )}
      </div>

        <div className="flex flex-1 flex-col pt-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ChooseHandle
                key="choose"
                handleValue={handle}
                onHandleChange={setHandle}
                onContinue={handleContinue}
              />
            )}
            {step === 2 && (
              <ConfirmHandle
                key="confirm"
                handleValue={handle}
                onBack={handleBack}
                onConfirm={handleConfirm}
              />
            )}
            {step === 3 && (
              <CompleteView
                key="complete"
                handleValue={handle}
                onViewProfile={handleViewProfile}
                onShare={handleShare}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
