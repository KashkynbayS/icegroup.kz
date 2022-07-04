CREATE TABLE IF NOT EXISTS `icegroup` (
  `id` int(9) unsigned NOT NULL auto_increment,
  `parent_id` mediumint(9) unsigned NOT NULL default '0',
  `first_parent` mediumint(9) unsigned NOT NULL default '0',
  `date` int(10) unsigned NOT NULL,
  `theme_id` smallint(6) unsigned NOT NULL,
  `login` varchar(30) collate utf8_unicode_ci NOT NULL,
  `message` varchar(9999) collate utf8_unicode_ci NOT NULL,
  `moderation` tinyint(3) unsigned NOT NULL default '0',
  `plus` mediumint(9) NOT NULL default '0',
  `minus` mediumint(9) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `theme_id` (`theme_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;