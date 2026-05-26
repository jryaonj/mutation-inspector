import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
  Globe2,
  Grid2X2,
  Layers3,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Network,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Search,
  Sparkles,
  Table2,
  X,
} from "lucide-react";
import { ABBR_NOTE, CHAINS, MARKER, PHENOMENA, ROW_BY_ID } from "./mutationData.js";

const UI_TEXT = {
  zh_CN: {
    language: "语言",
    "language.toggle": "切换语言",
    "tabs.interactive": "链条交互",
    "tabs.matrices": "矩阵表",
    "tabs.phenomena": "现象",
    "header.badge": "mutation inspector",
    "header.title": "突变链路观察器",
    "header.subtitle": "链条、现象、条目和论文的交互式映射。",
    "dock.search": "全局搜索条目 / 现象 / 机制 / DOI",
    "dock.entries": "{count} 条目",
    "dock.phenomena": "{count} 现象",
    "dock.chainScope": "链条",
    "dock.clear": "清空搜索",
    "rail.navigate": "导航",
    "rail.inspect": "检索与详情",
    "rail.context": "当前关系",
    "rail.chainPool": "链条待选池",
    "rail.addChain": "增加链条",
    "rail.expandRail": "展开右栏",
    "rail.collapseRail": "收起右栏",
    "rail.wide": "宽",
    "rail.narrow": "窄",
    "rail.collapseTop": "收起选择区",
    "rail.expandTop": "展开选择区",
    "rail.collapseDetail": "收起详情区",
    "rail.expandDetail": "展开详情区",
    "selection.primary": "原发",
    "selection.secondary": "继发",
    "selection.any": "未选",
    "selection.clear": "清空环节选择",
    "selection.hint": "点击环节：未选 → 继发 → 原发 → 未选；同一链条卡片内只能有一个原发，可有多个继发。卡片之间为或，卡片内为且。",
    "graph.title": "链条图",
    "graph.close": "关闭图",
    "legend.title": "标记全称",
    "chain.entries": "{count} 条目",
    "chain.filterHint": "点击多个动作/物筛选条目",
    "stage.none": "未选择阶段：显示全部条目",
    "stage.selected": "已选择 {count} 个阶段：任一匹配",
    "stage.clear": "清除",
    "stage.action": "动作",
    "stage.object": "对象",
    "entry.stages": "{count} 阶段",
    "papers.count": "{count} 篇",
    "papers.empty": "暂无论文条目",
    "detail.empty": "点选条目 / 现象 / 链条环节后，这里显示完整解释。",
    "detail.phenomenonType": "现象",
    "detail.entryType": "条目",
    "detail.sourceAction": "可能原发动作",
    "detail.sourceProduct": "原发错误产物",
    "detail.derivativeProduct": "继发错误产物",
    "detail.dnaRecord": "是否一定有 DNA 记录",
    "detail.phenomenology": "表现现象学",
    "detail.phenomenologyPapers": "现象学论文",
    "detail.mechanism": "分子生物学机理",
    "detail.mechanismPapers": "分子生物学机理论文",
    "detail.stageMarkers": "本条目的链条阶段标记",
    "detail.relatedRows": "对应五个矩阵行 / 连锁组合",
    "interactive.entryBrowser": "条目浏览",
    "interactive.resultCount": "{count} 个匹配条目",
    "interactive.currentStage": "当前阶段：",
    "interactive.all": "全部",
    "interactive.selectionScope": "{chainCount} 个链条框选 · {stageCount} 个环节条件",
    "interactive.noMarkers": "当前阶段没有显式原发/继发矩阵标记。",
    "relationship.title": "关系路径",
    "relationship.route": "原发/继发信号流",
    "relationship.openInteractive": "打开链条图",
    "relationship.selectedEntry": "当前条目",
    "relationship.selectedPhenomenon": "当前现象",
    "relationship.expand": "展开关系",
    "relationship.collapse": "收起关系",
    "relationship.noSignals": "选择当前链条中的条目后，这里只显示真正参与关系的原发/继发阶段。",
    "matrix.subtitle": "完整展示：原矩阵全部列 + 追加四列；没有隐藏在提示框中。",
    "phenomena.title": "现象 → 矩阵阶段映射",
    "phenomena.subtitle": "以卡片形式浏览终端现象；点选后在右侧查看完整机制、论文和对应链条。",
    "phenomena.resultCount": "{count} 个匹配现象",
    "phenomena.relatedCount": "{count} 条相关链条",
    "phenomena.primary": "可能原发",
    "phenomena.products": "错误产物",
    "phenomena.mechanismPreview": "机理定位",
    "phenomena.dnaRecord": "DNA 记录",
    "phenomenonContext.title": "当前选择的现象",
    "phenomenonContext.scope": "{count} 条相关链条正在驱动当前条目筛选",
    "phenomenonContext.clear": "取消现象范围",
    "phenomenonContext.source": "原发线索",
    "phenomenonContext.primaryProduct": "原发错误产物",
    "phenomenonContext.secondaryProduct": "继发错误产物",
    "phenomenonContext.related": "相关链条证据",
    "phenomenonContext.focus": "当前聚焦",
    "phenomenonContext.notes": "现象说明",
    "phenomenonContext.papers": "现象论文",
  },
  en_US: {
    language: "Language",
    "language.toggle": "Switch language",
    "tabs.interactive": "Chain Explorer",
    "tabs.matrices": "Matrices",
    "tabs.phenomena": "Phenomena",
    "header.badge": "mutation inspector",
    "header.title": "Mutation Inspector",
    "header.subtitle": "Interactive mapping across chains, phenomena, entries, and papers.",
    "dock.search": "Global search entries / phenomena / mechanisms / DOI",
    "dock.entries": "{count} entries",
    "dock.phenomena": "{count} phenomena",
    "dock.chainScope": "Chain",
    "dock.clear": "Clear search",
    "rail.navigate": "Navigate",
    "rail.inspect": "Search and Inspect",
    "rail.context": "Current Relationship",
    "rail.chainPool": "Chain Pool",
    "rail.addChain": "Add Chain",
    "rail.expandRail": "Expand rail",
    "rail.collapseRail": "Collapse rail",
    "rail.wide": "Wide",
    "rail.narrow": "Narrow",
    "rail.collapseTop": "Collapse picker",
    "rail.expandTop": "Expand picker",
    "rail.collapseDetail": "Collapse detail",
    "rail.expandDetail": "Expand detail",
    "selection.primary": "Primary",
    "selection.secondary": "Secondary",
    "selection.any": "off",
    "selection.clear": "Clear stage filters",
    "selection.hint": "Click a stage: off -> secondary -> primary -> off. One card can hold one primary and multiple secondary stages; cards are OR, stages inside a card are AND.",
    "graph.title": "Chain Graph",
    "graph.close": "Close graph",
    "legend.title": "Marker Legend",
    "chain.entries": "{count} entries",
    "chain.filterHint": "Select multiple actions/objects to filter entries",
    "stage.none": "No stage selected: showing all entries",
    "stage.selected": "{count} selected stages: any match",
    "stage.clear": "Clear",
    "stage.action": "action",
    "stage.object": "object",
    "entry.stages": "{count} stages",
    "papers.count": "{count} papers",
    "papers.empty": "No paper entries",
    "detail.empty": "Select an entry, phenomenon, or chain stage to see the full explanation here.",
    "detail.phenomenonType": "phenomenon",
    "detail.entryType": "entry",
    "detail.sourceAction": "Possible Primary Action",
    "detail.sourceProduct": "Primary Error Product",
    "detail.derivativeProduct": "Secondary Error Product",
    "detail.dnaRecord": "Always Has DNA Record?",
    "detail.phenomenology": "Phenomenology",
    "detail.phenomenologyPapers": "Phenomenology Papers",
    "detail.mechanism": "Molecular Mechanism",
    "detail.mechanismPapers": "Mechanism Papers",
    "detail.stageMarkers": "Stage Markers For This Entry",
    "detail.relatedRows": "Related Matrix Rows / Chain Combinations",
    "interactive.entryBrowser": "Entry Browser",
    "interactive.resultCount": "{count} matching entries",
    "interactive.currentStage": "Current stage: ",
    "interactive.all": "All",
    "interactive.selectionScope": "{chainCount} chain clauses · {stageCount} stage conditions",
    "interactive.noMarkers": "No explicit primary/secondary matrix markers for the current stage.",
    "relationship.title": "Relationship Route",
    "relationship.route": "Primary/secondary signal flow",
    "relationship.openInteractive": "Open chain graph",
    "relationship.selectedEntry": "Selected entry",
    "relationship.selectedPhenomenon": "Selected phenomenon",
    "relationship.expand": "Expand route",
    "relationship.collapse": "Collapse route",
    "relationship.noSignals": "Select an entry from the current chain to show only the primary/secondary stages that actually participate in the relationship.",
    "matrix.subtitle": "Full view: original matrix columns plus four added columns; no content is hidden in tooltips.",
    "phenomena.title": "Phenomena → Matrix Stages",
    "phenomena.subtitle": "Browse terminal phenomena as scannable cards. Select one to inspect the full mechanism, papers, and related chains in the side panel.",
    "phenomena.resultCount": "{count} matching phenomena",
    "phenomena.relatedCount": "{count} related chains",
    "phenomena.primary": "Possible Primary Source",
    "phenomena.products": "Error Products",
    "phenomena.mechanismPreview": "Mechanism Placement",
    "phenomena.dnaRecord": "DNA Record",
    "phenomenonContext.title": "Selected Phenomenon",
    "phenomenonContext.scope": "{count} related chains are driving the current entry filter",
    "phenomenonContext.clear": "Clear phenomenon scope",
    "phenomenonContext.source": "Primary clue",
    "phenomenonContext.primaryProduct": "Primary error product",
    "phenomenonContext.secondaryProduct": "Secondary error product",
    "phenomenonContext.related": "Related chain evidence",
    "phenomenonContext.focus": "Current focus",
    "phenomenonContext.notes": "Phenomenon notes",
    "phenomenonContext.papers": "Phenomenon papers",
  },
};

const MATRIX_META_LABELS = {
  "现象": { zh_CN: "现象", en_US: "Phenomenon" },
  "现象的论文": { zh_CN: "现象的论文", en_US: "Phenomenon Papers" },
  "分子生物学机理": { zh_CN: "分子生物学机理", en_US: "Molecular Mechanism" },
  "分子生物学机理的论文": { zh_CN: "分子生物学机理的论文", en_US: "Mechanism Papers" },
};

