import { define } from 'typeorm-seeding';
import { Activity } from 'src/diary/activity/activity.entity';

define(Activity, (faker) => {
  const activity = new Activity({
    content: faker.lorem.sentence(5),
    income: faker.random.number(1000),
    outcome: faker.random.number(1000),
    time: faker.date.past(),
    tags: [
      ...new Set(
        new Array(faker.random.number(5)).fill(null).map(() => faker.random.word().toLowerCase()),
      ),
    ],
  });
  return activity;
});
