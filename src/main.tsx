import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Layers3,
  LayoutDashboard,
  FolderOpen,
  History,
  Users,
  ChevronRight,
  ArrowRight,
  Plus,
  Search,
  Bell,
  ChevronDown,
  FileText,
  Code2,
  Upload,
  Sparkles,
  Download,
  Check,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ExternalLink,
  MessageSquare,
  Clock,
  X,
  Mail,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { seedText, resources, seedReports, type Report } from "./mockData";
import srData from "./srData.json";
import { standardDays, shiftWorkdays, workdaysBetween } from "./calendar";
import "./style.css";
const steps = ["자료 입력", "레거시 분석", "Mock 화면", "협의사항 도출"];
const hints = [
  "요구사항을 한곳에",
  "변경 범위와 근거 탐색",
  "화면으로 함께 협의",
  "결론을 다음 경험으로",
];
function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function download(name: string, text: string) {
  const u = URL.createObjectURL(
    new Blob([text], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
const starter = {
  title: "다운로드 센터 다중 선택 및 일괄 다운로드 개선",
  text: seedText,
  html: "",
  version: 1,
  generated: 0,
  analyzed: 0,
  mocked: 0,
  notes:
    "선택 개수는 최대 10개로 제한합니다. 언어별 다운로드를 제공하고 기존 상세 모달 스타일을 재사용합니다.",
  checks: [false, false],
};
function App() {
  const nav = useNavigate(),
    loc = useLocation();
  const section = loc.pathname.startsWith("/history")
    ? "history"
    : loc.pathname === "/team"
      ? "team"
      : "work";
  const [step, setStep] = useState(0),
    [draft, setDraft] = useState(() =>
      load("vibelation.workspace.v2", starter),
    ),
    [reports, setReports] = useState<Report[]>(() =>
      load("vibelation.reports.v2", seedReports),
    ),
    [inputTab, setInputTab] = useState("대화 · 텍스트"),
    [reportTab, setReportTab] = useState("요약"),
    [query, setQuery] = useState(""),
    [owner, setOwner] = useState("전체 담당자"),
    [filter, setFilter] = useState("전체"),
    [notice, setNotice] = useState(""),
    [selected, setSelected] = useState(0),
    [comparison, setComparison] = useState("적용 제안"),
    [materials, setMaterials] = useState([0, 1]),
    [sr, setSr] = useState<(typeof srData)[number] | null>(null),
    [mail, setMail] = useState(false);
  const update = (change: Partial<typeof starter>, revision = false) => {
    const next = {
      ...draft,
      ...change,
      ...(revision
        ? { version: draft.version + 1, checks: [false, false] }
        : {}),
    };
    setDraft(next);
    try {
      localStorage.setItem("vibelation.workspace.v2", JSON.stringify(next));
    } catch {
      setNotice("브라우저 저장 공간이 부족합니다.");
    }
  };
  const md = `# ${draft.title}\n\n요구사항 v${draft.version}\n\n## 원본 자료\n${draft.text}\n\n## 협의사항\n${draft.notes}\n\n## 수용 기준\n- 자료를 최대 10개 선택할 수 있다.\n- 선택한 언어의 파일만 다운로드한다.\n- 실패 및 일부 파일 누락 시 안내한다.\n\n## 변경 검토안 (시연용 제안)\n${resources.map((r) => "- " + r.file + ": " + r.proposed).join("\n")}\n\n## 미확정 사항\nZIP 최대 용량 및 서버 권한 검증 정책 확인 필요.\n예상 공수 8.5 MD는 시연값이며 FP 견적 MM이 아님.`;
  const activeReport = reports.find((r) => loc.pathname === "/history/" + r.id);
  const isFresh = draft.generated === draft.version;
  const analyzed = draft.analyzed === draft.version;
  const mocked = draft.mocked === draft.version;
  function register() {
    if (!draft.checks.every(Boolean) || !isFresh || !analyzed || !mocked) {
      setNotice(
        "최신 버전의 자료 정리·분석·Mock 생성과 두 가지 검토 확인을 완료해주세요.",
      );
      return;
    }
    const r = {
      id: crypto.randomUUID(),
      title: draft.title,
      date: new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }),
      author: "김기쁨",
      version: draft.version,
      summary: draft.notes,
      markdown: md,
    };
    const next = [r, ...reports];
    try {
      localStorage.setItem("vibelation.reports.v2", JSON.stringify(next));
      setReports(next);
      nav("/history/" + r.id);
      setNotice("현재 버전의 검토 리포트를 등록했습니다.");
    } catch {
      setNotice("저장 공간이 부족해 등록하지 못했습니다.");
    }
  }
  function preview(proposed = true) {
    return (
      <div className="product-preview">
        <div className="product-top">
          <b>My POSCO</b>
          <span>고객지원　⌄</span>
          <span>자료실</span>
        </div>
        <div className="product-body">
          <small>고객지원 / 다운로드 센터</small>
          <h2>다운로드 센터</h2>
          <p>필요한 제품 자료를 쉽고 빠르게 찾아보세요.</p>
          <div className="mini-tabs">
            <b>제품 카탈로그</b>
            <span>인증서</span>
            <span>업무지원자료</span>
          </div>
          <div className="mini-search">
            전체 제품군 <ChevronDown size={12} />
            <span>자료명으로 검색</span>
            <Search size={14} />
          </div>
          {proposed && (
            <div className="selection-bar">
              <span>
                선택 자료 <b>{String(materials.length).padStart(2, "0")}</b> /
                10
              </span>
              <span>
                한국어 · KOR <ChevronDown size={12} />
              </span>
              <button
                onClick={() =>
                  setNotice(
                    "시연 화면입니다. 실제 ZIP 다운로드는 연결하지 않았습니다.",
                  )
                }
              >
                선택 다운로드 <Download size={12} />
              </button>
            </div>
          )}
          <div className="material-grid">
            {[
              "열연 제품 카탈로그",
              "냉연 제품 카탈로그",
              "자동차 강판 안내",
            ].map((t, i) => (
              <div className="material" key={t}>
                {proposed && (
                  <input
                    aria-label={t + " 선택"}
                    type="checkbox"
                    checked={materials.includes(i)}
                    onChange={(e) =>
                      setMaterials(
                        e.target.checked
                          ? [...materials, i]
                          : materials.filter((m) => m !== i),
                      )
                    }
                  />
                )}
                <div className={"cover cover" + i}>
                  <span>
                    POSCO
                    <br />
                    STEEL
                  </span>
                  <div />
                  <small>
                    {["HOT ROLLED", "COLD ROLLED", "AUTOMOTIVE"][i]}
                  </small>
                </div>
                <b>{t}</b>
                <small>제품 소개 및 기술 자료</small>
                <span className="file-pill">PDF　 KOR ↓　 ENG ↓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const evaluated = srData.map((s) => {
    const days = s.type === "SR" ? standardDays(s.mm) : null;
    const deadline = days ? shiftWorkdays(s.start, days) : null;
    return { ...s, days, deadline, over: !!deadline && s.due > deadline };
  });
  const visible = evaluated.filter(
    (s) =>
      (owner === "전체 담당자" || s.owner === owner) &&
      (s.title + s.id).toLowerCase().includes(query.toLowerCase()) &&
      (filter === "전체" ||
        (filter === "표준 공기 검토" && s.over) ||
        (filter === "진행중" && s.status === "진행중") ||
        (filter === "완료일 임박" &&
          s.status === "진행중" &&
          s.due >= "2026-10-14" &&
          s.due <= shiftWorkdays("2026-10-14", 2)) ||
        (filter === "완료일 초과" &&
          s.status === "진행중" &&
          s.due < "2026-10-14")),
  );
  return (
    <div className="app">
      <aside>
        <NavLink to="/" className="brand">
          <span className="brand-symbol">
            <Layers3 size={23} />
          </span>
          <div>
            VIBELATION<small>상상을 현실로, 경험을 울림으로</small>
          </div>
        </NavLink>
        <div className="team-switch">
          <span className="team-icon">M</span>
          <div>
            MyPOSCO 운영팀<small>팀 워크스페이스</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <NavLink
          to="/"
          end
          className={section === "work" ? "nav-item active" : "nav-item"}
        >
          <LayoutDashboard size={18} />
          요청 작업실
        </NavLink>
        <NavLink to="/history" className="nav-item">
          <History size={18} />
          과거 검토 이력<span className="nav-count">{reports.length}</span>
        </NavLink>
        <NavLink to="/team" className="nav-item">
          <Users size={18} />팀 진행 현황
        </NavLink>
        <div className="aside-project">
          <span>분석 대상 프로젝트</span>
          <div>
            <span className="green-dot" /> MyPOSCO Demo
          </div>
          <small>Front · Back 소스 참조</small>
        </div>
        <div className="aside-bottom">
          <div className="help-box">
            <MessageSquare size={19} />
            <b>같이 보고, 근거로 판단해요.</b>
            <p>
              이번의 검토가 다음 업무의
              <br />
              좋은 시작이 됩니다.
            </p>
          </div>
          <div className="profile">
            <span className="avatar">김</span>
            <div>
              김기쁨<small>운영 담당자</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
      <div className="body">
        <header>
          <div>
            워크스페이스 <ChevronRight size={14} />
            <b>
              {section === "work"
                ? "요청 작업실"
                : section === "history"
                  ? "과거 검토 이력"
                  : "팀 진행 현황"}
            </b>
          </div>
          <div>
            <span className="demo-label">INTERACTIVE MOCK</span>
            <button
              className="icon-button"
              aria-label="알림"
              onClick={() => {
                nav("/team");
                setFilter("표준 공기 검토");
                setQuery("");
              }}
            >
              <Bell size={19} />
              <i />
            </button>
            <span className="avatar">김</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {section === "work"
                  ? "REQUEST WORKSPACE"
                  : section === "history"
                    ? "KNOWLEDGE ARCHIVE"
                    : "TEAM OVERVIEW"}
              </div>
              <h1>
                {section === "work"
                  ? "요청 작업실"
                  : section === "history"
                    ? "과거 검토 이력"
                    : "팀 진행 현황"}
              </h1>
              <p>
                {section === "work"
                  ? "흩어진 요구사항을 모으고, 우리 시스템에 맞는 변화로 연결합니다."
                  : section === "history"
                    ? "함께 검토한 근거와 결론이, 다음 요청의 시작이 됩니다."
                    : "함께하는 업무의 흐름과 놓치기 쉬운 일정을 한눈에 확인하세요."}
              </p>
            </div>
            {section === "work" ? (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "현재 작업은 초기화됩니다. 새 요청을 만들까요?",
                    )
                  ) {
                    update(
                      {
                        ...starter,
                        title: "새 개선 요청",
                        text: "",
                        generated: 0,
                        analyzed: 0,
                        mocked: 0,
                        checks: [false, false],
                      },
                      true,
                    );
                    setStep(0);
                  }
                }}
              >
                <Plus size={16} />새 요청
              </button>
            ) : (
              <span className="date-chip">
                <Clock size={14} />
                2026. 10. 14 기준
              </span>
            )}
          </div>
          {notice && (
            <div className="toast" role="status">
              <CheckCircle2 size={17} />
              {notice}
              <button aria-label="알림 닫기" onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}
          {section === "work" ? (
            <>
              <div className="request-banner">
                <div className="request-icon">
                  <FolderOpen size={23} />
                </div>
                <div>
                  <div className="request-meta">
                    <span>REQ-2026-014</span>
                    <span className="tag blue">협의 진행중</span>
                    <span>요구사항 v{draft.version}</span>
                  </div>
                  <input
                    aria-label="요청 제목"
                    className="title-input"
                    value={draft.title}
                    onChange={(e) => update({ title: e.target.value }, true)}
                  />
                </div>
                <div className="banner-right">
                  <span className="avatar pale">김</span>
                  <span>
                    김기쁨<small>담당자</small>
                  </span>
                  <span className="divider" />
                  <small>브라우저에 자동 저장</small>
                </div>
              </div>
              <div className="stepper">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    className={step === i ? "step active" : "step"}
                    onClick={() => setStep(i)}
                  >
                    <span className="step-number">{i + 1}</span>
                    <span>
                      <b>{s}</b>
                      <small>{hints[i]}</small>
                    </span>
                    {i < 3 && <ChevronRight size={18} />}
                  </button>
                ))}
              </div>
              <div className="section-caption">
                <div>
                  <span className="section-kicker">STEP 0{step + 1}</span>
                  <h2>
                    {
                      [
                        "자료에서 시작하는 명확한 요구사항",
                        "소스에서 찾는 변경의 근거",
                        "같은 화면을 보며 맞추는 구현 방향",
                        "함께 정한 결론을 다음 경험으로",
                      ][step]
                    }
                  </h2>
                </div>
                <span className="subtle">
                  <RefreshCw size={14} />
                  협의 중 언제든 이전 단계로 돌아갈 수 있어요
                </span>
              </div>
              {step === 0 ? (
                <div className="input-grid">
                  <section className="panel input-panel">
                    <div className="panel-heading">
                      <h3>
                        <MessageSquare size={17} />
                        요구사항 입력
                      </h3>
                      <span className="tag">원본 자료</span>
                    </div>
                    <div className="input-tabs">
                      {["대화 · 텍스트", "HTML", "PPT"].map((t) => (
                        <button
                          className={inputTab === t ? "selected" : ""}
                          key={t}
                          onClick={() => setInputTab(t)}
                        >
                          {t === "HTML" ? (
                            <Code2 size={14} />
                          ) : t === "PPT" ? (
                            <Upload size={14} />
                          ) : (
                            <MessageSquare size={14} />
                          )}{" "}
                          {t}
                        </button>
                      ))}
                    </div>
                    {inputTab === "대화 · 텍스트" ? (
                      <>
                        <div className="field-label">
                          Teams 대화 · 회의록 · 메일
                          <button
                            className="text-button"
                            onClick={() => update({ text: seedText }, true)}
                          >
                            샘플 불러오기
                          </button>
                        </div>
                        <textarea
                          className="conversation"
                          aria-label="요구사항 원문"
                          value={draft.text}
                          onChange={(e) =>
                            update({ text: e.target.value }, true)
                          }
                          placeholder="전달받은 대화나 요구사항을 붙여넣어 주세요."
                        />
                        <div className="input-tip">
                          <FileText size={14} />
                          대화의 맥락과 확인할 조건을 함께 정리합니다.
                        </div>
                      </>
                    ) : inputTab === "HTML" ? (
                      <>
                        <p className="muted">
                          HTML을 붙여넣고 화면 구체화를 누르면 미리보기에
                          반영됩니다.
                        </p>
                        <textarea
                          className="conversation code"
                          aria-label="요구사항 HTML"
                          placeholder="<main>…</main>"
                          value={draft.html}
                          onChange={(e) =>
                            update({ html: e.target.value }, true)
                          }
                        />
                      </>
                    ) : (
                      <div className="upload-box">
                        <Upload size={30} />
                        <h3>PPT 자료 첨부</h3>
                        <p>
                          이번 Mock에서는 파일명만 확인합니다.
                          <br />
                          슬라이드 추출은 추후 연결 예정입니다.
                        </p>
                        <input
                          aria-label="PPT 파일 선택"
                          type="file"
                          accept=".ppt,.pptx"
                          onChange={(e) =>
                            setNotice(
                              (e.target.files?.[0]?.name || "파일") +
                                " 선택됨 · 내용 분석은 미연결입니다.",
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="panel-actions">
                      <span className="muted">
                        {draft.text.length.toLocaleString()}자 입력됨
                      </span>
                      <button
                        className="primary"
                        disabled={!draft.text.trim() && !draft.html.trim()}
                        onClick={() => {
                          update({ generated: draft.version });
                          setNotice(
                            "시연용 화면과 요구사항 MD 초안을 준비했습니다.",
                          );
                        }}
                      >
                        <Sparkles size={15} />
                        화면 구체화
                      </button>
                    </div>
                  </section>
                  <section className="panel preview-panel">
                    <div className="panel-heading">
                      <h3>
                        <LayoutDashboard size={17} />
                        요구 화면 미리보기
                      </h3>
                      <span className="tag blue">현업의 원하는 모습</span>
                    </div>
                    <div className="preview-toolbar">
                      <span>
                        <span className="green-dot" />{" "}
                        {isFresh ? "현재 버전 반영" : "샘플 미리보기"}
                      </span>
                      <span>HTML PREVIEW</span>
                    </div>
                    {draft.html && isFresh ? (
                      <iframe
                        title="입력 HTML 미리보기"
                        sandbox=""
                        referrerPolicy="no-referrer"
                        srcDoc={
                          "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; style-src 'unsafe-inline'; img-src data:\"><style>body{font-family:sans-serif;padding:24px}</style>" +
                          draft.html
                        }
                      />
                    ) : (
                      preview(true)
                    )}
                    <div className="preview-bottom">
                      <span className="tag">초기 화면 초안</span>
                      <small>시스템 제약은 다음 단계에서 검토합니다.</small>
                    </div>
                  </section>
                  <section className="panel md-panel">
                    <div className="panel-heading">
                      <h3>
                        <FileText size={17} />
                        요구사항 MD
                      </h3>
                      <button
                        className="icon-button"
                        aria-label="요구사항 MD 다운로드"
                        disabled={!isFresh}
                        onClick={() => download("요구사항-초안.md", md)}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="document">
                      <div className="document-name">
                        <FileText size={14} />
                        요구사항_초안.md<span>DRAFT</span>
                      </div>
                      <span className="tag amber">
                        {isFresh ? "현재 버전 초안" : "구체화 전 · 예시"}
                      </span>
                      <h3>1. 요청 배경</h3>
                      <p>
                        자료별 반복 다운로드를 줄이고 필요한 파일을 한 번에
                        확보합니다.
                      </p>
                      <h3>2. 기능 요구사항</h3>
                      <ol>
                        <li>자료 다중 선택 및 선택 개수 표시</li>
                        <li>최대 10개 파일 일괄 다운로드</li>
                        <li>다운로드 언어 선택</li>
                        <li>다운로드 이력 확인</li>
                      </ol>
                      <h3>3. 확인할 사항</h3>
                      <div className="question">
                        ZIP 용량 제한은 얼마인가요?
                      </div>
                      <div className="question">
                        일부 파일 누락 시 처리 방식은?
                      </div>
                      <p className="muted">
                        입력에 대한 실제 AI 추출은 미연결입니다. 현재 내용은
                        다운로드 센터 시연 시나리오입니다.
                      </p>
                    </div>
                  </section>
                </div>
              ) : step === 1 ? (
                <>
                  <div className="info-strip">
                    <GitBranch size={17} />
                    <b>MyPOSCO Demo</b>
                    <span>Front + Back · 제공된 ZIP 소스 기준</span>
                    <button
                      onClick={() => {
                        update({ analyzed: draft.version });
                        setNotice(
                          "다운로드 센터 시나리오의 변경 제안을 현재 버전에 연결했습니다.",
                        );
                      }}
                      className="primary"
                    >
                      <Sparkles size={14} />
                      영향도 분석 {analyzed && <Check size={14} />}
                    </button>
                  </div>
                  <div className="analysis-grid">
                    <section className="panel">
                      <div className="panel-heading">
                        <h3>수정 · 검토 자원</h3>
                        <span className="tag blue">4개 후보</span>
                      </div>
                      {resources.map((r, i) => (
                        <button
                          className={
                            "resource " + (selected === i ? "selected" : "")
                          }
                          key={r.file}
                          onClick={() => setSelected(i)}
                        >
                          <span className={"type-icon type-" + r.kind}>
                            {r.kind}
                          </span>
                          <span>
                            <b>{r.name}</b>
                            <small>{r.file}</small>
                          </span>
                          <ChevronRight size={15} />
                        </button>
                      ))}
                    </section>
                    <section className="panel">
                      <div className="panel-heading">
                        <h3>{resources[selected].name}</h3>
                        <span className="tag">변경 제안 · 미적용</span>
                      </div>
                      <div className="resource-detail">
                        <code>{resources[selected].file}</code>
                        <div className="diff before">
                          <span>− 현재 구조</span>
                          <p>{resources[selected].current}</p>
                        </div>
                        <div className="diff after">
                          <span>+ 변경 방향</span>
                          <p>{resources[selected].proposed}</p>
                        </div>
                        <h3>연결 근거</h3>
                        <p>
                          자료 선택 및 일괄 다운로드 요구가 해당 화면·로직·API에
                          영향을 줍니다. 파일 경로는 제공 소스 기준이며 변경안과
                          공수는 시연용입니다.
                        </p>
                        <span className="tag blue">
                          잠정 공수 {resources[selected].days} MD
                        </span>
                      </div>
                    </section>
                    <section className="panel review-panel">
                      <div className="panel-heading">
                        <h3>
                          <AlertTriangle size={17} />
                          담당자 검토 필요
                        </h3>
                      </div>
                      <div className="resource-detail">
                        <span className="tag amber">HUMAN IN THE LOOP</span>
                        <h3>기존 상세 모달 재사용 범위</h3>
                        <p>
                          파일 상세 정보용 모달에 다중 선택 결과와 오류를 모두
                          표시할 수 있는지 검토가 필요합니다.
                        </p>
                        <h3>ZIP 생성과 권한 검증</h3>
                        <p>
                          최대 용량, 일부 파일 누락, 파일 접근 권한을 서버에서
                          검증하는 정책이 필요합니다.
                        </p>
                        <label>
                          검토 의견
                          <textarea
                            value={draft.notes}
                            onChange={(e) =>
                              update({ notes: e.target.value }, true)
                            }
                          />
                        </label>
                      </div>
                    </section>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <div className="info-strip">
                    <span className="tag blue">화면으로 협의</span>
                    <span>원하는 모습과 시스템 제약을 함께 반영합니다.</span>
                    <button
                      className="primary"
                      onClick={() => {
                        update({ mocked: draft.version });
                        setNotice(
                          "현재 요구사항 버전의 시스템 적용 Mock을 생성했습니다.",
                        );
                      }}
                    >
                      <Sparkles size={15} />
                      시스템 Mock 생성
                    </button>
                  </div>
                  <div className="mock-grid">
                    <section className="panel">
                      <div className="panel-heading">
                        <h3>다운로드 센터</h3>
                        <div className="segmented">
                          {["현재 시스템", "적용 제안"].map((t) => (
                            <button
                              className={comparison === t ? "selected" : ""}
                              key={t}
                              onClick={() => setComparison(t)}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {preview(comparison === "적용 제안")}
                      <div className="preview-bottom">
                        <span className="tag blue">
                          {mocked ? "현재 버전 Mock" : "시연용 예시"}
                        </span>
                        <small>공통 색상·버튼·모달 스타일을 반영한 제안</small>
                      </div>
                    </section>
                    <section className="panel">
                      <div className="panel-heading">
                        <h3>
                          <MessageSquare size={17} />
                          화면 협의 노트
                        </h3>
                        <span className="tag">v{draft.version}</span>
                      </div>
                      <div className="resource-detail">
                        <div className="note">
                          <span className="avatar pale">김</span>
                          <div>
                            <b>
                              김기쁨 <small>운영 담당자</small>
                            </b>
                            <p>
                              선택 다운로드는 목록 상단에 배치하면 선택 상태를
                              확인하기 좋겠습니다.
                            </p>
                          </div>
                        </div>
                        <label>
                          이번 버전 협의사항
                          <textarea
                            className="notes"
                            value={draft.notes}
                            onChange={(e) =>
                              update({ notes: e.target.value }, true)
                            }
                          />
                        </label>
                        <div className="callout">
                          <RefreshCw size={16} />
                          <p>
                            요구사항이나 의견을 수정하면 이전 분석과 Mock은
                            재검토 대상으로 표시됩니다.
                          </p>
                        </div>
                        <button onClick={() => setStep(0)}>
                          <Plus size={14} />
                          자료 추가 · 요구사항 수정
                        </button>
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <ReportContent
                    title={draft.title}
                    summary={draft.notes}
                    tab={reportTab}
                    setTab={setReportTab}
                  />
                  <section className="panel confirm-panel">
                    <div>
                      <h3>최종 검토 후 이력에 등록</h3>
                      <p>등록한 리포트는 당시 버전의 기록으로 보관됩니다.</p>
                    </div>
                    <div>
                      {[
                        "합의 범위와 제외 범위를 확인했습니다.",
                        "수정 자원·예상 공수·미확정 사항을 검토했습니다.",
                      ].map((t, i) => (
                        <label className="check-label" key={t}>
                          <input
                            type="checkbox"
                            checked={draft.checks[i]}
                            onChange={(e) =>
                              update({
                                checks: draft.checks.map((c, j) =>
                                  i === j ? e.target.checked : c,
                                ),
                              })
                            }
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                    <button className="primary" onClick={register}>
                      <CheckCircle2 size={16} />
                      확정 · 리포트 등록
                    </button>
                  </section>
                </>
              )}
              <div className="workflow-footer">
                <span>
                  <span className="green-dot" />
                  로컬 Mock · 실제 AI 분석 및 외부 시스템 연동 전
                </span>
                <div>
                  {step > 0 && (
                    <button onClick={() => setStep(step - 1)}>
                      <ArrowLeft size={15} />
                      이전 단계
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className="primary"
                      onClick={() => setStep(step + 1)}
                    >
                      {steps[step + 1]}
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button onClick={() => download("최종-협의사항.md", md)}>
                      <Download size={15} />
                      협의 MD 다운로드
                    </button>
                  )}
                </div>
              </div>
              {((draft.generated > 0 && !isFresh) ||
                (draft.analyzed > 0 && !analyzed) ||
                (draft.mocked > 0 && !mocked)) && (
                <div className="stale-warning">
                  <AlertTriangle size={16} />
                  요구사항이 변경되었습니다. 자료 구체화 → 영향도 분석 → 시스템
                  Mock을 현재 버전으로 갱신해주세요.
                </div>
              )}
            </>
          ) : section === "history" ? (
            activeReport ? (
              <>
                <button
                  className="text-button back-link"
                  onClick={() => nav("/history")}
                >
                  <ArrowLeft size={15} />
                  리포트 목록
                </button>
                <div className="report-meta">
                  <span className="tag green">검토 확정</span>
                  <span>
                    {activeReport.date} · {activeReport.author} · 요구사항 v
                    {activeReport.version}
                  </span>
                  <button
                    onClick={() =>
                      download(
                        activeReport.title + ".md",
                        "markdown" in activeReport
                          ? String(activeReport.markdown)
                          : "# " +
                              activeReport.title +
                              "\n\n" +
                              activeReport.summary,
                      )
                    }
                  >
                    <Download size={15} />
                    리포트 다운로드
                  </button>
                </div>
                <ReportContent
                  title={activeReport.title}
                  summary={activeReport.summary}
                  tab={reportTab}
                  setTab={setReportTab}
                  generic={activeReport.id !== "demo-download"}
                />
              </>
            ) : (
              <>
                <div className="archive-banner">
                  <div>
                    <span className="section-kicker">TEAM KNOWLEDGE</span>
                    <h2>이번의 검토가, 다음의 근거로.</h2>
                    <p>확정된 협의와 검토 결과를 찾아 업무에 활용하세요.</p>
                  </div>
                  <div className="archive-count">
                    <b>{reports.length.toString().padStart(2, "0")}</b>
                    <span>누적 검토 리포트</span>
                  </div>
                </div>
                <div className="list-toolbar">
                  <h3>
                    검토 리포트{" "}
                    <span>
                      {reports.filter((r) => r.title.includes(query)).length}
                    </span>
                  </h3>
                  <div className="search">
                    <Search size={16} />
                    <input
                      aria-label="리포트 제목 검색"
                      placeholder="리포트 제목으로 검색"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="report-list">
                  {reports
                    .filter((r) => r.title.includes(query))
                    .map((r) => (
                      <button
                        className="report-row"
                        key={r.id}
                        onClick={() => {
                          nav("/history/" + r.id);
                          setReportTab("요약");
                        }}
                      >
                        <span className="report-icon">
                          <FileText size={24} />
                        </span>
                        <div>
                          <div className="row-tags">
                            <span className="tag blue">MyPOSCO</span>
                            <span className="tag green">검토 확정</span>
                          </div>
                          <h3>{r.title}</h3>
                          <p>{r.summary}</p>
                          <small>
                            {r.date}　·　{r.author}　·　v{r.version}
                          </small>
                        </div>
                        <ArrowRight size={19} />
                      </button>
                    ))}
                  {!reports.some((r) => r.title.includes(query)) && (
                    <div className="empty">
                      검색 결과가 없습니다. 다른 제목으로 검색해주세요.
                    </div>
                  )}
                </div>
              </>
            )
          ) : (
            <>
              <div className="stats">
                {[
                  [
                    "진행중",
                    evaluated.filter((s) => s.status === "진행중").length,
                    "진행중",
                  ],
                  [
                    "완료일 초과",
                    evaluated.filter(
                      (s) => s.status === "진행중" && s.due < "2026-10-14",
                    ).length,
                    "완료일 초과",
                  ],
                  [
                    "표준 공기 검토",
                    evaluated.filter((s) => s.over).length,
                    "표준 공기 검토",
                  ],
                  ["전체 등록 SR", srData.length, "전체"],
                ].map(([title, num, f], i) => (
                  <button
                    key={title}
                    className={"stat stat" + i}
                    onClick={() => setFilter(String(f))}
                  >
                    <span>
                      {title}
                      <span className="stat-symbol">
                        {i === 2 ? (
                          <AlertTriangle size={19} />
                        ) : (
                          <Clock size={19} />
                        )}
                      </span>
                    </span>
                    <strong>
                      {num}
                      <small>건</small>
                    </strong>
                    <p>
                      {
                        [
                          "팀 담당자의 진행 중 업무",
                          "요청완료일이 지난 미완료 건",
                          "등록 일정 기준 · 완료 건 포함",
                          "제공된 Excel 데이터",
                        ][i]
                      }
                    </p>
                  </button>
                ))}
              </div>
              <div className="team-notice">
                <AlertTriangle size={19} />
                <div>
                  <b>표준 공기와 요청완료일을 함께 확인하세요.</b>
                  <p>
                    2026년 주말·공휴일 제외, 등록 다음 근무일부터 계산한 시연
                    결과입니다. 특이 SR은 담당자 검토 후 신청합니다.
                  </p>
                </div>
              </div>
              <section className="panel sr-panel">
                <div className="list-toolbar">
                  <div className="segmented">
                    {[
                      "전체",
                      "진행중",
                      "완료일 임박",
                      "완료일 초과",
                      "표준 공기 검토",
                    ].map((t) => (
                      <button
                        key={t}
                        className={filter === t ? "selected" : ""}
                        onClick={() => setFilter(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="table-controls">
                    <select
                      aria-label="담당자 필터"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    >
                      {["전체 담당자", "김기쁨", "박지현", "이가은"].map(
                        (o) => (
                          <option key={o}>{o}</option>
                        ),
                      )}
                    </select>
                    <div className="search">
                      <Search size={15} />
                      <input
                        aria-label="SR 검색"
                        placeholder="SR 번호, 제목 검색"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {[
                          "SR / 개선 요청",
                          "담당자",
                          "상태 · 처리단계",
                          "등록일 / 요청완료일",
                          "FP MM",
                          "표준 기한",
                          "검토 알림",
                        ].map((t) => (
                          <th key={t}>{t}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((s) => (
                        <tr
                          key={s.key}
                          onClick={() => {
                            setSr(s);
                            setMail(false);
                          }}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSr(s);
                              setMail(false);
                            }
                          }}
                        >
                          <td>
                            <small className="sr-id">
                              {s.id} · {s.type}
                            </small>
                            <b>{s.title}</b>
                          </td>
                          <td>{s.owner}</td>
                          <td>
                            <span
                              className={
                                "tag " +
                                (s.status === "완료" ? "green" : "blue")
                              }
                            >
                              {s.status}
                            </span>
                            <small>{s.stage}</small>
                          </td>
                          <td>
                            {s.start}
                            <small>{s.due}</small>
                          </td>
                          <td>
                            <b>{s.mm}</b>
                            <small>
                              {s.days ? s.days + " 근무일" : "기준 확인"}
                            </small>
                          </td>
                          <td>{s.deadline || "판정 보류"}</td>
                          <td>
                            <span className={"tag " + (s.over ? "amber" : "")}>
                              {s.over
                                ? "표준 공기 초과"
                                : s.days
                                  ? "기준 이내"
                                  : "유형 확인"}
                            </span>
                            <ChevronRight size={13} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!visible.length && (
                    <div className="empty">조건에 맞는 SR이 없습니다.</div>
                  )}
                </div>
                <div className="table-bottom">
                  총 {visible.length}건 · 행을 선택하면 계산 근거와 조정 제안을
                  확인할 수 있습니다.
                  <span>원본 상태와 계산 경고는 별도 관리</span>
                </div>
              </section>
              <div className="footnote">
                실제 완료일이 없어 완료 건의 실제 지연은 판정하지 않습니다.
                RR/ITSM은 적용 기준 확인 전 계산을 보류합니다. Teams 실제 알림
                발송은 미연결입니다.
              </div>
            </>
          )}
          <footer>
            VIBELATION<span>상상을 현실로, 경험을 울림으로</span>
            <span>AX HACKATHON 2026 · DESIGN MOCK</span>
          </footer>
        </main>
      </div>
      {sr && (
        <div className="modal-backdrop" onClick={() => setSr(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="SR 검토 상세"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-heading">
              <h3>SR 일정 · 표준 공기 검토</h3>
              <button
                className="icon-button"
                aria-label="상세 닫기"
                onClick={() => setSr(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <span className="tag blue">{sr.id}</span>
              <h2>{sr.title}</h2>
              <p>
                {sr.owner} · {sr.status} / {sr.stage}
              </p>
              <div className="detail-grid">
                {[
                  ["요청처리일", sr.start],
                  ["요청완료일", sr.due],
                  ["FP 견적 MM", sr.mm],
                  [
                    "표준 처리일",
                    sr.type === "SR"
                      ? standardDays(sr.mm) + " 근무일"
                      : "적용 기준 확인 필요",
                  ],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
              {sr.type === "SR" && standardDays(sr.mm) ? (
                <>
                  <div className="callout">
                    <AlertTriangle size={18} />
                    <div>
                      <b>
                        표준 기한{" "}
                        {shiftWorkdays(sr.start, standardDays(sr.mm)!)}
                      </b>
                      <p>
                        등록 일정 {workdaysBetween(sr.start, sr.due)} 근무일 /
                        허용 {standardDays(sr.mm)} 근무일
                      </p>
                      <p>
                        {sr.due > shiftWorkdays(sr.start, standardDays(sr.mm)!)
                          ? "요청완료일이 표준 기한보다 늦습니다. 특이 SR 검토가 필요합니다."
                          : "등록 일정이 표준 처리기간 이내입니다."}
                      </p>
                    </div>
                  </div>
                  {sr.due > shiftWorkdays(sr.start, standardDays(sr.mm)!) && (
                    <>
                      <h3>등록일 조정 제안</h3>
                      <p className="proposed-date">
                        {sr.start} <ArrowRight size={18} />{" "}
                        <b>{shiftWorkdays(sr.due, -standardDays(sr.mm)!)}</b>
                      </p>
                      <p className="muted">
                        요청완료일에서 표준 근무일을 역산한 제안입니다. 원본
                        날짜는 변경하지 않습니다.
                      </p>
                      <button onClick={() => setMail(!mail)}>
                        <Mail size={16} />
                        특이 SR 요청 메일 초안
                      </button>
                      {mail && (
                        <>
                          <textarea
                            aria-label="특이 SR 메일 초안"
                            className="mail-draft"
                            defaultValue={`제목: [특이 SR 검토 요청] ${sr.id} 지연 처리 해제 요청\n\n${sr.title}\nFP 견적: ${sr.mm} MM / 표준 처리일: ${standardDays(sr.mm)} 근무일\n요청처리일: ${sr.start}\n요청완료일: ${sr.due}\n조정 제안일: ${shiftWorkdays(sr.due, -standardDays(sr.mm)!)}\n\n사유: [등록 경위와 실제 작업 일정 확인 후 작성]\n위 기준에 따른 특이 SR 등록 및 지연 처리 해제 검토를 요청드립니다.`}
                          />
                          <small>
                            실제 메일·Teams 발송 없이 초안만 제공합니다.
                          </small>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p>해당 분류의 표준 공기 적용 기준 확인이 필요합니다.</p>
              )}
              <div className="human-check">
                <CheckCircle2 size={18} />
                조정 제안은 담당자 검토와 승인 후 SR 시스템에서 처리합니다.
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function ReportContent({
  title,
  summary,
  tab,
  setTab,
  generic = false,
}: {
  title: string;
  summary: string;
  tab: string;
  setTab: (t: string) => void;
  generic?: boolean;
}) {
  return (
    <section className="panel report-content">
      <div className="report-heading">
        <span className="section-kicker">REVIEW REPORT</span>
        <h2>{title}</h2>
        <p>
          협의사항 기반 검토결과 리포트{" "}
          <span className="tag">시연용 검토안</span>
        </p>
      </div>
      <div className="report-tabs">
        {[
          "요약",
          "영향도 분석",
          "수정 자원",
          "유사 사례",
          "공수",
          "구현 방안",
          "검토 의견",
        ].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="report-body">
        {tab === "요약" ? (
          <>
            <div className="report-stats">
              {[
                ["전체 영향도", "중간", "화면 · API · 데이터 연계"],
                [
                  "예상 공수",
                  generic ? "검토 필요" : "8.5 MD",
                  "시연값 · FP MM과 별개",
                ],
                [
                  "재사용 후보",
                  generic ? "확인 필요" : "3개",
                  "기존 공통 자원 활용 검토",
                ],
                ["협의 상태", "검토안", "미확정 조건 확인 필요"],
              ].map(([a, b, c]) => (
                <div key={a}>
                  <span>{a}</span>
                  <strong>{b}</strong>
                  <small>{c}</small>
                </div>
              ))}
            </div>
            <div className="report-columns">
              <article>
                <h3>주요 검토 결과</h3>
                <p>{summary}</p>
                {(generic
                  ? [
                      "해당 업무의 수정 대상 확인",
                      "기존 자원과의 연계 검토",
                      "수용 기준과 제외 범위 확인",
                    ]
                  : [
                      "공통 버튼·모달 스타일 재사용 검토",
                      "최대 10개 선택과 언어 조건 검증",
                      "ZIP 응답 및 다운로드 이력 연계 설계",
                    ]
                ).map((t) => (
                  <p className="check-line" key={t}>
                    <CheckCircle2 size={16} />
                    {t}
                  </p>
                ))}
              </article>
              <article>
                <h3>합의 범위 · 확인할 사항</h3>
                <p>합의된 기능과 제외 범위를 명확히 구분합니다.</p>
                <div className="callout">
                  <AlertTriangle size={17} />
                  <span>
                    서버 처리 한계, 접근 권한 및 예외 처리 정책은 담당자 확인 후
                    확정합니다.
                  </span>
                </div>
                <p className="muted">
                  실제 분석·공수 예측이 아닌 화면 시연용 결과입니다.
                </p>
              </article>
            </div>
          </>
        ) : tab === "영향도 분석" || tab === "수정 자원" ? (
          <div>
            {generic ? (
              <p>
                이 시연 리포트에는 상세 자원 분석 데이터가 연결되지 않았습니다.
              </p>
            ) : (
              resources.map((r) => (
                <div className="report-resource" key={r.file}>
                  <span className={"type-icon type-" + r.kind}>{r.kind}</span>
                  <div>
                    <h3>{r.name}</h3>
                    <code>{r.file}</code>
                    <p>{r.proposed}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : tab === "유사 사례" ? (
          <>
            <h3>고객 Inq 엑셀 일괄 다운로드 개선</h3>
            <p>제공된 SR 데이터의 과거 사례를 참고하는 화면 예시입니다.</p>
            <div className="diff after">
              공통점: 조회 결과 다운로드와 이력 관리
            </div>
            <div className="diff before">
              차이점: 이번 요청은 여러 문서 파일을 선택하여 ZIP으로 묶는
              기능입니다. 동일 공수를 그대로 적용하지 않습니다.
            </div>
          </>
        ) : tab === "공수" ? (
          <>
            <h3>작업별 잠정 공수 · 시연값</h3>
            <table>
              <thead>
                <tr>
                  <th>작업</th>
                  <th>예상 공수</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{r.days} MD</td>
                  </tr>
                ))}
                <tr>
                  <td>통합 검증 및 예외 처리</td>
                  <td>2 MD</td>
                </tr>
              </tbody>
            </table>
            <p className="muted">
              총 8.5 MD. FP 견적 MM 및 표준 공기 계산에 자동 반영되지 않습니다.
            </p>
          </>
        ) : tab === "구현 방안" ? (
          <>
            <h3>기존 화면 구조를 유지한 점진적 확장</h3>
            <ol>
              <li>선택 상태와 개수 제한 UI 추가</li>
              <li>서버 다운로드 요청 및 파일 접근 검증 설계</li>
              <li>실패 처리와 이력 연계 구현</li>
              <li>요구사항별 수용 기준 검증</li>
            </ol>
          </>
        ) : (
          <>
            <h3>담당자 확인 · 남은 의사결정</h3>
            <p>{summary}</p>
            <div className="callout">
              <AlertTriangle size={17} />
              변경 제안은 코드에 적용되지 않았습니다. 구현 전 소스와 운영 제약을
              검토해주세요.
            </div>
          </>
        )}
      </div>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
