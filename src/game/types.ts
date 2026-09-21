export type Participant = { id: string; name: string };
export type Exclusion = [string, string];
export type Assignment = { giver: string; receiver: string };
export type Game = {
  title: string;
  budget: string;
  date: string;
  participants: Participant[];
  exclusions: Exclusion[];
  assignments: Assignment[];
  opened: string[];
};
export const emptyGame: Game = {
  title: "",
  budget: "",
  date: "",
  participants: [],
  exclusions: [],
  assignments: [],
  opened: [],
};
export const MAX_PARTICIPANTS = 30;
