<!DOCTYPE html>
<html lang="en">
<?php
$time=time();
if (session_id()=='') session_start();

$db=mysqli_connect("localhost","v_20478_Gulbanu","dala3940","v_20478_metal") or die();
$res=mysqli_query($db,"set names utf8");

$mess_url=mysqli_real_escape_string($db,basename($_SERVER['SCRIPT_FILENAME']));

//получаем id текущей темы
$res=mysqli_query($db,"SELECT id FROM таблица WHERE file_name='".$mess_url."'");
$res=mysqli_fetch_array($res);
$theme_id=$res["id"];
$secret = '6LdSY1IdAAAAAFy1F1o1qSANyyBWadew3o2UCtVl';
//get verify response data
$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['g-recaptcha-response']);
$respponse = json_decode($verify);

//your site secret key


if ($respponse->success){    //отправлен комментарий
 $mess_login=htmlspecialchars($_POST["mess_login"]);
 $user_text=htmlspecialchars($_POST["user_text"]);
 $rating=htmlspecialchars($_POST["rating"]);
 $city_text=htmlspecialchars($_POST["city_text"]);

  if ($mess_login!='' and $user_text!=''){
   if (is_numeric($_POST["parent_id"]) and is_numeric($_POST["f_parent"]))
    $res=mysqli_query($db,"insert into icegroup
    (parent_id, first_parent, date, theme_id, login, message, rating, city)
    values ('".$_POST["parent_id"]."','".$_POST["f_parent"]."',
    '".$time."','".$theme_id."','".$mess_login."','".$user_text."','".$rating."','".$city_text."')");
   else $res=mysqli_query($db,"insert into icegroup (date, theme_id, login, message, rating, city)
   values ('".$time."','".$theme_id."','".$mess_login."','".$user_text."','".$rating."','".$city_text."')");
    $_SESSION["send"]="Комментарий принят!";
    header("Location: $mess_url#last"); exit;
  }
  else {
   $_SESSION["send"]="Не все поля заполнены!";
   header("Location: $mess_url#last"); exit;
  }
 
}

if (isset($_SESSION["send"]) and $_SESSION["send"]!="") {    //вывод сообщения
    echo '<script type="text/javascript">alert("'.$_SESSION["send"].'");</script>';
    $_SESSION["send"]="";
}
?>
  <head>
  <script src='https://www.google.com/recaptcha/api.js'></script>
    <meta charset="utf-8">
    <title>Отзывы о компании Icegroup - холодильные оборудования: холодильные шкафы, витрины, бонеты, морозильные лари, кондитерские витрины, настольные витрины, холодильные столы Шымкент. </title>
     
   <meta name="keywords" content="Отзывы о компании Icegroup Idia market">
<meta name="description" content="Отзывы о компании Icegroup IDIA Market">
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
		<div class="grid_3"><span class="telefon"><span style="color:#aaa; letter-spacing:0">Алматы:</span> 8(727) <span class="zhir">344 99 00</span></span></div><div class="grid_3"><span class="telefon" style="padding:15px 0 15px 0"><span style="color:#aaa; letter-spacing:0">Астана:</span> 8(7172) <span class="zhir">27 99 00</span></span></div><form action="search.php" method="post" id="search"><input type="text" name="search" value="поиск" onblur="if(this.value=='') this.value='поиск';" onfocus="if(this.value=='поиск') this.value='';" class="input" /><input type="submit" name="" value="" class="submit" /></form>
   
  </div>
   <ul id="topMenu" class="nav pull-right">
	<li ><a href="index.html">Главная</a></li>
	 <li class=""><a href="products.html">Товары</a></li>
	  <li class=""><a href="design.html">3D_Design</a></li>
			<li  ><a href="delivery.html">Доставка</a></li>
	 <li class="active"><a href="otzovik.php">Отзывы</a></li>
	 <li class=""><a href="about.html">О нас</a></li>
	<li><a href="contact.html">Контакты</a></li>
    </ul>
</div>
</div>
</div>
</div>
<!-- Header End====================================================================== -->
<div id="mainBody">
	<div class="container">
	<div class="row">
<!-- Sidebar ================================================== -->
	<div id="sidebar" class="span3">
	<ul id="sideManu" class="nav nav-stacked">
		<li><a href="holod_shkaf.html">Холодильные шкафы</a></li>
		<li><a href="holod_vitrina.html">Холодильные витрины</a></li>
		<li><a href="pristen_vitrina.html">Пристенные витрины</a></li>
			<li><a href="boneta.html">Бонеты</a></li>
			<li><a href="lar.html">Морозильные лари</a></li>
			<li><a href="kondit.html">Кондитерские витрины</a></li>
			<li><a href="nastol.html">Настольные витрины</a></li>
			<li><a href="holod_stol.html">Холодильные столы</a></li>
		</ul>
		  <div class="thumbnail"><div class="grafik-contact"><div class="caption">
			<div class="kontakty">
			  <h5>Контакты:</h5>
			  <p><b>г. Алматы:</b>
<br>ул. Егизбаева 7/1 
<br>(уг. ул. Розыбакиева / Сатпаева),
<br>1-этаж, 115-офис. 050008
<br>
8 (727) 344-99-00
<br>+7 (701) 266-77-00 
<br>+7 (701) 101-83-88
<br><b>Email:</b> zakaz@idiamarket.kz</p>
<p><b>г. Астана:</b>
<br>ул. Бейсекбаева 24/1, 2-этаж, 
<br>мебельный центр DARA
<br>
8 (7172) 27-99-00
‎<br>+7 (701) 511-22-00 
<br>+7 (701) 799-33-22
<br><b>Email:</b> astana@idiamarket.kz</p>
</div>
			</div></div></div><br/>
			 <div class="thumbnail"><div class="grafik-contact"><div class="caption">
				<div class="grafik">
				  <h5>График работы:</h5>
				   <p style="float:left">Понедельник:</p>
<p style="padding-left:90px">09:00-18:00</p>

<p style="float:left">Вторник:</p>
<p style="padding-left:90px">09:00-18:00</p>

<p style="float:left">Среда:</p>
<p style="padding-left:90px">09:00-18:00</p>

<p style="float:left">Четверг:</p>
<p style="padding-left:90px">09:00-18:00</p>

<p style="float:left">Пятница:</p>
<p style="padding-left:90px">09:00-18:00</p>

<p style="float:left">Суббота:</p>
<p style="padding-left:90px">09:00-16:00</p>

<p style="float:left">Воскресенье:</p>
<p style="padding-left:90px">Выходной</p>


<br><b>*Без обеденного перерыва</b>
</p></div>
				</div></div></div><br/>
	</div>
<!-- Sidebar end=============================================== -->
	<div class="span9">
    <ul class="breadcrumb">
		<li><a href="index.html">Главная</a> <span class="divider">/</span></li>
		<li class="active">Отзывы</li>
    </ul>
	<h3>Отзывы</h3>	
	<?php
function parents($up=0, $left=0) {    //Строим иерархическое дерево комментариев
global $tag,$mess_url;

    for ($i=0; $i<=count($tag[$up])-1; $i++) {
    //Можно выделять цветом указанные логины
        if ($tag[$up][$i][2]=='Admin') $tag[$up][$i][2]='<font color="#C00">Admin</font>';
        if ($tag[$up][$i][6]==0) $tag[$up][$i][6]=$tag[$up][$i][0];
        //Высчитываем рейтинг комментария
        $sum=$tag[$up][$i][4]-$tag[$up][$i][5];

        if ($up==0) echo '<div class="otz_items" style=" color: #2a4f5e; margin-top:35px; border-bottom: 1px solid #e6e6ec; padding-bottom:10px; float:none!important;">';
        else {
            if (count($tag[$up])-1!=$i)
                echo '<div class="strelka" style="padding:5px 0 0 '.($left-2).'px;">';
            else echo '<div class="strelka_2" style="padding:5px 0 0 '.$left.'px;">';
        }
        echo '<div class="comm_head" id="m'.$tag[$up][$i][0].'">';
        echo '<div class="name_city_parent" style="float:left; margin-right:5px; font-size:16px!important; color:#2a4f5e;"> <div class="name_city"> Имя: </div> <b>'.$tag[$up][$i][4].' </b></div>';
        echo '<div style="text-align:right; float:none">  '.date("d.m.Y в H:i ", $tag[$up][$i][5]).'</div></div>';
        
		echo '<div class="city-rating" style="float:left; margin-right:5px; font-size:16px!important; color:#2a4f5e;"> 
		<div class="name_city_parent"><div class="name_city"> Город: </div> <b>'.$tag[$up][$i][3].'</b></div>';
		

		echo '<div class="city-name-ds">';
        echo '<div style="float:none; display:none;"> '.$tag[$up][$i][2].' </div>';
        if ($tag[$up][$i][2]==5) echo '<img src="/themes/images/otzovik/five.png">';
        elseif ($tag[$up][$i][2]==4){
            echo '<img src="/themes/images/otzovik/four.png">';
        }
        elseif ($tag[$up][$i][2]==3) {
            echo '<img src="/themes/images/otzovik/three.png">';
        }
        elseif ($tag[$up][$i][2]==2) {
            echo '<img src="/themes/images/otzovik/two.png">';
        }
        else echo '<img src="/themes/images/otzovik/one.png">';
        echo '</div></div>';
        

		echo '<div class="comm_body"  style="float:none!important; margin:15px 0 20px 0;">';
        echo '<div style="word-wrap:break-word; float:none!important;">';
        echo str_replace("<br />","<br>",nl2br($tag[$up][$i][1])).'</div>';

		if (isset($tag[ $tag[$up][$i][0] ])) parents($tag[$up][$i][0],20);
        echo '</div></div>';
    }
}

$res=mysqli_query($db,"SELECT * FROM icegroup
    WHERE theme_id='".$theme_id."' ORDER BY id");
$number=mysqli_num_rows($res);

if ($number>0) {
 echo '<div style="padding-top:10px;">';
 while ($com=mysqli_fetch_assoc($res))
    $tag[(int)$com["parent_id"]][] = array((int)$com["id"], $com["message"], $com["rating"], $com["city"], 
    $com["login"], $com["date"], $com["plus"], $com["minus"], $com["first_parent"]);
 echo parents().'</div><br>';
}
?>
<?php
$cod=rand(100,900); $cod2=rand(10,99);







echo '<div id="last" class="ostavit-otzov">
<div class="ostavit-otzov-child">
	<form method="POST" action="'.$mess_url.'#last" class="add_comment">
		<div class="ostavit-otzov-child-h3">
			<h3>Оставить отзыв</h3>
		</div>
		<div class="ostavit-otzov-child-textBlock">
			<div class="ostavit-otzov-child-textBlock-textName">
				<div class="otzov-text-leftBlock">Имя:</div>
				<input class="otzov-textarea" type="text" name="mess_login" maxlength="20" value="">
			</div>
			<div class="ostavit-otzov-child-textBlock-textCity">
				<div class="otzov-text-leftBlock">Город:</div>

				<div class="dropdown">
					<select name="city_text" class="dropdown-select">
					<option value="Алматы" selected="selected">Алматы</option>
					<option value="Нур-Султан">Нур-Султан</option>
					<option value="Актау">Актау</option>
					<option value="Актобе">Актобе</option>
					<option value="Атырау">Атырау</option>
					<option value="Жанаозен">Жанаозен</option>
					<option value="Жезказган">Жезказган</option>
					<option value="Караганда">Караганда</option>
					<option value="Кокшетау">Кокшетау</option>
					<option value="Костанай">Костанай</option>
					<option value="Кызылорда">Кызылорда</option>
					<option value="Павлодар">Павлодар</option>
					<option value="Петропавловск">Петропавловск</option>
					<option value="Семей">Семей</option>
					<option value="Талдыкорган">Талдыкорган</option>
					<option value="Тараз">Тараз</option>
					<option value="Туркестан">Туркестан</option>
					<option value="Уральск">Уральск</option>
					<option value="Усть-Каменогорск">Усть-Каменогорск</option>
					<option value="Шымкент">Шымкент</option>
				</select>
				</div>

			</div>
			<div class="ostavit-otzov-child-textBlock-textOtzov">
				<div class="otzov-text-leftBlock">Отзыв:</div>
				<textarea class="otzov-textarea" name="user_text" cols="50" rows="5"></textarea>
			</div>

			<div class="rating1">
				<div class="rating1-child"> Ваша оценка:
					<span class="starRating">	
						<input id="rating5" type="radio" name="rating" value="5" checked="">
						<label for="rating5">5</label>
						<input id="rating4" type="radio" name="rating" value="4">
						<label for="rating4">4</label>
						<input id="rating3" type="radio" name="rating" value="3">
						<label for="rating3">3</label>
						<input id="rating2" type="radio" name="rating" value="2">
						<label for="rating2">2</label>
						<input id="rating1" type="radio" name="rating" value="1">
						<label for="rating1">1</label>
					</span>
				</div>
			</div>

			<style>
				iframe {
					height: 80px;
				}
			</style>

			<div class="captcha">
				<div class="g-recaptcha" data-sitekey="6LdSY1IdAAAAAPPNKWc8SGVCPqpxtG9TOBoDPISl"></div>
			</div>

			<div class="submit-otzov">
				<input class="knopka" type="submit" value="Отправить">
			</div>
			

		</div>
	</form>
</div>
</div>'









// echo '<div id="last" style="margin-top:30px;">';
// echo '<form method="POST" action="'.$mess_url.'#last" class="add_comment">';
// echo '<div style="float:none;font-size:18px; font-weight:bold;padding: 10px 60px 10px; ">Оставить отзыв</div>';
// echo '<div style="margin-left:220px; margin-top:10px; float:none;">';
// echo 'Имя* <input style="height:23px; width:250px; " type="text" name="mess_login" maxlength="20" value=""></div>';
// echo '<div class="oott" style="float:none;margin-left:207px; margin-top:10px">';
// echo '<div  style="float:left; margin-right:5px;">Отзыв*</div>';
// echo '<textarea cols="50" rows="5" name="user_text"></textarea>';
// echo '</div>';
// echo '<div class="ott" style="margin-top:10px; margin-left:185px; float:none">'.$cod.' + '.$cod2.' = ';
// echo '<input  type="hidden" name="prov_summa" value="'.md5($cod+$cod2).'">';
// echo '<input style="height:22px;" type="text" name="contr_cod" maxlength="4" size="4">&nbsp;</div>';
// echo '<div style="margin-top:15px; margin-left:255px;"><input class="knopka" style="height:28px; font-size: 14px !important;
//     background: #3a5265;
//     border: 0px solid #007f87;
//         box-shadow: 0 2px 2px 0 #606060;
// 		    -webkit-border-radius: 5px;
//     text-shadow: none;
//     float: left;
//     width: 150px;
//     line-height: normal;
//     color: #fff;
//     cursor: pointer;
 
//     outline: none;" type="submit" value="Отправить" ></div>';
// echo '</form></div>';
?></div></div>
</div></div>
<!-- MainBody End ============================= -->
<!-- Footer ================================================================== -->
	<div  id="footerSection">
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