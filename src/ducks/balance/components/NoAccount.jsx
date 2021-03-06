import React, { memo } from 'react'
import { flowRight as compose } from 'lodash'
import { translate, withBreakpoints } from 'cozy-ui/react'
import Bouton from 'cozy-ui/react/Button'
import HeaderTitle from 'ducks/balance/components/HeaderTitle'
import AddAccountLink from 'ducks/settings/AddAccountLink'
import { Container, Content } from 'components/VerticalBox'

import styles from './NoAccount.styl'

const NoAccount = ({ lang, t, breakpoints: { isMobile } }) => {
  const timelineImg = require(`./timeline_${isMobile ? 'mobile' : 'desktop'}_${
    lang === 'fr' ? 'fr' : 'en'
  }.svg`)
  const contentProps = isMobile ? { center: true } : { bottom: true }
  return (
    <Container className={styles.NoAccount}>
      <Content {...contentProps}>
        <HeaderTitle balance={0} subtitle={t('Accounts.no_account')} />
      </Content>
      <div className={styles.NoAccount_bottom}>
        <div className={styles.NoAccount_chart} />
        <img src={timelineImg} alt="" className={styles.NoAccount_timeline} />
      </div>
      <AddAccountLink>
        <Bouton
          theme="highlight"
          icon="plus"
          size="large"
          className={styles.NoAccount_addButton}
          label={t('Accounts.add_bank')}
        />
      </AddAccountLink>
    </Container>
  )
}

export default compose(
  translate(),
  withBreakpoints(),
  memo
)(NoAccount)
