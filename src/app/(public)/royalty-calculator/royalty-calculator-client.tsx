'use client';

import { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Calendar,
  Clock,
  Wallet,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORMS, ROYALTY_POLICY } from '@/constants';
import { SectionWrapper } from '@/components/shared';

/* -----------------------------------------------------------------------
   Helpers
   ----------------------------------------------------------------------- */

/** Format a paise value to Indian comma system: ₹1,23,456 */
function formatINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  const str = rupees.toString();
  if (str.length <= 3) return `₹${str}`;

  const lastThree = str.slice(-3);
  const remaining = str.slice(0, -3);
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${formatted},${lastThree}`;
}

/** Format rupees (not paise) with Indian comma system */
function formatINRFromRupees(rupees: number): string {
  return formatINR(rupees * 100);
}

const PLATFORM_FEE_PERCENT = 40;

/* -----------------------------------------------------------------------
   Donut Chart (Pure SVG)
   ----------------------------------------------------------------------- */

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
        {segments.map((segment) => {
          const percent = total > 0 ? segment.value / total : 0;
          const dashLength = percent * circumference;
          const dashOffset = (accumulated / total) * circumference;
          accumulated += segment.value;

          return (
            <circle
              key={segment.label}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="28"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-dashOffset}
              className="transition-all duration-700 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-caption font-body text-text-muted">{centerLabel}</span>
        <span className="font-display text-heading-md text-text-primary font-bold">
          {centerValue}
        </span>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Main Client Component
   ----------------------------------------------------------------------- */

export function RoyaltyCalculatorClient() {
  const [mrp, setMrp] = useState(499);
  const [copies, setCopies] = useState(500);
  const [platform, setPlatform] = useState<string>(PLATFORMS[0].value);

  // Calculations (all in rupees for display, paise internally)
  const grossRevenue = mrp * copies;
  const platformFee = grossRevenue * (PLATFORM_FEE_PERCENT / 100);
  const netRevenue = grossRevenue - platformFee;
  const authorRoyalty = netRevenue * (ROYALTY_POLICY.splitPercentage / 100);
  const bookleafCommission = netRevenue - authorRoyalty;

  const perCopyAuthor = copies > 0 ? authorRoyalty / copies : 0;
  const perCopyBookleaf = copies > 0 ? bookleafCommission / copies : 0;

  const donutSegments: DonutSegment[] = [
    { label: 'Author Share', value: authorRoyalty, color: 'var(--bl-brand-accent)' },
    { label: 'BookLeaf Share', value: bookleafCommission, color: 'var(--bl-brand-primary)' },
    { label: 'Platform Fee', value: platformFee, color: 'var(--bl-text-muted)' },
  ];

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform);

  return (
    <>
      {/* ===== CALCULATOR ===== */}
      <section className="section bg-surface-background" aria-labelledby="calculator-heading">
        <div className="container-bookleaf">
          <SectionWrapper>
            <div className="text-center mb-12">
              <h2
                id="calculator-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Calculate Your{' '}
                <span className="text-brand-accent">Royalties</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-secondary max-w-2xl mx-auto font-body">
                Adjust the sliders below to see exactly how much you&apos;ll earn
                per copy sold on any platform.
              </p>
            </div>
          </SectionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Inputs */}
            <SectionWrapper direction="left" delay={0.1}>
              <div className="card p-6 md:p-8 space-y-8">
                {/* MRP Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label
                      htmlFor="mrp-slider"
                      className="font-display text-heading-sm text-text-primary"
                    >
                      Book MRP
                    </label>
                    <span className="font-display text-heading-sm text-brand-accent font-bold">
                      {formatINRFromRupees(mrp)}
                    </span>
                  </div>
                  <input
                    id="mrp-slider"
                    type="range"
                    min={199}
                    max={1999}
                    step={10}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-brand-accent"
                  />
                  <div className="flex justify-between text-caption text-text-muted mt-1 font-body">
                    <span>₹199</span>
                    <span>₹1,999</span>
                  </div>
                </div>

                {/* Copies Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label
                      htmlFor="copies-slider"
                      className="font-display text-heading-sm text-text-primary"
                    >
                      Copies Sold
                    </label>
                    <span className="font-display text-heading-sm text-brand-accent font-bold">
                      {copies.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    id="copies-slider"
                    type="range"
                    min={1}
                    max={10000}
                    step={1}
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-brand-accent"
                  />
                  <div className="flex justify-between text-caption text-text-muted mt-1 font-body">
                    <span>1</span>
                    <span>10,000</span>
                  </div>
                </div>

                {/* Platform Selector */}
                <div>
                  <label className="font-display text-heading-sm text-text-primary mb-3 block">
                    Sales Platform
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPlatform(p.value)}
                        className={cn(
                          'px-4 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-200 border',
                          platform === p.value
                            ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-md'
                            : 'bg-surface-card text-text-secondary border-border hover:border-brand-accent hover:text-text-primary',
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                  <Info className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <p className="text-body-sm text-text-secondary font-body">
                    <strong className="text-text-primary">100% royalty on author-driven sales.</strong>{' '}
                    When you sell directly through your own channels, you keep the
                    entire amount — no platform fee, no commission.
                  </p>
                </div>
              </div>
            </SectionWrapper>

            {/* Right: Results */}
            <SectionWrapper direction="right" delay={0.2}>
              <div className="card p-6 md:p-8 space-y-8">
                {/* Donut Chart */}
                <div className="flex justify-center">
                  <DonutChart
                    segments={donutSegments}
                    centerLabel="You Earn"
                    centerValue={formatINRFromRupees(authorRoyalty)}
                  />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4">
                  {donutSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-body-sm text-text-muted font-body">
                        {seg.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-display text-heading-sm text-text-primary">
                    Revenue Breakdown
                  </h3>

                  <div className="space-y-2">
                    {[
                      {
                        label: `Gross Revenue (${copies.toLocaleString('en-IN')} × ${formatINRFromRupees(mrp)})`,
                        value: formatINRFromRupees(grossRevenue),
                        highlight: false,
                      },
                      {
                        label: `Platform Fee (${PLATFORM_FEE_PERCENT}% — ${selectedPlatform?.label ?? 'Platform'})`,
                        value: `− ${formatINRFromRupees(platformFee)}`,
                        highlight: false,
                      },
                      {
                        label: `Your Royalty (${ROYALTY_POLICY.splitPercentage}% of net)`,
                        value: formatINRFromRupees(authorRoyalty),
                        highlight: true,
                      },
                      {
                        label: `BookLeaf Commission (${100 - ROYALTY_POLICY.splitPercentage}%)`,
                        value: formatINRFromRupees(bookleafCommission),
                        highlight: false,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-lg',
                          row.highlight
                            ? 'bg-brand-accent/10 border border-brand-accent/30'
                            : 'bg-surface-muted',
                        )}
                      >
                        <span
                          className={cn(
                            'text-body-sm font-body',
                            row.highlight
                              ? 'text-text-primary font-semibold'
                              : 'text-text-secondary',
                          )}
                        >
                          {row.label}
                        </span>
                        <span
                          className={cn(
                            'font-display font-bold',
                            row.highlight
                              ? 'text-brand-accent text-heading-sm'
                              : 'text-text-primary text-body-md',
                          )}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-Copy */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-surface-muted text-center">
                    <p className="text-caption text-text-muted font-body">Per Copy (You)</p>
                    <p className="font-display text-heading-md text-brand-accent font-bold mt-1">
                      {formatINRFromRupees(perCopyAuthor)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-muted text-center">
                    <p className="text-caption text-text-muted font-body">Per Copy (BookLeaf)</p>
                    <p className="font-display text-heading-md text-text-primary font-bold mt-1">
                      {formatINRFromRupees(perCopyBookleaf)}
                    </p>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* ===== PAYOUT POLICY ===== */}
      <section className="section bg-surface-muted" aria-labelledby="payout-heading">
        <div className="container-bookleaf">
          <SectionWrapper>
            <div className="text-center mb-12">
              <h2
                id="payout-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Payout <span className="text-brand-accent">Policy</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-secondary max-w-2xl mx-auto font-body">
                Clear, predictable payouts — no surprises, ever.
              </p>
            </div>
          </SectionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Calendar,
                title: 'Quarterly Payouts',
                description: `Royalties are settled every quarter, giving you a predictable income cycle.`,
              },
              {
                icon: Clock,
                title: `${ROYALTY_POLICY.payoutWindow}-Day Window`,
                description: `Payouts are processed within ${ROYALTY_POLICY.payoutWindow} days after each quarter ends.`,
              },
              {
                icon: Wallet,
                title: `${formatINR(ROYALTY_POLICY.minimumThreshold)} Minimum`,
                description: `Accumulated royalties are paid once they cross the ${formatINR(ROYALTY_POLICY.minimumThreshold)} threshold.`,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <SectionWrapper key={item.title} delay={0.1}>
                  <div className="card p-6 md:p-8 text-center">
                    <div className="w-14 h-14 rounded-xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-7 h-7 text-brand-accent" />
                    </div>
                    <h3 className="font-display text-heading-sm text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-body-sm text-text-muted font-body">
                      {item.description}
                    </p>
                  </div>
                </SectionWrapper>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
