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
  attendees: Attendees;
};

export type IncidentFirstOrLast = Pick<Incident, 'id' | 'contactDate'>;

export type Incidents = Incident[];

export type IncidentsFilters = {
  quarter?: string;
  with_entity_id?: Id;
  with_person_id?: Id;
};

export enum SortByValue {
  Name = 'name',
  Total = 'total',
}

export type NewParams = IncidentsFilters & {
  page?: string | number;
  sort_by?: SortByValue;
};

export type IncidentsOverview = {
  filters?: IncidentsFilters;
  first?: IncidentFirstOrLast;
  last?: IncidentFirstOrLast;
  percentage: string;
  total: number;
};

export type IncidentRecords = {
  records: Incidents;
};

type IncidentPagination = {
  pagination: Pagination;
};

type Location = {
  id: Id;
  city: string;
  region: string;
};

export type Entity = Item & {
  incidents?: IncidentsOverview & WithIds & IncidentPagination;
  attendees?: Attendees;
  locations?: Location[];
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
  total?: number;
};

type Interest = {
  category: string;
  topic: string;
};

export type AffiliatedItem = {
  entity?: Item;
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
}

export type SourceWithIncidentRecords = Source & {
  incidents: IncidentsOverview & IncidentRecords & IncidentPagination;
}

export type Sources = Source[];

export type Attendee = {
  as?: string;
  person: Person;
  total?: number;
}

export type Attendees = {
  lobbyists: Attendee[];
  officials: Attendee[];
}

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
