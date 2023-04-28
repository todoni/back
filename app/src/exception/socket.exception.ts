interface ExceptionParams {
  status: number;
  message: string;
  event?: string;
  stack?: string;
}

class SocketException {
  status: number;
  message: string;
  event?: string;

  // constructor
}

export default SocketException;
