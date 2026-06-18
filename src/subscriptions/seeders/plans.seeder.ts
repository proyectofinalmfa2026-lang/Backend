import { DataSource } from 'typeorm';
import { Plan } from '../entities/plan.entity';

export const seedPlans = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Plan);

  const plans = [
    { name: 'free',    price: 0,    interval: 'month' },
    { name: 'premium', price: 4.99, interval: 'month' },
  ];

  for (const plan of plans) {
    const exists = await repo.findOneBy({ name: plan.name });
    if (!exists) {
      await repo.save(repo.create(plan));
      console.log(`✅ Plan "${plan.name}" creado`);
    } else {
      console.log(`⏭️  Plan "${plan.name}" ya existe, skipping`);
    }
  }
};