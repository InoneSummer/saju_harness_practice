"""Gradio UI entry point for the saju app."""

from __future__ import annotations

from html import escape

try:
    import gradio as gr
except ImportError:  # pragma: no cover - runtime dependency check
    gr = None

try:
    from .constants import (
        APP_TITLE,
        DAY_CHOICES,
        DAY_LABEL,
        ERROR_SELECT_ALL,
        GENDER_CHOICES,
        GENDER_LABEL,
        HOUR_CHOICES,
        HOUR_LABEL,
        MONTH_CHOICES,
        MONTH_LABEL,
        OHANG_COLORS,
        OHANG_LABELS,
        OHANG_ORDER,
        PRIVACY_NOTICE,
        RELIABILITY_NOTICE,
        SUBMIT_BUTTON_LABEL,
        YEAR_CHOICES,
        YEAR_LABEL,
    )
    from .saju import get_interpretation, get_ohang_count, get_saju
except ImportError:  # pragma: no cover - direct script import fallback
    from constants import (
        APP_TITLE,
        DAY_CHOICES,
        DAY_LABEL,
        ERROR_SELECT_ALL,
        GENDER_CHOICES,
        GENDER_LABEL,
        HOUR_CHOICES,
        HOUR_LABEL,
        MONTH_CHOICES,
        MONTH_LABEL,
        OHANG_COLORS,
        OHANG_LABELS,
        OHANG_ORDER,
        PRIVACY_NOTICE,
        RELIABILITY_NOTICE,
        SUBMIT_BUTTON_LABEL,
        YEAR_CHOICES,
        YEAR_LABEL,
    )
    from saju import get_interpretation, get_ohang_count, get_saju

CUSTOM_CSS = """
.app-shell {max-width: 960px; margin: 0 auto; padding: 24px 12px 40px;}
.app-header {margin-bottom: 20px;}
.app-header h1 {margin: 0; font-size: 2rem; color: #253038;}
.app-header p {margin: 8px 0 0; color: #55636d;}
.result-card {background: #fbf9f4; border: 1px solid #e7dfcf; border-radius: 16px; padding: 18px;}
.result-card h3 {margin: 0 0 12px; color: #253038; font-size: 1rem;}
.pillar-grid {display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;}
.pillar-item {background: #ffffff; border: 1px solid #e5ddd0; border-radius: 12px; padding: 12px; text-align: center;}
.pillar-label {font-size: 0.85rem; color: #6a737b; margin-bottom: 6px;}
.pillar-value {font-size: 1.35rem; font-weight: 700; color: #253038;}
.ohang-list {display: grid; gap: 10px;}
.ohang-row {display: grid; grid-template-columns: 88px 1fr 42px; align-items: center; gap: 10px;}
.ohang-label {font-weight: 600; color: #253038;}
.ohang-bar-track {background: #efe8db; border-radius: 999px; overflow: hidden; height: 12px;}
.ohang-bar-fill {height: 12px; border-radius: 999px;}
.ohang-count {text-align: right; color: #55636d; font-weight: 600;}
.message-error {background: #fff3f1; border: 1px solid #f0c3bb; color: #8a3a2c; border-radius: 12px; padding: 12px 14px;}
.message-empty {display: none;}
.footer-note {margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5ddd0; color: #55636d; font-size: 0.95rem;}
@media (max-width: 640px) {
  .pillar-grid {grid-template-columns: repeat(2, minmax(0, 1fr));}
}
"""


def _render_error(message: str) -> str:
    if not message:
        return "<div class='message-empty'></div>"
    return f"<div class='message-error'>{escape(message)}</div>"


def _render_pillars(pillars: dict[str, str]) -> str:
    labels = (
        ("year", "년주"),
        ("month", "월주"),
        ("day", "일주"),
        ("hour", "시주"),
    )
    items = []
    for key, label in labels:
        items.append(
            "<div class='pillar-item'>"
            f"<div class='pillar-label'>{label}</div>"
            f"<div class='pillar-value'>{escape(pillars[key])}</div>"
            "</div>"
        )
    return (
        "<section class='result-card'>"
        "<h3>사주 팔자</h3>"
        f"<div class='pillar-grid'>{''.join(items)}</div>"
        "</section>"
    )


def _render_ohang(counts: dict[str, int]) -> str:
    rows = []
    for element in OHANG_ORDER:
        width = max(12.5 * counts[element], 4)
        rows.append(
            "<div class='ohang-row'>"
            f"<div class='ohang-label'>{escape(OHANG_LABELS[element])}</div>"
            "<div class='ohang-bar-track'>"
            f"<div class='ohang-bar-fill' style='width:{width}%; background:{OHANG_COLORS[element]};'></div>"
            "</div>"
            f"<div class='ohang-count'>{counts[element]}</div>"
            "</div>"
        )
    return (
        "<section class='result-card'>"
        "<h3>오행 분포</h3>"
        f"<div class='ohang-list'>{''.join(rows)}</div>"
        "</section>"
    )


