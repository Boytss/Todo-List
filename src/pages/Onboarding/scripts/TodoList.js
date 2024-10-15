import { ref, reactive } from "vue"; // Importing necessary functions from Vue
import { useQuasar } from "quasar"; // Import Quasar framework
import { useRoute, useRouter } from "vue-router"; // Import Vue Router hooks
import {
  InsertNewRange,
  InsertTask,
  // Import other necessary functions from your composables
} from "../../../composables/TodoList";
import { route } from "quasar/wrappers";

export default {
  setup() {
    const inProgressTasks = ref([]);
    const doneTasks = ref([]);

    // Fetch tasks and filter them into In-Progress and Done categories
    onMounted(async () => {
      try {
        await FetchTasksWithItems(); // Assuming this function fetches tasks with their items
        const tasks = GetTasks.value;

        // Split tasks into In-Progress and Done
        inProgressTasks.value = tasks.filter((task) => !task.isDone); // Assuming 'isDone' flag
        doneTasks.value = tasks.filter((task) => task.isDone);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    });

    return {
      inProgressTasks,
      doneTasks,
      taskFormRef,
      createTaskForm,
      keyResults,
      addKeyResult,
      removeKeyResult,
      newRangeForm,
      taskForm,
      fundTypes,

      isORRangeCorrect,
      addNewRange,
      pageLoadingState,
      route,
      btnLoadingState,
      time: ref("10:56"), // Default time
      timeWithSeconds: ref("10:56:00"), // Default time with seconds
    };
  },
};
