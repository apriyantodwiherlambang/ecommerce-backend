import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      '*', // atau ganti dengan domain yang diizinkan
      'https://6a1c-66-96-225-191.ngrok-free.app',
    ], // Sesuaikan jika perlu dibatasi
  },
})
@Injectable()
export class PaymentGateway {
  @WebSocketServer()
  server: Server;

  sendPaymentStatusUpdate(data: { orderId: string; status: string }) {
    this.server.emit('payment-status', data); // event: 'payment-status'
  }
}
