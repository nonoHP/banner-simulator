import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type,
  Palette,
  Maximize2,
  Users,
  Download,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Layers,
  Edit3,
  Copy,
  Check,
  Sparkles,
  Grid,
  Move,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Ruler,
  Wand2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Search,
  Upload,
  FileText,
  X,
  Globe,
  FolderPlus,
  Image as ImageIcon,
  Eye,
  EyeOff,
  RotateCw,
  ScanText,
  Camera
} from 'lucide-react';

// --- 定数・プリセット定義 ---

const FONT_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'custom', label: '追加済み' },
  { id: 'brush', label: '筆文字・和風' },
  { id: 'gothic', label: 'ゴシック・太字' },
  { id: 'mincho', label: '明朝・伝統' },
  { id: 'pop', label: '丸文字・ポップ' },
  { id: 'design', label: 'デザイン・特殊' },
  { id: 'english', label: '欧文・スポーツ' },
];

const INITIAL_FONT_CATALOG = [
  // 筆文字・毛筆・和風系
  { id: 'brush', name: '佑字 粛 (毛筆・筆文字風)', googleFamily: 'Yuji+Syuku', family: "'Yuji Syuku', serif", weight: '400', category: 'brush', tags: '筆 毛筆 必勝 和風 習字 yuji syuku' },
  { id: 'yuji-mai', name: '佑字 舞 (伸びやかな筆文字)', googleFamily: 'Yuji+Mai', family: "'Yuji Mai', serif", weight: '400', category: 'brush', tags: '筆 毛筆 和風 舞 yuji mai' },
  { id: 'yuji-boku', name: '佑字 朴 (味わい深い筆文字)', googleFamily: 'Yuji+Boku', family: "'Yuji Boku', serif", weight: '400', category: 'brush', tags: '筆 毛筆 渋い 和風 yuji boku' },
  { id: 'reggae', name: 'レゲエ One (鋭い和風・闘魂)', googleFamily: 'Reggae+One', family: "'Reggae One', cursive", weight: '400', category: 'brush', tags: '闘魂 鋭い 和風 かっこいい reggae' },
  { id: 'new-tegomin', name: 'ニューテゴミン (手書き風明朝)', googleFamily: 'New+Tegomin', family: "'New Tegomin', serif", weight: '400', category: 'brush', tags: '筆 手書き 明朝 和風 tegomin' },

  // ゴシック・極太系
  { id: 'sans', name: 'Noto 角ゴシック Black (王道・力強い)', googleFamily: 'Noto+Sans+JP:wght@900', family: "'Noto Sans JP', sans-serif", weight: '900', category: 'gothic', tags: '角ゴシック 太字 定番 王道 noto sans' },
  { id: 'pop', name: 'デラゴシック One (超極太・大迫力)', googleFamily: 'Dela+Gothic+One', family: "'Dela Gothic One', cursive", weight: '400', category: 'gothic', tags: '極太 ゴシック インパクト 目立つ dela gothic' },
  { id: 'zen-kaku', name: 'Zen 角ゴシック Black (モダン・端正)', googleFamily: 'Zen+Kaku+Gothic+New:wght@900', family: "'Zen Kaku Gothic New', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 太字 クール zen kaku' },
  { id: 'm-plus-1p', name: 'M PLUS 1p Black (重厚ゴシック)', googleFamily: 'M+PLUS+1p:wght@900', family: "'M PLUS 1p', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 極太 力強い m plus' },
  { id: 'rocknroll', name: 'ロックンロール One (躍動・元気)', googleFamily: 'RocknRoll+One', family: "'RocknRoll One', sans-serif", weight: '400', category: 'gothic', tags: 'ロック 動き ポップ 太字 rocknroll' },

  // 明朝・セリフ系
  { id: 'serif', name: 'Noto 明朝 Black (伝統・格式)', googleFamily: 'Noto+Serif+JP:wght@900', family: "'Noto Serif JP', serif", weight: '900', category: 'mincho', tags: '明朝 伝統 格式 武道 硬派 noto serif' },
  { id: 'shippori-mincho', name: 'しっぽり明朝 ExtraBold (美しい明朝)', googleFamily: 'Shippori+Mincho:wght@800', family: "'Shippori Mincho', serif", weight: '800', category: 'mincho', tags: '明朝 綺麗 上品 伝統 shippori' },
  { id: 'zen-old-mincho', name: 'Zen オールド明朝 Black (堂々・重厚)', googleFamily: 'Zen+Old+Mincho:wght@900', family: "'Zen Old Mincho', serif", weight: '900', category: 'mincho', tags: '明朝 重厚 クラシック 武道 zen old mincho' },
  { id: 'kaisei-tokumin', name: '解星 特ミン ExtraBold (力強い太明朝)', googleFamily: 'Kaisei+Tokumin:wght@800', family: "'Kaisei Tokumin', serif", weight: '800', category: 'mincho', tags: '明朝 太い 個性的 kaisei tokumin' },
  { id: 'kaisei-decol', name: '解星 デコール Bold (華やか明朝)', googleFamily: 'Kaisei+Decol:wght@700', family: "'Kaisei Decol', serif", weight: '700', category: 'mincho', tags: '明朝 飾り かわいい 華やか kaisei decol' },
  { id: 'sawarabi-mincho', name: 'さわらび明朝 (すっきり明朝)', googleFamily: 'Sawarabi+Mincho', family: "'Sawarabi Mincho', serif", weight: '400', category: 'mincho', tags: '明朝 シンプル 読みやすい sawarabi' },

  // 丸ゴシック・ポップ・手書き系
  { id: 'round', name: 'M PLUS 丸ゴシック ExtraBold (親しみ)', googleFamily: 'M+PLUS+Rounded+1c:wght@800', family: "'M PLUS Rounded 1c', sans-serif", weight: '800', category: 'pop', tags: '丸ゴシック 優しい 定番 m plus rounded' },
  { id: 'heavy', name: 'モッチーポップ One (極太ポップ)', googleFamily: 'Mochiy+Pop+One', family: "'Mochiy Pop One', sans-serif", weight: '400', category: 'pop', tags: 'ポップ 太字 目立つ かわいい mochiy pop' },
  { id: 'zen-maru', name: 'Zen 丸ゴシック Black (やわらか太丸)', googleFamily: 'Zen+Maru+Gothic:wght@900', family: "'Zen Maru Gothic', sans-serif", weight: '900', category: 'pop', tags: '丸ゴシック 太字 おしゃれ zen maru' },
  { id: 'kosugi-maru', name: '小杉丸ゴシック (すっきり丸文字)', googleFamily: 'Kosugi+Maru', family: "'Kosugi Maru', sans-serif", weight: '400', category: 'pop', tags: '丸ゴシック シンプル kosugi maru' },
  { id: 'potta-one', name: 'ポッタ One (楽しい極太ブラシ)', googleFamily: 'Potta+One', family: "'Potta One', cursive", weight: '400', category: 'pop', tags: 'ポップ 太い イベント 文化祭 potta' },
  { id: 'hachi-maru', name: 'はちまるポップ (手書き・ゆるふわ)', googleFamily: 'Hachi+Maru+Pop', family: "'Hachi Maru Pop', cursive", weight: '400', category: 'pop', tags: '手書き かわいい 丸文字 hachi maru' },
  { id: 'yusei-magic', name: '油性マジック (マーカー手書き風)', googleFamily: 'Yusei+Magic', family: "'Yusei Magic', sans-serif", weight: '400', category: 'pop', tags: '手書き マジック 応援 yusei magic' },
  { id: 'klee-one', name: 'クレー One SemiBold (丁寧な手書き・教科書風)', googleFamily: 'Klee+One:wght@600', family: "'Klee One', cursive", weight: '600', category: 'pop', tags: '手書き 綺麗 青春 エモい klee' },

  // デザイン・ディスプレイ系
  { id: 'rampart', name: 'ランパート One (立体シャドウ装飾)', googleFamily: 'Rampart+One', family: "'Rampart One', cursive", weight: '400', category: 'design', tags: '立体 影付き デザイン 目立つ rampart' },
  { id: 'train-one', name: 'トレイン One (二重ライン装飾)', googleFamily: 'Train+One', family: "'Train One', cursive", weight: '400', category: 'design', tags: '二重線 スポーティ デザイン train' },
  { id: 'stick', name: 'スティック (直線デザイン文字)', googleFamily: 'Stick', family: "'Stick', sans-serif", weight: '400', category: 'design', tags: '直線 ユニーク ゲーム風 stick' },
  { id: 'dotgothic', name: 'ドットゴシック16 (レトロピクセル)', googleFamily: 'DotGothic16', family: "'DotGothic16', sans-serif", weight: '400', category: 'design', tags: 'ドット レトロ ゲーム 電光掲示板 dotgothic' },

  // 欧文・スポーツ系
  { id: 'bebas-neue', name: 'Bebas Neue (欧文・スポーツ定番)', googleFamily: 'Bebas+Neue', family: "'Bebas Neue', sans-serif", weight: '400', category: 'english', tags: '英語 アルファベット スポーティ かっこいい bebas' },
  { id: 'anton', name: 'Anton (欧文・極太インパクト)', googleFamily: 'Anton', family: "'Anton', sans-serif", weight: '400', category: 'english', tags: '英語 極太 インパクト スタジアム anton' },
  { id: 'oswald', name: 'Oswald Bold (欧文・長体ゴシック)', googleFamily: 'Oswald:wght@700', family: "'Oswald', sans-serif", weight: '700', category: 'english', tags: '英語 クール 縦長 スポーティ oswald' },
];

const SIZE_PRESETS = [
  { label: '180 × 90 cm (定番・標準)', width: 180, height: 90, desc: '2〜3人で持つ・屋内掲示に最適' },
  { label: '240 × 90 cm (人気・ワイド)', width: 240, height: 90, desc: '体育館や屋外フェンスの定番サイズ' },
  { label: '300 × 100 cm (大型・迫力)', width: 300, height: 100, desc: 'サッカー・野球など広い屋外会場向け' },
  { label: '120 × 60 cm (コンパクト)', width: 120, height: 60, desc: '1〜2人で手軽に持てるサイズ' },
  { label: '360 × 120 cm (特大サイズ)', width: 360, height: 120, desc: '大人数での記念撮影・スタジアム用' },
  { label: '90 × 180 cm (縦長・懸垂幕)', width: 90, height: 180, desc: '縦書きスローガンや垂れ幕に' },
];

const COLOR_SWATCHES = [
  '#ffffff', '#000000', '#dc2626', '#ea580c', '#facc15',
  '#16a34a', '#0284c7', '#1e3a8a', '#7e22ce', '#db2777',
  '#f8fafc', '#334155', '#991b1b', '#fef08a', '#bbf7d0'
];

const AI_STYLE_CHIPS = [
  '四字熟語風にかっこよく',
  '熱血・力強く',
  '韻を踏んでリズムよく',
  '短くインパクト重視',
  '英語・カタカナ交じりでクールに',
  '感動的・エモーショナルに',
  '古風・武士道風に',
  '爽やか・青春風に'
];

const AI_SPORT_CHIPS = [
  '指定なし', 'サッカー', '野球', 'バスケットボール', 'バレーボール',
  '陸上・駅伝', 'テニス', 'バドミントン', '剣道・柔道', '吹奏楽・文化祭'
];

const TEMPLATES = [
  {
    name: 'Lefty sniper AKIRA（白地×黒・赤）',
    width: 340,
    height: 60,
    bg: {
      type: 'solid',
      color1: '#ffffff',
      color2: '#f8fafc',
      gradientDir: 'horizontal',
      pattern: 'none',
      borderStyle: 'none',
      borderColor: '#000000',
      borderWidth: 2,
      grommets: false,
    },
    texts: [
      {
        id: 't1',
        text: 'Lefty sniper',
        x: 33,
        y: 38,
        fontSize: 38,
        fontId: 'anton',
        color: '#171717',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 1,
      },
      {
        id: 't2',
        text: 'AKIRA',
        x: 82,
        y: 38,
        fontSize: 38,
        fontId: 'anton',
        color: '#e62a1a',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 1,
      },
      {
        id: 't3',
        text: 'TOKYO-MACH',
        x: 45,
        y: 83,
        fontSize: 13,
        fontId: 'anton',
        color: '#171717',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 1,
      },
    ]
  },
  {
    name: '王道スポーツ応援（赤×白・黒）',
    width: 240,
    height: 90,
    bg: {
      type: 'gradient',
      color1: '#b91c1c',
      color2: '#7f1d1d',
      gradientDir: 'horizontal',
      pattern: 'slashes',
      borderStyle: 'double',
      borderColor: '#ffffff',
      borderWidth: 4,
      grommets: true,
    },
    texts: [
      {
        id: 't1',
        text: '必勝',
        x: 20,
        y: 50,
        fontSize: 42,
        fontId: 'brush',
        color: '#facc15',
        strokeColor: '#000000',
        strokeWidth: 2.5,
        shadow: true,
        isVertical: false,
        letterSpacing: 8,
      },
      {
        id: 't2',
        text: '心を一つに！勝利を掴め',
        x: 60,
        y: 38,
        fontSize: 22,
        fontId: 'sans',
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        shadow: true,
        isVertical: false,
        letterSpacing: 2,
      },
      {
        id: 't3',
        text: '青葉台高校サッカー部 父母会一同',
        x: 62,
        y: 76,
        fontSize: 11,
        fontId: 'sans',
        color: '#fef08a',
        strokeColor: '#000000',
        strokeWidth: 1,
        shadow: false,
        isVertical: false,
        letterSpacing: 1,
      },
    ]
  },
  {
    name: '爽やかブルー（青×白・黄色）',
    width: 300,
    height: 100,
    bg: {
      type: 'gradient',
      color1: '#0284c7',
      color2: '#1e3a8a',
      gradientDir: 'diagonal',
      pattern: 'none',
      borderStyle: 'single',
      borderColor: '#facc15',
      borderWidth: 5,
      grommets: true,
    },
    texts: [
      {
        id: 't1',
        text: '全力疾走',
        x: 50,
        y: 42,
        fontSize: 44,
        fontId: 'pop',
        color: '#ffffff',
        strokeColor: '#0f172a',
        strokeWidth: 3,
        shadow: true,
        isVertical: false,
        letterSpacing: 6,
      },
      {
        id: 't2',
        text: '〜 仲間と信じた道を最後まで 〜',
        x: 50,
        y: 78,
        fontSize: 14,
        fontId: 'round',
        color: '#facc15',
        strokeColor: '#0f172a',
        strokeWidth: 1.2,
        shadow: true,
        isVertical: false,
        letterSpacing: 2,
      }
    ]
  },
  {
    name: '伝統・武道風（白地×黒筆文字）',
    width: 180,
    height: 90,
    bg: {
      type: 'solid',
      color1: '#ffffff',
      color2: '#f1f5f9',
      gradientDir: 'horizontal',
      pattern: 'none',
      borderStyle: 'double',
      borderColor: '#0f172a',
      borderWidth: 4,
      grommets: true,
    },
    texts: [
      {
        id: 't1',
        text: '百折不撓',
        x: 45,
        y: 48,
        fontSize: 38,
        fontId: 'brush',
        color: '#0f172a',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 10,
      },
      {
        id: 't2',
        text: '剣道部',
        x: 86,
        y: 50,
        fontSize: 14,
        fontId: 'serif',
        color: '#b91c1c',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: true,
        letterSpacing: 4,
      }
    ]
  }
];

export default function App() {
  // --- ステート定義 ---
  // 横断幕サイズ (cm)
  const [bannerWidth, setBannerWidth] = useState(TEMPLATES[0].width);
  const [bannerHeight, setBannerHeight] = useState(TEMPLATES[0].height);

  // 背景・枠デザイン
  const [bgConfig, setBgConfig] = useState(TEMPLATES[0].bg);

  // 横断幕全体画像・背景画像の読み込みステート (Mode A)
  const [bgImage, setBgImage] = useState(null);
  // bgImage: { dataUrl, name, naturalWidth, naturalHeight, fitMode: 'stretch' | 'cover' | 'contain', opacity: 100, darkOverlay: 0 }
  const [showTextsOnBanner, setShowTextsOnBanner] = useState(true);
  const [isBgImageDragging, setIsBgImageDragging] = useState(false);
  const bgImageInputRef = useRef(null);

  // ロゴ・イラスト等のオーバーレイ画像レイヤーステート (Mode B)
  const [imageLayers, setImageLayers] = useState([]);
  // imageLayer: { id, name, dataUrl, x, y, widthPercent, aspectRatio, opacity, rotation, zOrder: 'behind' | 'front' }
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [activeLayerType, setActiveLayerType] = useState('text'); // 'text' | 'image'
  const overlayImageInputRef = useRef(null);

  // テキストレイヤー
  const [texts, setTexts] = useState(TEMPLATES[0].texts);
  const [selectedTextId, setSelectedTextId] = useState('t1');

  // 表示モード: 'split' (上下並列), 'edit' (デザイン編集拡大), 'scale' (人物サイズ比較拡大)
  const [viewMode, setViewMode] = useState('split');
  // コントロールパネルのタブ: 'text' | 'ai' | 'size_bg' | 'human' | 'template'
  const [activeTab, setActiveTab] = useState('text');

  // 人物サイズ比較の設定
  const [personHeight, setPersonHeight] = useState(170); // cm
  const [personCount, setPersonCount] = useState(3); // 人数
  const [holdStyle, setHoldStyle] = useState('hands'); // 'hands' (胸の前), 'waist' (腰の位置), 'high' (頭上), 'fence' (フェンス掲示)
  const [showDimensionLines, setShowDimensionLines] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  // AI文言提案機能用ステート
  const [aiBaseText, setAiBaseText] = useState('最後まであきらめずに走り抜いて勝つ');
  const [aiStyleRequest, setAiStyleRequest] = useState('熱血・力強く、スタジアムで映える表現');
  const [aiSport, setAiSport] = useState('サッカー');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // フォント検索＆カスタムフォント管理用ステート
  const [fontCatalog, setFontCatalog] = useState(INITIAL_FONT_CATALOG);
  const [customFontFacesCss, setCustomFontFacesCss] = useState([]); // [{ id, familyName, dataUrl, format }]
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [selectedFontCategory, setSelectedFontCategory] = useState('all');
  const [isFontDragging, setIsFontDragging] = useState(false);
  const [customGoogleFontInput, setCustomGoogleFontInput] = useState('');
  const [isLoadingFont, setIsLoadingFont] = useState(false);
  const fontFileInputRef = useRef(null);

  // 画像OCR文字読み取り＆デザイン復元用ステート
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  // ocrResult: { bgColor1, bgColor2, bgType, borderStyle, borderColor, texts: [...], sourceDataUrl, sourceName, naturalWidth, naturalHeight }
  const ocrFileInputRef = useRef(null);

  // ドラッグ操作用ステート
  const [draggingId, setDraggingId] = useState(null);
  const [draggingType, setDraggingType] = useState('text'); // 'text' | 'image'
  const dragOffset = useRef({ dx: 0, dy: 0 });
  const svgEditRef = useRef(null);
  const svgScaleRef = useRef(null);

  // 通知メッセージ用
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // 現在選択中のテキストオブジェクト
  const selectedText = texts.find((t) => t.id === selectedTextId) || texts[0] || null;
  // 現在選択中の画像レイヤーオブジェクト
  const selectedImageLayer =
    imageLayers.find((img) => img.id === selectedImageId) || imageLayers[0] || null;

  // --- 横断幕全体画像 / 背景画像の読み込み処理 (Mode A) ---
  const handleUploadBannerBgImage = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('画像ファイル（PNG, JPG, WebP, SVGなど）を選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const nw = img.naturalWidth || 1200;
        const nh = img.naturalHeight || 450;
        setBgImage({
          dataUrl,
          name: file.name,
          naturalWidth: nw,
          naturalHeight: nh,
          fitMode: 'stretch',
          opacity: 100,
          darkOverlay: 0,
        });
        showToast(`横断幕画像「${file.name}」を読み込みました！`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);

    if (bgImageInputRef.current) {
      bgImageInputRef.current.value = '';
    }
  };

  // --- 画像からOCR文字読み取り＆デザイン自動解析処理 (Gemini Multimodal API) ---
  const handleOcrImageUpload = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('画像ファイル（PNG, JPG, WebPなど）を選択してください');
      return;
    }

    setIsOcrLoading(true);
    setOcrError(null);
    setActiveTab('size_bg');

    try {
      // 1. DataURL と画像サイズを取得
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const imgDimensions = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({
            width: img.naturalWidth || 1200,
            height: img.naturalHeight || 450,
          });
        img.onerror = () => resolve({ width: 1200, height: 450 });
        img.src = dataUrl;
      });

      // 元画像を一旦背景にもセットしておく
      setBgImage({
        dataUrl,
        name: file.name,
        naturalWidth: imgDimensions.width,
        naturalHeight: imgDimensions.height,
        fitMode: 'stretch',
        opacity: 100,
        darkOverlay: 0,
      });

      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/png';

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemPrompt = `あなたは横断幕（スポーツ応援幕・イベントバナー）の画像解析およびOCRの専門AIです。
入力された横断幕の画像から、書かれているすべての文字（メインスローガン、サブコピー、チーム名、個人名など）とレイアウト・配色を正確に読み取り、編集可能なデータとして復元するためのJSONを出力してください。

各項目は以下の基準で抽出してください：
- bgType: 背景が単色なら "solid"、グラデーションなら "gradient"
- bgColor1: 横断幕のメイン背景色（#RRGGBB形式のHEXカラーコード）
- bgColor2: グラデーションの終了色（単色の場合はbgColor1に近い色、#RRGGBB形式）
- borderStyle: 枠線がある場合は "single" または "double"、ない場合は "none"
- borderColor: 枠線の色（#RRGGBB形式）
- texts: 画像内の各テキスト塊の配列。それぞれ以下のプロパティを持つ：
  - text: 読み取った文字列（改行がある場合は \\n を含める）
  - x: 横断幕の左端を0、右端を100としたときのテキスト中心のX座標（0〜100の数値）
  - y: 横断幕の上端を0、下端を100としたときのテキスト中心のY座標（0〜100の数値）
  - sizeRatio: 横断幕の縦幅を100としたときの1文字あたりの大きさ比率（目安: 大見出しは25〜45、中見出しは14〜24、小文字・団体名は8〜13）
  - isVertical: 縦書きなら true、横書きなら false
  - color: 文字本体の色（#RRGGBB形式）
  - strokeColor: 文字のフチ取りの色（フチがない場合も視認性の良い色 #RRGGBB形式）
  - hasStroke: 文字にフチ取りがあるかどうか（true / false）
  - fontId: 書体の見た目に最も近いものを次から1つ選択: "brush"(筆文字・毛筆), "sans"(角ゴシック・太字), "pop"(極太インパクト), "serif"(明朝体), "round"(丸ゴシック)`;

      const userPrompt = `この横断幕画像の文字（OCR）・配置座標・文字サイズ比率・配色・書体タイプを解析してJSON形式で出力してください。`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: userPrompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              bgType: { type: 'STRING' },
              bgColor1: { type: 'STRING' },
              bgColor2: { type: 'STRING' },
              borderStyle: { type: 'STRING' },
              borderColor: { type: 'STRING' },
              texts: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    text: { type: 'STRING' },
                    x: { type: 'NUMBER' },
                    y: { type: 'NUMBER' },
                    sizeRatio: { type: 'NUMBER' },
                    isVertical: { type: 'BOOLEAN' },
                    color: { type: 'STRING' },
                    strokeColor: { type: 'STRING' },
                    hasStroke: { type: 'BOOLEAN' },
                    fontId: { type: 'STRING' },
                  },
                  required: [
                    'text',
                    'x',
                    'y',
                    'sizeRatio',
                    'isVertical',
                    'color',
                    'strokeColor',
                    'hasStroke',
                    'fontId',
                  ],
                },
              },
            },
            required: ['bgType', 'bgColor1', 'bgColor2', 'borderStyle', 'borderColor', 'texts'],
          },
        },
      };

      const delays = [1000, 2000, 4000, 8000];
      let parsedData = null;
      let lastErr = null;

      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          const result = await response.json();
          const jsonStr = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!jsonStr) throw new Error('Empty OCR response');
          parsedData = JSON.parse(jsonStr);
          break;
        } catch (err) {
          lastErr = err;
          if (attempt < delays.length) {
            await new Promise((r) => setTimeout(r, delays[attempt]));
          }
        }
      }

      if (!parsedData) {
        throw lastErr || new Error('OCR解析結果を取得できませんでした');
      }

      const fullOcrData = {
        ...parsedData,
        sourceDataUrl: dataUrl,
        sourceName: file.name,
        naturalWidth: imgDimensions.width,
        naturalHeight: imgDimensions.height,
      };

      setOcrResult(fullOcrData);
      // 解析完了と同時に「完全復元モード（編集可能なテキスト＋背景色）」で即座にキャンバスへ反映
      applyOcrResultToCanvas(fullOcrData, 'reconstruct');
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrError('画像のOCR文字解析に失敗しました。別の画像でお試しください。');
      showToast('OCR読み取りに失敗しました');
    } finally {
      setIsOcrLoading(false);
      if (ocrFileInputRef.current) {
        ocrFileInputRef.current.value = '';
      }
    }
  };

  // OCR解析結果を横断幕キャンバスへ反映する関数
  // mode: 'reconstruct' (元画像を消して背景色＋編集可能テキストで完全再現) | 'overlay' (元画像を半透明で下に敷いてテキストを重ねる)
  const applyOcrResultToCanvas = (data = ocrResult, mode = 'reconstruct') => {
    if (!data) return;

    // 画像の縦横比から横断幕の縦幅(cm)を自然な比率に調整
    let targetHeight = bannerHeight;
    if (data.naturalWidth && data.naturalHeight) {
      const ratio = data.naturalWidth / data.naturalHeight;
      targetHeight = Math.max(45, Math.min(240, Math.round(bannerWidth / ratio)));
      setBannerHeight(targetHeight);
    }

    // 背景設定の反映
    const validBgType = data.bgType === 'gradient' ? 'gradient' : 'solid';
    const validBorder = ['none', 'single', 'double', 'inner_frame'].includes(data.borderStyle)
      ? data.borderStyle
      : 'single';

    setBgConfig((prev) => ({
      ...prev,
      type: validBgType,
      color1: data.bgColor1 || '#1e3a8a',
      color2: data.bgColor2 || data.bgColor1 || '#0f172a',
      borderStyle: validBorder,
      borderColor: data.borderColor || '#ffffff',
    }));

    // 読み取ったテキスト配列をレイヤーに変換
    if (Array.isArray(data.texts) && data.texts.length > 0) {
      const reconstructedTexts = data.texts.map((t, idx) => {
        const ratio = Math.max(6, Math.min(60, Number(t.sizeRatio) || 20));
        const calcFontSize = Math.max(8, Math.round((targetHeight * ratio) / 100));
        const validFontId = fontCatalog.some((f) => f.id === t.fontId) ? t.fontId : 'sans';

        return {
          id: `ocr_${Date.now()}_${idx}`,
          text: t.text || 'テキスト',
          x: Math.max(5, Math.min(95, Math.round((Number(t.x) || 50) * 10) / 10)),
          y: Math.max(5, Math.min(95, Math.round((Number(t.y) || 50) * 10) / 10)),
          fontSize: calcFontSize,
          fontId: validFontId,
          color: t.color || '#ffffff',
          strokeColor: t.strokeColor || '#000000',
          strokeWidth: t.hasStroke ? 2 : 0,
          shadow: true,
          isVertical: Boolean(t.isVertical),
          letterSpacing: 2,
        };
      });

      setTexts(reconstructedTexts);
      setSelectedTextId(reconstructedTexts[0]?.id || null);
    }

    setShowTextsOnBanner(true);

    if (mode === 'reconstruct') {
      // 元画像を非表示にして、抽出した背景色＋テキストのみで編集可能にする
      setBgImage(null);
      showToast(`OCRで ${data.texts?.length || 0} 個の文言を読み取り、編集可能な状態で復元しました！`);
    } else {
      // 元画像を半透明で下に敷いて位置合わせしやすくする
      setBgImage({
        dataUrl: data.sourceDataUrl,
        name: data.sourceName,
        naturalWidth: data.naturalWidth,
        naturalHeight: data.naturalHeight,
        fitMode: 'stretch',
        opacity: 40,
        darkOverlay: 20,
      });
      showToast('元画像を半透明で下に敷き、読み取った文字を重ねました');
    }
  };

  // 画像の縦横比に合わせて横断幕サイズ(cm)を自動調整
  const fitBannerSizeToImageRatio = (keepAxis = 'width') => {
    if (!bgImage || !bgImage.naturalWidth || !bgImage.naturalHeight) return;
    const ratio = bgImage.naturalWidth / bgImage.naturalHeight;
    if (keepAxis === 'width') {
      const nextHeight = Math.max(30, Math.min(300, Math.round(bannerWidth / ratio)));
      setBannerHeight(nextHeight);
      showToast(`横幅${bannerWidth}cmに合わせ、縦幅を${nextHeight}cmに調整しました`);
    } else {
      const nextWidth = Math.max(60, Math.min(600, Math.round(bannerHeight * ratio)));
      setBannerWidth(nextWidth);
      showToast(`縦幅${bannerHeight}cmに合わせ、横幅を${nextWidth}cmに調整しました`);
    }
  };

  // --- ロゴ・イラスト等のオーバーレイ画像追加処理 (Mode B) ---
  const handleUploadOverlayImage = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('画像ファイルを選択してください');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const nw = img.naturalWidth || 300;
          const nh = img.naturalHeight || 300;
          const aspect = nw / nh;
          const newId = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
          const newLayer = {
            id: newId,
            name: file.name.replace(/\.[^/.]+$/, ''),
            dataUrl,
            x: 18,
            y: 50,
            widthPercent: 18,
            aspectRatio: aspect,
            opacity: 100,
            rotation: 0,
            zOrder: 'front',
          };
          setImageLayers((prev) => [...prev, newLayer]);
          setSelectedImageId(newId);
          setActiveLayerType('image');
          setActiveTab('text');
          showToast(`画像レイヤー「${newLayer.name}」を追加しました`);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    if (overlayImageInputRef.current) {
      overlayImageInputRef.current.value = '';
    }
  };

  const updateSelectedImageLayer = (updates) => {
    if (!selectedImageLayer) return;
    setImageLayers((prev) =>
      prev.map((item) => (item.id === selectedImageLayer.id ? { ...item, ...updates } : item))
    );
  };

  const deleteSelectedImageLayer = (targetId) => {
    const idToRemove = targetId || selectedImageLayer?.id;
    if (!idToRemove) return;
    const remaining = imageLayers.filter((item) => item.id !== idToRemove);
    setImageLayers(remaining);
    setSelectedImageId(remaining[remaining.length - 1]?.id || null);
    showToast('画像レイヤーを削除しました');
  };

  // --- フォント検索フィルタリング ---
  const filteredFonts = fontCatalog.filter((f) => {
    const matchesCategory =
      selectedFontCategory === 'all' || f.category === selectedFontCategory;
    const q = fontSearchQuery.trim().toLowerCase();
    if (!q) return matchesCategory;
    const matchName = f.name.toLowerCase().includes(q);
    const matchTags = (f.tags || '').toLowerCase().includes(q);
    const matchFamily = f.family.toLowerCase().includes(q);
    return matchesCategory && (matchName || matchTags || matchFamily);
  });

  // --- ローカルのフォントファイル (.ttf / .otf / .woff / .woff2) の読み込み処理 ---
  const handleUploadFontFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsLoadingFont(true);

    for (const file of Array.from(fileList)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
        showToast('対応形式は .ttf, .otf, .woff, .woff2 です');
        continue;
      }

      try {
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const cleanFamilyName = `CustomFont_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;

        // 1. ArrayBufferとして読み込みブラウザのFontFace APIに登録
        const arrayBuffer = await file.arrayBuffer();
        const fontFace = new FontFace(cleanFamilyName, arrayBuffer);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);

        // 2. DataURLとしても保持し、SVGの<style>に埋め込むことでPNG書き出し時にもカスタムフォントを維持
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const formatMap = {
          ttf: 'truetype',
          otf: 'opentype',
          woff: 'woff',
          woff2: 'woff2',
        };
        const formatStr = formatMap[ext] || 'truetype';

        const newFontId = 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
        const newFontItem = {
          id: newFontId,
          name: `${baseName} (追加フォント)`,
          family: `'${cleanFamilyName}', sans-serif`,
          cleanFamilyName,
          weight: 'normal',
          category: 'custom',
          isCustom: true,
          fileName: file.name,
          tags: `custom 追加 アップロード ${baseName.toLowerCase()}`,
        };

        setCustomFontFacesCss((prev) => [
          ...prev,
          { id: newFontId, familyName: cleanFamilyName, dataUrl, format: formatStr },
        ]);
        setFontCatalog((prev) => [newFontItem, ...prev]);

        // 現在選択中のテキストがあれば即座にそのフォントを適用
        if (selectedText) {
          updateSelectedText({ fontId: newFontId });
        }
        showToast(`フォント「${baseName}」を追加し適用しました！`);
      } catch (err) {
        console.error('Font load error:', err);
        showToast(`フォント「${file.name}」の読み込みに失敗しました`);
      }
    }

    setIsLoadingFont(false);
    if (fontFileInputRef.current) {
      fontFileInputRef.current.value = '';
    }
  };

  // カスタムフォントの削除
  const removeCustomFont = (fontId) => {
    setFontCatalog((prev) => prev.filter((f) => f.id !== fontId));
    setCustomFontFacesCss((prev) => prev.filter((c) => c.id !== fontId));
    setTexts((prev) =>
      prev.map((t) => (t.fontId === fontId ? { ...t, fontId: 'sans' } : t))
    );
    showToast('追加フォントを削除しました');
  };

  // Google Fontsから任意のフォント名で動的に読み込む
  const handleLoadGoogleFontByName = async (rawName) => {
    const fontName = (rawName || customGoogleFontInput || fontSearchQuery).trim();
    if (!fontName) {
      showToast('読み込むGoogleフォント名を入力してください');
      return;
    }

    setIsLoadingFont(true);
    try {
      const formattedFamily = fontName.replace(/\s+/g, '+');
      const cssUrl = `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@400;700;900&display=swap`;

      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = cssUrl;
      document.head.appendChild(linkEl);

      await new Promise((resolve) => {
        linkEl.onload = resolve;
        linkEl.onerror = resolve;
        setTimeout(resolve, 1500);
      });

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const newFontId = 'gfont_' + Date.now();
      const newFontObj = {
        id: newFontId,
        name: `${fontName} (Google Font)`,
        googleFamily: `${formattedFamily}:wght@400;700;900`,
        family: `'${fontName}', sans-serif`,
        weight: '700',
        category: 'custom',
        isDynamicGoogle: true,
        tags: `google ${fontName.toLowerCase()}`,
      };

      setFontCatalog((prev) => [newFontObj, ...prev]);
      if (selectedText) {
        updateSelectedText({ fontId: newFontId });
      }
      setCustomGoogleFontInput('');
      showToast(`Google Fontsから「${fontName}」を読み込みました`);
    } catch (err) {
      console.error(err);
      showToast('Googleフォントの読み込みに失敗しました');
    } finally {
      setIsLoadingFont(false);
    }
  };

  // --- テキスト操作関数 ---
  const updateSelectedText = (updates) => {
    if (!selectedText) return;
    setTexts((prev) =>
      prev.map((item) => (item.id === selectedText.id ? { ...item, ...updates } : item))
    );
  };

  const addNewText = (customProps = {}) => {
    const newId = 't_' + Date.now() + Math.random().toString(36).slice(2, 5);
    const newLayer = {
      id: newId,
      text: '新規テキスト',
      x: 50,
      y: 50,
      fontSize: Math.round(bannerHeight * 0.22),
      fontId: 'sans',
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 1.5,
      shadow: true,
      isVertical: false,
      letterSpacing: 2,
      ...customProps,
    };
    setTexts((prev) => [...prev, newLayer]);
    setSelectedTextId(newId);
    showToast('新しいテキストを追加しました');
  };

  const duplicateSelectedText = () => {
    if (!selectedText) return;
    const newId = 't_' + Date.now();
    const copy = {
      ...selectedText,
      id: newId,
      x: Math.min(95, selectedText.x + 5),
      y: Math.min(95, selectedText.y + 8),
    };
    setTexts((prev) => [...prev, copy]);
    setSelectedTextId(newId);
    showToast('テキストを複製しました');
  };

  const deleteSelectedText = () => {
    if (!selectedText) return;
    if (texts.length <= 1) {
      showToast('最低1つのテキストレイヤーが必要です');
      return;
    }
    const remaining = texts.filter((t) => t.id !== selectedText.id);
    setTexts(remaining);
    setSelectedTextId(remaining[remaining.length - 1]?.id || null);
    showToast('テキストを削除しました');
  };

  const moveLayerOrder = (direction) => {
    if (!selectedText) return;
    const idx = texts.findIndex((t) => t.id === selectedText.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= texts.length) return;
    const copy = [...texts];
    const [removed] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, removed);
    setTexts(copy);
  };

  // --- Gemini APIによる文言書き換え・スローガン提案処理 ---
  const generateAiSlogans = async () => {
    if (!aiBaseText.trim() && !aiStyleRequest.trim()) {
      setAiError('元の言葉や、どんな表現にしたいかの要望を入力してください。');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = `あなたはスポーツ応援やイベントの横断幕（バナー）専門のプロコピーライターです。
ユーザーの「伝えたい元の言葉・思い」「希望する表現テイスト」「競技・用途」をもとに、横断幕に大きく掲げた際に心に響き、視覚的にも映えるスローガン・書き換え案を5つ提案してください。
各案には以下を含めてください：
- mainText: 横断幕のメインとなる文言（短いスローガン、四字熟語、力強いフレーズなど）
- subText: メイン文言に添えると映えるサブコピー（不要な場合でもおすすめの補足フレーズを提案）
- description: 読み方や言葉の意味、なぜこの表現が横断幕におすすめかの短い解説
- recommendedFont: この文言に合うフォントタイプ（'brush'=毛筆・筆文字, 'sans'=角ゴシック, 'serif'=明朝体, 'pop'=極太ポップ, 'round'=丸ゴシック のいずれか）`;

    const userPrompt = `【伝えたい元の言葉・思い】: ${aiBaseText || '（おまかせ）'}
【希望する表現・テイスト】: ${aiStyleRequest || '横断幕らしく迫力のある表現'}
【競技・用途】: ${aiSport || '指定なし'}

上記の条件にぴったりの横断幕スローガン・書き換え案を5つ作成してください。`;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              mainText: { type: "STRING" },
              subText: { type: "STRING" },
              description: { type: "STRING" },
              recommendedFont: { type: "STRING" }
            },
            required: ["mainText", "subText", "description", "recommendedFont"],
            propertyOrdering: ["mainText", "subText", "description", "recommendedFont"]
          }
        }
      }
    };

    // 指数バックオフ付きリトライ通信
    const delays = [1000, 2000, 4000, 8000, 16000];
    let lastError = null;

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API HTTP status: ${response.status}`);
        }

        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
          throw new Error('AIからの応答データが空でした。');
        }

        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAiSuggestions(parsed);
          setIsAiLoading(false);
          showToast('AIが5つのスローガン案を作成しました！');
          return;
        } else {
          throw new Error('提案データの形式が正しくありません。');
        }
      } catch (err) {
        lastError = err;
        if (attempt < delays.length) {
          await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
        }
      }
    }

    console.error(lastError);
    setAiError('AI提案の取得中にエラーが発生しました。もう一度お試しください。');
    setIsAiLoading(false);
  };

  // AI提案をキャンバスへ反映する関数
  const applySuggestionToSelected = (textValue, fontId) => {
    if (!selectedText) {
      addNewText({
        text: textValue,
        fontId: fontCatalog.some((f) => f.id === fontId) ? fontId : 'sans',
      });
      return;
    }
    const updates = { text: textValue };
    if (fontId && fontCatalog.some((f) => f.id === fontId)) {
      updates.fontId = fontId;
    }
    updateSelectedText(updates);
    showToast(`「${textValue}」を選択中の文字に反映しました`);
  };

  const applyBothMainAndSub = (item) => {
    const validFont = fontCatalog.some((f) => f.id === item.recommendedFont)
      ? item.recommendedFont
      : 'sans';

    if (selectedText) {
      updateSelectedText({
        text: item.mainText,
        fontId: validFont,
        y: 38,
        fontSize: Math.round(bannerHeight * 0.32),
      });
    } else {
      addNewText({
        text: item.mainText,
        fontId: validFont,
        x: 50,
        y: 38,
        fontSize: Math.round(bannerHeight * 0.32),
      });
    }

    if (item.subText) {
      addNewText({
        text: item.subText,
        fontId: 'sans',
        x: 50,
        y: 74,
        fontSize: Math.round(bannerHeight * 0.14),
        color: '#fef08a',
      });
    }
    showToast('メイン文言とサブコピーを横断幕に反映しました！');
  };

  // --- SVGキャンバス上でのドラッグ移動処理 ---
  const getSvgCoordinates = (e, svgElement) => {
    if (!svgElement) return { x: 0, y: 0 };
    const rect = svgElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;
    return { x: relX, y: relY };
  };

  const handlePointerDownText = (e, item) => {
    e.stopPropagation();
    setSelectedTextId(item.id);
    setActiveLayerType('text');
    if (!svgEditRef.current) return;
    const coords = getSvgCoordinates(e, svgEditRef.current);
    dragOffset.current = {
      dx: item.x - coords.x,
      dy: item.y - coords.y,
    };
    setDraggingType('text');
    setDraggingId(item.id);
  };

  const handlePointerDownImageLayer = (e, imgItem) => {
    e.stopPropagation();
    setSelectedImageId(imgItem.id);
    setActiveLayerType('image');
    if (!svgEditRef.current) return;
    const coords = getSvgCoordinates(e, svgEditRef.current);
    dragOffset.current = {
      dx: imgItem.x - coords.x,
      dy: imgItem.y - coords.y,
    };
    setDraggingType('image');
    setDraggingId(imgItem.id);
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!draggingId || !svgEditRef.current) return;
      const coords = getSvgCoordinates(e, svgEditRef.current);
      const nextX = Math.max(0, Math.min(100, Math.round((coords.x + dragOffset.current.dx) * 10) / 10));
      const nextY = Math.max(0, Math.min(100, Math.round((coords.y + dragOffset.current.dy) * 10) / 10));
      if (draggingType === 'image') {
        setImageLayers((prev) =>
          prev.map((img) => (img.id === draggingId ? { ...img, x: nextX, y: nextY } : img))
        );
      } else {
        setTexts((prev) =>
          prev.map((t) => (t.id === draggingId ? { ...t, x: nextX, y: nextY } : t))
        );
      }
    },
    [draggingId, draggingType]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingId, handlePointerMove, handlePointerUp]);

  // --- テンプレート読み込み ---
  const applyTemplate = (tpl) => {
    setBannerWidth(tpl.width);
    setBannerHeight(tpl.height);
    setBgConfig({ ...tpl.bg });
    const newTexts = tpl.texts.map((t) => ({
      ...t,
      id: 't_' + Math.random().toString(36).slice(2, 7),
    }));
    setTexts(newTexts);
    setSelectedTextId(newTexts[0]?.id || null);
    showToast(`テンプレート「${tpl.name}」を適用しました`);
  };

  // --- PNG画像ダウンロード処理 ---
  const downloadSvgAsPng = (svgElement, filename, exportWidthPx = 1600) => {
    if (!svgElement) return;
    try {
      const clone = svgElement.cloneNode(true);
      const guides = clone.querySelectorAll('.editor-only-guide');
      guides.forEach((g) => g.remove());

      const viewBox = clone.getAttribute('viewBox').split(' ').map(Number);
      const vbWidth = viewBox[2];
      const vbHeight = viewBox[3];
      const exportHeightPx = Math.round((exportWidthPx * vbHeight) / vbWidth);

      clone.setAttribute('width', exportWidthPx);
      clone.setAttribute('height', exportHeightPx);

      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = exportWidthPx;
        canvas.height = exportHeightPx;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, exportWidthPx, exportHeightPx);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        showToast(`${filename} を保存しました`);
      };
      img.src = url;
    } catch (err) {
      console.error(err);
      showToast('画像の書き出しに失敗しました');
    }
  };

  // --- ハトメ（穴）座標の計算 ---
  const getGrommetPositions = (w, h) => {
    const margin = Math.max(2.5, Math.min(w, h) * 0.035);
    const cols = Math.max(2, Math.round(w / 60) + 1);
    const rows = Math.max(2, Math.round(h / 60) + 1);
    const points = [];

    for (let i = 0; i < cols; i++) {
      const x = margin + (i * (w - margin * 2)) / (cols - 1);
      points.push({ x, y: margin });
      points.push({ x, y: h - margin });
    }
    for (let j = 1; j < rows - 1; j++) {
      const y = margin + (j * (h - margin * 2)) / (rows - 1);
      points.push({ x: margin, y });
      points.push({ x: w - margin, y });
    }
    return points;
  };

  // --- 横断幕の共通SVG描画パーツ ---
  const renderBannerArtwork = (idPrefix = 'edit', isInteractive = false) => {
    const w = bannerWidth;
    const h = bannerHeight;
    const grommets = bgConfig.grommets ? getGrommetPositions(w, h) : [];
    const bw = bgConfig.borderWidth;

    const getPreserveAspectRatio = (fitMode) => {
      if (fitMode === 'contain') return 'xMidYMid meet';
      if (fitMode === 'cover') return 'xMidYMid slice';
      return 'none';
    };

    const renderSingleImageLayer = (imgItem) => {
      const imgW = (imgItem.widthPercent / 100) * w;
      const imgH = imgW / (imgItem.aspectRatio || 1);
      const posX = (imgItem.x / 100) * w;
      const posY = (imgItem.y / 100) * h;
      const isSelected =
        isInteractive && activeLayerType === 'image' && selectedImageId === imgItem.id;

      return (
        <g
          key={imgItem.id}
          transform={`translate(${posX}, ${posY}) rotate(${imgItem.rotation || 0})`}
          onMouseDown={
            isInteractive ? (e) => handlePointerDownImageLayer(e, imgItem) : undefined
          }
          onTouchStart={
            isInteractive ? (e) => handlePointerDownImageLayer(e, imgItem) : undefined
          }
          style={{ cursor: isInteractive ? 'move' : 'default', userSelect: 'none' }}
          opacity={(imgItem.opacity ?? 100) / 100}
        >
          <image
            href={imgItem.dataUrl}
            x={-imgW / 2}
            y={-imgH / 2}
            width={imgW}
            height={imgH}
            preserveAspectRatio="xMidYMid meet"
          />
          {isSelected && (
            <rect
              className="editor-only-guide"
              x={-imgW / 2 - w * 0.005}
              y={-imgH / 2 - w * 0.005}
              width={imgW + w * 0.01}
              height={imgH + w * 0.01}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={Math.max(1, w * 0.004)}
              strokeDasharray={`${w * 0.012},${w * 0.008}`}
            />
          )}
        </g>
      );
    };

    const behindImages = imageLayers.filter((img) => img.zOrder === 'behind');
    const frontImages = imageLayers.filter((img) => img.zOrder !== 'behind');

    return (
      <g>
        <defs>
          {/* アップロードされたカスタムフォントをSVG内にも埋め込み、PNG書き出し時にも反映 */}
          {customFontFacesCss.length > 0 && (
            <style>
              {customFontFacesCss
                .map(
                  (cf) =>
                    `@font-face { font-family: '${cf.familyName}'; src: url('${cf.dataUrl}') format('${cf.format}'); font-weight: normal; font-style: normal; }`
                )
                .join('\n')}
            </style>
          )}
          <linearGradient
            id={`${idPrefix}-bg-grad`}
            x1="0%"
            y1="0%"
            x2={bgConfig.gradientDir === 'vertical' ? '0%' : '100%'}
            y2={bgConfig.gradientDir === 'horizontal' ? '0%' : '100%'}
          >
            <stop offset="0%" stopColor={bgConfig.color1} />
            <stop offset="100%" stopColor={bgConfig.color2} />
          </linearGradient>

          <filter id={`${idPrefix}-drop-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx={w * 0.004}
              dy={w * 0.005}
              stdDeviation={w * 0.003}
              floodColor="#000000"
              floodOpacity="0.65"
            />
          </filter>

          <pattern
            id={`${idPrefix}-pattern-slashes`}
            width={w * 0.08}
            height={w * 0.08}
            patternTransform="rotate(35 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <rect width={w * 0.035} height={w * 0.08} fill="#ffffff" fillOpacity="0.06" />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-checkered`}
            width={h * 0.25}
            height={h * 0.25}
            patternUnits="userSpaceOnUse"
          >
            <rect width={h * 0.125} height={h * 0.125} fill="#ffffff" fillOpacity="0.07" />
            <rect
              x={h * 0.125}
              y={h * 0.125}
              width={h * 0.125}
              height={h * 0.125}
              fill="#ffffff"
              fillOpacity="0.07"
            />
          </pattern>

          <radialGradient id={`${idPrefix}-pattern-radial`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </radialGradient>

          <clipPath id={`${idPrefix}-banner-clip`}>
            <rect x="0" y="0" width={w} height={h} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${idPrefix}-banner-clip)`}>
          {/* 1. ベース背景 */}
          <rect
            x="0"
            y="0"
            width={w}
            height={h}
            fill={bgConfig.type === 'gradient' ? `url(#${idPrefix}-bg-grad)` : bgConfig.color1}
          />

          {/* 2. 背景パターン */}
          {bgConfig.pattern === 'slashes' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-slashes)`} />
          )}
          {bgConfig.pattern === 'checkered' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-checkered)`} />
          )}
          {bgConfig.pattern === 'spotlight' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-radial)`} />
          )}

          {/* 2.5 読み込んだ横断幕全体画像 / 背景画像 (Mode A) */}
          {bgImage && (
            <g>
              <image
                href={bgImage.dataUrl}
                x="0"
                y="0"
                width={w}
                height={h}
                preserveAspectRatio={getPreserveAspectRatio(bgImage.fitMode)}
                opacity={(bgImage.opacity ?? 100) / 100}
              />
              {bgImage.darkOverlay !== 0 && (
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  fill={bgImage.darkOverlay > 0 ? '#000000' : '#ffffff'}
                  opacity={Math.abs(bgImage.darkOverlay) / 100}
                />
              )}
            </g>
          )}

          {/* 3. 枠線（ボーダー） */}
          {bgConfig.borderStyle === 'single' && bw > 0 && (
            <rect
              x={bw * 1.2}
              y={bw * 1.2}
              width={w - bw * 2.4}
              height={h - bw * 2.4}
              fill="none"
              stroke={bgConfig.borderColor}
              strokeWidth={bw * 0.8}
            />
          )}
          {bgConfig.borderStyle === 'double' && bw > 0 && (
            <g>
              <rect
                x={bw * 1.0}
                y={bw * 1.0}
                width={w - bw * 2.0}
                height={h - bw * 2.0}
                fill="none"
                stroke={bgConfig.borderColor}
                strokeWidth={bw * 0.65}
              />
              <rect
                x={bw * 2.2}
                y={bw * 2.2}
                width={w - bw * 4.4}
                height={h - bw * 4.4}
                fill="none"
                stroke={bgConfig.borderColor}
                strokeWidth={bw * 0.3}
              />
            </g>
          )}
          {bgConfig.borderStyle === 'inner_frame' && bw > 0 && (
            <g>
              <rect
                x="0"
                y="0"
                width={w}
                height={h}
                fill="none"
                stroke={bgConfig.borderColor}
                strokeWidth={bw * 2.2}
              />
            </g>
          )}

          {/* 4. 編集用グリッド */}
          {isInteractive && showGrid && (
            <g className="editor-only-guide" opacity="0.35">
              <line x1={w * 0.5} y1="0" x2={w * 0.5} y2={h} stroke="#38bdf8" strokeWidth={w * 0.003} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
              <line x1="0" y1={h * 0.5} x2={w} y2={h * 0.5} stroke="#38bdf8" strokeWidth={w * 0.003} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
              <line x1={w * 0.25} y1="0" x2={w * 0.25} y2={h} stroke="#ffffff" strokeWidth={w * 0.0015} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
              <line x1={w * 0.75} y1="0" x2={w * 0.75} y2={h} stroke="#ffffff" strokeWidth={w * 0.0015} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
              <line x1="0" y1={h * 0.25} x2={w} y2={h * 0.25} stroke="#ffffff" strokeWidth={w * 0.0015} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
              <line x1="0" y1={h * 0.75} x2={w} y2={h * 0.75} stroke="#ffffff" strokeWidth={w * 0.0015} strokeDasharray={`${w * 0.01},${w * 0.01}`} />
            </g>
          )}

          {/* 4.5 テキスト背面の追加画像レイヤー */}
          {behindImages.map((imgItem) => renderSingleImageLayer(imgItem))}

          {/* 5. テキストレイヤー */}
          {showTextsOnBanner &&
            texts.map((item) => {
              const fontObj = fontCatalog.find((f) => f.id === item.fontId) || fontCatalog[0];
              const posX = (item.x / 100) * w;
              const posY = (item.y / 100) * h;
              const lines = item.text.split('\n');
              const isSelected =
                isInteractive && activeLayerType === 'text' && selectedTextId === item.id;
              const lineHeight = item.fontSize * 1.18;

              return (
                <g
                  key={item.id}
                  transform={`translate(${posX}, ${posY})`}
                  onMouseDown={isInteractive ? (e) => handlePointerDownText(e, item) : undefined}
                  onTouchStart={isInteractive ? (e) => handlePointerDownText(e, item) : undefined}
                  style={{ cursor: isInteractive ? 'move' : 'default', userSelect: 'none' }}
                >
                  {isSelected && (
                    <g className="editor-only-guide">
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.max(2, w * 0.008)}
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth={w * 0.003}
                      />
                    </g>
                  )}

                  {!item.isVertical ? (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily={fontObj.family}
                      fontWeight={fontObj.weight}
                      fontSize={item.fontSize}
                      fill={item.color}
                      stroke={item.strokeWidth > 0 ? item.strokeColor : 'none'}
                      strokeWidth={item.strokeWidth}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      paintOrder="stroke fill"
                      letterSpacing={item.letterSpacing}
                      filter={item.shadow ? `url(#${idPrefix}-drop-shadow)` : undefined}
                    >
                      {lines.map((line, idx) => {
                        const offsetY = (idx - (lines.length - 1) / 2) * lineHeight;
                        return (
                          <tspan key={idx} x="0" y={offsetY} dominantBaseline="central">
                            {line}
                          </tspan>
                        );
                      })}
                    </text>
                  ) : (
                    <g filter={item.shadow ? `url(#${idPrefix}-drop-shadow)` : undefined}>
                      {lines.map((colText, colIdx) => {
                        const colOffsetX = ((lines.length - 1) / 2 - colIdx) * (item.fontSize * 1.25);
                        const chars = Array.from(colText);
                        const stepY = item.fontSize + item.letterSpacing;
                        return (
                          <g key={colIdx} transform={`translate(${colOffsetX}, 0)`}>
                            {chars.map((ch, charIdx) => {
                              const charOffsetY = (charIdx - (chars.length - 1) / 2) * stepY;
                              const isRotatedChar = ['ー', '〜', '～', '(', ')', '（', '）', '「', '」', '-'].includes(ch);
                              return (
                                <text
                                  key={charIdx}
                                  x="0"
                                  y={charOffsetY}
                                  transform={
                                    isRotatedChar
                                      ? `rotate(90, 0, ${charOffsetY})`
                                      : undefined
                                  }
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fontFamily={fontObj.family}
                                  fontWeight={fontObj.weight}
                                  fontSize={item.fontSize}
                                  fill={item.color}
                                  stroke={item.strokeWidth > 0 ? item.strokeColor : 'none'}
                                  strokeWidth={item.strokeWidth}
                                  strokeLinejoin="round"
                                  paintOrder="stroke fill"
                                >
                                  {ch}
                                </text>
                              );
                            })}
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}

          {/* 5.5 テキスト前面の追加画像レイヤー */}
          {frontImages.map((imgItem) => renderSingleImageLayer(imgItem))}

          {/* 6. ハトメ（周囲の金属リング穴） */}
          {grommets.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={Math.max(1.2, Math.min(w, h) * 0.015)}
                fill="#e2e8f0"
                stroke="#64748b"
                strokeWidth={Math.max(0.4, Math.min(w, h) * 0.004)}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={Math.max(0.6, Math.min(w, h) * 0.007)}
                fill="#334155"
              />
            </g>
          ))}
        </g>
      </g>
    );
  };

  // --- 人物シルエット描画関数 (1cm = 1unit で正確に身長を表現) ---
  const renderPersonSilhouette = (centerX, groundY, heightCm, index, holdingStyle) => {
    const s = heightCm / 170;
    const headRadius = 11.5 * s;
    const headCenterY = groundY - heightCm + headRadius;
    const neckBottomY = headCenterY + headRadius + 4 * s;
    const shoulderWidth = 40 * s;
    const torsoWidth = 28 * s;
    const hipY = groundY - 78 * s;

    return (
      <g key={index}>
        <ellipse
          cx={centerX}
          cy={groundY}
          rx={18 * s}
          ry={3.5 * s}
          fill="#0f172a"
          opacity="0.18"
        />

        {/* 脚部 */}
        <path
          d={`
            M ${centerX - torsoWidth * 0.42} ${hipY}
            L ${centerX - torsoWidth * 0.46} ${groundY}
            L ${centerX - torsoWidth * 0.12} ${groundY}
            L ${centerX} ${hipY + 18 * s}
            L ${centerX + torsoWidth * 0.12} ${groundY}
            L ${centerX + torsoWidth * 0.46} ${groundY}
            L ${centerX + torsoWidth * 0.42} ${hipY}
            Z
          `}
          fill="#334155"
        />

        {/* 胴体・肩 */}
        <path
          d={`
            M ${centerX - shoulderWidth / 2} ${neckBottomY + 6 * s}
            Q ${centerX - shoulderWidth / 2} ${neckBottomY} ${centerX - shoulderWidth * 0.3} ${neckBottomY}
            L ${centerX + shoulderWidth * 0.3} ${neckBottomY}
            Q ${centerX + shoulderWidth / 2} ${neckBottomY} ${centerX + shoulderWidth / 2} ${neckBottomY + 6 * s}
            L ${centerX + torsoWidth / 2} ${hipY + 4 * s}
            L ${centerX - torsoWidth / 2} ${hipY + 4 * s}
            Z
          `}
          fill="#475569"
        />

        {/* 腕 */}
        {holdingStyle === 'high' ? (
          <g stroke="#475569" strokeWidth={8.5 * s} strokeLinecap="round" fill="none">
            <path d={`M ${centerX - shoulderWidth * 0.42} ${neckBottomY + 6 * s} L ${centerX - shoulderWidth * 0.55} ${headCenterY - 18 * s}`} />
            <path d={`M ${centerX + shoulderWidth * 0.42} ${neckBottomY + 6 * s} L ${centerX + shoulderWidth * 0.55} ${headCenterY - 18 * s}`} />
          </g>
        ) : (
          <g stroke="#475569" strokeWidth={8.5 * s} strokeLinecap="round" fill="none">
            <path d={`M ${centerX - shoulderWidth * 0.44} ${neckBottomY + 5 * s} L ${centerX - shoulderWidth * 0.52} ${hipY - 8 * s}`} />
            <path d={`M ${centerX + shoulderWidth * 0.44} ${neckBottomY + 5 * s} L ${centerX + shoulderWidth * 0.52} ${hipY - 8 * s}`} />
          </g>
        )}

        {/* 頭部 */}
        <circle cx={centerX} cy={headCenterY} r={headRadius} fill="#475569" />

        {/* 身長ラベル（先頭の人物に表示） */}
        {index === 0 && showDimensionLines && (
          <g>
            <line
              x1={centerX - shoulderWidth * 0.85}
              y1={groundY}
              x2={centerX - shoulderWidth * 0.85}
              y2={groundY - heightCm}
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
            <line
              x1={centerX - shoulderWidth * 0.85 - 5}
              y1={groundY - heightCm}
              x2={centerX - shoulderWidth * 0.85 + 5}
              y2={groundY - heightCm}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={centerX - shoulderWidth * 0.85 - 5}
              y1={groundY}
              x2={centerX - shoulderWidth * 0.85 + 5}
              y2={groundY}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <rect
              x={centerX - shoulderWidth * 0.85 - 36}
              y={groundY - heightCm / 2 - 10}
              width="72"
              height="20"
              rx="4"
              fill="#0f172a"
              opacity="0.8"
            />
            <text
              x={centerX - shoulderWidth * 0.85}
              y={groundY - heightCm / 2}
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              身長 {heightCm}cm
            </text>
          </g>
        )}
      </g>
    );
  };

  // --- 実寸サイズ比較シーン全体の描画計算 ---
  const renderScaleComparisonScene = () => {
    const personSpanWidth = personCount === 1 ? 60 : (personCount - 1) * 68 + 60;
    const contentMaxWidth = Math.max(bannerWidth, personSpanWidth, 220);
    const sceneWidth = contentMaxWidth + 140;
    const maxVerticalElement = Math.max(personHeight + 50, bannerHeight + 90, 230);
    const sceneHeight = maxVerticalElement + 70;
    const groundY = sceneHeight - 38;
    const centerX = sceneWidth / 2;

    const peopleX = [];
    if (personCount === 1) {
      if (holdStyle === 'fence') {
        peopleX.push(centerX - bannerWidth / 2 - 42);
      } else {
        peopleX.push(centerX);
      }
    } else {
      const span = Math.min(Math.max(bannerWidth * 0.82, (personCount - 1) * 58), (personCount - 1) * 85);
      for (let i = 0; i < personCount; i++) {
        peopleX.push(centerX - span / 2 + (i * span) / (personCount - 1));
      }
    }

    let bannerTopY = groundY - bannerHeight;
    if (holdStyle === 'hands') {
      const targetTop = groundY - personHeight * 0.74;
      bannerTopY = Math.min(targetTop, groundY - bannerHeight - 5);
    } else if (holdStyle === 'waist') {
      const targetTop = groundY - personHeight * 0.56;
      bannerTopY = Math.min(targetTop, groundY - bannerHeight - 2);
    } else if (holdStyle === 'high') {
      bannerTopY = groundY - personHeight - bannerHeight * 0.65;
    } else if (holdStyle === 'fence') {
      bannerTopY = groundY - Math.max(bannerHeight + 25, 115);
    }

    const bannerLeftX =
      holdStyle === 'fence' && personCount === 1
        ? centerX - bannerWidth / 2 + 25
        : centerX - bannerWidth / 2;

    return (
      <svg
        ref={svgScaleRef}
        viewBox={`0 0 ${sceneWidth} ${sceneHeight}`}
        className="w-full h-full max-h-full select-none"
      >
        <defs>
          <linearGradient id="sky-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="85%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <pattern id="fence-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 16 8 L 8 16 L 0 8 Z" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.45" />
          </pattern>
        </defs>

        <rect x="0" y="0" width={sceneWidth} height={sceneHeight} fill="url(#sky-bg)" />

        {showDimensionLines &&
          [50, 100, 150, 200, 250, 300].map((cm) => {
            const y = groundY - cm;
            if (y < 15) return null;
            return (
              <g key={cm}>
                <line
                  x1="20"
                  y1={y}
                  x2={sceneWidth - 20}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth="0.7"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />
                <text x="24" y={y - 3} fontSize="8.5" fill="#64748b" fontWeight="600">
                  {cm}cm
                </text>
              </g>
            );
          })}

        {holdStyle === 'fence' && (
          <g>
            <rect
              x={bannerLeftX - 25}
              y={groundY - Math.max(180, bannerHeight + 50)}
              width={bannerWidth + 50}
              height={Math.max(180, bannerHeight + 50)}
              fill="url(#fence-mesh)"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            <line
              x1={bannerLeftX - 25}
              y1={groundY - Math.max(180, bannerHeight + 50)}
              x2={bannerLeftX - 25}
              y2={groundY}
              stroke="#475569"
              strokeWidth="4"
            />
            <line
              x1={bannerLeftX + bannerWidth + 25}
              y1={groundY - Math.max(180, bannerHeight + 50)}
              x2={bannerLeftX + bannerWidth + 25}
              y2={groundY}
              stroke="#475569"
              strokeWidth="4"
            />
          </g>
        )}

        <rect x="0" y={groundY} width={sceneWidth} height={sceneHeight - groundY} fill="#cbd5e1" />
        <line x1="0" y1={groundY} x2={sceneWidth} y2={groundY} stroke="#64748b" strokeWidth="2" />

        {peopleX.map((px, idx) =>
          renderPersonSilhouette(px, groundY, personHeight, idx, holdStyle)
        )}

        <g transform={`translate(${bannerLeftX}, ${bannerTopY})`}>
          <rect
            x="2"
            y="4"
            width={bannerWidth}
            height={bannerHeight}
            fill="#000000"
            opacity="0.22"
            rx="1"
          />
          {renderBannerArtwork('scale', false)}
          <rect
            x="0"
            y="0"
            width={bannerWidth}
            height={bannerHeight}
            fill="none"
            stroke="#334155"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>

        {(holdStyle === 'hands' || holdStyle === 'waist') &&
          peopleX.map((px, idx) => {
            const s = personHeight / 170;
            const handY =
              holdStyle === 'waist'
                ? bannerTopY + Math.min(12, bannerHeight * 0.2)
                : Math.min(bannerTopY + bannerHeight * 0.45, bannerTopY + 35);
            return (
              <g key={`hands-${idx}`}>
                <circle
                  cx={Math.max(bannerLeftX + 3, px - 22 * s)}
                  cy={handY}
                  r={4.2 * s}
                  fill="#334155"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <circle
                  cx={Math.min(bannerLeftX + bannerWidth - 3, px + 22 * s)}
                  cy={handY}
                  r={4.2 * s}
                  fill="#334155"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>
            );
          })}

        {showDimensionLines && (
          <g>
            <line
              x1={bannerLeftX}
              y1={bannerTopY - 12}
              x2={bannerLeftX + bannerWidth}
              y2={bannerTopY - 12}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <line
              x1={bannerLeftX}
              y1={bannerTopY - 17}
              x2={bannerLeftX}
              y2={bannerTopY - 7}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <line
              x1={bannerLeftX + bannerWidth}
              y1={bannerTopY - 17}
              x2={bannerLeftX + bannerWidth}
              y2={bannerTopY - 7}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <rect
              x={bannerLeftX + bannerWidth / 2 - 42}
              y={bannerTopY - 22}
              width="84"
              height="18"
              rx="4"
              fill="#0284c7"
            />
            <text
              x={bannerLeftX + bannerWidth / 2}
              y={bannerTopY - 13}
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              横幅 {bannerWidth}cm
            </text>

            <line
              x1={bannerLeftX + bannerWidth + 12}
              y1={bannerTopY}
              x2={bannerLeftX + bannerWidth + 12}
              y2={bannerTopY + bannerHeight}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <line
              x1={bannerLeftX + bannerWidth + 7}
              y1={bannerTopY}
              x2={bannerLeftX + bannerWidth + 17}
              y2={bannerTopY}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <line
              x1={bannerLeftX + bannerWidth + 7}
              y1={bannerTopY + bannerHeight}
              x2={bannerLeftX + bannerWidth + 17}
              y2={bannerTopY + bannerHeight}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <rect
              x={bannerLeftX + bannerWidth + 18}
              y={bannerTopY + bannerHeight / 2 - 9}
              width="66"
              height="18"
              rx="4"
              fill="#0284c7"
            />
            <text
              x={bannerLeftX + bannerWidth + 51}
              y={bannerTopY + bannerHeight / 2}
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              縦 {bannerHeight}cm
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Google Fonts & 追加カスタムフォント 読み込み */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Dela+Gothic+One&family=DotGothic16&family=Hachi+Maru+Pop&family=Kaisei+Decol:wght@700&family=Kaisei+Tokumin:wght@800&family=Klee+One:wght@600&family=Kosugi+Maru&family=M+PLUS+1p:wght@900&family=M+PLUS+Rounded+1c:wght@800&family=Mochiy+Pop+One&family=New+Tegomin&family=Noto+Sans+JP:wght@700;900&family=Noto+Serif+JP:wght@900&family=Oswald:wght@700&family=Potta+One&family=Rampart+One&family=Reggae+One&family=RocknRoll+One&family=Sawarabi+Mincho&family=Shippori+Mincho:wght@800&family=Stick&family=Train+One&family=Yuji+Boku&family=Yuji+Mai&family=Yuji+Syuku&family=Yusei+Magic&family=Zen+Kaku+Gothic+New:wght@900&family=Zen+Maru+Gothic:wght@900&family=Zen+Old+Mincho:wght@900&display=swap');
        ${customFontFacesCss
          .map(
            (cf) =>
              `@font-face { font-family: '${cf.familyName}'; src: url('${cf.dataUrl}') format('${cf.format}'); }`
          )
          .join('\n')}
      `}</style>

      {/* トップヘッダー */}
      <header className="bg-slate-900 text-white px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-500 text-slate-950 p-1.5 rounded-lg font-black">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
              横断幕デザイン＆実寸サイズ感シミュレーター
              <span className="hidden md:inline-block text-xs bg-violet-600/30 text-violet-300 border border-violet-400/40 px-2 py-0.5 rounded-full font-medium">
                ✨ AIスローガン提案搭載
              </span>
            </h1>
          </div>
        </div>

        {/* 現在のサイズバッジ ＆ モード切替 */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center gap-2">
            <span className="text-slate-400">サイズ:</span>
            <span className="font-bold text-amber-400">
              横 {bannerWidth}cm × 縦 {bannerHeight}cm
            </span>
          </div>

          {/* 画面表示モード切替ボタングループ */}
          <div className="bg-slate-800 p-1 rounded-lg flex items-center text-xs font-medium border border-slate-700">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              両方表示
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                viewMode === 'edit'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              デザインのみ
            </button>
            <button
              onClick={() => setViewMode('scale')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                viewMode === 'scale'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              サイズ感のみ
            </button>
          </div>

          {/* 画像保存＆読み込み＆OCRボタン */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <input
              ref={ocrFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleOcrImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => ocrFileInputRef.current?.click()}
              disabled={isOcrLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-60 text-slate-950 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="横断幕の画像から文字・色・配置をAI(OCR)で読み取って編集可能にします"
            >
              {isOcrLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>OCR解析中...</span>
                </>
              ) : (
                <>
                  <ScanText className="w-4 h-4" />
                  <span>📷 画像OCR読取</span>
                </>
              )}
            </button>

            <input
              ref={bgImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleUploadBannerBgImage(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => {
                setActiveTab('size_bg');
                bgImageInputRef.current?.click();
              }}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="お手持ちの横断幕画像や背景画像をそのまま読み込む"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden md:inline">背景画像読込</span>
            </button>
            <button
              onClick={() =>
                downloadSvgAsPng(
                  svgEditRef.current,
                  `banner_${bannerWidth}x${bannerHeight}cm.png`,
                  1800
                )
              }
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="横断幕デザイン単体を高画質PNGで保存"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">デザイン保存</span>
            </button>
            <button
              onClick={() =>
                downloadSvgAsPng(
                  svgScaleRef.current,
                  `banner_size_compare_${bannerWidth}x${bannerHeight}cm.png`,
                  1600
                )
              }
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="人物とのサイズ比較イメージをPNGで保存"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">比較図を保存</span>
            </button>
          </div>
        </div>
      </header>

      {/* トースト通知 */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs sm:text-sm animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* メインワークスペース */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 左側：設定・編集サイドバー */}
        <aside className="w-full lg:w-[430px] xl:w-[460px] bg-white border-r border-slate-200 flex flex-col shrink-0 lg:h-[calc(100vh-56px)]">
          {/* タブナビゲーション */}
          <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-[11px] sm:text-xs font-bold">
            <button
              onClick={() => setActiveTab('text')}
              className={`py-3 px-1 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === 'text'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>文字・配置</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-3 px-1 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === 'ai'
                  ? 'border-violet-600 text-violet-700 bg-violet-50/40'
                  : 'border-transparent text-slate-500 hover:text-violet-700'
              }`}
            >
              <Wand2 className="w-4 h-4 text-violet-600" />
              <span>✨AI文言提案</span>
            </button>
            <button
              onClick={() => setActiveTab('size_bg')}
              className={`py-3 px-1 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === 'size_bg'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>サイズ・画像</span>
            </button>
            <button
              onClick={() => setActiveTab('human')}
              className={`py-3 px-1 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === 'human'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>持ったイメージ</span>
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`py-3 px-1 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === 'template'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>テンプレ</span>
            </button>
          </div>

          {/* タブの中身（スクロール領域） */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* ==================== タブ1: 文字・配置 ==================== */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {/* AI書き換えショートカットバナー */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-3 text-white shadow-sm flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      スローガンや表現に迷ったら？
                    </div>
                    <p className="text-violet-100 text-[11px] mt-0.5">
                      「こういう表現にしたい」と伝えるとAIが数案提案します
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedText?.text) {
                        setAiBaseText(selectedText.text.replace(/\n/g, ' '));
                      }
                      setActiveTab('ai');
                    }}
                    className="bg-white text-violet-900 hover:bg-amber-300 hover:text-slate-950 font-bold text-xs px-3 py-2 rounded-lg shrink-0 shadow transition flex items-center gap-1"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    AIで書き換え
                  </button>
                </div>

                {/* テキストレイヤー一覧 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        テキストレイヤー ({texts.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTextsOnBanner((prev) => !prev)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border transition ${
                          showTextsOnBanner
                            ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            : 'bg-amber-100 text-amber-900 border-amber-400'
                        }`}
                        title="文字レイヤー全体の表示・非表示を切り替え"
                      >
                        {showTextsOnBanner ? (
                          <>
                            <Eye className="w-3 h-3" />
                            文字表示中
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            文字を非表示中
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowTextsOnBanner(true);
                        setActiveLayerType('text');
                        addNewText();
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      文字を追加
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {texts.map((item) => {
                      const isSel =
                        activeLayerType === 'text' && selectedText?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTextId(item.id);
                            setActiveLayerType('text');
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
                            isSel
                              ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate">
                              {item.text.replace(/\n/g, ' ') || '(空のテキスト)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                              {item.isVertical ? '縦書' : '横書'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ロゴ・イラスト・スタンプ画像レイヤー追加セクション (Mode B) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      ロゴ・イラスト画像レイヤー ({imageLayers.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => overlayImageInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      ロゴ・画像を追加
                    </button>
                    <input
                      ref={overlayImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleUploadOverlayImage(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {imageLayers.length === 0 ? (
                    <p className="text-[11px] text-slate-500">
                      チームロゴ・校章・イラスト等の画像を追加して自由な位置に配置できます。（横断幕全体の画像読込は「サイズ・背景」タブまたは上部ボタンから行えます）
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {imageLayers.map((imgItem) => {
                        const isSel =
                          activeLayerType === 'image' && selectedImageLayer?.id === imgItem.id;
                        return (
                          <div
                            key={imgItem.id}
                            onClick={() => {
                              setSelectedImageId(imgItem.id);
                              setActiveLayerType('image');
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                              isSel
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img
                                src={imgItem.dataUrl}
                                alt={imgItem.name}
                                className="w-6 h-6 object-contain rounded bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <span className="truncate">{imgItem.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSelectedImageLayer(imgItem.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                              title="画像を削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 選択中のロゴ・イラスト画像の編集コントロール */}
                  {activeLayerType === 'image' && selectedImageLayer && (
                    <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-3 pt-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-emerald-800">
                          選択中の画像: {selectedImageLayer.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedImageLayer({
                                zOrder:
                                  selectedImageLayer.zOrder === 'behind' ? 'front' : 'behind',
                              })
                            }
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            {selectedImageLayer.zOrder === 'behind'
                              ? '文字の背面'
                              : '文字の前面'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600">大きさ</span>
                            <span className="text-emerald-700 font-bold">
                              {selectedImageLayer.widthPercent}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="100"
                            step="1"
                            value={selectedImageLayer.widthPercent}
                            onChange={(e) =>
                              updateSelectedImageLayer({
                                widthPercent: Number(e.target.value),
                              })
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600">回転</span>
                            <span className="text-emerald-700 font-bold">
                              {selectedImageLayer.rotation}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            value={selectedImageLayer.rotation}
                            onChange={(e) =>
                              updateSelectedImageLayer({
                                rotation: Number(e.target.value),
                              })
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600">不透明度</span>
                            <span className="text-emerald-700 font-bold">
                              {selectedImageLayer.opacity}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={selectedImageLayer.opacity}
                            onChange={(e) =>
                              updateSelectedImageLayer({
                                opacity: Number(e.target.value),
                              })
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ x: 15 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignLeft className="w-3 h-3" />
                          左
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ x: 50 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignCenter className="w-3 h-3" />
                          中央
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ x: 85 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignRight className="w-3 h-3" />
                          右
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ y: 20 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignStartVertical className="w-3 h-3" />
                          上
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ y: 50 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignCenterVertical className="w-3 h-3" />
                          中
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedImageLayer({ y: 80 })}
                          className="p-1 bg-white hover:bg-emerald-50 rounded text-slate-700 flex flex-col items-center text-[10px]"
                        >
                          <AlignEndVertical className="w-3 h-3" />
                          下
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 選択中テキストの詳細編集 */}
                {selectedText && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        選択中の文字を編集
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveLayerOrder('up')}
                          title="前面へ移動"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveLayerOrder('down')}
                          title="背面へ移動"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={duplicateSelectedText}
                          title="複製する"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={deleteSelectedText}
                          title="削除する"
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 文言入力 */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          文言（改行で複数行に対応）
                        </label>
                        <button
                          onClick={() => {
                            setAiBaseText(selectedText.text.replace(/\n/g, ' '));
                            setActiveTab('ai');
                          }}
                          className="text-[11px] text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1"
                        >
                          <Wand2 className="w-3 h-3" />
                          この文言をAIで言い換え
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={selectedText.text}
                        onChange={(e) => updateSelectedText({ text: e.target.value })}
                        placeholder="例：必勝 / 全力疾走"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>

                    {/* 文字の向き ＆ 現在のフォント表示 */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="text-xs">
                        <span className="text-slate-500 font-medium">適用中フォント: </span>
                        <span className="font-bold text-sky-800">
                          {fontCatalog.find((f) => f.id === selectedText.fontId)?.name || '標準ゴシック'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 bg-slate-200 p-0.5 rounded-lg text-xs font-bold shrink-0 w-32">
                        <button
                          onClick={() => updateSelectedText({ isVertical: false })}
                          className={`py-1 rounded-md transition ${
                            !selectedText.isVertical
                              ? 'bg-white text-sky-700 shadow-sm'
                              : 'text-slate-600'
                          }`}
                        >
                          横書き
                        </button>
                        <button
                          onClick={() => updateSelectedText({ isVertical: true })}
                          className={`py-1 rounded-md transition ${
                            selectedText.isVertical
                              ? 'bg-white text-sky-700 shadow-sm'
                              : 'text-slate-600'
                          }`}
                        >
                          縦書き
                        </button>
                      </div>
                    </div>

                    {/* フォント検索・選択＆カスタムフォント追加セクション */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-sky-600" />
                          フォントを検索・変更 ({filteredFonts.length}種)
                        </label>
                        <button
                          type="button"
                          onClick={() => fontFileInputRef.current?.click()}
                          className="text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 transition"
                        >
                          <Upload className="w-3 h-3" />
                          フォントファイルを追加
                        </button>
                        <input
                          ref={fontFileInputRef}
                          type="file"
                          accept=".ttf,.otf,.woff,.woff2"
                          multiple
                          onChange={(e) => handleUploadFontFiles(e.target.files)}
                          className="hidden"
                        />
                      </div>

                      {/* 検索入力ボックス */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fontSearchQuery}
                          onChange={(e) => setFontSearchQuery(e.target.value)}
                          placeholder="フォント名や特徴で検索（例: 筆, 明朝, 極太, 丸, Yuji, Bebas...）"
                          className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                        />
                        {fontSearchQuery && (
                          <button
                            onClick={() => setFontSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* カテゴリ絞り込みタブ */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {FONT_CATEGORIES.map((cat) => {
                          const active = selectedFontCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedFontCategory(cat.id)}
                              className={`px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
                                active
                                  ? 'bg-sky-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* フォントプレビュー付きリスト */}
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border-t border-b border-slate-100 py-1.5">
                        {filteredFonts.length > 0 ? (
                          filteredFonts.map((f) => {
                            const isCurrent = selectedText.fontId === f.id;
                            const previewSample =
                              selectedText.text.replace(/\n/g, ' ').slice(0, 14) ||
                              '必勝・心を一つに！';
                            return (
                              <div
                                key={f.id}
                                onClick={() => updateSelectedText({ fontId: f.id })}
                                className={`group flex items-center justify-between px-2.5 py-2 rounded-lg border cursor-pointer transition ${
                                  isCurrent
                                    ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500'
                                    : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className="min-w-0 flex-1 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-slate-700 truncate">
                                      {f.name}
                                    </span>
                                    {f.isCustom && (
                                      <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold shrink-0">
                                        追加ファイル
                                      </span>
                                    )}
                                    {f.isDynamicGoogle && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold shrink-0">
                                        Google追加
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className="text-base text-slate-900 truncate mt-0.5"
                                    style={{
                                      fontFamily: f.family,
                                      fontWeight: f.weight,
                                    }}
                                  >
                                    {previewSample}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {isCurrent && (
                                    <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">
                                      適用中
                                    </span>
                                  )}
                                  {f.isCustom && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeCustomFont(f.id);
                                      }}
                                      title="この追加フォントを削除"
                                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 px-2 space-y-2">
                            <p className="text-xs text-slate-500">
                              「{fontSearchQuery}」に一致するプリセットが見つかりません
                            </p>
                            {fontSearchQuery.trim() && (
                              <button
                                type="button"
                                onClick={() => handleLoadGoogleFontByName(fontSearchQuery)}
                                disabled={isLoadingFont}
                                className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                Google Fontsから「{fontSearchQuery.trim()}」を読み込む
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ダウンロードしたフォントのドラッグ＆ドロップ追加ゾーン ＆ Google Fonts直接入力 */}
                      <div className="space-y-2 pt-1">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsFontDragging(true);
                          }}
                          onDragLeave={() => setIsFontDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsFontDragging(false);
                            handleUploadFontFiles(e.dataTransfer.files);
                          }}
                          onClick={() => fontFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-2.5 text-center cursor-pointer transition ${
                            isFontDragging
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-slate-300 hover:border-sky-400 bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                            <FolderPlus className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              ダウンロードしたフォント (.ttf / .otf / .woff / .woff2) を追加
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            クリックしてファイルを選択、またはここにドラッグ＆ドロップ
                          </p>
                        </div>

                        {/* Google Fonts 名を指定して追加 */}
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={customGoogleFontInput}
                              onChange={(e) => setCustomGoogleFontInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleLoadGoogleFontByName(customGoogleFontInput);
                                }
                              }}
                              placeholder="Google Fonts名を直接入力して追加 (例: Kaisei HarunoUmi)"
                              className="w-full pl-8 pr-2 py-1 text-[11px] rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleLoadGoogleFontByName(customGoogleFontInput)}
                            disabled={isLoadingFont || !customGoogleFontInput.trim()}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 transition"
                          >
                            読込
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 文字サイズと字間 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">文字サイズ</span>
                          <span className="text-sky-700 font-bold">{selectedText.fontSize}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="1"
                          value={selectedText.fontSize}
                          onChange={(e) =>
                            updateSelectedText({ fontSize: Number(e.target.value) })
                          }
                          className="w-full accent-sky-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">文字間隔</span>
                          <span className="text-sky-700 font-bold">
                            {selectedText.letterSpacing}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="30"
                          step="1"
                          value={selectedText.letterSpacing}
                          onChange={(e) =>
                            updateSelectedText({ letterSpacing: Number(e.target.value) })
                          }
                          className="w-full accent-sky-600"
                        />
                      </div>
                    </div>

                    {/* 文字色 ＆ フチ取り設定 */}
                    <div className="space-y-3 pt-1 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          文字の色
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="color"
                            value={selectedText.color}
                            onChange={(e) => updateSelectedText({ color: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                          />
                          {COLOR_SWATCHES.slice(0, 10).map((c) => (
                            <button
                              key={c}
                              onClick={() => updateSelectedText({ color: c })}
                              className={`w-6 h-6 rounded-full border transition ${
                                selectedText.color.toLowerCase() === c
                                  ? 'ring-2 ring-sky-500 scale-110 border-white'
                                  : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            フチ取りの色
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={selectedText.strokeColor}
                              onChange={(e) =>
                                updateSelectedText({ strokeColor: e.target.value })
                              }
                              className="w-7 h-7 rounded cursor-pointer border border-slate-300"
                            />
                            {['#000000', '#ffffff', '#b91c1c', '#1e3a8a', '#facc15'].map((c) => (
                              <button
                                key={c}
                                onClick={() => updateSelectedText({ strokeColor: c })}
                                className="w-5 h-5 rounded-full border border-slate-300"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700">フチの太さ</span>
                            <span className="text-sky-700 font-bold">
                              {selectedText.strokeWidth}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="8"
                            step="0.5"
                            value={selectedText.strokeWidth}
                            onChange={(e) =>
                              updateSelectedText({ strokeWidth: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedText.shadow}
                            onChange={(e) => updateSelectedText({ shadow: e.target.checked })}
                            className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                          />
                          立体的な影（ドロップシャドウ）をつける
                        </label>
                      </div>
                    </div>

                    {/* 文字の位置指定 */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Move className="w-3.5 h-3.5 text-sky-600" />
                          位置の整列・微調整
                        </label>
                        <span className="text-[11px] text-slate-500">
                          ※キャンバス上でドラッグ移動も可能
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-1 bg-slate-200/70 p-1 rounded-lg">
                        <button
                          onClick={() => updateSelectedText({ x: 20 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          左寄
                        </button>
                        <button
                          onClick={() => updateSelectedText({ x: 50 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          中央
                        </button>
                        <button
                          onClick={() => updateSelectedText({ x: 80 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          右寄
                        </button>
                        <button
                          onClick={() => updateSelectedText({ y: 24 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignStartVertical className="w-3.5 h-3.5" />
                          上寄
                        </button>
                        <button
                          onClick={() => updateSelectedText({ y: 50 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignCenterVertical className="w-3.5 h-3.5" />
                          中段
                        </button>
                        <button
                          onClick={() => updateSelectedText({ y: 78 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignEndVertical className="w-3.5 h-3.5" />
                          下寄
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">横位置 (X)</span>
                            <span className="font-bold text-slate-800">{selectedText.x}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedText.x}
                            onChange={(e) =>
                              updateSelectedText({ x: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">縦位置 (Y)</span>
                            <span className="font-bold text-slate-800">{selectedText.y}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedText.y}
                            onChange={(e) =>
                              updateSelectedText({ y: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== タブ2: ✨AI文言提案・書き換え ==================== */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="bg-violet-50/80 border border-violet-200 rounded-xl p-3.5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-violet-600" />
                      AIで文言を考える・書き換える
                    </h3>
                    <span className="text-[10px] bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full font-bold">
                      Gemini AI
                    </span>
                  </div>

                  {/* 1. 元の言葉・伝えたい意味 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        1. 伝えたい元の言葉・思い
                      </label>
                      {selectedText && (
                        <button
                          onClick={() => setAiBaseText(selectedText.text.replace(/\n/g, ' '))}
                          className="text-[11px] text-violet-700 hover:underline font-semibold"
                        >
                          選択中の文字をセット
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={aiBaseText}
                      onChange={(e) => setAiBaseText(e.target.value)}
                      placeholder="例：絶対勝つ、最後まであきらめないで走れ、仲間を信じる"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  {/* 2. どういう表現にしたいか（チップ選択＋自由入力） */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      2. どんな表現・テイストにしたいですか？
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {AI_STYLE_CHIPS.map((chip) => {
                        const isSelected = aiStyleRequest.includes(chip);
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setAiStyleRequest(chip)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                              isSelected
                                ? 'bg-violet-600 border-violet-600 text-white shadow-sm font-bold'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-violet-100/60'
                            }`}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={aiStyleRequest}
                      onChange={(e) => setAiStyleRequest(e.target.value)}
                      placeholder="自由入力：例「相手が圧倒されるような四字熟語」「小学生にもわかりやすい熱い言葉」"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  {/* 3. 競技・用途 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      3. 競技・用途（任意）
                    </label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {AI_SPORT_CHIPS.map((sport) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => setAiSport(sport)}
                          className={`text-[11px] px-2 py-0.5 rounded border transition ${
                            aiSport === sport
                              ? 'bg-slate-800 border-slate-800 text-white font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 生成実行ボタン */}
                  <button
                    onClick={generateAiSlogans}
                    disabled={isAiLoading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AIがスローガン案を考案中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        AIに書き換え案を提案してもらう（5案）
                      </>
                    )}
                  </button>

                  {aiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{aiError}</span>
                    </div>
                  )}
                </div>

                {/* AI提案結果リスト */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        AIからの提案（クリックで横断幕に反映）
                      </span>
                      <span className="text-[11px] text-slate-500">
                        全 {aiSuggestions.length} 案
                      </span>
                    </div>

                    {aiSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-violet-200 hover:border-violet-400 rounded-xl p-3 shadow-sm space-y-2 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-base font-black text-slate-900">
                              {item.mainText}
                            </div>
                            {item.subText && (
                              <div className="text-xs font-bold text-violet-700 mt-0.5">
                                サブ案: {item.subText}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold shrink-0">
                            案 {idx + 1}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              applySuggestionToSelected(item.mainText, item.recommendedFont)
                            }
                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            選択中の文字に反映
                          </button>
                          <button
                            type="button"
                            onClick={() => applyBothMainAndSub(item)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            メイン＋サブを反映
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== タブ3: サイズ・背景・OCR ==================== */}
            {activeTab === 'size_bg' && (
              <div className="space-y-5">
                {/* ★新規追加：AI画像OCR文字読み取り＆デザイン復元セクション */}
                <div className="bg-gradient-to-br from-orange-50 via-amber-50/80 to-yellow-50/60 p-3.5 rounded-xl border-2 border-orange-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                      <ScanText className="w-4 h-4 text-orange-600" />
                      📷 画像からOCR文字読み取り＆デザイン自動復元
                    </h3>
                    <span className="text-[10px] bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full font-bold">
                      AI OCR搭載
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    横断幕の写真やスクリーンショットをアップロードすると、AIが<strong>「書かれている文言・位置・文字色・背景色・縦書き/横書き」を自動で読み取り、後から文字を自由に書き換えられる状態</strong>に復元します。
                  </p>

                  <button
                    type="button"
                    onClick={() => ocrFileInputRef.current?.click()}
                    disabled={isOcrLoading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    {isOcrLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        画像内の文字・配色・レイアウトをOCR解析中...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        横断幕の画像を選択してOCRで文字を読み取る
                      </>
                    )}
                  </button>

                  {ocrError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{ocrError}</span>
                    </div>
                  )}

                  {/* OCR解析結果プレビュー＆反映モード切替 */}
                  {ocrResult && (
                    <div className="bg-white p-3 rounded-xl border border-orange-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          ✅ 読み取った文字レイヤー ({ocrResult.texts?.length || 0}件)
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-slate-500">検出背景色:</span>
                          <span
                            className="w-4 h-4 rounded border border-slate-300 inline-block"
                            style={{ backgroundColor: ocrResult.bgColor1 }}
                            title={ocrResult.bgColor1}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {ocrResult.texts?.map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-orange-50 border border-orange-200 text-orange-950 px-2 py-0.5 rounded font-bold"
                          >
                            {t.text.replace(/\n/g, ' ')}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => applyOcrResultToCanvas(ocrResult, 'reconstruct')}
                          className="w-full py-1.5 px-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          テキスト＋背景色として完全復元（文字を自由に編集する）
                        </button>
                        <button
                          type="button"
                          onClick={() => applyOcrResultToCanvas(ocrResult, 'overlay')}
                          className="w-full py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          元画像を半透明で下に敷いて文字を重ねる（位置合わせ用）
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 横断幕画像（完成データ・背景写真）のそのまま読み込みセクション (Mode A) */}
                <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      横断幕画像の読み込み（完成画像・背景写真）
                    </h3>
                    {bgImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgImage(null);
                          setShowTextsOnBanner(true);
                          showToast('読み込んだ横断幕画像を解除しました');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        画像を削除
                      </button>
                    )}
                  </div>

                  {!bgImage ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsBgImageDragging(true);
                      }}
                      onDragLeave={() => setIsBgImageDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsBgImageDragging(false);
                        handleUploadBannerBgImage(e.dataTransfer.files);
                      }}
                      onClick={() => bgImageInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                        isBgImageDragging
                          ? 'border-sky-500 bg-sky-100/70'
                          : 'border-sky-300 bg-white hover:border-sky-500'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-sky-600 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-slate-800">
                        クリックまたはドラッグ＆ドロップで横断幕画像を読み込む
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        作成済みの横断幕デザイン画像を入れてサイズ感を確認したり、背景写真の上に文字を乗せることができます（PNG / JPG / WebP / SVG）
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded-xl border border-sky-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={bgImage.dataUrl}
                          alt={bgImage.name}
                          className="w-16 h-10 object-cover rounded border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="font-bold text-slate-800 truncate">{bgImage.name}</div>
                          <div className="text-[11px] text-slate-500">
                            元サイズ: {bgImage.naturalWidth} × {bgImage.naturalHeight} px
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => bgImageInputRef.current?.click()}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg shrink-0"
                        >
                          変更
                        </button>
                      </div>

                      {/* 画像比率へのサイズ自動調整ボタン */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <label className="block text-[11px] font-bold text-slate-600">
                          画像の縦横比に横断幕サイズ(cm)を合わせる：
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => fitBannerSizeToImageRatio('width')}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg py-1.5 px-2 text-[11px] font-bold transition"
                          >
                            横幅({bannerWidth}cm)基準で縦を自動調整
                          </button>
                          <button
                            type="button"
                            onClick={() => fitBannerSizeToImageRatio('height')}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg py-1.5 px-2 text-[11px] font-bold transition"
                          >
                            縦幅({bannerHeight}cm)基準で横を自動調整
                          </button>
                        </div>
                      </div>

                      {/* 既存の文字の表示/非表示切り替え（完成済み横断幕画像チェック用） */}
                      <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 rounded-lg px-3 py-2">
                        <span className="text-xs font-bold text-amber-950">
                          画像の上にテキストを重ねて表示する
                        </span>
                        <input
                          type="checkbox"
                          checked={showTextsOnBanner}
                          onChange={(e) => setShowTextsOnBanner(e.target.checked)}
                          className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {/* フィッティングモード */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          画像のフィット方法：
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                          {[
                            { id: 'stretch', label: '枠いっぱいに伸縮' },
                            { id: 'cover', label: '比率維持(切り抜き)' },
                            { id: 'contain', label: '比率維持(全体表示)' },
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setBgImage({ ...bgImage, fitMode: m.id })}
                              className={`py-1.5 px-1 rounded border font-bold transition ${
                                bgImage.fitMode === m.id
                                  ? 'bg-sky-600 text-white border-sky-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 画像の不透明度＆明暗オーバーレイ調整 */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600">画像の濃さ</span>
                            <span className="font-bold text-sky-700">{bgImage.opacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={bgImage.opacity}
                            onChange={(e) =>
                              setBgImage({ ...bgImage, opacity: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-600">背景の明暗補正</span>
                            <span className="font-bold text-sky-700">
                              {bgImage.darkOverlay > 0
                                ? `暗く ${bgImage.darkOverlay}%`
                                : bgImage.darkOverlay < 0
                                ? `明るく ${Math.abs(bgImage.darkOverlay)}%`
                                : '0%'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-70"
                            max="70"
                            step="5"
                            value={bgImage.darkOverlay}
                            onChange={(e) =>
                              setBgImage({ ...bgImage, darkOverlay: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                      横断幕のサイズ指定 (cm)
                    </h3>
                    <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      比率 {(bannerWidth / bannerHeight).toFixed(2)} : 1
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-700">横幅 (W): 60〜600cm</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="60"
                          max="600"
                          value={bannerWidth}
                          onChange={(e) =>
                            setBannerWidth(Math.max(60, Math.min(600, Number(e.target.value) || 60)))
                          }
                          className="w-16 text-right font-bold border border-slate-300 rounded px-1.5 py-0.5 bg-white"
                        />
                        <span className="text-slate-600">cm</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="600"
                      step="10"
                      value={bannerWidth}
                      onChange={(e) => setBannerWidth(Number(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-700">縦幅 (H): 30〜300cm</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="30"
                          max="300"
                          value={bannerHeight}
                          onChange={(e) =>
                            setBannerHeight(Math.max(30, Math.min(300, Number(e.target.value) || 30)))
                          }
                          className="w-16 text-right font-bold border border-slate-300 rounded px-1.5 py-0.5 bg-white"
                        />
                        <span className="text-slate-600">cm</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="300"
                      step="5"
                      value={bannerHeight}
                      onChange={(e) => setBannerHeight(Number(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-600 mb-2">
                      よく使われる定番サイズから選ぶ：
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SIZE_PRESETS.map((preset) => {
                        const isCurrent =
                          bannerWidth === preset.width && bannerHeight === preset.height;
                        return (
                          <button
                            key={preset.label}
                            onClick={() => {
                              setBannerWidth(preset.width);
                              setBannerHeight(preset.height);
                            }}
                            className={`text-left px-3 py-2 rounded-lg border text-xs transition flex items-center justify-between ${
                              isCurrent
                                ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{preset.label}</span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              {preset.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 背景・枠デザイン設定 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-sky-600" />
                    背景カラー・枠デザイン設定
                  </h3>

                  <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-lg text-xs font-bold">
                    <button
                      onClick={() => setBgConfig({ ...bgConfig, type: 'solid' })}
                      className={`py-1.5 rounded-md transition ${
                        bgConfig.type === 'solid'
                          ? 'bg-white text-sky-700 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      単色塗りつぶし
                    </button>
                    <button
                      onClick={() => setBgConfig({ ...bgConfig, type: 'gradient' })}
                      className={`py-1.5 rounded-md transition ${
                        bgConfig.type === 'gradient'
                          ? 'bg-white text-sky-700 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      グラデーション
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {bgConfig.type === 'gradient' ? 'グラデーション開始色' : '背景カラー'}
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="color"
                        value={bgConfig.color1}
                        onChange={(e) => setBgConfig({ ...bgConfig, color1: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                      />
                      {COLOR_SWATCHES.map((c) => (
                        <button
                          key={c}
                          onClick={() => setBgConfig({ ...bgConfig, color1: c })}
                          className={`w-6 h-6 rounded-full border transition ${
                            bgConfig.color1.toLowerCase() === c
                              ? 'ring-2 ring-sky-500 scale-110'
                              : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {bgConfig.type === 'gradient' && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          グラデーション終了色
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="color"
                            value={bgConfig.color2}
                            onChange={(e) => setBgConfig({ ...bgConfig, color2: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                          />
                          {COLOR_SWATCHES.slice(0, 10).map((c) => (
                            <button
                              key={c}
                              onClick={() => setBgConfig({ ...bgConfig, color2: c })}
                              className="w-6 h-6 rounded-full border border-slate-300"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          グラデーション方向
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          {[
                            { id: 'horizontal', label: '左右 (横)' },
                            { id: 'vertical', label: '上下 (縦)' },
                            { id: 'diagonal', label: '斜め' },
                          ].map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setBgConfig({ ...bgConfig, gradientDir: d.id })}
                              className={`py-1.5 rounded border font-medium ${
                                bgConfig.gradientDir === d.id
                                  ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      背景パターン模様
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { id: 'none', label: '模様なし (シンプル)' },
                        { id: 'slashes', label: 'スピード斜線' },
                        { id: 'checkered', label: '市松模様 (チェッカー)' },
                        { id: 'spotlight', label: '中央ハイライト' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setBgConfig({ ...bgConfig, pattern: p.id })}
                          className={`py-1.5 px-2 rounded border text-left font-medium ${
                            bgConfig.pattern === p.id
                              ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        周囲の枠線（ボーダー）
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 text-xs">
                        {[
                          { id: 'none', label: 'なし' },
                          { id: 'single', label: '一本線' },
                          { id: 'double', label: '二重枠' },
                          { id: 'inner_frame', label: '外周太枠' },
                        ].map((b) => (
                          <button
                            key={b.id}
                            onClick={() => setBgConfig({ ...bgConfig, borderStyle: b.id })}
                            className={`py-1.5 rounded border font-medium ${
                              bgConfig.borderStyle === b.id
                                ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {bgConfig.borderStyle !== 'none' && (
                      <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            枠線の色
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={bgConfig.borderColor}
                              onChange={(e) =>
                                setBgConfig({ ...bgConfig, borderColor: e.target.value })
                              }
                              className="w-7 h-7 rounded cursor-pointer border border-slate-300"
                            />
                            {['#ffffff', '#facc15', '#000000', '#dc2626', '#1e3a8a'].map((c) => (
                              <button
                                key={c}
                                onClick={() => setBgConfig({ ...bgConfig, borderColor: c })}
                                className="w-5 h-5 rounded-full border border-slate-300"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700">枠の太さ</span>
                            <span className="text-sky-700 font-bold">{bgConfig.borderWidth}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={bgConfig.borderWidth}
                            onChange={(e) =>
                              setBgConfig({ ...bgConfig, borderWidth: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bgConfig.grommets}
                        onChange={(e) =>
                          setBgConfig({ ...bgConfig, grommets: e.target.checked })
                        }
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      ハトメ（紐を通す四隅・周囲の金具穴）を表示する
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== タブ4: 人が持ったイメージ設定 ==================== */}
            {activeTab === 'human' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    サイズ感プレビュー（人物比較）設定
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    指定した横断幕サイズ（現在: <strong>{bannerWidth}×{bannerHeight}cm</strong>）と、人物の身長を1cm単位の正確な比率で並べて表示します。
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      比較する人物の身長: <span className="text-sky-700">{personHeight} cm</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-xs mb-2">
                      {[150, 160, 170, 180].map((h) => (
                        <button
                          key={h}
                          onClick={() => setPersonHeight(h)}
                          className={`py-2 px-1 rounded-lg border text-center font-bold transition ${
                            personHeight === h
                              ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {h}cm
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="130"
                      max="195"
                      step="1"
                      value={personHeight}
                      onChange={(e) => setPersonHeight(Number(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      並ぶ人数: <span className="text-sky-700">{personCount} 人</span>
                    </label>
                    <div className="grid grid-cols-6 gap-1.5 text-xs">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setPersonCount(num)}
                          className={`py-2 rounded-lg border font-bold transition ${
                            personCount === num
                              ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {num}人
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      持ち方・シチュエーション
                    </label>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      {[
                        {
                          id: 'hands',
                          title: '胸の前で持つ（定番・記念撮影）',
                          desc: '試合後の集合写真や応援席で胸の高さに持つイメージ',
                        },
                        {
                          id: 'waist',
                          title: '腰の位置で持つ（顔・ユニフォームが見える）',
                          desc: '胸元のチーム名や顔をしっかり見せたい時のイメージ',
                        },
                        {
                          id: 'high',
                          title: '頭上に高く掲げる（スタンド応援）',
                          desc: '観客席などで両手を上げてアピールする際のイメージ',
                        },
                        {
                          id: 'fence',
                          title: '屋外フェンス・手すりに掲示する',
                          desc: 'グラウンドや体育館のフェンスに括り付けた際のイメージ',
                        },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setHoldStyle(mode.id)}
                          className={`p-2.5 rounded-lg border text-left transition ${
                            holdStyle === mode.id
                              ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xs font-bold">{mode.title}</div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                            {mode.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDimensionLines}
                        onChange={(e) => setShowDimensionLines(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      寸法ライン・身長目盛りガイドを表示する
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== タブ5: サンプルテンプレート ==================== */}
            {activeTab === 'template' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  用途に合わせたデザインテンプレートをワンクリックで呼び出せます。呼び出した後に文言やサイズを自由に変更できます。
                </p>
                {TEMPLATES.map((tpl, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 transition flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">{tpl.name}</h4>
                        <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {tpl.width} × {tpl.height} cm
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        収録テキスト: 「{tpl.texts.map((t) => t.text).join(' / ')}」
                      </p>
                    </div>
                    <button
                      onClick={() => applyTemplate(tpl)}
                      className="w-full py-2 bg-white hover:bg-sky-600 hover:text-white text-sky-700 border border-sky-500 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      このデザインを読み込む
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* 右側：メインプレビューキャンバス領域 */}
        <main className="flex-1 bg-slate-200/70 p-3 sm:p-5 overflow-y-auto flex flex-col gap-4 lg:h-[calc(100vh-56px)]">
          {/* 1. デザイン編集キャンバス */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <section
              className={`bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden ${
                viewMode === 'edit' ? 'flex-1 min-h-[420px]' : 'flex-1 min-h-[260px]'
              }`}
            >
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                    デザイン編集キャンバス（文字をドラッグして位置移動できます）
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <Grid className="w-3.5 h-3.5 text-slate-500" />
                    中心ガイド線を表示
                  </label>
                  {viewMode === 'split' && (
                    <button
                      onClick={() => setViewMode('edit')}
                      className="text-xs text-sky-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      拡大表示
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-6 bg-slate-800/95 flex items-center justify-center relative overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ maxHeight: viewMode === 'edit' ? '68vh' : '32vh' }}
                >
                  <svg
                    ref={svgEditRef}
                    viewBox={`0 0 ${bannerWidth} ${bannerHeight}`}
                    className="max-w-full max-h-full shadow-2xl border border-slate-600"
                    style={{
                      aspectRatio: `${bannerWidth} / ${bannerHeight}`,
                    }}
                  >
                    {renderBannerArtwork('edit', true)}
                  </svg>
                </div>
              </div>
            </section>
          )}

          {/* 2. 実寸サイズ感プレビュー（人が持った時のイメージ） */}
          {(viewMode === 'split' || viewMode === 'scale') && (
            <section
              className={`bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden ${
                viewMode === 'scale' ? 'flex-1 min-h-[460px]' : 'flex-1 min-h-[300px]'
              }`}
            >
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                    実際に人が持った時のサイズ感シミュレーション
                  </h2>
                  <span className="text-xs text-slate-500 hidden xl:inline">
                    （身長 {personHeight}cm × {personCount}人 と 横{bannerWidth}×縦{bannerHeight}cm を同スケール比較）
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-slate-500 font-medium">身長:</span>
                    {[150, 160, 170, 180].map((h) => (
                      <button
                        key={h}
                        onClick={() => setPersonHeight(h)}
                        className={`px-1.5 py-0.5 rounded font-bold transition ${
                          personHeight === h
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                    <span className="text-slate-500 font-medium">人数:</span>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPersonCount(n)}
                        className={`px-1.5 py-0.5 rounded font-bold transition ${
                          personCount === n
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {n}人
                      </button>
                    ))}
                  </div>

                  <select
                    value={holdStyle}
                    onChange={(e) => setHoldStyle(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="hands">胸の前で持つ</option>
                    <option value="waist">腰の位置で持つ</option>
                    <option value="high">頭上に掲げる</option>
                    <option value="fence">フェンス掲示</option>
                  </select>

                  {viewMode === 'split' && (
                    <button
                      onClick={() => setViewMode('scale')}
                      className="text-xs text-sky-600 hover:underline font-bold flex items-center gap-1 ml-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      拡大表示
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-slate-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ maxHeight: viewMode === 'scale' ? '72vh' : '38vh' }}
                >
                  {renderScaleComparisonScene()}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
