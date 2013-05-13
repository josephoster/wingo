<?php
$ch = curl_init($_GET['url']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$remote_content = curl_exec($ch);
$curlError = curl_error($ch);
$curlInfo = curl_getinfo($ch);
curl_close($ch);
    //echo 'curl_error=[' . $curlError . "]<br>\n";
    //foreach ($curlInfo as $curlKey => $curlValue) echo $curlKey . ' = ' . $curlValue . "<br>\n";
header('Content-type: text/json');
echo $remote_content;
?>