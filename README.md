# Repair service WMA™
####Work manager application
0.0.0 - 0.0.9 is developing versions, stable release start from 0.1.0

Design & developing by [N3stY](https://github.com/N3stY)

######MySQL database dump

    SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
    SET time_zone = "+00:00";
    
    CREATE TABLE `orders` (
      `id` int(11) NOT NULL,
      `code` varchar(70) NOT NULL,
      `type` int(1) NOT NULL DEFAULT '1',
      `title` varchar(200) NOT NULL,
      `owner` varchar(500) NOT NULL,
      `cod-fisc` varchar(16) NOT NULL,
      `withdrawal` int(1) NOT NULL DEFAULT '0',
      `date` varchar(100) NOT NULL,
      `phone` varchar(11) NOT NULL,
      `email` varchar(200) NOT NULL,
      `alert` int(1) NOT NULL DEFAULT '0',
      `comment` varchar(6000) NOT NULL,
      `state` int(11) NOT NULL DEFAULT '0'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    ALTER TABLE `orders` ADD PRIMARY KEY (`id`);
    ALTER TABLE `orders` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
