export type InvitationResponseType = 'YES' | 'MAYBE' | 'NO';

export type ExperienceStage =
  | 'ENVELOPE'
  | 'LETTER'
  | 'SCRAPBOOK'
  | 'INVITATION'
  | 'RESPONSE';

export interface InsideJokeAnnotation {
  id: 'caffeine' | 'analytics' | 'gold-chain';
  categoryLabel: string;
  note: string;
  subtext?: string;
  rotation: number;
}

export interface PolaroidPhotoConfig {
  id: 'selaelo' | 'together';
  src: string;
  alt: string;
  caption: string;
  frameTitle: string;
  placeholderMonogram: string;
  placeholderNote: string;
  rotation: number;
  size: 'standard' | 'featured';
  tapeStyle: 'top-center' | 'corners' | 'tilted';
}

export interface ResponsePathCopy {
  heading: string;
  paragraphs: string[];
  badgeText: string;
  closingNote: string;
}

export interface InvitationConfig {
  /** Unique identifier validated by the backend */
  invitationId: string;

  /** Recipient details */
  recipient: {
    fullName: string;
    firstName: string;
    envelopeLabel: string;
    envelopeSubtitle: string;
    envelopeInstruction: string;
  };

  /** Sender details */
  sender: {
    firstName: string;
    notificationEmail: string;
    /**
     * Free Web3Forms Access Key (https://web3forms.com)
     * Safe for static sites — routes responses directly to your email inbox.
     * Can be set here or via VITE_WEB3FORMS_ACCESS_KEY in .env
     */
    web3FormsAccessKey?: string;
  };

  /** Stage 2: Personal Handwritten Letter */
  letter: {
    dateHeader: string;
    salutation: string;
    paragraphs: string[];
    signOffIntro: string;
    signOffName: string;
    caffeineFootnote: string;
    postscript?: string;
    ctaText: string;
  };

  /** Stage 3: Memory Scrapbook, Photographs & Personal Annotations */
  scrapbook: {
    sectionEyebrow: string;
    sectionHeading: string;
    sectionSubheading: string;
    photographs: {
      selaelo: PolaroidPhotoConfig;
      together: PolaroidPhotoConfig;
    };
    insideJokes: InsideJokeAnnotation[];
    ctaText: string;
  };

  /** Stage 4: The Date Invitation Card */
  dateDetails: {
    eyebrow: string;
    mainHeading: string;
    supportingMessage: string;
    destinationLabel: string;
    restaurantName: string;
    location: string;
    planLabel: string;
    movieDescription: string;
    dateLabel: string;
    proposedDate: string;
    timeLabel: string;
    proposedTime: string;
    dressCodeNote?: string;
    buttons: {
      yes: string;
      maybe: string;
      no: string;
    };
  };

  /** Stage 5: Response Experiences (YES / MAYBE / NO) */
  responses: Record<InvitationResponseType, ResponsePathCopy>;

  /** Stage 6: Personal Closing Signature */
  closing: {
    signatureQuote: string;
    signatureAuthor: string;
    botanicalFootnote: string;
  };

  /** Decorative asset paths */
  assets: {
    lilyIllustration: string;
  };
}

export interface SubmissionPayload {
  invitation_id: string;
  recipient: string;
  response: InvitationResponseType;
  source: 'Website';
  submitted_at: string;
}

export interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  emailSent?: boolean;
  recordedAt?: string;
  errorMessage?: string;
  errorCode?: 'BACKEND_NOT_CONFIGURED' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'SERVER_ERROR';
}
