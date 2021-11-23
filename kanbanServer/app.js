const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require("./models");
const memberRouter = require('./routes/member'); // 회원 Router
const kanbanRouter = require('./routes/kanban'); // 칸반보드 Router

const app = express();
app.set('PORT', process.env.PORT || 3000);

/** DB 연결 */
sequelize.sync({ force : false })
		.then(() => {
			console.log("DB 연결 성공!");
		})
		.catch((err) => {
			console.error(err);
		});

app.use(morgan('dev'));

/** 공통 미들웨어 */
app.use((req,res,next) => {
	res.header("Access-Control-Allow-Origin", "*"); // CORS 
	res.header("Access-Control-Allow-Headers", "*"); // CORS
	next();
});

/** body-parser */
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

/** 정적 경로 */
app.use(express.static(path.join(__dirname, 'public')));

/** 라우터 등록 */
app.use("/member", memberRouter);
app.use("/kanban", kanbanRouter);

/** 없는 페이지 처리 라우터 */
app.use((req, res, next) => {
	if (req.body.origin != 'front') {
		return res.redirect("/");
	}
	
	const error = new Error(`${req.method} ${req.url}는 없는 페이지 입니다`);
	error.status = 404;
	next(error);	
});

/** 에러처리 라우터 */
app.use((err, req, res, next) => {
	const data = {
		status : err.status || 500,
		message : err.message,
	};
	
	return res.json(data);
});

app.listen(app.get('PORT'), () => {
	console.log(app.get('PORT'), "번 포트에서 서버 대기중....");
});
