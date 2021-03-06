jest.mock('cozy-flags')

import flag from 'cozy-flags'
import {
  getCategoryId,
  transactionsByCategory,
  LOCAL_MODEL_USAGE_THRESHOLD,
  GLOBAL_MODEL_USAGE_THRESHOLD
} from './helpers'

describe('transactionsByCategory', () => {
  const byCategory = transactionsByCategory([
    {
      manualCategoryId: '200110',
      automaticCategoryId: '200120',
      localCategoryId: '200130'
    }
  ])
  expect(Object.keys(byCategory).length).toBe(13)
  expect(byCategory.activities.id).toBe('400700')
  expect(byCategory.incomeCat.id).toBe('200100')
  expect(byCategory.incomeCat.transactions.length).toBe(1)
  expect(byCategory.incomeCat.subcategories['200110'].id).toBe('200110')
  expect(byCategory.incomeCat.subcategories['200110'].name).toBe(
    'activityIncome'
  )
})

describe('getCategoryId', () => {
  beforeEach(() => {
    flag.mockReturnValue(true)
  })

  it("Should return the manualCategoryId if there's one", () => {
    const transaction = {
      manualCategoryId: '200110',
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: LOCAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    expect(getCategoryId(transaction)).toBe(transaction.manualCategoryId)
  })

  it('Should return the automaticCategoryId if the localCategoryProba is lower than the threshold', () => {
    const transaction = {
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: LOCAL_MODEL_USAGE_THRESHOLD - 0.01
    }

    expect(getCategoryId(transaction)).toBe(transaction.automaticCategoryId)
  })

  it("Should return the automaticCategoryId if there's neither manualCategoryId nor automaticCategoryId", () => {
    const transaction = {
      automaticCategoryId: '200120'
    }

    expect(getCategoryId(transaction)).toBe(transaction.automaticCategoryId)
  })

  it('Should use local model properties according to "use-local-model" flag', () => {
    const transaction = {
      automaticCategoryId: '200120',
      localCategoryId: '200130',
      localCategoryProba: LOCAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    expect(getCategoryId(transaction)).toBe(transaction.localCategoryId)

    flag.mockReturnValueOnce(false)
    expect(getCategoryId(transaction)).toBe(transaction.automaticCategoryId)
  })

  it('should return the cozyCategoryId if there is one with a high probability, but no localCategoryId', () => {
    const transaction = {
      automaticCategoryId: '200120',
      cozyCategoryId: '200130',
      cozyCategoryProba: GLOBAL_MODEL_USAGE_THRESHOLD + 0.01
    }

    expect(getCategoryId(transaction)).toBe(transaction.cozyCategoryId)
  })
})
