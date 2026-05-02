
export const VERB_CONJUGATION = [
  {
    group: 'Nhóm I (Đuôi U)',
    rules: [
      { ending: '～う (u), ～つ (tsu), ～る (ru)', masu: '～います (imasu)', te: '～って (tte)', ta: '～った (tta)', nai: '～わない (wanai)' },
      { ending: '～む (mu), ～ぶ (bu), ～ぬ (nu)', masu: '～みます (mimasu)', te: '～んで (nde)', ta: '～んだ (nda)', nai: '～まない (manai)' },
      { ending: '～く (ku)', masu: '～きます (kimasu)', te: '～いて (ite)', ta: '～いた (ita)', nai: '～かない (kanai)' },
      { ending: '～ぐ (gu)', masu: '～ぎます (gimasu)', te: '～いで (ide)', ta: '～いだ (ida)', nai: '～がない (ganai)' },
      { ending: '～す (su)', masu: '～します (shimasu)', te: '～して (shite)', ta: '～した (shita)', nai: '～さない (sanai)' },
      { ending: '行く (iku) - Đặc biệt', masu: '行きます (ikimasu)', te: '行って (itte)', ta: '行った (itta)', nai: '行かない (ikanai)' },
    ]
  },
  {
    group: 'Nhóm II (Đuôi E/I + RU)',
    rules: [
      { ending: '～る (ru)', masu: '～ます (masu)', te: '～て (te)', ta: '～た (ta)', nai: '～ない (nai)' }
    ]
  },
  {
    group: 'Nhóm III (Bất quy tắc)',
    rules: [
      { ending: 'する (suru)', masu: 'します (shimasu)', te: 'して (shite)', ta: 'した (shita)', nai: 'しない (shinai)' },
      { ending: '来る (kuru)', masu: '来ます (kimasu)', te: '来て (kite)', ta: '来た (kita)', nai: '来ない (konai)' }
    ]
  }
];


export const ADJ_CONJUGATION = [
  {
    type: 'Tính từ đuôi い (I-Adj)',
    present: '～いです',
    presentNegative: '～くありません / ～くないです',
    past: '～かったです',
    pastNegative: '～くありませんでした / ～くなかったです'
  },
  {
    type: 'Tính từ đuôi な (Na-Adj) / Danh từ (N)',
    present: '～です',
    presentNegative: '～ではありません / ～じゃありません',
    past: '～でした',
    pastNegative: '～ではありませんでした / ～じゃありませんでした'
  }
];