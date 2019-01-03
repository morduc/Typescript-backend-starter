export interface UserDB {
  id: string,
  username: string,
  password: string,
  appType: string,
  affiliation?: {
      id: string,
      name: string
  },
  organisation?: {
      id: string,
      name: string
  },
  salt: string
}