const DATA_TEXT_EN_REPLACEMENTS = [
  ["继发/检查/放大动作", "secondary/check/amplify action"],
  ["原发/继发信号流", "primary/secondary signal flow"],
  ["表现现象学", "phenomenology"],
  ["分子生物学机理", "molecular mechanism"],
  ["现象学论文", "phenomenology papers"],
  ["分子生物学机理论文", "mechanism papers"],
  ["是否一定有 DNA 记录", "always has DNA record"],
  ["可能原发动作", "possible primary action"],
  ["原发错误产物", "primary error product"],
  ["继发错误产物", "secondary error product"],
  ["DNA 复制/修复错误", "DNA replication/repair error"],
  ["转录读错", "transcription misread"],
  ["RNA 编辑", "RNA editing"],
  ["tRNA 错装", "tRNA mischarging"],
  ["核糖体误读", "ribosomal misreading"],
  ["蛋白某位点氨基酸改变；只有 DNA codon 改变时才是严格 missense mutation。", "amino-acid residue change in the protein; strictly a missense mutation only when a DNA codon is changed."],
  ["原发基因组改写动作", "primary genome rewrite action"],
  ["继发基因组改写动作", "secondary genome rewrite action"],
  ["基因组改写动作", "genome rewrite action"],
  ["原发出错动作", "primary error action"],
  ["原发错误产物", "primary error product"],
  ["继发错误产物", "secondary error product"],
  ["继发动作", "secondary action"],
  ["原发", "primary"],
  ["继发", "secondary"],
  ["正常", "normal"],
  ["备注", "note"],
  ["无/低", "none/low"],
  ["无", "none"],
  ["是", "yes"],
  ["不一定", "not always"],
  ["基因组", "genome"],
  ["表达", "expression"],
  ["错误", "error"],
  ["矩阵", "matrix"],
  ["链", "chain"],
  ["维护", "maintenance"],
  ["转座", "transposition"],
  ["回写", "rewrite"],
  ["逆转录", "reverse transcription"],
  ["整合", "integration"],
  ["表观", "epigenetic"],
  ["调控", "regulation"],
  ["沉默", "silencing"],
  ["甲基化", "methylation"],
  ["染色质", "chromatin"],
  ["启动子", "promoter"],
  ["增强子", "enhancer"],
  ["复制", "replication"],
  ["修复", "repair"],
  ["筛选", "selection"],
  ["漂变", "drift"],
  ["固定记录", "fixed record"],
  ["终产物", "final product"],
  ["转录", "transcription"],
  ["剪接", "splicing"],
  ["加帽", "capping"],
  ["出核/定位", "export/localization"],
  ["翻译/监控", "translation/surveillance"],
  ["折叠", "folding"],
  ["糖基化", "glycosylation"],
  ["定位", "localization"],
  ["细胞分裂/配子形成", "cell division/gamete formation"],
  ["亲代", "parental"],
  ["可遗传", "heritable"],
  ["宿主", "host"],
  ["靶位点", "target site"],
  ["切割", "cleavage"],
  ["插入", "insertion"],
  ["连接", "ligation"],
  ["中间体", "intermediate"],
  ["状态", "state"],
  ["装配", "assembly"],
  ["许可", "permission"],
  ["长期", "long-term"],
  ["腐烂", "decay"],
];

const EN_EXACT_TEXT = {
  "表达链": "Expression Chain",
  "基因组维护链": "Genome Maintenance Chain",
  "转座链": "Transposition Chain",
  "RNA 回写链": "RNA Rewrite Chain",
  "表观调控链": "Epigenetic Regulation Chain",
  "1A. 表达链错误矩阵": "1A. Expression Chain Error Matrix",
  "2A. 基因组维护链错误矩阵": "2A. Genome Maintenance Error Matrix",
  "3A. 转座链错误矩阵": "3A. Transposition Error Matrix",
  "4A. 逆转录整合链错误矩阵": "4A. Reverse-Transcription Integration Error Matrix",
  "5A. 表观调控链错误矩阵": "5A. Epigenetic Regulation Error Matrix",
  "基因组 → RNA → 蛋白 → 终产物；这条链通常产生表达层读数，不必然产生 DNA 记录。": "Genome -> RNA -> protein -> final product; this chain usually produces expression-level readouts and does not necessarily create a DNA record.",
  "亲代 DNA → 复制/修复 → allele → 固定记录；这条链定义可遗传 DNA 记录。": "Parental DNA -> replication/repair -> allele -> fixed record; this chain defines heritable DNA records.",
  "TE locus → TE 中间体 → 插入/修复 → 新基因组；解释 TE 造成的 genome disruption。": "TE locus -> TE intermediate -> insertion/repair -> new genome; explains TE-mediated genome disruption.",
  "RNA 或 retroelement → cDNA → 整合；解释 processed pseudogene、retrovirus、template switching。": "RNA or retroelement -> cDNA -> integration; explains processed pseudogenes, retroviruses, and template switching.",
  "DNA 序列可不变，染色质/甲基化/核小体状态改变，继发改变转录输出。": "DNA sequence may remain unchanged while chromatin, methylation, or nucleosome state changes and secondarily alters transcription output.",
  "基因组DNA": "Genomic DNA",
  "转录": "Transcription",
  "5′加帽": "5′ capping",
  "剪接": "Splicing",
  "RNA编辑": "RNA editing",
  "3′切割/polyA": "3′ cleavage/polyA",
  "出核/定位": "Export/localization",
  "翻译/监控": "Translation/surveillance",
  "折叠": "Folding",
  "PTM/糖基化/定位": "PTM/glycosylation/localization",
  "终产物": "Final product",
  "亲代基因组DNA": "Parental genomic DNA",
  "复制": "Replication",
  "复制中间体": "Replication intermediate",
  "修复": "Repair",
  "修复后DNA": "Repaired DNA",
  "细胞分裂/配子形成": "Cell division/gamete formation",
  "可遗传 allele": "Heritable allele",
  "筛选/漂变": "Selection/drift",
  "固定记录": "Fixed record",
  "宿主基因组/TE locus": "Host genome/TE locus",
  "TE激活/表达或切出": "TE activation/expression or excision",
  "TE中间体": "TE intermediate",
  "靶位点切割/插入": "Target-site cleavage/insertion",
  "插入中间体": "Insertion intermediate",
  "宿主修复/连接": "Host repair/ligation",
  "新基因组": "New genome",
  "外源基因组/host mRNA/retroelement": "Exogenous genome/host mRNA/retroelement",
  "转录或进入细胞": "Transcription or cell entry",
  "整合": "Integration",
  "宿主新基因组": "New host genome",
  "沉默/破碎/驯化": "Silencing/fragmentation/domestication",
  "DNA+染色质": "DNA + chromatin",
  "甲基化/组蛋白/核小体": "Methylation/histone/nucleosome",
  "染色质状态": "Chromatin state",
  "TF/PIC装配": "TF/PIC assembly",
  "转录许可状态": "Transcription permission state",
  "pre-mRNA/无转录本": "pre-mRNA/no transcript",
  "转录读错模板碱基": "Template-base transcription misread",
  "RNA Pol II 卡住，产生截短/失败转录本": "RNA Pol II stalls, producing truncated/failed transcripts",
  "5′ cap 加帽失败": "5′ cap formation failure",
  "剪接体选错 splice site": "Spliceosome selects the wrong splice site",
  "DNA splice motif 坏导致错剪": "Broken DNA splice motif causes aberrant splicing",
  "RNA 编辑错误 / off-target editing": "RNA editing error / off-target editing",
  "3′切割/polyA 错位": "3′ cleavage/polyA mispositioning",
  "mRNA 出核/定位错误": "mRNA export/localization error",
  "NMD 触发": "NMD activation",
  "核糖体误读 codon": "Ribosomal codon misreading",
  "tRNA 错氨酰化": "tRNA misacylation",
  "翻译移码 / ribosomal frameshift": "Translational frameshift / ribosomal frameshift",
  "共翻译折叠失败": "Co-translational folding failure",
  "蛋白折叠/QC 错误": "Protein folding/QC error",
  "糖基化/PTM/定位错误": "Glycosylation/PTM/localization error",
  "复制时碱基误掺入": "Base misincorporation during replication",
  "复制滑移导致小 indel": "Replication slippage causing small indels",
  "5mC 脱氨成 T": "5mC deamination to T",
  "氧化损伤 8-oxoG 等": "Oxidative damage such as 8-oxoG",
  "MMR 选错链/漏修": "MMR wrong-strand choice or missed repair",
  "BER 修复错误": "BER repair error",
  "NER/TCR 修复错误": "NER/TCR repair error",
  "DSB 后 NHEJ 误接": "NHEJ misjoining after DSB",
  "MMEJ 微同源误修": "MMEJ microhomology-mediated misrepair",
  "HR 使用错误模板": "HR uses the wrong template",
  "NAHR 非等位同源重组": "NAHR non-allelic homologous recombination",
  "TE 插入 exon": "TE insertion into exon",
  "TE 插入 intron 产生 cryptic splice site": "TE insertion into intron creates a cryptic splice site",
  "TE 插入 promoter/enhancer": "TE insertion into promoter/enhancer",
  "TE 介导 deletion/duplication": "TE-mediated deletion/duplication",
  "processed pseudogene：host mRNA 被写回": "Processed pseudogene: host mRNA written back",
  "retrovirus 整合": "Retrovirus integration",
  "内源 retroelement 扩增": "Endogenous retroelement expansion",
  "逆转录错误导致突变副本": "Reverse-transcription error creates a mutant copy",
  "病毒/retroelement template switching 造成嵌合插入": "Viral/retroelement template switching creates chimeric insertion",
  "纯表观沉默": "Pure epigenetic silencing",
  "TE 去沉默": "TE desilencing",
  "启动子甲基化导致沉默": "Promoter methylation causes silencing",
  "增强子开放错误": "Enhancer accessibility error",
  "长期沉默后的序列腐烂": "Sequence decay after long-term silencing",
  "低表达 / 沉默表型": "Low-expression / silencing phenotype",
  "exon skipping 表型": "Exon skipping phenotype",
  "intron retention 表型": "Intron retention phenotype",
  "cryptic exon / cryptic splice 表型": "Cryptic exon / cryptic splice phenotype",
  "deletion / 缺失表型": "Deletion phenotype",
  "duplication / gene duplication 表型": "Duplication / gene duplication phenotype",
  "retroviral / endogenous retrovirus insertion 表型": "Retroviral / endogenous retrovirus insertion phenotype",
};

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

function interpolate(text, values = {}) {
  return String(text).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function formatUiText(value = "", locale = "zh_CN") {
  let text = String(value).replaceAll("源发", "原发").replaceAll("寄发", "继发");
  if (locale !== "en_US") return text;
  text = EN_EXACT_TEXT[text] || text;
  DATA_TEXT_EN_REPLACEMENTS.forEach(([from, to]) => {
    text = text.replaceAll(from, to);
  });
  return text
    .replace(/[\u3400-\u9fff]/g, "")
    .replace(/\b(\d+)\.\s*\/\s*/g, "$1. ")
    .replace(/\s*([,;:/.()→+])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,;:/.()])/g, "$1")
    .replace(/^\s*[/:;,.|+-]+\s*/, "")
    .trim() || "See source data";
}

