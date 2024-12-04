import { ReactNode } from 'react';

export type Id = number;

export type Ids = Id[];

type WithIds = {
  ids: number[];
};

type Item = {
  id: number;
  name: string;
};

export type LocationState = {
  pathname: string;
  search: string;
};

export enum Sections {
  Entities = 'entities',
  Incidents = 'incidents',
  People = 'people',
  Sources = 'sources',
}

export type SectionType = {
  details?: string[];
  id?: number;
  slug?: string;
  subtitle?: string;
  title: string;
};

type PageObject = {
  label: string;
  link: LocationState;
  value: number;
}

type Pages = {
  last: PageObject;
  next?: PageObject;
  numbered: PageObject[];
  previous?: PageObject;
}

export type Pagination = {
  page: number;
  pageCount: number;
  pages: Pages;
  total: number;
}

export type Attendee = {
  as?: string;
  person: Person;
  total?: number;
}

export type AttendeeGroup = {
  label?: string;
  records: Attendee[];
}

export type Attendees = {
  label?: string;
  lobbyists: AttendeeGroup;
  officials: AttendeeGroup;
}

export type Incident = {
  category: string;
  contactDate: string;
  contactType: string;
  entity: string;
  entityId: number;
  id: number;
  lobbyists: string;
  officials: string;
  sourceId: number;
  topic: string;
  notes: string;
  attendees?: Attendees;
};

export type Incidents = Incident[];

export type IncidentsFilters = {
  quarter?: string;
  with_entity_id?: Id;
  with_person_id?: Id;
};

export enum SortValues {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SortValue = keyof typeof SortValues;

export enum SortByValues {
  Date = 'date',
  Name = 'name',
  Total = 'total',
}

export type SortByValue = Extract<SortByValues, string>;

type ListParams = {
  page?: string | number;
  sort?: SortValue;
  sort_by?: SortByValue;
};

export type NewParams = IncidentsFilters & ListParams;

type LeaderboardLinkLabels = {
  more: string;
};

type LeaderboardTableLabels = {
  title: string;
};

type LeaderboardLabels = {
  links: LeaderboardLinkLabels;
  subtitle: string;
  table: LeaderboardTableLabels;
  title: string;
};

export type LeaderboardSet = {
  ids: Ids;
  labels: LeaderboardLabels;
};

export type IncidentsStatsValue = {
  key: string;
  label: string;
  value: Incident;
};

type IncidentsPercentageValue = IncidentsStatsValue & {
  value: string;
};

type IncidentsTotalValue = IncidentsStatsValue & {
  value: number;
};

type IncidentStatsAppearances = {
  key: string;
  label: string;
  values: IncidentsStatsValue[];
};

type IncidentStatsTotals = {
  label: string;
  values: {
    percentage?: IncidentsPercentageValue;
    total: IncidentsTotalValue;
  };
};

type IncidentsStats = {
  appearances?: IncidentStatsAppearances;
  label: string;
  totals: IncidentStatsTotals;
};

export type IncidentsOverview = {
  filters?: IncidentsFilters;
  stats: IncidentsStats;
};

export type IncidentRecords = {
  records: Incidents;
};

type IncidentPagination = {
  pagination: Pagination;
};

export type Entity = Item & {
  attendees?: Attendees;
  domain?: string;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  isRegistered?: boolean;
}

export type EntityWithIncidentRecords = Entity & {
  incidents: IncidentsOverview & IncidentRecords & IncidentPagination;
}

export type Entities = Entity[];

export type PersonAttendees = {
  asLobbyist: Attendees;
  asOfficial: Attendees;
};

export type PersonEntity = {
  entity: Entity;
  isRegistered?: boolean;
  total?: number;
};

type Interest = {
  category: string;
  topic: string;
};

export type AffiliatedItem = {
  entity?: Pick<Entity, 'id' | 'name' | 'isRegistered'>;
  isRegistered?: boolean;
  registrations?: string;
  person?: Pick<Person, 'id' | 'name' | 'type'>;
  values?: Interest;
  total?: number;
};

export type PersonEntities = {
  asLobbyist: PersonEntity[];
  asOfficial: PersonEntity[];
};

export enum Role {
  Lobbyist = 'lobbyist',
  Official = 'official',
}

export type Person = Item & {
  roles?: Role[];
  type: 'group' | 'person' | 'unknown';
  attendees?: PersonAttendees;
  entities?: PersonEntities;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
}

export type PersonWithIncidentRecords = Person & {
  incidents: IncidentsOverview & IncidentRecords & IncidentPagination;
}

export type People = Person[];

export enum DataFormat {
  csv = 'CSV'
}

type DataFormatStrings = keyof typeof DataFormat;

export type Source = {
  id: number;
  type: 'activity' | 'registration';
  title: string;
  format: DataFormatStrings;
  quarter: number;
  year: number;
  publicUrl: string;
  retrievedDate: string;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  attendees?: Attendees;
  entities?: AffiliatedItem[];
}

export type SourceWithIncidentRecords = Source & {
  incidents: IncidentsOverview & IncidentRecords & IncidentPagination;
}

export type Sources = Source[];

export type ErrorType = {
  customMessage?: string;
  message: string
  status?: number;
}

export type MessageType = {
  customMessage?: string;
  message: string
  status?: number;
}

export type WarningType = {
  customMessage?: string;
  message: string
  status?: number;
}

export type AlertType = ErrorType | MessageType | WarningType;

export type MetaType = {
  description?: string;
  errors?: ErrorType[];
  page?: number;
  pageTitle?: string;
  section?: SectionType;
  warnings?: WarningType[];
  view?: {
    section: string;
  };
};

export interface OutletContext {
  className?: string;
  label?: string;
  pagination?: Pagination;
  path: string;
  incidentIds?: number[];
}

export interface ChildContainerProps {
  children: ReactNode;
}
