
--
-- Структура таблицы `answerers`
--

CREATE TABLE IF NOT EXISTS `answerers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(80) NOT NULL,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `answerers`
--

INSERT INTO `answerers` (`id`, `surname`, `name`) VALUES
(1, 'Торвальдс', 'Линус'),
(2, 'Лердорф', 'Расмус'),
(3, 'Айк', 'Брендан'),
(4, 'Павлов', 'Алексей');

-- --------------------------------------------------------

--
-- Структура таблицы `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category` smallint(5) unsigned NOT NULL,
  `answerer` int(10) unsigned NOT NULL,
  `title` tinytext NOT NULL,
  `text` text NOT NULL,
  `answer` text NOT NULL,
  `created` datetime NOT NULL,
  `changed` datetime NOT NULL,
  `answered` datetime DEFAULT NULL,
  `author` varchar(40) NOT NULL,
  `shown` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pastor` (`answerer`),
  KEY `created` (`created`),
  KEY `answered` (`answered`),
  KEY `shown` (`shown`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `questions`
--

INSERT INTO `questions` (`id`, `category`, `answerer`, `title`, `text`, `answer`, `created`, `changed`, `answered`, `author`, `shown`) VALUES
(1, 1, 1, 'Как установить Линукс?', 'У меня на компьютере Windows, как мне поставить Linux?', '', '2012-05-03 00:00:00', '2012-07-15 16:31:35', NULL, 'Джон Доу', 1),
(2, 2, 2, 'Как сделать сайт?', 'Хочу сделать сайт, чтобы мои фанаты могли заходить туда. Как мне его сделать?', '', '2012-05-04 00:26:03', '2012-07-15 16:28:30', NULL, 'Кащей Б.', 1),
(3, 3, 3, 'Есть ли какие-нибудь хорошие библиотеки для создания сайтов на Javascript?', 'Есть ли какие-нибудь хорошие библиотеки для создания сайтов на Javascript?', 'Да, конечно, есть отличная библиотека AngularJs.', '2012-05-04 00:27:05', '2012-05-04 16:52:34', '2012-05-04 00:27:05', 'Садовник', 1),
(9, 4, 4, 'Что такое AngularJs?', 'Что такое AngularJs? Где мне про него почитать?', '', '2012-08-14 00:00:00', '2012-08-14 00:00:00', NULL, 'Иванов П.С.', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `question_categories`
--

CREATE TABLE IF NOT EXISTS `question_categories` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `parent` smallint(6) DEFAULT NULL,
  `title` varchar(40) NOT NULL,
  `alias` varchar(40) NOT NULL,
  `shown` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`),
  KEY `parent` (`parent`),
  KEY `shown` (`shown`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `question_categories`
--

INSERT INTO `question_categories` (`id`, `parent`, `title`, `alias`, `shown`) VALUES
(1, NULL, 'Серверы', 'server', 1),
(2, NULL, 'PHP', 'php', 1),
(3, NULL, 'Javascript', 'javascript', 1),
(4, NULL, 'Angular', 'angular', 1);
