const { sequelize, Sequelize : { QueryTypes } } = require('./index');

/**
* 칸반보드 model
*
*/
const kanban = {
	/** 필수 입력 항목 */
	required : {
		memNo : "회원만 사용가능한 서비스 입니다.",
		status : "작업 구분을 선택하세요.",
		subject : "작업명을 입력하세요.",
		content : "작업내용을 입력하세요.",
	},
	async addWork(data) {
		this.checkData(data); // 데이터 유효성 검사
		
		const replacements = {
				memNo : data.memNo || 0,
				status : data.status,
				subject : data.subject,
				content : data.content,
		};
		const sql = `INSERT INTO worklist (memNo, status, subject, content) 
								VALUES (:memNo, :status, :subject, :content)`;
		try {
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			return result[0];
		} catch (err) {
			console.error(err);
			return false;
		}		
	},
	async editWork(data) {
		this.required.idx = "작업등록번호가 누락되었습니다.";
		this.checkData(data);
		
		const info = await this.get(data.idx);
		if (!info) {
			throw new Error("수정할 작업내역이 없습니다.");
		}
		
		if (info.memNo != data.memNo) {
			throw new Error('본인이 작성한 작업 내역만 수정 가능합니다.');
		}
		
		try {
			const sql = `UPDATE worklist 
									SET 
										status = :status,
										subject = :subject,
										content = :content 
								WHERE 
									idx = :idx`;
			const replacements = {
					status : data.status,
					subject : data.subject,
					content : data.content,
					idx : data.idx,
			};
			await sequelize.query(sql, {
					replacements,
					type : QueryTypes.UPDATE,
			});
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
		
	},
	/** 작업 삭제 */
	async deleteWork(idx) {		
		try {
			const sql = "DELETE FROM worklist WHERE idx = ?";
			await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.DELETE,
			});
			return true;
		} catch(err) {
			console.error(err);
			return false;
		}
	},
	/**
	* 작업목록(본인이 작성한)
	*
	* @param memNo 회원번호
	* @param status - ready, progress, done 
	*/
	async getList(memNo, status) {
		try {
			const sql = `SELECT a.*, m.memId, m.memNm FROM worklist a 
										LEFT JOIN member m ON a.memNo = m.memNo 
									WHERE a.memNo = :memNo AND a.status = :status 
									ORDER BY a.regDt DESC`;
			const replacements = { memNo, status };						
			const rows = await sequelize.query(sql, {
					replacements,
					type : QueryTypes.SELECT,
			});
			
			return rows;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	/**
	* 작업내용 조회 
	*
	* @param idx 작업등록번호 
	*/
	async get(idx) {
		try {
			const sql = "SELECT * FROM worklist WHERE idx = ?";
			const rows = await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.SELECT,
			});
			
			if (rows.length == 0) {
				return false;
			}
			
			const data = rows[0];
			if (data) {
				const date = new Date(data.regDt);
				const year = date.getFullYear();
				let month = date.getMonth() + 1;
				month = (month < 10)?"0"+month:month;
				let day = date.getDate();
				day = (day < 10)?"0"+day:day;
				data.regDt = `${year}.${month}.${day}`;
				
				data.contentHtml = data.content.replace(/\r\n/g, "<br>");
				
			}
			return data;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	/** 데이터 유효성 검사 */
	checkData(data) {
		if (data.mode == 'edit') { // 작업내용 수정 
			this.required.idx = "작업등록번호가 누락되었습니다.";
		}
		const required = this.required;
		for (let key in required) {
			if (!data[key]) {
				throw new Error(required[key]);
			}
		}
	}
};

module.exports = kanban;