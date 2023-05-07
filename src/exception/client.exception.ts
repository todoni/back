import { HttpException } from '@nestjs/common';

class ClientException extends HttpException {
  navigate?: string;

  constructor(message: string, status: number, navigate?: string) {
    super(message, status);
    this.navigate = navigate;
  }
}

export default ClientException;
