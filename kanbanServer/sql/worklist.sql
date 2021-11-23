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