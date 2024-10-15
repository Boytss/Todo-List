<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <div class="create-task">
      <div v-if="!pageLoadingState">
        <div class="q-px-lg q-pt-lg gt-xs">
          <div
            class="flex justifty-start itempt-center onboarding-text-accent-0 q-mt-sm q-mb-lg z gt-xs q-ml-sm"
          >
            <q-btn @click="$router.go(-1)" round dense flat icon="arrow_back" />
            <h5 class="text-26 text-semibold q-my-none q-ml-sm">
              {{ route.params.id ? "Edit" : "Create New" }} Task
            </h5>
          </div>

          <div class="onboarding-main-scroll standard-scroll rowinput-task">
            <q-form ref="taskFormRef" greedy @submit="createOrUpdateTask">
              <div>
                <label class="text-weight-small q-pl-lg">Task Title</label>
                <q-input
                  v-model="taskForm.task_title"
                  dense
                  borderless
                  placeholder="Task Title"
                  :rules="[(val) => !!val]"
                  hide-bottom-space
                  class="onboarding-input-field standard onboarding-border-accent-0 onboarding-border-radius-10 q-ml-lg q-mt-sm"
                />
              </div>
              <div
                v-for="(keyResult, index) in taskForm.keyResults"
                :key="index"
              >
                <div
                  class="onboarding-border-accent-0 onboarding-border-radius-15 q-ml-lg q-px-md q-py-lg q-mt-md standard-form-width"
                >
                  <div class="field">
                    <div class="flex justify-between items-center">
                      <label class="text-weight-small">Task Name</label>
                      <div v-if="taskForm.keyResults.length > 1 && index !== 0">
                        <q-btn
                          flat
                          class="delete_button onboarding-buttontext-grey q-pa-none"
                          size="10px"
                          icon="iconfont icon-delete-fill"
                          @click="
                            route.params.id
                              ? openDialog(index)
                              : removeKeyResult(index)
                          "
                        />
                      </div>
                      <q-input
                        v-model="keyResult.taskName"
                        dense
                        borderless
                        placeholder="Task Name"
                        :rules="[(val) => !!val]"
                        hide-bottom-space
                        class="onboarding-input-field standard onboarding-border-accent-0 onboarding-border-radius-10 q-mt-sm"
                      />
                      <label class="text-weight-small q-pt-lg">Time</label>
                      <q-input
                        v-model="keyResult.time"
                        mask="time"
                        placeholder="00:00"
                        :rules="[(val) => !!val]"
                        hide-bottom-space
                        class="onboarding-input-field standard onboarding-border-accent-0 onboarding-border-radius-10 q-mt-sm"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="access_time"
                            class="cursor-pointer"
                            color="teal"
                          >
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                              color="green"
                            >
                              <q-time
                                v-model="keyResult.time"
                                class="onboarding-border-accent-0"
                                color="teal"
                              >
                                <div class="row justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="teal"
                                    flat
                                  />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style="border: 1px dashed #869ab2"
                class="onboarding-border-radius-15 flex justify-center standard-form-width q-ml-lg q-my-sm q-pa-md"
              >
                <q-btn
                  flat
                  round
                  class="onboarding-bg-accent-0 text-white onboarding-text-accent-1"
                  id="generateKeyInput"
                  @click="addKeyResult"
                  no-caps
                  icon="add"
                />
              </div>
              <div class="flex justify-between q-mt-sm q-mb-lg"></div>
              <q-btn
                @click="$router.push({ name: 'todo-list' })"
                rounded
                dense
                flat
                no-caps
                label="cancel"
                class="onboarding-border-accent-0 text-white onboarding-bg-accent-0 q-px-xl q-mr-lg q-ml-lg"
              />
              <q-btn
                type="submit"
                rounded
                dense
                flat
                no-caps
                :label="isEditing ? 'Update Task' : 'Create Task'"
                @click.prevent="submitTask"
                class="onboarding-border-accent-0 text-white onboarding-bg-accent-0 q-px-xl"
              />
            </q-form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script src="./scripts/CreateTask.js"></script>

<style lang="scss">
@import "./styles/TodoList.scss";
</style>
