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
const FetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`/api/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

const UpdateTask = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`api.php?id=${payload.id}`, payload, {
      success(response) {
        const index = tasks.value.findIndex((task) => task.id === payload.id);
        if (index !== -1) {
          tasks.value[index] = response.data;
        }
        resolve(response.data);
      },
      catch(error) {
        reject(error);
      },
    });
  });
};

// Delete a task by its ID
const DeleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    httpDel(
      `api.php?id=${taskId}`,
      {},
      {
        success(response) {
          tasks.value = tasks.value.filter((task) => task.id !== taskId);
          resolve(response.data);
        },
        catch(error) {
          reject(error);
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
