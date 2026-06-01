import type { Metadata } from 'next';
import WritingChallengeContent from './WritingChallengeContent';

export const metadata: Metadata = {
  title: "#TheWriteAngle — 21-Day Writing Challenge by BookLeaf",
  description:
    "Join BookLeaf's 21-day writing challenge for ₹1,999. Daily guided prompts, AI writing assistant, and get published in a curated anthology. Limited slots available.",
};

export default function WritingChallengePage() {
  return <WritingChallengeContent />;
}
