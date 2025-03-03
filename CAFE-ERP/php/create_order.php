<?php
// filepath: /C:/xampp/htdocs/CAFE-ERP/php/create_order.php
header('Content-Type: application/json');
include 'connect.php';

$customerName = $_POST['customerName'] ?? null;
$orderItems = $_POST['orderItems'] ?? null;
$totalAmount = $_POST['totalAmount'] ?? null;

if (!$customerName || !$orderItems || !$totalAmount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

$sql = "INSERT INTO orders (customer_name, order_items, total_amount) VALUES ('$customerName', '$orderItems', '$totalAmount')";
if (mysqli_query($conn, $sql)) {
    $orderId = mysqli_insert_id($conn);
    $order = [
        'id' => $orderId,
        'customer_name' => $customerName,
        'order_items' => $orderItems,
        'total_amount' => $totalAmount
    ];
    echo json_encode(['status' => 'success', 'order' => $order]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create order']);
}

mysqli_close($conn);
?>