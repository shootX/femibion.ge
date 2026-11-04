import assert from 'node:assert/strict'
import test from 'node:test'
import { ovulationCycles, pregnancyDueDate } from './cycle-math.ts'

test('ovulation: next menses, ovulation and fertile window for 3 cycles', () => {
  const result = ovulationCycles('2026-01-01', 28, '2026-01-02')
  assert.ok(!('error' in result))
  if ('error' in result) return
  assert.equal(result.cycles.length, 3)
  assert.deepEqual(result.cycles[0], {
    cycleStart: '2026-01-01',
    nextMenses: '2026-01-29',
    ovulation: '2026-01-15',
    fertileStart: '2026-01-10',
    fertileEnd: '2026-01-15',
  })
  assert.equal(result.cycles[1].cycleStart, '2026-01-29')
  assert.equal(result.cycles[1].ovulation, '2026-02-12')
  assert.equal(result.cycles[2].cycleStart, '2026-02-26')
})

test('ovulation rejects a future LMP and a cycle outside 21–45', () => {
  assert.equal(ovulationCycles('2026-02-01', 28, '2026-01-15').error?.includes('მომავალ'), true)
  assert.equal(ovulationCycles('2026-01-01', 20, '2026-01-15').error?.includes('21'), true)
  assert.equal(ovulationCycles('2026-01-01', 46, '2026-01-15').error?.includes('21'), true)
})

test('due date shifts by cycle length and maps trimesters', () => {
  const standard = pregnancyDueDate('2026-01-01', 28, '2026-01-01')
  assert.ok(!('error' in standard))
  if ('error' in standard) return
  assert.equal(standard.edd, '2026-10-08')
  assert.equal(standard.weeks, 0)
  assert.equal(standard.trimester, 1)
  assert.equal(standard.product, 'femibion-1')

  const longer = pregnancyDueDate('2026-01-01', 35, '2026-04-02')
  assert.ok(!('error' in longer))
  if ('error' in longer) return
  assert.equal(longer.edd, '2026-10-15')
  assert.equal(longer.weeks, 13)
  assert.equal(longer.days, 0)
  assert.equal(longer.trimester, 2)
  assert.equal(longer.product, 'femibion-2')

  const third = pregnancyDueDate('2026-01-01', 28, '2026-07-16')
  assert.ok(!('error' in third))
  if ('error' in third) return
  assert.equal(third.weeks, 28)
  assert.equal(third.trimester, 3)
})

test('due date rejects LMP older than 44 weeks or in the future', () => {
  assert.equal(pregnancyDueDate('2025-01-01', 28, '2026-01-01').error?.includes('44'), true)
  assert.equal(pregnancyDueDate('2026-06-01', 28, '2026-05-01').error?.includes('მომავალ'), true)
  const edge = pregnancyDueDate('2026-01-01', 28, '2026-11-05')
  assert.ok(!('error' in edge))
  if ('error' in edge) return
  assert.equal(edge.weeks, 44)
})
