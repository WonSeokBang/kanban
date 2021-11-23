#포트폴리오

## 개요

1. 서비스 내용
```
  로그인, 로그아웃, 회원가입,회원정보 수정, 게시물 업로드, 삭제, 추가, 조회 기능이 있는 웹 페이지 입니다.
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
    - 프론트(vue.js)에서 회원 데이터를 전송하여 백엔드(PHP)에서 요청받는 데이터가 DB에 등록된 회원의 
   정보와 일치하는지 검토하여 일치하는 데이터가   있으면 로그인이됩니다.
     - 로그인 유지를 처리하기위해 sessionId 형태로 토큰을 저장하여 로그인 유지 처리를 시켜줬으며, 
   페이지를 새로고침 할 때 데이터 유지가 안되는걸 방지하기 위해서 vuex-presistedstate를 설치하여 유지시켜줍니다.
   
  2) 회원가입
    - 아이디 : 6자리 이상 알파벳과 숫자로 구성하도록 개발하였습니다.
    - 비밀번호 : 8자리 이상으로 알파벳 + 특스문자  숫자로 구성하도록 개발하였습니다.
    - 비밀번호 확인 : 비밀번호와 일치하지 않으면 Exception 으로 예외처리하였습니다.
    - 아이디, 비밀번호, 비밀번호 확인, 회원명을 미 입력시 입력하도록 예외처리를 했습니다. 
    
  3) 회원 정보 수정
    - 토큰값과 회원명을 확인하여 정보를 가져와 일치여부를 확인하여 수정할 수 있게 개발하였습니다
    - 비밀번호 변경시 입력된 경우만 비밀번호가 변경되도록 처리하였으며, 입력을 안할 시 기존 비밀번호가 유지됩니다.
    
  4) 게시판 업로드, 수정, 삭제
    -  Vue.js를(프론트엔드) 사용하여 게시판 기본 포맷을 만들었으며, 백엔드 파트는 PHP 및 DB(Msql Work)를 연동하여 
      게시판 등록 및 삭제, 수정을 할 수 있게 개발하였습니다.
```

4. 핵심기술
```
    A. 로그인

    <template>
    <PageTitle>로그인</PageTitle>
    <form ref="frmLogin" autocomplete="off" @submit="formSubmit($event)">
        <input type="text" name="memId" placeholder="ID" v-model="memId"><br>
        <input type="password" name="memPw" placeholder="Password : 영문, 숫자, 툭수문자 조합 8-16자" v-model="memPw"><br>
        <input type="submit" value="Login">
    </form>
    <MessagePopup ref='popup' :message="message" />
</template>
<script>
import PageTitle from '../../components/PageTitle.vue'
import MessagePopup from '../../components/common/Message.vue'
import member from '../../models/member.js'
export default {
    components : {PageTitle, MessagePopup},
    mixins : [member],
    created() {
        if (this.$isLogin()) {
            this.$router.push({ path : "/logout"} );
        }
    },
    data() {
        return {
            message : "",
            memId : "",
            memPw : "",
        };
    },
    methods : {
        async formSubmit(e) {
            e.preventDefault();
            const formData = new FormData(this.$refs.frmLogin);
            const result = await this.$login(formData);
            if (result.success) {
                this.memId = "";
                this.memPw = "";
               this.$router.push({ path : "/kanban/list"});
            }

            if (result.message) {
                this.$showMessage(this, result.message);
            }
        }
    }

}
</script>


  B. 회원가입
  
  <template>
    <PageTitle>회원가입</PageTitle>
    <Form :mode="mode" />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import Form from "../../components/member/Form.vue"
export default {
    components: {PageTitle, Form},
    created() {
        if (this.$isLogin()) {
            this.$router.push({ path : "/my_info" })
        }
    },
    data() {
        return {
            mode : "join"
        };
    }
}
</script>

  C. 회원 정보, 수정

  <template>
    <PageTitle>회원정보수정</PageTitle>
    <Form :mode="mode" :member="member" />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import Form from "../../components/member/Form.vue"
export default {
    components: {PageTitle, Form},
    created() {
        if (!this.$isLogin()) {
            this.$router.push({ path : "/login" })
        }
    },
    computed: {
        member() {
            return this.$getMember();
        }
    },
    data() {
        return {
            mode : "update"
        };
    }
}
</script>


  D. 
 ```
