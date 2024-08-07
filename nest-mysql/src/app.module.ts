import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import config from './ormconfig';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database connection is successful');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
}
