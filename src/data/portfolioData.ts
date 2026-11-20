import type {
  ArchiveRepoItem,
  FlagshipProject,
  MandalartPillar,
} from '../types/portfolio';
import { assetUrl } from '../utils/assetUrl';

export const ENGINEER_PROFILE = {
  nameKo: '원우연',
  nameEn: 'Won Wooyeon',
  handle: 'coincidence-one',
  title: '프론트엔드 개발자',
  email: 'dndus567@gmail.com',
  github: 'https://github.com/coincidence-one',
  linkedin: 'https://www.linkedin.com/in/wooyeon-won',
  blog: 'https://coincidence-one.tistory.com',
} as const;

export const FLAGSHIP_PROJECTS: FlagshipProject[] = [
  {
    id: 'peachmarket',
    number: '01',
    title: '피치마켓',
    subtitle: '웹 · iOS · Android',
    headline: '조지아 한인을 위한 중고거래 서비스',
    lede: '카톡방과 페이스북 그룹에서 하던 거래를 옮겨 왔습니다. 웹, 서버, 모바일 앱을 풀스택으로 설계했습니다.',
    period: '2026.01 — 현재 · 운영 중',
    role: '풀스택 설계와 검증 (웹 · 서버 · 모바일) · 현재 1인 운영',
    aiNote: 'Claude Code로 구현 · 병합 PR 456개 중 312개',
    liveUrl: 'https://peachmarket.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/peach-market/id6761296162',
    stack: [
      'Next.js 16',
      'NestJS 11',
      'React Native (Expo 54)',
      'PostgreSQL · Prisma',
      'Claude Vision',
      'Socket.io',
      'Cloudflare R2',
      'Turborepo',
    ],
    milestones: [
      { date: '2026.02', label: 'WebSocket 실시간 채팅' },
      { date: '2026.03', label: '한국어·영어 지원, TestFlight 배포' },
      { date: '2026.04', label: '이미지 저장소 R2 이전, App Store 심사 대응' },
      { date: '2026.05', label: 'iOS 앱 출시, Android 제출 설정' },
      { date: '2026.06', label: '보안 감사 5건 수정, 관리자 모더레이션 도구' },
      { date: '2026.10', label: 'SSR 전환, AI 사진 일괄 등록' },
      { date: '2026.11', label: '429가 404로 나가던 버그 수정' },
    ],
    figures: [
      {
        value: '1 → 423',
        unit: '개',
        label: '검색엔진이 읽을 수 있는 페이지',
        note: '유입 효과는 아직 관측 중',
      },
      {
        value: '36',
        unit: '초',
        label: '사진 8장 → 매물 초안 4개',
        note: 'staging에서 한 번 잰 값',
      },
      {
        value: '$50',
        label: 'AI 호출 월 예산 상한',
      },
      {
        value: '165 → 0',
        unit: '건',
        label: '멀쩡한 페이지가 404로 나간 수',
        note: '사이트맵 425개 동시 요청 재현 기준',
      },
    ],
    stories: [
      {
        title: 'SSR 전환과 지역 랜딩 144개',
        summary:
          '스켈레톤만 내려가던 홈, 상세, 커뮤니티를 서버 렌더링으로 전환.',
        reference: 'PR #489 · #490',
      },
      {
        title: '사진 30장 일괄 등록',
        summary:
          'Claude 비전이 사진을 물건별로 묶어 매물 초안 작성. 월 예산 가드 포함.',
        reference: 'PR #491 · #493 · #495',
      },
      {
        title: '429를 404로 내보내던 상세 페이지',
        summary:
          'rate limit에 걸린 SSR 응답을 5xx로 바꿔 색인 탈락을 막음.',
        reference: 'PR #552',
      },
      {
        title: '에이전트가 따르는 작업 규칙',
        summary:
          'CLAUDE.md에 보안 체크리스트와 웹·앱 미러링 정책을 정리. PR에 검증 결과 기록.',
      },
    ],
    designNote:
      '웹(Next.js), API(NestJS), 앱(Expo)을 Turborepo 모노레포 하나에 둡니다. API 클라이언트, TanStack Query 훅, 디자인 토큰, 한국어·영어 문구는 packages/shared에 있고 웹과 앱이 같이 씁니다.',
    architectureLayers: [
      {
        name: '웹과 앱이 같이 쓰는 shared 패키지',
        description:
          '도메인별 API 클라이언트와 TanStack Query 훅, 쿼리 키, 문구가 packages/shared에 있습니다. iOS는 Universal Links로 웹 링크가 앱에서 열립니다.',
        stack: ['Next.js 16', 'Expo Router', 'TanStack Query', 'NativeWind'],
      },
      {
        name: '사진 일괄 등록과 비용 가드',
        description:
          'Claude 비전 응답은 Zod 스키마로 받는 구조화 출력입니다. 한도는 시간당 5회, 24시간에 초안 10회와 사진 120장, 월 $50 순서로 걸려 있습니다.',
        stack: ['Claude Vision', 'Zod', 'AiDraftUsage 테이블', '월 예산 상한'],
      },
      {
        name: '실시간 채팅과 이미지 저장',
        description:
          'Socket.io 1:1 채팅에 읽음, 답장 인용, 예약 배너가 있습니다. 아이폰 HEIC 사진은 서버에서 sharp로 WebP로 바꿔 Cloudflare R2에 올립니다.',
        stack: ['NestJS 11', 'PostgreSQL · Prisma', 'Socket.io', 'sharp'],
      },
    ],
    gallery: [
      {
        src: assetUrl('/assets/projects/peachmarket-web-ai-fill.png'),
        caption: '웹 — 사진 한 장으로 “AI로 채우기”',
      },
      {
        src: assetUrl('/assets/projects/peachmarket-bulk-review.png'),
        caption: '앱 — 사진 여러 장으로 만든 매물 초안 6개',
      },
      {
        src: assetUrl('/assets/projects/peachmarket-sale-local.png'),
        caption: '앱 — 카톡에 공유하는 무빙세일 페이지',
      },
      {
        src: assetUrl('/assets/projects/peachmarket-live-city.jpg'),
        caption: '운영 중인 웹 — 둘루스 지역 랜딩',
      },
      {
        src: assetUrl('/assets/projects/peachmarket-live-mobile.jpg'),
        caption: '운영 중인 모바일 웹',
      },
      {
        src: assetUrl('/assets/projects/peachmarket-live-home.jpg'),
        caption: '운영 중인 웹 — 홈',
      },
    ],
  },
  {
    id: 'tiny-orbits',
    number: '02',
    title: '별마실 (Tiny Orbits)',
    subtitle: '브라우저 멀티플레이 게임',
    headline: '동물 우주인이 되어 행성 7개를 돌아다니는 게임',
    lede: '가입 없이 링크만 열면 시작합니다. 우주선을 타고 다른 행성으로 건너가 사람들을 만납니다.',
    period: '2026.11 · 운영 중',
    role: '기획 · 설계 · 운영 (1인)',
    aiNote: 'Claude Code로 구현 · 커밋 67개 중 66개',
    liveUrl: 'https://tinoy-orbits.vercel.app',
    stack: [
      'JavaScript',
      'HTML Canvas',
      'Web Audio API',
      'Supabase Realtime',
      'Claude Artifact',
      'Vercel',
    ],
    figures: [
      {
        value: '1',
        unit: '개 파일',
        label: 'game.html 하나로 두 환경에서 실행',
      },
      {
        value: '0',
        unit: 'KB',
        label: '음원 파일',
      },
      {
        value: '5 → 1',
        unit: '회/초',
        label: '사람이 몰릴 때 위치 전송 주기',
      },
      {
        value: '180',
        unit: '명',
        label: '동시 접속 상한',
        note: '한도에서 계산한 설계값',
      },
    ],
    stories: [
      {
        title: 'Realtime 한도 안의 위치 동기화',
        summary:
          '행성별 채널 분리, 인원에 따른 전송 주기 조절, 180명부터 대기열.',
      },
      {
        title: '파일 하나로 두 환경',
        summary:
          'window.claude 유무로 아티팩트 저장소와 Supabase를 갈아 끼우는 어댑터.',
      },
      {
        title: '음원 없이 내는 소리',
        summary: '배경음과 효과음을 Web Audio 오실레이터로 합성.',
      },
    ],
    designNote:
      '시작할 때 window.claude가 있는지 봅니다. 있으면 아티팩트의 공유 저장소를, 없으면 Supabase 익명 로그인과 Realtime을 붙입니다. 둘 다 안 되면 혼자 탐험하는 모드로 시작합니다.',
    architectureLayers: [
      {
        name: '두 환경을 감싸는 어댑터',
        description:
          '게임 코드는 같은 인터페이스만 부르기 때문에 어느 환경인지 모릅니다. 네트워크가 끊기면 바로 혼자 탐험 모드로 넘어갑니다.',
        stack: ['실행 환경 감지', 'Supabase 익명 인증', '혼자 탐험 모드'],
      },
      {
        name: '행성별 채널과 공놀이 동기화',
        description:
          '우주 공간 채널 1개와 행성 채널 7개가 있습니다. 공놀이는 서버 없이, 마지막으로 공을 찬 사람이 궤적을 계산해서 나머지에게 알려 줍니다.',
        stack: ['행성별 채널', '마지막으로 찬 사람이 계산', '대기열'],
      },
      {
        name: '소리 합성과 도배 방지',
        description:
          '행성마다 다른 배경음과 효과음을 Web Audio 오실레이터로 만듭니다. 건축 데이터는 PostgreSQL RLS로 2초 안에 다시 쓰지 못하게 막고 크기를 64KB로 제한했습니다.',
        stack: ['Web Audio API', 'PostgreSQL RLS', '64KB 제한'],
      },
    ],
    gallery: [
      {
        src: assetUrl('/assets/projects/tiny-orbits-og.png'),
        caption: '별마실 대표 화면',
      },
      {
        src: assetUrl('/assets/projects/tiny-orbits-planets.png'),
        caption: '중력과 지형이 서로 다른 행성들',
      },
      {
        src: assetUrl('/assets/projects/tiny-orbits-animals.png'),
        caption: '동물 우주인 6종과 표정',
      },
      {
        src: assetUrl('/assets/projects/tiny-orbits-multiplayer.png'),
        caption: '다른 사람과 만나 인사하는 장면',
      },
    ],
  },
  {
    id: 'hago-mandal',
    number: '03',
    title: '하고-만달',
    subtitle: '오타니 만다라트 스크롤 스토리 + 9×9 목표 플래너',
    headline: '오타니의 만다라트를 스크롤로 읽고 내 81칸을 채웁니다',
    lede: '2023년에 멈췄던 프로젝트를 2026년 11월에 AI 에이전트와 다시 잡아 완성했습니다.',
    period: '2023.09 시작 · 2026.11 완성',
    role: '기획 · 설계 (1인)',
    aiNote: 'AI 에이전트로 구현',
    liveUrl: 'https://hago-mandal.vercel.app',
    repoUrl: 'https://github.com/coincidence-one/hago-mandal',
    stack: [
      'Next.js 13',
      'TypeScript',
      'Canvas 2D',
      'Lenis',
      'Framer Motion',
      'Tailwind CSS',
    ],
    figures: [
      {
        value: '21',
        unit: '장',
        label: '스크롤에 맞춰 넘기는 사진',
      },
      {
        value: '108',
        unit: '땀',
        label: '수식으로 그린 실밥',
      },
      {
        value: '81',
        unit: '칸',
        label: '서로 묶인 9×9 만다라트',
      },
    ],
    stories: [
      {
        title: '사진 21장 스크롤 캔버스',
        summary: '진행률에 따라 인접한 두 장을 겹쳐 그리고 cover 맞춤을 직접 계산.',
      },
      {
        title: '사진 속 공에 맞춘 캔버스 공',
        summary: '정규화한 공 좌표를 같은 cover 변환으로 투영.',
      },
      {
        title: '수식으로 그린 야구공',
        summary: '3D 라이브러리 없이 Canvas 2D. 실밥 108땀, 모공 140개.',
      },
      {
        title: '양방향으로 묶인 81칸',
        summary: '가운데 블록과 바깥 블록의 중심 칸을 한 번에 동기화.',
      },
    ],
    designNote:
      '화면은 스크롤 스토리(ACT 01~06), 만다라트 설명, 81칸 플래너 세 덩어리입니다. 스토리 구간은 섹션 높이를 175~240vh로 잡고 안쪽을 sticky로 고정한 뒤, 섹션이 지나간 비율을 0~1 진행률로 바꿔 캔버스와 글자에 넘깁니다.',
    architectureLayers: [
      {
        name: '사진 시퀀스 캔버스',
        description:
          '사진 21장을 미리 받아 두고 진행률에 따라 인접한 두 장을 겹쳐 그립니다. cover 맞춤, 초점, 줌, 채도를 캔버스에서 직접 계산합니다.',
        stack: ['Canvas 2D', 'getBoundingClientRect', 'requestAnimationFrame'],
      },
      {
        name: '투구와 타구 궤적',
        description:
          '18.44m 투구와 138m 홈런을 3차 베지어로 그립니다. 홈런 공은 비행이 끝나면 노드 9개로 갈라져 만다라트 가운데 블록이 됩니다.',
        stack: ['3차 베지어', 'easeOutCubic', '모션 블러 잔상'],
      },
      {
        name: '81칸 플래너',
        description:
          '템플릿 네 가지에서 시작합니다. “오늘의 1구”는 아직 안 한 칸을 하나씩 꺼내 주고, “스카우팅 리포트”는 칸에 적힌 단어를 네 축으로 나눠 오타니 원본의 비율과 나란히 놓습니다.',
        stack: ['localStorage', 'Framer Motion', 'PNG 내보내기'],
      },
      {
        name: '움직임 줄이기',
        description:
          'prefers-reduced-motion이 켜져 있으면 Lenis를 만들지 않고 글자 연출과 캔버스 잔상을 끕니다. PAUSE 버튼으로 직접 켤 수도 있습니다.',
        stack: ['prefers-reduced-motion', 'PAUSE 버튼'],
      },
    ],
    gallery: [
      {
        src: assetUrl('/assets/projects/hago-mandal-hero.jpg'),
        caption: 'ACT 01 — 투구 사진 12장',
      },
      {
        src: assetUrl('/assets/projects/hago-mandal-pitch.jpg'),
        caption: 'ACT 02 — 18.44m를 날아가는 공',
      },
      {
        src: assetUrl('/assets/projects/hago-mandal-homerun.jpg'),
        caption: 'ACT 05 — 138m 홈런 궤적',
      },
      {
        src: assetUrl('/assets/projects/hago-mandal-pillars.jpg'),
        caption: 'ACT 06 — 오타니 만다라트의 가운데 블록',
      },
      {
        src: assetUrl('/assets/projects/hago-mandal-studio.jpg'),
        caption: '플래너 — 템플릿과 오늘의 1구',
      },
      {
        src: assetUrl('/assets/projects/hago-mandal-grid.jpg'),
        caption: '플래너 — 81칸 전체',
      },
    ],
  },
];

