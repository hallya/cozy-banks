import Notification from './Notification'
import { isHealthExpense } from '../categories/helpers'
import { cozyClient } from 'cozy-konnector-libs'
import htmlTemplate from './html/health-bill-linked-html'
import { BILLS_DOCTYPE } from 'doctypes'
import * as utils from './html/utils'

const ACCOUNT_SEL = '.js-account'
const DATE_SEL = '.js-date'
const TRANSACTION_SEL = '.js-transaction'

const toText = cozyHTMLEmail => {
  const getTextTransactionRow = $row =>
    $row.find('td')
      .map((i, td) =>
        $row.find(td).text().trim())
      .toArray()
      .join(' ')
      .replace(/\n/g, '')
      .replace(' €', '€')
      .trim()

  const getContent = $ =>
    $([ACCOUNT_SEL, DATE_SEL, TRANSACTION_SEL].join(', '))
      .toArray().map(node => {
        const $node = $(node)
        if ($node.is(ACCOUNT_SEL)) {
          return '\n\n### ' + $node.text()
        } else if ($node.is(DATE_SEL)) {
          return '\n' + $node.text() + '\n'
        } else if ($node.is(TRANSACTION_SEL)) {
          return '- ' + getTextTransactionRow($node)
        }
      }).join('\n')
  return utils.toText(cozyHTMLEmail, getContent)
}

class HealthBillLinked extends Notification {
  constructor (config) {
    super(config)

    this.data = config.data
  }

  buildNotification ({ accounts, transactions }) {
    const transactionsWithReimbursements = transactions.filter(
      transaction => isHealthExpense(transaction) && transaction.reimbursements && transaction.reimbursements.length > 0
    )

    if (transactionsWithReimbursements.length === 0) {
      return
    }

    const billsPromises = []

    transactionsWithReimbursements.forEach(transaction => {
      transaction.reimbursements.forEach(reimbursement => {
        const [, billId] = reimbursement.billId.split(':')
        billsPromises.push(cozyClient.data.find(BILLS_DOCTYPE, billId))
      })
    })

    return Promise.all(billsPromises)
      .then(bills => {
        const templateData = {
          accounts: accounts,
          transactions: transactionsWithReimbursements,
          bills: bills
        }

        const htmlContent = htmlTemplate(templateData)

        return {
          reference: 'health_bill_linked',
          title: 'Nouveaux remboursements de santé',
          content: toText(htmlContent)
        }
      })
  }

  async sendNotification () {
    if (!this.data) { return }

    const attributes = await this.buildNotification(this.data)

    return cozyClient.fetchJSON('POST', '/notifications', {
      data: {
        type: 'io.cozy.notifications',
        attributes: attributes
      }
    })
  }
}

export default HealthBillLinked