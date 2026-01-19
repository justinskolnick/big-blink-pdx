const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  static parentClass = null;
  static childClass = null;
  static associationType = null;
  static associatedWith = null;

  static associations = {
    [ROLE_LOBBYIST]: null,
    [ROLE_OFFICIAL]: null,
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

  static adaptRecord(record) {
    return record;
  }

  static toAssociationObject() {
    const labelKey = this.getAssociationLabelKey(this.associationType || this.parentClass.plural());

    return {
      label: this.labels.getLabel(labelKey),
      model: this.parentClass.plural(),
      type: this.associatedWith || this.parentClass.singular(),
      values: [],
    };
  }

  static toValuesObject(key, values, role) {
    const labelKey = this.getValueLabelKey(role, key);

    return {
      association: this.getAssociation(values.role),
      label: this.labels.getLabel(labelKey, this.childClass.singular()),
      records: values.records.map(this.adaptRecord),
      role: values.role,
      total: values.total,
    };
  }
}

module.exports = AssociatedItem;