def _render_interpretation(text: str) -> str:
    lines = "".join(f"<p>{escape(line)}</p>" for line in text.splitlines() if line.strip())
    return (
        "<section class='result-card'>"
        "<h3>해석</h3>"
        f"{lines}"
        "</section>"
    )


def analyze_saju(
    year: int | None,
    month: int | None,
    day: int | None,
    hour: int | None,
    gender: str | None = None,
):
    """Return UI-ready results for the selected birth data.

    ``gender``은 계산에 영향을 주지 않지만 사용자 입력 항목으로 반드시
    받아야 하므로 비어 있으면 오류를 반환한다.  향후 남녀차 특성 분석이
    추가될 때를 위한 자리이다.
    """
    if year is None or month is None or day is None or hour is None or not gender:
        return _render_error(ERROR_SELECT_ALL), "", "", ""

    try:
        pillars = get_saju(year, month, day, hour)
        ohang_count = get_ohang_count(pillars)
        interpretation = get_interpretation(ohang_count)
    except (RuntimeError, ValueError) as error:
        return _render_error(str(error)), "", "", ""

    return (
        _render_error(""),
        _render_pillars(pillars),
        _render_ohang(ohang_count),
        _render_interpretation(interpretation),
    )


def build_interface():
    """Build the Gradio Blocks interface.

    NOTE: gradio 6 moved the ``css`` argument from ``Blocks`` to ``launch()``.  the
    helper therefore does **not** pass ``css`` while building; callers should
    forward :data:`CUSTOM_CSS` when launching (see :func:`main`).  we still keep
    the CSS string on the returned object for tests and backwards compatibility.
    """
    if gr is None:
        raise RuntimeError("gradio가 설치되어 있지 않습니다.")

    # construct interface without css to avoid deprecation warnings
    with gr.Blocks(title=APP_TITLE) as demo:
        gr.HTML(
            "<div class='app-shell'>"
            "<header class='app-header'>"
            f"<h1>{escape(APP_TITLE)}</h1>"
            "<p>생년월일시를 선택하면 사주 팔자와 오행 분포를 보여줍니다.</p>"
            "</header>"
        )
        with gr.Row():
            year_input = gr.Dropdown(
                choices=list(YEAR_CHOICES),
                label=YEAR_LABEL,
                value=None,
                scale=1,
                min_width=140,
            )
            month_input = gr.Dropdown(
                choices=list(MONTH_CHOICES),
                label=MONTH_LABEL,
                value=None,
                scale=1,
                min_width=120,
            )
        with gr.Row():
            day_input = gr.Dropdown(
                choices=list(DAY_CHOICES),
                label=DAY_LABEL,
                value=None,
                scale=1,
                min_width=120,
            )
            hour_input = gr.Dropdown(
                choices=list(HOUR_CHOICES),
                label=HOUR_LABEL,
                value=None,
                scale=1,
                min_width=180,
            )

        # 성별 입력은 위젯별 공간을 아끼기 위해 라디오로 처리한다.
        gender_input = gr.Radio(
            choices=list(GENDER_CHOICES),
            label=GENDER_LABEL,
            value=None,
            scale=1,
        )

        submit_button = gr.Button(SUBMIT_BUTTON_LABEL, variant="primary")

        error_output = gr.HTML()
        pillars_output = gr.HTML()
        ohang_output = gr.HTML()
        interpretation_output = gr.HTML()

        submit_button.click(
            fn=analyze_saju,
            inputs=[year_input, month_input, day_input, hour_input, gender_input],
            outputs=[error_output, pillars_output, ohang_output, interpretation_output],
        )

        gr.HTML(
            "<footer class='footer-note'>"
            f"<p>{escape(PRIVACY_NOTICE)}</p>"
            f"<p>{escape(RELIABILITY_NOTICE)}</p>"
            "</footer>"
            "</div>"
        )

    # store css for callers; tests assert this
    demo.css = CUSTOM_CSS
    return demo


demo = build_interface() if gr is not None else None


def main() -> None:
    """Launch the Gradio app.

    ``build_interface`` stores the CSS string on the returned <Blocks> instance
    (for regression tests and backwards compatibility).  we forward that value to
    ``launch`` so the styling actually takes effect and to avoid deprecation
    warnings from gradio >=6.0.
    """
    if demo is None:
        raise RuntimeError("gradio가 설치되어 있지 않습니다.")
    css = getattr(demo, "css", CUSTOM_CSS)
    demo.launch(css=css)


if __name__ == "__main__":
    main()
