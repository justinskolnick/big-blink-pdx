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
      const labels = new Labels();
      const log = jest.spyOn(global.console, 'warn');

      labels.getLabel('nully_nimwit');

      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('label key not found for "nully_nimwit"');

      log.mockRestore();
    });

    describe('and a prefix', () => {
      test('logs to the console', () => {
        const labels = new Labels();
        const log = jest.spyOn(global.console, 'warn');

        labels.getLabel('nully_nimwit', 'nope');

        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith('label key not found for "nully_nimwit" using prefix "nope"');

        log.mockRestore();
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
