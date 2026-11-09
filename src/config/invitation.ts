import { InvitationConfig } from '../types/invitation';

/**
 * ============================================================================
 * CENTRAL PERSONALISATION CONFIGURATION — "A Little Something for Selaelo"
 * ============================================================================
 * All personal copy, date details, photographs, inside jokes, and notification
 * settings live in this single file for effortless editing.
 * ============================================================================
 */
export const invitationConfig: InvitationConfig = {
  invitationId: 'selaelo-first-date-44-stanley',

  recipient: {
    fullName: 'Selaelo Phosa',
    firstName: 'Selaelo',
    envelopeLabel: 'For Selaelo',
    envelopeSubtitle: 'Handwritten Note · A Girl from Ermelo',
    envelopeInstruction: 'A little something for you.',
  },

  sender: {
    firstName: 'Andile',
    notificationEmail: 'andilemlwanga@gmail.com',
    // Free Web3Forms Access Key (safe for static frontend bundles, routes directly to your inbox)
    web3FormsAccessKey: '1596fcfb-100c-4b2e-8e0e-a4f47ab9d178',
  },

  letter: {
    dateHeader: 'A Personal Note · A Girl from Ermelo',
    salutation: 'Dear Selaelo,',
    paragraphs: [
      'I was thinking about how interesting it is that two people can spend time getting to know each other, share conversations, exchange a few laughs, and somehow make an ordinary day a little more interesting.',
      'And somewhere between all that, I thought it might be nice to take things beyond our usual conversations.',
      'Now, I could have just sent you a normal message...',
      "But where's the fun in that?",
      'So, I decided to do something a little different.',
    ],
    signOffIntro: 'With a little intention,',
    signOffName: 'Andile.',
    caffeineFootnote: 'Plato Dirty Carribean',
    ctaText: "There's a little more...",
  },

  scrapbook: {
    sectionEyebrow: 'Pages from the Margin',
    sectionHeading: 'A Few Small Details',
    sectionSubheading:
      'Little observations, a couple of snapshots, and a few things that made building this for you feel natural.',
    photographs: {
      selaelo: {
        id: 'selaelo',
        src: './images/selaelo-photo.jpg',
        alt: 'Portrait photograph of Selaelo',
        caption: 'Someone who makes getting to know her a little more interesting.',
        frameTitle: 'Selaelo',
        placeholderMonogram: 'S',
        placeholderNote: 'public/images/selaelo-photo.jpg',
        rotation: -2.5,
        size: 'standard',
        tapeStyle: 'top-center',
      },
      together: {
        id: 'together',
        src: './images/together-photo.jpg',
        alt: 'Portrait photograph of Andile',
        caption: 'A little moment worth keeping.',
        frameTitle: 'Andile',
        placeholderMonogram: 'A',
        placeholderNote: 'public/images/together-photo.jpg',
        rotation: 2,
        size: 'featured',
        tapeStyle: 'corners',
      },
    },
    insideJokes: [
      {
        id: 'caffeine',
        categoryLabel: 'Note 01 · Daily Fuel & Dashboards',
        note: 'Some of us run on a Plato Dirty Carribean. Others are busy building Power BI magic with the lovely Joy.',
        subtext: 'Both seem to keep the workaholic hours productive.',
        rotation: -1.5,
      },
      {
        id: 'analytics',
        categoryLabel: 'Note 02 · Peer-Reviewed Observation',
        note: 'Important research finding: spending time together might actually be a good idea.',
        subtext: 'p < 0.01 · High confidence interval.',
        rotation: 1.8,
      },
      {
        id: 'gold-chain',
        categoryLabel: 'Note 03 · Aesthetic Detail',
        note: 'A little golden detail for someone with an eye for the finer things.',
        subtext: 'Warm champagne gold & white lilies.',
        rotation: -1.2,
      },
    ],
    ctaText: "Okay, here's what I wanted to ask...",
  },

  dateDetails: {
    eyebrow: 'The Invitation',
    mainHeading: 'Selaelo, would you let me take you on a date?',
    supportingMessage:
      "I'd really love to spend some time with you, enjoy some good food, have a few laughs, and hopefully make a lovely memory together.",
    destinationLabel: 'DESTINATION',
    restaurantName: '44 Stanley',
    location: '44 Stanley, Johannesburg',
    planLabel: 'PLAN',
    movieDescription: 'Dinner followed by Godzilla Minus Zero.',
    dateLabel: 'DATE',
    proposedDate: 'Wed. Nov 11, 2026',
    timeLabel: 'TIME',
    proposedTime: '8:00pm SAST',
    buttons: {
      yes: "Yes, I'd love to! ♡",
      maybe: "Maybe, let's see...",
      no: 'No, thank you.',
    },
  },

  responses: {
    YES: {
      badgeText: 'Invitation Accepted',
      heading: 'Well, that just made my day! ♡',
      paragraphs: [
        "I was hoping you'd say yes.",
        "Now all that's left is to plan an evening worth looking forward to.",
      ],
      closingNote:
        'Looking forward to 44 Stanley, Godzilla Minus Zero, and our first proper evening out.',
    },
    MAYBE: {
      badgeText: 'Thoughtfully Noted',
      heading: "That's perfectly okay. ♡",
      paragraphs: [
        'No pressure at all, Selaelo. Take your time. The invitation is here whenever you’re ready.',
      ],
      closingNote:
        'Whenever your schedule (and the Power BI dashboards) allow, the invitation stays open.',
    },
    NO: {
      badgeText: 'With Appreciation',
      heading: 'Thank you for being honest. ♡',
      paragraphs: [
        'I appreciate you taking the time to read my little letter. Wishing you nothing but good things, Selaelo.',
      ],
      closingNote:
        'Thank you for your kindness and honesty — wishing you all the very best.',
    },
  },

  closing: {
    signatureQuote:
      'Made with a little creativity, a little caffeine, and genuine intention.',
    signatureAuthor: '— Andile',
    botanicalFootnote: 'White Lilies · 44 Stanley · A Girl from Ermelo',
  },

  assets: {
    lilyIllustration: './images/lily-decoration.svg',
  },
};
