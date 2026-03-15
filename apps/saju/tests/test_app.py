"""UI-level tests for the saju app entry point."""

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

from apps.saju.src import app


class AnalyzeSajuTest(unittest.TestCase):
    def test_success_returns_ordered_sections(self) -> None:
        # pass a dummy gender; result should be identical to previous behavior
        error_html, pillars_html, ohang_html, interpretation_html = app.analyze_saju(
            1990, 1, 1, 23, "남"
        )

        self.assertEqual(error_html, "<div class='message-empty'></div>")
        self.assertIn("사주 팔자", pillars_html)
        self.assertIn("년주", pillars_html)
        self.assertIn("시주", pillars_html)
        self.assertIn("오행 분포", ohang_html)
        self.assertIn("목(木)", ohang_html)
        self.assertIn("해석", interpretation_html)
        self.assertIn("목(木)의 기운", interpretation_html)

    def test_missing_input_returns_error_before_results(self) -> None:
        # omit year and gender
        error_html, pillars_html, ohang_html, interpretation_html = app.analyze_saju(
            None, 1, 1, 23, None
        )

        self.assertIn("모든 항목을 선택해주세요.", error_html)
        self.assertEqual(pillars_html, "")
        self.assertEqual(ohang_html, "")
        self.assertEqual(interpretation_html, "")

    def test_missing_gender_triggers_same_error(self) -> None:
        error_html, pillars_html, ohang_html, interpretation_html = app.analyze_saju(
            1990, 1, 1, 23, None
        )

        self.assertIn("모든 항목을 선택해주세요.", error_html)
        self.assertEqual(pillars_html, "")
        self.assertEqual(ohang_html, "")
        self.assertEqual(interpretation_html, "")

    def test_invalid_date_error_does_not_echo_raw_input(self) -> None:
        error_html, pillars_html, ohang_html, interpretation_html = app.analyze_saju(
            2024, 2, 30, 23, "여"
        )

        self.assertIn("존재하지 않는 날짜입니다.", error_html)
        self.assertNotIn("2024", error_html)
        self.assertNotIn("2월", error_html)
        self.assertNotIn("30", error_html)
        self.assertEqual(pillars_html, "")
        self.assertEqual(ohang_html, "")
        self.assertEqual(interpretation_html, "")

    def test_privacy_notice_matches_current_behavior(self) -> None:
        self.assertIn("저장하지 않으며", app.PRIVACY_NOTICE)
        self.assertNotIn("공유 링크", app.PRIVACY_NOTICE)


class GradioAvailabilityTest(unittest.TestCase):
    def test_build_interface_raises_when_gradio_is_missing(self) -> None:
        if app.gr is not None:
            self.skipTest("gradio is installed in this environment")

        with self.assertRaisesRegex(RuntimeError, "gradio가 설치되어 있지 않습니다"):
            app.build_interface()

    def test_main_raises_when_gradio_is_missing(self) -> None:
        if app.gr is not None:
            self.skipTest("gradio is installed in this environment")

        with self.assertRaisesRegex(RuntimeError, "gradio가 설치되어 있지 않습니다"):
            app.main()


class BuildInterfaceRegressionTest(unittest.TestCase):
    """Basic structural regression tests for the Gradio Blocks interface."""

    def test_constructed_interface_has_expected_components(self) -> None:
        if app.gr is None:
            self.skipTest("gradio is not available")

        import warnings

        # capture deprecation warnings so we can assert none are emitted
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            demo = app.build_interface()

        # no css-in-constructor warnings should be raised
        self.assertFalse(
            any(
                "css" in str(w.message) and "Blocks constructor" in str(w.message)
                for w in caught
            ),
            "build_interface should not warn about css placement",
        )

        # the object should be a gr.Blocks instance and carry the css string
        self.assertIsInstance(demo, app.gr.Blocks)
        self.assertEqual(getattr(demo, "css", ""), app.CUSTOM_CSS)

        # there should be at least one HTML component containing the title
        html_components = [c for c in getattr(demo, "children", []) if isinstance(c, app.gr.HTML)]
        self.assertTrue(
            any(app.APP_TITLE in c.value for c in html_components),
            "interface should include a header with the app title",
        )

        # locate the gender input by scanning all known blocks; gradio may wrap
        # components inside form containers.
        candidate = [
            c
            for c in demo.blocks.values()
            if getattr(c, "label", None) == app.GENDER_LABEL
        ]
        self.assertTrue(candidate, "gender input should be present")
        widget = candidate[0]
        # radiobutton choices appear as (value, label) tuples; only the label part
        # should match our constant list.
        actual_labels = tuple(item[0] if isinstance(item, tuple) else item for item in widget.choices)
        self.assertEqual(actual_labels, tuple(app.GENDER_CHOICES))


if __name__ == "__main__":
    unittest.main()
