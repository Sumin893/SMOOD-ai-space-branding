# SMOOD AI Space Branding

## Overview

SMOOD는 F&B 예비 창업자를 위한 AI 기반 공간 브랜딩 MVP입니다.

사용자가 챗봇과 대화하며 브랜드 컨셉을 구체화하고, 대화 결과를 기반으로 브랜드 무드보드를 생성한 뒤, 매장 면적을 입력하면 브랜드 컨셉에 맞는 AI 기반 인테리어 렌더 이미지를 제공하는 흐름을 구현합니다.

현재 프로젝트는 공모전 시연용 MVP이며 실제 AI 이미지 생성, 실제 3D 모델링, 시공 설계 기능은 아직 구현되지 않았습니다.

## Core Flow

Chatbot → Brand Profile → Moodboard → Area Input → AI Interior Render

## Main Features

- 브랜드 컨셉 진단 챗봇
- 사용자 대화 기반 브랜드 프로필 생성
- 브랜드 컬러, 무드, 소재 기반 무드보드
- 매장 면적 입력 및 공간 규모 라벨
- AI 공간 생성 loading / skeleton UI
- 브랜드 컨셉 기반 mock 인테리어 렌더 결과
- 공간 요소 선택 UI
- 2D / 3D mock toggle
- 브랜드 컨셉 요약 패널
- 다시 생성 mock flow

## Tech Stack

- Next.js 16.3.5
- React 19.3.0
- TypeScript 7.0.2
- Tailwind CSS 4.3.3
- Next.js App Router

## Project Structure

```text
app/
  components/        공통 Header
  moodboard/         무드보드 결과 화면
  space-design/      면적 입력, 생성 로딩, 렌더 결과 화면
lib/
  generateInteriorRender.ts  교체 가능한 mock 렌더 생성 함수
public/
  renders/           정적 인테리어 렌더 이미지
```

## Getting Started

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
```

## Current MVP Scope

Implemented:

- Chat flow
- Brand profile state using sessionStorage
- Moodboard
- Area input and size label
- Mock AI render generation flow
- Skeleton loading with rotating status messages
- Static interior render result
- Mock editor controls and 2D / 3D toggle

Planned:

- Real AI image generation API
- Brand-profile-to-prompt generation
- Multi-view render generation
- Actual 3D model generation
- Contractor matching

## Future Development

- OpenAI 또는 이미지 생성 API 기반 실제 렌더 생성
- 같은 공간의 다각도 이미지 생성
- 실제 3D editor
- F&B 동선 최적화
- 지역 시공업체 매칭

## README Maintenance

주요 기능, 기술 스택, 설치 패키지, 실행 방법, 프로젝트 구조, MVP 범위 또는 향후 구현 기능이 변경되면 README도 실제 구현 상태에 맞게 함께 업데이트합니다.

## Disclaimer

현재 프로젝트는 공모전 시연용 MVP입니다. AI 렌더 생성과 공간 디자인 기능 일부는 mock data 및 정적 이미지를 사용하며, 실제 건축 설계나 시공 결과를 제공하지 않습니다.
