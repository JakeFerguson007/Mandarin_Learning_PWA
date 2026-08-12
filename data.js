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
    }
];
