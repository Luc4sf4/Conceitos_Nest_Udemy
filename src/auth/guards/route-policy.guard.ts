import { RoutePolicies } from './../enum/route-policies.enum';
/* eslint-disable @typescript-eslint/require-await */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROUTE_POLICY_KEY } from '../auth.constants';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const RoutePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    console.log(RoutePolicyRequired);
    return true;
  }
}
