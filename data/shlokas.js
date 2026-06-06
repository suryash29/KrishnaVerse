// Krishna Guide – Bhagavad Gita Shloka Dataset
// CURATED_SHLOKAS: carefully selected verses with rich annotations
// (word-by-word, context, explanation & life application). These are MERGED
// on top of the complete 700-verse base (data/gita-verses.js → BG_VERSES) so
// the final SHLOKAS array contains every verse of all 18 chapters with no gaps,
// while these curated verses keep their extra teaching fields.

const CURATED_SHLOKAS = [
  {
    id: "BG_2_47",
    chapter: 2, verse: 47,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    hindi: "कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं। न तो तुम कर्मफल के हेतु बनो, और न ही अकर्म में तुम्हारी आसक्ति हो।",
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
    context: "Krishna speaks this to Arjuna on the battlefield of Kurukshetra, teaching the principle of Nishkama Karma — selfless action.",
    explanation: "This is the most quoted verse of the Gita. Krishna teaches that we control our effort, not the outcome. Attachment to results creates anxiety, fear, and disappointment. True freedom comes from acting with full dedication while releasing outcome.",
    lifeApplication: "Before your next exam, interview, or presentation — give 100% effort and release the result. Ask: 'Am I focused on my preparation, or obsessing over the outcome?' Shift to process-focus. This reduces anxiety and paradoxically improves results.",
    tags: ["karma", "duty", "action", "detachment", "work", "results", "focus"],
    moods: ["anxious", "stressed", "overwhelmed", "confused", "worried"],
    categories: ["career", "duty", "discipline", "productivity", "mental-health"]
  },
  {
    id: "BG_2_20",
    chapter: 2, verse: 20,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "न जायते म्रियते वा कदाचिन्-\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥",
    transliteration: "na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śāśvato 'yaṁ purāṇo\nna hanyate hanyamāne śarīre",
    hindi: "आत्मा कभी जन्म नहीं लेती, कभी मरती नहीं। यह कभी थी, कभी होगी — यह अनादि, नित्य, शाश्वत और पुरातन है। शरीर के मारे जाने पर भी यह नहीं मारी जाती।",
    english: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
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
    context: "Krishna comforts Arjuna who grieves for those who may die in battle, revealing the eternal nature of the soul.",
    explanation: "Our deepest identity is not this body or mind — it's the eternal soul. Loss, failure, and death are experiences of the temporary, not the eternal. Understanding this dissolves the deepest fear.",
    lifeApplication: "When you face a devastating loss — a relationship, a job, a loved one — remember: your soul is untouched. Grieve what is human to grieve, but anchor in this truth: your essential self is eternal, indestructible, and complete.",
    tags: ["soul", "eternal", "death", "identity", "fear", "grief"],
    moods: ["grieving", "lost", "fearful", "depressed", "hopeless"],
    categories: ["mental-health", "spirituality", "loss", "identity"]
  },
  {
    id: "BG_2_14",
    chapter: 2, verse: 14,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
    transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ\nāgamāpāyino 'nityās tāṁs titikṣasva bhārata",
    hindi: "हे कौन्तेय! सर्दी-गर्मी, सुख-दुख देने वाले इन्द्रिय और विषयों के संयोग तो आने-जाने वाले और अनित्य हैं। हे भरतवंशी! इन्हें सहन करो।",
    english: "O Arjuna, the non-permanent appearances of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, and one must learn to tolerate them.",
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
    explanation: "All pleasure and pain are impermanent. They come, they go. The wise person neither despairs in suffering nor becomes intoxicated by joy. This is equanimity — the foundation of inner peace.",
    lifeApplication: "In your darkest moment, remind yourself: 'This is a season. It will pass.' In your greatest joy, stay grounded: 'This too is impermanent — enjoy it, but don't cling.' Keep a log of past difficulties you've already survived.",
    tags: ["impermanence", "suffering", "equanimity", "resilience", "tolerance"],
    moods: ["sad", "depressed", "stressed", "overwhelmed"],
    categories: ["mental-health", "resilience", "discipline"]
  },
  {
    id: "BG_6_5",
    chapter: 6, verse: 5,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    hindi: "अपने द्वारा अपना उद्धार करो, और अपने आप को नीचे मत गिरने दो। क्योंकि आत्मा ही अपना मित्र है और आत्मा ही अपना शत्रु है।",
    english: "One must elevate oneself with the help of one's mind, and not degrade oneself. The mind is the friend of the conditioned soul, and its enemy as well.",
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
    context: "In the chapter on meditation, Krishna teaches that the self is both the greatest ally and greatest enemy.",
    explanation: "Your mind can be your greatest friend — motivating, calming, and guiding you — or your worst enemy — criticizing, sabotaging, and trapping you. The difference lies in discipline and awareness.",
    lifeApplication: "Notice your inner dialogue today. Are you uplifting yourself or tearing yourself down? Replace self-criticism with self-inquiry: not 'I'm so stupid' but 'What can I learn here?' You are your own best coach.",
    tags: ["self", "mind", "discipline", "motivation", "inner-strength"],
    moods: ["self-doubt", "lost", "depressed", "unmotivated"],
    categories: ["mental-health", "discipline", "productivity", "self-improvement"]
  },
  {
    id: "BG_6_6",
    chapter: 6, verse: 6,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः ।\nअनात्मनस्तु शत्रुत्वे वर्ते तात्मैव शत्रुवत् ॥",
    transliteration: "bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ\nanātmanas tu śatrutve vartetātmaiva śatruvat",
    hindi: "जिसने मन को जीत लिया है, उसके लिए मन सबसे अच्छा मित्र है। लेकिन जो मन को नहीं जीत सका, उसके लिए यही मन शत्रु की तरह कार्य करता है।",
    english: "For one who has conquered the mind, the Supersoul is already reached, for the self is the friend. But for one who has failed to do so, his very mind will be the greatest enemy.",
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
    context: "Krishna continues the teaching on self-mastery, explaining how the mind functions as friend or foe.",
    explanation: "An untrained mind is like a wild horse — it takes you wherever its impulses lead. A trained mind is like a powerful ally. Meditation, reflection, and consistent discipline are the tools of mind mastery.",
    lifeApplication: "Pick one habit this week to train your mind: 10 minutes of morning meditation, journaling before sleep, or 5 minutes of deep breathing when stressed. Small consistent practice builds the greatest inner strength.",
    tags: ["mind", "self-control", "meditation", "discipline", "inner-strength"],
    moods: ["anxious", "scattered", "impulsive", "stressed"],
    categories: ["mental-health", "discipline", "spirituality"]
  },
  {
    id: "BG_3_21",
    chapter: 3, verse: 21,
    chapterTitle: "Karma Yoga", chapterTitleHindi: "कर्म योग",
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
    categories: ["career", "relationships", "duty"]
  },
  {
    id: "BG_4_7",
    chapter: 4, verse: 7,
    chapterTitle: "Jnana Yoga", chapterTitleHindi: "ज्ञान योग",
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
    hindi: "हे भारत! जब-जब धर्म की हानि होती है और अधर्म का उत्थान होता है, तब-तब मैं स्वयं को प्रकट करता हूं।",
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
    explanation: "The Divine always restores balance. Darkness cannot permanently prevail. This is a cosmic promise — not just historically, but in our own lives. When we align with righteousness, we align with the divine current.",
    lifeApplication: "When you see injustice or feel that darkness is winning — remember this cosmic law. Your small acts of righteousness contribute to a larger restoration. Stand for what is right, even when it's hard. The universe supports dharma.",
    tags: ["dharma", "divine", "righteousness", "faith", "hope"],
    moods: ["hopeless", "faithless", "angry", "frustrated"],
    categories: ["spirituality", "duty", "faith"]
  },
  {
    id: "BG_4_38",
    chapter: 4, verse: 38,
    chapterTitle: "Jnana Yoga", chapterTitleHindi: "ज्ञान योग",
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥",
    transliteration: "na hi jñānena sadṛśaṁ pavitram iha vidyate\ntat svayaṁ yoga-saṁsiddhaḥ kālenātmani vindati",
    hindi: "इस संसार में ज्ञान के समान पवित्र करने वाला कुछ भी नहीं है। जो योग के द्वारा सिद्ध हो जाता है, वह समय आने पर उसे अपनी आत्मा में ही प्राप्त कर लेता है।",
    english: "In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism. And one who has achieved this enjoys the self within himself in due course of time.",
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
    explanation: "Knowledge — especially self-knowledge — is the ultimate cleanser. It burns away confusion, fear, and attachment. Every bit of genuine wisdom you gain elevates your entire being.",
    lifeApplication: "Invest in learning. Read one book a month. Spend 15 minutes daily in self-study or reflection. Ask deeper questions: 'Why did I react that way? What do I truly want?' Self-knowledge is the highest return on investment.",
    tags: ["knowledge", "wisdom", "self-knowledge", "learning", "growth"],
    moods: ["confused", "lost", "searching"],
    categories: ["self-improvement", "spirituality", "productivity"]
  },
  {
    id: "BG_6_34",
    chapter: 6, verse: 34,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
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
    categories: ["mental-health", "discipline", "meditation"]
  },
  {
    id: "BG_6_35",
    chapter: 6, verse: 35,
    chapterTitle: "Dhyana Yoga", chapterTitleHindi: "ध्यान योग",
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
    categories: ["mental-health", "discipline", "meditation"]
  },
  {
    id: "BG_9_22",
    chapter: 9, verse: 22,
    chapterTitle: "Raja Vidya Yoga", chapterTitleHindi: "राज विद्या योग",
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
    transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    hindi: "जो भक्तजन अनन्य भाव से मेरा चिंतन करते हुए मेरी उपासना करते हैं, उन नित्य-युक्त भक्तों का योगक्षेम मैं स्वयं वहन करता हूं।",
    english: "For those who always think of Me with devotion, giving up all other occupations, I carry what they lack and preserve what they have.",
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
    context: "Krishna makes a profound promise to His devoted seekers — that He personally attends to their needs.",
    explanation: "This is one of the most comforting verses in the Gita. The Divine promises to take care of those who sincerely walk the spiritual path. This isn't about inaction — it's about trust that emerges from deep alignment.",
    lifeApplication: "When you feel alone and unsupported — when it seems no one is watching out for you — remember this promise. Align your actions with your highest values. Trust that when you walk in dharma, you are held. Then act. Then release.",
    tags: ["faith", "divine", "trust", "devotion", "support"],
    moods: ["lonely", "hopeless", "abandoned", "faithless"],
    categories: ["spirituality", "faith", "mental-health"]
  },
  {
    id: "BG_2_62",
    chapter: 2, verse: 62,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥",
    transliteration: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
    hindi: "विषयों का चिंतन करने वाले पुरुष की उनमें आसक्ति उत्पन्न हो जाती है। आसक्ति से कामना उत्पन्न होती है और कामना से क्रोध उत्पन्न होता है।",
    english: "While contemplating objects of the senses, a person develops attachment to them, and from attachment desire is born, and from desire comes anger.",
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
    context: "Krishna explains the psychological chain reaction that leads to downfall — from thought to attachment to desire to anger.",
    explanation: "This describes a universal chain: Focus on something → Attachment forms → Unfulfilled desire → Anger. Understanding this chain gives us the power to intervene early — at the thought level.",
    lifeApplication: "Notice what you obsessively think about. Does it lead to craving that makes you angry when unfulfilled? Practice redirecting attention early. When you catch yourself fantasizing unhealthily, gently redirect to your purpose.",
    tags: ["anger", "desire", "attachment", "mind", "control"],
    moods: ["angry", "craving", "addicted", "obsessed"],
    categories: ["mental-health", "relationships", "discipline"]
  },
  {
    id: "BG_12_13",
    chapter: 12, verse: 13,
    chapterTitle: "Bhakti Yoga", chapterTitleHindi: "भक्ति योग",
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
    transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    hindi: "जो सब प्राणियों से द्वेष नहीं करता, जो मित्रवत और दयालु है, जो ममता और अहंकार से रहित है, जो सुख-दुख में समान रहता है, जो क्षमाशील है — वह मुझे प्रिय है।",
    english: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor, who is free from ego, equable in both happiness and distress, forgiving — such a person is very dear to Me.",
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
    context: "Krishna describes the qualities of one who is dearest to Him — the true Bhakta.",
    explanation: "The divine signature is compassion without ego. These qualities — friendliness, forgiveness, equanimity — are the marks of a truly evolved human being. They are also the antidote to our deepest social wounds.",
    lifeApplication: "Choose one quality from this verse to cultivate this week. Perhaps forgiveness — write a letter (you don't have to send it) to someone you need to forgive. Or practice seeing every person you meet as a friend. Watch how your world transforms.",
    tags: ["compassion", "forgiveness", "ego", "kindness", "equanimity"],
    moods: ["angry", "resentful", "proud", "bitter"],
    categories: ["relationships", "spirituality", "mental-health"]
  },
  {
    id: "BG_18_66",
    chapter: 18, verse: 66,
    chapterTitle: "Moksha Yoga", chapterTitleHindi: "मोक्ष योग",
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    hindi: "सब धर्मों को त्यागकर केवल मेरी शरण में आओ। मैं तुम्हें सब पापों से मुक्त कर दूंगा। शोक मत करो।",
    english: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
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
    context: "The final instruction of the Gita — Krishna's ultimate promise to Arjuna at the end of the discourse.",
    explanation: "After teaching every path — karma, jnana, bhakti — Krishna offers the ultimate distillation: full surrender. Not passive resignation, but the deepest active trust. Release the ego's control and merge with the divine current.",
    lifeApplication: "There are moments in life when we must simply surrender — not give up, but let go of our limited ego's need to control. After you've done your absolute best, say: 'I trust the larger intelligence of life.' This brings the deepest peace.",
    tags: ["surrender", "faith", "liberation", "trust", "divine"],
    moods: ["exhausted", "overwhelmed", "hopeless", "burdened"],
    categories: ["spirituality", "mental-health", "faith"]
  },
  {
    id: "BG_3_19",
    chapter: 3, verse: 19,
    chapterTitle: "Karma Yoga", chapterTitleHindi: "कर्म योग",
    sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥",
    transliteration: "tasmād asaktaḥ satataṁ kāryaṁ karma samācara\nasakto hy ācaran karma param āpnoti pūruṣaḥ",
    hindi: "इसलिए तुम सदा आसक्ति रहित होकर कर्तव्य कर्म का अनुष्ठान करो, क्योंकि आसक्तिरहित होकर कर्म करने वाला मनुष्य परमात्मा को प्राप्त होता है।",
    english: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.",
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
    context: "Krishna explains the practical application of Karma Yoga — performing duty without attachment.",
    explanation: "Detachment doesn't mean indifference. It means full engagement without ego-investment in the outcome. The work itself becomes worship. This is the secret to excellence without burnout.",
    lifeApplication: "Today, pick your most important task and perform it as an offering. Don't check for validation while working. Don't count results. Just do the work fully, cleanly, completely. Notice how your energy feels different.",
    tags: ["karma", "duty", "detachment", "work", "excellence"],
    moods: ["unmotivated", "burnt-out", "anxious"],
    categories: ["career", "productivity", "discipline"]
  },
  {
    id: "BG_2_3",
    chapter: 2, verse: 3,
    chapterTitle: "Sankhya Yoga", chapterTitleHindi: "सांख्य योग",
    sanskrit: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते ।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप ॥",
    transliteration: "klaibyaṁ mā sma gamaḥ pārtha naitat tvayy upapadyate\nkṣudraṁ hṛdaya-daurbhalyaṁ tyaktvottiṣṭha parantapa",
    hindi: "हे पार्थ! नपुंसकता को मत प्राप्त हो — यह तुम्हें शोभा नहीं देती। हे परन्तप! हृदय की इस तुच्छ दुर्बलता को त्यागकर खड़े हो जाओ।",
    english: "O Arjuna, do not yield to this degrading impotence. It does not become you. Give up such petty weakness of heart and arise!",
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
    context: "Krishna sees Arjuna overcome by grief and compassion at the start of battle, and calls him to stand.",
    explanation: "Sometimes the most loving thing is a firm call to rise. When we are overwhelmed by emotions, we need clarity, not just comfort. Krishna's words cut through Arjuna's confusion with love and directness.",
    lifeApplication: "If you've been putting off something important due to fear or emotional overwhelm — this is your call to arise. Write down what you're avoiding. Take one small action toward it today. The first step breaks the paralysis.",
    tags: ["courage", "fear", "action", "strength", "motivation"],
    moods: ["paralyzed", "fearful", "avoidant", "depressed"],
    categories: ["career", "mental-health", "discipline", "self-improvement"]
  },
  {
    id: "BG_5_22",
    chapter: 5, verse: 22,
    chapterTitle: "Karma Sanyasa Yoga", chapterTitleHindi: "कर्म संन्यास योग",
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
    categories: ["mental-health", "discipline", "self-improvement"]
  },
  {
    id: "BG_13_8",
    chapter: 13, verse: 8,
    chapterTitle: "Kshetra-Kshetrajna Yoga", chapterTitleHindi: "क्षेत्र-क्षेत्रज्ञ योग",
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
    categories: ["self-improvement", "spirituality", "relationships"]
  },
  {
    id: "BG_17_15",
    chapter: 17, verse: 15,
    chapterTitle: "Shraddha Traya Vibhaga Yoga", chapterTitleHindi: "श्रद्धात्रय विभाग योग",
    sanskrit: "अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत् ।\nस्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥",
    transliteration: "anudvega-karaṁ vākyaṁ satyaṁ priya-hitaṁ ca yat\nsvādhyāyābhyasanaṁ caiva vāṅ-mayaṁ tapa ucyate",
    hindi: "जो वाणी उद्वेग न करने वाली, सत्य, प्रिय और हितकारक है तथा स्वाध्याय-अभ्यास — यही वाणी का तप कहलाता है।",
    english: "Truthful words that are not distressing to others, that are beneficial, pleasing, and the practice of studying scriptures — these constitute the austerity of speech.",
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
    context: "Krishna describes the three types of austerity — of body, speech, and mind. This verse covers speech.",
    explanation: "The discipline of speech is profound: speak truth, but make it kind. Speak kindness, but make it true. And make it beneficial — not just pleasing lies or harsh truths. The Gita calls this mastery of speech a form of tapas (spiritual practice).",
    lifeApplication: "Before speaking today, run your words through three filters: Is it true? Is it kind? Is it helpful? You don't need to say everything true that isn't kind. Silence is also noble. Practice pausing before responding in difficult conversations.",
    tags: ["speech", "truth", "kindness", "communication", "discipline"],
    moods: ["angry", "reactive", "frustrated"],
    categories: ["relationships", "discipline", "self-improvement"]
  },
  {
    id: "BG_18_78",
    chapter: 18, verse: 78,
    chapterTitle: "Moksha Yoga", chapterTitleHindi: "मोक्ष योग",
    sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥",
    transliteration: "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ\ntatra śrīr vijayo bhūtir dhruvā nītir matir mama",
    hindi: "जहां योगेश्वर कृष्ण हैं और जहां धनुर्धारी अर्जुन हैं — वहीं श्री, विजय, विभूति और ध्रुव नीति है — ऐसा मेरा मत है।",
    english: "Wherever there is Krishna, the lord of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality.",
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
    context: "Sanjaya's closing words of the Gita — the final verse — expressing supreme optimism.",
    explanation: "When divine wisdom (Krishna) unites with dedicated human effort (Arjuna with bow), the result is inevitable victory, prosperity, and righteousness. This is the formula for success in any domain.",
    lifeApplication: "You are Arjuna — skilled, dedicated, willing to act. Krishna represents wisdom, divine guidance, higher principles. When you align your skill and effort with wisdom and virtue — success follows naturally. How are you cultivating both today?",
    tags: ["victory", "success", "faith", "wisdom", "action"],
    moods: ["hopeless", "defeated", "unmotivated"],
    categories: ["career", "faith", "motivation"]
  },
  {
    id: "BG_4_24",
    chapter: 4, verse: 24,
    chapterTitle: "Jnana Yoga", chapterTitleHindi: "ज्ञान योग",
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
    categories: ["spirituality", "career", "productivity"]
  },
  {
    id: "BG_11_33",
    chapter: 11, verse: 33,
    chapterTitle: "Vishwarupa Darshana Yoga", chapterTitleHindi: "विश्वरूपदर्शन योग",
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
    categories: ["career", "discipline", "motivation", "spirituality"]
  },
  {
    id: "BG_17_3",
    chapter: 17, verse: 3,
    chapterTitle: "Shraddha Traya Vibhaga Yoga", chapterTitleHindi: "श्रद्धात्रय विभाग योग",
    sanskrit: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत ।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ॥",
    transliteration: "sattvānurūpā sarvasya śraddhā bhavati bhārata\nśraddhā-mayo 'yaṁ puruṣo yo yac-chraddhaḥ sa eva saḥ",
    hindi: "हे भारत! सभी मनुष्यों की श्रद्धा उनके स्वभाव के अनुसार होती है। यह पुरुष श्रद्धामय है — जो जैसी श्रद्धा रखता है, वह वैसा ही है।",
    english: "O Arjuna, the faith of each person accords with his nature. A person is made of faith; what a person has faith in, that is what they are.",
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
    context: "Krishna explains that people's spiritual nature is revealed by what they deeply believe and trust.",
    explanation: "You are what you believe. Not what you say you believe, but what you act on. Your deepest faith — in love, in effort, in the divine, in yourself — shapes your entire reality and character.",
    lifeApplication: "Write down what you truly have faith in — not what you think you should believe, but what your actions reveal. Do you have faith in hard work? In kindness? In divine support? Then ask: is this faith serving your highest good?",
    tags: ["faith", "belief", "character", "identity", "nature"],
    moods: ["confused", "searching", "lost"],
    categories: ["spirituality", "self-improvement", "identity"]
  }
];

