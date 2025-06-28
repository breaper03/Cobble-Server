import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './app/users/auth/jwt.strategy';
import { UsersModule } from './app/users/users.module';
import { PokemonModule } from './app/cobblemon/pokemon/pokemon.module';

@Module({
  imports: [UsersModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
