<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>XHR Spy @VERSION@</title>
</head>
<body class="harBody">
    <div id="content" version="@VERSION@"></div>
    <script src="jquery.js"></script>
    <script src="require.js"></script>
    <script type="text/javascript">
        require(["web-timing/viewer"]);
    </script>
    <link rel="stylesheet" href="../css/xhrSpy.css" type="text/css"/>
    <?php include("../ga.php") ?>
</body>
</html>
