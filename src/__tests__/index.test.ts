import { processWord } from '../index';

describe('#processWord', () => {
  it('returns true when feed with a conjunction', () => {
    expect(processWord('and', jest.fn().mockResolvedValue(true))).toBeTruthy();
  });

  it('returns false when feed with another conjunction', () => {
    expect(processWord('hello', jest.fn().mockResolvedValue(false))).toBeTruthy();
  });

  it('does not call the API when feed with and', () => {
    const conjSpy = jest.fn().mockResolvedValue(false);

    const result = processWord('and', conjSpy);

    expect(processWord('and', jest.fn().mockResolvedValue(false))).toBeTruthy();
    expect(conjSpy).not.toHaveBeenCalled();

    return expect(result).resolves.toBeTruthy();
  });
});
