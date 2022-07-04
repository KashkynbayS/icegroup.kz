<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
      <title>Контакты IceGroup: улица Мынбаева 43 115-офис. 87273449900</title>
<meta name="keywords" content="контакты Icegroup, Idia market Нур-Султан">
<meta name="description" content="Контакты, адрес, телефон компании Icegroup. Звоните!">
<!--Less styles -->
   <!-- Other Less css file //different less files has different color scheam
	<link rel="stylesheet/less" type="text/css" href="/themes/less/simplex.less">
	<link rel="stylesheet/less" type="text/css" href="/themes/less/classified.less">
	<link rel="stylesheet/less" type="text/css" href="/themes/less/amelia.less">  MOVE DOWN TO activate
	-->
	<!--<link rel="stylesheet/less" type="text/css" href="/themes/less/bootshop.less">
	<script src="/themes/js/less.js" type="text/javascript"></script> -->
	
<!-- Bootstrap style --> 
    <link id="callCss" rel="stylesheet" href="/themes/bootshop/bootstrap.min.css" media="screen"/>
    <link href="/themes/css/base.css" rel="stylesheet" media="screen"/>
<!-- Bootstrap style responsive -->	
	<link href="/themes/css/bootstrap-responsive.min.css" rel="stylesheet"/>
	<link href="/themes/css/font-awesome.css" rel="stylesheet" type="text/css">
<!-- Google-code-prettify -->	
	<link href="/themes/js/google-code-prettify/prettify.css" rel="stylesheet"/>
