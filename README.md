## Just Do It!(readme ver.2.0)
- 사람들의 목표를 달성하기 위한 도움을 주기 위한 동기부여 공유 SNS 입니다.
- 개발기간 : 2024.4.17. ~ 2024.5.31.
## 기술 스택
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Typescript][TypeScript]][TypeScript-url]
* [![reactquery][reactQuery]][reactquery-url]
* [![zustand][zustand]][zustand-url]
* [![reacthookform][reacthookform]][reacthookform-url]
* [![chakra][chakra]][chakra-url]

#### 선정이유
- next.js 13
  - 14버전의 경우 아직 stable 하지 못함
  - 13대비 큰 변화 없음(node 버전 업이 주 이유였기 때문)

- zustand
  - 다른 상태관리 도구에 비해 빠른시간 내에 익히기 쉬움
  - store와 action이 합쳐져 있어 사용이 간단함

- chakra-ui
  - props를 사용하여 스타일링
## 트러블 슈팅
[트러블슈팅 모음](https://velog.io/@suhoshin23/posts?tag=%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8)
### 기능개발
- 1:1 채팅방 구현 후 목록 구성 관련 문제 발생 => 채팅메시지 필드에 채팅방id 추가 및 채팅방 생성 조건 재정의

### 최적화
- 최적화 작업 후 업데이트

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

[Wireframe][Figmawireframe-url]

## Work Flow
#### [Link][Figmaworkflow-url] (tool : figma)

<details>
<summary>Work-flow</summary>
<div markdown='1'>
![login](/public/for_readme/work_flow/login_signup.png)

- 회원가입/로그인

![home](/public/for_readme/work_flow/home.png)

- 메인화면

![message](/public/for_readme/work_flow/chat.png)

- 1:1채팅

![mypage](/public/for_readme/work_flow/mypage.png)

- 마이페이지

![challenge](/public/for_readme/work_flow/challenge.png)

- 챌린지 등록/수정/삭제(~5/29)

![search_user](/public/for_readme/work_flow/search_user.png)

- 유저 검색(~5/29)
</div>
</details>



## 향후계획
- 1차 최적화 및 리팩토링(~ 5/24)
- 챌린지 등록/수정/삭제 기능 추가(5/25 ~ 5/29)
- 2차 리팩토링(5/29 ~ 5/31)



## 회고
- 회고쓰자
- 회고쓰자

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Figmawireframe-url]: https://www.figma.com/design/AGnVbLaZXx1790EdNHmVSD/spartan-wireframe?t=yWDZfzc9NXlIUOhI-0
[Figmaworkflow-url]: https://www.figma.com/board/ht5cRT6XmFJkd7nxjgnRhJ/spartan-workflow?node-id=0-1&t=yWDZfzc9NXlIUOhI-0
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Typescript-url]: https://www.typescriptlang.org/
[reactquery]: https://img.shields.io/badge/-React%20Query-FF4154?style=plastic&logo=react%20query&logoColor=white
[reactquery-url]: https://tanstack.com/query/latest/docs/framework/react/overview
[zustand]: https://img.shields.io/badge/zustand-black
[zustand-url]: https://docs.pmnd.rs/zustand/getting-started/introduction
[reacthookform]: https://img.shields.io/badge/react--hook--form-EC5990?style=flat&logo=reacthookform&logoColor=white
[reacthookform-url]: https://react-hook-form.com/get-started
[chakra]: https://shields.io/badge/chakra--ui-black?logo=chakraui&style=for-the-badge%22
[chakra-url]: https://v2.chakra-ui.com/getting-started
