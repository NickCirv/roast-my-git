import { execFileSync } from 'child_process'

function git(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

function gitLines(...args) {
  const out = git(...args)
  return out ? out.split('\n').filter(Boolean) : []
}

export function isGitRepo() {
  try {
    execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

export function getAuthors() {
  const lines = gitLines('log', '--format=%ae', '--no-merges')
  const counts = {}
  for (const email of lines) {
    counts[email] = (counts[email] || 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([email]) => email)
}

export function analyzeAuthor(author) {
  const authorFlag = author ? `--author=${author}` : null
  const logArgs = ['log', '--no-merges', '--format=%H|%ae|%s|%ai']
  if (authorFlag) logArgs.push(authorFlag)

  const commits = gitLines(...logArgs).map(line => {
    const [hash, email, subject, dateStr] = line.split('|')
    return { hash, email, subject: subject || '', date: new Date(dateStr) }
  })

  if (commits.length === 0) {
    return null
  }

  const stats = {
    author,
    totalCommits: commits.length,
    commitTimes: {},
    nightCommits: 0,
    weekendCommits: 0,
    morningCommits: 0,
    afternoonCommits: 0,
    eveningCommits: 0,
    messageLengths: [],
    conventionalCount: 0,
    forcePushes: 0,
    mergeCommits: 0,
    totalCommitsWithMerges: 0,
    branchNames: [],
    linesAdded: 0,
    linesDeleted: 0,
    commitDates: [],
    longestStreak: 0,
    biggestCommitLines: 0,
    averageCommitSizeLOC: 0,
    dayOfWeekCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    hourCounts: {},
    fridayAfternoonCommits: 0,
    mondayCommits: 0,
  }

  const conventionalPrefixes = /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?:/i

  for (const commit of commits) {
    const hour = commit.date.getHours()
    const day = commit.date.getDay()

    stats.hourCounts[hour] = (stats.hourCounts[hour] || 0) + 1
    stats.dayOfWeekCounts[day] = (stats.dayOfWeekCounts[day] || 0) + 1

    if (hour >= 22 || hour < 4) stats.nightCommits++
    if (day === 0 || day === 6) stats.weekendCommits++
    if (hour >= 5 && hour < 11) stats.morningCommits++
    if (hour >= 11 && hour < 17) stats.afternoonCommits++
    if (hour >= 17 && hour < 22) stats.eveningCommits++
    if (day === 5 && hour >= 14 && hour < 18) stats.fridayAfternoonCommits++
    if (day === 1) stats.mondayCommits++

    const msgLen = commit.subject.trim().length
    stats.messageLengths.push(msgLen)
    if (conventionalPrefixes.test(commit.subject)) stats.conventionalCount++

    stats.commitDates.push(commit.date)
  }

  stats.averageMessageLength =
    stats.messageLengths.length > 0
      ? Math.round(stats.messageLengths.reduce((a, b) => a + b, 0) / stats.messageLengths.length)
      : 0

  stats.conventionalPercent =
    stats.totalCommits > 0 ? Math.round((stats.conventionalCount / stats.totalCommits) * 100) : 0

  stats.nightPercent =
    stats.totalCommits > 0 ? Math.round((stats.nightCommits / stats.totalCommits) * 100) : 0

  stats.weekendPercent =
    stats.totalCommits > 0 ? Math.round((stats.weekendCommits / stats.totalCommits) * 100) : 0

  stats.fridayAfternoonPercent =
    stats.totalCommits > 0
      ? Math.round((stats.fridayAfternoonCommits / stats.totalCommits) * 100)
      : 0

  // Longest streak
  const uniqueDays = [
    ...new Set(
      stats.commitDates.map(d => d.toISOString().split('T')[0])
    ),
  ].sort()

  let streak = 1
  let maxStreak = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1])
    const curr = new Date(uniqueDays[i])
    const diff = (curr - prev) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
      maxStreak = Math.max(maxStreak, streak)
    } else {
      streak = 1
    }
  }
  stats.longestStreak = maxStreak

  // Commit frequency
  if (stats.commitDates.length >= 2) {
    const oldest = new Date(Math.min(...stats.commitDates.map(d => d.getTime())))
    const newest = new Date(Math.max(...stats.commitDates.map(d => d.getTime())))
    const days = Math.max(1, (newest - oldest) / (1000 * 60 * 60 * 24))
    stats.commitsPerDay = parseFloat((stats.totalCommits / days).toFixed(2))
    stats.commitsPerWeek = parseFloat((stats.commitsPerDay * 7).toFixed(1))
    stats.totalActiveDays = days
  } else {
    stats.commitsPerDay = stats.totalCommits
    stats.commitsPerWeek = stats.totalCommits * 7
    stats.totalActiveDays = 1
  }

  // Force pushes (via reflog)
  try {
    const reflog = gitLines('reflog', '--format=%gs')
    stats.forcePushes = reflog.filter(line => /force.?push|push.*force|-f/i.test(line)).length
  } catch {
    stats.forcePushes = 0
  }

  // Merge vs rebase: check merge commits ratio
  const allCommitsArgs = ['log', '--format=%P']
  if (authorFlag) allCommitsArgs.push(authorFlag)
  const parents = gitLines(...allCommitsArgs)
  stats.totalCommitsWithMerges = parents.length
  stats.mergeCommits = parents.filter(p => p.includes(' ')).length
  stats.mergePercent =
    stats.totalCommitsWithMerges > 0
      ? Math.round((stats.mergeCommits / stats.totalCommitsWithMerges) * 100)
      : 0

  // Branch names
  stats.branchNames = gitLines('branch', '--format=%(refname:short)')

  const snakeCaseCount = stats.branchNames.filter(b => b.includes('_')).length
  const camelCaseCount = stats.branchNames.filter(b => /[a-z][A-Z]/.test(b)).length
  const kebabCount = stats.branchNames.filter(b => b.includes('-')).length
  stats.branchNamingStyle =
    kebabCount >= snakeCaseCount && kebabCount >= camelCaseCount
      ? 'kebab'
      : snakeCaseCount >= camelCaseCount
      ? 'snake'
      : 'camel'

  // Biggest single commit lines
  try {
    const diffStats = gitLines('log', '--no-merges', '--format=', '--numstat', ...(authorFlag ? [authorFlag] : []))
    let currentTotal = 0
    let max = 0
    for (const line of diffStats) {
      if (line.trim() === '') {
        if (currentTotal > max) max = currentTotal
        currentTotal = 0
        continue
      }
      const parts = line.split('\t')
      if (parts.length >= 2) {
        const added = parseInt(parts[0]) || 0
        const deleted = parseInt(parts[1]) || 0
        currentTotal += added + deleted
        stats.linesAdded += added
        stats.linesDeleted += deleted
      }
    }
    if (currentTotal > max) max = currentTotal
    stats.biggestCommitLines = max
    stats.averageCommitSizeLOC =
      stats.totalCommits > 0
        ? Math.round((stats.linesAdded + stats.linesDeleted) / stats.totalCommits)
        : 0
  } catch {
    stats.biggestCommitLines = 0
    stats.averageCommitSizeLOC = 0
  }

  // Most active hour
  const hourEntries = Object.entries(stats.hourCounts)
  stats.mostActiveHour =
    hourEntries.length > 0
      ? parseInt(hourEntries.sort((a, b) => b[1] - a[1])[0][0])
      : 12

  // Most active day
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayEntries = Object.entries(stats.dayOfWeekCounts)
  stats.mostActiveDay = dayNames[parseInt(dayEntries.sort((a, b) => b[1] - a[1])[0][0])]

  // Short messages
  stats.shortMessages = stats.messageLengths.filter(l => l <= 4).length
  stats.shortMessagePercent =
    stats.messageLengths.length > 0
      ? Math.round((stats.shortMessages / stats.messageLengths.length) * 100)
      : 0

  return stats
}

export function analyzeTeam() {
  const authors = getAuthors()
  const team = []
  for (const author of authors.slice(0, 10)) {
    const data = analyzeAuthor(author)
    if (data) team.push(data)
  }
  return team
}
