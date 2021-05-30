import { Factory, Seeder } from 'typeorm-seeding';
import { Admin } from 'src/admin/admin.entity';

export default class CreateAdminData implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Admin)().createMany(1);
  }
}
