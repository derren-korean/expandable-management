import { Device } from './device.model';

export class GroupedDevice {
  constructor(
    public section: string,
    public devices: Device[]
  ) { }
}