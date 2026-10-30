import { useEffect, useState } from "react";
import { Copy, GitFork, Users, Wallet } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Loading, ErrorState, Empty } from "../components/States";
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
function TreeNode({ node, depth = 0 }) {
  return (
    <div className="tree-node">
      <div className="tree-person">
        <div className="tree-avatar">
          {node.fullName?.slice(0, 1)?.toUpperCase() || "U"}
        </div>
        <div className="tree-person-info">
          <b>{node.fullName}</b>
          <small>{node.email || node.referralCode}</small>
        </div>
        <span className="tree-level">{depth === 0 ? "YOU" : `L${depth}`}</span>
      </div>
      {node.children?.length > 0 && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
export default function Referrals() {
  const { user } = useAuth();
  const [direct, setDirect] = useState(null),
    [tree, setTree] = useState(null),
    [income, setIncome] = useState(null),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false);
  useEffect(() => {
    Promise.all([
      api("/referrals/direct"),
      api("/referrals/tree"),
      api("/referrals/income"),
    ])
      .then(([d, t, i]) => {
        setDirect(d);
        setTree(t);
        setIncome(i);
      })
      .catch((e) => setError(e.message));
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(user?.referralCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard access failed. Copy your referral code manually.");
    }
  }
  if (error && !direct) return <ErrorState message={error} />;
  if (!direct || !tree || !income) return <Loading />;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">NETWORK & REWARDS</span>
          <h1>Your referrals</h1>
          <p>Explore your referral network and credited level income.</p>
        </div>
      </div>
      <div className="referral-hero">
        <div>
          <span className="eyebrow">YOUR PERSONAL REFERRAL CODE</span>
          <div className="referral-code">{user?.referralCode || "—"}</div>
          <p>Share your code with people who want to join this demo.</p>
        </div>
        <button className="copy-btn" onClick={copy}>
          <Copy size={16} />
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <div className="stats-grid referral-stats">
        <article className="stat-card">
          <div className="stat-top">
            <span>Direct referrals</span>
            <div className="stat-icon">
              <Users size={19} />
            </div>
          </div>
          <div className="stat-value">{direct.total}</div>
          <div className="stat-foot neutral">
            People registered with your code
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-top">
            <span>Level income records</span>
            <div className="stat-icon">
              <GitFork size={19} />
            </div>
          </div>
          <div className="stat-value">{income.total}</div>
          <div className="stat-foot neutral">Credited commission entries</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">
            <span>Level income total</span>
            <div className="stat-icon">
              <Wallet size={19} />
            </div>
          </div>
          <div className="stat-value">
            {money(
              income.items.reduce(
                (sum, x) => sum + Number(x.incomeAmount.$numberDecimal || 0),
                0,
              ),
            )}
          </div>
          <div className="stat-foot neutral">Latest page total</div>
        </article>
      </div>
      <div className="content-grid referral-content">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Referral tree</h3>
              <p>Your nested network hierarchy</p>
            </div>
            <GitFork size={18} className="muted-icon" />
          </div>
          <div className="tree-wrap">
            {tree ? (
              <TreeNode node={tree} />
            ) : (
              <Empty message="Referral tree is not available." />
            )}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Level income history</h3>
              <p>Recent referral commissions</p>
            </div>
          </div>
          <div className="income-list">
            {income.items.length ? (
              income.items.slice(0, 8).map((x) => (
                <div className="income-item" key={x._id}>
                  <div className="income-avatar">L{x.level}</div>
                  <div className="income-info">
                    <b>Level {x.level} income</b>
                    <small>
                      From {x.generatedBy?.fullName || "Network member"} ·{" "}
                      {new Date(x.date).toLocaleDateString("en-IN")}
                    </small>
                  </div>
                  <strong>+{money(x.incomeAmount.$numberDecimal)}</strong>
                </div>
              ))
            ) : (
              <Empty message="No referral income credited yet." />
            )}
          </div>
        </section>
      </div>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Direct referrals</h3>
            <p>People directly connected to your account</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Referral code</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {direct.items.length ? (
                direct.items.map((x) => (
                  <tr key={x._id}>
                    <td>
                      <b>{x.fullName}</b>
                    </td>
                    <td>{x.email}</td>
                    <td>{x.referralCode}</td>
                    <td>{new Date(x.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <span className="status-badge">{x.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <Empty message="No direct referrals yet. Share your referral code to grow your network." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
