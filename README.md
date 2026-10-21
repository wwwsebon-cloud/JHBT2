# 지후배틀 2 (JHBT2) · v2.0

index.html 하나가 게임 전체 (빌드 없음). 로컬 테스트: `python -m http.server 8766`

- 버전: `index.html` 안 `<meta name="jhbt2-version">` · 잠수함 패치(버전 그대로)마다 `<meta name="jhbt2-build">` +1
- 구역 지도 (index.html 상단 주석): CONFIG → RARITY → CHARS(캐릭터 데이터) → STATUS → 시드 난수 → 저장·계정 → **리터보드·Firebase** → 엔진 → 라운드·배치 → 가차 → 리더보드 화면 → 업데이트 시스템 → 시작

## 2.0 — 계정 · 새 지후 7종

### 계정 (로그인 · 회원가입)
- 전작과 **같은 Firebase 인증 계정**: UID 8자리 + 비밀번호 (`<UID>@jihoo-battle.invalid`). 지후배틀 1 계정으로도 로그인된다. 구글 로그인은 아직 없음
- 게스트는 익명 인증 · 회원가입하면 UID 를 받고 지금 기록이 그대로 계정에 붙는다
- 기록: `jb2_backups/<uid>` (프로필 JSON · 저장할 때마다 1.5초 모아서 자동 백업) · 켤 때 서버 기록이 더 새것이면 불러온다
- 닉네임 로그인: `jb2_nicknames/n_<소문자 닉네임>` (없으면 전작 `nicknames` 도 찾아본다)
- 콘솔: Authentication → **이메일/비밀번호** 사용 설정 (전작에서 이미 켜져 있음) · **Anonymous** 사용 설정

### Firestore 규칙
`firestore.rules` = 지후배틀 1 규칙 전체 + 지후배틀 2 블록 (`jb2_backups` · `jb2_nicknames` · `jhbt2lb`). **파일 전체**를 게시할 것.

## 0.6.0 — 리더보드 · 업데이트 시스템

### 리더보드 (파이어베이스)
- 저장소: 전작과 같은 Firebase 프로젝트(`jihoobattle`)의 **`jhbt2lb` 컬렉션** 재사용
- 접근: **익명 인증**으로 자기 문서(`jhbt2lb/<uid>`)만 쓰고 최대 50명을 승수 기준으로 읽음
- 규칙: 이 저장소의 `firestore.rules` = **지후배틀 1 규칙 전체 + 지후배틀 2 블록** (같은 프로젝트라 규칙은 하나뿐)
  - 리더보드 문서: `nickname · level · wins · losses · deck(덱 5기) · fav(대표 지후) · xp · updatedAt`

**운영 체크리스트 (콘솔에서 2가지):**
1. Authentication → Sign-in method → **Anonymous** 사용 설정
2. Firestore Database → **규칙** 탭에 `firestore.rules` **파일 전체**를 붙여넣어 게시
   - ⚠ 예전처럼 `jhbt2lb` 블록만 게시하면 지후배틀 1 규칙이 전부 사라진다. 꼭 파일 전체를
   - 지후배틀 1 규칙을 바꿀 때는 `JHBT/firestore.rules` 와 이 파일을 같이 맞출 것

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
