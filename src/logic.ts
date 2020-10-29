export type ApiResult = Array<{ meanings: Array<{ partOfSpeech: string }> }>;

export type Suggestion = {
  type: 'REPLACE' | 'REMOVE' | 'FETCH';
  parent: string;
  target: string;
};

export const isConjunctionFn = (result: ApiResult) => {
  const agg = result.flatMap(term => term.meanings.map(m => m.partOfSpeech));

  return agg.some(m => m === 'conjunction');
};

export const isAnd = (word: string) => word.toLowerCase() === 'and';

export const reducer = (prev: Suggestion[], word: string, index: number, array: string[]) => {
  const acc = prev;
  const prevWord = array[index - 1];

  if (prevWord && prevWord.endsWith(',')) {
    if (isAnd(word)) {
      return acc.concat([{ type: 'REMOVE', parent: prevWord, target: word }]);
    } else {
      return acc.concat([{ type: 'FETCH', parent: prevWord, target: word }]);
    }
  }

  return acc;
};

export function evalTerm(suggestion: Suggestion, term: ApiResult): Suggestion {
  if (isConjunctionFn(term)) return { type: 'REPLACE', target: suggestion.target, parent: suggestion.parent };

  return suggestion;
}
