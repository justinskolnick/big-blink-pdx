const { MODEL_PEOPLE } = require('../../config/constants');

const Base = require('../shared/base');
const Person = require('./person');

const adaptItemPerson = item => {
  const person = new Person(item.person);

  item.person = person.adapted;

  return item;
};

class PersonAttendee extends Base {
  // todo: set records role
  static toRoleObject(role, attendees) {
    const obj = {
      label: Person.getLabel('associated_names'),
      model: MODEL_PEOPLE,
      type: 'person',
      values: [],
    };

    Object.entries(attendees).forEach(([key, values]) => {
      if (values?.records.length) {
        obj.values.push({
          label: Person.getLabel(`as_${role}_${key}`, Person.labelPrefix),
          records: values.records.map(adaptItemPerson),
          role: values.role,
          total: values.total,
        });
      }
    });

    return obj;
  }
}

module.exports = PersonAttendee;
