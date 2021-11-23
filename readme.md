#칸반보드
## 개요

1. 서비스 내용
```
  로그인, 회원가입, 로그아웃, 회원정보 수정, 게시물 업로드, 삭제, 추가, 조회 기능이 있는 웹 페이지 입니다.
  PHP로 구현된 칸반 보드 <http://bws961228.cafe24.com>
  Node.js로 구현된 칸반 보드<http://qkddnjstjr96.cafe24app.com>
```
2. 적용 기술
```  
  Kanban_PHP : Html / Css / JavaScript / Vue.js / PHP / DB
  Kanban_Nodejs : Html / Css / JavaScript / Vue.js / Node.js / DB
```
3. 각 페이지별 소개
```
 1) 로그인
   - 프론트(vue.js)에서 회원 데이터를 전송하여 백엔드(PHP)에서 요청받는 데이터가 DB에 등록된 회원의 정보와 일치하는지 검토하여 일치하는 데이터가   있으면 로그인이됨
   - 또한 로그인 유지를 처리하기위해 sessionId 형태로 토큰을 저장하여 로그인 유지 처리를 시켜줬으며, 페이지를 새로고침 할 때 데이터 유지가 안되는걸 방지하기 위해서 vuex-presistedstate를 설치하여 유지시켜줌
```

## 핵심기술
