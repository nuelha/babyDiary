
import { Mood, Vaccination, Milestone } from './types';
import { Smile, Meh, Frown, Sun, Thermometer } from 'lucide-react';

// Reordered: Excellent -> Good -> Fussy -> Bad -> Sick
export const MOOD_CONFIG = {
  [Mood.EXCELLENT]: { icon: Sun, color: 'text-green-500', bg: 'bg-green-100', barColor: 'bg-green-400', label: '최고' },
  [Mood.GOOD]: { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100', barColor: 'bg-yellow-400', label: '좋음' },
  [Mood.FUSSY]: { icon: Meh, color: 'text-orange-500', bg: 'bg-orange-100', barColor: 'bg-orange-400', label: '칭얼' },
  [Mood.BAD]: { icon: Frown, color: 'text-red-500', bg: 'bg-red-100', barColor: 'bg-red-400', label: '나쁨' },
  [Mood.SICK]: { icon: Thermometer, color: 'text-blue-500', bg: 'bg-blue-100', barColor: 'bg-blue-400', label: '아픔' },
};

// Expanded Korean Vaccination Schedule (Up to 12 years)
export const VACCINATIONS: Vaccination[] = [
  // 0개월
  { id: 'hepb1', disease: 'B형간염', doseNumber: 1, recommendedMonth: 0, description: '출생 직후' },
  { id: 'bcg', disease: '결핵(BCG)', doseNumber: 1, recommendedMonth: 0, description: '생후 4주 이내' },
  
  // 1개월
  { id: 'hepb2', disease: 'B형간염', doseNumber: 2, recommendedMonth: 1, description: '' },

  // 2개월
  { id: 'dtap1', disease: '디프테리아/파상풍/백일해', doseNumber: 1, recommendedMonth: 2, description: 'DTaP' },
  { id: 'ipv1', disease: '폴리오', doseNumber: 1, recommendedMonth: 2, description: 'IPV' },
  { id: 'hib1', disease: 'b형헤모필루스', doseNumber: 1, recommendedMonth: 2, description: '뇌수막염(Hib)' },
  { id: 'pcv1', disease: '폐렴구균', doseNumber: 1, recommendedMonth: 2, description: 'PCV' },
  { id: 'rv1', disease: '로타바이러스', doseNumber: 1, recommendedMonth: 2, description: 'RV' },

  // 4개월
  { id: 'dtap2', disease: '디프테리아/파상풍/백일해', doseNumber: 2, recommendedMonth: 4, description: 'DTaP' },
  { id: 'ipv2', disease: '폴리오', doseNumber: 2, recommendedMonth: 4, description: 'IPV' },
  { id: 'hib2', disease: 'b형헤모필루스', doseNumber: 2, recommendedMonth: 4, description: '뇌수막염(Hib)' },
  { id: 'pcv2', disease: '폐렴구균', doseNumber: 2, recommendedMonth: 4, description: 'PCV' },
  { id: 'rv2', disease: '로타바이러스', doseNumber: 2, recommendedMonth: 4, description: 'RV' },

  // 6개월
  { id: 'hepb3', disease: 'B형간염', doseNumber: 3, recommendedMonth: 6, description: '' },
  { id: 'dtap3', disease: '디프테리아/파상풍/백일해', doseNumber: 3, recommendedMonth: 6, description: 'DTaP' },
  { id: 'ipv3', disease: '폴리오', doseNumber: 3, recommendedMonth: 6, description: 'IPV' },
  { id: 'hib3', disease: 'b형헤모필루스', doseNumber: 3, recommendedMonth: 6, description: '뇌수막염(Hib)' },
  { id: 'pcv3', disease: '폐렴구균', doseNumber: 3, recommendedMonth: 6, description: 'PCV' },
  { id: 'rv3', disease: '로타바이러스', doseNumber: 3, recommendedMonth: 6, description: 'RV' },
  { id: 'flu', disease: '인플루엔자', doseNumber: 1, recommendedMonth: 6, description: '생후 6개월 이후 매년 접종' },

  // 12개월~15개월
  { id: 'hib4', disease: 'b형헤모필루스', doseNumber: 4, recommendedMonth: 12, description: '12~15개월 (뇌수막염)' },
  { id: 'pcv4', disease: '폐렴구균', doseNumber: 4, recommendedMonth: 12, description: '12~15개월' },
  { id: 'mmr1', disease: '홍역/유행성이하선염/풍진', doseNumber: 1, recommendedMonth: 12, description: 'MMR (12~15개월)' },
  { id: 'var', disease: '수두', doseNumber: 1, recommendedMonth: 12, description: '12~15개월' },
  { id: 'hepa1', disease: 'A형간염', doseNumber: 1, recommendedMonth: 12, description: '12~23개월' },
  { id: 'je1', disease: '일본뇌염', doseNumber: 1, recommendedMonth: 12, description: '12~23개월 (사백신 1차)' },
  { id: 'je2', disease: '일본뇌염', doseNumber: 2, recommendedMonth: 13, description: '1차 후 1개월 (사백신 2차)' },

  // 15~18개월
  { id: 'dtap4', disease: '디프테리아/파상풍/백일해', doseNumber: 4, recommendedMonth: 15, description: '15~18개월' },

  // 18개월~
  { id: 'hepa2', disease: 'A형간염', doseNumber: 2, recommendedMonth: 18, description: '1차 후 6개월 뒤' },

  // 만 2세 (24개월)
  { id: 'je3', disease: '일본뇌염', doseNumber: 3, recommendedMonth: 24, description: '24~35개월 (사백신 3차)' },

  // 만 4~6세 (48~72개월)
  { id: 'dtap5', disease: '디프테리아/파상풍/백일해', doseNumber: 5, recommendedMonth: 48, description: '만 4~6세' },
  { id: 'ipv4', disease: '폴리오', doseNumber: 4, recommendedMonth: 48, description: '만 4~6세' },
  { id: 'mmr2', disease: '홍역/유행성이하선염/풍진', doseNumber: 2, recommendedMonth: 48, description: '만 4~6세' },

  // 만 6세
  { id: 'je4', disease: '일본뇌염', doseNumber: 4, recommendedMonth: 72, description: '만 6세 (사백신 4차)' },

  // 만 11~12세 (132~144개월)
  { id: 'tdap6', disease: '파상풍/디프테리아/백일해', doseNumber: 6, recommendedMonth: 132, description: 'Tdap (만 11~12세)' },
  { id: 'je5', disease: '일본뇌염', doseNumber: 5, recommendedMonth: 144, description: '만 12세 (사백신 5차)' },
  { id: 'hpv1', disease: '사람유두종바이러스', doseNumber: 1, recommendedMonth: 144, description: '만 12세 여아 1차' },
];

/**
 * K-DST (Korean Developmental Screening Test) based Milestones
 * Reclassified into: gross_motor, fine_motor, cognitive, language, social, self_help
 */
export const MILESTONES: Milestone[] = [
  // -------------------------------------------------------------------------
  // 0~3개월 (초기 적응기)
  // -------------------------------------------------------------------------
  {
    id: "nb_eye_contact",
    title: "눈 맞추기",
    detail: "엄마 아빠와 눈을 맞추고 시선을 유지한다.",
    monthFrom: 0,
    monthTo: 1,
    category: "social",
    isCore: true,
  },
  {
    id: "nb_sound_react",
    title: "소리 반응",
    detail: "딸랑이 소리나 목소리에 반응하여 깜짝 놀라거나 쳐다본다.",
    monthFrom: 0,
    monthTo: 1,
    category: "cognitive", // Sensation/Cognition
    isCore: true,
  },
  {
    id: "nb_fist",
    title: "주먹 쥐기",
    detail: "손을 대부분 꽉 쥐고 있다가 서서히 펴기 시작한다.",
    monthFrom: 0,
    monthTo: 1,
    category: "fine_motor",
    isCore: false,
  },
  {
    id: "nb_cooing",
    title: "옹알이(쿠잉)",
    detail: "기분이 좋을 때 '아~', '우~' 같은 모음 소리를 낸다.",
    monthFrom: 2,
    monthTo: 3,
    category: "language",
    isCore: true,
  },
  {
    id: "nb_social_smile",
    title: "사회적 미소",
    detail: "얼르고 달래주면 방긋 웃는다 (배냇짓 아님).",
    monthFrom: 2,
    monthTo: 3,
    category: "social",
    isCore: true,
  },
  {
    id: "nb_head_lift_prone",
    title: "엎드려 고개 들기",
    detail: "엎드린 자세에서 고개를 45도 이상 들어 올린다.",
    monthFrom: 2,
    monthTo: 3,
    category: "gross_motor",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 4~5개월 (K-DST 4-5개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_4_neck_control",
    title: "목 가누기",
    detail: "세워 안았을 때 머리가 흔들리지 않고 꼿꼿하다.",
    monthFrom: 4,
    monthTo: 5,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_4_flip_one_way",
    title: "뒤집기(한 방향)",
    detail: "바로 누운 자세에서 엎드린 자세로 몸을 뒤집는다.",
    monthFrom: 4,
    monthTo: 5,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_4_grab_rattle",
    title: "딸랑이 잡기",
    detail: "손에 딸랑이를 쥐여주면 잠시 잡고 있는다.",
    monthFrom: 4,
    monthTo: 5,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_4_look_hands",
    title: "손 쳐다보기",
    detail: "자기 손을 흥미롭게 쳐다보며 논다 (손 주시).",
    monthFrom: 4,
    monthTo: 5,
    category: "cognitive",
    isCore: true,
  },
  {
    id: "kdst_4_laugh_aloud",
    title: "소리 내어 웃기",
    detail: "기분이 좋을 때 큰 소리로 웃는다.",
    monthFrom: 4,
    monthTo: 5,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_4_babble_loud",
    title: "큰 소리 옹알이",
    detail: "높은 소리로 '꺄아' 소리를 지르거나 다양한 옹알이를 한다.",
    monthFrom: 4,
    monthTo: 5,
    category: "language",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 6~7개월 (K-DST 6-7개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_6_sit_support",
    title: "혼자 앉아 버티기",
    detail: "잠깐 동안 손을 짚지 않고 혼자 앉아 있는다.",
    monthFrom: 6,
    monthTo: 7,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_4_neck_control"
  },
  {
    id: "kdst_6_flip_both",
    title: "배밀이/자유 뒤집기",
    detail: "양방향으로 자유롭게 뒤집거나 배밀이를 시도한다.",
    monthFrom: 6,
    monthTo: 7,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_4_flip_one_way"
  },
  {
    id: "kdst_6_reach_grasp",
    title: "손 뻗어 잡기",
    detail: "원하는 물건을 보고 손을 뻗어서 잡는다.",
    monthFrom: 6,
    monthTo: 7,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_6_transfer_hand",
    title: "손 바꿔 쥐기",
    detail: "장난감을 한 손에서 다른 손으로 옮겨 잡는다.",
    monthFrom: 6,
    monthTo: 7,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_6_stranger",
    title: "낯가림",
    detail: "낯선 사람을 보면 울거나 피하려는 반응을 보인다.",
    monthFrom: 6,
    monthTo: 7,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_6_turn_to_sound",
    title: "소리 나는 쪽 보기",
    detail: "작은 소리가 나도 고개를 돌려 정확히 찾는다.",
    monthFrom: 6,
    monthTo: 7,
    category: "cognitive",
    isCore: true,
  },
  {
    id: "kdst_6_eat_cookie",
    title: "과자 혼자 먹기",
    detail: "아기 과자나 떡뻥을 혼자 쥐고 먹는다.",
    monthFrom: 6,
    monthTo: 7,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 8~9개월 (K-DST 8-9개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_8_sit_alone",
    title: "안정되게 앉기",
    detail: "도움 없이 혼자 앉아서 장난감을 가지고 논다.",
    monthFrom: 8,
    monthTo: 9,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_6_sit_support"
  },
  {
    id: "kdst_8_crawl",
    title: "네 발 기기",
    detail: "배를 들고 무릎과 손으로 기어 다닌다.",
    monthFrom: 8,
    monthTo: 9,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_8_pull_stand",
    title: "붙잡고 일어서기",
    detail: "가구나 사람을 잡고 스스로 일어선다.",
    monthFrom: 8,
    monthTo: 9,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_8_clap_hands",
    title: "짝짜꿍/곤지곤지",
    detail: "짝짜꿍, 곤지곤지 같은 손동작을 따라 한다.",
    monthFrom: 8,
    monthTo: 9,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_8_syllables",
    title: "음절 말하기",
    detail: "'마마', '바바', '다다' 같은 소리를 반복해서 낸다.",
    monthFrom: 8,
    monthTo: 9,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_8_pick_small",
    title: "작은 물건 잡기(갈퀴)",
    detail: "손가락 전체를 긁어 모으듯 작은 과자 등을 잡는다.",
    monthFrom: 8,
    monthTo: 9,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_8_feed_self",
    title: "혼자 집어 먹기",
    detail: "작게 자른 핑거푸드를 손가락으로 집어 입에 넣는다.",
    monthFrom: 8,
    monthTo: 9,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 10~11개월 (K-DST 10-11개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_10_cruise",
    title: "가구 잡고 걷기",
    detail: "가구나 벽을 잡고 옆으로 발을 떼며 걷는다.",
    monthFrom: 10,
    monthTo: 11,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_8_pull_stand"
  },
  {
    id: "kdst_10_stand_alone",
    title: "잠시 혼자 서기",
    detail: "아무것도 잡지 않고 잠시(2~3초) 서 있는다.",
    monthFrom: 10,
    monthTo: 11,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_10_pincer_grasp",
    title: "집게 손가락 사용",
    detail: "엄지와 검지만 사용하여 작은 물건을 정확히 집는다.",
    monthFrom: 10,
    monthTo: 11,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_8_pick_small"
  },
  {
    id: "kdst_10_object_perm",
    title: "숨긴 물건 찾기",
    detail: "보는 앞에서 수건으로 장난감을 덮으면 들춰서 찾는다 (대상연속성).",
    monthFrom: 10,
    monthTo: 11,
    category: "cognitive",
    isCore: true,
  },
  {
    id: "kdst_10_understand_no",
    title: "안돼/금지 이해",
    detail: "'안돼'라고 말하면 하던 행동을 잠시 멈춘다.",
    monthFrom: 10,
    monthTo: 11,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_10_wave_bye",
    title: "빠이빠이 하기",
    detail: "헤어질 때 손을 흔들어 인사한다.",
    monthFrom: 10,
    monthTo: 11,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_10_cup_drink",
    title: "컵으로 마시기",
    detail: "도와주면 컵에 든 물을 마신다.",
    monthFrom: 10,
    monthTo: 11,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 12~13개월 (K-DST 12-13개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_12_walk_alone",
    title: "혼자 걷기",
    detail: "아무것도 잡지 않고 혼자서 몇 걸음 걷는다.",
    monthFrom: 12,
    monthTo: 13,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_10_stand_alone"
  },
  {
    id: "kdst_12_put_in_container",
    title: "통에 물건 넣기",
    detail: "작은 물건을 병이나 통 속에 집어 넣는다.",
    monthFrom: 12,
    monthTo: 13,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_10_pincer_grasp"
  },
  {
    id: "kdst_12_one_word",
    title: "의미 있는 단어",
    detail: "엄마, 아빠 외에 의미 있는 단어를 1개 이상 말한다.",
    monthFrom: 12,
    monthTo: 13,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_8_syllables"
  },
  {
    id: "kdst_12_point_want",
    title: "손가락으로 가리키기",
    detail: "원하는 것을 손가락으로 가리켜 표현한다 (포인팅).",
    monthFrom: 12,
    monthTo: 13,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_12_give_object",
    title: "물건 건네주기",
    detail: "'주세요' 하면 손에 든 물건을 건네준다.",
    monthFrom: 12,
    monthTo: 13,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_12_dressing_help",
    title: "옷 입을 때 협조",
    detail: "옷을 입힐 때 팔이나 다리를 뻗으며 도와준다.",
    monthFrom: 12,
    monthTo: 13,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 14~15개월 (K-DST 14-15개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_14_walk_well",
    title: "안정적으로 걷기",
    detail: "넘어지지 않고 꽤 먼 거리를 안정적으로 걷는다.",
    monthFrom: 14,
    monthTo: 15,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_12_walk_alone"
  },
  {
    id: "kdst_14_stack_blocks",
    title: "블록 2개 쌓기",
    detail: "블록(적목)을 2개 이상 쌓아 올린다.",
    monthFrom: 14,
    monthTo: 15,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_14_scribble",
    title: "낙서하기",
    detail: "크레파스나 연필을 쥐고 종이에 끄적거린다.",
    monthFrom: 14,
    monthTo: 15,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_14_vocab_increase",
    title: "단어 5개 이상",
    detail: "엄마, 아빠를 포함해 5개 이상의 단어를 말한다.",
    monthFrom: 14,
    monthTo: 15,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_12_one_word"
  },
  {
    id: "kdst_14_imitate_household",
    title: "집안일 흉내",
    detail: "청소하기, 전화 받기 등 어른의 행동을 모방한다.",
    monthFrom: 14,
    monthTo: 15,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_14_spoon_scoop",
    title: "숟가락질 시도",
    detail: "숟가락으로 음식을 떠서 입에 넣으려고 시도한다 (흘려도 됨).",
    monthFrom: 14,
    monthTo: 15,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 16~17개월 (K-DST 16-17개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_16_run_stiff",
    title: "빠르게 걷기/뛰기",
    detail: "빠르게 걷거나 서툴게 뛰는 동작을 한다.",
    monthFrom: 16,
    monthTo: 17,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_14_walk_well"
  },
  {
    id: "kdst_16_stack_3_blocks",
    title: "블록 3개 쌓기",
    detail: "블록을 3개 이상 쌓아 올린다.",
    monthFrom: 16,
    monthTo: 17,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_14_stack_blocks"
  },
  {
    id: "kdst_16_body_parts",
    title: "신체 부위 가리키기",
    detail: "'눈 어딨어?' 하면 자신의 눈이나 코를 가리킨다.",
    monthFrom: 16,
    monthTo: 17,
    category: "cognitive",
    isCore: true,
  },
  {
    id: "kdst_16_vocab_10",
    title: "단어 10개 이상",
    detail: "말할 수 있는 단어가 10개 이상 된다.",
    monthFrom: 16,
    monthTo: 17,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_14_vocab_increase"
  },
  {
    id: "kdst_16_show_toy",
    title: "장난감 보여주기",
    detail: "자기가 좋아하는 장난감을 남에게 보여준다.",
    monthFrom: 16,
    monthTo: 17,
    category: "social",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 18~19개월 (K-DST 18-19개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_18_stairs_held",
    title: "난간 잡고 계단 오르기",
    detail: "난간이나 손을 잡고 계단을 걸어 올라간다.",
    monthFrom: 18,
    monthTo: 19,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_18_kick_ball",
    title: "공 차기",
    detail: "서 있는 자세에서 공을 발로 찬다.",
    monthFrom: 18,
    monthTo: 19,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_18_draw_line",
    title: "선 긋기 모방",
    detail: "수직선을 그어주면 따라서 그린다.",
    monthFrom: 18,
    monthTo: 19,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_18_vocab_20",
    title: "어휘 폭발 (20단어+)",
    detail: "말할 수 있는 단어가 급격히 늘어 20개 이상이 된다.",
    monthFrom: 18,
    monthTo: 19,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_16_vocab_10"
  },
  {
    id: "kdst_18_two_word_phrases",
    title: "두 단어 연결 시도",
    detail: "'엄마 까까', '아빠 가' 처럼 단어를 붙이려 한다.",
    monthFrom: 18,
    monthTo: 19,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_18_remove_clothes",
    title: "옷 벗기",
    detail: "양말이나 모자, 간단한 옷을 스스로 벗는다.",
    monthFrom: 18,
    monthTo: 19,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 20~21개월 (K-DST 20-21개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_20_jump_place",
    title: "제자리 점프",
    detail: "두 발을 모아 제자리에서 깡충 뛴다.",
    monthFrom: 20,
    monthTo: 21,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_20_stack_5_blocks",
    title: "블록 5개 쌓기",
    detail: "블록을 5~6개 높이로 쌓는다.",
    monthFrom: 20,
    monthTo: 21,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_16_stack_3_blocks"
  },
  {
    id: "kdst_20_sentence_2words",
    title: "두 단어 문장 완성",
    detail: "주어와 서술어가 포함된 두 단어 문장을 명확히 말한다 (예: 이거 뭐야?, 물 줘).",
    monthFrom: 20,
    monthTo: 21,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_18_two_word_phrases"
  },
  {
    id: "kdst_20_parallel_play",
    title: "평행 놀이",
    detail: "또래 친구 옆에서 놀지만 같이 놀지는 않고 따로 논다.",
    monthFrom: 20,
    monthTo: 21,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_20_zip_unzip",
    title: "지퍼 내리기",
    detail: "옷이나 가방의 지퍼를 혼자서 내릴 수 있다.",
    monthFrom: 20,
    monthTo: 21,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 22~23개월 (K-DST 22-23개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_22_throw_overhand",
    title: "머리 위로 공 던지기",
    detail: "팔을 어깨 위로 들어 공을 앞으로 던진다.",
    monthFrom: 22,
    monthTo: 23,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_22_turn_page_one",
    title: "책장 한 장씩 넘기기",
    detail: "책장을 한 번에 한 장씩 넘긴다.",
    monthFrom: 22,
    monthTo: 23,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_22_follow_2step",
    title: "2단계 지시 수행",
    detail: "'기저귀 가져와서 휴지통에 버려' 처럼 연속된 지시를 따른다.",
    monthFrom: 22,
    monthTo: 23,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_22_spoon_proficient",
    title: "숟가락질 능숙",
    detail: "숟가락을 바르게 쥐고 흘리지 않고 잘 먹는다.",
    monthFrom: 22,
    monthTo: 23,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 24~26개월 (K-DST 24-26개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_24_stairs_alone",
    title: "계단 혼자 오르기",
    detail: "난간을 잡지 않고도 계단을 올라갈 수 있다.",
    monthFrom: 24,
    monthTo: 26,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_18_stairs_held"
  },
  {
    id: "kdst_24_vertical_line",
    title: "수직선 따라 그리기",
    detail: "수직선을 보여주면 비슷하게 위아래로 그린다.",
    monthFrom: 24,
    monthTo: 26,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_18_draw_line"
  },
  {
    id: "kdst_24_pronoun_me",
    title: "대명사 사용 (나, 내꺼)",
    detail: "자신을 '나', '내 것'으로 표현한다.",
    monthFrom: 24,
    monthTo: 26,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_24_wash_hands",
    title: "손 씻고 닦기",
    detail: "도움을 받아 비누로 손을 씻고 수건으로 닦는다.",
    monthFrom: 24,
    monthTo: 26,
    category: "self_help",
    isCore: true,
  },
  {
    id: "kdst_24_pants_off",
    title: "바지/팬티 벗기",
    detail: "고무줄 바지나 팬티를 혼자서 벗는다.",
    monthFrom: 24,
    monthTo: 26,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 27~29개월 (K-DST 27-29개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_27_jump_forward",
    title: "멀리 뛰기",
    detail: "제자리가 아닌 앞으로 깡충 뛰어 나간다.",
    monthFrom: 27,
    monthTo: 29,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_20_jump_place"
  },
  {
    id: "kdst_27_stack_8_blocks",
    title: "블록 8개 쌓기",
    detail: "작은 블록을 8개 이상 높이 쌓는다.",
    monthFrom: 27,
    monthTo: 29,
    category: "fine_motor",
    isCore: true,
  },
  {
    id: "kdst_27_prepositions",
    title: "위치어 이해 (위/아래)",
    detail: "'의자 위에', '상자 안에' 같은 위치 개념을 이해한다.",
    monthFrom: 27,
    monthTo: 29,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_27_short_sentence",
    title: "3단어 문장",
    detail: "3개 이상의 단어를 연결하여 문장으로 말한다.",
    monthFrom: 27,
    monthTo: 29,
    category: "language",
    isCore: true,
    prerequisiteId: "kdst_20_sentence_2words"
  },

  // -------------------------------------------------------------------------
  // 30~32개월 (K-DST 30-32개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_30_one_foot",
    title: "한 발 서기 (1초)",
    detail: "한 발로 1초 이상 중심을 잡고 서 있는다.",
    monthFrom: 30,
    monthTo: 32,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_30_draw_circle",
    title: "원 그리기",
    detail: "원을 보여주면 둥그렇게 따라 그린다 (찌그러져도 됨).",
    monthFrom: 30,
    monthTo: 32,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_24_vertical_line"
  },
  {
    id: "kdst_30_ask_why",
    title: "질문하기 (왜?)",
    detail: "'이게 뭐야?', '왜?' 같은 질문을 자주 한다.",
    monthFrom: 30,
    monthTo: 32,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_30_button",
    title: "큰 단추 끼우기",
    detail: "지름 2cm 정도의 큰 단추를 단춧구멍에 끼운다.",
    monthFrom: 30,
    monthTo: 32,
    category: "fine_motor", // Can be fine motor or self_help, usually fine motor skill in K-DST
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 33~35개월 (K-DST 33-35개월 구간)
  // -------------------------------------------------------------------------
  {
    id: "kdst_33_tricycle",
    title: "세발 자전거 타기",
    detail: "페달을 밟아서 세발 자전거를 앞으로 운전한다.",
    monthFrom: 33,
    monthTo: 35,
    category: "gross_motor",
    isCore: true,
  },
  {
    id: "kdst_33_role_play",
    title: "역할 놀이",
    detail: "의사 놀이, 소꿉 놀이 등 역할을 맡아 놀이를 한다.",
    monthFrom: 33,
    monthTo: 35,
    category: "social",
    isCore: true,
  },
  {
    id: "kdst_33_count_three",
    title: "수 개념 (셋까지)",
    detail: "물건을 하나, 둘, 셋까지 셀 수 있다.",
    monthFrom: 33,
    monthTo: 35,
    category: "cognitive",
    isCore: true,
  },
  {
    id: "kdst_33_coat_on",
    title: "점퍼/외투 입기",
    detail: "도와주지 않아도 혼자서 외투를 입는다.",
    monthFrom: 33,
    monthTo: 35,
    category: "self_help",
    isCore: true,
  },

  // -------------------------------------------------------------------------
  // 36개월 이상 (K-DST 36-41개월 및 이후 확장)
  // -------------------------------------------------------------------------
  {
    id: "kdst_36_stairs_alternate",
    title: "발 바꿔 계단 오르기",
    detail: "한 발에 한 계단씩 번갈아 가며 계단을 오른다.",
    monthFrom: 36,
    monthTo: 41,
    category: "gross_motor",
    isCore: true,
    prerequisiteId: "kdst_24_stairs_alone"
  },
  {
    id: "kdst_36_draw_cross",
    title: "십자가 그리기",
    detail: "십자가(+) 모양을 보고 따라 그린다.",
    monthFrom: 36,
    monthTo: 41,
    category: "fine_motor",
    isCore: true,
    prerequisiteId: "kdst_30_draw_circle"
  },
  {
    id: "kdst_36_full_sentence",
    title: "완전한 문장 구사",
    detail: "조사(~가, ~를)를 정확히 사용하여 문장을 말한다.",
    monthFrom: 36,
    monthTo: 41,
    category: "language",
    isCore: true,
  },
  {
    id: "kdst_36_toilet_train",
    title: "소변 가리기",
    detail: "낮 동안 기저귀 없이 화장실에서 소변을 본다.",
    monthFrom: 36,
    monthTo: 41,
    category: "self_help",
    isCore: true,
  },
  {
    id: "kdst_36_coop_play",
    title: "규칙 있는 놀이",
    detail: "순서를 지키거나 간단한 규칙이 있는 게임을 친구와 한다.",
    monthFrom: 36,
    monthTo: 41,
    category: "social",
    isCore: true,
  },
];