/** 하고-만달에 들어 있는 오타니 원본 데이터 (핵심 목표와 8개 주제) */
export const OHTANI_CORE_GOAL = '8구단 드래프트 1순위';

export const OHTANI_PILLARS: MandalartPillar[] = [
  {
    title: '몸 만들기',
    actions: [
      '몸 관리',
      '영양제 섭취',
      'FSQ 90kg',
      'RSQ 130kg',
      '식사 밤7/아침3',
      '가동역 확보',
      '스테미너',
      '유연성 강화',
    ],
  },
  {
    title: '제구',
    actions: [
      '인스텝 개선',
      '몸통 강화',
      '축다리 고정',
      '불안정 제거',
      '멘탈 컨트롤',
      '몸 열리지 않기',
      '하체 강화',
      '릴리즈 안정',
    ],
  },
  {
    title: '구위',
    actions: [
      '각도 만들기',
      '위에서 던지기',
      '손목 강화',
      '하체 드라이브',
      '회전수 증가',
      '관절 가동성',
      '볼 끝의 힘',
      '폼으로 던지기',
    ],
  },
  {
    title: '멘탈',
    actions: [
      '뚜렷한 목표',
      '일희일비 금지',
      '차분한 머리·열정',
      '분위기 안타기',
      '동료 배려',
      '승리 집념',
      '실전 같은 연습',
      '위기에 강함',
    ],
  },
  {
    title: '스피드 160km/h',
    actions: [
      '축으로 회전',
      '하체 웨이트',
      '체중 증량',
      '코어 강화',
      '어깨 근력',
      '가동역 확장',
      '라이너 캐치볼',
      '피칭 수 늘리기',
    ],
  },
  {
    title: '인간성',
    actions: [
      '감성 키우기',
      '사랑받는 사람',
      '철저한 계획성',
      '감사하는 마음',
      '바른 예의',
      '타인 배려',
      '신뢰받는 사람',
      '꾸준한 지속력',
    ],
  },
  {
    title: '운 (運)',
    actions: [
      '먼저 인사하기',
      '쓰레기 줍기',
      '부실 청소하기',
      '도구 아껴쓰기',
      '심판 존중하기',
      '긍정적 사고',
      '응원받는 태도',
      '꾸준히 책 읽기',
    ],
  },
  {
    title: '변화구',
    actions: [
      '카운트 구종',
      '포크볼 완성',
      '슬라이더 각도',
      '좌타자 결정구',
      '유인구 제구',
      '깊은 낙차',
      '직구와 같은 폼',
      '완급 조절',
    ],
  },
];