function labelForColumn(column, locale) {
  return MATRIX_META_LABELS[column]?.[locale] || column;
}

const I18nContext = React.createContext(null);

function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window === "undefined") return "zh_CN";
    return window.localStorage.getItem("mutation-inspector-locale") || "zh_CN";
  });
  const setLocale = (nextLocale) => {
    setLocaleState(nextLocale);
    if (typeof window !== "undefined") window.localStorage.setItem("mutation-inspector-locale", nextLocale);
  };
  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key, values) => interpolate(UI_TEXT[locale]?.[key] || UI_TEXT.en_US[key] || key, values),
    formatText: (text) => formatUiText(text, locale),
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  return React.useContext(I18nContext);
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

function normalizeSearch(value = "") {
  return String(value).trim().toLowerCase();
}

function entrySearchText(row) {
  return `${row.errorType} ${row.chainTitle || ""} ${row.chainShort || ""} ${row.phenomenon} ${row.mechanism} ${row.phenomenonPapers} ${row.mechanismPapers} ${Object.values(row.cells || {}).join(" ")}`.toLowerCase();
}

function phenomenonSearchText(phenomenon) {
  return `${phenomenon.name} ${phenomenon.sourceAction} ${phenomenon.sourceProduct} ${phenomenon.derivativeProduct} ${phenomenon.dnaRecord} ${phenomenon.phenomenon} ${phenomenon.mechanism} ${phenomenon.phenomenonPapers} ${phenomenon.mechanismPapers}`.toLowerCase();
}

function rowSignalEntries(row, chain) {
  if (!row || !chain || row.chainId !== chain.id) return [];
  return chain.sequence
    .map((stage) => ({ stage, value: row.cells?.[stage.key] }))
    .filter((item) => hasSignal(item.value));
}

function cellRoles(value = "") {
  const text = String(value).replaceAll("源发", "原发").replaceAll("寄发", "继发");
  const roles = new Set();
  if (text.includes("原发") || text.includes("基因组改写动作")) roles.add("primary");
  if (text.includes("继发")) roles.add("secondary");
  return roles;
}

function clauseStageSelections(stageSelections, clauseId) {
  return Object.entries(stageSelections?.[clauseId] || {}).map(([stageKey, role]) => ({ stageKey, role }));
}

function clauseMatchesRow(row, clause, stageSelections) {
  if (!clause || row.chainId !== clause.chainId) return false;
  const selections = clauseStageSelections(stageSelections, clause.id);
  if (selections.length === 0) return true;
  return selections.every(({ stageKey, role }) => cellRoles(row.cells?.[stageKey]).has(role));
}

function rowMatchesClauses(row, chainClauses, stageSelections) {
  if (!chainClauses.length) return true;
  return chainClauses.some((clause) => clauseMatchesRow(row, clause, stageSelections));
}

function rowMatchedMarkerValues(row, chainClauses, stageSelections) {
  const matchedValues = [];
  const clauses = chainClauses.filter((clause) => clause.chainId === row.chainId);
  clauses.forEach((clause) => {
    const selections = clauseStageSelections(stageSelections, clause.id);
    selections.forEach(({ stageKey, role }) => {
      const value = row.cells?.[stageKey];
      if (cellRoles(value).has(role)) matchedValues.push(value);
    });
  });
  const uniqueMatches = [...new Set(matchedValues.filter(Boolean))];
  if (uniqueMatches.length > 0) return uniqueMatches.slice(0, 6);
  return [...new Set(Object.values(row.cells || {}).filter(hasSignal))].slice(0, 5);
}

function mergedStageSelectionsForChain(stageSelections, chainClauses, chainId) {
  const merged = {};
  chainClauses.filter((clause) => clause.chainId === chainId).forEach((clause) => {
    Object.entries(stageSelections?.[clause.id] || {}).forEach(([stageKey, role]) => {
      merged[stageKey] = merged[stageKey] === "primary" ? "primary" : role;
    });
  });
  return merged;
}

function makeChainClause(chainId) {
  return { id: `${chainId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, chainId };
}

function railWidthRem({ railWide, topCollapsed, pickerCompact, railCollapsed }) {
  if (railCollapsed) return 0;
  if (topCollapsed) return 22;
  if (railWide) return 36;
  if (pickerCompact) return 22;
  return 28;
}

function cleanPhenomenonName(value = "") {
  return String(value).replace(/^\s*\d+\s*[.、]\s*/, "").trim();
}

function selectionTone(role) {
  return role === "primary"
    ? "border-rose-300 bg-rose-50 text-rose-900 ring-rose-200"
    : role === "secondary"
      ? "border-sky-300 bg-sky-50 text-sky-900 ring-sky-200"
      : "border-slate-200 bg-white text-slate-600 ring-slate-100";
}

function Pill({ value, compact = false }) {
  const { formatText } = useI18n();
  const kind = classifyCell(value);
  return (
    <span className={cx(
      "inline-block max-w-full rounded-full ring-1 font-medium whitespace-normal break-words [overflow-wrap:anywhere]",
      compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
      MARKER[kind] || "bg-slate-100 text-slate-700 ring-slate-200"
    )}>
      {formatText(value || "—")}
    </span>
  );
}

function Header({ activeTab, setActiveTab }) {
  const { locale, setLocale, t } = useI18n();
  const tabs = [
    ["interactive", t("tabs.interactive"), MousePointerClick],
    ["matrices", t("tabs.matrices"), Table2],
    ["phenomena", t("tabs.phenomena"), Grid2X2],
  ];
  return (
    <div className="rounded-xl border border-blue-100 bg-white/95 px-3 py-2.5 shadow-sm shadow-blue-900/5 backdrop-blur md:px-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-800 p-2 text-xs font-black text-white shadow-sm shadow-blue-900/20 sm:px-2.5 sm:py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("header.badge")}</span>
          </div>
          <h1 className="min-w-0 truncate text-base font-black tracking-tight text-slate-950 md:text-lg">
            {t("header.title")}
          </h1>
        </div>
        <div className="hidden min-w-0 flex-1 justify-center xl:flex">
          <div className="flex max-w-full gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => setActiveTab(id)}
                className={cx(
                  "inline-flex min-w-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black transition",
                  activeTab === id ? "bg-blue-800 text-white shadow-sm shadow-blue-900/15" : "text-slate-500 hover:bg-white hover:text-slate-950"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label={t("language.toggle")}
          title={t("language.toggle")}
          onClick={() => setLocale(locale === "zh_CN" ? "en_US" : "zh_CN")}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-2.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-blue-800"
        >
          <Globe2 className="h-3.5 w-3.5" />
          <span>{locale === "zh_CN" ? "简" : "EN"}</span>
        </button>
      </div>
    </div>
  );
}

function Legend() {
  const { t, formatText } = useI18n();
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
        <BookOpen className="h-4 w-4" />
        {t("legend.title")}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ABBR_NOTE.map(([abbr, full]) => (
          <div key={abbr} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs">
            <span className="font-mono font-bold text-slate-500">{abbr}</span>
            <span className="font-semibold text-slate-800">{formatText(full)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainSelector({ selectedChainId, setSelectedChainId }) {
  const { t, formatText } = useI18n();
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {CHAINS.map((chain) => {
        const Icon = CHAIN_ICONS[chain.icon] || Activity;
        const active = chain.id === selectedChainId;
        return (
          <button
            key={chain.id}
            onClick={() => setSelectedChainId(chain.id)}
            className={cx(
              "group cursor-pointer rounded-xl border p-3 text-left transition duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/10",
              active ? "border-blue-800 bg-blue-900 text-white shadow-md shadow-blue-900/20" : "border-slate-200 bg-white text-slate-900"
            )}
          >
            <div className={cx("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br text-white", chain.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-black">{formatText(chain.short)}</div>
            <div className={cx("mt-1 text-xs leading-5", active ? "text-slate-300" : "text-slate-500")}>{t("chain.entries", { count: chain.rows.length })}</div>
          </button>
        );
      })}
    </div>
  );
}

function ChainFlow({ chain, selectedRow, selectedStages, toggleStage, clearStages }) {
  const { t, formatText } = useI18n();
  const cells = selectedRow?.chainId === chain.id ? selectedRow.cells : {};
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-900/5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950">{formatText(chain.title)}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{formatText(chain.description)}</p>
        </div>
        <div className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">{t("chain.filterHint")}</div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="rounded-md bg-slate-100 px-3 py-1">
          {selectedStages.length === 0 ? t("stage.none") : t("stage.selected", { count: selectedStages.length })}
        </span>
        {selectedStages.length > 0 && (
          <button onClick={clearStages} className="rounded-md border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-slate-400 hover:text-slate-950">
            {t("stage.clear")}
          </button>
        )}
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {chain.sequence.map((stage, idx) => {
          const value = cells[stage.key];
          const activeFromRow = selectedRow?.chainId === chain.id && hasSignal(value);
          const selected = selectedStages.includes(stage.key);
          const tone = STAGE_TONE[classifyCell(value)];
          return (
            <button
              key={stage.key}
              onClick={() => toggleStage(stage.key)}
              title={value || stage.label}
              className={cx(
                "group grid min-h-28 min-w-0 cursor-pointer grid-cols-[2.1rem_minmax(0,1fr)] gap-3 rounded-xl border p-3 text-left transition duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/10",
                stage.kind === "action" ? "border-dashed" : "border-solid",
                selected && activeFromRow ? `${tone} ring-2 ring-current ring-offset-2 shadow-md` : selected ? "border-blue-800 bg-blue-900 text-white shadow-lg shadow-blue-900/20" : activeFromRow ? `${tone} shadow-md` : "border-slate-200 bg-slate-50"
              )}
            >
              <div className={cx(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs font-black",
                selected ? "bg-white/20 text-current" : activeFromRow ? "bg-white/70 text-current" : "bg-white text-slate-500"
              )}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className={cx("rounded px-2 py-0.5 text-[10px] font-black uppercase", selected && !activeFromRow ? "bg-white/20 text-white" : stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>{stage.kind === "action" ? t("stage.action") : t("stage.object")}</span>
                  {activeFromRow && <Pill value={value} compact />}
                </div>
                <div className="text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</div>
                {value && !activeFromRow && (
                  <div className="mt-2 line-clamp-2 text-xs leading-4 opacity-70 break-words [overflow-wrap:anywhere]">{formatText(value)}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RelationshipRoute({ chain, selectedRow }) {
  const { t, formatText } = useI18n();
  const signals = rowSignalEntries(selectedRow, chain);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Network className="h-4 w-4" />
            {t("relationship.title")}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{t("relationship.route")}</div>
        </div>
        {signals.length > 0 && (
          <div className="min-w-0 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 break-words [overflow-wrap:anywhere]">
            {formatText(selectedRow.chainShort || chain.short)} · {formatText(selectedRow.errorType)}
          </div>
        )}
      </div>
      {signals.length > 0 ? (
        <div className="grid min-w-0 gap-2 lg:grid-cols-2 2xl:grid-cols-3">
          {signals.map(({ stage, value }, idx) => (
            <div key={stage.key} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-black text-slate-500">{idx + 1}</div>
              <div className="min-w-0 space-y-2">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className={cx("rounded px-1.5 py-0.5 text-[9px] font-black uppercase", stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>{stage.kind === "action" ? t("stage.action") : t("stage.object")}</span>
                  {idx < signals.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
                </div>
                <div className="text-xs font-black text-slate-700 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</div>
                <Pill value={value} compact />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-slate-50 px-3 py-4 text-sm font-semibold leading-6 text-slate-400">
          {t("relationship.noSignals")}
        </div>
      )}
    </div>
  );
}

function EntryCard({ row, selected, onClick, markerValue, markerValues }) {
  const { t, formatText } = useI18n();
  const signalCount = Object.values(row.cells || {}).filter(hasSignal).length;
  const markers = (markerValues || (markerValue ? [markerValue] : [])).filter(hasSignal);
  return (
    <button
      onClick={onClick}
      className={cx(
        "block w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border p-4 text-left transition duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/10",
        selected ? "border-blue-800 bg-blue-900 text-white shadow-md shadow-blue-900/20" : "border-slate-200 bg-white text-slate-900"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatText(row.errorType)}</div>
          <div className={cx("mt-1 text-xs", selected ? "text-slate-300" : "text-slate-500")}>{formatText(row.chainShort || row.chainTitle)}</div>
        </div>
        <span className={cx("shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold", selected ? "bg-amber-300 text-blue-950" : "bg-blue-50 text-blue-700")}>{t("entry.stages", { count: signalCount })}</span>
      </div>
      <div className="mt-3 line-clamp-2 text-xs leading-5 opacity-80 break-words [overflow-wrap:anywhere]">{formatText(row.phenomenon)}</div>
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

function SignalPathSummary({ row, expanded = false }) {
  const { formatText } = useI18n();
  const chain = CHAINS.find((item) => item.id === row.chainId);
  const signals = rowSignalEntries(row, chain);
  if (!chain || signals.length === 0) return null;
  const preview = expanded ? signals : signals.slice(0, 3);
  const hiddenCount = signals.length - preview.length;
  return (
    <div className="mt-2 flex min-w-0 flex-wrap gap-1.5">
      {preview.map(({ stage, value }) => (
        <span
          key={stage.key}
          className={cx(
            "inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-black",
            stage.kind === "action" ? "border-dashed" : "border-solid",
            STAGE_TONE[classifyCell(value)]
          )}
          title={`${formatText(stage.label)} · ${formatText(value)}`}
        >
          <span className="min-w-0 break-words leading-3 [overflow-wrap:anywhere]">{formatText(stage.label)}</span>
          <span className="shrink-0 opacity-70">·</span>
          <span className="shrink-0">{formatText(classifyCell(value))}</span>
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">+{hiddenCount}</span>
      )}
    </div>
  );
}

function CompactPaperStrip({ title, body }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const papers = parsePaperItems(body);
  const shownPapers = open ? papers : papers.slice(0, 1);
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-white p-2.5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full min-w-0 items-center justify-between gap-2 rounded-md px-1 py-1 text-left transition hover:bg-slate-50">
        <span className="min-w-0 text-[11px] font-black uppercase leading-4 text-slate-500 break-words [overflow-wrap:anywhere]">{title}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">
            {t("papers.count", { count: papers.length })}
          </span>
          <ChevronRight className={cx("h-3.5 w-3.5 text-slate-400 transition", open ? "rotate-90" : "")} />
        </span>
      </button>
      <div className="mt-2 space-y-1.5">
        {shownPapers.length > 0 ? shownPapers.map((paper, idx) => {
          const url = paperUrl(paper);
          const content = (
            <>
              <span className="line-clamp-2 min-w-0 break-words [overflow-wrap:anywhere]">{paper}</span>
              {url && <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />}
            </>
          );
          return url ? (
            <a
              key={`${paper}-${idx}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-start justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] leading-4 text-slate-700 transition hover:text-slate-950"
            >
              {content}
            </a>
          ) : (
            <div key={`${paper}-${idx}`} className="flex min-w-0 items-start justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] leading-4 text-slate-700">
              {content}
            </div>
          );
        }) : (
          <div className="rounded-md bg-slate-50 px-2 py-1.5 text-[11px] font-semibold text-slate-400">{t("papers.empty")}</div>
        )}
      </div>
    </div>
  );
}

