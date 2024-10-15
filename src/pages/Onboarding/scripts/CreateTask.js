import { ref, reactive } from "vue"; // Importing necessary functions from Vue
import { useQuasar } from "quasar"; // Import Quasar framework
import { useRoute, useRouter } from "vue-router"; // Import Vue Router hooks
import {
  InsertNewRange,
  InsertTask,
  // Import other necessary functions from your composables
} from "../../../composables/TodoList";

export default {
  setup() {
    const $q = useQuasar(); // Initialize Quasar
    const route = useRoute(); // Access the current route
    const router = useRouter(); // Access the router instance
    const tasks = ref([]); // Ensure 'tasks' is initialized as an array

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
    const taskFormRef = ref(null); // Declare a ref for the form

    // Method to create a new task
    const createTaskForm = async () => {
      try {
        if (!taskFormRef.value) {
          throw new Error("Form reference is not available");
        }

        const isValid = await taskFormRef.value.validate();
        if (!isValid) {
          $q.notify({
            type: "negative",
            message: "Please fill in all fields.",
          });
          return;
        }

        // Log the taskForm object before submitting
        console.log("Submitting taskForm:", JSON.stringify(taskForm));

        // Call the InsertTask function with the correct payload
        const response = await InsertTask({
          task_title: taskForm.task_title, // Correctly reference task_title
          keyResults: taskForm.keyResults, // Reference keyResults
        });

        $q.notify({ type: "positive", message: "Task created successfully!" });
        console.log("Task successfully inserted:", response);
        router.push("todo-list"); // Navigate to the todo list page
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Failed to create task: " + error.message,
        });
      }
    };

    // Return reactive properties and methods
    return {
      taskFormRef,
      createTaskForm,
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
