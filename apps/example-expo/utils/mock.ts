import { faker } from '@faker-js/faker'

export const generateMockComment = () => ({
  username: faker.internet.username(),
  text: faker.lorem.sentence(),
  color: faker.color.rgb(),
})
