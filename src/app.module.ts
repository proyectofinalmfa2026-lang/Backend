import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WatchlistsModule } from './watchlists/watchlists.module';
import { MoviesModule } from './movies/movies.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FollowersModule } from './followers/followers.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule,
    UsersModule,
    ReviewsModule,
    CloudinaryModule,
    WatchlistsModule,
    MoviesModule,
    CommentsModule,
    LikesModule,
    NotificationsModule,
    FollowersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    
    LikesModule,
    MailModule,
  ],
})
export class AppModule {}