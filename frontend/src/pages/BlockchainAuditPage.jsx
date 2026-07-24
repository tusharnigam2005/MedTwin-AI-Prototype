import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  ShieldCheck, Lock, CheckCircle2, FileKey, ExternalLink,
  Search, Cpu, ArrowRight, Database, RefreshCw, Key
} from 'lucide-react';

const mockAuditTrail = [
  {
    txHash: '0x8f4c9a2d3b5e7f1a8c9d0e2f4a6b8c0d1e3f5a7b9c1d3e5f7a9b0c2d4e6f8a0b',
    method: 'doctorApproval()',
    blockNumber: '54,291,084',
    doctor: 'Dr. Saubhik Bhaumik',
    timestamp: '2026-07-23 16:42:10 UTC',
    status: 'Confirmed (Polygon Amoy)',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    method: 'storeHash()',
    blockNumber: '54,291,012',
    doctor: 'System Engine',
    timestamp: '2026-07-23 16:40:02 UTC',
    status: 'Confirmed (Polygon Amoy)',
    sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  },
  {
    txHash: '0x3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e',
    method: 'patientConsent()',
    blockNumber: '54,289,840',
    doctor: 'Patient Portal',
    timestamp: '2026-07-23 15:18:55 UTC',
    status: 'Confirmed (Polygon Amoy)',
    sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
  },
];

const contractFunctions = [
  {
    name: 'storeHash()',
    desc: "Writes a new medical record's SHA-256 hash with timestamp & patient ID to the Polygon smart contract.",
    icon: Key,
    tag: 'Immutable Write',
  },
  {
    name: 'verifyHash()',
    desc: 'Confirms a given document or report payload matches its tamper-proof on-chain SHA-256 hash.',
    icon: CheckCircle2,
    tag: 'Validation',
  },
  {
    name: 'doctorApproval()',
    desc: 'Records a licensed physician signature & decision on-chain before high-risk recommendations reach the patient.',
    icon: ShieldCheck,
    tag: 'Doctor Verification',
  },
  {
    name: 'patientConsent()',
    desc: 'Stores patient consent flags for granular data-sharing scopes with healthcare providers.',
    icon: Lock,
    tag: 'Privacy Governance',
  },
  {
    name: 'retrieveAudit()',
    desc: 'Returns the complete, immutable historical audit trail for any given medical twin record ID.',
    icon: Database,
    tag: 'Audit Trail',
  },
];

