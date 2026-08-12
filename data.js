const lessons = [
    {
        lessonNumber: 1,
        title: "People & Identity",
        characters: [
            { symbol: "我", pinyin: "wǒ", meaning: "I / me" },
            { symbol: "你", pinyin: "nǐ", meaning: "you" },
            { symbol: "他", pinyin: "tā", meaning: "he / him" },
            { symbol: "人", pinyin: "rén", meaning: "person" },
            { symbol: "是", pinyin: "shì", meaning: "to be / is" }
        ]
    },
    {
        lessonNumber: 2,
        title: "Basic Description",
        characters: [
            { symbol: "不", pinyin: "bù", meaning: "not / no" },
            { symbol: "有", pinyin: "yǒu", meaning: "have / there is" },
            { symbol: "在", pinyin: "zài", meaning: "at / in" },
            { symbol: "大", pinyin: "dà", meaning: "big / large" },
            { symbol: "小", pinyin: "xiǎo", meaning: "small" }
        ]
    },
    {
        lessonNumber: 3,
        title: "Here, There & Direction",
        characters: [
            { symbol: "这", pinyin: "zhè", meaning: "this" },
            { symbol: "那", pinyin: "nà", meaning: "that" },
            { symbol: "好", pinyin: "hǎo", meaning: "good" },
            { symbol: "上", pinyin: "shàng", meaning: "up / on / above" },
            { symbol: "下", pinyin: "xià", meaning: "down / below" }
        ]
    },
    {
        lessonNumber: 4,
        title: "Movement & Learning",
        characters: [
            { symbol: "来", pinyin: "lái", meaning: "come" },
            { symbol: "去", pinyin: "qù", meaning: "go" },
            { symbol: "学", pinyin: "xué", meaning: "learn / study" },
            { symbol: "生", pinyin: "shēng", meaning: "life / birth" },
            { symbol: "中", pinyin: "zhōng", meaning: "middle / central" }
        ]
    },
    {
        lessonNumber: 5,
        title: "Country, Home & Daily Life",
        characters: [
            { symbol: "国", pinyin: "guó", meaning: "country" },
            { symbol: "家", pinyin: "jiā", meaning: "home / family" },
            { symbol: "水", pinyin: "shuǐ", meaning: "water" },
            { symbol: "吃", pinyin: "chī", meaning: "eat" },
            { symbol: "日", pinyin: "rì", meaning: "day / sun" }
        ]
    },
    {
        lessonNumber: 6,
        title: "Questions & Possession",
        characters: [
            { symbol: "的", pinyin: "de", meaning: "possessive / descriptive particle" },
            { symbol: "吗", pinyin: "ma", meaning: "yes-no question particle" },
            { symbol: "什", pinyin: "shén", meaning: "what (used in 什么)" },
            { symbol: "么", pinyin: "me", meaning: "suffix used in 什么" },
            { symbol: "谁", pinyin: "shéi", meaning: "who" }
        ]
    },
    {
        lessonNumber: 7,
        title: "Numbers & Quantity",
        characters: [
            { symbol: "一", pinyin: "yī", meaning: "one" },
            { symbol: "二", pinyin: "èr", meaning: "two" },
            { symbol: "三", pinyin: "sān", meaning: "three" },
            { symbol: "个", pinyin: "gè", meaning: "general measure word" },
            { symbol: "多", pinyin: "duō", meaning: "many / much" }
        ]
    },
    {
        lessonNumber: 8,
        title: "Time & People",
        characters: [
            { symbol: "今", pinyin: "jīn", meaning: "today / present (in compounds)" },
            { symbol: "天", pinyin: "tiān", meaning: "day / sky" },
            { symbol: "年", pinyin: "nián", meaning: "year" },
            { symbol: "女", pinyin: "nǚ", meaning: "female / woman" },
            { symbol: "男", pinyin: "nán", meaning: "male / man" }
        ]
    },
    {
        lessonNumber: 9,
        title: "Communication & Ability",
        characters: [
            { symbol: "说", pinyin: "shuō", meaning: "speak / say" },
            { symbol: "看", pinyin: "kàn", meaning: "look / watch / read" },
            { symbol: "听", pinyin: "tīng", meaning: "listen / hear" },
            { symbol: "会", pinyin: "huì", meaning: "can / know how to" },
            { symbol: "想", pinyin: "xiǎng", meaning: "want / think / miss" }
        ]
    },
    {
        lessonNumber: 10,
        title: "Everyday Actions",
        characters: [
            { symbol: "要", pinyin: "yào", meaning: "want / need" },
            { symbol: "能", pinyin: "néng", meaning: "can / be able to" },
            { symbol: "做", pinyin: "zuò", meaning: "do / make" },
            { symbol: "走", pinyin: "zǒu", meaning: "walk / leave" },
            { symbol: "回", pinyin: "huí", meaning: "return / go back" }
        ]
    }
];

