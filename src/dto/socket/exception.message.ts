enum ExceptionMessage {
  REQUIRED_PARAM = '필수 인자값이 누락되었습니다.',
  MISSING_PARAM = '필요한 입력값이 누락되었습니다.',
  NOT_FOUND = '존재하지 않는 데이터입니다.',
  INTERNAL_ERROR = '알 수 없는 오류입니다.',
  UNAUTHORIZED = '인증에 실패하였습니다.',
  FORBIDDEN = '접근 권한이 없습니다.',
  DUPLICATED = '중복된 데이터입니다.',
  SELF_ASSIGNMENT = '자기 자신에게 수행할 수 없습니다.',
  GAME_START_ERROR = '게임 시작 중 문제가 발생하였습니다.',
  GAME_STARTED = '게임중인 방에 참여할 수 없습니다.',
}

export default ExceptionMessage;
