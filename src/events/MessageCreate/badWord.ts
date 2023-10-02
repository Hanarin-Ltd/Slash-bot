import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { EmbedBuilder, TextChannel } from "discord.js";

const urlRegex = /(www|http:|https:)+[^\s]+[\w]/;

const forbiddenWords = [
    "시발", "개새끼","ㄴㄱㅁ","느금마","ㅂㅅ","ㅂㅈ","병 신","병1신",
    "씨8", "18아", "18놈", "18련", "t발", "ㅅㅍ", "ㅆㅍ", "18뇬",
    "sibal", "sival", "sibar", "sibak", "sipal", "siqk", "tlbal", "tlval", "tlbar", "tlbak", "tlpal", "tlqk",
    "시bal", "시val", "시bar", "시bak", "시pal", "시qk", "시bal", "시val", "시bar", "시bak", "시pal", "시qk",
    "si바", "si발", "si불", "si빨", "si팔", "tl바", "tl발", "tl불", "tl빨", "tl팔",
    "siba", "tlba", "siva", "tlva", "tlqkf", "10발련", "10발넘", "10발놈", "10발년", "tlqkd", "si8",
    "따까리", "장애새끼", "장애년", "찐따년", "싸가지", "창년", "썅년", "버러지", "고아년", "고아년", "개간년", "종간나", "도구년", "걸래년", "썅년", "씹년",
    "창녀", "머저리", "씹쓰래기", "씹쓰레기", "씹장생", "씹자식", "운지", "급식충", "틀딱충", "조센징", "매국노", "똥꼬충", "진지충", "듣보잡",
    "한남충","정신병자","중생아","돌팔이","김치녀","폰팔이","틀딱년","같은년","개돼중","쓰글년","썩을년","썩글년","씹할","거지새끼","거지쉐뀌",
    "거지쉑이","거지쎄끼","거지쒜리","걸래가튼","걸래넘","걸래년","걸래놈","걸레가튼","걸레년","그지새끼","그지새키","그지색","기집년","까진년",
    "깔보","난잡년","빡대가리","더러운년","돌아이","또라이",
    "시ㅂ", "시ㅏㄹ", "씨ㅂ", "씨ㅏㄹ", "ㅣ발", "ㅆ발", "ㅅ발", "ㅅㅂ", "ㅆㅂ", "ㅆ바", "ㅅ바",
    "시ㅂㅏ", "ㅅㅂㅏ", "시ㅏㄹ", "씨ㅏㄹ", "ㅅ불", "ㅆ불", "ㅅ쁠", "ㅆ뿔", "ㅆㅣ발", "ㅅㅟ발", "ㅅㅣㅂㅏ",
    "ㅣ바알", "ㅅ벌", "^^ㅣ벌",
    "시발", "씨발", "시봘", "씨봘", "씨바", "시바", "샤발", "씌발", "씹발", "시벌", "시팔", "싯팔",
    "씨빨", "씨랼", "씨파", "띠발", "띡발", "띸발", "싸발", "십발", "슈발", "야발", "씨불", "씨랄",
    "쉬발", "쓰발", "쓔발", "쌰발", "쉬발", "쒸발", "씨팔", "씨밝", "씨밯", "쑤발", "치발", "샤발",
    "발씨", "리발", "씨볼", "찌발", "씨비바라랄", "시바랄", "씨바라", "쒸팔", "쉬팔", "씨밮", "쒸밮", "시밮",
    "씨삐라", "ㅆ삐라", "씨벌", "슈벌", "시불", "시부렝", "씨부렝", "시부랭", "씨부랭", "시부랭", "발놈시", "뛰발",
    "뛰봘", "뜨발", "뜨벌", "띄발", "씨바알", "샤빨", "샤발", "스벌", "쓰벌", "신발련", "신발년", "신발놈", "띠발",
    "띠바랄", "시방", "씨방", "씨방새", "씨방세", "씨방쉐", "씨방쉑", "씨방쉣", "씨방쉬", "씨방시", "씨방시", "씨방싯", "씨방싸",
    "새끼", "쉐리", "쌔끼", "썌끼", "쎼끼", "쌬끼", "샠끼", "세끼", "샊", "쌖", "섺", "쎆", "십새", "새키", "씹색", "새까", "새꺄",
    "새뀌", "새끠", "새캬", "색꺄", "색끼","개같", "개가튼", "개쉑", "개스키", "개세끼", "개색히", "개가뇬", "개새기", "개쌔기", "개쌔끼", "쌖", "쎆", "새긔", "개소리", "개년", "개소리",
    "개드립", "개돼지", "개씹창", "개간나", "개스끼", "개섹기", "개자식", "개때꺄", "개때끼", "개발남아", "개샛끼", "개가든", "개가뜬", "개가턴", "개가툰", "개가튼",
    "개갇은", "개갈보", "개걸레", "개너마", "개너므", "개넌", "개넘", "개녀나", "개년", "개노마", "개노무새끼", "개논", "개놈", "개뇨나", "개뇬", "개뇸", "개뇽", "개눔",
    "개느마", "개늠", "개때꺄", "개때끼", "개떼끼", "개랙기", "개련", "개발남아", "개발뇬", "개색", "개색끼", "개샊", "개샛끼", "개샛키", "개샛킹", "개샛히", "개샜끼",
    "개생키", "개샠", "개샤끼", "개샤킥", "개샥", "개샹늠", "개세끼", "개세리", "개세키", "개섹히", "개섺", "개셃", "개셋키", "개셐", "개셰리", "개솩", "개쇄끼", "개쇅",
    "개쇅끼", "개쇅키", "개쇗", "개쇠리", "개쉐끼", "개쉐리", "개쉐키", "개쉑", "개쉑갸", "개쉑기", "개쉑꺄", "개쉑끼", "개쉑캬", "개쉑키", "개쉑히", "개쉢", "개쉨",
    "개쉬", "개쉬끼", "개쉬리", "개쉽", "개스끼", "개스키", "개습", "개습세", "개습쌔", "개싀기", "개싀끼", "개싀밸", "개싀킈", "개싀키", "개싏", "개싑창", "개싘",
    "개시끼", "개시퀴", "개시키", "개식기", "개식끼", "개식히", "개십새", "개십팔", "개싯기", "개싯끼", "개싯키", "개싴", "개쌍넘", "개쌍년", "개쌍놈", "개쌍눔",
    "개쌍늠", "개쌍연", "개쌍영", "개쌔꺄", "개쌔끼", "개쌕", "개쌕끼", "개쌰깨", "개썅", "개쎄", "개쎅", "개쎼키", "개쐐리", "개쒜", "개쒝", "개쒯", "개쒸", "개쒸빨놈",
    "개쒹기", "개쓉", "개쒹기", "개쓉", "개씀", "개씁", "개씌끼", "개씨끼", "개씨팕", "개씨팔", "개잡것", "개잡년", "개잡놈", "개잡뇬", "개젓", "개젖", "개젗", "개졋",
    "개졎", "개조또", "개조옷", "개족", "개좃", "개좆", "개좇", "개지랄", "개지럴", "개창년", "개허러", "개허벌년", "개호러", "개호로", "개후랄", "개후레", "개후로",
    "개후장", "걔섀끼", "걔잡넘", "걔잡년", "걔잡뇬", "게가튼", "게같은", "게너마", "게넘", "게년", "게노마", "게놈", "게뇨나", "게뇬", "게뇸", "게뇽", "게눔", "게늠",
    "게띠발넘", "게부랄", "게부알", "게새끼", "게새리", "게새키", "게색", "게색기", "게색끼", "게샛키", "게세꺄", "게자지", "게잡넘", "게잡년", "게잡뇬", "게젓",
    "게좆", "계같은뇬", "계뇬", "계뇽",
    "뒤져","뒈져","뒈진","뒈질","디져라","디진다","디질래", "ㅈㄴ","ㅈ나","존ㄴ","존맛","존나","존내","쫀나","존네","졸라",
    "꼽냐", "꼽니", "꼽나", "ㄴㄱㅁ", "ㄴ금마", "느금ㅁ", "ㄴㄱ마", "ㄴㄱ빠", "ㄴ금빠","ㄴ미", "느금", "누굼마", "느금마", "느그엄마", "늑엄마", "늑금마", "느그애미", "넉엄마", "느그부모", "느그애비", "느금빠", "느그메", "느그빠","니미씨","니미씹",
    "느그마","니엄마","엄창","엠창","니미럴","누굼마","느금","내미랄","내미럴","엄마없","아빠없", "니애미", "노애미", "노앰", "앰뒤련",
    "아버지도없는게", "애미도없는게", "애비도없는게", "어머니도없는게", "니애비", "노애비","애미없","애비없","애미뒤","애비뒤","니아빠","너에미","눼기미","뉘귀미"
    ,"뉘기미","뉘김이","뉘뮈","뉘미랄","뉘미럴","뉘미롤","뉘밀얼","뉘밀할","뉘어미","뉘에미","느검마","늬긔미","늬기미","니기미","니믜창","니미랄","니미럴"
    ,"니미쒸블","니미씨펄넘","니미좃","니밀할","니부랑","니뽕좃",
    "귀걸이아빠", "달창", "대깨문", "문재앙", "문죄앙", "문죄인", "문크예거", "훠훠훠", "문빠",
    "근혜어", "길라임", "나대블츠", "닭근혜", "댓통령", "레이디가카", "바쁜벌꿀", "수첩공주", "유신공주", "유체이탈화법", "칠푼이", "쿼터갓",
    "노시개", "노알라", "뇌사모", "뇌물현","응디시티", "반인반신", "박정희", "깜둥이", "흑형", "조센진", "짱개", "짱깨", "짱께", "짱게", "쪽바리", "쪽파리", "빨갱이", '니거', 'nigger',
    "보지", "버지물", "버짓물", "보짓", "ⓑⓞⓩⓘ",
    "bozi", "개보즤", "개보지", "버지벌렁벌렁", "보짖", "뵤즤", "봊이", "ja지", "ㅈㅈ빨", "자ㅈ", "ㅈ지빨", "자지", "자짓", "잦이",
    "sex", "s스", "x스", "se스", "ㅅㅅ", "s하고e싶다x", "ㅅㅔㅅㄱ", "ㅅㅔㄱ스", "섹ㅅ", "ㅅ스", "세ㄱㅅ", "ㅅㅔㄱㅅ", 
    "섹스", "섻", "쉑스", "섿스", "섹그", "야스", "색스", "셱스", "섁스", "세엑스", "썩스", "섹수", "섹파", "섹하자", "쉐스", "쉑스", "쉐엑스", "색수", "세엑수우", "섹하고",
    "섹하구", "섹하자", "섹하장", "섹하쟈", "섹한번", "꼬3", "꼬툭튀", "꼬톡튀", "씹하다", "불알", "부랄", "뽕알", "뿅알", "뿌랄", "뿔알", "개부달", "개부랄", "개부러럴", "개부럴", "개부뢀", "개부알", "개불알", "똘추",
    "오나홍", "오나홀", "ㅇㄴ홀", "텐가", "바이브레이터", "오ㄴ홀", "ㅇ나홀", "매춘부", "성노예", "자궁문신", "모유물", "로리물", "근친상간", "룸섹스", "원조교재", "속박플레이", "야플", "야외플레이",
    "딸딸이", "질싸", "안에사정", "자위남", "자위녀", "폰섹", "포르노", "폰세엑", "폰쉑", "폰쎅", "질내사정", "그룹섹", "남창", "男色", "누워라이년아",
    "누웠냐씨방새", "다리벌려", "대주까", "대줄년", "뒤로너어줘", "딸따뤼", "딸쳐", "떡쳐라", "막대쑤셔줘", "막대핥아줘", "먹고보니내딸", "먹고보니누나", "먹고보니딸",
    "먹고보니똥개", "먹고보니엄마", "먹고보니응아", "먹고보니재수", "먹고보니처제", "먹고보니형수", "몸뚱이줄께", "몸안에사정", "밖에다쌀께", "박고빼고",
    "배위에싸죠", "g스팟", "지스팟", "크리토리스", "클리토리스", "페니스", "애널", "젖까", "젖가튼", "젖나", "젖만", "ja위", "자위", "고자새끼", "고츄", "꺼추", "께세", "꼬추",
    "🖕🏻", "👌🏻👈🏻", "👉🏻👌🏻", "🤏🏻", "🖕", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿",":middle_finger:"
]

