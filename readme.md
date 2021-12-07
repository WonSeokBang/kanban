#포트폴리오

## 개요 :   
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
```

```
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
```
```
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
```
```
  D. 작업 등록
  <template>
    <PageTitle>작업등록</PageTitle>
    <Form />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import Form from "../../components/kanban/Form.vue"
export default {
    components: { PageTitle, Form },
    created() {
        if (!this.$isLogin()) {
            return this.$router.push({ path : "/login"});
        }
    }
}
</script>
 ```
 
 ```
  E. 작업 수정
<template>
    <PageTitle>작업수정</PageTitle>
    <Form :mode="mode" :kanban="kanban" />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import Form from "../../components/kanban/Form.vue"
import kanban from "../../models/kanban.js"
export default {
    components: { PageTitle, Form },
    mixins: [kanban],
    data() {
        return {
            mode : "edit",
            kanban : {},
        };
    },
    created() {
        if (!this.$isLogin()) {
            return this.$router.push({ path : "/login"});
        }
    },
    async mounted() {
        const idx = this.$route.query.idx;
        const result = await this.$get(idx);
        if (result.success) {
            this.kanban = result.data;
        }
    }
}
</script>
 ```
 
 ```
  F. 작업 목록
<template>
<PageTitle>작업 목록</PageTitle>
<router-link to="/kanban/add" class='add_work'>작업추가</router-link>
<List status="ready" />
<List status="progress" />
<List status="done" />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import List from "../../components/kanban/List.vue"
export default {
    components : {PageTitle, List},
    created() {
        if (!this.$isLogin() && this.$getToken()) {
            location.reload();
        }
    },
}
</script>
 ```
 
  ```
  G. 작업 내용 확인
<template>
<PageTitle>작업내용확인</PageTitle>
<div class='work_view'>
    <dl>
        <dt>작업구분</dt>
        <dd v-if="view.status == 'progress'">진행중</dd>
        <dd v-else-if="view.status == 'done'">완료</dd>
        <dd v-else>준비중</dd>
    </dl>
    <dl>
        <dt>등록일</dt>
        <dd>{{ view.regDt }}</dd>
    </dl>
    <dl>
        <dt>작업명</dt>
        <dd>{{ view.subject }}</dd>
    </dl>
    
    <div v-html="view.contentHtml" class='content'></div>
    
    <div class='btns'>
        <button type="button" @click="goLink('add')">추가</button>
        <button type="button" @click="goLink('edit')">수정</button>
        <button type="button" @click="deleteWork">삭제</button>
        <button type="button" @click="goLink('list')">목록</button>
    </div>
</div>

<MessagePopup ref="popup" :message="message" />
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
import MessagePopup from "../../components/common/Message.vue"
import kanban from "../../models/kanban.js"
export default {
    components : {PageTitle, MessagePopup},
    mixins : [kanban],
    data() {
        return {
            message : "",
            view : {},
        };
    },
    async mounted() {
        const idx = this.$route.query.idx;
        const result = await this.$get(idx);
        if (result.success) {
            this.view = result.data;
        }

        if (result.message) {
            this.$showMessage(this, result.message);
        }
    },
    methods : {
        /** 링크 이동  */
        goLink(link) {
            this.$router.push({ path : "/kanban/" + link, query : { idx : this.view.idx }});
        },
        async deleteWork() {
            if (!confirm('정말 삭제하시겠습니까?')) {
                return;
            }

            const idx = this.view.idx;
            const result = await this.$deleteWork(idx);
            if (result.success) {
                this.$router.push({ path : "/kanban/list" });
            }

            if (result.message) {
                this.$showMessage(this, result.message);
            }
        }
    }
}
</script>
 ```
 
  ```
  H. DB
