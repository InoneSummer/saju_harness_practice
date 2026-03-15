"""Core logic tests for the saju app."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
VENDOR_PATH = ROOT / "apps" / "saju" / ".vendor"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(VENDOR_PATH) not in sys.path:
    sys.path.insert(0, str(VENDOR_PATH))

from apps.saju.src import saju


class GetSajuTest(unittest.TestCase):
    def test_known_sample_1990_01_01_23(self) -> None:
        result = saju.get_saju(1990, 1, 1, 23)
        self.assertEqual(
            result,
            {
                "year": "기사",
                "month": "정축",
                "day": "병인",
                "hour": "무자",
            },
        )

    def test_known_sample_2000_02_29_11(self) -> None:
        result = saju.get_saju(2000, 2, 29, 11)
        self.assertEqual(
            result,
            {
                "year": "경진",
                "month": "무인",
                "day": "정사",
                "hour": "병오",
            },
        )

    def test_supported_range_lower_bound(self) -> None:
        result = saju.get_saju(1900, 1, 1, 23)
        self.assertEqual(set(result), {"year", "month", "day", "hour"})

    def test_supported_range_upper_bound(self) -> None:
        result = saju.get_saju(2050, 12, 31, 21)
        self.assertEqual(set(result), {"year", "month", "day", "hour"})

    def test_out_of_range_year_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "1900년~2050년"):
            saju.get_saju(2051, 1, 1, 23)

    def test_invalid_date_fails_without_raw_input_echo(self) -> None:
        with self.assertRaisesRegex(ValueError, "^존재하지 않는 날짜입니다\\.$"):
            saju.get_saju(2024, 2, 30, 23)

    def test_invalid_hour_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "지원하지 않는 시간 값"):
            saju.get_saju(2024, 1, 1, 2)


class OhangAndInterpretationTest(unittest.TestCase):
    def test_ohang_count_sum_is_always_eight(self) -> None:
        sample = {
            "year": "갑자",
            "month": "병인",
            "day": "정묘",
            "hour": "기축",
        }
        counts = saju.get_ohang_count(sample)
        self.assertEqual(sum(counts.values()), 8)
        self.assertEqual(counts, {"목": 3, "화": 2, "토": 2, "금": 0, "수": 1})

    def test_missing_pillar_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "기둥 정보가 없습니다"):
            saju.get_ohang_count({"year": "갑자", "month": "병인", "day": "정묘"})

    def test_invalid_pillar_value_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "천간 또는 지지 값이 올바르지 않습니다"):
            saju.get_ohang_count(
                {
                    "year": "갑자",
                    "month": "병인",
                    "day": "정묘",
                    "hour": "ZZ",
                }
            )

    def test_interpretation_uses_defined_branches_only(self) -> None:
        text = saju.get_interpretation({"목": 3, "화": 1, "토": 0, "금": 2, "수": 0})
        self.assertIn("목(木)의 기운이 강합니다.", text)
        self.assertIn("화(火)의 기운이 고르게 분포되어 있습니다.", text)
        self.assertIn("토(土)의 기운이 없습니다.", text)
        self.assertIn("금(金)의 기운이 고르게 분포되어 있습니다.", text)
        self.assertIn("수(水)의 기운이 없습니다.", text)

    def test_interpretation_missing_element_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "오행 해석에 필요한 값이 올바르지 않습니다"):
            saju.get_interpretation({"목": 1, "화": 1})


if __name__ == "__main__":
    unittest.main()
