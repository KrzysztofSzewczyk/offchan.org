import { categories } from "@/config";
import { Boards } from "@/api/types";
import { Thread } from "@/api/firebase/document/thread";

export interface BoardState {
  lastFetch: number;
  listener: null | Function;
  document: Thread[];
}

export interface State {
  threads: { [BoardName in Boards]: BoardState };
}

export function createStateForBoard(name: Boards): BoardState {
  return {
    lastFetch: +new Date(),
    listener: null,
    document: []
  };
}

export function getInitialState(): State {
  return {
    threads: {
      cyb: createStateForBoard("cyb"),
      psy: createStateForBoard("psy"),
      art: createStateForBoard("art"),
      cult: createStateForBoard("cult"),
      tech: createStateForBoard("tech"),
      λ: createStateForBoard("λ"),
      Δ: createStateForBoard("Δ"),
      φ: createStateForBoard("φ")
    }
  };
}