// ── Build the COMPLETE verse set ───────────────────────────
// Start from the full 700-verse base (BG_VERSES from data/gita-verses.js),
// then overlay the curated verses so their rich fields (explanation,
// lifeApplication, wordByWord, tags, moods, categories) are preserved.
const SHLOKAS = (function buildCompleteShlokas() {
  const base = (typeof BG_VERSES !== 'undefined' && Array.isArray(BG_VERSES)) ? BG_VERSES : [];
  const curatedById = {};
  CURATED_SHLOKAS.forEach(c => { curatedById[c.id] = c; });

  if (!base.length) {
    // Fallback: if the base failed to load, at least use the curated set.
    return CURATED_SHLOKAS.slice();
  }

  const merged = base.map(v => {
    const c = curatedById[v.id];
    // Curated fields win; base fills any gaps (e.g. translations).
    return c ? Object.assign({}, v, c) : v;
  });

  // Include any curated verse that isn't present in the base (safety net).
  base.forEach(v => { delete curatedById[v.id]; });
  Object.values(curatedById).forEach(c => merged.push(c));

  // Keep canonical order: chapter, then verse.
  merged.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
  return merged;
})();

// Chapters summary data
const CHAPTERS = [
  { num: 1, title: "Arjuna Vishada Yoga", hindi: "अर्जुन विषाद योग", summary: "The Distress of Arjuna", verses: 47, theme: "Arjuna's grief and confusion on the battlefield — the catalyst for the entire Gita teaching." },
  { num: 2, title: "Sankhya Yoga", hindi: "सांख्य योग", summary: "Transcendental Knowledge", verses: 72, theme: "Krishna introduces the eternal nature of the soul, Karma Yoga, and the ideal of equanimity." },
  { num: 3, title: "Karma Yoga", hindi: "कर्म योग", summary: "The Yoga of Action", verses: 43, theme: "Selfless action without attachment to results — the path of karma yoga for the active person." },
  { num: 4, title: "Jnana Yoga", hindi: "ज्ञान योग", summary: "The Yoga of Transcendental Knowledge", verses: 42, theme: "Divine wisdom, the nature of sacrifice, and how knowledge destroys all karma." },
  { num: 5, title: "Karma Sanyasa Yoga", hindi: "कर्म संन्यास योग", summary: "Action and Renunciation", verses: 29, theme: "The harmony between renunciation and action — both lead to the same liberation." },
  { num: 6, title: "Dhyana Yoga", hindi: "ध्यान योग", summary: "The Yoga of Meditation", verses: 47, theme: "Practical guidance on meditation, mind control, and achieving inner steadiness." },
  { num: 7, title: "Jnana Vijnana Yoga", hindi: "ज्ञान विज्ञान योग", summary: "Knowledge of the Absolute", verses: 30, theme: "The full nature of divine reality and how to develop unshakeable devotion." },
  { num: 8, title: "Aksara Brahma Yoga", hindi: "अक्षर ब्रह्म योग", summary: "Attaining the Supreme", verses: 28, theme: "What happens at the time of death and how to attain the Supreme by constant remembrance." },
  { num: 9, title: "Raja Vidya Yoga", hindi: "राज विद्या योग", summary: "The Most Confidential Knowledge", verses: 34, theme: "The royal knowledge — devotion, surrender, and Krishna's promise to sustain His devotees." },
  { num: 10, title: "Vibhuti Yoga", hindi: "विभूति योग", summary: "The Opulences of the Absolute", verses: 42, theme: "Krishna reveals His divine manifestations in creation — the spark of divinity in all greatness." },
  { num: 11, title: "Vishwarupa Darshana Yoga", hindi: "विश्वरूपदर्शन योग", summary: "The Universal Form", verses: 55, theme: "The awesome revelation of Krishna's cosmic form — all of existence contained in one." },
  { num: 12, title: "Bhakti Yoga", hindi: "भक्ति योग", summary: "The Yoga of Devotion", verses: 20, theme: "The qualities of the ideal devotee — compassion, equanimity, freedom from ego." },
  { num: 13, title: "Kshetra-Kshetrajna Yoga", hindi: "क्षेत्र-क्षेत्रज्ञ योग", summary: "Nature, the Enjoyer, and Consciousness", verses: 35, theme: "The distinction between the material body and the eternal soul — field and its knower." },
  { num: 14, title: "Gunatraya Vibhaga Yoga", hindi: "गुणत्रय विभाग योग", summary: "The Three Modes of Nature", verses: 27, theme: "The three qualities (gunas) — sattva, rajas, tamas — and how to transcend them." },
  { num: 15, title: "Purushottama Yoga", hindi: "पुरुषोत्तम योग", summary: "The Yoga of the Supreme Person", verses: 20, theme: "The eternal Banyan tree of existence and the Supreme Person who transcends all." },
  { num: 16, title: "Daivasura Sampad Vibhaga Yoga", hindi: "दैवासुर सम्पद विभाग योग", summary: "The Divine and Demoniac Natures", verses: 24, theme: "Two paths of human nature — divine qualities lead to liberation, demoniac to bondage." },
  { num: 17, title: "Shraddha Traya Vibhaga Yoga", hindi: "श्रद्धात्रय विभाग योग", summary: "The Threefold Faith", verses: 28, theme: "How faith, food, sacrifice, and austerity differ according to the three gunas." },
  { num: 18, title: "Moksha Yoga", hindi: "मोक्ष योग", summary: "The Yoga of Liberation", verses: 78, theme: "The grand conclusion — renunciation, devotion, action, and the ultimate surrender to God." }
];

