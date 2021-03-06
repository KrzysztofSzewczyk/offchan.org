import { firestore } from "firebase/app";
import { database } from "../app";
import { Comment } from "./comment";
import { Board } from "../../types";

export interface ThreadPayload {
  content: string;
  image?: string;
  author?: string;
}

export type ThreadDocument = ThreadPayload & {
  board: Board;
  createdAt: firestore.FieldValue;
  comments?: Comment[];
};

export type Thread = ThreadDocument & {
  guid: string;
};

export const threads = database.collection("threads");

/**
 * Creates a new thread in a given board.
 *
 * @param thread  Board GUID
 * @param data    Thread data
 */
export function create(board: Board, data: ThreadPayload) {
  const thread: ThreadDocument = {
    board: board,
    content: data.content,
    createdAt: firestore.FieldValue.serverTimestamp()
  };

  if (data.author) {
    thread.author = data.author;
  }

  if (data.image) {
    thread.image = data.image;
  }

  return threads.add(thread);
}

/**
 * Fetches all the threads from a given board.
 *
 * @param board       Board id
 * @param onSnapshot  Callback
 */
export function fetch(
  board: Board,
  onSnapshot: (data: Readonly<Thread>[]) => void
) {
  const threadsQuery = threads
    .where("board", "==", board)
    .orderBy("createdAt", "desc");

  const unsubscribe = threadsQuery.onSnapshot(snapshot => {
    const threads: Readonly<Thread>[] = snapshot.docs.map(doc => ({
      guid: doc.id,
      comments: [],
      ...(doc.data() as ThreadDocument)
    }));

    onSnapshot(threads);
  });

  return unsubscribe;
}

/**
 * Fetches threads for a board only once (without listening for changes).
 *
 * @param board     Board GUID
 */
export function fetchOnce(board: Board) {
  return threads
    .where("board", "==", board)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => ({
        guid: doc.id,
        comments: [],
        ...(doc.data() as ThreadDocument)
      })) as Readonly<Thread>[];
    });
}

/**
 * Updates a given thread from a board.
 *
 * @param board     Board GUID
 * @param data      New thread data
 */
export function update(board: Board, data: ThreadDocument) {
  throw new Error("Not implemented");
}

/**
 * Removes a given thread.
 *
 * @param thread    Thread GUID
 */
export function remove(thread: string) {
  throw new Error("Not implemented");
}
