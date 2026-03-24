const pluralize = require('pluralize');

const {
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  associations = {
    [ROLE_ENTITY]: null,
    [ROLE_LOBBYIST]: null,
    [ROLE_OFFICIAL]: null,
    [ROLE_SOURCE]: null,
  };

  associatedModel = null;

  roles = [];

  setAssociatedModel(associatedModel) {
    this.associatedModel = associatedModel;
  }

  getAssociation(role) {
    return this.associations[role];
  }

  getAssociationLabelKey(association) {
    return `associated_${association}`;
  }

  getValueLabelKey(role, association) {
    return `as_${role}_${association}`;
  }

  getValueLabel(role, key, labelPrefix) {
    const labelKey = this.getValueLabelKey(role, key);

    return this.getLabel(labelKey, labelPrefix);
  }

  adaptRecord(record) {
    return record;
  }

  getLinksLimits(total, includeTotalLink = false) {
    const limits = [];

    if (total > 10) {
      limits.push(10);
    }

    if (total > 5) {
      limits.push(5);

      if (includeTotalLink) {
        limits.push(total);
      }
    }

    return limits;
  }

  getOptionsLinks(limits, total) {
    return limits.sort((a, b) => a - b).map(limit => {
      if (limit === total) {
        return {
          label: this.getLabel('all'),
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
  }

  getLinks(key, total) {
    const labelKey = pluralize(key, total);

    const links = {
      intro: null,
      options: null,
      total: {
        label: this.getLabel('total_items', null, {
          items: this.getLabel(labelKey),
          total,
        }),
      },
    };

    const limits = this.getLinksLimits(total, true);
    const options = this.getOptionsLinks(limits, total);

    if (options.length) {
      links.intro = {
        label: this.getLabel('view'),
      };
      links.options = options;
    }

    return links;
  }

  toValuesObject(key, values, role, labelPrefix) {
    return {
      association: this.getAssociation(values.role),
      label: this.getValueLabel(role, key, labelPrefix),
      records: values.records.map(record => this.adaptRecord(record)),
      role: values.role,
      links: this.getLinks(key, values.total),
      total: values.total,
    };
  }

  toRoleObject(role, items, labelPrefix) {
    const association = this.associatedModel.plural();
    const type = this.associatedModel.singular();
    const labelKey = this.getAssociationLabelKey(association);

    return {
      label: this.getLabel(labelKey),
      options: this.roles,
      type,
      values: this.getRoleValues(role, items, labelPrefix),
    };
  }
}

module.exports = AssociatedItem;
