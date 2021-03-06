<template>
  <b-container v-if="Boolean(threadData)">
    <ThreadPost
      :board="board"
      :guid="threadGuid"
      :comments="threadData.comments"
      class="full-thread"
    >
      <template slot="author">{{ threadData.author || "Anon" }}</template>

      <template slot="upload-file">
        <b-card-img
          v-if="threadData.image"
          :src="getImageUrl(threadData.image)"
          alt="Thread image"
        />
      </template>

      <template slot="upload-name">{{ threadData.image }}</template>
      {{ threadData.content }}
    </ThreadPost>

    <CommentForm :board="board" :guid="threadGuid"></CommentForm>
  </b-container>

  <b-container v-else>Loading...</b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ThreadPost from "@/components/Thread/Post.vue";
import CommentForm from "@/components/Comments/Form.vue";
import { State } from "@/store/getInitialState";
import { Board } from "@/api/types";
import { getImageUrl } from "@/helpers/getImageUrl";

@Component({
  components: {
    ThreadPost,
    CommentForm
  }
})
export default class ThreadView extends Vue {
  get board() {
    return this.$route.params.board as Board;
  }

  get threadGuid() {
    return this.$route.params.thread;
  }

  get threadData() {
    const state = this.$store.state as State;

    return state.threads[this.board].document.find(
      thread => thread.guid === this.threadGuid
    );
  }

  getImageUrl(uuid: string) {
    return getImageUrl(uuid);
  }

  mounted() {
    this.onThreadChange();
  }

  destroyed() {
    this.unsubscribe();
  }

  @Watch("board")
  @Watch("threadGuid")
  onThreadChange() {
    this.unsubscribe();

    if (this.threadData === undefined) {
      this.$store
        .dispatch("fetchThreadsOnce", { board: this.board })
        .then(() => {
          if (this.threadData === undefined) {
            this.$router.push("/error");
          } else {
            this.fetchComments();
          }
        });
    } else {
      this.fetchComments();
    }
  }

  fetchComments() {
    this.$store.dispatch("fetchComments", {
      board: this.board,
      threadId: this.threadGuid
    });
  }

  unsubscribe() {
    this.$store.dispatch("unsubscribeComments", {
      board: this.board,
      threadId: this.threadGuid
    });
  }
}
</script>

<style lang="scss" scoped>
.full-thread {
  margin: 5rem 0;
}
</style>
