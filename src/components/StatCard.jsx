import { ArrowDownRight, ArrowUpRight } from "lucide-react";
export default function StatCard({
  title,
  value,
  subtitle,
  Icon,
  positive = true,
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">
          <Icon size={19} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-foot ${positive ? "good" : "neutral"}`}>
        {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        <span>{subtitle}</span>
      </div>
    </article>
  );
}
