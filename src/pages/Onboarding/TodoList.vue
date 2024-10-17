<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <div
      class="todo-list onboarding-main-scroll standard-scroll row q-pt-lg q-pl-lg"
    >
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
              pathEndPoint="TodoList"
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
          class="in-progress onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-auto q-mr-auto"
        >
          In-Progress
        </div>

        <div
          v-for="task in inProgressTasks"
          :key="task.id"
          class="task-card col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10 q-mb-lg q-mr-lg"
        >
          <q-expansion-item expand-separator :label="task.task_title">
            <template v-slot:header="{ expanded }">
              <label
                v-if="expanded"
                class="onboarding-text-accent-0 text-semibold"
                >{{ task.task_title }}</label
              >

              <q-item-section
                v-if="!expanded"
                class="onboarding-text-accent-0 text-semibold"
                >{{ task.task_title }}</q-item-section
              >
              <q-item-section
                v-if="!expanded"
                side
                class="text-right onboarding-text-accent-0 text-semibold"
              >
                {{ formatDate(task.created_at) }}</q-item-section
              >
              <q-item-section v-if="expanded" @click.stop>
                <q-btn
                  class="q-ml-auto"
                  icon="more_horiz"
                  flat
                  style="color: #2b3347; text-decoration: none"
                >
                  <q-menu
                    class="menu-container q-pr-auto"
                    style="width: 10%; padding: 5px"
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        class="menu-list"
                        @click="
                          $router.push({
                            name: 'edit-task',
                            params: { id: task.id },
                          })
                        "
                      >
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section
                          clickable
                          v-close-popup
                          @click="showDeleteConfirmation(task.id)"
                          >Delete</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
              <q-dialog v-model="deleteConfirmations[task.id]">
                <DeleteConfirmation
                  @confirm="deleteTask(task.id)"
                  @cancel="hideDeleteConfirmation(task.id)"
                />
              </q-dialog>
            </template>

            <q-card>
              <q-card-section class="q-pa-none">
                <div class="col">
                  <q-list>
                    <!-- Loop through tasks -->
                    <q-item
                      v-for="item in task.items"
                      :key="item.id"
                      class="q-py-none"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          color="teal"
                          size="sm"
                          v-model="item.selected"
                          @update:model-value="
                            (val) => handleItemCheck(val, item, task)
                          "
                        />
                      </q-item-section>
                      <q-item-section>{{ item.task_name }}</q-item-section>
                      <q-item-section side>{{
                        formatTime(item.time)
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="text-right onboarding-text-accent-0 text-semibold">
                  {{ formatDate(task.created_at) }}
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
      <div class="col-6">
        <div
          class="in-progress onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-auto q-mr-auto"
        >
          done
        </div>
        <div
          v-for="task in doneTasks"
          :key="task.id"
          class="task-card col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10 q-mb-lg q-mr-lg"
        >
          <q-expansion-item
            v-model="isExpanded"
            expand-separator
            label="To-Do List"
          >
            <template v-slot:header="{ expanded }">
              <q-item-section
                v-if="!expanded"
                class="onboarding-text-accent-0 text-semibold"
              >
                {{ task.task_title }}
              </q-item-section>
              <q-item-section
                v-if="!expanded"
                side
                class="onboarding-text-accent-0 text-semibold"
              >
                {{ formatDate(task.created_at) }}
              </q-item-section>
              <q-item-section
                v-else
                class="onboarding-text-accent-0 text-semibold"
              >
                {{ task.task_title }}
              </q-item-section>
              <q-item-section v-if="expanded" side>
                <q-icon name="more_horiz" />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-pa-none">
                <q-list>
                  <q-item
                    v-for="item in task.items"
                    :key="item.id"
                    class="q-py-none"
                  >
                    <q-item-section>
                      <q-checkbox
                        color="teal"
                        size="sm"
                        v-model="item.selected"
                        @update:model-value="
                          (val) => handleItemUncheck(val, item, task)
                        "
                      />
                    </q-item-section>
                    <q-item-section>{{ item.task_name }}</q-item-section>
                    <q-item-section side>{{
                      formatTime(item.time)
                    }}</q-item-section>
                  </q-item>
                </q-list>
                <div class="text-right onboarding-text-accent-0 text-semibold">
                  {{ formatDate(task.created_at) }}
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

<script src="./scripts/ViewTask.js"></script>
