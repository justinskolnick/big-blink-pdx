const {
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  static associations = {
    [ROLE_ENTITY]: null,
    [ROLE_LOBBYIST]: null,
    [ROLE_OFFICIAL]: null,
    [ROLE_SOURCE]: null,
  };

  static getAssociation(role) {
    return this.associations[role];
  }

  static getAssociationLabelKey(association) {
    return `associated_${association}`;
  }

  static getValueLabelKey(role, association) {
    return `as_${role}_${association}`;
  }

  static getValueLabel(role, key, labelPrefix) {
    const labelKey = this.getValueLabelKey(role, key);

    return this.labels.getLabel(labelKey, labelPrefix);
  }

  static adaptRecord(record) {
    return record;
  }

  static toAssociationObject(association, type) {
    const labelKey = this.getAssociationLabelKey(association);

    return {
      label: this.labels.getLabel(labelKey),
      model: association,
      options: this.roles,
      type,
      values: [],
    };
  }

  // todo: sort by limit
  static getValuesLinks(key, total) {
    let links = null;

    if (total > 5) {
      links = {};

      if (total > 10) {
        links.top = {
          label: this.labels.getLabel('view_top_limit', null, {
            limit: 10,
          }),
          params: {
            limit: 10,
          },
        };
      }

      links.all = {
        label: this.labels.getLabel('view_total_items', null, {
          items: this.labels.getLabel(key),
          total,
        }),
        params: {
          limit: total,
        },
      };
    }

    return links;
  }

  static toValuesObject(key, values, role, labelPrefix) {
    return {
      association: this.getAssociation(values.role),
      label: this.getValueLabel(role, key, labelPrefix),
      records: values.records.map(record => this.adaptRecord(record)),
      role: values.role,
      links: this.getValuesLinks(key, values.total),
      total: values.total,
    };
  }
}

module.exports = AssociatedItem;
