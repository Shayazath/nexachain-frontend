import { useEffect, useState } from "react";
import { Plus, Wallet, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import { Loading, ErrorState, Empty } from "../components/States";
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
export default function Investments() {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [form, setForm] = useState({
      amount: "1000",
      planName: "Demo Plan",
      dailyRoiPercent: "0.5",
      durationDays: "30",
    });
  async function load() {
    setLoading(true);
    try {
      const d = await api("/investments?limit=100");
      setItems(d.items);
      console.log(items,'items');
      
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api("/investments", {
        method: "POST",
        body: {
          ...form,
          amount: Number(form.amount),
          dailyRoiPercent: Number(form.dailyRoiPercent),
          durationDays: Number(form.durationDays),
        },
      });
      setShow(false);
      setNotice(
        "Investment created. Level income is distributed to eligible ancestors based on demo settings.",
      );
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PORTFOLIO MANAGEMENT</span>
          <h1>Investments</h1>
          <p>Review your investment plans and activity.</p>
        </div>
        <button className="primary-btn" onClick={() => setShow(!show)}>
          <Plus size={17} /> New investment
        </button>
      </div>
      {notice && <div className="success-notice">{notice}</div>}
      {error && <div className="form-error page-error">{error}</div>}
      {show && (
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h3>Create investment</h3>
              <p>
                Uses available wallet funds; no external deposits are supported.
              </p>
            </div>
          </div>
          <form className="investment-form" onSubmit={submit}>
            <label>
              Plan name
              <input
                required
                minLength="2"
                maxLength="80"
                value={form.planName}
                onChange={(e) => setForm({ ...form, planName: e.target.value })}
              />
            </label>
            <label>
              Amount (INR)
              <input
                type="number"
                min="1000"
                max="1000000"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </label>
            <label>
              Daily ROI (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                required
                value={form.dailyRoiPercent}
                onChange={(e) =>
                  setForm({ ...form, dailyRoiPercent: e.target.value })
                }
              />
              <small>Demo-only setting; not a guaranteed return.</small>
            </label>
            <label>
              Duration (days)
              <input
                type="number"
                min="1"
                max="3650"
                required
                value={form.durationDays}
                onChange={(e) =>
                  setForm({ ...form, durationDays: e.target.value })
                }
              />
            </label>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button className="primary-btn" disabled={busy}>
                {busy ? "Creating…" : "Create investment"}
              </button>
            </div>
          </form>
        </section>
      )}
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Investment history</h3>
            <p>All your investment records</p>
          </div>
          <button
            className="icon-button"
            onClick={load}
            aria-label="Refresh investments"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : error && !items.length ? (
          <ErrorState message={error} />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Investment plan</th>
                  <th>Amount</th>
                  <th>Daily ROI</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((x) => (
                    <tr key={x._id}>
                      <td>
                        <b>{x.plan?.name || "Investment plan"}</b>
                        <small className="cell-sub">
                          ID · {x._id.slice(-8).toUpperCase()}
                        </small>
                      </td>
                      <td>{money(x.amount.$numberDecimal)}</td>
                      <td>{x.dailyRoiPercent}%</td>
                      <td>
                        {new Date(x.startDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>{new Date(x.endDate).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span
                          className={`status-badge ${x.status === "Completed" ? "complete" : x.status === "Cancelled" ? "cancelled" : ""}`}
                        >
                          {x.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <Empty message="No investments yet. Create one using your available demo wallet balance." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="disclaimer">
        <span>ⓘ</span>
        <p>
          <b>Important:</b> Creating an investment debits your existing wallet
          balance. The demo does not offer real-money deposits, withdrawals, or
          guaranteed returns.
        </p>
      </div>
    </>
  );
}
