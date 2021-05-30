import { Factory, Seeder } from 'typeorm-seeding';
import { Activity } from 'src/diary/activity/activity.entity';
import { Tag } from 'src/diary/tag/tag.entity';
import { Connection } from 'typeorm';

export default class CreateDiaryData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // create activities
    const activities = await factory(Activity)().createMany(200);

    // create tags
    const allTags = activities.reduce(
      (previousValue, currentValue) => [...previousValue, ...currentValue.tags],
      [],
    );
    const tags = [...new Set(allTags)];
    await Promise.all(tags.map((tag) => connection.mongoManager.save(new Tag({ name: tag }))));

    // create index
    await connection.mongoManager.createCollectionIndex(Activity, {
      content: 'text',
      tags: 'text',
    });
  }
}
