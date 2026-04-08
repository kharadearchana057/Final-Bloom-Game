<?php
$host = "localhost";   // Database host
$user = "root";        // Database username
$pass = "";            // Database password
$db   = "thefinalbloom";      // Your database name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
