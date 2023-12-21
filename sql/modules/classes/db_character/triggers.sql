-- file: modules/classes/triggers.ts
DROP TABLE IF EXISTS `player_trigger`;
CREATE TABLE `player_trigger` (
  `triggerId` int unsigned NOT NULL AUTO_INCREMENT,
  `triggerName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `characterGuid` int unsigned NOT NULL,
  `isSet` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`triggerId`),
  UNIQUE KEY `triggerName` (`triggerName`,`characterGuid`),
  KEY `characterGuid` (`characterGuid`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci