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