import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { runSeeders } from 'typeorm-extension';

@Command(<{ name: string; description: string }>{
  name: 'seed',
  description: 'Seed database with data',
})
export class SeedCommand extends CommandRunner {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async run(): Promise<void> {
    await runSeeders(this.dataSource, {
      seeds: ['src/**/database/seeders/**/*{.ts,.js}'],
      factories: ['src/**/database/factories/**/*{.ts,.js}'],
    });
    console.log('Database seeded successfully!');
  }
}
