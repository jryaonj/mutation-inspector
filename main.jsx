import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BookOpen,
  Boxes,
  ChevronRight,
  Dna,
  Eye,
  ExternalLink,
  FileText,
  GitBranch,
  Grid2X2,
  Layers3,
  ListChecks,
  MousePointerClick,
  Network,
  Search,
  Sparkles,
  Table2,
  X,
} from "lucide-react";
import { ABBR_NOTE, CHAINS, MARKER, PHENOMENA, ROW_BY_ID } from "./mutationData.js";

const CHAIN_ICONS = {
  activity: Activity,
  dna: Dna,
  gitBranch: GitBranch,
  layers3: Layers3,
  network: Network,
};

const SIGNAL_MARKERS = [
  "源发基因组改写动作",
  "源发出错动作",
  "源发错误产物",
  "继发基因组改写动作",
  "继发/检查/放大动作",
  "继发动作",
  "继发错误产物",
  "基因组改写动作",
];

const STAGE_TONE = {
  "源发出错动作": "border-rose-300 bg-rose-50 text-rose-950 shadow-rose-100",
  "源发基因组改写动作": "border-red-300 bg-red-50 text-red-950 shadow-red-100",
  "源发错误产物": "border-orange-300 bg-orange-50 text-orange-950 shadow-orange-100",
  "继发/检查/放大动作": "border-sky-300 bg-sky-50 text-sky-950 shadow-sky-100",
  "继发动作": "border-blue-300 bg-blue-50 text-blue-950 shadow-blue-100",
  "继发基因组改写动作": "border-indigo-300 bg-indigo-50 text-indigo-950 shadow-indigo-100",
  "继发错误产物": "border-violet-300 bg-violet-50 text-violet-950 shadow-violet-100",
  "基因组改写动作": "border-red-300 bg-red-50 text-red-950 shadow-red-100",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatUiText(value = "") {
  return String(value).replaceAll("源发", "原发").replaceAll("寄发", "继发");
}

function classifyCell(value = "") {
  const v = String(value).trim();
  if (!v || v === "—") return "—";
  const marker = SIGNAL_MARKERS.find((candidate) => v.includes(candidate));
  if (marker) return marker;
  if (v.includes("正常")) return "正常";
  return "备注";
}

function hasSignal(value = "") {
  return SIGNAL_MARKERS.includes(classifyCell(value));
}

function Pill({ value, compact = false }) {
  const kind = classifyCell(value);
  return (
    <span className={cx(
      "inline-block max-w-full rounded-full ring-1 font-medium whitespace-normal break-words [overflow-wrap:anywhere]",
      compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
      MARKER[kind] || "bg-slate-100 text-slate-700 ring-slate-200"
    )}>
      {formatUiText(value || "—")}
    </span>
  );
}

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    ["interactive", "链条交互", MousePointerClick],
    ["matrices", "五个矩阵完整表", Table2],
    ["phenomena", "21 个现象", Grid2X2],
  ];
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-slate-400/30">
            <Sparkles className="h-3.5 w-3.5" />
            five-chain phenomenon mapper
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            五条分子链条 × 21 个现象
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            正选：点链条动作/物 → 弹出相关 entry。反选：点 entry 或现象 → 高亮链条阶段。所有 entry 均展示现象学、现象论文、分子生物学机理、机理论文。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cx(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
                activeTab === id ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
        <BookOpen className="h-4 w-4" />
        标记全称
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ABBR_NOTE.map(([abbr, full]) => (
          <div key={abbr} className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs">
            <span className="font-mono font-bold text-slate-500">{abbr}</span>
            <span className="font-semibold text-slate-800">{formatUiText(full)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainSelector({ selectedChainId, setSelectedChainId }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {CHAINS.map((chain) => {
        const Icon = CHAIN_ICONS[chain.icon] || Activity;
        const active = chain.id === selectedChainId;
        return (
          <button
            key={chain.id}
            onClick={() => setSelectedChainId(chain.id)}
            className={cx(
              "group rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg",
              active ? "border-slate-900 bg-slate-950 text-white shadow-xl shadow-slate-300" : "border-slate-200 bg-white text-slate-900"
            )}
          >
            <div className={cx("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white", chain.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-black">{chain.short}</div>
            <div className={cx("mt-1 text-xs leading-5", active ? "text-slate-300" : "text-slate-500")}>{chain.rows.length} entries</div>
          </button>
        );
      })}
    </div>
  );
}

function ChainFlow({ chain, selectedRow, selectedStages, toggleStage, clearStages }) {
  const cells = selectedRow?.chainId === chain.id ? selectedRow.cells : {};
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950">{chain.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{chain.description}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          点击多个动作/物筛选 entry
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {selectedStages.length === 0 ? "未选择阶段：显示全部 entry" : `已选择 ${selectedStages.length} 个阶段：任一匹配`}
        </span>
        {selectedStages.length > 0 && (
          <button onClick={clearStages} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-slate-400 hover:text-slate-950">
            清除
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        {chain.sequence.map((stage, idx) => {
          const value = cells[stage.key];
          const activeFromRow = selectedRow?.chainId === chain.id && hasSignal(value);
          const selected = selectedStages.includes(stage.key);
          const tone = STAGE_TONE[classifyCell(value)];
          return (
            <div key={stage.key} className="flex min-w-[11rem] flex-[1_1_11rem] items-stretch gap-2 lg:max-w-[14.5rem]">
              <button
                onClick={() => toggleStage(stage.key)}
                title={value || stage.label}
                className={cx(
                  "group relative flex min-h-32 min-w-0 flex-1 flex-col items-start overflow-hidden rounded-2xl border p-3 text-left transition",
                  stage.kind === "action" ? "border-dashed" : "border-solid",
                  selected && activeFromRow ? `${tone} ring-2 ring-current ring-offset-2 shadow-md` : selected ? "border-slate-950 bg-slate-950 text-white shadow-lg" : activeFromRow ? `${tone} shadow-md` : "border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md"
                )}
              >
                <span className={cx("mb-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", selected && !activeFromRow ? "bg-white/20 text-white" : stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>{stage.kind === "action" ? "action" : "object"}</span>
                <span className="max-w-full text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{stage.label}</span>
                {value && (
                  <span className="mt-2 line-clamp-3 max-w-full text-xs leading-4 opacity-80 break-words [overflow-wrap:anywhere]">{formatUiText(value)}</span>
                )}
              </button>
              {idx < chain.sequence.length - 1 && (
                <div className="flex min-h-32 shrink-0 items-center text-slate-300">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EntryCard({ row, selected, onClick, markerValue, markerValues }) {
  const signalCount = Object.values(row.cells || {}).filter(hasSignal).length;
  const markers = (markerValues || (markerValue ? [markerValue] : [])).filter(hasSignal);
  return (
    <button
      onClick={onClick}
      className={cx(
        "block w-full min-w-0 overflow-hidden rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg",
        selected ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-white text-slate-900"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatUiText(row.errorType)}</div>
          <div className={cx("mt-1 text-xs", selected ? "text-slate-300" : "text-slate-500")}>{row.chainShort || row.chainTitle}</div>
        </div>
        <span className={cx("shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold", selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600")}>{signalCount} stages</span>
      </div>
      <div className="mt-3 line-clamp-2 text-xs leading-5 opacity-80 break-words [overflow-wrap:anywhere]">{formatUiText(row.phenomenon)}</div>
      {markers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {markers.map((marker, idx) => (
            <Pill key={`${marker}-${idx}`} value={marker} compact />
          ))}
        </div>
      )}
    </button>
  );
}

function parsePaperItems(body = "") {
  return String(body)
    .split(/[;；]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function paperUrl(citation) {
  const explicitUrl = citation.match(/https?:\/\/[^\s,)]+/i)?.[0]?.replace(/[).,;]+$/, "");
  if (explicitUrl) return explicitUrl;
  const doi = citation.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0]?.replace(/[).,;]+$/, "");
  if (doi) return `https://doi.org/${doi}`;
  return null;
}

function PaperList({ icon: Icon, title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const papers = parsePaperItems(body);
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-950">
          <Icon className="h-4 w-4 shrink-0" />
          <span>{title}</span>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-black text-slate-500">
          {papers.length} 条
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {papers.length > 0 ? papers.map((paper, idx) => {
            const url = paperUrl(paper);
            const content = (
              <>
                <span className="break-words [overflow-wrap:anywhere]">{paper}</span>
                {url && <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-900" />}
              </>
            );
            return url ? (
              <a
                key={`${paper}-${idx}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-3 rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-700 transition hover:text-slate-950 hover:shadow-sm"
              >
                {content}
              </a>
            ) : (
              <div key={`${paper}-${idx}`} className="flex items-start justify-between gap-3 rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-700">
                {content}
              </div>
            );
          }) : (
            <div className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-400">暂无论文条目</div>
          )}
        </div>
      )}
    </div>
  );
}

function PaperSummary({ body }) {
  const papers = parsePaperItems(body);
  if (papers.length === 0) return <span className="text-slate-400">—</span>;
  const url = paperUrl(papers[0]);
  return (
    <div className="space-y-1">
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">{papers.length} 条</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="line-clamp-2 text-xs leading-5 text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
        >
          {papers[0]}
        </a>
      ) : (
        <span className="line-clamp-2 text-xs leading-5 text-slate-700">{papers[0]}</span>
      )}
    </div>
  );
}

function MiniChainDiagram({ row }) {
  const chain = CHAINS.find((item) => item.id === row.chainId);
  if (!chain) return null;
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
      <div className="flex min-w-max items-stretch gap-1.5">
        {chain.sequence.map((stage, idx) => {
          const value = row.cells?.[stage.key];
          const kind = classifyCell(value);
          const active = hasSignal(value);
          const tone = active ? STAGE_TONE[kind] : kind === "正常" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-500";
          return (
            <React.Fragment key={stage.key}>
              <div
                title={value || stage.label}
                className={cx(
                  "flex w-28 shrink-0 flex-col rounded-xl border px-2 py-2 text-left",
                  stage.kind === "action" ? "border-dashed" : "border-solid",
                  tone
                )}
              >
                <span className={cx("mb-1 w-fit rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase", stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
                  {stage.kind === "action" ? "action" : "object"}
                </span>
                <span className="line-clamp-2 text-[11px] font-black leading-4 break-words [overflow-wrap:anywhere]">{stage.label}</span>
                {active && (
                  <span className="mt-1 line-clamp-2 text-[10px] font-semibold leading-3 opacity-90 break-words [overflow-wrap:anywhere]">
                    {formatUiText(value)}
                  </span>
                )}
              </div>
              {idx < chain.sequence.length - 1 && (
                <div className="flex items-center text-slate-300">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function RelatedEntryChains({ rowIds = [], selectedRowId, onSelectRow, title = "对应 entry 链条展示" }) {
  const rows = rowIds.map((id) => ROW_BY_ID[id]).filter(Boolean);
  if (rows.length === 0) return null;
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
        <ListChecks className="h-4 w-4" />
        {title}
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        {rows.map((row) => {
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onSelectRow?.(row)}
              className={cx(
                "min-w-0 overflow-hidden rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg",
                selectedRowId === row.id ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-slate-50 text-slate-900"
              )}
            >
              <div className="text-xs font-black opacity-70">{row.chainShort}</div>
              <div className="mt-1 text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatUiText(row.errorType)}</div>
              <MiniChainDiagram row={row} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailPanel({ selectedRow, selectedPhenomenon, onClose, onSelectRow }) {
  const item = selectedRow || selectedPhenomenon;
  if (!item) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center text-slate-400">
          <Eye className="mb-3 h-8 w-8" />
          <div className="text-sm font-bold">点选 entry / 现象 / 链条环节后，这里显示完整解释。</div>
        </div>
      </div>
    );
  }
  const isPhen = !!selectedPhenomenon && !selectedRow;
  return (
    <div className="sticky top-4 min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {isPhen ? "phenomenon" : item.chainShort || "entry"}
          </div>
          <h3 className="text-xl font-black leading-7 text-slate-950 break-words [overflow-wrap:anywhere]">{formatUiText(isPhen ? item.name : item.errorType)}</h3>
        </div>
        <button onClick={onClose} className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"><X className="h-4 w-4" /></button>
      </div>

      {isPhen && (
        <div className="mb-4 grid gap-2 text-xs">
          <InfoLine label="可能原发动作" value={item.sourceAction} />
          <InfoLine label="原发错误产物" value={item.sourceProduct} />
          <InfoLine label="继发错误产物" value={item.derivativeProduct} />
          <InfoLine label="是否一定有 DNA 记录" value={item.dnaRecord} />
        </div>
      )}

      <div className="space-y-3">
        <InfoBlock icon={Eye} title="表现现象学" body={item.phenomenon} />
        <PaperList key={`${item.id}-phenomenon-papers`} icon={BookOpen} title="现象学论文" body={item.phenomenonPapers} defaultOpen={isPhen} />
        <InfoBlock icon={Dna} title="分子生物学机理" body={item.mechanism} />
        <PaperList key={`${item.id}-mechanism-papers`} icon={FileText} title="分子生物学机理论文" body={item.mechanismPapers} />
      </div>

      {selectedRow && (
        <div className="mt-4 rounded-3xl bg-slate-50 p-3">
          <div className="mb-2 text-xs font-black text-slate-500">本 entry 的链条阶段标记</div>
          <div className="max-h-56 space-y-2 overflow-auto pr-1">
            {Object.entries(selectedRow.cells).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(0,40%)_minmax(0,1fr)] gap-3 rounded-2xl bg-white px-3 py-2 text-xs">
                <span className="font-bold text-slate-500 break-words [overflow-wrap:anywhere]">{k}</span>
                <span className="text-right text-slate-800 break-words [overflow-wrap:anywhere]">{formatUiText(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPhenomenon?.related?.length > 0 && (
        <div className="mt-4 rounded-3xl bg-slate-50 p-3">
          <div className="mb-2 text-xs font-black text-slate-500">对应五个矩阵行 / 连锁组合</div>
          <div className="space-y-2">
            {selectedPhenomenon.related.map((id) => ROW_BY_ID[id]).filter(Boolean).map((r) => (
              <button key={r.id} type="button" onClick={() => onSelectRow?.(r)} className="w-full rounded-2xl bg-white px-3 py-2 text-left text-xs transition hover:shadow-sm">
                <div className="font-black text-slate-800">{r.chainShort}</div>
                <div className="mt-0.5 text-slate-500 break-words [overflow-wrap:anywhere]">{formatUiText(r.errorType)}</div>
                <MiniChainDiagram row={r} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2 break-words [overflow-wrap:anywhere]">
      <span className="font-black text-slate-500">{label}: </span>
      <span className="text-slate-800">{formatUiText(value)}</span>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, body }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <p className="text-sm leading-6 text-slate-600 break-words [overflow-wrap:anywhere]">{formatUiText(body)}</p>
    </div>
  );
}

function InteractiveTab({ selectedChainId, setSelectedChainId, selectedRowId, setSelectedRowId, selectedPhenomenon, setSelectedPhenomenon }) {
  const [selectedStages, setSelectedStages] = useState([]);
  const [query, setQuery] = useState("");
  const chain = CHAINS.find((c) => c.id === selectedChainId) || CHAINS[0];
  const selectedRow = ROW_BY_ID[selectedRowId];
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chain.rows
      .filter((r) => selectedStages.length === 0 || selectedStages.some((stageKey) => hasSignal(r.cells[stageKey])))
      .filter((r) => !q || `${r.errorType} ${r.phenomenon} ${r.mechanism}`.toLowerCase().includes(q));
  }, [chain, selectedStages, query]);

  const toggleStage = (stageKey) => {
    setSelectedStages((current) => current.includes(stageKey) ? current.filter((key) => key !== stageKey) : [...current, stageKey]);
  };

  const selectRow = (row) => {
    if (row.chainId !== selectedChainId) setSelectedStages([]);
    setSelectedChainId(row.chainId);
    setSelectedRowId(row.id);
    setSelectedPhenomenon(null);
  };

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="min-w-0 space-y-5">
        <ChainSelector selectedChainId={selectedChainId} setSelectedChainId={(id) => { setSelectedChainId(id); setSelectedStages([]); }} />
        <ChainFlow chain={chain} selectedRow={selectedRow} selectedStages={selectedStages} toggleStage={toggleStage} clearStages={() => setSelectedStages([])} />
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900"><Boxes className="h-4 w-4" />正选结果：链条环节 → entries</div>
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 entry / 机制 / 现象" className="min-w-0 w-full bg-transparent text-sm outline-none" />
            </div>
            <div className="mb-3 text-xs font-semibold text-slate-500 break-words [overflow-wrap:anywhere]">
              当前阶段：
              <span className="text-slate-900">{selectedStages.length === 0 ? "全部" : selectedStages.join(" / ")}</span>
            </div>
            <div className="min-w-0 max-h-[520px] space-y-3 overflow-auto pr-1">
              {rows.length > 0 ? (
                rows.map((r) => (
                  <EntryCard
                    key={r.id}
                    row={{ ...r, chainShort: chain.short }}
                    markerValues={selectedStages.map((stageKey) => r.cells[stageKey])}
                    selected={selectedRowId === r.id}
                    onClick={() => selectRow({ ...r, chainId: chain.id })}
                  />
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 px-3 py-6 text-center text-xs font-semibold leading-5 text-slate-400">
                  当前阶段没有显式源发/继发矩阵标记。
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900"><Network className="h-4 w-4" />反选结果：entry → 高亮链条</div>
            {selectedRow?.chainId === chain.id ? (
              <div className="min-w-0 space-y-3">
                <EntryCard row={selectedRow} selected onClick={() => {}} />
                <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                  {chain.sequence.map((stage) => {
                    const val = selectedRow.cells[stage.key];
                    if (!hasSignal(val)) return null;
                    return (
                      <div key={stage.key} className="min-w-0 rounded-2xl bg-slate-50 p-3">
                        <div className="mb-2 text-xs font-black text-slate-500 break-words [overflow-wrap:anywhere]">{stage.label}</div>
                        <Pill value={val} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-3xl bg-slate-50 text-center text-sm font-semibold text-slate-400">选择当前链条中的 entry 后，链条阶段会被高亮。</div>
            )}
          </div>
        </div>
        <Legend />
      </div>
      <DetailPanel selectedRow={selectedRow} selectedPhenomenon={selectedPhenomenon} onSelectRow={selectRow} onClose={() => { setSelectedRowId(null); setSelectedPhenomenon(null); }} />
    </div>
  );
}

function MatrixTable({ chain, selectedRowId, setSelectedRowId, setSelectedPhenomenon }) {
  const metaCols = ["现象", "现象的论文", "分子生物学机理", "分子生物学机理的论文"];
  const paperCols = ["现象的论文", "分子生物学机理的论文"];
  const allCols = [...chain.columns, ...metaCols];
  const getCell = (r, col) => {
    if (col === chain.columns[0]) return r.errorType;
    if (col === "现象") return r.phenomenon;
    if (col === "现象的论文") return r.phenomenonPapers;
    if (col === "分子生物学机理") return r.mechanism;
    if (col === "分子生物学机理的论文") return r.mechanismPapers;
    return r.cells[col] || "";
  };
  return (
    <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-black text-slate-950">{chain.title}</h2>
        <p className="mt-1 text-sm text-slate-600">完整展示：原矩阵全部列 + 追加四列；没有隐藏在 tooltip 中。</p>
      </div>
      <div className="max-h-[720px] overflow-auto">
        <table className="min-w-[1600px] border-separate border-spacing-0 text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              {allCols.map((c, idx) => (
                <th key={c} className={cx("border-b border-r border-slate-200 px-3 py-3 font-black text-slate-700 break-words [overflow-wrap:anywhere]", idx === 0 && "sticky left-0 z-20 bg-slate-100 min-w-64")}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chain.rows.map((r) => (
              <tr key={r.id} onClick={() => { setSelectedRowId(r.id); setSelectedPhenomenon(null); }} className={cx("cursor-pointer transition hover:bg-cyan-50", selectedRowId === r.id ? "bg-amber-50" : "bg-white")}>
                {allCols.map((c, idx) => {
                  const v = getCell(r, c);
                  const isMeta = metaCols.includes(c);
                  return (
                    <td key={c} className={cx("max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]", idx === 0 && "sticky left-0 z-[5] min-w-64 bg-inherit font-black text-slate-950")}>                      
                      {paperCols.includes(c) ? <PaperSummary body={v} /> : idx === 0 || isMeta ? <span>{formatUiText(v)}</span> : <Pill value={v || "—"} compact />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatricesTab({ selectedChainId, setSelectedChainId, selectedRowId, setSelectedRowId, selectedPhenomenon, setSelectedPhenomenon }) {
  const chain = CHAINS.find((c) => c.id === selectedChainId) || CHAINS[0];
  const selectedRow = ROW_BY_ID[selectedRowId];
  const selectRow = (row) => {
    setSelectedChainId(row.chainId);
    setSelectedRowId(row.id);
    setSelectedPhenomenon(null);
  };
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="min-w-0 space-y-5">
        <ChainSelector selectedChainId={selectedChainId} setSelectedChainId={setSelectedChainId} />
        <MatrixTable chain={chain} selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} setSelectedPhenomenon={setSelectedPhenomenon} />
      </div>
      <DetailPanel selectedRow={selectedRow} selectedPhenomenon={selectedPhenomenon} onSelectRow={selectRow} onClose={() => { setSelectedRowId(null); setSelectedPhenomenon(null); }} />
    </div>
  );
}

function PhenomenaTab({ selectedPhenomenonId, setSelectedPhenomenonId, setSelectedRowId, selectedRowId, selectedPhenomenon, setSelectedPhenomenon, setSelectedChainId }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const phenomena = PHENOMENA.filter((p) => !q || `${p.name} ${p.sourceAction} ${p.sourceProduct} ${p.derivativeProduct} ${p.mechanism}`.toLowerCase().includes(q));
  const selectedRow = ROW_BY_ID[selectedRowId];
  const choosePhen = (p) => {
    setSelectedPhenomenonId(p.id);
    setSelectedPhenomenon(p);
    setSelectedRowId(null);
  };
  const selectRow = (row) => {
    setSelectedRowId(row.id);
    setSelectedChainId(row.chainId);
  };
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="min-w-0 space-y-5">
        <div className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-slate-950">21 个现象 → 五个矩阵阶段映射</h2>
              <p className="mt-1 text-sm text-slate-600">保留原五列结构，并追加四列；点选现象后显示对应矩阵行/连锁组合。</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 md:w-80">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索现象 / 机制 / 阶段" className="min-w-0 w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div className="overflow-auto rounded-3xl border border-slate-200">
            <table className="min-w-[1450px] border-separate border-spacing-0 text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr>
                  {["观察到的终端现象", "可能原发动作", "原发错误产物", "继发错误产物", "是否一定有 DNA 记录", "现象", "现象的论文", "分子生物学机理", "分子生物学机理的论文"].map((h, idx) => (
                    <th key={h} className={cx("border-b border-r border-slate-200 px-3 py-3 font-black text-slate-700 break-words [overflow-wrap:anywhere]", idx === 0 && "sticky left-0 z-20 min-w-72 bg-slate-100")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {phenomena.map((p) => (
                  <tr key={p.id} onClick={() => choosePhen(p)} className={cx("cursor-pointer bg-white transition hover:bg-cyan-50", selectedPhenomenonId === p.id && "bg-amber-50")}>
                    <td className="sticky left-0 z-[5] min-w-72 border-b border-r border-slate-100 bg-inherit px-3 py-3 align-top font-black text-slate-950 break-words [overflow-wrap:anywhere]">{formatUiText(p.name)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatUiText(p.sourceAction)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatUiText(p.sourceProduct)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatUiText(p.derivativeProduct)}</td>
                    <td className="border-b border-r border-slate-100 px-3 py-3 align-top font-bold text-slate-700">{formatUiText(p.dnaRecord)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatUiText(p.phenomenon)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]"><PaperSummary body={p.phenomenonPapers} /></td>
                    <td className="max-w-md border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatUiText(p.mechanism)}</td>
                    <td className="max-w-xs border-b border-r border-slate-100 px-3 py-3 align-top leading-5 text-slate-700 break-words [overflow-wrap:anywhere]"><PaperSummary body={p.mechanismPapers} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedPhenomenon && (
          <RelatedEntryChains
            rowIds={selectedPhenomenon.related}
            selectedRowId={selectedRowId}
            onSelectRow={selectRow}
            title="该现象对应的 entry 链条展示"
          />
        )}
      </div>
      <DetailPanel selectedRow={selectedRow} selectedPhenomenon={selectedPhenomenon} onSelectRow={selectRow} onClose={() => { setSelectedRowId(null); setSelectedPhenomenon(null); setSelectedPhenomenonId(null); }} />
    </div>
  );
}

export default function FiveChainPhenomenaDemo() {
  const [activeTab, setActiveTab] = useState("interactive");
  const [selectedChainId, setSelectedChainId] = useState("expression");
  const [selectedRowId, setSelectedRowId] = useState("expr_splice_wrong");
  const [selectedPhenomenonId, setSelectedPhenomenonId] = useState(null);
  const [selectedPhenomenon, setSelectedPhenomenon] = useState(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_transparent_34%),radial-gradient(circle_at_top_right,_#fae8ff,_transparent_35%),linear-gradient(180deg,#f8fafc,#eef2ff)] p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            {activeTab === "interactive" && (
              <InteractiveTab
                selectedChainId={selectedChainId}
                setSelectedChainId={setSelectedChainId}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                selectedPhenomenon={selectedPhenomenon}
                setSelectedPhenomenon={setSelectedPhenomenon}
              />
            )}
            {activeTab === "matrices" && (
              <MatricesTab
                selectedChainId={selectedChainId}
                setSelectedChainId={setSelectedChainId}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                selectedPhenomenon={selectedPhenomenon}
                setSelectedPhenomenon={setSelectedPhenomenon}
              />
            )}
            {activeTab === "phenomena" && (
              <PhenomenaTab
                selectedPhenomenonId={selectedPhenomenonId}
                setSelectedPhenomenonId={setSelectedPhenomenonId}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                selectedPhenomenon={selectedPhenomenon}
                setSelectedPhenomenon={setSelectedPhenomenon}
                setSelectedChainId={setSelectedChainId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
