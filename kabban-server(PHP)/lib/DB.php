<?php
/**
* DB 연결 클래스
*
*/
class DB extends PDO {
	private static $instance;
	private function __construct(){
		try{
			$dsn = "mysql:host=localhost;dbname=bws961228";
			$username = "bws961228";
			$password = "walkmouse3!@";
			parent::__construct($dsn, $username, $password);
			
		} catch(PDOException $e){
			echo $e->getMessage();
			exit;
		}
	}
	
	public static function getInstance(){
		if(!self::$instance){ // self:: -> 클래스명
			self::$instance = new DB();
		} 
		
		return self::$instance;
	}
}