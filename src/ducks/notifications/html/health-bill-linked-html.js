const keyBy = require('lodash/keyBy')
const templates = require('./templates')
const { mjml2html } = require('mjml')
const { prepareTransactions } = require('./utils')

export default ({ accounts, transactions, bills, urls }) => {
  const accountsById = keyBy(accounts, '_id')
  const billsById = keyBy(bills, '_id')
  const transactionsByAccounts = prepareTransactions(transactions)

  const data = {
    accounts: accountsById,
    byAccounts: transactionsByAccounts,
    bills: billsById,
    date: new Date(),
    ...urls
  }

  const obj = mjml2html(templates['health-bill-linked'](data))
  obj.errors.forEach(err => {
    // eslint-disable-next-line no-console
    console.warn(err.formattedMessage)
  })

  if (obj.html) {
    return obj.html
  } else {
    throw new Error('Error during HTML generation')
  }
}
