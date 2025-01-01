<?php

include "connect.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Access POST variables using the correct syntax
$Username = $_POST['username'];
$NewPassword = $_POST['newpassword'];
$ConfirmPassword = $_POST['confirmpassword'];

// Check if the new password matches the confirm password
if ($NewPassword !== $ConfirmPassword) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Password do not match'
    ]);
    exit;
}

// Update the password in the database
$sql = "UPDATE `login` SET password='$ConfirmPassword' WHERE username='$Username'";
if (mysqli_query($conn, $sql)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Password changed successful!',
        'redirect_url' => 'dashboard2.html'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . mysqli_error($conn)
    ]);
}


?>