export const GITHUB_ARCHIVE_PROJECTS: ArchiveRepoItem[] = [
  {
    id: 'kakao-notification-tracker',
    name: 'KakaoNotificationTracker',
    titleKo: '카톡 “1” 안 없애고 읽기 + 메뉴바 다마고치',
    category: 'interactive-native',
    period: '2026.07',
    language: 'Swift',
    description:
      '맥에서 카카오톡 알림 배너를 읽어 모아 두는 메뉴바 앱. 메시지가 오면 메뉴바의 캐릭터가 반응합니다.',
    githubUrl: 'https://github.com/coincidence-one',
  },
  {
    id: 'chiikawa-auto-chess',
    name: 'chiikawa-auto-chess',
    titleKo: '팬메이드 오토체스',
    category: 'interactive-native',
    period: '2026.10',
    language: 'TypeScript',
    description:
      '캐릭터를 배치하면 알아서 싸우는 오토배틀 게임. 시너지 조합과 웨이브 전투가 있습니다.',
    githubUrl: 'https://github.com/coincidence-one/chiikawa-auto-chess',
  },
  {
    id: 'saas-subscription-starter',
    name: 'saas-subscription-starter',
    titleKo: '정기 결제 스타터',
    category: 'product-saas',
    period: '2026.01',
    language: 'TypeScript',
    description:
      '결제 시스템을 두 번 만들면서 반복한 부분을 정리한 토스페이먼츠 구독 결제 기본 틀.',
    githubUrl: 'https://github.com/coincidence-one/saas-subscription-starter',
  },
];
