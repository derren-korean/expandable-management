export class Device {
  constructor(
    public id: string,
    public name: string,
    public serialNumber: string,
    public location: string,
    public terminalNumber: string,
    public category: string
  ) { }

  getLastSerialNumber(): string {
    return this.category === 'ETD' ? this.serialNumber.split("-").pop() : this.serialNumber;
  }
}
