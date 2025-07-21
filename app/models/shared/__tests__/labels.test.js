const mockConsole = require('jest-mock-console');

const Labels = require('../labels');

describe('getLabel()', () => {
  test('returns the expected labels', () => {
    const labels = new Labels();

    expect(labels.getLabel('incidents__percentage')).toBe('Share of total');
    expect(labels.getLabel('incidents__total')).toBe('Incident count');
    expect(labels.getLabel('total', 'incidents')).toBe('Incident count');
    expect(labels.getLabel('totals')).toBe('Totals');
  });

  describe('with a missing string key', () => {
    test('logs to the console', () => {
      const restoreConsole = mockConsole();
      const labels = new Labels();

      labels.getLabel('nully_nimwit');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith('label key not found for "nully_nimwit"');

      restoreConsole();
    });

    describe('and a prefix', () => {
      test('logs to the console', () => {
        const restoreConsole = mockConsole();
        const labels = new Labels();

        labels.getLabel('nully_nimwit', 'nope');

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith('label key not found for "nully_nimwit" using prefix "nope"');

        restoreConsole();
      });
    });
  });
});

describe('setLabels()', () => {
  test('returns the expected labels', () => {
    const labels = new Labels();

    labels.setLabels({
      thing: 'One Little Thing',
    });

    expect(labels.getLabel('thing')).toBe('One Little Thing');
  });
});
