"""Core calculation logic for the saju app."""

from __future__ import annotations

from datetime import date

try:
    from korean_lunar_calendar import KoreanLunarCalendar
except ImportError:  # pragma: no cover - runtime dependency check
    KoreanLunarCalendar = None

try:
    from .constants import (
        BRANCH_TO_OHANG,
        DAY_CHOICES,
        ERROR_INVALID_DATE,
        ERROR_OUT_OF_RANGE,
        HOUR_VALUE_TO_BRANCH,
        INTERPRETATION_TEMPLATES,
        MAX_OHANG_COUNT,
        OHANG_ORDER,
        SIJU_TABLE,
        STEM_TO_OHANG,
        SUPPORTED_YEAR_MAX,
        SUPPORTED_YEAR_MIN,
    )
except ImportError:  # pragma: no cover - direct script import fallback
    from constants import (
        BRANCH_TO_OHANG,
        DAY_CHOICES,
        ERROR_INVALID_DATE,
        ERROR_OUT_OF_RANGE,
        HOUR_VALUE_TO_BRANCH,
        INTERPRETATION_TEMPLATES,
        MAX_OHANG_COUNT,
        OHANG_ORDER,
        SIJU_TABLE,
        STEM_TO_OHANG,
        SUPPORTED_YEAR_MAX,
        SUPPORTED_YEAR_MIN,
    )


def _validate_date(year: int, month: int, day: int) -> None:
    """Validate the input date and supported range."""
    if year < SUPPORTED_YEAR_MIN or year > SUPPORTED_YEAR_MAX:
        raise ValueError(ERROR_OUT_OF_RANGE)
    if month not in range(1, 13) or day not in DAY_CHOICES:
        raise ValueError(ERROR_INVALID_DATE)
    try:
        date(year, month, day)
    except ValueError as error:
        raise ValueError(ERROR_INVALID_DATE) from error


def _get_calendar() -> "KoreanLunarCalendar":
    """Return a calendar instance or fail clearly when dependency is missing."""
    if KoreanLunarCalendar is None:
        raise RuntimeError("korean_lunar_calendar가 설치되어 있지 않습니다.")
    return KoreanLunarCalendar()


def _parse_gapja(gapja: str) -> dict[str, str]:
    """Parse the gapja string into year, month, and day pillars."""
    parts = gapja.split()
    if len(parts) != 3:
        raise ValueError("갑자 문자열 형식이 올바르지 않습니다.")
    year_ju, month_ju, day_ju = (part[:-1] for part in parts)
    return {"year": year_ju, "month": month_ju, "day": day_ju}


def _get_hour_branch(hour: int) -> str:
    """Map the selected hour value to its earthly branch."""
    try:
        return HOUR_VALUE_TO_BRANCH[hour]
    except KeyError as error:
        raise ValueError("지원하지 않는 시간 값입니다.") from error


def _get_hour_pillar(day_stem: str, hour: int) -> str:
    """Build the hour pillar from the day stem and selected hour."""
    hour_branch = _get_hour_branch(hour)
    try:
        return SIJU_TABLE[day_stem][hour_branch]
    except KeyError as error:
        raise ValueError("시주 계산에 필요한 일간 정보가 올바르지 않습니다.") from error


def get_saju(year: int, month: int, day: int, hour: int) -> dict[str, str]:
    """Return the four pillars for the given solar date and selected hour."""
    _validate_date(year, month, day)
    calendar = _get_calendar()
    if not calendar.setSolarDate(year, month, day):
        raise ValueError("지원하지 않는 날짜입니다.")
    pillars = _parse_gapja(calendar.getGapJaString())
    pillars["hour"] = _get_hour_pillar(pillars["day"][0], hour)
    return pillars


def get_ohang_count(saju: dict[str, str]) -> dict[str, int]:
    """Count the five elements across all eight characters of the four pillars."""
    counts = {element: 0 for element in OHANG_ORDER}
    for pillar in ("year", "month", "day", "hour"):
        try:
            stem, branch = saju[pillar]
        except KeyError as error:
            raise ValueError("사주 데이터에 필요한 기둥 정보가 없습니다.") from error
        except ValueError as error:
            raise ValueError("사주 데이터 형식이 올바르지 않습니다.") from error
        try:
            counts[STEM_TO_OHANG[stem]] += 1
            counts[BRANCH_TO_OHANG[branch]] += 1
        except KeyError as error:
            raise ValueError("사주 데이터의 천간 또는 지지 값이 올바르지 않습니다.") from error
    if sum(counts.values()) != MAX_OHANG_COUNT:
        raise ValueError("오행 개수 합계가 올바르지 않습니다.")
    return counts


def _get_level(count: int) -> str:
    """Map a count to its interpretation level."""
    if count >= 3:
        return "강"
    if count >= 1:
        return "보통"
    return "부족"


def get_interpretation(ohang_count: dict[str, int]) -> str:
    """Return the joined interpretation text for all five elements."""
    try:
        return "\n".join(
            INTERPRETATION_TEMPLATES[element][_get_level(ohang_count[element])]
            for element in OHANG_ORDER
        )
    except KeyError as error:
        raise ValueError("오행 해석에 필요한 값이 올바르지 않습니다.") from error
