<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="width-300">
      <div class="full-width flex justify-center q-mb-md">
        <div class="onboarding-border-radius-10 bg-white width-auto q-pa-sm">
          <q-icon
            name="iconfont icon-delete-fill"
            class="onboarding-text-accent-0"
            size="30px"
          />
        </div>
      </div>
      <h6
        :class="`grid justify-center items-center text-weight-light text-27 q-my-sm ${
          $q.screen.width < 768 ? 'q-mb-sm' : 'q-mb-lg'
        }`"
        style="
          background: #18191b;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          color: white;
          height: 50; /* Set a height for vertical centering */
        "
      >
        Are you sure you want to delete this To-Do List?
      </h6>
      <p
        class="text-20 text-weight-light q-pb-sm"
        style="
          background: gray;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        "
      >
        This process cannot be undone.
      </p>

      <q-btn
        @click="$emit('confirm')"
        :loading="loading"
        flat
        no-caps
        label="Yes"
        dense
        :class="`onboarding-bg-accent-0 onboarding-text-accent-1 text-white full-width q-py-sm q-mb-s onboarding-border-radius-${
          $q.screen.width < 768 ? '10' : '50'
        }`"
      />
      <q-btn
        @click="$emit('cancel')"
        :loading="loading"
        flat
        no-caps
        label="Cancel"
        dense
        :class="`onboarding-bg-accent-0 onboarding-text-accent-1 text-white full-width q-py-sm q-mb-s q-mt-sm onboarding-border-radius-${
          $q.screen.width < 768 ? '10' : '50'
        }`"
      />
    </div>
  </div>
</template>
<script>
import { ref, inject } from "vue";
import { ToggleMainDialogState } from "../composables/Triggers";

export default {
  setup() {
    let btnLoadingState = ref(false);

    let rows = ref([]);
    const deleteFunction = inject("deleteTask");
    const deleteOR = inject("deleteOR");
    const confirmDelete = async () => {
      btnLoadingState.value = true;
      await deleteFunction();
      btnLoadingState.value = false;
      closeDialog();
    };
    const closeDialog = () => {
      ToggleMainDialogState();
    };

    return {
      deleteOR,
      closeDialog,
      btnLoadingState,
      confirmDelete,
    };
  },
};
</script>