const event: EventListener<"messageCreate"> = {
  type: "messageCreate",
  async listener(bot, message) {
    if(message.author.bot) return;
    if(message.channelId === '1156160773316423741') return; // 무정부 챗 감지 X

    var isDetected = [false, ''];

    forbiddenWords.forEach((value, index, array)=>{
        message.content.search(value) === -1 ? null : isDetected = [true, forbiddenWords[index].toString()];
    });

    if(isDetected[0]) {
        console.log(isDetected)
        if(urlRegex.test(message.content)) return;
        const warn = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🚨 비속어 감지')
            .setFields({ name: '감지된 메시지', value: `\`\`\`${message.content}\`\`\``, inline: true}, { name: '유저', value: `<@${message.author.id}>`, inline: true})
            .setThumbnail(message.author.avatarURL())
            .setTimestamp();
        (bot.channels.cache.get('1157273552958013450') as TextChannel).send({ embeds: [warn] });

        await prisma.badWord.create({
            data: {
                userId: message.author.id,
                message: `욕 사용 - ${message.content}`
            }
        });

        await prisma.badWord.findMany({
            where: {
                userId: message.author.id
            }
        }).then(async (data) => {
            await message.delete()
            if(data.length < 3) {
                const warn = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('🚨 제재 내역 : 경고')
                    .setDescription('아직은 제재 기록이 적어 제재는 드리지 않았지만 다음번에 적발시에는 제재가 적용될수 있습니다!\n\n**좋은 커뮤니티 조성을 위해 비속어를 사용을 자제해주세요!**')
                    .setFields({ name: '메시지', value: `\`\`\`${message.content}\`\`\``}, { name: '감지된 단어', value: `\`\`\`${isDetected[1]}\`\`\``})
                    .setFooter({ text: '🚨 SLASH 커뮤니티 제공' })
                    .setTimestamp();
                message.author.send({ embeds: [warn]})
            } else {
                const warn = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🚨 제재 내역 : 제재 적용')
                    .setAuthor({name: '제재 1회'})
                    .setDescription('SLASH 커뮤니티에서 자주 경고를 받으신 걸로 보입니다\n**타임아웃이 지급되었습니다** \n\n좋은 커뮤니티 조성을 위해 비속어를 사용을 자제해주세요!')
                    .setFields({ name: '감지된 메시지', value: `\`\`\`${message.content}\`\`\``}, { name: '감지된 단어', value: `\`\`\`${isDetected[1]}\`\`\``}, { name: '제재 내역', value: '**타임아웃 1분**'})
                    .setFooter({ text: '🚨 SLASH 커뮤니티 제공' })
                    .setTimestamp();
                message.guild?.members.cache.get(message.author.id)?.timeout(60 * 1000 * 3).catch(() => {
                    console.log(`[ ❌ ] 타임아웃 적용중 오류가 발생했습니다 | 유저: ${message.author.displayName}(${message.author.id})`)
                });
                message.author.send({ embeds: [warn]})
            }
        })
    }
  },
};

export default event;