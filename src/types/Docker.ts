/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------
 */
export type Containers = Container[]
export const DockerAction = {
  stop: 'STOP',
  start: 'START',
  restart: 'RESTART',
  delete: 'DELETE',
} as const
export type DockerAction = (typeof DockerAction)[keyof typeof DockerAction]

/* ------------------------------------------------------------
 * Container Inspect (Detailed Information)
 * ------------------------------------------------------------
 */
export interface ContainerInspectResponse {
  Id: string
  Created?: string
  Path: string
  Args: string[]
  State?: ContainerState
  Image: string
  ResolvConfPath: string
  HostnamePath: string
  HostsPath: string
  LogPath?: string
  Name: string
  RestartCount: number
  Driver: string
  Platform: string
  ImageManifestDescriptor?: OciDescriptor
  MountLabel: string
  ProcessLabel: string
  AppArmorProfile: string
  ExecIDs?: string[]
  HostConfig: HostConfigDetailed
  GraphDriver: DriverData
  SizeRw?: number
  SizeRootFs?: number
  Mounts: MountPoint[]
  Config: ContainerConfig
  NetworkSettings: NetworkSettingsDetailed
}

export interface ContainerState {
  Status: string
  Running: boolean
  Paused: boolean
  Restarting: boolean
  OOMKilled: boolean
  Dead: boolean
  Pid: number
  ExitCode: number
  Error: string
  StartedAt: string
  FinishedAt: string
  Health?: Health
}

export interface Health {
  Status: string
  FailingStreak: number
  Log: HealthLog[]
}

export interface HealthLog {
  Start: string
  End: string
  ExitCode: number
  Output: string
}

export interface OciDescriptor {
  mediaType?: string
  digest?: string
  size?: number
  urls?: string[]
  annotations?: any
  data?: any
  platform?: Platform
  artifactType?: any
}

export interface Platform {
  architecture: string
  os: string
  'os.version'?: string
  'os.features'?: string[]
  variant?: string
}

export interface HostConfigDetailed {
  Binds?: string[]
  ContainerIDFile?: string
  LogConfig?: LogConfig
  NetworkMode?: string
  PortBindings?: any
  RestartPolicy?: RestartPolicy
  AutoRemove?: boolean
  VolumeDriver?: string
  VolumesFrom?: string[]
  Mounts?: MountDetailed[]
  ConsoleSize?: number[]
  Annotations?: any
  CpuShares?: number
  Memory?: number
  MemorySwap?: number
  MemoryReservation?: number
  MemorySwappiness?: number
  NanoCpus?: number
  CgroupParent?: string
  BlkioWeight?: number
  BlkioWeightDevice?: ThrottleDevice[]
  BlkioDeviceReadBps?: ThrottleDevice[]
  BlkioDeviceWriteBps?: ThrottleDevice[]
  BlkioDeviceReadIOps?: ThrottleDevice[]
  BlkioDeviceWriteIOps?: ThrottleDevice[]
  CpuPeriod?: number
  CpuQuota?: number
  CpuRealtimePeriod?: number
  CpuRealtimeRuntime?: number
  CpusetCpus?: string
  CpusetMems?: string
  Devices?: DeviceMapping[]
  DeviceCgroupRules?: string[]
  DeviceRequests?: DeviceRequest[]
  KernelMemoryTCP?: number
  OomKillDisable?: boolean
  Init?: boolean
  PidsLimit?: number
  Ulimits?: Ulimit[]
  CpuCount?: number
  CpuPercent?: number
  IOMaximumIOps?: number
  IOMaximumBandwidth?: number
  CapAdd?: string[]
  CapDrop?: string[]
  CgroupnsMode?: string
  Dns?: string[]
  DnsOptions?: string[]
  DnsSearch?: string[]
  ExtraHosts?: string[]
  GroupAdd?: string[]
  IpcMode?: string
  Cgroup?: string
  Links?: string[]
  OomScoreAdj?: number
  PidMode?: string
  Privileged?: boolean
  PublishAllPorts?: boolean
  ReadonlyRootfs?: boolean
  SecurityOpt?: string[]
  StorageOpt?: any
  Tmpfs?: any
  UTSMode?: string
  UsernsMode?: string
  ShmSize?: number
  Sysctls?: any
  Runtime?: string
  Isolation?: string
  MaskedPaths?: string[]
  ReadonlyPaths?: string[]
}

export interface LogConfig {
  Type: string
  Config?: any
}

export interface RestartPolicy {
  Name: string
  MaximumRetryCount: number
}

export interface MountDetailed {
  Target: string
  Source?: string
  Type: string
  ReadOnly?: boolean
  Consistency?: string
  BindOptions?: BindOptions
  VolumeOptions?: VolumeOptions
  TmpfsOptions?: TmpfsOptions
}

export interface BindOptions {
  Propagation?: string
  NonRecursive?: boolean
  CreateMountpoint?: boolean
  ReadOnlyNonRecursive?: boolean
  ReadOnlyForceRecursive?: boolean
}

export interface VolumeOptions {
  NoCopy?: boolean
  Labels?: any
  DriverConfig?: DriverConfig
  Subpath?: string
}

export interface DriverConfig {
  Name: string
  Options?: any
}

export interface TmpfsOptions {
  SizeBytes?: number
  Mode?: number
  Options?: string[]
}

export interface ThrottleDevice {
  Path: string
  Rate: number
}

export interface DeviceMapping {
  PathOnHost: string
  PathInContainer: string
  CgroupPermissions: string
}

