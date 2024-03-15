export const SKIPPED_FIELDS_KEY = ['divider'];

export const CRFStatus = Object.freeze({
  PENDING: "Pending",
  PENDING_TO_VERIFY: "Verification_Pending",
  ERROR: "Error",
  COMPLETED: "Completed",
  PENDING_EXTERNAL_VERIFICATION: "External_Verification_Pending",
  WITHDRAWAL: "Withdrawal"
})

export const AUDIO_LANGUAGES = [
  {
    locale: 'en-US',
    name: 'English (US)'
  },
  {
    locale: 'hi-IN',
    name: 'Hindi'
  },
  {
    locale: 'en-AU',
    name: 'English (Australia)'
  },
  {
    locale: 'en-GB',
    name: 'English (British)'
  },
  {
    locale: 'es-ES',
    name: 'Spanish (European)'
  },
  {
    locale: 'ja-JP',
    name: 'Japanese'
  },
  {
    locale: 'pt-BR',
    name: 'Portuguese'
  }
]