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
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AiModule } from './ai/ai.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';

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
    ConversationsModule,
    RealtimeModule,
    AiModule,
    AdminModule,
    SubscriptionsModule,
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
    MessagesModule,
  ],
})
export class AppModule {}