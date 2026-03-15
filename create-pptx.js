const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const {
  FaRobot, FaCogs, FaCheckCircle, FaSync, FaBook,
  FaTools, FaFolderOpen, FaGitAlt, FaUsers, FaClipboardList,
  FaBullseye, FaHandshake, FaLightbulb, FaPuzzlePiece,
  FaLayerGroup, FaFileAlt, FaCode, FaTerminal
} = require("react-icons/fa");
const {
  MdArchitecture, MdVerified, MdLoop, MdCompare
} = require("react-icons/md");
const {
  HiOutlineDocumentText
} = require("react-icons/hi");

// ─── Helpers ───
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12
});

const makeCardShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10
});

// ─── Color palette: Midnight Teal ───
const C = {
  dark:      "1A2332",   // deep navy
  mid:       "2B3E50",   // medium navy
  teal:      "0891B2",   // accent teal
  tealLight: "22D3EE",   // light teal
  light:     "F0F9FF",   // ice blue bg
  white:     "FFFFFF",
  offWhite:  "F8FAFC",
  gray:      "64748B",   // muted text
  grayLight: "E2E8F0",   // borders
  text:      "1E293B",   // body text
  amber:     "F59E0B",   // warm accent
  green:     "10B981",   // success
  rose:      "F43F5E",   // alert
  purple:    "8B5CF6",   // highlight
};

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Ask Dori";
  pres.title = "사주 서비스를 하네스 엔지니어링으로 만들자!";

  // Pre-render icons
  const icons = {};
  const iconList = [
    ["robot", FaRobot, C.teal],
    ["cogs", FaCogs, C.teal],
    ["check", FaCheckCircle, C.green],
    ["sync", FaSync, C.teal],
    ["book", FaBook, C.teal],
    ["tools", FaTools, C.teal],
    ["folder", FaFolderOpen, C.teal],
    ["git", FaGitAlt, C.rose],
    ["users", FaUsers, C.teal],
    ["clipboard", FaClipboardList, C.teal],
    ["bullseye", FaBullseye, C.amber],
    ["handshake", FaHandshake, C.teal],
    ["lightbulb", FaLightbulb, C.amber],
    ["puzzle", FaPuzzlePiece, C.teal],
    ["layer", FaLayerGroup, C.teal],
    ["file", FaFileAlt, C.teal],
    ["code", FaCode, C.teal],
    ["terminal", FaTerminal, C.teal],
    ["arch", MdArchitecture, C.teal],
    ["verified", MdVerified, C.green],
    ["loop", MdLoop, C.teal],
    ["compare", MdCompare, C.teal],
  ];

  for (const [key, Comp, color] of iconList) {
    icons[key] = await iconToBase64Png(Comp, `#${color}`);
  }

  // White versions for dark backgrounds
  const whiteIcons = {};
  for (const [key, Comp] of iconList) {
    whiteIcons[key] = await iconToBase64Png(Comp, "#FFFFFF");
  }

  // ═══════════════════════════════════════════
  // SLIDE 1: Title
  // ═══════════════════════════════════════════
  let slide = pres.addSlide();
  slide.background = { color: C.dark };

  // Decorative shapes
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.teal }
  });

  // Big teal circle decoration (top right)
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.0, w: 4, h: 4, fill: { color: C.teal, transparency: 85 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: -0.5, w: 2.8, h: 2.8, fill: { color: C.teal, transparency: 75 }
  });

  slide.addText("사주 서비스를\n하네스 엔지니어링으로 만들자!", {
    x: 0.8, y: 1.2, w: 7, h: 2.2,
    fontSize: 38, fontFace: "Arial Black",
    color: C.white, bold: true, lineSpacingMultiple: 1.2, margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.5, w: 2.5, h: 0.04, fill: { color: C.teal }
  });

  slide.addText("에스크 도리의 도리", {
    x: 0.8, y: 3.75, w: 5, h: 0.5,
    fontSize: 18, fontFace: "Arial", color: C.tealLight, margin: 0
  });

  slide.addText("AI와 함께 만드는 실전 하네스 엔지니어링 가이드", {
    x: 0.8, y: 4.3, w: 6, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.gray, margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 2: Agenda
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("목차", {
    x: 0.8, y: 0.4, w: 8, h: 0.7,
    fontSize: 32, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const agendaItems = [
    { num: "01", title: "하네스 엔지니어링이란?", desc: "프롬프트 엔지니어링을 넘어서" },
    { num: "02", title: "Application Harness", desc: "Repository와 Application 단계" },
    { num: "03", title: "따라하기", desc: "사주 서비스를 직접 만들어보기" },
    { num: "04", title: "철학", desc: "경영학과 만나는 하네스 엔지니어링" },
  ];

  agendaItems.forEach((item, i) => {
    const yBase = 1.4 + i * 1.0;
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: yBase, w: 0.7, h: 0.7, fill: { color: C.teal }
    });
    slide.addText(item.num, {
      x: 0.8, y: yBase, w: 0.7, h: 0.7,
      fontSize: 18, fontFace: "Arial", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.title, {
      x: 1.8, y: yBase + 0.02, w: 6, h: 0.35,
      fontSize: 20, fontFace: "Arial", color: C.dark, bold: true, margin: 0
    });
    slide.addText(item.desc, {
      x: 1.8, y: yBase + 0.38, w: 6, h: 0.3,
      fontSize: 13, fontFace: "Arial", color: C.gray, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 3: Part 1 Divider
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.teal }
  });

  slide.addText("Part 1", {
    x: 0.8, y: 1.5, w: 5, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: C.tealLight, margin: 0,
    charSpacing: 6
  });

  slide.addText("하네스 엔지니어링이란?", {
    x: 0.8, y: 2.1, w: 8, h: 1.0,
    fontSize: 36, fontFace: "Arial Black", color: C.white, bold: true, margin: 0
  });

  slide.addText("AI를 새로 온 팀원으로 생각해보세요.", {
    x: 0.8, y: 3.3, w: 7, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: C.gray, italic: true, margin: 0
  });

  slide.addImage({ data: whiteIcons.robot, x: 8.2, y: 1.8, w: 1.2, h: 1.2 });

  // ═══════════════════════════════════════════
  // SLIDE 4: Prompt vs Harness
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("프롬프트 vs 하네스 엔지니어링", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Left card: Prompt
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.2, h: 3.6,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.2, h: 0.06, fill: { color: C.gray }
  });

  slide.addText("프롬프트 엔지니어링", {
    x: 0.8, y: 1.6, w: 3.6, h: 0.45,
    fontSize: 18, fontFace: "Arial", color: C.dark, bold: true, margin: 0
  });
  slide.addText([
    { text: '"이번에는 이렇게 해줘"', options: { breakLine: true, italic: true, color: C.gray } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "그때그때 잘 요청하는 기술", options: { breakLine: true, bold: true } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "매번 처음부터 설명", options: { bullet: true, breakLine: true } },
    { text: "일회성 지시", options: { bullet: true, breakLine: true } },
    { text: "결과가 들쑥날쑥", options: { bullet: true } },
  ], {
    x: 0.8, y: 2.2, w: 3.6, h: 2.4,
    fontSize: 14, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 4
  });

  // Right card: Harness
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.3, w: 4.2, h: 3.6,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.3, w: 4.2, h: 0.06, fill: { color: C.teal }
  });

  slide.addText("하네스 엔지니어링", {
    x: 5.6, y: 1.6, w: 3.6, h: 0.45,
    fontSize: 18, fontFace: "Arial", color: C.teal, bold: true, margin: 0
  });
  slide.addText([
    { text: '"우리 팀은 이렇게 일해"', options: { breakLine: true, italic: true, color: C.teal } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "일하는 환경 자체를 설계", options: { breakLine: true, bold: true } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "규칙과 구조를 미리 세팅", options: { bullet: true, breakLine: true } },
    { text: "반복 가능한 워크플로우", options: { bullet: true, breakLine: true } },
    { text: "일관된 품질의 결과물", options: { bullet: true } },
  ], {
    x: 5.6, y: 2.2, w: 3.6, h: 2.4,
    fontSize: 14, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 4
  });

  // ═══════════════════════════════════════════
  // SLIDE 5: AI as Teammate
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("AI는 새로 온 내 팀원", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Left: The problem
  slide.addImage({ data: icons.users, x: 0.8, y: 1.3, w: 0.5, h: 0.5 });
  slide.addText("바쁜 팀장인 나", {
    x: 1.5, y: 1.35, w: 3, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0
  });

  slide.addText([
    { text: "AI에게 권한을 위임하고 싶어요", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "그런데 매번 처음부터 설명하는 것보다...", options: { breakLine: true, color: C.gray } },
  ], {
    x: 0.8, y: 2.0, w: 4, h: 1.2,
    fontSize: 14, fontFace: "Arial", color: C.text, margin: 0
  });

  // Arrow
  slide.addText("\u2192", {
    x: 4.4, y: 2.2, w: 1.2, h: 0.8,
    fontSize: 36, fontFace: "Arial", color: C.teal, align: "center", valign: "middle", margin: 0
  });

  // Right: The solution
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 3.5,
    fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 0.06, fill: { color: C.teal }
  });

  slide.addText("미리 알려주면 더 잘 일한다!", {
    x: 5.6, y: 1.5, w: 3.6, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: C.teal, bold: true, margin: 0
  });

  const teamItems = [
    '"우리 회사는 이렇게 일해"',
    '"이런 결과물을 내야 해"',
    '"Do가 있고 Don\'t가 있어"',
    '"작업 기준을 미리 합의하자"',
  ];
  slide.addText(
    teamItems.map((t, i) => ({
      text: t,
      options: { breakLine: i < teamItems.length - 1, bullet: true }
    })),
    {
      x: 5.6, y: 2.1, w: 3.6, h: 2.2,
      fontSize: 13, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 8
    }
  );

  // Bottom quote
  slide.addText("규칙이 있을 때 오히려 자율성이 더 발휘될 수 있다", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: C.teal, italic: true,
    align: "center", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 6: 4 Components
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("하네스 엔지니어링의 4가지 구성요소", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const components = [
    { icon: "book", title: "헌법", sub: "Constitution", desc: "LLM이 따라야 할 규칙\n\"우리 팀은 이렇게 일한다\"", color: C.teal },
    { icon: "clipboard", title: "작업 구조", sub: "Task Structure", desc: "무엇을 어떻게 만들지\n작업 지시서", color: C.purple },
    { icon: "verified", title: "검증", sub: "Validation", desc: "결과가 맞는지 체크\n품질 기준 제공", color: C.green },
    { icon: "loop", title: "실행 루프", sub: "Agent Loop", desc: "수정-검증-반복\n만족할 때까지", color: C.amber },
  ];

  components.forEach((c, i) => {
    const x = 0.5 + i * 2.35;
    const y = 1.3;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.15, h: 3.5, fill: { color: C.white }, shadow: makeCardShadow()
    });
    // Color top bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.15, h: 0.06, fill: { color: c.color }
    });
    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.65, y: y + 0.35, w: 0.85, h: 0.85, fill: { color: c.color, transparency: 88 }
    });
    slide.addImage({
      data: icons[c.icon], x: x + 0.82, y: y + 0.52, w: 0.5, h: 0.5
    });
    // Title
    slide.addText(c.title, {
      x: x + 0.1, y: y + 1.4, w: 1.95, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.dark, bold: true,
      align: "center", margin: 0
    });
    slide.addText(c.sub, {
      x: x + 0.1, y: y + 1.75, w: 1.95, h: 0.3,
      fontSize: 11, fontFace: "Arial", color: C.gray, align: "center", margin: 0
    });
    // Description
    slide.addText(c.desc, {
      x: x + 0.15, y: y + 2.2, w: 1.85, h: 1.0,
      fontSize: 12, fontFace: "Arial", color: C.text, align: "center", margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 7: What you need
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("하네스에 필요한 것들", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const needs = [
    { icon: "book", label: "규칙", desc: "헌법과 작업 구조" },
    { icon: "check", label: "검증 기준", desc: "품질 판단의 기준" },
    { icon: "sync", label: "실행 흐름", desc: "수정-검증 반복 루프" },
    { icon: "folder", label: "저장소", desc: "로컬/Git 연동" },
    { icon: "file", label: "참고 자료", desc: "레퍼런스 문서" },
  ];

  needs.forEach((n, i) => {
    const yBase = 1.3 + i * 0.8;
    slide.addShape(pres.shapes.OVAL, {
      x: 1.0, y: yBase, w: 0.6, h: 0.6, fill: { color: C.teal, transparency: 85 }
    });
    slide.addImage({ data: icons[n.icon], x: 1.08, y: yBase + 0.08, w: 0.44, h: 0.44 });
    slide.addText(n.label, {
      x: 1.9, y: yBase + 0.02, w: 2.5, h: 0.3,
      fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, margin: 0
    });
    slide.addText(n.desc, {
      x: 1.9, y: yBase + 0.32, w: 3.5, h: 0.25,
      fontSize: 12, fontFace: "Arial", color: C.gray, margin: 0
    });
  });

  // Right side - highlight box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 1.3, w: 3.7, h: 3.8, fill: { color: C.dark }
  });
  slide.addText("새로 온 팀원을\n나의 오른팔로\n만드는 과정", {
    x: 6.0, y: 1.8, w: 3.3, h: 1.8,
    fontSize: 22, fontFace: "Arial Black", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.3
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.15, y: 3.7, w: 1.0, h: 0.04, fill: { color: C.teal }
  });
  slide.addText("= 하네스 엔지니어링", {
    x: 6.0, y: 3.9, w: 3.3, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.tealLight,
    align: "center", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 8: Part 2 Divider
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.teal }
  });

  slide.addText("Part 2", {
    x: 0.8, y: 1.5, w: 5, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: C.tealLight, margin: 0,
    charSpacing: 6
  });

  slide.addText("Application Harness\nEngineering", {
    x: 0.8, y: 2.1, w: 8, h: 1.2,
    fontSize: 36, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
    lineSpacingMultiple: 1.1
  });

  slide.addText("Repository 단계와 Application 단계", {
    x: 0.8, y: 3.5, w: 7, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: C.gray, italic: true, margin: 0
  });

  slide.addImage({ data: whiteIcons.layer, x: 8.2, y: 1.8, w: 1.2, h: 1.2 });

  // ═══════════════════════════════════════════
  // SLIDE 9: Two Stages
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("두 단계의 하네스", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Left card: Repository
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 4.2, h: 3.8, fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 0.08, h: 3.8, fill: { color: C.teal }
  });

  slide.addImage({ data: icons.folder, x: 0.9, y: 1.5, w: 0.45, h: 0.45 });
  slide.addText("Repository 단계", {
    x: 1.5, y: 1.52, w: 3, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: C.teal, bold: true, margin: 0
  });
  slide.addText("작업환경 전체의 공통환경", {
    x: 0.9, y: 2.1, w: 3.5, h: 0.3,
    fontSize: 13, fontFace: "Arial", color: C.gray, margin: 0
  });
  slide.addText([
    { text: "문서를 어디에 둘지", options: { bullet: true, breakLine: true } },
    { text: "어떤 규칙을 따를지", options: { bullet: true, breakLine: true } },
    { text: "구조, 린터, CI 규칙", options: { bullet: true, breakLine: true } },
    { text: "아키텍처 제약", options: { bullet: true } },
  ], {
    x: 0.9, y: 2.5, w: 3.5, h: 2.2,
    fontSize: 14, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 6
  });

  // Right card: Application
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 3.8, fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 0.08, h: 3.8, fill: { color: C.amber }
  });

  slide.addImage({ data: icons.code, x: 5.7, y: 1.5, w: 0.45, h: 0.45 });
  slide.addText("Application 단계", {
    x: 6.3, y: 1.52, w: 3, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: C.amber, bold: true, margin: 0
  });
  slide.addText("프로젝트별 구체적 설계", {
    x: 5.7, y: 2.1, w: 3.5, h: 0.3,
    fontSize: 13, fontFace: "Arial", color: C.gray, margin: 0
  });
  slide.addText([
    { text: "어떤 기능을 가져야 하는지", options: { bullet: true, breakLine: true } },
    { text: "에이전트 루프, 툴 통합", options: { bullet: true, breakLine: true } },
    { text: "피드백 구조", options: { bullet: true, breakLine: true } },
    { text: "도메인별 사용자 경험", options: { bullet: true } },
  ], {
    x: 5.7, y: 2.5, w: 3.5, h: 2.2,
    fontSize: 14, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 6
  });

  // ═══════════════════════════════════════════
  // SLIDE 10: Inductive approach
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("귀납적 접근 방식", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  slide.addText("개발자는 Repository 하네스부터, 일반인은 App부터 상상한다", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.gray, margin: 0
  });

  // Flow boxes
  const flowItems = [
    { label: "앱 상상하기", sub: '"사주 서비스\n만들고 싶다!"', color: C.amber },
    { label: "App 하네스", sub: "기능, UX, 결과물\n구체적으로 설계", color: C.teal },
    { label: "Repo 하네스", sub: "공통 규칙, 구조\n작업환경 설정", color: C.dark },
  ];

  flowItems.forEach((f, i) => {
    const x = 0.8 + i * 3.2;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.9, w: 2.7, h: 2.5, fill: { color: C.white }, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.9, w: 2.7, h: 0.06, fill: { color: f.color }
    });
    slide.addText(f.label, {
      x: x + 0.15, y: 2.15, w: 2.4, h: 0.4,
      fontSize: 17, fontFace: "Arial", color: f.color, bold: true, align: "center", margin: 0
    });
    slide.addText(f.sub, {
      x: x + 0.15, y: 2.7, w: 2.4, h: 1.2,
      fontSize: 13, fontFace: "Arial", color: C.text, align: "center", margin: 0
    });

    // Arrow between boxes
    if (i < 2) {
      slide.addText("\u2192", {
        x: x + 2.7, y: 2.6, w: 0.5, h: 0.6,
        fontSize: 28, fontFace: "Arial", color: C.teal, align: "center", valign: "middle", margin: 0
      });
    }
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 4.7, w: 5, h: 0.5, fill: { color: C.teal, transparency: 90 }
  });
  slide.addText("이 강의에서는 App 하네스 먼저 \u2192 Repo 하네스로!", {
    x: 2.5, y: 4.7, w: 5, h: 0.5,
    fontSize: 13, fontFace: "Arial", color: C.teal, bold: true, align: "center", valign: "middle", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 11: Part 3 Divider
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.teal }
  });

  slide.addText("Part 3", {
    x: 0.8, y: 1.5, w: 5, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: C.tealLight, margin: 0,
    charSpacing: 6
  });

  slide.addText("하네스 엔지니어링\n따라하기", {
    x: 0.8, y: 2.1, w: 8, h: 1.2,
    fontSize: 36, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
    lineSpacingMultiple: 1.1
  });

  slide.addText("사주 서비스를 직접 만들어보기", {
    x: 0.8, y: 3.5, w: 7, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: C.gray, italic: true, margin: 0
  });

  slide.addImage({ data: whiteIcons.terminal, x: 8.2, y: 1.8, w: 1.2, h: 1.2 });

  // ═══════════════════════════════════════════
  // SLIDE 12: Prerequisites
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("준비물", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const preps = [
    { icon: "robot", title: "클로드 코드 / 코덱스", desc: "AI 에이전트 실행 환경" },
    { icon: "git", title: "Git", desc: "버전 관리 및 체크포인트" },
    { icon: "code", title: "Python", desc: "프로그래밍 언어 환경" },
  ];

  preps.forEach((p, i) => {
    const yBase = 1.3 + i * 1.3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: yBase, w: 8.4, h: 1.05, fill: { color: C.white }, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 1.1, y: yBase + 0.2, w: 0.65, h: 0.65, fill: { color: C.teal, transparency: 85 }
    });
    slide.addImage({ data: icons[p.icon], x: 1.18, y: yBase + 0.28, w: 0.5, h: 0.5 });
    slide.addText(p.title, {
      x: 2.1, y: yBase + 0.15, w: 5, h: 0.4,
      fontSize: 18, fontFace: "Arial", color: C.dark, bold: true, margin: 0
    });
    slide.addText(p.desc, {
      x: 2.1, y: yBase + 0.55, w: 5, h: 0.3,
      fontSize: 13, fontFace: "Arial", color: C.gray, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 13: AI Collaboration Process
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("AI와 협의하며 문서 만들기", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const steps = [
    { num: "1", text: "OpenAI 하네스 구조 참고하여\n폴더 구조 설계" },
    { num: "2", text: 'AI에게 "이 구조로 내용을\n같이 논의해볼까?" 제안' },
    { num: "3", text: "협의하며 문서를 하나하나\n같이 작성" },
    { num: "4", text: "완성 후 논리적 일관성\n모순 여부 재검토" },
  ];

  steps.forEach((s, i) => {
    const x = 0.5 + i * 2.35;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.2, w: 2.15, h: 2.8, fill: { color: C.white }, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.75, y: 1.45, w: 0.65, h: 0.65, fill: { color: C.teal }
    });
    slide.addText(s.num, {
      x: x + 0.75, y: 1.45, w: 0.65, h: 0.65,
      fontSize: 20, fontFace: "Arial", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(s.text, {
      x: x + 0.15, y: 2.35, w: 1.85, h: 1.4,
      fontSize: 13, fontFace: "Arial", color: C.text, align: "center", margin: 0
    });
  });

  // Tip box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.3, w: 9.0, h: 0.9, fill: { color: C.teal, transparency: 92 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.3, w: 0.06, h: 0.9, fill: { color: C.teal }
  });
  slide.addText("Tip: AI가 만든 내용을 꼭 읽어가며 승인하세요. 모호한 것을 없앨수록 AI는 더 잘 일합니다.", {
    x: 0.8, y: 4.3, w: 8.5, h: 0.9,
    fontSize: 13, fontFace: "Arial", color: C.teal, valign: "middle", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 14: Constitution Example
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("헌법 (Constitution) 예시", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Dark code-like box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 9.0, h: 4.2, fill: { color: C.dark }
  });

  const constitutionLines = [
    { text: "# Constitution", options: { color: C.tealLight, bold: true, fontSize: 16, breakLine: true } },
    { text: "", options: { fontSize: 6, breakLine: true } },
    { text: "Purpose", options: { color: C.amber, bold: true, fontSize: 13, breakLine: true } },
    { text: "  교육용 앱을 같은 방식으로 설계, 구현, 검증", options: { color: "CBD5E1", fontSize: 12, breakLine: true } },
    { text: "", options: { fontSize: 6, breakLine: true } },
    { text: "Core Values", options: { color: C.amber, bold: true, fontSize: 13, breakLine: true } },
    { text: "  간결성 | 검증 가능성 | 안전성", options: { color: "CBD5E1", fontSize: 12, breakLine: true } },
    { text: "", options: { fontSize: 6, breakLine: true } },
    { text: "Non-Negotiables", options: { color: C.amber, bold: true, fontSize: 13, breakLine: true } },
    { text: "  문서 없이 기능 추가 금지", options: { color: "CBD5E1", fontSize: 12, breakLine: true } },
    { text: "  테스트를 속이는 행위 금지", options: { color: "CBD5E1", fontSize: 12, breakLine: true } },
    { text: "  개인정보를 로그/파일/URL에 남기지 않음", options: { color: "CBD5E1", fontSize: 12, breakLine: true } },
    { text: "", options: { fontSize: 6, breakLine: true } },
    { text: "Definition of Done", options: { color: C.amber, bold: true, fontSize: 13, breakLine: true } },
    { text: "  목적/범위 문서화 + 구현 일치 + 테스트 통과 + 인수인계 가능", options: { color: "CBD5E1", fontSize: 12 } },
  ];

  slide.addText(constitutionLines, {
    x: 0.8, y: 1.3, w: 8.4, h: 3.8,
    fontFace: "Consolas", margin: 0, paraSpaceAfter: 2
  });

  // ═══════════════════════════════════════════
  // SLIDE 15: Folder Structure
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("Repository 폴더 구조", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Left tree
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.5, h: 4.2, fill: { color: C.dark }
  });

  const treeLines = [
    { text: "h/", options: { color: C.tealLight, bold: true, fontSize: 13, breakLine: true } },
    { text: "\u251C\u2500 harness/", options: { color: C.amber, bold: true, fontSize: 12, breakLine: true } },
    { text: "\u2502  \u251C\u2500 core/", options: { color: "CBD5E1", fontSize: 11, breakLine: true } },
    { text: "\u2502  \u2502  \u251C\u2500 docs/", options: { color: "94A3B8", fontSize: 11, breakLine: true } },
    { text: "\u2502  \u2502  \u251C\u2500 roles/", options: { color: "94A3B8", fontSize: 11, breakLine: true } },
    { text: "\u2502  \u2502  \u251C\u2500 workflows/", options: { color: "94A3B8", fontSize: 11, breakLine: true } },
    { text: "\u2502  \u2502  \u2514\u2500 templates/", options: { color: "94A3B8", fontSize: 11, breakLine: true } },
    { text: "\u2502  \u2514\u2500 scripts/", options: { color: "CBD5E1", fontSize: 11, breakLine: true } },
    { text: "\u2514\u2500 apps/", options: { color: C.amber, bold: true, fontSize: 12, breakLine: true } },
    { text: "   \u2514\u2500 saju/", options: { color: C.tealLight, fontSize: 12, breakLine: true } },
    { text: "      \u251C\u2500 harness/", options: { color: "CBD5E1", fontSize: 11, breakLine: true } },
    { text: "      \u251C\u2500 src/", options: { color: "CBD5E1", fontSize: 11, breakLine: true } },
    { text: "      \u2514\u2500 tests/", options: { color: "CBD5E1", fontSize: 11 } },
  ];

  slide.addText(treeLines, {
    x: 0.8, y: 1.3, w: 4, h: 3.8,
    fontFace: "Consolas", margin: 0, paraSpaceAfter: 2
  });

  // Right annotations
  const annotations = [
    { y: 1.5, label: "harness/core/", desc: "저장소 공통 원칙\n규칙, 역할, 워크플로우" },
    { y: 3.0, label: "apps/saju/harness/", desc: "사주 앱 전용 규약\n기능 명세, 참고자료, 로드맵" },
    { y: 4.2, label: "apps/saju/src/", desc: "실제 코드와 테스트" },
  ];

  annotations.forEach((a) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: a.y, w: 4.2, h: 0.85, fill: { color: C.white }, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: a.y, w: 0.06, h: 0.85, fill: { color: C.teal }
    });
    slide.addText(a.label, {
      x: 5.6, y: a.y + 0.05, w: 3.7, h: 0.3,
      fontSize: 12, fontFace: "Consolas", color: C.teal, bold: true, margin: 0
    });
    slide.addText(a.desc, {
      x: 5.6, y: a.y + 0.35, w: 3.7, h: 0.45,
      fontSize: 11, fontFace: "Arial", color: C.text, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 16: Git Rollback
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("Git 기반 Rollback 레이어", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Two layers
  // Layer 1
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 4.2, h: 2.3, fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 4.2, h: 0.06, fill: { color: C.amber }
  });
  slide.addText("1\uCE35: \uBE60\uB978 \uB85C\uCEEC Cleanup", {
    x: 0.8, y: 1.45, w: 3.6, h: 0.35,
    fontSize: 16, fontFace: "Arial", color: C.amber, bold: true, margin: 0
  });
  slide.addText([
    { text: "cleanup_agent", options: { bullet: true, breakLine: true } },
    { text: "temp file \uC815\uB9AC, debug code \uC81C\uAC70", options: { bullet: true, breakLine: true } },
    { text: "\uD30C\uC77C \uBCC0\uACBD \uC804 snapshot \uC800\uC7A5", options: { bullet: true } },
  ], {
    x: 0.8, y: 1.95, w: 3.6, h: 1.3,
    fontSize: 13, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 4
  });

  // Layer 2
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 2.3, fill: { color: C.white }, shadow: makeCardShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.2, h: 0.06, fill: { color: C.teal }
  });
  slide.addText("2\uCE35: \uAC15\uD55C Git Rollback", {
    x: 5.6, y: 1.45, w: 3.6, h: 0.35,
    fontSize: 16, fontFace: "Arial", color: C.teal, bold: true, margin: 0
  });
  slide.addText([
    { text: "git branch / checkpoint commit", options: { bullet: true, breakLine: true } },
    { text: "\uD55C \uC791\uC5C5 \uC804\uCCB4\uB97C \uB418\uB3CC\uB9BC", options: { bullet: true, breakLine: true } },
    { text: "AI \uC790\uC728 \uC815\uB9AC + \uC2A4\uB0C5\uC0F7 \uBCF5\uAD6C", options: { bullet: true } },
  ], {
    x: 5.6, y: 1.95, w: 3.6, h: 1.3,
    fontSize: 13, fontFace: "Arial", color: C.text, margin: 0, paraSpaceAfter: 4
  });

  // Key insight box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.8, w: 9.0, h: 1.4, fill: { color: C.dark }
  });
  slide.addText("AI\uAC00 \uC790\uC728\uC801\uC73C\uB85C \uC815\uB9AC\uD558\uACE0 \uC218\uC815\uD560\uC218\uB85D\n\"\uC798\uBABB \uAC74\uB4DC\uB838\uC744 \uB54C \uC548\uC804\uD558\uAC8C \uB418\uB3CC\uB9B4 \uC218 \uC788\uB294 \uC7A5\uCE58\"\uAC00 \uB354 \uAC15\uD574\uC57C \uD569\uB2C8\uB2E4", {
    x: 0.8, y: 3.9, w: 8.4, h: 1.2,
    fontSize: 15, fontFace: "Arial", color: C.white, valign: "middle",
    align: "center", margin: 0, lineSpacingMultiple: 1.3
  });

  // ═══════════════════════════════════════════
  // SLIDE 17: Execution Loop
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("\uC2E4\uD589 \uBC0F \uAC80\uC99D \uB8E8\uD504", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  // Circular flow
  const loopSteps = [
    { label: "\uBB38\uC11C \uC791\uC131", x: 1.5, y: 1.5, color: C.teal },
    { label: "\uCF54\uB4DC \uAD6C\uD604", x: 5.5, y: 1.5, color: C.purple },
    { label: "\uD14C\uC2A4\uD2B8 \uAC80\uC99D", x: 7.5, y: 3.0, color: C.green },
    { label: "\uCF54\uB4DC \uB9AC\uBDF0", x: 5.5, y: 4.2, color: C.amber },
    { label: "\uC218\uC815 \uBC18\uBCF5", x: 1.5, y: 3.0, color: C.rose },
  ];

  // Connecting arrows (simplified - using shapes)
  loopSteps.forEach((s, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: s.x, y: s.y, w: 2.0, h: 0.85, fill: { color: s.color }
    });
    slide.addText(s.label, {
      x: s.x, y: s.y, w: 2.0, h: 0.85,
      fontSize: 15, fontFace: "Arial", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
  });

  // Arrows between steps
  slide.addText("\u2192", { x: 3.5, y: 1.55, w: 1.8, h: 0.7, fontSize: 28, color: C.gray, align: "center", valign: "middle", margin: 0 });
  slide.addText("\u2198", { x: 7.0, y: 2.2, w: 1.0, h: 0.8, fontSize: 28, color: C.gray, align: "center", valign: "middle", margin: 0 });
  slide.addText("\u2190", { x: 3.5, y: 4.25, w: 1.8, h: 0.7, fontSize: 28, color: C.gray, align: "center", valign: "middle", margin: 0 });
  slide.addText("\u2196", { x: 1.0, y: 2.2, w: 1.0, h: 0.8, fontSize: 28, color: C.gray, align: "center", valign: "middle", margin: 0 });

  // ═══════════════════════════════════════════
  // SLIDE 18: Part 4 Divider
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.teal }
  });

  slide.addText("Part 4", {
    x: 0.8, y: 1.5, w: 5, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: C.tealLight, margin: 0,
    charSpacing: 6
  });

  slide.addText("\uD558\uB124\uC2A4 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1\uC758 \uCCA0\uD559", {
    x: 0.8, y: 2.1, w: 8, h: 1.0,
    fontSize: 36, fontFace: "Arial Black", color: C.white, bold: true, margin: 0
  });

  slide.addText("\uACBD\uC601\uD559\uACFC \uB9CC\uB098\uB294 \uD14C\uD06C", {
    x: 0.8, y: 3.3, w: 7, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: C.gray, italic: true, margin: 0
  });

  slide.addImage({ data: whiteIcons.lightbulb, x: 8.2, y: 1.8, w: 1.2, h: 1.2 });

  // ═══════════════════════════════════════════
  // SLIDE 19: Three Boss Types
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("\uC138 \uAC00\uC9C0 \uC0C1\uC0AC \uC720\uD615", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  const bossTypes = [
    {
      title: "\uBC29\uC784\uD615 \uC0C1\uC0AC",
      desc: '"AI\uB294 \uC720\uB2A5\uD558\uB2C8\uAE4C\n\uC798 \uD560 \uAC70\uC57C~"',
      result: "\uBAA8\uD638\uD55C \uC9C0\uC2DC\n\uB4E4\uC329\uB0A0\uC371\uD55C \uACB0\uACFC",
      color: C.rose,
    },
    {
      title: "\uC9C0\uC2DC\uD615 \uC0C1\uC0AC",
      desc: '"\uC774\uAC74 \uC774\uB807\uAC8C,\n\uC800\uAC74 \uC800\uB807\uAC8C"',
      result: "\uC790\uAE30\uAC00 \uC544\uB294 \uAC83\uBC16\uC5D0\n\uBAA8\uB974\uB294 \uD55C\uACC4",
      color: C.amber,
    },
    {
      title: "\uC704\uC784\uD615 \uC0C1\uC0AC",
      desc: '"\uBAA9\uD45C\uB97C \uD568\uAED8 \uC815\uD558\uACE0\n\uC790\uC728\uC131\uC744 \uBCF4\uC7A5"',
      result: "\uBA85\uD655\uD55C \uBAA9\uD45C\n\uC77C\uAD00\uB41C \uD488\uC9C8",
      color: C.teal,
    },
  ];

  bossTypes.forEach((b, i) => {
    const x = 0.5 + i * 3.15;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.2, w: 2.95, h: 3.8, fill: { color: C.white }, shadow: makeCardShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.2, w: 2.95, h: 0.06, fill: { color: b.color }
    });
    slide.addText(b.title, {
      x: x + 0.15, y: 1.45, w: 2.65, h: 0.4,
      fontSize: 18, fontFace: "Arial", color: b.color, bold: true,
      align: "center", margin: 0
    });
    slide.addText(b.desc, {
      x: x + 0.15, y: 2.0, w: 2.65, h: 1.0,
      fontSize: 13, fontFace: "Arial", color: C.text, italic: true,
      align: "center", margin: 0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.4, y: 3.1, w: 2.15, h: 0.02, fill: { color: C.grayLight }
    });
    slide.addText(b.result, {
      x: x + 0.15, y: 3.3, w: 2.65, h: 0.8,
      fontSize: 13, fontFace: "Arial", color: C.gray, align: "center", margin: 0
    });

    if (i === 2) {
      // Highlight the delegation type
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x, y: 4.55, w: 2.95, h: 0.4, fill: { color: C.teal }
      });
      slide.addText("\u2714 \uD558\uB124\uC2A4 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1", {
        x: x, y: 4.55, w: 2.95, h: 0.4,
        fontSize: 12, fontFace: "Arial", color: C.white, bold: true,
        align: "center", valign: "middle", margin: 0
      });
    }
  });

  // ═══════════════════════════════════════════
  // SLIDE 20: MBO
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addText("\uD53C\uD130 \uB4DC\uB7EC\uCEE4\uC758 MBO", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: C.dark, bold: true, margin: 0
  });

  slide.addText("Management by Objectives", {
    x: 0.8, y: 0.9, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: C.teal, italic: true, margin: 0
  });

  const mboSteps = [
    { num: "1", label: "\uC870\uC9C1 \uBAA9\uD45C \uC124\uC815", harness: "\uD070 \uBAA9\uD45C \uC815\uD558\uAE30" },
    { num: "2", label: "\uBAA9\uD45C \uCE90\uC2A4\uCF00\uC774\uB529", harness: "\uC791\uC5C5 \uC4F0\uAC1C\uAE30" },
    { num: "3", label: "\uAC1C\uC778 \uBAA9\uD45C \uD569\uC758", harness: "AI\uC640 \uD611\uC758" },
    { num: "4", label: "\uC2E4\uD589 \uBC0F \uBAA8\uB2C8\uD130\uB9C1", harness: "\uC2E4\uD589 \uB8E8\uD504" },
    { num: "5", label: "\uC131\uACFC \uD3C9\uAC00", harness: "\uAC80\uC99D \uBC0F \uD1B5\uACFC" },
  ];

  mboSteps.forEach((s, i) => {
    const yBase = 1.5 + i * 0.75;
    // Step number
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: yBase, w: 0.55, h: 0.55, fill: { color: C.teal }
    });
    slide.addText(s.num, {
      x: 0.8, y: yBase, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: "Arial", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0
    });
    // MBO label
    slide.addText(s.label, {
      x: 1.6, y: yBase + 0.08, w: 3.2, h: 0.4,
      fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, margin: 0
    });
    // Arrow
    slide.addText("\u2192", {
      x: 4.8, y: yBase + 0.05, w: 0.6, h: 0.4,
      fontSize: 20, fontFace: "Arial", color: C.gray, align: "center", margin: 0
    });
    // Harness equivalent
    slide.addText(s.harness, {
      x: 5.5, y: yBase + 0.08, w: 3.5, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.teal, margin: 0
    });

    // Connecting line
    if (i < 4) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 1.055, y: yBase + 0.55, w: 0.02, h: 0.2, fill: { color: C.grayLight }
      });
    }
  });

  // ═══════════════════════════════════════════
  // SLIDE 21: Conclusion
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.teal }
  });

  slide.addText("\uD558\uB124\uC2A4 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1\uC740", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.7,
    fontSize: 18, fontFace: "Arial", color: C.gray, align: "center", margin: 0
  });

  slide.addText("\uBD84\uBA85 \uD14C\uD06C\uC9C0\uB9CC,\n\uD14C\uD06C\uAC00 \uC544\uB2C8\uB77C\n\uACBD\uC601\uD559\uC5D0 \uAC00\uAE5D\uC2B5\uB2C8\uB2E4", {
    x: 0.8, y: 1.7, w: 8.4, h: 2.0,
    fontSize: 32, fontFace: "Arial Black", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.3
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.0, y: 3.8, w: 2.0, h: 0.04, fill: { color: C.teal }
  });

  slide.addText("AI\uC5D0\uAC8C \uADF8\uB0E5 \uC77C\uC744 \uB358\uC9C0\uB294 \uAC8C \uC544\uB2C8\uB77C\n\uD300\uC758 \uB8F0\uACFC \uC791\uC5C5 \uBC29\uC2DD\uACFC \uAC80\uC99D \uAE30\uC900\uC744 \uC54C\uB824\uC8FC\uACE0\n\uADF8 \uC548\uC5D0\uC11C \uBC18\uBCF5\uC801\uC73C\uB85C \uC88B\uC740 \uACB0\uACFC\uBB3C\uC744 \uB9CC\uB4E4\uC5B4\uB0B4\uAC8C \uD558\uB294 \uAC83", {
    x: 0.8, y: 4.0, w: 8.4, h: 1.2,
    fontSize: 14, fontFace: "Arial", color: C.gray, align: "center", margin: 0,
    lineSpacingMultiple: 1.4
  });

  // ═══════════════════════════════════════════
  // SLIDE 22: Thank you
  // ═══════════════════════════════════════════
  slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.OVAL, {
    x: 3.0, y: -2.0, w: 4, h: 4, fill: { color: C.teal, transparency: 85 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 6.0, y: 3.0, w: 5, h: 5, fill: { color: C.teal, transparency: 90 }
  });

  slide.addText("\uAC10\uC0AC\uD569\uB2C8\uB2E4", {
    x: 0.8, y: 1.5, w: 8.4, h: 1.2,
    fontSize: 42, fontFace: "Arial Black", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.0, y: 2.8, w: 2.0, h: 0.04, fill: { color: C.teal }
  });

  slide.addText("\uC5D0\uC2A4\uD06C \uB3C4\uB9AC\uC758 \uB3C4\uB9AC", {
    x: 0.8, y: 3.1, w: 8.4, h: 0.6,
    fontSize: 20, fontFace: "Arial", color: C.tealLight,
    align: "center", margin: 0
  });

  slide.addText("\uD558\uB124\uC2A4 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1\uC73C\uB85C AI\uC640 \uD568\uAED8 \uB354 \uC88B\uC740 \uACB0\uACFC\uBB3C\uC744 \uB9CC\uB4E4\uC5B4\uBCF4\uC138\uC694!", {
    x: 0.8, y: 3.8, w: 8.4, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.gray,
    align: "center", margin: 0
  });

  // ─── Write ───
  const outPath = "/Users/inwon/Desktop/h/harness-engineering-askdori.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(console.error);
