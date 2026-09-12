export interface VoicePersona {
  id: string;
  name: string;
  accent?: string;
  gender?: string;
  style?: string;
  engine: string;
  lang?: string;
  country?: string;
  quality?: string;
}

export const ALL_VOICES: VoicePersona[] = [
  {
    "id": "af_bella",
    "name": "Bella",
    "accent": "American",
    "gender": "Female",
    "style": "Warm & Natural",
    "engine": "kokoro"
  },
  {
    "id": "af_sarah",
    "name": "Sarah",
    "accent": "American",
    "gender": "Female",
    "style": "Clear & Professional",
    "engine": "kokoro"
  },
  {
    "id": "af_nicole",
    "name": "Nicole",
    "accent": "American",
    "gender": "Female",
    "style": "Conversational & Fast",
    "engine": "kokoro"
  },
  {
    "id": "af_sky",
    "name": "Sky",
    "accent": "American",
    "gender": "Female",
    "style": "Energetic & Youthful",
    "engine": "kokoro"
  },
  {
    "id": "af_heart",
    "name": "Heart",
    "accent": "American",
    "gender": "Female",
    "style": "Soft & Expressive",
    "engine": "kokoro"
  },
  {
    "id": "af_alloy",
    "name": "Alloy",
    "accent": "American",
    "gender": "Female",
    "style": "Modern & Direct",
    "engine": "kokoro"
  },
  {
    "id": "af_aoede",
    "name": "Aoede",
    "accent": "American",
    "gender": "Female",
    "style": "Deep & Resonant",
    "engine": "kokoro"
  },
  {
    "id": "af_jessica",
    "name": "Jessica",
    "accent": "American",
    "gender": "Female",
    "style": "Bright & Friendly",
    "engine": "kokoro"
  },
  {
    "id": "af_kore",
    "name": "Kore",
    "accent": "American",
    "gender": "Female",
    "style": "Calm & Relaxed",
    "engine": "kokoro"
  },
  {
    "id": "af_river",
    "name": "River",
    "accent": "American",
    "gender": "Female",
    "style": "Smooth & Intimate",
    "engine": "kokoro"
  },
  {
    "id": "af_nova",
    "name": "Nova",
    "accent": "American",
    "gender": "Female",
    "style": "Vibrant & Modern",
    "engine": "kokoro"
  },
  {
    "id": "am_adam",
    "name": "Adam",
    "accent": "American",
    "gender": "Male",
    "style": "Deep & Authoritative",
    "engine": "kokoro"
  },
  {
    "id": "am_michael",
    "name": "Michael",
    "accent": "American",
    "gender": "Male",
    "style": "Warm & Trustworthy",
    "engine": "kokoro"
  },
  {
    "id": "am_echo",
    "name": "Echo",
    "accent": "American",
    "gender": "Male",
    "style": "Dynamic & Engaging",
    "engine": "kokoro"
  },
  {
    "id": "am_eric",
    "name": "Eric",
    "accent": "American",
    "gender": "Male",
    "style": "Crisp & Professional",
    "engine": "kokoro"
  },
  {
    "id": "am_fenrir",
    "name": "Fenrir",
    "accent": "American",
    "gender": "Male",
    "style": "Commanding & Strong",
    "engine": "kokoro"
  },
  {
    "id": "am_liam",
    "name": "Liam",
    "accent": "American",
    "gender": "Male",
    "style": "Narrative & Smooth",
    "engine": "kokoro"
  },
  {
    "id": "am_onyx",
    "name": "Onyx",
    "accent": "American",
    "gender": "Male",
    "style": "Grounded & Rich",
    "engine": "kokoro"
  },
  {
    "id": "am_puck",
    "name": "Puck",
    "accent": "American",
    "gender": "Male",
    "style": "Playful & Expressive",
    "engine": "kokoro"
  },
  {
    "id": "am_santa",
    "name": "Santa",
    "accent": "American",
    "gender": "Male",
    "style": "Warm & Jovial",
    "engine": "kokoro"
  },
  {
    "id": "bf_emma",
    "name": "Emma",
    "accent": "British",
    "gender": "Female",
    "style": "Refined & Articulate",
    "engine": "kokoro"
  },
  {
    "id": "bf_isabella",
    "name": "Isabella",
    "accent": "British",
    "gender": "Female",
    "style": "Graceful & Formal",
    "engine": "kokoro"
  },
  {
    "id": "bf_alice",
    "name": "Alice",
    "accent": "British",
    "gender": "Female",
    "style": "Classic British",
    "engine": "kokoro"
  },
  {
    "id": "bf_lily",
    "name": "Lily",
    "accent": "British",
    "gender": "Female",
    "style": "Gentle & Delicate",
    "engine": "kokoro"
  },
  {
    "id": "bm_george",
    "name": "George",
    "accent": "British",
    "gender": "Male",
    "style": "Distinguished & Classic",
    "engine": "kokoro"
  },
  {
    "id": "bm_daniel",
    "name": "Daniel",
    "accent": "British",
    "gender": "Male",
    "style": "Modern British",
    "engine": "kokoro"
  },
  {
    "id": "bm_fable",
    "name": "Fable",
    "accent": "British",
    "gender": "Male",
    "style": "Storyteller & Deep",
    "engine": "kokoro"
  },
  {
    "id": "bm_lewis",
    "name": "Lewis",
    "accent": "British",
    "gender": "Male",
    "style": "Articulate & Clear",
    "engine": "kokoro"
  },
  {
    "id": "ef_dora",
    "name": "Dora",
    "accent": "Spanish",
    "gender": "Female",
    "style": "Natural Spanish",
    "engine": "kokoro"
  },
  {
    "id": "em_alex",
    "name": "Alex",
    "accent": "Spanish",
    "gender": "Male",
    "style": "Clear Spanish",
    "engine": "kokoro"
  },
  {
    "id": "em_santa",
    "name": "Santa ES",
    "accent": "Spanish",
    "gender": "Male",
    "style": "Deep Spanish",
    "engine": "kokoro"
  },
  {
    "id": "ff_siwis",
    "name": "Siwis",
    "accent": "French",
    "gender": "Female",
    "style": "Native French",
    "engine": "kokoro"
  },
  {
    "id": "hf_alpha",
    "name": "Alpha HI",
    "accent": "Hindi",
    "gender": "Female",
    "style": "Expressive Hindi",
    "engine": "kokoro"
  },
  {
    "id": "hf_beta",
    "name": "Beta HI",
    "accent": "Hindi",
    "gender": "Female",
    "style": "Clear Hindi",
    "engine": "kokoro"
  },
  {
    "id": "hm_omega",
    "name": "Omega HI",
    "accent": "Hindi",
    "gender": "Male",
    "style": "Resonant Hindi",
    "engine": "kokoro"
  },
  {
    "id": "hm_psi",
    "name": "Psi HI",
    "accent": "Hindi",
    "gender": "Male",
    "style": "Narrative Hindi",
    "engine": "kokoro"
  },
  {
    "id": "if_sara",
    "name": "Sara",
    "accent": "Italian",
    "gender": "Female",
    "style": "Melodic Italian",
    "engine": "kokoro"
  },
  {
    "id": "im_nicola",
    "name": "Nicola",
    "accent": "Italian",
    "gender": "Male",
    "style": "Articulate Italian",
    "engine": "kokoro"
  },
  {
    "id": "jf_alpha",
    "name": "Alpha JP",
    "accent": "Japanese",
    "gender": "Female",
    "style": "Polite Japanese",
    "engine": "kokoro"
  },
  {
    "id": "jf_gongitsune",
    "name": "Gongitsune",
    "accent": "Japanese",
    "gender": "Female",
    "style": "Story Japanese",
    "engine": "kokoro"
  },
  {
    "id": "jf_nezumi",
    "name": "Nezumi",
    "accent": "Japanese",
    "gender": "Female",
    "style": "Lively Japanese",
    "engine": "kokoro"
  },
  {
    "id": "jf_tebukuro",
    "name": "Tebukuro",
    "accent": "Japanese",
    "gender": "Female",
    "style": "Soft Japanese",
    "engine": "kokoro"
  },
  {
    "id": "jm_kumo",
    "name": "Kumo",
    "accent": "Japanese",
    "gender": "Male",
    "style": "Deep Japanese",
    "engine": "kokoro"
  },
  {
    "id": "zf_xiaobei",
    "name": "Xiaobei",
    "accent": "Chinese",
    "gender": "Female",
    "style": "Friendly Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "zf_xiaoni",
    "name": "Xiaoni",
    "accent": "Chinese",
    "gender": "Female",
    "style": "Conversational",
    "engine": "kokoro"
  },
  {
    "id": "zf_xiaoxiao",
    "name": "Xiaoxiao",
    "accent": "Chinese",
    "gender": "Female",
    "style": "Gentle Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "zf_xiaoyi",
    "name": "Xiaoyi",
    "accent": "Chinese",
    "gender": "Female",
    "style": "Clear Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "zm_yunjian",
    "name": "Yunjian",
    "accent": "Chinese",
    "gender": "Male",
    "style": "Broadcast Style",
    "engine": "kokoro"
  },
  {
    "id": "zm_yunxi",
    "name": "Yunxi",
    "accent": "Chinese",
    "gender": "Male",
    "style": "Narrative Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "zm_yunxia",
    "name": "Yunxia",
    "accent": "Chinese",
    "gender": "Male",
    "style": "Formal Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "zm_yunyang",
    "name": "Yunyang",
    "accent": "Chinese",
    "gender": "Male",
    "style": "Dynamic Mandarin",
    "engine": "kokoro"
  },
  {
    "id": "pf_dora",
    "name": "Dora PT",
    "accent": "Portuguese",
    "gender": "Female",
    "style": "Warm Portuguese",
    "engine": "kokoro"
  },
  {
    "id": "pm_alex",
    "name": "Alex PT",
    "accent": "Portuguese",
    "gender": "Male",
    "style": "Clear Portuguese",
    "engine": "kokoro"
  },
  {
    "id": "pm_santa",
    "name": "Santa PT",
    "accent": "Portuguese",
    "gender": "Male",
    "style": "Deep Portuguese",
    "engine": "kokoro"
  },
  {
    "id": "piper:en_US-lessac-high",
    "name": "Lessac (English - high)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "en_US",
    "quality": "high"
  },
  {
    "id": "piper:en_US-libritts-high",
    "name": "Libritts (English - high)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "en_US",
    "quality": "high"
  },
  {
    "id": "piper:en_US-ljspeech-high",
    "name": "Ljspeech (English - high)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "en_US",
    "quality": "high"
  },
  {
    "id": "piper:en_US-ryan-high",
    "name": "Ryan (English - high)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "en_US",
    "quality": "high"
  },
  {
    "id": "piper:en_US-amy-medium",
    "name": "Amy (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-arctic-medium",
    "name": "Arctic (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-bryce-medium",
    "name": "Bryce (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-hfc_female-medium",
    "name": "Hfc_female (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-hfc_male-medium",
    "name": "Hfc_male (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-joe-medium",
    "name": "Joe (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-john-medium",
    "name": "John (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-kristin-medium",
    "name": "Kristin (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-kusal-medium",
    "name": "Kusal (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-l2arctic-medium",
    "name": "L2arctic (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-lessac-medium",
    "name": "Lessac (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-libritts_r-medium",
    "name": "Libritts_r (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-ljspeech-medium",
    "name": "Ljspeech (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-mike-medium",
    "name": "Mike (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-norman-medium",
    "name": "Norman (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-reza_ibrahim-medium",
    "name": "Reza_ibrahim (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-ryan-medium",
    "name": "Ryan (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-sam-medium",
    "name": "Sam (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_US",
    "quality": "medium"
  },
  {
    "id": "piper:en_US-amy-low",
    "name": "Amy (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_US",
    "quality": "low"
  },
  {
    "id": "piper:en_US-danny-low",
    "name": "Danny (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_US",
    "quality": "low"
  },
  {
    "id": "piper:en_US-kathleen-low",
    "name": "Kathleen (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_US",
    "quality": "low"
  },
  {
    "id": "piper:en_US-lessac-low",
    "name": "Lessac (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_US",
    "quality": "low"
  },
  {
    "id": "piper:en_US-ryan-low",
    "name": "Ryan (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_US",
    "quality": "low"
  },
  {
    "id": "piper:en_GB-cori-high",
    "name": "Cori (English - high)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "high"
  },
  {
    "id": "piper:en_GB-alan-medium",
    "name": "Alan (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-alba-medium",
    "name": "Alba (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-aru-medium",
    "name": "Aru (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-cori-medium",
    "name": "Cori (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-jenny_dioco-medium",
    "name": "Jenny_dioco (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-northern_english_male-medium",
    "name": "Northern_english_male (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-semaine-medium",
    "name": "Semaine (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-vctk-medium",
    "name": "Vctk (English - medium)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "medium"
  },
  {
    "id": "piper:en_GB-alan-low",
    "name": "Alan (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "low"
  },
  {
    "id": "piper:en_GB-southern_english_female-low",
    "name": "Southern_english_female (English - low)",
    "accent": "English",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "en_GB",
    "quality": "low"
  },
  {
    "id": "piper:hi_IN-pratham-medium",
    "name": "Pratham (Hindi - medium)",
    "accent": "Hindi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hi_IN",
    "quality": "medium"
  },
  {
    "id": "piper:hi_IN-priyamvada-medium",
    "name": "Priyamvada (Hindi - medium)",
    "accent": "Hindi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hi_IN",
    "quality": "medium"
  },
  {
    "id": "piper:hi_IN-rohan-medium",
    "name": "Rohan (Hindi - medium)",
    "accent": "Hindi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hi_IN",
    "quality": "medium"
  },
  {
    "id": "piper:es_ES-davefx-medium",
    "name": "Davefx (Spanish - medium)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "es_ES",
    "quality": "medium"
  },
  {
    "id": "piper:es_ES-sharvard-medium",
    "name": "Sharvard (Spanish - medium)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "es_ES",
    "quality": "medium"
  },
  {
    "id": "piper:es_ES-mls_10246-low",
    "name": "Mls_10246 (Spanish - low)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "es_ES",
    "quality": "low"
  },
  {
    "id": "piper:es_ES-mls_9972-low",
    "name": "Mls_9972 (Spanish - low)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "es_ES",
    "quality": "low"
  },
  {
    "id": "piper:es_ES-carlfm-x_low",
    "name": "Carlfm (Spanish - x_low)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "es_ES",
    "quality": "x_low"
  },
  {
    "id": "piper:es_MX-claude-high",
    "name": "Claude (Spanish - high)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "es_MX",
    "quality": "high"
  },
  {
    "id": "piper:es_MX-ald-medium",
    "name": "Ald (Spanish - medium)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "es_MX",
    "quality": "medium"
  },
  {
    "id": "piper:es_MX-ald-x_low",
    "name": "Ald (Spanish - x_low)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "es_MX",
    "quality": "x_low"
  },
  {
    "id": "piper:es_AR-daniela-high",
    "name": "Daniela (Spanish - high)",
    "accent": "Spanish",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "es_AR",
    "quality": "high"
  },
  {
    "id": "piper:fr_FR-mls-medium",
    "name": "Mls (French - medium)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "medium"
  },
  {
    "id": "piper:fr_FR-siwis-medium",
    "name": "Siwis (French - medium)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "medium"
  },
  {
    "id": "piper:fr_FR-tom-medium",
    "name": "Tom (French - medium)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "medium"
  },
  {
    "id": "piper:fr_FR-upmc-medium",
    "name": "Upmc (French - medium)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "medium"
  },
  {
    "id": "piper:fr_FR-gilles-low",
    "name": "Gilles (French - low)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "low"
  },
  {
    "id": "piper:fr_FR-mls_1840-low",
    "name": "Mls_1840 (French - low)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "low"
  },
  {
    "id": "piper:fr_FR-siwis-low",
    "name": "Siwis (French - low)",
    "accent": "French",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "fr_FR",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-thorsten-high",
    "name": "Thorsten (German - high)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "high"
  },
  {
    "id": "piper:de_DE-mls-medium",
    "name": "Mls (German - medium)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "medium"
  },
  {
    "id": "piper:de_DE-thorsten-medium",
    "name": "Thorsten (German - medium)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "medium"
  },
  {
    "id": "piper:de_DE-thorsten_emotional-medium",
    "name": "Thorsten_emotional (German - medium)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "medium"
  },
  {
    "id": "piper:de_DE-karlsson-low",
    "name": "Karlsson (German - low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-kerstin-low",
    "name": "Kerstin (German - low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-pavoque-low",
    "name": "Pavoque (German - low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-ramona-low",
    "name": "Ramona (German - low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-thorsten-low",
    "name": "Thorsten (German - low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "low"
  },
  {
    "id": "piper:de_DE-eva_k-x_low",
    "name": "Eva_k (German - x_low)",
    "accent": "German",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "de_DE",
    "quality": "x_low"
  },
  {
    "id": "piper:it_IT-serena-high",
    "name": "Serena (Italian - high)",
    "accent": "Italian",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "it_IT",
    "quality": "high"
  },
  {
    "id": "piper:it_IT-paola-medium",
    "name": "Paola (Italian - medium)",
    "accent": "Italian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "it_IT",
    "quality": "medium"
  },
  {
    "id": "piper:it_IT-serena-medium",
    "name": "Serena (Italian - medium)",
    "accent": "Italian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "it_IT",
    "quality": "medium"
  },
  {
    "id": "piper:it_IT-riccardo-x_low",
    "name": "Riccardo (Italian - x_low)",
    "accent": "Italian",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "it_IT",
    "quality": "x_low"
  },
  {
    "id": "piper:pt_BR-cadu-medium",
    "name": "Cadu (Portuguese - medium)",
    "accent": "Portuguese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pt_BR",
    "quality": "medium"
  },
  {
    "id": "piper:pt_BR-faber-medium",
    "name": "Faber (Portuguese - medium)",
    "accent": "Portuguese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pt_BR",
    "quality": "medium"
  },
  {
    "id": "piper:pt_BR-jeff-medium",
    "name": "Jeff (Portuguese - medium)",
    "accent": "Portuguese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pt_BR",
    "quality": "medium"
  },
  {
    "id": "piper:pt_BR-edresson-low",
    "name": "Edresson (Portuguese - low)",
    "accent": "Portuguese",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "pt_BR",
    "quality": "low"
  },
  {
    "id": "piper:zh_CN-chaowen-medium",
    "name": "Chaowen (Chinese - medium)",
    "accent": "Chinese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "zh_CN",
    "quality": "medium"
  },
  {
    "id": "piper:zh_CN-huayan-medium",
    "name": "Huayan (Chinese - medium)",
    "accent": "Chinese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "zh_CN",
    "quality": "medium"
  },
  {
    "id": "piper:zh_CN-xiao_ya-medium",
    "name": "Xiao_ya (Chinese - medium)",
    "accent": "Chinese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "zh_CN",
    "quality": "medium"
  },
  {
    "id": "piper:zh_CN-huayan-x_low",
    "name": "Huayan (Chinese - x_low)",
    "accent": "Chinese",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "zh_CN",
    "quality": "x_low"
  },
  {
    "id": "piper:ru_RU-denis-medium",
    "name": "Denis (Russian - medium)",
    "accent": "Russian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ru_RU",
    "quality": "medium"
  },
  {
    "id": "piper:ru_RU-dmitri-medium",
    "name": "Dmitri (Russian - medium)",
    "accent": "Russian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ru_RU",
    "quality": "medium"
  },
  {
    "id": "piper:ru_RU-irina-medium",
    "name": "Irina (Russian - medium)",
    "accent": "Russian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ru_RU",
    "quality": "medium"
  },
  {
    "id": "piper:ru_RU-ruslan-medium",
    "name": "Ruslan (Russian - medium)",
    "accent": "Russian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ru_RU",
    "quality": "medium"
  },
  {
    "id": "piper:kk_KZ-issai-high",
    "name": "Issai (Kazakh - high)",
    "accent": "Kazakh",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "kk_KZ",
    "quality": "high"
  },
  {
    "id": "piper:pl_PL-bass-high",
    "name": "Bass (Polish - high)",
    "accent": "Polish",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "pl_PL",
    "quality": "high"
  },
  {
    "id": "piper:uk_UA-mykyta-high",
    "name": "Mykyta (Ukrainian - high)",
    "accent": "Ukrainian",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "uk_UA",
    "quality": "high"
  },
  {
    "id": "piper:uk_UA-oleksa-high",
    "name": "Oleksa (Ukrainian - high)",
    "accent": "Ukrainian",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "uk_UA",
    "quality": "high"
  },
  {
    "id": "piper:uk_UA-tetiana-high",
    "name": "Tetiana (Ukrainian - high)",
    "accent": "Ukrainian",
    "gender": "Neural",
    "style": "Piper High",
    "engine": "piper",
    "lang": "uk_UA",
    "quality": "high"
  },
  {
    "id": "piper:ar_JO-kareem-medium",
    "name": "Kareem (Arabic - medium)",
    "accent": "Arabic",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ar_JO",
    "quality": "medium"
  },
  {
    "id": "piper:bg_BG-dimitar-medium",
    "name": "Dimitar (Bulgarian - medium)",
    "accent": "Bulgarian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "bg_BG",
    "quality": "medium"
  },
  {
    "id": "piper:bn_BD-google-medium",
    "name": "Google (Bengali - medium)",
    "accent": "Bengali",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "bn_BD",
    "quality": "medium"
  },
  {
    "id": "piper:ca_ES-upc_ona-medium",
    "name": "Upc_ona (Catalan - medium)",
    "accent": "Catalan",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ca_ES",
    "quality": "medium"
  },
  {
    "id": "piper:cs_CZ-jirka-medium",
    "name": "Jirka (Czech - medium)",
    "accent": "Czech",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "cs_CZ",
    "quality": "medium"
  },
  {
    "id": "piper:cs_CZ-kasandra-medium",
    "name": "Kasandra (Czech - medium)",
    "accent": "Czech",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "cs_CZ",
    "quality": "medium"
  },
  {
    "id": "piper:cy_GB-bu_tts-medium",
    "name": "Bu_tts (Welsh - medium)",
    "accent": "Welsh",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "cy_GB",
    "quality": "medium"
  },
  {
    "id": "piper:cy_GB-gwryw_gogleddol-medium",
    "name": "Gwryw_gogleddol (Welsh - medium)",
    "accent": "Welsh",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "cy_GB",
    "quality": "medium"
  },
  {
    "id": "piper:da_DK-talesyntese-medium",
    "name": "Talesyntese (Danish - medium)",
    "accent": "Danish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "da_DK",
    "quality": "medium"
  },
  {
    "id": "piper:el_GR-joy-medium",
    "name": "Joy (Greek - medium)",
    "accent": "Greek",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "el_GR",
    "quality": "medium"
  },
  {
    "id": "piper:el_GR-rapunzelina-medium",
    "name": "Rapunzelina (Greek - medium)",
    "accent": "Greek",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "el_GR",
    "quality": "medium"
  },
  {
    "id": "piper:eu_ES-antton-medium",
    "name": "Antton (Basque - medium)",
    "accent": "Basque",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "eu_ES",
    "quality": "medium"
  },
  {
    "id": "piper:eu_ES-maider-medium",
    "name": "Maider (Basque - medium)",
    "accent": "Basque",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "eu_ES",
    "quality": "medium"
  },
  {
    "id": "piper:fa_IR-amir-medium",
    "name": "Amir (Farsi - medium)",
    "accent": "Farsi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fa_IR",
    "quality": "medium"
  },
  {
    "id": "piper:fa_IR-ganji-medium",
    "name": "Ganji (Farsi - medium)",
    "accent": "Farsi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fa_IR",
    "quality": "medium"
  },
  {
    "id": "piper:fa_IR-ganji_adabi-medium",
    "name": "Ganji_adabi (Farsi - medium)",
    "accent": "Farsi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fa_IR",
    "quality": "medium"
  },
  {
    "id": "piper:fa_IR-gyro-medium",
    "name": "Gyro (Farsi - medium)",
    "accent": "Farsi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fa_IR",
    "quality": "medium"
  },
  {
    "id": "piper:fa_IR-reza_ibrahim-medium",
    "name": "Reza_ibrahim (Farsi - medium)",
    "accent": "Farsi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fa_IR",
    "quality": "medium"
  },
  {
    "id": "piper:fi_FI-harri-medium",
    "name": "Harri (Finnish - medium)",
    "accent": "Finnish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "fi_FI",
    "quality": "medium"
  },
  {
    "id": "piper:he_IL-saspeech-medium",
    "name": "Saspeech (Hebrew - medium)",
    "accent": "Hebrew",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "he_IL",
    "quality": "medium"
  },
  {
    "id": "piper:hu_HU-anna-medium",
    "name": "Anna (Hungarian - medium)",
    "accent": "Hungarian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hu_HU",
    "quality": "medium"
  },
  {
    "id": "piper:hu_HU-berta-medium",
    "name": "Berta (Hungarian - medium)",
    "accent": "Hungarian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hu_HU",
    "quality": "medium"
  },
  {
    "id": "piper:hu_HU-imre-medium",
    "name": "Imre (Hungarian - medium)",
    "accent": "Hungarian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hu_HU",
    "quality": "medium"
  },
  {
    "id": "piper:hy_AM-gor-medium",
    "name": "Gor (Armenian - medium)",
    "accent": "Armenian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "hy_AM",
    "quality": "medium"
  },
  {
    "id": "piper:id_ID-news_tts-medium",
    "name": "News_tts (Indonesian - medium)",
    "accent": "Indonesian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "id_ID",
    "quality": "medium"
  },
  {
    "id": "piper:is_IS-bui-medium",
    "name": "Bui (Icelandic - medium)",
    "accent": "Icelandic",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "is_IS",
    "quality": "medium"
  },
  {
    "id": "piper:is_IS-salka-medium",
    "name": "Salka (Icelandic - medium)",
    "accent": "Icelandic",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "is_IS",
    "quality": "medium"
  },
  {
    "id": "piper:is_IS-steinn-medium",
    "name": "Steinn (Icelandic - medium)",
    "accent": "Icelandic",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "is_IS",
    "quality": "medium"
  },
  {
    "id": "piper:is_IS-ugla-medium",
    "name": "Ugla (Icelandic - medium)",
    "accent": "Icelandic",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "is_IS",
    "quality": "medium"
  },
  {
    "id": "piper:ja_JA-hi_fi_captain-medium",
    "name": "Hi_fi_captain (Japanese - medium)",
    "accent": "Japanese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ja_JA",
    "quality": "medium"
  },
  {
    "id": "piper:ka_GE-natia-medium",
    "name": "Natia (Georgian - medium)",
    "accent": "Georgian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ka_GE",
    "quality": "medium"
  },
  {
    "id": "piper:ko_KR-kss-medium",
    "name": "Kss (Korean - medium)",
    "accent": "Korean",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ko_KR",
    "quality": "medium"
  },
  {
    "id": "piper:ku_TR-berfin_renas-medium",
    "name": "Berfin_renas (Kurmanji Kurdish - medium)",
    "accent": "Kurmanji Kurdish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ku_TR",
    "quality": "medium"
  },
  {
    "id": "piper:lb_LU-marylux-medium",
    "name": "Marylux (Luxembourgish - medium)",
    "accent": "Luxembourgish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "lb_LU",
    "quality": "medium"
  },
  {
    "id": "piper:lv_LV-aivars-medium",
    "name": "Aivars (Latvian - medium)",
    "accent": "Latvian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "lv_LV",
    "quality": "medium"
  },
  {
    "id": "piper:ml_IN-arjun-medium",
    "name": "Arjun (Malayalam - medium)",
    "accent": "Malayalam",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ml_IN",
    "quality": "medium"
  },
  {
    "id": "piper:ml_IN-meera-medium",
    "name": "Meera (Malayalam - medium)",
    "accent": "Malayalam",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ml_IN",
    "quality": "medium"
  },
  {
    "id": "piper:mr_IN-google-medium",
    "name": "Google (Marathi - medium)",
    "accent": "Marathi",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "mr_IN",
    "quality": "medium"
  },
  {
    "id": "piper:ne_NP-chitwan-medium",
    "name": "Chitwan (Nepali - medium)",
    "accent": "Nepali",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ne_NP",
    "quality": "medium"
  },
  {
    "id": "piper:ne_NP-google-medium",
    "name": "Google (Nepali - medium)",
    "accent": "Nepali",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ne_NP",
    "quality": "medium"
  },
  {
    "id": "piper:nl_BE-nathalie-medium",
    "name": "Nathalie (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_BE",
    "quality": "medium"
  },
  {
    "id": "piper:nl_BE-rdh-medium",
    "name": "Rdh (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_BE",
    "quality": "medium"
  },
  {
    "id": "piper:nl_NL-alex-medium",
    "name": "Alex (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "medium"
  },
  {
    "id": "piper:nl_NL-mls-medium",
    "name": "Mls (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "medium"
  },
  {
    "id": "piper:nl_NL-pim-medium",
    "name": "Pim (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "medium"
  },
  {
    "id": "piper:nl_NL-ronnie-medium",
    "name": "Ronnie (Dutch - medium)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "medium"
  },
  {
    "id": "piper:no_NO-nvcc-medium",
    "name": "Nvcc (Norwegian - medium)",
    "accent": "Norwegian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "no_NO",
    "quality": "medium"
  },
  {
    "id": "piper:no_NO-talesyntese-medium",
    "name": "Talesyntese (Norwegian - medium)",
    "accent": "Norwegian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "no_NO",
    "quality": "medium"
  },
  {
    "id": "piper:pl_PL-darkman-medium",
    "name": "Darkman (Polish - medium)",
    "accent": "Polish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pl_PL",
    "quality": "medium"
  },
  {
    "id": "piper:pl_PL-gosia-medium",
    "name": "Gosia (Polish - medium)",
    "accent": "Polish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pl_PL",
    "quality": "medium"
  },
  {
    "id": "piper:pl_PL-mc_speech-medium",
    "name": "Mc_speech (Polish - medium)",
    "accent": "Polish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pl_PL",
    "quality": "medium"
  },
  {
    "id": "piper:pt_PT-tugão-medium",
    "name": "Tugão (Portuguese - medium)",
    "accent": "Portuguese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "pt_PT",
    "quality": "medium"
  },
  {
    "id": "piper:ro_RO-mihai-medium",
    "name": "Mihai (Romanian - medium)",
    "accent": "Romanian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ro_RO",
    "quality": "medium"
  },
  {
    "id": "piper:sk_SK-lili-medium",
    "name": "Lili (Slovak - medium)",
    "accent": "Slovak",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sk_SK",
    "quality": "medium"
  },
  {
    "id": "piper:sl_SI-artur-medium",
    "name": "Artur (Slovenian - medium)",
    "accent": "Slovenian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sl_SI",
    "quality": "medium"
  },
  {
    "id": "piper:sq_AL-edon-medium",
    "name": "Edon (Albanian - medium)",
    "accent": "Albanian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sq_AL",
    "quality": "medium"
  },
  {
    "id": "piper:sr_RS-serbski_institut-medium",
    "name": "Serbski_institut (Serbian - medium)",
    "accent": "Serbian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sr_RS",
    "quality": "medium"
  },
  {
    "id": "piper:sv_SE-alma-medium",
    "name": "Alma (Swedish - medium)",
    "accent": "Swedish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sv_SE",
    "quality": "medium"
  },
  {
    "id": "piper:sv_SE-lisa-medium",
    "name": "Lisa (Swedish - medium)",
    "accent": "Swedish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sv_SE",
    "quality": "medium"
  },
  {
    "id": "piper:sv_SE-nst-medium",
    "name": "Nst (Swedish - medium)",
    "accent": "Swedish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sv_SE",
    "quality": "medium"
  },
  {
    "id": "piper:sw_CD-lanfrica-medium",
    "name": "Lanfrica (Swahili - medium)",
    "accent": "Swahili",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "sw_CD",
    "quality": "medium"
  },
  {
    "id": "piper:te_IN-maya-medium",
    "name": "Maya (Telugu - medium)",
    "accent": "Telugu",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "te_IN",
    "quality": "medium"
  },
  {
    "id": "piper:te_IN-padmavathi-medium",
    "name": "Padmavathi (Telugu - medium)",
    "accent": "Telugu",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "te_IN",
    "quality": "medium"
  },
  {
    "id": "piper:te_IN-venkatesh-medium",
    "name": "Venkatesh (Telugu - medium)",
    "accent": "Telugu",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "te_IN",
    "quality": "medium"
  },
  {
    "id": "piper:tr_TR-dfki-medium",
    "name": "Dfki (Turkish - medium)",
    "accent": "Turkish",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "tr_TR",
    "quality": "medium"
  },
  {
    "id": "piper:uk_UA-ukrainian_tts-medium",
    "name": "Ukrainian_tts (Ukrainian - medium)",
    "accent": "Ukrainian",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "uk_UA",
    "quality": "medium"
  },
  {
    "id": "piper:ur_PK-aegis_female-medium",
    "name": "Aegis_female (Urdu - medium)",
    "accent": "Urdu",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ur_PK",
    "quality": "medium"
  },
  {
    "id": "piper:ur_PK-fasih-medium",
    "name": "Fasih (Urdu - medium)",
    "accent": "Urdu",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "ur_PK",
    "quality": "medium"
  },
  {
    "id": "piper:vi_VN-vais1000-medium",
    "name": "Vais1000 (Vietnamese - medium)",
    "accent": "Vietnamese",
    "gender": "Neural",
    "style": "Piper Medium",
    "engine": "piper",
    "lang": "vi_VN",
    "quality": "medium"
  },
  {
    "id": "piper:ar_JO-kareem-low",
    "name": "Kareem (Arabic - low)",
    "accent": "Arabic",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "ar_JO",
    "quality": "low"
  },
  {
    "id": "piper:cs_CZ-jirka-low",
    "name": "Jirka (Czech - low)",
    "accent": "Czech",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "cs_CZ",
    "quality": "low"
  },
  {
    "id": "piper:el_GR-rapunzelina-low",
    "name": "Rapunzelina (Greek - low)",
    "accent": "Greek",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "el_GR",
    "quality": "low"
  },
  {
    "id": "piper:fi_FI-harri-low",
    "name": "Harri (Finnish - low)",
    "accent": "Finnish",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "fi_FI",
    "quality": "low"
  },
  {
    "id": "piper:nl_NL-mls_5809-low",
    "name": "Mls_5809 (Dutch - low)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "low"
  },
  {
    "id": "piper:nl_NL-mls_7432-low",
    "name": "Mls_7432 (Dutch - low)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "nl_NL",
    "quality": "low"
  },
  {
    "id": "piper:pl_PL-mls_6892-low",
    "name": "Mls_6892 (Polish - low)",
    "accent": "Polish",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "pl_PL",
    "quality": "low"
  },
  {
    "id": "piper:vi_VN-25hours_single-low",
    "name": "25hours_single (Vietnamese - low)",
    "accent": "Vietnamese",
    "gender": "Neural",
    "style": "Piper Low",
    "engine": "piper",
    "lang": "vi_VN",
    "quality": "low"
  },
  {
    "id": "piper:ca_ES-upc_ona-x_low",
    "name": "Upc_ona (Catalan - x_low)",
    "accent": "Catalan",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "ca_ES",
    "quality": "x_low"
  },
  {
    "id": "piper:ca_ES-upc_pau-x_low",
    "name": "Upc_pau (Catalan - x_low)",
    "accent": "Catalan",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "ca_ES",
    "quality": "x_low"
  },
  {
    "id": "piper:kk_KZ-iseke-x_low",
    "name": "Iseke (Kazakh - x_low)",
    "accent": "Kazakh",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "kk_KZ",
    "quality": "x_low"
  },
  {
    "id": "piper:kk_KZ-raya-x_low",
    "name": "Raya (Kazakh - x_low)",
    "accent": "Kazakh",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "kk_KZ",
    "quality": "x_low"
  },
  {
    "id": "piper:ne_NP-google-x_low",
    "name": "Google (Nepali - x_low)",
    "accent": "Nepali",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "ne_NP",
    "quality": "x_low"
  },
  {
    "id": "piper:nl_BE-nathalie-x_low",
    "name": "Nathalie (Dutch - x_low)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "nl_BE",
    "quality": "x_low"
  },
  {
    "id": "piper:nl_BE-rdh-x_low",
    "name": "Rdh (Dutch - x_low)",
    "accent": "Dutch",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "nl_BE",
    "quality": "x_low"
  },
  {
    "id": "piper:uk_UA-lada-x_low",
    "name": "Lada (Ukrainian - x_low)",
    "accent": "Ukrainian",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "uk_UA",
    "quality": "x_low"
  },
  {
    "id": "piper:vi_VN-vivos-x_low",
    "name": "Vivos (Vietnamese - x_low)",
    "accent": "Vietnamese",
    "gender": "Neural",
    "style": "Piper X_low",
    "engine": "piper",
    "lang": "vi_VN",
    "quality": "x_low"
  },
  {
    "id": "meta:eng",
    "name": "English (MMS)",
    "accent": "English",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "eng",
    "country": "Global"
  },
  {
    "id": "meta:hin",
    "name": "Hindi (MMS)",
    "accent": "Hindi",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "hin",
    "country": "India"
  },
  {
    "id": "meta:mar",
    "name": "Marathi (MMS)",
    "accent": "Marathi",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "mar",
    "country": "India"
  },
  {
    "id": "meta:tam",
    "name": "Tamil (MMS)",
    "accent": "Tamil",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "tam",
    "country": "India"
  },
  {
    "id": "meta:tel",
    "name": "Telugu (MMS)",
    "accent": "Telugu",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "tel",
    "country": "India"
  },
  {
    "id": "meta:ben",
    "name": "Bengali (MMS)",
    "accent": "Bengali",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "ben",
    "country": "India/Bangladesh"
  },
  {
    "id": "meta:guj",
    "name": "Gujarati (MMS)",
    "accent": "Gujarati",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "guj",
    "country": "India"
  },
  {
    "id": "meta:kan",
    "name": "Kannada (MMS)",
    "accent": "Kannada",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "kan",
    "country": "India"
  },
  {
    "id": "meta:mal",
    "name": "Malayalam (MMS)",
    "accent": "Malayalam",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "mal",
    "country": "India"
  },
  {
    "id": "meta:pan",
    "name": "Punjabi (MMS)",
    "accent": "Punjabi",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "pan",
    "country": "India"
  },
  {
    "id": "meta:urd",
    "name": "Urdu (MMS)",
    "accent": "Urdu",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "urd",
    "country": "Pakistan/India"
  },
  {
    "id": "meta:spa",
    "name": "Spanish (MMS)",
    "accent": "Spanish",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "spa",
    "country": "Spain/LATAM"
  },
  {
    "id": "meta:fra",
    "name": "French (MMS)",
    "accent": "French",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "fra",
    "country": "France"
  },
  {
    "id": "meta:deu",
    "name": "German (MMS)",
    "accent": "German",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "deu",
    "country": "Germany"
  },
  {
    "id": "meta:ita",
    "name": "Italian (MMS)",
    "accent": "Italian",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "ita",
    "country": "Italy"
  },
  {
    "id": "meta:por",
    "name": "Portuguese (MMS)",
    "accent": "Portuguese",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "por",
    "country": "Brazil/Portugal"
  },
  {
    "id": "meta:ara",
    "name": "Arabic (MMS)",
    "accent": "Arabic",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "ara",
    "country": "Middle East"
  },
  {
    "id": "meta:jpn",
    "name": "Japanese (MMS)",
    "accent": "Japanese",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "jpn",
    "country": "Japan"
  },
  {
    "id": "meta:kor",
    "name": "Korean (MMS)",
    "accent": "Korean",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "kor",
    "country": "Korea"
  },
  {
    "id": "meta:zho",
    "name": "Chinese (MMS)",
    "accent": "Chinese",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "zho",
    "country": "China"
  },
  {
    "id": "meta:rus",
    "name": "Russian (MMS)",
    "accent": "Russian",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "rus",
    "country": "Russia"
  },
  {
    "id": "meta:tur",
    "name": "Turkish (MMS)",
    "accent": "Turkish",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "tur",
    "country": "Turkey"
  },
  {
    "id": "meta:vie",
    "name": "Vietnamese (MMS)",
    "accent": "Vietnamese",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "vie",
    "country": "Vietnam"
  },
  {
    "id": "meta:tha",
    "name": "Thai (MMS)",
    "accent": "Thai",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "tha",
    "country": "Thailand"
  },
  {
    "id": "meta:ind",
    "name": "Indonesian (MMS)",
    "accent": "Indonesian",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "ind",
    "country": "Indonesia"
  },
  {
    "id": "meta:swa",
    "name": "Swahili (MMS)",
    "accent": "Swahili",
    "gender": "Neutral",
    "style": "Meta AI Native",
    "engine": "meta",
    "lang": "swa",
    "country": "East Africa"
  }
];

export function getVoiceById(id: string): VoicePersona | undefined {
  return ALL_VOICES.find((v) => v.id === id);
}

export function getVoiceDisplayName(id: string): string {
  const v = getVoiceById(id);
  if (!v) return id;
  const parts = [v.name];
  const meta: string[] = [];
  if (v.accent) meta.push(v.accent);
  if (v.gender) meta.push(v.gender);
  if (meta.length > 0) parts.push(`(${meta.join(' ')})`);
  if (v.style) parts.push(`- ${v.style}`);
  return parts.join(' ');
}
