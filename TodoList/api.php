<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection details
$host = 'localhost';
$dbname = 'todoListDb';
$username = 'root';
$password = '';

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create a new PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

// Get the HTTP method to determine whether to create or fetch tasks
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle task creation
    $data = json_decode(file_get_contents("php://input"), true);
    error_log(print_r($data, true)); // Log the received data for debugging

    if (isset($data['task_title']) && isset($data['keyResults'])) {
        $task_title = $data['task_title'];
        $keyResults = $data['keyResults'];

        // Start a transaction
        $pdo->beginTransaction();

        try {
            // Insert the main task
            $sql = "INSERT INTO tasks (task_title) VALUES (:task_title)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['task_title' => $task_title]);
            $taskId = $pdo->lastInsertId();

            // Insert key results
            $sql = "INSERT INTO key_results (task_id, task_name, time) VALUES (:task_id, :task_name, :time)";
            $stmt = $pdo->prepare($sql);

            foreach ($keyResults as $kr) {
                $stmt->execute([
                    'task_id' => $taskId,
                    'task_name' => $kr['taskName'],
                    'time' => $kr['time']
                ]);
            }

            // Commit the transaction
            $pdo->commit();

            echo json_encode(['message' => 'Task created successfully!', 'taskId' => $taskId]);
        } catch (Exception $e) {
            // Rollback the transaction if something went wrong
            $pdo->rollBack();
            echo json_encode(['error' => 'Failed to create task: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Invalid input']);
    }
} elseif ($method === 'GET') {
    // Handle fetching tasks
    try {
        // Fetch all tasks with key results
        $sql = "
         SELECT tasks.id AS task_id, tasks.task_title, tasks.created_at,
         key_results.id AS item_id, key_results.task_name, key_results.time 
        FROM tasks 
        LEFT JOIN key_results ON tasks.id = key_results.task_id
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $tasks = [];
        foreach ($results as $row) {
            $task_id = $row['task_id'];
            if (!isset($tasks[$task_id])) {
                $tasks[$task_id] = [
                    'id' => $task_id,
                    'task_title' => $row['task_title'],
                    'created_at' => $row['created_at'],
                    'items' => []
                ];
            }
            $tasks[$task_id]['items'][] = [
                'id' => $row['item_id'],
                'task_name' => $row['task_name'],
                'time' => $row['time'],
                
            ];
        }

        echo json_encode(['tasks' => array_values($tasks)]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Failed to fetch tasks: ' . $e->getMessage()]);
    }
} else {
    // Invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}

?>
