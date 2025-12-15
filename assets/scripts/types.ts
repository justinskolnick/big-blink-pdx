import { ReactNode, RefObject } from 'react';
import type { UnknownAction } from '@reduxjs/toolkit';

export type Id = number;

export type Ids = Id[];

type KeyLabelValue = {
  key: string;
  label: string;
  value?: string;
  values?: [];
};

type WithIds = {
  ids: number[];
};

type Item = {
  id: number;
  name: string;
};

export type LocationPathname = string;

export type LocationState = {
  pathname: LocationPathname;
  search: string;
};

export enum Sections {
  Entities = 'entities',
  Incidents = 'incidents',
  People = 'people',
  Sources = 'sources',
}

export type SectionType = {
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

type LinkObject = {
  self: string;
};

export type Attendee = {
  as?: string;
  person: Pick<Person, 'id'>;
  total?: number;
}

export type AttendeeGroup = {
  label?: string;
  records: Attendee[];
  role?: Role;
  total: number;
}

export type Attendees = {
  label: string;
  model: Sections;
  type: 'entity' | 'person' | 'source';
  values: AttendeeGroup[];
}

type Details = {
  description?: string;
  domain?: string;
};

export type IncidentAttendees = {
  officials: AttendeeGroup;
  lobbyists: AttendeeGroup;
};

export type Incident = {
  category: string;
  contactDate: string;
  contactDateEnd?: string;
  contactDateRange?: string;
  contactTypes: string[];
  entity: string;
  entityId: number;
  id: number;
  lobbyists: string;
  officials: string;
  sourceId: number;
  topic: string;
  notes: string;
  attendees?: IncidentAttendees;
  details?: Details;
  links?: LinkObject;
  raw: {
    dateStart: string;
    dateEnd?: string;
    officials: string;
    lobbyists: string;
  };
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

export type PaginationParams = {
  page?: string | number;
};

type PeopleParams = {
  people?: Id | string | string[];
};
type PeopleFilterParams = {
  people?: string[];
};

type WithPersonParams = {
  with_person_id?: Id;
};

type QuarterParams = {
  quarter?: string;
};

type RoleParams = {
  role?: Role;
};

type YearParams = {
  quarter?: string;
};

type SortParams = {
  sort?: SortValue;
  sort_by?: SortByValue;
};

export type NewParams = DatesParams & EntitiesParams & PaginationParams & PeopleParams & QuarterParams & RoleParams & SortParams & WithPersonParams;
export type NewFilterParams = DatesParams & EntitiesParams & PeopleParams & QuarterParams & RoleParams & WithPersonParams;

export enum FiltersLabelTypes {
  Id = 'id',
  InputDate = 'input-date',
  Label = 'label',
  Link = 'link',
  Select = 'select',
  Text = 'text',
}

type FilterStringValue = string;

export type FiltersDatesActionValue = 'date-select' | 'date-range-select';

export type FiltersLabelId = {
  type: FiltersLabelTypes.Id;
  value: Id;
};
type FiltersLabelLabel = {
  type: FiltersLabelTypes.Label;
  value: FilterStringValue;
};
type FiltersLabelLink = {
  action: FiltersDatesActionValue;
  to: string;
  type: FiltersLabelTypes.Link;
  value: FilterStringValue;
};
type FiltersLabelText = {
  type: FiltersLabelTypes.Text;
  value: FilterStringValue;
};
export type FiltersDateField = {
  name: keyof DatesParams;
  type: FiltersLabelTypes.InputDate;
  value?: FilterStringValue;
};
export type FiltersSelectField = {
  name: string;
  options: Record<string, string>;
  type: FiltersLabelTypes.Select;
  value?: FilterStringValue;
};
export type FiltersLabel = FiltersLabelId | FiltersLabelLabel | FiltersLabelLink | FiltersLabelText | FiltersDateField | FiltersSelectField;

type DateFilterLabel = FiltersLabelLabel | FiltersLabelLink | FiltersLabelText;
type DateFilterFieldLabel = FiltersDateField | FiltersLabelText;
type ModelIdFilterLabel = FiltersLabelId | FiltersLabelText;

type FiltersDates = {
  fields: Record<FiltersDatesActionValue, DateFilterFieldLabel[]> | undefined;
  labels: DateFilterLabel[];
  model: undefined;
  values: DatesParams;
};

type FiltersEntities = {
  fields: undefined;
  labels: ModelIdFilterLabel[];
  model: Sections.Entities;
  values: EntitiesParams;
};

type FiltersWithPerson = {
  fields: undefined;
  labels: ModelIdFilterLabel[];
  model: Sections.People;
  values: WithPersonParams;
};

type FiltersWithPeople = {
  fields: undefined;
  labels: ModelIdFilterLabel[];
  model: Sections.People;
  values: PeopleFilterParams;
};

type FiltersQuarter = {
  fields: undefined;
  labels: FiltersLabel[];
  model: undefined;
  values: QuarterParams;
};

type FiltersRole = {
  fields: undefined;
  labels: FiltersLabel[];
  model: undefined;
  values: RoleParams;
};

type FiltersYear = {
  fields: undefined;
  labels: FiltersLabel[];
  model: undefined;
  values: YearParams;
};

export type Filters = {
  dates?: FiltersDates;
  entities?: FiltersEntities;
  people?: FiltersWithPeople | FiltersWithPerson;
  period?: FiltersQuarter | FiltersYear;
  quarter?: FiltersQuarter;
  role?: FiltersRole;
  year?: FiltersYear;
};

export type FiltersObjects = Filters[keyof Filters];

type LeaderboardColumnLabels = {
  name: string;
  total: string;
  percentage: string;
};

type LeaderboardLabels = {
  description: string;
  filters: {
    intro: string;
  };
  period: string;
  title: string;
};

type LeaderboardLinkLabels = {
  limit: {
    label: string;
    value: number;
  };
  more: string;
};

type LeaderboardTableLabels = {
  column: LeaderboardColumnLabels;
  title: string;
};

type LeaderboardValuesLabels = {
  links: LeaderboardLinkLabels;
  subtitle: string;
  table: LeaderboardTableLabels;
  title: string;
};

export type LeaderboardSet = {
  ids: Ids;
  labels: LeaderboardValuesLabels;
};

type LeaderboardValues = {
  entities?: LeaderboardSet;
  lobbyists?: LeaderboardSet;
  officials?: LeaderboardSet;
};

export type Leaderboard = {
  filters: Filters;
  labels: LeaderboardLabels;
  values: LeaderboardValues;
};

export type IncidentsStatsValue = KeyLabelValue & {
  value: Incident;
};

type IncidentsPercentageValue = KeyLabelValue & {
  value: string;
};

type IncidentsTotalValue = KeyLabelValue & {
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

type IncidentsOverview = {
  filters?: Filters;
  stats: IncidentsStats;
};

export type IncidentRecords = {
  records?: Incidents;
};

type IncidentPagination = {
  pagination: Pagination;
};

export type Incidented = IncidentsOverview & IncidentRecords & IncidentPagination;

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

export type ItemTableLabels = LeaderboardTableLabels;

export type Entity = Item & {
  attendees?: Attendees;
  details?: Details;
  domain?: string;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  isRegistered?: boolean;
  overview?: ItemOverview;
  links?: LinkObject;
}

export type EntityWithIncidentRecords = Entity & {
  incidents: Incidented;
}

export type Entities = Entity[];

export enum Role {
  Lobbyist = 'lobbyist',
  Official = 'official',
}

export type AffiliatedEntityRecord = {
  entity: Pick<Entity, 'id'>;
  isRegistered?: boolean;
  registrations?: string;
  total?: number;
};

export type AffiliatedPersonRecord = {
  person: Pick<Person, 'id'>;
  registrations?: string;
  total?: number;
};

export type AffiliatedEntityValue = {
  records: AffiliatedEntityRecord[];
  role?: Role;
  total: number;
};

export type AffiliatedEntityValues = AffiliatedEntityValue[];

export type PersonEntityRole = {
  label: string;
  model: Sections;
  role: Role;
  values: AffiliatedEntityValues;
};

export type PersonEntities = {
  roles: PersonEntityRole[];
};

type PersonAttendeesRole = Attendees & {
  role: Role;
};

export type PersonAttendees = {
  roles: PersonAttendeesRole[];
};

export type PersonOfficialPosition = {
  dates: {
    start: string;
    end: string;
  };
  role: string;
};

type AssociatedItem = {
  label: string;
  model: Sections;
};

type AssociatedItemValue = {
  label: string;
  role: Role;
  total: number;
};

export type AssociatedPersonsValue = AssociatedItemValue & {
  association: 'lobbyists' | 'officials';
  records: AffiliatedPersonRecord[];
};

export type AssociatedPersons = AssociatedItem & {
  type: 'person';
  values: AssociatedPersonsValue[];
};

export type AssociatedEntitiesValue = AssociatedItemValue & {
  association: 'entities';
  records: AffiliatedEntityRecord[];
};

export type AssociatedEntities = AssociatedItem & {
  type: 'entity';
  values: AssociatedEntitiesValue[];
};

type PersonNamedRole = {
  label: string;
  role: Role;
  attendees?: AssociatedPersons;
  entities?: AssociatedEntities;
};

export type PersonNamedRoles = {
  lobbyist?: PersonNamedRole;
  official?: PersonNamedRole;
};

type PersonRoleOptions = {
  lobbyist: boolean;
  official: boolean;
};

type PersonRoles = {
  label: string;
  list: Role[];
  named?: PersonNamedRoles;
  options?: PersonRoleOptions;
};

export type Person = Item & {
  pernr?: number;
  roles: PersonRoles;
  type: 'group' | 'person' | 'unknown';
  attendees?: PersonAttendees;
  details?: Details;
  entities?: PersonEntities;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  officialPositions?: PersonOfficialPosition[];
  overview?: ItemOverview;
  links?: LinkObject;
}

export type PersonWithIncidentRecords = Person & {
  incidents: Incidented;
}

export type People = Person[];

export enum DataFormat {
  csv = 'csv',
  excel = 'excel',
}

export type SourceTypeObject = Record<KeyLabelValue['key'], KeyLabelValue>;

export type SourceEntities = {
  label: string;
  model: Sections;
  values: AffiliatedEntityValues;
};

export type Source = {
  id: number;
  type: string;
  title: string;
  format: DataFormat;
  quarter?: number;
  year: number;
  publicUrl?: string;
  isViaPublicRecords: boolean;
  retrievedDate: string;
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  attendees?: Attendees;
  details?: Details;
  entities?: SourceEntities;
  overview?: ItemOverview;
  labels: {
    disclaimer: string;
  };
  links?: LinkObject;
};

export type SourceWithIncidentRecords = Source & {
  incidents: Incidented;
}

export type Sources = Source[];

export type SourcesByYear = {
  year: Source['year'];
  items: Source[];
};
export type SourcesByType = {
  type: Source['type'];
  years: Record<Source['year'], SourcesByYear>;
};

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

export interface Fn {
  (): void;
}

export interface FnDelay {
  (delay?: number): void;
}

export interface FnRef {
  (ref: RefObject<HTMLElement>): void;
}

export interface FnRefDelay {
  (ref: RefObject<HTMLElement>, delay?: number): void;
}

export interface MiddlewareHandlerFn {
  (store: any, action: UnknownAction): void;
}

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
