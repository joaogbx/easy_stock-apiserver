import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyModule } from 'src/company/company.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [UserModule, AuthModule, CompanyModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