// Reconcile each chapter's verse count with the verses actually loaded,
// so the Explore chapter badges are always accurate (no gaps, no over-count).
CHAPTERS.forEach(ch => {
  const n = SHLOKAS.filter(s => s.chapter === ch.num).length;
  if (n) ch.verses = n;
});

// Categories for Situation-Based Wisdom
const WISDOM_CATEGORIES = [
  { id: "stress", label: "Stress & Anxiety", icon: "🌊", keywords: ["stress", "anxiety", "worried", "nervous", "panic", "overwhelmed"] },
  { id: "career", label: "Career & Work", icon: "💼", keywords: ["work", "career", "job", "success", "failure", "ambition"] },
  { id: "relationships", label: "Relationships", icon: "💛", keywords: ["love", "relationship", "family", "friends", "hurt", "trust"] },
  { id: "discipline", label: "Focus & Discipline", icon: "🎯", keywords: ["focus", "lazy", "procrastinate", "discipline", "habit", "routine"] },
  { id: "mental-health", label: "Inner Peace", icon: "🧘", keywords: ["peace", "sad", "depressed", "lonely", "empty", "lost"] },
  { id: "motivation", label: "Motivation", icon: "🔥", keywords: ["motivation", "inspired", "goal", "purpose", "meaning", "direction"] },
  { id: "spirituality", label: "Spirituality", icon: "✨", keywords: ["god", "divine", "faith", "soul", "meaning", "truth"] },
  { id: "self-improvement", label: "Self Growth", icon: "🌱", keywords: ["grow", "improve", "learn", "wisdom", "knowledge", "better"] }
];

