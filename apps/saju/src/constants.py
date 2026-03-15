"""Constants and templates for the saju app."""

SUPPORTED_YEAR_MIN = 1900
SUPPORTED_YEAR_MAX = 2050
MAX_OHANG_COUNT = 8

HEAVENLY_STEMS = ("갑", "을", "병", "정", "무", "기", "경", "신", "임", "계")
EARTHLY_BRANCHES = ("자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해")
OHANG_ORDER = ("목", "화", "토", "금", "수")

STEM_TO_HANJA = {
    "갑": "甲",
    "을": "乙",
    "병": "丙",
    "정": "丁",
    "무": "戊",
    "기": "己",
    "경": "庚",
    "신": "辛",
    "임": "壬",
    "계": "癸",
}

BRANCH_TO_HANJA = {
    "자": "子",
    "축": "丑",
    "인": "寅",
    "묘": "卯",
    "진": "辰",
    "사": "巳",
    "오": "午",
    "미": "未",
    "신": "申",
    "유": "酉",
    "술": "戌",
    "해": "亥",
}

STEM_TO_OHANG = {
    "갑": "목",
    "을": "목",
    "병": "화",
    "정": "화",
    "무": "토",
    "기": "토",
    "경": "금",
    "신": "금",
    "임": "수",
    "계": "수",
}

BRANCH_TO_OHANG = {
    "인": "목",
    "묘": "목",
    "사": "화",
    "오": "화",
    "진": "토",
    "술": "토",
    "축": "토",
    "미": "토",
    "신": "금",
    "유": "금",
    "자": "수",
    "해": "수",
}

OHANG_COLORS = {
    "목": "#A8D5BA",
    "화": "#F4A9A8",
    "토": "#F5D89A",
    "금": "#E8D5A8",
    "수": "#A8C8E8",
}

OHANG_LABELS = {
    "목": "목(木)",
    "화": "화(火)",
    "토": "토(土)",
    "금": "금(金)",
    "수": "수(水)",
}

YEAR_CHOICES = tuple(range(SUPPORTED_YEAR_MIN, SUPPORTED_YEAR_MAX + 1))
MONTH_CHOICES = tuple(range(1, 13))
DAY_CHOICES = tuple(range(1, 32))

HOUR_CHOICES = (
    ("23~01시 (자시)", 23),
    ("01~03시 (축시)", 1),
    ("03~05시 (인시)", 3),
    ("05~07시 (묘시)", 5),
    ("07~09시 (진시)", 7),
    ("09~11시 (사시)", 9),
    ("11~13시 (오시)", 11),
    ("13~15시 (미시)", 13),
    ("15~17시 (신시)", 15),
    ("17~19시 (유시)", 17),
    ("19~21시 (술시)", 19),
    ("21~23시 (해시)", 21),
)

HOUR_VALUE_TO_BRANCH = {
    23: "자",
    1: "축",
    3: "인",
    5: "묘",
    7: "진",
    9: "사",
    11: "오",
    13: "미",
    15: "신",
    17: "유",
    19: "술",
    21: "해",
}

DAY_STEM_TO_HOUR_START = {
    "갑": "갑",
    "기": "갑",
    "을": "병",
    "경": "병",
    "병": "무",
    "신": "무",
    "정": "경",
    "임": "경",
    "무": "임",
    "계": "임",
}


def _build_siju_table() -> dict[str, dict[str, str]]:
    """Build the day-stem x hour-branch lookup table for hour pillars."""
    table: dict[str, dict[str, str]] = {}
    for day_stem, start_stem in DAY_STEM_TO_HOUR_START.items():
        start_index = HEAVENLY_STEMS.index(start_stem)
        table[day_stem] = {
            branch: f"{HEAVENLY_STEMS[(start_index + index) % len(HEAVENLY_STEMS)]}{branch}"
            for index, branch in enumerate(EARTHLY_BRANCHES)
        }
    return table


SIJU_TABLE = _build_siju_table()

INTERPRETATION_TEMPLATES = {
    "목": {
        "강": "목(木)의 기운이 강합니다. 성장, 시작, 확장을 상징하는 에너지가 많습니다.",
        "보통": "목(木)의 기운이 고르게 분포되어 있습니다.",
        "부족": "목(木)의 기운이 없습니다. 목은 성장과 시작을 상징합니다.",
    },
    "화": {
        "강": "화(火)의 기운이 강합니다. 열정, 표현, 밝음을 상징하는 에너지가 많습니다.",
        "보통": "화(火)의 기운이 고르게 분포되어 있습니다.",
        "부족": "화(火)의 기운이 없습니다. 화는 열정과 표현을 상징합니다.",
    },
    "토": {
        "강": "토(土)의 기운이 강합니다. 안정, 중재, 포용을 상징하는 에너지가 많습니다.",
        "보통": "토(土)의 기운이 고르게 분포되어 있습니다.",
        "부족": "토(土)의 기운이 없습니다. 토는 안정과 중재를 상징합니다.",
    },
    "금": {
        "강": "금(金)의 기운이 강합니다. 결단, 정리, 수렴을 상징하는 에너지가 많습니다.",
        "보통": "금(金)의 기운이 고르게 분포되어 있습니다.",
        "부족": "금(金)의 기운이 없습니다. 금은 결단과 정리를 상징합니다.",
    },
    "수": {
        "강": "수(水)의 기운이 강합니다. 지혜, 유연함, 흐름을 상징하는 에너지가 많습니다.",
        "보통": "수(水)의 기운이 고르게 분포되어 있습니다.",
        "부족": "수(水)의 기운이 없습니다. 수는 지혜와 유연함을 상징합니다.",
    },
}

APP_TITLE = "사주 팔자 분석기"
SUBMIT_BUTTON_LABEL = "분석하기"
YEAR_LABEL = "년"
MONTH_LABEL = "월"
DAY_LABEL = "일"
HOUR_LABEL = "시"

# 새로 추가된 항목: 성별
GENDER_LABEL = "성별"
GENDER_CHOICES = ("남", "여")

ERROR_SELECT_ALL = "모든 항목을 선택해주세요."
ERROR_INVALID_DATE = "존재하지 않는 날짜입니다."
ERROR_OUT_OF_RANGE = "지원 범위는 1900년~2050년입니다."

PRIVACY_NOTICE = (
    "입력된 생년월일시는 저장하지 않으며, 현재 화면 계산에만 사용됩니다."
)
RELIABILITY_NOTICE = (
    "본 서비스는 날짜 기준 계산을 사용합니다. "
    "절입조정 미적용으로 매월 4~8일경 출생자는 전통 만세력과 결과가 다를 수 있습니다."
)
