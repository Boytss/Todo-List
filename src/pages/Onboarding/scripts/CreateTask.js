import { ref, reactive } from "vue"; // Importing necessary functions from Vue
import { useQuasar } from "quasar"; // Import Quasar framework
import { defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import Vue Router hooks

import {
  InsertNewRange,
  InsertTask,
  FetchTaskById,
  UpdateTask,
  // Import other necessary functions from your composables
} from "../../../composables/TodoList";

export default {
  setup() {
    const $q = useQuasar(); // Initialize Quasar
    const route = useRoute(); // Access the current route
    const router = useRouter(); // Access the router instance
    const tasks = ref([]); // Ensure 'tasks' is initialized as an array
    const taskFormRef = ref(null); // Declare a ref for the form
    const isEditing = ref(!!route.params.id); // Check if editing
    const taskId = route.params.id; // Gets the task ID if present

    // Define reactive properties
    const keyResults = ref([{ task_title: "", time: "" }]); // Initialize keyResults
    const taskForm = reactive({
      task_title: "", // Task title
      keyResults: [{ taskName: "", time: "" }], // Array of key result objects
    });
    const rows = ref([]); // To hold data rows
    const newRangeForm = ref(null); // To hold new range form data

    // Define form properties
    const form = ref({
      fund_type_id: null,
      form_type: null,
    });

    const fundTypes = ref([
      { id: 1, name: "General Fund" },
      { id: 2, name: "Special Fund" },
    ]); // Sample fund types

    const pageLoadingState = ref(false); // Loading state for the page
    const isORRangeCorrect = ref(true); // Validation state for OR range
    const btnLoadingState = ref(false); // Loading state for the button
    onMounted(async () => {
      if (isEditing.value) {
        try {
          pageLoadingState.value = true;
          console.log("Fetching task with ID:", taskId);
          const task = await FetchTaskById(taskId);
          console.log("Fetched task data:", task);

          // Assuming task should be an array, make sure to check its structure
          if (Array.isArray(task)) {
            tasks.value = task;
          } else {
            tasks.value = []; // Default to an empty array if task is not an array
          }

          // Proceed with populating taskForm as you were
          taskForm.task_title = task.task_title;
          taskForm.keyResults = task.keyResults.map((kr) => ({
            taskName: kr.task_name || kr.taskName,
            time: kr.time,
          }));

          console.log("Updated taskForm:", taskForm);
        } catch (error) {
          console.error("Failed to fetch task for editing", error);
          $q.notify({
            type: "negative",
            message: "Failed to load task for editing",
          });
        } finally {
          pageLoadingState.value = false;
        }
      }
    });
    // Method to add a new key result
    const addKeyResult = () => {
      taskForm.keyResults.push({ taskName: "", time: "" });
      console.log(
        "After adding - taskForm.keyResults:",
        JSON.stringify(taskForm.keyResults)
      );
    };

    // Method to remove a key result by index
    const removeKeyResult = (index) => {
      if (taskForm.keyResults.length > 1 && index !== 0) {
        taskForm.keyResults.splice(index, 1);
      }
    };

    // Method to add a new range
    const addNewRange = () => {
      InsertNewRange(newRangeForm.value).then((success) => {
        if (success) {
          // Push the new form to rows if the operation was successful
          rows.value.push(form.value);
        }
      });
    };
    // Method to create a new task

    // Method to create a new task
    const createOrUpdateTask = async () => {
      try {
        const payload = {
          task_title: taskForm.task_title,
          keyResults: taskForm.keyResults,
        };

        if (isEditing.value) {
          payload.id = taskId;
          // Bypass tasks-related code for debugging purposes
          // const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
          await UpdateTask(payload);
        } else {
          await InsertTask(payload);
        }

        $q.notify({
          type: "positive",
          message: `Task ${
            isEditing.value ? "updated" : "created"
          } successfully!`,
        });
        router.push({ name: "todo-list" });
      } catch (error) {
        console.error("Error in createOrUpdateTask:", error);
        $q.notify({
          type: "negative",
          message: `Failed to ${isEditing.value ? "update" : "create"} task: ${
            error.message
          }`,
        });
      }
    };
    const submitTask = () => {
      const payload = {
        task_title: taskForm.task_title,
        keyResults: taskForm.keyResults,
      };

      InsertTask(payload)
        .then((response) => {
          console.log("Task successfully inserted:", response);
          $q.notify({
            type: "positive",
            message: "Task created successfully!",
          });
          router.push({ name: "todo-list" });
        })
        .catch((error) => {
          console.error("Error inserting task:", error);
          $q.notify({
            type: "negative",
            message: "Failed to create task: " + error.message,
          });
        });
    };

    // Return reactive properties and methods
    return {
      submitTask,
      isEditing,
      taskFormRef,
      createOrUpdateTask,
      keyResults,
      addKeyResult,
      removeKeyResult,
      newRangeForm,
      taskForm,
      fundTypes,
      form,

      isORRangeCorrect,
      addNewRange,
      pageLoadingState,
      route,
      btnLoadingState,
      time: ref("10:56"), // Default time
      timeWithSeconds: ref("10:56:00"), // Default time with seconds
    };
  },
  methods: {
    submitTask() {
      const payload = {
        task_title: this.taskForm.task_title, // Ensure task_title is correct
        keyResults: this.taskForm.keyResults,
      };

      InsertTask(payload)
        .then((response) => {
          console.log("Task successfully inserted:", response);
          console.log("Task submitted:", this.taskForm);
          // Ensure that `rows` is an array before pushing the new task
          if (Array.isArray(this.rows.value)) {
            this.rows.value.push(response); // Or push the necessary data from the response
          }
        })
        .catch((error) => {
          console.error("Error inserting task:", error);
        });
    },
  },
};