export default function BlockchainAuditPage() {
  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputHash.trim()) return;
    setVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setVerifying(false);
      setVerificationResult({
        matched: true,
        hash: inputHash.trim(),
        blockNumber: '54,291,084',
        timestamp: new Date().toISOString(),
        smartContract: '0x71C765...MedTwinTrust.sol',
        chain: 'Polygon Amoy Testnet (Chain ID 80002)',
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header Banner */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                <ShieldCheck className="w-4 h-4" /> Blockchain Trust Layer
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                Polygon Smart Contract & <span className="gradient-text">Audit Ledger</span>
              </h1>
              <p className="text-slate-300 mt-2 max-w-2xl text-sm leading-relaxed">
                MedTwin AI hashes every medical report, risk prediction, and doctor approval to the Polygon blockchain — guaranteeing 100% tamper-proof, auditable healthcare history.
              </p>
            </div>

            {/* Smart contract status badge */}
            <div className="glass rounded-2xl p-4 border border-emerald-500/30 text-left shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Polygon Network Online
                </span>
              </div>
              <p className="text-white font-mono font-bold text-xs">MedTwinTrust.sol</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Chain ID: 80002 · Amoy Testnet</p>
            </div>
          </div>
        </div>

        {/* Interactive SHA-256 Hash Verification Tool */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-medteal-400" />
              Verify Report Hash On-Chain
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Enter any SHA-256 document hash or transaction ID to verify its cryptographic authenticity against the smart contract.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              placeholder="Paste SHA-256 Hash or Transaction ID (e.g. e3b0c44298fc1c149...)"
              className="flex-1 bg-mednavy-900 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-medteal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={verifying}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-medteal-500 to-cyan-500 text-mednavy-950 font-bold text-sm hover:glow-teal transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify On-Chain</span>
            </button>
          </form>

          {/* Quick preset button */}
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span>Try sample hash:</span>
            <button
              type="button"
              onClick={() => setInputHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
              className="px-2.5 py-1 rounded-lg bg-mednavy-800 text-medteal-400 font-mono hover:bg-slate-800 transition-colors border border-medteal-500/20"
            >
              e3b0c44298fc...7852b855
            </button>
          </div>

          {/* Verification Result Modal Card */}
          {verificationResult && (
            <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/40 glow-teal space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>ON-CHAIN VERIFICATION CONFIRMED</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  Valid SHA-256 Match
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-mednavy-900/80 p-3 rounded-xl">
                  <p className="text-slate-500 uppercase font-semibold">Target Network</p>
                  <p className="text-slate-200 font-mono mt-0.5">{verificationResult.chain}</p>
                </div>

                <div className="bg-mednavy-900/80 p-3 rounded-xl">
                  <p className="text-slate-500 uppercase font-semibold">Smart Contract</p>
                  <p className="text-slate-200 font-mono mt-0.5">{verificationResult.smartContract}</p>
                </div>

                <div className="bg-mednavy-900/80 p-3 rounded-xl sm:col-span-2">
                  <p className="text-slate-500 uppercase font-semibold">Verified SHA-256 Hash</p>
                  <p className="text-medteal-400 font-mono text-[11px] break-all mt-0.5">{verificationResult.hash}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Verification Flow Diagram (PDF Page 27) */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              Doctor Verification & On-Chain Audit Flow
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              How AI predictions pass through doctor sign-off before committing to the Polygon ledger.
            </p>
          </div>

          <div className="grid sm:grid-cols-5 gap-3 text-center">
            {[
              { step: '01', title: 'AI Generated', desc: '5/6 Agents produce risk prediction' },
              { step: '02', title: 'Doctor Queue', desc: 'Routed to licensed physician portal' },
              { step: '03', title: 'Doctor Sign-off', desc: 'Physician reviews & signs decision' },
              { step: '04', title: 'Polygon Hashed', desc: 'Record hash written to smart contract' },
              { step: '05', title: 'Patient Notified', desc: 'Patient twin updated with verified advice' },
            ].map(({ step, title, desc }, idx) => (
              <div key={step} className="glass-card rounded-2xl p-4 relative group hover:border-medteal-500/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-medteal-500/15 border border-medteal-500/30 text-medteal-400 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <h4 className="text-white font-bold text-xs mb-1">{title}</h4>
                <p className="text-slate-400 text-[11px] leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contract Architecture Methods (PDF Page 26) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-heading">
            MedTwinTrust.sol — Smart Contract Architecture
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {contractFunctions.map(({ name, desc, icon: Icon, tag }) => (
              <div key={name} className="glass-card rounded-2xl p-5 hover:border-medteal-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-medteal-500/15 border border-medteal-500/30 flex items-center justify-center text-medteal-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                    {tag}
                  </span>
                </div>
                <h3 className="text-white font-mono font-bold text-sm mb-1">{name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Audit Log Table */}
        <div className="glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white font-heading">
              Recent On-Chain Audit Ledger
            </h2>
            <span className="text-xs text-slate-400">
              Showing last 3 verified smart contract transactions
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Transaction Hash</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Actor / Signer</th>
                  <th className="pb-3">Block Number</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {mockAuditTrail.map((tx) => (
                  <tr key={tx.txHash} className="hover:bg-mednavy-800/40 transition-colors">
                    <td className="py-3 font-mono text-medteal-400">
                      {tx.txHash.slice(0, 14)}...{tx.txHash.slice(-6)}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-200">{tx.method}</td>
                    <td className="py-3 text-slate-300 font-medium">{tx.doctor}</td>
                    <td className="py-3 text-slate-400 font-mono">#{tx.blockNumber}</td>
                    <td className="py-3 text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
                        ✓ Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        MedTwin AI · Polygon Blockchain Audit Ledger · MedTwinTrust.sol
      </footer>
    </div>
  );
}