<!-- fav and touch icons -->
    <link rel="shortcut icon" href="/themes/images/ico/favicon.ico">
	<style type="text/css" id="enject"></style>

  <!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(87239673, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/87239673" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</head>
<body>
<div id="header"><div style="text-align:right; "><div class="container"><img src="/themes/images/bis.png" ></div></div>
<div class="container">

<!-- Navbar ================================================== -->
<div id="logoArea" class="navbar">
<a id="smallScreen" data-target="#topMenu" data-toggle="collapse" class="btn btn-navbar">
	<span class="icon-bar"></span>
	<span class="icon-bar"></span>
	<span class="icon-bar"></span>
</a>
  <div class="navbar-inner">
    <a class="brand" href="index.html"><img src="/themes/images/logo12.png" alt="Icegroup"/></a>
		<div class="grid_3"><span class="telefon"><span style="color:#aaa; letter-spacing:0">Алматы:</span> 8(727) <span class="zhir">344 99 00</span></span></div><div class="grid_3"><span class="telefon" style="padding:15px 0 15px 0"><span style="color:#aaa; letter-spacing:0">Астана:</span> 8(7172) <span class="zhir">27 99 00</span></span></div>
   
  </div>
   <ul id="topMenu" class="nav pull-right">
	<li ><a href="index.html">Главная</a></li>
	 <li class=""><a href="products.html">Товары</a></li>
	  <li class=""><a href="design.html">3D_Design</a></li>
	   <li class=""><a href="delivery.html">Доставка</a></li>
	 <li class=""><a href="otzovik.php">Отзывы</a></li>
	 <li class=""><a href="about.html">О нас</a></li>
	 <li class="active"><a href="contact.html">Контакты</a></li>
    </ul>
</div>
</div>
</div>
<!-- Header End====================================================================== -->
<div id="mainBody">
<div class="container">
<div class="contacth searching">
	<h3><strong>По вашему запросу найдено:</strong></h3>
				<?php

mysql_connect("localhost","v_20478_Gulbanu","dala3940") or die("couldn't connect");
mysql_query('SET NAMES utf8');
mysql_query('SET CHARACTER SET utf8' );
mysql_query('SET COLLATION_CONNECTION="utf8_general_ci"' ); 

mysql_select_db("v_20478_metal") or die("couldn't connect to database");
$output = '';
if(isset($_POST['search'])){
	$searchq = $_POST['search'];
	$searchq = preg_replace("#[^0-9a-z]#i","",$searchq);
	$query = mysql_query("SELECT * FROM icegroup_search WHERE keywords LIKE '%$searchq%'") or die("could not search!");
	$count = mysql_num_rows($query);
	if($count == 0){
		$output = '0 результатов!';
	
	}else{
	while($row = mysql_fetch_array($query)){
		$keywords = $row['keywords'];
		$link = $row['link'];
		$name = $row['name'];
		Echo "<a href=$link>$name</a>";
		}
	}
}
?>
		
	
</div></div>
</div>
<!-- MainBody End ============================= -->
	<div  id="footerSection" style="	margin-top:400px;">
	<div class="container">
		<div class="row">
			<div class="span3">
				<h5>О компании</h5>
				<a href="delivery.html">Доставка</a><a href="design.html">3D_Design</a><a href="otzovik.php">Отзывы</a> 
				<a href="about.html">О нас</a> 
				<a href="contact.html">Контакты</a>    
			 </div>
			<div class="span3">
				<h5>Товары</h5>
				<a href="holod_shkaf.html">Холодильные шкафы</a> 
				<a href="holod_vitrina.html">Холодильные витрины</a>  
				<a href="pristen_vitrina.html">Пристенные холодильные витрины</a>   
				<a href="boneta.html">Бонеты</a> 
				<a href="lar.html">Морозильные лари</a>
				<a href="kondit.html">Кондитерские витрины</a> 
				<a href="nastol.html">Настольные витрины</a> 
				<a href="holod_stol.html">Холодильные столы</a>
			 </div>
			<div class="span3"><h5>г. Алматы:</h5><a>8 (727) 344-99-00</a><a>+7 (701) 101-83-88</a><a>+7 (701) 266-77-00</a></div><div class="span3"><h5>г. Астана:</h5><a>8 (7172) 27-99-00</a><a>+7 (701) 511-22-00</a><a>+7 (701) 799-33-22</a></div>
			 
			<div id="socialMedia" class="span3 pull-right">
				<a href="https://www.youtube.com/channel/UCNDMIviMuZOhhCP7xoxGYAA/videos"><img width="60" height="60" src="/themes/images/youtube.png" title="youtube" alt="youtube"/></a><a href="https://www.instagram.com/idiamarket/"><img width="60" height="60" src="/themes/images/insta.png" title="instagram" alt="instagram"></a>
			 </div> 
		 </div>
		<p class="pull-right">&copy; 2010-2021</p>
	</div><!-- Container End -->
	</div>
<!-- Placed at the end of the document so the pages load faster ============================================= -->
	<script src="/themes/js/jquery.js" type="text/javascript"></script>
	<script src="/themes/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="/themes/js/google-code-prettify/prettify.js"></script>
	
	<script src="/themes/js/bootshop.js"></script>
    <script src="/themes/js/jquery.lightbox-0.5.js"></script>
	
	<!-- Themes switcher section 
<div id="secectionBox">
<link rel="stylesheet" href="/themes/switch/themeswitch.css" type="text/css" media="screen" />
<script src="/themes/switch/theamswitcher.js" type="text/javascript" charset="utf-8"></script>
	<div id="themeContainer">
	<div id="hideme" class="themeTitle">Style Selector</div>
	<div class="themeName">Oregional Skin</div>
	<div class="images style">
	<a href="/themes/css/#" name="bootshop"><img src="/themes/switch/images/clr/bootshop.png" alt="bootstrap business templates" class="active"></a>
	<a href="/themes/css/#" name="businessltd"><img src="/themes/switch/images/clr/businessltd.png" alt="bootstrap business templates" class="active"></a>
	</div>
	<div class="themeName">Bootswatch Skins (11)</div>
	<div class="images style">
		<a href="/themes/css/#" name="amelia" title="Amelia"><img src="/themes/switch/images/clr/amelia.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="spruce" title="Spruce"><img src="/themes/switch/images/clr/spruce.png" alt="bootstrap business templates" ></a>
		<a href="/themes/css/#" name="superhero" title="Superhero"><img src="/themes/switch/images/clr/superhero.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="cyborg"><img src="/themes/switch/images/clr/cyborg.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="cerulean"><img src="/themes/switch/images/clr/cerulean.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="journal"><img src="/themes/switch/images/clr/journal.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="readable"><img src="/themes/switch/images/clr/readable.png" alt="bootstrap business templates"></a>	
		<a href="/themes/css/#" name="simplex"><img src="/themes/switch/images/clr/simplex.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="slate"><img src="/themes/switch/images/clr/slate.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="spacelab"><img src="/themes/switch/images/clr/spacelab.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="united"><img src="/themes/switch/images/clr/united.png" alt="bootstrap business templates"></a>
		<p style="margin:0;line-height:normal;margin-left:-10px;display:none;"><small>These are just examples and you can build your own color scheme in the backend.</small></p>
	</div>
	<div class="themeName">Background Patterns </div>
	<div class="images patterns">
		<a href="/themes/css/#" name="pattern1"><img src="/themes/switch/images/pattern/pattern1.png" alt="bootstrap business templates" class="active"></a>
		<a href="/themes/css/#" name="pattern2"><img src="/themes/switch/images/pattern/pattern2.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern3"><img src="/themes/switch/images/pattern/pattern3.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern4"><img src="/themes/switch/images/pattern/pattern4.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern5"><img src="/themes/switch/images/pattern/pattern5.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern6"><img src="/themes/switch/images/pattern/pattern6.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern7"><img src="/themes/switch/images/pattern/pattern7.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern8"><img src="/themes/switch/images/pattern/pattern8.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern9"><img src="/themes/switch/images/pattern/pattern9.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern10"><img src="/themes/switch/images/pattern/pattern10.png" alt="bootstrap business templates"></a>
		
		<a href="/themes/css/#" name="pattern11"><img src="/themes/switch/images/pattern/pattern11.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern12"><img src="/themes/switch/images/pattern/pattern12.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern13"><img src="/themes/switch/images/pattern/pattern13.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern14"><img src="/themes/switch/images/pattern/pattern14.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern15"><img src="/themes/switch/images/pattern/pattern15.png" alt="bootstrap business templates"></a>
		
		<a href="/themes/css/#" name="pattern16"><img src="/themes/switch/images/pattern/pattern16.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern17"><img src="/themes/switch/images/pattern/pattern17.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern18"><img src="/themes/switch/images/pattern/pattern18.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern19"><img src="/themes/switch/images/pattern/pattern19.png" alt="bootstrap business templates"></a>
		<a href="/themes/css/#" name="pattern20"><img src="/themes/switch/images/pattern/pattern20.png" alt="bootstrap business templates"></a>
		 
	</div>
	</div>
</div>============================================================================================= -->
<span id="themesBtn"></span>
<script src="/themes/js/smart-search.js"></script> 
<link href="/themes/css/jqcart.css" rel="stylesheet" />
    <script src="/themes/js/jqcart.min.js"></script>
<script src="js_main/main.js"></script>
<script src="js_main/main.js"></script >
<script src="/themes/js/jquery.maskedinput.min.js"></script>
    <script>
        $('#phone').inputmask({
            mask: ['+7 999 999 99 99'],
            jitMasking: 3,
            showMaskOnHover: false,
            autoUnmask: true
        });
    </script>
</body>
</html>
			