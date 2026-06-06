// KrishnaVerse – Bhagavad Gita Shloka Dataset (Mobile)
// Ported from data/shlokas.js for React Native
//
// CURATED_SHLOKAS hold the richly-annotated verses (context, explanation,
// life application, word-by-word, tags, moods). They are merged on top of the
// complete 700-verse base (constants/GitaVerses.js → BG_VERSES) so the exported
// SHLOKAS array contains every verse of all 18 chapters with no gaps.

import { BG_VERSES } from './GitaVerses';
import { WORD_BY_WORD } from './WordByWord';

const CURATED_SHLOKAS = [
  {
    id: "BG_2_47",
    chapter: 2, verse: 47,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    hindi: "कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं।",
    english: "You have a right to perform your duties, but never to the fruits of your actions. Never be motivated by results, and never be attached to inaction.",
    wordByWord: [
      { w: "कर्मणि", en: "in prescribed duty", hi: "कर्म में" },
      { w: "एव", en: "certainly", hi: "ही" },
      { w: "अधिकारः", en: "right", hi: "अधिकार" },
      { w: "ते", en: "your", hi: "तुम्हारा" },
      { w: "मा", en: "never", hi: "कभी नहीं" },
      { w: "फलेषु", en: "in the fruits", hi: "फलों में" },
      { w: "कदाचन", en: "at any time", hi: "कभी भी" },
      { w: "मा", en: "never", hi: "मत" },
      { w: "कर्म-फल-हेतुः", en: "cause of the results of action", hi: "कर्मफल का हेतु" },
      { w: "भूः", en: "become", hi: "बनो" },
      { w: "मा", en: "never", hi: "न" },
      { w: "ते", en: "your", hi: "तुम्हारी" },
      { w: "सङ्गः", en: "attachment", hi: "आसक्ति" },
      { w: "अस्तु", en: "let there be", hi: "हो" },
      { w: "अकर्मणि", en: "in inaction", hi: "अकर्म में" }
    ],
    context: "Krishna speaks this to Arjuna on the battlefield of Kurukshetra, teaching the principle of Nishkama Karma.",
    explanation: "Krishna teaches that we control our effort, not the outcome. Attachment to results creates anxiety and fear. True freedom comes from acting with full dedication while releasing outcome.",
    lifeApplication: "Before your next exam or interview — give 100% effort and release the result. Shift to process-focus. This reduces anxiety and paradoxically improves results.",
    tags: ["karma", "duty", "action", "detachment", "work"],
    moods: ["anxious", "stressed", "overwhelmed", "confused"],
    categories: ["career", "duty", "discipline", "productivity", "mental-health"]
  },
  {
    id: "BG_2_20",
    chapter: 2, verse: 20,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "न जायते म्रियते वा कदाचिन्-\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥",
    transliteration: "na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ",
    hindi: "आत्मा कभी जन्म नहीं लेती, कभी मरती नहीं।",
    english: "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
    wordByWord: [
      { w: "न", en: "not", hi: "नहीं" },
      { w: "जायते", en: "is born", hi: "जन्म लेती है" },
      { w: "म्रियते", en: "dies", hi: "मरती है" },
      { w: "वा", en: "or", hi: "अथवा" },
      { w: "कदाचित्", en: "at any time", hi: "कभी" },
      { w: "न", en: "not", hi: "नहीं" },
      { w: "अयम्", en: "this (soul)", hi: "यह (आत्मा)" },
      { w: "भूत्वा", en: "having come into being", hi: "होकर" },
      { w: "भविता", en: "will come to be", hi: "होगी" },
      { w: "वा", en: "or", hi: "या" },
      { w: "न", en: "not", hi: "नहीं" },
      { w: "भूयः", en: "again", hi: "फिर" },
      { w: "अजः", en: "unborn", hi: "अजन्मा" },
      { w: "नित्यः", en: "eternal", hi: "नित्य" },
      { w: "शाश्वतः", en: "permanent", hi: "शाश्वत" },
      { w: "अयम्", en: "this", hi: "यह" },
      { w: "पुराणः", en: "primeval / the oldest", hi: "पुरातन" },
      { w: "न", en: "not", hi: "नहीं" },
      { w: "हन्यते", en: "is slain", hi: "मारी जाती है" },
      { w: "हन्यमाने", en: "when is slain", hi: "मारे जाने पर" },
      { w: "शरीरे", en: "the body", hi: "शरीर के" }
    ],
    context: "Krishna comforts Arjuna who grieves, revealing the eternal nature of the soul.",
    explanation: "Our deepest identity is not this body or mind — it's the eternal soul. Loss, failure, and death are experiences of the temporary, not the eternal.",
    lifeApplication: "When you face a devastating loss — remember: your soul is untouched. Your essential self is eternal, indestructible, and complete.",
    tags: ["soul", "eternal", "death", "identity", "fear"],
    moods: ["grieving", "lost", "fearful", "depressed"],
    categories: ["mental-health", "spirituality", "loss", "identity"]
  },
  {
    id: "BG_2_14",
    chapter: 2, verse: 14,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
    transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ",
    hindi: "सुख-दुख देने वाले संयोग तो आने-जाने वाले और अनित्य हैं — इन्हें सहन करो।",
    english: "The appearances of happiness and distress, and their disappearance in due course, are like winter and summer seasons. One must learn to tolerate them.",
    wordByWord: [
      { w: "मात्रा-स्पर्शाः", en: "sensory contacts", hi: "इन्द्रिय-विषय संयोग" },
      { w: "तु", en: "but / indeed", hi: "तो" },
      { w: "कौन्तेय", en: "O son of Kunti", hi: "हे कुन्तीपुत्र" },
      { w: "शीत-उष्ण-सुख-दुःख-दाः", en: "giving cold, heat, pleasure, pain", hi: "सर्दी-गर्मी, सुख-दुःख देने वाले" },
      { w: "आगम-अपायिनः", en: "coming and going", hi: "आने-जाने वाले" },
      { w: "अनित्याः", en: "impermanent", hi: "अनित्य" },
      { w: "तान्", en: "them", hi: "उनको" },
      { w: "तितिक्षस्व", en: "endure / tolerate", hi: "सहन करो" },
      { w: "भारत", en: "O descendant of Bharata", hi: "हे भरतवंशी" }
    ],
    context: "Krishna teaches Arjuna the nature of all experiences — they are temporary, like seasons passing.",
    explanation: "All pleasure and pain are impermanent. The wise person neither despairs in suffering nor becomes intoxicated by joy. This is equanimity.",
    lifeApplication: "In your darkest moment: 'This is a season. It will pass.' In your greatest joy: 'This too is impermanent — enjoy it, but don't cling.'",
    tags: ["impermanence", "equanimity", "resilience"],
    moods: ["sad", "depressed", "stressed", "overwhelmed"],
    categories: ["mental-health", "resilience", "discipline"]
  },
  {
    id: "BG_6_5",
    chapter: 6, verse: 5,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet",
    hindi: "अपने द्वारा अपना उद्धार करो — आत्मा ही अपना मित्र है और आत्मा ही अपना शत्रु।",
    english: "One must elevate oneself with the help of one's mind, and not degrade oneself. The mind is the friend of the soul, and its enemy as well.",
    wordByWord: [
      { w: "उद्धरेत्", en: "one should uplift", hi: "उद्धार करे" },
      { w: "आत्मना", en: "by the mind / self", hi: "अपने द्वारा" },
      { w: "आत्मानम्", en: "the self", hi: "अपने को" },
      { w: "न", en: "not", hi: "न" },
      { w: "आत्मानम्", en: "the self", hi: "अपने को" },
      { w: "अवसादयेत्", en: "should degrade / lower", hi: "गिराए / पतन करे" },
      { w: "आत्मा", en: "the mind / self", hi: "आत्मा" },
      { w: "एव", en: "certainly", hi: "ही" },
      { w: "हि", en: "indeed / because", hi: "क्योंकि" },
      { w: "आत्मनः", en: "of the self", hi: "अपना" },
      { w: "बन्धुः", en: "friend", hi: "मित्र" },
      { w: "आत्मा", en: "the mind / self", hi: "आत्मा" },
      { w: "एव", en: "certainly", hi: "ही" },
      { w: "रिपुः", en: "enemy", hi: "शत्रु" },
      { w: "आत्मनः", en: "of the self", hi: "अपना" }
    ],
    context: "Krishna teaches that the self is both the greatest ally and greatest enemy.",
    explanation: "Your mind can be your greatest friend — motivating, calming you — or your worst enemy — criticizing, sabotaging. The difference lies in discipline.",
    lifeApplication: "Replace self-criticism with self-inquiry: not 'I'm so stupid' but 'What can I learn here?' You are your own best coach.",
    tags: ["self", "mind", "discipline", "motivation"],
    moods: ["self-doubt", "lost", "depressed", "unmotivated"],
    categories: ["mental-health", "discipline", "self-improvement"]
  },
  {
    id: "BG_6_6",
    chapter: 6, verse: 6,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः ।\nअनात्मनस्तु शत्रुत्वे वर्ते तात्मैव शत्रुवत् ॥",
    transliteration: "bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ",
    hindi: "जिसने मन को जीत लिया, उसके लिए मन सबसे अच्छा मित्र है।",
    english: "For one who has conquered the mind, the Supersoul is already reached. But for one who has failed, his very mind will be the greatest enemy.",
    wordByWord: [
      { w: "बन्धुः", en: "friend", hi: "मित्र" },
      { w: "आत्मा", en: "the mind", hi: "मन" },
      { w: "आत्मनः", en: "for the self", hi: "अपने लिए" },
      { w: "तस्य", en: "his", hi: "उसका" },
      { w: "येन", en: "by whom", hi: "जिसके द्वारा" },
      { w: "आत्मा", en: "the mind", hi: "मन" },
      { w: "एव", en: "certainly", hi: "ही" },
      { w: "आत्मना", en: "by the self", hi: "अपने आप" },
      { w: "जितः", en: "conquered", hi: "जीत लिया गया" },
      { w: "अनात्मनः", en: "of one without self-control", hi: "जिसने मन को नहीं जीता" },
      { w: "तु", en: "but", hi: "परन्तु" },
      { w: "शत्रुत्वे", en: "in enmity", hi: "शत्रुता में" },
      { w: "वर्तेत", en: "would remain", hi: "स्थित रहता है" },
      { w: "आत्मा", en: "the mind", hi: "मन" },
      { w: "एव", en: "indeed", hi: "ही" },
      { w: "शत्रुवत्", en: "like an enemy", hi: "शत्रु के समान" }
    ],
    context: "Krishna continues the teaching on self-mastery — how the mind functions as friend or foe.",
    explanation: "An untrained mind is like a wild horse. A trained mind is like a powerful ally. Meditation and consistent discipline are the tools of mind mastery.",
    lifeApplication: "Pick one habit this week to train your mind: 10 minutes of morning meditation or 5 minutes of deep breathing when stressed.",
    tags: ["mind", "self-control", "meditation", "discipline"],
    moods: ["anxious", "scattered", "impulsive", "stressed"],
    categories: ["mental-health", "discipline", "spirituality"]
  },
  {
    id: "BG_3_19",
    chapter: 3, verse: 19,
    chapterTitle: "Karma Yoga", chapterTitleHindi: "कर्म योग",
    sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥",
    transliteration: "tasmād asaktaḥ satataṁ kāryaṁ karma samācara",
    hindi: "इसलिए आसक्ति रहित होकर सर्वदा कर्तव्य कर्म करते रहो।",
    english: "Therefore, always perform your duty efficiently and without attachment to the results, because by doing work without attachment one attains the Supreme.",
    wordByWord: [
      { w: "तस्मात्", en: "therefore", hi: "इसलिए" },
      { w: "असक्तः", en: "unattached", hi: "आसक्ति रहित होकर" },
      { w: "सततम्", en: "always / constantly", hi: "निरन्तर" },
      { w: "कार्यम्", en: "that which ought to be done", hi: "कर्तव्य" },
      { w: "कर्म", en: "work / action", hi: "कर्म" },
      { w: "समाचर", en: "perform well", hi: "भलीभाँति कर" },
      { w: "असक्तः", en: "unattached", hi: "अनासक्त" },
      { w: "हि", en: "certainly", hi: "क्योंकि" },
      { w: "आचरन्", en: "performing", hi: "करते हुए" },
      { w: "कर्म", en: "action", hi: "कर्म" },
      { w: "परम्", en: "the Supreme", hi: "परमात्मा को" },
      { w: "आप्नोति", en: "attains", hi: "प्राप्त करता है" },
      { w: "पूरुषः", en: "a person", hi: "पुरुष" }
    ],
    context: "Krishna gives the practical instruction for living the Gita's central teaching of selfless action.",
    explanation: "Action without attachment is the key. Do your best, release the rest. This is not indifference — it's the highest form of engagement.",
    lifeApplication: "Today, pick your most important task and do it fully — without worrying whether it will lead to a reward or recognition.",
    tags: ["karma", "detachment", "action", "duty"],
    moods: ["anxious", "confused", "stressed"],
    categories: ["career", "productivity", "duty"]
  },
  {
    id: "BG_4_7",
    chapter: 4, verse: 7,
    chapterTitle: "Jnana Yoga", chapterTitleHindi: "ज्ञान योग",
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata",
    hindi: "जब-जब धर्म की हानि होती है, तब-तब मैं स्वयं को प्रकट करता हूं।",
    english: "Whenever and wherever there is a decline in righteousness and a predominant rise of unrighteousness — at that time I manifest Myself.",
    wordByWord: [
      { w: "यदा यदा", en: "whenever", hi: "जब-जब" },
      { w: "हि", en: "indeed", hi: "निश्चय ही" },
      { w: "धर्मस्य", en: "of righteousness", hi: "धर्म की" },
      { w: "ग्लानिः", en: "decline", hi: "हानि / ग्लानि" },
      { w: "भवति", en: "occurs", hi: "होती है" },
      { w: "भारत", en: "O descendant of Bharata", hi: "हे भारत" },
      { w: "अभ्युत्थानम्", en: "rise / predominance", hi: "वृद्धि / उत्थान" },
      { w: "अधर्मस्य", en: "of unrighteousness", hi: "अधर्म की" },
      { w: "तदा", en: "then", hi: "तब" },
      { w: "आत्मानम्", en: "Myself", hi: "अपने आप को" },
      { w: "सृजामि", en: "I manifest", hi: "प्रकट करता हूँ" },
      { w: "अहम्", en: "I", hi: "मैं" }
    ],
    context: "Krishna reveals His divine nature and the cosmic purpose of His incarnations.",
    explanation: "The Divine always restores balance. Darkness cannot permanently prevail. When we align with righteousness, we align with the divine current.",
    lifeApplication: "When you see injustice — remember this cosmic law. Your small acts of righteousness contribute to a larger restoration.",
    tags: ["dharma", "divine", "righteousness", "faith", "hope"],
    moods: ["hopeless", "faithless", "angry", "frustrated"],
    categories: ["spirituality", "duty", "faith"]
  },
  {
    id: "BG_4_38",
    chapter: 4, verse: 38,
    chapterTitle: "Jnana Yoga", chapterTitleHindi: "ज्ञान योग",
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥",
    transliteration: "na hi jñānena sadṛśaṁ pavitram iha vidyate",
    hindi: "इस संसार में ज्ञान के समान पवित्र करने वाला कुछ भी नहीं है।",
    english: "In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.",
    wordByWord: [
      { w: "न", en: "not", hi: "नहीं" },
      { w: "हि", en: "certainly", hi: "निश्चय ही" },
      { w: "ज्ञानेन", en: "with knowledge", hi: "ज्ञान के" },
      { w: "सदृशम्", en: "comparable / like", hi: "समान" },
      { w: "पवित्रम्", en: "pure / sanctifying", hi: "पवित्र" },
      { w: "इह", en: "in this world", hi: "इस संसार में" },
      { w: "विद्यते", en: "exists", hi: "है / मिलता है" },
      { w: "तत्", en: "that (knowledge)", hi: "उसको" },
      { w: "स्वयम्", en: "oneself", hi: "स्वयं" },
      { w: "योग-संसिद्धः", en: "perfected in yoga", hi: "योग में सिद्ध हुआ" },
      { w: "कालेन", en: "in due time", hi: "समय पाकर" },
      { w: "आत्मनि", en: "in the self", hi: "अपने में" },
      { w: "विन्दति", en: "attains / finds", hi: "प्राप्त करता है" }
    ],
    context: "Krishna extols the supreme value of self-knowledge as the greatest purifier.",
    explanation: "Knowledge — especially self-knowledge — is the ultimate cleanser. It burns away confusion, fear, and attachment.",
    lifeApplication: "Invest in learning. Read one book a month. Ask deeper questions: 'Why did I react that way? What do I truly want?'",
    tags: ["knowledge", "wisdom", "learning", "growth"],
    moods: ["confused", "lost", "searching"],
    categories: ["self-improvement", "spirituality", "productivity"]
  },
  {
    id: "BG_9_22",
    chapter: 9, verse: 22,
    chapterTitle: "Raja Vidya Yoga", chapterTitleHindi: "राजविद्या राजगुह्य योग",
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
    transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate",
    hindi: "जो लोग अनन्य भाव से मेरा चिंतन करते हुए मेरी उपासना करते हैं, उनका योगक्षेम मैं स्वयं वहन करता हूं।",
    english: "But those who always worship Me with exclusive devotion, meditating on My transcendental form — to them I carry what they lack, and I preserve what they have.",
    wordByWord: [
      { w: "अनन्याः", en: "without deviation / exclusively", hi: "अनन्य भाव से" },
      { w: "चिन्तयन्तः", en: "thinking of", hi: "चिन्तन करते हुए" },
      { w: "माम्", en: "Me", hi: "मुझे" },
      { w: "ये", en: "those who", hi: "जो" },
      { w: "जनाः", en: "people", hi: "लोग" },
      { w: "पर्युपासते", en: "worship fully", hi: "भलीभाँति उपासना करते हैं" },
      { w: "तेषाम्", en: "of them", hi: "उनका" },
      { w: "नित्य-अभियुक्तानाम्", en: "ever-devoted", hi: "निरन्तर लगे हुए" },
      { w: "योग-क्षेमम्", en: "acquisition and preservation", hi: "योगक्षेम (अप्राप्त की प्राप्ति व प्राप्त की रक्षा)" },
      { w: "वहामि", en: "I carry / bear", hi: "वहन करता हूँ" },
      { w: "अहम्", en: "I", hi: "मैं" }
    ],
    context: "Krishna's direct promise to those who surrender to Him with pure devotion.",
    explanation: "True surrender to the Divine is not weakness — it's the highest strength. When we align fully with the Divine will, we are carried and protected.",
    lifeApplication: "Practice surrender today: hand over one worry to the Divine. Not resignation, but trust. 'I will do my best; the rest is Yours.'",
    tags: ["devotion", "surrender", "faith", "protection", "grace"],
    moods: ["fearful", "anxious", "hopeless", "lost"],
    categories: ["spirituality", "faith", "mental-health"]
  },
  {
    id: "BG_12_13",
    chapter: 12, verse: 13,
    chapterTitle: "Bhakti Yoga", chapterTitleHindi: "भक्ति योग",
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
    transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca",
    hindi: "जो किसी से द्वेष नहीं रखता, सभी का मित्र और दयालु है — वह मुझे प्रिय है।",
    english: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress — such a devotee is very dear to Me.",
    wordByWord: [
      { w: "अद्वेष्टा", en: "non-envious / without hatred", hi: "द्वेष न रखने वाला" },
      { w: "सर्व-भूतानाम्", en: "toward all beings", hi: "सब प्राणियों के प्रति" },
      { w: "मैत्रः", en: "friendly", hi: "मित्रभाव वाला" },
      { w: "करुणः", en: "compassionate", hi: "करुणामय" },
      { w: "एव", en: "also", hi: "ही" },
      { w: "च", en: "and", hi: "और" },
      { w: "निर्ममः", en: "free from possessiveness", hi: "ममता रहित" },
      { w: "निरहङ्कारः", en: "free from ego", hi: "अहंकार रहित" },
      { w: "सम-दुःख-सुखः", en: "equal in pain and pleasure", hi: "सुख-दुःख में समान" },
      { w: "क्षमी", en: "forgiving", hi: "क्षमाशील" }
    ],
    context: "Krishna describes the qualities of the ideal devotee — the person closest to the Divine.",
    explanation: "Compassion, friendship, humility, equanimity, and forgiveness — these are the marks of the spiritually evolved person. Not performance, but character.",
    lifeApplication: "Today, practice one quality: when someone irritates you, try genuine compassion. Ask: 'What pain might they be carrying?'",
    tags: ["compassion", "friendship", "humility", "forgiveness"],
    moods: ["angry", "resentful", "frustrated"],
    categories: ["relationships", "spirituality", "mental-health"]
  },
  {
    id: "BG_2_3",
    chapter: 2, verse: 3,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते ।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप ॥",
    transliteration: "klaibyaṁ mā sma gamaḥ pārtha naitat tvayy upapadyate",
    hindi: "हे पार्थ! नपुंसकता को प्राप्त मत हो — यह तुम्हें शोभा नहीं देती। हृदय की दुर्बलता त्यागकर उठ खड़े हो।",
    english: "O Arjuna, do not yield to this degrading impotence. It does not become you. Give up such petty weakness of heart and arise.",
    wordByWord: [
      { w: "क्लैब्यम्", en: "impotence / unmanliness", hi: "नपुंसकता / कायरता" },
      { w: "मा स्म", en: "do not", hi: "मत" },
      { w: "गमः", en: "yield to / give in to", hi: "प्राप्त हो" },
      { w: "पार्थ", en: "O son of Pritha", hi: "हे पार्थ" },
      { w: "न", en: "not", hi: "नहीं" },
      { w: "एतत्", en: "this", hi: "यह" },
      { w: "त्वयि", en: "in you", hi: "तुझमें" },
      { w: "उपपद्यते", en: "is befitting", hi: "उचित है" },
      { w: "क्षुद्रम्", en: "petty / trivial", hi: "तुच्छ" },
      { w: "हृदय-दौर्बल्यम्", en: "weakness of heart", hi: "हृदय की दुर्बलता" },
      { w: "त्यक्त्वा", en: "giving up", hi: "त्याग कर" },
      { w: "उत्तिष्ठ", en: "arise / stand up", hi: "खड़ा हो" },
      { w: "परन्तप", en: "O scorcher of foes", hi: "हे परन्तप" }
    ],
    context: "Krishna's direct call to Arjuna who has collapsed in grief and weakness before battle.",
    explanation: "Sometimes we need a firm, loving voice to call us out of self-pity and into our greatness. True compassion sometimes says: 'You are bigger than this. Rise.'",
    lifeApplication: "When paralyzed by fear or self-pity — hear Krishna's voice: 'You are not this weakness. You have strength you haven't accessed yet. Rise.'",
    tags: ["courage", "strength", "action", "rising", "overcome"],
    moods: ["depressed", "hopeless", "unmotivated", "self-doubt"],
    categories: ["mental-health", "discipline", "resilience"]
  },
  {
    id: "BG_2_62",
    chapter: 2, verse: 62,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्संजायते कामः कामात्क्रोधोऽभिजायते ॥",
    transliteration: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate",
    hindi: "विषयों का चिंतन करने से उनमें आसक्ति होती है, आसक्ति से काम और काम से क्रोध उत्पन्न होता है।",
    english: "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.",
    wordByWord: [
      { w: "ध्यायतः", en: "while contemplating", hi: "चिन्तन करते हुए" },
      { w: "विषयान्", en: "sense objects", hi: "विषयों का" },
      { w: "पुंसः", en: "of a person", hi: "पुरुष को" },
      { w: "सङ्गः", en: "attachment", hi: "आसक्ति" },
      { w: "तेषु", en: "to them", hi: "उनमें" },
      { w: "उपजायते", en: "arises", hi: "उत्पन्न होती है" },
      { w: "सङ्गात्", en: "from attachment", hi: "आसक्ति से" },
      { w: "सञ्जायते", en: "is born", hi: "उत्पन्न होती है" },
      { w: "कामः", en: "desire", hi: "कामना" },
      { w: "कामात्", en: "from desire", hi: "काम से" },
      { w: "क्रोधः", en: "anger", hi: "क्रोध" },
      { w: "अभिजायते", en: "arises", hi: "उत्पन्न होता है" }
    ],
    context: "Krishna maps the psychology of how desire leads to anger and ultimately to destruction.",
    explanation: "This is the chain: Focus → Attachment → Desire → Frustration → Anger → Poor decisions → Destruction. Understanding this chain gives us the power to break it.",
    lifeApplication: "Notice what you obsessively think about. That is where attachment is forming. Don't fight the thought — redirect attention to something higher. Change the channel.",
    tags: ["anger", "desire", "attachment", "psychology", "mind"],
    moods: ["angry", "frustrated", "obsessive", "resentful"],
    categories: ["mental-health", "relationships", "discipline"]
  },
  {
    id: "BG_17_3",
    chapter: 17, verse: 3,
    chapterTitle: "Shraddhatraya Vibhaga Yoga", chapterTitleHindi: "श्रद्धात्रय विभाग योग",
    sanskrit: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत ।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ॥",
    transliteration: "sattvānurūpā sarvasya śraddhā bhavati bhārata",
    hindi: "प्रत्येक व्यक्ति की श्रद्धा उसकी प्रकृति के अनुसार होती है। यह पुरुष श्रद्धामय है — जैसी उसकी श्रद्धा, वैसा ही वह है।",
    english: "O son of Bharata, the faith of each is in accordance with one's own nature. The living being is of the nature of faith — what they believe, they become.",
    wordByWord: [
      { w: "सत्त्व-अनुरूपा", en: "in accordance with one's nature", hi: "अन्तःकरण के अनुरूप" },
      { w: "सर्वस्य", en: "of everyone", hi: "सबकी" },
      { w: "श्रद्धा", en: "faith", hi: "श्रद्धा" },
      { w: "भवति", en: "is / becomes", hi: "होती है" },
      { w: "भारत", en: "O descendant of Bharata", hi: "हे भारत" },
      { w: "श्रद्धा-मयः", en: "made of faith", hi: "श्रद्धामय" },
      { w: "अयम्", en: "this", hi: "यह" },
      { w: "पुरुषः", en: "person", hi: "पुरुष" },
      { w: "यः", en: "who", hi: "जो" },
      { w: "यत्-श्रद्धः", en: "having whatever faith", hi: "जैसी श्रद्धा वाला" },
      { w: "सः", en: "he", hi: "वह" },
      { w: "एव", en: "indeed", hi: "ही" },
      { w: "सः", en: "that (is what he is)", hi: "वैसा ही है" }
    ],
    context: "Krishna reveals the transformative power of belief and faith in shaping character.",
    explanation: "You become what you consistently believe about yourself. Your faith — in yourself, in the Divine, in goodness — shapes your reality more than circumstances do.",
    lifeApplication: "Examine your core beliefs about yourself today. Which beliefs limit you? Replace 'I can't' with 'I haven't yet.' Your self-belief is your destiny.",
    tags: ["belief", "faith", "identity", "mindset", "transformation"],
    moods: ["lost", "confused", "hopeless", "self-doubt"],
    categories: ["self-improvement", "spirituality", "mental-health"]
  },
  {
    id: "BG_17_15",
    chapter: 17, verse: 15,
    chapterTitle: "Shraddhatraya Vibhaga Yoga", chapterTitleHindi: "श्रद्धात्रय विभाग योग",
    sanskrit: "अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत् ।\nस्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥",
    transliteration: "anudvega-karaṁ vākyaṁ satyaṁ priya-hitaṁ ca yat",
    hindi: "जो वाणी उद्वेग न करने वाली, सत्य, प्रिय और हितकारी हो — वही वाणी का तप है।",
    english: "Austerity of speech consists in speaking words that are truthful, pleasing, beneficial, and not agitating to others, and also in regularly reciting Vedic literature.",
    wordByWord: [
      { w: "अनुद्वेग-करम्", en: "not causing distress", hi: "उद्वेग न करने वाला" },
      { w: "वाक्यम्", en: "speech / words", hi: "वचन" },
      { w: "सत्यम्", en: "truthful", hi: "सत्य" },
      { w: "प्रिय-हितम्", en: "pleasing and beneficial", hi: "प्रिय और हितकारी" },
      { w: "च", en: "and", hi: "और" },
      { w: "यत्", en: "which", hi: "जो" },
      { w: "स्वाध्याय-अभ्यसनम्", en: "practice of scriptural study", hi: "स्वाध्याय का अभ्यास" },
      { w: "च", en: "and", hi: "तथा" },
      { w: "एव", en: "also", hi: "ही" },
      { w: "वाक्-मयम्", en: "of speech", hi: "वाणी संबंधी" },
      { w: "तपः", en: "austerity", hi: "तप" },
      { w: "उच्यते", en: "is called", hi: "कहा जाता है" }
    ],
    context: "Krishna describes the discipline of right speech — one of the three austerities of the body.",
    explanation: "Words have immense power. Truth told harshly is violence. Truth told with love heals. The discipline of speech is one of the most powerful spiritual practices.",
    lifeApplication: "Before speaking: Is it true? Is it kind? Is it necessary? If all three: speak. If not all three: reconsider. This single practice transforms relationships.",
    tags: ["speech", "truth", "kindness", "communication", "discipline"],
    moods: ["angry", "frustrated", "resentful"],
    categories: ["relationships", "discipline", "spirituality"]
  },
  {
    id: "BG_18_66",
    chapter: 18, verse: 66,
    chapterTitle: "Moksha Yoga", chapterTitleHindi: "मोक्ष योग",
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja",
    hindi: "सभी धर्मों को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें सभी पापों से मुक्त कर दूंगा — शोक मत करो।",
    english: "Abandon all varieties of duties and just surrender unto Me alone. I shall deliver you from all sinful reactions. Do not fear.",
    wordByWord: [
      { w: "सर्व-धर्मान्", en: "all varieties of dharma", hi: "सब धर्मों को" },
      { w: "परित्यज्य", en: "abandoning", hi: "त्याग कर" },
      { w: "माम्", en: "unto Me", hi: "मेरी" },
      { w: "एकम्", en: "alone", hi: "एक की" },
      { w: "शरणम्", en: "shelter", hi: "शरण" },
      { w: "व्रज", en: "go / take", hi: "जा / ग्रहण कर" },
      { w: "अहम्", en: "I", hi: "मैं" },
      { w: "त्वाम्", en: "you", hi: "तुझे" },
      { w: "सर्व-पापेभ्यः", en: "from all sins", hi: "सब पापों से" },
      { w: "मोक्षयिष्यामि", en: "I shall liberate", hi: "मुक्त कर दूँगा" },
      { w: "मा", en: "do not", hi: "मत" },
      { w: "शुचः", en: "grieve / fear", hi: "शोक कर" }
    ],
    context: "The final and most important instruction of the entire Bhagavad Gita — the essence of surrender.",
    explanation: "After 700 verses of teaching, this is the final word: total surrender to the Divine. Not surrender as defeat — but as the highest act of trust and love.",
    lifeApplication: "In your greatest confusion, say: 'I surrender. I trust.' This is not giving up — it's giving over. Release control and open to guidance.",
    tags: ["surrender", "faith", "liberation", "trust", "grace"],
    moods: ["anxious", "fearful", "overwhelmed", "hopeless"],
    categories: ["spirituality", "faith", "mental-health"]
  },
  {
    id: "BG_18_78",
    chapter: 18, verse: 78,
    chapterTitle: "Moksha Yoga", chapterTitleHindi: "मोक्ष योग",
    sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥",
    transliteration: "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ",
    hindi: "जहाँ योगेश्वर कृष्ण हैं और जहाँ धनुर्धर अर्जुन हैं, वहीं पर श्री, विजय, विभूति और अचल नीति है।",
    english: "Wherever there is Krishna, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality.",
    wordByWord: [
      { w: "यत्र", en: "where", hi: "जहाँ" },
      { w: "योगेश्वरः", en: "the master of yoga", hi: "योगेश्वर" },
      { w: "कृष्णः", en: "Krishna", hi: "कृष्ण" },
      { w: "यत्र", en: "where", hi: "जहाँ" },
      { w: "पार्थः", en: "Arjuna (son of Pritha)", hi: "पार्थ (अर्जुन)" },
      { w: "धनुः-धरः", en: "the archer / wielder of the bow", hi: "धनुर्धारी" },
      { w: "तत्र", en: "there", hi: "वहाँ" },
      { w: "श्रीः", en: "opulence / prosperity", hi: "श्री / सम्पत्ति" },
      { w: "विजयः", en: "victory", hi: "विजय" },
      { w: "भूतिः", en: "extraordinary power / expansion", hi: "ऐश्वर्य" },
      { w: "ध्रुवा", en: "certain / sure", hi: "निश्चित" },
      { w: "नीतिः", en: "morality / righteousness", hi: "नीति" },
      { w: "मतिः", en: "opinion", hi: "मत" },
      { w: "मम", en: "My", hi: "मेरा" }
    ],
    context: "The final verse of the Gita, spoken by Sanjaya who witnessed the battle clairvoyantly.",
    explanation: "Where Divine wisdom (Krishna) meets aligned action (Arjuna) — there victory follows. Not success as the world defines it, but the complete success of a dharmic life.",
    lifeApplication: "Ask: 'Am I aligned with Divine wisdom in this choice?' When head, heart, and dharma align — act boldly. Victory follows alignment.",
    tags: ["victory", "dharma", "alignment", "divine", "success"],
    moods: ["confused", "uncertain", "worried"],
    categories: ["career", "duty", "spirituality"]
  },
  {
    id: "BG_3_21",
    chapter: 3,
    verse: 21,
    chapterTitle: "Karma Yoga",
    chapterTitleHindi: "कर्म योग",
    sanskrit: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥",
    transliteration: "yad yad ācarati śreṣṭhas tat tad evetaro janaḥ\nsa yat pramāṇaṁ kurute lokas tad anuvartate",
    hindi: "श्रेष्ठ पुरुष जो-जो आचरण करता है, वही-वही दूसरे लोग भी करते हैं। वह जो प्रमाण प्रस्तुत करता है, समस्त संसार उसी का अनुसरण करता है।",
    english: "Whatever a great person does, common people follow. Whatever standard they set by exemplary acts, the world pursues.",
    wordByWord: [
      { w: "यत् यत्", en: "whatever", hi: "जो जो" },
      { w: "आचरति", en: "does / performs", hi: "आचरण करता है" },
      { w: "श्रेष्ठः", en: "a great / best person", hi: "श्रेष्ठ पुरुष" },
      { w: "तत् तत्", en: "that very thing", hi: "वही वही" },
      { w: "एव", en: "indeed", hi: "ही" },
      { w: "इतरः", en: "other / common", hi: "अन्य / सामान्य" },
      { w: "जनः", en: "people", hi: "लोग" },
      { w: "सः", en: "he", hi: "वह" },
      { w: "यत्", en: "whatever", hi: "जो" },
      { w: "प्रमाणम्", en: "standard / example", hi: "प्रमाण" },
      { w: "कुरुते", en: "sets / makes", hi: "करता है" },
      { w: "लोकः", en: "the world", hi: "संसार" },
      { w: "तत्", en: "that", hi: "उसी का" },
      { w: "अनुवर्तते", en: "follows", hi: "अनुसरण करता है" }
    ],
    context: "Krishna teaches Arjuna about the responsibility of leaders and how their actions influence society.",
    explanation: "Leadership is lived, not declared. People follow example, not instruction. This is true in families, organizations, and nations. Those in positions of influence must act with the highest integrity.",
    lifeApplication: "Ask yourself: 'What standards am I setting by my behavior?' As a parent, leader, older sibling, or employee — people watch you. Live the values you want to see in others. Your actions are always teaching something.",
    tags: ["leadership", "example", "influence", "responsibility", "integrity"],
    moods: ["confused", "uncertain"],
    categories: ["career", "relationships", "duty"],
  },
  {
    id: "BG_6_34",
    chapter: 6,
    verse: 34,
    chapterTitle: "Dhyana Yoga",
    chapterTitleHindi: "ध्यान योग",
    sanskrit: "चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम् ।\nतस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम् ॥",
    transliteration: "cañcalaṁ hi manaḥ kṛṣṇa pramāthi balavad dṛḍham\ntasyāhaṁ nigrahaṁ manye vāyor iva su-duṣkaram",
    hindi: "हे कृष्ण! यह मन बड़ा चंचल, हठी, बलवान और दृढ़ है। मेरे विचार में इसे वश में करना वायु को रोकने जैसा ही अत्यंत कठिन है।",
    english: "The mind is restless, turbulent, obstinate and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind.",
    wordByWord: [
      { w: "चञ्चलम्", en: "restless / flickering", hi: "चंचल" },
      { w: "हि", en: "certainly", hi: "निश्चय ही" },
      { w: "मनः", en: "the mind", hi: "मन" },
      { w: "कृष्ण", en: "O Krishna", hi: "हे कृष्ण" },
      { w: "प्रमाथि", en: "turbulent / agitating", hi: "प्रमथन करने वाला" },
      { w: "बलवत्", en: "strong", hi: "बलवान" },
      { w: "दृढम्", en: "obstinate / stubborn", hi: "दृढ़ / हठीला" },
      { w: "तस्य", en: "its", hi: "उसका" },
      { w: "अहम्", en: "I", hi: "मैं" },
      { w: "निग्रहम्", en: "subduing / control", hi: "निग्रह" },
      { w: "मन्ये", en: "I think", hi: "मानता हूँ" },
      { w: "वायोः", en: "of the wind", hi: "वायु को" },
      { w: "इव", en: "like", hi: "के समान" },
      { w: "सुदुष्करम्", en: "very difficult", hi: "अत्यन्त कठिन" }
    ],
    context: "Arjuna admits to Krishna how difficult it is to control the mind, speaking what many of us feel.",
    explanation: "Even Arjuna — the greatest warrior — found the mind difficult to control. This honesty is itself wisdom. Recognizing the mind's wild nature is the first step to working with it skillfully.",
    lifeApplication: "If you struggle with focus, overthinking, or emotional reactivity — you are not weak. This is the human condition. Start with just 5 minutes of mindfulness daily. Notice thoughts without chasing them. Consistency over months builds the muscle.",
    tags: ["mind", "focus", "restlessness", "meditation", "overthinking"],
    moods: ["scattered", "anxious", "overthinking", "unfocused"],
    categories: ["mental-health", "discipline", "meditation"],
  },
  {
    id: "BG_6_35",
    chapter: 6,
    verse: 35,
    chapterTitle: "Dhyana Yoga",
    chapterTitleHindi: "ध्यान योग",
    sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥",
    transliteration: "asaṁśayaṁ mahā-bāho mano durnigrahaṁ calam\nabhyāsena tu kaunteya vairāgyeṇa ca gṛhyate",
    hindi: "हे महाबाहु! निःसंदेह मन चंचल और कठिनता से वश में होने वाला है, परन्तु हे कुन्तीपुत्र! अभ्यास और वैराग्य से यह वश में किया जा सकता है।",
    english: "O mighty-armed son of Kunti, it is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment.",
    wordByWord: [
      { w: "असंशयम्", en: "undoubtedly", hi: "निःसंदेह" },
      { w: "महाबाहो", en: "O mighty-armed one", hi: "हे महाबाहु" },
      { w: "मनः", en: "the mind", hi: "मन" },
      { w: "दुर्निग्रहम्", en: "difficult to restrain", hi: "कठिनता से वश में होने वाला" },
      { w: "चलम्", en: "restless", hi: "चंचल" },
      { w: "अभ्यासेन", en: "by practice", hi: "अभ्यास से" },
      { w: "तु", en: "but", hi: "तो" },
      { w: "कौन्तेय", en: "O son of Kunti", hi: "हे कुन्तीपुत्र" },
      { w: "वैराग्येण", en: "by detachment", hi: "वैराग्य से" },
      { w: "च", en: "and", hi: "और" },
      { w: "गृह्यते", en: "is controlled", hi: "वश में होता है" }
    ],
    context: "Krishna responds to Arjuna's honest admission, offering the practical solution.",
    explanation: "Two tools: Practice (abhyasa) + Non-attachment (vairagya). Consistent practice builds new neural pathways. Non-attachment releases the grip of desire and fear that make the mind spin. Together, they tame the wildest mind.",
    lifeApplication: "Your two daily practices: (1) Morning — 10 min seated meditation, breathing focus. (2) Evening — journal one thing you are releasing attachment to. Do this for 21 days. The transformation will surprise you.",
    tags: ["mind", "practice", "detachment", "meditation", "discipline"],
    moods: ["scattered", "anxious", "overthinking"],
    categories: ["mental-health", "discipline", "meditation"],
  },
  {
    id: "BG_5_22",
    chapter: 5,
    verse: 22,
    chapterTitle: "Karma Sanyasa Yoga",
    chapterTitleHindi: "कर्म संन्यास योग",
    sanskrit: "ये हि संस्पर्शजा भोगा दुःखयोनय एव ते ।\nआद्यन्तवन्तः कौन्तेय न तेषु रमते बुधः ॥",
    transliteration: "ye hi saṁsparśa-jā bhogā duḥkha-yonaya eva te\nādy-antavantaḥ kaunteya na teṣu ramate budhaḥ",
    hindi: "इन्द्रियों और विषयों के संयोग से उत्पन्न होने वाले जितने भोग हैं, वे सब दुख के ही कारण हैं। वे आदि और अन्त वाले हैं। इसीलिए बुद्धिमान मनुष्य उनमें आनन्द नहीं लेता।",
    english: "The pleasures that are born of sense contacts are sources of pain. They have a beginning and an end, and the wise do not delight in them.",
    wordByWord: [
      { w: "ये", en: "which", hi: "जो" },
      { w: "हि", en: "indeed", hi: "निश्चय ही" },
      { w: "संस्पर्श-जाः", en: "born of sense contact", hi: "इन्द्रिय-संयोग से उत्पन्न" },
      { w: "भोगाः", en: "enjoyments", hi: "भोग" },
      { w: "दुःख-योनयः", en: "sources of misery", hi: "दुःख के कारण" },
      { w: "एव", en: "only", hi: "ही" },
      { w: "ते", en: "they", hi: "वे" },
      { w: "आदि-अन्त-वन्तः", en: "having a beginning and an end", hi: "आदि-अन्त वाले" },
      { w: "कौन्तेय", en: "O son of Kunti", hi: "हे कुन्तीपुत्र" },
      { w: "न", en: "not", hi: "नहीं" },
      { w: "तेषु", en: "in them", hi: "उनमें" },
      { w: "रमते", en: "delights / revels", hi: "रमण करता है" },
      { w: "बुधः", en: "the wise", hi: "बुद्धिमान" }
    ],
    context: "Krishna distinguishes between temporary sense pleasure and lasting inner joy.",
    explanation: "This doesn't mean avoid all pleasure — it means understand its nature. Sense pleasures are temporary. They satisfy momentarily, then leave us craving more. True contentment comes from within, not from external stimulation.",
    lifeApplication: "Notice any patterns of chasing pleasure that leave you emptier than before — social media, food, shopping. For 3 days, when you feel an impulse for external stimulation, pause and ask: 'What inner need am I really trying to meet?' Then address that directly.",
    tags: ["pleasure", "contentment", "desire", "wisdom", "detachment"],
    moods: ["addicted", "craving", "empty", "restless"],
    categories: ["mental-health", "discipline", "self-improvement"],
  },
  {
    id: "BG_13_8",
    chapter: 13,
    verse: 8,
    chapterTitle: "Kshetra-Kshetrajna Yoga",
    chapterTitleHindi: "क्षेत्र-क्षेत्रज्ञ योग",
    sanskrit: "अमानित्वमदम्भित्वमहिंसा क्षान्तिरार्जवम् ।\nआचार्योपासनं शौचं स्थैर्यमात्मविनिग्रहः ॥",
    transliteration: "amānitvam adambhitvam ahiṁsā kṣāntir ārjavam\nācāryopāsanaṁ śaucaṁ sthairyam ātma-vinigrahaḥ",
    hindi: "अपमान सहना, निष्कपटता, अहिंसा, क्षमाशीलता, सरलता, गुरु की उपासना, पवित्रता, स्थिरता और आत्मसंयम।",
    english: "Humility, pridelessness, non-violence, tolerance, simplicity, approaching a genuine teacher, cleanliness, steadiness, and self-control.",
    wordByWord: [
      { w: "अमानित्वम्", en: "humility / absence of pride", hi: "मान न चाहना" },
      { w: "अदम्भित्वम्", en: "pridelessness / no hypocrisy", hi: "दम्भ रहितता" },
      { w: "अहिंसा", en: "non-violence", hi: "अहिंसा" },
      { w: "क्षान्तिः", en: "tolerance / forbearance", hi: "क्षमा / सहनशीलता" },
      { w: "आर्जवम्", en: "simplicity / straightforwardness", hi: "सरलता" },
      { w: "आचार्य-उपासनम्", en: "service to a teacher", hi: "आचार्य की सेवा" },
      { w: "शौचम्", en: "cleanliness / purity", hi: "शुद्धि / पवित्रता" },
      { w: "स्थैर्यम्", en: "steadiness", hi: "स्थिरता" },
      { w: "आत्म-विनिग्रहः", en: "self-control", hi: "मन-इन्द्रिय निग्रह" }
    ],
    context: "Krishna lists the qualities that constitute true knowledge — the foundation of spiritual growth.",
    explanation: "These are not just virtues — they are the architecture of a mature human being. Humility opens us to learning. Non-violence prevents suffering. Steadiness is the ground of action. Together they form the character of the wise.",
    lifeApplication: "Pick one quality from this list to consciously practice this week. If you choose humility — notice when you feel defensive and choose curiosity instead. If steadiness — set a consistent morning routine. Character is built in small daily choices.",
    tags: ["humility", "character", "virtue", "wisdom", "non-violence"],
    moods: ["proud", "arrogant", "confused"],
    categories: ["self-improvement", "spirituality", "relationships"],
  },
  {
    id: "BG_4_24",
    chapter: 4,
    verse: 24,
    chapterTitle: "Jnana Yoga",
    chapterTitleHindi: "ज्ञान योग",
    sanskrit: "ब्रह्मार्पणं ब्रह्म हविर्ब्रह्माग्नौ ब्रह्मणा हुतम् ।\nब्रह्मैव तेन गन्तव्यं ब्रह्मकर्मसमाधिना ॥",
    transliteration: "brahmārpaṇaṁ brahma havir brahmāgnau brahmaṇā hutam\nbrahmaiva tena gantavyaṁ brahma-karma-samādhinā",
    hindi: "ब्रह्म ही अर्पण है, ब्रह्म ही हवि है, ब्रह्म की अग्नि में ब्रह्म द्वारा हवन किया जाता है। ब्रह्म-कर्म-समाधि में स्थित रहने वाले को ब्रह्म की ही प्राप्ति होती है।",
    english: "The act of offering is Brahman, the oblation is Brahman, offered by Brahman in the fire of Brahman. Brahman alone is to be reached by one who thus sees Brahman in action.",
    wordByWord: [
      { w: "ब्रह्म-अर्पणम्", en: "the act of offering is Brahman", hi: "अर्पण ब्रह्म है" },
      { w: "ब्रह्म", en: "Brahman", hi: "ब्रह्म" },
      { w: "हविः", en: "the oblation", hi: "हवन सामग्री" },
      { w: "ब्रह्म-अग्नौ", en: "in the fire of Brahman", hi: "ब्रह्मरूपी अग्नि में" },
      { w: "ब्रह्मणा", en: "by Brahman", hi: "ब्रह्म द्वारा" },
      { w: "हुतम्", en: "offered", hi: "हवन किया गया" },
      { w: "ब्रह्म", en: "Brahman", hi: "ब्रह्म" },
      { w: "एव", en: "alone / certainly", hi: "ही" },
      { w: "तेन", en: "by him", hi: "उसके द्वारा" },
      { w: "गन्तव्यम्", en: "to be reached", hi: "प्राप्त किया जाने वाला" },
      { w: "ब्रह्म-कर्म-समाधिना", en: "by absorption in action that is Brahman", hi: "ब्रह्मकर्म में समाधि से" }
    ],
    context: "Krishna teaches the vision of seeing all action as a cosmic offering to the Divine.",
    explanation: "When work becomes worship — when every action is offered with the spirit of 'this is for something greater than my ego' — the doer and the doing and the divine merge. This is the state of spiritual action.",
    lifeApplication: "Before you begin your work today, take 30 seconds to dedicate it: 'Let this work be an offering — not just for my benefit, but for all beings I serve.' This simple mental shift transforms mundane work into spiritual practice.",
    tags: ["devotion", "offering", "divine", "work", "worship"],
    moods: ["purposeless", "lost", "disconnected"],
    categories: ["spirituality", "career", "productivity"],
  },
  {
    id: "BG_11_33",
    chapter: 11,
    verse: 33,
    chapterTitle: "Vishwarupa Darshana Yoga",
    chapterTitleHindi: "विश्वरूपदर्शन योग",
    sanskrit: "तस्मात्त्वमुत्तिष्ठ यशो लभस्व\nजित्वा शत्रून्भुङ्क्ष्व राज्यं समृद्धम् ।\nमयैवैते निहताः पूर्वमेव\nनिमित्तमात्रं भव सव्यसाचिन् ॥",
    transliteration: "tasmāt tvam uttiṣṭha yaśo labhasva\njītvā śatrūn bhuṅkṣva rājyaṁ samṛddham\nmayaivaite nihatāḥ pūrvam eva\nnimitta-mātraṁ bhava savyasācin",
    hindi: "इसलिए तुम उठो और यश प्राप्त करो। शत्रुओं को जीतकर समृद्ध राज्य का भोग करो। ये सब पहले से ही मेरे द्वारा मारे जा चुके हैं। तुम केवल निमित्त बनो।",
    english: "Therefore arise and win glory. Conquer your enemies and enjoy a prosperous kingdom. They are already put to death by My arrangement, and you can be but an instrument in the fight.",
    wordByWord: [
      { w: "तस्मात्", en: "therefore", hi: "इसलिए" },
      { w: "त्वम्", en: "you", hi: "तू" },
      { w: "उत्तिष्ठ", en: "arise", hi: "खड़ा हो" },
      { w: "यशः", en: "fame / glory", hi: "यश" },
      { w: "लभस्व", en: "attain / gain", hi: "प्राप्त कर" },
      { w: "जित्वा", en: "conquering", hi: "जीत कर" },
      { w: "शत्रून्", en: "enemies", hi: "शत्रुओं को" },
      { w: "भुङ्क्ष्व", en: "enjoy", hi: "भोग" },
      { w: "राज्यम्", en: "kingdom", hi: "राज्य" },
      { w: "समृद्धम्", en: "prosperous", hi: "समृद्ध" },
      { w: "मया", en: "by Me", hi: "मेरे द्वारा" },
      { w: "एव", en: "alone", hi: "ही" },
      { w: "एते", en: "these", hi: "ये" },
      { w: "निहताः", en: "already slain", hi: "मारे जा चुके" },
      { w: "पूर्वम्", en: "already / beforehand", hi: "पहले" },
      { w: "एव", en: "indeed", hi: "ही" },
      { w: "निमित्त-मात्रम्", en: "merely an instrument", hi: "केवल निमित्त" },
      { w: "भव", en: "become", hi: "बन जा" },
      { w: "सव्यसाचिन्", en: "O ambidextrous archer (Arjuna)", hi: "हे सव्यसाची (अर्जुन)" }
    ],
    context: "After revealing His cosmic form, Krishna calls Arjuna to action, revealing the cosmic perspective on the battle.",
    explanation: "From the divine perspective, the outcome is already determined by larger forces. Our role is to show up fully, to be the best instrument of our purpose that we can be. This is both humbling and liberating.",
    lifeApplication: "In your great life challenges — feel the liberation in knowing that you are not alone in determining outcomes. The universe is working with you. Your part is to be a fully present, fully committed instrument of your highest purpose.",
    tags: ["action", "courage", "purpose", "destiny", "arise"],
    moods: ["paralyzed", "fearful", "avoidant", "hopeless"],
    categories: ["career", "discipline", "motivation", "spirituality"],
  }
];

