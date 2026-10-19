// Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), để mô phỏng lặp lại được và lưu/tải đúng trạng thái.
(function () {
  const TT = window.TT = window.TT || {};
  let a = 123456789;

  function next() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const rng = {
    seed(n) { a = n | 0; },
    getState() { return a; },
    setState(n) { a = n | 0; },
    next,
    R(lo, hi) { return lo + next() * (hi - lo); },
    RI(lo, hi) { return Math.floor(lo + next() * (hi - lo + 1)); },
    P(p) { return next() < p; },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },
    wpick(list, wf) {
      wf = wf || (x => x.w);
      let total = 0;
      for (const x of list) total += wf(x);
      let r = next() * total;
      for (const x of list) { r -= wf(x); if (r <= 0) return x; }
      return list[list.length - 1];
    },
    shuffle(arr) {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const t = out[i]; out[i] = out[j]; out[j] = t;
      }
      return out;
    }
  };

  TT.rng = rng;
})();
