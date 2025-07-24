const IncidentedBase = require('./shared/base-incidented');

class Source extends IncidentedBase {
  static tableName = 'data_sources';
  static linkKey = 'source';

  static perPage = 40;

  static fieldNames = {
    id:                     { select: true, },
    type:                   { select: true, },
    format:                 { select: true, },
    title:                  { select: true, },
    year:                   { select: true, },
    quarter:                { select: true, },
    quarter_id:             { select: false, }, // eslint-disable-line camelcase
    public_url:             { select: true, }, // eslint-disable-line camelcase
    is_via_public_records:  { select: true, }, // eslint-disable-line camelcase
    retrieved_at:           { select: true, adapt: { as: 'retrievedDate', method: this.readableDate } }, // eslint-disable-line camelcase
  };

  static types = {
    activity: 'activity',
    personnel: 'personnel',
    registration: 'registration',
  };

  static adaptEntity(result) {
    const adapted = {
      entity: {
        id: result.id,
        name: result.name,
      },
    };

    if (result.total) {
      adapted.total = result.total;
    }

    return adapted;
  }

  getType(type) {
    if (type in this.constructor.types) {
      return this.constructor.types[type];
    }
  }

  hasPublicUrl() {
    return this.hasData('public_url') && Boolean(this.getData('public_url'));
  }

  isViaPRR() {
    return this.getData('is_via_public_records') === true;
  }

  adaptDisclaimer(result, adapted) {
    const prefix = 'source';
    const labels = [];

    if (this.hasPublicUrl() || this.isViaPRR()) {
      // todo: return readable format in adapted data
      const values = {
        ...adapted,
        format: this.readableFormat(adapted.format),
      };
      let key;

      if (this.hasPublicUrl()) {
        key = 'info_linked';
      } else if (this.isViaPRR()) {
        key = 'info_public_records_request';
      }

      labels.push(this.getLabel(key, prefix, values));
    }

    if (result.type === this.getType('activity')) {
      labels.push(this.getLabel('activity_disclaimer', prefix));
    } else if (result.type === this.getType('personnel')) {
      labels.push(this.getLabel('personnel_disclaimer', prefix));
    } else if (result.type === this.getType('registration')) {
      labels.push(this.getLabel('registration_disclaimer', prefix));
    }

    if (labels.length > 0) {
      return labels.join(' ');
    }

    return null;
  }

  readableFormat(value) {
    if (value === 'csv') {
      return 'CSV';
    } else if (value === 'excel') {
      return 'Excel';
    }

    return value;
  }

  adaptLabels(result, adapted) {
    adapted.labels = {
      disclaimer: this.adaptDisclaimer(result, adapted),
    };

    return adapted;
  }

  configureLabels() {
    /* eslint-disable camelcase */
    this.constructor.setLabelKeySubstitutions({
      appearances__first: ['first_incident', 'appearances'],
      appearances__last: ['last_incident', 'appearances'],
    });
    /* eslint-enable camelcase */
  }
}

module.exports = Source;
