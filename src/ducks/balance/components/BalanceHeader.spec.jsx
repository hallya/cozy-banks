/* global mount */

import React from 'react'
import { Figure } from 'components/Figure'
import { DumbBalanceHeader } from './BalanceHeader'

jest.mock('components/KonnectorUpdateInfo', () => () => null)

describe('Balance header', () => {
  let root
  it('should call onClickBalance when clicking on the Figure', () => {
    const onClickBalance = jest.fn()
    const accounts = [{ _id: 'b123' }, { _id: 'b456' }]
    root = mount(
      <DumbBalanceHeader
        accountsBalance={1000}
        t={x => x}
        breakpoints={{ isMobile: true }}
        onClickBalance={onClickBalance}
        accounts={accounts}
      />
    )
    const fig = root.find(Figure)
    fig.simulate('click')
    expect(onClickBalance).toHaveBeenCalled()
  })
})
