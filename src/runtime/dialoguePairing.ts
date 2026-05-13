import { DialogueInteractionType, RegistrySentence } from "./sessionTypes";

export type DialoguePairingOptions = {
  allowQuestionAnswerChoices?: boolean;
  rapidResponseVariant?: "yes" | "no" | null;
};

const DEFAULT_YES_RESPONSE = "Yes, I am.";
const DEFAULT_NO_RESPONSE = "No, I'm not.";

export function isQuestionPrompt(input: Pick<
  RegistrySentence,
  "npcPrompt" | "expectedAnswer" | "communicativeFunction" | "grammarTags" | "drillTags"
>): boolean {
  return (
    input.npcPrompt.trim().endsWith("?") ||
    input.expectedAnswer.trim().endsWith("?") ||
    input.communicativeFunction?.startsWith("ask_") === true ||
    input.grammarTags?.includes("yes_no_question") === true ||
    input.grammarTags?.includes("wh_question") === true ||
    input.drillTags?.some((tag) => tag.includes("question")) === true
  );
}

export function getDialogueInteractionType(
  sentence: RegistrySentence,
): DialogueInteractionType | undefined {
  if (sentence.interactionType) {
    return sentence.interactionType;
  }

  if (isQuestionPrompt(sentence) && sentence.responseAnswers) {
    return "be_yes_no_response";
  }

  return undefined;
}

export function getCompatibleResponses(
  sentence: RegistrySentence,
  _allSentences: RegistrySentence[],
  options: DialoguePairingOptions = {},
): string[] {
  const interactionType = getDialogueInteractionType(sentence);

  if (interactionType === "be_yes_no_response") {
    const yesAnswer = sentence.responseAnswers?.yes ?? DEFAULT_YES_RESPONSE;
    const noAnswer = sentence.responseAnswers?.no ?? DEFAULT_NO_RESPONSE;

    if (options.rapidResponseVariant === "yes") {
      return [yesAnswer, noAnswer];
    }

    if (options.rapidResponseVariant === "no") {
      return [noAnswer, yesAnswer];
    }

    return [yesAnswer, noAnswer];
  }

  return [];
}

export function shouldExcludeAsAnswerChoice(
  candidate: string,
  prompt: RegistrySentence,
  options: DialoguePairingOptions = {},
): boolean {
  if (candidate === prompt.npcPrompt) {
    return true;
  }

  if (!options.allowQuestionAnswerChoices && candidate.trim().endsWith("?")) {
    return true;
  }

  return false;
}
