/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------
 */
export type Containers = Container[]

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
