import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { updateDocument } from 'cozy-client'
import { withDispatch } from 'utils'
import { flowRight as compose } from 'lodash'

import { Media, Bd, Img } from 'components/Media'
import { Figure } from 'components/Figure'
import { getLabel } from 'ducks/transactions'

import CategoryIcon from 'ducks/categories/CategoryIcon'
import { getParentCategory, getCategoryName } from 'ducks/categories/categoriesMap'
import styles2 from 'ducks/transactions/Transactions.styl'
import TransactionActions from 'ducks/transactions/TransactionActions'
import { withUpdateCategory } from 'ducks/categories'

import styles from './ActionMenu.styl'

class Menu extends Component {
  render () {
    const { t, f, transaction, urls, onClose } = this.props
    const { showCategoryChoice } = this.props
    const category = getParentCategory(transaction.categoryId)

    return (
      <div className={styles['fil-actionmenu']}>
        <div className={classNames(styles['menu-header'], styles2['coz-table-cell'])}>
          <div className={styles['menu-header-left']}>
            <h3>{getLabel(transaction)}</h3>
            <span>{f(transaction.date, 'dddd DD MMMM - h[h]mm')}</span>
          </div>
          <div className={styles['menu-header-right']}>
            <Figure
              total={transaction.amount}
              currency={transaction.currency}
              signed
              coloredPositive
            />
          </div>
        </div>
        <hr className='u-mv-0' />
        <Media className='u-ph-1 u-pv-half' onClick={showCategoryChoice}>
          <Img style={{ height: '2rem' }}>
            <CategoryIcon category={category} />
          </Img>
          <Bd className='u-pl-1 u-ellipsis'>
            {t(`Data.subcategories.${getCategoryName(transaction.categoryId)}`)}
          </Bd>
        </Media>
        <hr />
        <TransactionActions onClose={onClose} transaction={transaction} urls={urls} />
      </div>
    )
  }
}

const updateCategory = (props, category) => {
  let { transaction } = props
  transaction.categoryId = category.id
  props.dispatch(updateDocument(transaction))
}

export default compose(
  withDispatch,
  withUpdateCategory({updateCategory, getCategoryId: ownProps => ownProps.transaction.categoryId}),
  translate()
)(Menu)
