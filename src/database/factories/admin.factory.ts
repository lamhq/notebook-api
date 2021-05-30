import { define } from 'typeorm-seeding';
import { Admin } from 'src/admin/admin.entity';

define(Admin, () => {
  const user = new Admin({
    email: 'notebook@mailinator.com',
    password: '$2b$09$O34HrfLEU7hc0fkCBcQFjOYziBaZnaJxaiYOpz/QqLcttSSXagyn6',
    displayName: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return user;
});
