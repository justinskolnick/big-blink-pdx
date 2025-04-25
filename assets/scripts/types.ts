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

type SortByValue = Extract<SortByValues, string>;

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

type DatesParams = {
  date_on?: string;
  date_range_from?: string;
  date_range_to?: string;
};

type EntitiesParams = {
  with_entity_id?: Id;
};

type PaginationParams = {
  page?: string | number;
};

type PeopleParams = {
  with_person_id?: Id;
};

type QuarterParams = {
  quarter?: string;
};

type SortParams = {
  sort?: SortValue;
  sort_by?: SortByValue;
};

export type NewParams = DatesParams & EntitiesParams & PaginationParams & PeopleParams & QuarterParams & SortParams;

type IncidentsFilterStringValue = string;
export type IncidentFiltersDatesActionValue = 'date-select' | 'date-range-select';

export type IncidentFilterLabelId = {
  type: 'id';
  value: Id;
};
type IncidentFilterLabelLabel = {
  type: 'label';
  value: IncidentsFilterStringValue;
};
type IncidentFilterLabelLink = {
  action: IncidentFiltersDatesActionValue;
  to: string;
  type: 'link';
  value: IncidentsFilterStringValue;
};
type IncidentFilterLabelText = {
  type: 'text';
  value: IncidentsFilterStringValue;
};
export type IncidentFilterDateField = {
  name: 'date_on' | 'date_range_from' | 'date_range_to';
  type: 'input-date';
  value?: IncidentsFilterStringValue;
};
export type IncidentFilterLabel = IncidentFilterLabelId | IncidentFilterLabelLabel | IncidentFilterLabelLink | IncidentFilterLabelText | IncidentFilterDateField;

export type IncidentDateFilterLabel = IncidentFilterLabelLabel | IncidentFilterLabelLink | IncidentFilterLabelText;
type IncidentDateFilterFieldLabel = IncidentFilterDateField | IncidentFilterLabelText;
export type IncidentModelIdFilterLabel = IncidentFilterLabelId | IncidentFilterLabelText;


type IncidentFiltersDates = {
  fields: Record<IncidentFiltersDatesActionValue, IncidentDateFilterFieldLabel[]> | undefined;
  labels: IncidentDateFilterLabel[];
  model: undefined;
  values?: DatesParams;
};
type IncidentFiltersEntities = {
  fields: undefined;
  labels: IncidentModelIdFilterLabel[];
  model: Sections.Entities;
  values: EntitiesParams;
};
type IncidentFiltersPeople = {
  fields: undefined;
  labels: IncidentModelIdFilterLabel[];
  model: Sections.People;
  values: PeopleParams;
};
type IncidentFiltersQuarter = {
  fields: undefined;
  labels: IncidentFilterLabel[];
  model: undefined;
  values: QuarterParams;
};

export type IncidentFilters = {
  dates: IncidentFiltersDates;
  entities?: IncidentFiltersEntities;
  people?: IncidentFiltersPeople;
  quarter?: IncidentFiltersQuarter;
};
export type IncidentFiltersKeys = keyof IncidentFilters;
export type IncidentsFilterObjects = IncidentFilters[IncidentFiltersKeys];

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
  filters?: IncidentFilters;
  stats: IncidentsStats;
};

export type IncidentRecords = {
  records: Incidents;
};

type IncidentPagination = {
  pagination: Pagination;
};

export type ItemOverview = {
  label: string;
  appearances?: {
    label: string;
    values?: {
      first?: IncidentsStatsValue;
      last?: IncidentsStatsValue;
    };
  };
  totals?: {
    label: string;
    values?: {
      percentage?: IncidentsPercentageValue;
      total?: IncidentsTotalValue;
    };
  };
};

export type Entity = Item & {
  attendees?: Attendees;
  domain?: string;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  isRegistered?: boolean;
  overview?: ItemOverview;
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
  overview?: ItemOverview;
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
  overview?: ItemOverview;
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
