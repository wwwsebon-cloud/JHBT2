# 지후배틀 2 (JHBT2) BETA

index.html 하나가 게임 전체 (빌드 없음). 로컬 테스트: `python -m http.server 8766`

- 버전: `index.html` 안 `<meta name="jhbt2-version">` · 잠수함 패치(버전 그대로)마다 `<meta name="jhbt2-build">` +1
- 구역 지도 (index.html 상단 주석): CONFIG → RARITY → CHARS(캐릭터 데이터) → STATUS → 시드 난수 → 저장·계정 → **리터보드·Firebase** → 엔진 → 라운드·배치 → 가차 → 리더보드 화면 → 업데이트 시스템 → 시작

## 0.6.0 — 리더보드 · 업데이트 시스템

### 리더보드 (파이어베이스)
- 저장소: 전작과 같은 Firebase 프로젝트(`jihoobattle`)의 **`jhbt2lb` 컬렉션** 재사용
- 접근: **익명 인증**으로 자기 문서(`jhbt2lb/<uid>`)만 쓰고 최대 50명을 승수 기준으로 읽음
- 규칙: 이 저장소의 `firestore.rules` (Firebase 콘솔 → Firestore → 규칙에 붙여넣어 게시)

**운영 체크리스트 (콘솔에서 2가지):**
1. Authentication → Sign-in method → **Anonymous** 사용 설정
2. Firestore Database → **규칙** 탭에 `firestore.rules` 내용 게시 (전작 규칙을 그대로 쓰고 있다면 `match /jhbt2lb/...` 블록만 추가)

문제가 생기면 로비 → 리더보드 화면에 에러 코드가 그대로 표시됨 (예: `auth/operation-not-allowed` = 익명 인증 미설정).

### 업데이트 시스템 (잠수함 패치 · 전작 5.7.5 이식)
- 스스로 5분마다 + 탭을 다시 볼 때 서버 index.html 앞 4KB만 읽어 배포 버전을 확인
- 새 버전(또는 build 증가) 감지 → **"새 버전이 도착했어요 · 새로고침"** 오버레이를 띄움
  - 전투(배치/전투/라운드 종료) 도중에는 기다렸다가 뜬다
- PWA: `manifest.webmanifest` + `sw.js`(오프라인 캐시) + `icons/` — 홈 화면에 추가 가능
- 새 패치 올리는 방법: version 메타를 바꾸거나 build 숫자만 +1 → 커밋/푸시하면 끝. 열려 있던 유저 화면에 알림이 뜬다

## 기타
- 리더보드 오프라인/에러 시 게임은 계속 작동 (전적은 기기에만 저장)
- `window.__jb2` (콘솔): BETA 테스트용 훅 — `__jb2.lbLoad()`, `__jb2.fbInit()` 등
- 전작에서 이식된 것: 물리 엔진(STEP 1/60) · 시드 난수(mulberry32) · 업데이트 오버레이 UX · sw.js 구조
