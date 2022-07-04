-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Май 04 2018 г., 17:41
-- Версия сервера: 5.5.52-MariaDB-cll-lve
-- Версия PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `v_20478_metal`
--

-- --------------------------------------------------------

--
-- Структура таблицы `icegroup_search`
--

CREATE TABLE `icegroup_search` (
  `keywords` varchar(255) CHARACTER SET utf8 NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `link` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `icegroup_search`
--

INSERT INTO `icegroup_search` (`keywords`, `name`, `link`) VALUES
('1502', 'Холодильный шкаф ШХ', 'http://icegroup.kz/shx.html'),
('1503', 'Холодильный шкаф П-390С', 'http://icegroup.kz/capri390.html'),
('1504', 'Холодильный шкаф Capri П-490СК', 'http://icegroup.kz/capri490.html'),
('1505', 'Холодильный шкаф Capri 0,5СК', 'http://icegroup.kz/capri05.html'),
('1506', 'Холодильный шкаф ШХ 0,80С Купе', 'http://icegroup.kz/shx08.html'),
('1507', 'Холодильный шкаф ШХ 0,80С', 'http://icegroup.kz/shx080.html'),
('1508', 'Холодильный шкаф Elton 0,7У купе', 'http://icegroup.kz/elton07.html'),
('1509', 'Холодильный шкаф Capri 1,12СК Купе', 'http://icegroup.kz/capri112.html'),
('1510', 'Холодильный шкаф Capri 1,5СК Купе', 'http://icegroup.kz/capri15.html'),
('1511', 'Холодильный шкаф Elton 1,5С Купе', 'http://icegroup.kz/elton15.html'),
('1512', 'Холодильный шкаф Carboma ULTRA', 'http://icegroup.kz/carboma_shkaf.html'),
('1513', 'Холодильный шкаф Carboma Premium', 'http://icegroup.kz/carboma_shkaf2.html'),
('1514', 'Холодильный шкаф Capri нержавейка', 'http://icegroup.kz/kapri_nerjaveika.html'),
('1515', 'Холодильный шкаф Bonvini', 'http://icegroup.kz/bonvini.html'),
('1516', 'Холодильный шкаф с металлическими дверьми Carboma', 'http://icegroup.kz/carboma_met.html'),
('1617', 'Холодильная витрина CARBOMA GC95', 'http://icegroup.kz/gc95.html'),
('1618', 'Холодильная витрина Carboma закрытая', 'http://icegroup.kz/carboma_close.html'),
('1619', 'Холодильная витрина CARBOMA открытая', 'http://icegroup.kz/carboma_open.html'),
('1620', 'Холодильная витрина ПОЛЮС', 'http://icegroup.kz/vitrina_polus.html'),
('1621', 'Холодильная витрина ЭКО MAXI', 'http://icegroup.kz/vitrina_eko_maxi.html'),
('1622', 'Холодильная витрина ЭКО MINI', 'http://icegroup.kz/vitrina_eko_mini.html'),
('1623', 'Холодильная витрина ILET BXH', 'http://icegroup.kz/ilet_bhx.html'),
('1624', 'Холодильная витрина ILET BXC', 'http://icegroup.kz/ilet_bhc.html'),
('1625', 'Холодильная витрина Nova ВХН', 'http://icegroup.kz/nova_bxh.html'),
('1626', 'Холодильная витрина Tair ВХН', 'http://icegroup.kz/tair_bxh.html'),
('1627', 'Холодильная витрина ILET BXCD', 'http://icegroup.kz/ilet_bxcd.html'),
('1629', 'Холодильная витрина ILET BXCO', 'http://icegroup.kz/ilet_bxcho.html'),
('1630', 'Холодильная витрина ВХС-УВ Илеть', 'http://icegroup.kz/bxc_ub.html'),
('1631', 'Холодильная витрина ВХС-УH Илеть', 'http://icegroup.kz/bxc_uh.html'),
('1632', 'Холодильная витрина ВХСo-УH Илеть', 'http://icegroup.kz/bxco_uh.html'),
('1633', 'Холодильная витрина Tair ВХС-УН', 'http://icegroup.kz/tair_bxc_uh.html'),
('1634', 'Холодильная витрина Tair ВХС-УВ', 'http://icegroup.kz/tair_bxc_ub.html'),
('1635', 'Холодильная витрина Parabel ВХС', 'http://icegroup.kz/parabel_bxc.html'),
('1636', 'Холодильная витрина Parabel ВХС-УВ', 'http://icegroup.kz/parabel_bxc_ub.html'),
('1637', 'Холодильная витрина Parabel ВХС-УН', 'http://icegroup.kz/parabel_bxc_uh.html'),
('1638', 'Холодильная витрина Parabel ВХСo', 'http://icegroup.kz/parabel_bxco.html'),
('1639', 'Холодильная витрина GC110', 'http://icegroup.kz/gc110.html'),
('1717', 'Пристенная холодильная витрина CARBOMA CUBA', 'http://icegroup.kz/carboma_cuba.html'),
('1718', 'Пристенная холодильная витрина CARBOMA TOKYO', 'http://icegroup.kz/carboma_tokyo.html'),
('1719', 'Пристенная холодильная витрина CARBOMA BRITANY', 'http://icegroup.kz/carboma_britany.html'),
('1720', 'Пристенная холодильная витрина CARBOMA CRETE', 'http://icegroup.kz/carboma_crete.html'),
('1721', 'Пристенная холодильная витрина CARBOMA PROVANCE', 'http://icegroup.kz/carboma_provance.html'),
('1722', 'Пристенная холодильная витрина ПОЛЮС', 'http://icegroup.kz/carboma_polus.html'),
('1723', 'Пристенная холодильная витрина Florence', 'http://icegroup.kz/florence.html'),
('1724', 'Пристенная холодильная витрина Varshava 210', 'http://icegroup.kz/varshava_bxc.html'),
('1725', 'Пристенная холодильная витрина Varshava BXC 210 фруктовая', 'http://icegroup.kz/varshava_bxc_fruit.html'),
('1726', 'Пристенная холодильная витрина Varshava 160', 'http://icegroup.kz/varshava_bxcp.html'),
('1727', 'Пристенная холодильная витрина Varshava 220', 'http://icegroup.kz/varshava_bxc_1875.html'),
('1728', 'Пристенная холодильная витрина Kupes', 'http://icegroup.kz/kupes.html'),
('1729', 'Пристенная холодильная витрина Nova ВХСп', 'http://icegroup.kz/nova_bxcp.html'),
('1730', 'Пристенная холодильная витрина Varshava BXCп-1,875', 'http://icegroup.kz/varshava_bxcp_1875.html'),
('1731', 'Пристенная холодильная витрина Kupes ВХСп', 'http://icegroup.kz/kupes_bxcp.html'),
('1733', 'Пристенная холодильная витрина Varshava BXCп-2,5', 'http://icegroup.kz/varshava_bxcp_25.html'),
('1734', 'Пристенная холодильная витрина Varshava торцевая', 'http://icegroup.kz/varshava_torcevaya.html'),
('1735', 'Пристенная холодильная витрина Varshava ВХСп-3,75', 'http://icegroup.kz/varshava_bxcp_375.html'),
('1736', 'Пристенная холодильная витрина Varshava BXCнп-3,75', 'http://icegroup.kz/varshava_bxcnp_375.html'),
('1737', 'Пристенная холодильная витрина Barcelona', 'http://icegroup.kz/barcelona.html'),
('1801', 'Бонета Kalipso', 'http://icegroup.kz/boneta_kalipso.html'),
('1803', 'Бонета Кupec', 'http://icegroup.kz/boneta_kupec.html'),
('1804', 'Бонета Malta', 'http://icegroup.kz/boneta_malta.html'),
('1805', 'Бонета Rica', 'http://icegroup.kz/boneta_rica.html'),
('1806', 'Бонета Bonvini (со съемными створками)', 'http://icegroup.kz/boneta_bonvini.html'),
('1807', 'Бонета BFG с гнутым стеклом', 'http://icegroup.kz/boneta_bfg.html'),
('1808', 'Бонета BFG торцевая', 'http://icegroup.kz/boneta_torcevaya.html'),
('1809', 'Бонета BF', 'http://icegroup.kz/boneta_bf.html'),
('2100', 'Морозильный ларь с гнутым стеклом красный', 'http://icegroup.kz/lar_gnutyi.html'),
('2103', 'Морозильный ларь с гнутым стеклом синий', 'http://icegroup.kz/lar_gnutyi_siniy.html'),
('2104', 'Морозильный ларь с гнутым стеклом серый', 'http://icegroup.kz/lar_gnutyi_seryi.html'),
('2101', 'Морозильный ларь с глухой крышкой', 'http://icegroup.kz/lar_gluhoi.html'),
('2102', 'Морозильный ларь с прямым стеклом красный', 'http://icegroup.kz/lar_pryamoi.html'),
('2105', 'Морозильный ларь с прямым стеклом синий', 'http://icegroup.kz/lar_pryamoi_siniy.html'),
('2106', 'Морозильный ларь с прямым стеклом серый', 'http://icegroup.kz/lar_pryamoi_seryi.html'),
('2001', 'Кондитерский шкаф Veneto', 'http://icegroup.kz/veneto.html'),
('2002', 'Кондитерская витрина Veneto VS-0,95', 'http://icegroup.kz/veneto_vs.html'),
('2003', 'Кондитерская витрина Veneto VS', 'http://icegroup.kz/veneto_vs_095.html'),
('2004', 'Кондитерская витрина VS-UN', 'http://icegroup.kz/vs_un.html'),
('2005', 'Кондитерская витрина VSk', 'http://icegroup.kz/veneto_vsk.html'),
('2006', 'Кондитерская витрина VSn', 'http://icegroup.kz/veneto_vsn.html'),
('2007', 'Кондитерская витрина VSo', 'http://icegroup.kz/veneto_vso.html'),
('2008', 'Кондитерская витрина пристенного типа Veneto VSp', 'http://icegroup.kz/veneto_vsp.html'),
('2009', 'Кондитерская витрина Carboma ВХСв - 1,3д (ОТКРЫТАЯ)', 'http://icegroup.kz/carboma_bxcb.html'),
('2010', 'Кондитерская витрина Carboma', 'http://icegroup.kz/carboma_bxcb_09.html'),
('2011', 'Кондитерская витрина Carboma MINI', 'http://icegroup.kz/carboma_mini.html'),
('2012', 'Кондитерская витрина Carboma CUBE', 'http://icegroup.kz/carboma_cube.html'),
('2013', 'Кондитерская витрина ПОЛЮС', 'http://icegroup.kz/polus.html'),
('2014', 'Кондитерская витрина ПОЛЮС ЭКО', 'http://icegroup.kz/polus_eco.html'),
('2015', 'Кондитерские шкафы Carboma Latium', 'http://icegroup.kz/carboma_latium.html'),
('2016', 'Кондитерские шкафы Carboma Lux', 'http://icegroup.kz/carboma_lux.html'),
('2301', 'Настольные витрины ARGO A87', 'http://icegroup.kz/argo_87.html'),
('2302', 'Настольные витрины ARGO XL', 'http://icegroup.kz/argo_xl.html'),
('2303', 'Настольные витрины CUBE АРГО XL ТЕХНО', 'http://icegroup.kz/cube_argo_xl_texno.html'),
('2304', 'Настольные витрины ARGO XL ТЕХНО', 'http://icegroup.kz/argo_xl_texno.html'),
('2305', 'Барные витрины Carboma', 'http://icegroup.kz/bar_carboma.html'),
('2306', 'Тепловые витрины CARBOMA', 'http://icegroup.kz/teplovye_carboma.html'),
('2307', 'Суши-кейсы Carboma', 'http://icegroup.kz/sushi_case.html'),
('2308', 'Витрины для ингредиентов Carboma', 'http://icegroup.kz/ingredient_carboma.html'),
('2309', 'Барные витрины ARGO', 'http://icegroup.kz/bar_argo.html'),
('2310', 'Витрина для икры и пресервов', 'http://icegroup.kz/vitrina_dlya_ikry.html'),
('2201', 'Холодильные столы 570 BAR', 'http://icegroup.kz/carboma_250.html'),
('2202', 'Столы под кофемашины', 'http://icegroup.kz/stol_polus.html'),
('2203', 'Холодильные столы с боковым агрегатом', 'http://icegroup.kz/carboma_2g.html'),
('2204', 'Холодильные столы с нижним агрегатом', 'http://icegroup.kz/carboma_360.html'),
('2205', 'Холодильные столы для салатов', 'http://icegroup.kz/carboma_4g.html'),
('2206', 'Холодильные столы для салатов с надстройкой', 'http://icegroup.kz/carboma_nad.html');
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
