import { useReducer } from "react"
import DigitButton from "./DigitButton"

import OperationButton from "./OperationButton"
import "./style.css"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.current === "0") {
        return state
      }
      if (payload.digit === "." && state.current.includes(".")) {
        return state
      }

      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.current == null && state.previous
         == null) {
        return state
      }

      if (state.current == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previous
         == null) {
        return {
          ...state,
          operation: payload.operation,
          previous
          : state.current,
          current: null,
        }
      }

      return {
        ...state,
        previous
        : evaluate(state),
        operation: payload.operation,
        current: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current: null,
        }
      }
      if (state.current == null) return state
      if (state.current.length === 1) {
        return { ...state, current: null }
      }

      return {
        ...state,
        current: state.current.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.current == null ||
        state.previous
         == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previous
        : null,
        operation: null,
        current: evaluate(state),
      }
  }
}

function evaluate({ current, previous
  , operation }) {
  const prev = parseFloat(previous
    )
  const current1 = parseFloat(current)
  if (isNaN(prev) || isNaN(current1)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current1
      break
    case "-":
      computation = prev - current1
      break
    case "*":
      computation = prev * current1
      break
    case "÷":
      computation = prev / current1
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ current, previous
    , operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previous
            )} {operation}
        </div>
        <div className="current-operand">{formatOperand(current)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}

export default App