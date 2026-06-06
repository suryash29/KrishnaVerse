// KrishnaVerse – Bhagavad Gita Shloka Dataset (Mobile)
// Ported from data/shlokas.js for React Native
//
// CURATED_SHLOKAS hold the richly-annotated verses (context, explanation,
// life application, word-by-word, tags, moods). They are merged on top of the
// complete 700-verse base (constants/GitaVerses.js → BG_VERSES) so the exported
// SHLOKAS array contains every verse of all 18 chapters with no gaps.

import { BG_VERSES } from './GitaVerses';

const CURATED_SHLOKAS = [
  {
    id: "BG_2_47",
    chapter: 2, verse: 47,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    hindi: "कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं।",
    english: "You have a right to perform your duties, but never to the fruits of your actions. Never be motivated by results, and never be attached to inaction.",
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
    context: "The final verse of the Gita, spoken by Sanjaya who witnessed the battle clairvoyantly.",
    explanation: "Where Divine wisdom (Krishna) meets aligned action (Arjuna) — there victory follows. Not success as the world defines it, but the complete success of a dharmic life.",
    lifeApplication: "Ask: 'Am I aligned with Divine wisdom in this choice?' When head, heart, and dharma align — act boldly. Victory follows alignment.",
    tags: ["victory", "dharma", "alignment", "divine", "success"],
    moods: ["confused", "uncertain", "worried"],
    categories: ["career", "duty", "spirituality"]
  },
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
