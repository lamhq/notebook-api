import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Activity } from 'src/diary/activity/activity.entity';
import { Admin } from 'src/admin/admin.entity';
import { Tag } from 'src/diary/tag/tag.entity';

export default class EmptyDatabase implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    try {
      await connection.manager.clear(Admin);
      await connection.manager.clear(Activity);
      await connection.manager.clear(Tag);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}