// Mood options
const MOODS = [
  { id: "peaceful", label: "Peaceful", emoji: "😌", color: "#4CAF50" },
  { id: "happy", label: "Happy", emoji: "😊", color: "#8BC34A" },
  { id: "grateful", label: "Grateful", emoji: "🙏", color: "#FF9800" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#FF7043" },
  { id: "stressed", label: "Stressed", emoji: "😤", color: "#F44336" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#5C6BC0" },
  { id: "confused", label: "Confused", emoji: "😕", color: "#9C27B0" },
  { id: "motivated", label: "Motivated", emoji: "💪", color: "#2196F3" },
  { id: "lost", label: "Lost", emoji: "🌫️", color: "#607D8B" },
  { id: "angry", label: "Angry", emoji: "😠", color: "#E53935" }
];

// AI Guide responses mapped to keywords
const AI_RESPONSES = {
  stress: {
    reply: "The Gita reminds us that suffering arises from what we hold tightly. When stress grips us, it's often because we're attached to outcomes we cannot control. Here is Krishna's timeless guidance:",
    shlokas: ["BG_2_14", "BG_2_47", "BG_6_35"]
  },
  career: {
    reply: "Career confusion often stems from asking 'What will I get?' before asking 'What is my dharma — my true calling?' Krishna offers a liberating reframe:",
    shlokas: ["BG_2_47", "BG_3_19", "BG_18_78"]
  },
  lost: {
    reply: "Feeling lost is often the beginning of real inner searching. It's not a problem — it's a doorway. Krishna addresses this beautiful confusion:",
    shlokas: ["BG_6_5", "BG_4_38", "BG_17_3"]
  },
  anger: {
    reply: "Anger is a messenger — it reveals where we are attached and where our expectations are unmet. The Gita maps the entire psychology of anger:",
    shlokas: ["BG_2_62", "BG_12_13", "BG_17_15"]
  },
  fear: {
    reply: "Fear has two faces: sometimes it protects us, often it paralyzes us. The Gita's antidote to fear is not bravado — it's a deeper understanding of what is real:",
    shlokas: ["BG_2_20", "BG_2_3", "BG_9_22"]
  },
  relationship: {
    reply: "Relationships test us because we reveal our deepest attachments in them. The Gita teaches a profound path of love without possession:",
    shlokas: ["BG_12_13", "BG_17_15", "BG_2_47"]
  },
  sad: {
    reply: "Sadness is a sacred emotion — it means you've loved something deeply. The Gita holds space for grief while pointing toward a deeper ground of being:",
    shlokas: ["BG_2_14", "BG_2_20", "BG_9_22"]
  },
  discipline: {
    reply: "Discipline is not punishment — it's self-love in action. When we choose long-term growth over short-term comfort, we honor our true self. Krishna's teaching:",
    shlokas: ["BG_6_5", "BG_6_6", "BG_3_19"]
  },
  purpose: {
    reply: "Purpose is not found — it's uncovered through alignment between your nature, your skills, and the world's needs. The Gita offers a profound map:",
    shlokas: ["BG_4_38", "BG_3_21", "BG_18_78"]
  },
  default: {
    reply: "The Bhagavad Gita meets us exactly where we are. Whatever you're facing, there is wisdom here for you. Let me share what feels most relevant:",
    shlokas: ["BG_2_47", "BG_6_5", "BG_9_22"]
  }
};

// Get today's shloka (deterministic based on date).
// Rotate over the CURATED set so the daily verse always has rich teaching content.
function getTodayShloka() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const pool = (typeof CURATED_SHLOKAS !== 'undefined' && CURATED_SHLOKAS.length) ? CURATED_SHLOKAS : SHLOKAS;
  return pool[dayOfYear % pool.length];
}

// Get shloka by ID
function getShlokaById(id) {
  return SHLOKAS.find(s => s.id === id);
}

// Get shlokas by category
function getShlokasByCategory(category) {
  return SHLOKAS.filter(s => s.categories && s.categories.includes(category));
}

// Get shlokas by mood
function getShlokasByMood(mood) {
  return SHLOKAS.filter(s => s.moods && s.moods.includes(mood));
}

// Search shlokas (null-safe across the full 700-verse set)
function searchShlokas(query) {
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

// Get AI response for user query
function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("stress") || msg.includes("anxiety") || msg.includes("anxious") || msg.includes("worried") || msg.includes("nervous")) return AI_RESPONSES.stress;
  if (msg.includes("career") || msg.includes("job") || msg.includes("work") || msg.includes("profession")) return AI_RESPONSES.career;
  if (msg.includes("lost") || msg.includes("confused") || msg.includes("direction") || msg.includes("purpose") || msg.includes("meaning")) return AI_RESPONSES.lost;
  if (msg.includes("anger") || msg.includes("angry") || msg.includes("rage") || msg.includes("furious")) return AI_RESPONSES.anger;
  if (msg.includes("fear") || msg.includes("afraid") || msg.includes("scared") || msg.includes("phobia")) return AI_RESPONSES.fear;
  if (msg.includes("relationship") || msg.includes("love") || msg.includes("family") || msg.includes("friend") || msg.includes("partner")) return AI_RESPONSES.relationship;
  if (msg.includes("sad") || msg.includes("depress") || msg.includes("grief") || msg.includes("lonely") || msg.includes("hopeless")) return AI_RESPONSES.sad;
  if (msg.includes("discipline") || msg.includes("focus") || msg.includes("habit") || msg.includes("routine") || msg.includes("lazy") || msg.includes("procrastinat")) return AI_RESPONSES.discipline;
  if (msg.includes("purpose") || msg.includes("goal") || msg.includes("meaning") || msg.includes("mission")) return AI_RESPONSES.purpose;
  return AI_RESPONSES.default;
}
