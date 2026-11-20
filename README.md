# 원우연 포트폴리오

프론트엔드 개발자 원우연의 포트폴리오 사이트입니다.

## 구성

| 구역 | 내용 | 파일 |
| --- | --- | --- |
| 첫 화면 | 소개 문장, 대표 작업 미리보기 | [HeroIntro.tsx](src/components/sections/HeroIntro.tsx) |
| 프로젝트 (`#work`) | 피치마켓 · 별마실 · 하고-만달. 화면과 숫자 위주, 작업은 제목과 한 줄 | [WorkSection.tsx](src/components/sections/WorkSection.tsx), [src/components/work/](src/components/work/) |
| 작은 프로젝트 (`#index`) | 작은 도구와 게임 목록 | [ArchiveIndexSection.tsx](src/components/sections/ArchiveIndexSection.tsx) |
| 연락 (`#contact`) | 이메일, 링크 | [ColophonFooter.tsx](src/components/sections/ColophonFooter.tsx) |

`⌘K`로 빠른 이동 메뉴를 열 수 있고, 각 프로젝트의 "설계 노트"는 다이얼로그로 열립니다.

## 내용 고치기

화면에 나오는 글과 숫자는 거의 전부 [src/data/portfolioData.ts](src/data/portfolioData.ts) 한 파일에 있습니다.
프로젝트·목록을 추가하거나 문구를 바꿀 때는 이 파일만 고치면 됩니다.

색과 글꼴은 [src/index.css](src/index.css) 위쪽의 변수에서 정합니다.
밝은 화면과 어두운 화면 값이 한 쌍씩 있습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 빌드
npm run lint
```

`main`에 푸시하면 GitHub Actions가 GitHub Pages로 배포합니다.
