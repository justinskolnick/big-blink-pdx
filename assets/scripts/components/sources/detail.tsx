import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Group } from '../detail-activity-associations';
import ActivityOverview from '../detail-activity-overview';
import AffiliatedEntitiesTable from '../affiliated-entities-table';
import AffiliatedPeopleTable from '../affiliated-people-table';
import Chart from './chart';
import Incidents from '../detail-incidents';
import IncidentsFetcher from '../detail-incidents-fetcher';
import IncidentsTrigger from './detail-incidents-trigger';
import ItemDetail from '../item-detail';
import MetaSection from '../meta-section';
import SourceInformationBox from '../source-information-box';

import { FnGetQueryByType } from '../detail-activity-associations';

import { iconName as entitiesIconName } from '../entities/icon';
import { iconName as peopleIconName } from '../people/icon';

import useLimitedQuery, { FnSetLimit, FnSetPaused } from '../../hooks/use-limited-query';

import { useGetSourceById } from '../../reducers/sources';

import api from '../../services/api';

import type {
  AffiliatedEntityValue,
  AttendeeGroup,
  Source,
} from '../../types';
import { Sections } from '../../types';

interface FnUseGetItemsByItem {
  (
    item: Source,
    type: 'attendees' | 'entities',
    isPaused: boolean,
  ): {
    initialLimit: number;
    setPaused: FnSetPaused;
    setRecordLimit: FnSetLimit;
  }
}

interface InitGroupProps {
  children: ReactNode;
  item: Source;
  type: 'attendees' | 'entities';
}

interface AssociationGroupProps {
  children: (initialLimit: number, setLimit: FnSetLimit) => ReactNode;
  item: Source;
  type: 'attendees' | 'entities';
  value: AttendeeGroup | AffiliatedEntityValue;
}

interface ItemProps {
  item: Source;
}

const getLabels = () => ({
  attendees: {
    title: 'Associated Names',
  },
  entities: {
    title: 'Associated Entities',
  },
});

const getQuery: FnGetQueryByType = (type) => {
  if (type === 'attendees') {
    return api.useLazyGetSourceAttendeesByIdQuery;
  } else if (type === 'entities') {
    return api.useLazyGetSourceEntitiesByIdQuery;
  }

  return null;
};

const useGetItemsByItem: FnUseGetItemsByItem = (item, type, isPaused) => {
  const query = getQuery(type);

  return useLimitedQuery(query, {
    id: item.id,
    limit: 5,
    pause: isPaused,
  });
};

const AssociationGroup = ({
  children,
  item,
  type,
  value
}: AssociationGroupProps) => {
  const {
    initialLimit,
    setPaused,
    setRecordLimit,
  } = useGetItemsByItem(item, type, true);

  const setLimit = () => {
    setPaused(false);
    setRecordLimit(value.total);
  };

  if (!value) return null;

  return children(initialLimit, setLimit);
};

const InitGroup = ({ item, type, children }: InitGroupProps) => {
  const [hasRun, setHasRun] = useState<boolean>(false);

  useGetItemsByItem(item, type, hasRun);

  useEffect(() => {
    setHasRun(true);
  }, [setHasRun]);

  return children;
};

const Attendees = ({ item }: ItemProps) => {
  const labels = getLabels();

  return (
    <Group title={labels.attendees.title} icon={peopleIconName}>
      {(ref) => (
        <InitGroup
          item={item}
          type='attendees'
        >
          {item.attendees?.values.map((value, i: number) => (
            <AssociationGroup
              item={item}
              type='attendees'
              value={value}
              key={i}
            >
              {(initialLimit, setLimit) => (
                <AffiliatedPeopleTable
                  attendees={value}
                  initialCount={initialLimit}
                  model={Sections.People}
                  ref={ref}
                  setLimit={setLimit}
                />
              )}
            </AssociationGroup>
          ))}
        </InitGroup>
      )}
    </Group>
  );
};

const Entities = ({ item }: ItemProps) => {
  const labels = getLabels();

  return (
    <Group title={labels.entities.title} icon={entitiesIconName}>
      {(ref) => (
        <InitGroup
          item={item}
          type='entities'
        >
          {item.entities?.values.map((value, i: number) => (
            <AssociationGroup
              item={item}
              type='entities'
              value={value}
              key={i}
            >
              {(initialLimit, setLimit) => (
                <AffiliatedEntitiesTable
                  entities={value}
                  initialCount={initialLimit}
                  model={Sections.Entities}
                  ref={ref}
                  setLimit={setLimit}
                />
              )}
            </AssociationGroup>
          ))}
        </InitGroup>
      )}
    </Group>
  );
};

const Detail = () => {
  const incidentsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const numericId = Number(id);

  const source = useGetSourceById(numericId);

  const hasSource = Boolean(source);
  const isActivity = source?.type === 'activity';

  const label = hasSource ? `${source.year} Q${source.quarter}` : null;

  if (!hasSource) return null;

  return (
    <ItemDetail>
      <MetaSection>
        <SourceInformationBox
          title='Source Information'
          source={source}
        />
      </MetaSection>

      <ActivityOverview
        overview={source.overview}
        ref={incidentsRef}
      >
        <Chart label={label} />
      </ActivityOverview>

      {isActivity && (
        <>
          <Entities item={source} />
          <Attendees item={source} />

          <IncidentsTrigger>
            {trigger => (
              <IncidentsFetcher
                id={source.id}
                ref={incidentsRef}
                trigger={trigger}
              >
                <Incidents
                  ids={source.incidents?.ids}
                  filters={source.incidents?.filters}
                  hasSort
                  label={source.title}
                  pagination={source.incidents?.pagination}
                  ref={incidentsRef}
                />
              </IncidentsFetcher>
            )}
          </IncidentsTrigger>
        </>
      )}
    </ItemDetail>
  );
};

export default Detail;
