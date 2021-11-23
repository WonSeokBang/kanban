const member = require("../models/member");
const router = require('express').Router();

router.use(async (req, res) => {
	const mode = req.body.mode || req.query.mode;
	const data = req.body.mode?req.body:req.query;
	
	let success = false;
	let returnData = {};
	let message = "";
	try {
		switch(mode) {
			case "join": // 회원가입 처리 
				const memberInfo = await member.join(data);
				if (memberInfo) {
					success = true;
					returnData = memberInfo;
				} else { // 회원 가입 실패
					throw new Error("회원가입 실패");
				}
				break;
			case "update": // 회원정보 수정
				const result = await member.update(data);
				if (!result) {
					throw new Error('회원정보 수정 실패하였습니다.');
				}
				success = true;
				message = "회원정보가 수정되었습니다.";
				break;
			case "login" : // 로그인 처리 
				const token = await member.login(data);
				if (!token) {
					throw new Error('로그인 실패하였습니다.');
				}
				success = true;
				returnData = { token };
				break;
			/** 토큰으로 회원 정보 조회 */
			case "get_member" : 
				const memberData = await member.getByToken(data.token);
				if (!memberData) {
					throw new Error('토큰 회원조회 실패');
				}
				
				success = true;
				returnData = memberData;
				break;
			default : 
				if (data.origin != 'front') {
					return res.redirect('/');
				}
		}
	} catch (err) {
		console.log(err);
		message = err.message;
	}
	const result = { 
		success,
		data : returnData,
		message
	};
	return res.json(result);
});

module.exports = router;