// Exact rational arithmetic for a modern pedagogical Bernoulli recurrence.
// Historical Note G uses a different indexing convention and operation plan.
const gcd = (a,b) => b ? gcd(b,a%b) : (a<0n ? -a : a);
export function fraction(n,d=1n) {
  n=BigInt(n); d=BigInt(d);
  if (!d) throw new RangeError('Zero denominator');
  if (d<0n) {n=-n; d=-d;}
  const g=gcd(n,d); return {n:n/g,d:d/g};
}
export const format = q => q.d===1n ? String(q.n) : `${q.n}/${q.d}`;
const add=(a,b)=>fraction(a.n*b.d+b.n*a.d,a.d*b.d);
const multiply=(a,n)=>fraction(a.n*BigInt(n),a.d);
const choose=(n,k)=>{let c=1n;for(let i=1;i<=k;i++)c=c*BigInt(n-i+1)/BigInt(i);return c;};
export function bernoulli(n) {
  if (!Number.isInteger(n)||n<0||n>20) throw new RangeError('Expected integer from 0 to 20');
  const values=[fraction(1)];
  for(let m=1;m<=n;m++) {
    let sum=fraction(0);
    for(let k=0;k<m;k++)sum=add(sum,multiply(values[k],choose(m+1,k)));
    values.push(fraction(-sum.n,sum.d*BigInt(m+1)));
  }
  return values;
}
export function trace(n) {
  if (![2,4,6,8].includes(n))throw new RangeError('Unsupported exhibit target');
  const values=bernoulli(n),steps=[{kind:'start',sum:'0',equation:'S = 0'}];
  let sum=fraction(0);
  for(let k=0;k<n;k++) {
    const coefficient=choose(n+1,k),term=multiply(values[k],coefficient),previous=format(sum);
    sum=add(sum,term);
    steps.push({kind:'add',k,coefficient:String(coefficient),value:format(values[k]),term:format(term),sum:format(sum),equation:`S = (${previous}) + ${coefficient} × (${format(values[k])}) = ${format(sum)}`});
  }
  steps.push({kind:'finish',sum:format(sum),result:format(values[n]),equation:`B${String(n).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d])} = -(${format(sum)}) / ${n+1} = ${format(values[n])}`});
  return {n,known:values.slice(0,n).map(format),steps};
}