// Build the COMPLETE verse set: full 700-verse base overlaid with curated rich verses.
export const SHLOKAS = (() => {
  const base = Array.isArray(BG_VERSES) ? BG_VERSES : [];
  if (!base.length) return CURATED_SHLOKAS.slice();
  const curatedById = {};
  CURATED_SHLOKAS.forEach(c => { curatedById[c.id] = c; });
  const merged = base.map(v => (curatedById[v.id] ? { ...v, ...curatedById[v.id] } : v));
  base.forEach(v => { delete curatedById[v.id]; });
  Object.values(curatedById).forEach(c => merged.push(c));
  // Overlay authentic word-by-word (gita/gita, public domain) onto any verse that
  // does not already carry curated word-by-word. Never overwrites curated data.
  const wbw = WORD_BY_WORD && typeof WORD_BY_WORD === 'object' ? WORD_BY_WORD : {};
  merged.forEach(v => {
    if ((!v.wordByWord || !v.wordByWord.length) && Array.isArray(wbw[v.id]) && wbw[v.id].length) {
      v.wordByWord = wbw[v.id];
    }
  });
  merged.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
  return merged;
})();

export const MOODS = [
  { id: "peaceful", label: "Peaceful", emoji: "😌", color: "#4CAF50" },
  { id: "happy", label: "Happy", emoji: "😊", color: "#8BC34A" },
  { id: "grateful", label: "Grateful", emoji: "🙏", color: "#FF9800" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#FF7043" },
  { id: "stressed", label: "Stressed", emoji: "😤", color: "#F44336" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#5C6BC0" },
  { id: "confused", label: "Confused", emoji: "😕", color: "#9C27B0" },
  { id: "motivated", label: "Motivated", emoji: "💪", color: "#2196F3" },
  { id: "lost", label: "Lost", emoji: "🌫️", color: "#607D8B" },
  { id: "angry", label: "Angry", emoji: "😠", color: "#E53935" },
];

export const CHAPTERS = [
  { num: 1, title: "Arjuna Vishada Yoga", subtitle: "The Yoga of Arjuna's Grief" },
  { num: 2, title: "Sankhya Yoga", subtitle: "The Yoga of Knowledge" },
  { num: 3, title: "Karma Yoga", subtitle: "The Yoga of Action" },
  { num: 4, title: "Jnana Yoga", subtitle: "The Yoga of Knowledge & Wisdom" },
  { num: 5, title: "Karma Vairagya Yoga", subtitle: "The Yoga of Renunciation" },
  { num: 6, title: "Dhyana Yoga", subtitle: "The Yoga of Meditation" },
  { num: 7, title: "Jnana Vijnana Yoga", subtitle: "The Yoga of Knowledge & Realization" },
  { num: 8, title: "Aksara Parabrahman Yoga", subtitle: "The Yoga of the Imperishable Absolute" },
  { num: 9, title: "Raja Vidya Yoga", subtitle: "The Yoga of Royal Knowledge" },
  { num: 10, title: "Vibhuti Yoga", subtitle: "The Yoga of Divine Manifestations" },
  { num: 11, title: "Vishwaroopa Darshana Yoga", subtitle: "The Yoga of the Cosmic Form" },
  { num: 12, title: "Bhakti Yoga", subtitle: "The Yoga of Devotion" },
  { num: 13, title: "Kshetra Kshetrajna Vibhaga Yoga", subtitle: "The Yoga of the Field" },
  { num: 14, title: "Gunatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Modes" },
  { num: 15, title: "Purushottama Yoga", subtitle: "The Yoga of the Supreme Being" },
  { num: 16, title: "Daivasura Sampad Vibhaga Yoga", subtitle: "The Yoga of Divine & Demonic" },
  { num: 17, title: "Shraddhatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Kinds of Faith" },
  { num: 18, title: "Moksha Yoga", subtitle: "The Yoga of Liberation" },
];

export const AI_RESPONSES = {
  stress: {
    reply: "The Gita reminds us that suffering arises from what we hold tightly. When stress grips us, it's often because we're attached to outcomes we cannot control.",
    shlokas: ["BG_2_14", "BG_2_47", "BG_6_35"]
  },
  career: {
    reply: "Career confusion often stems from asking 'What will I get?' before asking 'What is my dharma?' Krishna offers a liberating reframe:",
    shlokas: ["BG_2_47", "BG_3_19", "BG_18_78"]
  },
  lost: {
    reply: "Feeling lost is often the beginning of real inner searching. It's not a problem — it's a doorway.",
    shlokas: ["BG_6_5", "BG_4_38", "BG_17_3"]
  },
  anger: {
    reply: "Anger is a messenger — it reveals where we are attached. The Gita maps the entire psychology of anger:",
    shlokas: ["BG_2_62", "BG_12_13", "BG_17_15"]
  },
  fear: {
    reply: "Fear has two faces: sometimes it protects us, often it paralyzes us. The Gita's antidote to fear is a deeper understanding of what is real:",
    shlokas: ["BG_2_20", "BG_2_3", "BG_9_22"]
  },
  relationship: {
    reply: "Relationships test us because we reveal our deepest attachments in them. The Gita teaches love without possession:",
    shlokas: ["BG_12_13", "BG_17_15", "BG_2_47"]
  },
  sad: {
    reply: "Sadness is a sacred emotion — it means you've loved something deeply. The Gita holds space for grief while pointing toward a deeper ground:",
    shlokas: ["BG_2_14", "BG_2_20", "BG_9_22"]
  },
  discipline: {
    reply: "Discipline is not punishment — it's self-love in action. When we choose long-term growth over short-term comfort, we honor our true self:",
    shlokas: ["BG_6_5", "BG_6_6", "BG_3_19"]
  },
  purpose: {
    reply: "Purpose is uncovered through alignment between your nature, your skills, and the world's needs. The Gita offers a profound map:",
    shlokas: ["BG_4_38", "BG_3_21", "BG_18_78"]
  },
  default: {
    reply: "The Bhagavad Gita meets us exactly where we are. Whatever you're facing, there is wisdom here for you:",
    shlokas: ["BG_2_47", "BG_6_5", "BG_9_22"]
  }
};

// Rotate the daily verse over the curated set so it always has rich content.
export function getTodayShloka() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const pool = (CURATED_SHLOKAS && CURATED_SHLOKAS.length) ? CURATED_SHLOKAS : SHLOKAS;
  return pool[dayOfYear % pool.length];
}

export function getShlokaById(id) {
  return SHLOKAS.find(s => s.id === id);
}

// Verses of a single chapter, in order.
export function getShlokasByChapter(chapterNum) {
  return SHLOKAS.filter(s => s.chapter === chapterNum).sort((a, b) => a.verse - b.verse);
}

// Null-safe search across the full 700-verse set.
export function searchShlokas(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  return SHLOKAS.filter(s => {
    const tags = Array.isArray(s.tags) ? s.tags.join(' ') : '';
    return (
      (s.english || '').toLowerCase().includes(q) ||
      (s.hindi || '').includes(q) ||
      (s.transliteration || '').toLowerCase().includes(q) ||
      (s.sanskrit || '').includes(q) ||
      tags.toLowerCase().includes(q) ||
      (s.chapterTitle || '').toLowerCase().includes(q) ||
      (s.explanation || '').toLowerCase().includes(q) ||
      `bg ${s.chapter}.${s.verse}`.includes(q) ||
      `${s.chapter}.${s.verse}`.includes(q)
    );
  });
}

export function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("stress") || msg.includes("anxiety") || msg.includes("anxious") || msg.includes("worried")) return AI_RESPONSES.stress;
  if (msg.includes("career") || msg.includes("job") || msg.includes("work")) return AI_RESPONSES.career;
  if (msg.includes("lost") || msg.includes("confused") || msg.includes("direction") || msg.includes("meaning")) return AI_RESPONSES.lost;
  if (msg.includes("anger") || msg.includes("angry") || msg.includes("rage")) return AI_RESPONSES.anger;
  if (msg.includes("fear") || msg.includes("afraid") || msg.includes("scared")) return AI_RESPONSES.fear;
  if (msg.includes("relationship") || msg.includes("love") || msg.includes("family") || msg.includes("friend")) return AI_RESPONSES.relationship;
  if (msg.includes("sad") || msg.includes("depress") || msg.includes("grief") || msg.includes("lonely")) return AI_RESPONSES.sad;
  if (msg.includes("discipline") || msg.includes("focus") || msg.includes("habit") || msg.includes("lazy")) return AI_RESPONSES.discipline;
  if (msg.includes("purpose") || msg.includes("goal") || msg.includes("mission")) return AI_RESPONSES.purpose;
  return AI_RESPONSES.default;
}
