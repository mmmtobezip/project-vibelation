export const seedText = `김현업  10:24\n다운로드 센터에서 필요한 자료를 여러 개 선택해서 한 번에 내려받고 싶어요.\n\n박운영  10:27\n현재는 파일마다 KOR / ENG 버튼을 눌러야 합니다. 선택한 자료를 ZIP으로 받는 방식이면 될까요?\n\n김현업  10:32\n네, 언어도 선택하고 싶어요. 최대 10개까지면 충분합니다. 다운로드 이력도 확인할 수 있으면 좋겠어요.`;
export const resources = [
  {
    kind: "UI",
    name: "다운로드 센터 화면",
    file: "pages/download-center/download-center.html",
    current: "언어별 개별 다운로드 링크",
    proposed: "자료 선택 체크박스와 선택 다운로드 영역 추가",
    days: 1.5,
  },
  {
    kind: "Logic",
    name: "선택 상태 · 모달",
    file: "js/download-center/downloadCenterPage.js",
    current: "개별 파일 링크 · 상세 모달",
    proposed: "선택 상태 및 최대 10개 검증, 기존 모달 스타일 재사용",
    days: 2,
  },
  {
    kind: "API",
    name: "다운로드 API",
    file: "flow/DownloadCenterFlow.java",
    current: "자료 목록·상세 조회 엔드포인트",
    proposed: "일괄 다운로드 요청 및 ZIP 응답 API 신규 설계",
    days: 2,
  },
  {
    kind: "DB",
    name: "다운로드 이력",
    file: "db/init/04_download_history.sql",
    current: "다운로드 이력 스키마 자원 존재",
    proposed: "일괄 다운로드와 이력 저장의 연계 방식 검토",
    days: 1,
  },
];
export type Report = {
  id: string;
  title: string;
  date: string;
  author: string;
  version: number;
  summary: string;
};
export const seedReports: Report[] = [
  {
    id: "demo-download",
    title: "다운로드 센터 다중 선택 및 일괄 다운로드 개선",
    date: "2026-10-13",
    author: "김기쁨",
    version: 2,
    summary: "선택 다운로드와 언어별 ZIP 생성, 다운로드 이력 연계 검토",
  },
  {
    id: "demo-faq",
    title: "FAQ 검색 조건 및 카테고리 탐색 개선",
    date: "2026-10-12",
    author: "이가은",
    version: 1,
    summary: "카테고리와 키워드 복합 검색, 공통 검색 UI 재사용 검토",
  },
  {
    id: "demo-guide",
    title: "고객지원 자료 상세 안내 개선",
    date: "2026-10-08",
    author: "박지현",
    version: 1,
    summary: "자료 상세 모달의 안내 영역과 파일 정보 표현 개선",
  },
];
