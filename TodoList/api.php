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

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Handle task creation (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['task_title'], $data['keyResults'])) {
        $task_title = $data['task_title'];
        $keyResults = $data['keyResults'];

        // Start transaction
        $pdo->beginTransaction();
        try {
            // Insert task
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

            // Commit transaction
            $pdo->commit();
            echo json_encode(['message' => 'Task created successfully!', 'taskId' => $taskId]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => 'Failed to create task: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Invalid input']);
    }
}

// Handle fetching tasks (GET)
elseif ($method === 'GET') {
    if (isset($_GET['id'])) {
        // Fetch a single task by ID
        $taskId = $_GET['id'];
        try {
            $sql = "
                SELECT tasks.id AS task_id, tasks.task_title, tasks.created_at,
                       key_results.id AS item_id, key_results.task_name, key_results.time
                FROM tasks
                LEFT JOIN key_results ON tasks.id = key_results.task_id
                WHERE tasks.id = :taskId";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['taskId' => $taskId]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($results) {
                $task = [
                    'id' => $results[0]['task_id'],
                    'task_title' => $results[0]['task_title'],
                    'created_at' => $results[0]['created_at'],
                    'keyResults' => []
                ];
                foreach ($results as $row) {
                    $task['keyResults'][] = [
                        'id' => $row['item_id'],
                        'taskName' => $row['task_name'],
                        'time' => $row['time']
                    ];
                }
                echo json_encode($task);
            } else {
                echo json_encode(['error' => 'Task not found']);
            }
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to fetch task: ' . $e->getMessage()]);
        }
    } else {
        // Fetch all tasks
        try {
            $sql = "
                SELECT tasks.id AS task_id, tasks.task_title, tasks.created_at,
                       key_results.id AS item_id, key_results.task_name, key_results.time
                FROM tasks
                LEFT JOIN key_results ON tasks.id = key_results.task_id";
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
                    'time' => $row['time']
                ];
            }
            echo json_encode(['tasks' => array_values($tasks)]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to fetch tasks: ' . $e->getMessage()]);
        }
    }
}

// Handle updating tasks (PUT)
elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'], $data['task_title'], $data['keyResults'])) {
        $taskId = $data['id'];
        $task_title = $data['task_title'];
        $keyResults = $data['keyResults'];

        if (empty($task_title) || !is_array($keyResults) || count($keyResults) === 0) {
            echo json_encode(['error' => 'Task title or key results are invalid']);
            return;
        }

        // Start transaction
        $pdo->beginTransaction();
        try {
            // Check if task exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE id = :taskId");
            $stmt->execute(['taskId' => $taskId]);
            if ($stmt->fetchColumn() == 0) {
                echo json_encode(['error' => 'Task not found']);
                return;
            }

            // Update task
            $stmt = $pdo->prepare("UPDATE tasks SET task_title = :task_title WHERE id = :taskId");
            $stmt->execute(['task_title' => $task_title, 'taskId' => $taskId]);

            // Delete existing key results
            $stmt = $pdo->prepare("DELETE FROM key_results WHERE task_id = :taskId");
            $stmt->execute(['taskId' => $taskId]);

            // Insert updated key results
            $stmt = $pdo->prepare("INSERT INTO key_results (task_id, task_name, time) VALUES (:task_id, :task_name, :time)");
            foreach ($keyResults as $kr) {
                $stmt->execute([
                    'task_id' => $taskId,
                    'task_name' => $kr['taskName'],
                    'time' => $kr['time']
                ]);
            }

            // Commit transaction
            $pdo->commit();
            echo json_encode(['message' => 'Task updated successfully!', 'taskId' => $taskId]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => 'Failed to update task: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Invalid input for task update']);
    }
}

// Handle task deletion (DELETE)
elseif ($method === 'DELETE') {
    $taskId = $_GET['id'] ?? null;

    if ($taskId) {
        try {
            // Check if task exists before attempting deletion
            $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = :taskId");
            $stmt->execute(['taskId' => $taskId]);
            $taskExists = $stmt->fetch();

            if (!$taskExists) {
                throw new Exception('Task not found.');
            }

            // Start transaction
            $pdo->beginTransaction();

            // Delete key results first
            $stmt = $pdo->prepare("DELETE FROM key_results WHERE task_id = :taskId");
            $stmt->execute(['taskId' => $taskId]);
            $keyResultsDeleted = $stmt->rowCount();  // Check rows deleted

            // Delete the task next
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :taskId");
            $stmt->execute(['taskId' => $taskId]);
            $taskDeleted = $stmt->rowCount();  // Check rows deleted

            // If no rows were deleted, throw an exception
            if ($taskDeleted === 0) {
                throw new Exception('Task could not be deleted.');
            }

            // Commit transaction
            $pdo->commit();
            echo json_encode([
                'message' => 'Task deleted successfully',
                'key_results_deleted' => $keyResultsDeleted,
                'task_deleted' => $taskDeleted
            ]);
        } catch (Exception $e) {
            // Only roll back if there is an active transaction
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            echo json_encode(['error' => 'Failed to delete task: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Task ID is required for deletion']);
    }

}
?>
