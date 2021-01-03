import { CCLinkDataProcessing } from '../src/lib/CCLinkDataProcessing'

test('dumps test', () => {
  expect(CCLinkDataProcessing.replaceLinkBreak({})).toBe('{}')
})
