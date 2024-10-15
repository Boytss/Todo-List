<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <div class="todo-list row q-pt-lg q-pl-lg">
      <div v-if="!pageLoadingState"></div>
      <div class="q-pd-lg gt-xs" style="width: 100%">
        <div class="flex justify-between q-mt-sm q-mb-lg">
          <h5 class="text-26 text-semibold q-my-none onboarding-text-accent-0">
            To-Do List
          </h5>
          <div class="flex justify-end">
            <Filters
              dynamicHeight="34"
              :labelVisible="false"
              :searchVisible="true"
              :filterDateVisible="false"
              pathEndPoint="orNumbers"
            />
            <q-btn
              flat
              rounded
              no-caps
              dense
              class="onboarding-border-accent-0 onboarding-bg-accent-0 text-white q-px-xl q-mr-lg"
              @click="$router.push({ name: 'create-task' })"
              label="Create a new task"
            />
          </div>
        </div>
        <div class="flex justify-between q-mb-md gt-xs">
          <div>
            <Filters :selectVisible="true" pathEndPoint="orNumbers" />
          </div>
          <div class="flex itempt-center">
            <div
              class="text-14 onboarding-text-accent-1 q-mr-md"
              :class="$q.screen.width < 767 && 'hidden'"
            ></div>
            <Pagination
              v-model:pagination="pagination"
              :numRows="GetORNumbers"
            />
          </div>
        </div>
      </div>

      <div class="col-6">
        <div
          class="in-progress onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-xs"
        >
          In-Progress
        </div>

        <div
          class="col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10 q-mr-md"
        >
          <q-expansion-item expand-separator label="To-Do List">
            <template v-slot:header="{ expanded }">
              <q-item-section
                v-if="!expanded"
                class="onboarding-text-accent-0 text-semibold"
              >
                Task Name
              </q-item-section>
              <q-item-section
                v-if="!expanded"
                side
                class="onboarding-text-accent-0 text-semibold"
              >
                January 0, 2024
              </q-item-section>
              <q-item-section
                v-else
                class="onboarding-text-accent-0 text-semibold"
              >
                To-Do List
              </q-item-section>
              <q-item-section v-if="expanded" side>
                <q-icon name="more_horiz" />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-pa-none">
                <div class="col">
                  <q-list>
                    <!-- Loop through tasks -->
                    <q-item
                      v-for="task in rowsWithCheckBox"
                      :key="task.id"
                      class="q-py-none"
                    >
                      <q-item-section avatar>
                        <q-checkbox v-model="task.selected" />
                      </q-item-section>
                      <q-item-section>{{ task.name }}</q-item-section>
                      <q-item-section side>{{ task.overall }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="text-right onboarding-text-accent-0 text-semibold">
                  January 0, 2024
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
      <div class="col-6">
        <div
          class="in-progress onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-xs q-mr-md"
        >
          done
        </div>
        <div
          class="col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10"
        >
          <q-expansion-item expand-separator label="To-Do List">
            <template v-slot:header="{ expanded }">
              <q-item-section
                v-if="!expanded"
                class="onboarding-text-accent-0 text-semibold"
              >
                Task Name
              </q-item-section>
              <q-item-section
                v-if="!expanded"
                side
                class="onboarding-text-accent-0 text-semibold"
              >
                January 0, 2024
              </q-item-section>
              <q-item-section
                v-else
                class="onboarding-text-accent-0 text-semibold"
              >
                To-Do List
              </q-item-section>
              <q-item-section v-if="expanded" side>
                <q-icon name="more_horiz" />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-pa-none">
                <div class="col">
                  <q-list>
                    <!-- Loop through tasks -->
                    <q-item class="q-py-none">
                      <q-item-section>
                        <q-checkbox />
                      </q-item-section>
                      <q-item-section>Task Name</q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="text-right onboarding-text-accent-0 text-semibold">
                  January 0, 2024
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scope>
@import url("./styles/TodoList.scss");
</style>

<script>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
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

    watch(selectAll, () => {
      if (selectAll.value) {
        console.log("rows.value ", rows);
        rows.forEach((a) => {
          selectedUsersID.value.push(a.id);
        });
      } else {
        selectedUsersID.value = [];
      }
    });

    return {
      rowsWithCheckBox,
      selectAll,
      selectedUsersID,
    };
  },
};
</script>
