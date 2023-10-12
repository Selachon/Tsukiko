export default function (rank) {
  let ranks = {
    A: 'https://i.ibb.co/d6mHzNN/A.png',
    B: 'https://i.ibb.co/Z1fDqwN/B.png',
    C: 'https://i.ibb.co/FVSXZY0/C.png',
    D: 'https://i.ibb.co/SXD9hky/D.png',
    S: 'https://i.ibb.co/m5NLSnm/S.png',
    SH: 'https://i.ibb.co/gzTRXSS/SH.png',
    X: 'https://i.ibb.co/NnQGL5K/X.png',
    XH: 'https://i.ibb.co/hRFFsnG/XH.png',
    F: 'https://i.ibb.co/DL2yxZp/NM.png'
  }

  return ranks[rank]
}