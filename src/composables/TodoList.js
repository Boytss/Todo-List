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

const FetchTaskById = (taskId) => {
  return new Promise((resolve, reject) => {
    httpGet(`/api.php?id=${taskId}`, {
      success(response) {
        console.log("Raw response from FetchTaskById:", response);
        // Ensure the response data has the correct structure
        const task = {
          id: response.data.id,
          task_title: response.data.task_title,
          keyResults: response.data.keyResults.map((kr) => ({
            taskName: kr.task_name || kr.taskName,
            time: kr.time,
          })),
        };
        console.log("Processed task data:", task);
        resolve(task);
      },
      catch(error) {
        console.error("Error in FetchTaskById:", error);
        reject(error);
      },
    });
  });
};
const UpdateTask = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`api.php?id=${payload.id}`, payload, {
      success(response) {
        if (Array.isArray(tasks.value)) {
          const index = tasks.value.findIndex((task) => task.id === payload.id);
          if (index !== -1) {
            tasks.value[index] = response.data;
          }
        } else {
          console.error("tasks.value is not an array:", tasks.value);
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
          // Log the response to ensure it was successful
          console.log("Delete response:", response);
          resolve(response.data); // Resolve the promise here
        },
        catch(error) {
          console.error("Delete error:", error);
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