const wordLessons = [
    {
        lessonNumber: 1,
        title: "Words from Lessons 1–2",
        requiresLesson: 2,
        words: [
            { word: "我有", pinyin: "wǒ yǒu", meaning: "I have" },
            { word: "你有", pinyin: "nǐ yǒu", meaning: "you have" },
            { word: "大人", pinyin: "dàrén", meaning: "adult" },
            { word: "不是", pinyin: "bú shì", meaning: "is not" },
            { word: "你是", pinyin: "nǐ shì", meaning: "you are" }
        ]
    },
    {
        lessonNumber: 2,
        title: "Description & Position",
        requiresLesson: 3,
        words: [
            { word: "好人", pinyin: "hǎorén", meaning: "good person" },
            { word: "大小", pinyin: "dàxiǎo", meaning: "size" },
            { word: "上下", pinyin: "shàngxià", meaning: "up and down / above and below" },
            { word: "这人", pinyin: "zhè rén", meaning: "this person" },
            { word: "那人", pinyin: "nà rén", meaning: "that person" }
        ]
    },
    {
        lessonNumber: 3,
        title: "Movement & Study",
        requiresLesson: 4,
        words: [
            { word: "学生", pinyin: "xuéshēng", meaning: "student" },
            { word: "上学", pinyin: "shàngxué", meaning: "go to school" },
            { word: "下来", pinyin: "xiàlái", meaning: "come down" },
            { word: "上来", pinyin: "shànglái", meaning: "come up" },
            { word: "下去", pinyin: "xiàqù", meaning: "go down / continue" }
        ]
    },
    {
        lessonNumber: 4,
        title: "Country & Home",
        requiresLesson: 5,
        words: [
            { word: "中国", pinyin: "Zhōngguó", meaning: "China" },
            { word: "国家", pinyin: "guójiā", meaning: "country / nation" },
            { word: "大家", pinyin: "dàjiā", meaning: "everyone" },
            { word: "人家", pinyin: "rénjiā", meaning: "other people / household" },
            { word: "生日", pinyin: "shēngrì", meaning: "birthday" }
        ]
    },
    {
        lessonNumber: 5,
        title: "Questions & Ownership",
        requiresLesson: 6,
        words: [
            { word: "什么", pinyin: "shénme", meaning: "what" },
            { word: "我的", pinyin: "wǒ de", meaning: "mine / my" },
            { word: "你的", pinyin: "nǐ de", meaning: "yours / your" },
            { word: "谁的", pinyin: "shéi de", meaning: "whose" },
            { word: "是吗", pinyin: "shì ma", meaning: "is that so? / really?" }
        ]
    },
    {
        lessonNumber: 6,
        title: "Counting & Quantity",
        requiresLesson: 7,
        words: [
            { word: "一个", pinyin: "yí ge", meaning: "one (item/person)" },
            { word: "两个", pinyin: "liǎng ge", meaning: "two (items/people)" },
            { word: "三个", pinyin: "sān ge", meaning: "three (items/people)" },
            { word: "多人", pinyin: "duō rén", meaning: "many people" },
            { word: "多大", pinyin: "duō dà", meaning: "how big / how old" }
        ]
    },
    {
        lessonNumber: 7,
        title: "Time & People",
        requiresLesson: 8,
        words: [
            { word: "今天", pinyin: "jīntiān", meaning: "today" },
            { word: "今年", pinyin: "jīnnián", meaning: "this year" },
            { word: "女人", pinyin: "nǚrén", meaning: "woman" },
            { word: "男人", pinyin: "nánrén", meaning: "man" },
            { word: "一天", pinyin: "yì tiān", meaning: "one day" }
        ]
    },
    {
        lessonNumber: 8,
        title: "Speaking & Understanding",
        requiresLesson: 9,
        words: [
            { word: "会说", pinyin: "huì shuō", meaning: "can speak" },
            { word: "想看", pinyin: "xiǎng kàn", meaning: "want to see / watch" },
            { word: "想听", pinyin: "xiǎng tīng", meaning: "want to listen" },
            { word: "说什么", pinyin: "shuō shénme", meaning: "say what / what are you saying" },
            { word: "会听", pinyin: "huì tīng", meaning: "can understand by listening" }
        ]
    },
    {
        lessonNumber: 9,
        title: "Needs & Actions",
        requiresLesson: 10,
        words: [
            { word: "想要", pinyin: "xiǎng yào", meaning: "want" },
            { word: "能做", pinyin: "néng zuò", meaning: "can do" },
            { word: "回家", pinyin: "huí jiā", meaning: "go home / return home" },
            { word: "走回", pinyin: "zǒu huí", meaning: "walk back" },
            { word: "要回家", pinyin: "yào huí jiā", meaning: "need / want to go home" }
        ]
    }
];
