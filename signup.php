<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email    = $_POST['email'];
    $password = $_POST['password'];

    // Backend validation: username must not start with a number
    if (preg_match('/^[0-9]/', $username)) {
        echo "<script>alert('Username cannot start with a number. Please choose another one.'); window.history.back();</script>";
        exit();
    }

    $sql = "INSERT INTO login (username, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        header("Location: dialoooo.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>
