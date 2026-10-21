# JHBT2 (지후배틀 2) — 작업 규칙 · 게임 핵심 정리

## 구조
- `index.html` 하나가 게임 전체 (빌드 없음). 로컬 테스트: `python -m http.server 8766`
- 구역: CONFIG → RARITY → CHARS(캐릭터 데이터) → STATUS → 시드 난수 → 저장·계정 → 리더보드·Firebase → 엔진 → 라운드·배치 → 가차 → 리더보드 화면 → 업데이트 시스템 → 시작
- 버전: `<meta name="jhbt2-version">` · 잠수함 패치(버전 그대로)는 `<meta name="jhbt2-build">` +1
- `firestore.rules` = 지후배틀 1 규칙 전체 + 지후배틀 2 블록. 콘솔에는 **파일 전체**를 게시 (일부만 올리면 전작 규칙이 사라진다)

## 업데이트 때 반드시 할 일
1. `index.html` 수정 (CHARS 수치 · 설명 텍스트 · atkText 등 하드코딩된 수치도 같이)
2. version / build 메타 갱신
3. `PATCH_NOTES` 맨 위에 새 항목 추가 (tag: new 신규 · buff 상향 · nerf 하향 · adjust 조정 · fix 수정 · system 시스템)
4. **디스코드 공지용 인포그래픽 만들기 (잊지 말 것)**:
   `infographics/<버전>.json` 작성 → `python infographics/make.py infographics/<버전>.json` → `CHROME=<크롬 경로> python infographics/shot.py infographics/<버전>.html` (PNG 생성). 형식은 make.py 상단 주석 참고
5. 이 파일(CLAUDE.md)에 바뀐 규칙이 있으면 갱신

## 게임 규칙 · 데이터
- 덱 5기 · 등급: 일반(common) / 희귀(rare) / 영웅(epic) / 전설(legend). 기본 지후(starter: true)는 처음부터 지급
- 기준 체력: 화염 1000. 레벨 배율 `lvMult(lv)`. 시드 난수 mulberry32 · 물리 STEP 1/60
- 지후 데이터 `CHARS[id]`: name · rarity · role · hp · atk · atkSpeed · range · speed · passive · skill(`type:'sec'` = SP 스킬, `need` SP, `once` 1회) · onHit/onStart/onDeath/tick 훅
- SP: 라운드 시작 뒤 초당 쌓이는 스킬 게이지
- 선물 지후: 초당 SP 1, **SP 18**에 무작위 지후로 변신(1회). 변신하면 선물은 사라지고 그 자리를 같은 진영·같은 레벨·체력 가득의 변신체가 차지 (`A.transform`)
- 슬라임 지후: 쓰러지면 절반 크기 2기로 분열 (최대 2단계, 체력·공격력 절반)
- 코인 지후: 기본 공격력이 10분마다 -50%~+50% 변동 (`coinMult`, 모두 같은 값)
- 화염 지후: 일반 공격 [화상] 5초, 1초마다 공격력의 **65%**, 중첩
- 상태이상: stun(기절) · freeze(빙결) · burn(화상) 등 `STATUS`

### 현재 밸런스 (v2.2)
슬라임 HP 600 · 검 ATK 190 · 암살 HP 830 · 고독한 HP 1700 · 코인 ATK 80 · 선물 SP 18 · 화염 화상 65%

## 계정 · 운영
- 전작(지후배틀 1)과 같은 Firebase 프로젝트(`jihoobattle`) · 같은 인증 계정 (UID 8자리 + 비밀번호, `<UID>@jihoo-battle.invalid`)
- 기록: `jb2_backups/<uid>` · 닉네임 `jb2_nicknames` · 리더보드 `jhbt2lb`
- **운영자** = 전작 규칙의 `admins/<uid>` 문서가 있는 계정 (콘솔에서만 생성, 본인은 `get` 가능)
- **개발자 모드** (v2.2): 운영자 계정만 환경설정에 토글 표시. 켜면 `owned()` 가 모두 true → 모든 지후 해금 (서버 기록의 보유 목록은 바뀌지 않음). 꺼지면 안 가진 지후는 덱에서 빠진다. 설정은 localStorage `jhbt2-dev`
- 전투 중에는 업데이트 오버레이가 뜨지 않고 기다린다. PWA: `sw.js` · `manifest.webmanifest`

## 스타일
- 코드는 주변 코드와 같은 밀도·이름·한국어 주석 스타일. 한 줄에 몰아 쓰는 기존 스타일 유지
- 브랜치: 지정된 개발 브랜치에서만 작업 · PR은 요청이 있을 때만
