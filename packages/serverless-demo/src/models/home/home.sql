
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`(
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `title` NOT NULL VARCHAR(32),
    `content` NOT NULL VARCHAR(32),
    `date` timestamp NULL DEFAULT NULL COMMENT '申请日期',
    `author` NOT NULL VARCHAR(32),
    PRIMARY KEY `id`
 ) ENGINE=InnoDB;