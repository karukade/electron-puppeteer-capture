export const errCodes = {
  INIT_CHROMIUM_ERROR: "INIT_CHROMIUM_ERROR",
}

type ErrorType = Error & {
  code?: string
  message?: string
}

const errHandlers = {
  [errCodes.INIT_CHROMIUM_ERROR]() {
    console.error("INIT_CHROMIUM_ERROR")
  },
}

const onUnhandledError = (err: ErrorType) => {
  if (err.code) {
    if (errHandlers[err.code]) {
      errHandlers[err.code]
      return
    }
  }

  if (err.message) {
    if (errHandlers[err.message]) {
      errHandlers[err.message]
      return
    }
  }

  throw err
}

export const addErrorHandler = () => {
  process.on("unhandledRejection", (e) => onUnhandledError(e as ErrorType))
  process.on("uncaughtException", (e) => onUnhandledError(e as ErrorType))
}
