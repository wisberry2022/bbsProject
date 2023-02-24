create table bbs (
	num int primary key auto_increment,
	title varchar(70) NOT NULL,
	author varchar(50) NOT NULL,
	pwd BLOB NOT NULL,
	writeDate date NOT NULL,
	content MEDIUMTEXT NOT NULL,
	viewcnt int default 0 not null
);