#!/usr/bin/env node
import { execFileSync } from 'child_process'
import { isGitRepo, analyzeAuthor, analyzeTeam } from '../src/analyzer.js'

const args = process.argv.slice(2)
const has = (...f) => f.some(x => args.includes(x))
const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null }

const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', c: '\x1b[36m', b: '\x1b[1m', d: '\x1b[2m', x: '\x1b[0m' }

if (has('--help', '-h')) {
  console.log(`
${C.b}roast-my-git${C.x} — score your Git habits and commit hygiene, then roast them.

${C.b}Usage${C.x}
  roast-my-git [--author <email>] [--team] [--json]

${C.b}Flags${C.x}
  --author <email>   Analyze a specific author     (default: git config user.email)
  --team             Roast the top 10 authors by commit count
  --json             Emit raw stats as JSON instead of the roast
  --help, -h         Show this help

Run inside a git repository.
`)
  process.exit(0)
}

if (!isGitRepo()) {
  console.error(`${C.r}Not a git repository.${C.x} cd into a repo and try again.`)
  process.exit(1)
}

function defaultAuthor() {
  try { return execFileSync('git', ['config', 'user.email'], { encoding: 'utf8' }).trim() || null }
  catch { return null }
}

function roastLines(s) {
  const L = [`${C.d}${s.totalCommits} commits · ~${s.commitsPerWeek}/week · ${s.totalActiveDays | 0} active days${C.x}`]
  if (s.nightPercent >= 15) L.push(`🌙 ${s.nightPercent}% of commits land between 10pm–4am. Sleep is a feature you keep deprecating.`)
  if (s.forcePushes > 0) L.push(`💥 ${s.forcePushes} force-push${s.forcePushes > 1 ? 'es' : ''} in the reflog. History is written by whoever runs \`--force\` last.`)
  if (s.shortMessagePercent >= 25) L.push(`✏️  ${s.shortMessagePercent}% of messages are ≤4 chars. "fix" is not a changelog.`)
  if (s.conventionalPercent < 25) L.push(`📐 Only ${s.conventionalPercent}% conventional commits. The spec is right there, untouched.`)
  else if (s.conventionalPercent >= 80) L.push(`📐 ${s.conventionalPercent}% conventional commits. Suspiciously well-behaved.`)
  if (s.fridayAfternoonPercent >= 5) L.push(`🎲 ${s.fridayAfternoonPercent}% Friday-afternoon commits. The on-call rotation remembers your name.`)
  if (s.weekendPercent >= 25) L.push(`📅 ${s.weekendPercent}% weekend commits. Work-life balance: personally debunked.`)
  if (s.biggestCommitLines >= 1500) L.push(`🐘 Biggest single commit: ${s.biggestCommitLines} lines. That's not a commit, that's a land-grab.`)
  if (s.averageCommitSizeLOC >= 300) L.push(`📦 Average commit ${s.averageCommitSizeLOC} LOC. Atomic commits are a rumor you haven't confirmed.`)
  if (s.longestStreak >= 7) L.push(`🔥 ${s.longestStreak}-day commit streak. Impressive. Concerning. Touch grass.`)
  if (s.mergePercent >= 40) L.push(`🔀 ${s.mergePercent}% merge commits. \`git rebase\` is lonely.`)
  L.push(`⏰ Peak form: ${s.mostActiveDay} around ${String(s.mostActiveHour).padStart(2, '0')}:00. Branches lean ${s.branchNamingStyle}-case.`)
  if (L.length <= 2) L.push(`😐 Honestly? Your git hygiene is fine. Boring, but fine.`)
  return L
}

function printRoast(s) {
  console.log(`\n${C.b}${C.c}🔥 Roasting ${s.author || 'everyone'}${C.x}`)
  console.log(C.d + '─'.repeat(56) + C.x)
  for (const l of roastLines(s)) console.log('  ' + l)
}

if (has('--team')) {
  const team = analyzeTeam()
  if (!team.length) { console.error('No commits found.'); process.exit(1) }
  if (has('--json')) { console.log(JSON.stringify(team, null, 2)); process.exit(0) }
  team.forEach(printRoast)
  console.log('')
  process.exit(0)
}

const author = val('--author') || defaultAuthor()
const stats = analyzeAuthor(author)
if (!stats) { console.error(`No commits found${author ? ` for ${author}` : ''}.`); process.exit(1) }
if (has('--json')) { console.log(JSON.stringify(stats, null, 2)); process.exit(0) }
printRoast(stats)
console.log('')