function PhenomenonContextPanel({ phenomenon, selectedRow, onSelectRow, onClear }) {
  const { t, formatText } = useI18n();
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  useEffect(() => {
    if (phenomenon) setEvidenceOpen(true);
  }, [phenomenon?.id]);
  if (!phenomenon) return null;
  const relatedRows = (phenomenon.related || []).map((id) => ROW_BY_ID[id]).filter(Boolean);
  const title = formatText(cleanPhenomenonName(phenomenon.name));
  return (
    <section className="min-w-0 rounded-xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-900/5">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-blue-800 px-2.5 py-1 text-xs font-black text-white">
              <Grid2X2 className="h-3.5 w-3.5" />
              {t("phenomenonContext.title")}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{t("phenomena.dnaRecord")}: {formatText(phenomenon.dnaRecord)}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{t("phenomenonContext.scope", { count: relatedRows.length })}</span>
          </div>
          <h2 className="mt-2 text-[clamp(1.05rem,1.8vw,1.55rem)] font-black leading-tight text-slate-950 break-words [overflow-wrap:anywhere]">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
        >
          <X className="h-3.5 w-3.5" />
          {t("phenomenonContext.clear")}
        </button>
      </div>

      <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <div className="min-w-0 space-y-2">
          <div className="grid min-w-0 gap-1.5">
            {[
              [t("phenomenonContext.source"), phenomenon.sourceAction, "border-rose-200 bg-rose-50 text-rose-950"],
              [t("phenomenonContext.primaryProduct"), phenomenon.sourceProduct, "border-orange-200 bg-orange-50 text-orange-950"],
              [t("phenomenonContext.secondaryProduct"), phenomenon.derivativeProduct, "border-violet-200 bg-violet-50 text-violet-950"],
            ].map(([label, value, tone]) => (
              <div key={label} className={cx("grid min-w-0 grid-cols-[minmax(5.5rem,8rem)_minmax(0,1fr)] gap-3 rounded-lg border px-3 py-2", tone)}>
                <div className="text-[10px] font-black uppercase leading-4 opacity-70">{label}</div>
                <div className="text-xs font-semibold leading-5 break-words [overflow-wrap:anywhere]">{formatText(value)}</div>
              </div>
            ))}
          </div>
          <div className="grid min-w-0 gap-2 lg:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 text-[11px] font-black uppercase text-slate-500">{t("phenomenonContext.notes")}</div>
              <p className="line-clamp-4 text-xs leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatText(phenomenon.phenomenon)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-1 text-[11px] font-black uppercase text-slate-500">{t("detail.mechanism")}</div>
              <p className="line-clamp-4 text-xs leading-5 text-slate-700 break-words [overflow-wrap:anywhere]">{formatText(phenomenon.mechanism)}</p>
            </div>
          </div>
          <div className="grid min-w-0 gap-2 lg:grid-cols-2">
            <CompactPaperStrip title={t("phenomenonContext.papers")} body={phenomenon.phenomenonPapers} />
            <CompactPaperStrip title={t("detail.mechanismPapers")} body={phenomenon.mechanismPapers} />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
          <button
            type="button"
            onClick={() => setEvidenceOpen((value) => !value)}
            className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-white"
          >
            <span className="flex min-w-0 items-center gap-2 text-[11px] font-black uppercase text-slate-500">
              <Network className="h-3.5 w-3.5 shrink-0 text-blue-700" />
              <span className="min-w-0 leading-4 break-words [overflow-wrap:anywhere]">{t("phenomenonContext.related")}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-blue-700">
                {t("phenomena.relatedCount", { count: relatedRows.length })}
              </span>
              <ChevronRight className={cx("h-3.5 w-3.5 text-slate-400 transition", evidenceOpen ? "rotate-90" : "")} />
            </span>
          </button>
          {evidenceOpen && (
            <div className="mt-2 grid min-w-0 gap-2 2xl:grid-cols-2">
              {relatedRows.map((row) => {
                const selected = selectedRow?.id === row.id;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => onSelectRow?.(row)}
                    className={cx(
                      "min-w-0 cursor-pointer rounded-lg border p-2.5 text-left transition duration-200 hover:border-blue-200 hover:shadow-sm hover:shadow-blue-900/10",
                      selected ? "border-blue-800 bg-blue-900 text-white shadow-sm shadow-blue-900/20" : "border-slate-200 bg-white text-slate-900"
                    )}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={cx("text-[11px] font-black", selected ? "text-slate-300" : "text-slate-500")}>{formatText(row.chainShort)}</div>
                        <div className="mt-0.5 text-xs font-black leading-5 break-words [overflow-wrap:anywhere]">{formatText(row.errorType)}</div>
                      </div>
                      {selected && <span className="shrink-0 rounded-full bg-white/15 px-2 py-1 text-[10px] font-black">{t("phenomenonContext.focus")}</span>}
                    </div>
                    <SignalPathSummary row={row} expanded />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
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
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultOpen);
  const papers = parsePaperItems(body);
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-950">
          <Icon className="h-4 w-4 shrink-0" />
          <span>{title}</span>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-black text-slate-500">
          {t("papers.count", { count: papers.length })}
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
                className="group flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-700 transition hover:text-slate-950 hover:shadow-sm"
              >
                {content}
              </a>
            ) : (
              <div key={`${paper}-${idx}`} className="flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-700">
                {content}
              </div>
            );
          }) : (
            <div className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-400">{t("papers.empty")}</div>
          )}
        </div>
      )}
    </div>
  );
}

