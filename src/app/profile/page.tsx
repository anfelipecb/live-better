'use client';

import { useState, useMemo } from 'react';
import {
  User,
  Scale,
  TrendingDown,
  TrendingUp,
  Edit,
  Save,
  Activity,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Profile, BodyStats } from '@/types';
import { generateId, getToday, cn } from '@/lib/utils';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

// ── Goal type labels ─────────────────────────────────────────────────

const goalLabels: Record<Profile['goalType'], string> = {
  recomp: 'Recomposition',
  cut: 'Cut',
  bulk: 'Bulk',
  maintain: 'Maintain',
};

// ── SVG Line Chart ───────────────────────────────────────────────────

interface ChartDataPoint {
  date: string;
  value: number;
}

function LineChart({
  data,
  color,
  label,
  unit,
}: {
  data: ChartDataPoint[];
  color: string;
  label: string;
  unit: string;
}) {
  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 600;
  const height = 260;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.floor(Math.min(...values) - 1);
  const maxVal = Math.ceil(Math.max(...values) + 1);
  const range = maxVal - minVal || 1;

  // Compute grid lines (roughly 5 horizontal lines)
  const step = Math.max(1, Math.ceil(range / 5));
  const gridLines: number[] = [];
  for (let v = Math.ceil(minVal / step) * step; v <= maxVal; v += step) {
    gridLines.push(v);
  }

  // Map data to SVG coordinates
  const points = data.map((d, i) => {
    const x =
      padding.left +
      (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y =
      padding.top + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, date: d.date, value: d.value };
  });

  // Build path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ');

  // Date labels for X axis (show up to 6 evenly spaced)
  const maxLabels = 6;
  const labelStep = Math.max(1, Math.floor(data.length / maxLabels));
  const xLabels = data
    .map((d, i) => ({ index: i, date: d.date }))
    .filter((_, i) => i % labelStep === 0 || i === data.length - 1);

  return (
    <div>
      <p className="text-sm font-medium text-dark-200 mb-2">{label}</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {gridLines.map((v) => {
          const y = padding.top + chartH - ((v - minVal) / range) * chartH;
          return (
            <g key={v}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.35)"
                fontSize={10}
              >
                {v}
                {unit}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {xLabels.map(({ index, date }) => {
          const x =
            padding.left +
            (data.length === 1
              ? chartW / 2
              : (index / (data.length - 1)) * chartW);
          const shortDate = date.slice(5); // MM-DD
          return (
            <text
              key={date + index}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize={10}
            >
              {shortDate}
            </text>
          );
        })}

        {/* Line path */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point circles with tooltips */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth={1.5}
            className="cursor-pointer"
          >
            <title>
              {p.date}: {p.value}
              {unit}
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ── Profile Page ─────────────────────────────────────────────────────

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const { profile, bodyStats } = state;

  // ── Section 1: Profile form state ─────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [formProfile, setFormProfile] = useState<Profile>({ ...profile });

  function handleEditToggle() {
    if (editing) {
      // Save
      dispatch({ type: 'UPDATE_PROFILE', payload: formProfile });
      setEditing(false);
    } else {
      // Enter edit mode, reset form to current profile
      setFormProfile({ ...profile });
      setEditing(true);
    }
  }

  function handleProfileChange(
    field: keyof Profile,
    value: string | number,
  ) {
    setFormProfile((prev) => ({ ...prev, [field]: value }));
  }

  // ── Section 2: Body stats log state ───────────────────────────────
  const [statsDate, setStatsDate] = useState(getToday());
  const [statsWeight, setStatsWeight] = useState('');
  const [statsBf, setStatsBf] = useState('');

  const sortedStats = useMemo(
    () => [...bodyStats].sort((a, b) => a.date.localeCompare(b.date)),
    [bodyStats],
  );
  const lastEntry = sortedStats.length > 0 ? sortedStats[sortedStats.length - 1] : null;

  function handleLogStats() {
    const weightVal = parseFloat(statsWeight);
    if (isNaN(weightVal) || weightVal <= 0) return;

    const entry: BodyStats = {
      id: generateId(),
      date: statsDate,
      weightKg: weightVal,
      ...(statsBf && !isNaN(parseFloat(statsBf))
        ? { bodyFatPercent: parseFloat(statsBf) }
        : {}),
    };

    dispatch({ type: 'ADD_BODY_STATS', payload: entry });
    setStatsWeight('');
    setStatsBf('');
  }

  // ── Section 3: Chart data ─────────────────────────────────────────
  const chartEntries = useMemo(() => {
    const entries = sortedStats.slice(-30);
    return entries;
  }, [sortedStats]);

  const weightData: ChartDataPoint[] = chartEntries.map((e) => ({
    date: e.date,
    value: e.weightKg,
  }));

  const bfEntries = chartEntries.filter(
    (e) => e.bodyFatPercent !== undefined,
  );
  const bfData: ChartDataPoint[] = bfEntries.map((e) => ({
    date: e.date,
    value: e.bodyFatPercent!,
  }));

  // Summary stats
  const currentWeight = sortedStats.length > 0 ? sortedStats[sortedStats.length - 1].weightKg : null;
  const weightChange =
    sortedStats.length >= 2
      ? sortedStats[sortedStats.length - 1].weightKg - sortedStats[0].weightKg
      : null;
  const latestBf = [...sortedStats]
    .reverse()
    .find((e) => e.bodyFatPercent !== undefined);
  const totalEntries = bodyStats.length;

  return (
    <PageContainer>
      <Header
        title="Profile & Body Stats"
        subtitle="Manage your profile and track your progress"
      />

      <div className="space-y-6">
        {/* ── Section 1: Profile Info ──────────────────────────────── */}
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/15">
                <User className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-dark-100">
                Profile Info
              </h2>
            </div>
            <Button
              variant={editing ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleEditToggle}
            >
              {editing ? (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formProfile.name}
                onChange={(e) =>
                  handleProfileChange('name', e.target.value)
                }
              />
              <Input
                label="Age"
                type="number"
                min={1}
                value={formProfile.age}
                onChange={(e) =>
                  handleProfileChange('age', parseInt(e.target.value) || 0)
                }
              />
              <Input
                label="Height (cm)"
                type="number"
                min={1}
                value={formProfile.heightCm}
                onChange={(e) =>
                  handleProfileChange(
                    'heightCm',
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark-200">
                  Goal Type
                </label>
                <select
                  value={formProfile.goalType}
                  onChange={(e) =>
                    handleProfileChange(
                      'goalType',
                      e.target.value as Profile['goalType'],
                    )
                  }
                  className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 outline-none transition-colors"
                >
                  <option value="recomp">Recomposition</option>
                  <option value="cut">Cut</option>
                  <option value="bulk">Bulk</option>
                  <option value="maintain">Maintain</option>
                </select>
              </div>
              <Input
                label="Target Daily Calories"
                type="number"
                min={0}
                value={formProfile.targetCalories}
                onChange={(e) =>
                  handleProfileChange(
                    'targetCalories',
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <Input
                label="Target Daily Protein (g)"
                type="number"
                min={0}
                value={formProfile.targetProtein}
                onChange={(e) =>
                  handleProfileChange(
                    'targetProtein',
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-dark-400 mb-0.5">Name</p>
                <p className="text-dark-100 font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-0.5">Age</p>
                <p className="text-dark-100 font-medium">{profile.age}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-0.5">Height</p>
                <p className="text-dark-100 font-medium">
                  {profile.heightCm} cm
                </p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-0.5">Goal</p>
                <Badge variant="success">
                  {goalLabels[profile.goalType]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-0.5">
                  Daily Calories
                </p>
                <p className="text-dark-100 font-medium">
                  {profile.targetCalories} kcal
                </p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-0.5">
                  Daily Protein
                </p>
                <p className="text-dark-100 font-medium">
                  {profile.targetProtein}g
                </p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── Section 2: Log Body Stats ────────────────────────────── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-accent/15">
              <Scale className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-dark-100">
              Log Body Stats
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <Input
              label="Date"
              type="date"
              value={statsDate}
              onChange={(e) => setStatsDate(e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              min={0}
              placeholder="e.g. 75.5"
              value={statsWeight}
              onChange={(e) => setStatsWeight(e.target.value)}
            />
            <Input
              label="Body Fat % (optional)"
              type="number"
              step="0.1"
              min={0}
              max={100}
              placeholder="e.g. 18.5"
              value={statsBf}
              onChange={(e) => setStatsBf(e.target.value)}
            />
            <Button onClick={handleLogStats} className="h-[42px]">
              <Scale className="w-4 h-4 mr-1.5" />
              Log Stats
            </Button>
          </div>

          {lastEntry && (
            <div className="mt-4 pt-4 border-t border-dark-600/50">
              <p className="text-xs text-dark-400 mb-1">Last logged entry</p>
              <div className="flex items-center gap-4 text-sm text-dark-200">
                <span>{lastEntry.date}</span>
                <span className="font-medium text-dark-100">
                  {lastEntry.weightKg} kg
                </span>
                {lastEntry.bodyFatPercent !== undefined && (
                  <span className="font-medium text-dark-100">
                    {lastEntry.bodyFatPercent}% BF
                  </span>
                )}
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── Section 3: Progress Charts ───────────────────────────── */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-accent/15">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-dark-100">
              Progress Charts
            </h2>
          </div>

          {weightData.length === 0 ? (
            <p className="text-dark-400 text-sm py-8 text-center">
              No body stats logged yet. Add your first entry above to see
              charts.
            </p>
          ) : (
            <div className="space-y-6">
              <LineChart
                data={weightData}
                color="var(--accent)"
                label="Weight Over Time"
                unit=" kg"
              />

              {bfData.length > 0 && (
                <LineChart
                  data={bfData}
                  color="#f472b6"
                  label="Body Fat % Over Time"
                  unit="%"
                />
              )}

              {/* Stats summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="glass rounded-lg p-3 text-center">
                  <Scale className="w-4 h-4 text-accent mx-auto mb-1" />
                  <p className="text-xs text-dark-400">Current Weight</p>
                  <p className="text-lg font-semibold text-dark-100">
                    {currentWeight !== null
                      ? `${currentWeight} kg`
                      : '--'}
                  </p>
                </div>

                <div className="glass rounded-lg p-3 text-center">
                  {weightChange !== null && weightChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-success mx-auto mb-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-warning mx-auto mb-1" />
                  )}
                  <p className="text-xs text-dark-400">Weight Change</p>
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      weightChange !== null && weightChange < 0
                        ? 'text-success'
                        : weightChange !== null && weightChange > 0
                          ? 'text-warning'
                          : 'text-dark-100',
                    )}
                  >
                    {weightChange !== null
                      ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`
                      : '--'}
                  </p>
                </div>

                <div className="glass rounded-lg p-3 text-center">
                  <Activity className="w-4 h-4 text-yoga mx-auto mb-1" />
                  <p className="text-xs text-dark-400">Body Fat %</p>
                  <p className="text-lg font-semibold text-dark-100">
                    {latestBf?.bodyFatPercent !== undefined
                      ? `${latestBf.bodyFatPercent}%`
                      : '--'}
                  </p>
                </div>

                <div className="glass rounded-lg p-3 text-center">
                  <User className="w-4 h-4 text-accent mx-auto mb-1" />
                  <p className="text-xs text-dark-400">Total Entries</p>
                  <p className="text-lg font-semibold text-dark-100">
                    {totalEntries}
                  </p>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </PageContainer>
  );
}
