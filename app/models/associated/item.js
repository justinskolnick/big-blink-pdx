const pluralize = require('pluralize');

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

  static getValuesLinks(key, total) {
    const labelKey = pluralize(key, total);

    const links = {
      intro: null,
      options: null,
      total: {
        label: this.labels.getLabel('total_items', null, {
          items: this.labels.getLabel(labelKey),
          total,
        }),
      },
    };
    const limits = [];
    let options = [];

    if (total > 10) {
      limits.push(10);
    }

    if (total > 5) {
      limits.push(5);
      limits.push(total);
    }

    options = limits.sort((a, b) => a - b).map(limit => {
      if (limit === total) {
        return {
          label: this.labels.getLabel('all'),
          params: {
            limit,
          },
        };
      }

      return {
        label: `${limit}`,
        params: {
          limit,
        },
      };
    });

    if (options.length) {
      links.intro = {
        label: this.labels.getLabel('view'),
      };
      links.options = options;
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
