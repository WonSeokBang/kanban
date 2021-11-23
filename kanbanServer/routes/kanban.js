const router = require('express').Router();
const kanban = require("../models/kanban");

router.use(async (req, res) => {
	const data = req.body;
	const mode = data.mode;
	let success = false;
	let returnData = {};
	let message = "";
	let result = {};
	console.log(data);
	try {
		switch (mode) {
			/** 작업 추가 */
			case "add": 
				const idx = await kanban.addWork(data);
				if (!idx) {
					throw new Error('작업등록 실패하였습니다.');
				}
				
				success = true;
				returnData = { idx };
				break;
			/** 작업 수정 */
			case "edit" : 
				result = await kanban.editWork(data);
				if (!result) {
					throw new Error('작업수정 실패하였습니다');
				}
				
				success = true;
				returnData = result;
				break;
			/** 작업 삭제 */
			case "delete" :
				if (!data.idx) {
					throw new Error('작업등록번호 누락');
				}
				
				const info = await kanban.get(data.idx);
				if (!info) {
					throw new Error('삭제할 작업내역이 없습니다.');
				}
				
				if (info.memNo != data.memNo) {
					throw new Error('본인이 작성한 작업내역만 삭제 가능합니다.');
				}
				
				result = await kanban.deleteWork(data.idx);
				if (!result) {
					throw new Error('작업삭제 실패하였습니다');
				}
				
				success = true;
				break;
			/** 작업 목록 */
			case "getList":
				if (!data.memNo) {
					throw new Error("회원전용 서비스 입니다.");
				}
				
				const memNo = data.memNo || 0;
				const status = data.status || "ready";
				result = await kanban.getList(memNo, status);
				if (!result) {
					throw new Error('작업 목록 조회 실패');
				}
				
				success = true;
				returnData = result;
				break;
			/** 작업 내용 */
			case "get" : 
				if (!data.idx) {
					throw new Error("작업등록번호 누락");
				}
				
				result = await kanban.get(data.idx);
				if (!result) {
					throw new Error("작업내역이 없습니다.");
				}
				
				success = true;
				returnData = result;
				break;
			default :
				if (data.origin != 'front') {
					return res.redirect('/');
				}
		}
	} catch(err) {
		success = false;
		message = err.message;
	}
	
	const _result = {
		success, 
		data : returnData,
		message,
	};
	return res.json(_result);
});

module.exports = router;