import { ref, watch, onMounted, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { ToggleMainDialogState } from "../../../composables/Triggers";
import DeleteConfirmation from "../../../components/DeleteConfirmation.vue";
import MainDialog from "../../../components/MainDialog.vue";

import {
  InsertNewRange,
  InsertTask,
  FetchTasks,
  GetTasks,
  DeleteTask,
} from "../../../composables/TodoList";

export default {
  components: {
    MainDialog,
    DeleteConfirmation,
  },
  setup() {
    const $q = useQuasar(); // Quasar UI instance
    const route = useRoute(); // Current route
    const router = useRouter(); // Router instance

    // State variables
    const inProgressTasks = ref([]); // Tasks that are in progress
    const doneTasks = ref([]); // Completed tasks
    const pageLoadingState = ref(false); // Loading state for the page
    const isORRangeCorrect = ref(true); // Validation flag for OR range
    const btnLoadingState = ref(false); // Button loading state
    const tasks = ref([]); // General tasks
    const deleteConfirmations = reactive({}); // Track delete confirmations for tasks
    const selectAll = ref(false); // Select all checkbox state
    const selectedUsersID = ref([]); // Array of selected user IDs

    let watch_task = ref(false); // Watcher flag for tasks
    const rowsWithCheckBox = ref([]); // Rows for the checkbox

    // Show delete confirmation dialog for a specific task
    const showDeleteConfirmation = (taskId) => {
      deleteConfirmations[taskId] = true;
    };

    // Hide delete confirmation dialog for a specific task
    const hideDeleteConfirmation = (taskId) => {
      deleteConfirmations[taskId] = false;
    };
    // Delete a task by its ID
    const deleteTask = async (taskId) => {
      try {
        console.log("Current tasks before deletion:", inProgressTasks.value);

        await DeleteTask(taskId); // Call your delete method

        // Filter the tasks locally
        inProgressTasks.value = inProgressTasks.value.filter(
          (task) => task.id !== taskId
        );
        console.log("Tasks after deletion:", inProgressTasks.value);

        $q.notify({ type: "positive", message: "Task deleted successfully" });
      } catch (error) {
        console.error("Error deleting task:", error);
        $q.notify({ type: "negative", message: "Error deleting task" });
      } finally {
        hideDeleteConfirmation(taskId);
      }
    };

    // Navigate to the edit task page
    const editTask = (taskId) => {
      router.push({ name: "create-task", params: { id: taskId } });
    };

    // Handle the edit button click
    const handleEditClick = (taskId) => {
      console.log("Navigating to edit-task route with ID:", taskId);
      router
        .push({ name: "edit-task", params: { id: taskId.toString() } })
        .then(() => {
          console.log("Navigation successful");
        })
        .catch((err) => {
          console.error("Navigation failed:", err);
        });
    };
    const goToCreateTask = (event) => {
      event.stopPropagation();
      router.push({ name: "create-task" });
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Format time string (HH:MM:SS) to a 12-hour format
    function formatTime(timeString) {
      // Create a date object for the current date and set the time using the provided timeString (HH:MM:SS)
      const [hours, minutes, seconds] = timeString.split(":");
      const date = new Date();

      date.setHours(hours, minutes, seconds);
      // Format the time as '8:00 PM'
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    const confirmDelete = (task) => {
      taskToDelete.value = task;
      showDeleteConfirmation.value = true;
    };

    const cancelDelete = () => {
      showDeleteConfirmation.value = false;
      taskToDelete.value = null;
    };

    // provide("deleteTask", deleteTask);
    // Fetch tasks from the API
    // Fetch tasks from the API

    const handleItemCheck = (checked, item, task) => {
      if (checked) {
        // Find or create corresponding task in doneTasks
        let doneTask = doneTasks.value.find(
          (t) => t.task_title === task.task_title
        );

        if (!doneTask) {
          doneTask = {
            ...task,
            items: [],
          };
          doneTasks.value.push(doneTask);
        }

        // Move item to done task
        doneTask.items.push({
          ...item,
          selected: true,
        });

        // Remove item from progress task
        const taskIndex = inProgressTasks.value.findIndex(
          (t) => t.id === task.id
        );
        inProgressTasks.value[taskIndex].items = task.items.filter(
          (i) => i.id !== item.id
        );

        // Remove empty tasks
        inProgressTasks.value = inProgressTasks.value.filter(
          (t) => t.items.length > 0
        );
      }
    };

    const handleItemUncheck = (checked, item, task) => {
      if (!checked) {
        // Find or create corresponding task in inProgressTasks
        let progressTask = inProgressTasks.value.find(
          (t) => t.task_title === task.task_title
        );

        if (!progressTask) {
          progressTask = {
            ...task,
            items: [],
          };
          inProgressTasks.value.push(progressTask);
        }

        // Move item back to progress task
        progressTask.items.push({
          ...item,
          selected: false,
        });

        // Remove item from done task
        const taskIndex = doneTasks.value.findIndex((t) => t.id === task.id);
        doneTasks.value[taskIndex].items = task.items.filter(
          (i) => i.id !== item.id
        );

        // Remove empty tasks
        doneTasks.value = doneTasks.value.filter((t) => t.items.length > 0);
      }
    };
    //Fetch All from db
    const loadTasks = async () => {
      try {
        pageLoadingState.value = true;
        const response = await FetchTasks();
        if (response.error) {
          console.error("API Error:", response.error);
          $q.notify({ type: "negative", message: response.error });
        } else {
          console.log("Fetched Tasks: ", response.tasks);
          inProgressTasks.value = response.tasks || [];
        }
      } catch (error) {
        $q.notify({ type: "negative", message: "Error loading tasks" });
      } finally {
        pageLoadingState.value = false;
      }
    };
    // Call the method when the component is mounted
    onMounted(() => {
      loadTasks();
    });

    return {
      handleItemCheck,
      handleItemUncheck,
      cancelDelete,
      deleteConfirmations,
      showDeleteConfirmation,
      hideDeleteConfirmation,
      deleteTask,
      router,
      editTask,
      handleEditClick,
      formatTime,
      formatDate,
      inProgressTasks,
      doneTasks,
      goToCreateTask,
      isORRangeCorrect,
      pageLoadingState,
      route,
      btnLoadingState,
      rowsWithCheckBox,
      selectAll,
      selectedUsersID,
      tasks,
      watch_task,
      confirmDelete,
      deleteTask,
    };
  },
};
