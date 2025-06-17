import { DockerAction } from '@/types/Docker'

export const parseAction = (action: DockerAction) => {
  switch (action) {
    case DockerAction.stop:
      return 'Stopping container'
    case DockerAction.start:
      return 'Starting container'
    case DockerAction.restart:
      return 'Restarting container'
    case DockerAction.delete:
      return 'Deleting container'
  }
}
