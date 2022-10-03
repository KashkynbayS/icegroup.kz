
<?php
parse_str($_POST['orderlist'], $orderlist);
parse_str($_POST['userdata'], $userdata);
/*
$orderlist - массив со списком заказа
$userdata - данные заказчика
*/

// При желании, можно посмотреть полученные данные, записав их в файл:
file_put_contents('cart_data_log.txt', var_export($orderlist, 1) . "\r\n");
file_put_contents('cart_data_log.txt', var_export($userdata, 1), FILE_APPEND);


// Заголовок письма
$subject = 'Заказ '.date('H:i:s / d.m.Y').'г.';
// $subject = ''.date('H:m:s / d.m.Y').'г.';
// ваш Email
// $admin_mail = 'idiasoftgroup@gmail.com';
$admin_mail = 'astana@idiamarket.kz';



// Email заказчика (как fallback - ваш же Email)
$to = !empty($userdata['user_mail']) ? $userdata['user_mail'] : $admin_mail;

$token = "1793100576:AAEPdhzR3Ogn2X-zwxNYLg48bSYHgG6zZWQ";
$chat_id = "-1001571347347";

// Формируем таблицу с заказанными товарами
$tbl = '<table style="width: 100%; border-collapse: collapse;">
	<tr>
		<th style="width: 3%; border: 1px solid #333333; padding: 10px; background-color: #cbcbcb"><b>№</b></th>
		<th style="width: 5%; border: 1px solid #333333; padding: 10px;">ID</th>
		<th style="width: 2%; border: 1px solid #333333; padding: 10px;"></th>
		<th style="border: 1px solid #333333; padding: 5px;">Наименование</th>
		<th style="border: 1px solid #333333; padding: 5px;">Цена</th>
		<th style="border: 1px solid #333333; padding: 5px;">Кол-во</th>
		<th style="border: 1px solid #333333; padding: 5px;">Сумма</th>
	</tr>';
$total_sum = 0;

$index = 0;
foreach($orderlist as $id => $item_data) {
	$total_sum_each = (float)$item_data['count'] * (float)$item_data['price'];
	$total_sum += (float)$item_data['count'] * (float)$item_data['price'];

	$index++;

	$tbl .= '
	<tr>
		<td style="border: 1px solid #333333; padding: 5px; text-align: center;"><b>'.$index.'</b></td>
		<td style="border: 1px solid #333333; padding: 5px; text-align: center;">'.$item_data['id'].'</td>
		<td style="border: 1px solid #333333; padding: 7.5px 15px; text-align: center;"><img src="'.$item_data['img'].'" alt="" style="max-width: 120px; max-height: 120px;"></td>
		<td style="border: 1px solid #333333;"><div style="margin-left: 50px; text-decoration: none;">'.$item_data['title'].'</div></td>
		<td style="text-align: center; border: 1px solid #333333; padding: 5px;">'.$item_data['price'].' ₸</td>
		<td style="text-align: center; border: 1px solid #333333; padding: 5px;">'.$item_data['count'].'</td>
		<td style="text-align: center; border: 1px solid #333333; padding: 5px;">'.$total_sum_each.' ₸</td>
	</tr>';
	$txts .= '<b>Название товара: </b>'.$item_data['title'].'<b>, Кол-во: </b>'.$item_data['count'].'<b>, Цена: </b>'.$item_data['price']."%0A";

	
}


$arr = array(
  'Имя клиента: ' => $userdata['user_name'],
  'Телефон: ' => $userdata['user_phone'],
  'Email: ' => $userdata['user_mail'],
  'Город: ' => $userdata['city_text'],
  'Адресс: ' => $userdata['user_address'],
  'Комментарий: ' => $userdata['user_comment'],
  'Сумма: ' => $total_sum,
  '' => $txts
 );

foreach($arr as $key => $value) {
  $msg .= "<b>".$key."</b> ".$value."%0A";
};


// $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$msg}","r");

$tbl .= '<tr>
		<td style="border: 1px solid #333333; border-right: none; padding: 10px;" colspan="4"><b><i>Итого:</i></b></td>
		<td style="border: 1px solid #333333; border-left: none; border-right: none; padding: 10px;"></td>
		<td style="border: 1px solid #333333; border-left: none; border-right: none; padding: 10px;"></td>
		<td style="border: 1px solid #333333; text-align: center;  border-left: none; padding: 10px;"><b><i>'.$total_sum.' ₸</i></b></td>
	</tr>
</table>';
// Тело письма
$body = '
<html>
<head>
  <title>'.$subject.'</title>
</head>
<body>
  <p>Информация о заказчике:</p>
	<ul>
		<li><b>Ф.И.О.:</b> '.$userdata['user_name'].'</li>
		<li><b>Тел.:</b> +7'.$userdata['user_phone'].'</li>
		<li><b>Email:</b> '.$userdata['user_mail'].'</li>
		<li><b>Город:</b> '.$userdata['city_text'].'</li>
		<li><b>Адрес:</b> '.$userdata['user_address'].'</li>
		<li><b>Комментарий:</b> '.$userdata['user_comment'].'</li>
	</ul>
	<p>Информация о заказе:</p>
  '.$tbl.'
	<p>Отправитель: сайт icegroup.kz</p>
</body>
</html>';


	// Заголовки
	$headers   = []; // или $headers = array() для версии ниже 5.4
	$headers[] = 'MIME-Version: 1.0'; // Обязательный заголовок
	$headers[] = 'Content-type: text/html; charset=utf-8'; // Обязательный заголовок. Кодировку изменить при необходимости
	$headers[] = 'From: Icegroup.kz <zakaz@icegroup.kz>'; // От кого
	$headers[] = 'Bcc: Admin <'.$admin_mail.'>'; // скрытая копия админу сайта, т.е. вам
	$headers[] = 'X-Mailer: PHP/'.phpversion();
	// Отправка
	$send_ok = mail($to, $subject, $body, implode("\r\n", $headers));

	// Ответ на запрос
	$response = [
		'errors' => !$send_ok,
		'message' => $send_ok ? '<br><br><div class="request_message"> Заказ принят в обработку! <br> Мы свяжемся с вами в ближайшее время </div>' : 'Хьюстон! У нас проблемы!'
	];
	// ! Для версий PHP < 5.4 использовать традиционный синтаксис инициализации массивов:
	/*
	$response = array (
		'errors' => !$send_ok,
		'message' => $send_ok ? 'Заказ принят в обработку!' : 'Хьюстон! У нас проблемы!'
	);
	*/


	exit( json_encode($response) );
// }
?>