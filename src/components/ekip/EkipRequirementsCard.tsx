import { GlassCard } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Group, Profile } from '@/types/database';

interface EkipRequirementsCardProps {
  group: Group;
  user: Profile;
  className?: string;
}

export function EkipRequirementsCard({ group, user, className = '' }: EkipRequirementsCardProps) {
  const Shield = getIcon('Shield');
  const Check = getIcon('Check');
  const X = getIcon('X');

  const rules: { label: string; passed: boolean; desc: string }[] = [];

  if (group.required_level) {
    rules.push({
      label: `Level ${group.required_level}+`,
      passed: user.level >= group.required_level,
      desc: `Your level is ${user.level}`,
    });
  }

  if (group.required_honor) {
    rules.push({
      label: `Honor ${group.required_honor}+`,
      passed: user.honor_score >= group.required_honor,
      desc: `Your score is ${user.honor_score}`,
    });
  }

  if (group.age_min || group.age_max) {
    const min = group.age_min ?? 0;
    const max = group.age_max ?? 999;
    const age = user.age ?? 0;
    rules.push({
      label: `Age ${min}-${max === 999 ? '∞' : max}`,
      passed: age >= min && age <= max,
      desc: `Your age is ${age}`,
    });
  }

  if (group.gender_preference && group.gender_preference !== 'any') {
    rules.push({
      label: `${group.gender_preference} only`,
      passed: user.gender === group.gender_preference,
      desc: `Your gender: ${user.gender ?? 'Not set'}`,
    });
  }

  if (group.premium_only) {
    rules.push({
      label: 'Premium members',
      passed: Boolean(user.is_premium),
      desc: user.is_premium ? 'Active subscription' : 'Upgrade required',
    });
  }

  if (rules.length === 0) return null;

  return (
    <GlassCard variant="thin" className={`rounded-3xl p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} className="text-pink-500" strokeWidth={2.4} />
        <h3 className="text-sub text-primary font-bold">Requirements</h3>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center justify-between text-foot">
            <span className="text-secondary font-medium">{rule.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-tertiary">{rule.desc}</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  rule.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}
              >
                {rule.passed ? <Check size={12} strokeWidth={2.8} /> : <X size={12} strokeWidth={2.8} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
