import { ref, readonly } from "vue";
import { httpGet, httpPost, httpPut, httpDel } from "boot/axios"; // Assuming you've set up Axios boot

// State variables
let tasks = ref([]);
let selectedTask = ref(null);

// Getters (readonly to prevent direct modification)
let GetTasks = readonly(tasks);
let GetSelectedTask = readonly(selectedTask);

// Fetch all tasks from the database
const FetchTasks = () => {
  return new Promise((resolve, reject) => {
    httpGet("/api.php", {
      success(response) {
        tasks.value = response.data;
        resolve(response.data);
      },
      catch(error) {
        reject(error);
      },
    });
  });
};

// Fetch a specific task by its ID
const FetchTaskById = (taskId) => {
  return new Promise((resolve, reject) => {
    httpGet(`tasks/${taskId}`, {
      success(response) {
        selectedTask.value = response.data;
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Insert a new task into the database
const InsertTask = (payload) => {
  // Create the payload according to the required structure
  const formattedPayload = {
    task_title: payload.task_title, // Ensure this matches the correct key
    keyResults: payload.keyResults, // Keep 'keyResults' as is
  };

  console.log("Inserting task with formatted payload:", formattedPayload); // Log the formatted payload
  return new Promise((resolve, reject) => {
    httpPost("api.php", formattedPayload, {
      success(response) {
        console.log("Task inserted, server response:", response.data); // Log server response
        resolve(response.data);
      },
      catch(error) {
        console.error("Error inserting task:", error); // Log error details
        reject(error);
      },
    });
  });
};

// Update an existing task by its ID
const UpdateTask = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`tasks/${payload.id}`, payload, {
      success(response) {
        const index = tasks.value.findIndex((task) => task.id === payload.id);
        if (index !== -1) {
          tasks.value[index] = response.data;
        }
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Delete a task by its ID
const DeleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    httpDel(
      `tasks/${taskId}`,
      {},
      {
        success(response) {
          tasks.value = tasks.value.filter((task) => task.id !== taskId);
          resolve(response.data);
        },
        catch(response) {
          reject(response);
        },
      }
    );
  });
};

// Export all the methods and state
export {
  GetTasks,
  GetSelectedTask,
  FetchTasks,
  FetchTaskById,
  InsertTask,
  UpdateTask,
  DeleteTask,
};
