import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Coins,
  GitFork,
  Wallet,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../services/api";
import StatCard from "../components/StatCard";
import { Loading, ErrorState, Empty } from "../components/States";
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
export default function Dashboard() {
  const [data, setData] = useState(null),
    [chart, setChart] = useState([]),
    [history, setHistory] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api("/dashboard/summary"),
      api("/dashboard/earnings-chart"),
      api("/dashboard/histories"),
    ])
      .then(([s, c, h]) => {
        setData(s);
        setChart(c);
        setHistory(h);
      })
      .catch((e) => setError(e.message));
  }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PORTFOLIO</span>
          <h1>Dashboard overview</h1>
          <p>Track your investment activity and earnings at a glance.</p>
        </div>
        <div className="date-chip">
          <CalendarDays size={16} />
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="stats-grid">
        <StatCard
          title="Total investments"
          value={money(data.totalInvestments)}
          subtitle={`${data.activeInvestments} active investments`}
          Icon={Wallet}
          positive={false}
        />
        <StatCard
          title="Daily ROI"
          value={money(data.dailyRoi)}
          subtitle="Credited today (UTC day)"
          Icon={TrendingUp}
        />
        <StatCard
          title="Total ROI earned"
          value={money(data.totalRoiEarned)}
          subtitle="Lifetime credited ROI"
          Icon={Coins}
        />
        <StatCard
          title="Level income"
          value={money(data.totalLevelIncomeEarned)}
          subtitle="Referral commissions"
          Icon={GitFork}
        />
      </div>
      <div className="content-grid">
        <section className="panel earnings-panel">
          <div className="panel-heading">
            <div>
              <h3>Earnings overview</h3>
              <p>Last 30 days · credited earnings</p>
            </div>
            <span className="panel-icon">
              <Activity size={18} />
            </span>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-roi" /> ROI
            </span>
            <span>
              <i className="legend-level" /> Level income
            </span>
          </div>
          <div className="chart-wrap">
            {chart.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chart}
                  margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#62d6a5"
                        stopOpacity={0.22}
                      />
                      <stop offset="95%" stopColor="#62d6a5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#26354b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)}
                    tick={{ fill: "#8493aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8493aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111b2b",
                      border: "1px solid #2a3950",
                      borderRadius: 10,
                      color: "#edf3fb",
                    }}
                    formatter={(v) => money(v)}
                  />
                  <Area
                    type="monotone"
                    dataKey="roi"
                    name="ROI"
                    stroke="#62d6a5"
                    fill="url(#roiFill)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="levelIncome"
                    name="Level income"
                    stroke="#8ca8ff"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty message="Your earnings chart will appear after activity is recorded." />
            )}
          </div>
        </section>
        <section className="panel wallet-panel">
          <div className="panel-heading">
            <div>
              <h3>Wallet balance</h3>
              <p>Available demo balance</p>
            </div>
            <div className="wallet-icon">
              <Wallet size={19} />
            </div>
          </div>
          <div className="wallet-balance">{money(data.walletBalance)}</div>
          <div className="wallet-caption">
            <span className="pulse-dot" /> Demo funds only
          </div>
          <div className="wallet-divider" />
          <div className="wallet-row">
            <span>Total investments</span>
            <b>{money(data.totalInvestments)}</b>
          </div>
          <div className="wallet-row">
            <span>ROI earned</span>
            <b>{money(data.totalRoiEarned)}</b>
          </div>
          <div className="wallet-row">
            <span>Referral income</span>
            <b>{money(data.totalLevelIncomeEarned)}</b>
          </div>
          <a href="/investments" className="text-link">
            Manage investments <ChevronRight size={16} />
          </a>
        </section>
      </div>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent ROI history</h3>
            <p>Your latest credited daily returns</p>
          </div>
          <a href="/activity" className="text-link">
            View activity <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Investment</th>
                <th>Date</th>
                <th>Status</th>
                <th className="align-right">ROI amount</th>
              </tr>
            </thead>
            <tbody>
              {history?.roiHistory?.length ? (
                history.roiHistory.slice(0, 5).map((x) => (
                  <tr key={x._id}>
                    <td>
                      <b>{x.investment?.plan?.name || "Investment"}</b>
                      <small className="cell-sub">
                        {x.investment
                          ? money(x.investment.amount.$numberDecimal)
                          : "Investment record"}
                      </small>
                    </td>
                    <td>
                      {new Date(x.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td>
                      <span className="status-badge">{x.status}</span>
                    </td>
                    <td className="align-right amount-positive">
                      +{money(x.roiAmount.$numberDecimal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <Empty message="No ROI credited yet. ROI is processed by the daily scheduler." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className="disclaimer">
        <span>ⓘ</span>
        <p>
          <b>Demo environment:</b> ROI and referral commissions use configurable
          example rules. They are not guaranteed returns and this application
          does not process real-money payouts.
        </p>
      </div>
    </>
  );
}
