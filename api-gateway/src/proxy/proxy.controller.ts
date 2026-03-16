import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import axios from 'axios';

const SERVICES = {
  location: process.env.LOCATION_SERVICE_URL ?? 'http://location-service:3001',
  rides: process.env.RIDE_SERVICE_URL ?? 'http://ride-service:3002',
  notifications:
    process.env.NOTIFICATION_SERVICE_URL ?? 'http://notification-service:3003',
};

@Controller()
export class ProxyController {
  @All(['/location', '/location/*path'])
  @UseGuards(JwtAuthGuard)
  async proxyLocation(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res, SERVICES.location);
  }

  @All(['/rides', '/rides/*path'])
  @UseGuards(JwtAuthGuard)
  async proxyRides(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res, SERVICES.rides);
  }

  @All(['/notifications', '/notifications/*path'])
  @UseGuards(JwtAuthGuard)
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res, SERVICES.notifications);
  }

  private async proxy(req: Request, res: Response, serviceUrl: string) {
    try {
      const url = `${serviceUrl}${req.path}`;
      const response = await axios({
        method: req.method as any,
        url,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
        const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: 'Service unavailable' };
      return res.status(status).json(data);
    }
  }
}
