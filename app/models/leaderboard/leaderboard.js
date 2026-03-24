const { Labels } = require('../../helpers/labels');
const { links } = require('../../helpers/links');

const { titleCase } = require('../../lib/string');

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
        intro: this.getLabel('filter_intro', this.labelPrefix),
      },
    };
  }

  static getLinksLimits(total, includeTotalLink = false) {
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

  static getOptionsLinks(limits, total) {
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

  static getLinks(items, total, labels, paths) {
    const max = 10;
    const min = 5;
    const limit = items.length < max ? max : min;

    const {
      linkGroup,
      linkSubset,
    } = labels;

    const links = {
      limit: {
        label: this.getLabel('view_top_limit', this.labelPrefix, {
          limit,
        }),
        params: {
          limit,
        },
      },
      more: {
        label: this.getLabel(linkSubset ? 'view_full_list_with_subset' : 'view_full_list', this.labelPrefix, {
          subset: linkSubset,
          group: linkGroup,
        }),
        path: paths.more,
      },
      total: {
        label: this.getLabel('total_items', null, {
          items: linkSubset || linkGroup,
          total,
        }),
      },
    };

    const limits = this.getLinksLimits(total, false);
    const options = this.getOptionsLinks(limits, total);

    if (options.length) {
      links.intro = {
        label: this.getLabel('view'),
      };
      links.options = options;
    }

    return links;
  }

  static getValuesForGroup(items, total, incidentCount, labels, paths) {
    const {
      member,
      members,
      titleGroup,
      subtitleGroup,
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
      },
      links: this.getLinks(items, total, labels, paths),
    };
  }

  static getValuesForEntities(items, total, incidentCount) {
    const member = this.getLabel('entity');
    const members = this.getLabel('entities');
    const titleGroup = titleCase(members);
    const subtitleGroup = titleCase(members);
    const linkGroup = members;

    const values = this.getValuesForGroup(items, total, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
    }, {
      more: links.entities(),
    });

    return values;
  }

  static getValuesForLobbyists(items, total, incidentCount) {
    const member = this.getLabel('lobbyist');
    const members = this.getLabel('lobbyists');
    const titleGroup = titleCase(members);
    const subtitleGroup = titleCase(members);
    const linkGroup = this.getLabel('people');
    const linkSubset = members;

    const values = this.getValuesForGroup(items, total, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
      linkSubset,
    }, {
      more: links.people(),
    });

    return values;
  }

  static getValuesForOfficials(items, total, incidentCount) {
    const member = this.getLabel('official');
    const members = this.getLabel('officials');
    const titleGroup = titleCase(this.getLabel('officials_city'));
    const subtitleGroup = this.getLabel('officials_city_portland');
    const linkGroup = this.getLabel('people');
    const linkSubset = members;

    const values = this.getValuesForGroup(items, total, incidentCount, {
      member,
      members,
      titleGroup,
      subtitleGroup,
      linkGroup,
      linkSubset,
    }, {
      more: links.people(),
    });

    values.labels.table.title = this.getLabel('ranking_most_lobbied', this.labelPrefix);

    return values;
  }
}

module.exports = Leaderboard;