function PaperSummary({ body }) {
  const { t } = useI18n();
  const papers = parsePaperItems(body);
  if (papers.length === 0) return <span className="text-slate-400">—</span>;
  const url = paperUrl(papers[0]);
  return (
    <div className="space-y-1">
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">{t("papers.count", { count: papers.length })}</span>
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
  const { t, formatText } = useI18n();
  const chain = CHAINS.find((item) => item.id === row.chainId);
  if (!chain) return null;
  return (
      <div className="mt-3 rounded-md border border-slate-200 bg-white p-2">
        <div className="flex flex-wrap items-stretch gap-1.5">
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
                  "flex min-w-0 flex-[1_1_7rem] flex-col rounded-md border px-2 py-2 text-left sm:flex-none",
                  stage.kind === "action" ? "border-dashed" : "border-solid",
                  tone
                )}
              >
                <span className={cx("mb-1 w-fit rounded px-1.5 py-0.5 text-[9px] font-black uppercase", stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
                  {stage.kind === "action" ? t("stage.action") : t("stage.object")}
                </span>
                <span className="line-clamp-2 text-[11px] font-black leading-4 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</span>
                {active && (
                  <span className="mt-1 line-clamp-2 text-[10px] font-semibold leading-3 opacity-90 break-words [overflow-wrap:anywhere]">
                    {formatText(value)}
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

function DetailPanel({ selectedRow, selectedPhenomenon, onClose, onSelectRow, rail = false }) {
  const { t, formatText } = useI18n();
  const item = selectedRow || selectedPhenomenon;
  if (!item) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center text-slate-400">
          <Eye className="mb-3 h-8 w-8" />
          <div className="text-sm font-bold">{t("detail.empty")}</div>
        </div>
      </div>
    );
  }
  const isPhen = !!selectedPhenomenon && !selectedRow;
  const itemChain = selectedRow ? CHAINS.find((chain) => chain.id === selectedRow.chainId) : null;
  const detailSignals = rowSignalEntries(selectedRow, itemChain);
  return (
    <div className={cx(rail ? "min-w-0" : "sticky top-4 min-w-0 rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-900/5")}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-black text-blue-800">
            {isPhen ? t("detail.phenomenonType") : formatText(item.chainShort || t("detail.entryType"))}
          </div>
          <h3 className="text-xl font-black leading-7 text-slate-950 break-words [overflow-wrap:anywhere]">{formatText(isPhen ? cleanPhenomenonName(item.name) : item.errorType)}</h3>
        </div>
        <button onClick={onClose} className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"><X className="h-4 w-4" /></button>
      </div>

      {isPhen && (
        <div className="mb-4 grid gap-2 text-xs">
          <InfoLine label={t("detail.sourceAction")} value={item.sourceAction} />
          <InfoLine label={t("detail.sourceProduct")} value={item.sourceProduct} />
          <InfoLine label={t("detail.derivativeProduct")} value={item.derivativeProduct} />
          <InfoLine label={t("detail.dnaRecord")} value={item.dnaRecord} />
        </div>
      )}

      <div className="space-y-3">
        <InfoBlock icon={Eye} title={t("detail.phenomenology")} body={item.phenomenon} />
        <PaperList key={`${item.id}-phenomenon-papers`} icon={BookOpen} title={t("detail.phenomenologyPapers")} body={item.phenomenonPapers} defaultOpen={isPhen} />
        <InfoBlock icon={Dna} title={t("detail.mechanism")} body={item.mechanism} />
        <PaperList key={`${item.id}-mechanism-papers`} icon={FileText} title={t("detail.mechanismPapers")} body={item.mechanismPapers} />
      </div>

      {selectedRow && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
          <div className="mb-2 text-xs font-black text-slate-500">{t("detail.stageMarkers")}</div>
          <div className="max-h-56 space-y-2 overflow-auto pr-1">
            {detailSignals.map(({ stage, value }) => (
              <div key={stage.key} className="grid grid-cols-[minmax(0,40%)_minmax(0,1fr)] gap-3 rounded-md bg-white px-3 py-2 text-xs">
                <span className="font-bold text-slate-500 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</span>
                <span className="text-right text-slate-800 break-words [overflow-wrap:anywhere]">{formatText(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPhen && selectedPhenomenon?.related?.length > 0 && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <div className="mb-2 text-xs font-black text-slate-500">{t("detail.relatedRows")}</div>
          <div className="space-y-2">
            {selectedPhenomenon.related.map((id) => ROW_BY_ID[id]).filter(Boolean).map((r) => (
              <button key={r.id} type="button" onClick={() => onSelectRow?.(r)} className="w-full rounded-md bg-white px-3 py-2 text-left text-xs transition hover:shadow-sm">
                <div className="font-black text-slate-800">{formatText(r.chainShort)}</div>
                <div className="mt-0.5 text-slate-500 break-words [overflow-wrap:anywhere]">{formatText(r.errorType)}</div>
                <MiniChainDiagram row={r} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MainDetailPanel({ selectedRow, selectedPhenomenon, onClose, onSelectRow }) {
  if (!selectedRow && !selectedPhenomenon) return null;
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-900/5">
      <DetailPanel
        selectedRow={selectedRow}
        selectedPhenomenon={selectedPhenomenon}
        onClose={onClose}
        onSelectRow={onSelectRow}
        rail
      />
    </div>
  );
}

function InfoLine({ label, value }) {
  const { formatText } = useI18n();
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2 break-words [overflow-wrap:anywhere]">
      <span className="font-black text-slate-500">{label}: </span>
      <span className="text-slate-800">{formatText(value)}</span>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, body }) {
  const { formatText } = useI18n();
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <p className="text-sm leading-6 text-slate-600 break-words [overflow-wrap:anywhere]">{formatText(body)}</p>
    </div>
  );
}

function InteractiveTab({ setSelectedChainId, selectedRowId, setSelectedRowId, selectedPhenomenon, globalQuery, chainClauses, stageSelections, onClearPhenomenon, onFocusClause }) {
  const { t } = useI18n();
  const selectedRow = ROW_BY_ID[selectedRowId];
  const allRows = useMemo(() => CHAINS.flatMap((chain) => chain.rows.map((row) => ({ ...row, chainId: chain.id, chainShort: chain.short, chainTitle: chain.title }))), []);
  const rows = useMemo(() => {
    const q = normalizeSearch(globalQuery);
    return allRows
      .filter((row) => rowMatchesClauses(row, chainClauses, stageSelections))
      .filter((r) => !q || entrySearchText(r).includes(q));
  }, [allRows, chainClauses, stageSelections, globalQuery]);
  const stageConditionCount = Object.values(stageSelections || {}).reduce((count, selections) => count + Object.keys(selections || {}).length, 0);

  const selectRow = (row) => {
    setSelectedChainId(row.chainId);
    setSelectedRowId(row.id);
    const clause = chainClauses.find((item) => item.rowId === row.id) || chainClauses.find((item) => item.chainId === row.chainId);
    onFocusClause?.(clause?.id);
  };

  return (
    <div className="min-w-0 space-y-4">
      {selectedPhenomenon && (
        <div className="min-w-0">
          <PhenomenonContextPanel
            phenomenon={selectedPhenomenon}
            selectedRow={selectedRow}
            onSelectRow={selectRow}
            onClear={onClearPhenomenon}
          />
        </div>
      )}
      {selectedRow && (
        <MainDetailPanel
          selectedRow={selectedRow}
          selectedPhenomenon={null}
          onSelectRow={selectRow}
          onClose={() => setSelectedRowId(null)}
        />
      )}
      <div className="min-w-0">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-900/5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900"><Boxes className="h-4 w-4 text-blue-700" />{t("interactive.entryBrowser")}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{t("interactive.resultCount", { count: rows.length })}</div>
            </div>
            <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
              <div className="min-w-0 rounded-md bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 break-words [overflow-wrap:anywhere]">
                {t("interactive.selectionScope", { chainCount: chainClauses.length, stageCount: stageConditionCount })}
              </div>
            </div>
          </div>
          <div className="min-w-0">
            {rows.length > 0 ? (
              <div className="grid min-w-0 gap-3 2xl:grid-cols-2">
                {rows.map((r) => (
                  <EntryCard
                    key={r.id}
                    row={r}
                    markerValues={rowMatchedMarkerValues(r, chainClauses, stageSelections)}
                    selected={selectedRowId === r.id}
                    onClick={() => selectRow(r)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-slate-50 px-3 py-8 text-center text-xs font-semibold leading-5 text-slate-400">
                {t("interactive.noMarkers")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixTable({ chain, selectedRowId, setSelectedRowId, setSelectedPhenomenon, globalQuery }) {
  const { locale, t, formatText } = useI18n();
  const metaCols = ["现象", "现象的论文", "分子生物学机理", "分子生物学机理的论文"];
  const q = normalizeSearch(globalQuery);
  const rows = chain.rows.filter((row) => !q || entrySearchText(row).includes(q));
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm shadow-blue-900/5">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-black text-slate-950">{formatText(chain.title)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("matrix.subtitle")}</p>
      </div>
      <div className="grid max-h-[720px] min-w-0 gap-3 overflow-auto p-4 xl:grid-cols-2">
        {rows.map((row) => {
          const selected = selectedRowId === row.id;
          const signals = rowSignalEntries({ ...row, chainId: chain.id }, chain);
          return (
            <div
              key={row.id}
              role="button"
              tabIndex={0}
              onClick={() => { setSelectedRowId(row.id); setSelectedPhenomenon(null); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedRowId(row.id);
                  setSelectedPhenomenon(null);
                }
              }}
              className={cx(
                "min-w-0 cursor-pointer rounded-xl border p-4 transition duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/10",
                selected ? "border-blue-800 bg-blue-900 text-white shadow-md shadow-blue-900/20" : "border-slate-200 bg-white text-slate-900"
              )}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatText(row.errorType)}</div>
                  <div className={cx("mt-1 text-xs font-bold", selected ? "text-slate-300" : "text-slate-500")}>{formatText(chain.short)}</div>
                </div>
                <span className={cx("shrink-0 rounded-md px-2 py-1 text-[11px] font-black", selected ? "bg-amber-300 text-blue-950" : "bg-blue-50 text-blue-700")}>
                  {t("entry.stages", { count: signals.length })}
                </span>
              </div>
              <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
                {signals.map(({ stage, value }) => (
                  <div key={stage.key} className={cx("min-w-0 rounded-md px-3 py-2", selected ? "bg-white/10" : "bg-slate-50")}>
                    <div className={cx("mb-1 text-[11px] font-black uppercase", selected ? "text-slate-300" : "text-slate-500")}>{formatText(stage.label)}</div>
                    <Pill value={value} compact />
                  </div>
                ))}
              </div>
              <div className={cx("mt-3 rounded-md px-3 py-2 text-xs leading-5", selected ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                <span className={cx("font-black", selected ? "text-white" : "text-slate-900")}>{labelForColumn(metaCols[0], locale)}: </span>
                {formatText(row.phenomenon)}
              </div>
              <div className={cx("mt-2 rounded-md px-3 py-2 text-xs leading-5", selected ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                <span className={cx("font-black", selected ? "text-white" : "text-slate-900")}>{labelForColumn(metaCols[2], locale)}: </span>
                {formatText(row.mechanism)}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2" onClick={(event) => event.stopPropagation()}>
                <PaperSummary body={row.phenomenonPapers} />
                <PaperSummary body={row.mechanismPapers} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatricesTab({ selectedChainId, setSelectedChainId, selectedRowId, setSelectedRowId, selectedPhenomenon, setSelectedPhenomenon, globalQuery }) {
  const chain = CHAINS.find((c) => c.id === selectedChainId) || CHAINS[0];
  const selectedRow = ROW_BY_ID[selectedRowId];
  const selectRow = (row) => {
    setSelectedChainId(row.chainId);
    setSelectedRowId(row.id);
    setSelectedPhenomenon(null);
  };
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:grid-cols-1">
      <div className="min-w-0 space-y-5">
        <MatrixTable chain={chain} selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} setSelectedPhenomenon={setSelectedPhenomenon} globalQuery={globalQuery} />
      </div>
      <div className="xl:hidden">
        <DetailPanel selectedRow={selectedRow} selectedPhenomenon={selectedPhenomenon} onSelectRow={selectRow} onClose={() => { setSelectedRowId(null); setSelectedPhenomenon(null); }} />
      </div>
    </div>
  );
}

function PaperCountBadge({ icon: Icon, body }) {
  const { t } = useI18n();
  const count = parsePaperItems(body).length;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
      <Icon className="h-3.5 w-3.5" />
      {t("papers.count", { count })}
    </span>
  );
}

function PhenomenonCard({ phenomenon, selected, onClick }) {
  const { t, formatText } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "min-w-0 cursor-pointer rounded-xl border p-4 text-left transition duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/10",
        selected ? "border-blue-800 bg-blue-900 text-white shadow-md shadow-blue-900/20" : "border-slate-200 bg-white text-slate-900"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={cx("text-xs font-black", selected ? "text-slate-300" : "text-slate-500")}>
            {t("phenomena.relatedCount", { count: phenomenon.related?.length || 0 })}
          </div>
          <div className="mt-1 text-base font-black leading-6 break-words [overflow-wrap:anywhere]">{formatText(cleanPhenomenonName(phenomenon.name))}</div>
        </div>
        <span className={cx("shrink-0 rounded-md px-2 py-1 text-[11px] font-black", selected ? "bg-amber-300 text-blue-950" : "bg-blue-50 text-blue-700")}>
          {t("phenomena.dnaRecord")}: {formatText(phenomenon.dnaRecord)}
        </span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className={cx("rounded-lg px-3 py-2", selected ? "bg-white/10" : "bg-slate-50")}>
          <div className={cx("mb-1 text-[11px] font-black uppercase", selected ? "text-slate-300" : "text-slate-500")}>{t("phenomena.primary")}</div>
          <div className={cx("line-clamp-3 text-xs leading-5 break-words [overflow-wrap:anywhere]", selected ? "text-slate-100" : "text-slate-700")}>{formatText(phenomenon.sourceAction)}</div>
        </div>
        <div className={cx("rounded-lg px-3 py-2", selected ? "bg-white/10" : "bg-slate-50")}>
          <div className={cx("mb-1 text-[11px] font-black uppercase", selected ? "text-slate-300" : "text-slate-500")}>{t("phenomena.products")}</div>
          <div className={cx("line-clamp-3 text-xs leading-5 break-words [overflow-wrap:anywhere]", selected ? "text-slate-100" : "text-slate-700")}>{formatText(`${phenomenon.sourceProduct} → ${phenomenon.derivativeProduct}`)}</div>
        </div>
      </div>
      <div className={cx("mt-3 line-clamp-3 text-xs leading-5 break-words [overflow-wrap:anywhere]", selected ? "text-slate-200" : "text-slate-600")}>
        <span className={cx("font-black", selected ? "text-white" : "text-slate-900")}>{t("phenomena.mechanismPreview")}: </span>
        {formatText(phenomenon.mechanism)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <PaperCountBadge icon={BookOpen} body={phenomenon.phenomenonPapers} />
        <PaperCountBadge icon={FileText} body={phenomenon.mechanismPapers} />
      </div>
    </button>
  );
}

function PhenomenaTab({ selectedPhenomenonId, setSelectedPhenomenonId, setSelectedRowId, selectedRowId, selectedPhenomenon, setSelectedPhenomenon, setSelectedChainId, globalQuery, onChoosePhenomenon }) {
  const { t } = useI18n();
  const q = normalizeSearch(globalQuery);
  const phenomena = PHENOMENA.filter((p) => !q || phenomenonSearchText(p).includes(q));
  const selectedRow = ROW_BY_ID[selectedRowId];
  const choosePhen = (p) => {
    setSelectedPhenomenonId(p.id);
    setSelectedPhenomenon(p);
    setSelectedRowId(null);
    onChoosePhenomenon?.(p);
  };
  const selectRow = (row) => {
    setSelectedRowId(row.id);
    setSelectedChainId(row.chainId);
  };
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:grid-cols-1">
      <div className="min-w-0 space-y-5">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-900/5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-slate-950">{t("phenomena.title")}</h2>
              <p className="mt-1 text-sm text-slate-600">{t("phenomena.subtitle")}</p>
            </div>
            <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-black text-slate-500">
              {t("phenomena.resultCount", { count: phenomena.length })}
            </div>
          </div>
          <div className="grid min-w-0 gap-3 xl:grid-cols-2">
            {phenomena.map((p) => (
              <PhenomenonCard
                key={p.id}
                phenomenon={p}
                selected={selectedPhenomenonId === p.id}
                onClick={() => choosePhen(p)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="xl:hidden">
        <DetailPanel selectedRow={selectedRow} selectedPhenomenon={selectedPhenomenon} onSelectRow={selectRow} onClose={() => { setSelectedRowId(null); setSelectedPhenomenon(null); setSelectedPhenomenonId(null); }} />
      </div>
    </div>
  );
}

function RelationshipPanel({ selectedRow, selectedChain, selectedPhenomenon, setActiveTab, onSelectRow, onOpenGraph }) {
  const { t, formatText } = useI18n();
  const routeSignals = rowSignalEntries(selectedRow, selectedChain);
  const relatedRows = (selectedPhenomenon?.related || []).map((id) => ROW_BY_ID[id]).filter(Boolean);
  if (routeSignals.length === 0 && relatedRows.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-400">
        {t("relationship.noSignals")}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-900">
          <Network className="h-4 w-4 shrink-0" />
          <span>{t("rail.context")}</span>
        </div>
        <button
          type="button"
          onClick={() => onOpenGraph?.(selectedRow)}
          disabled={!selectedRow}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1.5 text-[11px] font-black text-white"
        >
          <GitBranch className="h-3.5 w-3.5" />
          {t("relationship.openInteractive")}
        </button>
      </div>
      {routeSignals.length > 0 ? (
        <div className="min-w-0 space-y-2">
          <div className="rounded-md bg-white px-2.5 py-2 text-xs font-black leading-5 text-slate-900 break-words [overflow-wrap:anywhere]">
            {formatText(selectedRow.errorType)}
          </div>
          <div className="max-h-64 space-y-1.5 overflow-auto pr-1">
            {routeSignals.map(({ stage, value }, idx) => (
              <div key={stage.key} className="grid min-w-0 grid-cols-[1.6rem_minmax(0,1fr)] gap-2 rounded-md bg-white px-2 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[10px] font-black text-slate-500">{idx + 1}</div>
                <div className="min-w-0">
                  <div className="text-[11px] font-black leading-4 text-slate-700 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</div>
                  <div className="mt-1"><Pill value={value} compact /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-w-0 space-y-2">
          <div className="rounded-md bg-white px-2.5 py-2 text-xs font-black leading-5 text-slate-900 break-words [overflow-wrap:anywhere]">
            {formatText(cleanPhenomenonName(selectedPhenomenon.name))}
          </div>
          <div className="max-h-64 space-y-1.5 overflow-auto pr-1">
            {relatedRows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => onSelectRow(row)}
                className="w-full rounded-md bg-white px-2.5 py-2 text-left text-xs font-bold leading-5 text-slate-700 transition hover:text-slate-950 hover:shadow-sm"
              >
                {formatText(row.errorType)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SnakeStageSelector({ chain, clause, compact, stageSelections, selectedRow, toggleStageSelection }) {
  const { t, formatText } = useI18n();
  const foldRows = Math.ceil(chain.sequence.length / 2);
  const points = chain.sequence.map((stage, idx) => {
    const returning = idx >= foldRows;
    const rowIndex = returning ? foldRows - (idx - foldRows) : idx + 1;
    return {
      stage,
      left: returning ? 76 : 24,
      top: ((rowIndex - 0.5) / foldRows) * 100,
      idx,
    };
  });
  const polyline = points.map((point) => `${point.left},${point.top}`).join(" ");
  return (
    <div className={cx("relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner shadow-slate-100", compact ? "h-64" : "h-[24rem]")}>
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        <polyline points={polyline} fill="none" stroke="rgb(203 213 225)" strokeWidth="1.4" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        {points.map((point) => (
          <circle key={`${point.stage.key}-dot`} cx={point.left} cy={point.top} r="1.7" fill="white" stroke="rgb(148 163 184)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {points.map(({ stage, left, top, idx }) => {
        const role = stageSelections?.[clause.id]?.[stage.key];
        const candidateValue = selectedRow?.chainId === chain.id ? selectedRow.cells?.[stage.key] : "";
        const activeInCandidate = hasSignal(candidateValue);
        return (
          <button
            key={stage.key}
            type="button"
            onClick={() => toggleStageSelection(clause.id, chain.id, stage.key)}
            title={`${formatText(stage.label)} ${role ? t(role === "primary" ? "selection.primary" : "selection.secondary") : ""}`}
            style={{ left: `${left}%`, top: `${top}%` }}
            className={cx(
              "absolute z-10 flex min-w-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col justify-center rounded-md border px-2 py-1 text-left shadow-sm transition duration-200 hover:z-20 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/10",
              compact ? "h-9 w-[42%]" : "h-12 w-[42%]",
              stage.kind === "action" ? "border-dashed" : "border-solid",
              role ? `${selectionTone(role)} ring-1` : activeInCandidate ? STAGE_TONE[classifyCell(candidateValue)] : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            <span className="mb-0.5 flex min-w-0 items-center gap-1">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/75 text-[9px] font-black">{idx + 1}</span>
              <span className={cx("min-w-0 truncate rounded px-1 py-0.5 text-[8px] font-black uppercase", stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
                {stage.kind === "action" ? t("stage.action") : t("stage.object")}
              </span>
              {role && (
                <span className="ml-auto shrink-0 rounded bg-white/70 px-1 py-0.5 text-[8px] font-black">
                  {t(role === "primary" ? "selection.primary" : "selection.secondary")}
                </span>
              )}
            </span>
            <span className={cx("min-w-0 font-black leading-3 break-words [overflow-wrap:anywhere]", compact ? "line-clamp-1 text-[9px]" : "line-clamp-2 text-[10px]")}>{formatText(stage.label)}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChainPoolColumn({
  chainClauses,
  setChainClauses,
  expandedClauseIds,
  setExpandedClauseIds,
  draftChainId,
  setDraftChainId,
  globalQuery,
  setGlobalQuery,
  compact,
  setCompact,
  stageSelections,
  toggleStageSelection,
  clearStageSelections,
  selectedRow,
  onOpenGraph,
  onSelectionChange,
  focusedClauseId,
}) {
  const { t, formatText } = useI18n();
  const clauseRefs = useRef({});
  useEffect(() => {
    if (!focusedClauseId) return;
    setExpandedClauseIds((current) => current.includes(focusedClauseId) ? current : [...current, focusedClauseId]);
    window.requestAnimationFrame(() => {
      clauseRefs.current[focusedClauseId]?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, [focusedClauseId, setExpandedClauseIds]);
  const addChain = () => {
    const clause = makeChainClause(draftChainId);
    setChainClauses((current) => [...current, clause]);
    setExpandedClauseIds((current) => [...current, clause.id]);
    onSelectionChange?.();
  };
  const removeClause = (clauseId) => {
    setChainClauses((current) => current.filter((clause) => clause.id !== clauseId));
    setExpandedClauseIds((current) => current.filter((id) => id !== clauseId));
    onSelectionChange?.();
  };
  const toggleExpanded = (clauseId) => {
    setExpandedClauseIds((current) => current.includes(clauseId) ? current.filter((id) => id !== clauseId) : [...current, clauseId]);
  };
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="text-xs font-black uppercase text-slate-500">{compact ? t("rail.chainPool") : t("rail.chainPool")}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearStageSelections}
            className="rounded-md bg-slate-100 px-2 py-1.5 text-[10px] font-black text-slate-500 transition hover:bg-white hover:text-slate-950"
            title={t("selection.clear")}
          >
            {t("selection.clear")}
          </button>
          <button
            type="button"
            onClick={() => onOpenGraph?.()}
            className="rounded-md bg-blue-800 p-1.5 text-white transition hover:bg-blue-700"
            title={t("relationship.openInteractive")}
          >
            <GitBranch className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCompact(!compact)}
            className="rounded-md bg-slate-100 p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-950"
            title={compact ? t("rail.wide") : t("rail.narrow")}
          >
            {compact ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {!compact && <div className="shrink-0 rounded-md bg-slate-50 px-3 py-2 text-[11px] font-semibold leading-5 text-slate-500">{t("selection.hint")}</div>}
      <label className="flex min-w-0 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={globalQuery}
          onChange={(event) => setGlobalQuery(event.target.value)}
          placeholder={compact ? t("dock.search").split(" / ")[0] : t("dock.search")}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
        {globalQuery && (
          <button type="button" onClick={() => setGlobalQuery("")} title={t("dock.clear")} className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        )}
      </label>
      <div className="flex min-w-0 shrink-0 gap-2">
        <select
          value={draftChainId}
          onChange={(event) => setDraftChainId(event.target.value)}
          className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
        >
          {CHAINS.map((chain) => <option key={chain.id} value={chain.id}>{formatText(chain.short)}</option>)}
        </select>
        <button
          type="button"
          onClick={addChain}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white transition hover:bg-blue-700"
          title={t("rail.addChain")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {chainClauses.map((clause, clauseIndex) => {
          const chain = CHAINS.find((item) => item.id === clause.chainId);
          if (!chain) return null;
          const expanded = expandedClauseIds.includes(clause.id);
          return (
            <div
              key={clause.id}
              ref={(node) => {
                if (node) clauseRefs.current[clause.id] = node;
                else delete clauseRefs.current[clause.id];
              }}
              className={cx(
                "rounded-xl border bg-slate-50 transition",
                focusedClauseId === clause.id ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"
              )}
            >
              <div className="flex min-w-0 items-center gap-2 px-2 py-2">
                <button
                  type="button"
                  onClick={() => toggleExpanded(clause.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1 text-left text-xs font-black text-slate-800 hover:bg-white"
                >
                  <ChevronRight className={cx("h-3.5 w-3.5 shrink-0 transition", expanded ? "rotate-90" : "")} />
                  <span className="min-w-0 truncate">{formatText(chain.short)}</span>
                  <span className="ml-auto rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-500">#{clauseIndex + 1}</span>
                </button>
                <button type="button" onClick={() => removeClause(clause.id)} className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-900">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {expanded && !compact && (
                <div className="border-t border-slate-200 p-2">
                  <SnakeStageSelector chain={chain} clause={clause} compact={false} stageSelections={stageSelections} selectedRow={selectedRow} toggleStageSelection={toggleStageSelection} />
                </div>
              )}
              {expanded && compact && (
                <div className="border-t border-slate-200 p-2">
                  <SnakeStageSelector chain={chain} clause={clause} compact stageSelections={stageSelections} selectedRow={selectedRow} toggleStageSelection={toggleStageSelection} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function NavigationRail({ activeTab, setActiveTab }) {
  const { t } = useI18n();
  const tabs = [
    ["interactive", t("tabs.interactive"), MousePointerClick],
    ["matrices", t("tabs.matrices"), Table2],
    ["phenomena", t("tabs.phenomena"), Grid2X2],
  ];
  return (
    <nav className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-xl border border-slate-300 bg-white/95 p-2 shadow-xl shadow-slate-900/15 backdrop-blur xl:flex xl:flex-col xl:gap-2" aria-label={t("rail.navigate")}>
      {tabs.map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          title={label}
          onClick={() => setActiveTab(id)}
          className={cx(
            "flex h-11 w-11 items-center justify-center rounded-lg transition",
            activeTab === id ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
}

function InspectorRail({
  railWide,
  setRailWide,
  railCollapsed,
  setRailCollapsed,
  selectedChainId,
  globalQuery,
  setGlobalQuery,
  entryMatchCount,
  phenomenonMatchCount,
  selectedRow,
  chainClauses,
  setChainClauses,
  stageSelections,
  toggleStageSelection,
  clearStageSelections,
  pickerCompact,
  setPickerCompact,
  topCollapsed,
  setTopCollapsed,
  onOpenGraph,
  onSelectionChange,
  focusedClauseId,
}) {
  const { t } = useI18n();
  const [draftChainId, setDraftChainId] = useState(selectedChainId);
  const [expandedClauseIds, setExpandedClauseIds] = useState(() => chainClauses.map((clause) => clause.id));
  useEffect(() => {
    setDraftChainId(selectedChainId);
  }, [selectedChainId]);
  useEffect(() => {
    setExpandedClauseIds((current) => {
      const validIds = chainClauses.map((clause) => clause.id);
      const retained = current.filter((id) => validIds.includes(id));
      const added = validIds.filter((id) => !retained.includes(id));
      return [...retained, ...added];
    });
  }, [chainClauses]);
  const railWidthClass = topCollapsed
    ? "w-[22rem]"
    : railWide
      ? "w-[36rem]"
      : pickerCompact
        ? "w-[22rem]"
        : "w-[28rem]";
  if (railCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setRailCollapsed(false)}
        className="fixed right-4 top-4 z-50 hidden rounded-xl border border-blue-100 bg-white/95 p-3 text-blue-700 shadow-xl shadow-blue-900/15 backdrop-blur transition hover:text-blue-950 xl:block"
        title={t("rail.expandRail")}
      >
        <PanelRightOpen className="h-5 w-5" />
      </button>
    );
  }
  return (
    <aside className={cx(
      "fixed bottom-4 right-4 top-4 z-40 hidden min-w-0 flex-col rounded-2xl border border-blue-100 bg-white/95 shadow-xl shadow-blue-900/10 backdrop-blur xl:flex",
      railWidthClass
    )} aria-label={t("rail.inspect")}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div className="text-sm font-black text-slate-950">{t("rail.inspect")}</div>
          <div className="flex items-center gap-1">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700">{t("dock.entries", { count: entryMatchCount })}</span>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-700">{t("dock.phenomena", { count: phenomenonMatchCount })}</span>
            <button type="button" onClick={() => setTopCollapsed(!topCollapsed)} title={topCollapsed ? t("rail.expandTop") : t("rail.collapseTop")} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-950">
              {topCollapsed ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
            </button>
            <button type="button" onClick={() => setRailWide(!railWide)} title={railWide ? t("rail.narrow") : t("rail.wide")} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-950">
              {railWide ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            </button>
            <button type="button" onClick={() => setRailCollapsed(true)} title={t("rail.collapseRail")} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-950">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {!topCollapsed && (
          <div className="h-full min-h-0 min-w-0 flex-1">
            <ChainPoolColumn
              chainClauses={chainClauses}
              setChainClauses={setChainClauses}
              expandedClauseIds={expandedClauseIds}
              setExpandedClauseIds={setExpandedClauseIds}
              draftChainId={draftChainId}
              setDraftChainId={setDraftChainId}
              globalQuery={globalQuery}
              setGlobalQuery={setGlobalQuery}
              compact={pickerCompact}
              setCompact={setPickerCompact}
              stageSelections={stageSelections}
              toggleStageSelection={toggleStageSelection}
              clearStageSelections={clearStageSelections}
              selectedRow={selectedRow}
              onOpenGraph={onOpenGraph}
              onSelectionChange={onSelectionChange}
              focusedClauseId={focusedClauseId}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function MobileControls({ activeTab, setActiveTab, selectedChainId, onSelectChain, globalQuery, setGlobalQuery, entryMatchCount, phenomenonMatchCount }) {
  const { t, formatText } = useI18n();
  const tabs = [
    ["interactive", t("tabs.interactive"), MousePointerClick],
    ["matrices", t("tabs.matrices"), Table2],
    ["phenomena", t("tabs.phenomena"), Grid2X2],
  ];
  return (
    <div className="space-y-2 rounded-xl border border-blue-100 bg-white p-2 shadow-sm shadow-blue-900/5 xl:hidden">
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {tabs.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => setActiveTab(id)}
            className={cx("flex flex-1 items-center justify-center rounded-md px-3 py-2 text-xs font-black transition", activeTab === id ? "bg-blue-800 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-950")}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <label className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} placeholder={t("dock.search")} className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" />
        {globalQuery && <button type="button" onClick={() => setGlobalQuery("")} className="rounded-md p-1 text-slate-400"><X className="h-4 w-4" /></button>}
      </label>
      <div className="flex min-w-0 flex-wrap gap-2">
        {activeTab !== "phenomena" && (
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
            <span>{t("dock.chainScope")}</span>
            <select value={selectedChainId} onChange={(event) => onSelectChain(event.target.value)} className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none">
              {CHAINS.map((chain) => <option key={chain.id} value={chain.id}>{formatText(chain.short)}</option>)}
            </select>
          </label>
        )}
        <span className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{t("dock.entries", { count: entryMatchCount })}</span>
        <span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">{t("dock.phenomena", { count: phenomenonMatchCount })}</span>
      </div>
    </div>
  );
}

function ChainGraphModal({ selectedRow, chainClauses, stageSelections, toggleGraphStageSelection, clearStageSelections, onClose }) {
  const { t, formatText } = useI18n();
  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl flex-col rounded-xl border border-slate-300 bg-white shadow-2xl">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              <GitBranch className="h-3.5 w-3.5" />
              {t("graph.title")}
            </div>
            <h2 className="text-xl font-black leading-7 text-slate-950 break-words [overflow-wrap:anywhere]">
              {selectedRow ? formatText(selectedRow.errorType) : t("selection.hint")}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{t("selection.hint")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={clearStageSelections} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 hover:text-slate-950">
              {t("selection.clear")}
            </button>
            <button type="button" onClick={onClose} title={t("graph.close")} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="grid min-w-0 gap-4">
            {CHAINS.map((chain) => (
              <div key={chain.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-black text-slate-950">{formatText(chain.short)}</div>
                  <div className="text-[11px] font-bold text-slate-500">{t("chain.entries", { count: chain.rows.length })}</div>
                </div>
                <div className="grid min-w-0 gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {chain.sequence.map((stage, idx) => {
                    const role = mergedStageSelectionsForChain(stageSelections, chainClauses, chain.id)[stage.key];
                    const value = selectedRow?.chainId === chain.id ? selectedRow.cells?.[stage.key] : "";
                    const active = hasSignal(value);
                    const kind = classifyCell(value);
                    const tone = role ? `${selectionTone(role)} ring-1` : active ? STAGE_TONE[kind] : kind === "正常" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-600";
                    return (
                      <button
                        key={stage.key}
                        type="button"
                        onClick={() => toggleGraphStageSelection(chain.id, stage.key)}
                        className={cx("grid min-w-0 cursor-pointer grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 rounded-xl border p-3 text-left transition duration-200 hover:border-blue-200 hover:shadow-sm hover:shadow-blue-900/10", stage.kind === "action" ? "border-dashed" : "border-solid", tone)}
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/75 text-[11px] font-black">{idx + 1}</div>
                        <div className="min-w-0">
                          <div className="mb-1 flex min-w-0 flex-wrap items-center gap-1.5">
                            <span className={cx("rounded px-1.5 py-0.5 text-[9px] font-black uppercase", stage.kind === "action" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
                              {stage.kind === "action" ? t("stage.action") : t("stage.object")}
                            </span>
                          </div>
                          <div className="text-sm font-black leading-5 break-words [overflow-wrap:anywhere]">{formatText(stage.label)}</div>
                          {value && <div className="mt-2 text-xs leading-5 break-words [overflow-wrap:anywhere]">{formatText(value)}</div>}
                        </div>
                        <span className={cx("h-fit rounded px-1.5 py-0.5 text-[10px] font-black", role ? "bg-white/70" : "bg-slate-100 text-slate-400")}>
                          {role ? t(role === "primary" ? "selection.primary" : "selection.secondary") : t("selection.any")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FiveChainPhenomenaDemo() {
  return (
    <I18nProvider>
      <FiveChainPhenomenaApp />
    </I18nProvider>
  );
}

function FiveChainPhenomenaApp() {
  const [activeTab, setActiveTab] = useState("interactive");
  const [selectedChainId, setSelectedChainId] = useState("expression");
  const [selectedRowId, setSelectedRowId] = useState("expr_splice_wrong");
  const [selectedPhenomenonId, setSelectedPhenomenonId] = useState(null);
  const [selectedPhenomenon, setSelectedPhenomenon] = useState(null);
  const [globalQuery, setGlobalQuery] = useState("");
  const [chainClauses, setChainClauses] = useState(() => [{ id: "expression-initial", chainId: "expression" }]);
  const [stageSelections, setStageSelections] = useState({});
  const [railWide, setRailWide] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [pickerCompact, setPickerCompact] = useState(false);
  const [topCollapsed, setTopCollapsed] = useState(false);
  const [graphRow, setGraphRow] = useState(null);
  const [graphOpen, setGraphOpen] = useState(false);
  const [focusedClauseId, setFocusedClauseId] = useState(null);
  const deferredGlobalQuery = useDeferredValue(globalQuery);
  const q = normalizeSearch(deferredGlobalQuery);
  const selectedRow = ROW_BY_ID[selectedRowId];
  const allRows = useMemo(() => CHAINS.flatMap((chain) => chain.rows.map((row) => ({ ...row, chainId: chain.id, chainShort: chain.short, chainTitle: chain.title }))), []);
  const entryMatchCount = useMemo(() => allRows.filter((row) => !q || entrySearchText(row).includes(q)).length, [allRows, q]);
  const phenomenonMatchCount = useMemo(() => PHENOMENA.filter((phenomenon) => !q || phenomenonSearchText(phenomenon).includes(q)).length, [q]);
  const inspectorRailWidth = railWidthRem({ railWide, topCollapsed, pickerCompact, railCollapsed });

  const stageSelectionsFromRow = (row) => {
    const chain = CHAINS.find((item) => item.id === row?.chainId);
    if (!row || !chain) return {};
    const selections = {};
    rowSignalEntries(row, chain).forEach(({ stage, value }) => {
      const roles = cellRoles(value);
      if (roles.has("primary") && !Object.values(selections).includes("primary")) selections[stage.key] = "primary";
      else if (roles.has("secondary")) selections[stage.key] = "secondary";
    });
    return selections;
  };

  const syncPhenomenonToInspector = (phenomenon) => {
    const relatedRows = (phenomenon?.related || []).map((id) => ROW_BY_ID[id]).filter(Boolean);
    const nextClauses = relatedRows.map((row, index) => ({
      id: `phen-${phenomenon.id}-${index}-${row.id}`,
      chainId: row.chainId,
      rowId: row.id,
    }));
    const nextSelections = {};
    nextClauses.forEach((clause, index) => {
      const selections = stageSelectionsFromRow(relatedRows[index]);
      if (Object.keys(selections).length > 0) nextSelections[clause.id] = selections;
    });
    setChainClauses(nextClauses);
    setStageSelections(nextSelections);
    setSelectedRowId(relatedRows[0]?.id || null);
    setSelectedChainId(relatedRows[0]?.chainId || selectedChainId);
    setRailCollapsed(false);
    setTopCollapsed(false);
    setPickerCompact(false);
    setFocusedClauseId(nextClauses[0]?.id || null);
    setActiveTab("interactive");
  };

  const selectChainFromRail = (chainId) => {
    const chain = CHAINS.find((item) => item.id === chainId);
    setSelectedChainId(chainId);
    setSelectedRowId(chain?.rows?.[0]?.id || null);
    setChainClauses([{ id: `${chainId}-scope`, chainId }]);
    setStageSelections({});
    setSelectedPhenomenon(null);
    setSelectedPhenomenonId(null);
    setFocusedClauseId(null);
    setActiveTab("interactive");
  };
  const toggleStageSelection = (clauseId, chainId, stageKey) => {
    setActiveTab("interactive");
    setChainClauses((current) => current.some((clause) => clause.id === clauseId) ? current : [...current, { id: clauseId, chainId }]);
    setStageSelections((current) => {
      const currentRole = current?.[clauseId]?.[stageKey];
      const nextRole = !currentRole ? "secondary" : currentRole === "secondary" ? "primary" : null;
      const clauseSelections = { ...(current[clauseId] || {}) };
      if (nextRole === "primary") {
        Object.entries(clauseSelections).forEach(([key, role]) => {
          if (role === "primary") delete clauseSelections[key];
        });
      }
      if (nextRole) clauseSelections[stageKey] = nextRole;
      else delete clauseSelections[stageKey];
      const next = { ...current };
      if (Object.keys(clauseSelections).length > 0) next[clauseId] = clauseSelections;
      else delete next[clauseId];
      return next;
    });
  };
  const toggleGraphStageSelection = (chainId, stageKey) => {
    const existingClause = chainClauses.find((clause) => clause.chainId === chainId);
    const clause = existingClause || makeChainClause(chainId);
    if (!existingClause) setChainClauses((current) => [...current, clause]);
    toggleStageSelection(clause.id, chainId, stageKey);
  };
  const clearStageSelections = () => {
    setStageSelections({});
    setActiveTab("interactive");
  };
  const focusClauseInRail = (clauseId) => {
    if (!clauseId) return;
    setFocusedClauseId(clauseId);
    setRailCollapsed(false);
    setTopCollapsed(false);
    setActiveTab("interactive");
  };
  const clearPhenomenonScope = () => {
    const activeChainId = selectedRow?.chainId || selectedChainId;
    setSelectedPhenomenon(null);
    setSelectedPhenomenonId(null);
    setChainClauses([{ id: `${activeChainId}-scope-${Date.now()}`, chainId: activeChainId }]);
    setStageSelections({});
    setFocusedClauseId(null);
    setActiveTab("interactive");
  };
  const openGraph = (row = selectedRow) => {
    setGraphRow(row || selectedRow || null);
    setGraphOpen(true);
  };

  return (
    <div
      style={{ "--rail-space": `${railCollapsed ? 2 : inspectorRailWidth + 3}rem` }}
      className="min-h-screen bg-[#f4f7fb] p-4 pb-8 text-slate-900 md:p-6 xl:pr-[var(--rail-space)]"
    >
      <InspectorRail
        railWide={railWide}
        setRailWide={setRailWide}
        railCollapsed={railCollapsed}
        setRailCollapsed={setRailCollapsed}
        selectedChainId={selectedChainId}
        globalQuery={globalQuery}
        setGlobalQuery={setGlobalQuery}
        entryMatchCount={entryMatchCount}
        phenomenonMatchCount={phenomenonMatchCount}
        selectedRow={selectedRow}
        chainClauses={chainClauses}
        setChainClauses={setChainClauses}
        stageSelections={stageSelections}
        toggleStageSelection={toggleStageSelection}
        clearStageSelections={clearStageSelections}
        pickerCompact={pickerCompact}
        setPickerCompact={setPickerCompact}
        topCollapsed={topCollapsed}
        setTopCollapsed={setTopCollapsed}
        onOpenGraph={openGraph}
        onSelectionChange={() => setActiveTab("interactive")}
        focusedClauseId={focusedClauseId}
      />
      <div className="mx-auto max-w-[1500px] space-y-4">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <MobileControls
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedChainId={selectedChainId}
          onSelectChain={selectChainFromRail}
          globalQuery={globalQuery}
          setGlobalQuery={setGlobalQuery}
          entryMatchCount={entryMatchCount}
          phenomenonMatchCount={phenomenonMatchCount}
        />
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            {activeTab === "interactive" && (
              <InteractiveTab
                setSelectedChainId={setSelectedChainId}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                selectedPhenomenon={selectedPhenomenon}
                globalQuery={deferredGlobalQuery}
                chainClauses={chainClauses}
                stageSelections={stageSelections}
                onClearPhenomenon={clearPhenomenonScope}
                onFocusClause={focusClauseInRail}
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
                globalQuery={deferredGlobalQuery}
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
                globalQuery={deferredGlobalQuery}
                onChoosePhenomenon={syncPhenomenonToInspector}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {graphOpen && (
        <ChainGraphModal
          selectedRow={graphRow || selectedRow}
          chainClauses={chainClauses}
          stageSelections={stageSelections}
          toggleGraphStageSelection={toggleGraphStageSelection}
          clearStageSelections={clearStageSelections}
          onClose={() => setGraphOpen(false)}
        />
      )}
    </div>
  );
}
