## Just Do It!(챌린지 지원 웹 사이트 / readme ver.0)
- 프로젝트 소개
## 기술 스택
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Typescript][TypeScript]][TypeScript-url]
* reactquery
* zustand
* react-hook-form
* chakra-ui
- next는 13버전 사용 : 14버전의 경우 아직 stable 하지 못함 / 13대비 큰 변화 없음(node 버전 업이 주 이유였기 때문)
## 아키텍처
<details>
<summary>파일구조도</summary>
<div markdown='1'>

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(afterLogin)
 ┃ ┃ ┣ 📂_CommonComponent
 ┃ ┃ ┃ ┣ 📜BoardCreateCard.tsx
 ┃ ┃ ┃ ┣ 📜BoardItemCard.tsx
 ┃ ┃ ┃ ┣ 📜Chatitem.tsx
 ┃ ┃ ┃ ┣ 📜NavMenu.tsx
 ┃ ┃ ┃ ┣ 📜RQProvider.tsx
 ┃ ┃ ┃ ┣ 📜ReplyDrawer.tsx
 ┃ ┃ ┃ ┗ 📜component.type.ts
 ┃ ┃ ┣ 📂_viewComponent
 ┃ ┃ ┃ ┣ 📜challenge.tsx
 ┃ ┃ ┃ ┣ 📜chat.tsx
 ┃ ┃ ┃ ┣ 📜component.type.ts
 ┃ ┃ ┃ ┣ 📜home.tsx
 ┃ ┃ ┃ ┣ 📜messages.tsx
 ┃ ┃ ┃ ┣ 📜myPage.tsx
 ┃ ┃ ┃ ┣ 📜search.tsx
 ┃ ┃ ┃ ┗ 📜user.tsx
 ┃ ┃ ┣ 📂challenge
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂home
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂messages
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂myPage
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂search
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📂(beforeLogin)
 ┃ ┃ ┣ 📂_commonComponent
 ┃ ┃ ┃ ┣ 📜CommonButtonForm.tsx
 ┃ ┃ ┃ ┣ 📜CommonInputForm.tsx
 ┃ ┃ ┃ ┗ 📜component.type.ts
 ┃ ┃ ┣ 📂_viewComponent
 ┃ ┃ ┃ ┣ 📜login.tsx
 ┃ ┃ ┃ ┗ 📜signUp.tsx
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂signUp
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜providers.tsx
 ┣ 📂firebase
 ┃ ┣ 📜firebase.ts
 ┃ ┣ 📜firebase.type.ts
 ┃ ┣ 📜firebaseAuth.ts
 ┃ ┣ 📜firestorage.ts
 ┃ ┗ 📜firestore.ts
 ┣ 📂model
 ┣ 📂queries
 ┃ ┣ 📜queries.ts
 ┃ ┗ 📜queryKeys.ts
 ┗ 📂store
 ┃ ┗ 📜store.ts
```

</div>
</details>

## 화면 구성
- 화면구성(피그마...??)
## 주요 기능
- 회원가입/로그인
- 팔로우
- 1:1채팅
  - firebase onSnpashot
- 게시물 등록/수정/삭제
  - 무한 스크롤
- 챌린지 등록/수정/삭제(~5/29)
## 트러블 슈팅
- 최적화 하면서 생길듯???
## 향후계획
- 1차 최적화 및 리팩토링(~ 5/24)
- 챌린지 등록/수정/삭제 기능 추가(5/25 ~ 5/29)
- 2차 리팩토링(5/29 ~ 5/31)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Typescript-url]: https://www.typescriptlang.org/
