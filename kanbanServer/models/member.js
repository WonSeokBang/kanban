const { sequelize, Sequelize : { QueryTypes } } = require("./index");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
* 회원 models
*
*/
const member = {
	/**
	* 회원가입
	*
	*/
	async join(data) {
		await this.checkJoinData(data);
		
		try {
			const sql = `INSERT INTO member (memId, memPw, memNm, cellPhone) 
									VALUES (:memId, :memPw, :memNm, :cellPhone)`;
			const hash = data.memPw?await bcrypt.hash(data.memPw, 10):"";
			let cellPhone = "";
			if (data.cellPhone) {
				cellPhone = data.cellPhone.replace(/[^0-9]/g, "");
			}
			const replacements = {
				memId : data.memId,
				memPw : hash,
				memNm : data.memNm,
				cellPhone,
			};

			const result = await sequelize.query(sql, {
					replacements : replacements,
					type : QueryTypes.INSERT,
			});
			
			const memNo = result[0];
			const memberInfo = await this.get(memNo);
			
			return memberInfo;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	/**
	* 회원정보 수정
	*
	*/
	async update(data) {
		/** 필수 항목 체크 S */
		const required = {
			token : "토큰이 누락되었습니다.",
			memNm : "회원명을 입력하세요.",
		};
		
		for (let key in required) {
			if (!data[key]) {
				throw new Error(required[key]);
			}
		}
		/** 필수 항목 체크 */
		
		/** 비밀번호 변경 시도시 비밀번호 체크 */
		this.checkPassword(data.memPw, data.memPwRe);
		
		/** 휴대전화번호 형식 체크 */
		this.checkCellPhone(data.cellPhone);	
		
		let cellPhone = "";
		if (data.cellPhone) {
			cellPhone = data.cellPhone.replace(/[^0-9]/g, "");
		}
			
		const replacements = {
				memNm : data.memNm,
				cellPhone,
		};
		let addSet = "";
		if (data.memPw) {
			const hash = await bcrypt.hash(data.memPw, 10);
			addSet = ",memPw = :hash";
			replacements.hash = hash;
		}
		
		replacements.token = data.token;
		
		try {
			const sql = `UPDATE member 
									SET 
										memNm = :memNm,
										cellPhone = :cellPhone
										${addSet}
								WHERE 
									token = :token`;
			await sequelize.query(sql, {
				replacements, 
				type : QueryTypes.UPDATE
			});
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	/**
	* 로그인 처리 
	*
	*/ 
	async login(data) {
		/**
		* 1. 필수 항목(아이디, 비번) 체크(O)
		* 2. 아이디 -> 회원정보 조회(O)
		* 3. 회원이 있으면 비밀번호 체크 (O)
		* 4. 비밀번호 일치하는 경우 (O)
			   접속 유효 시간이 있는 토큰 발급 -> 
			   토큰을 프론트 브라우저에 저장(세션 스토리지)
			   토큰을 프론트 -> 서버로 -> 토큰 검증(유효시간이 남아 있고 회원 ID 있으면) 
			   -> 회원 정보를 프론트로 전송
		*/
		if (!data.memId) {
			throw new Error('아이디를 입력하세요.');
		}
		
		if (!data.memPw) {
			throw new Error('비밀번호를 입력하세요.');
		}
		
		// 회원정보 조회
		const info = await this.get(data.memId, true);
		if (!info) {
			throw new Error("존재하지 않는 회원입니다.");
		}
		
		// 비밀번호 체크 
		const match = await bcrypt.compare(data.memPw, info.memPw);
		if (!match) {
			throw new Error('비밀번호가 일치하지 않습니다.');
		}
		
		// 토큰 -> 로그인한 회원 정보를 조회, 유효시간 
		const token = await this.generateToken(data.memId);
		return token;
	},
	
	/**
	* 회원가입 유효성 검사
	*   1. 필수 항목 체크(memId, memPw, memPwRe, memNm) - O
	*   2. 아이디 체크(자리수 6자리 이상, 알파벳 + 숫자) - O 
	*   3. 중복 아이디 체크 - O
	*   4. 비밀번호 체크(자리수 8자리 이상, 알파벳 + 숫자 + 특수 문자) - O 
	*   5. 비밀번호 확인 - O
	*   6. 휴대전화번호는 필수 X -> 입력된 경우는 휴대전화번호 형식 체크
	*/
	async checkJoinData(data) {
		// 필수 항목 체크 
		const required = {
			memId : "아이디를 입력하세요.",
			memPw : "비밀번호를 입력하세요.",
			memPwRe : "비밀번호를 확인하세요.",
			memNm : "회원명을 입력하세요.",
		};
		
		for (let key in required) {
			if (!data[key] || (data[key] && data[key].trim() == "")) {
				throw new Error(required[key]);
			}
		}
		
		// 아이디 체크 S 
		const memId = data.memId;
		if (memId.length < 6) {
			throw new Error("아이디는 6자리 이상 입력하세요.");
		}
		
		// test (매칭이되면 true), exec - 매칭이 되면 매칭된 요소를 반환
		// /[^a-z0-9]/ - 알파벳, 숫자가 아닌 문자 - case-insensitive
		if (/[^a-z0-9]/i.test(memId)) {
			throw new Error("아이디는 알파벳과 숫자로만 입력하세요.");
		}
		// 아이디 체크 E 
		
		// 중복 아이디 체크 S 
		const sql = "SELECT COUNT(*) cnt FROM member WHERE memId = ?";
		const rows = await sequelize.query(sql, {
				replacements : [memId],
				type : QueryTypes.SELECT,
		});
		
		if (rows[0].cnt > 0) { // 이미 가입된 경우 
			throw new Error('이미 가입된 아이디 입니다. - ' + memId);
		}
		// 중복 아이디 체크 E
		
		// 비밀번호 체크 S
		this.checkPassword(data.memPw, data.memPwRe);
		// 비밀번호 체크 E 
		
		// 휴대전화번호 형식 체크 S 
		this.checkCellPhone(data.cellPhone);
		// 휴대전화번호 형식 체크 E 
	},
	/** 비밀번호 체크 */
	checkPassword(memPw, memPwRe) {
		if (!memPw)
			return;
		
		if (memPw.length < 8) {
			throw new Error("비밀번호는 8자리 이상 입력하세요.");
		}

		if (!/[a-z]/i.test(memPw) || !/[0-9]/.test(memPw) || !/[~!@#$%^&*()]/.test(memPw)) {
			throw new Error("비밀번호는 1개이상의 알파벳, 숫자, 특수문자로 입력하세요.");
		}
		
		// 비밀번호 확인 S 
		if (memPw != memPwRe) {
			throw new Error("비밀번호를 확인하세요.");
		}
		// 비밀번호 확인 E 
	},
	/** 휴대전화번호 형식 체크 */
	checkCellPhone(cellPhone) {
		if (!cellPhone) {
			return;
		}
		
		cellPhone = cellPhone.replace(/[^0-9]/g, "");
		const pattern = /^01[016789][0-9]{3,4}[0-9]{4}$/;
		if (!pattern.test(cellPhone)) {
			throw new Error('휴대전화번호 형식이 아닙니다.');
		}
	},
	/**
	* 회원 정보 조회
	*
	* @param memNo - 정수 - 회원번호, 문자 -> 아이디
	*/
	async get(memNo, isLogin) {
		try {
			let fields = "memNo";
			if (typeof memNo == 'string') {
				fields = "memId";
			}
			
			const sql = `SELECT * FROM member WHERE ${fields} = ?`;
			const rows = await sequelize.query(sql, {
					replacements : [memNo],
					type : QueryTypes.SELECT,
			});
			
			if (rows.length == 0) { // 회원이 없는 경우 
				return false;
			}
			const data = rows[0];
			if (!isLogin) {
				delete data.memPw;
			}
			
			return data;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	/**
	* 토큰 발급 
	*     - 로그인 유지
	*     - 유효 시간(2시간)
	*/
	async generateToken(memId) {
		const now = Date.now();
		const hash = crypto.createHash('md5').update("" + now).digest('hex');
		
		const expireTime = now + 60 * 60 * 2 * 1000;
		const sql = `UPDATE member 
								SET 
									token = :token,
									tokenExpires = :tokenExpires 
							WHERE 
									memId = :memId`;
		const replacements = {
				token : hash,
				tokenExpires : new Date(expireTime),
				memId,
		};
		
		try {
			await sequelize.query(sql, {
				replacements, 
				type : QueryTypes.UPDATE,
			});
			
			return hash;
		} catch (err) {
			console.error(err);
			return false;
		}
 		
	},
	/** 토큰으로 회원 정보 조회 */
	async getByToken(token) {
		if (!token) {
			throw new Error('토큰이 누락되었습니다');
		}
		
		let rows = [];
		try {
			const sql = 'SELECT * FROM member WHERE token = ?';
			rows = await sequelize.query(sql, {
				replacements : [token],
				type : QueryTypes.SELECT,
			});
		} catch (err) {
			console.log(err);
			return false;
		}
		
		if (rows.length == 0) {
			throw new Error('존재하지 않는 회원입니다');
		}
			
		const data = rows[0];
		delete data.memPw;
		
		const expireTime = new Date(data.tokenExpires).getTime();
		if (expireTime < Date.now()) {
			throw new Error('토큰이 만료 되었습니다.');
		}
			
		return data;
	}
};

module.exports = member;