export interface DeviceRequest {
  Driver?: string
  Count?: number
  DeviceIDs?: string[]
  Capabilities?: string[][]
  Options?: any
}

export interface Ulimit {
  Name: string
  Soft: number
  Hard: number
}

export interface DriverData {
  Name: string
  Data?: any
}

export interface MountPoint {
  Type?: string
  Name?: string
  Source?: string
  Destination: string
  Driver?: string
  Mode?: string
  RW: boolean
  Propagation?: string
}

export interface ContainerConfig {
  Hostname?: string
  Domainname?: string
  User?: string
  AttachStdin?: boolean
  AttachStdout?: boolean
  AttachStderr?: boolean
  ExposedPorts?: any
  Tty?: boolean
  OpenStdin?: boolean
  StdinOnce?: boolean
  Env?: string[]
  Cmd?: string[]
  Healthcheck?: HealthConfig
  ArgsEscaped?: boolean
  Image: string
  Volumes?: any
  WorkingDir?: string
  Entrypoint?: string[]
  NetworkDisabled?: boolean
  MacAddress?: string
  OnBuild?: string[]
  Labels?: any
  StopSignal?: string
  StopTimeout?: number
  Shell?: string[]
}

export interface HealthConfig {
  Test?: string[]
  Interval?: number
  Timeout?: number
  Retries?: number
  StartPeriod?: number
  StartInterval?: number
}

export interface NetworkSettingsDetailed {
  Bridge?: string
  SandboxID?: string
  HairpinMode?: boolean
  LinkLocalIPv6Address?: string
  LinkLocalIPv6PrefixLen?: number
  Ports?: any
  SandboxKey?: string
  SecondaryIPAddresses?: Address[]
  SecondaryIPv6Addresses?: Address[]
  EndpointID?: string
  Gateway?: string
  GlobalIPv6Address?: string
  GlobalIPv6PrefixLen?: number
  IPAddress?: string
  IPPrefixLen?: number
  IPv6Gateway?: string
  MacAddress?: string
  Networks?: any
}

export interface Address {
  Addr: string
  PrefixLen: number
}

/* ------------------------------------------------------------
 * Images
 * ------------------------------------------------------------
 */

/* ------------------------------------------------------------
 * Containers
 * ------------------------------------------------------------
 */
export interface Container {
  Id: string
  Names: string[]
  Image: string
  ImageID: string
  Command: string
  Created: number
  Ports: Port[]
  Labels: Labels
  State: string
  Status: string
  HostConfig: HostConfig
  NetworkSettings: NetworkSettings
  Mounts: Mount[]
}

export interface Port {
  IP?: string
  PrivatePort: number
  PublicPort?: number
  Type: string
}

export interface Labels {
  'io.portainer.agent'?: string
  'com.docker.desktop.extension.api.version'?: string
  'com.docker.desktop.extension.icon'?: string
  'com.docker.extension.additional-urls'?: string
  'com.docker.extension.detailed-description'?: string
  'com.docker.extension.publisher-url'?: string
  'com.docker.extension.screenshots'?: string
  'io.portainer.server'?: string
  'org.opencontainers.image.description'?: string
  'org.opencontainers.image.title'?: string
  'org.opencontainers.image.vendor'?: string
}

export interface HostConfig {
  NetworkMode: string
}

export interface NetworkSettings {
  Networks: Networks
}

export interface Networks {
  bridge: Bridge
}

export interface Bridge {
  IPAMConfig: any
  Links: any
  Aliases: any
  MacAddress: string
  DriverOpts: any
  NetworkID: string
  EndpointID: string
  Gateway: string
  IPAddress: string
  IPPrefixLen: number
  IPv6Gateway: string
  GlobalIPv6Address: string
  GlobalIPv6PrefixLen: number
  DNSNames: any
}

export interface Mount {
  Type: string
  Source: string
  Destination: string
  Mode: string
  RW: boolean
  Propagation: string
  Name?: string
  Driver?: string
}

/* ------------------------------------------------------------
 * Docker Version
 * ------------------------------------------------------------
 */
export interface DockerVersion {
  Platform: Platform
  Components: Component[]
  Version: string
  ApiVersion: string
  MinAPIVersion: string
  GitCommit: string
  GoVersion: string
  Os: string
  Arch: string
  KernelVersion: string
  BuildTime: string
}

export interface Platform {
  Name: string
}

export interface Component {
  Name: string
  Version: string
  Details: Details
}

export interface Details {
  ApiVersion?: string
  Arch?: string
  BuildTime?: string
  Experimental?: string
  GitCommit: string
  GoVersion?: string
  KernelVersion?: string
  MinAPIVersion?: string
  Os?: string
}

/* ------------------------------------------------------------
 * Volumes
 * ------------------------------------------------------------
 */
export interface Volume {
  Volumes: Volume[]
  Warnings: any
}

export interface Volume {
  CreatedAt: string
  Driver: string
  Labels?: Labels
  Mountpoint: string
  Name: string
  Options: any
  Scope: string
}

export interface Labels {
  'com.docker.compose.project'?: string
  'com.docker.compose.version'?: string
  'com.docker.compose.volume'?: string
  'com.docker.volume.anonymous'?: string
}

/* ------------------------------------------------------------
 * Schemas
 * ------------------------------------------------------------
 */
export interface ContainerSchema extends Partial<Container> {}
export interface DockerVersionSchema extends Partial<DockerVersion> {}
