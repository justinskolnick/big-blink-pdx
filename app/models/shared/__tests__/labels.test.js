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

  describe('with values', () => {
    test('returns the expected labels', () => {
      const labels = new Labels();

      expect(labels.getLabel('description_period', 'leaderboard', { period: '2026' })).toBe('In 2026, :lobbyists_total_result lobbyists representing :entities_total_result entities reported lobbying :officials_total_result City of Portland officials across :incident_count_result reported incidents.');
    });
  });

  describe('with a missing string key', () => {
    test('logs to the console', () => {
      const restoreConsole = mockConsole();
      const labels = new Labels();

      labels.getLabel('nully_nimwit');

      /* eslint-disable no-console */
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith('label key not found for "nully_nimwit"');
      /* eslint-enable no-console */

      restoreConsole();
    });

    describe('and a prefix', () => {
      test('logs to the console', () => {
        const restoreConsole = mockConsole();
        const labels = new Labels();

        labels.getLabel('nully_nimwit', 'nope');

        /* eslint-disable no-console */
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith('label key not found for "nully_nimwit" using prefix "nope"');
        /* eslint-enable no-console */

        restoreConsole();
      });
    });
  });
});

describe('setLabels()', () => {
  test('returns the expected label', () => {
    const labels = new Labels();

    labels.setLabels({
      thing: 'One Little Thing',
    });

    expect(labels.getLabel('thing')).toBe('One Little Thing');
  });
});


describe('getInterpolatedLabel()', () => {
  test('returns the expected labels', () => {
    const labels = new Labels();

    expect(labels.getInterpolatedLabel('One :item', { item: 'hat' })).toBe('One hat');
    expect(labels.getInterpolatedLabel('One :item and two :paired_items', { item: 'hat', pairedItems: 'shoes' })).toBe('One hat and two shoes');
  });
});
