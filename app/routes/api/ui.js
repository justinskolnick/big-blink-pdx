const createError = require('http-errors');
const express = require('express');

const { Labels } = require('../../helpers/labels');

const labels = new Labels();

const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  let data;

  try {
    data = {
      labels: {
        incidents: labels.getLabel('incidents'),
        incidentsItemCategory: labels.getLabel('item_category', 'incidents'),
        incidentsItemDataSourceTitle: labels.getLabel('data_source_title', 'incidents'),
        incidentsItemDate: labels.getLabel('item_date', 'incidents'),
        incidentsItemDates: labels.getLabel('item_dates', 'incidents'),
        incidentsItemDetails: labels.getLabel('item_details', 'incidents'),
        incidentsItemEntity: labels.getLabel('item_entity', 'incidents'),
        incidentsItemLobbyists: labels.getLabel('item_lobbyists', 'incidents'),
        incidentsItemNotesTitle: labels.getLabel('notes_title', 'incidents'),
        incidentsItemOfficialAlias: labels.getLabel('item_official_alias', 'incidents'),
        incidentsItemOfficials: labels.getLabel('item_officials', 'incidents'),
        incidentsItemTopic: labels.getLabel('item_topic', 'incidents'),
        incidentsItemType: labels.getLabel('item_type', 'incidents'),
        incidentsItemTypes: labels.getLabel('item_types', 'incidents'),
        incidentsModalLinkTitle: labels.getLabel('modal_link', 'incidents'),
        incidentsModalTitle: labels.getLabel('modal_title', 'incidents'),
        overview: labels.getLabel('overview'),
        sortListByName: labels.getLabel('sort_list_by_name'),
        sortListByTitle: labels.getLabel('sort_list_by_title'),
        sourcesItemInformation: labels.getLabel('item_information', 'sources'),
        thisItem: labels.getLabel('this_item'),
      },
    };

    res.status(200).json({ data });
  } catch (err) {
    console.error('Error while getting overview:', err.message); // eslint-disable-line no-console
    next(createError(err));
  }
});

module.exports = router;
