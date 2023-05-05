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

  constructor(options: ExceptionParams) {
    for (const key in options) this[key] = options[key];
  }

  public static fromOptions(options: ExceptionParams) {
    return new SocketException(options);
  }
}

export default SocketException;