CREATE TABLE `member` (
  `memNo` int NOT NULL AUTO_INCREMENT,
  `memId` varchar(30) NOT NULL,
  `memPw` varchar(65) NOT NULL,
  `memNm` varchar(30) NOT NULL,
  `cellPhone` varchar(11) DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL,
  `tokenExpires` datetime DEFAULT NULL,
  `regDt` datetime DEFAULT CURRENT_TIMESTAMP,
  `modDt` datetime DEFAULT NULL,
  PRIMARY KEY (`memNo`),
  UNIQUE KEY `memId` (`memId`),
  KEY `ix_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 ```
 ```
 CREATE TABLE `worklist` (
  `idx` int NOT NULL AUTO_INCREMENT,
  `memNo` int DEFAULT '0',
  `status` enum('ready','progress','done') DEFAULT 'ready',
  `subject` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `regDt` datetime DEFAULT CURRENT_TIMESTAMP,
  `modDt` datetime DEFAULT NULL,
  PRIMARY KEY (`idx`),
  KEY `ix_memNo` (`memNo`),
  KEY `ix_regDt_desc` (`regDt` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 ```
 
 ```
 I. 회원가입, 로그인 처리 (PHP)
 
<?php
include_once "../common.php";
$member = Member::getInstance(); // Member 인스턴스
try {
	switch (Request::get("mode")) {
		case "join": // 회원가입 처리 
			$memberInfo = $member->join($in);
			if ($memberInfo) {
				$success = true;
				$returnData = $memberInfo;
			} else {
				throw new Exception("회원가입 실패");
			}
			break;
		case "update" :  // 회원정보 수정
			$result = $member->update($in);
			if (!$result) {
				throw new Exception("회원정보 수정 실패하였습니다.");
			}
			$success = true;
			$message = "회원정보가 수정되었습니다.";
			break;
		case "login" : // 로그인 처리 
			$token = $member->login($in);
			if (!$token) {
				throw new Exception("로그인 실패하였습니다.");
			}
			$success = true;
			$returnData = ["token" => $token];
			break;
		/** 토큰으로 회원 정보 조회 */
		case "get_member" : 
			$memberData = $member->getByToken($in['token']);
			if (!$memberData) {
				throw new Exception("토큰 회원조회 실패");
			}
			
			$success = true;
			$returnData = $memberData;
			break;
		default : 
			if (Request::get("origin") != 'front') {
				echo "<script>location.replace('/');</script>";
				exit;
			}
	}
} catch(Exception $e) {
	$message = $e->getMessage() . "[".$e->getFile()."/".$e->getLine()."]";
}

include_once "../output.php";
 ```
 
 ```
 J. 게시물 추가, 삭제 처리 (PHP)
 <?php
include_once "../common.php"; // 공통 정의 부분

$kanban = Kanban::getInstance();

try {
	/** 회원 전용 서비스 체크 */
	if (!Request::get("memNo")) {
		throw new Exception("회원전용 서비스 입니다.");
	}
	
	switch(Request::get("mode")) {
		/** 작업 추가 */
		case "add" : 
			$idx = $kanban->addWork($in);
			if (!$idx) {
				throw new Exception("작업등록 실패하였습니다.");
			}
			
			$success = true;
			$returnData = ["idx" => $idx];
			break;
		/** 작업 수정 */
		case "edit" : 
			$result = $kanban->editWork($in);
			if (!$result) {
				throw new Exception("작업수정 실패하였습니다.");
			}
			
			$success = true;
			$returnData = $result;
			break;
		/** 작업 삭제 */
		case "delete" : 
			if (!isset($in['idx']) || !$in['idx']) {
					throw new Exception("작업등록번호 누락");
			}
			
			$info = $kanban->get($in['idx']);
			if (!$info) {
				throw new Exception("삭제할 작업내역이 없습니다.");
			}
			
			if ($info['memNo'] != $in['memNo']) {
				throw new Exception("본인이 작성한 작업내역만 삭제 가능합니다.");
			}
			
			$result = $kanban->deleteWork(Request::get("idx"));
			if (!$result) {
				throw new Exception("작업삭제 실패하였습니다.");
			}
			
			$success = true;
			break;
		/** 작업 목록 */
		case "getList" : 
			$memNo = Request::get("memNo", 0);
			$status = Request::get("status", "ready");
			$result = $kanban->getList($memNo, $status);
			if (!$result) {
				throw new Exception("작업 목록 조회 실패");
			}
			
			$success = true;
			$returnData = $result;
			break;
		/** 작업 내용 */
		case "get" : 
			$idx = Request::get("idx");
			if (!$idx) {
				throw new Exception("작업등록번호 누락");
			}
			
			$result = $kanban->get($idx);
			if (!$result) {
				throw new Exception("작업내역이 없습니다.");
			}
			
			$success = true;
			$returnData = $result;
			break;
		default :
			if (Request::get("origin") != 'front') {
				echo "<script>location.replace('/');</script>";
				exit;
			}
	}
} catch (Exception $e) {
	$message = $e->getMessage();
}

include_once "../output.php";
```
