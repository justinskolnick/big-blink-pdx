import { ReactNode, RefObject } from 'react';

export type ClassNames = string | boolean | undefined;

export type Id = number;

export type Ids = Id[];

type KeyLabel = {
  key: string;
  label: string;
};

type KeyLabelValue = KeyLabel & {
  key: string;
  label: string;
  value?: string;
  values?: [];
};

export type GenericObject = Record<string, string>;

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

type SectionLinks = {
  section: {
    label: string;
    path: string;
  };
  detail?: {
    label: string;
    path: string;
  };
}

export type Slug = Sections | string;

export type SectionType = {
  id?: number;
  slug: Slug;
  subtitle?: string;
  title?: string;
  links?: SectionLinks;
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

export type IncidentObjectAttendee = {
  as?: string;
  person: PersonPayload | PersonIdObject;
  total?: number;
};
export type Attendee = IncidentObjectAttendee;

export type AttendeeGroup = {
  label: string;
  records: IncidentObjectAttendee[];
  role?: Role;
  total: number;
}

type Details = {
  description?: string;
  domain?: string;
};

export type IncidentObjectAttendeeGroup = {
  records: IncidentObjectAttendee[];
  role?: Exclude<Role, Role.Entity | Role.Source>;
};

export type IncidentObjectAttendees = {
  lobbyists: IncidentObjectAttendeeGroup;
  officials: IncidentObjectAttendeeGroup;
};

export type IncidentObject = {
  attendees?: IncidentObjectAttendees;
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
  details?: Details;
  links?: LinkObject;
  raw: {
    dateStart: string;
    dateEnd?: string;
    officials: string;
    lobbyists: string;
  };
};

type IncidentPayloadAttendee = {
  as?: string;
  person: PersonPayload;
  total?: number;
};

export type IncidentPayloadAttendeeGroup = {
  records: IncidentPayloadAttendee[];
  role?: Exclude<Role, Role.Entity | Role.Source>;
};

export type IncidentPayloadAttendees = {
  lobbyists: IncidentPayloadAttendeeGroup;
  officials: IncidentPayloadAttendeeGroup;
};

export type IncidentPayload = Omit<IncidentObject, 'attendees'> & {
  attendees: IncidentPayloadAttendees;
}

export type Incident = IncidentObject;

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
  options: GenericObject;
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

type LeaderboardTableLabels = {
  column: LeaderboardColumnLabels;
  title: string;
};

type LeaderboardValuesLabels = {
  links: AssociatedLinksObject;
  subtitle: string;
  table: LeaderboardTableLabels;
  title: string;
};

export type LeaderboardSet = {
  ids: Ids;
  labels: LeaderboardValuesLabels;
  links: AssociatedLinksObject;
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
  stats?: IncidentsStats;
};

type IncidentPayloadRecords = {
  pagination: Pagination;
  records: IncidentPayload[];
};

type IncidentPagination = {
  pagination: Pagination;
};

export type IncidentsPayloadsObject = IncidentsOverview & IncidentPayloadRecords;
export type IncidentsIdsObject = IncidentsOverview & IncidentPagination & {
  ids?: number[];
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

export type ItemTableLabels = LeaderboardTableLabels;

export type ItemRegistrations = {
  isRegistered: boolean;
  labels: {
    statement?: string;
    title: string;
  };
};

export type EntityObject = {
  id: Id;
  name: string;
  details?: Details;
  domain?: string;
  incidents?: IncidentsIdsObject;
  registrations?: ItemRegistrations;
  overview?: ItemOverview;
  roles?: EntityObjectRoles;
  type: 'entity';
  links?: LinkObject;
};

type EntityIdObject = Pick<EntityObject, 'id'>;

export type EntityPayload = Omit<EntityObject, 'incidents' | 'roles'> & {
  incidents: IncidentPayloadRecords;
  roles?: EntityPayloadRoles;
}

export enum Role {
  Entity = 'entity',
  Lobbyist = 'lobbyist',
  Official = 'official',
  Source = 'source',
}

export type AffiliatedEntityObjectRecord = {
  entity: EntityIdObject;
  lobbyist: ItemRegistrations & {
    id: Id;
  };
  total?: number;
};

export type AffiliatedEntityPayloadRecord = Omit<AffiliatedEntityObjectRecord, 'entity'> & {
  entity: EntityPayload;
};

export type AffiliatedPersonObjectRecord = {
  person: PersonIdObject;
  registrations?: string;
  total?: number;
};

export type AffiliatedPersonPayloadRecord = Omit<AffiliatedPersonObjectRecord, 'person'> & {
  person: PersonPayload;
};

export type AffiliatedEntityObjectValue = {
  records: AffiliatedEntityObjectRecord[];
  role?: Role;
  total: number;
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
  options: Role[];
};

type AssociatedLabeledLink = {
  label: string;
};

export type AssociatedLabeledLinkOption = AssociatedLabeledLink & {
  params: {
    limit: number;
  };
};

type AssociatedLinkMore = AssociatedLabeledLink & {
  path: string;
};

export type AssociatedLinksObject = {
  intro?: AssociatedLabeledLink;
  limit?: {
    label: string;
    value: number;
  };
  more?: AssociatedLinkMore;
  options?: AssociatedLabeledLinkOption[];
  total: AssociatedLabeledLink;
};

type AssociatedItemValue = {
  label: string;
  links?: AssociatedLinksObject;
  role: Role;
  total: number;
};

export type AssociatedPersonsObjectValue = AssociatedItemValue & {
  association: 'lobbyists' | 'officials';
  records: AffiliatedPersonObjectRecord[];
};

export type AssociatedPersonsPayloadValue = Omit<AssociatedPersonsObjectValue, 'records'> & {
  records: AffiliatedPersonPayloadRecord[];
};

export type AssociatedPersonsObject = AssociatedItem & {
  type: 'person';
  values: AssociatedPersonsObjectValue[];
};

type AssociatedPersonsPayload = Omit<AssociatedPersonsObject, 'values'> & {
  values: AssociatedPersonsPayloadValue[];
};

type AssociatedEntitiesObjectValue = AssociatedItemValue & {
  association: 'entities';
  records: AffiliatedEntityObjectRecord[];
};

export type AssociatedEntitiesPayloadValue = Omit<AssociatedEntitiesObjectValue, 'records'> & {
  records: AffiliatedEntityPayloadRecord[];
};

export type AssociatedEntitiesObject = AssociatedItem & {
  type: 'entity';
  values: AssociatedEntitiesObjectValue[];
};

type AssociatedEntitiesPayload = Omit<AssociatedEntitiesObject, 'values'> & {
  values: AssociatedEntitiesPayloadValue[];
};

type NamedRoleBase = {
  label: string;
  role: Role;
  filterRole: boolean;
};

type ObjectNamedRoleWithAttendees = NamedRoleBase & {
  attendees: AssociatedPersonsObject;
};

type ObjectNamedRoleWithEntities = NamedRoleBase & {
  entities: AssociatedEntitiesObject;
};

type PayloadNamedRoleWithAttendees = Omit<ObjectNamedRoleWithAttendees, 'attendees'> & {
  attendees: AssociatedPersonsPayload;
};

type PayloadNamedRoleWithEntities = Omit<ObjectNamedRoleWithEntities, 'entities'> & {
  entities: AssociatedEntitiesPayload;
};

type EntityObjectNamedRoles = {
  entity: ObjectNamedRoleWithAttendees & { entities: null; };
};

type PersonObjectNamedRoles = {
  lobbyist: ObjectNamedRoleWithAttendees & ObjectNamedRoleWithEntities;
  official: ObjectNamedRoleWithAttendees & ObjectNamedRoleWithEntities;
};

type SourceObjectNamedRoles = {
  source: ObjectNamedRoleWithAttendees & ObjectNamedRoleWithEntities;
};

export type ObjectNamedRoles =
  | EntityObjectNamedRoles
  | PersonObjectNamedRoles
  | SourceObjectNamedRoles;

type EntityPayloadNamedRoles = {
  entity: PayloadNamedRoleWithAttendees & { entities: null; };
};

export type PersonPayloadNamedRoles = {
  lobbyist: PayloadNamedRoleWithAttendees & PayloadNamedRoleWithEntities;
  official: PayloadNamedRoleWithAttendees & PayloadNamedRoleWithEntities;
};

export type SourcePayloadNamedRoles = {
  source: PayloadNamedRoleWithAttendees & PayloadNamedRoleWithEntities;
};

export type PayloadNamedRoles =
  | EntityPayloadNamedRoles
  | PersonPayloadNamedRoles
  | SourcePayloadNamedRoles;

type EntityRoleOptions = {
  entity: boolean;
};

type PersonRoleOptions = {
  lobbyist: boolean;
  official: boolean;
};

type SourceRoleOptions = {
  source: boolean;
};

export type RoleOptions =
  | EntityRoleOptions
  | PersonRoleOptions
  | SourceRoleOptions;

type ItemRolesBase = {
  label: string;
  list: Role[];
  options: RoleOptions;
};

export type EntityObjectRoles = ItemRolesBase & {
  named: EntityObjectNamedRoles;
};

export type PersonObjectRoles = ItemRolesBase & {
  named: PersonObjectNamedRoles;
};

export type SourceObjectRoles = ItemRolesBase & {
  named: SourceObjectNamedRoles;
};

export type EntityPayloadRoles = Omit<EntityObjectRoles, 'named'> & {
  named: EntityPayloadNamedRoles;
};

export type PersonPayloadRoles = Omit<PersonObjectRoles, 'named'> & {
  named: PersonPayloadNamedRoles;
};

export type SourcePayloadRoles = Omit<SourceObjectRoles, 'named'> & {
  named: SourcePayloadNamedRoles;
};

export type PersonObject = {
  id: Id;
  name: string;
  pernr?: number;
  roles?: PersonObjectRoles;
  type: 'group' | 'person' | 'unknown';
  details?: Details;
  incidents?: IncidentsIdsObject;
  officialPositions?: PersonOfficialPosition[];
  overview?: ItemOverview;
  links?: LinkObject;
};

export type PersonIdObject = Pick<PersonObject, 'id'>;

export type PersonPayload = Omit<PersonObject, 'incidents' | 'roles'> & {
  incidents: IncidentPayloadRecords;
  roles?: PersonPayloadRoles;
}

export enum DataFormat {
  csv = 'csv',
  excel = 'excel',
}


export type SourceType = 'activity' | 'personnel' | 'registration';
export type SourceTypeObject = Record<SourceType, KeyLabel>;

export type SourceObject = {
  id: number;
  type: SourceType;
  title: string;
  format: DataFormat;
  quarter?: number;
  year: number;
  publicUrl?: string;
  isViaPublicRecords: boolean;
  retrievedDate: string;
  roles?: SourceObjectRoles;
  incidents?: IncidentsIdsObject;
  details?: Details;
  overview?: ItemOverview;
  labels: {
    disclaimer: string;
  };
  links?: LinkObject;
};

type SourceIdObject = Pick<SourceObject, 'id'>;

export type Source = SourceObject | SourceIdObject;

export type SourcePayload = Omit<SourceObject, 'incidents' | 'roles'> & {
  incidents: IncidentPayloadRecords;
  roles?: SourcePayloadRoles;
}

export type Sources = Source[];

export type SourcesByYear = {
  year: SourceObject['year'];
  items: SourceObject[];
};
export type SourcesByType = {
  type: SourceType;
  years: Record<SourceObject['year'], SourcesByYear>;
};

export type ItemObject = EntityObject | IncidentObject | PersonObject | SourceObject;

type Error = {
  customMessage?: string | TrustedHTML;
  message: string;
  status?: number;
};

export type ErrorType = Error;
export type MessageType = Error;
export type WarningType = Error;

export type AlertType =
  | ErrorType
  | MessageType
  | WarningType;

export type MetaType = {
  description?: string;
  errors: ErrorType[];
  page?: number;
  pageTitle?: string;
  section?: SectionType;
  warnings: WarningType[];
  view?: {
    section: string;
  };
};

export type RefElement = HTMLElement | HTMLDivElement | null;
export type Ref = RefObject<RefElement>;

export interface Fn {
  (): void;
}

export interface FnDelay {
  (delay?: number): void;
}

export interface FnRef {
  (ref: Ref): void;
}

export interface FnRefBoolean {
  (ref: Ref): boolean;
}

export interface FnRefDelay {
  (ref: Ref, delay?: number): void;
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
