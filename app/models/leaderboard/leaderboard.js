const { titleCase } = require('../../lib/string');

const Labels = require('../shared/labels');

class Leaderboard {
  static labelPrefix = 'leaderboard';

  static {
    this.labels = new Labels();
  }

  static getLabel(key, prefix = '', values) {
    return this.labels.getLabel(key, prefix, values);
  }

  static getDescription(values = {}) {
    const { periodIsValid } = values;

    const description = periodIsValid ? 'description_period' : 'description_since';

    return this.getLabel(description, 'leaderboard', values);
  }

  static getSectionLabels(values = {}) {
    return {
      title: this.getLabel('title', this.labelPrefix),
      period: values.period,
      description: this.getDescription(values),
      filters: {
        intro: this.getLabel('intro', this.labelPrefix),
      },
    };
  }

  static getValuesForGroup(items, incidentCount, labels) {
    const {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
      linkSubset,
    } = labels;

    return {
      ids: items.map(item => item.id),
      labels: {
        title: titleGroup,
        subtitle: this.getLabel('ranking_group', this.labelPrefix, { group: subtitleGroup }),
        table: {
          title: this.getLabel('ranking_most_active', this.labelPrefix, { group: members }),
          column: {
            name: this.getLabel('ranking_member_name', this.labelPrefix, { member }),
            total: this.getLabel('ranking_member_total', this.labelPrefix, { member }),
            percentage: this.getLabel('ranking_share_of_incidents', this.labelPrefix, { incidentCount }),
          },
        },
        links: {
          more: this.getLabel(linkSubset ? 'view_full_list_with_subset' : 'view_full_list', this.labelPrefix, {
            subset: linkSubset,
            group: linkGroup,
          }),
        },
      },
    };
  }

  static getValuesForEntities(items, incidentCount) {
    const member = this.getLabel('entity');
    const members = this.getLabel('entities');
    const titleGroup = titleCase(members);
    const subtitleGroup = titleCase(members);
    const linkGroup = members;

    const values = this.getValuesForGroup(items, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
    });

    return values;
  }

  static getValuesForLobbyists(items, incidentCount) {
    const member = this.getLabel('lobbyist');
    const members = this.getLabel('lobbyists');
    const titleGroup = titleCase(members);
    const subtitleGroup = titleCase(members);
    const linkGroup = this.getLabel('people');
    const linkSubset = members;

    const values = this.getValuesForGroup(items, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
      linkSubset,
    });

    return values;
  }

  static getValuesForOfficials(items, incidentCount) {
    const member = this.getLabel('official');
    const members = this.getLabel('officials');
    const titleGroup = titleCase(this.getLabel('officials_city'));
    const subtitleGroup = this.getLabel('officials_city_portland');
    const linkGroup = this.getLabel('people');
    const linkSubset = members;

    const values = this.getValuesForGroup(items, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
      linkSubset,
    });

    values.labels.table.title = this.getLabel('ranking_most_lobbied', this.labelPrefix);

    return values;
  }
}

module.exports = Leaderboard;
