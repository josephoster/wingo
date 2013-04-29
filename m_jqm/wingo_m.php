<?php
header('Content-type: text/html');
header('Cache-Control: no-cache');
/*
if (file_exists()) {
}
else {
}
*/
$tagBegin = '<!--- BEGIN:mobile -->';
$tagEnd = '<!-- END:mobile -->';
$lines = file_get_contents($page);
$atBegin = strpos($lines, $tagBegin);
$atEnd = strpos($lines, $tagEnd);

echo '<div data-role="page" id="'.$page.'" data-theme="b">';
echo substr($lines, $atBegin, $atEnd - $atBegin);
echo '</div>';
?>