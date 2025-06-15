interface System {
  timestamp: string
  cpu_usage: number
  ram_usage: number
  total_ram: number
  free_ram: number
  used_swap: number
  disks: Disk[]
}

interface Disk {
  filesystem: string
  mount_point: string
  total_space: number
  available_space: number
  used_space: number
}

interface Network {
  interface: string
  addr: string
  prefix: number
}

interface MacAddress {
  interface: string
  mac: string
}

interface GenericSysinfo {
  hostname: string
  os: string
  uptime: string
  kernel_version: string
  ipv4: string
  networks: Network[]
  mac_addresses: MacAddress[]
}

export interface SystemSchema extends Partial<System> {}
export interface DiskSchema extends Partial<Disk> {}
export interface GenericSysinfoSchema extends Partial<GenericSysinfo> {}
