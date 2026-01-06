import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyModule } from 'src/company/company.module';
import { ProductModule } from 'src/product/product.module';
import { StockModule } from 'src/stock/stock.module';
import { DashBoardModule } from 'src/dashboard/dashboard.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CompanyModule,
    ProductModule,
    StockModule,
    DashBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
