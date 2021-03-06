const { operationsFilters } = require('./operationsFilters')
const { findNeighboringOperations } = require('./findNeighboringOperations')
const { sortedOperations } = require('./helpers')
const { log, formatOperationLog, formatBillLog } = require('../../utils')

const findOperation = (bill, options, allOperations) => {
  // By default, a bill is an expense. If it is not, it should be
  // declared as a refund: isRefund=true.
  if (options.credit && !bill.isRefund) return
  return findNeighboringOperations(bill, options, allOperations).then(
    operations => {
      log(
        'debug',
        `Found ${
          operations.length
        } neighboring operations for bill ${formatBillLog(bill)}`
      )

      operations.forEach(operation => {
        log('debug', formatOperationLog(operation))
      })

      operations = operationsFilters(bill, operations, options)

      log(
        'debug',
        `${
          operations.length
        } operations left after filtering for bill ${formatBillLog(bill)}`
      )

      operations.forEach(operation => {
        log('debug', formatOperationLog(operation))
      })

      operations = sortedOperations(bill, operations)

      const selectedOperation = operations[0]

      if (selectedOperation) {
        log(
          'debug',
          `Selected operation ${formatOperationLog(
            selectedOperation
          )} for bill ${formatBillLog(bill)}`
        )
      }

      return selectedOperation
    }
  )
}

const findDebitOperation = findOperation
const findCreditOperation = (bill, options, allOperations) => {
  const creditOptions = Object.assign({}, options, { credit: true })
  return findOperation(bill, creditOptions, allOperations)
}

module.exports = {
  findDebitOperation,
  findCreditOperation
}
