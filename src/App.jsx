import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type,
  Palette,
  Maximize2,
  Minimize2,
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
  Camera,
  Star,
  Heart,
  Undo2,
  Redo2,
  Share2,
  Link2,
  PlayCircle,
  ClipboardList
} from 'lucide-react';

// --- 定数・プリセット定義 ---

const FAVORITES_STORAGE_KEY = 'banner_sim_favorites_v1';
const AI_USAGE_STORAGE_KEY = 'banner_sim_ai_usage_v1';
const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-2.5-flash'];

const FONT_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'custom', label: '追加済み' },
  { id: 'brush', label: '筆文字・和風' },
  { id: 'gothic', label: 'ゴシック・太字' },
  { id: 'mincho', label: '明朝・伝統' },
  { id: 'pop', label: '丸文字・ポップ' },
  { id: 'design', label: 'デザイン・特殊' },
  { id: 'transit', label: '鉄道・標識・LED' },
  { id: 'english', label: '欧文・スポーツ' },
];

const INITIAL_FONT_CATALOG = [
  // 筆文字・毛筆・和風系
  { id: 'brush', name: '佑字 粛 (毛筆・筆文字風)', googleFamily: 'Yuji+Syuku', family: "'Yuji Syuku', serif", weight: '400', category: 'brush', tags: '筆 毛筆 必勝 和風 習字 yuji syuku' },
  { id: 'yuji-mai', name: '佑字 舞 (伸びやかな筆文字)', googleFamily: 'Yuji+Mai', family: "'Yuji Mai', serif", weight: '400', category: 'brush', tags: '筆 毛筆 和風 舞 yuji mai' },
  { id: 'yuji-boku', name: '佑字 朴 (味わい深い筆文字)', googleFamily: 'Yuji+Boku', family: "'Yuji Boku', serif", weight: '400', category: 'brush', tags: '筆 毛筆 渋い 和風 yuji boku' },
  { id: 'reggae', name: 'レゲエ One (鋭い和風・闘魂)', googleFamily: 'Reggae+One', family: "'Reggae One', cursive", weight: '400', category: 'brush', tags: '闘魂 鋭い 和風 かっこいい reggae' },
  { id: 'new-tegomin', name: 'ニューテゴミン (手書き風明朝)', googleFamily: 'New+Tegomin', family: "'New Tegomin', serif", weight: '400', category: 'brush', tags: '筆 手書き 明朝 和風 tegomin' },
  { id: 'zen-antique', name: 'Zen アンティーク (味わい和風・レトロ)', googleFamily: 'Zen+Antique', family: "'Zen Antique', serif", weight: '400', category: 'brush', tags: '和風 アンティーク レトロ 味のある zen' },
  { id: 'zen-antique-soft', name: 'Zen アンティーク Soft (やわらか和風)', googleFamily: 'Zen+Antique+Soft', family: "'Zen Antique Soft', serif", weight: '400', category: 'brush', tags: '和風 アンティーク やわらか zen soft' },
  { id: 'chokokutai', name: '彫刻体 (版画・彫り文字風)', googleFamily: 'Chokokutai', family: "'Chokokutai', system-ui", weight: '400', category: 'brush', tags: '和風 彫刻 版画 力強い 個性的 chokokutai' },
  { id: 'yomogi', name: 'よもぎ (味のある手書き筆風)', googleFamily: 'Yomogi', family: "'Yomogi', cursive", weight: '400', category: 'brush', tags: '和風 手書き 筆風 やさしい yomogi' },
  { id: 'zen-kurenaido', name: 'Zen 紅道 (ペン字・エモーショナル)', googleFamily: 'Zen+Kurenaido', family: "'Zen Kurenaido', sans-serif", weight: '400', category: 'brush', tags: '手書き ペン字 和風 青春 kurenaido' },
  { id: 'slackside-one', name: 'スラックサイド One (ゆる筆文字)', googleFamily: 'Slackside+One', family: "'Slackside One', cursive", weight: '400', category: 'brush', tags: '筆 手書き ゆるい 和風 slackside' },
  { id: 'shizuru', name: 'しずる (個性派和風手書き)', googleFamily: 'Shizuru', family: "'Shizuru', cursive", weight: '400', category: 'brush', tags: '手書き 和風 ユニーク shizuru' },

  // ゴシック・極太系
  { id: 'sans', name: 'Noto 角ゴシック Black (王道・力強い)', googleFamily: 'Noto+Sans+JP:wght@900', family: "'Noto Sans JP', sans-serif", weight: '900', category: 'gothic', tags: '角ゴシック 太字 定番 王道 noto sans' },
  { id: 'pop', name: 'デラゴシック One (超極太・大迫力)', googleFamily: 'Dela+Gothic+One', family: "'Dela Gothic One', cursive", weight: '400', category: 'gothic', tags: '極太 ゴシック インパクト 目立つ dela gothic' },
  { id: 'zen-kaku', name: 'Zen 角ゴシック Black (モダン・端正)', googleFamily: 'Zen+Kaku+Gothic+New:wght@900', family: "'Zen Kaku Gothic New', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 太字 クール zen kaku' },
  { id: 'm-plus-1p', name: 'M PLUS 1p Black (重厚ゴシック)', googleFamily: 'M+PLUS+1p:wght@900', family: "'M PLUS 1p', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 極太 力強い m plus' },
  { id: 'm-plus-1', name: 'M PLUS 1 Black (端正モダン極太)', googleFamily: 'M+PLUS+1:wght@900', family: "'M PLUS 1', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 極太 クール m plus 1' },
  { id: 'm-plus-2', name: 'M PLUS 2 Black (最新モダン極太)', googleFamily: 'M+PLUS+2:wght@900', family: "'M PLUS 2', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 極太 モダン m plus 2' },
  { id: 'murecho', name: 'むれちょ Black (王道太ゴシック)', googleFamily: 'Murecho:wght@900', family: "'Murecho', sans-serif", weight: '900', category: 'gothic', tags: 'ゴシック 極太 読みやすい murecho' },
  { id: 'rocknroll', name: 'ロックンロール One (躍動・元気)', googleFamily: 'RocknRoll+One', family: "'RocknRoll One', sans-serif", weight: '400', category: 'gothic', tags: 'ロック 動き ポップ 太字 rocknroll' },
  { id: 'shippori-antique', name: 'しっぽりアンチック (漫画・見出しゴシック)', googleFamily: 'Shippori+Antique', family: "'Shippori Antique', sans-serif", weight: '400', category: 'gothic', tags: 'ゴシック 力強い 見出し 漫画 shippori' },
  { id: 'shippori-antique-b1', name: 'しっぽりアンチック B1 (看板見出し)', googleFamily: 'Shippori+Antique+B1', family: "'Shippori Antique B1', sans-serif", weight: '400', category: 'gothic', tags: 'ゴシック 看板 見出し 太い shippori b1' },
  { id: 'wdxl-lubrifont', name: 'WDXL Lubrifont JP (看板極太インパクト)', googleFamily: 'WDXL+Lubrifont+JP+N', family: "'WDXL Lubrifont JP N', sans-serif", weight: '400', category: 'gothic', tags: 'ゴシック 極太 看板 目立つ wdxl lubrifont' },
  { id: 'ibm-plex-sans-jp', name: 'IBM Plex Sans JP Bold (精密モダン)', googleFamily: 'IBM+Plex+Sans+JP:wght@700', family: "'IBM Plex Sans JP', sans-serif", weight: '700', category: 'gothic', tags: 'ゴシック モダン クール ibm plex' },
  { id: 'biz-udp-gothic', name: 'BIZ UDPゴシック Bold (くっきり視認性)', googleFamily: 'BIZ+UDPGothic:wght@700', family: "'BIZ UDPGothic', sans-serif", weight: '700', category: 'gothic', tags: 'ゴシック 読みやすい 太字 biz' },
  { id: 'biz-ud-gothic', name: 'BIZ UDゴシック Bold (均等幅・太字)', googleFamily: 'BIZ+UDGothic:wght@700', family: "'BIZ UDGothic', sans-serif", weight: '700', category: 'gothic', tags: 'ゴシック 等幅 太字 biz ud' },
  { id: 'sawarabi-gothic', name: 'さわらびゴシック (シンプル角ゴシック)', googleFamily: 'Sawarabi+Gothic', family: "'Sawarabi Gothic', sans-serif", weight: '400', category: 'gothic', tags: 'ゴシック シンプル 読みやすい sawarabi' },

  // 明朝・セリフ系
  { id: 'serif', name: 'Noto 明朝 Black (伝統・格式)', googleFamily: 'Noto+Serif+JP:wght@900', family: "'Noto Serif JP', serif", weight: '900', category: 'mincho', tags: '明朝 伝統 格式 武道 硬派 noto serif' },
  { id: 'shippori-mincho', name: 'しっぽり明朝 ExtraBold (美しい明朝)', googleFamily: 'Shippori+Mincho:wght@800', family: "'Shippori Mincho', serif", weight: '800', category: 'mincho', tags: '明朝 綺麗 上品 伝統 shippori' },
  { id: 'zen-old-mincho', name: 'Zen オールド明朝 Black (堂々・重厚)', googleFamily: 'Zen+Old+Mincho:wght@900', family: "'Zen Old Mincho', serif", weight: '900', category: 'mincho', tags: '明朝 重厚 クラシック 武道 zen old mincho' },
  { id: 'kaisei-tokumin', name: '解星 特ミン ExtraBold (力強い太明朝)', googleFamily: 'Kaisei+Tokumin:wght@800', family: "'Kaisei Tokumin', serif", weight: '800', category: 'mincho', tags: '明朝 太い 個性的 kaisei tokumin' },
  { id: 'kaisei-decol', name: '解星 デコール Bold (華やか明朝)', googleFamily: 'Kaisei+Decol:wght@700', family: "'Kaisei Decol', serif", weight: '700', category: 'mincho', tags: '明朝 飾り かわいい 華やか kaisei decol' },
  { id: 'kaisei-opti', name: '解星 オプティ Bold (優美・伝統明朝)', googleFamily: 'Kaisei+Opti:wght@700', family: "'Kaisei Opti', serif", weight: '700', category: 'mincho', tags: '明朝 上品 伝統 優美 kaisei opti' },
  { id: 'kaisei-harunoumi', name: '解星 春の海 Bold (やわらか筆風明朝)', googleFamily: 'Kaisei+HarunoUmi:wght@700', family: "'Kaisei HarunoUmi', serif", weight: '700', category: 'mincho', tags: '明朝 筆風 やわらか kaisei harunoumi' },
  { id: 'sawarabi-mincho', name: 'さわらび明朝 (すっきり明朝)', googleFamily: 'Sawarabi+Mincho', family: "'Sawarabi Mincho', serif", weight: '400', category: 'mincho', tags: '明朝 シンプル 読みやすい sawarabi' },
  { id: 'biz-udp-mincho', name: 'BIZ UDP明朝 Bold (くっきり太明朝)', googleFamily: 'BIZ+UDPMincho:wght@700', family: "'BIZ UDPMincho', serif", weight: '700', category: 'mincho', tags: '明朝 読みやすい 太字 biz' },
  { id: 'biz-ud-mincho', name: 'BIZ UD明朝 Bold (均等幅・太明朝)', googleFamily: 'BIZ+UDMincho:wght@700', family: "'BIZ UDMincho', serif", weight: '700', category: 'mincho', tags: '明朝 等幅 太字 biz ud' },

  // 丸ゴシック・ポップ・手書き系
  { id: 'round', name: 'M PLUS 丸ゴシック ExtraBold (親しみ)', googleFamily: 'M+PLUS+Rounded+1c:wght@800', family: "'M PLUS Rounded 1c', sans-serif", weight: '800', category: 'pop', tags: '丸ゴシック 優しい 定番 m plus rounded' },
  { id: 'heavy', name: 'モッチーポップ One (極太ポップ)', googleFamily: 'Mochiy+Pop+One', family: "'Mochiy Pop One', sans-serif", weight: '400', category: 'pop', tags: 'ポップ 太字 目立つ かわいい mochiy pop' },
  { id: 'mochiy-pop-p', name: 'モッチーポップ P One (バランス極太)', googleFamily: 'Mochiy+Pop+P+One', family: "'Mochiy Pop P One', sans-serif", weight: '400', category: 'pop', tags: 'ポップ 極太 楽しい mochiy pop p' },
  { id: 'zen-maru', name: 'Zen 丸ゴシック Black (やわらか太丸)', googleFamily: 'Zen+Maru+Gothic:wght@900', family: "'Zen Maru Gothic', sans-serif", weight: '900', category: 'pop', tags: '丸ゴシック 太字 おしゃれ zen maru' },
  { id: 'tsukimi-rounded', name: '月見丸ゴシック Bold (おしゃれ太丸)', googleFamily: 'Tsukimi+Rounded:wght@700', family: "'Tsukimi Rounded', sans-serif", weight: '700', category: 'pop', tags: '丸ゴシック おしゃれ 太字 tsukimi' },
  { id: 'kosugi-maru', name: '小杉丸ゴシック (すっきり丸文字)', googleFamily: 'Kosugi+Maru', family: "'Kosugi Maru', sans-serif", weight: '400', category: 'pop', tags: '丸ゴシック シンプル kosugi maru' },
  { id: 'kosugi', name: '小杉ゴシック (丸みのあるシンプル体)', googleFamily: 'Kosugi', family: "'Kosugi', sans-serif", weight: '400', category: 'pop', tags: 'ゴシック 丸み シンプル kosugi' },
  { id: 'kiwi-maru', name: 'キウイ丸 Medium (おしゃれ丸文字)', googleFamily: 'Kiwi+Maru:wght@500', family: "'Kiwi Maru', serif", weight: '500', category: 'pop', tags: '丸文字 おしゃれ かわいい kiwi maru' },
  { id: 'potta-one', name: 'ポッタ One (楽しい極太ブラシ)', googleFamily: 'Potta+One', family: "'Potta One', cursive", weight: '400', category: 'pop', tags: 'ポップ 太い イベント 文化祭 potta' },
  { id: 'darumadrop', name: 'だるまドロップ One (丸っこい極太)', googleFamily: 'Darumadrop+One', family: "'Darumadrop One', cursive", weight: '400', category: 'pop', tags: 'ポップ 極太 ユニーク 応援 daruma' },
  { id: 'cherry-bomb', name: 'チェリーボム One (超極太ポップ)', googleFamily: 'Cherry+Bomb+One', family: "'Cherry Bomb One', cursive", weight: '400', category: 'pop', tags: 'ポップ 超極太 かわいい cherry' },
  { id: 'hachi-maru', name: 'はちまるポップ (手書き・ゆるふわ)', googleFamily: 'Hachi+Maru+Pop', family: "'Hachi Maru Pop', cursive", weight: '400', category: 'pop', tags: '手書き かわいい 丸文字 hachi maru' },
  { id: 'yusei-magic', name: '油性マジック (マーカー手書き風)', googleFamily: 'Yusei+Magic', family: "'Yusei Magic', sans-serif", weight: '400', category: 'pop', tags: '手書き マジック 応援 yusei magic' },
  { id: 'klee-one', name: 'クレー One SemiBold (丁寧な手書き・教科書風)', googleFamily: 'Klee+One:wght@600', family: "'Klee One', cursive", weight: '600', category: 'pop', tags: '手書き 綺麗 青春 エモい klee' },

  // デザイン・ディスプレイ系
  { id: 'rampart', name: 'ランパート One (立体シャドウ装飾)', googleFamily: 'Rampart+One', family: "'Rampart One', cursive", weight: '400', category: 'design', tags: '立体 影付き デザイン 目立つ rampart' },
  { id: 'train-one', name: 'トレイン One (二重ライン装飾)', googleFamily: 'Train+One', family: "'Train One', cursive", weight: '400', category: 'design', tags: '二重線 スポーティ デザイン train' },
  { id: 'stick', name: 'スティック (直線デザイン文字)', googleFamily: 'Stick', family: "'Stick', sans-serif", weight: '400', category: 'design', tags: '直線 ユニーク ゲーム風 stick' },
  { id: 'dotgothic', name: 'ドットゴシック16 (レトロピクセル)', googleFamily: 'DotGothic16', family: "'DotGothic16', sans-serif", weight: '400', category: 'design', tags: 'ドット レトロ ゲーム 電光掲示板 dotgothic' },
  { id: 'palette-mosaic', name: 'パレットモザイク (ポップ装飾文字)', googleFamily: 'Palette+Mosaic', family: "'Palette Mosaic', cursive", weight: '400', category: 'design', tags: 'デザイン モザイク イベント 文化祭 palette' },
  { id: 'm-plus-1-code', name: 'M PLUS 1 Code Bold (等幅テック日本語)', googleFamily: 'M+PLUS+1+Code:wght@700', family: "'M PLUS 1 Code', monospace", weight: '700', category: 'design', tags: '等幅 テック サイバー eスポーツ code' },
  { id: 'bungee-shade', name: 'Bungee Shade (立体シャドウ装飾)', googleFamily: 'Bungee+Shade', family: "'Bungee Shade', cursive", weight: '400', category: 'design', tags: '立体 影 ブロック スポーツ bungee shade' },
  { id: 'bungee-inline', name: 'Bungee Inline (二重ラインブロック)', googleFamily: 'Bungee+Inline', family: "'Bungee Inline', cursive", weight: '400', category: 'design', tags: '二重線 ブロック スポーツ bungee inline' },
  { id: 'monoton', name: 'Monoton (ネオン・多重ライン)', googleFamily: 'Monoton', family: "'Monoton', cursive", weight: '400', category: 'design', tags: 'ネオン ストライプ レトロ 英語 monoton' },

  // 欧文・スポーツ系
  { id: 'anton', name: 'Anton (欧文・極太インパクト)', googleFamily: 'Anton', family: "'Anton', sans-serif", weight: '400', category: 'english', tags: '英語 極太 インパクト スタジアム anton' },
  { id: 'oswald', name: 'Oswald Bold (欧文・長体ゴシック)', googleFamily: 'Oswald:wght@700', family: "'Oswald', sans-serif", weight: '700', category: 'english', tags: '英語 クール 縦長 スポーティ oswald' },
  { id: 'bebas-neue', name: 'Bebas Neue (欧文・スポーツ定番)', googleFamily: 'Bebas+Neue', family: "'Bebas Neue', sans-serif", weight: '400', category: 'english', tags: '英語 アルファベット スポーティ かっこいい bebas' },
  { id: 'fjalla-one', name: 'Fjalla One (シャープ長体見出し)', googleFamily: 'Fjalla+One', family: "'Fjalla One', sans-serif", weight: '400', category: 'english', tags: '英語 長体 見出し スポーティ fjalla' },
  { id: 'saira-condensed', name: 'Saira Condensed ExtraBold (精悍スポーツ長体)', googleFamily: 'Saira+Condensed:wght@800', family: "'Saira Condensed', sans-serif", weight: '800', category: 'english', tags: '英語 スポーツ チーム 長体 saira' },
  { id: 'saira-extra-condensed', name: 'Saira Extra Condensed (超縦長スポーツ)', googleFamily: 'Saira+Extra+Condensed:wght@800', family: "'Saira Extra Condensed', sans-serif", weight: '800', category: 'english', tags: '英語 縦長 スリム スポーツ saira' },
  { id: 'pathway-gothic', name: 'Pathway Gothic One (映画ポスター風長体)', googleFamily: 'Pathway+Gothic+One', family: "'Pathway Gothic One', sans-serif", weight: '400', category: 'english', tags: '英語 縦長 ポスター pathway' },
  { id: 'francois-one', name: 'Francois One (力強い太ゴシック)', googleFamily: 'Francois+One', family: "'Francois One', sans-serif", weight: '400', category: 'english', tags: '英語 太字 ゴシック francois' },
  { id: 'benchnine', name: 'BenchNine Bold (スリム・ユニフォーム)', googleFamily: 'BenchNine:wght@700', family: "'BenchNine', sans-serif", weight: '700', category: 'english', tags: '英語 スリム 縦長 ユニフォーム benchnine' },
  { id: 'six-caps', name: 'Six Caps (超縦長インパクト見出し)', googleFamily: 'Six+Caps', family: "'Six Caps', sans-serif", weight: '400', category: 'english', tags: '英語 超縦長 ポスター 大文字 six caps' },
  { id: 'big-shoulders', name: 'Big Shoulders Display Black (超縦長極太)', googleFamily: 'Big+Shoulders+Display:wght@900', family: "'Big Shoulders Display', sans-serif", weight: '900', category: 'english', tags: '英語 縦長 極太 スポーツ big shoulders' },
  { id: 'big-shoulders-stencil', name: 'Big Shoulders Stencil (縦長ステンシル)', googleFamily: 'Big+Shoulders+Stencil+Display:wght@800', family: "'Big Shoulders Stencil Display', sans-serif", weight: '800', category: 'english', tags: '英語 ステンシル 縦長 スポーツ' },
  { id: 'antonio', name: 'Antonio Bold (スタイリッシュ長体)', googleFamily: 'Antonio:wght@700', family: "'Antonio', sans-serif", weight: '700', category: 'english', tags: '英語 長体 モダン antonio' },
  { id: 'black-ops', name: 'Black Ops One (ステンシル・スナイパー風)', googleFamily: 'Black+Ops+One', family: "'Black Ops One', cursive", weight: '400', category: 'english', tags: '英語 ステンシル ミリタリー スナイパー かっこいい black ops' },
  { id: 'stardos-stencil', name: 'Stardos Stencil Bold (ミリタリー・ステンシル)', googleFamily: 'Stardos+Stencil:wght@700', family: "'Stardos Stencil', cursive", weight: '700', category: 'english', tags: '英語 ステンシル ミリタリー セリフ stardos' },
  { id: 'wallpoet', name: 'Wallpoet (メカ・デジタルステンシル)', googleFamily: 'Wallpoet', family: "'Wallpoet', cursive", weight: '400', category: 'english', tags: '英語 ステンシル ロボット サイバー wallpoet' },
  { id: 'russo-one', name: 'Russo One (力強いスポーツブロック)', googleFamily: 'Russo+One', family: "'Russo One', sans-serif", weight: '400', category: 'english', tags: '英語 スポーツ 太字 チーム russo' },
  { id: 'teko', name: 'Teko Bold (縦長シャープ・ユニフォーム風)', googleFamily: 'Teko:wght@700', family: "'Teko', sans-serif", weight: '700', category: 'english', tags: '英語 縦長 スポーティ シャープ teko' },
  { id: 'archivo-black', name: 'Archivo Black (ワイド極太ゴシック)', googleFamily: 'Archivo+Black', family: "'Archivo Black', sans-serif", weight: '400', category: 'english', tags: '英語 極太 ワイド インパクト archivo' },
  { id: 'barlow-condensed', name: 'Barlow Condensed ExtraBold (スタイリッシュ長体)', googleFamily: 'Barlow+Condensed:wght@800', family: "'Barlow Condensed', sans-serif", weight: '800', category: 'english', tags: '英語 長体 モダン スポーツ barlow' },
  { id: 'montserrat', name: 'Montserrat Black (王道モダン極太)', googleFamily: 'Montserrat:wght@900', family: "'Montserrat', sans-serif", weight: '900', category: 'english', tags: '英語 モダン 極太 王道 montserrat' },
  { id: 'kanit', name: 'Kanit ExtraBold (スポーティ・タイポ)', googleFamily: 'Kanit:wght@800', family: "'Kanit', sans-serif", weight: '800', category: 'english', tags: '英語 スポーティ 太字 モダン kanit' },
  { id: 'rubik', name: 'Rubik Black (丸みある太字モダン)', googleFamily: 'Rubik:wght@900', family: "'Rubik', sans-serif", weight: '900', category: 'english', tags: '英語 モダン 太字 丸み rubik' },
  { id: 'rubik-mono', name: 'Rubik Mono One (超ワイド等幅極太)', googleFamily: 'Rubik+Mono+One', family: "'Rubik Mono One', sans-serif", weight: '400', category: 'english', tags: '英語 超ワイド 極太 ブロック rubik mono' },
  { id: 'syne', name: 'Syne ExtraBold (先進デザイン太字)', googleFamily: 'Syne:wght@800', family: "'Syne', sans-serif", weight: '800', category: 'english', tags: '英語 ワイド デザイン モダン syne' },
  { id: 'unbounded', name: 'Unbounded Black (超ワイド未来系)', googleFamily: 'Unbounded:wght@900', family: "'Unbounded', sans-serif", weight: '900', category: 'english', tags: '英語 ワイド 未来 極太 unbounded' },
  { id: 'black-han-sans', name: 'Black Han Sans (超極太スクエア英数)', googleFamily: 'Black+Han+Sans', family: "'Black Han Sans', sans-serif", weight: '400', category: 'english', tags: '英語 超極太 インパクト black han' },
  { id: 'titan-one', name: 'Titan One (立体感極太ポップ)', googleFamily: 'Titan+One', family: "'Titan One', cursive", weight: '400', category: 'english', tags: '英語 極太 ポップ 応援 titan' },
  { id: 'lilita-one', name: 'Lilita One (丸み太字ディスプレイ)', googleFamily: 'Lilita+One', family: "'Lilita One', cursive", weight: '400', category: 'english', tags: '英語 ポップ 丸文字 太字 lilita' },
  { id: 'bowlby-one-sc', name: 'Bowlby One SC (大文字極太ブロック)', googleFamily: 'Bowlby+One+SC', family: "'Bowlby One SC', cursive", weight: '400', category: 'english', tags: '英語 極太 ブロック 迫力 bowlby' },
  { id: 'bungee', name: 'Bungee (アメリカンスポーツ・ブロック)', googleFamily: 'Bungee', family: "'Bungee', cursive", weight: '400', category: 'english', tags: '英語 ブロック ポップ スポーツ bungee' },
  { id: 'graduate', name: 'Graduate (カレッジスポーツ・スラブ)', googleFamily: 'Graduate', family: "'Graduate', serif", weight: '400', category: 'english', tags: '英語 大学 スポーツ カレッジ 背番号 graduate' },
  { id: 'alfa-slab', name: 'Alfa Slab One (超極太スラブセリフ)', googleFamily: 'Alfa+Slab+One', family: "'Alfa Slab One', serif", weight: '400', category: 'english', tags: '英語 極太 スラブ スポーツ alfa' },
  { id: 'ultra', name: 'Ultra (重厚極太スラブセリフ)', googleFamily: 'Ultra', family: "'Ultra', serif", weight: '400', category: 'english', tags: '英語 極太 セリフ 重厚 ultra' },
  { id: 'cinzel', name: 'Cinzel Black (王者・クラシカルローマ)', googleFamily: 'Cinzel:wght@900', family: "'Cinzel', serif", weight: '900', category: 'english', tags: '英語 ローマ 伝統 王者 高級 cinzel' },
  { id: 'playfair', name: 'Playfair Display Black (格式・太セリフ)', googleFamily: 'Playfair+Display:wght@900', family: "'Playfair Display', serif", weight: '900', category: 'english', tags: '英語 上品 セリフ 太字 playfair' },
  { id: 'chakra-petch', name: 'Chakra Petch Bold (サイバー・eスポーツ)', googleFamily: 'Chakra+Petch:wght@700', family: "'Chakra Petch', sans-serif", weight: '700', category: 'english', tags: '英語 サイバー 近未来 ゲーム chakra' },
  { id: 'orbitron', name: 'Orbitron Black (SF・eスポーツ)', googleFamily: 'Orbitron:wght@900', family: "'Orbitron', sans-serif", weight: '900', category: 'english', tags: '英語 SF 近未来 eスポーツ orbitron' },
  { id: 'audiowide', name: 'Audiowide (近未来ワイドロゴ)', googleFamily: 'Audiowide', family: "'Audiowide', cursive", weight: '400', category: 'english', tags: '英語 近未来 ワイド ロゴ audiowide' },
  { id: 'racing-sans', name: 'Racing Sans One (モータースポーツ斜体)', googleFamily: 'Racing+Sans+One', family: "'Racing Sans One', cursive", weight: '400', category: 'english', tags: '英語 レーシング スピード 斜体 スポーツ' },
  { id: 'fugaz-one', name: 'Fugaz One (勢いあるスポーツ斜体)', googleFamily: 'Fugaz+One', family: "'Fugaz One', cursive", weight: '400', category: 'english', tags: '英語 斜体 スピード スポーツ fugaz' },
  { id: 'faster-one', name: 'Faster One (スピード感・風切り装飾)', googleFamily: 'Faster+One', family: "'Faster One', cursive", weight: '400', category: 'english', tags: '英語 スピード レーシング faster' },
  { id: 'staatliches', name: 'Staatliches (縦長ポスター見出し)', googleFamily: 'Staatliches', family: "'Staatliches', cursive", weight: '400', category: 'english', tags: '英語 縦長 ポスター 大文字 staatliches' },
  { id: 'squada-one', name: 'Squada One (角張りロゴフォント)', googleFamily: 'Squada+One', family: "'Squada One', cursive", weight: '400', category: 'english', tags: '英語 角張り ロゴ スポーツ squada' },
  { id: 'passion-one', name: 'Passion One Bold (迫力太字ディスプレイ)', googleFamily: 'Passion+One:wght@700', family: "'Passion One', cursive", weight: '700', category: 'english', tags: '英語 太字 迫力 passion' },
  { id: 'rowdies', name: 'Rowdies Bold (個性派太字ディスプレイ)', googleFamily: 'Rowdies:wght@700', family: "'Rowdies', cursive", weight: '700', category: 'english', tags: '英語 太字 インパクト rowdies' },
  { id: 'righteous', name: 'Righteous (モダン・スポーティ丸系)', googleFamily: 'Righteous', family: "'Righteous', cursive", weight: '400', category: 'english', tags: '英語 モダン スポーティ righteous' },
  { id: 'bangers', name: 'Bangers (アメコミ・叫び系インパクト)', googleFamily: 'Bangers', family: "'Bangers', cursive", weight: '400', category: 'english', tags: '英語 アメコミ 漫画 インパクト bangers' },
  { id: 'boogaloo', name: 'Boogaloo (元気・レトロポップ)', googleFamily: 'Boogaloo', family: "'Boogaloo', cursive", weight: '400', category: 'english', tags: '英語 ポップ 元気 レトロ boogaloo' },
  { id: 'luckiest-guy', name: 'Luckiest Guy (手描き看板・ポスター太字)', googleFamily: 'Luckiest+Guy', family: "'Luckiest Guy', cursive", weight: '400', category: 'english', tags: '英語 ポスター 手描き 極太 luckiest' },
  { id: 'permanent-marker', name: 'Permanent Marker (極太マジック文字)', googleFamily: 'Permanent+Marker', family: "'Permanent Marker', cursive", weight: '400', category: 'english', tags: '英語 マジック 手書き ストリート marker' },
  { id: 'sedgwick-ave', name: 'Sedgwick Ave Display (グラフィティ風)', googleFamily: 'Sedgwick+Ave+Display', family: "'Sedgwick Ave Display', cursive", weight: '400', category: 'english', tags: '英語 グラフィティ ストリート 手書き sedgwick' },
  { id: 'caveat-brush', name: 'Caveat Brush (ラフな筆ペンサイン)', googleFamily: 'Caveat+Brush', family: "'Caveat Brush', cursive", weight: '400', category: 'english', tags: '英語 筆 サイン 手書き caveat' },
  { id: 'kaushan-script', name: 'Kaushan Script (勢いある筆・筆記体)', googleFamily: 'Kaushan+Script', family: "'Kaushan Script', cursive", weight: '400', category: 'english', tags: '英語 筆記体 サイン 筆 スポーティ kaushan' },
  { id: 'lobster', name: 'Lobster (王道クラシック筆記体)', googleFamily: 'Lobster', family: "'Lobster', cursive", weight: '400', category: 'english', tags: '英語 筆記体 クラシック 太字 lobster' },
  { id: 'pacifico', name: 'Pacifico (爽やかブラシ筆記体)', googleFamily: 'Pacifico', family: "'Pacifico', cursive", weight: '400', category: 'english', tags: '英語 筆記体 サーフ 爽やか pacifico' },
  { id: 'shrikhand', name: 'Shrikhand (躍動感極太斜体)', googleFamily: 'Shrikhand', family: "'Shrikhand', cursive", weight: '400', category: 'english', tags: '英語 斜体 太字 筆記 shrikhand' },

  // 鉄道・行先表示（方向幕・LED）・道路標識系
  { id: 'transit-jnr-maru', name: '国鉄すみ丸風 (M PLUS Rounded Bold)', googleFamily: 'M+PLUS+Rounded+1c:wght@700', family: "'M PLUS Rounded 1c', sans-serif", weight: '700', category: 'transit', tags: '電車 鉄道 行先 方向幕 駅名標 国鉄 すみ丸 丸ゴシック 新幹線' },
  { id: 'transit-koudan-maru', name: '公団・高速丸ゴシック風 (Zen丸 Bold)', googleFamily: 'Zen+Maru+Gothic:wght@700', family: "'Zen Maru Gothic', sans-serif", weight: '700', category: 'transit', tags: '標識 道路標識 公団 高速道路 案内 丸ゴシック' },
  { id: 'transit-koudan-med', name: '道路案内 中太丸ゴシック (M PLUS Rounded Med)', googleFamily: 'M+PLUS+Rounded+1c:wght@500', family: "'M PLUS Rounded 1c', sans-serif", weight: '500', category: 'transit', tags: '標識 道路標識 高速道路 案内 駅' },
  { id: 'transit-makugothic', name: '方向幕レトロ角ゴシック (Zen角アンチック)', googleFamily: 'Zen+Kaku+Gothic+Antique:wght@700', family: "'Zen Kaku Gothic Antique', sans-serif", weight: '700', category: 'transit', tags: '電車 鉄道 行先 方向幕 国鉄 私鉄 駅名標' },
  { id: 'transit-jr-sign', name: 'JR・駅名標 角ゴシック風 (Zen角ゴシック Bold)', googleFamily: 'Zen+Kaku+Gothic+New:wght@700', family: "'Zen Kaku Gothic New', sans-serif", weight: '700', category: 'transit', tags: '電車 鉄道 駅名標 案内サイン JR 新幹線' },
  { id: 'transit-metro-modern', name: '都市地下鉄サイン風 (M PLUS 1 Bold)', googleFamily: 'M+PLUS+1:wght@700', family: "'M PLUS 1', sans-serif", weight: '700', category: 'transit', tags: '電車 地下鉄 メトロ 新ゴ ゴナ 標識 案内サイン' },
  { id: 'transit-sign-std', name: '現行 標識・JR標準ゴシック (Noto Sans Bold)', googleFamily: 'Noto+Sans+JP:wght@700', family: "'Noto Sans JP', sans-serif", weight: '700', category: 'transit', tags: '道路標識 標識 ヒラギノ 電車 駅 案内' },
  { id: 'transit-timetable', name: '駅案内・路線図ゴシック (M PLUS 1p Bold)', googleFamily: 'M+PLUS+1p:wght@700', family: "'M PLUS 1p', sans-serif", weight: '700', category: 'transit', tags: '電車 路線図 時刻表 駅 案内' },
  { id: 'transit-tokkyu-mincho', name: '旧国鉄・特急 方向幕明朝 (Zenオールド明朝)', googleFamily: 'Zen+Old+Mincho:wght@700', family: "'Zen Old Mincho', serif", weight: '700', category: 'transit', tags: '電車 国鉄 特急 方向幕 明朝 駅名標' },
  { id: 'transit-led-16', name: '車両側面・発車標 16ドットLED (DotGothic16)', googleFamily: 'DotGothic16', family: "'DotGothic16', sans-serif", weight: '400', category: 'transit', tags: '電車 行先 LED 電光掲示板 発車標 ドット 駅' },
  { id: 'transit-highway-bold', name: 'Highway Gothic 太字 (高速道路標識 Overpass)', googleFamily: 'Overpass:wght@800', family: "'Overpass', sans-serif", weight: '800', category: 'transit', isEnglishOnly: true, englishSample: 'TOKYO EXPWY 01', tags: '英語 標識 高速道路 highway gothic overpass route' },
  { id: 'transit-highway', name: 'Highway Gothic 標準 (道路案内 Overpass)', googleFamily: 'Overpass:wght@700', family: "'Overpass', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'ROUTE 246 SHIBUYA', tags: '英語 標識 道路標識 highway gothic overpass' },
  { id: 'transit-din', name: 'DIN 1451系 標識書体 (欧州鉄道 Gidole)', googleFamily: 'Gidole', family: "'Gidole', sans-serif", weight: '400', category: 'transit', isEnglishOnly: true, englishSample: 'PLATFORM 04 EXPRESS', tags: '英語 鉄道 標識 din 1451 駅 ナンバリング gidole' },
  { id: 'transit-barlow-semi', name: '駅ナンバリング・VICS DIN風 (Barlow Semi)', googleFamily: 'Barlow+Semi+Condensed:wght@700', family: "'Barlow Semi Condensed', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'JY-17 SHINJUKU', tags: '英語 駅ナンバリング 路線記号 din barlow' },
  { id: 'transit-roboto-cond', name: '日本道路標識 英数字風 (Roboto Condensed)', googleFamily: 'Roboto+Condensed:wght@700', family: "'Roboto Condensed', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'IC EXIT 120m', tags: '英語 公団 道路標識 長体 時刻表 roboto' },
  { id: 'transit-archivo-narrow', name: '方向幕ローマ字 長体 (Archivo Narrow)', googleFamily: 'Archivo+Narrow:wght@700', family: "'Archivo Narrow', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'RAPID TOKYO', tags: '英語 電車 方向幕 行先 長体 archivo' },
  { id: 'transit-pt-narrow', name: '国鉄・JR初期 方向幕ローマ字風 (PT Sans Narrow)', googleFamily: 'PT+Sans+Narrow:wght@700', family: "'PT Sans Narrow', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'UENO / AOMORI', tags: '英語 国鉄 方向幕 行先 長体 pt sans' },
  { id: 'transit-public-sans', name: '公共・空港・駅サイン (Public Sans Bold)', googleFamily: 'Public+Sans:wght@700', family: "'Public Sans', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'GATE A / NORTH EXIT', tags: '英語 標識 空港 駅 公共サイン public sans' },
  { id: 'transit-inter-sign', name: '最新駅サイン・案内英字 (Inter Bold)', googleFamily: 'Inter:wght@700', family: "'Inter', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'Transfer Line 02', tags: '英語 駅サイン ピクトグラム inter' },
  { id: 'transit-jost', name: '地下鉄・路線図 Futura調 (Jost Bold)', googleFamily: 'Jost:wght@700', family: "'Jost', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'METRO LINE 09', tags: '英語 地下鉄 路線図 futura jost' },
  { id: 'transit-hyperlegible', name: '高視認性 交通案内 (Atkinson Hyperlegible)', googleFamily: 'Atkinson+Hyperlegible:wght@700', family: "'Atkinson Hyperlegible', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: '12:45 LOCAL TRACK 3', tags: '英語 視認性 標識 バリアフリー atkinson' },
  { id: 'transit-oxanium', name: '車両番号・路線記号 (Oxanium Bold)', googleFamily: 'Oxanium:wght@700', family: "'Oxanium', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'SER.235-1000', tags: '英語 車両番号 新幹線 電車 記号 oxanium' },
  { id: 'transit-share-tech', name: '系統番号・駅番号プレート (Share Tech)', googleFamily: 'Share+Tech', family: "'Share Tech', sans-serif", weight: '400', category: 'transit', isEnglishOnly: true, englishSample: 'E233-3000 EXPRESS', tags: '英語 駅番号 系統 電車 share tech' },
  { id: 'transit-doto-black', name: '発車標・車体LED 極太ドット (Doto Black)', googleFamily: 'Doto:wght@900', family: "'Doto', sans-serif", weight: '900', category: 'transit', isEnglishOnly: true, englishSample: 'LIMITED EXP. 18:30', tags: '英語 LED 電光掲示板 ドット 駅 発車標 doto' },
  { id: 'transit-doto', name: 'LEDマトリクス 電光掲示板 (Doto Bold)', googleFamily: 'Doto:wght@700', family: "'Doto', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'SHINAGAWA 05', tags: '英語 LED 電光掲示板 ドット doto' },
  { id: 'transit-pixelify', name: '電光掲示板 太ドット英字 (Pixelify Sans)', googleFamily: 'Pixelify+Sans:wght@700', family: "'Pixelify Sans', sans-serif", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'FOR YOKOHAMA', tags: '英語 LED ドット 電車 pixelify' },
  { id: 'transit-vt323', name: '改札・ホーム 発車標レトロLED (VT323)', googleFamily: 'VT323', family: "'VT323', monospace", weight: '400', category: 'transit', isEnglishOnly: true, englishSample: '10 CARS / TRACK 1', tags: '英語 LED 発車標 電光掲示板 レトロ vt323' },
  { id: 'transit-share-mono', name: '発車時刻・列車番号 等幅LED (Share Tech Mono)', googleFamily: 'Share+Tech+Mono', family: "'Share Tech Mono', monospace", weight: '400', category: 'transit', isEnglishOnly: true, englishSample: '09:15 NOZOMI 24', tags: '英語 時刻表 列車番号 LED 等幅' },
  { id: 'transit-ticket', name: '国鉄・硬券切符印字風 (Courier Prime)', googleFamily: 'Courier+Prime:wght@700', family: "'Courier Prime', monospace", weight: '700', category: 'transit', isEnglishOnly: true, englishSample: 'TOKYO -> KYOTO 01', tags: '英語 切符 硬券 国鉄 駅 courier' },
];

const SIZE_PRESETS = [
  { label: '600 × 100 cm (超ワイド・デフォルト)', width: 600, height: 100, desc: 'フェンスやスタジアムの大型応援幕に' },
  { label: '180 × 90 cm (定番・標準)', width: 180, height: 90, desc: '2〜3人で持つ・屋内掲示に最適' },
  { label: '240 × 90 cm (人気・ワイド)', width: 240, height: 90, desc: '体育館や屋外フェンスの定番サイズ' },
  { label: '300 × 100 cm (大型・迫力)', width: 300, height: 100, desc: 'サッカー・野球など広い屋外会場向け' },
  { label: '120 × 60 cm (コンパクト)', width: 120, height: 60, desc: '1〜2人で手軽に持てるサイズ' },
  { label: '360 × 120 cm (特大サイズ)', width: 360, height: 120, desc: '大人数での記念撮影・スタジアム用' },
  { label: '800 × 120 cm (ビッグサイズ)', width: 800, height: 120, desc: '大規模会場・長い横断幕向け' },
  { label: '90 × 180 cm (縦長・懸垂幕)', width: 90, height: 180, desc: '縦書きスローガンや垂れ幕に' },
];

const COLOR_SWATCHES = [
  '#ffffff', '#000000', '#dc2626', '#ea580c', '#facc15',
  '#16a34a', '#0284c7', '#1e3a8a', '#7e22ce', '#db2777',
  '#f8fafc', '#334155', '#991b1b', '#fef08a', '#bbf7d0'
];

const BG_TYPE_OPTIONS = [
  { id: 'solid', label: '単色' },
  { id: 'gradient', label: 'グラデ' },
  { id: 'split_lr', label: '左右分け' },
  { id: 'split_tb', label: '上下分け' },
  { id: 'split_diag', label: '斜め分け' },
  { id: 'stripe_v', label: '縦しましま' },
  { id: 'stripe_h', label: '横しましま' },
  { id: 'stripe_diag', label: '斜めしましま' },
];

const BG_PATTERN_OPTIONS = [
  { id: 'none', label: '模様なし (シンプル)' },
  { id: 'slashes', label: 'スピード斜線' },
  { id: 'checkered', label: '市松模様 (チェッカー)' },
  { id: 'spotlight', label: '中央ハイライト' },
  { id: 'vignette', label: '周辺引き締め (ビネット)' },
  { id: 'dots', label: '水玉・ドット' },
  { id: 'grid', label: '方眼グリッド' },
  { id: 'diagonal_grid', label: '斜めクロス格子' },
  { id: 'carbon', label: 'カーボンメッシュ風' },
  { id: 'diamonds', label: 'ダイヤ格子' },
  { id: 'chevron', label: 'V字山型 (シェブロン)' },
  { id: 'sunburst', label: '集中線・サンバースト' },
];

const BG_MULTI_PALETTES = [
  { name: '赤×黒', colors: ['#dc2626', '#111827'] },
  { name: '紅白', colors: ['#dc2626', '#ffffff'] },
  { name: '紺×金', colors: ['#1e3a8a', '#facc15'] },
  { name: '黒×金', colors: ['#111827', '#f59e0b'] },
  { name: '青×白×赤', colors: ['#1d4ed8', '#ffffff', '#dc2626'] },
  { name: '緑×黄×白', colors: ['#15803d', '#facc15', '#ffffff'] },
  { name: '黄×黒', colors: ['#facc15', '#171717'] },
  { name: '紫×白', colors: ['#6b21a8', '#ffffff'] },
];

const AI_BG_IDEA_CHIPS = [
  '燃え上がる炎と稲妻の熱い背景',
  '日本の日の丸と金色の放射光線',
  '桜吹雪が舞う和風グラデーション',
  '青空に入道雲と爽やかな光線',
  'サッカー場の芝生と白ライン',
  '黒地に金箔と筆のかすれ風',
];

const sanitizeAiBgSvgInner = (rawSvg, scopePrefix = 'aibg') => {
  if (typeof rawSvg !== 'string') return null;
  let inner = rawSvg.trim();
  const outerMatch = inner.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>$/i);
  if (outerMatch) {
    inner = outerMatch[1].trim();
  }
  if (!inner) return null;

  inner = inner
    .replace(/<(script|foreignObject|iframe|object|embed|audio|video|image)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|foreignObject|iframe|object|embed|audio|video|image)\b[^>]*\/?>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '');

  const idMatches = [];
  const idRegex = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let m;
  while ((m = idRegex.exec(inner)) !== null) {
    const rawId = m[1] || m[2];
    if (rawId && !idMatches.includes(rawId)) {
      idMatches.push(rawId);
    }
  }
  idMatches.sort((a, b) => b.length - a.length);
  idMatches.forEach((rawId, idx) => {
    const safeNewId = `${scopePrefix}-el-${idx}`;
    const escaped = rawId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    inner = inner
      .replace(new RegExp(`(\\bid\\s*=\\s*)(["'])${escaped}\\2`, 'g'), `$1$2${safeNewId}$2`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#${safeNewId})`)
      .replace(new RegExp(`((?:xlink:)?href\\s*=\\s*)(["'])#${escaped}\\2`, 'g'), `$1$2#${safeNewId}$2`);
  });

  if (typeof DOMParser !== 'undefined' && typeof XMLSerializer !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<svg xmlns="http://www.w3.org/2000/svg">${inner}</svg>`,
        'image/svg+xml'
      );
      if (doc.querySelector('parsererror')) {
        return null;
      }
      const serializer = new XMLSerializer();
      const serialized = Array.from(doc.documentElement.childNodes)
        .map((node) => serializer.serializeToString(node))
        .join('');
      return serialized || null;
    } catch {
      return null;
    }
  }
  return inner;
};

const TEXT_EFFECT_OPTIONS = [
  { id: 'shadow', label: '立体影 (シャドウ)' },
  { id: 'hard_shadow', label: '3D くっきり影' },
  { id: 'double_outline', label: '二重フチ取り' },
  { id: 'neon', label: 'ネオン発光' },
  { id: 'metallic', label: 'メタリック光沢' },
  { id: 'highlight_bar', label: '背景カラー帯' },
  { id: 'underline', label: '強調アンダーライン' },
];

const getTextEffects = (item) => {
  if (Array.isArray(item?.effects)) return item.effects;
  return item?.shadow ? ['shadow'] : [];
};

const adjustHexBrightness = (hex, delta) => {
  if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return hex || '#ffffff';
  const clamp = (n) => Math.max(0, Math.min(255, n));
  const r = clamp(parseInt(hex.slice(1, 3), 16) + delta);
  const g = clamp(parseInt(hex.slice(3, 5), 16) + delta);
  const b = clamp(parseInt(hex.slice(5, 7), 16) + delta);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

const estimateBannerTextBox = (lines, fontSize, letterSpacing, isVertical) => {
  if (isVertical) {
    const maxChars = Math.max(1, ...lines.map((l) => Array.from(l).length));
    const width = Math.max(fontSize * 1.4, lines.length * fontSize * 1.28 + fontSize * 0.45);
    const height = maxChars * (fontSize + letterSpacing) + fontSize * 0.45;
    return { width, height };
  }
  const lineWidths = lines.map((line) => {
    let wUnits = 0;
    for (const ch of Array.from(line)) {
      wUnits += /[\u0020-\u007e]/.test(ch) ? 0.62 : 1.02;
    }
    const spacingTotal = Math.max(0, Array.from(line).length - 1) * letterSpacing;
    return wUnits * fontSize + spacingTotal;
  });
  const width = Math.max(fontSize * 1.6, ...lineWidths) + fontSize * 0.7;
  const height = lines.length * fontSize * 1.18 + fontSize * 0.35;
  return { width, height };
};

const getBgColorsFromConfig = (cfg) => {
  if (Array.isArray(cfg?.colors) && cfg.colors.length >= 2) {
    return cfg.colors;
  }
  const c1 = cfg?.color1 || '#ffffff';
  const c2 = cfg?.color2 || '#1e3a8a';
  return [c1, c2];
};

const getDefaultBgSplits = (colorCount) => {
  if (colorCount <= 1) return [];
  return Array.from({ length: colorCount - 1 }, (_, i) =>
    Math.round(((i + 1) / colorCount) * 1000) / 10
  );
};

const getBgSplitPositions = (cfg, colorCount) => {
  if (colorCount <= 1) return [];
  const expectedLen = colorCount - 1;
  if (Array.isArray(cfg?.colorSplits) && cfg.colorSplits.length === expectedLen) {
    const normalized = [];
    for (let i = 0; i < expectedLen; i++) {
      const minV = i === 0 ? 1 : normalized[i - 1] + 1;
      const maxV = 100 - (expectedLen - i);
      const raw = Number(cfg.colorSplits[i]);
      const safe = Number.isFinite(raw) ? raw : ((i + 1) / colorCount) * 100;
      normalized.push(Math.max(minV, Math.min(maxV, safe)));
    }
    return normalized;
  }
  return getDefaultBgSplits(colorCount);
};

const getGradientStopsFromSplits = (colors, splits) => {
  if (colors.length <= 1) return [0];
  if (colors.length === 2) {
    const s = splits[0] ?? 50;
    return [
      Math.max(0, Math.min(100, 2 * s - 100)),
      Math.max(0, Math.min(100, 2 * s)),
    ];
  }
  const rawStops = colors.map((_, idx) => {
    if (idx === 0) return Math.max(0, Math.min(90, (splits[0] ?? 33.3) * 2 - 100));
    if (idx === colors.length - 1) {
      return Math.max(10, Math.min(100, (splits[splits.length - 1] ?? 66.7) * 2));
    }
    return ((splits[idx - 1] ?? 0) + (splits[idx] ?? 100)) / 2;
  });
  for (let i = 1; i < rawStops.length; i++) {
    if (rawStops[i] < rawStops[i - 1]) rawStops[i] = rawStops[i - 1];
  }
  return rawStops;
};

const isHexLightColor = (hex) => {
  if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 175;
};

const getEffectivePatternColor = (cfg, bgColors) => {
  if (cfg?.patternTone === 'light') return '#ffffff';
  if (cfg?.patternTone === 'dark') return '#000000';
  return isHexLightColor(bgColors[0]) ? '#000000' : '#ffffff';
};

const encodeDesignToShareHash = (dataObj) => {
  try {
    const jsonStr = JSON.stringify(dataObj);
    const bytes = new TextEncoder().encode(jsonStr);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return null;
  }
};

const decodeDesignFromShareHash = (hashStr) => {
  try {
    if (!hashStr || !hashStr.includes('design=')) return null;
    const m = hashStr.match(/design=([A-Za-z0-9\-_]+)/);
    if (!m) return null;
    let b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.texts)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const NumericValueInput = ({
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  ariaLabel,
  className = '',
  widthClass = 'w-14',
  textColorClass = 'text-sky-700',
}) => {
  const [draft, setDraft] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    if (!isFocused || value !== lastEmittedRef.current) {
      setDraft(String(value));
      lastEmittedRef.current = value;
    }
  }, [value, isFocused]);

  const toHalfWidthNumber = (raw) =>
    String(raw).replace(/[０-９．－]/g, (ch) =>
      ch === '．' ? '.' : ch === '－' ? '-' : String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    );

  const commitValue = (raw) => {
    const normalized = toHalfWidthNumber(raw);
    const num = Number(normalized);
    if (!Number.isFinite(num) || normalized.trim() === '') {
      setDraft(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(max, num));
    const rounded = step >= 1 ? Math.round(clamped) : Math.round(clamped * 10) / 10;
    lastEmittedRef.current = rounded;
    onChange(rounded);
    setDraft(String(rounded));
  };

  return (
    <span className={`inline-flex items-center gap-0.5 shrink-0 ${className}`}>
      <input
        type="text"
        inputMode={step < 1 || min < 0 ? 'decimal' : 'numeric'}
        aria-label={ariaLabel}
        value={isFocused ? draft : String(value)}
        onFocus={(e) => {
          setIsFocused(true);
          lastEmittedRef.current = value;
          setDraft(String(value));
          e.target.select();
        }}
        onChange={(e) => {
          const val = e.target.value;
          setDraft(val);
          const normalized = toHalfWidthNumber(val);
          if (normalized.trim() !== '' && normalized !== '-' && !normalized.endsWith('.')) {
            const parsed = Number(normalized);
            if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
              lastEmittedRef.current = parsed;
              onChange(parsed);
            }
          }
        }}
        onBlur={() => {
          setIsFocused(false);
          commitValue(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitValue(draft);
            e.currentTarget.blur();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const parsed = Number(toHalfWidthNumber(draft));
            const cur = Number.isFinite(parsed) ? parsed : value;
            const next = cur + (e.key === 'ArrowUp' ? step : -step);
            const clamped = Math.max(
              min,
              Math.min(max, step >= 1 ? Math.round(next) : Math.round(next * 10) / 10)
            );
            onChange(clamped);
            setDraft(String(clamped));
          } else if (e.key === 'Escape') {
            setIsFocused(false);
            setDraft(String(value));
            e.currentTarget.blur();
          }
        }}
        className={`${widthClass} text-right font-bold text-xs ${textColorClass} bg-white border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-400 rounded px-1.5 py-0.5 outline-none`}
      />
      {unit && <span className="text-[11px] font-bold text-slate-500">{unit}</span>}
    </span>
  );
};

const AI_STYLE_CHIPS = [
  '類語提示',
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
    width: 600,
    height: 100,
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
        fontSize: 64,
        fontId: 'anton',
        color: '#171717',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 2,
      },
      {
        id: 't2',
        text: 'AKIRA',
        x: 82,
        y: 38,
        fontSize: 64,
        fontId: 'anton',
        color: '#e62a1a',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 2,
      },
      {
        id: 't3',
        text: 'TOKYO-MACH',
        x: 45,
        y: 83,
        fontSize: 22,
        fontId: 'anton',
        color: '#171717',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        shadow: false,
        isVertical: false,
        letterSpacing: 2,
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
  const [selectedTextIds, setSelectedTextIds] = useState(['t1']);
  const [selectedTextBBoxMap, setSelectedTextBBoxMap] = useState({});
  const dragMultiStartRef = useRef(null);

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
  const [aiUsageToday, setAiUsageToday] = useState(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = JSON.parse(localStorage.getItem(AI_USAGE_STORAGE_KEY) || '{}');
      return saved.date === today && typeof saved.count === 'number' ? saved.count : 0;
    } catch {
      return 0;
    }
  });
  const [aiBaseText, setAiBaseText] = useState('最後まであきらめずに走り抜いて勝つ');
  const [aiStyleRequest, setAiStyleRequest] = useState('熱血・力強く、スタジアムで映える表現');
  const [aiSport, setAiSport] = useState('サッカー');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // AI自由背景デザイン生成用ステート
  const [aiBgPrompt, setAiBgPrompt] = useState('');
  const [aiBgIdeas, setAiBgIdeas] = useState([]);
  const [isAiBgLoading, setIsAiBgLoading] = useState(false);
  const [aiBgError, setAiBgError] = useState(null);

  // フォント検索＆カスタムフォント管理用ステート
  const [fontCatalog, setFontCatalog] = useState(INITIAL_FONT_CATALOG);
  const [customFontFacesCss, setCustomFontFacesCss] = useState([]); // [{ id, familyName, dataUrl, format }]
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [selectedFontCategory, setSelectedFontCategory] = useState('all');
  const [isFontDragging, setIsFontDragging] = useState(false);
  const [customGoogleFontInput, setCustomGoogleFontInput] = useState('');
  const [isLoadingFont, setIsLoadingFont] = useState(false);
  const [isFontGalleryOpen, setIsFontGalleryOpen] = useState(false);
  const [isFontApplyAll, setIsFontApplyAll] = useState(false);
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
  const embeddedFontCacheRef = useRef({ cssByUrl: new Map(), dataUriByUrl: new Map() });

  // 通知メッセージ用
  const [toastMsg, setToastMsg] = useState(null);

  // --- Undo / Redo（ひとつ前に戻る / ひとつ先に進む）履歴管理 ---
  const cloneDesignSnapshot = (snap) => JSON.parse(JSON.stringify(snap));

  const createDesignSnapshot = () => ({
    bannerWidth,
    bannerHeight,
    bgConfig,
    bgImage,
    imageLayers,
    texts,
    showTextsOnBanner,
  });

  const historyRef = useRef(null);
  if (!historyRef.current) {
    const initialSnap = cloneDesignSnapshot({
      bannerWidth: TEMPLATES[0].width,
      bannerHeight: TEMPLATES[0].height,
      bgConfig: TEMPLATES[0].bg,
      bgImage: null,
      imageLayers: [],
      texts: TEMPLATES[0].texts,
      showTextsOnBanner: true,
    });
    historyRef.current = {
      past: [],
      future: [],
      committed: initialSnap,
      committedKey: JSON.stringify(initialSnap),
      isApplying: false,
      applyingKey: null,
      safetyTimer: null,
      timer: null,
    };
  }
  const [historyFlags, setHistoryFlags] = useState({ canUndo: false, canRedo: false });

  const applyDesignSnapshot = (snap) => {
    const h = historyRef.current;
    const cloned = cloneDesignSnapshot(snap);
    const key = JSON.stringify(cloned);
    if (h.safetyTimer) {
      clearTimeout(h.safetyTimer);
      h.safetyTimer = null;
    }
    h.isApplying = true;
    h.applyingKey = key;
    setBannerWidth(cloned.bannerWidth);
    setBannerHeight(cloned.bannerHeight);
    setBgConfig(cloned.bgConfig);
    setBgImage(cloned.bgImage);
    setImageLayers(cloned.imageLayers);
    setTexts(cloned.texts);
    setShowTextsOnBanner(cloned.showTextsOnBanner);
    if (selectedTextId && cloned.texts.length > 0 && !cloned.texts.some((t) => t.id === selectedTextId)) {
      setSelectedTextId(cloned.texts[0].id);
      setSelectedTextIds([cloned.texts[0].id]);
    }
    // useEffect で applyingKey 一致時に即解除するが、万一同値スキップされた場合の保険
    h.safetyTimer = setTimeout(() => {
      h.isApplying = false;
      h.applyingKey = null;
      h.safetyTimer = null;
    }, 200);
  };

  const handleUndo = () => {
    const h = historyRef.current;
    if (h.timer) {
      clearTimeout(h.timer);
      h.timer = null;
    }
    const currentSnap = cloneDesignSnapshot(createDesignSnapshot());
    const currentKey = JSON.stringify(currentSnap);

    if (currentKey !== h.committedKey) {
      h.future.push(currentSnap);
      applyDesignSnapshot(h.committed);
      setHistoryFlags({ canUndo: h.past.length > 0, canRedo: h.future.length > 0 });
      return;
    }

    if (h.past.length === 0) return;
    const prevSnap = h.past.pop();
    h.future.push(cloneDesignSnapshot(h.committed));
    h.committed = cloneDesignSnapshot(prevSnap);
    h.committedKey = JSON.stringify(h.committed);
    applyDesignSnapshot(h.committed);
    setHistoryFlags({ canUndo: h.past.length > 0, canRedo: h.future.length > 0 });
  };

  const handleRedo = () => {
    const h = historyRef.current;
    if (h.timer) {
      clearTimeout(h.timer);
      h.timer = null;
    }
    if (h.future.length === 0) return;
    const nextSnap = h.future.pop();
    h.past.push(cloneDesignSnapshot(h.committed));
    h.committed = cloneDesignSnapshot(nextSnap);
    h.committedKey = JSON.stringify(h.committed);
    applyDesignSnapshot(h.committed);
    setHistoryFlags({ canUndo: h.past.length > 0, canRedo: h.future.length > 0 });
  };

  const handleUndoRef = useRef(handleUndo);
  const handleRedoRef = useRef(handleRedo);
  const isModalBlockingShortcutRef = useRef(false);
  handleUndoRef.current = handleUndo;
  handleRedoRef.current = handleRedo;

  useEffect(() => {
    const h = historyRef.current;
    if (h.timer) {
      clearTimeout(h.timer);
      h.timer = null;
    }

    const currentSnap = cloneDesignSnapshot(createDesignSnapshot());
    const currentKey = JSON.stringify(currentSnap);

    if (h.applyingKey !== null) {
      if (currentKey === h.applyingKey) {
        h.applyingKey = null;
        h.isApplying = false;
        if (h.safetyTimer) {
          clearTimeout(h.safetyTimer);
          h.safetyTimer = null;
        }
        setHistoryFlags({ canUndo: h.past.length > 0, canRedo: h.future.length > 0 });
      }
      return;
    }
    if (h.isApplying) return;
    if (draggingId) return;

    if (currentKey === h.committedKey) {
      setHistoryFlags({ canUndo: h.past.length > 0, canRedo: h.future.length > 0 });
      return;
    }

    setHistoryFlags({ canUndo: true, canRedo: h.future.length > 0 });

    h.timer = setTimeout(() => {
      if (h.isApplying || h.applyingKey !== null) return;
      const latestSnap = cloneDesignSnapshot(createDesignSnapshot());
      const latestKey = JSON.stringify(latestSnap);
      if (latestKey !== h.committedKey) {
        h.past.push(cloneDesignSnapshot(h.committed));
        if (h.past.length > 60) h.past.shift();
        h.committed = latestSnap;
        h.committedKey = latestKey;
        h.future = [];
        setHistoryFlags({ canUndo: h.past.length > 0, canRedo: false });
      }
      h.timer = null;
    }, 180);

    return () => {
      if (h.timer) {
        clearTimeout(h.timer);
        h.timer = null;
      }
    };
  }, [
    bannerWidth,
    bannerHeight,
    bgConfig,
    bgImage,
    imageLayers,
    texts,
    showTextsOnBanner,
    draggingId,
  ]);

  const handleEscapeDeselectRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      const active = document.activeElement;
      const isTextEditing =
        active &&
        (active.tagName === 'TEXTAREA' ||
          (active.tagName === 'INPUT' &&
            !['range', 'checkbox', 'radio', 'color', 'button', 'submit', 'file'].includes(
              active.type
            )));
      const isNativeUndoField =
        active && active.getAttribute && active.getAttribute('data-native-undo') === 'true';

      if (e.key === 'Escape') {
        const handled = handleEscapeDeselectRef.current?.();
        if (handled && isTextEditing && active && typeof active.blur === 'function') {
          active.blur();
        }
        return;
      }

      const isMod = (e.ctrlKey || e.metaKey) && !e.altKey;
      if (!isMod) return;
      if (isNativeUndoField || isModalBlockingShortcutRef.current) return;

      const key = (e.key || '').toLowerCase();
      const isZ = key === 'z' || e.code === 'KeyZ';
      const isY = key === 'y' || e.code === 'KeyY';

      if (isZ && !e.shiftKey) {
        e.preventDefault();
        handleUndoRef.current?.();
      } else if (isY || (isZ && e.shiftKey)) {
        e.preventDefault();
        handleRedoRef.current?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // 選択中文字（複数対応）のSVG実測バウンディングボックスを計測（アクティブ枠を文字ぴったりに表示するため）
  useEffect(() => {
    if (activeLayerType !== 'text' || !showTextsOnBanner || viewMode === 'scale') {
      return;
    }
    const validSet = new Set(texts.map((t) => t.id));
    const filteredIds = selectedTextIds.filter((id) => validSet.has(id));
    const targetIds =
      filteredIds.length > 0
        ? filteredIds
        : selectedTextId && validSet.has(selectedTextId)
          ? [selectedTextId]
          : [];
    if (targetIds.length === 0) return;

    let cancelled = false;
    const measureSelectedTexts = () => {
      if (cancelled) return;
      const svgEl = svgEditRef.current;
      if (!svgEl) return;
      const measuredEntries = {};
      targetIds.forEach((tid) => {
        const glyphEl = svgEl.querySelector(`[data-text-glyph="${tid}"]`);
        if (!glyphEl || typeof glyphEl.getBBox !== 'function') return;
        try {
          const bb = glyphEl.getBBox();
          if (
            Number.isFinite(bb.width) &&
            bb.width > 0 &&
            Number.isFinite(bb.height) &&
            bb.height > 0
          ) {
            measuredEntries[tid] = {
              x: bb.x,
              y: bb.y,
              width: bb.width,
              height: bb.height,
            };
          }
        } catch {
          // ignore getBBox error when element is hidden
        }
      });

      if (Object.keys(measuredEntries).length === 0) return;
      setSelectedTextBBoxMap((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const [tid, box] of Object.entries(measuredEntries)) {
          const p = prev[tid];
          if (
            !p ||
            Math.abs(p.x - box.x) >= 0.2 ||
            Math.abs(p.y - box.y) >= 0.2 ||
            Math.abs(p.width - box.width) >= 0.2 ||
            Math.abs(p.height - box.height) >= 0.2
          ) {
            next[tid] = box;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const rafId = requestAnimationFrame(measureSelectedTexts);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(measureSelectedTexts);
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [
    activeLayerType,
    selectedTextId,
    selectedTextIds,
    texts,
    fontCatalog,
    bannerWidth,
    bannerHeight,
    showTextsOnBanner,
    viewMode,
  ]);

  // 利用説明動画モーダル用ステート
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialVideoRef = useRef(null);
  const TUTORIAL_CHAPTERS = [
    { step: 'STEP 1', title: 'サイト概要', timeLabel: '0:00', startSec: 0 },
    { step: 'STEP 2', title: '文字・フォント・サイズ', timeLabel: '0:17', startSec: 17.8 },
    { step: 'STEP 3', title: '配置・整列・選択解除', timeLabel: '0:35', startSec: 35.1 },
    { step: 'STEP 4', title: '背景色分け・AI提案', timeLabel: '0:54', startSec: 54.0 },
    { step: 'STEP 5', title: 'サイズ比較＆戻る/進む', timeLabel: '1:11', startSec: 71.5 },
    { step: 'STEP 6', title: 'お気に入り・4形式保存', timeLabel: '1:30', startSec: 90.0 },
    { step: 'STEP 7', title: 'スマホ・LINE共有', timeLabel: '1:51', startSec: 111.2 },
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // お気に入りデザイン保存・比較用ステート
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoriteCols, setFavoriteCols] = useState(2); // 1 | 2 | 3
  const [favoriteCompareOnly, setFavoriteCompareOnly] = useState(false);
  const [favoriteScaleCompare, setFavoriteScaleCompare] = useState(false);
  const [selectedFavoriteIds, setSelectedFavoriteIds] = useState([]);
  const [editingFavoriteId, setEditingFavoriteId] = useState(null);
  const [editingFavoriteTitle, setEditingFavoriteTitle] = useState('');

  // スマホ・LINE等向け デザイン共有モーダル用ステート
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // ダウンロード保存形式 ('png' | 'jpg' | 'pdf' | 'ppt')
  const [exportFormat, setExportFormat] = useState('png');

  // 共有リンク (#design=...) からの初期デザイン復元
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const decoded = decodeDesignFromShareHash(window.location.hash);
    if (!decoded) return;
    if (Number.isFinite(Number(decoded.w))) setBannerWidth(Number(decoded.w));
    if (Number.isFinite(Number(decoded.h))) setBannerHeight(Number(decoded.h));
    if (decoded.bg && typeof decoded.bg === 'object') setBgConfig(decoded.bg);
    if (typeof decoded.sh === 'boolean') setShowTextsOnBanner(decoded.sh);
    if (Number.isFinite(Number(decoded.ph))) setPersonHeight(Number(decoded.ph));
    if (Number.isFinite(Number(decoded.pc))) setPersonCount(Number(decoded.pc));
    if (typeof decoded.hs === 'string') setHoldStyle(decoded.hs);
    if (Array.isArray(decoded.texts) && decoded.texts.length > 0) {
      setTexts(decoded.texts);
      setSelectedTextId(decoded.texts[0].id);
      setSelectedTextIds([decoded.texts[0].id]);
    }
    setToastMsg('共有されたデザインを読み込みました！');
    const t = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(t);
  }, []);

  const persistFavorites = (nextList) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextList));
      setFavorites(nextList);
      return true;
    } catch (err) {
      console.error(err);
      showToast('保存容量の上限に達しました。不要なお気に入りを削除するか画像サイズを小さくしてください');
      return false;
    }
  };

  const handleSaveFavorite = () => {
    const mainText =
      (texts.find((t) => t.text?.trim())?.text || '無題デザイン')
        .replace(/\n/g, ' ')
        .slice(0, 18);
    const baseTitle = `${mainText} (${bannerWidth}×${bannerHeight}cm)`;
    const sameCount = favorites.filter((f) => f.title.startsWith(baseTitle)).length;
    const title = sameCount > 0 ? `${baseTitle} #${sameCount + 1}` : baseTitle;

    const newFav = {
      id: 'fav_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title,
      createdAt: new Date().toISOString(),
      width: bannerWidth,
      height: bannerHeight,
      bg: { ...bgConfig },
      bgImage: bgImage ? { ...bgImage } : null,
      imageLayers: imageLayers.map((img) => ({ ...img })),
      showTextsOnBanner,
      texts: texts.map((t) => ({ ...t })),
    };

    if (persistFavorites([newFav, ...favorites])) {
      showToast(`お気に入り「${title}」に保存しました`);
    }
  };

  const handleDeleteFavorite = (favId) => {
    const target = favorites.find((f) => f.id === favId);
    const nextList = favorites.filter((f) => f.id !== favId);
    if (persistFavorites(nextList)) {
      setSelectedFavoriteIds((prev) => prev.filter((id) => id !== favId));
      if (target) showToast(`「${target.title}」を削除しました`);
    }
  };

  const handleStartRenameFavorite = (fav) => {
    setEditingFavoriteId(fav.id);
    setEditingFavoriteTitle(fav.title);
  };

  const handleCommitRenameFavorite = (favId) => {
    const trimmed = editingFavoriteTitle.trim();
    if (!trimmed) {
      setEditingFavoriteId(null);
      return;
    }
    const nextList = favorites.map((f) => (f.id === favId ? { ...f, title: trimmed } : f));
    if (persistFavorites(nextList)) {
      setEditingFavoriteId(null);
      showToast('お気に入り名を変更しました');
    }
  };

  const toggleFavoriteCompareCheck = (favId) => {
    setSelectedFavoriteIds((prev) =>
      prev.includes(favId) ? prev.filter((id) => id !== favId) : [...prev, favId]
    );
  };

  const handleLoadFavorite = (fav) => {
    setBannerWidth(fav.width);
    setBannerHeight(fav.height);
    setBgConfig({ ...fav.bg });
    setBgImage(fav.bgImage ? { ...fav.bgImage } : null);
    setImageLayers((fav.imageLayers || []).map((img) => ({ ...img })));
    setShowTextsOnBanner(fav.showTextsOnBanner ?? true);
    const restoredTexts = (fav.texts || []).map((t) => ({ ...t }));
    setTexts(restoredTexts);
    const nextId = restoredTexts[0]?.id || null;
    setSelectedTextId(nextId);
    setSelectedTextIds(nextId ? [nextId] : []);
    setIsFavoritesOpen(false);
    showToast(`お気に入り「${fav.title}」を編集キャンバスに読み込みました`);
  };

  // --- Gemini 共通API呼び出しヘルパー ---
  const incrementAiUsageCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    setAiUsageToday((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(AI_USAGE_STORAGE_KEY, JSON.stringify({ date: today, count: next }));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  /**
   * Gemini API へリクエストを送信し、JSON レスポンスをパースして返す共通ヘルパー。
   * モデル未対応時はフォールバックし、一時エラー (429/5xx) のみリトライする。
   */
  const callGeminiApi = async (payload) => {
    const activeKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
    if (!activeKey) {
      throw new Error(
        '現在 AI 機能を利用するための API キー（VITE_GEMINI_API_KEY / GitHub Secrets）が未設定です。'
      );
    }

    let lastErr = null;
    for (const model of GEMINI_MODELS) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const delays = [1000, 2000];

      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': activeKey,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            let apiErrMsg = `HTTP ${response.status}`;
            try {
              const errBody = await response.json();
              if (errBody?.error?.message) {
                apiErrMsg = errBody.error.message;
              }
            } catch {
              // ignore non-JSON error body
            }

            if (response.status === 400 || response.status === 401 || response.status === 403) {
              if (/API key|key not valid|permission|expired|API_KEY/i.test(apiErrMsg)) {
                throw new Error(
                  `AI API キーの認証エラーが発生しました（${apiErrMsg}）。`
                );
              }
              lastErr = new Error(`${model}: ${apiErrMsg}`);
              break;
            }

            if (response.status === 404) {
              lastErr = new Error(`${model}: ${apiErrMsg}`);
              break;
            }

            if ((response.status === 429 || response.status >= 500) && attempt < delays.length) {
              await new Promise((r) => setTimeout(r, delays[attempt]));
              continue;
            }

            throw new Error(`APIエラー (${response.status}): ${apiErrMsg}`);
          }

          incrementAiUsageCount();
          const result = await response.json();
          const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!jsonText) {
            throw new Error('AIからの応答データが空でした。');
          }
          return JSON.parse(jsonText);
        } catch (err) {
          lastErr = err;
          if (err.message?.includes('API キー')) {
            throw err;
          }
          if (attempt < delays.length && err.name === 'TypeError') {
            await new Promise((r) => setTimeout(r, delays[attempt]));
            continue;
          }
          break;
        }
      }
    }

    throw lastErr || new Error('AI APIの呼び出しに失敗しました。');
  };

  // 現在選択中のテキストオブジェクト（未選択時は null）
  const selectedText = selectedTextId
    ? texts.find((t) => t.id === selectedTextId) || null
    : null;
  const effectiveSelectedTextIds = (() => {
    const validSet = new Set(texts.map((t) => t.id));
    const filtered = selectedTextIds.filter((id) => validSet.has(id));
    if (filtered.length > 0) return filtered;
    return selectedText ? [selectedText.id] : [];
  })();

  const clearTextSelection = useCallback(() => {
    setSelectedTextId(null);
    setSelectedTextIds([]);
  }, []);

  isModalBlockingShortcutRef.current = Boolean(
    isShareOpen || isFavoritesOpen || isTutorialOpen || ocrResult || editingFavoriteId
  );

  handleEscapeDeselectRef.current = () => {
    if (isTutorialOpen) {
      setIsTutorialOpen(false);
      return false;
    }
    if (
      isFontGalleryOpen ||
      isShareOpen ||
      isFavoritesOpen ||
      ocrResult ||
      editingFavoriteId
    ) {
      return false;
    }
    clearTextSelection();
    return true;
  };

  const selectSingleText = (id) => {
    setSelectedTextId(id);
    setSelectedTextIds(id ? [id] : []);
    setActiveLayerType('text');
  };

  const toggleMultiSelectText = (id) => {
    setActiveLayerType('text');
    const cur = effectiveSelectedTextIds;
    if (cur.includes(id)) {
      if (cur.length <= 1) {
        clearTextSelection();
        return;
      }
      const next = cur.filter((x) => x !== id);
      setSelectedTextIds(next);
      if (selectedTextId === id) {
        setSelectedTextId(next[0]);
      }
    } else {
      setSelectedTextIds([...cur, id]);
      setSelectedTextId(id);
    }
  };

  const selectAllTexts = () => {
    if (texts.length === 0) return;
    setActiveLayerType('text');
    setSelectedTextIds(texts.map((t) => t.id));
    if (!selectedText || !texts.some((t) => t.id === selectedText.id)) {
      setSelectedTextId(texts[0].id);
    }
  };

  const clearMultiSelectTexts = () => {
    const fallbackId = selectedText?.id || texts[0]?.id || null;
    setSelectedTextIds(fallbackId ? [fallbackId] : []);
    setSelectedTextId(fallbackId);
  };

  const alignSelectedTexts = (patch) => {
    const targets = effectiveSelectedTextIds;
    if (targets.length === 0) return;
    setTexts((prev) => prev.map((t) => (targets.includes(t.id) ? { ...t, ...patch } : t)));
  };

  const nudgeSelectedTexts = (dx, dy) => {
    const targets = effectiveSelectedTextIds;
    if (targets.length === 0) return;
    setTexts((prev) =>
      prev.map((t) =>
        targets.includes(t.id)
          ? {
              ...t,
              x: Math.max(0, Math.min(100, Math.round((t.x + dx) * 10) / 10)),
              y: Math.max(0, Math.min(100, Math.round((t.y + dy) * 10) / 10)),
            }
          : t
      )
    );
  };
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
    setActiveTab('template');

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

      const parsedData = await callGeminiApi(payload);

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
      setOcrError(err.message || '画像のOCR文字解析に失敗しました。別の画像でお試しください。');
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
      const nextId = reconstructedTexts[0]?.id || null;
      setSelectedTextId(nextId);
      setSelectedTextIds(nextId ? [nextId] : []);
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
      const nextWidth = Math.max(60, Math.min(1000, Math.round(bannerHeight * ratio)));
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

  // カテゴリごとのフォント件数
  const getCategoryCount = (catId) =>
    catId === 'all'
      ? fontCatalog.length
      : fontCatalog.filter((f) => f.category === catId).length;

  // 共通フォント検索・カテゴリバーUI（サイドバー・一覧モーダル共有）
  const renderFontFilterBar = (compact = false) => (
    <div className="space-y-2">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          data-native-undo="true"
          value={fontSearchQuery}
          onChange={(e) => setFontSearchQuery(e.target.value)}
          placeholder="フォント名や特徴で検索（例: 筆, 明朝, 極太, 丸, ステンシル, Anton...）"
          className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
        />
        {fontSearchQuery && (
          <button
            type="button"
            onClick={() => setFontSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {FONT_CATEGORIES.map((cat) => {
          const active = selectedFontCategory === cat.id;
          const count = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFontCategory(cat.id)}
              className={`px-2 py-1 rounded-md font-bold whitespace-nowrap transition ${
                compact ? 'text-[10.5px]' : 'text-xs'
              } ${
                active
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );

  // 共通フォントカード1枚の描画（サイドバー・一覧モーダル共有）
  const renderFontItemCard = (f, isModal = false) => {
    const isCurrent = selectedText?.fontId === f.id;
    const previewSample =
      selectedText?.text.replace(/\n/g, ' ').slice(0, isModal ? 18 : 16) ||
      '必勝・心を一つに！';
    const needsEnglishSample =
      (f.category === 'english' || f.isEnglishOnly) && !/[A-Za-z0-9]/.test(previewSample);

    return (
      <div
        key={f.id}
        onClick={() => {
          if (isFontApplyAll && texts.length > 1) {
            applyFontToTexts(f.id);
          } else {
            updateSelectedText({ fontId: f.id });
            if (isModal) {
              showToast(`フォントを「${f.name}」に変更しました`);
            }
          }
          if (isModal) {
            setIsFontGalleryOpen(false);
          }
        }}
        className={`group flex items-center justify-between rounded-lg border cursor-pointer transition ${
          isModal ? 'px-2.5 py-1.5 flex-col items-stretch gap-0.5' : 'px-2.5 py-1.5'
        } ${
          isCurrent
            ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500 shadow-sm'
            : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-slate-50'
        }`}
      >
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span
                className={`font-bold truncate ${
                  isModal
                    ? 'text-[10.5px] leading-tight text-slate-600'
                    : 'text-[11px] text-slate-700'
                }`}
              >
                {f.name}
              </span>
              {f.isCustom && (
                <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1 rounded font-bold shrink-0">
                  追加
                </span>
              )}
              {f.isDynamicGoogle && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold shrink-0">
                  Google
                </span>
              )}
            </div>

            {isModal && isCurrent && (
              <span className="text-[9px] bg-sky-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
                適用中
              </span>
            )}
          </div>

          <div
            className={`text-slate-900 truncate ${
              isModal ? 'text-[17px] leading-snug mt-0.5' : 'text-base mt-0.5'
            }`}
            style={{
              fontFamily: f.family,
              fontWeight: f.weight,
            }}
          >
            {previewSample}
          </div>
          {needsEnglishSample && (
            <div
              className={`text-slate-500 truncate ${isModal ? 'text-[10px] leading-tight' : 'text-xs'}`}
              style={{ fontFamily: f.family, fontWeight: f.weight }}
            >
              {f.englishSample || 'VICTORY 2026'}
            </div>
          )}
        </div>

        {!isModal && (
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
        )}
      </div>
    );
  };

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

  const renderExpandToggleButton = (targetMode) =>
    viewMode === 'split' ? (
      <button
        type="button"
        onClick={() => setViewMode(targetMode)}
        className="text-xs text-sky-600 hover:underline font-bold flex items-center gap-1 ml-1"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        拡大表示
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setViewMode('split')}
        className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 ml-1 transition"
        title="元の2画面表示に戻す"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        戻す
      </button>
    );

  // --- テキスト操作関数 ---
  const updateSelectedText = (updates) => {
    if (!selectedText) return;
    setTexts((prev) =>
      prev.map((item) => (item.id === selectedText.id ? { ...item, ...updates } : item))
    );
  };

  const getFontDisplayName = (fontId) =>
    fontCatalog.find((f) => f.id === fontId)?.name || '標準ゴシック';

  const applyFontToTexts = (fontId, targetIds = null) => {
    if (!fontId) return;
    const fontName = getFontDisplayName(fontId);
    if (targetIds === null) {
      setTexts((prev) => prev.map((item) => ({ ...item, fontId })));
      showToast(`すべての文字（${texts.length}件）に「${fontName}」を適用しました`);
      return;
    }
    const idSet = new Set(Array.isArray(targetIds) ? targetIds : [targetIds]);
    const targetItems = texts.filter((item) => idSet.has(item.id));
    if (targetItems.length === 0) return;
    setTexts((prev) =>
      prev.map((item) => (idSet.has(item.id) ? { ...item, fontId } : item))
    );
    if (targetItems.length === 1) {
      const label = targetItems[0].text.replace(/\n/g, ' ').slice(0, 14) || '文字';
      showToast(`「${label}」に「${fontName}」を適用しました`);
    } else {
      showToast(`${targetItems.length}件の文字に「${fontName}」を適用しました`);
    }
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
    setSelectedTextIds([newId]);
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
    setSelectedTextIds([newId]);
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
    const nextId = remaining[remaining.length - 1]?.id || null;
    setSelectedTextId(nextId);
    setSelectedTextIds(nextId ? [nextId] : []);
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

    const systemPrompt = `あなたはスポーツ応援やイベントの横断幕（バナー）専門のプロコピーライターです。
ユーザーの「伝えたい元の言葉・思い」「希望する表現テイスト」「競技・用途」をもとに、横断幕に大きく掲げた際に心に響き、視覚的にも映えるスローガン・書き換え案を5つ提案してください。
各案には以下を含めてください：
- mainText: 横断幕のメインとなる文言（短いスローガン、四字熟語、力強いフレーズなど）
- subText: メイン文言に添えると映えるサブコピー（不要な場合でもおすすめの補足フレーズを提案）
- description: 読み方や言葉の意味、なぜこの表現が横断幕におすすめかの短い解説
- recommendedFont: この文言に合うフォントタイプ（'brush'=毛筆・筆文字, 'sans'=角ゴシック, 'serif'=明朝体, 'pop'=極太ポップ, 'round'=丸ゴシック のいずれか）`;

    const isSynonymMode = (aiStyleRequest || '').includes('類語');
    const userPrompt = `【伝えたい元の言葉・思い】: ${aiBaseText || '（おまかせ）'}
【希望する表現・テイスト】: ${aiStyleRequest || '横断幕らしく迫力のある表現'}
【競技・用途】: ${aiSport || '指定なし'}

${
  isSynonymMode
    ? '※「類語提示」が指定されています。入力された元の言葉の意味や意図を保ったまま、ニュアンスや語感・表記（和語・熟語・四字熟語・英単語/カタカナ等）を変えた的確な類語・言い換え候補を5つ提案し、解説欄(description)には元の言葉とのニュアンスの違いを簡潔に記載してください。'
    : '上記の条件にぴったりの横断幕スローガン・書き換え案を5つ作成してください。'
}`;

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

    try {
      const parsed = await callGeminiApi(payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAiSuggestions(parsed);
        showToast('AIが5つのスローガン案を作成しました！');
      } else {
        throw new Error('提案データの形式が正しくありません。');
      }
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'AI提案の取得中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- Gemini APIによる自由背景SVGデザイン生成処理 ---
  const applyAiBgIdea = (idea) => {
    if (!idea?.svgInner) return;
    setBgConfig((prev) => ({
      ...prev,
      type: 'ai',
      aiDesign: {
        title: idea.title || 'AIカスタム背景',
        styleTag: idea.styleTag || '',
        description: idea.description || '',
        prompt: idea.prompt || aiBgPrompt,
        svgInner: idea.svgInner,
        viewBoxW: idea.viewBoxW || 1200,
        viewBoxH: idea.viewBoxH || 300,
        opacity: prev.type === 'ai' ? (prev.aiDesign?.opacity ?? 100) : 100,
      },
    }));
    showToast(`AI背景「${idea.title || 'カスタムデザイン'}」を適用しました`);
  };

  const generateAiBackgrounds = async () => {
    const trimmed = aiBgPrompt.trim();
    if (!trimmed) {
      setAiBgError('どんな背景にしたいかのイメージを入力してください。');
      return;
    }

    setIsAiBgLoading(true);
    setAiBgError(null);

    const vbW = 1200;
    const vbH = Math.max(
      180,
      Math.min(2400, Math.round(1200 * (bannerHeight / Math.max(1, bannerWidth))))
    );
    const curColors = getBgColorsFromConfig(bgConfig);

    const systemPrompt = `あなたはプロフェッショナルなスポーツ横断幕・グラフィックデザイナー兼 SVG ベクターアーティストです。
ユーザーのリクエストに応じて、既成ボタン（単色・単純な2色分け・しましま等）にはない自由で迫力・品格のある横断幕用背景デザインを3パターン作成してください。

【SVG生成の厳格ルール】
1. キャンバス座標系は width=${vbW}, height=${vbH}（viewBox="0 0 ${vbW} ${vbH}" 相当）です。
2. 各案の "svgInner" には <svg ...> 外枠タグを含めず、SVG内部の要素のみ（例: <defs>...</defs><rect .../><path .../> 等）を有効な XML 構文で出力してください。すべての自己終了タグは必ず /> で閉じてください。
3. 先頭に必ず全面を覆うベース塗りつぶし（<rect x="0" y="0" width="${vbW}" height="${vbH}" ... />）を置き、透明な隙間が出ないようにしてください。
4. <linearGradient>, <radialGradient>, <pattern>, <filter>, <feGaussianBlur>, <path>, <polygon>, <circle>, <ellipse>, <rect>, <polyline>, <g> などの純粋なベクター要素を駆使して高品質に表現してください。
5. <text>, <script>, <foreignObject>, <image>, 外部URL, イベント属性(onclick等)は絶対に含めないでください。
6. 中央付近にはあとから横断幕の文字が配置されるため、装飾のメリハリをつけつつ全体の視認性・バランスを意識してください。
7. 3案はそれぞれ「王道・ダイナミック」「スタイリッシュ・洗練」「和風・アート風などのアレンジ」のように変化をつけてください。`;

    const userPrompt = `【作りたい背景のイメージ・要望】: ${trimmed}
【横断幕の縦横比（SVG座標サイズ）】: 横 ${vbW} × 縦 ${vbH}（実寸 横${bannerWidth}cm × 縦${bannerHeight}cm）
【参考（現在の選択色）】: ${curColors.join(', ')}${
      bgConfig.type === 'ai' && bgConfig.aiDesign?.title
        ? `\n【現在適用中のAI背景タイトル】: ${bgConfig.aiDesign.title}（さらなる調整・別案の参考にしてください）`
        : ''
    }`;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              styleTag: { type: 'STRING' },
              description: { type: 'STRING' },
              svgInner: { type: 'STRING' },
            },
            required: ['title', 'styleTag', 'description', 'svgInner'],
            propertyOrdering: ['title', 'styleTag', 'description', 'svgInner'],
          },
        },
      },
    };

    try {
      const parsed = await callGeminiApi(payload);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('AIからの背景提案が空でした。');
      }
      const validIdeas = parsed
        .map((item) => {
          const clean = sanitizeAiBgSvgInner(item?.svgInner || '', 'tpl');
          if (!clean) return null;
          return {
            title: item.title || 'AIデザイン案',
            styleTag: item.styleTag || 'カスタム',
            description: item.description || '',
            prompt: trimmed,
            svgInner: clean,
            viewBoxW: vbW,
            viewBoxH: vbH,
          };
        })
        .filter(Boolean);

      if (validIdeas.length === 0) {
        throw new Error('生成されたSVGデータを安全に読み込めませんでした。表現を変えてお試しください。');
      }
      setAiBgIdeas(validIdeas);
      applyAiBgIdea(validIdeas[0]);
    } catch (err) {
      console.error(err);
      setAiBgError(err.message || 'AI背景の生成中にエラーが発生しました。');
    } finally {
      setIsAiBgLoading(false);
    }
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
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      toggleMultiSelectText(item.id);
      return;
    }
    const isAlreadyInMulti =
      activeLayerType === 'text' &&
      effectiveSelectedTextIds.length > 1 &&
      effectiveSelectedTextIds.includes(item.id);
    setSelectedTextId(item.id);
    setActiveLayerType('text');
    if (!isAlreadyInMulti) {
      setSelectedTextIds([item.id]);
    }
    if (!svgEditRef.current) return;
    const coords = getSvgCoordinates(e, svgEditRef.current);
    const dragTargets = isAlreadyInMulti ? effectiveSelectedTextIds : [item.id];
    const itemsMap = {};
    texts.forEach((t) => {
      if (dragTargets.includes(t.id)) {
        itemsMap[t.id] = { x: t.x, y: t.y };
      }
    });
    dragMultiStartRef.current = {
      pointerStart: coords,
      items: itemsMap,
      moved: false,
      pendingSingleId: isAlreadyInMulti ? item.id : null,
    };
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
      if (draggingType === 'image') {
        const nextX = Math.max(0, Math.min(100, Math.round((coords.x + dragOffset.current.dx) * 10) / 10));
        const nextY = Math.max(0, Math.min(100, Math.round((coords.y + dragOffset.current.dy) * 10) / 10));
        setImageLayers((prev) =>
          prev.map((img) => (img.id === draggingId ? { ...img, x: nextX, y: nextY } : img))
        );
      } else if (dragMultiStartRef.current) {
        const dx = coords.x - dragMultiStartRef.current.pointerStart.x;
        const dy = coords.y - dragMultiStartRef.current.pointerStart.y;
        if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) {
          dragMultiStartRef.current.moved = true;
        }
        const itemsMap = dragMultiStartRef.current.items;
        setTexts((prev) =>
          prev.map((t) => {
            const st = itemsMap[t.id];
            if (!st) return t;
            return {
              ...t,
              x: Math.max(0, Math.min(100, Math.round((st.x + dx) * 10) / 10)),
              y: Math.max(0, Math.min(100, Math.round((st.y + dy) * 10) / 10)),
            };
          })
        );
      }
    },
    [draggingId, draggingType]
  );

  const handlePointerUp = useCallback(() => {
    if (
      dragMultiStartRef.current &&
      !dragMultiStartRef.current.moved &&
      dragMultiStartRef.current.pendingSingleId
    ) {
      const singleId = dragMultiStartRef.current.pendingSingleId;
      setSelectedTextId(singleId);
      setSelectedTextIds([singleId]);
    }
    dragMultiStartRef.current = null;
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
    const nextId = newTexts[0]?.id || null;
    setSelectedTextId(nextId);
    setSelectedTextIds(nextId ? [nextId] : []);
    showToast(`テンプレート「${tpl.name}」を適用しました`);
  };

  // --- PNG書き出し用 Webフォント埋め込みヘルパー ---
  const isCodePointInUnicodeRange = (codePoint, rangeText) => {
    if (!rangeText) return true;
    const parts = rangeText.split(',');
    for (const rawPart of parts) {
      const part = rawPart.trim().toUpperCase();
      if (!part.startsWith('U+')) continue;
      const body = part.slice(2);
      if (body.includes('-')) {
        const [startHex, endHex] = body.split('-');
        const start = parseInt(startHex, 16);
        const end = parseInt(endHex, 16);
        if (!Number.isNaN(start) && !Number.isNaN(end) && codePoint >= start && codePoint <= end) {
          return true;
        }
      } else if (body.includes('?')) {
        const start = parseInt(body.replace(/\?/g, '0'), 16);
        const end = parseInt(body.replace(/\?/g, 'F'), 16);
        if (!Number.isNaN(start) && !Number.isNaN(end) && codePoint >= start && codePoint <= end) {
          return true;
        }
      } else {
        const single = parseInt(body, 16);
        if (!Number.isNaN(single) && codePoint === single) {
          return true;
        }
      }
    }
    return false;
  };

  const fetchUrlAsDataUri = async (url, cacheMap) => {
    if (cacheMap.has(url)) return cacheMap.get(url);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Font fetch failed: ${resp.status}`);
    const blob = await resp.blob();
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    cacheMap.set(url, dataUri);
    return dataUri;
  };

  const collectGoogleFontRequestsFromSvg = (svgClone) => {
    const customFamilies = new Set(customFontFacesCss.map((cf) => cf.familyName));
    const genericFamilies = new Set([
      '',
      'sans-serif',
      'serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
    ]);
    const requestMap = new Map(); // googleFamily -> Set<number>

    svgClone.querySelectorAll('text').forEach((textEl) => {
      const rawFamily = textEl.getAttribute('font-family') || textEl.style?.fontFamily || '';
      const primaryFamily = rawFamily.split(',')[0].replace(/['"]/g, '').trim();
      if (genericFamilies.has(primaryFamily.toLowerCase()) || customFamilies.has(primaryFamily)) {
        return;
      }

      const weightAttr = String(
        textEl.getAttribute('font-weight') || textEl.style?.fontWeight || ''
      ).trim();

      const matchingCatalogItems = fontCatalog.filter((f) => {
        const fPrimary = (f.family || '').split(',')[0].replace(/['"]/g, '').trim();
        return fPrimary === primaryFamily && Boolean(f.googleFamily);
      });
      if (matchingCatalogItems.length === 0) return;

      const exactWeightMatch = matchingCatalogItems.find(
        (f) => String(f.weight || '400') === weightAttr
      );
      const targets = exactWeightMatch ? [exactWeightMatch] : matchingCatalogItems;

      const content = textEl.textContent || '';
      const codePoints = new Set([0x20]);
      for (const ch of Array.from(content)) {
        const cp = ch.codePointAt(0);
        if (cp !== undefined) codePoints.add(cp);
      }

      targets.forEach((f) => {
        if (!requestMap.has(f.googleFamily)) {
          requestMap.set(f.googleFamily, new Set());
        }
        const cpSet = requestMap.get(f.googleFamily);
        codePoints.forEach((cp) => cpSet.add(cp));
      });
    });

    return requestMap;
  };

  const buildEmbeddedFontStyleCss = async (svgClone) => {
    const requestMap = collectGoogleFontRequestsFromSvg(svgClone);
    if (requestMap.size === 0) return '';

    const { cssByUrl, dataUriByUrl } = embeddedFontCacheRef.current;
    const embeddedBlocks = [];

    for (const [googleFamily, codePoints] of requestMap.entries()) {
      try {
        const cssUrl = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`;
        let cssText = cssByUrl.get(cssUrl);
        if (!cssText) {
          const resp = await fetch(cssUrl);
          if (!resp.ok) continue;
          cssText = await resp.text();
          cssByUrl.set(cssUrl, cssText);
        }

        const faceMatches = Array.from(cssText.matchAll(/@font-face\s*\{([^}]*)\}/g));
        const activeBlocks = faceMatches
          .map((m) => m[0])
          .filter((block) => {
            const rangeMatch = block.match(/unicode-range:\s*([^;]+);/i);
            if (!rangeMatch) return true;
            const rangeText = rangeMatch[1];
            for (const cp of codePoints) {
              if (isCodePointInUnicodeRange(cp, rangeText)) return true;
            }
            return false;
          });

        const convertedBlocks = await Promise.all(
          activeBlocks.map(async (block) => {
            const urlMatch = block.match(/url\((['"]?)(https:\/\/[^'")]+)\1\)/);
            if (!urlMatch) return block;
            try {
              const dataUri = await fetchUrlAsDataUri(urlMatch[2], dataUriByUrl);
              return block.replace(urlMatch[0], `url("${dataUri}")`);
            } catch {
              return block;
            }
          })
        );

        embeddedBlocks.push(...convertedBlocks);
      } catch (err) {
        console.warn('Google Font embed skipped:', googleFamily, err);
      }
    }

    return embeddedBlocks.join('\n');
  };

  const buildBannerDownloadFilename = (textItems, suffix = '', format = 'png') => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;

    const joinedText = (textItems || [])
      .map((t) => (t?.text || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ')
      .replace(/[\\/:*?"<>|]/g, '_')
      .trim();

    const safeBody = (joinedText || 'banner').slice(0, 100).trim();
    const extMap = { png: 'png', jpg: 'jpg', pdf: 'pdf', ppt: 'pptx' };
    const ext = extMap[format] || 'png';
    return `${datePrefix}_${safeBody}${suffix}.${ext}`;
  };

  // --- SVG → ラスター画像 Blob 生成共通ヘルパー (PNG / JPG) ---
  const svgToRasterResult = async (
    svgElement,
    exportWidthPx = 1600,
    mimeType = 'image/png',
    quality = 0.92
  ) => {
    if (!svgElement) return null;
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const clone = svgElement.cloneNode(true);
    const guides = clone.querySelectorAll('.editor-only-guide');
    guides.forEach((g) => g.remove());

    const viewBox = clone.getAttribute('viewBox').split(' ').map(Number);
    const vbWidth = viewBox[2];
    const vbHeight = viewBox[3];
    const exportHeightPx = Math.round((exportWidthPx * vbHeight) / vbWidth);

    clone.setAttribute('width', exportWidthPx);
    clone.setAttribute('height', exportHeightPx);

    const embeddedFontCss = await buildEmbeddedFontStyleCss(clone);
    if (embeddedFontCss) {
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.setAttribute('type', 'text/css');
      styleEl.textContent = embeddedFontCss;
      clone.insertBefore(styleEl, clone.firstChild);
    }

    const svgData = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
          try {
            if (img.decode) {
              await img.decode().catch(() => {});
            }
            const canvas = document.createElement('canvas');
            canvas.width = exportWidthPx;
            canvas.height = exportHeightPx;
            const ctx = canvas.getContext('2d');
            if (mimeType === 'image/jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, exportWidthPx, exportHeightPx);
            }
            ctx.drawImage(img, 0, 0, exportWidthPx, exportHeightPx);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({ blob, width: exportWidthPx, height: exportHeightPx });
                } else {
                  reject(new Error('画像 Blob の生成に失敗しました'));
                }
              },
              mimeType,
              quality
            );
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('SVG画像の読み込みに失敗しました'));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const svgToPngBlob = async (svgElement, exportWidthPx = 1600) => {
    const res = await svgToRasterResult(svgElement, exportWidthPx, 'image/png');
    return res?.blob || null;
  };

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      reader.readAsDataURL(blob);
    });

  const triggerBlobDownload = (blob, filename) => {
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  };

  // --- マルチフォーマットダウンロード処理 (PNG / JPG / PDF / PPT) ---
  const downloadSvgAsFormat = async (
    svgElement,
    filename,
    exportWidthPx = 1600,
    format = 'png'
  ) => {
    if (!svgElement) return;
    try {
      if (format === 'jpg') {
        const res = await svgToRasterResult(svgElement, exportWidthPx, 'image/jpeg', 0.92);
        if (!res?.blob) throw new Error('JPG生成エラー');
        triggerBlobDownload(res.blob, filename);
        showToast(`${filename} を保存しました`);
        return;
      }

      if (format === 'pdf') {
        const res = await svgToRasterResult(svgElement, exportWidthPx, 'image/png');
        if (!res?.blob) throw new Error('PDF用画像生成エラー');
        const dataUrl = await blobToDataUrl(res.blob);
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const ratio = res.width / res.height;
        let drawW = maxW;
        let drawH = drawW / ratio;
        if (drawH > maxH) {
          drawH = maxH;
          drawW = drawH * ratio;
        }
        const offsetX = (pageW - drawW) / 2;
        const offsetY = (pageH - drawH) / 2;
        pdf.addImage(dataUrl, 'PNG', offsetX, offsetY, drawW, drawH, undefined, 'FAST');
        const pdfBlob = pdf.output('blob');
        triggerBlobDownload(pdfBlob, filename);
        showToast(`${filename} を保存しました`);
        return;
      }

      if (format === 'ppt') {
        const res = await svgToRasterResult(svgElement, exportWidthPx, 'image/png');
        if (!res?.blob) throw new Error('PPT用画像生成エラー');
        const dataUrl = await blobToDataUrl(res.blob);
        const pptxModule = await import('pptxgenjs');
        const PptxGenJS = pptxModule.default || pptxModule;
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        const slide = pptx.addSlide();
        slide.background = { color: 'F8FAFC' };
        slide.addText(`横断幕デザイン（横 ${bannerWidth}cm × 縦 ${bannerHeight}cm）`, {
          x: 0.4,
          y: 0.25,
          w: 9.2,
          h: 0.35,
          fontSize: 13,
          bold: true,
          color: '334155',
          fontFace: 'Meiryo UI',
        });
        const boxX = 0.4;
        const boxY = 0.75;
        const boxW = 9.2;
        const boxH = 4.5;
        const ratio = res.width / res.height;
        let imgW = boxW;
        let imgH = imgW / ratio;
        if (imgH > boxH) {
          imgH = boxH;
          imgW = imgH * ratio;
        }
        const imgX = boxX + (boxW - imgW) / 2;
        const imgY = boxY + (boxH - imgH) / 2;
        slide.addImage({
          data: dataUrl,
          x: imgX,
          y: imgY,
          w: imgW,
          h: imgH,
        });
        const pptBlob = await pptx.write({ outputType: 'blob' });
        triggerBlobDownload(pptBlob, filename);
        showToast(`${filename} を保存しました`);
        return;
      }

      const res = await svgToRasterResult(svgElement, exportWidthPx, 'image/png');
      if (!res?.blob) throw new Error('PNG生成エラー');
      triggerBlobDownload(res.blob, filename);
      showToast(`${filename} を保存しました`);
    } catch (err) {
      console.error(err);
      showToast(`${format.toUpperCase()}ファイルの書き出しに失敗しました`);
    }
  };

  // --- スマホ・LINE向けデザイン共有モーダル制御 ---
  const revokeSharePreviews = (data) => {
    if (data?.designPreviewUrl) URL.revokeObjectURL(data.designPreviewUrl);
    if (data?.comparePreviewUrl) URL.revokeObjectURL(data.comparePreviewUrl);
  };

  const closeShareModal = () => {
    revokeSharePreviews(shareData);
    setShareData(null);
    setShareCopied(false);
    setIsShareOpen(false);
  };

  const openShareModal = async () => {
    revokeSharePreviews(shareData);
    setShareCopied(false);
    setIsShareOpen(true);
    setIsPreparingShare(true);

    const baseUrl =
      typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
    const encoded = encodeDesignToShareHash({
      w: bannerWidth,
      h: bannerHeight,
      bg: bgConfig,
      sh: showTextsOnBanner,
      ph: personHeight,
      pc: personCount,
      hs: holdStyle,
      texts,
    });
    const fullCandidateUrl = encoded ? `${baseUrl}#design=${encoded}` : baseUrl;
    const isUrlTooLong = fullCandidateUrl.length > 6500;
    const shareUrl = isUrlTooLong ? baseUrl : fullCandidateUrl;

    const mainSummary = texts
      .map((t) => t.text.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ')
      .slice(0, 60);
    const shareText = `横断幕デザインを作成しました！（横${bannerWidth}cm×縦${bannerHeight}cm）${
      mainSummary ? `\n「${mainSummary}」` : ''
    }`;

    const designFilename = buildBannerDownloadFilename(texts);
    const compareFilename = buildBannerDownloadFilename(texts, '_比較図');

    let designFile = null;
    let designPreviewUrl = null;
    let compareFile = null;
    let comparePreviewUrl = null;
    let canShareFiles = false;

    try {
      const [designBlob, compareBlob] = await Promise.all([
        svgEditRef.current ? svgToPngBlob(svgEditRef.current, 1800).catch(() => null) : null,
        svgScaleRef.current ? svgToPngBlob(svgScaleRef.current, 1600).catch(() => null) : null,
      ]);

      if (designBlob) {
        designFile = new File([designBlob], designFilename, { type: 'image/png' });
        designPreviewUrl = URL.createObjectURL(designBlob);
      }
      if (compareBlob) {
        compareFile = new File([compareBlob], compareFilename, { type: 'image/png' });
        comparePreviewUrl = URL.createObjectURL(compareBlob);
      }

      const testFile = designFile || compareFile;
      if (
        testFile &&
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function'
      ) {
        canShareFiles = navigator.canShare({ files: [testFile] });
      }
    } catch (err) {
      console.error(err);
    }

    setShareData({
      designFile,
      designPreviewUrl,
      designFilename,
      compareFile,
      comparePreviewUrl,
      compareFilename,
      shareUrl,
      shareText,
      isUrlTooLong,
      hasCustomImages: Boolean(bgImage) || imageLayers.length > 0,
      canShareFiles,
    });
    setIsPreparingShare(false);
  };

  const handleShareImageFile = async (kind) => {
    if (!shareData) return;
    const file = kind === 'compare' ? shareData.compareFile : shareData.designFile;
    const filename =
      kind === 'compare' ? shareData.compareFilename : shareData.designFilename;
    if (!file) {
      showToast('現在の表示モードではこの画像を生成できませんでした');
      return;
    }

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: '横断幕作成ツール - デザイン共有',
          text: shareData.shareText,
        });
        showToast('共有シートを開きました');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        console.error(err);
      }
    }

    // 非対応ブラウザ向けフォールバック：画像を保存し案内
    triggerBlobDownload(file, filename);
    showToast(`${filename} を保存しました（画像を選択してLINE等で送信できます）`);
  };

  const handleCopyShareLink = async () => {
    if (!shareData?.shareUrl) return;
    const textToCopy = `${shareData.shareText}\n${shareData.shareUrl}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setShareCopied(true);
      showToast('共有テキストとリンクをコピーしました！');
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      showToast('コピーに失敗しました');
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
  const renderBannerArtwork = (idPrefix = 'edit', isInteractive = false, designOverride = null) => {
    const w = designOverride ? designOverride.width : bannerWidth;
    const h = designOverride ? designOverride.height : bannerHeight;
    const curBgConfig = designOverride ? designOverride.bg : bgConfig;
    const curBgImage = designOverride ? designOverride.bgImage : bgImage;
    const curImageLayers = designOverride ? designOverride.imageLayers || [] : imageLayers;
    const curTexts = designOverride ? designOverride.texts || [] : texts;
    const curShowTexts = designOverride
      ? (designOverride.showTextsOnBanner ?? true)
      : showTextsOnBanner;

    const grommets = curBgConfig.grommets ? getGrommetPositions(w, h) : [];
    const bw = curBgConfig.borderWidth;
    const bgColors = getBgColorsFromConfig(curBgConfig);
    const bgSplits = getBgSplitPositions(curBgConfig, bgColors.length);
    const bgBounds = [0, ...bgSplits, 100];
    const gradStops = getGradientStopsFromSplits(bgColors, bgSplits);
    const patternColor = getEffectivePatternColor(curBgConfig, bgColors);
    const patternAlphaMul = curBgConfig.patternStrength ?? 1;
    const patAlpha = (base) => Math.min(0.85, base * patternAlphaMul);
    const stripeDensity = Math.max(2, curBgConfig.stripeDensity ?? 6);
    const stripeUnitW = w / stripeDensity;
    const stripeUnitH = h / stripeDensity;
    const stripeUnitD = Math.max(8, Math.min(w, h) * (3.2 / stripeDensity));
    const stripeOffsetPct = curBgConfig.stripeOffset ?? 0;
    const stripeDiagAngle = curBgConfig.stripeAngle ?? 35;
    const diagSkewPct = curBgConfig.splitDiagSkew ?? 14;
    const diagSkew = Math.min(w * 0.45, h * 2.2) * (diagSkewPct / 45);
    const patBase = Math.max(8, Math.min(w, h) * 0.22);

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

    const behindImages = curImageLayers.filter((img) => img.zOrder === 'behind');
    const frontImages = curImageLayers.filter((img) => img.zOrder !== 'behind');

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
            x2={curBgConfig.gradientDir === 'vertical' ? '0%' : '100%'}
            y2={curBgConfig.gradientDir === 'horizontal' ? '0%' : '100%'}
          >
            {bgColors.map((c, idx) => (
              <stop
                key={idx}
                offset={`${gradStops[idx]}%`}
                stopColor={c}
              />
            ))}
          </linearGradient>

          <radialGradient id={`${idPrefix}-bg-grad-radial`} cx="50%" cy="50%" r="65%">
            {bgColors.map((c, idx) => (
              <stop
                key={idx}
                offset={`${gradStops[idx]}%`}
                stopColor={c}
              />
            ))}
          </radialGradient>

          <pattern
            id={`${idPrefix}-bg-stripe-v`}
            x={(stripeOffsetPct / 100) * stripeUnitW}
            y="0"
            width={stripeUnitW}
            height={h}
            patternUnits="userSpaceOnUse"
          >
            {bgColors.map((c, idx) => {
              const segStart = (bgBounds[idx] / 100) * stripeUnitW;
              const segW = ((bgBounds[idx + 1] - bgBounds[idx]) / 100) * stripeUnitW;
              return (
                <rect
                  key={idx}
                  x={segStart}
                  y="0"
                  width={segW + 0.1}
                  height={h}
                  fill={c}
                />
              );
            })}
          </pattern>

          <pattern
            id={`${idPrefix}-bg-stripe-h`}
            x="0"
            y={(stripeOffsetPct / 100) * stripeUnitH}
            width={w}
            height={stripeUnitH}
            patternUnits="userSpaceOnUse"
          >
            {bgColors.map((c, idx) => {
              const segStart = (bgBounds[idx] / 100) * stripeUnitH;
              const segH = ((bgBounds[idx + 1] - bgBounds[idx]) / 100) * stripeUnitH;
              return (
                <rect
                  key={idx}
                  x="0"
                  y={segStart}
                  width={w}
                  height={segH + 0.1}
                  fill={c}
                />
              );
            })}
          </pattern>

          <pattern
            id={`${idPrefix}-bg-stripe-diag`}
            width={stripeUnitD}
            height={stripeUnitD}
            patternTransform={`rotate(${stripeDiagAngle} 0 0) translate(${(stripeOffsetPct / 100) * stripeUnitD}, 0)`}
            patternUnits="userSpaceOnUse"
          >
            {bgColors.map((c, idx) => {
              const segStart = (bgBounds[idx] / 100) * stripeUnitD;
              const segD = ((bgBounds[idx + 1] - bgBounds[idx]) / 100) * stripeUnitD;
              return (
                <rect
                  key={idx}
                  x={segStart}
                  y="0"
                  width={segD + 0.1}
                  height={stripeUnitD}
                  fill={c}
                />
              );
            })}
          </pattern>

          <filter id={`${idPrefix}-drop-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx={w * 0.004}
              dy={w * 0.005}
              stdDeviation={w * 0.003}
              floodColor="#000000"
              floodOpacity="0.65"
            />
          </filter>

          {curTexts.map((item) => {
            const activeEffects = getTextEffects(item);
            const baseCol = item.color || '#ffffff';
            const neonCol = item.neonColor || baseCol;
            return (
              <React.Fragment key={`fx-${item.id}`}>
                {activeEffects.includes('metallic') && (
                  <linearGradient id={`${idPrefix}-metal-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={adjustHexBrightness(baseCol, 75)} />
                    <stop offset="35%" stopColor={adjustHexBrightness(baseCol, 20)} />
                    <stop offset="52%" stopColor={adjustHexBrightness(baseCol, 95)} />
                    <stop offset="68%" stopColor={baseCol} />
                    <stop offset="100%" stopColor={adjustHexBrightness(baseCol, -55)} />
                  </linearGradient>
                )}
                {activeEffects.includes('neon') && (
                  <filter id={`${idPrefix}-neon-${item.id}`} x="-40%" y="-40%" width="180%" height="180%">
                    <feFlood floodColor={neonCol} floodOpacity="0.9" result="glowColor" />
                    <feComposite in="glowColor" in2="SourceAlpha" operator="in" result="coloredAlpha" />
                    <feGaussianBlur in="coloredAlpha" stdDeviation={Math.max(1.2, item.fontSize * 0.08)} result="blur1" />
                    <feGaussianBlur in="coloredAlpha" stdDeviation={Math.max(2.6, item.fontSize * 0.2)} result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                )}
              </React.Fragment>
            );
          })}

          <pattern
            id={`${idPrefix}-pattern-slashes`}
            width={patBase * 0.8}
            height={patBase * 0.8}
            patternTransform="rotate(35 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <rect width={patBase * 0.34} height={patBase * 0.8} fill={patternColor} fillOpacity={patAlpha(0.09)} />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-checkered`}
            width={patBase * 1.1}
            height={patBase * 1.1}
            patternUnits="userSpaceOnUse"
          >
            <rect width={patBase * 0.55} height={patBase * 0.55} fill={patternColor} fillOpacity={patAlpha(0.09)} />
            <rect
              x={patBase * 0.55}
              y={patBase * 0.55}
              width={patBase * 0.55}
              height={patBase * 0.55}
              fill={patternColor}
              fillOpacity={patAlpha(0.09)}
            />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-dots`}
            width={patBase * 0.9}
            height={patBase * 0.9}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={patBase * 0.225} cy={patBase * 0.225} r={patBase * 0.13} fill={patternColor} fillOpacity={patAlpha(0.12)} />
            <circle cx={patBase * 0.675} cy={patBase * 0.675} r={patBase * 0.13} fill={patternColor} fillOpacity={patAlpha(0.12)} />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-grid`}
            width={patBase * 0.85}
            height={patBase * 0.85}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${patBase * 0.85} 0 L 0 0 0 ${patBase * 0.85}`}
              fill="none"
              stroke={patternColor}
              strokeOpacity={patAlpha(0.12)}
              strokeWidth={Math.max(0.4, patBase * 0.05)}
            />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-diagonal-grid`}
            width={patBase}
            height={patBase}
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2={patBase} y2={patBase} stroke={patternColor} strokeOpacity={patAlpha(0.11)} strokeWidth={Math.max(0.4, patBase * 0.05)} />
            <line x1={patBase} y1="0" x2="0" y2={patBase} stroke={patternColor} strokeOpacity={patAlpha(0.11)} strokeWidth={Math.max(0.4, patBase * 0.05)} />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-carbon`}
            width={patBase * 0.48}
            height={patBase * 0.48}
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width={patBase * 0.24} height={patBase * 0.24} fill={patternColor} fillOpacity={patAlpha(0.08)} />
            <rect x={patBase * 0.24} y={patBase * 0.24} width={patBase * 0.24} height={patBase * 0.24} fill={patternColor} fillOpacity={patAlpha(0.08)} />
            <line x1="0" y1={patBase * 0.24} x2={patBase * 0.24} y2="0" stroke={patternColor} strokeOpacity={patAlpha(0.09)} strokeWidth={Math.max(0.3, patBase * 0.04)} />
            <line x1={patBase * 0.24} y1={patBase * 0.48} x2={patBase * 0.48} y2={patBase * 0.24} stroke={patternColor} strokeOpacity={patAlpha(0.09)} strokeWidth={Math.max(0.3, patBase * 0.04)} />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-diamonds`}
            width={patBase}
            height={patBase}
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points={`${patBase / 2},0 ${patBase},${patBase / 2} ${patBase / 2},${patBase} 0,${patBase / 2}`}
              fill={patternColor}
              fillOpacity={patAlpha(0.09)}
            />
          </pattern>

          <pattern
            id={`${idPrefix}-pattern-chevron`}
            width={patBase}
            height={patBase * 0.8}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M 0 ${patBase * 0.55} L ${patBase / 2} ${patBase * 0.15} L ${patBase} ${patBase * 0.55}`}
              fill="none"
              stroke={patternColor}
              strokeOpacity={patAlpha(0.12)}
              strokeWidth={Math.max(0.6, patBase * 0.16)}
              strokeLinecap="square"
            />
          </pattern>

          <radialGradient id={`${idPrefix}-pattern-radial`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={patAlpha(0.24)} />
            <stop offset="100%" stopColor="#000000" stopOpacity={patAlpha(0.14)} />
          </radialGradient>

          <radialGradient id={`${idPrefix}-pattern-vignette`} cx="50%" cy="50%" r="68%">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity={patAlpha(0.35)} />
          </radialGradient>

          <clipPath id={`${idPrefix}-banner-clip`}>
            <rect x="0" y="0" width={w} height={h} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${idPrefix}-banner-clip)`}>
          {/* 1. ベース背景（単色 / 多色グラデ / ツートン・多色分割 / しましま） */}
          {curBgConfig.type === 'gradient' ? (
            <rect
              x="0"
              y="0"
              width={w}
              height={h}
              fill={
                curBgConfig.gradientDir === 'radial'
                  ? `url(#${idPrefix}-bg-grad-radial)`
                  : `url(#${idPrefix}-bg-grad)`
              }
            />
          ) : curBgConfig.type === 'split_lr' ? (
            <g>
              {bgColors.map((c, idx) => {
                const startX = (bgBounds[idx] / 100) * w;
                const endX = (bgBounds[idx + 1] / 100) * w;
                const segW = Math.max(0, endX - startX);
                return (
                  <rect
                    key={idx}
                    x={startX}
                    y="0"
                    width={idx < bgColors.length - 1 ? segW + 0.25 : segW}
                    height={h}
                    fill={c}
                  />
                );
              })}
            </g>
          ) : curBgConfig.type === 'split_tb' ? (
            <g>
              {bgColors.map((c, idx) => {
                const startY = (bgBounds[idx] / 100) * h;
                const endY = (bgBounds[idx + 1] / 100) * h;
                const segH = Math.max(0, endY - startY);
                return (
                  <rect
                    key={idx}
                    x="0"
                    y={startY}
                    width={w}
                    height={idx < bgColors.length - 1 ? segH + 0.25 : segH}
                    fill={c}
                  />
                );
              })}
            </g>
          ) : curBgConfig.type === 'split_diag' ? (
            <g>
              <rect x="0" y="0" width={w} height={h} fill={bgColors[0]} />
              {bgSplits.map((splitPct, idx) => {
                const divX = w * (splitPct / 100);
                const topX = divX + diagSkew / 2;
                const botX = divX - diagSkew / 2;
                const rightEdge = Math.max(w, topX, botX) + 10;
                return (
                  <polygon
                    key={idx}
                    points={`${topX},0 ${rightEdge},0 ${rightEdge},${h} ${botX},${h}`}
                    fill={bgColors[idx + 1]}
                  />
                );
              })}
            </g>
          ) : curBgConfig.type === 'stripe_v' ? (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-bg-stripe-v)`} />
          ) : curBgConfig.type === 'stripe_h' ? (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-bg-stripe-h)`} />
          ) : curBgConfig.type === 'stripe_diag' ? (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-bg-stripe-diag)`} />
          ) : curBgConfig.type === 'ai' && curBgConfig.aiDesign?.svgInner ? (
            <g>
              <rect x="0" y="0" width={w} height={h} fill={curBgConfig.color1 || '#ffffff'} />
              <g opacity={(curBgConfig.aiDesign.opacity ?? 100) / 100}>
                <svg
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  viewBox={`0 0 ${curBgConfig.aiDesign.viewBoxW || w} ${curBgConfig.aiDesign.viewBoxH || h}`}
                  preserveAspectRatio="xMidYMid slice"
                  dangerouslySetInnerHTML={{
                    __html:
                      sanitizeAiBgSvgInner(
                        curBgConfig.aiDesign.svgInner,
                        `${idPrefix}-aibg`
                      ) || '',
                  }}
                />
              </g>
            </g>
          ) : (
            <rect x="0" y="0" width={w} height={h} fill={curBgConfig.color1} />
          )}

          {/* 2. 背景パターン模様 */}
          {curBgConfig.pattern === 'slashes' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-slashes)`} />
          )}
          {curBgConfig.pattern === 'checkered' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-checkered)`} />
          )}
          {curBgConfig.pattern === 'spotlight' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-radial)`} />
          )}
          {curBgConfig.pattern === 'vignette' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-vignette)`} />
          )}
          {curBgConfig.pattern === 'dots' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-dots)`} />
          )}
          {curBgConfig.pattern === 'grid' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-grid)`} />
          )}
          {curBgConfig.pattern === 'diagonal_grid' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-diagonal-grid)`} />
          )}
          {curBgConfig.pattern === 'carbon' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-carbon)`} />
          )}
          {curBgConfig.pattern === 'diamonds' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-diamonds)`} />
          )}
          {curBgConfig.pattern === 'chevron' && (
            <rect x="0" y="0" width={w} height={h} fill={`url(#${idPrefix}-pattern-chevron)`} />
          )}
          {curBgConfig.pattern === 'sunburst' && (
            <g>
              {Array.from({ length: 16 }).map((_, idx) => {
                const rays = 32;
                const a1 = ((idx * 2) / rays) * Math.PI * 2;
                const a2 = ((idx * 2 + 1) / rays) * Math.PI * 2;
                const cx = w / 2;
                const cy = h / 2;
                const radius = Math.hypot(w, h);
                const x1 = cx + Math.cos(a1) * radius;
                const y1 = cy + Math.sin(a1) * radius;
                const x2 = cx + Math.cos(a2) * radius;
                const y2 = cy + Math.sin(a2) * radius;
                return (
                  <polygon
                    key={idx}
                    points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`}
                    fill={patternColor}
                    fillOpacity={patAlpha(0.11)}
                  />
                );
              })}
            </g>
          )}

          {/* 2.5 読み込んだ横断幕全体画像 / 背景画像 (Mode A) */}
          {curBgImage && (
            <g>
              <image
                href={curBgImage.dataUrl}
                x="0"
                y="0"
                width={w}
                height={h}
                preserveAspectRatio={getPreserveAspectRatio(curBgImage.fitMode)}
                opacity={(curBgImage.opacity ?? 100) / 100}
              />
              {curBgImage.darkOverlay !== 0 && (
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  fill={curBgImage.darkOverlay > 0 ? '#000000' : '#ffffff'}
                  opacity={Math.abs(curBgImage.darkOverlay) / 100}
                />
              )}
            </g>
          )}

          {/* 3. 枠線（ボーダー） */}
          {curBgConfig.borderStyle === 'single' && bw > 0 && (
            <rect
              x={bw * 1.2}
              y={bw * 1.2}
              width={w - bw * 2.4}
              height={h - bw * 2.4}
              fill="none"
              stroke={curBgConfig.borderColor}
              strokeWidth={bw * 0.8}
            />
          )}
          {curBgConfig.borderStyle === 'double' && bw > 0 && (
            <g>
              <rect
                x={bw * 1.0}
                y={bw * 1.0}
                width={w - bw * 2.0}
                height={h - bw * 2.0}
                fill="none"
                stroke={curBgConfig.borderColor}
                strokeWidth={bw * 0.65}
              />
              <rect
                x={bw * 2.2}
                y={bw * 2.2}
                width={w - bw * 4.4}
                height={h - bw * 4.4}
                fill="none"
                stroke={curBgConfig.borderColor}
                strokeWidth={bw * 0.3}
              />
            </g>
          )}
          {curBgConfig.borderStyle === 'inner_frame' && bw > 0 && (
            <g>
              <rect
                x="0"
                y="0"
                width={w}
                height={h}
                fill="none"
                stroke={curBgConfig.borderColor}
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
          {curShowTexts &&
            curTexts.map((item) => {
              const fontObj = fontCatalog.find((f) => f.id === item.fontId) || fontCatalog[0];
              const posX = (item.x / 100) * w;
              const posY = (item.y / 100) * h;
              const lines = item.text.split('\n');
              const isSelected =
                isInteractive &&
                activeLayerType === 'text' &&
                effectiveSelectedTextIds.includes(item.id);
              const lineHeight = item.fontSize * 1.18;
              const activeEffects = getTextEffects(item);
              const hasShadow = activeEffects.includes('shadow');
              const hasHardShadow = activeEffects.includes('hard_shadow');
              const hasDoubleOutline = activeEffects.includes('double_outline');
              const hasNeon = activeEffects.includes('neon');
              const hasMetallic = activeEffects.includes('metallic');
              const hasHighlightBar = activeEffects.includes('highlight_bar');
              const hasUnderline = activeEffects.includes('underline');

              const rot = item.rotation || 0;
              const skew = item.skewAngle || 0;
              const textTransform =
                rot !== 0 || skew !== 0 ? `rotate(${rot}) skewX(${skew})` : undefined;

              const boxEst =
                hasHighlightBar || hasUnderline || isSelected
                  ? estimateBannerTextBox(lines, item.fontSize, item.letterSpacing, item.isVertical)
                  : null;
              const mainFill = hasMetallic ? `url(#${idPrefix}-metal-${item.id})` : item.color;
              const hardOffset = Math.max(1.5, item.fontSize * 0.085);
              const outerStrokeW =
                (item.strokeWidth > 0 ? item.strokeWidth : 0) +
                Math.max(2.5, item.fontSize * 0.14);

              const renderTextGlyph = ({
                fillColor,
                strokeColor,
                strokeW,
                filterVal,
                opacityVal = 1,
              }) => {
                if (!item.isVertical) {
                  return (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily={fontObj.family}
                      fontWeight={fontObj.weight}
                      fontSize={item.fontSize}
                      fill={fillColor}
                      stroke={strokeW > 0 ? strokeColor : 'none'}
                      strokeWidth={strokeW}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      paintOrder="stroke fill"
                      letterSpacing={item.letterSpacing}
                      filter={filterVal}
                      opacity={opacityVal}
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
                  );
                }
                return (
                  <g filter={filterVal} opacity={opacityVal}>
                    {lines.map((colText, colIdx) => {
                      const colOffsetX =
                        ((lines.length - 1) / 2 - colIdx) * (item.fontSize * 1.25);
                      const chars = Array.from(colText);
                      const stepY = item.fontSize + item.letterSpacing;
                      return (
                        <g key={colIdx} transform={`translate(${colOffsetX}, 0)`}>
                          {chars.map((ch, charIdx) => {
                            const charOffsetY = (charIdx - (chars.length - 1) / 2) * stepY;
                            const isRotatedChar = [
                              'ー',
                              '〜',
                              '～',
                              '(',
                              ')',
                              '（',
                              '）',
                              '「',
                              '」',
                              '-',
                            ].includes(ch);
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
                                fill={fillColor}
                                stroke={strokeW > 0 ? strokeColor : 'none'}
                                strokeWidth={strokeW}
                                strokeLinejoin="round"
                                strokeLinecap="round"
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
                );
              };

              return (
                <g
                  key={item.id}
                  transform={`translate(${posX}, ${posY})`}
                  onMouseDown={isInteractive ? (e) => handlePointerDownText(e, item) : undefined}
                  onTouchStart={isInteractive ? (e) => handlePointerDownText(e, item) : undefined}
                  style={{ cursor: isInteractive ? 'move' : 'default', userSelect: 'none' }}
                >
                  <g transform={textTransform}>
                    {hasHighlightBar && boxEst && (
                      <rect
                        x={-boxEst.width / 2}
                        y={-boxEst.height / 2}
                        width={boxEst.width}
                        height={boxEst.height}
                        rx={Math.max(2, item.fontSize * 0.14)}
                        fill={item.highlightBarColor || '#0f172a'}
                        opacity="0.88"
                      />
                    )}

                    <g
                      data-text-glyph={isInteractive ? item.id : undefined}
                      filter={hasNeon ? `url(#${idPrefix}-neon-${item.id})` : undefined}
                    >
                      {hasHardShadow && (
                        <g transform={`translate(${hardOffset}, ${hardOffset})`}>
                          {renderTextGlyph({
                            fillColor: item.hardShadowColor || '#0f172a',
                            strokeColor: item.hardShadowColor || '#0f172a',
                            strokeW: hasDoubleOutline
                              ? outerStrokeW
                              : item.strokeWidth > 0
                              ? item.strokeWidth
                              : 0,
                            filterVal: undefined,
                            opacityVal: 0.92,
                          })}
                        </g>
                      )}

                      {hasDoubleOutline &&
                        renderTextGlyph({
                          fillColor: item.doubleOutlineColor || '#ffffff',
                          strokeColor: item.doubleOutlineColor || '#ffffff',
                          strokeW: outerStrokeW,
                          filterVal: hasShadow ? `url(#${idPrefix}-drop-shadow)` : undefined,
                        })}

                      {renderTextGlyph({
                        fillColor: mainFill,
                        strokeColor: item.strokeColor,
                        strokeW: item.strokeWidth,
                        filterVal:
                          !hasDoubleOutline && hasShadow
                            ? `url(#${idPrefix}-drop-shadow)`
                            : undefined,
                      })}
                    </g>

                    {hasUnderline && boxEst && (
                      <rect
                        x={-boxEst.width * 0.48}
                        y={boxEst.height / 2 - Math.max(1.5, item.fontSize * 0.08)}
                        width={boxEst.width * 0.96}
                        height={Math.max(2, item.fontSize * 0.11)}
                        rx={Math.max(1, item.fontSize * 0.05)}
                        fill={item.underlineColor || item.color}
                      />
                    )}

                    {isSelected && (() => {
                      const measured =
                        selectedTextBBoxMap[item.id]?.width > 0
                          ? selectedTextBBoxMap[item.id]
                          : null;
                      const baseRect = measured
                        ? measured
                        : boxEst
                          ? {
                              x: -boxEst.width / 2,
                              y: -boxEst.height / 2,
                              width: boxEst.width,
                              height: boxEst.height,
                            }
                          : {
                              x: -item.fontSize,
                              y: -item.fontSize * 0.6,
                              width: item.fontSize * 2,
                              height: item.fontSize * 1.2,
                            };
                      const padX = Math.max(3, Math.min(w, h) * 0.04);
                      const padY = Math.max(2.5, Math.min(w, h) * 0.035);
                      const gx = baseRect.x - padX;
                      const gy = baseRect.y - padY;
                      const gw = baseRect.width + padX * 2;
                      const gh = baseRect.height + padY * 2;
                      const baseStroke = Math.max(0.8, Math.min(w, h) * 0.012);
                      const dashUnit = Math.max(2, Math.min(w, h) * 0.03);
                      const handleSize = Math.max(2.6, Math.min(w, h) * 0.042);
                      const corners = [
                        [gx, gy],
                        [gx + gw, gy],
                        [gx, gy + gh],
                        [gx + gw, gy + gh],
                      ];

                      return (
                        <g className="editor-only-guide" pointerEvents="none">
                          <rect
                            x={gx}
                            y={gy}
                            width={gw}
                            height={gh}
                            rx={padY * 0.4}
                            fill="#0ea5e9"
                            fillOpacity="0.1"
                          />
                          <rect
                            x={gx}
                            y={gy}
                            width={gw}
                            height={gh}
                            rx={padY * 0.4}
                            fill="none"
                            stroke="#ffffff"
                            strokeOpacity="0.92"
                            strokeWidth={baseStroke * 2.1}
                          />
                          <rect
                            x={gx}
                            y={gy}
                            width={gw}
                            height={gh}
                            rx={padY * 0.4}
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth={baseStroke * 1.15}
                            strokeDasharray={`${dashUnit * 1.5},${dashUnit}`}
                          />
                          {corners.map(([cx, cy], cIdx) => (
                            <rect
                              key={cIdx}
                              x={cx - handleSize / 2}
                              y={cy - handleSize / 2}
                              width={handleSize}
                              height={handleSize}
                              rx={handleSize * 0.18}
                              fill="#ffffff"
                              stroke="#0284c7"
                              strokeWidth={baseStroke}
                            />
                          ))}
                          <circle
                            cx="0"
                            cy="0"
                            r={Math.max(1.4, Math.min(w, h) * 0.018)}
                            fill="#38bdf8"
                            fillOpacity="0.85"
                            stroke="#ffffff"
                            strokeWidth={baseStroke * 0.9}
                          />
                        </g>
                      );
                    })()}
                  </g>
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
    const safePersonCount = Math.max(2, personCount);
    const s = personHeight / 170;
    // 両脇の人の肩外縁がちょうど横断幕の両端付近に揃うようにオフセット配置
    const edgeSpan = Math.max(0, bannerWidth - 40 * s);
    // 幕幅が極端に狭い場合も人物同士が重なりすぎない最小間隔を確保
    const minSpan = (safePersonCount - 1) * 44 * s;
    const span = Math.max(edgeSpan, minSpan);

    const personSpanWidth = span + 60 * s;
    const contentMaxWidth = Math.max(bannerWidth, personSpanWidth, 220);
    const sceneWidth = contentMaxWidth + 200;
    const maxVerticalElement = Math.max(personHeight + 50, bannerHeight + 90, 230);
    const sceneHeight = maxVerticalElement + 70;
    const groundY = sceneHeight - 38;
    const centerX = sceneWidth / 2;

    const peopleX = [];
    for (let i = 0; i < safePersonCount; i++) {
      peopleX.push(centerX - span / 2 + (i * span) / (safePersonCount - 1));
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

    const bannerLeftX = centerX - bannerWidth / 2;

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
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Dela+Gothic+One&family=DotGothic16&family=Hachi+Maru+Pop&family=Kaisei+Decol:wght@700&family=Kaisei+Tokumin:wght@800&family=Klee+One:wght@600&family=Kosugi+Maru&family=M+PLUS+1p:wght@700;900&family=M+PLUS+Rounded+1c:wght@500;700;800&family=Mochiy+Pop+One&family=New+Tegomin&family=Noto+Sans+JP:wght@700;900&family=Noto+Serif+JP:wght@700;900&family=Oswald:wght@700&family=Potta+One&family=Rampart+One&family=Reggae+One&family=RocknRoll+One&family=Sawarabi+Mincho&family=Shippori+Mincho:wght@800&family=Stick&family=Train+One&family=Yuji+Boku&family=Yuji+Mai&family=Yuji+Syuku&family=Yusei+Magic&family=Zen+Kaku+Gothic+New:wght@700;900&family=Zen+Maru+Gothic:wght@500;700;900&family=Zen+Old+Mincho:wght@700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@700&family=BIZ+UDPMincho:wght@700&family=Cherry+Bomb+One&family=Chokokutai&family=Darumadrop+One&family=Kaisei+HarunoUmi:wght@700&family=Kaisei+Opti:wght@700&family=Kiwi+Maru:wght@500&family=M+PLUS+2:wght@900&family=Shippori+Antique&family=Zen+Antique&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:wght@800&family=Black+Ops+One&family=Bungee&family=Chakra+Petch:wght@700&family=Graduate&family=Kaushan+Script&family=Montserrat:wght@900&family=Passion+One:wght@700&family=Righteous&family=Russo+One&family=Squada+One&family=Staatliches&family=Teko:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Zen+Antique+Soft&family=Slackside+One&family=Yomogi&family=Zen+Kurenaido&family=Shizuru&family=M+PLUS+1:wght@700;900&family=Murecho:wght@900&family=Shippori+Antique+B1&family=IBM+Plex+Sans+JP:wght@700&family=BIZ+UDGothic:wght@700&family=Sawarabi+Gothic&family=WDXL+Lubrifont+JP+N&family=BIZ+UDMincho:wght@700&family=Mochiy+Pop+P+One&family=Tsukimi+Rounded:wght@700&family=Kosugi&family=Palette+Mosaic&family=M+PLUS+1+Code:wght@700&family=Bungee+Shade&family=Bungee+Inline&family=Monoton&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&family=Saira+Condensed:wght@800&family=Saira+Extra+Condensed:wght@800&family=Pathway+Gothic+One&family=Francois+One&family=BenchNine:wght@700&family=Six+Caps&family=Big+Shoulders+Display:wght@900&family=Big+Shoulders+Stencil+Display:wght@800&family=Antonio:wght@700&family=Titan+One&family=Alfa+Slab+One&family=Ultra&family=Rubik+Mono+One&family=Rubik:wght@900&family=Syne:wght@800&family=Unbounded:wght@900&family=Kanit:wght@800&family=Orbitron:wght@900&family=Audiowide&family=Racing+Sans+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Faster+One&family=Bangers&family=Boogaloo&family=Bowlby+One+SC&family=Fugaz+One&family=Lilita+One&family=Luckiest+Guy&family=Permanent+Marker&family=Sedgwick+Ave+Display&family=Rowdies:wght@700&family=Stardos+Stencil:wght@700&family=Wallpoet&family=Press+Start+2P&family=Silkscreen:wght@700&family=Cinzel:wght@900&family=Playfair+Display:wght@900&family=Black+Han+Sans&family=Caveat+Brush&family=Pacifico&family=Lobster&family=Shrikhand&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@700;800&family=Gidole&family=Barlow+Semi+Condensed:wght@700&family=Roboto+Condensed:wght@700&family=Archivo+Narrow:wght@700&family=PT+Sans+Narrow:wght@700&family=Public+Sans:wght@700&family=Inter:wght@700&family=Jost:wght@700&family=Atkinson+Hyperlegible:wght@700&family=Oxanium:wght@700&family=Zen+Kaku+Gothic+Antique:wght@700&family=Doto:wght@700;900&family=Pixelify+Sans:wght@700&family=VT323&family=Share+Tech+Mono&family=Share+Tech&family=Courier+Prime:wght@700&display=swap');
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
            <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 flex-wrap">
              横断幕作成ツール
              <span className="hidden md:inline-block text-xs bg-violet-600/30 text-violet-300 border border-violet-400/40 px-2 py-0.5 rounded-full font-medium">
                ✨ AIスローガン提案搭載
              </span>
              <button
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1.5 transition shrink-0"
                title="音声付きの利用説明動画（約2分）を再生"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>使い方動画</span>
              </button>
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

          {/* 戻る・進む（Undo / Redo）ボタン */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg text-xs font-bold gap-1 border border-slate-700">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!historyFlags.canUndo}
              className="px-2.5 py-1 rounded-md bg-slate-600 text-white shadow-sm hover:bg-sky-600 disabled:bg-transparent disabled:text-slate-500 disabled:shadow-none disabled:opacity-45 disabled:hover:bg-transparent disabled:cursor-not-allowed transition flex items-center gap-1"
              title="ひとつ前に戻る (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>戻る</span>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!historyFlags.canRedo}
              className="px-2.5 py-1 rounded-md bg-slate-600 text-white shadow-sm hover:bg-sky-600 disabled:bg-transparent disabled:text-slate-500 disabled:shadow-none disabled:opacity-45 disabled:hover:bg-transparent disabled:cursor-not-allowed transition flex items-center gap-1"
              title="ひとつ先に進む (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>進む</span>
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
                setActiveTab('template');
                bgImageInputRef.current?.click();
              }}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="お手持ちの横断幕画像や背景画像をそのまま読み込む"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden md:inline">背景画像読込</span>
            </button>
            <button
              onClick={handleSaveFavorite}
              className="bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="現在のデザインをサイト内のお気に入りに保存して後で比較できます"
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span className="hidden sm:inline">お気に入り保存</span>
            </button>
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="保存したお気に入りデザインを一覧で並べて比較します"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>比較一覧</span>
              <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                {favorites.length}
              </span>
            </button>
            <div className="flex items-center bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 gap-1.5">
              <span className="hidden lg:inline text-[11px] text-slate-300 font-medium">
                形式
              </span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                aria-label="保存形式を選択"
                title="保存するファイル形式を選択 (PNG / JPG / PDF / PPT)"
                className="bg-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="pdf">PDF</option>
                <option value="ppt">PPT</option>
              </select>
            </div>
            <button
              onClick={() =>
                downloadSvgAsFormat(
                  svgEditRef.current,
                  buildBannerDownloadFilename(texts, '', exportFormat),
                  1800,
                  exportFormat
                )
              }
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title={`横断幕デザイン単体を${exportFormat.toUpperCase()}形式で保存`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">デザイン保存</span>
            </button>
            <button
              onClick={() =>
                downloadSvgAsFormat(
                  svgScaleRef.current,
                  buildBannerDownloadFilename(texts, '_比較図', exportFormat),
                  1600,
                  exportFormat
                )
              }
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title={`人物とのサイズ比較イメージを${exportFormat.toUpperCase()}形式で保存`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">比較図を保存</span>
            </button>
            <button
              onClick={openShareModal}
              className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
              title="スマホ・LINE等へデザインや比較図、編集リンクを共有"
            >
              <Share2 className="w-4 h-4" />
              <span className="sm:hidden">共有</span>
              <span className="hidden sm:inline">デザイン共有</span>
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
          <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-slate-200 bg-slate-50 text-[11px] sm:text-[10px] font-bold leading-tight tracking-tighter">
            <button
              onClick={() => setActiveTab('text')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'text'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Type className="w-4 h-4 shrink-0" />
              <span>文言</span>
            </button>
            <button
              onClick={() => setActiveTab('size_bg')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'size_bg'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>背景・サイズ</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'ai'
                  ? 'border-violet-600 text-violet-700 bg-violet-50/40'
                  : 'border-transparent text-slate-500 hover:text-violet-700'
              }`}
            >
              <Wand2 className="w-4 h-4 text-violet-600 shrink-0" />
              <span>✨AI文言提案</span>
            </button>
            <button
              onClick={() => setActiveTab('human')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'human'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>持ったイメージ</span>
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'template'
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>テンプレ・取込</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 sm:py-3 px-0.5 flex flex-col items-center justify-center gap-1 border-b-2 transition text-center ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60'
                  : 'border-transparent text-slate-500 hover:text-emerald-700'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>全体表示</span>
            </button>
          </div>

          {/* タブの中身（スクロール領域） */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* ==================== タブ1: 文言 ==================== */}
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
                  <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
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
                      {texts.length > 1 && (
                        <button
                          type="button"
                          onClick={
                            effectiveSelectedTextIds.length === texts.length
                              ? clearMultiSelectTexts
                              : selectAllTexts
                          }
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold border transition ${
                            effectiveSelectedTextIds.length > 1
                              ? 'bg-sky-600 text-white border-sky-600 hover:bg-sky-500'
                              : 'bg-white text-sky-700 border-sky-300 hover:bg-sky-50'
                          }`}
                          title="チェックまたはShift+クリックで複数文字を選んで一括整列（上寄など）できます"
                        >
                          {effectiveSelectedTextIds.length === texts.length
                            ? '複数選択を解除'
                            : '全文字を選択'}
                        </button>
                      )}
                      {effectiveSelectedTextIds.length > 1 && (
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300 px-1.5 py-0.5 rounded-full">
                          {effectiveSelectedTextIds.length}件選択中
                        </span>
                      )}
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
                  {texts.length > 1 && (
                    <p className="text-[10px] text-slate-500 mb-1.5">
                      ※チェックボックス（またはShift+クリック）で複数選択し、下の「上寄・中央」等でまとめて整列できます
                    </p>
                  )}

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {texts.map((item) => {
                      const isInMulti =
                        activeLayerType === 'text' && effectiveSelectedTextIds.includes(item.id);
                      const isPrimary =
                        activeLayerType === 'text' && selectedText?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            if (e.shiftKey || e.ctrlKey || e.metaKey) {
                              toggleMultiSelectText(item.id);
                            } else {
                              selectSingleText(item.id);
                            }
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
                            isInMulti
                              ? isPrimary
                                ? 'bg-sky-100/90 border-sky-600 ring-2 ring-sky-400/50 text-sky-950 font-bold shadow-sm'
                                : 'bg-sky-50 border-sky-400 text-sky-900 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            {texts.length > 1 && (
                              <input
                                type="checkbox"
                                checked={isInMulti}
                                onChange={() => toggleMultiSelectText(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 rounded accent-sky-600 cursor-pointer shrink-0"
                                aria-label={`「${item.text.replace(/\n/g, ' ') || '空テキスト'}」を複数選択`}
                                title="チェックで複数選択に追加/解除"
                              />
                            )}
                            {isInMulti && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                                  isPrimary
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-sky-200 text-sky-900'
                                }`}
                              >
                                {isPrimary && effectiveSelectedTextIds.length > 1
                                  ? '編集中'
                                  : '選択中'}
                              </span>
                            )}
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate">
                              {item.text.replace(/\n/g, ' ') || '(空のテキスト)'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal truncate hidden sm:inline">
                              [{getFontDisplayName(item.fontId)}]
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {texts.length > 1 &&
                              activeLayerType === 'text' &&
                              selectedText &&
                              item.id !== selectedText.id &&
                              (item.fontId === selectedText.fontId ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" />
                                  同書体
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyFontToTexts(selectedText.fontId, item.id);
                                  }}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 font-bold flex items-center gap-0.5 transition"
                                  title={`「${getFontDisplayName(selectedText.fontId)}」をこの文字にも適用`}
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                  書体コピー
                                </button>
                              ))}
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
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-slate-600">大きさ</span>
                            <NumericValueInput
                              value={selectedImageLayer.widthPercent}
                              min={4}
                              max={100}
                              step={1}
                              unit="%"
                              widthClass="w-11"
                              textColorClass="text-emerald-700"
                              ariaLabel="画像の大きさ数値"
                              onChange={(v) => updateSelectedImageLayer({ widthPercent: v })}
                            />
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
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-slate-600">回転</span>
                            <NumericValueInput
                              value={selectedImageLayer.rotation}
                              min={-180}
                              max={180}
                              step={1}
                              unit="°"
                              widthClass="w-11"
                              textColorClass="text-emerald-700"
                              ariaLabel="画像の回転角度数値"
                              onChange={(v) => updateSelectedImageLayer({ rotation: v })}
                            />
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
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-slate-600">不透明度</span>
                            <NumericValueInput
                              value={selectedImageLayer.opacity}
                              min={10}
                              max={100}
                              step={5}
                              unit="%"
                              widthClass="w-11"
                              textColorClass="text-emerald-700"
                              ariaLabel="画像の不透明度数値"
                              onChange={(v) => updateSelectedImageLayer({ opacity: v })}
                            />
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

                {/* 文字未選択時のガイド */}
                {!selectedText && activeLayerType === 'text' && texts.length > 0 && (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">文字は選択されていません</p>
                    <p>上のリストまたは右のキャンバス上の文字をクリックすると編集できます（Escキーや余白クリックで解除）。</p>
                  </div>
                )}

                {/* 選択中テキストの詳細編集 */}
                {selectedText && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 min-w-0">
                        <Edit3 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="shrink-0">選択中の文字を編集</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-300 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                          {selectedText.text.replace(/\n/g, ' ') || '(空)'}
                        </span>
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
                      <div className="text-xs min-w-0 truncate">
                        <span className="text-slate-500 font-medium">適用中フォント: </span>
                        <span className="font-bold text-sky-800">
                          {getFontDisplayName(selectedText.fontId)}
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

                    {/* 他の文字へ同じフォントをワンクリック適用 */}
                    {texts.length > 1 && (() => {
                      const currentFontName = getFontDisplayName(selectedText.fontId);
                      const otherTexts = texts.filter((t) => t.id !== selectedText.id);
                      const allMatched = otherTexts.every((t) => t.fontId === selectedText.fontId);
                      return (
                        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-2.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                              <Copy className="w-3 h-3 text-sky-600 shrink-0" />
                              同じフォントを他の文字に適用
                            </span>
                            <button
                              type="button"
                              onClick={() => applyFontToTexts(selectedText.fontId)}
                              disabled={allMatched}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition shrink-0 ${
                                allMatched
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                              }`}
                              title={`「${currentFontName}」をすべての文字に一括適用`}
                            >
                              {allMatched ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  全文字同書体
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  すべてに適用
                                </>
                              )}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {otherTexts.map((other) => {
                              const isSame = other.fontId === selectedText.fontId;
                              const label = other.text.replace(/\n/g, ' ').trim() || '(空のテキスト)';
                              return (
                                <button
                                  key={other.id}
                                  type="button"
                                  onClick={() => applyFontToTexts(selectedText.fontId, other.id)}
                                  disabled={isSame}
                                  className={`text-[11px] px-2 py-1 rounded-lg border font-bold flex items-center gap-1 max-w-[170px] transition ${
                                    isSame
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default'
                                      : 'bg-white hover:bg-sky-100 border-sky-300 text-slate-700 hover:text-sky-900 shadow-2xs'
                                  }`}
                                  title={
                                    isSame
                                      ? `「${label}」は同じフォント（${currentFontName}）です`
                                      : `「${label}」に「${currentFontName}」を適用`
                                  }
                                >
                                  {isSame ? (
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Plus className="w-3 h-3 text-sky-600 shrink-0" />
                                  )}
                                  <span className="truncate">{label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* フォント検索・選択＆カスタムフォント追加セクション */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-sky-600" />
                          フォント ({filteredFonts.length}/{fontCatalog.length}種)
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {texts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setIsFontApplyAll((v) => !v)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 transition ${
                                isFontApplyAll
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                              }`}
                              title="ONにすると一覧で選んだフォントをすべての文字へ一括適用します"
                            >
                              <Layers className="w-3 h-3" />
                              全文字同時{isFontApplyAll ? 'ON' : ''}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsFontGalleryOpen(true)}
                            className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 transition"
                          >
                            <Grid className="w-3 h-3" />
                            一覧から広く選ぶ
                          </button>
                          <button
                            type="button"
                            onClick={() => fontFileInputRef.current?.click()}
                            className="text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 transition"
                          >
                            <Upload className="w-3 h-3" />
                            追加
                          </button>
                        </div>
                        <input
                          ref={fontFileInputRef}
                          type="file"
                          accept=".ttf,.otf,.woff,.woff2"
                          multiple
                          onChange={(e) => handleUploadFontFiles(e.target.files)}
                          className="hidden"
                        />
                      </div>

                      {renderFontFilterBar(true)}

                      {/* フォントプレビュー付きリスト */}
                      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 border-t border-b border-slate-100 py-1.5">
                        {filteredFonts.length > 0 ? (
                          filteredFonts.map((f) => renderFontItemCard(f, false))
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
                              data-native-undo="true"
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
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-slate-700">文字サイズ</span>
                          <NumericValueInput
                            value={selectedText.fontSize}
                            min={5}
                            max={120}
                            step={1}
                            ariaLabel="文字サイズ数値"
                            onChange={(v) => updateSelectedText({ fontSize: v })}
                          />
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
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-slate-700">文字間隔</span>
                          <NumericValueInput
                            value={selectedText.letterSpacing}
                            min={-2}
                            max={30}
                            step={1}
                            ariaLabel="文字間隔数値"
                            onChange={(v) => updateSelectedText({ letterSpacing: v })}
                          />
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
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-bold text-slate-700">フチの太さ</span>
                            <NumericValueInput
                              value={selectedText.strokeWidth}
                              min={0}
                              max={8}
                              step={0.5}
                              ariaLabel="フチの太さ数値"
                              onChange={(v) => updateSelectedText({ strokeWidth: v })}
                            />
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

                      {/* 斜め・傾き設定（角度回転 ＆ イタリック斜体） */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <RotateCw className="w-3.5 h-3.5 text-sky-600" />
                            文字の斜め・傾き
                          </span>
                          {((selectedText.rotation || 0) !== 0 ||
                            (selectedText.skewAngle || 0) !== 0) && (
                            <button
                              type="button"
                              onClick={() => updateSelectedText({ rotation: 0, skewAngle: 0 })}
                              className="text-[10px] font-bold text-slate-600 hover:text-sky-700 bg-white border border-slate-300 px-2 py-0.5 rounded"
                            >
                              角度リセット
                            </button>
                          )}
                        </div>

                        {/* 全体の傾き角度（rotation） */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-600">
                              文字全体の角度（傾け配置）
                            </span>
                            <NumericValueInput
                              value={selectedText.rotation || 0}
                              min={-45}
                              max={45}
                              step={1}
                              unit="°"
                              ariaLabel="文字全体の角度数値"
                              onChange={(v) => updateSelectedText({ rotation: v })}
                            />
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={selectedText.rotation || 0}
                            onChange={(e) =>
                              updateSelectedText({ rotation: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                          <div className="grid grid-cols-5 gap-1 text-[10px]">
                            {[-15, -5, 0, 5, 15].map((deg) => (
                              <button
                                key={deg}
                                type="button"
                                onClick={() => updateSelectedText({ rotation: deg })}
                                className={`py-1 rounded border font-bold transition ${
                                  (selectedText.rotation || 0) === deg
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {deg > 0 ? `+${deg}°` : `${deg}°`}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 文字自体の斜体スラント（skewAngle） */}
                        <div className="space-y-1 pt-1 border-t border-slate-200/80">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-600">
                              文字の斜体（スピード感・イタリック傾き）
                            </span>
                            <NumericValueInput
                              value={selectedText.skewAngle || 0}
                              min={-35}
                              max={35}
                              step={1}
                              unit="°"
                              ariaLabel="文字の斜体角度数値"
                              onChange={(v) => updateSelectedText({ skewAngle: v })}
                            />
                          </div>
                          <input
                            type="range"
                            min="-35"
                            max="35"
                            step="1"
                            value={selectedText.skewAngle || 0}
                            onChange={(e) =>
                              updateSelectedText({ skewAngle: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                          <div className="grid grid-cols-5 gap-1 text-[10px]">
                            {[-20, -10, 0, 10, 20].map((deg) => (
                              <button
                                key={deg}
                                type="button"
                                onClick={() => updateSelectedText({ skewAngle: deg })}
                                className={`py-1 rounded border font-bold transition ${
                                  (selectedText.skewAngle || 0) === deg
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {deg > 0 ? `+${deg}°` : `${deg}°`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 文字の効果（複数同時選択可） */}
                      {(() => {
                        const activeEffects = getTextEffects(selectedText);
                        const toggleEffect = (effectId) => {
                          const exists = activeEffects.includes(effectId);
                          const nextEffects = exists
                            ? activeEffects.filter((id) => id !== effectId)
                            : [...activeEffects, effectId];
                          updateSelectedText({
                            effects: nextEffects,
                            shadow: nextEffects.includes('shadow'),
                          });
                        };
                        const effectColorFields = [
                          {
                            id: 'double_outline',
                            key: 'doubleOutlineColor',
                            label: '外フチの色',
                            fallback: '#ffffff',
                          },
                          {
                            id: 'hard_shadow',
                            key: 'hardShadowColor',
                            label: '3D影の色',
                            fallback: '#0f172a',
                          },
                          {
                            id: 'neon',
                            key: 'neonColor',
                            label: 'ネオン発光色',
                            fallback: selectedText.color || '#38bdf8',
                          },
                          {
                            id: 'highlight_bar',
                            key: 'highlightBarColor',
                            label: '背景帯の色',
                            fallback: '#0f172a',
                          },
                          {
                            id: 'underline',
                            key: 'underlineColor',
                            label: 'アンダーライン色',
                            fallback: selectedText.color || '#dc2626',
                          },
                        ].filter((cfg) => activeEffects.includes(cfg.id));

                        return (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                文字の効果（複数選択可）
                              </span>
                              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                                {activeEffects.length}個 適用中
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                              {TEXT_EFFECT_OPTIONS.map((fx) => {
                                const isOn = activeEffects.includes(fx.id);
                                return (
                                  <button
                                    key={fx.id}
                                    type="button"
                                    onClick={() => toggleEffect(fx.id)}
                                    className={`px-2 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 text-left transition ${
                                      isOn
                                        ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <Check
                                      className={`w-3 h-3 shrink-0 ${
                                        isOn ? 'text-white' : 'text-slate-300'
                                      }`}
                                    />
                                    <span className="truncate">{fx.label}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {effectColorFields.length > 0 && (
                              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                                {effectColorFields.map((ef) => {
                                  const curCol = selectedText[ef.key] || ef.fallback;
                                  return (
                                    <div
                                      key={ef.id}
                                      className="flex items-center justify-between gap-2 bg-white px-2 py-1.5 rounded-lg border border-slate-200"
                                    >
                                      <span className="text-[11px] font-bold text-slate-700 shrink-0">
                                        {ef.label}
                                      </span>
                                      <div className="flex items-center gap-1 flex-wrap justify-end">
                                        <input
                                          type="color"
                                          value={curCol}
                                          onChange={(e) =>
                                            updateSelectedText({ [ef.key]: e.target.value })
                                          }
                                          className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                                        />
                                        {['#ffffff', '#000000', '#facc15', '#dc2626', '#0284c7'].map(
                                          (c) => (
                                            <button
                                              key={c}
                                              type="button"
                                              onClick={() => updateSelectedText({ [ef.key]: c })}
                                              className={`w-4 h-4 rounded-full border ${
                                                curCol.toLowerCase() === c
                                                  ? 'ring-2 ring-sky-500 scale-110'
                                                  : 'border-slate-300'
                                              }`}
                                              style={{ backgroundColor: c }}
                                            />
                                          )
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* 文字の位置指定 */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Move className="w-3.5 h-3.5 text-sky-600" />
                          <span>位置の整列・微調整</span>
                          {effectiveSelectedTextIds.length > 1 && (
                            <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">
                              {effectiveSelectedTextIds.length}件まとめて一括適用
                            </span>
                          )}
                        </label>
                        <span className="text-[11px] text-slate-500">
                          ※キャンバス上でドラッグ移動も可能
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-1 bg-slate-200/70 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ x: 20 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          左寄
                        </button>
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ x: 50 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          中央
                        </button>
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ x: 80 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          右寄
                        </button>
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ y: 24 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignStartVertical className="w-3.5 h-3.5" />
                          上寄
                        </button>
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ y: 50 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignCenterVertical className="w-3.5 h-3.5" />
                          中段
                        </button>
                        <button
                          type="button"
                          onClick={() => alignSelectedTexts({ y: 78 })}
                          className="p-1.5 bg-white hover:bg-sky-50 rounded text-slate-700 flex flex-col items-center gap-0.5 text-[10px] font-medium shadow-sm"
                        >
                          <AlignEndVertical className="w-3.5 h-3.5" />
                          下寄
                        </button>
                      </div>

                      {effectiveSelectedTextIds.length > 1 && (
                        <div className="bg-sky-50 border border-sky-200 rounded-lg p-2 space-y-1.5">
                          <div className="text-[10px] font-bold text-sky-900">
                            選択中の {effectiveSelectedTextIds.length} 件の位置関係を保ったまままとめて移動：
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => nudgeSelectedTexts(-2, 0)}
                              className="py-1 px-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded transition"
                            >
                              ← 左へ
                            </button>
                            <button
                              type="button"
                              onClick={() => nudgeSelectedTexts(0, -2)}
                              className="py-1 px-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded transition"
                            >
                              ↑ 上へ
                            </button>
                            <button
                              type="button"
                              onClick={() => nudgeSelectedTexts(0, 2)}
                              className="py-1 px-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded transition"
                            >
                              ↓ 下へ
                            </button>
                            <button
                              type="button"
                              onClick={() => nudgeSelectedTexts(2, 0)}
                              className="py-1 px-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded transition"
                            >
                              → 右へ
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 font-medium">横位置 (X)</span>
                            <NumericValueInput
                              value={selectedText.x}
                              min={0}
                              max={100}
                              step={0.5}
                              unit="%"
                              textColorClass="text-slate-800"
                              ariaLabel="横位置 X 数値"
                              onChange={(v) => alignSelectedTexts({ x: v })}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedText.x}
                            onChange={(e) =>
                              alignSelectedTexts({ x: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 font-medium">縦位置 (Y)</span>
                            <NumericValueInput
                              value={selectedText.y}
                              min={0}
                              max={100}
                              step={0.5}
                              unit="%"
                              textColorClass="text-slate-800"
                              ariaLabel="縦位置 Y 数値"
                              onChange={(v) => alignSelectedTexts({ y: v })}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedText.y}
                            onChange={(e) =>
                              alignSelectedTexts({ y: Number(e.target.value) })
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
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-violet-600" />
                      AIで文言を考える・書き換える
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-white/80 text-slate-600 border border-violet-200 px-2 py-0.5 rounded-full font-medium">
                        本日 {aiUsageToday}回利用
                      </span>
                      <span className="text-[10px] bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full font-bold">
                        Gemini 3.5 Lite
                      </span>
                    </div>
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
                      data-native-undo="true"
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
                      data-native-undo="true"
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

            {/* ==================== タブ3: 背景・サイズ ==================== */}
            {activeTab === 'size_bg' && (
              <div className="space-y-5">
                {/* 背景・枠デザイン設定 */}
                {(() => {
                  const curBgColors = getBgColorsFromConfig(bgConfig);
                  const curBgSplits = getBgSplitPositions(bgConfig, curBgColors.length);
                  const updateBgColors = (nextColors, nextSplits = null) =>
                    setBgConfig((prev) => {
                      const prevColors = getBgColorsFromConfig(prev);
                      const resolvedSplits = Array.isArray(nextSplits)
                        ? nextSplits
                        : prevColors.length === nextColors.length &&
                            Array.isArray(prev.colorSplits) &&
                            prev.colorSplits.length === nextColors.length - 1
                          ? prev.colorSplits
                          : getDefaultBgSplits(nextColors.length);
                      return {
                        ...prev,
                        colors: nextColors,
                        color1: nextColors[0] || prev.color1,
                        color2: nextColors[1] || nextColors[0] || prev.color2,
                        colorSplits: resolvedSplits,
                      };
                    });
                  const updateBgSplitAt = (splitIdx, nextRaw) => {
                    const nextSplits = [...curBgSplits];
                    const minV = splitIdx === 0 ? 1 : nextSplits[splitIdx - 1] + 1;
                    const maxV =
                      splitIdx === nextSplits.length - 1 ? 99 : nextSplits[splitIdx + 1] - 1;
                    nextSplits[splitIdx] = Math.max(minV, Math.min(maxV, Number(nextRaw)));
                    setBgConfig((prev) => ({
                      ...prev,
                      colorSplits: nextSplits,
                    }));
                  };
                  const handleSelectBgType = (nextType) => {
                    if (
                      nextType !== 'solid' &&
                      (!Array.isArray(bgConfig.colors) || bgConfig.colors.length < 2)
                    ) {
                      const c1 = bgConfig.color1 || '#ffffff';
                      const c2 = bgConfig.color2 || '#1e3a8a';
                      const nearLightPair = isHexLightColor(c1) && isHexLightColor(c2);
                      const initColors = [
                        c1,
                        c1.toLowerCase() === c2.toLowerCase() || nearLightPair
                          ? isHexLightColor(c1)
                            ? '#1e3a8a'
                            : '#ffffff'
                          : c2,
                      ];
                      setBgConfig({
                        ...bgConfig,
                        type: nextType,
                        colors: initColors,
                        color1: initColors[0],
                        color2: initColors[1],
                      });
                      return;
                    }
                    setBgConfig({ ...bgConfig, type: nextType });
                  };

                  return (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-sky-600" />
                        背景カラー・パターン・枠デザイン設定
                      </h3>

                      {/* 1. 背景の塗り方・複数色スタイル */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          背景の色分け・塗り方
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-bold">
                          {BG_TYPE_OPTIONS.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleSelectBgType(t.id)}
                              className={`py-1.5 px-1.5 rounded-lg border transition ${
                                bgConfig.type === t.id
                                  ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. 背景色（AI背景 or 単色 or 複数色エディタ） */}
                      {bgConfig.type === 'ai' ? (
                        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 space-y-2.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                              AIデザイン適用中：{bgConfig.aiDesign?.title || 'カスタム背景'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectBgType('solid')}
                              className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-2 py-0.5 rounded-lg transition"
                            >
                              単色に戻す
                            </button>
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="font-bold text-slate-700">
                                AI背景の濃さ（文字を読みやすく控えめにもできます）
                              </span>
                              <NumericValueInput
                                value={bgConfig.aiDesign?.opacity ?? 100}
                                min={20}
                                max={100}
                                step={5}
                                unit="%"
                                textColorClass="text-violet-700"
                                ariaLabel="AI背景の濃さ数値"
                                onChange={(v) =>
                                  setBgConfig((prev) => ({
                                    ...prev,
                                    aiDesign: {
                                      ...(prev.aiDesign || {}),
                                      opacity: v,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              step="5"
                              value={bgConfig.aiDesign?.opacity ?? 100}
                              onChange={(e) =>
                                setBgConfig((prev) => ({
                                  ...prev,
                                  aiDesign: {
                                    ...(prev.aiDesign || {}),
                                    opacity: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-full accent-violet-600"
                              aria-label="AI背景の濃さ"
                            />
                          </div>
                          {(bgConfig.aiDesign?.opacity ?? 100) < 100 && (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-600">下地色：</span>
                              <input
                                type="color"
                                value={bgConfig.color1}
                                onChange={(e) =>
                                  updateBgColors([e.target.value, ...curBgColors.slice(1)])
                                }
                                className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                              />
                            </div>
                          )}
                        </div>
                      ) : bgConfig.type === 'solid' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            背景カラー
                          </label>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="color"
                              value={bgConfig.color1}
                              onChange={(e) =>
                                updateBgColors([e.target.value, ...curBgColors.slice(1)])
                              }
                              className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                            />
                            {COLOR_SWATCHES.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateBgColors([c, ...curBgColors.slice(1)])}
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
                      ) : (
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <label className="text-xs font-bold text-slate-700">
                              使用する背景色（{curBgColors.length}色 / 最大5色）
                            </label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const reversedSplits = curBgSplits
                                    .slice()
                                    .reverse()
                                    .map((s) => Math.round((100 - s) * 10) / 10);
                                  updateBgColors([...curBgColors].reverse(), reversedSplits);
                                }}
                                className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition"
                                title="色の順番を左右/上下反転"
                              >
                                <RefreshCw className="w-3 h-3" />
                                順番反転
                              </button>
                              {curBgColors.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSeed =
                                      COLOR_SWATCHES[curBgColors.length % COLOR_SWATCHES.length];
                                    updateBgColors([...curBgColors, nextSeed]);
                                  }}
                                  className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs transition"
                                >
                                  <Plus className="w-3 h-3" />
                                  色を追加
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 複数色ワンクリック配色プリセット */}
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 mb-1">
                              定番の組み合わせ：
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {BG_MULTI_PALETTES.map((pal) => (
                                <button
                                  key={pal.name}
                                  type="button"
                                  onClick={() => updateBgColors([...pal.colors])}
                                  className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white hover:border-sky-400 text-slate-700 flex items-center gap-1.5 transition"
                                >
                                  <span className="flex items-center -space-x-1">
                                    {pal.colors.map((pc, pi) => (
                                      <span
                                        key={pi}
                                        className="w-3 h-3 rounded-full border border-slate-300"
                                        style={{ backgroundColor: pc }}
                                      />
                                    ))}
                                  </span>
                                  <span>{pal.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 各色ピッカー＆スウォッチ */}
                          <div className="space-y-2">
                            {curBgColors.map((col, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 flex-wrap"
                              >
                                <span className="text-[11px] font-bold text-slate-600 w-9 shrink-0">
                                  色 {idx + 1}
                                </span>
                                <input
                                  type="color"
                                  value={col}
                                  onChange={(e) => {
                                    const next = [...curBgColors];
                                    next[idx] = e.target.value;
                                    updateBgColors(next);
                                  }}
                                  className="w-7 h-7 rounded cursor-pointer border border-slate-300 shrink-0"
                                />
                                <div className="flex items-center gap-1 flex-wrap flex-1">
                                  {COLOR_SWATCHES.slice(0, 10).map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() => {
                                        const next = [...curBgColors];
                                        next[idx] = c;
                                        updateBgColors(next);
                                      }}
                                      className={`w-5 h-5 rounded-full border transition ${
                                        col.toLowerCase() === c
                                          ? 'ring-2 ring-sky-500 scale-110'
                                          : 'border-slate-300'
                                      }`}
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                                </div>
                                {curBgColors.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateBgColors(curBgColors.filter((_, i) => i !== idx))
                                    }
                                    className="p-1 text-slate-400 hover:text-red-600 transition shrink-0"
                                    title="この色を削除"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {bgConfig.type === 'gradient' && (
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                グラデーション方向
                              </label>
                              <div className="grid grid-cols-4 gap-1.5 text-xs">
                                {[
                                  { id: 'horizontal', label: '左右 (横)' },
                                  { id: 'vertical', label: '上下 (縦)' },
                                  { id: 'diagonal', label: '斜め' },
                                  { id: 'radial', label: '中央放射' },
                                ].map((d) => (
                                  <button
                                    key={d.id}
                                    type="button"
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
                          )}

                          {/* 境界位置・割合・傾き調整 */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-700">
                                {bgConfig.type === 'split_lr'
                                  ? '左右分けの境界位置'
                                  : bgConfig.type === 'split_tb'
                                    ? '上下分けの境界位置'
                                    : bgConfig.type === 'split_diag'
                                      ? '斜め分けの境界位置・傾き'
                                      : bgConfig.type === 'gradient'
                                        ? 'グラデーションの境界位置'
                                        : '各色の幅バランス（%）'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setBgConfig((prev) => ({
                                    ...prev,
                                    colorSplits: getDefaultBgSplits(curBgColors.length),
                                    splitDiagSkew: 14,
                                    stripeOffset: 0,
                                    stripeAngle: 35,
                                  }))
                                }
                                className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                              >
                                位置をリセット
                              </button>
                            </div>

                            {/* 2色時の位置ショートカットチップ */}
                            {curBgColors.length === 2 && (
                              <div className="flex flex-wrap gap-1">
                                {[15, 25, 35, 50, 65, 75, 85].map((pct) => {
                                  const isActive = Math.round(curBgSplits[0] ?? 50) === pct;
                                  return (
                                    <button
                                      key={pct}
                                      type="button"
                                      onClick={() => updateBgSplitAt(0, pct)}
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                                        isActive
                                          ? 'bg-sky-600 border-sky-600 text-white'
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {pct === 50 ? '50% (中央)' : `${pct}%`}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 各境目スライダー */}
                            <div className="space-y-2">
                              {curBgSplits.map((splitVal, sIdx) => (
                                <div key={sIdx} className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-bold text-slate-600 flex items-center gap-1.5">
                                      <span>境目 {sIdx + 1}</span>
                                      <span className="inline-flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                                        <span
                                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                          style={{ backgroundColor: curBgColors[sIdx] }}
                                        />
                                        <span className="text-[9px] text-slate-400">▶</span>
                                        <span
                                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                          style={{ backgroundColor: curBgColors[sIdx + 1] }}
                                        />
                                      </span>
                                    </span>
                                    <NumericValueInput
                                      value={Math.round(splitVal)}
                                      min={1}
                                      max={99}
                                      step={1}
                                      unit="%"
                                      ariaLabel={`境目 ${sIdx + 1} の位置数値`}
                                      onChange={(v) => updateBgSplitAt(sIdx, v)}
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max="99"
                                    step="1"
                                    value={Math.round(splitVal)}
                                    onChange={(e) => updateBgSplitAt(sIdx, e.target.value)}
                                    className="w-full accent-sky-600"
                                    aria-label={`境目 ${sIdx + 1} の位置`}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* 斜め分け：傾き調整 */}
                            {bgConfig.type === 'split_diag' && (
                              <div className="pt-1.5 border-t border-slate-100">
                                <div className="flex justify-between items-center text-[11px] mb-1">
                                  <span className="font-bold text-slate-600">
                                    斜めの傾き（向き・角度）
                                  </span>
                                  <NumericValueInput
                                    value={bgConfig.splitDiagSkew ?? 14}
                                    min={-45}
                                    max={45}
                                    step={1}
                                    ariaLabel="斜め分けの傾き数値"
                                    onChange={(v) =>
                                      setBgConfig({
                                        ...bgConfig,
                                        splitDiagSkew: v,
                                      })
                                    }
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="-45"
                                  max="45"
                                  step="1"
                                  value={bgConfig.splitDiagSkew ?? 14}
                                  onChange={(e) =>
                                    setBgConfig({
                                      ...bgConfig,
                                      splitDiagSkew: Number(e.target.value),
                                    })
                                  }
                                  className="w-full accent-sky-600"
                                  aria-label="斜め分けの傾き"
                                />
                              </div>
                            )}
                          </div>

                          {(bgConfig.type === 'stripe_v' ||
                            bgConfig.type === 'stripe_h' ||
                            bgConfig.type === 'stripe_diag') && (
                            <div className="space-y-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
                              <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                  <span className="font-bold text-slate-700">
                                    しましまの細かさ（繰り返し数）
                                  </span>
                                  <NumericValueInput
                                    value={bgConfig.stripeDensity ?? 6}
                                    min={2}
                                    max={20}
                                    step={1}
                                    ariaLabel="しましまの細かさ数値"
                                    onChange={(v) =>
                                      setBgConfig({
                                        ...bgConfig,
                                        stripeDensity: v,
                                      })
                                    }
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="2"
                                  max="20"
                                  step="1"
                                  value={bgConfig.stripeDensity ?? 6}
                                  onChange={(e) =>
                                    setBgConfig({
                                      ...bgConfig,
                                      stripeDensity: Number(e.target.value),
                                    })
                                  }
                                  className="w-full accent-sky-600"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                  <span className="font-bold text-slate-700">
                                    しましまの位置（開始位置ズレ）
                                  </span>
                                  <NumericValueInput
                                    value={bgConfig.stripeOffset ?? 0}
                                    min={0}
                                    max={100}
                                    step={1}
                                    unit="%"
                                    ariaLabel="しましまの位置ズレ数値"
                                    onChange={(v) =>
                                      setBgConfig({
                                        ...bgConfig,
                                        stripeOffset: v,
                                      })
                                    }
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={bgConfig.stripeOffset ?? 0}
                                  onChange={(e) =>
                                    setBgConfig({
                                      ...bgConfig,
                                      stripeOffset: Number(e.target.value),
                                    })
                                  }
                                  className="w-full accent-sky-600"
                                  aria-label="しましまの位置ズレ"
                                />
                              </div>
                              {bgConfig.type === 'stripe_diag' && (
                                <div>
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="font-bold text-slate-700">
                                      斜めの角度
                                    </span>
                                    <NumericValueInput
                                      value={bgConfig.stripeAngle ?? 35}
                                      min={5}
                                      max={175}
                                      step={1}
                                      unit="°"
                                      ariaLabel="斜めしましまの角度数値"
                                      onChange={(v) =>
                                        setBgConfig({
                                          ...bgConfig,
                                          stripeAngle: v,
                                        })
                                      }
                                    />
                                  </div>
                                  <input
                                    type="range"
                                    min="5"
                                    max="175"
                                    step="1"
                                    value={bgConfig.stripeAngle ?? 35}
                                    onChange={(e) =>
                                      setBgConfig({
                                        ...bgConfig,
                                        stripeAngle: Number(e.target.value),
                                      })
                                    }
                                    className="w-full accent-sky-600"
                                    aria-label="斜めしましまの角度"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2.5 AI自由背景デザイン生成（ボタンにないデザインを作成） */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-200 rounded-xl p-3 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                              ✨ AIに自由な背景を作ってもらう
                            </div>
                            <span className="text-[10px] font-bold text-violet-600 bg-white/80 px-2 py-0.5 rounded-full border border-violet-200">
                              ボタン外デザイン対応
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            炎・稲妻・日の丸・桜吹雪・芝生・和柄・青空など、作りたい背景のイメージを自由に入力すると AI が3案デザインします。
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {AI_BG_IDEA_CHIPS.map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => setAiBgPrompt(chip)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                                  aiBgPrompt === chip
                                    ? 'bg-violet-600 border-violet-600 text-white font-bold'
                                    : 'bg-white border-violet-200 text-violet-800 hover:bg-violet-100'
                                }`}
                              >
                                {chip}
                              </button>
                            ))}
                          </div>

                          <textarea
                            rows={2}
                            data-native-undo="true"
                            value={aiBgPrompt}
                            onChange={(e) => setAiBgPrompt(e.target.value)}
                            placeholder="例：黒地に燃え上がる赤い炎と金色の稲妻が走る背景、日本の日の丸と金色集中線など"
                            className="w-full text-xs border border-violet-200 rounded-lg px-2.5 py-2 bg-white focus:ring-2 focus:ring-violet-400 outline-none"
                          />

                          <button
                            type="button"
                            onClick={generateAiBackgrounds}
                            disabled={isAiBgLoading}
                            className="w-full py-2 bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                          >
                            {isAiBgLoading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>AIが背景デザインを作成中...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>✨ AIで背景デザインを作成する（3案）</span>
                              </>
                            )}
                          </button>

                          {aiBgError && (
                            <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>{aiBgError}</span>
                            </div>
                          )}

                          {aiBgIdeas.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <div className="text-[11px] font-bold text-slate-700">
                                AI提案デザイン（クリックで切り替え）
                              </div>
                              <div className="space-y-2">
                                {aiBgIdeas.map((idea, idx) => {
                                  const isApplied =
                                    bgConfig.type === 'ai' &&
                                    bgConfig.aiDesign?.svgInner === idea.svgInner &&
                                    bgConfig.aiDesign?.title === idea.title;
                                  const thumbSvg = sanitizeAiBgSvgInner(
                                    idea.svgInner,
                                    `aibg-thumb-${idx}`
                                  );
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => applyAiBgIdea(idea)}
                                      className={`w-full text-left rounded-lg border p-2 transition space-y-1.5 ${
                                        isApplied
                                          ? 'bg-violet-100/70 border-violet-500 ring-1 ring-violet-400'
                                          : 'bg-white border-slate-200 hover:border-violet-400'
                                      }`}
                                    >
                                      {thumbSvg && (
                                        <svg
                                          viewBox={`0 0 ${idea.viewBoxW || 1200} ${idea.viewBoxH || 300}`}
                                          preserveAspectRatio="xMidYMid slice"
                                          className="w-full h-12 rounded border border-slate-200 bg-slate-100"
                                          dangerouslySetInnerHTML={{ __html: thumbSvg }}
                                        />
                                      )}
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-slate-800 truncate">
                                          {idea.title}
                                        </span>
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 ${
                                            isApplied
                                              ? 'bg-violet-600 text-white'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}
                                        >
                                          {isApplied ? (
                                            <>
                                              <Check className="w-3 h-3" />
                                              適用中
                                            </>
                                          ) : (
                                            'これを適用'
                                          )}
                                        </span>
                                      </div>
                                      {idea.description && (
                                        <p className="text-[10px] text-slate-500 line-clamp-2">
                                          {idea.description}
                                        </p>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3. 背景パターン模様 */}
                      <div className="pt-2 border-t border-slate-200 space-y-2.5">
                        <label className="block text-xs font-bold text-slate-700">
                          背景パターン模様（{BG_PATTERN_OPTIONS.length}種）
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {BG_PATTERN_OPTIONS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setBgConfig({ ...bgConfig, pattern: p.id })}
                              className={`py-1.5 px-2 rounded border text-left font-medium transition ${
                                bgConfig.pattern === p.id
                                  ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>

                        {bgConfig.pattern !== 'none' && (
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">
                                模様の色味
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-[11px]">
                                {[
                                  { id: 'auto', label: '自動' },
                                  { id: 'light', label: '白系' },
                                  { id: 'dark', label: '黒系' },
                                ].map((tone) => (
                                  <button
                                    key={tone.id}
                                    type="button"
                                    onClick={() =>
                                      setBgConfig({ ...bgConfig, patternTone: tone.id })
                                    }
                                    className={`py-1 rounded border font-bold ${
                                      (bgConfig.patternTone || 'auto') === tone.id
                                        ? 'bg-sky-600 text-white border-sky-600'
                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    {tone.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-[11px] mb-1">
                                <span className="font-bold text-slate-600">模様の濃さ</span>
                                <NumericValueInput
                                  value={Math.round((bgConfig.patternStrength ?? 1) * 100)}
                                  min={40}
                                  max={250}
                                  step={10}
                                  unit="%"
                                  ariaLabel="模様の濃さ数値"
                                  onChange={(v) =>
                                    setBgConfig({
                                      ...bgConfig,
                                      patternStrength: Math.round((v / 100) * 10) / 10,
                                    })
                                  }
                                />
                              </div>
                              <input
                                type="range"
                                min="0.4"
                                max="2.5"
                                step="0.1"
                                value={bgConfig.patternStrength ?? 1}
                                onChange={(e) =>
                                  setBgConfig({
                                    ...bgConfig,
                                    patternStrength: Number(e.target.value),
                                  })
                                }
                                className="w-full accent-sky-600"
                              />
                            </div>
                          </div>
                        )}
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
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-bold text-slate-700">枠の太さ</span>
                            <NumericValueInput
                              value={bgConfig.borderWidth}
                              min={1}
                              max={10}
                              step={0.5}
                              ariaLabel="枠の太さ数値"
                              onChange={(v) => setBgConfig({ ...bgConfig, borderWidth: v })}
                            />
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
                  );
                })()}

                {/* 横断幕のサイズ指定 */}
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
                      <span className="font-bold text-slate-700">横幅 (W): 60〜1000cm</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="60"
                          max="1000"
                          value={bannerWidth}
                          onChange={(e) =>
                            setBannerWidth(Math.max(60, Math.min(1000, Number(e.target.value) || 60)))
                          }
                          className="w-16 text-right font-bold border border-slate-300 rounded px-1.5 py-0.5 bg-white"
                        />
                        <span className="text-slate-600">cm</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="1000"
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
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-700">比較する人物の身長</span>
                      <NumericValueInput
                        value={personHeight}
                        min={130}
                        max={195}
                        step={1}
                        unit="cm"
                        ariaLabel="人物の身長数値"
                        onChange={(v) => setPersonHeight(v)}
                      />
                    </div>
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
                    <div className="grid grid-cols-5 gap-1.5 text-xs">
                      {[2, 3, 4, 5, 6].map((num) => (
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

            {/* ==================== タブ5: テンプレート・画像取り込み ==================== */}
            {activeTab === 'template' && (
              <div className="space-y-4">
                {/* ★移設：AI画像OCR文字読み取り＆デザイン復元セクション */}
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
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-slate-600">画像の濃さ</span>
                            <NumericValueInput
                              value={bgImage.opacity}
                              min={10}
                              max={100}
                              step={5}
                              unit="%"
                              ariaLabel="背景画像の濃さ数値"
                              onChange={(v) => setBgImage({ ...bgImage, opacity: v })}
                            />
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
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-slate-600">背景の明暗補正</span>
                            <NumericValueInput
                              value={bgImage.darkOverlay}
                              min={-70}
                              max={70}
                              step={5}
                              unit="%"
                              ariaLabel="背景の明暗補正数値"
                              onChange={(v) => setBgImage({ ...bgImage, darkOverlay: v })}
                            />
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

                {/* サンプルテンプレート一覧 */}
                <div className="space-y-3 pt-1 border-t border-slate-200">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      デザインテンプレート
                    </h3>
                    <p className="text-xs text-slate-600">
                      用途に合わせたデザインテンプレートをワンクリックで呼び出せます。呼び出した後に文言やサイズを自由に変更できます。
                    </p>
                  </div>
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
              </div>
            )}

            {/* === タブ6: 全体表示（現在のデザイン状態一覧ダッシュボード） === */}
            {activeTab === 'overview' && (() => {
              const bgTypeLabel =
                bgConfig.type === 'ai'
                  ? `AI背景（${bgConfig.aiDesign?.title || 'カスタム背景'}）`
                  : BG_TYPE_OPTIONS.find((t) => t.id === bgConfig.type)?.label || bgConfig.type;
              const rawBgColors = getBgColorsFromConfig(bgConfig);
              const bgColors =
                bgConfig.type === 'solid'
                  ? [rawBgColors[0] || bgConfig.color1 || '#ffffff']
                  : rawBgColors;
              const bgSplits = getBgSplitPositions(bgConfig, bgColors.length);
              const patternLabel =
                BG_PATTERN_OPTIONS.find((p) => p.id === (bgConfig.pattern || 'none'))?.label ||
                'なし';
              const patternToneLabel =
                bgConfig.patternTone === 'light'
                  ? '白系'
                  : bgConfig.patternTone === 'dark'
                    ? '黒系'
                    : '自動';
              const borderStyleMap = {
                none: 'なし',
                single: '一本線',
                double: '二重枠',
                inner_frame: '外周太枠',
              };
              const borderLabel = borderStyleMap[bgConfig.borderStyle || 'none'] || 'なし';
              const holdStyleMap = {
                hands: '胸の前で持つ',
                waist: '腰の位置で持つ',
                high: '頭上に高く掲げる',
                fence: '屋外フェンス掲示',
              };
              const holdStyleLabel = holdStyleMap[holdStyle] || holdStyle;
              const bgFitMap = {
                stretch: '枠いっぱい伸縮',
                cover: '比率維持(切抜)',
                contain: '比率維持(全体)',
              };
              const areaM2 = ((bannerWidth * bannerHeight) / 10000).toFixed(2);
              const aspectRatioText = `${(bannerWidth / Math.max(1, bannerHeight)).toFixed(2)} : 1`;
              const plannedFilename = buildBannerDownloadFilename(texts, '', exportFormat);

              const handleCopyOverviewText = async () => {
                const textSummaryLines = texts.map((t, idx) => {
                  const effects = getTextEffects(t)
                    .map((eid) => TEXT_EFFECT_OPTIONS.find((o) => o.id === eid)?.label || eid)
                    .join('・');
                  const body = (t.text || '（空白）').replace(/\n/g, ' / ');
                  return `  ${idx + 1}. 「${body}」 | フォント:${getFontDisplayName(t.fontId)} | ${t.isVertical ? '縦書' : '横書'} | サイズ:${t.fontSize} 字間:${t.letterSpacing ?? 0} | 文字色:${t.color} | フチ:${(t.strokeWidth || 0) > 0 ? `${t.strokeColor}(太さ${t.strokeWidth})` : 'なし'} | 回転:${t.rotation || 0}° 斜体:${t.skewAngle || 0}° | 座標:(${Math.round(t.x * 10) / 10}%, ${Math.round(t.y * 10) / 10}%)${effects ? ` | 効果:${effects}` : ''}`;
                });
                const imgSummaryLines = imageLayers.map(
                  (img, idx) =>
                    `  ${idx + 1}. ${img.name} | 幅:${img.widthPercent}% | 回転:${img.rotation}° | 不透明度:${img.opacity}% | 順:${img.zOrder === 'behind' ? '文字の背面' : '文字の前面'} | 座標:(${Math.round(img.x * 10) / 10}%, ${Math.round(img.y * 10) / 10}%)`
                );
                const fullReport = [
                  '【横断幕デザイン 全体状態メモ】',
                  `■ サイズ: 横 ${bannerWidth}cm × 縦 ${bannerHeight}cm (面積 ${areaM2}m² / 比率 ${aspectRatioText})`,
                  `■ 背景種別: ${bgTypeLabel}`,
                  `■ 背景カラー: ${bgConfig.type === 'ai' ? `AIデザイン (${bgConfig.aiDesign?.opacity ?? 100}%)` : bgColors.join(', ')}${bgConfig.type !== 'ai' && bgColors.length >= 2 ? ` [境界: ${bgSplits.map((s) => `${Math.round(s)}%`).join(', ')}]` : ''}`,
                  `■ 模様: ${patternLabel}${bgConfig.pattern && bgConfig.pattern !== 'none' ? ` (${patternToneLabel} / 濃さ${Math.round((bgConfig.patternStrength ?? 1) * 100)}%)` : ''}`,
                  `■ 枠線: ${borderLabel}${bgConfig.borderStyle && bgConfig.borderStyle !== 'none' ? ` (${bgConfig.borderColor} / 太さ${bgConfig.borderWidth ?? 2})` : ''}`,
                  `■ ハトメ: ${bgConfig.grommets ? 'あり' : 'なし'}`,
                  `■ 全体背景画像: ${bgImage ? `${bgImage.name} (${bgImage.naturalWidth}x${bgImage.naturalHeight}px, ${bgFitMap[bgImage.fitMode] || bgImage.fitMode}, 濃さ${bgImage.opacity}%, 暗さ${bgImage.darkOverlay}%)` : 'なし'}`,
                  `■ 文字レイヤー (${texts.length}件 / 表示:${showTextsOnBanner ? 'ON' : 'OFF'}):`,
                  ...(textSummaryLines.length > 0 ? textSummaryLines : ['  なし']),
                  `■ 追加画像レイヤー (${imageLayers.length}件):`,
                  ...(imgSummaryLines.length > 0 ? imgSummaryLines : ['  なし']),
                  `■ 人物比較条件: ${personCount}人 / 身長${personHeight}cm / ${holdStyleLabel}`,
                  `■ 保存設定: ${exportFormat.toUpperCase()} (${plannedFilename})`,
                ].join('\n');

                try {
                  if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(fullReport);
                  } else {
                    const ta = document.createElement('textarea');
                    ta.value = fullReport;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                  }
                  showToast('デザイン全体の仕様テキストをコピーしました');
                } catch {
                  showToast('クリップボードへのコピーに失敗しました');
                }
              };

              return (
                <div className="space-y-4" data-testid="overview-panel">
                  {/* 上部サマリーバナー＆仕様コピー */}
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50/70 to-sky-50 border border-emerald-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>デザイン全体の状態一覧</span>
                        </h3>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          サイズ・背景色・全文字のフォント/色/装飾・ロゴ配置・書き出し設定をまとめて確認できます。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyOverviewText}
                        data-testid="overview-copy-btn"
                        className="shrink-0 bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 transition"
                        title="現在のデザイン仕様をテキストとしてコピー"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>仕様コピー</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-white/90 rounded-lg border border-emerald-100 py-1.5 px-1">
                        <div className="text-[10px] text-slate-500">サイズ</div>
                        <div className="text-[11px] font-extrabold text-slate-800 truncate">
                          {bannerWidth}×{bannerHeight}
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg border border-emerald-100 py-1.5 px-1">
                        <div className="text-[10px] text-slate-500">文字数</div>
                        <div className="text-[11px] font-extrabold text-sky-700">
                          {texts.length}件
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg border border-emerald-100 py-1.5 px-1">
                        <div className="text-[10px] text-slate-500">追加画像</div>
                        <div className="text-[11px] font-extrabold text-emerald-700">
                          {imageLayers.length}件
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg border border-emerald-100 py-1.5 px-1">
                        <div className="text-[10px] text-slate-500">保存形式</div>
                        <div className="text-[11px] font-extrabold text-amber-700">
                          {exportFormat.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. 基本サイズ ＆ キャンバス表示状態 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Grid className="w-3.5 h-3.5 text-sky-600" />
                        サイズ・表示・人物比較の状態
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab('size_bg')}
                          className="text-[10px] font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 px-2 py-0.5 rounded transition"
                        >
                          サイズ変更
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('human')}
                          className="text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition"
                        >
                          比較調整
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white rounded-lg border border-slate-200/80 p-2">
                        <div className="text-[10px] text-slate-500">幕の実寸・比率・面積</div>
                        <div className="font-bold text-slate-800 mt-0.5">
                          横 {bannerWidth}cm × 縦 {bannerHeight}cm
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          比率 {aspectRatioText} / {areaM2}m²
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200/80 p-2">
                        <div className="text-[10px] text-slate-500">人物比較シチュエーション</div>
                        <div className="font-bold text-slate-800 mt-0.5">
                          {personCount}人（身長 {personHeight}cm）
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                          {holdStyleLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          showTextsOnBanner
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        文字表示: {showTextsOnBanner ? 'ON' : 'OFF (背景のみ)'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          showGrid
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        ガイド線: {showGrid ? 'ON' : 'OFF'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          showDimensionLines
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        寸法ガイド: {showDimensionLines ? 'ON' : 'OFF'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full border bg-white text-slate-600 border-slate-200">
                        表示モード:{' '}
                        {viewMode === 'split'
                          ? '上下分割'
                          : viewMode === 'edit'
                            ? '編集拡大'
                            : '実寸比較'}
                      </span>
                    </div>
                  </div>

                  {/* 2. 背景・模様・枠線・ハトメ・全体画像 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-sky-600" />
                        背景・模様・枠線・ハトメ
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab('size_bg')}
                        className="text-[10px] font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 px-2 py-0.5 rounded transition"
                      >
                        背景を編集
                      </button>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">塗り方・スタイル</span>
                        <span className="font-bold text-slate-800">{bgTypeLabel}</span>
                      </div>

                      {bgConfig.type === 'ai' ? (
                        <div className="flex items-center justify-between gap-2 bg-violet-50 border border-violet-200 rounded-md px-2 py-1 text-violet-900">
                          <span className="flex items-center gap-1 font-bold truncate">
                            <Wand2 className="w-3 h-3 text-violet-600 shrink-0" />
                            {bgConfig.aiDesign?.title || 'AIカスタム背景'}
                          </span>
                          <span className="text-[10px] shrink-0">
                            濃さ {bgConfig.aiDesign?.opacity ?? 100}%
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">配色カラー ({bgColors.length}色)</span>
                            {bgColors.length >= 2 && (
                              <span className="text-[10px] text-slate-500">
                                境界: {bgSplits.map((s) => `${Math.round(s)}%`).join(' / ')}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {bgColors.map((col, idx) => (
                              <span
                                key={`${col}-${idx}`}
                                className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-700"
                              >
                                <span
                                  className="w-3 h-3 rounded-sm border border-slate-300 shrink-0"
                                  style={{ backgroundColor: col }}
                                />
                                {col.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                        <div className="bg-slate-50 rounded p-1.5">
                          <div className="text-slate-500">背景模様</div>
                          <div className="font-bold text-slate-800 truncate">{patternLabel}</div>
                          {bgConfig.pattern && bgConfig.pattern !== 'none' && (
                            <div className="text-slate-500">
                              {patternToneLabel} / {Math.round((bgConfig.patternStrength ?? 1) * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-50 rounded p-1.5">
                          <div className="text-slate-500">周囲の枠線</div>
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            {bgConfig.borderStyle && bgConfig.borderStyle !== 'none' && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: bgConfig.borderColor || '#000000' }}
                              />
                            )}
                            <span className="truncate">{borderLabel}</span>
                          </div>
                          {bgConfig.borderStyle && bgConfig.borderStyle !== 'none' && (
                            <div className="text-slate-500">太さ {bgConfig.borderWidth ?? 2}</div>
                          )}
                        </div>
                        <div className="bg-slate-50 rounded p-1.5">
                          <div className="text-slate-500">ハトメ穴</div>
                          <div
                            className={`font-bold ${
                              bgConfig.grommets ? 'text-emerald-700' : 'text-slate-700'
                            }`}
                          >
                            {bgConfig.grommets ? 'あり (表示中)' : 'なし'}
                          </div>
                        </div>
                      </div>

                      {/* 全体背景画像の状態 */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-slate-500 shrink-0">全体読込画像</span>
                        {bgImage ? (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src={bgImage.dataUrl}
                              alt={bgImage.name}
                              className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <div className="text-right min-w-0">
                              <div className="font-bold text-slate-800 truncate text-[10px]">
                                {bgImage.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {bgFitMap[bgImage.fitMode] || bgImage.fitMode} / 濃さ{bgImage.opacity}% / 暗さ{bgImage.darkOverlay}%
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">なし（背景色・模様を使用中）</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. 文字レイヤー全体一覧 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-sky-600" />
                        文字レイヤー一覧（{texts.length}件）
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500">
                        選択中: {effectiveSelectedTextIds.length}件
                      </span>
                    </div>

                    {texts.length === 0 ? (
                      <div className="bg-white rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                        文字レイヤーがありません。「文言」タブから追加できます。
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {texts.map((item, idx) => {
                          const isSelected = effectiveSelectedTextIds.includes(item.id);
                          const itemEffects = getTextEffects(item);
                          return (
                            <div
                              key={item.id}
                              data-testid={`overview-text-card-${idx}`}
                              className={`bg-white rounded-lg border p-2.5 space-y-1.5 transition ${
                                isSelected
                                  ? 'border-sky-500 ring-1 ring-sky-200 shadow-xs'
                                  : 'border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                      #{idx + 1}
                                    </span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {item.isVertical ? '縦書' : '横書'}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                                        選択中
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-extrabold text-slate-900 mt-1 break-words">
                                    {item.text ? item.text.replace(/\n/g, ' / ') : '（空白テキスト）'}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveLayerType('text');
                                    setSelectedTextId(item.id);
                                    setSelectedTextIds([item.id]);
                                    setActiveTab('text');
                                  }}
                                  className="shrink-0 text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 px-2 py-1 rounded transition"
                                >
                                  編集
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                                <div className="truncate" title={getFontDisplayName(item.fontId)}>
                                  書体: <span className="font-bold text-slate-800">{getFontDisplayName(item.fontId)}</span>
                                </div>
                                <div>
                                  サイズ: <span className="font-bold text-slate-800">{item.fontSize}</span> / 字間 <span className="font-bold text-slate-800">{item.letterSpacing ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-1 truncate">
                                  <span>色:</span>
                                  <span
                                    className="w-2.5 h-2.5 rounded-sm border border-slate-300 shrink-0"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="font-mono">{(item.color || '').toUpperCase()}</span>
                                  {(item.strokeWidth || 0) > 0 && (
                                    <>
                                      <span className="text-slate-400">/フチ</span>
                                      <span
                                        className="w-2.5 h-2.5 rounded-sm border border-slate-300 shrink-0"
                                        style={{ backgroundColor: item.strokeColor }}
                                      />
                                      <span>{item.strokeWidth}</span>
                                    </>
                                  )}
                                </div>
                                <div>
                                  位置: <span className="font-bold text-slate-800">X {Math.round(item.x * 10) / 10}%</span>・<span className="font-bold text-slate-800">Y {Math.round(item.y * 10) / 10}%</span>
                                </div>
                              </div>

                              {(itemEffects.length > 0 || (item.rotation || 0) !== 0 || (item.skewAngle || 0) !== 0) && (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {(item.rotation || 0) !== 0 && (
                                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                      回転 {item.rotation > 0 ? `+${item.rotation}°` : `${item.rotation}°`}
                                    </span>
                                  )}
                                  {(item.skewAngle || 0) !== 0 && (
                                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                      斜体 {item.skewAngle > 0 ? `+${item.skewAngle}°` : `${item.skewAngle}°`}
                                    </span>
                                  )}
                                  {itemEffects.map((eid) => {
                                    const label =
                                      TEXT_EFFECT_OPTIONS.find((o) => o.id === eid)?.label || eid;
                                    return (
                                      <span
                                        key={eid}
                                        className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium"
                                      >
                                        {label}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. 追加ロゴ・イラスト画像レイヤー */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        追加ロゴ・イラスト画像（{imageLayers.length}件）
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab('text')}
                        className="text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded transition"
                      >
                        画像管理へ
                      </button>
                    </div>
                    {imageLayers.length === 0 ? (
                      <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 text-[11px] text-slate-500">
                        追加されたロゴ・イラスト画像はありません。
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {imageLayers.map((imgItem, idx) => (
                          <div
                            key={imgItem.id}
                            className="bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-between gap-2 text-[11px]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={imgItem.dataUrl}
                                alt={imgItem.name}
                                className="w-8 h-8 object-contain rounded bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 truncate">
                                  #{idx + 1} {imgItem.name}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  幅 {imgItem.widthPercent}% / 回転 {imgItem.rotation}° / 濃さ {imgItem.opacity}% /{' '}
                                  {imgItem.zOrder === 'behind' ? '文字背面' : '文字前面'} / X {Math.round(imgItem.x * 10) / 10}%・Y {Math.round(imgItem.y * 10) / 10}%
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImageId(imgItem.id);
                                setActiveLayerType('image');
                                setActiveTab('text');
                              }}
                              className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 px-2 py-1 rounded transition"
                            >
                              編集
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. 書き出し・保存・共有の現在設定 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      保存形式・お気に入り・共有設定
                    </h4>
                    <div className="bg-white rounded-lg border border-slate-200/80 p-2.5 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">選択中の保存形式</span>
                        <span className="font-bold text-slate-800">
                          {exportFormat.toUpperCase()} 形式
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 shrink-0">出力ファイル名</span>
                        <span className="font-mono text-[10px] text-slate-700 truncate">
                          {plannedFilename}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">お気に入り保存数</span>
                        <button
                          type="button"
                          onClick={() => setIsFavoritesOpen(true)}
                          className="font-bold text-pink-600 hover:underline flex items-center gap-1"
                        >
                          <Heart className="w-3 h-3" />
                          <span>{favorites.length}件（比較一覧を開く）</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() =>
                          downloadSvgAsFormat(
                            svgEditRef.current,
                            plannedFilename,
                            1800,
                            exportFormat
                          )
                        }
                        className="py-2 px-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>{exportFormat.toUpperCase()}保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveFavorite}
                        className="py-2 px-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                      >
                        <Star className="w-3.5 h-3.5 shrink-0" />
                        <span>お気に入り</span>
                      </button>
                      <button
                        type="button"
                        onClick={openShareModal}
                        className="py-2 px-1.5 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-bold flex items-center justify-center gap-1 shadow-xs transition"
                      >
                        <Share2 className="w-3.5 h-3.5 shrink-0" />
                        <span>LINE/共有</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </aside>

        {/* 右側：メインプレビューキャンバス領域 */}
        <main
          onMouseDown={(e) => {
            if (!e.target.closest('button, select, input, textarea, label, a')) {
              clearTextSelection();
            }
          }}
          onTouchStart={(e) => {
            if (!e.target.closest('button, select, input, textarea, label, a')) {
              clearTextSelection();
            }
          }}
          className="flex-1 bg-slate-200/70 p-3 sm:p-5 overflow-y-auto flex flex-col gap-4 lg:h-[calc(100vh-56px)]"
        >
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
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    お気に入りに保存
                  </button>
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
                  {renderExpandToggleButton('edit')}
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
                    {[2, 3, 4, 5, 6].map((n) => (
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

                  {renderExpandToggleButton('scale')}
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

      {/* フォント一覧ギャラリーモーダル */}
      {isFontGalleryOpen && selectedText && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-3"
          onClick={() => setIsFontGalleryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 bg-slate-900 text-white flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <Grid className="w-4 h-4 text-sky-400 shrink-0" />
                <h2 className="text-xs sm:text-sm font-bold truncate">
                  フォント一覧ギャラリー（全 {fontCatalog.length} 種 / 表示中 {filteredFonts.length} 種）
                </h2>
                <span className="text-[11px] text-slate-300 truncate hidden sm:inline">
                  {isFontApplyAll && texts.length > 1
                    ? `— クリックですべての文字（${texts.length}件）に一括適用`
                    : `— クリックで選択中の文字「${selectedText.text.replace(/\n/g, ' ')}」に即適用`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {texts.length > 1 && (
                  <>
                    <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setIsFontApplyAll(false)}
                        className={`px-2 py-1 rounded-md transition ${
                          !isFontApplyAll
                            ? 'bg-sky-600 text-white shadow'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        選択中のみ
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFontApplyAll(true)}
                        className={`px-2 py-1 rounded-md transition ${
                          isFontApplyAll
                            ? 'bg-indigo-500 text-white shadow'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        全文字に適用
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        applyFontToTexts(selectedText.fontId);
                        setIsFontGalleryOpen(false);
                      }}
                      className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      title={`現在選択中のフォント「${getFontDisplayName(selectedText.fontId)}」を全文字へコピー`}
                    >
                      <Copy className="w-3 h-3" />
                      <span className="hidden md:inline">現在のフォントを全文字へ</span>
                      <span className="md:hidden">全文字へ統一</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsFontGalleryOpen(false)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0"
                  title="閉じる"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-3 py-2 border-b border-slate-200 bg-slate-50/70">
              {renderFontFilterBar(true)}
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 content-start">
              {filteredFonts.length > 0 ? (
                filteredFonts.map((f) => renderFontItemCard(f, true))
              ) : (
                <div className="col-span-full text-center py-10 space-y-3">
                  <p className="text-sm text-slate-500">
                    「{fontSearchQuery}」に一致するフォントが見つかりません
                  </p>
                  {fontSearchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => handleLoadGoogleFontByName(fontSearchQuery)}
                      disabled={isLoadingFont}
                      className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition"
                    >
                      <Globe className="w-4 h-4" />
                      Google Fontsから「{fontSearchQuery.trim()}」を読み込む
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* お気に入り一覧・比較モーダル */}
      {isFavoritesOpen && (() => {
        const displayedFavorites =
          favoriteCompareOnly && selectedFavoriteIds.length > 0
            ? favorites.filter((f) => selectedFavoriteIds.includes(f.id))
            : favorites;
        const maxFavWidth = Math.max(...displayedFavorites.map((f) => f.width), 1);

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
            onClick={() => setIsFavoritesOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[96vw] max-h-[94vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400 shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold truncate">
                    お気に入りデザイン一覧・比較（保存済み {favorites.length} 件）
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    現在のデザインを追加
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFavoritesOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    title="閉じる"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 比較コントロールバー */}
              {favorites.length > 0 && (
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                      <span className="text-[11px] text-slate-500 px-1.5 font-medium">表示列:</span>
                      {[1, 2, 3].map((cols) => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => setFavoriteCols(cols)}
                          className={`px-2 py-1 rounded-md font-bold transition ${
                            favoriteCols === cols
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cols}列
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setFavoriteScaleCompare((prev) => !prev)}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition ${
                        favoriteScaleCompare
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="オンにすると横幅(cm)の実寸比率を揃えてサイズ差を比較できます"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      {favoriteScaleCompare ? '実寸比(cm)で比較中' : '横幅を揃えて表示中'}
                    </button>

                    <button
                      type="button"
                      disabled={selectedFavoriteIds.length === 0}
                      onClick={() => setFavoriteCompareOnly((prev) => !prev)}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold transition disabled:opacity-45 ${
                        favoriteCompareOnly && selectedFavoriteIds.length > 0
                          ? 'bg-pink-600 border-pink-600 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      チェックした案のみ比較 ({selectedFavoriteIds.length}件)
                    </button>
                    {selectedFavoriteIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFavoriteIds([]);
                          setFavoriteCompareOnly(false);
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                      >
                        チェック解除
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    ※データはこのブラウザ内（localStorage）に自動保存されます
                  </p>
                </div>
              )}

              {/* 一覧・比較グリッド */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-100/80">
                {displayedFavorites.length === 0 ? (
                  <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center space-y-3 py-10">
                    <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">
                        まだお気に入りデザインがありません
                      </p>
                      <p className="text-xs text-slate-500">
                        作成した横断幕のパターンを保存して、フォントや配色・サイズ違いを並べて見比べられます。
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveFavorite}
                      className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5 transition"
                    >
                      <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                      今のデザインをお気に入りに保存する
                    </button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-3 ${
                      favoriteCols === 1
                        ? 'grid-cols-1'
                        : favoriteCols === 2
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}
                  >
                    {displayedFavorites.map((fav) => {
                      const isChecked = selectedFavoriteIds.includes(fav.id);
                      const isRenaming = editingFavoriteId === fav.id;
                      const fontNames = Array.from(
                        new Set(
                          (fav.texts || []).map((t) => {
                            const f = fontCatalog.find((fc) => fc.id === t.fontId);
                            return f ? f.name.split(' (')[0] : t.fontId;
                          })
                        )
                      ).join(', ');
                      const scaleWidthPercent = favoriteScaleCompare
                        ? Math.max(18, (fav.width / maxFavWidth) * 100)
                        : 100;

                      return (
                        <div
                          key={fav.id}
                          className={`bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden transition ${
                            isChecked ? 'border-pink-500 ring-2 ring-pink-200' : 'border-slate-200'
                          }`}
                        >
                          {/* カードヘッダー */}
                          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFavoriteCompareCheck(fav.id)}
                                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 cursor-pointer shrink-0"
                                title="比較候補としてチェック"
                              />
                              {isRenaming ? (
                                <div className="flex items-center gap-1 flex-1 min-w-0">
                                  <input
                                    type="text"
                                    data-native-undo="true"
                                    value={editingFavoriteTitle}
                                    onChange={(e) => setEditingFavoriteTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleCommitRenameFavorite(fav.id);
                                      if (e.key === 'Escape') setEditingFavoriteId(null);
                                    }}
                                    autoFocus
                                    className="flex-1 min-w-0 px-2 py-0.5 text-xs border border-sky-400 rounded bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleCommitRenameFavorite(fav.id)}
                                    className="px-2 py-0.5 text-[11px] bg-sky-600 text-white rounded font-bold"
                                  >
                                    OK
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                  <h3
                                    className="text-xs font-bold text-slate-800 truncate"
                                    title={fav.title}
                                  >
                                    {fav.title}
                                  </h3>
                                  <button
                                    type="button"
                                    onClick={() => handleStartRenameFavorite(fav)}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 shrink-0"
                                    title="名前を変更"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded shrink-0">
                              {fav.width} × {fav.height} cm
                            </span>
                          </div>

                          {/* 横断幕 高精細SVGプレビュー */}
                          <div className="p-3 bg-slate-800 flex items-center justify-center min-h-[110px]">
                            <div
                              className="flex items-center justify-center transition-all"
                              style={{ width: `${scaleWidthPercent}%` }}
                            >
                              <svg
                                viewBox={`0 0 ${fav.width} ${fav.height}`}
                                className="w-full max-h-48 shadow-lg border border-slate-600"
                                style={{ aspectRatio: `${fav.width} / ${fav.height}` }}
                              >
                                {renderBannerArtwork(`fav-${fav.id}`, false, fav)}
                              </svg>
                            </div>
                          </div>

                          {/* メタ情報 ＆ 操作ボタン */}
                          <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] bg-white">
                            <div className="text-slate-500 truncate min-w-0 max-w-full">
                              書体: <span className="font-medium text-slate-700">{fontNames || 'なし'}</span>
                            </div>

                            <div className="flex items-center gap-1.5 ml-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => handleLoadFavorite(fav)}
                                className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1 transition"
                              >
                                <RefreshCw className="w-3 h-3" />
                                これを編集
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  const card = e.currentTarget.closest('.bg-white.rounded-xl');
                                  const svgEl = card?.querySelector('svg');
                                  if (svgEl) {
                                    downloadSvgAsFormat(
                                      svgEl,
                                      buildBannerDownloadFilename(fav.texts || [], '', exportFormat),
                                      1800,
                                      exportFormat
                                    );
                                  }
                                }}
                                className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition"
                                title={`${exportFormat.toUpperCase()}形式で保存`}
                              >
                                <Download className="w-3 h-3" />
                                {exportFormat.toUpperCase()}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFavorite(fav.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="削除"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* デザイン共有モーダル（スマホ・LINE共有向け） */}
      {isShareOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeShareModal}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#06C755]/15 text-[#05a847] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    デザインを共有
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    LINEなどへ画像や編集リンクをすぐ送れます
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeShareModal}
                className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 flex items-center justify-center text-base font-bold transition"
                aria-label="共有モーダルを閉じる"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {isPreparingShare || !shareData ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-[#06C755] animate-spin" />
                  <p className="text-xs sm:text-sm font-medium">
                    共有用の画像とリンクを準備しています...
                  </p>
                </div>
              ) : (
                <>
                  {/* 画像共有セクション */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* デザイン単体 */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          横断幕デザイン画像
                        </span>
                        <span className="text-[10px] text-slate-500">PNG</span>
                      </div>
                      {shareData.designPreviewUrl ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center h-24 overflow-hidden">
                          <img
                            src={shareData.designPreviewUrl}
                            alt="共有用横断幕デザイン"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="bg-slate-100 rounded-lg h-24 flex items-center justify-center text-xs text-slate-400">
                          プレビュー生成失敗
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleShareImageFile('design')}
                        disabled={!shareData.designFile}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        {shareData.canShareFiles ? (
                          <Share2 className="w-3.5 h-3.5" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {shareData.canShareFiles
                            ? '画像をLINE等で共有'
                            : 'デザイン画像を保存'}
                        </span>
                      </button>
                    </div>

                    {/* サイズ比較図 */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          人物サイズ比較図
                        </span>
                        <span className="text-[10px] text-slate-500">PNG</span>
                      </div>
                      {shareData.comparePreviewUrl ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center h-24 overflow-hidden">
                          <img
                            src={shareData.comparePreviewUrl}
                            alt="共有用人物サイズ比較図"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="bg-slate-100 rounded-lg h-24 flex items-center justify-center text-xs text-slate-400">
                          プレビュー生成失敗
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleShareImageFile('compare')}
                        disabled={!shareData.compareFile}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        {shareData.canShareFiles ? (
                          <Share2 className="w-3.5 h-3.5" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {shareData.canShareFiles
                            ? '比較図をLINE等で共有'
                            : '比較図画像を保存'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* LINE送信・リンクコピーセクション */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>LINEで送る / 編集リンクコピー</span>
                      </span>
                      {!shareData.isUrlTooLong && (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          デザイン復元リンク対応
                        </span>
                      )}
                    </div>

                    {(shareData.hasCustomImages || shareData.isUrlTooLong) && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 space-y-1 leading-relaxed">
                        {shareData.hasCustomImages && (
                          <p>
                            ※ アップロードした画像や背景イラストはURLに含まれないため、見た目そのものの共有は上の「画像共有」がおすすめです。
                          </p>
                        )}
                        {shareData.isUrlTooLong && (
                          <p>
                            ※ データ量が大きいためリンクはトップURLになります。画像共有ボタンから画像を送信してください。
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={`https://line.me/R/share?text=${encodeURIComponent(
                          `${shareData.shareText}\n${shareData.shareUrl}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition text-center"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>LINEで直接送る</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm border transition ${
                          shareCopied
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                        }`}
                      >
                        <Link2 className="w-4 h-4" />
                        <span>
                          {shareCopied
                            ? 'コピーしました！'
                            : 'リンク・文章をコピー'}
                        </span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      ※ スマホ（iOS / Android）では上の「画像をLINE等で共有」を押すと、端末の共有メニューからLINEトークへ画像を直接送信できます。
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 利用説明動画モーダル */}
      {isTutorialOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => setIsTutorialOpen(false)}
        >
          <div
            className="bg-slate-900 text-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 max-h-[94vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    横断幕作成ツール 使い方ガイド動画
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    日本語音声ナレーション付き・基本操作からLINE共有まで（約2分）
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTutorialOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-base font-bold transition"
                aria-label="動画モーダルを閉じる"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto space-y-3">
              <div className="bg-black rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                <video
                  ref={tutorialVideoRef}
                  src={`${import.meta.env.BASE_URL}tutorial.mp4`}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video max-h-[60vh] mx-auto"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>チャプターからジャンプ</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    音声が出ない場合はプレーヤーの音量をご確認ください
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {TUTORIAL_CHAPTERS.map((ch) => (
                    <button
                      key={ch.step}
                      type="button"
                      onClick={() => {
                        const v = tutorialVideoRef.current;
                        if (v) {
                          v.currentTime = ch.startSec;
                          v.play().catch(() => {});
                        }
                      }}
                      className="text-left px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-rose-500/60 transition flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-rose-400">{ch.step}</span>
                        <span className="text-slate-400">{ch.timeLabel}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {ch.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
