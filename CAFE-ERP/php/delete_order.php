<?php
// filepath: /C:/xampp/htdocs/CAFE-ERP/php/delete_order.php
header('Content-Type: application/json');
include 'connect.php';

$orderId = $_GET['id'] ?? null;

if (!$orderId) {
    echo json_encode(['status' => 'error', 'message' => 'Order ID is required']);
    exit;
}

$sql = "DELETE FROM orders WHERE id = $orderId";
if (mysqli_query($conn, $sql)) {
    echo json_encode(['status' => 'success', 'message' => 'Order deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete order']);
}

mysqli_close($conn);
?>