import { ref, watch, onMounted, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import {
  InsertNewRange,
  InsertTask,
  FetchTasks,
  GetTasks,
} from "../../../composables/TodoList";

export default {
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const inProgressTasks = ref([]);
    const doneTasks = ref([]);
    const pageLoadingState = ref(false);
    const isORRangeCorrect = ref(true);
    const btnLoadingState = ref(false);
    const tasks = ref([]); // Initialize as an array
    let watch_task = ref(false);
    const goToCreateTask = (event) => {
      event.stopPropagation();
      router.push({ name: "create-task" });
    };

    const rowsWithCheckBox = ref([
      {
        id: 1,
        name: "Make To-Do List Design",
        overall: "8:00 AM",
        action: " ",
        selected: false,
      },
      {
        id: 2,
        name: "Fill Up OJT Evaluation Form",
        overall: "12:00 PM",
        action: " ",
        selected: false,
      },
      {
        id: 3,
        name: "Make To-Do List Design",
        overall: "8:00 AM",
        action: " ",
        selected: false,
      },
      {
        id: 4,
        name: "Fill Up OJT Evaluation Form",
        overall: "12:00 PM",
        action: " ",
        selected: false,
      },
    ]);

    const selectAll = ref(false);
    const selectedUsersID = ref([]);

    watch(selectAll, (newValue) => {
      rowsWithCheckBox.value.forEach((row) => {
        row.selected = newValue;
      });
      selectedUsersID.value = newValue
        ? rowsWithCheckBox.value.map((row) => row.id)
        : [];
    });

    watch(
      () => rowsWithCheckBox.value.map((row) => row.selected),
      (newSelectedStates) => {
        selectAll.value = newSelectedStates.every(Boolean);
        selectedUsersID.value = rowsWithCheckBox.value
          .filter((row, index) => newSelectedStates[index])
          .map((row) => row.id);
      },
      { deep: true }
    );
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };
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
    // Fetch tasks from the API
    const loadTasks = async () => {
      try {
        const response = await FetchTasks();
        if (response.error) {
          console.error("API Error:", response.error);
          $q.notify({ type: "negative", message: response.error });
        } else {
          console.log("Fetched Tasks: ", response.tasks);
          inProgressTasks.value = response.tasks || []; // Ensure tasks are set
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
    };
  },
};
