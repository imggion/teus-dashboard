import { z } from 'zod'

type Service = {
  id: string
  name: string
  link: string | null
  icon: string
}

const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string().nullable(),
  icon: z.string().default('play'),
})

export interface ServicesSchema extends Partial<Service> {}
export interface ServicePayload extends Partial<z.infer<typeof ServiceSchema>> {}
