# 원우연 포트폴리오

프론트엔드 개발자 원우연의 포트폴리오 사이트입니다.

## 구성

| 구역 | 내용 | 파일 |
| --- | --- | --- |
| 첫 화면 | 소개 문장, 대표 작업 미리보기, 기술 글자 띠 | [HeroIntro.tsx](src/components/sections/HeroIntro.tsx) |
| 프로젝트 (`#work`) | 피치마켓 · 별마실 · 하고-만달. 화면 위주, 작업은 제목과 한 줄 | [WorkSection.tsx](src/components/sections/WorkSection.tsx), [src/components/work/](src/components/work/) |
| 작은 프로젝트 (`#index`) | 작은 도구와 게임 목록 | [ArchiveIndexSection.tsx](src/components/sections/ArchiveIndexSection.tsx) |
| 연락 (`#contact`) | 이메일, 링크 | [ColophonFooter.tsx](src/components/sections/ColophonFooter.tsx) |

`⌘K`로 빠른 이동 메뉴를 열 수 있고, 각 프로젝트의 "설계 노트"는 다이얼로그로 열립니다.

## 모션

움직임은 [src/motion/](src/motion/)과 [src/components/motion/](src/components/motion/)에 모여 있습니다.

| 연출 | 구현 | 파일 |
| --- | --- | --- |
| 부드러운 스크롤 | Lenis를 GSAP ticker에 물려 ScrollTrigger와 같이 돈다 | [smoothScroll.ts](src/motion/smoothScroll.ts) |
| 첫 화면 막과 제목 | SVG 경로로 걷히는 막, SplitText로 글자 단위 등장 | [IntroCurtain.tsx](src/components/motion/IntroCurtain.tsx), [HeroIntro.tsx](src/components/sections/HeroIntro.tsx) |
| 스크롤 연출 | `data-reveal`, `data-parallax` 속성을 읽어 ScrollTrigger를 건다 | [useScrollMotion.ts](src/motion/useScrollMotion.ts) |
| 프로젝트별 색 | 프로젝트 구간에 들어서면 `<html data-world>`가 바뀌고, `@property`로 등록한 색 토큰이 이어진다 | [world.ts](src/motion/world.ts), [index.css](src/index.css) |
| 배경 셰이더 | 첫 화면의 실(Threads), 별마실 구간의 별(Galaxy). 둘 다 WebGL | [src/components/reactbits/](src/components/reactbits/) |
| 글자 띠 | 스크롤 속도에 따라 빨라지고 기울어진다 | [VelocityMarquee.tsx](src/components/motion/VelocityMarquee.tsx) |
| 푸터 서명 | 서명 글꼴의 윤곽선을, 같은 글꼴의 한 획 경로를 마스크로 삼아 쓰는 순서대로 드러낸다 (DrawSVG) | [ColophonFooter.tsx](src/components/sections/ColophonFooter.tsx), [signaturePaths.ts](src/data/signaturePaths.ts) |
| 테마 전환 | View Transitions API로 누른 자리에서 원이 퍼진다 | [App.tsx](src/App.tsx) |

연출을 붙일 때는 요소에 속성만 답니다. 예: `<h3 data-reveal="chars">`, `<ol data-reveal="stagger">`.
`prefers-reduced-motion`을 켠 사용자에게는 막, 부드러운 스크롤, 글자 연출을 걸지 않고 완성된 화면을 바로 보여 줍니다.

Tailwind의 `translate-*`, `scale-*` 클래스가 붙은 요소를 GSAP으로 직접 움직이면 GSAP이 그 값을 가져가 버립니다.
위치를 잡는 요소와 GSAP이 움직이는 요소를 따로 두세요.

### 가져다 쓴 오픈소스

| 이름 | 쓰임 | 라이선스 |
| --- | --- | --- |
| [GSAP](https://gsap.com) (ScrollTrigger, SplitText, DrawSVG, CustomEase), [@gsap/react](https://github.com/greensock/react) | 모든 타임라인과 스크롤 연출 | GSAP Standard License (무료) |
| [Lenis](https://github.com/darkroomengineering/lenis) | 부드러운 스크롤 | MIT |
| [React Bits](https://reactbits.dev): Threads, Galaxy, Magnet | 배경 셰이더와 자석 버튼. 소스를 그대로 가져왔다 | MIT + Commons Clause |
| [Mrs Saint Delafield](https://fonts.google.com/specimen/Mrs+Saint+Delafield), [EMS Society](https://gitlab.com/oskay/svg-fonts) | 서명 글자 윤곽선과 쓰는 순서 | SIL Open Font License 1.1 |

코드를 쓸 때 참고한 에이전트 스킬: [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (useGSAP 정리, ScrollTrigger, 성능),
[anthropics/skills의 frontend-design](https://github.com/anthropics/skills), [pbakaus/impeccable](https://github.com/pbakaus/impeccable)의 animate 문서.

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
