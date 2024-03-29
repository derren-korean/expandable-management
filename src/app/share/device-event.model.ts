export enum EventType {
  supply = 'SUPPLY',
  failure = 'FAILURE'
}

// todo : user로 넘어갈것.
enum WorkingGroup {
  a = 'A',
  b = 'B',
  c = 'C',
  f = 'FullTimeWorker'
}

/* 
  eventType: 타입별로 쿼리,
  createdDate: 생성날짜와 함께해서 쿼리,
  deviceCategory: 카테고리별 쿼리
*/

export class DeviceEvent {
  constructor(
    public id: string,
    public type: EventType,
    public terminalNumber: string,
    public deviceCategory: string,
    public deviceName: string,
    public stockName: string,
    public createdDate: Date,
    public serialNumber: string,
    public location: string
    //group: WorkingGroup,
    //userId: string
  ) { }
}