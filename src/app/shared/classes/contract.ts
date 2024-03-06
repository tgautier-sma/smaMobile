export interface Geo {
  lat?: string;
  lng?: string;
}

export interface Address {
  city?: string;
  country?: string;
  geo?: Geo;
  streetA?: string;
  streetB?: string;
  zipcode?: string;
}

export interface Contract {
  accountId?: string;
  activity?: string;
  address?: Address;
  comment?: string;
  email?: string;
  iban?: string;
  jobTitle?: string;
  name?: string;
  phone?: string;
  price?: string;
  registeredAt?: string;
}
