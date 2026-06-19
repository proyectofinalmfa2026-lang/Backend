import { Controller, Post, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}


@Post('subscribe')
subscribe(@Req() req) {
  return this.subscriptionsService.subscribe(req.user.id, req.user.email);
}

@Post('subscribe/stripe')
subscribeStripe(@Req() req) {
  return this.subscriptionsService.subscribeWithStripe(
    req.user.id,
    req.user.email,
    req.user.name ?? req.user.email,
  );
}

@Get('my-subscription')
getMySubscription(@Req() req) {
  return this.subscriptionsService.getMySubscription(req.user.id);
}

@Delete('cancel')
cancel(@Req() req) {
  return this.subscriptionsService.cancelSubscription(req.user.id);
}

@Post('confirm/:preapprovalId')
confirm(@Param('preapprovalId') preapprovalId: string) {
  return this.subscriptionsService.confirmSubscription(preapprovalId);
}
}