export interface Santri {
  id?: string;
  name: string
  class : string
  status : string
  generation : number 
  deposit?: number
  debt?: debt[] 
  total?: number 
  history?:details[]
}

export interface debt {
  id?: string;
  amount: number 
  info: string 
}

export interface details {
  id?: string;
  santriId: number
  date: string
  amount: number
  item: string
}
