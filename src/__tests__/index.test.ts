import { isAnd, evalTerm, reducer } from '../logic';

describe('#isAnd', () => {
  it.each(['and', 'AND'])('returns true when feed with any AND casing', w => {
    expect(isAnd(w)).toBeTruthy();
  });
});

describe('#evalTerm', () => {
  describe('when the current term is a conjuction', () => {
    const r = evalTerm({ type: 'FETCH', target: 'and', parent: 'plane' }, [
      { meanings: [{ partOfSpeech: 'conjunction' }] },
    ]);
    it('should return a replace suggestion', () => {
      expect(r).toHaveProperty('type', 'REPLACE');
    });
  });

  describe('when the current term is not conjuction', () => {
    const r = evalTerm({ type: 'FETCH', target: 'hello', parent: 'plane' }, [{ meanings: [{ partOfSpeech: 'noun' }] }]);
    it('should not touch the current suggestion', () => {
      expect(r).toHaveProperty('type', 'FETCH');
    });
  });
});

describe('#reducer', () => {
  describe('when the current part does not end with comma', () => {
    const result = reducer([], 'complex', 1, ['is', 'complex', 'to']);

    it('should not suggest anything', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when the current part does ends with comma', () => {
    describe('when the current word is AND', () => {
      const result = reducer([], 'and', 2, ['is', 'complex,', 'and']);

      it('should suggest a removal', () => {
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('type', 'REMOVE')
      });
    })

    describe('when the current word is not AND', () => {
      const result = reducer([], 'because', 2, ['is', 'complex,', 'because']);

      it('should suggest a fetch', () => {
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('type', 'FETCH')
      });
    })
  });
});
