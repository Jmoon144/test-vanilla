# ✅ Vanilla JS Todo List with Drag & Drop

이 프로젝트는 바닐라 JavaScript와 TypeScript로 구현된 Todo 리스트 애플리케이션입니다.  
가상 DOM 없이 DOM 직접 조작, 단일 Store 기반의 상태 관리, 커스텀 Drag & Drop 기능을 포함하여 효율적이고 모듈화된 구조를 갖추고 있습니다.

---

### 🗂️ 상태 관리
- 중앙 `Store`에서 모든 Todo 데이터를 관리
- 상태 변경시 구독자들에게 자동 반영

### ✅ 할 일 기능
- Todo 추가 / 삭제 / 완료 토글
- 필터 (전체 / 활성 / 완료) 기능 지원
- 완료된 항목 전체 삭제

### 🖱️ Drag & Drop 기능
- 드래그 핸들 기반 순서 변경 가능
- ESC 키 취소, 블러 프리뷰, 드래그 중 위치 가이드라인 지원
- 마우스 기반 구현 (pointer 이벤트 아님)

### ⚡ 최적화된 렌더링
- 변경된 항목만 다시 렌더링
- `DraggableTodoItem` 단위로 책임 분리하여 리렌더링 최소화

---

## 🧱 기술 스택

- **Vanilla JavaScript + TypeScript**
- **SCSS Module** – 컴포넌트 기반 스타일링
- **Webpack + Babel** – 모던 빌드 환경 구성
- **Jest + Testing Library** – 테스트 작성
- **ESLint + Prettier** – 정적 분석 및 코드 스타일 통일

---

## 📁 폴더 구조

```txt
/src
  ├── components/        # TodoInput, TodoItem, Footer 등 UI 컴포넌트
  ├── store/             # 상태 관리 (Store, 상태 구독/업데이트 로직)
  ├── styles/            # SCSS 모듈 (컴포넌트별 스타일)
  ├── types/             # 공통 타입 정의 (Todo, Drag 등)
  ├── utils/             # DragManager 등 유틸 클래스
  ├── App.ts             # 전체 앱 렌더링 엔트리
  ├── index.ts           # DOM 마운트 진입점
  └── setupTests.ts      # Jest 설정 파일
```


## 🛠 설치 및 실행
### 1. 프로젝트 클론
```bash
코드 복사
git clone https://github.com/your-username/vanilla-todo-dnd.git
cd vanilla-todo-dnd
```

### 2. 의존성 설치
```bash
코드 복사
npm install
```
### 3. 개발 서버 실행
```bash
코드 복사
```npm run serve

### 4. 프로젝트 빌드
```bash
코드 복사
npm run build
```

### 5. 코드 린트 검사
```
bash
코드 복사
npm run lint
```

### 6. 테스트 실행
```
bash
코드 복사
npm run test
```
## 🧑‍💻 CI 설정
GitHub Actions 기반의 CI 구성이 포함되어 있습니다.

CI-Lint
PR 생성 시 ESLint를 실행하여 코드 스타일 및 정적 분석을 수행합니다.
CI-Test
PR 생성 시 Jest 테스트를 자동으로 실행하여 주요 기능이 정상 동작하는지 검증합니다.
